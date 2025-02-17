// judge-wrapper.js
export const preprocessCode = (sourceCode) => {
    const wrapper = `
// Input helper setup
let _input = '';
let _inputArray = [];
let _currentLine = 0;

process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', stdin => _input += stdin);
process.stdin.on('end', () => {
    _inputArray = _input.split('\\n').map(str => str.trim());
    main();
});

function readline() {
    return _inputArray[_currentLine++];
}

${sourceCode}
`;
    return wrapper;
};