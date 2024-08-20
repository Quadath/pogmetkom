const { Markup, Scenes } = require('telegraf')

const FILES = require('../../../files.js')

const LPEducationScene = new Scenes.WizardScene("LP_EDUCATION_SCENE", 
    (ctx) => {
      ctx.reply('Обучение ОТ', Markup
        .keyboard([
          ['Вредные факторы'], 
          ['СИЗ'],
          ['В начало', 'Назад']
        ])
        .oneTime()
        .resize()
      )
      return ctx.wizard.next();
    },
    async (ctx) => {
      switch(ctx.message.text) {
        case 'Вредные факторы': {
          await ctx.sendDocument(`${FILES["1.2.1.1"]}`)
        } break;
        case 'СИЗ': {
          ctx.scene.enter('EMPTY_SCENE')
        } break;
        case 'Назад': ctx.scene.enter('LABOR_PROTECTION_SCENE'); break;
        case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )

module.exports = LPEducationScene