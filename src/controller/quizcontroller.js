const prismadb = require("../config/db.js");
const addQuiz = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.send({
      status: "Failed",
      message: "please fill all field",
    });
  }
  try {
    const quiz = await prismadb.quiz.create({
      data: {
        title,
        description,
      },
    });
    return res.status(200).send({
      status: "success",
      quiz: quiz,
    });
  } catch (error) {
    console.log("----------------------------");
    console.log(error);
    console.log("---------------------------");
    return res.status(500).send({
      status: "Failed",
      message: "Internal server error please try again",
    });
  }
};
const getQuiz = async (req, res) => {
  try {
    const quizs = await prismadb.quiz.findMany();
    return res.status(200).send({
      status: "success",
      quizs: quizs,
    });
  } catch (error) {
    console.log("----------------------------");
    console.log(error);
    console.log("---------------------------");
    return res.status(500).send({
      status: "Failed",
      message: "Internal server error please try again",
    });
  }
};
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.send({
        status: "Failed",
        message: "Please provide a valid quiz ID",
      });
    }
    const existingQuiz = await prismadb.quiz.findUnique({
      where: {
        id,
      },
      include: {
        Question: {
          include: {
            CorrectOption: true,
          },
        },
        Result: {
          include: {
            ResultHistory: true,
          },
        },
      },
    });

    if (!existingQuiz) {
      return res.send({
        status: "Failed",
        message: "Quiz not found",
      });
    }
    await Promise.all(
      existingQuiz.Question.map(async (question) => {
        await prismadb.correctOption.delete({
          where: {
            questionId: question.id,
          },
        });
        return prismadb.question.delete({
          where: {
            id: question.id,
          },
        });
      })
    );

    await Promise.all(
      existingQuiz.Result.map(async (result) => {
        await Promise.all(
          result.ResultHistory.map(async (resultHistory) => {
            return prismadb.resultHistory.delete({
              where: {
                id: resultHistory.id,
              },
            });
          })
        );
        return prismadb.result.delete({
          where: {
            id: result.id,
          },
        });
      })
    );

    await prismadb.quiz.delete({
      where: {
        id,
      },
    });

    const quizs = await prismadb.quiz.findMany();

    return res.send({
      status: "success",
      message: "Quiz and associated data deleted successfully",
      quizs,
    });
  } catch (error) {
    console.log("----------------------------");
    console.log(error);
    console.log("---------------------------");
    res.status(500).send({
      status: "Failed",
      message: "Internal server error, please try again",
    });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { id, title, description } = req.body;
    if (!id || !title || !description) {
      return res.send({
        status: "Failed",
        message: "please fill all fields",
      });
    }
    const updatedquiz = await prismadb.quiz.update({
      where: {
        id,
      },
      data: {
        title,
        description,
      },
    });
    const quizs = await prismadb.quiz.findMany();
    return res.send({
      status: "success",
      quiz: quizs,
    });
  } catch (error) {
    console.log("----------------------------");
    console.log(error);
    console.log("---------------------------");
    res.status(500).send({
      status: "Failed",
      message: "Internal server error, please try again",
    });
  }
};
module.exports = {
  addQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
};

// const deleteQuiz = async (req, res) => {
//   try {
//     const { id } = req.body;
//     console.log("Received request to delete quiz with ID:", id);

//     if (!id) {
//       console.error("Invalid request: Quiz ID is missing.");
//       return res.send({
//         status: "Failed",
//         message: "Couldn't find the quiz. Please provide a valid ID.",
//       });
//     }
//     const resultData = await prismadb.result.findMany({
//       where: {
//         quizId: id,
//       },
//       select: {
//         id: true,
//       },
//     });

//     // Fetch resultIds associated with the quiz
//     const resultIds = await prismadb.result
//       .findMany({
//         where: {
//           quizId: id,
//         },
//         select: {
//           id: true,
//         },
//       })
//       .map((result) => result.id);

//     console.log("Deleting resulthistory for quiz with ID:", id);
//     await prismadb.resultHistory.deleteMany({
//       where: {
//         resultId: { in: resultIds },
//       },
//     });

//     console.log("Deleting result for quiz with ID:", id);
//     await prismadb.result.deleteMany({
//       where: {
//         quizId: id,
//       },
//     });

//     console.log("Deleting questions for quiz with ID:", id);
//     await prismadb.question.deleteMany({
//       where: {
//         quizId: id,
//       },
//     });

//     console.log("Deleting quiz with ID:", id);
//     await prismadb.quiz.delete({
//       where: {
//         id,
//       },
//     });

//     const quizzes = await prismadb.quiz.findMany();
//     console.log("Quiz deleted successfully.");
//     return res.send({
//       status: "success",
//       quizs: resultIds,
//     });
//   } catch (error) {
//     // console.error("Error during quiz deletion:", error);
//     // return res.status(500).send({
//     //   status: "Failed",
//     //   message: "Internal server error. Please try again.",
//     // });
//     console.error("Error during quiz deletion:", error);

//     // Log the detailed error message
//     console.error(error);

//     return res.status(500).send({
//       status: "Failed",
//       message: "Internal server error. Please try again.",
//     });
//   }
// };
