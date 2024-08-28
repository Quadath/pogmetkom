const { Markup, Scenes } = require('telegraf')
const UserSchema = require('../../../models/user.js')

const BriefingAtTheWorkplaceScene = new Scenes.WizardScene("BRIEFING_AT_THE_WORKPLACE_SCENE", 
    async (ctx) => {
      ctx.reply('На рабочем месте', Markup
        .keyboard([
          ['Инструкции'], 
          ['Режим обучения', 'Сдача экзамена'],
          ['В начало', 'Назад']
        ])
        .oneTime()
        .resize()
      )
      const user = await UserSchema.findOne({telegramId: ctx.message.from.id}).lean()
      if (user) {
        ctx.session.state.user.name = user.name;
        ctx.session.state.user.job = user.job;
      }
      return ctx.wizard.next();
    },
    (ctx) => {
      switch(ctx.message.text) {
        case 'Инструкции': {
          ctx.scene.enter('INSTRUCTIONS_SCENE')
        } break;
        case 'Режим обучения': {
          ctx.scene.enter('TRAINING_MODE_SCENE')
        } break;
        case 'Сдача экзамена': {
          if (ctx.session.state.user.name && ctx.session.state.user.job) {
            ctx.scene.enter('EXAM_SCENE')
          } else {
            ctx.scene.enter('NEW_USER_EXAM_SCENE')
          }
        } break;
        case 'Назад': ctx.scene.enter('LABOR_PROTECTION_SCENE'); break;
        case 'В начало': ctx.scene.enter('MAIN_SCENE'); break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )
  
module.exports = BriefingAtTheWorkplaceScene