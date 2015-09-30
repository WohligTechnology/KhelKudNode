
module.exports = {
    save: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Village.save(req.body, print);
    },
    find: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Village.find(req.body, print);
    },
    findlimited: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Village.findlimited(req.body, print);
    },
    findone: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Village.findone(req.body, print);
    },
    delete: function (req, res) {
        var print = function (data) {
            res.json(data);
        }
        Village.delete(req.body, print);
    },
    excelobject: function (req, res) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
            }
            if (db) {
                db.open(function (err, db) {
                    if (err) {
                        console.log(err);
                    }
                    if (db) {
                        res.connection.setTimeout(200000);
                        req.connection.setTimeout(200000);
                        var extension = "";
                        var excelimages = [];
                        req.file("file").upload(function (err, uploadedFiles) {
                            if (err) {
                                console.log(err);
                            }
                            _.each(uploadedFiles, function (n) {
                                writedata = n.fd;
                                excelcall(writedata);
                            });
                        });

                        function excelcall(datapath) {
                            var outputpath = "./.tmp/output.json";
                            sails.xlsxj({
                                input: datapath,
                                output: outputpath
                            }, function (err, result) {
                                if (err) {
                                    console.error(err);
                                }
                                if (result) {
                                    sails.fs.unlink(datapath, function (data) {
                                        if (data) {
                                            sails.fs.unlink(outputpath, function (data2) {});
                                        }
                                    });

                                    function createteam(num) {
                                        m = result[num];
                                        Village.save(m, function (respo) {
                                            if (respo.value && respo.value == true) {
                                                console.log(num);
                                                num++;
                                                if (num < result.length) {
                                                    setTimeout(function () {
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