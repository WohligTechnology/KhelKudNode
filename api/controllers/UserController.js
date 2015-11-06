module.exports = {
    // save: function(req, res) {
    //     if (req.body._id) {
    //         if (req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
    //             user();
    //         } else {
    //             res.json({
    //                 value: "false",
    //                 comment: "User-id is incorrect"
    //             });
    //         }
    //     } else {
    //         user();
    //     }

    //     function user() {
    //         var print = function(data) {
    //             res.json(data);
    //         }
    //         User.save(req.body, print);
    //     }
    // },
    delete: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.delete(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    find: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        User.find(req.body, callback);
    },
    findone: function(req, res) {
        if (req.body._id && req.body._id != "" && sails.ObjectID.isValid(req.body._id)) {
            var print = function(data) {
                res.json(data);
            }
            User.findone(req.body, print);
        } else {
            res.json({
                value: "false",
                comment: "User-id is incorrect"
            });
        }
    },
    findlimited: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        User.findlimited(req.body, callback);
    },
    deletedata: function(req, res) {
        function callback(data) {
            res.json(data);
        };
        User.deletedata(req.body, callback);
    },
    searchmail: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.searchmail(req.body, print);
    },
    countusers: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.countusers(req.body, print);
    },
    countregno: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.countregno(req.body, print);
    },
    findbyreg: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.findbyreg(req.body, print);
    },
    editUser: function(req, res) {
        var print = function(data) {
            res.json(data);
        }
        User.editUser(req.body, print);
    },
    downloadE: function(req, res) {
        var path = './assets/docs/Event_Rule.pdf';
        var image = sails.fs.readFileSync(path);
        var mimetype = sails.mime.lookup(path);
        res.set('Content-Type', mimetype);
        res.send(image);
    },
    downloadP: function(req, res) {
        var path = './assets/docs/Participate_Rule.pdf';
        var image = sails.fs.readFileSync(path);
        var mimetype = sails.mime.lookup(path);
        res.set('Content-Type', mimetype);
        res.send(image);
    },
    excelobject: function(req, res) {
        var num = 0;
        var allsports = ["Bucket Ball", "Handminton", "Lagori", "Handball", "3 Legged Race", "4 Legged Race", "Triathalon", "Relay", "Skating Relay", "Tug Of War"];
        var allaquatics = ["Khatron Ke Khiladi", "Musical Station", "Kho Kho"];
        var allvolunteer = ["Banner Designing - Art Works", "Slogan & Other Write Ups", "Cycling", "Volunteer"];
        var alldance = ["Dance", "Street Play"];
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
                        res.connection.setTimeout(20000000);
                        req.connection.setTimeout(20000000);
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

                                    function createuser(num) {
                                        m = result[num];
                                        m.sportsdata = "";
                                        User.findbyreg(m, function(respo) {
                                            if (respo.value == false) {
                                                Village.savevillage(m, function(respvill) {
                                                    m.village = [];
                                                    m.village.push(respvill);
                                                    var namesplit = m.name.split(" ");
                                                    delete m.name;
                                                    m.firstname = namesplit[0];
                                                    m.middlename = namesplit[1];
                                                    m.lastname = namesplit[2];
                                                    m.sport = sails._.capitalize(m.sport.toLowerCase());
                                                    m.sport = m.sport.split(" ").map(function(i) {
                                                        return i[0].toUpperCase() + i.substring(1)
                                                    }).join(" ");
                                                    var sportindex = sails._.indexOf(allsports, m.sport);
                                                    var volunteerindex = sails._.indexOf(allvolunteer, m.sport);
                                                    var danceindex = sails._.indexOf(alldance, m.sport);
                                                    var aquaticsindex = sails._.indexOf(allaquatics, m.sport);
                                                    m.sports = [];
                                                    m.quiz = [];
                                                    m.dance = [];
                                                    m.aquatics = [];
                                                    m.volunteer = [];
                                                    if (sportindex != -1) {
                                                        m.sportsdata = m.sport;
                                                        m.sports.push(m.sport);
                                                    } else if (volunteerindex != -1) {
                                                        m.sportsdata = m.sport;
                                                        m.volunteer.push(m.sport);
                                                    } else if (danceindex != -1) {
                                                        m.sportsdata = m.sport;
                                                        m.dance.push(m.sport);
                                                    } else if (aquaticsindex != -1) {
                                                        m.sportsdata = m.sport;
                                                        m.aquatics.push(m.sport);
                                                    } else if (m.sport == "Quiz") {
                                                        m.sportsdata = m.sport;
                                                        m.quiz.push(m.sport);
                                                    }
                                                    m.registrationdate = new Date(m.registrationdate);
                                                    var datesplit = m.dateofbirth.split("/");
                                                    m.dateofbirth = datesplit[2] + "-" + datesplit[1] + "-" + datesplit[0];
                                                    delete m.dob;
                                                    User.saveexceluser(m, function(respons) {
                                                        if (respons.value && respons.value == true) {
                                                            console.log(num);
                                                            num++;
                                                            if (num < result.length) {
                                                                setTimeout(function() {
                                                                    createuser(num);
                                                                }, 125);
                                                            } else {
                                                                res.json("Done");
                                                            }
                                                        } else {
                                                            console.log(num);
                                                            num++;
                                                            if (num < result.length) {
                                                                setTimeout(function() {
                                                                    createuser(num);
                                                                }, 125);
                                                            } else {
                                                                res.json("Done");
                                                            }
                                                        }
                                                    });
                                                });
                                            } else {
                                                m.sport = sails._.capitalize(m.sport.toLowerCase());
                                                m.sport = m.sport.split(" ").map(function(i) {
                                                    return i[0].toUpperCase() + i.substring(1)
                                                }).join(" ");
                                                var sportindex = sails._.indexOf(allsports, m.sport);
                                                var volunteerindex = sails._.indexOf(allvolunteer, m.sport);
                                                var danceindex = sails._.indexOf(alldance, m.sport);
                                                var aquaticsindex = sails._.indexOf(allaquatics, m.sport);
                                                if (sportindex != -1) {
                                                    respo.sportsdata = respo.sportsdata + "," + m.sport;
                                                    respo.sports.push(m.sport);
                                                } else if (volunteerindex != -1) {
                                                    respo.sportsdata = respo.sportsdata + "," + m.sport;
                                                    respo.volunteer.push(m.sport);
                                                } else if (danceindex != -1) {
                                                    respo.sportsdata = respo.sportsdata + "," + m.sport;
                                                    respo.dance.push(m.sport);
                                                } else if (aquaticsindex != -1) {
                                                    respo.sportsdata = respo.sportsdata + "," + m.sport;
                                                    respo.aquatics.push(m.sport);
                                                } else if (m.sport == "Quiz") {
                                                    respo.sportsdata = respo.sportsdata + "," + m.sport;
                                                    respo.quiz.push(m.sport);
                                                }
                                                User.saveexceluser(respo, function(respons) {
                                                    if (respons.value && respons.value == true) {
                                                        console.log(num);
                                                        num++;
                                                        if (num < result.length) {
                                                            setTimeout(function() {
                                                                createuser(num);
                                                            }, 125);
                                                        } else {
                                                            res.json("Done");
                                                        }
                                                    } else {
                                                        console.log(num);
                                                        num++;
                                                        if (num < result.length) {
                                                            setTimeout(function() {
                                                                createuser(num);
                                                            }, 125);
                                                        } else {
                                                            res.json("Done");
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    createuser(0);
                                }
                            });
                        }
                    }
                });
            }
        });
    },
    jsonToExcel: function(req, res) {
        var i = 0;
        var team = req.param('team');
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                res.json({
                    value: false
                });
            }
            if (db) {
                db.collection("user").aggregate([{
                    $match: {
                        "team.teamname": team
                    }
                }, {
                    $group: {
                        _id: "$_id",
                        regno: {
                            $addToSet: "$regno"
                        },
                        fname: {
                            $addToSet: "$firstname"
                        },
                        mname: {
                            $addToSet: "$middlename"
                        },
                        lname: {
                            $addToSet: "$lastname"
                        },
                        teamname: {
                            $addToSet: "$team.teamname"
                        },
                        mobileno: {
                            $addToSet: "$mobileno"
                        },
                        area: {
                            $addToSet: "$area"
                        },
                        gender: {
                            $addToSet: "$gender"
                        },
                        dateofbirth: {
                            $addToSet: "$dateofbirth"
                        },
                        email: {
                            $addToSet: "$email"
                        },
                        address: {
                            $addToSet: "$address"
                        },
                        pincode: {
                            $addToSet: "$pincode"
                        },
                        city: {
                            $addToSet: "$city"
                        },
                        registrationdate: {
                            $addToSet: "$registrationdate"
                        },
                        sports: {
                            $addToSet: "$sports"
                        },
                        quiz: {
                            $addToSet: "$quiz"
                        },
                        dance: {
                            $addToSet: "$dance"
                        },
                        aquatics: {
                            $addToSet: "$aquatics"
                        },
                        volunteer: {
                            $addToSet: "$volunteer"
                        }
                    }
                }, {
                    $unwind: "$regno"
                }, {
                    $unwind: "$fname"
                }, {
                    $unwind: "$mname"
                }, {
                    $unwind: "$lname"
                }, {
                    $unwind: "$teamname"
                }, {
                    $unwind: "$mobileno"
                }, {
                    $unwind: "$area"
                }, {
                    $unwind: "$gender"
                }, {
                    $unwind: "$dateofbirth"
                }, {
                    $unwind: "$email"
                }, {
                    $unwind: "$address"
                }, {
                    $unwind: "$pincode"
                }, {
                    $unwind: "$city"
                }, {
                    $unwind: "$registrationdate"
                }, {
                    $unwind: "$dance"
                }, {
                    $unwind: "$aquatics"
                }, {
                    $unwind: "$volunteer"
                }, {
                    $unwind: "$quiz"
                }, {
                    $unwind: "$sports"
                }, {
                    $project: {
                        _id: 0,
                        regno: 1,
                        name: {
                            $concat: ["$fname", " ", "$mname", " ", "$lname"]
                        },
                        teamname: 1,
                        mobileno: 1,
                        area: 1,
                        gender: 1,
                        dateofbirth: 1,
                        email: 1,
                        address: 1,
                        pincode: 1,
                        city: 1,
                        registrationdate: 1,
                        sports: 1,
                        quiz: 1,
                        aquatics: 1,
                        dance: 1,
                        volunteer: 1
                    }
                }, {
                    $sort: {
                        regno: 1
                    }
                }]).toArray(function(err, data2) {
                    if (err) {
                        res.json({
                            value: false
                        });
                    } else if (data2 && data2[0]) {
                        _.each(data2, function(n) {
                            n.sport = "";
                            if (n.sports.length > 0) {
                                _.each(n.sports, function(m) {
                                    if (m != null) {
                                        n.sport += m + ",";
                                    }
                                });
                            }
                            if (n.volunteer.length > 0) {
                                _.each(n.volunteer, function(m) {
                                    if (m != null) {
                                        n.sport += m + ",";
                                    }
                                });
                            }
                            if (n.dance.length > 0) {
                                _.each(n.dance, function(m) {
                                    if (m != null) {
                                        n.sport += m + ",";
                                    }
                                });
                            }
                            if (n.aquatics.length > 0) {
                                _.each(n.aquatics, function(m) {
                                    if (m != null) {
                                        n.sport += m + ",";
                                    }
                                });
                            }
                            if (n.quiz.length > 0) {
                                _.each(n.quiz, function(m) {
                                    if (m != null) {
                                        n.sport += m + ",";
                                    }
                                });
                            }
                            i++;
                            if (i == data2.length) {
                                _.each(data2, function(z) {
                                    delete z.volunteer;
                                    delete z.sports;
                                    delete z.aquatics;
                                    delete z.dance;
                                    delete z.quiz;
                                });
                                createExcel(data2);
                            }
                        });

                        function createExcel(json) {
                            var xls = sails.json2xls(json);
                            sails.fs.writeFileSync('./data.xlsx', xls, 'binary');
                            var excel = sails.fs.readFileSync('./data.xlsx');
                            var mimetype = sails.mime.lookup('./data.xlsx');
                            res.set('Content-Type', mimetype);
                            res.send(excel);
                        }
                    } else {
                        res.json({
                            value: false,
                            comment: "No data found"
                        });
                    }
                });
            }
        });
    },
    userData: function(req, res) {
        var i = 0;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                res.json({
                    value: false
                });
            }
            if (db) {
                db.collection("user").aggregate([{
                    $group: {
                        _id: "$_id",
                        regno: {
                            $addToSet: "$regno"
                        },
                        fname: {
                            $addToSet: "$firstname"
                        },
                        mname: {
                            $addToSet: "$middlename"
                        },
                        lname: {
                            $addToSet: "$lastname"
                        },
                        teamname: {
                            $addToSet: "$team.teamname"
                        },
                        mobileno: {
                            $addToSet: "$mobileno"
                        },
                        area: {
                            $addToSet: "$area"
                        },
                        gender: {
                            $addToSet: "$gender"
                        },
                        dateofbirth: {
                            $addToSet: "$dateofbirth"
                        },
                        email: {
                            $addToSet: "$email"
                        },
                        address: {
                            $addToSet: "$address"
                        },
                        pincode: {
                            $addToSet: "$pincode"
                        },
                        city: {
                            $addToSet: "$city"
                        },
                        registrationdate: {
                            $addToSet: "$registrationdate"
                        },
                        sports: {
                            $addToSet: "$sports"
                        },
                        quiz: {
                            $addToSet: "$quiz"
                        },
                        dance: {
                            $addToSet: "$dance"
                        },
                        aquatics: {
                            $addToSet: "$aquatics"
                        },
                        volunteer: {
                            $addToSet: "$volunteer"
                        }
                    }
                }, {
                    $unwind: "$regno"
                }, {
                    $unwind: "$fname"
                }, {
                    $unwind: "$mname"
                }, {
                    $unwind: "$lname"
                }, {
                    $unwind: "$teamname"
                }, {
                    $unwind: "$mobileno"
                }, {
                    $unwind: "$area"
                }, {
                    $unwind: "$gender"
                }, {
                    $unwind: "$dateofbirth"
                }, {
                    $unwind: "$email"
                }, {
                    $unwind: "$address"
                }, {
                    $unwind: "$pincode"
                }, {
                    $unwind: "$city"
                }, {
                    $unwind: "$registrationdate"
                }, {
                    $unwind: "$dance"
                }, {
                    $unwind: "$aquatics"
                }, {
                    $unwind: "$volunteer"
                }, {
                    $unwind: "$quiz"
                }, {
                    $unwind: "$sports"
                }, {
                    $project: {
                        _id: 0,
                        regno: 1,
                        name: {
                            $concat: ["$fname", " ", "$mname", " ", "$lname"]
                        },
                        teamname: 1,
                        mobileno: 1,
                        area: 1,
                        gender: 1,
                        dateofbirth: 1,
                        email: 1,
                        address: 1,
                        pincode: 1,
                        city: 1,
                        registrationdate: 1,
                        sports: 1,
                        quiz: 1,
                        aquatics: 1,
                        dance: 1,
                        volunteer: 1
                    }
                }, {
                    $sort: {
                        regno: 1
                    }
                }]).toArray(function(err, data2) {
                    if (err) {
                        res.json({
                            value: false
                        });
                    } else if (data2 && data2[0]) {
                        _.each(data2, function(n) {
                            n.sport = "";
                            if (n.sports.length > 0) {
                                _.each(n.sports, function(m) {
                                    if (m != null) {
                                        n.sport += m + ",";
                                    }
                                });
                            }
                            if (n.volunteer.length > 0) {
                                _.each(n.volunteer, function(m) {
                                    if (m != null) {
                                        n.sport += m + ",";
                                    }
                                });
                            }
                            if (n.dance.length > 0) {
                                _.each(n.dance, function(m) {
                                    if (m != null) {
                                        n.sport += m + ",";
                                    }
                                });
                            }
                            if (n.aquatics.length > 0) {
                                _.each(n.aquatics, function(m) {
                                    if (m != null) {
                                        n.sport += m + ",";
                                    }
                                });
                            }
                            if (n.quiz.length > 0) {
                                _.each(n.quiz, function(m) {
                                    if (m != null) {
                                        n.sport += m + ",";
                                    }
                                });
                            }
                            i++;
                            if (i == data2.length) {
                                _.each(data2, function(z) {
                                    delete z.volunteer;
                                    delete z.sports;
                                    delete z.aquatics;
                                    delete z.dance;
                                    delete z.quiz;
                                });
                                createExcel(data2);
                            }
                        });

                        function createExcel(json) {
                            var xls = sails.json2xls(json);
                            sails.fs.writeFileSync('./data.xlsx', xls, 'binary');
                            var excel = sails.fs.readFileSync('./data.xlsx');
                            var mimetype = sails.mime.lookup('./data.xlsx');
                            res.set('Content-Type', mimetype);
                            res.send(excel);
                        }
                    } else {
                        res.json({
                            value: false,
                            comment: "No data found"
                        });
                    }
                });
            }
        });
    },
    countteam: function(req, res) {
        var team = req.param('team');
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                res.json({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").count({
                    "team.teamname": team
                }, function(err, number) {
                    if (number != null) {
                        res.json(number);
                        db.close();
                    } else if (err) {
                        res.json({
                            value: "false",
                            comment: "Error"
                        });
                        db.close();
                    } else {
                        res.json({
                            value: "false",
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    }
};
