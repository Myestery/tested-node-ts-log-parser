const minimist = require("minimist");
const fs = require("fs");

interface LogEntry {
  timestamp: number;
  transactionId: string;
  err: string;
  loglevel: string;
}
export class Parser {
  public input_path: string = "";
  public output_path: string = "";
  constructor(input_path: string, output_path: string) {
    this.input_path = input_path;
    this.output_path = output_path;
    this.validatePaths();
  }
  validatePaths() {
    //   confirm the path is valid
    if (!fs.existsSync(this.input_path)) {
      throw new Error(`${this.input_path} does not exist`);
    }
    if (!this.output_path) {
      throw new Error("No output path provided");
    }
    //   confirm the path can be written to
  }

  parseLogFile() {
    const logFile = fs.readFileSync(this.input_path, "utf8");
    const logLines = logFile.split("\n");
    const logEntries: LogEntry[] = [];
    for (let i = 0; i < logLines.length; i++) {
      const logLine = logLines[i];
      if (logLine.length > 5) {
        const logEntry = this.parseLogLine(logLine);
        logEntries.push(logEntry);
      }
    }
    return logEntries;
  }

  parseLogLine(logLine: string) {
    const logEntry: LogEntry = {} as LogEntry;
    // regex get first word
    const firstWordRegex = /^\S+/;
    const timestampMatch = logLine.match(firstWordRegex)?.[0] ?? "";
    logEntry.timestamp = new Date(timestampMatch).valueOf();
    // regex match json
    const jsonMatch = logLine.match(/\{.*\}/)?.[0] ?? "";
    const json = JSON.parse(jsonMatch);
    logEntry.transactionId = json.transactionId;
    logEntry.err = json.details;
    logEntry.loglevel = (logLine.match(/- \w+ -/)?.[0] ?? "")
      .replace(/-/g, "")
      .trim();
    return logEntry;
  }

  writeLogEntries(logEntries: LogEntry[]) {
    const outputFile = fs.createWriteStream(this.output_path);
    outputFile.write(JSON.stringify(logEntries));
  }

  parse() {
    const logEntries = this.parseLogFile();
    this.writeLogEntries(logEntries);
  }
}

// const parser = new Parser(
//   minimist(process.argv.slice(2)).input,
//   minimist(process.argv.slice(2)).output
// );
// parser.parse();
// const logEntries = parser.parseLogFile();
