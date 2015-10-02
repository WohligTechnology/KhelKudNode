
module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                player();
            } else {
                res.json({
                    value: "false",
                    comment: "Player-id is incorrect"
                });
            }
        } else {
            player();
        }

        function player() {
            var print = function(data) {
                res.json(data);
            }
            Player.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Player.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Player-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Player.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Player.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Player-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Player.findlimited(req.body, callback);
    }
};