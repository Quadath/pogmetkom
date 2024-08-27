const { Markup, Scenes } = require('telegraf')
const InstructionsSchema = require('../../../../models/instruction.js')
const shuffle = require('../../../../shuffle.js')

const INSTRUCTIONS = require('../../../../instructions.js')
const letters = ["А", "Б", "В", "Г"]

let questions = [];

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

      const questions = shuffle(documents.flatMap((item) => {
        return item.questions.map((question) => {
          return {
            text: question.text,
            answers: shuffle(question.answers)
          }
        })
      }))
      ctx.session.state = {
        counter: 0,
        score: 0,
        questions
      }
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
      
      if(ctx.session.state.counter > 0 && ctx.session.state.counter < ctx.session.state.questions.length) {
        const i = letters.findIndex(item => item == ctx.message.text)
        if(ctx.session.state.questions[ctx.session.state.counter - 1].answers[i]?.correct) {
          ctx.session.state.score++
          ctx.react('👍')
        } else
        {
          ctx.react('👎')
          const index = ctx.session.state.questions[ctx.session.state.counter-1].answers.findIndex((item) => item?.correct == true)
          const answer = ctx.session.state.questions[ctx.session.state.counter-1].answers[index].text
          ctx.sendMessage(`<u><b>Неверно.</b></u> \n${letters[index]}) ${answer}`, {parse_mode: 'HTML'})
          await new Promise(r => setTimeout(r, 1500))
        }

      }
      console.log(ctx.session.state.questions.length)

      if (ctx.session.state.counter < ctx.session.state.questions.length) {
        ctx.reply(`${ctx.session.state.questions[ctx.session.state.counter].text}
          \n${ctx.session.state.questions[ctx.session.state.counter].answers.map((item, index) => `${letters[index]}) ${item.text}`).join('\n\n')}`, {
          parse_mode: 'HTML',
          ...Markup
          .keyboard([
            ['А', 'Б'],
            [`${ctx.session.state.questions[ctx.session.state.counter].answers.length >= 3 ? 'В' : ''}`, `${ctx.session.state.questions[ctx.session.state.counter].answers.length >= 4 ? 'Г' : ''}`]
          ])
        })   
      }
      if (ctx.session.state.counter >= ctx.session.state.questions.length) {
       
        console.log(`end. score:${ctx.session.state.score}`)
        ctx.reply(`Ваш результат ${parseFloat(ctx.session.state.score/ctx.session.state.questions.length * 100).toFixed(2)}%`)
        await new Promise(r => setTimeout(r, 1500))
        return ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE')
      }

      console.log({
        counter: ctx.session.state.counter,
        score: ctx.session.state.score,
        questions: ctx.session.state.questions.length
      })
      ctx.session.state.counter++
      ctx.wizard.selectStep(2)
    }
  )


module.exports = TrainingModeScene