const { db } = require('../../config/firebase');
const { collection, addDoc, getDocs, query, where } = require('firebase/firestore');

const newtrip = async (req, res) => {
    const { start, end, route, departure, price, seats } = req.body;
    const driverUID = req.user.uid;

    if (!start || !end || !route || !departure || !price || !seats) {
        return res.status(400).json({ error: 'Todos los campos son requeridos: start, end, route, departure, price, seats' });
    }

    if (typeof start !== 'string' || typeof end !== 'string') {
        return res.status(400).json({ error: 'Las ubicaciones de inicio y fin deben ser cadenas de texto.' });
    }

    if (typeof route !== 'string') {
        return res.status(400).json({ error: 'La ruta debe ser una cadena de texto.' });
    }

    if (isNaN(Date.parse(departure))) {
        return res.status(400).json({ error: 'La fecha de salida debe ser una fecha válida.' });
    }

    if (isNaN(price) || price <= 0) {
        return res.status(400).json({ error: 'El precio debe ser un número mayor a 0.' });
    }

    if (isNaN(seats) || seats <= 0) {
        return res.status(400).json({ error: 'El número de asientos debe ser un número mayor a 0.' });
    }

    try {
        const vehiclesQuery = query(collection(db, 'vehiculos'), where('driverUID', '==', driverUID));
        const vehicleSnapshot = await getDocs(vehiclesQuery);

        if (vehicleSnapshot.empty) {
            return res.status(400).json({ error: 'El conductor no tiene un vehículo registrado.' });
        }

        const tripData = {
            driverUID,
            start, 
            end,
            route,
            departure,
            seats,
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
