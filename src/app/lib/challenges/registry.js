
// challenges/registry.js
import { echoChallenge } from './1-echo';
import { addNumbersChallenge } from './2-add-numbers';
import { whichIsGreaterChallenge } from './3-which-is-greater';
import { oddEchoChallenge } from './4-odd-echo';
import { sortNumbersChallenge } from './5-sort-numbers';
import { hippHurraChallenge } from './6-hipp-hurra';

// Map challenges to their numeric IDs
export const challenges = {
    "1": echoChallenge,
    "2": addNumbersChallenge,
    "3": whichIsGreaterChallenge,
    "4": oddEchoChallenge,
    "5": sortNumbersChallenge,
    "6": hippHurraChallenge


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