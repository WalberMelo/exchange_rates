const express = require("express");
const app = express();
const HTTP_Port = 4000;

//DB init
const sequelize = require("./database");
sequelize
  .sync()
  .then(() => console.log("Data base created. Run node index.js"));

//register ejs view engine
app.set("view engine", "ejs");
app.set("views", "./app/views");

// MIDDLEWARE & STATIC
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Route
app.use("/", require("./app/routes/ratesRouter"));

//404 page not found
app.use((req, res) => {
  res.status(404).render("404", { title: "404 page not found" });
});

app.listen(HTTP_Port, () => {
  console.log(`Server is running Port http://localhost:${HTTP_Port}`);
});

//app.listen();
