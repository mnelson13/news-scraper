let db = require('../models');
let axios = require("axios");
let cheerio = require("cheerio");
var mongojs = require("mongojs");

module.exports = function(app){

    //route to scrape for new articles
    app.get("/scrape", function(req, res) {
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
        })
    });

    //route to create a new comment for an article
    app.post("/article/:id", function(req, res){
        db.Comment.create(req.body)
            .then(function(dbComment){
                return db.Article.findOneAndUpdate({_id: req.params.id }, { $push: {comments: dbComment._id}}, { new: true});
            })
            .then(function(dbArticle){
                res.json(dbArticle);
            })
            .catch(function(err){
                res.json(err);
            }
        )
    })

    //route to get all articles populated with all comments
    app.get("/populated", function(req, res){
        db.Article.find({})
        .populate("comments")
        .then((result) => {
            res.json(result)
        })
        .catch(function(err){
            res.json(err);
        })
    });

    //route to delete a comment
    app.delete("/comment/:id", function(req, res){
        db.Comment.remove({"_id": req.params.id})
        .then(function(result){
            res.json(result)
        })
        .catch(function(err){
        res.json(err);
        })
    })

    //route to update saved to true for an article
    app.put("/article/save/:id", function(req, res){
        db.Article.update({"_id": mongojs.ObjectId(req.params.id)}, {$set: {"saved": true}}, function(err,data){
            if(err){
              console.log(err);
            } else {
              res.json(data);
            }
        })
    })

    //route to update saved to false for an article
    app.put("/article/unsave/:id", function(req, res){
        db.Article.update({"_id": mongojs.ObjectId(req.params.id)}, {$set: {"saved": false}}, function(err,data){
            if(err){
              console.log(err);
            } else {
              res.json(data);
            }
        })
    })

}