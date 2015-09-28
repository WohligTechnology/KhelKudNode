module.exports = {
    save: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Area.save(req.body, print);
    },
    savearea: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Area.savearea(req.body, print);
    },
    find: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Area.find(req.body, print);
    },
    findlimited: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Area.findlimited(req.body, print);
    },
    findone: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Area.findone(req.body, print);
    },
    delete: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Area.delete(req.body, print);
    }
};