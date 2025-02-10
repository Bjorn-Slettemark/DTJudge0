"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AceEditor from "react-ace";

// Import Ace mode and theme.
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";

// Sample challenges mapping.
const challenges = {
  "1": {
    description: 'Print "Hello, World!" using console.log',
    defaultCode: `// Write code to print "Hello, World!"\nconsole.log("Hello, World!");`,
    expected_output: "Hello, World!\n",
    language_id: 63,
  },
  "2": {
    description: "Print the sum of 3 and 4",
    defaultCode: `// Write code to print the sum of 3 and 4\nconsole.log(3 + 4);`,
    expected_output: "7\n",
    language_id: 63,
  },
};

export default function ChallengePage() {
  const { challengeId } = useParams();
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (challenges[challengeId]) {
      setCode(challenges[challengeId].defaultCode);
    } else {
      setCode("// Unknown challenge.");
    }
    setAttempts(0);
    setFeedback(null);
  }, [challengeId]);

  const handleRun = async () => {
    setAttempts((prev) => prev + 1);
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

      const response = await fetch(
        "http://localhost:2358/submissions?wait=true",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Code Editor Section */}
          <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-gray-200">
            <h2 className="text-xl font-medium text-gray-800 mb-3">
              Code Editor
            </h2>
            <div className="border border-gray-200 rounded-md overflow-hidden">
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
                <div className="text-red-500 font-medium text-base">
                  {feedback.error}
                </div>
              ) : (
                <div className="space-y-3 text-base text-gray-700">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Status:</span>
                    <span>
                      {feedback.result.status.description}{" "}
                      {feedback.pass ? (
                        <span className="text-green-500">✅</span>
                      ) : (
                        <span className="text-red-500">❌</span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium mr-2">Time:</span>
                    <span>{feedback.result.time} sec</span>
                  </div>
                  <div>
                    <span className="font-medium mr-2">Attempts:</span>
                    <span>{attempts}</span>
                  </div>
                  <div>
                    <span className="font-medium block mb-1">
                      Output:
                    </span>
                    <div className="p-3 bg-gray-50 rounded border border-gray-200 h-32 overflow-auto text-sm">
                      {feedback.result.stdout}
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-32 border border-dashed border-gray-300 rounded text-gray-500 text-base">
                No feedback yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
