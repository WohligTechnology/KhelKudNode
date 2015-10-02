module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                sponsors();
            } else {
                res.json({
                    value: "false",
                    comment: "Sponsors-id is incorrect"
                });
            }
        } else {
            sponsors();
        }

        function sponsors() {
            var print = function(data) {
                res.json(data);
            }
            Sponsors.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Sponsors.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Sponsors-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Sponsors.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Sponsors.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Sponsors-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Sponsors.findlimited(req.body, callback);
    }
};