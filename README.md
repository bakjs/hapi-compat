# hapi-compat

<p>
<a href="https://github.com/bakjs/bak">
    <img alt="" src="https://david-dm.org/bakjs/hapi-compat.svg?style=flat-square">
</a>
<a href="https://www.npmjs.com/package/hapi-compat">
    <img alt="" src="https://img.shields.io/npm/dt/hapi-compat.svg?style=flat-square">
</a>
<a href="https://www.npmjs.com/package/hapi-compat">
    <img alt="" src="https://img.shields.io/npm/v/hapi-compat.svg?style=flat-square">
</a>
<br>
<a href="https://github.com/bakjs/hapi-compat">
    <img alt="" src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square">
</a>
<a href="https://circleci.com/gh/bakjs/hapi-compat">
    <img alt="" src="https://img.shields.io/circleci/project/github/bakjs/hapi-compat.svg?style=flat-square">
</a>
<!-- <a href="https://codecov.io/gh/bakjs/hapi-compat">
    <img alt="" src="https://img.shields.io/codecov/c/github/bakjs/hapi-compat.svg?style=flat-square">
</a> -->
<a href="https://hapijs.com/">
    <img alt="" src="https://img.shields.io/badge/hapi.js-17.x-yellow.svg?style=flat-square">
</a>
<br>
</p>

This plugin tries to detect, warn and auto-fix Hapi 17 breaking changes which are not fixed in plugins with a best effort.

Hooks are recursive so if a plugin requires incompatible plugins, hapi-compat plugin will support them too.

## What's supported?

ID                | Auto Fix    | Perf Impact  | Description
------------------|-------------|--------------|--------------------------------------------------------------------
ASYNC_PLUGINS     | YES         | I            | plugins with next callback should return a Promise now
SERVER_REGISTER   | YES         | -            | `server.register({ register })` should be `{ plugin }`
PLUGIN_ATTRS      | YES         | -            | `register.attributes` ~> `{register, pkg}`
SERVER_ON         | YES         | I* + R*      | `server.on` ~> `server.events.on`
ASYNC_SERVER_EXT  | YES         | I            | Support for server.ext where the method expects having `next` callback

- Perf Impact indicates if this support impacts performance of framework (I)init or (R)untime.
- `*` means only impacts perf when old code detected not newer plugins

For more details please look at breaking changes list [here](https://github.com/hapijs/hapi/milestone/221?closed=1)

## Setup

Install package:

```bash
npm install hapi-compat

# or using yarn...

yarn add hapi-compat
```

Add plugin and push main Hapi instance as `options.server` to allow globally registering hooks:

```js
// ...
const server = new Hapi.Server(....)

// ...
server.register({
    plugin: 'hapi-compat',
    options: {
        server
    }
})
```

## Questions

+ Does this plugin magically fixes everything for migration?

  Absolutely no. This is just a helper utility for making migration easier and faster.

# License 

Copyright (c) 2016-2017 Fandogh - Pooya Parsa

Released under The MIT [LICENSE](./LICENSE)