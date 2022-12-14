const devCredits = require('../model/model.js');

const postCredits = (req, res) => {
    const credit = new devCredits({
        id: req.body.id,
        credits: req.body.credits
    });

    devCredits.countDocuments({ id: req.body.id}, (err, count) => {
        if (count > 0) {
            devCredits.findOneAndUpdate(
                {id: req.body.id},
                {
                    $inc: {
                        credits: req.body.credits,
                    },
                },
                {new: true},
                (err, devCredit) => {
                    if (err) {
                        res.send(err);
                    } else res.json(devCredit);
                }
            );
        } else {
            credit.save((err, credits) => {
                if(err) {
                    res.send(err);
                }
                res.json(credits);
            });
        }
    });
};

module.exports = postCredits;