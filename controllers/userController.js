const { User } = require('../models/User');

const userController = {
    getAllUsers(req, res) {
        User.find
        .populate('thoughts')
        .populate('friends')
        .then((userData) => {
            res.json(userData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err)
        });
    }
};

module.exports = userController;