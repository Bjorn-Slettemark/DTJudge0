// challenges/3-which-is-greater.js
export const whichIsGreaterChallenge = {
    title: "Which is Greater?",
    description: `Given two positive integers, determine whether the first one is larger than the second one.

Input Constraints:
- Input contains one line with two positive integers a and b, separated by a space
- The integers are in the range: 0 < a,b ≤ 1,000,000,000 (10^9)

Example 1:
Input: "1 19"
Output: "0"

Example 2:
Input: "4 4"
Output: "0"

Example 3:
Input: "23 14"
Output: "1"`,
    defaultCode: `function main() {
    // Read the line containing two numbers
    
    // TODO: Parse the numbers and determine if the first is greater
    
}`,
    testCases: [
        {
            input: "1 19\n",
            expected_output: "0\n"
        },
        {
            input: "4 4\n",
            expected_output: "0\n"
        },
        {
            input: "23 14\n",
            expected_output: "1\n"
        },

    ],
    difficulty: "Easy",
    categories: ["Math", "Input/Output", "Conditional Logic"],
    language_id: 63,
};