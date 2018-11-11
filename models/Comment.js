let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let CommentSchema = new Schema({
    text: String
});

let Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;