import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
    res.send('Hello from Hugging Face!');
})

const startServer = async () => {
    try {
      connectDB(process.env.MONGODB_URL);
     // console.log("ESTA ES LA KEY DE OPENAI",process.env.OPENAI_API_KEY)
     // console.log("ESTA ES LA KEY DE MONGODB",process.env.MONGODB_URL)
    app.listen(8080, () => console.log('Server has started on port http://localhost:8080'))
} catch (error) {
  console.log(error);
}
}

startServer();
