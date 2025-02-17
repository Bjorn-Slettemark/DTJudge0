export const helloWorldChallenge = {
    title: "Hello World",
    description: `The task is simple: print the message "Hello, World!" to the console.

Input:
- No input is required for this challenge.

Output:
- The output should be exactly: "Hello, World!" (including the punctuation and spacing).`,

    defaultCode: `function main() {
    // Print the message "Hello, World!"
}`,

    testCases: [
        {
            input: "",
            expected_output: "Hello, World!\n"
        }
    ],

    difficulty: "Easy",
    categories: ["Output", "Basic Syntax"],
    language_id: 63,
};
