module.exports = {
  php: 'C:/php',
  command: 'php/deploy.php',
  watchDir: 'php/src',
  watchOptions: {
    ignored: /(^|[/\\])\../,
    persistent: true
  },
  verbose: true
}
