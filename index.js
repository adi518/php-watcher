// https://coolsymbol.com/
// https://windows.php.net/download/
// https://github.com/paulmillr/chokidar
// https://github.com/mikaelbr/node-notifier
// https://www.npmjs.com/package/configuration-by-argument
// https://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
// https://stackoverflow.com/questions/48698234/node-js-spawn-vs-execute
// https://windows.php.net/downloads/releases/php-5.6.36-nts-Win32-VC11-x64.zip
// https://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener
// https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
// https://stackoverflow.com/questions/27688804/how-do-i-debug-error-spawn-enoent-on-node-js
// https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
// https://stackoverflow.com/questions/12978924/fs-watch-fired-twice-when-i-change-the-watched-file
// https://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color/41407246#41407246
// https://stackoverflow.com/questions/12238477/determine-command-line-working-directory-when-running-node-bin-script
// https://hackernoon.com/https-medium-com-amanhimself-converting-a-buffer-to-json-and-utf8-strings-in-nodejs-2150b1e3de57

var path = require('path')
var chalk = require('chalk')
var chokidar = require('chokidar')
var pkg = require('./package.json')
var capitalize = require('capitalize')
var notifier = require('node-notifier')
var childProcess = require('child_process')
var ConfigurationByArgument = require('configuration-by-argument')

var defaults = require('./conf.default.json')

// Helpers
var namespace = `${capitalize.words(pkg.name)}`

var getConfArg = (() => {
  var confArg = new ConfigurationByArgument({ parameterKey: 'conf' })
  return () => confArg
})()

var getOwnConf = () => {
  var confArg = getConfArg()
  if (confArg) {
    try {
      return confArg.get()
    } catch (error) {
      return null
    }
  }
}

var hasOwnConf = () => !!getOwnConf()

var log = (message, options = { color: 'bgGreen', bgColor: '' }) => {
  message.match(/[^\r\n]+/g).forEach(line => {
    var color
    if (options.bgColor) {
      color = chalk[options.bgColor][options.color]
    } else {
      color = chalk[options.color]
    }
    console.log(color(`${namespace}: ${line}`))
  })
}

var resolve = dir => {
  if (hasOwnConf() && getOwnConf().watchDir) {
    return path.join(process.cwd(), dir)
  }
  return path.join(__dirname, dir)
}

var conf = Object.assign({}, defaults, getOwnConf())

// Determine absolute 'watch' path
var watchPath = resolve(conf.watchDir)

// Initialize watcher.
var watcher = chokidar.watch(watchPath, Object.assign({
  ignored: /(^|[/\\])\../,
  persistent: true
}, conf.watchOptions))

var child

// Watch the path and restart
// php handler on every event.
/* eslint-disable-next-line */
watcher.on('change', filename => {

  // Log fs-event
  log(`${filename} (CHANGE)`)

  // Kill php handler
  if (child) {
    child.kill()
    log('Restarting handler...', { color: 'black', bgColor: 'bgYellow' })
  }

  // Respawn php handler
  child = childProcess.spawn(`${conf.php}/php`, [conf.command])

  // Print its output
  child.stdout.on('data', data => {
    log(data.toString(), { color: 'bgMagenta' })
  })

  // Print its errors
  child.stderr.on('data', data => {
    log(data.toString(), { color: 'bgRed' })
  })

  child.on('close', code => {
    if (code === 0) {
      // No errors
      notifier.notify({
        title: namespace.toUpperCase(),
        message: 'SUCCESS ✔'
      })
      log('Handler: SUCCESS ✔')
    } else if (code === null) {
      // Handler was killed
    } else {
      notifier.notify({
        title: namespace.toUpperCase(),
        message: 'ERROR ✘'
      })
      log('Handler: FAILED ✘', { color: 'bgRed' })
    }
  })
})

log(`Initialized (Version: ${pkg.version})`, { color: 'bgCyan' })
