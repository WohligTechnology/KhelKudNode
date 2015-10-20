module.exports = {
    save: function(data, callback) {
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
                                data.regno = data2[0].regno + 1;
                                callme();
                            } else {
                                data.regno = 9913;
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
                                    data.regno = data.regno.toString();
                                    var name = data.firstname + " " + data.middlename + " " + data.lastname;
                                    if (data.regno.length == 4) {
                                        var regnos = "R00" + data.regno;
                                    } else if (data.regno.length == 5) {
                                        var regnos = "R0" + data.regno;
                                    } else {
                                        var regnos = "R" + data.regno;
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
                                            "content": regnos
                                        }, {
                                            "name": "team",
                                            "content": data.team.teamname
                                        }, {
                                            "name": "mob",
                                            "content": data.mobileno
                                        }, {
                                            "name": "name",
                                            "content": name
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
    //Findlimited
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
    //Findlimited
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
                    regno: m.regno
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
    }
};
