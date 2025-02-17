// challenges/4-odd-echo.js
export const oddEchoChallenge = {
    title: "Odd Echo",
    description: `You love shouting in caves to hear your words echoed back at you. Write a program that echoes back only the odd-indexed words (1st, 3rd, 5th, etc.).

Input Constraints:
- First line contains an integer N (1 ≤ N ≤ 10)
- Following N lines each contain one word
- Each word contains only lowercase letters 'a-z'
- Each word is at most 100 letters long

Example:
Input:
5
hello
i
am
an
echo

Output:
hello
am
echo`,
    defaultCode: `function main() {
    // Read N (number of words)
    const N = parseInt(readline());
    
    // TODO: Read N words and print odd-indexed ones
    
}`,
    testCases: [
        {
            input: "5\nhello\ni\nam\nan\necho\n",
            expected_output: "hello\nam\necho\n"
        },
        {
            input: "10\nonly\nif\nthese\noddindexed\nwords\nappear\nare\nyou\ncorrect\noutput\n",
            expected_output: "only\nthese\nwords\nare\ncorrect\n"
        },
        {
            input: "3\ntest\nno\nyes\n",
            expected_output: "test\nyes\n"
        },
        {
            input: "1\nsingle\n",
            expected_output: "single\n"
        }
    ],
    difficulty: "Easy",
    categories: ["Arrays", "Input/Output", "Loops"],
    language_id: 63,
};