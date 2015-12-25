module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                agegrp();
            } else {
                res.json({
                    value: "false",
                    comment: "Agegrp-id is incorrect"
                });
            }
        } else {
            agegrp();
        }

        function agegrp() {
            var print = function(data) {
                res.json(data);
            }
            Agegrp.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Agegrp.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Agegrp-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Agegrp.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Agegrp.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Agegrp-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Agegrp.findlimited(req.body, callback);
    },
};
