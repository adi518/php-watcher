// https://windows.php.net/download/
// https://github.com/mikaelbr/node-notifier
// https://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
// https://stackoverflow.com/questions/48698234/node-js-spawn-vs-execute
// https://windows.php.net/downloads/releases/php-5.6.36-nts-Win32-VC11-x64.zip
// https://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener
// https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
// https://stackoverflow.com/questions/27688804/how-do-i-debug-error-spawn-enoent-on-node-js
// https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
// https://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color/41407246#41407246
// https://hackernoon.com/https-medium-com-amanhimself-converting-a-buffer-to-json-and-utf8-strings-in-nodejs-2150b1e3de57

var fs = require('fs')
var path = require('path')
var chalk = require('chalk')
var pkg = require('./package.json')
var capitalize = require('capitalize')
var notifier = require('node-notifier')
var childProcess = require('child_process')

var conf

if (fs.existsSync('./conf.json')) {
  conf = require('./conf.json')
} else {
  conf = require('./conf.default.json')
}

// Helpers
var namespace = `${capitalize.words(pkg.name)}`

var log = function (message, options = { color: 'green' }) {
  message.match(/[^\r\n]+/g).forEach(line => {
    console.log(chalk[options.color](`${namespace}: ${line}`))
  })
}

var resolve = dir => {
  return path.join(__dirname, dir)
}

// Determine absolute 'watch' path
var watchPath = resolve(conf.watchDir)

var child

// Where the magic happens.
// We watch the path and respawn
// a php handler on every event.
fs.watch(watchPath, conf.watchOptions, (eventType, filename) => {

  // Log fs-event
  log(`${filename} (${eventType.toUpperCase()})`)

  // Kill php handler
  if (child) {
    child.kill()
  }

  // Respawn php handler
  child = childProcess.spawn(`${conf.php}/php`, [conf.command])

  // Print its output
  child.stdout.on('data', data => {
    log(data.toString(), { color: 'blue' })
  })

  // Print its errors
  child.stderr.on('data', data => {
    log(data.toString(), { color: 'magenta' })
  })

  child.on('close', code => {
    if (code === 0) {
      // No errors
      notifier.notify({
        title: namespace,
        message: 'Success :)'
      })
    } else {
      notifier.notify({
        title: namespace,
        message: 'Error :('
      })
    }
  })
})
