const { Markup, Scenes } = require('telegraf')

const FILES = require('../../../files.js')

const IntroductoryBriefingScene = new Scenes.WizardScene("INTRODUCTORY_BRIEFING_SCENE", 
    (ctx) => {
      ctx.reply('Вводный', Markup
        .keyboard([
          ['Общие вопросы ОТ', 'ДИ'], 
          ['Видео', 'ПВТР'],
          ['В начало', 'Назад']
        ])
        .oneTime()
        .resize()
      )
      return ctx.wizard.next();
    },
    (ctx) => {
      switch(ctx.message.text) {
        case 'Общие вопросы ОТ': {
          ctx.sendDocument(`${FILES['1.2.2.1']}`)
          ctx.scene.reenter()
        } break;
        case 'ДИ': {
          ctx.scene.enter('JOB_INSTRUCTIONS_SCENE')
        } break;
        case 'Видео': {
          ctx.sendVideo(`${FILES['1.2.2.3']}`)
          ctx.scene.reenter()
        } break;
        case 'ПВТР': {
          ctx.sendDocument(`${FILES["1.2.2.4"]}`)
          ctx.scene.reenter()
        } break;
        case 'Назад': ctx.scene.enter('LABOR_PROTECTION_SCENE'); break;
        case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )

module.exports = IntroductoryBriefingScene