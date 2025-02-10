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
