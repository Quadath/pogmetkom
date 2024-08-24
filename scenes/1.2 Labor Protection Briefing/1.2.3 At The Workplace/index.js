const { Markup, Scenes } = require('telegraf')

const BriefingAtTheWorkplaceScene = new Scenes.WizardScene("BRIEFING_AT_THE_WORKPLACE_SCENE", 
    (ctx) => {
      ctx.reply('На рабочем месте', Markup
        .keyboard([
          ['Инструкции'], 
          ['Режим обучения', 'Сдача экзамена'],
          ['В начало', 'Назад']
        ])
        .oneTime()
        .resize()
      )
      return ctx.wizard.next();
    },
    (ctx) => {
      switch(ctx.message.text) {
        case 'Инструкции': {
          ctx.scene.enter('INSTRUCTIONS_SCENE')
        } break;
        case 'Режим обучения': {
          ctx.scene.enter('TRAINING_MODE_SCENE')
        } break;
        case 'Сдача экзамена': {
          ctx.scene.enter('EMPTY_SCENE')
        } break;
        case 'Назад': ctx.scene.enter('LABOR_PROTECTION_SCENE'); break;
        case 'В начало': ctx.scene.enter('SCENE'); break;
        default: ctx.scene.enter('SCENE')
      }
    }
  )

module.exports = BriefingAtTheWorkplaceScene