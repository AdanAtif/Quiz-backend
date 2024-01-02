const prismadb = require("../config/db.js")
const getQuiz = async (req, res) => {
    try {
        const {
            id
        } = req.body
        if (!id) {
            return res.send({
                "status": "Failed",
                "message": "Couldn't fint the id"
            })
        }
        const quiz = await prismadb.quiz.findUnique({
            where: {
                id,
            },
            include: {
                Question: true
            }
        })
        return res.status(201).send({
            "status": "success",
            "quiz": quiz
        });
    } catch (error) {
        console.log("----------------------------");
        console.log(error);
        console.log("---------------------------");
        return res.status(500).send({
            "status": "Failed",
            "message": "Internal server error, please try again"
        });
    }
}
const addResult = async (req, res) => {
    try {
        const {
            selectedOptions,
            quizId
        } = req.body;
        if (!selectedOptions || !quizId) {
            return res.send({
                "status": "Failed",
                "message": "Couldn't fint the id"
            })
        }
        // Retrieve user information
        const user = await prismadb.user.findUnique({
            where: {
                email: req.user.email
            }
        });

        if (!user) {
            return res.status(401).send({
                status: "Failed",
                message: "Unauthorized User, No Token"
            });
        }

        // Retrieve quiz questions
        const quizQuestions = await prismadb.question.findMany({
            where: {
                quizId: quizId
            },
            include: {
                CorrectOption: true
            }
        });

        // Calculate total marks and user's marks
        const totalMarks = quizQuestions.length;
        let userMarks = 0;
        const resultHistory = [];

        // Iterate through each question in the quiz
        for (const questionData of selectedOptions) {
            const questionId = questionData.id;
            const selectedOption = questionData.selectOption;

            // Find the corresponding question in the database
            const question = quizQuestions.find(q => q.id === questionId);

            // Check if the selected option is correct
            const isCorrect = question.CorrectOption.CorrectOption === selectedOption;

            // Update user's marks
            if (isCorrect) {
                userMarks++;
            }

            // Add result history for each question
            resultHistory.push({
                Question: question.Question,
                CorrectOption: question.CorrectOption.CorrectOption,
                SelectedOption: selectedOption
            });
        }

        // Add result to the database
        const result = await prismadb.result.create({
            data: {
                userId: user.id,
                quizId: quizId,
                total: totalMarks,
                mark: userMarks,
                ResultHistory: {
                    create: resultHistory
                }
            }
        });
        let id = result.id
        return res.status(200).send({
            "status": "success",
            "id": id
        });
    } catch (error) {
        console.log("----------------------------");
        console.log(error);
        console.log("---------------------------");
        return res.status(500).send({
            status: "Failed",
            message: "Internal server error, please try again"
        });
    }
};

const getResults = async (req, res) => {
    try {
        const user = await prismadb.user.findUnique({
            where: {
                email: req.user.email
            }
        })
        if (!user) {
            return res.status(401).send({
                "status": "Failed",
                "message": "Unauthorized User, No Token"
            })
        }
        const results = await prismadb.result.findMany({
            where: {
                userId: user.id,
            },
            include: {
                Quiz: true,
            }
        })
        if (!results) {
            return res.send({
                "status": "Noresults",
                "results": [],
            })
        }
        return res.send({
            "status": "success",
            "results": results
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
const getResult = async (req, res) => {
    try {
        const {
            id
        } = req.body
        if (!id) {
            return res.send({
                "status": "Failed",
                "message": "Couldn't fint the id"
            })
        }
        const user = await prismadb.user.findUnique({
            where: {
                email: req.user.email
            }
        })
        if (!user) {
            return res.status(401).send({
                "status": "Failed",
                "message": "Unauthorized User, No Token"
            })
        }
        const Result = await prismadb.result.findUnique({
            where: {
                id,
                userId: user.id
            },
            include: {
                ResultHistory: true
            }
        })
        return res.send({
            "status": "success",
            "result": Result
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
    addResult,
    getResult,
    getResults,
    getQuiz,
}