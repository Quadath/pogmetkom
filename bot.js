const { Telegraf, Markup, Stage, Scenes, session } = require('telegraf')
const MESSAGES = require('./messages')
const FILES = require('./files.js')

const MainScene = require('./scenes/1 Main Scene/index.js')

const NewStaffScene = require('./scenes/1.1 New Staff/index.js')
const KaidzenScene = require('./scenes/1.4 Kaidzen/index.js')
const EmptyScene = require('./scenes/0 Empty Scene/index.js')

require('dotenv').config()

const bot = new Telegraf(process.env.TOKEN)
bot.launch()

bot.on((ctx) => {
  console.log(ctx.message)
})

const stage = new Scenes.Stage([MainScene, NewStaffScene, KaidzenScene, EmptyScene])

bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => ctx.scene.enter('MAIN_SCENE'))
console.log('successfully started')
