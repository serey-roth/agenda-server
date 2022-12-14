import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import tasksRoutes from './routes/tasksRoutes.js'
import projectsRoutes from './routes/projectsRoutes.js'
import usersRoutes from './routes/usersRoutes.js'

const app = express();
app.use(cors({
        origin: '*',
        optionsSuccessStatus: 200,
}));

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

dotenv.config();

app.use('/tasks', tasksRoutes);
app.use('/projects', projectsRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
        res.send("Hello to Agenda!");
})

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`)))
        .catch((error) => console.log(error.message));

