/**
 * HotnotificationController
 *
 * @description :: Server-side logic for managing Hotnotification
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Hotnotification.save(req.body, callback);
    },
    delete: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Hotnotification.delete(req.body, callback);
    },
    find: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Hotnotification.find(req.body, callback);

    },
    findall: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Hotnotification.findall(req.body, callback);

    },
    findlimited: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Hotnotification.findlimited(req.body, callback);

    },
    findOne: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Hotnotification.findOne(req.body, callback);
    },
    localtoserver: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Hotnotification.localtoserver(req.body, callback);
    },
    servertolocal: function (req, res) {
        function callback(data) {
            res.json(data);
        };
        Hotnotification.servertolocal(req.body, callback);
    }
};