const path = require('path');
const assert = require('assert');
const is = require('is-type-of');
const fs = require('fs');

module.exports = (ctx, config) => {
  const dirs = config.dirs;
  const Loader = getScheduleLoader(ctx);
  const schedules = {};
  new Loader({
    directory: dirs,
    target: schedules,
    inject: ctx,
  }).load();
  return schedules;
};

function toAsyncFunction(val) {
  if (val instanceof Promise) {
    return val;
  } else {
    return Promise.resolve(val);
  }
}

function getScheduleLoader(ctx) {
  return class ScheduleLoader {
    constructor(options) {
      this.options = options;
    }

    load() {
      const target = this.options.target;
      let dirname = path.dirname(require.main.filename);
      let dirs = path.resolve(dirname, this.options.directory);
      let dirList = fs.readdirSync(dirs);
      dirList.forEach(filename => {
        let nameArr = filename.split('.'),
          moduleName = nameArr[0];
        if (nameArr[1] !== 'js') return;
        let fullpath = path.resolve(dirname, `${this.options.directory}/${moduleName}`);
        let schedule = null;
        try {
          schedule = require(fullpath);
        } catch (err) {
          console.log(err);
        }

        assert(schedule.schedule, `schedule(${fullpath}): must have schedule and task properties`);
        assert(is.class(schedule) || is.function(schedule.task), `schedule(${fullpath}: schedule.task should be function or schedule should be class`);

        let task;
        if (is.class(schedule)) {
          task = () => {
            const s = new schedule();
            return s.subscribe();
          };
        } else {
          task = schedule.task;
        }

        target[moduleName] = {
          schedule: schedule.schedule,
          task,
          key: moduleName,
        };
      });
    }
  }
}