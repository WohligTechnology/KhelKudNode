module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                version();
            } else {
                res.json({
                    value: "false",
                    comment: "Version-id is incorrect"
                });
            }
        } else {
            version();
        }

        function version() {
            var print = function(data) {
                res.json(data);
            }
            Version.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Version.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Version-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Version.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Version.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Version-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Version.findlimited(req.body, callback);
    }
};
