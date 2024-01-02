const prismadb = require("../config/db.js")
const addQuiz = async (req, res) => {
    const {
        title,
        description
    } = req.body
    if (!title || !description) {
        return res.send({
            "status": "Failed",
            "message": "please fill all field"
        })
    }
    try {
        const quiz = await prismadb.quiz.create({
            data: {
                title,
                description,
            }
        })
        return res.status(200).send({
            "status": "success",
            "quiz": quiz
        })
    } catch (error) {
        console.log("----------------------------");
        console.log(error);
        console.log("---------------------------");
        return res.status(500).send({
            "status": "Failed",
            "message": "Internal server error please try again"
        })
    }

}
const getQuiz = async (req, res) => {
    try {
        const quizs = await prismadb.quiz.findMany()
        return res.status(200).send({
            "status": "success",
            "quizs": quizs
        })
    } catch (error) {
        console.log("----------------------------");
        console.log(error);
        console.log("---------------------------");
        return res.status(500).send({
            "status": "Failed",
            "message": "Internal server error please try again"
        })
    }
}
const deleteQuiz = async (req, res) => {
    try {
        const {
            id
        } = req.body
        if (!id) {
            return res.send({
                "status": "Failed",
                "message": "Couldn't found the Card,Please try again"
            })
        }
        await prismadb.quiz.delete({
            where: {
                id
            },
            include: {
                Question: true,
                Result: true
            },
            
        });
        const quizs = await prismadb.quiz.findMany()
        return res.send({
            "status": "success",
            "quiz": quizs,
        });
    } catch (error) {
        console.log("----------------------------");
        console.log(error);
        console.log("---------------------------");
        return res.status(500).send({
            "status": "Failed",
            "message": "Internal server error, please try again1"
        })
    }
}
const updateQuiz = async (req, res) => {
    try {
        const {
            id,
            title,
            description
        } = req.body
        if (!id || !title || !description) {
            return res.send({
                "status": "Failed",
                "message": "please fill all fields"
            })
        }
        const updatedquiz = await prismadb.quiz.update({
            where: {
                id,
            },
            data: {
                title,
                description,
            }
        })
        const quizs = await prismadb.quiz.findMany()
        return res.send({
            "status": "success",
            "quiz": quizs,
        })
    } catch (error) {
        console.log("----------------------------");
        console.log(error);
        console.log("---------------------------");
        res.status(500).send({
            "status": "Failed",
            "message": "Internal server error, please try again"
        })
    }
}
module.exports = {
    addQuiz,
    getQuiz,
    deleteQuiz,
    updateQuiz,
}