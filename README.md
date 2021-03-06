# GHReleaseNotes

_Get your GitHub Issues offline! In HTML format._

This is a command line application, that fetches the GitHub Issues you specify and writes them into a file on your computer in HTML format.

**This will cap issues at the first 300. You can change this limit by passing maxPageSize as command line argument** 

**node src/cli.js -p 4 SrikanthIO/GHReleaseNotes**
![screenshot](screenshot.png)

## Build / Develop Locally

- Clone this repository: `git@github.com:SrikanthIO/GHReleaseNotes.git`
- Go inside this project: `cd GHReleaseNotes`
- Install dependencies: `npm install`
- Link this local version to your global `npm link` (or `sudo npm link`)
- Run `node src/cli.js SrikanthIO/GHReleaseNotes` command to pull the github issues.
- `node src/cli.js --help`

-   _--destination, -d  Change destination of the generated files_
-   _--html, -h         If no repository given, generate HTML from existing offline
                       cache                                             [boolean]_
-   _--header, -r       Release notes header name        [default: "Release Notes"]_
-    _--pagesize, -p     No of issues to pull from github. It will pull 100 issues
                       per page                                     [default: "3"]_
- Right now it is getting all closed issues by default.
