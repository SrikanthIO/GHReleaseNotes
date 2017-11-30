var fs = require('fs')

var request = require('request')

var runParallel = require('run-parallel')
var writemarkdown = require('./writemarkdown.js')
var writehtml = require('./writehtml.js')

var base = 'https://api.github.com'
var headers = {'user-agent': 'offline-issues module'}

module.exports = function (token, options, cb) {
  var issueData = []
  var pagenum = 1
  var maxPageSize = 1;
  var allIssues = []
  if(options.pagesize) {
    maxPageSize = options.pagesize;
  }
  headers['Authorization'] = 'token ' + token.token
  if (options._.length === 0 && options.html) {
    return writehtml(options, cb)
  }
  if (options._.length === 0) return cb(null, 'No repository given.')
  parseRepo(options, cb)

  function parseRepo (options, cb) {
    options.repos = []

    options._.forEach(function (repo) {
      var repoDetails = {}
      repoDetails.full = repo
      var userAndRepo = repo.split('/')
      repoDetails.user = userAndRepo[0]
      if (userAndRepo[1].indexOf('#') >= 0) {
        var repoAndIssue = userAndRepo[1].split('#')
        repoDetails.name = repoAndIssue[0]
        repoDetails.issue = repoAndIssue[1]
      } else {
        repoDetails.name = userAndRepo[1]
        repoDetails.issue = 'all'
        repoDetails.state = options.state
      }
      options.repos.push(repoDetails)
    })
    var functionsToDo = options.repos.map(function (repo) {
      return function (cb) {
        getIssues(repo, cb)
      }
    })
    runParallel(functionsToDo, function (err) {
      if (err) return cb(err, 'Error running in parallel.')
      writeData(options, cb)
    })
  }

  function getIssues (repo, cb) {
//    console.log("****** Getting Issues ********");
    if (repo.issue === 'all') return theRequestLoop(repo, cb)
    // var url = base + '/repos/' + repo.user + '/' + repo.name + '/issues/' + repo.issue
    // request(url, { json: true, headers: headers }, function (err, resp, body) {
    //   if (err) return cb(err, 'Error in request for issue.')
    //   loadIssue(body, repo, cb)
    // })
  }

  function theRequestLoop (repo, cb) {
    var query = '/issues?state=closed&page='
    var limit = '&per_page=100'
    var url = base + '/repos/' + repo.user + '/' + repo.name + query + pagenum + limit
    request(url, { json: true, headers: headers }, function (err, resp, body) {
      if (err) return cb(err, 'Error in request for issue.')
      if (body.message) return cb(null, body)
      if (body.length === 0) {
        var functionsToDo = allIssues.map(function (issue) {
          return function (cb) {
            loadIssue(issue, repo, cb)
          }
        })
        runParallel(functionsToDo, cb)
        return
      } else {
        if (body.message) return cb(null, body)
        body.forEach(function (issue) {
          return allIssues.push(issue)
        })
        pagenum++;
        if(pagenum <= maxPageSize) {
          getIssues(repo, cb);
        } else {
          var functionsToDo = allIssues.map(function (issue) {
          return function (cb) {
            loadIssue(issue, repo, cb)
          }
        })
        runParallel(functionsToDo, cb)
        return
        }
      }
    })
  }

  function loadIssue (body, repo, cb) {
    var issue = {}
  
   
  //  console.log(body);
    issue.id = body.id
    issue.url = body.html_url
    if(body.labels && body.labels.length > 0) {
        for(var k = 0 ; k < body.labels.length; k++ ) {
          var label = body.labels[k];
          if(label.name) {
            if(label.name === 'enhancement' || label.name === 'major feature') {
              issue.label = 'enhancement';
              break;
            }else if(label.name == 'bug') {
              issue.label = 'bug';
              break;
            } 
          } 
      }
    };
    //issue.labels = body.labels;
    issue.title = "#" + body.number + " "+ body.title
    issue.created_by = body.user.login || body.head.user.login
    issue.created_at = new Date(body.created_at).toLocaleDateString()
    issue.body = body.body
    issue.state = body.state
    issue.comments = []
    issue.comments_url = body.comments_url
    issue.milestone = body.milestone ? body.milestone.title : null

    if (repo.issue === 'all') {
      issue.quicklink =  '#' + body.html_url.split('/').pop()
    } else issue.quicklink = repo.full
    if(!body.pull_request) {
      issueData.push(issue);
    }
    cb()
   // getComments(issue, repo, cb)
  }

  function getComments (issue, repo, cb) {
    var url = ''
    if (repo.issue === 'all') {
      url = issue.comments_url
    } else {
      url = base + '/repos/' + repo.user + '/' + repo.name + '/issues/' + repo.issue + '/comments'
    }
    request(url, { json: true, headers: headers }, function (err, resp, body) {
      if (err) return cb(err, 'Error in request for comments.')

      issue.comments = body
      if(issue && issue.comments && issue.comments.length > 0) {
        console.log(issue);
        console.log(issue.comments);
      issue.comments.forEach(function (comment) {
        comment.created_at = new Date(comment.created_at).toLocaleDateString()
      })
    }
      issueData.push(issue)
      cb()
    })
  }

  function writeData (options, cb) {
    var data = JSON.stringify(issueData, null, ' ')
    var count = JSON.parse(data).length
    console.log("***** Generating release notes for last "+count +" isseus");
    // if (count > 250) {
    //   console.log('Only processing the first 250 issues.')
    //   var limit = 250
    //   var excess = count - limit
    //   var newData = JSON.parse(data).splice(0, 250)
    //   data = JSON.stringify(newData)
    // }

    fs.writeFile('comments.json', data, function (err) {
      if (err) return cb(err, 'Error in writing data file.')
      //writemarkdown(options, cb)
      writehtml(options, cb)
    })
  }
}
