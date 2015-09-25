
module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        PointsLogs.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        PointsLogs.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        PointsLogs.find(req.body, callback);
    },
    findlimited: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        PointsLogs.findlimited(req.body, callback);
    },
    findone: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        PointsLogs.findone(req.body, callback);
    }
};