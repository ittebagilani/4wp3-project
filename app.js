const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");

const app = express();
const projectController = require("./controllers/projectController");

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", projectController);

app.listen(3000, () => {
    console.log("server running on http://localhost:3000")
})