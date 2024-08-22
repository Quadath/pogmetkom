const { Markup, Scenes } = require('telegraf')

const FILES = require('../../files.js')

const ORDERS_SCENE = new Scenes.WizardScene("ORDERS_SCENE", 
    (ctx) => {
      ctx.reply('Регламенты', Markup
        .keyboard([
          ['Адаптация'], 
          ['Повышение разряда'],
          ['В начало', 'Назад']
        ])
        .oneTime()
        .resize()
      )
      return ctx.wizard.next();
    },
    (ctx) => {
      switch(ctx.message.text) {
        case 'Адаптация': {
            ctx.sendDocument(`${FILES['1.3.1']}`)
        } break;
        case 'Повышение разряда': {
            ctx.sendDocument(`${FILES['1.3.2']}`)
        } break;
        case 'Назад': ctx.scene.enter('MAIN_SCENE'); break;
        case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )

module.exports = ORDERS_SCENE