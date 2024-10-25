const { auth } = require('../config/firebase');
const { signInWithEmailAndPassword } = require('firebase/auth');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

const login = async (req, res) => {
const { email, password } = req.body;

try {
    console.log('Iniciando sesión con:', email, password);  // Imprime los valores que se envían

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
    // Imprimir el error real que está ocurriendo
    console.error('Error al iniciar sesión:', error.message);
    res.status(400).json({ error: error.message });
}
}


module.exports = { login };
