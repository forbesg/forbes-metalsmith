var Metalsmith = require('metalsmith'),
    markdown = require('metalsmith-markdown'),
    permalinks = require('metalsmith-permalinks'),
    layouts = require('metalsmith-layouts'),
    collections = require('metalsmith-collections'),
    serve = require('metalsmith-serve'),
    Handlebars = require('handlebars'),
    fs = require('fs');

Handlebars.registerPartial({
  'header': fs.readFileSync('./layouts/partials/header.hbs').toString(),
  'nav': fs.readFileSync('./layouts/partials/nav.hbs').toString(),
  'footer': fs.readFileSync('./layouts/partials/footer.hbs').toString()
});

var metalsmith = new Metalsmith(__dirname)
    .use(collections({
        pages: {
          pattern: 'content/pages/*.md'
        }
    }))
    .use(markdown())
    .use(permalinks({
      pattern: "./:title"
    }))
    .use(layouts({
      engine: 'handlebars',
      default: 'default.hbs'
    }))
    .destination('./build')
    .use(serve({
      port: 3000
    }))
    .build(function (err) {
      if (err) console.log(err);
    });
