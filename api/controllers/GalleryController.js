
module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                gallery();
            } else {
                res.json({
                    value: "false",
                    comment: "Gallery-id is incorrect"
                });
            }
        } else {
            gallery();
        }

        function gallery() {
            var print = function(data) {
                res.json(data);
            }
            Gallery.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Gallery.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Gallery-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Gallery.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Gallery.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Gallery-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Gallery.findlimited(req.body, callback);
    }
};