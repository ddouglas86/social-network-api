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
    deleteThought(req, res) {
        Thought.findOneAndDelete({ id: req.params.thoughtId })
          .then((thoughtData) => {
              if(!thoughtData) {
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
}