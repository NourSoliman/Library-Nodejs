const express = require(`express`)
const Author = require("../models/Author")
const router = express.Router()
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
router.get(`/new` , (req , res) => {
    res.render(`authors/new` , {author : new Author()})
})
router.post(`/` , async (req , res) => {
    const author =  new Author({
        name:req.body.name
    })
    try{
        const newAuthor = await author.save()
        res.redirect(`authors/`)
    } catch {
        res.render(`authors/new` , {
            author: author,
            errorMessage:`Something Went Wrong!`
        })
    }
    // author.save((err , newAuthor) => {
    //     if(err) {
    //         res.render(`authors/new` , {
    //             author: author,
    //             errorMessage:"Something Went Wrong!"
    //         })
    //     } else {
    //         res.redirect(`authors`)
    //     }
    // })
})
module.exports = router