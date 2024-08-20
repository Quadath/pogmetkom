const { Markup, Scenes } = require('telegraf')

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

module.exports = EmptyScene