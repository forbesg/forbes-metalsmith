var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    layouts = require('metalsmith-layouts'),
    collections = require('metalsmith-collections'),
    branch = require('metalsmith-branch'),
    serve = require('metalsmith-serve'),
    watch = require('metalsmith-watch'),
    Handlebars = require('handlebars'),
    uglify = require('metalsmith-uglify'),
    sass = require('metalsmith-sass'),
    cleanCss = require('metalsmith-clean-css'),
    concat = require('metalsmith-concat'),
    compress = require('metalsmith-gzip'),
    sitemap = require('metalsmith-sitemap'),
    fs = require('fs');

Handlebars.registerPartial({
  'head': fs.readFileSync('./layouts/partials/head.hbs').toString(),
  'header': fs.readFileSync('./layouts/partials/header.hbs').toString(),
  'projects': fs.readFileSync('./layouts/partials/projects.hbs').toString(),
  'contact': fs.readFileSync('./layouts/partials/contact.hbs').toString(),
  'footer': fs.readFileSync('./layouts/partials/footer.hbs').toString()
});
Handlebars.registerHelper('toLowerCase', function(str) {
  return str.toLowerCase();
});

var metalsmith = new Metalsmith(__dirname)
    .source('src')
    .use(sass({
      outputStyle: "expanded",
      outputDir: 'css/'
    }))
    .use(concat({
      files: 'css/**/*.css',
      output: 'css/styles.css'
    }))
    .use(cleanCss())
    .use(uglify())
    .use(markdown())
    .use(collections({
        pages: {
          pattern: 'pages/*.html',
          sortBy: 'order'
        },
        web: {
          pattern: 'projects/websites/*.html'
        },
        blackberry: {
          pattern: 'projects/blackberry/*.html'
        },
        webapps: {
          pattern: 'projects/webapps/*.html'
        }
    }))
    .use(branch('pages/*.html')
      .use(permalinks({
        pattern: ":title"
      }))
    )
    .use(branch('projects/**/*.html')
      .use(permalinks({
        pattern: "portfolio/:collection/:title"
      }))
    )
    .use(layouts({
      engine: 'handlebars',
    }))
    .use(compress())
    .use(sitemap({
      hostname: "http://forbesg.github.io",
      omitIndex: true
    }))
    .use(serve({
      port: 3000,
      host: '0.0.0.0'
    }))
    .use(watch({
      paths: {
        "${source}/**/*": true,
        'layouts/**/*.hbs': '**/*'
      },
      livereload: true,
    }))
    .destination('build')
    .build(function (err) {
      if (err) console.log(err);
    });
