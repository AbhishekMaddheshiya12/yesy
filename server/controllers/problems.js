import axios from "axios";
// import problems from "../fakeData/problems.js";
import { Problem } from "../models/problems.js";
import { User } from "../models/user.js";
import { GoogleGenAI } from "@google/genai";

const encodeBase64 = (str) => {
  return btoa(
    new TextEncoder()
      .encode(str)
      .reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
};
const getAllProblem = async (req, res) => {
  try {
    const problems = await Problem.find({});
    // console.log(problems);
    return res.status(200).json(problems);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const getSubmissionResult = async (tokens) => {
  console.log(tokens);
  try {
    const options = {
      method: "GET",
      url: "https://judge0-extra-ce.p.rapidapi.com/submissions/batch",
      params: {
        tokens: tokens?.join(","),
        base64_encoded: "true",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": "bb2e866215msh150f4914a869517p1f7dc2jsn6c612857138c",
        "x-rapidapi-host": "judge0-extra-ce.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const { submissions } = response.data;

    if (!submissions || submissions.length === 0) {
      console.error("No submissions returned.");
      return [];
    }
    const results = [];
    const processingTokens = [];
    let hasFailure = false;
    let failureStatus = "Accepted";

    submissions.forEach((submission, index) => {
      if (!submission || submission.status.description === "Processing") {
        processingTokens.push(tokens[index]);
      } else {
        const status = submission.status.description;
        results.push({
          id: index + 1,
          status,
          stdout: atob(submission.stdout || ""),
          stderr: atob(submission.stderr || ""),
        });

        if (status !== "Accepted" && !hasFailure) {
          hasFailure = true;
          failureStatus = status;
        }
      }
    });

    // console.log("Processed Results:", results);

    if (processingTokens.length > 0) {
      // console.log(
      //   `Retrying for ${processingTokens.length} submissions still processing...`
      // );
      const retryResults = await getSubmissionResult(processingTokens);
      results.push(...(retryResults.results || []));

      if (retryResults.hasFailure && !hasFailure) {
        hasFailure = true;
        failureStatus = retryResults.failureStatus;
      }
    }

    // console.log("Final Results:", results);
    return {
      results,
      hasFailure,
      failureStatus,
    };
  } catch (error) {
    console.error("Error fetching batch results:" + error);
    return {
      results: [],
      hasFailure: true,
      failureStatus: "Failed to fetch",
    };
  }
};

const judgeSubmission = async (req, res) => {
  try {
    const { language_id, base64EncodedCode, problemId } = req.body;
    if (!language_id || !base64EncodedCode || !problemId) {
      return res.status(400).json({
        success: false,
        message: "Not enough data",
      });
    }
    const problems = await Problem.find({});
    const problemdata = problems.find((problem) => problem.id == problemId);
    const testCases = problemdata.testCases;

    const submissions = testCases.map((test) => ({
      language_id: language_id,
      source_code: base64EncodedCode,
      stdin: encodeBase64(test.input),
      expected_output: encodeBase64(test.expectedOutput),
      callback_url: "https://localhost:4000/user/judge0-callback",
    }));

    const options = {
      method: "POST",
      url: "https://judge0-extra-ce.p.rapidapi.com/submissions/batch",
      params: {
        base64_encoded: true,
        wait: "false",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": "bb2e866215msh150f4914a869517p1f7dc2jsn6c612857138c",
        "x-rapidapi-host": "judge0-extra-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: { submissions },
    };

    const response = await axios.request(options);
    // console.log("Batch Submission Response:", response.data);

    if (response.data) {
      const tokens = response.data.map((submission) => submission.token);
      console.log(tokens);
      const finalResult = await getSubmissionResult(tokens);
      const { results, hasFailure, failureStatus } = finalResult;
      // console.log(finalResult);
      // console.log("Your father is checking your report" + results);

      const updatedTestCases = testCases.map((testCase, index) => ({
        ...testCase,
        status: results[index]?.status || "Unknown",
        stdout: results[index]?.stdout || "",
      }));

      return res.status(200).json({
        success: true,
        updatedTestCases,
        results,
        hasFailure,
        failureStatus,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Gadbad yha hai chutiye",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Kuch to gadbad hai daya",
    });
  }
};

const handleLikes = async (req, res) => {
  try {
    const userId = req.user;
    const problemId = req.params.problemId;

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(400).json({
        success: false,
        message: "Problem Not Found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    if (problem.likes.includes(userId)) {
      const index = problem.likes.indexOf(userId);
      problem.likes.splice(index, 1);
      await problem.save();
      return res.status(200).json({
        success: true,
        message: "Problem Unliked Successfully",
      });
    }

    problem.likes.push(userId);
    await problem.save();
    return res.status(200).json({
      success: true,
      message: "Problem Liked Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const handleDislikes = async (req, res) => {
  try {
    const userId = req.user;
    const problemId = req.params.problemId;

    const problem = await Problem.findById(problemId);

    if (!problem) {
      return res.status(400).json({
        success: false,
        message: "Problem Not Found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    if (problem.dislikes.includes(userId)) {
      const index = problem.dislikes.indexOf(userId);
      problem.dislikes.splice(index, 1);
      await problem.save();
      return res.status(200).json({
        success: true,
        message: "Problem Undisliked Successfully",
      });
    }

    problem.dislikes.push(userId);
    await problem.save();
    return res.status(200).json({
      success: true,
      message: "Problem Disliked Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getSpecificProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const problem = await Problem.find({ id: problemId });
    return res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getLikes = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const userId = req.user;

    const problem = await Problem.findOne({ id: problemId }); 

    if (!problem) {
      return res.status(400).json({
        success: false,
        message: "Problem Not Found",
      });
    }

    const likes = problem.likes?.length || 0;
    const dislikes = problem.dislikes?.length || 0;
    const userLike = problem.likes.includes(userId);
    const userDislike = problem.dislikes.includes(userId);

    return res.status(200).json({
      success: true,
      message: "Likes Fetched Successfully",
      likes,
      dislikes,
      userLike,
      userDislike,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getSolved = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const userId = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isSolved = user.problemSolved?.some(id => id.toString() === problemId);

    return res.status(200).json({
      success: true,
      message: isSolved ? "Problem Solved" : "Problem Not Solved",
      solved: isSolved,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const analysis = async(req,res) => {
  try{
    const code = req.body.code;
    if(!code){
      return res.status(400).json({
        success:false,
        message:"Plz give me the code"
      })
    }
    const ai = new GoogleGenAI({apiKey:process.env.GOOGLE_API_KEY});

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the time and space complexity of the following code and reply with little explanation withhighlighted complexities in 90 words and not more than 3 lines first line time complexity second line space complexity and third line is explation and all there are in not markdown :\n\n${code}`
    })

    console.log(response.text);

    return res.status(200).json({
      success:true,
      message:"Analysis done",
      analysis:response.text
    })
  }catch(error){
    return res.status(400).json({
      success:false,
      message:error.message
    })
  }
}

export {
  judgeSubmission,
  getAllProblem,
  handleLikes,
  handleDislikes,
  getSpecificProblem,
  getLikes,
  getSolved,
  analysis
};
