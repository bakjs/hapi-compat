# hapi-compat

This plugin tries to detect, warn and auto-fix Hapi 17 breaking changes which are not fixed in plugins with a best effort.
Hooks are recursive so if a plugin requires incompatible plugins, hapi-compat plugin will support them too.

## What's supported?

ID                | Auto Fix    | Perf Impact  | Description
------------------|-------------|--------------|--------------------------------------------------------------------
ASYNC_PLUGINS     | YES         | B            | plugins with next callback should return a Promise now
SERVER_REGISTER   | YES         | -            | `server.register({ register })` should be `{ plugin }`
SERVER_ON         | YES         | B* + R*      | `server.on` ~> `server.events.on`
ASYNC_SERVER_EXT  | YES         | B            | Support for server.ext where the method expects having `next` callback

- Perf Impact indicates wether this support impacts performance of framework (B)oot or (R)untime.
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
        server,
        // ext: false,
        // events: false,
    }
})
```

## Questions

+ Does this plugin magically fixes everything for migration?

Absolutely no. This is just a helper utility for making migration easier and faster.

# License 

MIT - [https://github.com/bakjs/bak](BAK)