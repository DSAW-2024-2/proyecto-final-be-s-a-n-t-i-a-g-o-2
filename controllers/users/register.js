// src/controllers/authController.js
const multer = require('multer');
const { auth, db, storage } = require('../../config/firebase');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { createUserWithEmailAndPassword } = require('firebase/auth');
const { doc, setDoc, query, where, collection, getDocs } = require('firebase/firestore');
const { v4: uuidv4 } = require('uuid');
const upload = multer({ storage: multer.memoryStorage() });

const register = async (req, res) => {
    // Manejar la subida de un único archivo opcional con el campo 'photo'
    upload.single('photo')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Error al subir la imagen', code: 400 });
        }

        const { email, password, name, lastname, iduni, contact } = req.body;
        const file = req.file;

        // Validaciones de los campos requeridos
        if (!email || !password || !name || !lastname || !iduni || !contact) {
            return res.status(400).json({ error: 'Por favor, completa todos los campos', code: 400 });
        }

        // Validación del formato del email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Ingresa un correo electrónico válido', code: 400 });
        }

        // Validación de la longitud de la contraseña
        if (password.length < 8) {
            return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.', code: 400 });
        }

        // Validación del número de contacto (máximo 10 dígitos)
        const contactNumberRegex = /^\d{1,10}$/;
        if (!contactNumberRegex.test(contact)) {
            return res.status(400).json({ error: 'Número de contacto inválido', code: 400 });
        }

        // Validación del ID de la universidad (solo números y máximo 6)
        const idRegex = /^\d{1,6}$/;
        if (!idRegex.test(iduni)) {
            return res.status(400).json({ error: 'El ID de la universidad debe contener solo números y máximo 6', code: 400 });
        }

        // La subida de la foto es opcional, así que no se realiza ninguna validación adicional

        try {
            // Verificar si el ID de la universidad ya está registrado
            const universidadQuery = query(
                collection(db, 'conductores'),
                where('iduni', '==', iduni)
            );
            const querySnapshot = await getDocs(universidadQuery);

            if (!querySnapshot.empty) {
                return res.status(400).json({ error: 'El ID de universidad ya está registrado.', code: 400 });
            }

            // Crear el usuario con Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            let photoURL = null;

            if (file) {
                // Subir la foto a Firebase Storage
                const storageRef = ref(storage, `users/${user.uid}/${uuidv4()}-${file.originalname}`);
                await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype });
                photoURL = await getDownloadURL(storageRef);
            }

            // Registrar el usuario en Firestore
            await setDoc(doc(db, 'conductores', user.uid), {
                name,
                lastname,
                iduni,
                email,
                contact,
                photo: photoURL, // Será la URL de la foto o `null`
                uid: user.uid,
            });

            // Responder al cliente (omitimos información sensible)
            res.status(201).json({ message: 'Conductor registrado exitosamente', uid: user.uid });
        } catch (error) {
            console.error('Error al registrar el conductor:', error);

            // Si el usuario fue creado pero ocurrió un error posterior, eliminar el usuario de Firebase Auth
            if (auth.currentUser) {
                try {
                    await auth.currentUser.delete();
                } catch (deleteError) {
                    console.error('Error al eliminar el usuario creado:', deleteError);
                }
            }

            res.status(400).json({ error: error.message, code: 400 });
        }
    });
};

module.exports = { register };