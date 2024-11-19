const { getFirestore, doc, setDoc, collection, query, where, getDocs } = require('firebase/firestore');
const db = getFirestore();

const add = async (req, res) => {
    const { placa, soat, carro, capacidad, marca, modelo } = req.body;
    const driverUID = req.user.uid;

    try {
        const vehicleQuery = query(
            collection(db, 'vehiculos'),
            where('driverUID', '==', driverUID)
        );
        
        const querySnapshot = await getDocs(vehicleQuery);

        if (!querySnapshot.empty) {
            return res.status(400).json({ message: 'Ya existe un vehículo registrado para este usuario.' });
        }

        const vehicleRef = doc(collection(db, 'vehiculos'));
        await setDoc(vehicleRef, {
            driverUID: driverUID,
            placa: placa,
            soat: soat,
            carro: carro,
            capacidad: capacidad,
            marca: marca,
            modelo: modelo,
        });

        res.status(200).json({ message: 'Vehículo registrado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el vehículo' });
    }
};

module.exports = { add };
