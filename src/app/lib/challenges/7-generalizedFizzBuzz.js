export const generalizedFizzBuzzChallenge = {
    title: "Generalized FizzBuzz",
    description: `Given three integers n, a, and b, for all integers from 1 to n:
    
    - If the number is divisible by both a and b, print "FizzBuzz".
    - If the number is divisible by a, print "Fizz".
    - If the number is divisible by b, print "Buzz".
    - Otherwise, print the number itself.
    
    We need to count how many times "Fizz", "Buzz", and "FizzBuzz" are printed.
    
    Input:
    - Three integers: n (1 ≤ n ≤ 10^6), a (1 ≤ a ≤ 100), b (1 ≤ b ≤ 100).
    
    Output:
    - Three integers: the number of times "Fizz" is printed, the number of times "Buzz" is printed, and the number of times "FizzBuzz" is printed.`,

    defaultCode: `function main() {
    // Read the input values
    const [n, a, b] = readline().trim().split(' ').map(Number);
}`,

    testCases: [
        {
            input: "17 3 5\n",
            expected_output: "4 2 1\n"
        },
        {
            input: "10 3 3\n",
            expected_output: "0 0 3\n"
        },
        {
            input: "100 2 5\n",
            expected_output: "40 10 10\n"
        },
        {
            input: "1000 3 7\n",
            expected_output: "286 95 47\n"
        }
    ],

    difficulty: "Medium",
    categories: ["Loops", "Conditionals", "Math"],
    language_id: 63,
};
