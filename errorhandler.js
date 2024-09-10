const ErrorSchema = require('./models/error')

const errorHandler = (func, ctx) => {
    try {
        func()
    } catch {
        console.log('error!!')
        console.log(error)
        ErrorSchema.create({...JSON.parse(error)})
        ctx.reply('К сожалению, произошла ошибка. Мы работаем над этим.')
        return ctx.scene.enter('MAIN_SCENE')
    }
}

const asyncErrorHandler = async (func, ctx) => {
    try {
        await func()
    } catch (error) {
        console.log('error!!')
        console.log(error)
        ErrorSchema.create({text: error.message})
        ctx.reply('К сожалению, произошла ошибка. Мы работаем над этим.')
        return ctx.scene.enter('MAIN_SCENE')
    }
}

module.exports = {errorHandler, asyncErrorHandler}