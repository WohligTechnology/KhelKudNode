module.exports = {
    save: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.save(req.body, print);
    },
    find: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.find(req.body, print);
    },
    findlimited: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findlimited(req.body, print);
    },
    findone: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.findone(req.body, print);
    },
    delete: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        User.delete(req.body, print);
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