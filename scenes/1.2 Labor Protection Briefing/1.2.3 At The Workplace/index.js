const { Markup, Scenes } = require('telegraf')

const Snippet = new Scenes.WizardScene("NAME", 
    (ctx) => {
      ctx.reply('msg', Markup
        .keyboard([
          ['btn'], 
          ['btn'],
          ['В начало', 'Назад']
        ])
        .oneTime()
        .resize()
      )
      return ctx.wizard.next();
    },
    (ctx) => {
      switch(ctx.message.text) {
        case '1111': {
        } break;
        case '2222': {

        } break;
        case '333': {

        } break;
        case 'Назад': ctx.scene.enter('SCENE'); break;
        case 'В начало': ctx.scene.enter('SCENE'); break;
        default: ctx.scene.enter('SCENE')
      }
    }
  )

module.exports = LaborProtectionScene