import express from 'express'
import routes from './routes/index'
import 'dotenv/config'

const port = process.env.APP_PORT
export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(routes)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
