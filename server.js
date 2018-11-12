let express = require("express");
let mongoose = require("mongoose");

let app = express();

var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI);

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app);

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});


