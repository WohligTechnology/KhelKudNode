module.exports = {
    save: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                var team = sails.ObjectID(data.team);
                delete data.team;
                if (!data._id) {
                    data._id = sails.ObjectID();
                    db.collection("team").update({
                        _id: team
                    }, {
                        $push: {
                            pincode: data
                        }
                    }, function (err, updated) {
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
                                comment: "No Such pincode"
                            });
                            db.close();
                        }
                    });
                } else {
                    data._id = sails.ObjectID(data._id);
                    var tobechanged = {};
                    var attribute = "pincode.$.";
                    _.forIn(data, function (value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("team").update({
                        "_id": team,
                        "pincode._id": data._id
                    }, {
                        $set: tobechanged
                    }, function (err, updated) {
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
                                comment: "No Such pincode"
                            });
                            db.close();
                        }
                    });
                }
            }
        });
    },
    delete: function (data, callback) {
        var team = sails.ObjectID(data.team);
        delete data.team;
        data._id = sails.ObjectID(data._id);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("team").update({
                    _id: team
                }, {
                    $pull: {
                        "pincode": {
                            "_id": sails.ObjectID(data._id)
                        }
                    }
                }, function (err, updated) {
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
                            comment: "No such pincode."
                        });
                        db.close();
                    }
                });
            }
        });
    },
    //Findlimited
    findlimited: function (data, callback) {
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                var newcallback = 0;
                var newreturns = {};
                var check = new RegExp(data.search, "i");
                var pagesize = data.pagesize;
                var pagenumber = data.pagenumber;
                var team = sails.ObjectID(data.team);
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("team").aggregate([{
                        $match: {
                            _id: team,
                            "pincode.area": {
                                $exists: true
                            },
                            "pincode.area": {
                                $regex: check
                            }
                        }
          }, {
                        $unwind: "$pincode"
          }, {
                        $match: {
                            _id: team,
                            "pincode.area": {
                                $exists: true
                            },
                            "pincode.area": {
                                $regex: check
                            }
                        }
          }, {
                        $group: {
                            _id: team,
                            count: {
                                $sum: 1
                            }
                        }
          }, {
                        $project: {
                            count: 1
                        }
          }]).toArray(function (err, result) {
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
                                comment: "Count of null."
                            });
                            db.close();
                        }
                    });

                    function callbackfunc() {
                        db.collection("team").aggregate([{
                            $match: {
                                _id: team,
                                "pincode.area": {
                                    $exists: true
                                },
                                "pincode.area": {
                                    $regex: check
                                }
                            }
          }, {
                            $unwind: "$pincode"
          }, {
                            $match: {
                                _id: team,
                                "pincode.area": {
                                    $exists: true
                                },
                                "pincode.area": {
                                    $regex: check
                                }
                            }
          }, {
                            $project: {
                                pincode: 1
                            }
          }]).skip(pagesize * (pagenumber - 1)).limit(pagesize).toArray(function (err, found) {
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
                                    comment: "No data found."
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
    findone: function (data, callback) {
        var team = sails.ObjectID(data.team);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("team").find({
                    _id: team,
                    "pincode._id": sails.ObjectID(data._id)
                }, {
                    "pincode.$": 1
                }).toArray(function (err, data2) {
                    if (data2 && data2[0] && data2[0].pincode && data2[0].pincode[0]) {
                        callback(data2[0].pincode[0]);
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
                            comment: "No Such pincode."
                        });
                        db.close();
                    }
                });
            }
        });
    },
    find: function (data, callback) {
        var team = sails.ObjectID(data.team);
        sails.query(function (err, db) {
            if (err) {
                console.log(err);
                callback({
                    value: false
                });
            }
            if (db) {
                db.collection("team").aggregate([{
                    $match: {
                        _id: team,
                        "pincode.area": {
                            $exists: true
                        }
                    }
        }, {
                    $unwind: "$pincode"
        }, {
                    $match: {
                        "pincode.area": {
                            $exists: true
                        }
                    }
        }, {
                    $project: {
                        pincode: 1
                    }
        }]).toArray(function (err, data2) {
                    if (data2 && data2[0] && data2[0].pincode && data2[0].pincode[0]) {
                        callback(data2);
                        db.close();
                    } else if (err) {
                        console.log(err);
                        callback({
                            value: false
                        });
                        db.close();
                    } else {
                        callback({
                            value: false
                        });
                        db.close();
                    }
                });
            }
        });
    },
    savepincode: function (data, callback) {
        var team = sails.ObjectID(data.team);
        delete data.team;
        data._id = sails.ObjectID();
        sails.query(function (err, db) {
            if (err) {
                callback({
                    value: false
                });
                console.log(err);
            }
            if (db) {
                db.collection("team").update({
                    _id: team
                }, {
                    $push: {
                        pincode: data
                    }
                }, function (err, updated) {
                    if (err) {
                        callback({
                            value: false
                        });
                        console.log(err);
                        db.close();
                    } else if (updated) {
                        callback({
                            value: true
                        });
                        db.close();
                    } else {
                        callback({
                            value: false
                        });
                        console.log("No team found");
                        db.close();
                    }
                });
            }
        });
    }
};