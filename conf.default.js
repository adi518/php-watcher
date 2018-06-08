module.exports = {
  php: 'C:/php',
  command: 'deploy.php',
  watchDir: 'php',
  watchOptions: {
    ignored: /(^|[/\\])\../,
    persistent: true
  },
  verbose: true
}
