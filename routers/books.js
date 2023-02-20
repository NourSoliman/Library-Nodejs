const express = require(`express`)
const Author = require("../models/Author")
const path = require(`path`)
const Book = require("../models/books")
const multer = require(`multer`)
const uploadPath = path.join(`public` , Book.imagePath)
const imagefiles = [`image/jpeg` , `image/png` , `image/gif`]
const upload = multer({
    dest: uploadPath, 
    fileFilter:(req , file , callback) => {
        callback(null ,imagefiles.includes(file.mimetype) )
    }
})
const router = express.Router()
router.get(`/` , async(req , res) => {
    let query = Book.find({})
    if(req.query.title != null && req.query.title != ``) {
        query = query.regex(`title` , new RegExp(req.query.title , (`i`)))
    }
    if(req.query.publishdatebefore != null && req.query.publishdatebefore != ``) {
        query = query.lte(`publishDate` , req.query.publishdatebefore)
    }
    if(req.query.publishdateafter != null && req.query.publishdateafter != ``) {
        query = query.lte(`publishDate` , req.query.publishdateafter)
    }
    try {
        const books = await query.exec()
        res.render(`books/index` , {
            books : books,
            Search : req.query
        })
    } 
    catch {
        res.redirect(`/`)
    }
})
router.get(`/new` , async(req , res) => {
    renderAnotherPage(res , new Book())
})
router.post(`/` ,upload.single(`cover`) , async (req , res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        description : req.body.description,
        publishDate : new Date(req.body.publishdate),
        pageCount : req.body.pagecount,
        coverImageName : fileName,
        author : req.body.author,
    }) 
    try {
        const newBook = await book.save()
        res.redirect(`books`)
    } catch {
        renderAnotherPage(res ,book, true)
    }

})
    async function renderAnotherPage(res , book , hasError = false ) {
        try {
        const authors = await Author.find({})
        const params = {
                authors : authors,
                book: book
        }
        if(hasError) params.errorMessage = `failed creating  book`
        res.render(`books/new` , params)
    } catch(error) {
        res.redirect(`/books`);
    }
    }
module.exports = router