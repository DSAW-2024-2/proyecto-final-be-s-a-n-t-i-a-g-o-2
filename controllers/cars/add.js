const multer = require('multer');
const { getFirestore, doc, setDoc, collection, query, where, getDocs } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');
const { v4: uuidv4 } = require('uuid');

const db = getFirestore();
const storage = getStorage();

// Configuración de multer para manejar archivos en memoria
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

// Función para subir archivos a Firebase Storage
const uploadFileToStorage = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype });
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

// Función para manejar la adición de un vehículo
const add = async (req, res) => {
    // Utilizar multer para procesar los campos 'carro' y 'soat', permitiendo que sean opcionales
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

        // Validación de campos requeridos, excluyendo las imágenes
        if (!placa || !capacidad || !marca || !modelo) {
            return res.status(400).json({ message: 'Por favor, completa todos los campos requeridos.' });
        }

        // Las imágenes son opcionales, por lo que no se valida su presencia
        const carroPhoto = req.files['carro'] ? req.files['carro'][0] : null;
        const soatPhoto = req.files['soat'] ? req.files['soat'][0] : null;

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

            // Inicializar variables para las URLs de las fotos
            let carroPhotoURL = null;
            let soatPhotoURL = null;

            // Inicializar un objeto para almacenar las rutas de archivos subidos
            req.uploadedFiles = {};

            // Subir las fotos solo si están presentes
            if (carroPhoto) {
                const carroPhotoPath = `vehiculos/${driverUID}/carro-${uuidv4()}-${carroPhoto.originalname}`;
                req.uploadedFiles.carroPhotoPath = carroPhotoPath;
                carroPhotoURL = await uploadFileToStorage(carroPhoto, carroPhotoPath);
            }

            if (soatPhoto) {
                const soatPhotoPath = `vehiculos/${driverUID}/soat-${uuidv4()}-${soatPhoto.originalname}`;
                req.uploadedFiles.soatPhotoPath = soatPhotoPath;
                soatPhotoURL = await uploadFileToStorage(soatPhoto, soatPhotoPath);
            }

            // Guardar la información del vehículo en Firestore
            await setDoc(vehicleRef, {
                carid: vehicleID,
                driverUID: driverUID,
                placa: placa,
                capacidad: capacidad,
                marca: marca,
                modelo: modelo,
                carro: carroPhotoURL, // Puede ser una URL o null
                soat: soatPhotoURL,   // Puede ser una URL o null
                createdAt: new Date().toISOString()
            });

            res.status(201).json({ message: 'Vehículo registrado correctamente', vehicleID });
        } catch (error) {
            console.error('Error al registrar el vehículo:', error);

            // Si hubo archivos subidos, intentar eliminarlos para mantener la consistencia
            if (req.uploadedFiles) {
                const deletePromises = [];

                if (req.uploadedFiles.carroPhotoPath) {
                    const carroStorageRef = ref(storage, req.uploadedFiles.carroPhotoPath);
                    deletePromises.push(deleteObject(carroStorageRef).catch(() => {}));
                }

                if (req.uploadedFiles.soatPhotoPath) {
                    const soatStorageRef = ref(storage, req.uploadedFiles.soatPhotoPath);
                    deletePromises.push(deleteObject(soatStorageRef).catch(() => {}));
                }

                await Promise.all(deletePromises);
            }

            res.status(500).json({ message: 'Error al registrar el vehículo', error: error.message });
        }
    });
};

module.exports = { add };