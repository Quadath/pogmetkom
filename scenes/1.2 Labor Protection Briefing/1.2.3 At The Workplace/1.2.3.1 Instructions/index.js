const { Markup, Scenes } = require('telegraf')

const INSTRUCTIONS = require('../../../../instructions.js')
const FILES = require('../../../../files.js')

const InstructionsScene = new Scenes.WizardScene("INSTRUCTIONS_SCENE", 
    (ctx) => {
      ctx.reply('Инструкции', Markup
        .keyboard([
          ['Механик', 'Грузчик', 'Стекольщик'], 
          ['Сборщик', 'Станочник', 'Сварщик'],
          ['В начало', 'Маляр', 'Назад']
        ])
        .oneTime()
        .resize()
      )
      return ctx.wizard.next();
    },
    async (ctx) => {
      const index = Object.keys(INSTRUCTIONS).findIndex((item) => item == ctx.message.text)
      console.log(index)
      if (index >= 0) {
        const numbers = INSTRUCTIONS[`${ctx.message.text}`];
        for (num of numbers) {
          await ctx.sendDocument(FILES[`1.2.3.1.${num}`])
        }
       ctx.scene.reenter()
      }
      else {
        switch(ctx.message.text) {
          case 'Назад': ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE'); break;
          case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
          default: ctx.scene.enter('MAIN_SCENE')
        }
      }
    }
  )

module.exports = InstructionsScene