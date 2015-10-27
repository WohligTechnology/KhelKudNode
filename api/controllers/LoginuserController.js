/**
 * LoginuserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                user();
            } else {
                res.json({
                    value: "false",
                    comment: "Loginuser-id is incorrect"
                });
            }
        } else {
            user();
        }

        function user() {
            var print = function(data) {
                res.json(data);
            }
            Loginuser.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Loginuser.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Loginuser-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Loginuser.find(req.body, callback);
    },
    adminlogin: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Loginuser.adminlogin(req.body, callback);
    },
    teamcount: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Loginuser.teamcount(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Loginuser.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Loginuser-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Loginuser.findlimited(req.body, callback);
    },
    countusers: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Loginuser.countusers(req.body, callback);
    },
    countnotify: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Loginuser.countnotify(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Loginuser-id is incorrect"
            });
        }
    }
};
