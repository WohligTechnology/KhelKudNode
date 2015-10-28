module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                schedule();
            } else {
                res.json({
                    value: "false",
                    comment: "Schedule-id is incorrect"
                });
            }
        } else {
            schedule();
        }

        function schedule() {
            var print = function(data) {
                res.json(data);
            }
            Schedule.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Schedule.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Schedule-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Schedule.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Schedule.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Schedule-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Schedule.findlimited(req.body, callback);
    }
};
