const { db } = require('../../config/firebase');
const { collection, getDocs, query, where } = require('firebase/firestore');

const filtertrips = async (req, res) => {
    const { startPoint, minSeats } = req.query;

    try {
        // Construir la consulta dinámicamente según los filtros
        let tripsQuery = collection(db, 'viajes');

        if (startPoint) {
            tripsQuery = query(tripsQuery, where('startPoint', '==', startPoint));
        }

        if (minSeats) {
            tripsQuery = query(tripsQuery, where('availableSeats', '>=', parseInt(minSeats)));
        }

        const querySnapshot = await getDocs(tripsQuery);

        // Mapear los documentos en un array de viajes
        const trips = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(trips);
    } catch (error) {
        console.error('Error al filtrar los viajes:', error);
        res.status(500).json({ error: 'Error al filtrar los viajes.' });
    }
};

module.exports = { filtertrips };
