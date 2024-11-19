const { getFirestore, doc, updateDoc } = require('firebase/firestore');
const db = getFirestore();

const modify = async (req, res) => {   
        const { vehicleuid } = req.params;
        const { placa, soat, carro, capacidad, marca, modelo } = req.body;

        if (!placa && !soat && !carro && !capacidad && !marca && !modelo) {
            return res.status(400).json({ message: 'Se requiere al menos un campo para modificar.' });
        }

        try {
            const vehicleRef =doc(db, 'vehiculos', vehicleuid);

            const updates = {};
            if (placa) updates.placa = placa;
            if (soat) updates.soat = soat;
            if (carro) updates.carro = carro;
            if (capacidad) updates.capacidad = capacidad;
            if (marca) updates.marca = marca;
            if (modelo) updates.modelo = modelo;

        await updateDoc(vehicleRef, updates);

        res.status(200).json({
            message: 'Vehículo modificado exitosamente.',
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