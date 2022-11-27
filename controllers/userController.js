const { User, Thought } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find()
            .populate({ path: 'thoughts' })
            .then((userData) => {
                res.json(userData);
            })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err)
        });
},
    getUserById(req, res) {
        User.findOne({ _id: req.params.userId })
            .populate({path: 'thoughts'})
            .populate({path: 'friends'})
            .then(userData => {
                if (!userData) {
                    res.json(404).json({ message: 'No matching id found' });
                    return;
                }
                res.json(userData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
        createUser(req, res) {
    User.create(req.body)
        .then((userData) => {
            res.json(userData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
},
updateUser(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .then((userData) => {
            if (!userData) {
                res.status(404).json({ message: 'No matching id found to update' });
                return;
            }
            res.json(userData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
},
deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
        .then((userData) => {
            if (!userData) {
                res.json(404).json({ message: 'No matching id found' });
                return;
            }
            Thought.deleteMany({ _id: { $in: userData.thoughts } });
        })
        .then(() => {
            res.json({ message: 'User deleted' });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
},
addFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true, runValidators: true }
    )
        .then((userData) => {
            if (!userData) {
                res.json(404).json({ message: 'No matching id found' });
                return;
            }
            res.json(userData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
},
deleteFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true })
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({ message: 'No matching id found' });
            }
            res.json(userData);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
}
};

module.exports = userController;