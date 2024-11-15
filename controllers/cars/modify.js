const { getFirestore, collection, query, where, getDocs, doc, updateDoc } = require('firebase/firestore');

const db = getFirestore();

const modify = async (req, res) => {
    try {
        const uid = req.params.uid;
        const { placa, soat, carro, capacidad, marca, modelo } = req.body;

        if (!uid) {
            return res.status(400).json({ message: 'El ID del conductor es obligatorio' });
        }

        if (!placa || !soat || !carro || !capacidad || !marca || !modelo) {
            return res.status(400).json({ message: 'Todos los campos del vehículo son obligatorios' });
        }

        const vehiculosRef = collection(db, 'vehiculos');
        const q = query(vehiculosRef, where('driverUID', '==', uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: 'No se encontró ningún vehículo para este conductor' });
        }

        const vehicleDoc = querySnapshot.docs[0];
        const vehicleRef = doc(db, 'vehiculos', vehicleDoc.id);

        await updateDoc(vehicleRef, {
            placa,
            soat,
            carro,
            capacidad,
            marca,
            modelo,
        });

        res.status(200).json({ 
            message: 'Vehículo modificado exitosamente',
            vehicleId: vehicleDoc.id
        });

    } catch (error) {
        console.error('Error al modificar el vehículo:', error);
        res.status(500).json({ 
            error: 'Error al modificar el vehículo',
            details: error.message
        });
    }
};

module.exports = { modify };