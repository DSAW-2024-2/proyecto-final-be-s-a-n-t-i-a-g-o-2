const { auth } = require('../../config/firebase');
const { signInWithEmailAndPassword } = require('firebase/auth');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const login = async (req, res) => {
const { correo, contraseña } = req.body;

try {
    const userCredential = await signInWithEmailAndPassword(auth, correo, contraseña);
    const user = userCredential.user;

    const token = jwt.sign(
        { uid: user.uid, correo: user.email },    
        ACCESS_TOKEN_SECRET,                   
        { expiresIn: '1h' }                    
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
} 
    catch (error) {
        res.status(400).json({ error: 'Correo o contraseña incorrectos' });
}
};

module.exports = { login };
