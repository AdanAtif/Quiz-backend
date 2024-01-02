const jwt = require('jsonwebtoken');

const authorization = async (req, res, next) => {
    let token
    const {
        authorization
    } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]
            const userjwt = await jwt.verify(token, process.env.secertkey)
            if (userjwt) {
                req.user = userjwt
                next()
            } else {
                res.send({
                    status: "Failed",
                    message: "please login again"
                })
            }
        } catch (error) {
            console.log("error", error);
            res.status(500).send({
                "status": "Failed",
                "message": "Internal Srever error"
            })
        }
    }
    if (!token) {
        return res.status(401).send({
            "status": "Failed",
            "message": "Unauthorized User, No Token"
        })
    }
};
const adminauthorization = async (req, res, next) => {
    let token
    const {
        authorization
    } = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            token = authorization.split(' ')[1]
            const userjwt = await jwt.verify(token, process.env.secertkey)
            if (userjwt) {
                if (userjwt.email == "admin@gmail.com" && userjwt.admin == true) {
                    req.user = userjwt
                    next()
                } else {
                    res.status(401).send({
                        status: "Failed",
                        message: "Unauthorized Admin,please Login again"
                    })
                }
            } else {
                res.status(404).send({
                    status: "Failed",
                    message: "please login again"
                })
            }
        } catch (error) {
            console.log("error", error);
            res.status(500).send({
                "status": "Failed",
                "message": "Internal Srever error"
            })
        }
    }
    if (!token) {
        res.status(401).send({
            "status": "Failed",
            "message": "Unauthorized User"
        })
    }
};
module.exports = {
    authorization,
    adminauthorization,
}