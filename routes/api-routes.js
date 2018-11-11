let db = require('../models');

module.exports = function(app){

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

    app.delete("/comment/:id", function(req, res){
        db.Comment.remove({"_id": req.params.id})
        .then(function(result){
            res.json(result)
        })
        .catch(function(err){
        res.json(err);
        })
    })


}