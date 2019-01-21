const uuid = require('uuid');
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true}
})

blogPostSchema.methods.serialize = function() {
  return {
    id: this._id,
    title: this.title,
    content: this.content
  }
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema)
module.exports = {BlogPost};