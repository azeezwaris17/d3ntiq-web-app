/**
 * Enhanced Professional Logging Infrastructure
 *
 * This logger provides:
 * - Structured JSON logging for machine parsing
 * - Beautiful console formatting for human readability
 * - Correlation IDs for request tracing
 * - Performance metrics with visual indicators
 * - Error stack trace handling
 * - Log filtering and search capabilities
 * - Integration with browser DevTools
 * - Professional DX with clear, traceable logs
 */

import { appConfig } from '@/core/config/app-config';

// ============================================================================
// Types & Enums
// ============================================================================

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export const LOG_LEVEL_NAMES = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL',
} as const;

export const LOG_LEVEL_COLORS = {
  [LogLevel.DEBUG]: '#6B7280', // Gray
  [LogLevel.INFO]: '#3B82F6', // Blue
  [LogLevel.WARN]: '#F59E0B', // Amber
  [LogLevel.ERROR]: '#EF4444', // Red
  [LogLevel.FATAL]: '#DC2626', // Dark Red
} as const;

export const LOG_LEVEL_ICONS = {
  [LogLevel.DEBUG]: '🔍',
  [LogLevel.INFO]: 'ℹ️',
  [LogLevel.WARN]: '⚠️',
  [LogLevel.ERROR]: '❌',
  [LogLevel.FATAL]: '💥',
} as const;

// ============================================================================
// Interfaces
// ============================================================================

/**
 * Comprehensive log context with all traceable information
 */
export interface LogContext {
  // Core identifiers
  correlationId?: string; // Unique ID for tracing requests across services
  requestId?: string; // HTTP request ID
  traceId?: string; // Distributed tracing ID
  spanId?: string; // Span ID for tracing

  // User context
  userId?: string;
  userEmail?: string;
  userRole?: string;
  sessionId?: string;

  // Application context
  module?: string; // e.g., 'auth', 'patient', 'appointment'
  component?: string; // e.g., 'LoginForm', 'PatientList'
  action?: string; // e.g., 'login', 'create_patient', 'fetch_appointments'
  operation?: string; // e.g., 'user_login', 'patient_create'

  // Request context
  method?: string; // HTTP method
  url?: string; // Request URL
  statusCode?: number; // HTTP status code
  userAgent?: string;
  ipAddress?: string;

  // Performance metrics
  duration?: number; // Duration in milliseconds
  durationFormatted?: string; // Human-readable duration
  memoryUsage?: number; // Memory usage in bytes
  cpuUsage?: number; // CPU usage percentage

  // Error context
  error?:
    | Error
    | {
        name: string;
        message: string;
        stack?: string;
        code?: string | number;
        cause?: unknown;
      };
  errorType?: string; // e.g., 'ValidationError', 'NetworkError'
  errorCode?: string | number;

  // Additional metadata
  metadata?: Record<string, unknown>;
  tags?: string[]; // For filtering and grouping
  severity?: 'low' | 'medium' | 'high' | 'critical';

  // Environment
  timestamp?: string;
  environment?: string;
  version?: string;
  buildDate?: string;

  // Browser context (client-side only)
  browser?: string;
  os?: string;
  device?: string;
  viewport?: {
    width: number;
    height: number;
  };

  // Custom fields
  [key: string]: unknown;
}

/**
 * Structured log entry with all information
 */
export interface LogEntry {
  // Core fields
  level: LogLevel;
  levelName: string;
  message: string;
  timestamp: string;
  timestampUnix: number;

  // Context
  context: LogContext;

  // Structured data for machine parsing
  structured: {
    correlationId?: string;
    module?: string;
    action?: string;
    userId?: string;
    duration?: number;
    error?: {
      name: string;
      message: string;
      stack?: string;
      code?: string | number;
    };
  };

  // Performance indicators
  performance?: {
    duration: number;
    durationFormatted: string;
    memoryUsage?: number;
    isSlow?: boolean; // Duration > 1000ms
  };
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  enablePerformance: boolean;
  enableStructured: boolean; // Enable JSON structured logging
  enableColors: boolean; // Enable colored console output
  enableIcons: boolean; // Enable emoji icons
  enableGrouping: boolean; // Group related logs
  remoteEndpoint?: string;
  sampling: {
    error: number;
    performance: number;
    debug: number;
  };
  maxMetadataDepth: number; // Max depth for metadata serialization
  slowOperationThreshold: number; // Threshold in ms for slow operations
}

// ============================================================================
// Correlation ID Management
// ============================================================================

class CorrelationIdManager {
  private currentId: string | null = null;
  private idStack: string[] = [];

  generate(): string {
    return `corr_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  get(): string | null {
    return this.currentId;
  }

  set(id: string): void {
    this.currentId = id;
  }

  push(id: string): void {
    if (this.currentId) {
      this.idStack.push(this.currentId);
    }
    this.currentId = id;
  }

  pop(): string | null {
    const previous = this.currentId;
    this.currentId = this.idStack.pop() || null;
    return previous;
  }

  clear(): void {
    this.currentId = null;
    this.idStack = [];
  }
}

const correlationManager = new CorrelationIdManager();

// ============================================================================
// Logger Implementation
// ============================================================================

// Default Configuration
const defaultConfig: LoggerConfig = {
  level: appConfig.features.enableDebugMode ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableRemote: !appConfig.environment.includes('development'),
  enablePerformance: true,
  enableStructured: true,
  enableColors: typeof window !== 'undefined' && !appConfig.environment.includes('production'),
  enableIcons: typeof window !== 'undefined',
  enableGrouping: true,
  sampling: {
    error: 1.0,
    performance: appConfig.environment === 'production' ? 0.1 : 1.0,
    debug: appConfig.environment === 'production' ? 0.01 : 1.0,
  },
  maxMetadataDepth: 5,
  slowOperationThreshold: 1000,
};

export class Logger {
  private config: LoggerConfig;
  private performanceMarks: Map<string, { startTime: number; context: Partial<LogContext> }> =
    new Map();
  private logGroupStack: string[] = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };

    // Initialize correlation ID if not set
    if (!correlationManager.get()) {
      correlationManager.set(correlationManager.generate());
    }
  }

  // ========================================================================
  // Core Logging Methods
  // ========================================================================

  debug(message: string, context: Partial<LogContext> = {}): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context: Partial<LogContext> = {}): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context: Partial<LogContext> = {}): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: unknown, context: Partial<LogContext> = {}): void {
    const errorContext = this.normalizeError(error, context);
    this.log(LogLevel.ERROR, message, errorContext);
  }

  fatal(message: string, error?: unknown, context: Partial<LogContext> = {}): void {
    const errorContext = this.normalizeError(error, context);
    this.log(LogLevel.FATAL, message, errorContext);
  }

  // ========================================================================
  // Performance Monitoring
  // ========================================================================

  startTimer(operation: string, context: Partial<LogContext> = {}): string {
    if (!this.config.enablePerformance) return '';

    const timerId = `${operation}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    this.performanceMarks.set(timerId, {
      startTime: performance.now(),
      context: {
        ...context,
        module: context.module || 'performance',
        action: 'start_timer',
        operation,
      },
    });

    this.debug(`⏱️  Started: ${operation}`, {
      ...context,
      module: context.module || 'performance',
      action: 'start_timer',
      operation,
      metadata: { timerId, operation },
    });

    return timerId;
  }

  endTimer(timerId: string, context: Partial<LogContext> = {}): number {
    if (!this.config.enablePerformance) return 0;

    const mark = this.performanceMarks.get(timerId);
    if (!mark) {
      this.warn(`Timer not found: ${timerId}`, { module: 'performance', action: 'end_timer' });
      return 0;
    }

    const duration = performance.now() - mark.startTime;
    this.performanceMarks.delete(timerId);

    const isSlow = duration > this.config.slowOperationThreshold;
    const level = isSlow ? LogLevel.WARN : LogLevel.INFO;
    const icon = isSlow ? '🐌' : '✅';
    const durationFormatted = this.formatDuration(duration);

    this.log(level, `${icon} Completed: ${mark.context.operation || 'operation'}`, {
      ...mark.context,
      ...context,
      action: 'end_timer',
      duration,
      durationFormatted,
      metadata: {
        ...mark.context.metadata,
        ...context.metadata,
        timerId,
        isSlow,
      },
    });

    return duration;
  }

  async measureAsync<T>(
    operation: string,
    fn: () => Promise<T>,
    context: Partial<LogContext> = {}
  ): Promise<T> {
    const timerId = this.startTimer(operation, context);
    try {
      const result = await fn();
      this.endTimer(timerId, { ...context, metadata: { ...context.metadata, success: true } });
      return result;
    } catch (error) {
      this.endTimer(timerId, {
        ...context,
        error: error as Error,
        metadata: { ...context.metadata, success: false },
      });
      throw error;
    }
  }

  // ========================================================================
  // Log Grouping
  // ========================================================================

  group(label: string, context: Partial<LogContext> = {}): void {
    if (!this.config.enableGrouping) return;

    this.logGroupStack.push(label);
    if (typeof console !== 'undefined' && console.group) {
      const icon = this.config.enableIcons ? '📦' : '';
      console.group(`${icon} ${label}`);
    }

    this.debug(`Group started: ${label}`, {
      ...context,
      module: 'logger',
      action: 'group_start',
      metadata: { groupLabel: label, groupStack: [...this.logGroupStack] },
    });
  }

  groupEnd(): void {
    if (!this.config.enableGrouping) return;

    const label = this.logGroupStack.pop();
    if (typeof console !== 'undefined' && console.groupEnd) {
      console.groupEnd();
    }

    if (label) {
      this.debug(`Group ended: ${label}`, {
        module: 'logger',
        action: 'group_end',
      });
    }
  }

  // ========================================================================
  // Correlation ID Management
  // ========================================================================

  setCorrelationId(id: string): void {
    correlationManager.set(id);
  }

  getCorrelationId(): string {
    return correlationManager.get() || correlationManager.generate();
  }

  pushCorrelationId(id?: string): string {
    const newId = id || correlationManager.generate();
    correlationManager.push(newId);
    return newId;
  }

  popCorrelationId(): string | null {
    return correlationManager.pop();
  }

  // ========================================================================
  // Private Methods
  // ========================================================================

  private log(level: LogLevel, message: string, context: Partial<LogContext>): void {
    // Check log level
    if (level < this.config.level) return;

    // Apply sampling
    if (this.shouldSample(level)) return;

    // Build comprehensive context
    const fullContext = this.buildContext(context);

    // Create log entry
    const entry = this.createLogEntry(level, message, fullContext);

    // Console logging with beautiful formatting
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // Structured JSON logging
    if (this.config.enableStructured) {
      this.logStructured(entry);
    }

    // Remote logging
    if (this.config.enableRemote) {
      this.logToRemote(entry);
    }
  }

  private buildContext(context: Partial<LogContext>): LogContext {
    const correlationId = correlationManager.get() || correlationManager.generate();

    // Get browser info if available
    const browserInfo = this.getBrowserInfo();

    return {
      // Core identifiers
      correlationId,
      requestId: context.requestId,
      traceId: context.traceId,
      spanId: context.spanId,

      // User context
      userId: context.userId,
      userEmail: context.userEmail,
      userRole: context.userRole,
      sessionId: context.sessionId,

      // Application context
      module: context.module,
      component: context.component,
      action: context.action,
      operation: context.operation,

      // Request context
      method: context.method,
      url: context.url,
      statusCode: context.statusCode,
      userAgent:
        context.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : undefined),
      ipAddress: context.ipAddress,

      // Performance
      duration: context.duration,
      durationFormatted:
        context.durationFormatted ||
        (context.duration ? this.formatDuration(context.duration) : undefined),

      // Error
      error: context.error,
      errorType: context.errorType,
      errorCode: context.errorCode,

      // Metadata
      metadata: this.sanitizeMetadata(context.metadata),
      tags: context.tags,
      severity: context.severity,

      // Environment
      timestamp: new Date().toISOString(),
      environment: appConfig.environment,
      version: appConfig.version,
      buildDate: appConfig.buildDate,

      // Browser context
      ...browserInfo,
    };
  }

  private createLogEntry(level: LogLevel, message: string, context: LogContext): LogEntry {
    const timestamp = new Date().toISOString();
    const timestampUnix = Date.now();

    // Extract error info if present
    const errorInfo = context.error
      ? {
          name:
            context.error instanceof Error
              ? context.error.name
              : (context.error as { name?: string }).name || 'Error',
          message:
            context.error instanceof Error
              ? context.error.message
              : typeof context.error === 'object' && context.error !== null
                ? JSON.stringify(context.error)
                : String(context.error),
          stack: context.error instanceof Error ? context.error.stack : undefined,
          code:
            context.error instanceof Error
              ? (context.error as { code?: string | number }).code
              : (context.error as { code?: string | number }).code,
        }
      : undefined;

    // Performance info
    const performanceInfo = context.duration
      ? {
          duration: context.duration,
          durationFormatted: context.durationFormatted || this.formatDuration(context.duration),
          isSlow: context.duration > this.config.slowOperationThreshold,
        }
      : undefined;

    return {
      level,
      levelName: LOG_LEVEL_NAMES[level],
      message,
      timestamp,
      timestampUnix,
      context,
      structured: {
        correlationId: context.correlationId,
        module: context.module,
        action: context.action,
        userId: context.userId,
        duration: context.duration,
        error: errorInfo,
      },
      performance: performanceInfo,
    };
  }

  private logToConsole(entry: LogEntry): void {
    const { level, message, context, performance } = entry;
    const levelName = LOG_LEVEL_NAMES[level];
    const icon = this.config.enableIcons ? LOG_LEVEL_ICONS[level] : '';
    const color = this.config.enableColors ? LOG_LEVEL_COLORS[level] : undefined;

    // Build header with timestamp
    const timestamp = new Date(context.timestamp || Date.now()).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
    const header = `${icon} [${levelName}] ${timestamp}`;

    // Build main message
    const mainMessage = `${header} ${message}`;

    // Build context object for console
    const consoleContext: Record<string, unknown> = {
      '📋 Module': context.module || 'N/A',
      '🎯 Action': context.action || 'N/A',
      '🔗 Correlation ID': context.correlationId || 'N/A',
    };

    if (context.userId) {
      consoleContext['👤 User ID'] = context.userId;
    }

    if (context.duration !== undefined) {
      const durationDisplay = performance?.isSlow
        ? `🐌 ${context.durationFormatted} (SLOW)`
        : `⚡ ${context.durationFormatted}`;
      consoleContext['⏱️  Duration'] = durationDisplay;
    }

    if (context.error) {
      if (context.error instanceof Error) {
        consoleContext['❌ Error'] = {
          name: context.error.name,
          message: context.error.message,
          stack: context.error.stack,
        };
      } else if (typeof context.error === 'object' && context.error !== null) {
        consoleContext['❌ Error'] = JSON.stringify(context.error, null, 2);
      } else {
        consoleContext['❌ Error'] = String(context.error);
      }
    }

    if (context.metadata && Object.keys(context.metadata).length > 0) {
      consoleContext['📦 Metadata'] = context.metadata;
    }

    if (context.tags && context.tags.length > 0) {
      consoleContext['🏷️  Tags'] = context.tags;
    }

    // Log with appropriate console method
    const logMethod = this.getConsoleMethod(level);
    const logArgs: unknown[] = [mainMessage];

    if (color && this.config.enableColors) {
      logArgs[0] = `%c${mainMessage}`;
      logArgs.push(`color: ${color}; font-weight: bold;`);
    }

    logArgs.push(consoleContext);

    // Add error stack if present
    if (context.error instanceof Error && context.error.stack) {
      logArgs.push('\n📚 Stack Trace:', context.error.stack);
    }

    logMethod(...logArgs);
  }

  private logStructured(entry: LogEntry): void {
    // Log structured JSON for machine parsing
    if (typeof console !== 'undefined' && console.log) {
      console.log('📊 Structured Log:', JSON.stringify(entry, null, 2));
    }
  }

  private logToRemote(entry: LogEntry): void {
    if (!this.config.remoteEndpoint) return;

    try {
      const payload = JSON.stringify(entry);

      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        navigator.sendBeacon(this.config.remoteEndpoint, payload);
      } else {
        fetch(this.config.remoteEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {
          // Silently fail if remote logging fails
        });
      }
    } catch {
      // Silently fail if remote logging fails
    }
  }

  private shouldSample(level: LogLevel): boolean {
    if (appConfig.environment === 'development') return false;

    const samplingRate =
      level >= LogLevel.ERROR
        ? this.config.sampling.error
        : level === LogLevel.DEBUG
          ? this.config.sampling.debug
          : this.config.sampling.performance;

    return Math.random() > samplingRate;
  }

  private normalizeError(error: unknown, context: Partial<LogContext>): Partial<LogContext> {
    if (!error) return context;

    if (error instanceof Error) {
      return {
        ...context,
        error,
        errorType: error.constructor.name,
        errorCode: (error as { code?: string | number }).code,
      };
    }

    let errorMessage: string;
    if (error === null || error === undefined) {
      errorMessage = 'Unknown error';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object') {
      try {
        errorMessage = JSON.stringify(error);
      } catch {
        errorMessage = '[Unable to stringify error object]';
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (
      typeof error === 'number' ||
      typeof error === 'boolean' ||
      typeof error === 'bigint' ||
      typeof error === 'symbol'
    ) {
      errorMessage = String(error);
    } else {
      // Fallback for any other type
      errorMessage = '[Unknown error type]';
    }

    // Create error object with proper string representation
    const errorObj: { name: string; message: string } = {
      name: 'Error',
      message: errorMessage,
    };

    // Add toString method to ensure proper stringification
    Object.defineProperty(errorObj, 'toString', {
      value: () => errorMessage,
      enumerable: false,
    });

    return {
      ...context,
      error: errorObj,
      errorType: typeof error,
    };
  }

  private sanitizeMetadata(
    metadata?: Record<string, unknown>,
    depth = 0
  ): Record<string, unknown> | undefined {
    if (!metadata || depth > this.config.maxMetadataDepth) return undefined;

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(metadata)) {
      if (value === null || value === undefined) continue;

      if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        !(value instanceof Date) &&
        !(value instanceof Error)
      ) {
        sanitized[key] = this.sanitizeMetadata(value as Record<string, unknown>, depth + 1);
      } else {
        sanitized[key] = value;
      }
    }

    return Object.keys(sanitized).length > 0 ? sanitized : undefined;
  }

  formatDuration(ms: number): string {
    if (ms < 1) return `${Math.round(ms * 1000)}μs`;
    if (ms < 1000) return `${Math.round(ms)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${Math.round(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  }

  private getConsoleMethod(level: LogLevel): typeof console.log {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug || console.log;
      case LogLevel.INFO:
        return console.info || console.log;
      case LogLevel.WARN:
        return console.warn || console.log;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error || console.log;
      default:
        return console.log;
    }
  }

  private getBrowserInfo(): Partial<LogContext> {
    if (typeof window === 'undefined') return {};

    return {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  }
}

// ============================================================================
// Global Logger Instance
// ============================================================================

export const logger = new Logger();

// ============================================================================
// Convenience Functions
// ============================================================================

export const logApiCall = (
  method: string,
  url: string,
  statusCode: number,
  duration: number,
  context: Partial<LogContext> = {}
): void => {
  const level =
    statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
  const message = `API ${method} ${url} - ${statusCode}`;

  if (level === LogLevel.ERROR) {
    logger.error(message, undefined, {
      ...context,
      module: 'api',
      action: 'api_call',
      method,
      url,
      statusCode,
      duration,
      durationFormatted: logger.formatDuration(duration),
      metadata: {
        ...context.metadata,
        method,
        url,
        statusCode,
        duration,
      },
    });
  } else if (level === LogLevel.WARN) {
    logger.warn(message, {
      ...context,
      module: 'api',
      action: 'api_call',
      method,
      url,
      statusCode,
      duration,
      durationFormatted: logger.formatDuration(duration),
      metadata: {
        ...context.metadata,
        method,
        url,
        statusCode,
        duration,
      },
    });
  } else {
    logger.info(message, {
      ...context,
      module: 'api',
      action: 'api_call',
      method,
      url,
      statusCode,
      duration,
      durationFormatted: logger.formatDuration(duration),
      metadata: {
        ...context.metadata,
        method,
        url,
        statusCode,
        duration,
      },
    });
  }
};

export const logUserAction = (
  userId: string,
  action: string,
  metadata: Record<string, unknown> = {},
  context: Partial<LogContext> = {}
): void => {
  logger.info(`User action: ${action}`, {
    ...context,
    userId,
    userEmail: context.userEmail,
    module: 'user_action',
    action,
    metadata,
    tags: ['user-action', action],
  });
};

export const logError = (error: Error, context: Partial<LogContext> = {}): void => {
  logger.error(error.message, error, {
    ...context,
    module: context.module || 'error',
    action: context.action || 'error_occurred',
    errorType: error.constructor.name,
    tags: ['error', error.constructor.name],
  });
};

export const trackError = (error: Error, context: Partial<LogContext> = {}): void => {
  logError(error, context);
};

export const logPerformance = (
  operation: string,
  duration: number,
  context: Partial<LogContext> = {}
): void => {
  const isSlow = duration > 1000; // Default threshold
  const level = isSlow ? LogLevel.WARN : LogLevel.INFO;
  const message = `Performance: ${operation}`;

  if (level === LogLevel.WARN) {
    logger.warn(message, {
      ...context,
      module: 'performance',
      action: 'performance_metric',
      operation,
      duration,
      durationFormatted: logger.formatDuration(duration),
      metadata: {
        ...context.metadata,
        operation,
        duration,
        isSlow,
      },
      tags: ['performance', 'slow'],
    });
  } else {
    logger.info(message, {
      ...context,
      module: 'performance',
      action: 'performance_metric',
      operation,
      duration,
      durationFormatted: logger.formatDuration(duration),
      metadata: {
        ...context.metadata,
        operation,
        duration,
        isSlow,
      },
      tags: ['performance', 'normal'],
    });
  }
};
