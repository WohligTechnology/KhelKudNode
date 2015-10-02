module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                notification();
            } else {
                res.json({
                    value: "false",
                    comment: "Notification-id is incorrect"
                });
            }
        } else {
            notification();
        }

        function notification() {
            var print = function(data) {
                res.json(data);
            }
            Notification.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Notification.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Notification-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Notification.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Notification.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Notification-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Notification.findlimited(req.body, callback);
    }
};