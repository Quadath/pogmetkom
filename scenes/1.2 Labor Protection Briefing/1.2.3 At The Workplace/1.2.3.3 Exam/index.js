const { Markup, Scenes } = require('telegraf')
const InstructionsSchema = require('../../../../models/instruction.js')
const UserSchema = require('../../../../models/user.js')
const ExamSchema = require('../../../../models/exam.js')
const shuffle = require('../../../../shuffle.js')

const INSTRUCTIONS = require('../../../../instructions.js')
const letters = ["А", "Б", "В", "Г"]

const NewUserExamScene = new Scenes.WizardScene("NEW_USER_EXAM_SCENE", 
    (ctx) => {
        ctx.reply('Введите, пожалуйста, своё ФИО.')
        return ctx.wizard.next();
    },
    async (ctx) => {
      if (!ctx.message.text) ctx.scene.reenter()
        ctx.session.state.user.name = ctx.message.text
        await UserSchema.findOneAndUpdate({telegramId: ctx.message.from.id}, {name: ctx.message.text}, {upsert: true})

        ctx.reply('Сдача экзамена', Markup
            .keyboard([
              ['Механик', 'Грузчик', 'Стекольщик'], 
              ['Сборщик', 'Станочник', 'Сварщик'],
              ['В начало', 'Маляр', 'Назад']
            ])
            .oneTime()
            .resize()
          )

        ctx.wizard.next()
    }, 
    async (ctx) => {
        const i = Object.keys(INSTRUCTIONS).findIndex((item) => item == ctx.message.text)
        if (i < 0) return ctx.wizard.selectStep(1)
        await UserSchema.findOneAndUpdate({telegramId: ctx.message.from.id}, {job: Object.keys(INSTRUCTIONS)[i]})
        ctx.session.state.user.job = Object.keys(INSTRUCTIONS)[i]
        ctx.scene.enter('EXAM_SCENE')
    }
  )

const ExamScene = new Scenes.WizardScene("EXAM_SCENE", 
    async (ctx) => {
        ctx.reply(`Сдача экзамена`, Markup
            .keyboard([
                [`Экзамен ${ctx.session.state.user.job}\n(${ctx.session.state.user.name})`],
                ['Сменить ФИО', 'Сменить должность'],
                ['В начало', 'Назад']
            ])
        )
        const numbers = INSTRUCTIONS[`${ctx.session.state.user.job}`]
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
            timer: new Date().getTime(),
            questions,
        }

        return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.message.text) ctx.scene.reenter()
        switch(ctx.message.text) {
            case 'Сменить ФИО': return ctx.scene.enter("NAME_CHANGE_SCENE"); break;
            case 'Сменить должность': return ctx.scene.enter("JOB_CHANGE_SCENE"); break;
            case 'Назад': return ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE'); break;
            case 'В начало': return ctx.scene.enter('MAIN_SCENE'); break;
        }

        if(ctx.session.state.counter > 0 && ctx.session.state.counter < ctx.session.state.questions.length) {
            const i = letters.findIndex(item => item == ctx.message.text)
            if(ctx.session.state.questions[ctx.session.state.counter - 1].answers[i]?.correct) {
              ctx.session.state.score++
            } 
          }
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
            const result = parseFloat(ctx.session.state.score/ctx.session.state.questions.length * 100)
            const exam = new ExamSchema({
                job: ctx.session.state.user.job,
                result,
                time: ((new Date().getTime() - ctx.session.state.timer) / 1000)
            })
            await exam.save()
            let message = ``
            if (result > 90) {
                message = `Экзамен сдан. Результат: ${result}%\nДолжность: ${ctx.session.state.user.job}\nРаботник: ${ctx.session.state.user.name}\nДата: ${new Date().toISOString().slice(0, 10).split('-').join('.')}`
                await UserSchema.findOneAndUpdate({telegramId: ctx.message.from.id}, {$push: {exams: exam._id}})
                ctx.reply(message)
            } else {
                ctx.reply('Экзамен не сдан.')
            }

            await new Promise(r => setTimeout(r, 1500))
            return ctx.scene.enter('BRIEFING_AT_THE_WORKPLACE_SCENE')
          }
    
          ctx.session.state.counter++
          ctx.wizard.selectStep(1)
    }
)

const NameChangeScene = new Scenes.WizardScene("NAME_CHANGE_SCENE", 
    (ctx) => {
      ctx.reply('Напишите новое ФИО')
      return ctx.wizard.next();
    },
    async (ctx) => {
        if (!ctx.message.text) ctx.scene.reenter()
        await UserSchema.findOneAndUpdate({telegramId: ctx.message.from.id}, {name: ctx.message.text}, {upsert: true})
        ctx.session.state.user.name = ctx.message.text
        return ctx.scene.enter('EXAM_SCENE')
    }
  )

const JobChangeScene = new Scenes.WizardScene("JOB_CHANGE_SCENE", 
(ctx) => {
    ctx.reply('Выберите должность', Markup
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
    if (!ctx.message.text) ctx.scene.reenter()
    const i = Object.keys(INSTRUCTIONS).findIndex((item) => item == ctx.message.text)
    if (i < 0) return ctx.scene.reenter()
    await UserSchema.findOneAndUpdate({telegramId: ctx.message.from.id}, {job: ctx.message.text}, {upsert: true})
    ctx.session.state.user.job = ctx.message.text
    return ctx.scene.enter('EXAM_SCENE')
}
)


module.exports.NewUserExamScene = NewUserExamScene
module.exports.ExamScene = ExamScene
module.exports.NameChangeScene = NameChangeScene
module.exports.JobChangeScene = JobChangeScene