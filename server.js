let express = require("express");
let mongoose = require("mongoose");

let axios = require("axios");
let cheerio = require("cheerio");

let app = express();
let db = require("./models");

let PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

let MONGODB_URI = process.env.MONGOLAB_AMBER_URI || "mongodb://localhost/newsScraper";
mongoose.connect(MONGODB_URI);

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require('./routes/api-routes.js')(app);
require('./routes/html-routes.js')(app);

axios.get("https://www.theonion.com/").then(function(response) {

  let $ = cheerio.load(response.data);
  
  $("article.postlist__item").each(function(i, element) {

    let title = $(element).find("header").find("a").first().text();
    let link = $(element).find("header").find("a").attr("href");
    let summary = $(element).find(".item__content").find(".entry-summary").find("p").first().text();
    let photo = $(element).find(".item__content").find("figure").find("a").find(".img-wrapper").find("picture").find("source:nth-child(2)").attr("data-srcset")

    db.Article.create({
      title: title,
      link: link,
      summary: summary,
      photo: photo
    }).then(function(dbArticle){
        console.log(dbArticle);
    })
    .catch(function(err){
        console.log(err);
    });
  });
  res.send("Scrape Complete");
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});


