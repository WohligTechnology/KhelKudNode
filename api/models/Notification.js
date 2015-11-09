module.exports = {
    save: function(data, callback) {
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
                    db.collection('notification').insert(data, function(err, created) {
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
                } else {
                    var user = data.user;
                    delete data.user;
                    var notification = sails.ObjectID(data._id);
                    delete data._id
                    db.collection('notification').update({
                        _id: notification
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
                        } else if (updated) {
                            var newdata = {};
                            newdata.notification = notification;
                            newdata._id = user;
                            Loginuser.savenoti(newdata, callback);
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
            } else if (db) {
                db.collection("notification").find().toArray(function(err, found) {
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
    findhotnotify: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                db.collection("notification").count({
                    clicks: {
                        $gt: 0
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
                    db.collection("notification").find({
                        clicks: {
                            $gt: 0
                        }
                    }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                        if (err) {
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (found && found[0]) {
                            newreturns.data = found;
                            callback(sails._.sortByOrder(newreturns.data, ['clicks'], ['desc']));
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
    //Findlimited
    findlimited: function(data, callback) {
        var newreturns = {};
        newreturns.data = [];
        var pagesize = parseInt(data.pagesize);
        var pagenumber = parseInt(data.pagenumber);
        if (data.user) {
            var user = {};
            user._id = sails.ObjectID(data.user);
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
                        db.collection("notification").count({}, function(err, number) {
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
                            db.collection("notification").find({}).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                                if (err) {
                                    callback({
                                        value: false
                                    });
                                    console.log(err);
                                    db.close();
                                } else if (found && found[0]) {
                                    Loginuser.findone(user, function(response) {
                                        if (response.notification && response.notification[0]) {
                                            var k = 0;
                                            _.each(response.notification, function(m) {
                                                _.each(found, function(n) {
                                                    if (m.notification.toString() == n._id.toString()) {
                                                        n.click = 1;
                                                    }
                                                    var index = sails._.findIndex(newreturns.data, function(chr) {
                                                        return chr._id == n._id;
                                                    });
                                                    if (index == -1) {
                                                        newreturns.data.push(n);
                                                    }
                                                });
                                                k++;
                                                if (k == response.notification.length) {
                                                    callback(newreturns);
                                                    db.close();
                                                }
                                            });
                                        } else {
                                            var i = 0;
                                            _.each(found, function(n) {
                                                n.click = 0;
                                                newreturns.data.push(n);
                                                i++;
                                                if (i == found.length) {
                                                    callback(newreturns);
                                                    db.close();
                                                }
                                            });
                                        }
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
        } else {
            sails.query(function(err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                } else if (db) {
                    db.collection("notification").count({}, function(err, number) {
                        if (number && number != "") {
                            newreturns.total = number;
                            newreturns.totalpages = Math.ceil(number / data.pagesize);
                            callbackfunc1();
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

                    function callbackfunc1() {
                        db.collection("notification").find({}).sort({
                            _id: -1
                        }).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                            if (err) {
                                callback({
                                    value: false
                                });
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
            });
        }
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
                db.collection("notification").find({
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
            db.collection('notification').remove({
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
    editnot: function(data, callback) {
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else {
                var notification = sails.ObjectID(data._id);
                delete data._id
                db.collection('notification').update({
                    _id: notification
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
                    } else if (updated) {
                        callback({
                            value: true,
                            comment: "Data updated"
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
    }
};
