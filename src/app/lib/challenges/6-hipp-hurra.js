// challenges/7-hipp-hurra.js
export const hippHurraChallenge = {
    title: "Hipp Hipp Húrra",
    description: `Let's celebrate birthdays by printing congratulatory messages!

Input Constraints:
- First line contains a name (only English letters, no whitespace)
- Second line contains a single integer x (1 ≤ x ≤ 10000), representing the age
- Output should be exactly x lines of "Hipp hipp hurra, {name}!"

Example:
Input:
Arnar
3

Output:
Hipp hipp hurra, Arnar!
Hipp hipp hurra, Arnar!
Hipp hipp hurra, Arnar!`,
    defaultCode: `function main() {
    // Read the name and age
    const name = readline().trim();
    const age = parseInt(readline().trim());
    
    // TODO: Print congratulatory message age number of times
    
}`,
    testCases: [
        {
            input: "Arnar\n3\n",
            expected_output: "Hipp hipp hurra, Arnar!\nHipp hipp hurra, Arnar!\nHipp hipp hurra, Arnar!\n"
        },
        {
            input: "Forritunarkeppnin\n20\n",
            expected_output: "Hipp hipp hurra, Forritunarkeppnin!\n".repeat(20)
        },
        {
            input: "Ada\n1\n",
            expected_output: "Hipp hipp hurra, Ada!\n"
        },
        {
            input: "Bob\n5\n",
            expected_output: "Hipp hipp hurra, Bob!\nHipp hipp hurra, Bob!\nHipp hipp hurra, Bob!\nHipp hipp hurra, Bob!\nHipp hipp hurra, Bob!\n"
        }
    ],
    difficulty: "Easy",
    categories: ["Loops", "String Manipulation", "Input/Output"],
    language_id: 63,
};