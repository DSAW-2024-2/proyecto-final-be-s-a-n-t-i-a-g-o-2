const { db } = require('../../config/firebase');
const { collection, query, where, getDocs } = require('firebase/firestore');

const filteruniqueid = async (req, res) => {
    const { driverUID, departure } = req.params;

    try {
        const tripsRef = collection(db, 'viajes');
        const tripsQuery = query(
            tripsRef,
            where('driverUID', '==', driverUID),
            where('departure', '==', departure)
        );

        const querySnapshot = await getDocs(tripsQuery);

        if (querySnapshot.empty) {
            return res.status(404).json({ error: 'No se encontró el viaje para este conductor y hora de salida.' });
        }

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

module.exports = { filteruniqueid };