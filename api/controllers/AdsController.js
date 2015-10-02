module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                ads();
            } else {
                res.json({
                    value: "false",
                    comment: "Ads-id is incorrect"
                });
            }
        } else {
            ads();
        }

        function ads() {
            var print = function(data) {
                res.json(data);
            }
            Ads.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Ads.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Ads-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Ads.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Ads.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Ads-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Ads.findlimited(req.body, callback);
    }
};