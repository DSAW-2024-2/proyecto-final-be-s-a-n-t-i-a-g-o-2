// controllers/trips/selecttrip.js
const { db } = require('../../config/firebase');
const { collection, query, where, getDocs, doc, updateDoc } = require('firebase/firestore');

const selecttrip = async (req, res) => {
    const { driverUID, seatsReserved, pickupPoint } = req.body;
    const passengerUID = req.user.uid;

    try {
    const tripsRef = collection(db, 'viajes');
    const tripsQuery = query(tripsRef, where('driverUID', '==', driverUID));
    const tripSnapshot = await getDocs(tripsQuery);

    if (tripSnapshot.empty) {
        return res.status(404).json({ error: 'Viaje no encontrado.' });
    }

    const tripDoc = tripSnapshot.docs[0];
    const tripRef = doc(db, 'viajes', tripDoc.id);
    const trip = tripDoc.data();

    // Validar si hay suficientes cupos disponibles
    if (trip.isFull || trip.seats < seatsReserved) {
        return res.status(400).json({ error: 'No hay suficientes cupos disponibles o el viaje está lleno.' });
    }

    // Evitar que el conductor reserve su propio viaje
    if (driverUID === passengerUID) {
        return res.status(400).json({ error: 'No puedes reservar tu propio viaje.' });
    }

    // Actualizar los cupos disponibles y agregar al pasajero
    const updatedPassengers = [
        ...trip.passengers,
        { passengerUID, seatsReserved, pickupPoint }
    ];

    const updatedSeats = trip.seats - seatsReserved;
    const isFull = updatedSeats === 0;

    await updateDoc(tripRef, {
        passengers: updatedPassengers,
        seats: updatedSeats,
        isFull
    });

    res.status(200).json({ message: 'Viaje reservado exitosamente.' });
    } catch (error) {
    console.error('Error al reservar el viaje:', error);
    res.status(500).json({ error: 'Error al reservar el viaje.' });
    }
};

module.exports = { selecttrip };