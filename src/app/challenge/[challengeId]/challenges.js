// challenges.js
export const challenges = {
    "1": {
      title: "Echo Echo Echo",
      description: `Given a single word as input, print it three times separated by spaces.
      
  Input Constraints:
  - Input is a single line containing exactly one word
  - Only upper and/or lowercase letters (a-z) are used
  - The word contains at least 1 and at most 15 characters
  - readline() reads the input as if the user entered a console command
  
  Example:
  Input: "Hello"
  Output: "Hello Hello Hello"`,
      defaultCode: `function main() {
      // Read the input word

  }`,
      testCases: [
        {
          input: "Hello\n",
          expected_output: "Hello Hello Hello\n"
        },
        {
          input: "ECHO\n",
          expected_output: "ECHO ECHO ECHO\n"
        }
      ],
      difficulty: "Easy",
      categories: ["String Manipulation", "Input/Output"],
      language_id: 63, // JavaScript
      timeLimit: 2000, // 2 seconds
      memoryLimit: 128000, // 128MB
    }
  };
  
  export const getDifficulties = () => ({
    "Easy": "bg-green-100 text-green-800",
    "Medium": "bg-yellow-100 text-yellow-800",
    "Hard": "bg-red-100 text-red-800"
  });
  
  export const validateSubmission = (challenge, result) => {
    if (!result || !result.stdout) return false;
    return result.stdout === challenge.testCases[0].expected_output;
  };
  
  export const getChallenge = (id) => {
    return challenges[id] || null;
  };