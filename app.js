require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const tripRoutes = require('./routes/tripRoutes');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://fe-proyectofinal.vercel.app'],
    credentials: true,
}));

app.use(express.json());

app.use('/users', userRoutes);
app.use('/cars', carRoutes);
app.use('/trips', tripRoutes);

app.get('/', (req, res) => {
    res.send('Deskpinchados');
});

app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
