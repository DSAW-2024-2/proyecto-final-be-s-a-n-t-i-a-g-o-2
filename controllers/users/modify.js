const { getFirestore, doc, updateDoc } = require('firebase/firestore');
const { getAuth, updatePassword } = require('firebase/auth');
const db = getFirestore();
const auth = getAuth();

const modify = async (req, res) => {
    const { uid } = req.params;
    const { name, lastname, contact, photo, password } = req.body;

    if (!name && !lastname && !contact && !photo && !password) {
        return res.status(400).json({ error: 'Se requiere al menos un campo para modificar.', code: 400 });
    }

    try {
        const userRef = doc(db, 'conductores', uid);
        const updates = {};

        if (name) updates.name = name;
        if (lastname) updates.lastname = lastname;
        if (contact) updates.contact = contact;
        if (photo) updates.photo = photo;

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
};

module.exports = { modify };