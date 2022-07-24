import * as assert from "assert";
const fs = require("fs");
const path = require("path");
const { Parser } = require("../Parser");
let parser: typeof Parser;

describe("Parser Validation", () => {
  afterAll(() => {});

  test("should throw error on missing files", () => {
    expect(
      () =>
        new Parser(
          path.join(__dirname, "../../logs/debug.love"),
          "./output/debug.log"
        )
    ).toThrow(Error);
  });

  test("should not throw error on valid files", () => {
    expect(
      () =>
        new Parser(
          path.join(__dirname, "../../logs/debug.log"),
          "./output/debug.log"
        )
    ).not.toThrow(Error);
  });
});

describe("new Parser", () => {
  beforeAll(() => {
    parser = new Parser(
      path.join(__dirname, "../../logs/debug.log"),
      "./output/debug.log"
    );
  });

  afterAll(() => {});

  test(".parseLogLine should work with valid log line", () => {
    expect(
      parser.parseLogLine(
        '2020-01-01T00:00:00.000Z - DEBUG - {"transactionId":"12345","details":"test"}'
      )
    ).toStrictEqual({
      timestamp: 1577836800000,
      transactionId: "12345",
      err: "test",
      loglevel: "DEBUG",
    });
  });

  test(".parseLogLine should throw custom error with invalid log line", () => {
    expect(() =>
      parser.parseLogLine(
        '2020-01-01T00:00:00.000Z - DEBUG - {"transactionId":"12345","details":"test"'
      )
    ).toThrow(Error);
  });
});
