import winston from 'winston'
import __dirname from './../../absolute-path.js'
import { config } from './../../config/config.js'

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
  
    colors: {
        fatal: 'magenta',
        error: 'red',
        warning: 'yellow',
        info: 'cyan',
        http: 'grey',
        debug: 'green'    
    },
}

const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customLevels.colors,
                }),
                winston.format.simple()
            )
        })
    ],
})

const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
      new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({
                    colors: customLevels.colors,
                }),
                winston.format.simple()
            )
        }),
      new winston.transports.File({
            filename: __dirname + "/helpers/logger/error.log",
            level: "error"
        })
    ],
})

export const addLogger = (req, res, next) => {
    if (config.logger.environment === "development") {
        req.logger = devLogger
    } else if (config.logger.environment === "production") {
        req.logger = prodLogger
    }
    next()
}