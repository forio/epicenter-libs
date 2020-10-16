
const watch = require('watch');
const liveServer = require('live-server');
const document = require('./document');

console.log('%c ehehehe', 'font-size: 20px; color: #FB15B9FF;', document);
watch.watchTree('../src', document);
watch.watchTree('templates/', document);

liveServer.start({
    port: 8000, // Set the server port. Defaults to 8080.
    host: 'local.forio.com', // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: './web', // Set root directory that's being served. Defaults to cwd.
    open: true, // When false, it won't load your browser by default.
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    // ignore: 'scss,my/templates', // comma-separated string for paths to ignore
    // file: "index.html", // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    // mount: [['/components', './node_modules']], // Mount a directory to a route.
    // middleware: [function(req, res, next) { next(); }], // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
});