module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                team();
            } else {
                res.json({
                    value: "false",
                    comment: "Team-id is incorrect"
                });
            }
        } else {
            team();
        }

        function team() {
            var print = function(data) {
                res.json(data);
            }
            Team.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Team.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Team-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Team.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Team.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Team-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Team.findlimited(req.body, callback);
    },
    saveExcel: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        Team.saveExcel(req.body, print);
    },
    saveforexcel: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        Team.saveforexcel(req.body, print);
    },
    searchmail: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        Team.searchmail(req.body, print);
    },
    excelobject: function(req, res) {
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
                        var extension = "";
                        var excelimages = [];
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

                                    function createteam(num) {
                                        m = result[num];
                                        Team.saveExcel(m, function(respo) {
                                            if (respo.value && respo.value == true) {
                                                console.log(num);
                                                num++;
                                                if (num < result.length) {
                                                    setTimeout(function() {
                                                        createteam(num);
                                                    }, 15);
                                                } else {
                                                    res.json("Done");
                                                }
                                            }
                                        });
                                    }
                                    createteam(0);
                                }
                            });
                        }
                    }
                });
            }
        });
    }
};