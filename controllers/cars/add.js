const multer = require('multer');
const { getFirestore, doc, setDoc, collection, query, where, getDocs } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { v4: uuidv4 } = require('uuid');

const db = getFirestore();
const storage = getStorage();

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});

const uploadFileToStorage = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype });
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

const add = async (req, res) => {
    upload.fields([
        { name: 'carro', maxCount: 1 },
        { name: 'soat', maxCount: 1 }
    ])(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: 'Error al subir las imágenes.', error: err.message });
        }

        const { placa, capacidad, marca, modelo } = req.body;
        const driverUID = req.user.uid;

        if (!placa || !capacidad || !marca || !modelo) {
            return res.status(400).json({ message: 'Por favor, completa todos los campos requeridos.' });
        }

        if (!req.files || !req.files['carro'] || !req.files['soat']) {
            return res.status(400).json({ message: 'Por favor, sube tanto la foto del vehículo como la foto del SOAT.' });
        }

        const carroPhoto = req.files['carro'][0];
        const soatPhoto = req.files['soat'][0];

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
            const vehicleID = vehicleRef.id;

            const carroPhotoPath = `vehiculos/${driverUID}/carro-${uuidv4()}-${carroPhoto.originalname}`;
            const soatPhotoPath = `vehiculos/${driverUID}/soat-${uuidv4()}-${soatPhoto.originalname}`;

            req.uploadedFiles = { carroPhotoPath, soatPhotoPath };

            const [carroPhotoURL, soatPhotoURL] = await Promise.all([
                uploadFileToStorage(carroPhoto, carroPhotoPath),
                uploadFileToStorage(soatPhoto, soatPhotoPath)
            ]);

            await setDoc(vehicleRef, {
                carid: vehicleID,
                driverUID: driverUID,
                placa: placa,
                capacidad: capacidad,
                marca: marca,
                modelo: modelo,
                carro: carroPhotoURL,
                soat: soatPhotoURL,
                createdAt: new Date().toISOString()
            });

            res.status(201).json({ message: 'Vehículo registrado correctamente', vehicleID });
        } catch (error) {
            console.error('Error al registrar el vehículo:', error);

            if (req.uploadedFiles) {
                const deletePromises = [];

                if (req.uploadedFiles.carroPhotoPath) {
                    const carroStorageRef = ref(storage, req.uploadedFiles.carroPhotoPath);
                    deletePromises.push(carroStorageRef.delete().catch(() => {}));
                }

                if (req.uploadedFiles.soatPhotoPath) {
                    const soatStorageRef = ref(storage, req.uploadedFiles.soatPhotoPath);
                    deletePromises.push(soatStorageRef.delete().catch(() => {}));
                }

                await Promise.all(deletePromises);
            }

            res.status(500).json({ message: 'Error al registrar el vehículo', error: error.message });
        }
    });
};

module.exports = { add };