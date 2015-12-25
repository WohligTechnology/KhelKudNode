module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                winner();
            } else {
                res.json({
                    value: "false",
                    comment: "Winner-id is incorrect"
                });
            }
        } else {
            winner();
        }

        function winner() {
            var print = function(data) {
                res.json(data);
            }
            Winner.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Winner.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Winner-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Winner.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Winner.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Winner-id is incorrect"
            });
        }
    },
    findWinners: function(req, res) {
        if (req.body.event && req.body.event != "") {
            var print = function(data) {
                res.json(data);
            }
            Winner.findWinners(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Winner-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Winner.findlimited(req.body, callback);
    }
};
