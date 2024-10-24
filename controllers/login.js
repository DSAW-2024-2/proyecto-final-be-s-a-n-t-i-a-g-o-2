const { auth } = require('../config/firebase');
const { signInWithEmailAndPassword } = require('firebase/auth');

const login = async (req, res) => {
const { email, password } = req.body;

try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    res.status(200).json({ message: 'Inicio de sesión exitoso', user });
    } catch (error) {
        res.status(400).json({ error: 'Correo o contraseña incorrectos' });
    }
};

module.exports = { login };
