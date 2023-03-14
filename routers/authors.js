const express = require(`express`)
const Author = require("../models/author")
const router = express.Router()
const Books = require(`../models/books`)
const passport = require('passport');
// const authMiddleware = require(`../middleware`)
// router.use(authMiddleware);
const { isAuth } = require("../Helpers/authentication")

//index router
router.get(`/`, isAuth ,  async(req , res) => {
    
    let Search = {}
    if(req.query.name !=null && req.query.name !== ``) {
        Search.name = new RegExp(req.query.name , `i`)
    }
    try {
        const authors = await Author.find(Search)
        res.render(`authors/index` , {authors : authors , Search:req.query , req:req , user :req.user})
    } catch {
        res.redirect(`/`);
    }
})
//new author page
router.get(`/new`  , isAuth ,   (req , res) => {
    
    res.render(`authors/new` , {author : new Author()})
})
router.post(`/` ,  async(req , res) => {
    const author =  new Author({
        name:req.body.name,
        user:req.user.id
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
router.get(`/:id` , isAuth ,   async (req , res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Books.find({author : author.id}).limit(6).exec()

        res.render(`authors/show` ,{
            author : author,
            booksByAuthor : books,
            currentUser:req.user,
            req:req
        })
    }
    catch {
        res.redirect(`/`)
    }
})
// edit authors 
router.get(`/:id/edit`,  isAuth ,  async (req , res) => {
    try {
        const author = await Author.findById(req.params.id)
        if (!author.user.equals(req.user.id)) {
            return res.redirect('/')
        }
        res.render(`authors/edit` , {author : author})
    } 
    catch {
        
        res.redirect(`/authors`)
    }
})
router.put(`/:id` , isAuth ,  async (req , res) => {
    let author 
    try{
        author = await Author.findById(req.params.id)
        if(!author.user.equals(req.user.id)){
            res.redirect(`/`)
        }
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
router.delete(`/:id` , isAuth ,  async (req , res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        if(author.user.toString() !== req.user.id.toString() && req.user.role !== `admin`){
            return res.send(`Unauthorized` , {error : `You are not the Owner of this Author`})
        }
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

})
module.exports = router