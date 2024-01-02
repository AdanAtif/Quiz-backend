const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prismadb = require("../config/db.js")

const Signup = async (req, res) => {
    const {
        username,
        email,
        password,
    } = req.body
    try {
        if (!username || !email || !password) {
            return res.send({
                "status": "Failed",
                "message": "please fill all field"
            })
        }
        const user = await prismadb.user.findUnique({
            where: {
                email: email
            }
        })
        if (user) {
            return res.send({
                "status": "Failed",
                "message": "this email is already Logged in"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const Hashpassword = await bcrypt.hash(password, salt)
        await prismadb.user.create({
            data: {
                username,
                email,
                password: Hashpassword
            }
        })

        const savedUser = await prismadb.user.findUnique({
            where: {
                email,
            }
        })
        // creating token
        const saveduser = {
            email: savedUser.email,
            username: savedUser.username,
            admin: savedUser.admin,
        }
        const token = await jwt.sign(saveduser, process.env.secertkey)
        return res.send({
            "status": "success",
            "token": token,
            "user": saveduser,
        })


    } catch (error) {
        console.log("----------------------------");
        console.log(error);
        console.log("---------------------------");
        return res.send({
            "status": "Failed",
            "message": "Something went wrong please try again"
        })
    }

}


const login = async (req, res) => {
    const {
        email,
        password
    } = req.body
    try {
        if (!email || !password) {
            return res.send({
                status: "Failed",
                message: "Please fill all the fields"
            })
        }
        const user = await prismadb.user.findUnique({
            where: {
                email,
            }
        })

        if (!user) {
            return res.send({
                status: "Failed",
                message: "Email is not registoredq"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.send({
                status: "Failed",
                message: "Email or Password is inCorrect"
            })
        }
        const saveduser = {
            email: user.email,
            username: user.username,
            admin: user.admin,
        }
        const token = jwt.sign(saveduser, process.env.secertkey)
        return res.send({
            status: "success",
            token: token,
            "user": saveduser,
        })
    } catch (error) {
        console.log("----------------------------");
        console.log(error.message);
        console.log("---------------------------");
        return res.send({
            "status": "Failed",
            "res":error,
            "message": "Something went wrong please try again 12"
        })
    }
};
const User = async (req, res) => {
    try {
        return res.send({
            "status": "success",
            "user": req.user,
        })
    } catch (error) {
        console.log("----------------------------");
        console.log(error);
        console.log("---------------------------");
    }
};



module.exports = {
    Signup,
    login,
    User,
}
