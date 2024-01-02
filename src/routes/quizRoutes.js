const express = require("express")
const routes = express.Router()
const {
   adminauthorization
} = require("../middleware/authorization")
const {
   addQuiz,
   getQuiz,
   deleteQuiz,
   updateQuiz
} = require("../controller/quizcontroller")


// public routes
routes.get('/getQuiz', getQuiz)

// middleware
routes.post('/addQuiz', adminauthorization)
routes.post('/deleteQuiz', adminauthorization)
routes.post('/updateQuiz', adminauthorization)

// private route
routes.post('/addQuiz', addQuiz)
routes.post('/deleteQuiz', deleteQuiz)
routes.post('/updateQuiz', updateQuiz)



module.exports = routes