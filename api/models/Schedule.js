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
                if (data.sports && sails.ObjectID.isValid(data.sports)) {
                    var sports = sails.ObjectID(data.sports);
                    delete data.sports;
                    if (!data._id) {
                        data._id = sails.ObjectID();
                        db.collection("sports").update({
                            _id: sports
                        }, {
                            $push: {
                                schedule: data
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
                                    comment: "No Such schedule"
                                });
                                db.close();
                            }
                        });
                    } else {
                        if (data._id && sails.ObjectID.isValid(data._id)) {
                            data._id = sails.ObjectID(data._id);
                            var tobechanged = {};
                            var attribute = "schedule.$.";
                            _.forIn(data, function (value, key) {
                                tobechanged[attribute + key] = value;
                            });
                            db.collection("sports").update({
                                "_id": sports,
                                "schedule._id": data._id
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
                                        comment: "No Such schedule"
                                    });
                                    db.close();
                                }
                            });
                        } else {
                            callback({
                                value: false,
                                comment: "scheduleID incorrect."
                            });
                            db.close();
                        }
                    }
                } else {
                    callback({
                        value: false,
                        comment: "sportsID Incorrect"
                    });
                    db.close();
                }
            }
        });
    },
    delete: function (data, callback) {
        if (data.sports && sails.ObjectID.isValid(data.sports) && data._id && sails.ObjectID.isValid(data._id)) {
            var sports = sails.ObjectID(data.sports);
            delete data.sports;
            data._id = sails.ObjectID(data._id);
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("sports").update({
                        _id: sports
                    }, {
                        $pull: {
                            "schedule": {
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
                                comment: "No such schedule."
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "sportsid or scheduleid incorrect."
            });
        }
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
                var sports = sails.ObjectID(data.sports);
                callbackfunc1();

                function callbackfunc1() {
                    db.collection("sports").aggregate([{
                        $match: {
                            _id: sports,
                            "schedule.team1": {
                                $exists: true
                            },
                            "schedule.team1": {
                                $regex: check
                            }
                        }
          }, {
                        $unwind: "$schedule"
          }, {
                        $match: {
                            _id: sports,
                            "schedule.team1": {
                                $exists: true
                            },
                            "schedule.team1": {
                                $regex: check
                            }
                        }
          }, {
                        $group: {
                            _id: sports,
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
                        db.collection("sports").aggregate([{
                            $match: {
                                _id: sports,
                                "schedule.team1": {
                                    $exists: true
                                },
                                "schedule.team1": {
                                    $regex: check
                                }
                            }
          }, {
                            $unwind: "$schedule"
          }, {
                            $match: {
                                _id: sports,
                                "schedule.team1": {
                                    $exists: true
                                },
                                "schedule.team1": {
                                    $regex: check
                                }
                            }
          }, {
                            $project: {
                                schedule: 1
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
        if (data.sports && sails.ObjectID.isValid(data.sports) && data._id && sails.ObjectID.isValid(data._id)) {
            var sports = sails.ObjectID(data.sports);
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("sports").find({
                        _id: sports,
                        "schedule._id": sails.ObjectID(data._id)
                    }, {
                        "schedule.$": 1
                    }).toArray(function (err, data2) {
                        if (data2 && data2[0] && data2[0].schedule && data2[0].schedule[0]) {
                            callback(data2[0].schedule[0]);
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
                                comment: "No Such schedule."
                            });
                            db.close();
                        }
                    });
                }
            });
        } else {
            callback({
                value: false,
                comment: "sportsid or scheduleid incorrect."
            });
        }
    },
    find: function (data, callback) {
        if (data.sports && sails.ObjectID.isValid(data.sports)) {
            var sports = sails.ObjectID(data.sports);
            sails.query(function (err, db) {
                if (err) {
                    console.log(err);
                    callback({
                        value: false
                    });
                }
                if (db) {
                    db.collection("sports").aggregate([{
                        $match: {
                            _id: sports,
                            "schedule.team1": {
                                $exists: true
                            }
                        }
        }, {
                        $unwind: "$schedule"
        }, {
                        $match: {
                            "schedule.team1": {
                                $exists: true
                            }
                        }
        }, {
                        $project: {
                            schedule: 1
                        }
        }]).toArray(function (err, data2) {
                        if (data2 && data2[0] && data2[0].schedule && data2[0].schedule[0]) {
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
        } else {
            callback({
                value: false,
                comment: "sportsid Incorrect."
            });
        }
    }
};