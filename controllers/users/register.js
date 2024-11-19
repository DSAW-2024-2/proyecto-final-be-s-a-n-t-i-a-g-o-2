const multer = require('multer');
const { auth, db, storage } = require('../../config/firebase');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { createUserWithEmailAndPassword } = require('firebase/auth');
const { doc, setDoc, query, where, collection, getDocs } = require('firebase/firestore');
const { v4: uuidv4 } = require('uuid');
const upload = multer({ storage: multer.memoryStorage() });

const register = async (req, res) => {
    upload.single('photo')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Error al subir la imagen', code: 400 });
        }

        const { email, password, name, lastname, iduni, contact } = req.body;
        const file = req.file;

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

        const contactNumberRegex = /^\d{1,10}$/;
        if (!contactNumberRegex.test(contact)) {
            return res.status(400).json({ error: 'Número de contacto inválido', code: 400 });
        }

        const idRegex = /^\d{1,6}$/;
        if (!idRegex.test(iduni)) {
            return res.status(400).json({ error: 'El ID de la universidad debe contener solo números y máximo 6', code: 400 });
        }

        if (!file) {
            return res.status(400).json({ error: 'Por favor, sube una imagen', code: 400 });
        }

        try {
            const universidadQuery = query(
                collection(db, 'conductores'),
                where('iduni', '==', iduni)
            );
            const querySnapshot = await getDocs(universidadQuery);

            if (!querySnapshot.empty) {
                return res.status(400).json({ error: 'El ID de universidad ya está registrado.', code: 400 });
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const storageRef = ref(storage, `users/${user.uid}/${uuidv4()}-${file.originalname}`);
            await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype });

            const photoURL = await getDownloadURL(storageRef);

            await setDoc(doc(db, 'conductores', user.uid), {
                name,
                lastname,
                iduni,
                email,
                contact,
                photo: photoURL,
                uid: user.uid,
            });

            res.status(201).json({ message: 'Conductor registrado exitosamente', user });
        } catch (error) {
            if(user){
                await auth.currentUser.delete();
            }
            res.status(400).json({ error: error.message });
        }
    });
};

module.exports = { register };