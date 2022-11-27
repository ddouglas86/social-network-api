const { Thought, User } = require('../models');

const thoughtController = {
    getAllThoughts(req, res) {
        Thought.find()
            .populate({path: 'reactions'})
            .then((thoughtData) => {
                res.json(thoughtData);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err)
            });
    },
    getThoughtById(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .populate({path: 'reactions'})
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
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
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
            { _id: req.params.thoughtId },
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
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
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
            { _id: req.params.thoughtId },
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
                    { _id: req.body.userId },
                    { $push: { thoughts: thoughtData._id } },
                    { new: true }
                )
                .then((userData) => {
                    if(!userData) {
                        res.status(404).json({message: 'No matching user id found'});
                        return;
                    }
                    res.json(userData);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(500),json(err);
                })
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    }
};

module.exports = thoughtController;