#!/usr/bin/env node

var ghauth = require('ghauth')
var getIssues = require('./index.js')

var options = require('yargs')
  .usage('Usage: $0 [options] [repository ...]')
  .option('destination', {
    alias: 'd',
    describe: 'Change destination of the generated files'
  })
  .option('html', {
    alias: 'h',
    describe: 'If no repository given, generate HTML from existing offline cache',
    boolean: true
  })
  .option('buildnumber', {
    alias: 'b',
    describe: 'To pass current build number',
    default: '007'
  })
  .option('no-static', {
    alias: 'S',
    describe: "Don't generate static files for HTML format",
    boolean: true
  })
  .option('state', {
    alias: 's',
    describe: 'Filter by issue state',
    choices: ['open', 'closed', 'all'],
    default: 'open'
  })
  .option('header', {
    alias: 'r',
    describe: 'Release notes header name',
    default: 'Release Notes'
  })
  .option('pagesize', {
    alias: 'p',
    describe: 'No of issues to pull from github. It will pull 100 issues per page ',
    default: '2'
  })
  .help('help')
  .argv

var ghAuthOptions = {
  configName: 'offline-issues', // ~/.config/[configName].json will store the token
  scopes: [ 'repo' ], // (optional) whatever GitHub auth scopes you require
  note: 'This token is for the offline-issues module from NPM' // (optional) saved with the token on GitHub
}

ghauth(ghAuthOptions, function (err, token) {
  if (err) console.log(err)
  getIssues(token, options, function (err, message) {
    if (err) console.log(err, message)
    console.log(message)
  })

  // var token = { user: 'username',
  // token: 'TOKEN' }
})
