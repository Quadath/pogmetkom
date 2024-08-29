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
          return ctx.scene.reenter()
        } break;
        case 'СИЗ': {
          await ctx.sendDocument(`${FILES["1.2.1.2"]}`)
          return ctx.scene.reenter()
        } break;
        case 'Назад': return ctx.scene.enter('LABOR_PROTECTION_SCENE'); break;
        case 'В начало': return ctx.scene.enter('MAIN_SCENE'); break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )

module.exports = LPEducationScene