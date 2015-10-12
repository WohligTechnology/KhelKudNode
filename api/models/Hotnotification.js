module.exports = {
    save: function(data, callback) {
        var loginuser = sails.ObjectID(data.loginuser);
        delete data.loginuser;
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection("loginuser").update({
                        _id: loginuser
                    }, {
                        $push: {
                            hotnotification: data
                        }
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
                            });
                            db.close();
                        } else if (updated) {
                            callback({
                                value: true
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
                    data._id = sails.ObjectID(data._id);
                    var tobechanged = {};
                    var attribute = "hotnotification.$.";
                    _.forIn(data, function(value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("loginuser").update({
                        "_id": loginuser,
                        "hotnotification._id": data._id
                    }, {
                        $set: tobechanged
                    }, function(err, updated) {
                        if (err) {
                            console.log(err);
                            callback({
                                value: false
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
    delete: function(data, callback) {
        var loginuser = sails.ObjectID(data.loginuser);
        delete data.loginuser;
        data._id = sails.ObjectID(data._id);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                db.collection("loginuser").update({
                    _id: user
                }, {
                    $pull: {
                        "hotnotification": {
                            "_id": sails.ObjectID(data._id)
                        }
                    }
                }, function(err, updated) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (updated) {
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
        });
    },
    findone: function(data, callback) {
        var loginuser = sails.ObjectID(data.loginuser);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            } else if (db) {
                db.collection("loginuser").find({
                    "_id": loginuser,
                    "hotnotification._id": sails.ObjectID(data._id)
                }, {
                    "hotnotification.$": 1
                }).toArray(function(err, data2) {
                    if (data2 && data2[0] && data2[0].hotnotification && data2[0].hotnotification[0]) {
                        callback(data2[0].hotnotification[0]);
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
    find: function(data, callback) {
        var loginuser = sails.ObjectID(data.loginuser);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("loginuser").aggregate([{
                    $match: {
                        _id: loginuser,
                        "hotnotification.clicks": {
                            $exists: true
                        }
                    }
                }, {
                    $unwind: "$hotnotification"
                }, {
                    $match: {
                        "hotnotification.clicks": {
                            $exists: true
                        }
                    }
                }, {
                    $project: {
                        "hotnotification._id": 0,
                        _id: 0,
                        "hotnotification.clicks": 1
                    }
                }]).toArray(function(err, data2) {
                    if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else if (data2 && data2[0]) {
                        callback(data2);
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
        var newcallback = 0;
        var newreturns = {};
        var check = new RegExp(data.search, "i");
        var pagesize = data.pagesize;
        var pagenumber = data.pagenumber;
        var loginuser = sails.ObjectID(data.loginuser);
        sails.query(function(err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("loginuser").aggregate([{
                    $match: {
                        _id: loginuser,
                        "hotnotification.clicks": {
                            $exists: true
                        },
                        "hotnotification.clicks": {
                            $regex: check
                        }
                    }
                }, {
                    $unwind: "$hotnotification"
                }, {
                    $match: {
                        "hotnotification.clicks": {
                            $exists: true
                        },
                        "hotnotification.clicks": {
                            $regex: check
                        }
                    }
                }, {
                    $group: {
                        _id: loginuser,
                        count: {
                            $sum: 1
                        }
                    }
                }, {
                    $project: {
                        count: 1
                    }
                }]).toArray(function(err, result) {
                    if (result && result[0]) {
                        newreturns.total = result[0].count;
                        newreturns.totalpages = Math.ceil(result[0].count / data.pagesize);
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
                    }
                });

                function callbackfunc() {
                    db.collection("loginuser").aggregate([{
                        $match: {
                            _id: loginuser,
                            "hotnotification.clicks": {
                                $exists: true
                            },
                            "hotnotification.clicks": {
                                $regex: check
                            }
                        }
                    }, {
                        $unwind: "$hotnotification"
                    }, {
                        $match: {
                            "hotnotification.clicks": {
                                $exists: true
                            },
                            "hotnotification.clicks": {
                                $regex: check
                            }
                        }
                    }, {
                        $project: {
                            hotnotification: 1
                        }
                    }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function(err, found) {
                        if (found && found[0]) {
                            newreturns.data = found;
                            callback(newreturns);
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
            }
        });
    }
};
