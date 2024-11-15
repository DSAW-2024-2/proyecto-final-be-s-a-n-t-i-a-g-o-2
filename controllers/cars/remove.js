const { getFirestore, collection, query, where, getDocs, doc, deleteDoc } = require('firebase/firestore');
const db = getFirestore();

const remove = async (req, res) => {
    const uid = req.params.uid;

    try {
        const q = query(collection(db, 'vehiculos'), where('driverUID', '==', uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: 'No se encontró ningún vehículo para este conductor' });
        }

        const vehicleId = querySnapshot.docs[0].id;

        const vehicleRef = doc(db, 'vehiculos', vehicleId);
        await deleteDoc(vehicleRef);

        res.status(200).json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el vehículo:', error);
        res.status(500).json({ error: 'Error al eliminar el vehículo' });
    }
};

module.exports = { remove };
