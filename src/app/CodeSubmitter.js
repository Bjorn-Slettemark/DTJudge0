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
