// challenges/6-sort-numbers.js
export const sortNumbersChallenge = {
    title: "Sort Numbers",
    description: `Given a list of integers as input, print them in increasing order (smallest first).

Input Constraints:
- First line contains an integer N (1 ≤ N ≤ 10) representing how many numbers to sort
- Second line contains N integers separated by spaces
- Each integer is in the range: 0 ≤ x ≤ 1,000,000

Example 1:
Input:
3
4 1 3
Output:
1 3 4

Example 2:
Input:
5
987 23 45 1 100
Output:
1 23 45 100 987`,
    defaultCode: `function main() {
    // Read N (number of integers)
    const N = parseInt(readline().trim());
    
    // TODO: Read N numbers and print them in sorted order
    
}`,
    testCases: [
        {
            input: "3\n4 1 3\n",
            expected_output: "1 3 4\n"
        },
        {
            input: "5\n987 23 45 1 100\n",
            expected_output: "1 23 45 100 987\n"
        },
        {
            input: "1\n42\n",
            expected_output: "42\n"
        },
        {
            input: "4\n100 100 100 100\n",
            expected_output: "100 100 100 100\n"
        },
        {
            input: "10\n9 8 7 6 5 4 3 2 1 0\n",
            expected_output: "0 1 2 3 4 5 6 7 8 9\n"
        }
    ],
    difficulty: "Easy",
    categories: ["Arrays", "Sorting", "Input/Output"],
    language_id: 63,
};