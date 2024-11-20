// controllers/trips/getTripByDriverUID.js
const { db } = require('../../config/firebase');
const { collection, query, where, getDocs } = require('firebase/firestore');

const getTripByDriverUID = async (req, res) => {
    const { driverUID } = req.params;

    try {
    const tripsRef = collection(db, 'viajes');
    const q = query(tripsRef, where('driverUID', '==', driverUID));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return res.status(404).json({ error: 'No se encontró ningún viaje para este conductor.' });
    }

    // Asumimos que hay un solo viaje activo por conductor
    const tripDoc = querySnapshot.docs[0];
    const trip = {
        id: tripDoc.id,
        ...tripDoc.data(),
    };

    res.status(200).json({ trip });
    } catch (error) {
    console.error('Error al obtener el viaje:', error);
    res.status(500).json({ error: 'Error al obtener el viaje.' });
    }
};

module.exports = { getTripByDriverUID };