const express = require(`express`)
const Author = require("../models/author")
const path = require(`path`)
const Book = require("../models/books")
// const multer = require(`multer`)
const user = require(`../models/user`)
const router = express.Router()
const { isAuth } = require("../Helpers/authentication")
router.use(isAuth)
const imagefiles = [`image/jpeg` , `image/png` , `image/gif`]
// const upload = multer({
//     dest: uploadPath, 
//     fileFilter:(req , file , callback) => {
//         callback(null ,imagefiles.includes(file.mimetype) )
//     }
// })
router.get(`/` ,  async(req , res) => {
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
            Search : req.query,
            user:req.user
        })
    } 
    catch {
        res.redirect(`/`)
    }
})
router.get(`/new` , async(req , res) => {
    renderAnotherPage(res , new Book())
})
//Creating a new Book
router.post(`/` ,  async (req , res) => {
    
        const book = new Book({
        title: req.body.title,
        description : req.body.description,
        publishDate : new Date(req.body.publishdate),
        pageCount : req.body.pagecount,
        uploadedBy: req.user._id,
        author : req.body.author,
    }) 
    saveCover(book , req.body.cover)
    try {
        const newBook = await book.save()
        res.redirect(`books`)
    } catch(error) {
        console.log(error);
        renderAnotherPage(res ,book, true)
    }

})
    async function renderAnotherPage(res , book , hasError = false ) {
        renderFormPage(res, book , `new` , hasError)
}
//Edit Book
router.get(`/:id/edit` ,  async(req , res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderFormPage(res , book , `edit`)
    }
    catch(error) {
        console.log(error);
        res.redirect(`/`)
    }
})
//Update Book
router.put(`/:id` ,  async(req , res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        book.title = req.body.title,
        book.description  = req.body.description,
        book.publishDate  = new Date(req.body.publishdate),
        book.pageCount  = req.body.pagecount,
        book.author  = req.body.author
        if(req.body.cover != null && req.body.cover !== ``) {
            saveCover(book , req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    }
    catch(error) {
        console.log(error);
        if(book != null ) {
            renderAnotherPage(res ,book, true)
        } else {
            redirect(`/`)
        }
    }
})
// router.get(`/:id/edit` , async(req , res ) => {
//     renderFormPage(res , book , `edit` , hasError)
// })
//Render form Page edit and new ones 
    async function renderFormPage(res , book , form ,  hasError = false ) {
        try {
        const authors = await Author.find({})
        const params = {
                authors : authors,
                book: book,
                
                
        }
        if(hasError) {
            if(form === `edit`) {
                params.errorMessage = `failed Updating  book`
            } else {
                
                params.errorMessage = `failed Creating  book`
            }
        }
        res.render(`books/${form}` , params)
    } catch(error) {
        console.log(error);
        res.redirect(`/books`);
    }
}
//Show books page
    router.get(`/:id` ,  async (req , res) => {
        try {
        const book = await Book.findById(req.params.id).populate(`author`).exec();
        // const User = await user.findById(req.params.id).populate(`user`).exec();
        res.render(`books/show` , {
            book: book,
            req:req,
           

        })
        }
        catch(error) {
            console.log(error);
            res.redirect(`/`)
        }
    })
    function saveCover(book , coverEncoded) {
        if(!coverEncoded) return;
        try {
            const cover = JSON.parse(coverEncoded)
            if(cover != null && imagefiles.includes(cover.type)){
                book.coverImageName = Buffer.from(cover.data , `base64`)
                book.coverImageType = cover.type
            }
        } catch(error) {
            console.log(error);
        }
    }
    //Delete Book page
    router.delete(`/:id` ,  async(req , res) => {
        let book 
        try {
            book = await Book.findById(req.params.id)
            await book.remove()
            res.redirect(`/books`)
        }
        catch {
            if(book != null) {
                res.render(`books/show`,{
                    book : book,
                    errorMessage:`Couldnt remove book`
                })
            } else {
                res.redirect(`/`)
            }
        }
    })
module.exports = router