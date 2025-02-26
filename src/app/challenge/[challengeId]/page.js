"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import ReactConfetti from "react-confetti";
import { getChallenge } from "../../lib/challenges/registry";
import { preprocessCode } from "../../lib/judge-wrapper";

export default function ChallengePage() {
  const { challengeId } = useParams();
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  // Handle window resize for confetti
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
      const handleResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Load challenge and code from localStorage
  useEffect(() => {
    const currentChallenge = getChallenge(challengeId);
    if (currentChallenge) {
      setChallenge(currentChallenge);
      // Check localStorage for saved code
      const savedCode = localStorage.getItem(`challenge_${challengeId}_code`);
      setCode(savedCode || currentChallenge.defaultCode);
    } else {
      setCode("// Challenge not found.");
    }
    setAttempts(0);
    setFeedback(null);
  }, [challengeId]);

  // Save code to localStorage whenever it changes
  useEffect(() => {
    if (challenge && code !== challenge.defaultCode) {
      localStorage.setItem(`challenge_${challengeId}_code`, code);
    }
  }, [code, challenge, challengeId]);

  const handleRun = async () => {
    if (!challenge) return;

    setAttempts((prev) => prev + 1);
    setLoading(true);
    setFeedback(null);
    setConfetti(false);

    try {
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

      const allPassed = results.every((r) => r.pass);
      const firstFailed = results.find((r) => !r.pass);

      setFeedback({
        result: firstFailed?.result || results[0].result,
        pass: allPassed,
        testResults: results,
        currentTest: firstFailed?.index || results.length,
      });

      if (allPassed) {
        setConfetti(true);
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
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-gray-800">{challenge.title}</h1>
          </div>
          <p className="text-gray-600 whitespace-pre-wrap">{challenge.description}</p>
        </div>

        <div className="flex flex-col md:flex-row">
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

      {confetti && <ReactConfetti width={width} height={height} />}
    </div>
  );
}