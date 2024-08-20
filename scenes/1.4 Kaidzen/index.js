const { Markup, Scenes } = require('telegraf')
const MESSAGES = require('../../messages.js')

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

  module.exports = KaidzenScene