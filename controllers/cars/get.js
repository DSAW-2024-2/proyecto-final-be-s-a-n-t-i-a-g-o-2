// controllers/cars/get.js
const { db } = require('../../config/firebase');
const { doc, getDoc } = require('firebase/firestore');

const get = async (req, res) => {
    const { carid } = req.params;

    try {
    const vehicleDoc = await getDoc(doc(db, 'vehiculos', carid));

    if (!vehicleDoc.exists()) {
        return res.status(404).json({ error: 'Vehículo no encontrado.', code: 404 });
    }

    const vehicleData = vehicleDoc.data();
    res.status(200).json({ vehicle: vehicleData });
    } catch (error) {
    console.error('Error al obtener la información del vehículo:', error);
    res.status(500).json({ error: 'Error al obtener el vehículo', code: 500 });
    }
};

module.exports = { get };