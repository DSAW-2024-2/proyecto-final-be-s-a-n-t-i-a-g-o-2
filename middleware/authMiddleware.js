const { auth } = require('../config/firebase');

const isAuthenticated = (req, res, next) => {
const user = auth.currentUser;
if (user) {
    next();
} else {
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
}
};

module.exports = { isAuthenticated };
