import express from 'express'
import routes from './routes/index'
import 'dotenv/config'
import { getEnvVar } from './config/environment'

const port = getEnvVar('APP_PORT', '4000')
export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(routes)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
