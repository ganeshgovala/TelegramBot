const request = require("request");
const TelegramBot = require("node-telegram-bot-api");
const token = "7433204927:AAGqbFKQ2QVKifsmOo7HX2XgWKe5ZYl7M_c";
const bot = new TelegramBot(token, { polling: true });

const options = {
  reply_markup: {
    inline_keyboard : [
      [
        {text : "Tell me a Joke", callback_data : "joke"}
      ],
      [
        {text : "Generate an Dog image", callback_data : "dog"}
      ]
    ]
  }
}

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Hi ${msg.chat.first_name}👋! Choose one from the following`, options);
})

bot.on('callback_query',async (query) => {
  const chatId = query.message.chat.id;
  if(query.data == "joke") {
    generateJoke(chatId);
  } else if(query.data == "dog") {
    generateImage(chatId);
  }
  bot.answerCallbackQuery(query.id);
})

function generateJoke(chatId) {
  const apiKey = "https://official-joke-api.appspot.com/random_joke";
  request(apiKey, (err, res, body) => {
    const joke = JSON.parse(body).setup;
    const answer = JSON.parse(body).punchline;
    bot.sendMessage(chatId, joke);
    setTimeout(() => {
      bot.sendMessage(chatId, answer, options);
    }, 5000);
  })
}

function generateImage(chatId) {
  const apiKey = "https://dog.ceo/api/breeds/image/random";
  request(apiKey, async (res, err, body) => {
    const image = JSON.parse(body).message;
    await bot.sendPhoto(chatId, image, options);
  })
}
