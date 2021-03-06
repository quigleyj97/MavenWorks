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
  moduleNameMapper: {
    "\\.(?:css|less)$": "<rootDir>/__mocks__/fileMock.js",
  },
  testMatch: [
    "<rootDir>/src/**/*.spec.+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
};
