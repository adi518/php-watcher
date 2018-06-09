// https://coolsymbol.com/
// https://windows.php.net/download/
// https://github.com/paulmillr/chokidar
// https://github.com/mikaelbr/node-notifier
// https://www.npmjs.com/package/configuration-by-argument
// https://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
// https://stackoverflow.com/questions/48698234/node-js-spawn-vs-execute
// https://github.com/webpack/watchpack/blob/master/lib/DirectoryWatcher.js
// https://windows.php.net/downloads/releases/php-5.6.36-nts-Win32-VC11-x64.zip
// https://nodejs.org/docs/latest/api/fs.html#fs_fs_watch_filename_options_listener
// https://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js
// https://stackoverflow.com/questions/27688804/how-do-i-debug-error-spawn-enoent-on-node-js
// https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
// https://stackoverflow.com/questions/18275809/kill-all-child-process-when-node-process-is-killed
// https://stackoverflow.com/questions/12978924/fs-watch-fired-twice-when-i-change-the-watched-file
// https://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color/41407246#41407246
// https://github.com/webpack/webpack/blob/8e6a012dbbb1526db1da753b61c43e8c61b3379f/lib/node/NodeWatchFileSystem.js
// https://stackoverflow.com/questions/12238477/determine-command-line-working-directory-when-running-node-bin-script
// https://hackernoon.com/https-medium-com-amanhimself-converting-a-buffer-to-json-and-utf8-strings-in-nodejs-2150b1e3de57

var path = require('path')
var chalk = require('chalk')
var slash = require('slash')
var chokidar = require('chokidar')
var pkg = require('./package.json')
var notifier = require('node-notifier')
var childProcess = require('child_process')

var argv = require('minimist')(process.argv.slice(2))

var defaults = require('./conf.default')

// Helpers
var namespace = pkg.name

var getOwnConf = (() => {
  var conf = null
  if (argv.conf) {
    conf = require(path.join(process.cwd(), argv.conf))
  }
  return () => conf
})()

var hasOwnConf = () => !!getOwnConf()

var log = (message, options = { color: 'green', bgColor: '' }) => {
  message.match(/[^\r\n]+/g).forEach(line => {
    var color
    if (options.bgColor) {
      color = chalk[options.bgColor][options.color]
    } else {
      color = chalk[options.color]
    }
    console.log(color(`[${namespace}] ${line}`))
  })
}

var resolve = dir => {
  if (hasOwnConf() && getOwnConf().watchDir) {
    return path.join(process.cwd(), dir)
  }
  return path.join(__dirname, dir)
}

var isChildAlive = (child = {}) => child.killed === false

var conf = Object.assign({}, defaults, getOwnConf())

// Determine absolute 'watch' path
var watchPath = resolve(conf.watchDir)

// Initialize watcher.
var watcher = chokidar.watch(watchPath, conf.watchOptions)

var child

// Watch the path and restart
// php handler on `change` event.
/* eslint-disable-next-line */
watcher.on('change', path => {

  // Log fs-event
  log(`${slash(path)} (CHANGE)`, { color: 'cyan' })

  // Kill php handler (async).
  // Output handlers will continue to output
  // until process is actually killed.
  if (child) {
    child.kill()
  }

  // Respawn php handler
  child = childProcess.spawn(`${conf.php}/php`, [conf.command])

  // Print its output
  child.stdout.on('data', data => {
    if (isChildAlive(child) && conf.verbose) {
      log(data.toString(), { color: 'magenta' })
    }
  })

  // Print its errors
  child.stderr.on('data', data => {
    if (isChildAlive(child)) {
      log(data.toString(), { color: 'red' })
    }
  })

  /* eslint-disable-next-line */
  child.on('exit', code => {

    if (code === 0) {
      // No errors
      notifier.notify({
        title: namespace.toUpperCase(),
        message: 'SUCCESS ✔'
      })
      log('handler: SUCCESS ✔')
    } else if (code === null) {
      // Handler was killed
    } else {
      notifier.notify({
        title: namespace.toUpperCase(),
        message: 'ERROR ✘'
      })
      log('handler: FAILED ✘', { color: 'red' })
    }
  })
})

log(`${pkg.version}`, { color: 'yellow' })
log(`watching: ${slash(conf.watchDir)}`, { color: 'yellow' })
