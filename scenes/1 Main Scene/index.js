const { Markup, Scenes } = require('telegraf')

const NewStaffScene = require('../1.1 New Staff/index.js')
const LaborProtectionScene = require('../1.2 Labor Protection Briefing/index.js')
const KaidzenScene = require('../1.4 Kaidzen/index.js')
const EmptyScene = require('../0 Empty Scene/index.js')

const MainScene = new Scenes.WizardScene('MAIN_SCENE',
    (ctx) => {
      ctx.reply('Выберите подходящую опцию ниже.', Markup
        .keyboard([
          ['Памятка нового сотрудника'], 
          ['Инструктаж по Охране Труда'],
          ['Регламенты', 'Кайдзен'], 
          ['Результаты']
        ])
        .oneTime()
        .resize()
      )
      return ctx.wizard.next();
    }, 
    (ctx) => {
      switch(ctx.message.text) {
        case 'Памятка нового сотрудника': ctx.scene.enter('NEW_STAFF_SCENE'); break;
        case 'Инструктаж по Охране Труда': ctx.scene.enter('LABOR_PROTECTION_SCENE'); break;
        case 'Регламенты': ctx.scene.enter('ORDERS_SCENE'); break;
        case 'Кайдзен': ctx.scene.enter("KAIDZEN_SCENE"); break;
        case 'Результаты': {
          if (ctx.session.state.op) {
            ctx.scene.enter("ADMINISTRATION_SCENE")
          } else {
            ctx.scene.enter("GUARD_SCENE");
          }
         } break;
        default: ctx.scene.enter('MAIN_SCENE')
      }
    }
  )

module.exports = MainScene