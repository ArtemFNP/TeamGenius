import express from 'express';
import cors from 'cors';
import weatherRoutes from './routes/weatherRoutes.js';
import clothingRoutes from './routes/clothingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/weather', weatherRoutes);
app.use('/api/clothing', clothingRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('SmartStyle API is running');
});

const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

