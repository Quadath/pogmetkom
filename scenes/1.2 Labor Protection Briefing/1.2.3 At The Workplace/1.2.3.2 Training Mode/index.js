const { Markup, Scenes } = require('telegraf')
const InstructionsSchema = require('../../../../models/instruction.js')
const shuffle = require('../../../../shuffle.js')
const {errorHandler, asyncErrorHandler} = require('../../../../errorhandler.js')

const INSTRUCTIONS = require('../../../../instructions.js')
const letters = ["А", "Б", "В", "Г"]

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
      switch(ctx.message.text) {
        case 'Назад': return ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE');
        case 'В начало': return ctx.scene.enter('MAIN_SCENE');
      }
      const i = Object.keys(INSTRUCTIONS).findIndex((item) => item == ctx.message.text)
      if (i < 0) return ctx.scene.reenter()
      const numbers = INSTRUCTIONS[`${ctx.message.text}`]
      
      await asyncErrorHandler(async () => {
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
          ...ctx.session.state,
          counter: 0,
          score: 0,
          questions,
        }
        ctx.reply(`Тест на должность ${ctx.message.text}`, Markup
          .keyboard([
            ['Начать тестирование'],
            ['В начало', 'Назад']
          ])
          .oneTime()
          .resize()
        )
      }, ctx)
      
      return ctx.wizard.next();
    },

    async (ctx) => 
    {
      const {counter, score, questions, timer, user} = ctx.session.state;
      switch(ctx.message.text) {
        case 'Назад': return ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE'); 
        case 'В начало': return ctx.scene.enter('MAIN_SCENE');
        case 'Выйти': return ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE');
      }
      await asyncErrorHandler(async () => {
        if(counter > 0 && counter < questions.length) {
          const i = letters.findIndex(item => item == ctx.message.text)
          if(questions[counter - 1].answers[i]?.correct) {
            ctx.session.state.score++
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
              [`${questions[counter].answers.length >= 3 ? 'В' : ''}`, `${questions[counter].answers.length >= 4 ? 'Г' : ''}`],
              ['Выйти']
            ])
          })   
        }
        if (ctx.session.state.counter >= ctx.session.state.questions.length) {
          const i = letters.findIndex(item => item == ctx.message.text)
          if(questions[counter - 1].answers[i]?.correct) {
            ctx.session.state.score++
            ctx.react('👍')
          }
          ctx.reply(`Ваш результат ${parseFloat(score/questions.length * 100).toFixed(2)}%`)
          await new Promise(r => setTimeout(r, 1500))
          return ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE')
        }
      }, ctx)

      ctx.session.state.counter++
      ctx.wizard.selectStep(2)
    }
  )


module.exports = TrainingModeScene