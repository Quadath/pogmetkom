const { Telegraf, Markup } = require('telegraf')

require('dotenv').config()

const bot = new Telegraf(process.env.TOKEN)

bot.launch()

bot.start((ctx) => 
    {
        ctx.state.one = 'onee'
        console.log(ctx.state)
    ctx.reply('this is text', Markup
        .keyboard([
          ['Памятка нового сотрудника'], 
          ['Инструктаж по Охране Труда'],
          ['Регламенты', 'Кайдзен'], 
          ['В начало', 'Назад',]
        ])
        .oneTime()
        .resize()
      )
    }
)


bot.hears('Памятка нового сотрудника', (ctx) => {
    console.log(ctx.state)
    ctx.reply('this is text', Markup
        .keyboard([
          ['Контакты', 'О компании'], 
          ['Оплата труда', 'Наши правила'],
          ['В начало', 'Назад',]
        ])
        .oneTime()
        .resize()
      )
})



console.log('successfully started')
