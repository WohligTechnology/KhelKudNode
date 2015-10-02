module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                subsports();
            } else {
                res.json({
                    value: "false",
                    comment: "Subsports-id is incorrect"
                });
            }
        } else {
            subsports();
        }

        function subsports() {
            var print = function(data) {
                res.json(data);
            }
            Subsports.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Subsports.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Subsports-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Subsports.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Subsports.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Subsports-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Subsports.findlimited(req.body, callback);
    }
};