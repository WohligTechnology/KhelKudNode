module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                user();
            } else {
                res.json({
                    value: "false",
                    comment: "User-id is incorrect"
                });
            }
        } else {
            user();
        }

        function user() {
            var print = function(data) {
                res.json(data);
            }
            User.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        User.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        User.findlimited(req.body, callback);
    },
    searchmail: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.searchmail(req.body, print);
    },
    downloadE: function (req, res) {
        var path = './assets/docs/Event_Rule.pdf';
        var image = sails.fs.readFileSync(path);
        var mimetype = sails.mime.lookup(path);
        res.set('Content-Type', mimetype);
        res.send(image);
    },
    downloadP: function (req, res) {
        var path = './assets/docs/Participate_Rule.pdf';
        var image = sails.fs.readFileSync(path);
        var mimetype = sails.mime.lookup(path);
        res.set('Content-Type', mimetype);
        res.send(image);
    }
};