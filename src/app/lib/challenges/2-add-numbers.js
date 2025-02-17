
// challenges/2-add-numbers.js
export const addNumbersChallenge = {
    title: "Add Two Numbers",
    description: `Given two integers as input, calculate and print their sum.

Input Constraints:
- Input contains one line with two integers a and b, separated by a space
- The integers are in the range: 0 ≤ a,b ≤ 1,000,000

Example:
Input: "3 4"
Output: "7"`,
    defaultCode: `function main() {
    // TODO: Parse the two numbers and calculate their sum
    
}`,
    testCases: [
        {
            input: "3 4\n",
            expected_output: "7\n"
        },
        {
            input: "987 23\n",
            expected_output: "1010\n"
        }
    ],
    difficulty: "Easy",
    categories: ["Math", "Input/Output"],
    language_id: 63,
};
