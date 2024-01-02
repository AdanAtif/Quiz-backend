const express = require("express")
const routes = express.Router()
const {
    login,
    Signup,
    User
} = require("../controller/authcontroller")
const {
    authorization
 } = require("../middleware/authorization")
// public routes
routes.post('/signup', Signup)
routes.post('/login', login)
routes.post('/user', authorization)
// private route
routes.post('/user', User)


module.exports = routes
