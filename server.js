const express = require('express')
const router = express.Router()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const {BlogPosts} = require('./models')

const jsonParser = bodyParser.json()
const app = express()

app.use(morgan('common'))

app.get('/blog-posts', (req, res) => {
    res.json(BlogPosts.get())
})

app.post('/blog-posts', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content', 'author'];
    for (i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in body`
            console.error(message)
            return res.status(400).send(message)
        }
    }
    const post = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate)
    res.status(201).json(post)
})

app.delete('/blog-posts/:id', (req, res) => {
    BlogPosts.delete(req.params.id)
    console.log(`Deleted blog post ${req.params.id}`)
    res.status(204).end()
})

app.put('/blog-posts/:id', jsonParser, (req, res) => {
    console.log(`Updating blog post ${req.params.id}`)
    
    BlogPosts.update({
        id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    })
    res.status(204).end()

})

app.listen(8080, () => {
    console.log(`Your app is listening on port 8080`)
})