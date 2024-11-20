const { getFirestore, collection, query, where, getDocs, doc, deleteDoc } = require('firebase/firestore');
const db = getFirestore();

const remove = async (req, res) => {
    const { vehicleuid } = req.params;

    try {
        const vehicleRef =doc(db, 'vehiculos', vehicleuid);

        await deleteDoc(vehicleRef);

        res.status(200).json({ message: 'Vehículo eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el vehículo:', error);
        res.status(500).json({ error: 'Error al eliminar el vehículo' });
    }
};

module.exports = { remove };
