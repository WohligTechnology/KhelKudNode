module.exports = {
    save: function(data, callback) {
        var village = "";
        if (data.village && data.village[0] && data.village[0].name) {
            village = data.village[0].name;
        }
        var regno = 9913;
        if (data.pincode) {
            data.pincode = data.pincode.toString();
        }
        if (data.area[0].name) {
            data.area = data.area[0].name;
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection("team").find({
                        "pincode.pincode": data.pincode
                    }, {
                        "_id": 1,
                        "teamname": 1,
                        "email": 1
                    }).toArray(function(err, data2) {
                        if (data2 && data2[0]) {
                            data.team = data2[0];
                            saveuser();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No such pincode"
                            });
                            db.close();
                        }
                    });

                    function saveuser() {
                        db.collection('user').aggregate([{
                            $group: {
                                _id: null,
                                regno: {
                                    $max: "$regno"
                                }
                            }
                        }, {
                            $project: {
                                _id: 0,
                                regno: 1
                            }
                        }]).toArray(function(err, data2) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else if (data2 && data2[0]) {
                                var regsplit = data2[0].regno.split("R");
                                regsplit[1] = parseInt(regsplit[1]);
                                data.regno = regsplit[1] + 1;
                                data.regno = data.regno.toString();
                                if (data.regno.length == 4) {
                                    data.regno = "R00" + data.regno;
                                } else if (data.regno.length == 5) {
                                    data.regno = "R0" + data.regno;
                                } else {
                                    data.regno = "R" + data.regno;
                                }
                                callme();
                            } else {
                                data.regno = "R010801";
                                callme();
                            }
                        });

                        function callme() {
                            db.collection('user').insert(data, function(err, created) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false,
                                        comment: "Error"
                                    });
                                    db.close();
                                } else if (created) {
                                    var today = new Date();
                                    var month = parseInt(today.getMonth() + 1);
                                    var registrationdate = today.getDate() + "-" + month + "-" + today.getFullYear();
                                    var name = data.firstname + " " + data.middlename + " " + data.lastname;
                                    var date = data.dateofbirth.split("-");
                                    data.dateofbirth = date[2] + "-" + date[1] + "-" + date[0];
                                    var template_name = "bherpo";
                                    var template_content = [{
                                        "name": "bherpo",
                                        "content": "bherpo"
                                    }]
                                    var message = {
                                        "from_email": sails.fromEmail,
                                        "from_name": sails.fromName,
                                        "to": [{
                                            "email": data.email,
                                            "type": "to"
                                        }, {
                                            "email": data.team.email,
                                            "type": "cc"
                                        }],
                                        "global_merge_vars": [{
                                            "name": "events",
                                            "content": data.sportsdata
                                        }, {
                                            "name": "number",
                                            "content": data.regno
                                        }, {
                                            "name": "team",
                                            "content": data.team.teamname
                                        }, {
                                            "name": "mob",
                                            "content": data.mobileno
                                        }, {
                                            "name": "name",
                                            "content": name
                                        }, {
                                            "name": "regdate",
                                            "content": registrationdate
                                        }, {
                                            "name": "dob",
                                            "content": data.dateofbirth
                                        }, {
                                            "name": "email",
                                            "content": data.email
                                        }, {
                                            "name": "gen",
                                            "content": data.gender
                                        }, {
                                            "name": "pin",
                                            "content": data.pincode
                                        }, {
                                            "name": "area",
                                            "content": data.area
                                        }, {
                                            "name": "city",
                                            "content": data.city
                                        }, {
                                            "name": "vill",
                                            "content": village
                                        }, {
                                            "name": "add",
                                            "content": data.address
                                        }]
                                    };
                                    sails.mandrill_client.messages.sendTemplate({
                                        "template_name": template_name,
                                        "template_content": template_content,
                                        "message": message
                                    }, function(result) {
                                        callback({
                                            value: true,
                                            comment: "Mail Sent"
                                        });
                                        db.close();
                                    }, function(e) {
                                        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                    });
                                } else {
                                    callback({
                                        value: false,
                                        comment: "Not created"
                                    });
                                    db.close();
                                }
                            });
                        }
                    }
                } else {
                    var user = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection("team").find({
                        "pincode.pincode": data.pincode
                    }, {
                        "_id": 1,
                        "teamname": 1,
                        "email": 1
                    }).toArray(function(err, data2) {
                        if (data2 && data2[0]) {
                            data.team = data2[0];
                            edituser();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No such pincode"
                            });
                            db.close();
                        }
                    });

                    function edituser() {
                        db.collection('user').update({
                            _id: user
                        }, {
                            $set: data
                        }, function(err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                                callback({
                                    value: true
                                });
                                db.close();
                            } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                                callback({
                                    value: true,
                                    comment: "Data already updated"
                                });
                                db.close();
                            } else {
                                callback({
                                    value: false,
                                    comment: "No data found"
                                });
                                db.close();
                            }
                        });
                    }
                }
            }
        });
    },
    find: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find().toArray(function(err, found) {
                    if (err) {
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (found && found[0]) {
                        callback(found);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    findlimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var check = new RegExp(data.search, "i");
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("user").count({
                        firstname: {
                            '$regex': check
                        }
                    }, function(err, number) {
                        if (number && number != "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callbackfunc();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "Count of null"
                            });
                            db.close();
                        }
                    });

                    function callbackfunc() {
                        db.collection("user").find({
                            firstname: {
                                '$regex': check
                            }
                        }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (err) {
                                callback({
                                    value: false
                                });
                                console.log(err);
                                db.close();
                            } else if (found && found[0]) {
                                newreturns.data = found;
                                callback(newreturns);
                                db.close();
                            } else {
                                callback({
                                    value: false,
                                    comment: "No data found"
                                });
                                db.close();
                            }
                        });
                    }
                }
            }
        });
    },
    findone: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    _id: sails.ObjectID(data._id)
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        delete data2[0].password;
                        callback(data2[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    delete: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            db.collection('user').remove({
                _id: sails.ObjectID(data._id)
            }, function(err, deleted) {
                if (deleted) {
                    callback({
                        value: true
                    });
                    db.close();
                } else if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    db.close();
                } else {
                    callback({
                        value: false,
                        comment: "No data found"
                    });
                    db.close();
                }
            });
        });
    },
    deletedata: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            db.collection('user').remove({}, function(err, deleted) {
                if (deleted) {
                    callback({
                        value: true
                    });
                    db.close();
                } else if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                    db.close();
                } else {
                    callback({
                        value: false,
                        comment: "No data found"
                    });
                    db.close();
                }
            });
        });
    },
    searchmail: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    email: data.email
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback({
                            value: true,
                            comment: "User found"
                        });
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    countusers: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("user").count({}, function(err, number) {
                    if (number != null) {
                        callback(number);
                        db.close();
                    } else if (err) {
                        callback({
                            value: "false",
                            comment: "Error"
                        });
                        db.close();
                    } else {
                        callback({
                            value: "false",
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    countregno: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection('user').aggregate([{
                    $group: {
                        _id: null,
                        regno: {
                            $max: "$regno"
                        }
                    }
                }, {
                    $project: {
                        _id: 0,
                        regno: 1
                    }
                }]).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false,
                            comment: "Error"
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2[0].regno);
                        db.close();
                    } else {
                        callback(9912);
                        db.close();
                    }
                });
            }
        });
    },
    findbyreg: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("user").find({
                    regno: data.regno
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2[0]);
                        db.close();
                    } else {
                        callback({
                            value: false,
                            comment: "No data found"
                        });
                        db.close();
                    }
                });
            }
        });
    },
    saveexceluser: function(data, callback) {
        data.pincode = data.pincode.toString();
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection("team").find({
                        "pincode.pincode": data.pincode
                    }, {
                        "_id": 1,
                        "teamname": 1
                    }).toArray(function(err, data2) {
                        if (data2 && data2[0]) {
                            data.team = data2[0];
                            saveuser();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No such pincode"
                            });
                            db.close();
                        }
                    });

                    function saveuser() {
                        db.collection('user').insert(data, function(err, created) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else if (created) {
                                callback({
                                    value: true,
                                    id: data._id
                                });
                                db.close();
                            } else {
                                callback({
                                    value: false,
                                    comment: "Not created"
                                });
                                db.close();
                            }
                        });
                    }
                } else {
                    var user = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection("team").find({
                        "pincode.pincode": data.pincode
                    }, {
                        "_id": 1,
                        "teamname": 1
                    }).toArray(function(err, data2) {
                        if (data2 && data2[0]) {
                            data.team = data2[0];
                            edituser();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No such pincode"
                            });
                            db.close();
                        }
                    });

                    function edituser() {
                        db.collection('user').update({
                            _id: user
                        }, {
                            $set: data
                        }, function(err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                                callback({
                                    value: true
                                });
                                db.close();
                            } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                                callback({
                                    value: true,
                                    comment: "Data already updated"
                                });
                                db.close();
                            } else {
                                callback({
                                    value: false,
                                    comment: "No data found"
                                });
                                db.close();
                            }
                        });
                    }
                }
            }
        });
    },
    editUser: function(data, callback) {
        var i = 0;
        var regIndex = "";
        User.find(data, function(userrespo) {
            _.each(userrespo, function(m) {
                m.regno = m.regno.toString();
                regIndex = m.regno.indexOf("R");
                if (regIndex && regIndex == -1) {
                    var user = {};
                    if (m.regno.length == 4) {
                        user.regno = "R00" + m.regno;
                        callme();
                    } else if (m.regno.length == 5) {
                        user.regno = "R0" + m.regno;
                        callme();
                    } else {
                        user.regno = "R" + m.regno;
                        callme();
                    }

                    function callme() {
                        sails.query(function(err, db) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false
                                });
                            }
                            if (db) {
                                db.collection('user').update({
                                    _id: sails.ObjectID(m._id)
                                }, {
                                    $set: user
                                }, function(err, updated) {
                                    if (err) {
                                        console.log(err);
                                        db.close();
                                    } else if (updated) {
                                        user = {};
                                        i++;
                                        if (i == userrespo.length) {
                                            callcall();
                                        }
                                        db.close();
                                    } else {
                                        db.close();
                                    }
                                });
                            }
                        });

                        function callcall() {
                            callback("Done");
                        }
                    }
                } else {
                    i++;
                    if (i == userrespo.length) {
                        callback("Done");
                    }
                }
            });
        });
    },
    editUser2: function(data, callback) {
        var i = 0;
        User.find(data, function(userrespo) {
            _.each(userrespo, function(m) {
                if (m.wellwisher) {
                    var user = {};
                    user.sports = m.wellwisher;
                    user.volunteer = [];
                    user.quiz = [];
                    user.dance = [];
                    user.aquatics = [];
                    sails.query(function(err, db) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                        }
                        if (db) {
                            db.collection('user').update({
                                _id: sails.ObjectID(m._id)
                            }, {
                                $set: user
                            }, function(err, updated) {
                                if (err) {
                                    console.log(err);
                                    db.close();
                                } else if (updated) {
                                    user = {};
                                    i++;
                                    if (i == userrespo.length) {
                                        callcall();
                                    }
                                    db.close();
                                } else {
                                    db.close();
                                }
                            });
                        }
                    });

                    function callcall() {
                        callback("Done");
                    }
                } else {
                    i++;
                    if (i == userrespo.length) {
                        callback("Done");
                    }
                }
            });
        });
    },
    wellwisher: function(data, callback) {
        var village = "";
        if (data.village && data.village[0] && data.village[0].name) {
            village = data.village[0].name;
        }
        var regno = 9913;
        if (data.pincode) {
            data.pincode = data.pincode.toString();
        }
        if (data.area[0].name) {
            data.area = data.area[0].name;
        }
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection("team").find({
                        "pincode.pincode": data.pincode
                    }, {
                        "_id": 1,
                        "teamname": 1,
                        "email": 1
                    }).toArray(function(err, data2) {
                        if (data2 && data2[0]) {
                            data.team = data2[0];
                            saveuser();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No such pincode"
                            });
                            db.close();
                        }
                    });

                    function saveuser() {
                        db.collection('user').aggregate([{
                            $group: {
                                _id: null,
                                regno: {
                                    $max: "$regno"
                                }
                            }
                        }, {
                            $project: {
                                _id: 0,
                                regno: 1
                            }
                        }]).toArray(function(err, data2) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else if (data2 && data2[0]) {
                                var regsplit = data2[0].regno.split("R");
                                regsplit[1] = parseInt(regsplit[1]);
                                data.regno = regsplit[1] + 1;
                                data.regno = data.regno.toString();
                                if (data.regno.length == 4) {
                                    data.regno = "R00" + data.regno;
                                } else if (data.regno.length == 5) {
                                    data.regno = "R0" + data.regno;
                                } else {
                                    data.regno = "R" + data.regno;
                                }
                                callme();
                            } else {
                                data.regno = "R010801";
                                callme();
                            }
                        });

                        function callme() {
                            db.collection('user').insert(data, function(err, created) {
                                if (err) {
                                    console.log(err);
                                    callback({
                                        value: false,
                                        comment: "Error"
                                    });
                                    db.close();
                                } else if (created) {
                                    var today = new Date();
                                    var month = parseInt(today.getMonth() + 1);
                                    var registrationdate = today.getDate() + "-" + month + "-" + today.getFullYear();
                                    var name = data.firstname + " " + data.middlename + " " + data.lastname;
                                    var date = data.dateofbirth.split("-");
                                    data.dateofbirth = date[2] + "-" + date[1] + "-" + date[0];
                                    var template_name = "bherpo";
                                    var template_content = [{
                                        "name": "bherpo",
                                        "content": "bherpo"
                                    }]
                                    var message = {
                                        "from_email": sails.fromEmail,
                                        "from_name": sails.fromName,
                                        "to": [{
                                            "email": data.email,
                                            "type": "to"
                                        }, {
                                            "email": data.team.email,
                                            "type": "cc"
                                        }, {
                                            "email": "bherpomain@gmail.com",
                                            "type": "cc"
                                        }],
                                        "global_merge_vars": [{
                                            "name": "events",
                                            "content": "Well-Wisher"
                                        }, {
                                            "name": "number",
                                            "content": data.regno
                                        }, {
                                            "name": "team",
                                            "content": data.team.teamname
                                        }, {
                                            "name": "mob",
                                            "content": data.mobileno
                                        }, {
                                            "name": "name",
                                            "content": name
                                        }, {
                                            "name": "regdate",
                                            "content": registrationdate
                                        }, {
                                            "name": "dob",
                                            "content": data.dateofbirth
                                        }, {
                                            "name": "email",
                                            "content": data.email
                                        }, {
                                            "name": "gen",
                                            "content": data.gender
                                        }, {
                                            "name": "pin",
                                            "content": data.pincode
                                        }, {
                                            "name": "area",
                                            "content": data.area
                                        }, {
                                            "name": "city",
                                            "content": data.city
                                        }, {
                                            "name": "vill",
                                            "content": village
                                        }, {
                                            "name": "add",
                                            "content": data.address
                                        }]
                                    };
                                    sails.mandrill_client.messages.sendTemplate({
                                        "template_name": template_name,
                                        "template_content": template_content,
                                        "message": message
                                    }, function(result) {
                                        callback({
                                            value: true,
                                            comment: "Mail Sent"
                                        });
                                        db.close();
                                    }, function(e) {
                                        console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                                    });
                                } else {
                                    callback({
                                        value: false,
                                        comment: "Not created"
                                    });
                                    db.close();
                                }
                            });
                        }
                    }
                } else {
                    var user = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection("team").find({
                        "pincode.pincode": data.pincode
                    }, {
                        "_id": 1,
                        "teamname": 1,
                        "email": 1
                    }).toArray(function(err, data2) {
                        if (data2 && data2[0]) {
                            data.team = data2[0];
                            edituser();
                        } else if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else {
                            callback({
                                value: false,
                                comment: "No such pincode"
                            });
                            db.close();
                        }
                    });

                    function edituser() {
                        db.collection('user').update({
                            _id: user
                        }, {
                            $set: data
                        }, function(err, updated) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                                db.close();
                            } else if (updated.result.nModified != 0 && updated.result.n != 0) {
                                callback({
                                    value: true
                                });
                                db.close();
                            } else if (updated.result.nModified == 0 && updated.result.n != 0) {
                                callback({
                                    value: true,
                                    comment: "Data already updated"
                                });
                                db.close();
                            } else {
                                callback({
                                    value: false,
                                    comment: "No data found"
                                });
                                db.close();
                            }
                        });
                    }
                }
            }
        });
    },
    sendmail: function(data, callback) {
        var i = 0;
        User.find(data, function(userrespo) {
            if (!userrespo.value) {
                _.each(userrespo, function(z) {
                    var sportsdata = "";
                    var j = 0;
                    var village = "";
                    if (z.village && z.village[0] && z.village[0].name) {
                        village = z.village[0].name;
                    }
                    var name = z.firstname + " " + z.middlename + " " + z.lastname;
                    if (z.sports && z.sports.length > 0) {
                        _.each(z.sports, function(a) {
                            if (a != null) {
                                sportsdata += a + ",";
                            }
                        });
                    }
                    if (z.dance && z.dance.length > 0) {
                        _.each(z.dance, function(a) {
                            if (a != null) {
                                sportsdata += a + ",";
                            }
                        });
                    }
                    if (z.quiz && z.quiz.length > 0) {
                        _.each(z.quiz, function(a) {
                            if (a != null) {
                                sportsdata += a + ",";
                            }
                        });
                    }
                    if (z.aquatics && z.aquatics.length > 0) {
                        _.each(z.aquatics, function(a) {
                            if (a != null) {
                                sportsdata += a + ",";
                            }
                        });
                    }
                    if (z.volunteer && z.volunteer.length > 0) {
                        _.each(z.volunteer, function(a) {
                            if (a != null) {
                                sportsdata += a + ",";
                            }
                        });
                    }
                    var template_name = "bherpo";
                    var template_content = [{
                        "name": "bherpo",
                        "content": "bherpo"
                    }]
                    var message = {
                        "from_email": sails.fromEmail,
                        "from_name": sails.fromName,
                        "to": [{
                            "email": z.email,
                            "type": "to"
                        }],
                        "global_merge_vars": [{
                            "name": "events",
                            "content": z.sportsdata
                        }, {
                            "name": "number",
                            "content": z.regno
                        }, {
                            "name": "team",
                            "content": z.team.teamname
                        }, {
                            "name": "mob",
                            "content": z.mobileno
                        }, {
                            "name": "name",
                            "content": name
                        }, {
                            "name": "regdate",
                            "content": z.registrationdate
                        }, {
                            "name": "dob",
                            "content": z.dateofbirth
                        }, {
                            "name": "email",
                            "content": z.email
                        }, {
                            "name": "gen",
                            "content": z.gender
                        }, {
                            "name": "pin",
                            "content": z.pincode
                        }, {
                            "name": "area",
                            "content": z.area
                        }, {
                            "name": "city",
                            "content": z.city
                        }, {
                            "name": "vill",
                            "content": village
                        }, {
                            "name": "add",
                            "content": z.address
                        }]
                    };
                    sails.mandrill_client.messages.sendTemplate({
                            "template_name": template_name,
                            "template_content": template_content,
                            "message": message
                        }, function(result) {
                            i++;
                            if (i == userrespo.length) {
                                callback({
                                    value: true,
                                    comment: "Mail Sent"
                                });
                            }
                        },
                        function(e) {
                            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
                            i++;
                            if (i == userrespo.length) {
                                callback({
                                    value: true,
                                    comment: "Mail Sent"
                                });
                            }
                        });
                });
            } else {
                callback({
                    value: false,
                    comment: "Error"
                });
            }
        });
    }
};
