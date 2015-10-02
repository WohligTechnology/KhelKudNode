module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                news();
            } else {
                res.json({
                    value: "false",
                    comment: "News-id is incorrect"
                });
            }
        } else {
            news();
        }

        function news() {
            var print = function(data) {
                res.json(data);
            }
            News.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            News.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "News-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        News.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            News.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "News-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        News.findlimited(req.body, callback);
    }
};