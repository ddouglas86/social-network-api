const { User, Thought } = require('../models/User');

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
    },
    getUserById(req, res) {
        User.findOne({ id: req.params.userId })
            .populate('thoughts')
            .populate('friends')
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
            { id: req.params.userId },
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
        User.findOneAndDelete({ id: req.params.userId })
          .then((userData) => {
              if(!userData) {
                res.json(404).json({ message: 'No matching id found' });
                return;
            }
            Thought.deleteMany({id: {$in: userData.thoughts}});
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
            { id: req.params.userId },
            { $addToSet: { friends: req.params.friendId }},
            { new: true, runValidators: true }
        )
        .then((userData) => {
            if(!userData) {
                res.json(404).json({ message: 'No matching id found'});
                return;
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