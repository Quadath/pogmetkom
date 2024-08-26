const { Markup, Scenes } = require('telegraf')
const InstructionsSchema = require('../../../../models/instruction.js')
const shuffle = require('../../../../shuffle.js')

const INSTRUCTIONS = require('../../../../instructions.js')
const TestingScenes = []

let questions = [];
let counter = 0;
const TrainingModeScene = new Scenes.WizardScene("TRAINING_MODE_SCENE", 
    (ctx) => {
        ctx.reply('Режим обучения', Markup
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
      const numbers = INSTRUCTIONS[`${ctx.message.text}`]
      ctx.reply(`Тест на должность ${ctx.message.text}`, Markup
        .keyboard([
          ['Начать тестирование'],
          ['В начало', 'Назад']
        ])
        .oneTime()
        .resize()
      )
      const documents = await InstructionsSchema.find({number: {$in: numbers}})
      questions = shuffle(documents.flatMap((item) => {
        return shuffle(
          shuffle(item.questions.answers)
        )
      }))
      console.log(questions)
      if (numbers == undefined) {
        switch(ctx.message.text) {
          case 'Назад': ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE'); break;
          case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
          default: ctx.scene.enter('MAIN_SCENE')
        }
      }
      return ctx.wizard.next();
    },
    (ctx) => 
    {
      ctx.reply(questions[counter].text, Markup
        .keyboard([
          ['А', 'Б'],
          ['В', '']
        ])
        .oneTime()
        .resize()
      )
      ctx.wizard.next()
      // ctx.wizard.steps[2](ctx)
    },
    (ctx) => {

      counter++;
      ctx.wizard.steps[2](ctx)
    }
  )

async function SceneGen(numbers) {

  const documents = await InstructionsSchema.find({number: {$in: numbers}})
  const questions = documents.flatMap((item) => {
    return item.questions
  })

  const scenes = questions.map((item) => {
    return (ctx) => {
      console.log('hi')
      ctx.reply(item.text)
      return ctx.wizard.next();
    }
  })
  console.log(scenes[0])
  return scenes
}

module.exports = TrainingModeScene