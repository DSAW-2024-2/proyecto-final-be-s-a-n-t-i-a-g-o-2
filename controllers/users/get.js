const { getFirestore, doc, getDoc } = require('firebase/firestore');
const db = getFirestore();

const get = async (req, res) => {
    const { uid } = req.params; 

    try {
        const userDoc = await getDoc(doc(db, 'conductores', uid));
        
        if (!userDoc.exists()) {
            return res.status(404).json({ error: 'Usuario no encontrado.', code: 404 });
        }

        const userData = userDoc.data();
        res.status(200).json({ user: userData });
    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.', code: 500 });
    }
};

module.exports = { get };