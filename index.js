import express from 'express'
import cors from 'cors'
import userEndpoint from './routers/users.js'
import activitiesEndpoint from './routers/activities.js'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()
const port = 8000
const app = express()

app.use(cookieParser())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto',
        maxAge: 2 * 60 * 60 * 1000
    }
}))
app.use(express.json())
app.use(cors())
app.use('/', userEndpoint)
app.use('/activity', activitiesEndpoint)

app.listen(port, () => {
    return console.log(`Server run in port ${port}`)
})