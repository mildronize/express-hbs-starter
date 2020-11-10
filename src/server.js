var express = require("express");
var createError = require("http-errors");
var handlebars = require("express-handlebars");
var sassMiddleware = require("node-sass-middleware");

var livereloadMiddleware = require("connect-livereload");
var livereload = require("livereload");
const livereloadPort = 35729;

var path = require("path");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  handlebars({
    extname: "hbs",
    defaultView: "main",
    layoutsDir: path.join(__dirname, "/views/layouts/"),
    partialsDir: path.join(__dirname, "/views/partials/"),
    helpers: {
      liveReloadPort: livereloadPort
    },
  })
);

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", function (req, res) {
  res.render("home");
});

app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  })
);

// Create a livereload server
const hotServer = livereload.createServer({
  // Reload on changes to these file extensions.
  exts: ["hbs"],
  // Print debug info
  debug: true,
});

// Specify the folder to watch for file-changes.
hotServer.watch(__dirname);
app.use(
  livereloadMiddleware({
    port: livereloadPort,
  })
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app.listen(5000);
