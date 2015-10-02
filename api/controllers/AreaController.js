module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                area();
            } else {
                res.json({
                    value: "false",
                    comment: "Area-id is incorrect"
                });
            }
        } else {
            area();
        }

        function area() {
            var print = function(data) {
                res.json(data);
            }
            Area.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Area.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Area-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Area.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Area.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Area-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Area.findlimited(req.body, callback);
    },
    savearea: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Area.savearea(req.body, print);
    }
};