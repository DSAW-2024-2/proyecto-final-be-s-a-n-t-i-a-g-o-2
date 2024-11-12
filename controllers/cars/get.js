const {getFirestore, collection, query, where, getDocs} = require('firebase/firestore');
const db = getFirestore();
const get =async (req, res) => {
const uid = req.params.uid;

try {
    const q=query(collection(db, 'vehicles'), where('uid', '==', uid));
    const querySnapshot=await getDocs(q);

    if(querySnapshot.empty){
        res.status(404).json({message: 'Vehículo no encontrado'});
    }

    const vehicle=querySnapshot.docs[0].data();
    res.status(200).json(vehicle);
}
catch(error){
    res.status(500).json({error: 'Error al obtener el vehículo'});
    }
};

module.exports = {get};
