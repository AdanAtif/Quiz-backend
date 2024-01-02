const express = require("express")
const routes = express.Router()
const {
    adminauthorization
} = require("../middleware/authorization")
const {
    getQuestion,
    addQuestion,
    deleteQuestion,
    updateQuestion
} = require("../controller/questioncontroller")

// public route
routes.post('/getQuestion', getQuestion)

// middleware
routes.post('/addQuestion', adminauthorization)
routes.post('/deleteQuestion', adminauthorization)
routes.post('/updateQuestion', adminauthorization)

// private route
routes.post('/addQuestion', addQuestion)
routes.post('/deleteQuestion', deleteQuestion)
routes.post('/updateQuestion', updateQuestion)



module.exports = routes