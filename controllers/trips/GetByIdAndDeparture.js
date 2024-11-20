// controllers/trips/getTripById.js
const { db } = require('../../config/firebase');
const { doc, getDoc } = require('firebase/firestore');

const getTripById = async (req, res) => {
    const { tripID } = req.params;

    try {
    const tripRef = doc(db, 'viajes', tripID);
    const tripSnapshot = await getDoc(tripRef);

    if (!tripSnapshot.exists()) {
        return res.status(404).json({ error: 'Viaje no encontrado.' });
    }

    const trip = {
        id: tripSnapshot.id,
        ...tripSnapshot.data(),
    };

    res.status(200).json({ trip });
    } catch (error) {
    console.error('Error al obtener el viaje:', error);
    res.status(500).json({ error: 'Error al obtener el viaje.' });
    }
};

module.exports = { getTripById };