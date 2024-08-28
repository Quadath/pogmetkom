const { Markup, Scenes } = require('telegraf')
const InstructionsSchema = require('../../../../models/instruction.js')
const UserSchema = require('../../../../models/user.js')
const shuffle = require('../../../../shuffle.js')

const INSTRUCTIONS = require('../../../../instructions.js')
const { message } = require('telegraf/filters')
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
        ctx.scene.enter('EXAM_SCENE')
    }
  )

const ExamScene = new Scenes.WizardScene("EXAM_SCENE", 
    async (ctx) => {
        ctx.reply(`Сдача экзамена`, Markup
            .keyboard([
                [`Экзамен ${ctx.session.state.user.job}`],
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
            questions,
        }

        return ctx.wizard.next();
    },
    (ctx) => {
        if (!ctx.message.text) ctx.scene.reenter()
        switch(ctx.message.text) {
            case 'Сменить ФИО': return ctx.scene.enter("NAME_CHANGE_SCENE")
        }
        
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
    await UserSchema.findOneAndUpdate({telegramId: ctx.message.from.id}, {name: ctx.message.text}, {upsert: true})
    return ctx.scene.enter('EXAM_SCENE')
}
)


module.exports.NewUserExamScene = NewUserExamScene
module.exports.ExamScene = ExamScene
module.exports.NameChangeScene = NameChangeScene