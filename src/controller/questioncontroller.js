const prismadb = require("../config/db.js")

const addQuestion = async (req, res) => {
    const {
        correctOption,
        id,
        OptionOne,
        OptionTwo,
        OptionThree,
        question
    } = req.body
    if (!correctOption || !OptionOne || !OptionTwo || !OptionThree || !id || !question) {
        return res.send({
            "status": "Failed",
            "message": "please fill all field"
        })
        // checking if all fields are fields
    }
    if (OptionOne === OptionTwo || OptionOne === OptionThree || OptionTwo === OptionThree) {
        return res.status(400).send({
            "status": "Failed",
            "message": "Options must be unique"
        });
        // Options should be different from each other
    }
    if (correctOption !== OptionOne && correctOption !== OptionTwo && correctOption !== OptionThree) {
        return res.status(400).send({
            "status": "Failed",
            "message": "CorrectOption must be one of the provided options"
        });
        // Correct option must be same with one other option
    }
    try {
        await prismadb.question.create({
            data: {
                quizId: id,
                Question: question,
                OptionOne: OptionOne,
                OptionTwo: OptionTwo,
                OptionThree: OptionThree,
                CorrectOption: {
                    create: {
                        CorrectOption: correctOption,
                    },
                },
            }
        })
        return res.status(204).send()
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
const getQuestion = async (req, res) => {
    try {
        const {
            id
        } = req.body
        if (!id) {
            return res.status(404).send({
                "status": "Failed",
                "message": "Counldn't not find id"
            })
        }
        const questions = await prismadb.question.findMany({
            where: {
                quizId: id
            },
            include: {
                CorrectOption: true
            }
        })
        return res.status(200).send({
            "status": "success",
            "question": questions
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
const deleteQuestion = async (req, res) => {
    try {
        const {
            id,QuizId
        } = req.body
        if (!id) {
            return res.send({
                "status": "Failed",
                "message": "Couldn't found the Question,Please try again"
            })
        }
        await prismadb.correctOption.delete({
            where: {
                questionId: id
            }
        })
        await prismadb.question.delete({
            where: {
                id,
            },
        })
        const questions = await prismadb.question.findMany(
            {
                where:{
                    quizId:QuizId,
                }
            }
        )
        return res.status(200).send({
            "status": "success",
            "question": questions,
        })
    } catch (error) {
        console.log("----------------------------");
        console.log(error);
        console.log("---------------------------");
        res.status(500).send({
            "status": "Failed",
            "message": "Internal server error, please try again1"
        })
    }
}
const updateQuestion = async (req, res) => {
    try {
        const {
            correctOption,
            id,
            OptionOne,
            OptionTwo,
            OptionThree,
            question,
            QuizId
        } = req.body
        if (!correctOption || !OptionOne || !OptionTwo || !OptionThree || !id || !question ||!QuizId) {
            return res.send({
                "status": "Failed",
                "message": "please fill all fields"
            })
        }
        await prismadb.correctOption.update({
            where:{
                questionId:id
            },
            data:{
                CorrectOption:correctOption
            }
        })
        await prismadb.question.update({
            where: {
                id
            },
            data: {
                Question: question,
                OptionOne: OptionOne,
                OptionTwo: OptionTwo,
                OptionThree: OptionThree,
            }
        })
        const questions = await prismadb.question.findMany({
            where:{
                quizId:QuizId
            }
        })
        return res.status(200).send({
            "status": "success",
            "question": questions,
        })
    } catch (error) {
        console.log("----------------------------");
        console.log(error);
        console.log("---------------------------");
        return res.status(500).send({
            "status": "Failed",
            "message": "Internal server error, please try again"
        })
    }
}
module.exports = {
    addQuestion,
    getQuestion,
    deleteQuestion,
    updateQuestion,
}
