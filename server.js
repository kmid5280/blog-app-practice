const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {PORT, DATABASE_URL} = require('./config')
const {BlogPost} = require('./models')
const cors = require('cors')
const jsonParser = bodyParser.json()
const app = express()

mongoose.Promise = global.Promise

app.use(morgan('common'))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With,Accept')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE')
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204)
    }
    next();
})

app.use(express.static('public'))

app.get('/blog-app-practice', (req, res) => {
    BlogPost
        .find()
        .then(posts => {
            res.json(posts.map(post => post.serialize()))
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({error: 'error'})
        })
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

    BlogPost
        .create({
            title: req.body.title,
            content: req.body.content,
        })
        .then(blogPost => res.status(201).json(blogPost.serialize()))
        .catch(err => {
            console.error(err)
            res.status(500).json({error: 'error'})
        })
})

app.delete('/blog-app-practice/:id', (req, res) => {
    BlogPost
        .findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).json({message: 'success'})
        })
        .catch(err => {
            console.error(err)
            res.status(500).json({error: 'error'})
        })
    console.log(`Deleted blog post ${req.params.id}`)
})

app.put('/blog-app-practice/:id', jsonParser, (req, res) => {
    if (!(req.params.id && req.body.id && (req.params.id === req.body.id))) {
        res.status(400).json({
            error: `Request path id and body id must match`
        })
    }

    const updated = {}
    const updateablefields = ['title', 'content']
    updateablefields.forEach(field => {
        if (field in req.body) {
            updated[field] = req.body[field]
        }
    })

    BlogPost
        .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
        .then(updatedPost => res.status(204).end())
        .catch(err => res.status(500).json({message: 'error'}))
})

let server;

function runServer(databaseURL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseURL, {useNewUrlParser: true}, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`)
                resolve()
            })
            .on('error', err => {
                mongoose.disconnect();
                reject(err)
            })
        })
    })
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('closing server')
            server.close(err => {
                if (err) {
                    return reject(err)
                }
                resolve()
            })
        })
    })
}

if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err))
}

module.exports = {app, runServer, closeServer}

/*app.listen(8080, () => {
    console.log(`Your app is listening on port 8080`)
})*/