import { Pool } from 'pg'
import 'dotenv/config'
import { getEnvVar } from './environment'

const dbPort = Number(getEnvVar('DB_PORT', '5432'))
export const pool = new Pool({
    user: getEnvVar('DB_USER'),
    host: getEnvVar('DB_HOST', 'localhost'),
    password: getEnvVar('DB_PASSWORD'),
    database: getEnvVar('DB_NAME'),
    port: dbPort,
})
