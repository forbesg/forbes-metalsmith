var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    layouts = require('metalsmith-layouts'),
    collections = require('metalsmith-collections'),
    branch = require('metalsmith-branch'),
    serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch'),
    Handlebars = require('handlebars'),
    fs = require('fs');

Handlebars.registerPartial({
  'head': fs.readFileSync('./layouts/partials/head.hbs').toString(),
  'header': fs.readFileSync('./layouts/partials/header.hbs').toString(),
  'footer': fs.readFileSync('./layouts/partials/footer.hbs').toString()
});
Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

var metalsmith = new Metalsmith(__dirname)
    .source('./src')
    .destination('./build')
    .use(collections({
        pages: {
          pattern: 'content/pages/*.md'
        },
        web: {
          pattern: 'content/projects/websites/*.md'
        },
        blackberry: {
          patter: 'content/projects/blackberry/*.md'
        }
    }))
    .use(markdown())
    .use(branch('content/pages/*.html')
      .use(permalinks({
        pattern: "./:title"
      }))
    )
    .use(branch('content/projects/**/*.html')
      .use(permalinks({
        pattern: "./portfolio/:collection/:title"
      }))
    )
    .use(layouts({
      engine: 'handlebars',
    }))
    .use(serve({
      port: 3000,
      host: '0.0.0.0'
    }))
    // .use(watch({
    //   paths: {
    //     "${source}/**/*": true,
    //     'layouts/**/*.hbs': '**/*'
    //   },
    //   livereload: true,
    // }))
    .build(function (err) {
      if (err) console.log(err);
    });
