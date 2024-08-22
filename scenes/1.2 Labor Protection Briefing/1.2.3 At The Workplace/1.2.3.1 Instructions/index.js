const { Markup, Scenes } = require('telegraf')

const names = ['Механик', 'Грузчик', 'Стекольщик', 'Сборщик', 'Станочник', 'Сварщик', 'Маляр']

const INSTRUCTIONS_SCENE = new Scenes.WizardScene("INSTRUCTIONS_SCENE", 
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
    (ctx) => {
        console.log(names.findIndex((item) => item === ctx.message.text))
      switch(ctx.message.text) {
        case 'Механик': {

        } break;
        case 'Грузчик': {

        } break;
        case 'Стекольщик': {

        } break;
        case 'Сборщик': {

        } break;
        case 'Станочник': {

        } break;
        case 'Сварщик': {

        } break;
        case 'Маляр': {

        } break;
        case 'Назад': ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE'); break;
        case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )

module.exports = INSTRUCTIONS_SCENE