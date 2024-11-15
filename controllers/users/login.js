const { auth } = require('../../config/firebase');
const { signInWithEmailAndPassword } = require('firebase/auth');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const login = async (req, res) => {
const { email, password } = req.body;

try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const token = jwt.sign(
        { uid: user.uid, email: user.email },    
        ACCESS_TOKEN_SECRET,                   
        { expiresIn: '1h' }                    
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
} 
catch (error) {
    console.error('Error de inicio de sesión:', error.message);

    if (error.code === 'auth/user-not-found') {
        res.status(400).json({ error: 'Usuario no encontrado. Verifica el correo electrónico.' });
    } else if (error.code === 'auth/wrong-password') {
        res.status(400).json({ error: 'Contraseña incorrecta.' });
    } else {
        res.status(400).json({ error: 'Error en el inicio de sesión. Verifica tus credenciales.' });
    }
}
};

module.exports = { login };
