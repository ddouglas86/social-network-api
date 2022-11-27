const { Thought, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find()
            .populate('reactions')
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
            .populate('reactions')
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
    deleteThought(req, res) {
        Thought.findOneAndDelete({ id: req.params.thoughtId })
            .then((thoughtData) => {
                if (!thoughtData) {
                    res.json(404).json({ message: 'No matching id found' });
                    return;
                }
            })
            .then(() => {
                res.json({ message: 'Thought deleted' });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            })
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thoughtId) => {
                if (!thoughtId) {
                    res.status(404).json({ message: 'No matching id found to update' });
                    return;
                }
                res.json(thoughtId);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { id: req.params.thoughtId },
            { $addToSet: { reactions: req.params.reactionId } },
            { new: true, runValidators: true }
        )
            .then((thoughtData) => {
                if (!thoughtData) {
                    res.json(404).json({ message: 'No matching id found' });
                    return;
                }
                res.json(thoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { id: req.params.thoughtId },
            { $pull: { reactions: req.params.reactionId } },
            { new: true })
            .then((thoughtData) => {
                if (!thoughtData) {
                    return res.status(404).json({ message: 'No matching id found' });
                }
                res.json(thoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    createThought(req, res) {
        Thought.create(req.body)
            .then((thoughtData) => {
                User.findOneAndUpdate(
                    { id: req.body.userId },
                    { $push: { thoughts: thoughtData.id } },
                    { new: true }
                )
                res.json(thoughtId);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            })
    },
};

module.exports = thoughtController;