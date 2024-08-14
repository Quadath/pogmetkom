const { Telegraf, Markup, Stage, Scenes, session } = require('telegraf')

require('dotenv').config()

const bot = new Telegraf(process.env.TOKEN)
bot.launch()


const MainScene = new Scenes.WizardScene('MAIN_SCENE',
  (ctx) => {
    ctx.reply('Выберите подходящую опцию ниже.', Markup
      .keyboard([
        ['Памятка нового сотрудника'], 
        ['Инструктаж по Охране Труда'],
        ['Регламенты', 'Кайдзен'], 
        ['В начало', 'Назад',]
      ])
      .oneTime()
      .resize()
    )
    return ctx.wizard.next();
  }, 
  (ctx) => {
    switch(ctx.message.text) {
      case 'Памятка нового сотрудника': ctx.scene.enter('NEW_STAFF_SCENE')
    }
  }
)
const NewStaffScene = new Scenes.WizardScene("NEW_STAFF_SCENE", 
  (ctx) => {
    ctx.reply('Памятка нового сотрудника', Markup
      .keyboard([
        ['Контакты', 'О компании'], 
        ['Оплата труда', 'Наши правила'],
        ['В начало', 'Назад',]
      ])
      .oneTime()
      .resize()
    )
    return ctx.wizard.next();
  },
  (ctx) => {
    switch(ctx.message.text) {
      case 'Назад': ctx.scene.enter('MAIN_SCENE')
    }
  }
)

const stage = new Scenes.Stage([MainScene, NewStaffScene])

bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => ctx.scene.enter('MAIN_SCENE'))






console.log('successfully started')
