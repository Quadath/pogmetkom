const { Telegraf } = require('telegraf')

require('dotenv').config()

const bot = new Telegraf(process.env.TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))

bot.launch()

bot.command("inline", (ctx) => {
    ctx.reply("Hi there!", {
        reply_markup: {
            inline_keyboard: [
                /* Inline buttons. 2 side-by-side */
                [ { text: "Button 1", callback_data: "btn-1" }, { text: "Button 2", callback_data: "btn-2" } ],

                /* One button */
                [ { text: "Next", callback_data: "next" } ],
                
                /* Also, we can have URL buttons. */
                [ { text: "Open in browser", url: "telegraf.js.org" } ]
            ]
        }
    });
});