const { Markup, Scenes } = require('telegraf')
const UserSchema = require('../../models/user')
const ExamSchema = require('../../models/exam')
const user = require('../../models/user')
const {errorHandler, asyncErrorHandler} = require('../../errorhandler.js')
require('dotenv').config()


const AdministrationScene = new Scenes.WizardScene("ADMINISTRATION_SCENE", 
    (ctx) => {
        switch(ctx.message?.text) {
            case 'Назад': return ctx.scene.enter('MAIN_SCENE'); 
            case 'В начало': return ctx.scene.enter('MAIN_SCENE'); 
        }
        ctx.reply('Администрация', Markup
            .keyboard([
                ['Результаты'], 
                ['В начало', 'Назад']
            ])
            .oneTime()
            .resize()
        )
        return ctx.wizard.next()
    },
    async (ctx) => {
        switch(ctx.message?.text) {
            case 'Назад': return ctx.scene.enter('MAIN_SCENE'); 
            case 'В начало': return ctx.scene.enter('MAIN_SCENE'); 
        }
        await asyncErrorHandler(async () => {
            const users = (await UserSchema.find({"exams.0": {$exists: true}}).populate('exams').lean()).map(user => {return {...user, exams: [user.exams.sort((a, b) => (a.result < b.result) ? 1: (b.result < a.result) ? -1 : 0)[0]]}})
            ctx.session.state.users = users;
            const result = users.map((user, index) => {
                return `${index + 1}. ${user.job} ${user.name}\nРезультат: ${user.exams[0].result} Дата: ${new Date().toISOString(user.exams[0].date.getTime()).slice(0, 10).split('-').join('.')}`
            }).join('\n')
            ctx.reply(`${result == '' ? 'Результатов пока что нет.' : result}`, Markup
                .keyboard([
                [`${result == '' ? '' : 'Удалить результат'}`], 
                ['В начало', 'Назад']
                ])
                .oneTime()
                .resize()
            ) 
            ctx.wizard.next()
        }, ctx)
    },
    (ctx) => {
        switch(ctx.message?.text) {
            case 'Назад': return ctx.scene.enter('MAIN_SCENE'); 
            case 'В начало': return ctx.scene.enter('MAIN_SCENE'); 
            case 'Удалить результат': return ctx.scene.enter('DELETE_RESULT_SCENE')
        }
    }
  )

const GuardScene = new Scenes.WizardScene("GUARD_SCENE", 
    (ctx) => {
        ctx.reply('Введите ключ.', Markup
            .keyboard([
                ['В начало', 'Назад']
            ])
            .oneTime()
            .resize()
        )
        return ctx.wizard.next();
    },
    async (ctx) => {
        switch(ctx.message?.text) {
            case 'Назад': return ctx.scene.enter('MAIN_SCENE'); 
            case 'В начало': return ctx.scene.enter('MAIN_SCENE'); 
        }
        if(ctx.message?.text == process.env.HASH) {
            ctx.session.state.op = true
            return ctx.scene.enter('ADMINISTRATION_SCENE')
        }
        ctx.scene.reenter()
    }
)


const DeleteResultScene = new Scenes.WizardScene("DELETE_RESULT_SCENE", 
    (ctx) => {
        ctx.reply('Введите номер работника в списке', Markup
            .keyboard([
                ['Назад']
            ])
            .oneTime()
            .resize()
        )
        return ctx.wizard.next();
    },
    async (ctx) => {
        await asyncErrorHandler(async () => {
            if (isNaN(ctx.message?.text)) return ctx.wizard.selectStep(0)
            const number = parseInt(ctx.message.text)
            if(number > ctx.session.state.users.length) {
                return ctx.wizard.selectStep(0)
            }
            console.log('hi')
            const result = await UserSchema.findByIdAndDelete(ctx.session.state.users[number - 1]._id)
            console.log(result)
            return ctx.scene.enter('ADMINISTRATION_SCENE')
        }, ctx)
    }
)


module.exports = {AdministrationScene, DeleteResultScene, GuardScene}
