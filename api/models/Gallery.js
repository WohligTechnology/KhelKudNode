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
                            gallery: data
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
                                comment: "No Such gallery"
                            });
                            db.close();
                        }
                    });
                } else {
                    data._id = sails.ObjectID(data._id);
                    var tobechanged = {};
                    var attribute = "gallery.$.";
                    _.forIn(data, function (value, key) {
                        tobechanged[attribute + key] = value;
                    });
                    db.collection("team").update({
                        "_id": team,
                        "gallery._id": data._id
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
                                comment: "No Such gallery"
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
                        "gallery": {
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
                            comment: "No such gallery."
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
                            "gallery.name": {
                                $exists: true
                            },
                            "gallery.name": {
                                $regex: check
                            }
                        }
          }, {
                        $unwind: "$gallery"
          }, {
                        $match: {
                            _id: team,
                            "gallery.name": {
                                $exists: true
                            },
                            "gallery.name": {
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
                                "gallery.name": {
                                    $exists: true
                                },
                                "gallery.name": {
                                    $regex: check
                                }
                            }
          }, {
                            $unwind: "$gallery"
          }, {
                            $match: {
                                _id: team,
                                "gallery.name": {
                                    $exists: true
                                },
                                "gallery.name": {
                                    $regex: check
                                }
                            }
          }, {
                            $project: {
                                gallery: 1
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
                    "gallery._id": sails.ObjectID(data._id)
                }, {
                    "gallery.$": 1
                }).toArray(function (err, data2) {
                    if (data2 && data2[0] && data2[0].gallery && data2[0].gallery[0]) {
                        callback(data2[0].gallery[0]);
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
                            comment: "No Such gallery."
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
                        "gallery.name": {
                            $exists: true
                        }
                    }
        }, {
                    $unwind: "$gallery"
        }, {
                    $match: {
                        "gallery.name": {
                            $exists: true
                        }
                    }
        }, {
                    $project: {
                        gallery: 1
                    }
        }]).toArray(function (err, data2) {
                    if (data2 && data2[0] && data2[0].gallery && data2[0].gallery[0]) {
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
    }
};