const { Telegraf, Markup, Stage, Scenes, session } = require('telegraf')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const Logger = require('./models/log.js')
const MessageSchema = require('./models/message.js')
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
const {NewUserExamScene, ExamScene, NameChangeScene, JobChangeScene} = require('./scenes/1.2 Labor Protection Briefing/1.2.3 At The Workplace/1.2.3.3 Exam/index.js')
const {AdministrationScene, DeleteResultScene, GuardScene} = require('./scenes/1.5 Administration/index.js')

const OrdersScene = require('./scenes/1.3 Orders/index.js')

const KaidzenScene = require('./scenes/1.4 Kaidzen/index.js')
const EmptyScene = require('./scenes/0 Empty Scene/index.js')


mongoose.connect(process.env.MONGO_URI).then(() => console.log('Connected to MongoDB'))

const bot = new Telegraf(process.env.TOKEN)
bot.launch()

bot.on(async (ctx) => {
  const log = new Logger({...ctx.message})
  await log.save()
  if(ctx.message?.text) {
    await MessageSchema.findOneAndUpdate({text: ctx.message.text}, {$inc: {quantity: 1, "times": 1}}, {upsert: true})
  }
})

const stage = new Scenes.Stage([MainScene, NewStaffScene, 
  LaborProtectionScene, LPEducationScene, 
  IntroductoryBriefingScene, JobInstructionsScene,
  BriefingAtTheWorkplaceScene, InstructionsScene, TrainingModeScene, NewUserExamScene, ExamScene, NameChangeScene, JobChangeScene,
  OrdersScene,
  KaidzenScene,
  GuardScene, AdministrationScene, DeleteResultScene,
  EmptyScene,])


bot.use(session())
bot.use(stage.middleware())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/instructions', InstructionsRouter)
app.listen(process.env.EXPRESS_PORT, () => {
  console.log('Express server started successfully')
})

bot.start((ctx) => {
  ctx.scene.enter('MAIN_SCENE')
  ctx.session.state = {
    user: {
      name: undefined,
      job: undefined,
    },
    counter: 0, 
    score: 0,
    timer: 0,
    op: false,
    users: [],
    questions: []
  }
})
console.log('Bot successfully started')
