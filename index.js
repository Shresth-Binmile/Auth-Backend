import express from 'express'
import { sequelize } from './src/utils/connectDB.js';
import router from './src/routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import { codes } from './src/utils/codes.js';
import ENV from './src/config/server-config.js'

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use('/api/v1', router)

app.get('/', (req, res) => {
    res.status(codes.OK).json({
        status: 'Success',
    })
})

app.listen(ENV.PORT, async () => {
    try {
        await sequelize.authenticate();
        console.log(`Server is listening on port no: ${ENV.PORT}. Connection has been established successfully.`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})