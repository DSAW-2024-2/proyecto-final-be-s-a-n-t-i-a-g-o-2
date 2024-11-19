const { getFirestore, doc, getDoc } = require('firebase/firestore');
const db = getFirestore();

const get =async (req, res) => {
    const { vehicleuid } = req.params;

    try {
        const driverDoc = await getDoc(doc(db, 'vehiculos', vehicleuid));

        if (!driverDoc.exists()) {
            return res.status(404).json({ error: 'Vehículo no encontrado.', code: 404 });
        }

        const vehicleData = driverDoc.data();
        res.status(200).json({ vehicle: vehicleData });
    }catch(error){
        console.error('Error al obtener la información del vehículo:', error);
        res.status(500).json({error: 'Error al obtener el vehículo', code: 500});
    }
};

module.exports = { get };