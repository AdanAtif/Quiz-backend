const express = require("express")
const routes = express.Router()
const {
    authorization
} = require("../middleware/authorization")
const {
    addResult,
    getResult,
    getResults,
    getQuiz
} = require("../controller/usercontroller")



// middleware
routes.post('/addResult', authorization)
routes.post('/getResult', authorization)
routes.post('/getResults', authorization)
routes.post('/getQuiz', authorization)

// private route
routes.post('/addResult', addResult)
routes.post('/getResult', getResult)
routes.post('/getResults', getResults)
routes.post('/getQuiz', getQuiz)



module.exports = routes