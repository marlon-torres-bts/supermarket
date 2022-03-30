import { Pool } from 'pg'
import 'dotenv/config'

const dbPort = Number(process.env.DB_PORT) || 5432
export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: dbPort
})