module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                schedule();
            } else {
                res.json({
                    value: "false",
                    comment: "Schedule-id is incorrect"
                });
            }
        } else {
            schedule();
        }

        function schedule() {
            var print = function(data) {
                res.json(data);
            }
            Schedule.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Schedule.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Schedule-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Schedule.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Schedule.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Schedule-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Schedule.findlimited(req.body, callback);
    },
    excelobject: function(req, res) {
        var zone = req.param("zone");
        var venue = req.param("venue");
        var report = req.param("report");
        var date = req.param("date");
        var team = req.param("team");
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
            }
            if (db) {
                db.open(function(err, db) {
                    if (err) {
                        console.log(err);
                    }
                    if (db) {
                        res.connection.setTimeout(200000);
                        req.connection.setTimeout(200000);
                        req.file("file").upload(function(err, uploadedFiles) {
                            if (err) {
                                console.log(err);
                            }
                            _.each(uploadedFiles, function(n) {
                                writedata = n.fd;
                                excelcall(writedata);
                            });
                        });

                        function excelcall(datapath) {
                            var outputpath = "./.tmp/output.json";
                            sails.xlsxj({
                                input: datapath,
                                output: outputpath
                            }, function(err, result) {
                                if (err) {
                                    console.error(err);
                                }
                                if (result) {
                                    sails.fs.unlink(datapath, function(data) {
                                        if (data) {
                                            sails.fs.unlink(outputpath, function(data2) {});
                                        }
                                    });
                                    createsch();

                                    function createsch() {
                                        var m = {};
                                        _.forIn(result[0], function(value, key) {
                                            if (key === "category") {
                                                m.cat = "Category";
                                            } else if (key === "zone") {
                                                m.cat = "Zone";
                                            } else if (key === "ground") {
                                                m.cat = "Ground";
                                            }
                                        });
                                        _.forIn(result[0], function(value, key) {
                                            if (key === "court") {
                                                m.cou = "Court";
                                            } else if (key === "track") {
                                                m.cou = "Track";
                                            }
                                        });
                                        m.zone = zone;
                                        m.report = report;
                                        m.team = team;
                                        m.date = date;
                                        m.venue = venue;
                                        m.events = result;
                                        Schedule.save(m, function(respo) {
                                            res.json(respo);
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    }
};
