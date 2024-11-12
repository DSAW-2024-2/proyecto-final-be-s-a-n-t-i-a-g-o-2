const { getFirestore, doc, deleteDoc } = require('firebase/firestore');
const db = getFirestore();

const remove = async (req, res) => {
    const { vehicleId } = req.params;

    try {
        const vehicleRef = doc(db, 'vehicles', vehicleId);

        await deleteDoc(vehicleRef);

        res.status(200).json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el vehículo:', error);
        res.status(500).json({ error: 'Error al eliminar el vehículo' });
    }
};

module.exports = {remove};