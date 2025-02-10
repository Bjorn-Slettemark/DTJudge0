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
