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
    fs = require('fs'),
    workboxBuild = require('workbox-build');

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
Handlebars.registerHelper('currentYear', function() {
  var date = new Date();
  return date.getFullYear();
});
Handlebars.registerHelper('ifCond', function(v1, v2, options) {
  if(v1 === v2) {
    return options.fn(this);
  }
  return options.inverse(this);
});

const buildSW = () => {
  // This will return a Promise
  return workboxBuild.injectManifest({
    swSrc: 'src/service-worker.js',
    swDest: 'build/service-worker.js',
    globDirectory: 'build',
    globPatterns: [
      '**\/*.{js,css,html,svg}',
    ]
  })
}

var metalsmith = new Metalsmith(__dirname);

metalsmith.source('src')
  .use(watch({
    paths: {
      "${source}/**/*": '**/*',
      '${source}/../layouts/**/*.hbs': '**/*',
      '${source}/scss/*.scss': '**/*'
    },
    livereload: true,
  }))
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
        pattern: 'projects/webapps/*.html',
        sortBy: 'order'
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
    hostname: "https://forbesg.github.io",
    omitIndex: true
  }))
  .use(serve({
    port: 3000,
    host: 'localhost'
  }))
  .destination('build')
  .build(function (err) {
    if (err) {
      console.log(err)
      return
    }
    /**
    * Generate SW precache
    **/
    buildSW()
    .then(({count, size, warnings}) => {
      // Optionally, log any warnings and details.
      warnings.forEach(console.warn);
      console.log(`${count} files will be precached, totaling ${size} bytes.`);
    })
    .catch(err => {
      console.log(err);
    })
  });
