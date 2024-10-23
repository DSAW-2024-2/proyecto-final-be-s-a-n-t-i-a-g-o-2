const express = require('express');
const cors = require('cors');
const app = express();
const { register, login, logout } = require('./controllers/authController');

app.use(cors());
app.use(express.json());

app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);

app.get('/', (req, res) => {
    res.send('Bienvenido!!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Servidor escuchando en el puerto ${PORT}`);
});
