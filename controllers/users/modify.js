const { getFirestore, doc, updateDoc } = require('firebase/firestore');
const db = getFirestore();

const modify = async (req, res) => {
    const { uid } = req.params;
    const { name, lastname, contact, photo, password } = req.body;

    if (!name && !lastname && !contact && !photo && !password) {
        return res.status(400).json({ error: 'Se requiere al menos un campo para modificar.', code: 400 });
    }

    try {
        // Crear referencia al documento del usuario
    const userRef = db.collection('conductores').doc(uid);

    // Actualizar los datos del usuario
    await userRef.update({
        name,
        lastname,
        email,
        contact,
        iduni,
        photo,
    });

    res.status(200).json({ message: 'Perfil actualizado exitosamente.' });
    } catch (error) {
    console.error('Error al actualizar el perfil del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = { modify };