Project Path: judge0

Source Tree:

```
judge0
├── deploy.bat
├── DTJudge0
├── eslint.config.mjs
├── generate_codebase.bat
├── jsconfig.json
├── next.config.mjs
├── output.md
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── src
│   └── app
│       ├── app.js
│       ├── challenge
│       │   └── [challengeId]
│       │       ├── challenges.js
│       │       └── page.js
│       ├── CodeSubmitter.js
│       ├── favicon.ico
│       ├── globals.css
│       ├── layout.js
│       └── lib
│           ├── challenges
│           │   ├── 0-hello-world.js
│           │   ├── 1-echo.js
│           │   ├── 2-add-numbers.js
│           │   ├── 3-which-is-greater.js
│           │   ├── 4-odd-echo.js
│           │   ├── 5-sort-numbers.js
│           │   ├── 6-hipp-hurra.js
│           │   ├── 7-generalizedFizzBuzz.js
│           │   ├── 8-altpos
│           │   └── registry.js
│           └── judge-wrapper.js
└── tailwind.config.mjs

```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\app.js`:

```js
// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import CodeSubmitter from './CodeSubmitter';

const ChallengeWrapper = () => {
  // Expecting a URL like /challenge/1
  const { challengeId } = useParams();
  return <CodeSubmitter challengeId={challengeId} />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/challenge/:challengeId" element={<ChallengeWrapper />} />
        {/* Optionally, handle other routes */}
        <Route path="/" element={<div>Please select a challenge.</div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\challenge\[challengeId]\challenges.js`:

```js
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
```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\challenge\[challengeId]\page.js`:

```js
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AceEditor from "react-ace";

// Update imports to use the correct paths
import { getChallenge } from "../../lib/challenges/registry";
import { preprocessCode } from "../../lib/judge-wrapper";

// Import Ace modes and themes
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

// Import confetti animation
import ReactConfetti from "react-confetti";

export default function ChallengePage() {
  const { challengeId } = useParams();
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [confetti, setConfetti] = useState(false); // State to trigger confetti
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // Only run the following code on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);

      // Update width and height on window resize
      const handleResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    const currentChallenge = getChallenge(challengeId);
    if (currentChallenge) {
      setChallenge(currentChallenge);
      setCode(currentChallenge.defaultCode);
    } else {
      setCode("// Challenge not found.");
    }
    setAttempts(0);
    setFeedback(null);
  }, [challengeId]);

  const handleRun = async () => {
    if (!challenge) return;

    setAttempts((prev) => prev + 1);
    setLoading(true);
    setFeedback(null);
    setConfetti(false); // Reset confetti

    try {
      // Run all test cases
      const results = await Promise.all(
        challenge.testCases.map(async (testCase, index) => {
          const payload = {
            language_id: challenge.language_id,
            source_code: preprocessCode(code),
            stdin: testCase.input,
            expected_output: testCase.expected_output,
          };

          const response = await fetch("https://dt.strimo.no/api/submissions?wait=true", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const result = await response.json();
          return {
            testCase,
            result,
            pass: result.stdout === testCase.expected_output,
            index: index + 1,
          };
        })
      );

      // Check if all test cases passed
      const allPassed = results.every((r) => r.pass);
      const firstFailed = results.find((r) => !r.pass);

      setFeedback({
        result: firstFailed?.result || results[0].result,
        pass: allPassed,
        testResults: results,
        currentTest: firstFailed?.index || results.length,
      });

      if (allPassed) {
        setConfetti(true); // Trigger confetti when all tests pass
      }
    } catch (error) {
      console.error(error);
      setFeedback({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (!challenge) {
    return <div className="p-4">Challenge not found</div>;
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        {/* Challenge Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">{challenge.title}</h1>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap">{challenge.description}</p>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Code Editor Section */}
          <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200">
            <h2 className="text-xl font-medium text-gray-800 mb-3">Code Editor</h2>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <AceEditor
                mode="javascript"
                theme="github"
                name="code-editor"
                onChange={setCode}
                value={code}
                width="100%"
                height="400px"
                fontSize={14}
                setOptions={{
                  useWorker: false,
                  enableBasicAutocompletion: true,
                  enableLiveAutocompletion: true,
                  showPrintMargin: false,
                }}
              />
            </div>
            <button
              onClick={handleRun}
              disabled={loading}
              className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition-colors duration-200"
            >
              {loading ? "Running..." : "Run Code"}
            </button>
          </div>

          {/* Status / Feedback Panel */}
          <div className="w-full md:w-1/3 p-4">
            <h2 className="text-xl font-medium text-gray-800 mb-3">Status</h2>
            {feedback ? (
              feedback.error ? (
                <div className="text-red-500 font-medium text-base">{feedback.error}</div>
              ) : (
                <div className="space-y-3 text-base text-gray-700">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                    <span className="font-medium">Status:</span>
                    <div>
                      {feedback.pass ? (
                        <span className="text-green-500 font-medium">✅ All Tests Passed</span>
                      ) : (
                        <span className="text-red-500 font-medium">❌ Some Tests Failed</span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <div>
                      <span className="font-medium mr-2">Attempts:</span>
                      <span>{attempts}</span>
                    </div>
                    <div>
                      <span className="font-medium mr-2">Time:</span>
                      <span>{feedback.result.time} sec</span>
                    </div>
                  </div>

                  <div>
                    <span className="font-medium block mb-2">Test Results:</span>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {feedback.testResults?.map((test, index) => (
                        <div
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            test.pass ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          Test {index + 1} {test.pass ? "✅" : "❌"}
                        </div>
                      ))}
                    </div>

                    {/* ---- ADDING OUTPUT SECTION FOR EACH TEST ---- */}
                    <div className="space-y-2">
                      {feedback.testResults?.map((test, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                          <div className="font-medium mb-1">Output for Test {index + 1}:</div>
                          <pre className="text-sm whitespace-pre-wrap text-gray-700">
                            {test.result.stdout || "(no output)"}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-32 border border-dashed border-gray-300 rounded text-gray-500 text-base">
                No feedback yet. Run your code to see results.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confetti animation trigger */}
      {confetti && <ReactConfetti width={width} height={height} />}
    </div>
  );
}

```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\CodeSubmitter.js`:

```js
// CodeSubmitter.js
import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';

// Import Ace modules for JavaScript syntax highlighting and a theme.
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

// Simple challenge mapping for demo purposes.
const challenges = {
  '1': {
    description: 'Print "Hello, World!" using console.log',
    defaultCode: `// Write code to print "Hello, World!"\nconsole.log("Hello, World!");`,
    expected_output: 'Hello, World!\n',
    language_id: 63, // Example language id for JavaScript (Node.js) on Judge0.
  },
  '2': {
    description: 'Print the sum of 3 and 4',
    defaultCode: `// Write code to print the sum of 3 and 4\nconsole.log(3 + 4);`,
    expected_output: '7\n',
    language_id: 63,
  },
};

const CodeSubmitter = ({ challengeId }) => {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load default code when the challenge id changes.
  useEffect(() => {
    if (challenges[challengeId]) {
      setCode(challenges[challengeId].defaultCode);
    } else {
      setCode('// Unknown challenge.');
    }
  }, [challengeId]);

  const handleRun = async () => {
    setLoading(true);
    setFeedback(null);
    try {
      const challenge = challenges[challengeId];
      if (!challenge) throw new Error("Invalid challenge id.");

      const payload = {
        language_id: challenge.language_id,
        source_code: code,
        stdin: "",
        expected_output: challenge.expected_output,
      };

      const response = await fetch('http://51.20.253.201:2358/submissions?wait=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      // Check if the output exactly matches what we expect.
      const pass = result.stdout === challenge.expected_output;
      setFeedback({ result, pass });
    } catch (error) {
      console.error(error);
      setFeedback({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h1>Challenge {challengeId}</h1>
      <p>{challenges[challengeId] ? challenges[challengeId].description : 'Unknown challenge'}</p>
      <AceEditor
        mode="javascript"
        theme="github"
        name="code-editor"
        onChange={setCode}
        value={code}
        width="100%"
        height="300px"
        fontSize={14}
        setOptions={{ useWorker: false }}
      />
      <button onClick={handleRun} disabled={loading} style={{ marginTop: '10px' }}>
        {loading ? 'Running...' : 'Run Code'}
      </button>
      {feedback && (
        <div style={{ marginTop: '20px' }}>
          <h3>Feedback:</h3>
          {feedback.error ? (
            <p style={{ color: 'red' }}>{feedback.error}</p>
          ) : (
            <pre style={{ backgroundColor: '#f4f4f4', padding: '10px' }}>
              {JSON.stringify(feedback, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

export default CodeSubmitter;

```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\layout.js`:

```js
// app/layout.js
import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Judge0 Challenge',
  description: 'Integrating Judge0 Challenge with React & Express',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\lib\challenges\0-hello-world.js`:

```js
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

```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\lib\challenges\1-echo.js`:

```js
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

```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\lib\challenges\2-add-numbers.js`:

```js

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

```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\lib\challenges\3-which-is-greater.js`:

```js
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
```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\lib\challenges\4-odd-echo.js`:

```js
// challenges/4-odd-echo.js
export const oddEchoChallenge = {
    title: "Odd Echo",
    description: `You love shouting in caves to hear your words echoed back at you. Write a program that echoes back only the odd-indexed words (1st, 3rd, 5th, etc.).

Input Constraints:
- First line contains an integer N (1 ≤ N ≤ 10)
- Following N lines each contain one word
- Each word contains only lowercase letters 'a-z'
- Each word is at most 100 letters long
- Oddness can be easily calculated with modulus of two!

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
```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\lib\challenges\5-sort-numbers.js`:

```js
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
```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\lib\challenges\6-hipp-hurra.js`:

```js
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
```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\lib\challenges\7-generalizedFizzBuzz.js`:

```js
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

```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\lib\challenges\registry.js`:

```js

// challenges/registry.js
import { echoChallenge } from './1-echo';
import { addNumbersChallenge } from './2-add-numbers';
import { whichIsGreaterChallenge } from './3-which-is-greater';
import { oddEchoChallenge } from './4-odd-echo';
import { sortNumbersChallenge } from './5-sort-numbers';
import { hippHurraChallenge } from './6-hipp-hurra';
import { generalizedFizzBuzzChallenge } from './7-generalizedFizzBuzz';
import { helloWorldChallenge } from './0-hello-world';
import { alternatingPositionCipherChallenge } from './8-altpos';

// Map challenges to their numeric IDs
export const challenges = {
    
    "0": helloWorldChallenge,
    "1": echoChallenge,
    "2": addNumbersChallenge,
    "3": whichIsGreaterChallenge,
    "4": oddEchoChallenge,
    "5": sortNumbersChallenge,
    "6": hippHurraChallenge,
    "7": generalizedFizzBuzzChallenge,
    "8": alternatingPositionCipherChallenge 

    

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

export const getAllChallenges = () => {
    return Object.entries(challenges).map(([id, challenge]) => ({
        ...challenge,
        id
    }));
};
```

`\\?\C:\Dev\DigitaleTalenter\Judge0\judge0\src\app\lib\judge-wrapper.js`:

```js
// judge-wrapper.js
export const preprocessCode = (sourceCode) => {
    const wrapper = `
let _input = '';
let _inputArray = [];
let _currentLine = 0;

process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', stdin => _input += stdin);
process.stdin.on('end', () => {
    _inputArray = _input.split('\\n').map(str => str.trim());
    if (typeof main === 'function') {
        main();  // Only call main if it's defined
    }
});

function readline() {
    return _inputArray[_currentLine++];
}

// User code goes here
${sourceCode}
`;

    return wrapper;
};

```