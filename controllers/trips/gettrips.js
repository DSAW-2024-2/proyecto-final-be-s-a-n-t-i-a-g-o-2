const { db } = require('../../config/firebase');
const { collection, getDocs, query, where } = require('firebase/firestore');

const gettrips = async (req, res) => {
    try {
        const tripsQuery = query(collection(db, 'viajes'), where('isFull', '==', false));
        const querySnapshot = await getDocs(tripsQuery);

        const trips = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(trips);
    } catch (error) {
        console.error('Error al listar los viajes:', error);
        res.status(500).json({ error: 'Error al listar los viajes.' });
    }
};

module.exports = { gettrips };
