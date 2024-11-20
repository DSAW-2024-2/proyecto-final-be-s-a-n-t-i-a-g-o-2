const multer = require('multer');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');
const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');
const { v4: uuidv4 } = require('uuid');

const db = getFirestore();
const storage = getStorage();

// Configuración de multer para manejar múltiples archivos en memoria
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

// Función auxiliar para subir un archivo a Firebase Storage y obtener su URL
const uploadFileToStorage = async (file, path) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file.buffer, { contentType: file.mimetype });
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};

// Función auxiliar para extraer la ruta de Firebase Storage desde la URL de descarga
const extractStoragePathFromURL = (url) => {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname; // /v0/b/{bucket}/o/{path}
        const pathWithEncodedSlashes = pathname.split('/o/')[1].split('?')[0];
        const storagePath = decodeURIComponent(pathWithEncodedSlashes);
        return storagePath;
    } catch (error) {
        console.error('Error al extraer la ruta de almacenamiento desde la URL:', error);
        return null;
    }
};

const modify = async (req, res) => {
    // Configuramos multer para manejar dos campos de archivos: 'carro' y 'soat'
    upload.fields([
        { name: 'carro', maxCount: 1 },
        { name: 'soat', maxCount: 1 }
    ])(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            // Error de multer (e.g., tamaño de archivo excedido)
            return res.status(400).json({ message: err.message });
        } else if (err) {
            // Otro tipo de error
            return res.status(400).json({ message: 'Error al subir las imágenes.', error: err.message });
        }

        const { vehicleuid } = req.params;
        const { placa, capacidad, marca, modelo } = req.body;

        if (!placa && !capacidad && !marca && !modelo && !req.files['carro'] && !req.files['soat']) {
            return res.status(400).json({ message: 'Se requiere al menos un campo para modificar.' });
        }

        try {
            const vehicleRef = doc(db, 'vehiculos', vehicleuid);
            const vehicleSnapshot = await getDoc(vehicleRef);

            if (!vehicleSnapshot.exists()) {
                return res.status(404).json({ message: 'Vehículo no encontrado.' });
            }

            const updates = {};
            const existingData = vehicleSnapshot.data();

            // Actualización de campos de texto si se proporcionan
            if (placa) updates.placa = placa;
            if (capacidad) updates.capacidad = capacidad;
            if (marca) updates.marca = marca;
            if (modelo) updates.modelo = modelo;

            // Manejo de la imagen 'carro' si se proporciona una nueva
            if (req.files['carro'] && req.files['carro'][0]) {
                const carroPhoto = req.files['carro'][0];

                // Eliminar la imagen existente de 'carro' si existe
                if (existingData.carro) {
                    const carroStoragePath = extractStoragePathFromURL(existingData.carro);
                    if (carroStoragePath) {
                        const carroStorageRef = ref(storage, carroStoragePath);
                        await deleteObject(carroStorageRef).catch((deleteError) => {
                            console.error('Error al eliminar la imagen existente de "carro":', deleteError);
                        });
                    }
                }

                // Subir la nueva imagen de 'carro'
                const carroPhotoPath = `vehiculos/${existingData.driverUID}/carro-${uuidv4()}-${carroPhoto.originalname}`;
                const carroPhotoURL = await uploadFileToStorage(carroPhoto, carroPhotoPath);

                // Actualizar el campo 'carro' en Firestore con la nueva URL
                updates.carro = carroPhotoURL;
            }

            // Manejo de la imagen 'soat' si se proporciona una nueva
            if (req.files['soat'] && req.files['soat'][0]) {
                const soatPhoto = req.files['soat'][0];

                // Eliminar la imagen existente de 'soat' si existe
                if (existingData.soat) {
                    const soatStoragePath = extractStoragePathFromURL(existingData.soat);
                    if (soatStoragePath) {
                        const soatStorageRef = ref(storage, soatStoragePath);
                        await deleteObject(soatStorageRef).catch((deleteError) => {
                            console.error('Error al eliminar la imagen existente de "soat":', deleteError);
                        });
                    }
                }

                // Subir la nueva imagen de 'soat'
                const soatPhotoPath = `vehiculos/${existingData.driverUID}/soat-${uuidv4()}-${soatPhoto.originalname}`;
                const soatPhotoURL = await uploadFileToStorage(soatPhoto, soatPhotoPath);

                // Actualizar el campo 'soat' en Firestore con la nueva URL
                updates.soat = soatPhotoURL;
            }

            // Actualizar el documento en Firestore si hay cambios
            if (Object.keys(updates).length > 0) {
                await updateDoc(vehicleRef, updates);
            }

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
    });
};

module.exports = { modify };