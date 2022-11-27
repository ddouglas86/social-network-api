const { Thought, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find()
            .then((thoughtData) => {
                res.json(thoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            });
    },
    getThoughtById(req, res) {
        User.findOne({ id: req.params.thoughtId })
            .then((thoughtId) => {
                if (!thoughtId) {
                    res.json(404).json({ message: 'No matching id found' });
                    return;
                }
                res.json(thoughtId);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
}