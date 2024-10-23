const { auth } = require('../config/firebase');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');
const { getFirestore, doc, setDoc} = require('firebase/firestore');

const db = getFirestore();

const register = async (req, res) => {
    const { email, password, nombre, apellido, universidadID, contacto, foto } = req.body;

    let user;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;

        await setDoc(doc(db, 'conductores', user.uid), {
            nombre: nombre,
            apellido: apellido,
            universidadID: universidadID,
            correoCorporativo: email,
            contacto: contacto,
            foto: foto || null,
            uid: user.uid,
        });

        res.status(201).json({ message: 'Conductor registrado exitosamente', user });
    } catch (error) {
        if (user) {
            await auth.currentUser.delete();
        }

        let errorMessage = 'Error al registrar al conductor.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'El correo electrónico ya está en uso.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'El correo electrónico no es válido.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        }

        res.status(400).json({ error: errorMessage });
    }
};

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

const logout = async (req, res) => {
    try {
        await signOut(auth);
        res.status(200).json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { register, login, logout};