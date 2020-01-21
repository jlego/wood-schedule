const STRATEGY = Symbol('strategy');
const STRATEGY_INSTANCE = Symbol('strategy_instance');
const loadSchedule = require('./load_schedule');
const nodeSchedule = require('node-schedule');
let tasks = {};
let tasksConfig = {};

class Schedule {
  constructor() {
    this.ctx = null;
    this.config = null;
    this[STRATEGY] = new Map();
    this[STRATEGY_INSTANCE] = new Map();
  }

  /**
   * register a custom Schedule Strategy
   * @param {String} type - strategy type
   * @param {Strategy} clz - Strategy class
   */
  use(type, clz) {
    this[STRATEGY].set(type, clz);
  }

  init(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    const scheduleItems = loadSchedule(this.ctx, this.config);
    for (const k of Object.keys(scheduleItems)) {
      const { key, task, schedule } = scheduleItems[k];
      //const type = schedule.type;
      if (schedule.disable) continue;
      tasks[key] = nodeSchedule.scheduleJob(schedule, task);
      if (schedule.immediate) {
        tasks[key].invoke();
      }
      tasksConfig[key] = schedule;
    }
  }

  start(name, config, task) {
    if (typeof name != 'string' || name === "") throw "must specify a task name";
    if (tasks[name]) throw 'a same name task already exsit';
    tasks[name] =   nodeSchedule.scheduleJob(config, task);
    tasksConfig[name] = config;
  }

  restart(taskName) {
    if (tasks[taskName]) {
      tasks[taskName].rescheduleJob(tasksConfig[taskName]);
    }
  }

  cancle(taskName) {
    if (tasks[taskName])
      tasks[taskName].cancel(true);
  }

  delete(taskName) {
    if (tasks[taskName]) {
      tasks[taskName].cancel(false);
      delete tasks[taskName];
    }  
  }

  cancelAll() {
    for (let item in tasks) {
      tasks[item].cancel(false);
    }
  }

  deleteAll() {
    for (let item in tasks) {
      this.delete(item);
    }
  }
};

module.exports = new Schedule();