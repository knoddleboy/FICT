#include "stm32f103x6.h"
#include <string>

#define PCLK1 5500000  // 5.5 MHz
#define PCLK2 11000000 // 11 MHz
#define BAUD_RATE 9600

volatile uint32_t adc_val = 0;

std::string usart2_cmd;
volatile bool usart2_cmd_ready = false;
volatile bool led_enabled = false;

void usart_send_msg(USART_TypeDef *usart, std::string msg)
{
    for (char c : msg)
    {
        while (!(usart->SR & USART_SR_TC))
            ;
        usart->DR = c;
    }
}

void setup_rcc()
{
    RCC->CR |= RCC_CR_HSION;
    while (!(RCC->CR & RCC_CR_HSIRDY))
        ;

    // Set PLL multiplier to 11 (4 MHz * 11 = 44 MHz)
    RCC->CFGR &= ~(RCC_CFGR_PLLSRC | RCC_CFGR_PLLMULL);
    RCC->CFGR |= RCC_CFGR_PLLMULL11;

    RCC->CR |= RCC_CR_PLLON;
    while (!(RCC->CR & RCC_CR_PLLRDY))
        ;

    RCC->CFGR |= RCC_CFGR_SW_PLL;
    while (!(RCC->CFGR & RCC_CFGR_SWS_PLL))
        ;

    RCC->CFGR &= ~(RCC_CFGR_HPRE | RCC_CFGR_PPRE1 | RCC_CFGR_PPRE2);
    RCC->CFGR |= RCC_CFGR_HPRE_DIV4 | RCC_CFGR_PPRE1_DIV2; // AHB/4  APB1/2  APB2/1 (default)

    FLASH->ACR &= ~FLASH_ACR_LATENCY;
    FLASH->ACR |= FLASH_ACR_LATENCY_0; // 0 wait state for <24 MHz
}

extern "C" void ADC1_2_IRQHandler()
{
    if (ADC1->SR & ADC_SR_EOS)
    {
        adc_val = ADC1->DR;
        ADC1->SR &= ~ADC_SR_EOS;
    }
}

void setup_adc()
{
    RCC->APB2ENR |= RCC_APB2ENR_IOPAEN | RCC_APB2ENR_ADC1EN;
    GPIOA->CRL &= ~(GPIO_CRL_CNF0 | GPIO_CRL_MODE0);

    ADC1->SQR3 = 0; // channel 0, maps to PA0

    // Configure sampling time (max, 239.5 cycles)
    ADC1->SMPR2 &= ~ADC_SMPR2_SMP0_Msk;
    ADC1->SMPR2 |= 0b111 << ADC_SMPR2_SMP0_Pos;

    ADC1->SR &= ~ADC_SR_EOS;

    ADC1->CR1 |= ADC_CR1_EOSIE;

    ADC1->CR2 |= ADC_CR2_ADON; // power on ADC
    ADC1->CR2 |= ADC_CR2_CONT; // continuous mode (loop)
    ADC1->CR2 |= ADC_CR2_ADON; // start conversion

    NVIC_EnableIRQ(ADC1_2_IRQn);
}

void setup_usart1()
{
    RCC->APB2ENR |= RCC_APB2ENR_USART1EN;

    // Configure PA9 (TX) as alt func push-pull
    GPIOA->CRH &= ~(GPIO_CRH_MODE9 | GPIO_CRH_CNF9);
    GPIOA->CRH |= GPIO_CRH_MODE9_1 | GPIO_CRH_MODE9_0;
    GPIOA->CRH |= GPIO_CRH_CNF9_1;

    USART1->BRR = PCLK2 / BAUD_RATE;
    USART1->CR1 |= USART_CR1_UE | USART_CR1_TE;
}

extern "C" void USART2_IRQHandler()
{
    char c = USART2->DR;

    if (c == '\r' || c == '\n')
        usart2_cmd_ready = !usart2_cmd.empty();
    else
        usart2_cmd.push_back(c);

    USART2->SR &= ~USART_SR_RXNE;
}

void setup_usart2()
{
    RCC->APB1ENR |= RCC_APB1ENR_USART2EN;

    // Configure PA2 (TX) as alt func push-pull
    GPIOA->CRL &= ~(GPIO_CRL_MODE2 | GPIO_CRL_CNF2);
    GPIOA->CRL |= GPIO_CRL_MODE2_1 | GPIO_CRL_MODE2_0;
    GPIOA->CRL |= GPIO_CRL_CNF2_1;

    // Configure PA3 (RX) as input floating
    GPIOA->CRL &= ~(GPIO_CRL_MODE3 | GPIO_CRL_CNF3);
    GPIOA->CRL |= GPIO_CRL_CNF3_0;

    USART2->BRR = PCLK1 / BAUD_RATE;
    USART2->CR1 |= USART_CR1_UE | USART_CR1_TE | USART_CR1_RE | USART_CR1_RXNEIE;
    NVIC_EnableIRQ(USART2_IRQn);
}

void setup_led()
{
    GPIOA->CRH &= ~(GPIO_CRH_MODE12 | GPIO_CRH_CNF12);
    GPIOA->CRH |= GPIO_CRH_MODE12_0;
    GPIOA->BSRR = GPIO_BSRR_BR12;
}

extern "C" void TIM2_IRQHandler()
{
    if (led_enabled)
        GPIOA->ODR ^= GPIO_ODR_ODR12;
    TIM2->SR &= ~TIM_SR_UIF;
}

void setup_tim2()
{
    RCC->APB1ENR |= RCC_APB1ENR_TIM2EN;
    TIM2->PSC = 11000 - 1;
    TIM2->ARR = 909 - 1; // 1000/1.1
    TIM2->DIER |= TIM_DIER_UIE;
    NVIC_EnableIRQ(TIM2_IRQn);
    TIM2->CR1 |= TIM_CR1_CEN;
}

void setup_pwm()
{
    GPIOA->CRL = (GPIOA->CRL & ~(GPIO_CRL_MODE7 | GPIO_CRL_CNF7)) | (GPIO_CRL_MODE7_0 | GPIO_CRL_CNF7_1);
    GPIOA->CRH = (GPIOA->CRH & ~(GPIO_CRH_MODE8 | GPIO_CRH_CNF8)) | (GPIO_CRH_MODE8_0 | GPIO_CRH_CNF8_1);

    AFIO->MAPR |= AFIO_MAPR_TIM1_REMAP_PARTIALREMAP;

    RCC->APB2ENR |= RCC_APB2ENR_TIM1EN;
    TIM1->PSC = 11000 - 1;
    TIM1->ARR = 1000 - 1;
    TIM1->CCMR1 |= (TIM_CCMR1_OC1M_1 | TIM_CCMR1_OC1M_2);
    TIM1->CCR1 = 500;
    TIM1->BDTR |= TIM_BDTR_MOE;
    TIM1->CCER |= (TIM_CCER_CC1E | TIM_CCER_CC1NE | TIM_CCER_CC1NP);
    TIM1->CR1 |= TIM_CR1_CEN;
}

void handle_usart2_cmd()
{
    if (usart2_cmd == "led on")
    {
        GPIOA->BSRR = GPIO_BSRR_BS12;
        led_enabled = true;
        usart_send_msg(USART2, "LED enabled\r\n");
        return;
    }

    if (usart2_cmd == "led off")
    {
        GPIOA->BSRR = GPIO_BSRR_BR12;
        led_enabled = false;
        usart_send_msg(USART2, "LED disabled\r\n");
        return;
    }

    if (usart2_cmd.substr(0, 6) == "timer ")
    {
        uint32_t period_s = std::stoi(usart2_cmd.substr(6));

        TIM2->CR1 &= ~TIM_CR1_CEN;
        TIM2->ARR = period_s * 1000 - 1;
        TIM2->CR1 |= TIM_CR1_CEN;

        usart_send_msg(USART2, "Timer period set to " + std::to_string(period_s) + " s\r\n");
        return;
    }

    if (usart2_cmd.substr(0, 4) == "pwm ")
    {
        uint32_t duty_perc = std::stoi(usart2_cmd.substr(4));
        if (duty_perc > 100)
            duty_perc = 100;

        TIM1->CCR1 = (TIM1->ARR + 1) * duty_perc / 100;

        usart_send_msg(USART2, "PWM duty set to " + std::to_string(duty_perc) + " %\r\n");
        return;
    }

    usart_send_msg(USART2, "Error: Unknown command: " + usart2_cmd + "\r\n");
}

int main(void)
{
    setup_rcc();
    setup_adc();
    setup_usart1();
    setup_usart2();
    setup_led();
    setup_tim2();
    setup_pwm();

    while (1)
    {
        for (volatile size_t i = 0; i < 800000; i++)
            ;

        usart_send_msg(USART1, "ADC = " + std::to_string(adc_val) + "\r\n");

        if (usart2_cmd_ready)
        {
            handle_usart2_cmd();
            usart2_cmd.clear();
            usart2_cmd_ready = false;
        }
    }

    return 0;
}
