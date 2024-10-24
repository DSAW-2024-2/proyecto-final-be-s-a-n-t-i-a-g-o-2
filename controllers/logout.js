const { auth } = require('../config/firebase');
const { signout } = require('firebase/auth');

const logout = async (req, res) => {
try {
    await signout(auth);
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
} catch (error) {
    res.status(400).json({ error: error.message });
}
};

module.exports = { logout };
