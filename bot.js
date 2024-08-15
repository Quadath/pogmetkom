const { Telegraf, Markup, Stage, Scenes, session } = require('telegraf')
const MESSAGES = require('./messages')
const FILES = require('./files.js')

require('dotenv').config()

const bot = new Telegraf(process.env.TOKEN)
bot.launch()

bot.on((ctx) => {
  console.log(ctx.message)
})

//1
const MainScene = new Scenes.WizardScene('MAIN_SCENE',
  (ctx) => {
    ctx.reply('Выберите подходящую опцию ниже.', Markup
      .keyboard([
        ['Памятка нового сотрудника'], 
        ['Инструктаж по Охране Труда'],
        ['Регламенты', 'Кайдзен'], 
        ['Результаты']
      ])
      .oneTime()
      .resize()
    )
    return ctx.wizard.next();
  }, 
  (ctx) => {
    switch(ctx.message.text) {
      case 'Памятка нового сотрудника': ctx.scene.enter('NEW_STAFF_SCENE'); break;
      case 'Инструктаж по Охране Труда': ctx.scene.enter('EMPTY_SCENE'); break;
      case 'Регламенты': ctx.scene.enter('EMPTY_SCENE'); break;
      case 'Кайдзен': ctx.scene.enter("KAIDZEN_SCENE"); break;
      case 'Результаты': ctx.scene.enter("EMPTY_SCENE"); break;
      default: ctx.scene.enter('MAIN_SCENE')
    }
  }
)

//1.1
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
  async (ctx) => {
    switch(ctx.message.text) {
      case 'Контакты': {
        await ctx.sendDocument(`${FILES["1.1.1"]}`)
      } break;
      case 'О компании': {
        await ctx.sendDocument(`${FILES["1.1.2"]}`)
      } break;
      case 'Оплата труда': {
        await ctx.sendDocument(`${FILES["1.1.3"]}`)
      } break;
      case 'Наши правила': {
        await ctx.sendDocument(`${FILES["1.1.4"]}`)
      } break;
      case 'Назад': ctx.scene.enter('MAIN_SCENE'); break;
      case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
      default: ctx.scene.enter('MAIN_SCENE')
    }
  }
)

//1.4
const KaidzenScene = new Scenes.WizardScene("KAIDZEN_SCENE", 
  (ctx) => {
    ctx.reply(`${MESSAGES.KAIDZEN}`, {
      parse_mode: 'HTML',
      ...Markup
      .keyboard([
        ['В начало', 'Назад']
      ])
      .oneTime()
      .resize()
  })
    return ctx.wizard.next()
  },
  (ctx) => {
    switch(ctx.message.text) {
      case 'Назад': ctx.scene.enter('MAIN_SCENE'); break;
      case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
    }
  }
)

const EmptyScene = new Scenes.WizardScene("EMPTY_SCENE", 
  (ctx) => {
    ctx.reply('<b>Материал <u>отсутсвует</u>. В разработке</b>', {
      parse_mode: 'HTML',
      ...Markup
      .keyboard([
        ['В начало', 'Назад']
      ])
      .oneTime()
      .resize()}
    )
    return ctx.wizard.next()
  },
  (ctx) => {
    switch(ctx.message.text) {
      case 'Назад': ctx.scene.enter('MAIN_SCENE'); break;
      case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
    }
  }
)

const stage = new Scenes.Stage([MainScene, NewStaffScene, KaidzenScene, EmptyScene])


bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => ctx.scene.enter('MAIN_SCENE'))
console.log('successfully started')
