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
