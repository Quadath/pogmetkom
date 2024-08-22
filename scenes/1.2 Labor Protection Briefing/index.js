const { Markup, Scenes } = require('telegraf')

const LPEducationScene = require('./1.2.1 LP Education/index')

const LaborProtectionScene = new Scenes.WizardScene("LABOR_PROTECTION_SCENE", 
    (ctx) => {
      ctx.reply('Инструктаж по Охране Труда', Markup
        .keyboard([
          ['Обучение ОТ'], 
          ['Вводный'],
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

        } break;
        case 'Назад': ctx.scene.enter('MAIN_SCENE'); break;
        case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )

module.exports = LaborProtectionScene