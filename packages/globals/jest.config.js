module.exports = {
  globals: {
    "ts-jest": {
      "tsconfig": "<rootDir>/tsconfig.json"
    }
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  testMatch: [
    "<rootDir>/src/**/*.spec.+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
