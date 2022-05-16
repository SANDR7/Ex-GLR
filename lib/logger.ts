import { resolve } from 'path';
import { fileURLToPath } from 'url';
import winston from 'winston';

const { format, transports, createLogger } = winston;
const { combine, timestamp, printf } = format;
/*
 *
 * Logger should only be used on Server-Side (SSR)
 *
 */
const logger = (metaUrl: string) => {
  const root = resolve('./');
  const file = fileURLToPath(new URL(metaUrl));
  const filePath = file.replace(root, '');

  const customFormat = printf(
    ({ level, message, timestamp: timeStamp, stack }) => {
      return `${timeStamp} [${level}] ${filePath}: ${stack || message}`;
    }
  );

  const CreateLogger = createLogger({
    level: 'info',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.splat(),
      format.errors({ stack: true }),
      customFormat
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
      new transports.File({ filename: 'logs/NEXT_ERROR.log', level: 'error' }),
      new transports.File({ filename: 'logs/NEXT_LOG.log' }),
      new transports.File({
        filename: 'logs/NEXT_LOG.json',
        format: combine(
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.json(),
          format.errors({ stack: true })
        )
      })
    ]
  });

  // Log also to console if not in production
  if (process.env.NODE_ENV === 'development') {
    CreateLogger.add(
      new transports.Console({
        format: combine(format.colorize(), customFormat)
      })
    );
  }

  return CreateLogger;
};

export default logger;
