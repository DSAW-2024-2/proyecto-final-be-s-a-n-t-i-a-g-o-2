const { auth } = require('../../config/firebase');
const { signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const db = getFirestore();

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
    // Autenticar al usuario con Firebase
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Obtener el token de acceso del usuario
    const token = await firebaseUser.getIdToken();

    // Obtener los datos adicionales del usuario desde Firestore
    const userDoc = await getDoc(doc(db, 'conductores', firebaseUser.uid));

    if (!userDoc.exists()) {
    return res.status(404).json({ message: 'Usuario no encontrado en la base de datos.' });
    }

    const userData = userDoc.data();

    // Incluir el 'uid' y los datos adicionales en los datos del usuario
    const userResponse = { uid: firebaseUser.uid, ...userData };

    // Generar el JWT utilizando el uid y email
    const jwtToken = jwt.sign(
    { uid: firebaseUser.uid, email: firebaseUser.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
    );

    // Enviar la respuesta con el JWT y los datos del usuario
    res.status(200).json({
    message: 'Inicio de sesión exitoso',
    token: jwtToken,
    user: userResponse,
    });
    } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(400).json({ message: 'Credenciales inválidas.' });
    }
};

module.exports = { login };
