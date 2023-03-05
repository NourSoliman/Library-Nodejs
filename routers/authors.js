const express = require(`express`)
const Author = require("../models/author")
const router = express.Router()
const Books = require(`../models/books`)
//index router
router.get(`/` , async(req , res) => {
    let Search = {}
    if(req.query.name !=null && req.query.name !== ``) {
        Search.name = new RegExp(req.query.name , `i`)
    }
    try {
        const authors = await Author.find(Search)
        res.render(`authors/index` , {authors : authors , Search:req.query})
    } catch {
        res.redirect(`/`);
    }
})
//new author page
router.get(`/new` , (req , res) => {
    res.render(`authors/new` , {author : new Author()})
})
router.post(`/` , async (req , res) => {
    const author =  new Author({
        name:req.body.name
    })
    try{
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render(`authors/new` , {
            author: author,
            errorMessage:`Something Went Wrong!`
        })
    }
})
//show authors page
router.get(`/:id` , async (req , res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Books.find({author : author.id}).limit(6).exec()
        res.render(`authors/show` ,{
            author : author,
            booksByAuthor : books
        })
    }
    catch {
        res.redirect(`/`)
    }
})
// edit authors 
router.get(`/:id/edit` ,async (req , res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render(`authors/edit` , {author : author})
    } 
    catch {
        
        res.redirect(`/authors`)
    }
})
router.put(`/:id` , async (req , res) => {
    let author 
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${author.id}`)
    } 
    catch {
        if(author == null ) {
            res.redirect(`/`)
        }
        res.render(`authors/edit` , {
            author : author,
            errorMessage : `Failed Updating Author`
        })
    }
})
//delete authors
router.delete(`/:id`  , async (req , res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect(`/authors`)
    } 
    catch {
        if (author == null) {
            res.redirect(`/`)
        } else {
            res.redirect(`/authors/${author.id}`)
        }

    }
    // Author.findByIdAndDelete(req.params.id)
    // .then(result => {
    //     res.json({redirect:`/authors`}) 
    // })
    // .catch(error => {
    //     console.log(error);
    // })
})
module.exports = router