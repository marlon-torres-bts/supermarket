import { getLogger, Logger } from 'log4js'
import { getEnvVar } from './environment'

export function createLogger(category: string): Logger {
    const logger = getLogger(category)
    logger.level = getEnvVar('LOGGER_LEVEL', 'info')!
    return logger
}
