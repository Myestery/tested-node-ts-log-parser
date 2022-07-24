module.exports = {
  testEnvironment: "node",
  testMatch: ["**/src/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  "verbose": true
};