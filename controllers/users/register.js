const { auth } = require('../../config/firebase');
const { createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

const db = getFirestore();

const register = async (req, res) => {
    const { email, password, nombre, apellido, universidadID, contacto, foto } = req.body;

    // Validar si falta algún dato
    if (!email || !password || !nombre || !apellido || !universidadID || !contacto) {
        return res.status(400).json({ error: 'Por favor, completa todos los campos', code: 400 });
    }

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Ingresa un correo electrónico válido', code: 400 });
    }

    // Validar la contraseña
    if (password.length < 8) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.', code: 400 });
    }

    // Validar el número de contacto y el ID de universidad
    const contactNumberRegex  = /^\d{1,10}$/;
    if (!contactNumberRegex.test(contacto)) {
        return res.status(400).json({ error: 'Número de contacto inválido', code: 400 });
    }

    const idRegex  = /^\d{1,6}$/;
    if (!idRegex.test(universidadID)) {
        return res.status(400).json({ error: 'El ID de la universidad debe contener solo números y máximo 6', code: 400 });
    }

    // Verificar si el universidadID ya existe en Firestore
    const universidadDocRef = doc(db, 'conductores', universidadID);
    const universidadDoc = await getDoc(universidadDocRef);

    if (universidadDoc.exists()) {
        return res.status(400).json({ error: 'El ID de universidad ya está registrado.', code: 400 });
    }

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
        // Si hay un error, eliminar el usuario creado
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