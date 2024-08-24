const { Markup, Scenes } = require('telegraf')
const InstructionsSchema = require('../../../../models/instruction.js')

const INSTRUCTIONS = require('../../../../instructions.js')

const TrainingModeScene = new Scenes.WizardScene("TRAINING_MODE_SCENE", 
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
      switch(ctx.message.text) {
        case '1111': {
        } break;
        case '2222': {

        } break;
        case '333': {

        } break;
        case 'Назад': ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE'); break;
        case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )

module.exports = TrainingModeScene