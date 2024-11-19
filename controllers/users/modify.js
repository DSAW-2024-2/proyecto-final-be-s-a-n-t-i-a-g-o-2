const multer = require('multer');
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');
const { storage, db, auth } = require('../../config/firebase');
const { doc, updateDoc, getDoc } = require('firebase/firestore');
const { v4: uuidv4 } = require('uuid');
const upload = multer({ storage: multer.memoryStorage() }).single('photo');

const modify = async (req, res) => {
    const { uid } = req.params;
    const { name, lastname, contact, password } = req.body;

    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: 'Error al subir la imagen', code: 400 });
        }

        try {
            const userRef = doc(db, 'conductores', uid);
            const updates = {};

            const userSnapshot = await getDoc(userRef);
            if (!userSnapshot.exists()) {
                return res.status(404).json({ error: 'Usuario no encontrado.', code: 404 });
            }

            if (name) updates.name = name;
            if (lastname) updates.lastname = lastname;
            if (contact) updates.contact = contact;

            if (req.file) {
                const existingPhotoURL = userSnapshot.data()?.photo;
                if (existingPhotoURL) {
                    const oldPhotoRef = ref(storage, existingPhotoURL);
                    await deleteObject(oldPhotoRef);
                }

                const photoBuffer = req.file.buffer;
                const photoRef = ref(storage, `users/${uid}/${uuidv4()}-${req.file.originalname}`);
                await uploadBytes(photoRef, photoBuffer, { contentType: req.file.mimetype });

                const photoURL = await getDownloadURL(photoRef);
                updates.photo = photoURL;
            }

            if (password) {
                const user = auth.currentUser;
                if (!user) {
                    return res.status(401).json({ error: 'Usuario no autenticado.', code: 401 });
                }
                await updatePassword(user, password);
            }

            if (Object.keys(updates).length > 0) {
                await updateDoc(userRef, updates);
            }

            res.status(200).json({ message: 'Información del usuario actualizada exitosamente.' });
        } catch (error) {
            console.error('Error al actualizar la información del usuario:', error);
            res.status(500).json({ error: 'Error interno del servidor.', code: 500 });
        }
    });
};

module.exports = { modify };