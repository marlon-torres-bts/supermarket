import { getLogger, Logger } from 'log4js'

export function createLogger(category: string): Logger {
    const logger = getLogger(category)
    logger.level = process.env.LOGGER_LEVEL || 'info'
    return logger
}
