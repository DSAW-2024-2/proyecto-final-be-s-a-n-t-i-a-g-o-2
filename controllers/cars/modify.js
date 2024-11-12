const { getFirestore, doc, updateDoc } = require('firebase/firestore');
const db = getFirestore();

const modify = async (req, res) => {
    const { vehicleId } = req.params;
    const {placa, soat, carro, capacidad, marca, modelo}=req.body;

    try {
        const vehicleRef = doc(db, 'vehicles', vehicleId);

        await updateDoc(vehicleRef, {
            placa: placa,
            soat: soat,
            carro: carro,
            capacidad: capacidad,
            marca: marca,
            modelo: modelo,
        });

        res.status(200).json({ message: 'Vehículo modificado exitosamente' });
    } catch (error) {
        console.error('Error al modificar el vehículo:', error);
        res.status(500).json({ error: 'Error al modificar el vehículo' });
    }
};

module.exports={modify};