// 1 request = 1 render (otherwise errors)

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

let counter = 0;

// What is a middleware?
// => It's a function with 3 parmaters: req, res, next

// How to spot a middleware?
// - When it's a function of (req,res,next)
// - app.use(blablba) => blabla is a middleware

// Middleware that defines req.body
app.use(bodyParser.urlencoded({ extended: true }));

// My first own middleware, executed for any request
app.use((req, res, next) => {
  console.log("This is my 1st middleware 🎉", req.color);
  next(); // Go to the next middleware
});

app.use((req, res, next) => {
  console.log("This is my 2nd middleware", req.color);
  req.color = "green";

  next(); // Go to the next middleware
});

app.use((req, res, next) => {
  console.log("This is my 3rd middleware", req.color);
  next(); // Go to the next middleware
});

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use((req, res, next) => {
  counter++;
  res.locals.city = "Lisbon"; // Define a view variable named "city" (in HBS => {{city}})
  res.locals.counter = counter; // Define a view variable named "counter" (in HBS => {{counter}})
  next();
});

// Middleware executed only when the page is "GET /"
app.get("/", (req, res, next) => {
  res.render("index", {
    message: req.query.errorMessage
  });
  // next();
});

// app.get("/", (req, res, next) => {
//   res.render("in-construction");
// });

// // Version 1
// app.post("/login", (req, res, next) => {
//   console.log("req.body", req.body);
//   let username = req.body.username;
//   let password = req.body.password;
//   let message = "";
//   if (username === "maxence" && password === "chartreuse") {
//     message = "Welcome Maxence";
//   } else {
//     message = "Go away!";
//   }
//   res.render("post-login", { message: message });
// });

// Version 2
app.post("/login", (req, res, next) => {
  console.log("DEBUG req.body", req.body);
  let username = req.body.username;
  let password = req.body.password;
  if (username === "maxence" && password === "chartreuse") {
    // Redirect to "GET http://localhost:3000/success-login"
    res.redirect("/success-login");
  } else {
    ``;
    // Go to the route "GET /" and give a `req.query.errorMessage`
    res.redirect("/?errorMessage=Wrong Credentials");
  }
});

// Something is missing: we can access this page even if we are not logged in
// We will solve this issue in week 5
app.get("/success-login", (req, res, next) => {
  res.render("success-login");
});

app.listen(3000, () => {
  console.log("App running on http://localhost:3000");
});
