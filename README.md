# PHP-Watcher
Watch PHP files and execute a corresponding handler.

## Prerequisites
Node.js Version >= 8 (might work with older versions, but untested).

## Install
```
npm install
```

## Configuration
Create a `conf.json` (use `conf.default.json` as boilerplate). If `conf.json` is absent `conf.default.json` will be used instead.

## Usage
```
npm start
```

## Options

#### `php`
* Type: `String`
* Default: `C:/php`
* Description: Absolute path to PHP service.

#### `command`
* Type: `String`
* Default: `deploy.php`
* Description: Command to execute on watch callback.

#### `watchDir`
* Type: `String`
* Default: `php-files`
* Description: Relative path to watched files.

#### `watchOptions`
* Type: `Object`
* Default: 
```
{
    "recursive": true
}
```
* Description: See options [here](https://nodejs.org/api/fs.html#fs_fs_watch_filename_options_listener).
