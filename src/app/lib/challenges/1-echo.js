// challenges/1-echo.js
export const echoChallenge = {
    title: "Echo Echo Echo",
    description: `Given a single word as input, print it three times separated by spaces.
    
Input Constraints:
- Input is a single line containing exactly one word
- Only upper and/or lowercase letters (a-z) are used
- The word contains at least 1 and at most 15 characters
- readline() to get the input word

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
    language_id: 63,
};
