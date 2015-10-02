module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                pointlog();
            } else {
                res.json({
                    value: "false",
                    comment: "PointsLogs-id is incorrect"
                });
            }
        } else {
            pointlog();
        }

        function pointlog() {
            var print = function(data) {
                res.json(data);
            }
            PointsLogs.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            PointsLogs.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "PointsLogs-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        PointsLogs.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            PointsLogs.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "PointsLogs-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        PointsLogs.findlimited(req.body, callback);
    }
};