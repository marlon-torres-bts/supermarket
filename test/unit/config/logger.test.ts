import { expect } from 'chai'
import { Level } from 'log4js'
import { createLogger } from '../../../src/config/logger'

describe('logger', () => {
    context('createLogger', () => {
        afterEach(() => {
            process.env.LOGGER_LEVEL = 'off'
        })

        it('should create a logger with the given category', () => {
            const logger = createLogger('test')
            const category = logger.category
            const level = (logger.level as Level).levelStr

            expect(category).to.be.equal('test')
            expect(level).to.be.equal('OFF')
        })

        it('should create a logger with the level set in env variables', () => {
            process.env.LOGGER_LEVEL = 'error'
            const logger = createLogger('test')
            const level = (logger.level as Level).levelStr

            expect(level).to.be.equal('ERROR')
        })

        context('when the env variable is not set', () => {
            it('should create a logger with the level set to info', () => {
                process.env.LOGGER_LEVEL = ''
                const logger = createLogger('test')
                const level = (logger.level as Level).levelStr

                expect(level).to.be.equal('INFO')
            })
        })
    })
})
