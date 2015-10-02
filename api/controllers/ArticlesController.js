module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                articles();
            } else {
                res.json({
                    value: "false",
                    comment: "Articles-id is incorrect"
                });
            }
        } else {
            articles();
        }

        function articles() {
            var print = function(data) {
                res.json(data);
            }
            Articles.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Articles.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Articles-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Articles.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Articles.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Articles-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Articles.findlimited(req.body, callback);
    }
};