let db = require('../models');

module.exports = function(app){

    app.get("/", function(req, res){
        db.Article.find({}).sort({created: -1})
        .populate("comments")
        .then((result) => {
            let articleObj = {
                article: result
            }
            res.render("index", articleObj);
        })
    });
}