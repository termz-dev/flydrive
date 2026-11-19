/**
 * Structured JSON logger with redaction. Keys that commonly carry personal or secret data
 * are masked recursively, and free-text values are scrubbed for emails and phone numbers.
 * See docs/SECURITY_PRIVACY.md. Do not log raw request bodies.
 */
type Level = "debug" | "info" | "warn" | "error";
const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

const SENSITIVE_KEY =
  /(pass(word)?|secret|token|authorization|cookie|api[-_]?key|phone|email|address|nin|bvn|licen[cs]e|dob|birth|card|pan|cvv|account|lat(itude)?|lng|lon(gitude)?|photo|url)/i;
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE = /\+?\d[\d\s-]{8,}\d/g;

export function redact(value: unknown, depth = 0): unknown {
  if (depth > 6) return "[depth]";
  if (typeof value === "string") return value.replace(EMAIL, "[email]").replace(PHONE, "[phone]");
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  if (value instanceof Error) {
    return { name: value.name, message: redact(value.message, depth + 1) };
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = SENSITIVE_KEY.test(k) ? "[redacted]" : redact(v, depth + 1);
    }
    return out;
  }
  return value;
}

export interface LogContext {
  correlationId?: string;
  module?: string;
  route?: string;
  outcome?: string;
  code?: string;
  durationMs?: number;
  [key: string]: unknown;
}

export function createLogger(
  minLevel: Level = "info",
  sink: (line: string) => void = (l) => process.stdout.write(l + "\n"),
) {
  const emit = (level: Level, message: string, ctx: LogContext = {}) => {
    if (ORDER[level] < ORDER[minLevel]) return;
    sink(
      JSON.stringify({
        ts: new Date().toISOString(),
        level,
        msg: redact(message),
        ...(redact(ctx) as Record<string, unknown>),
      }),
    );
  };
  return {
    debug: (m: string, c?: LogContext) => emit("debug", m, c),
    info: (m: string, c?: LogContext) => emit("info", m, c),
    warn: (m: string, c?: LogContext) => emit("warn", m, c),
    error: (m: string, c?: LogContext) => emit("error", m, c),
  };
}

export type Logger = ReturnType<typeof createLogger>;
