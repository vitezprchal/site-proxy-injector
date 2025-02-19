module.exports = {
  proxy: "localhost:3000",
  files: [
    {
      match: ["dist/**/*"],
      fn: function(event, file) {
        this.reload();
      }
    }
  ],
  serveStatic: [
    {
      route: '/dist',
      dir: './dist'
    }
  ],
  port: 3001,
  open: false,
  notify: false,
  ghostMode: false,
  ui: false,
  watchOptions: {
    ignoreInitial: true,
    ignored: ['node_modules', 'src']
  },
  reloadDebounce: 100,
  injectChanges: true,
  reloadOnRestart: true,
  watchEvents: ["change", "add", "unlink", "addDir", "unlinkDir"],
  middleware: [
    function(req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      next();
    }
  ],
  rewriteRules: [
    {
      match: /<\/head>/i,
      fn: function() {
        const timestamp = Date.now();
        return `
          <meta charset="utf-8">
          <link rel="stylesheet" href="/dist/styles/main.css?v=${timestamp}">
          </head>
        `;
      }
    },
    {
      match: /<\/body>/i,
      fn: function() {
        const timestamp = Date.now();
        return `
          <script type="module" src="/dist/js/main.js?v=${timestamp}"></script>
          </body>
        `;
      }
    }
  ],
  snippetOptions: {
    ignorePaths: ['localhost:3000'],
    rule: {
      match: /<\/head>/i,
      fn: function(snippet, match) {
        return snippet + match;
      }
    }
  }
}
