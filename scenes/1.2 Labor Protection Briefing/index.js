const { Markup, Scenes } = require('telegraf')

const LaborProtectionScene = new Scenes.WizardScene("LABOR_PROTECTION_SCENE", 
    (ctx) => {
      ctx.reply('На рабочем месте', Markup
        .keyboard([
          ['Обучение ОТ', 'Вводный'], 
          ['На рабочем месте'],
          ['В начало', 'Назад']
        ])
        .oneTime()
        .resize()
      )
      return ctx.wizard.next();
    },
    async (ctx) => {
      switch(ctx.message.text) {
        case 'Обучение ОТ': {
            ctx.scene.enter('LP_EDUCATION_SCENE')
        } break;
        case 'Вводный': {
            ctx.scene.enter('INTRODUCTORY_BRIEFING_SCENE')
        } break;    
        case 'На рабочем месте': {
          ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE')
        } break;
        case 'Назад': ctx.scene.enter('MAIN_SCENE'); break;
        case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )

module.exports = LaborProtectionScene