module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                sports();
            } else {
                res.json({
                    value: "false",
                    comment: "Sports-id is incorrect"
                });
            }
        } else {
            sports();
        }

        function sports() {
            var print = function(data) {
                res.json(data);
            }
            Sports.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Sports.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Sports-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Sports.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Sports.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Sports-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Sports.findlimited(req.body, callback);
    }
};