# offline-issues

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

_Get your GitHub Issues offline! In HTML format._

This is a command line application, that fetches the GitHub Issue/s you specify and writes them to file on your computer in HTML format.

**This will cap issues at the first 300. You can change this limit by controlling the maxPageSize variable in src/index.js** 

## Build / Develop Locally

- Clone this repository: `git@github.com:SrikanthIO/offline-issues.git`
- Go inside this project: `cd offline-issues`
- Install dependencies: `npm install`
- Link this local version to your global `npm link` (or `sudo npm link`)
- If you have trouble with this or don't want to override the published version (this one) you can run it through the path to the main file: `<path-to-clone>/src/cli.js OPTIONS`
- On Ubuntu, use `nodejs <path-to-clone>/src/cli.js` (or `nodejs $(which offline-issues)`) to start the CLI
- Right now it is getting all closed issues by default.
