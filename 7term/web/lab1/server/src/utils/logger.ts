enum LogLevel {
  INFO = "INFO",
  ERROR = "ERROR",
}

type LogEntry = {
  timestamp: string;
  level: LogLevel;
  message: string;
};

class Logger {
  private logs: LogEntry[] = [];

  private log(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    this.logs.push({ timestamp, level, message });

    if (level === LogLevel.ERROR) {
      console.error(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    } else {
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
  }

  public info(message: string): void {
    this.log(LogLevel.INFO, message);
  }

  public error(message: string): void {
    this.log(LogLevel.ERROR, message);
  }
}

export default Logger;
