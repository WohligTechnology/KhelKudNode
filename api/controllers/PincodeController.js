module.exports = {
    save: function(req, res) {
        if (req.body._id) {
            if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
                pincode();
            } else {
                res.json({
                    value: "false",
                    comment: "Pincode-id is incorrect"
                });
            }
        } else {
            pincode();
        }

        function pincode() {
            var print = function(data) {
                res.json(data);
            }
            Pincode.save(req.body, print);
        }
    },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Pincode.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Pincode-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Pincode.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            Pincode.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "Pincode-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Pincode.findlimited(req.body, callback);
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

                                    function createpin(num) {
                                        m = result[num];
                                        if (m.zone && m.zone != "") {
                                            m.teamno = "team" + m.zone;
                                            Team.saveforexcel(m, function(print) {
                                                if (!print.value && print.value != false) {
                                                    m.team = print._id;
                                                    delete m.teamno;
                                                    Area.savearea(m, function(response) {
                                                        if (response && response.value == true) {
                                                            createpincode();
                                                        }
                                                    });
                                                }

                                                function createpincode() {
                                                    Pincode.savepincode(m, function(respo) {
                                                        if (respo.value && respo.value == true) {
                                                            console.log(num);
                                                            num++;
                                                            if (num < result.length) {
                                                                setTimeout(function() {
                                                                    createpin(num);
                                                                }, 15);
                                                            } else {
                                                                res.json("Done");
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                    createpin(0);
                                }
                            });
                        }
                    }
                });
            }
        });
    },
    savepincode: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        Pincode.savepincode(req.body, callback);
    }
};