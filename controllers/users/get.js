const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');
const db = getFirestore();

const get = async (req, res) => {
    const { universidadID } = req.params;

    try {
        const userQuery = query(
            collection(db, 'conductores'),
            where('universidadID', '==', universidadID)
        );

        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
            return res.status(404).json({ error: 'No se encontraron usuarios para este ID de universidad.', code: 404 });
        }

        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });

    } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor.', code: 500 });
    }
};

module.exports = { get };
