const { Markup, Scenes } = require('telegraf')

const ORDERS_SCENE = new Scenes.WizardScene("ORDERS_SCENE", 
    (ctx) => {
      ctx.reply('msg', Markup
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
        } break;
        case 'Повышение разряда': {

        } break;
        case 'Назад': ctx.scene.enter('MAIN_SCENE'); break;
        case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )

module.exports = ORDERS_SCENE