const { getFirestore, doc, updateDoc } = require('firebase/firestore');
const db = getFirestore();

const modify = async (req, res) => {
    const { uid } = req.params;
    const { nombre, apellido, contacto, foto, contrasena } = req.body;

    if (!nombre && !apellido && !contacto && !foto && !contrasena) {
        return res.status(400).json({ error: 'Se requiere al menos un campo para modificar.', code: 400 });
    }

    try {
        const userRef = doc(db, 'conductores', uid);
        
        const updates = {};
        if (nombre) updates.nombre = nombre;
        if (apellido) updates.apellido = apellido;
        if (contacto) updates.contacto = contacto;
        if (foto) updates.foto = foto;
        if (contrasena) updates.contrasena = contrasena;

        await updateDoc(userRef, updates);
        
        res.status(200).json({ message: 'Información del usuario actualizada exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar la información del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.', code: 500 });
    }
};

module.exports = { modify };