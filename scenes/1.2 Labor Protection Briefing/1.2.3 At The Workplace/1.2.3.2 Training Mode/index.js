const { Markup, Scenes } = require('telegraf')
const InstructionsSchema = require('../../../../models/instruction.js')
const shuffle = require('../../../../shuffle.js')

const INSTRUCTIONS = require('../../../../instructions.js')
const letters = ["А", "Б", "В", "Г"]

let questions = [];
let counter = 0;
let score = 0;

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
      const documents = await InstructionsSchema.find({number: {$in: numbers}}).lean()

      questions = shuffle(documents.flatMap((item) => {
        return item.questions.map((question) => {
          return {
            text: question.text,
            answers: shuffle(question.answers)
          }
        })
      }))
      switch(ctx.message.text) {
        case 'Назад': ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE'); break;
        case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
      }
      return ctx.wizard.next();
    },
    async (ctx) => 
    {
      switch(ctx.message.text) {
        case 'Назад': return ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE'); break;
        case 'В начало': return ctx.scene.enter('MAIN_SCENE'); break;
      }
      const index = letters.findIndex(item => item == ctx.message.text)
      if(counter > 0 && counter < questions.length) {
        if(questions[counter - 1].answers[index]?.correct) {
          score++;
          ctx.react('👍')
        } else
        {
          ctx.react('👎')
          const index = questions[counter-1].answers.findIndex((item) => item?.correct == true)
          const answer = questions[counter-1].answers[index].text
          ctx.sendMessage(`<u><b>Неверно.</b></u> \n${letters[index]}) ${answer}`, {parse_mode: 'HTML'})
          await new Promise(r => setTimeout(r, 1500))
        }

      }
      if (counter < questions.length) {
        ctx.reply(`${questions[counter].text}
          \n${questions[counter].answers.map((item, index) => `${letters[index]}) ${item.text}`).join('\n\n')}`, {
          parse_mode: 'HTML',
          ...Markup
          .keyboard([
            ['А', 'Б'],
            [`${questions[counter].answers.length >= 3 ? 'В' : ''}`, `${questions[counter].answers.length >= 4 ? 'Г' : ''}`]
          ])
        })   
      }
      if (counter >= questions.length) {
        console.log(`end. score:${score}`)
        ctx.reply(`Ваш результат ${score/questions.length}%`)
        return ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE')
      }

      console.log({
        counter,
        score,
        questions: questions.length
      })
      counter++;
      ctx.wizard.selectStep(2)
    }
  )


module.exports = TrainingModeScene