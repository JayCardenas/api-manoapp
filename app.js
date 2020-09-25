var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// ---- From tutorial on connecting sqlite3 with express.js
var sqlite3 = require("sqlite3").verbose();

// open databse connection
var db = new sqlite3.Database("./database/api_database.db", (err) => {
  if (err) {
    return console.log(err.message);
  }

  console.log("Connected to the api SQlite database");
}); // Databse object (the sqlite3.Database() returns obj with db connection automatically )

db.serialize(() => {
  // Queries scheduled here will be serialized.
  db.run("CREATE TABLE greetings(message text)")
    .run(
      `INSERT INTO greetings(message)
          VALUES('Hi'),
                ('Hello'),
                ('Welcome')`
    )
    .each(`SELECT message FROM greetings`, (err, row) => {
      if (err) {
        throw err;
      }
      console.log(row.message);
    });
});
// close database connection
db.close((err) => {
  if (err) {
    return console.log(err.message);
  }
  console.log("Close the databse connection");
});

// -------------------------------------------------------------------------------------------

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

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

module.exports = app;
