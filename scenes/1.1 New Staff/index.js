const { Markup, Scenes } = require('telegraf')

const FILES = require('../../files.js')

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
          ctx.scene.reenter()
        } break;
        case 'О компании': {
          await ctx.sendDocument(`${FILES["1.1.2"]}`)
          ctx.scene.reenter()
        } break;
        case 'Оплата труда': {
          await ctx.sendDocument(`${FILES["1.1.3"]}`)
          ctx.scene.reenter()
        } break;
        case 'Наши правила': {
          await ctx.sendDocument(`${FILES["1.1.4"]}`)
          ctx.scene.reenter()
        } break;
        case 'Назад': ctx.scene.enter('MAIN_SCENE'); break;
        case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )

module.exports = NewStaffScene