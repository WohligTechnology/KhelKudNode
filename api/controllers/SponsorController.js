module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                sponsor();
            } else {
                res.json({
                    value: "false",
                    comment: "Sponsor-id is incorrect"
                });
            }
        } else {
            sponsor();
        }

        function sponsor() {
            var print = function(data) {
                res.json(data);
            }
            Sponsor.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Sponsor.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Sponsor-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Sponsor.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Sponsor.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Sponsor-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Sponsor.findlimited(req.body, callback);
    }
};
