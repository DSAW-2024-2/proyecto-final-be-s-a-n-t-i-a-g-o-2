const { getFirestore, doc, getDoc, deleteDoc } = require('firebase/firestore');

const db = getFirestore();

const deletetrips = async (req, res) => {
    try {
        const { tripID } = req.params;

        if (!tripID) {
            return res.status(400).json({ message: 'El ID del viaje es obligatorio.' });
        }

        const tripRef = doc(db, 'viajes', tripID);

        const tripSnapshot = await getDoc(tripRef);
        if (!tripSnapshot.exists()) {
            return res.status(404).json({ message: 'El viaje no fue encontrado.' });
        }

        await deleteDoc(tripRef);

        res.status(200).json({ message: 'El viaje fue eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el viaje:', error);
        res.status(500).json({ 
            error: 'Error al eliminar el viaje.',
            details: error.message
        });
    }
};

module.exports = { deletetrips };