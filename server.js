const express = require('express')
const router = express.Router()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const {BlogPosts} = require('./models')

const jsonParser = bodyParser.json()
const app = express()

app.use(morgan('common'))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE')
    if (req.method === 'OPTIONS') {
        return res.send(204)
    }
    next();
})

app.get('/blog-app-practice', (req, res) => {
    res.json(BlogPosts.get())
})

app.post('/blog-app-practice', jsonParser, (req, res) => {
    const requiredFields = ['title', 'content'];
    for (i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing ${field} in body`
            console.error(message)
            return res.status(400).send(message)
        }
    }
    const post = BlogPosts.create(req.body.title, req.body.content, req.body.publishDate)
    res.status(201).json(post)
})

app.delete('/blog-app-practice/:id', (req, res) => {
    BlogPosts.delete(req.params.id)
    console.log(`Deleted blog post ${req.params.id}`)
    res.status(204).end()
})

app.put('/blog-app-practice/:id', jsonParser, (req, res) => {
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