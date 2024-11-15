const { db } = require('../../config/firebase');
const { collection, addDoc, getDocs, query, where } = require('firebase/firestore');

const newtrip = async (req, res) => {
    const { start, end, route, departure, price } = req.body;
    const driverUID = req.user.uid;

    try {
        const vehiclesQuery = query(collection(db, 'vehiculos'), where('driverUID', '==', driverUID));
        const vehicleSnapshot = await getDocs(vehiclesQuery);

        if (vehicleSnapshot.empty) {
            return res.status(400).json({ error: 'El conductor no tiene un vehículo registrado.' });
        }

        const vehiculos = vehicleSnapshot.docs[0].data();
        const vehicleID = vehicleSnapshot.docs[0].id;

        const tripData = {
            driverUID,
            vehicleID,
            start,
            end,
            route,
            departure,
            availableSeats: vehiculos.capacidad,
            price,
            isFull: false,
            passengers: []
        };

        const tripRef = await addDoc(collection(db, 'viajes'), tripData);
        res.status(201).json({ message: 'Viaje registrado exitosamente', tripID: tripRef.id });
    } catch (error) {
        console.error('Error al registrar el viaje:', error);
        res.status(500).json({ error: 'Error al registrar el viaje' });
    }
};

module.exports = { newtrip };
