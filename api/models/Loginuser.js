module.exports = {
    adminlogin: function(data, callback) {
        if (data.password) {
            data.password = sails.md5(data.password);
            sails.query(function(err, db) {
                if (db) {
                    db.collection('loginuser').find({
                        email: data.email,
                        password: data.password,
                        accesslevel: "admin"
                    }, {
                        password: 0,
                        forgotpassword: 0
                    }).toArray(function(err, found) {
                        if (err) {
                            callback({
                                value: "false"
                            });
                            console.log(err);
                            db.close();
                        } else if (found && found[0]) {
                            callback(found[0]);
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
                if (err) {
                    console.log(err);
                    callback({
                        value: "false"
                    });
                }
            });
        } else {
            callback({
                value: false
            });
        }
    },
    save: function(data, callback) {
        if (data.password) {
            data.password = sails.md5(data.password);
        }
        if (data.team) {
            data.team = sails.ObjectID(data.team);
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
                    db.collection('loginuser').insert(data, function(err, created) {
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
                            if (data.team) {
                                var newdata = {};
                                newdata._id = data.team;
                                Team.findone(newdata, function(findrespo) {
                                    newdata.downloads = findrespo.downloads + 1;
                                    Team.save(newdata, callback);
                                });
                            }
                        } else {
                            callback({
                                value: false,
                                comment: "Not created"
                            });
                            db.close();
                        }
                    });
                } else {
                    var loginuser = sails.ObjectID(data._id);
                    delete data._id;
                    db.collection('loginuser').update({
                        _id: loginuser
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
                db.collection("loginuser").find().toArray(function(err, found) {
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
                    db.collection("loginuser").count({
                        name: {
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
                        db.collection("loginuser").find({
                            name: {
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
                db.collection("loginuser").find({
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
            } else if (db) {
                db.collection('loginuser').remove({
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
            }
        });
    },
    savenoti: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("loginuser").find({
                    _id: sails.ObjectID(data._id)
                }).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        if (data2[0].notification && data2[0].notification[0]) {
                            var i = 0;
                            var index = sails._.findIndex(data2[0].notification, function(chr) {
                                return chr.notification.toString() == data.notification.toString();
                            });
                            if (index == -1) {
                                var newdata = {};
                                var notidata = {};
                                notidata.click = 1;
                                notidata.notification = data.notification;
                                newdata.notification = [];
                                newdata.notification = data2[0].notification;
                                newdata.notification.push(notidata);
                                var loginuser = sails.ObjectID(data._id);
                                delete data._id;
                                db.collection('loginuser').update({
                                    _id: loginuser
                                }, {
                                    $set: newdata
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
                                    } else {
                                        callback({
                                            value: false,
                                            comment: "No data found"
                                        });
                                        db.close();
                                    }
                                });
                            } else {
                                callback({
                                    value: false,
                                    comment: "Data already updated"
                                });
                                db.close();
                            }
                        } else {
                            var newdata = {};
                            var notidata = {};
                            notidata.click = 1;
                            notidata.notification = data.notification;
                            newdata.notification = [];
                            newdata.notification.push(notidata);
                            var loginuser = sails.ObjectID(data._id);
                            delete data._id;
                            db.collection('loginuser').update({
                                _id: loginuser
                            }, {
                                $set: newdata
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
                                } else {
                                    callback({
                                        value: false,
                                        comment: "No data found"
                                    });
                                    db.close();
                                }
                            });
                        }
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
                db.collection("loginuser").count({}, function(err, number) {
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
    countnotify: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: "false"
                });
            }
            if (db) {
                db.collection("notification").count({}, function(err, number) {
                    if (number != null) {
                        Loginuser.findone(data, function(response) {
                            if (response.notification && response.notification[0]) {
                                var num = number - response.notification.length;
                                if (num <= 0) {
                                    callback(0);
                                    db.close();
                                } else {
                                    callback(num);
                                    db.close();
                                }
                            } else {
                                callback(number);
                                db.close();
                            }
                        });
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
    teamcount: function(data, callback) {
        var i = 0;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false,
                    comment: "Error"
                });
            }
            if (db) {
                Team.find(data, function(teamrespo) {
                    _.each(teamrespo, function(n) {
                        db.collection('loginuser').find({
                            team: sails.ObjectID(n._id)
                        }).toArray(function(err, data2) {
                            if (err) {
                                console.log(err);
                                callback({
                                    value: false,
                                    comment: "Error"
                                });
                            } else if (data2 && data2[0]) {
                                var newdata = {};
                                newdata._id = n._id;
                                newdata.downloads = data2.length;
                                Team.save(newdata, function(logrespo) {
                                    i++;
                                    if (i == teamrespo.length) {
                                        callback({
                                            value: true,
                                            comment: "Done"
                                        });
                                    }
                                });
                            } else {
                                var newdata = {};
                                newdata._id = n._id;
                                newdata.downloads = 0;
                                Team.save(newdata, function(logrespo) {
                                    i++;
                                    if (i == teamrespo.length) {
                                        callback({
                                            value: true,
                                            comment: "Done"
                                        });
                                    }
                                });
                            }
                        });
                    });
                });
            }
        });
    }
};
