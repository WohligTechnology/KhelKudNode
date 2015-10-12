module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                slider();
            } else {
                res.json({
                    value: "false",
                    comment: "Slider-id is incorrect"
                });
            }
        } else {
            slider();
        }

        function slider() {
            var print = function(data) {
                res.json(data);
            }
            Slider.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Slider.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Slider-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Slider.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Slider.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Slider-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Slider.findlimited(req.body, callback);
    }
};