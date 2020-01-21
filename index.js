/**
 * Wood Plugin Module.
 * schedule
 * by blucehuang on 2018-12-03
 */
const Schedule = require('./src/schedule');

module.exports = (app = {}, config = {}) => {
  app.Schedule = Schedule;
  Schedule.init(app, config)
  if(app.addAppProp) app.addAppProp('schedule', app.Schedule);
  return app;
}