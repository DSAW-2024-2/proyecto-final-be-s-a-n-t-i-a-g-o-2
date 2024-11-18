const { getFirestore, collection, query, where, getDocs, doc, updateDoc } = require('firebase/firestore');

const db = getFirestore();

const modify = async (req, res) => {
    try {
        const uid = req.params.uid;
        const { placa, soat, carro, capacidad, marca, modelo } = req.body;

        if (!uid) {
            return res.status(400).json({ message: 'El ID del conductor es obligatorio.' });
        }

        // Verificar si al menos un campo para modificar está presente
        if (!placa && !soat && !carro && !capacidad && !marca && !modelo) {
            return res.status(400).json({ message: 'Se requiere al menos un campo para modificar.' });
        }

        // Buscar el vehículo asociado al driverUID
        const vehiculosRef = collection(db, 'vehiculos');
        const q = query(vehiculosRef, where('driverUID', '==', uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: 'No se encontró ningún vehículo para este conductor.' });
        }

        // Obtener la referencia del documento del vehículo
        const vehicleDoc = querySnapshot.docs[0];
        const vehicleRef = doc(db, 'vehiculos', vehicleDoc.id);

        // Construir dinámicamente el objeto de actualizaciones
        const updates = {};
        if (placa) updates.placa = placa;
        if (soat) updates.soat = soat;
        if (carro) updates.carro = carro;
        if (capacidad) updates.capacidad = capacidad;
        if (marca) updates.marca = marca;
        if (modelo) updates.modelo = modelo;

        // Actualizar el documento del vehículo en Firestore
        await updateDoc(vehicleRef, updates);

        res.status(200).json({
            message: 'Vehículo modificado exitosamente.',
            vehicleId: vehicleDoc.id
        });
    } catch (error) {
        console.error('Error al modificar el vehículo:', error);
        res.status(500).json({
            error: 'Error al modificar el vehículo.',
            details: error.message
        });
    }
};

module.exports = { modify };