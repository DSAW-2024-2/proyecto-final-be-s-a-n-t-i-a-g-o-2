const { db } = require('../../config/firebase');
const { doc, getDoc, updateDoc } = require('firebase/firestore');

const selecttrip = async (req, res) => {
    const { tripID, seatsReserved, pickupPoint } = req.body;
    const passengerUID = req.user.uid; // Obtenido del token JWT

    try {
        // Obtener el documento del viaje
        const tripRef = doc(db, 'viajes', tripID);
        const tripSnapshot = await getDoc(tripRef);

        if (!tripSnapshot.exists()) {
            return res.status(404).json({ error: 'Viaje no encontrado.' });
        }

        const trip = tripSnapshot.data();

        // Validar si hay suficientes cupos disponibles
        if (trip.isFull || trip.availableSeats < seatsReserved) {
            return res.status(400).json({ error: 'No hay suficientes cupos disponibles o el viaje está lleno.' });
        }

        // Actualizar los cupos disponibles y agregar al pasajero
        const updatedPassengers = [
            ...trip.passengers,
            { passengerUID, seatsReserved, pickupPoint }
        ];

        const updatedSeats = trip.availableSeats - seatsReserved;
        const isFull = updatedSeats === 0;

        await updateDoc(tripRef, {
            passengers: updatedPassengers,
            availableSeats: updatedSeats,
            isFull
        });

        res.status(200).json({ message: 'Viaje reservado exitosamente.' });
    } catch (error) {
        console.error('Error al seleccionar el viaje:', error);
        res.status(500).json({ error: 'Error al seleccionar el viaje.' });
    }
};

module.exports = { selecttrip };