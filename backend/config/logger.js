import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    return meta && Object.keys(meta).length > 0
      ? `${log} ${JSON.stringify(meta, null, 2)}`
      : log;
  })
);

// On Vercel serverless, filesystem is read-only — only use Console transport
const isServerless = !!process.env.VERCEL;

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  })
];

// Only add file transports in non-serverless environments
if (!isServerless) {
  const fs = await import('fs');
  if (!fs.existsSync('logs')) fs.mkdirSync('logs', { recursive: true });

  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/app.log' })
  );
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'skillverse-backend' },
  transports
});

export default logger;
