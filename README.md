# wood-schedule

task schedule based on node-schedule for wood framework

## Install

```bash
$ npm i wood-schedule --save
```

schedule plugin for wood, support wood application.

This plugin based on node-schedule

## Configuration

Change `${app_root}/config/plugins.js` to enable schedule plugin:

```js
exports.schedule = {
  enable: true,
  package: 'wood-schedule',
  config: {
      dirs: 'schedules'
  }
}
```

## Use
In `${app_root}/schedules` directory, define a schedule task like follow
``` js
const {Model, error, email, DataTypes, catchErr} = require('../../index')

exports.schedule = {
  //start: 
  //end:
  rule: '*/5 * * * * *',
  // interval: '1h',
  // immediate: true,
};

exports.task = async function () {
  console.log("this is a timer schedule");
  let result = await catchErr(Model('test.pub').findOne());
  console.log(result.data);
};

```

## Questions & Suggestions

Please open an issue [here]().

## License

[MIT](LICENSE)