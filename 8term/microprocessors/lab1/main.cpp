#include "stm32f103x6.h"

extern "C" void TIM2_IRQHandler()
{
    GPIOA->ODR ^= (GPIO_ODR_ODR0 | GPIO_ODR_ODR1 | GPIO_ODR_ODR2 | GPIO_ODR_ODR3 | GPIO_ODR_ODR4);
    GPIOA->ODR ^= (GPIO_ODR_ODR5 | GPIO_ODR_ODR6 | GPIO_ODR_ODR7 | GPIO_ODR_ODR8 | GPIO_ODR_ODR9);
    TIM2->SR &= ~TIM_SR_UIF;
}

extern "C" void EXTI15_10_IRQHandler()
{
    if (EXTI->PR & EXTI_PR_PR10)
    {
        if (!(GPIOA->IDR & GPIO_IDR_IDR10))
        {
            GPIOA->ODR |= (GPIO_ODR_ODR0 | GPIO_ODR_ODR1 | GPIO_ODR_ODR2 | GPIO_ODR_ODR3 | GPIO_ODR_ODR4);
            GPIOA->ODR &= ~(GPIO_ODR_ODR5 | GPIO_ODR_ODR6 | GPIO_ODR_ODR7 | GPIO_ODR_ODR8 | GPIO_ODR_ODR9);
        }
        else
        {
            GPIOA->ODR |= (GPIO_ODR_ODR5 | GPIO_ODR_ODR6 | GPIO_ODR_ODR7 | GPIO_ODR_ODR8 | GPIO_ODR_ODR9);
            GPIOA->ODR &= ~(GPIO_ODR_ODR0 | GPIO_ODR_ODR1 | GPIO_ODR_ODR2 | GPIO_ODR_ODR3 | GPIO_ODR_ODR4);
        }
        EXTI->PR |= EXTI_PR_PR10; // Clear pending interrupt flag
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

    // Set PLL as system clock
    RCC->CFGR |= RCC_CFGR_SW_PLL;
    while (!(RCC->CFGR & RCC_CFGR_SWS_PLL))
        ;

    RCC->CFGR &= ~(RCC_CFGR_HPRE | RCC_CFGR_PPRE1 | RCC_CFGR_PPRE2);
    RCC->CFGR |= RCC_CFGR_HPRE_DIV4 | RCC_CFGR_PPRE1_DIV2; // AHB/4  APB1/2  APB2/1 (default)

    FLASH->ACR &= ~FLASH_ACR_LATENCY;
    FLASH->ACR |= FLASH_ACR_LATENCY_0; // 0 wait state for <24 MHz
}

void setup_gpio()
{
    // Enable GPIOA clock
    RCC->APB2ENR |= RCC_APB2ENR_IOPAEN;

    GPIOA->CRL &= ~(GPIO_CRL_CNF0 | GPIO_CRL_CNF1 | GPIO_CRL_CNF2 | GPIO_CRL_CNF3 |
                    GPIO_CRL_CNF4 | GPIO_CRL_CNF5 | GPIO_CRL_CNF6 | GPIO_CRL_CNF7);
    GPIOA->CRL |= (GPIO_CRL_MODE0_0 | GPIO_CRL_MODE1_0 | GPIO_CRL_MODE2_0 | GPIO_CRL_MODE3_0 |
                   GPIO_CRL_MODE4_0 | GPIO_CRL_MODE5_0 | GPIO_CRL_MODE6_0 | GPIO_CRL_MODE7_0);

    GPIOA->CRH &= ~(GPIO_CRH_CNF8 | GPIO_CRH_CNF9);
    GPIOA->CRH |= (GPIO_CRH_MODE8_0 | GPIO_CRH_MODE9_0);

    GPIOA->CRH &= ~(GPIO_CRH_CNF10 | GPIO_CRH_CNF11);
    GPIOA->CRH |= (GPIO_CRH_CNF10_1 | GPIO_CRH_CNF11_1); // Set CNF[1] = 1 (Input Pull-Up/Pull-Down)
    GPIOA->ODR |= (GPIO_ODR_ODR10 | GPIO_ODR_ODR11);     // Enable Pull-Up Resistors
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

void setup_exti()
{
    RCC->APB2ENR |= RCC_APB2ENR_AFIOEN;
    AFIO->EXTICR[2] |= AFIO_EXTICR3_EXTI10_PA;
    EXTI->IMR |= EXTI_IMR_IM10;
    EXTI->FTSR |= EXTI_FTSR_FT10;
    EXTI->RTSR |= EXTI_RTSR_RT10;
    NVIC_EnableIRQ(EXTI15_10_IRQn);
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
    TIM1->CCER |= (TIM_CCER_CC1E | TIM_CCER_CC1NE);
    TIM1->CR1 |= TIM_CR1_CEN;
}

int main(void)
{
    setup_rcc();
    setup_gpio();
    setup_tim2();
    setup_exti();
    setup_pwm();

    while (1)
        ;

    return 0;
}

