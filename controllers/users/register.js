const { auth } = require('../../config/firebase');
const { createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

const db = getFirestore();

const register = async (req, res) => {
    const { email, password, name, lastname, iduni, contact, photo } = req.body;

    if (!email || !password || !name || !lastname || !iduni || !contact) {
        return res.status(400).json({ error: 'Por favor, completa todos los campos', code: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Ingresa un correo electrónico válido', code: 400 });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.', code: 400 });
    }

    const contactNumberRegex  = /^\d{1,10}$/;
    if (!contactNumberRegex.test(contact)) {
        return res.status(400).json({ error: 'Número de contacto inválido', code: 400 });
    }

    const idRegex  = /^\d{1,6}$/;
    if (!idRegex.test(iduni)) {
        return res.status(400).json({ error: 'El ID de la universidad debe contener solo números y máximo 6', code: 400 });
    }

    const universidadDocRef = doc(db, 'conductores', iduni);
    const universidadDoc = await getDoc(universidadDocRef);

    if (universidadDoc.exists()) {
        return res.status(400).json({ error: 'El ID de universidad ya está registrado.', code: 400 });
    }

    let user;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;

        await setDoc(doc(db, 'conductores', user.uid), {
            name: name,
            lastname: lastname,
            iduni: iduni,
            email: email,
            contact: contact,
            photo: photo || null,
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

module.exports = { register };