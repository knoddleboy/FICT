import logging

from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.constants import ParseMode
from telegram.ext import (
    Application,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
    ConversationHandler,
    MessageHandler,
    filters,
)
from constants import (
    BUTTON_TEXT_STUDENT,
    BUTTON_TEXT_TECH,
    BUTTON_TEXT_CONTACTS,
    BUTTON_TEXT_CHATGPT,
    BUTTON_TEXT_DONE,
    BUTTON_TEXT_BACK,
    REPLY_TEXT_START,
    REPLY_TEXT_START_OVER,
    REPLY_TEXT_END,
    REPLY_TEXT_PROMPT,
    REPLY_TEXT_PROMPT_PROCESSING,
)
from config import BOT_TOKEN, HF_API_KEY
from hf_client import HuggingFaceClient

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logging.getLogger("httpx").setLevel(logging.WARNING)

logger = logging.getLogger(__name__)

hf_client = HuggingFaceClient(api_key=HF_API_KEY)

START_ROUTES, PROMPT_CHATGPT_WAITING, END_ROUTES = range(3)
SHOW_STUDENT, SHOW_TECH, SHOW_CONTACTS, PROMPT_CHATGPT, BACK, DONE = range(6)


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    keyboard = [
        [
            InlineKeyboardButton(BUTTON_TEXT_STUDENT, callback_data=str(SHOW_STUDENT)),
            InlineKeyboardButton(BUTTON_TEXT_TECH, callback_data=str(SHOW_TECH)),
        ],
        [
            InlineKeyboardButton(BUTTON_TEXT_CONTACTS, callback_data=str(SHOW_CONTACTS)),
            InlineKeyboardButton(BUTTON_TEXT_CHATGPT, callback_data=str(PROMPT_CHATGPT)),
        ],
        [
            InlineKeyboardButton(BUTTON_TEXT_DONE, callback_data=str(DONE)),
        ],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(REPLY_TEXT_START, reply_markup=reply_markup)
    return START_ROUTES


async def start_over(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()

    keyboard = [
        [
            InlineKeyboardButton(BUTTON_TEXT_STUDENT, callback_data=str(SHOW_STUDENT)),
            InlineKeyboardButton(BUTTON_TEXT_TECH, callback_data=str(SHOW_TECH)),
        ],
        [
            InlineKeyboardButton(BUTTON_TEXT_CONTACTS, callback_data=str(SHOW_CONTACTS)),
            InlineKeyboardButton(BUTTON_TEXT_CHATGPT, callback_data=str(PROMPT_CHATGPT)),
        ],
        [
            InlineKeyboardButton(BUTTON_TEXT_DONE, callback_data=str(DONE)),
        ],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await query.edit_message_text(REPLY_TEXT_START_OVER, reply_markup=reply_markup)
    return START_ROUTES


async def show_info(update: Update, context: ContextTypes.DEFAULT_TYPE, text: str) -> int:
    query = update.callback_query
    await query.answer()

    keyboard = [
        [InlineKeyboardButton(BUTTON_TEXT_BACK, callback_data=str(BACK))],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await query.edit_message_text(
        text=text, parse_mode=ParseMode.MARKDOWN, reply_markup=reply_markup
    )
    return END_ROUTES


async def show_student(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    return await show_info(update, context, "*ПІБ:* Книш Дмитро Олегович\n*Група:* ІП-11")


async def show_tech(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    return await show_info(
        update, context, "*Технологічний стек:*\n• Frontend\n• Backend\n• WEB-технології"
    )


async def show_contacts(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    return await show_info(
        update, context, "*Контакти*\n*Tелефон:* 050-555-55-55\n*E-mail:* knyshstudy@gmail.com"
    )


async def prompt_chatgpt(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(text=REPLY_TEXT_PROMPT)

    return PROMPT_CHATGPT_WAITING


async def handle_chatgpt_response(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    prompt = update.message.text

    processing_message = await update.message.reply_text(text=REPLY_TEXT_PROMPT_PROCESSING)

    response = hf_client.get_response_text(prompt)

    await context.bot.edit_message_text(
        text=response, chat_id=processing_message.chat_id, message_id=processing_message.message_id
    )

    keyboard = [
        [
            InlineKeyboardButton(BUTTON_TEXT_STUDENT, callback_data=str(SHOW_STUDENT)),
            InlineKeyboardButton(BUTTON_TEXT_TECH, callback_data=str(SHOW_TECH)),
        ],
        [
            InlineKeyboardButton(BUTTON_TEXT_CONTACTS, callback_data=str(SHOW_CONTACTS)),
            InlineKeyboardButton(BUTTON_TEXT_CHATGPT, callback_data=str(PROMPT_CHATGPT)),
        ],
        [
            InlineKeyboardButton(BUTTON_TEXT_DONE, callback_data=str(DONE)),
        ],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(REPLY_TEXT_START_OVER, reply_markup=reply_markup)

    return START_ROUTES


async def end(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    await query.edit_message_text(text=REPLY_TEXT_END)
    return ConversationHandler.END


def main() -> None:
    application = Application.builder().token(BOT_TOKEN).build()

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            START_ROUTES: [
                CallbackQueryHandler(show_student, pattern="^" + str(SHOW_STUDENT) + "$"),
                CallbackQueryHandler(show_tech, pattern="^" + str(SHOW_TECH) + "$"),
                CallbackQueryHandler(show_contacts, pattern="^" + str(SHOW_CONTACTS) + "$"),
                CallbackQueryHandler(prompt_chatgpt, pattern="^" + str(PROMPT_CHATGPT) + "$"),
                CallbackQueryHandler(end, pattern="^" + str(DONE) + "$"),
            ],
            PROMPT_CHATGPT_WAITING: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_chatgpt_response)
            ],
            END_ROUTES: [
                CallbackQueryHandler(start_over, pattern="^" + str(BACK) + "$"),
            ],
        },
        fallbacks=[CommandHandler("start", start)],
    )

    application.add_handler(conv_handler)
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
