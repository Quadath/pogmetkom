const { Telegraf, Markup, Stage, Scenes, session } = require('telegraf')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config()


const app = express()
const InstructionsRouter = require('./routes/InstructionsRouter.js')

const MainScene = require('./scenes/1 Main Scene/index.js')

const NewStaffScene = require('./scenes/1.1 New Staff/index.js')

const LaborProtectionScene = require('./scenes/1.2 Labor Protection Briefing/index.js')
const LPEducationScene = require('./scenes/1.2 Labor Protection Briefing/1.2.1 LP Education/index.js')
const IntroductoryBriefingScene = require('./scenes/1.2 Labor Protection Briefing/1.2.2 Introductory Briefing/index.js')
const JobInstructionsScene = require('./scenes/1.2 Labor Protection Briefing/1.2.2 Introductory Briefing/1.2.2.2 JobInstructionsScene/index.js')
const BriefingAtTheWorkplaceScene = require('./scenes/1.2 Labor Protection Briefing/1.2.3 At The Workplace/index.js')
const InstructionsScene = require('./scenes/1.2 Labor Protection Briefing/1.2.3 At The Workplace/1.2.3.1 Instructions/index.js')
const TrainingModeScene = require('./scenes/1.2 Labor Protection Briefing/1.2.3 At The Workplace/1.2.3.2 Training Mode/index.js')

const OrdersScene = require('./scenes/1.3 Orders/index.js')

const KaidzenScene = require('./scenes/1.4 Kaidzen/index.js')
const EmptyScene = require('./scenes/0 Empty Scene/index.js')


mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))

const bot = new Telegraf(process.env.TOKEN)
bot.launch()

bot.on((ctx) => {
  console.log(ctx.message)
})

const stage = new Scenes.Stage([MainScene, NewStaffScene, 
  LaborProtectionScene, LPEducationScene, 
  IntroductoryBriefingScene, JobInstructionsScene,
  BriefingAtTheWorkplaceScene, InstructionsScene, TrainingModeScene,
  OrdersScene,
  KaidzenScene, EmptyScene])


bot.use(session())
bot.use(stage.middleware())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/instructions', InstructionsRouter)
app.listen(process.env.EXPRESS_PORT, () => {
  console.log('Express server started successfully')
})

bot.start((ctx) => ctx.scene.enter('MAIN_SCENE'))
console.log('Bot successfully started')
