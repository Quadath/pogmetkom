const { Markup, Scenes } = require('telegraf')
const FILES = require('../../../../files.js')

const names = ['Механик', 'Грузчик', 'Стекольщик', 'Сборщик', 'Станочник', 'Сварщик', 'Маляр']

const JobInstructionsScene = new Scenes.WizardScene("JOB_INSTRUCTIONS_SCENE", 
    (ctx) => {
      ctx.reply('Должностные инструкции', Markup
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
    (ctx) => {
      const index = names.findIndex((item) => item == ctx.message.text)
      if (index >= 0) {
        ctx.sendDocument(`${FILES[`1.2.3.${index + 1}`]}`)
        ctx.reply('Должностные инструкции', Markup
          .keyboard([
            ['Механик', 'Грузчик', 'Стекольщик'], 
            ['Сборщик', 'Станочник', 'Сварщик'], 
            ['В начало', 'Маляр', 'Назад']
          ])
          .oneTime()
          .resize()
        )
      }
      else {
        switch(ctx.message.text) {
          case 'Назад': ctx.scene.enter('INTRODUCTORY_BRIEFING_SCENE'); break;
          case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
          default: ctx.scene.enter('MAIN_SCENE')
        }
      }
    }
  )

module.exports = JobInstructionsScene