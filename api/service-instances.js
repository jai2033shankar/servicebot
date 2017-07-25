let async = require('async');
let auth = require('../middleware/auth');
let validate = require('../middleware/validate');
let ServiceInstance = require('../models/service-instance');
let Charge = require('../models/charge');
let EventLogs = require('../models/event-log');
let File = require("../models/file");
let mkdirp = require("mkdirp");
let path = require("path");
let multer= require("multer");
let _ = require('lodash');
let dispatchEvent = require("../config/redux/store").dispatchEvent;
//todo - entity posting should have correct error handling, response should tell user what is wrong like if missing column

let serviceFilePath = "uploads/services/files";
let serviceStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        mkdirp(serviceFilePath, err => cb(err, serviceFilePath))
    },
    filename: function (req, file, cb) {
        require('crypto').pseudoRandomBytes(8, function (err, raw) {
            cb(err, err ? undefined : req.params.id + "-" + raw.toString('hex'))
        })
    }
});


module.exports = function(router) {

    /**
     * Remove the payment plan information for the instance update requests
     */
    router.put(`/service-instances/:id(\\d+)`, validate(ServiceInstance), auth(), function(req,res,next){
        delete req.body.user_id;
        delete req.body.payment_plan;
        delete req.body.subscription_id;
        next();
    });

    router.delete(`/service-instances/:id(\\d+)`, validate(ServiceInstance), auth(), function(req,res,next){
        res.json({error: 'Deleting services is not permitted for security reasons!'});
    });

    router.post('/service-instances/:id/approve', validate(ServiceInstance), auth(), function(req, res, next) {
        let instance_object = res.locals.valid_object;
        instance_object.subscribe(function (err, callback) {
            if(!err){
                res.json(callback);
            } else {
                res.json(err);
            }
        });
    });

    router.post('/service-instances/:id/change-price', validate(ServiceInstance), auth(), function(req, res, next) {
        let instance_object = res.locals.valid_object;
        async.series([
            function (callback) {
                //Remove subscription
                instance_object.unsubscribe(function (err, result) {
                    callback(err, result);
                });
            },
            function (callback) {
                //Remove Payment plan
                instance_object.deletePayPlan(function (result) {
                    callback(null, result);
                });
            },
            function (callback) {
                //Create Payment plan
                instance_object.buildPayStructure(req.body ,function (plan_structure) {
                    instance_object.createPayPlan(plan_structure, function (plan) {
                        callback(null, plan);
                    });
                });
            },
            function (callback) {
                instance_object.subscribe(function (err, result) {
                    callback(err, result);
                });
            }
        ], function (err, result) {
            if(!err){
                res.json(result);
                dispatchEvent("service_instance_updated", result);
                next();
                // mailer('service_instance_update')(req, res, next);
            } else {
                res.json(err);
            }
        });
    });

    router.post('/service-instances/:id/cancel', validate(ServiceInstance), auth(), function(req, res, next) {
        let instance_object = res.locals.valid_object;
        instance_object.unsubscribe(function (err, result) {
            if(!err) {
                res.json(result);
            } else {
                res.json(err);
            }
        });
    });


    router.post('/service-instances/:id/request-cancellation', validate(ServiceInstance), auth(), function(req, res, next) {
        let instance_object = res.locals.valid_object;
        instance_object.requestCancellation(function(result){
            res.locals.json = result;
            next();
            dispatchEvent("service_instance_cancellation_requested", instance_object);
        });
    });


    router.post('/service-instances/:id/add-charge', validate(ServiceInstance), auth(), function(req, res, next) {
        let instance_object = res.locals.valid_object;
        if(instance_object.get('subscription_id')) {
            let default_charge = {
                'user_id': instance_object.get('user_id'),
                'service_instance_id': instance_object.get('id'),
                'subscription_id': instance_object.get('subscription_id'),
                'currency': instance_object.data.payment_plan.currency
            };
            let charge_obj = _.assign(default_charge, req.body);
            let charge = new Charge(charge_obj);
            charge.create(function (err, charge_item) {
                res.json(charge_item);
                dispatchEvent("service_instance_charge_added", instance_object);
                next();
            });
        } else {
            res.json({'error':'Payment plan is required prior to adding charges.'});
        }
    });

    router.get('/service-instances/:id/awaiting-charges', validate(ServiceInstance), auth(null, ServiceInstance), function(req, res, next) {
        let instance_object = res.locals.valid_object;
        instance_object.getAllAwaitingCharges(function(charges){
            res.json(charges);
        });
    });

    router.post('/service-instances/:id/approve-charges', validate(ServiceInstance), auth(null, ServiceInstance), function(req, res, next) {
        let instance_object = res.locals.valid_object;
        instance_object.approveAllCharges(function(charges){
            EventLogs.logEvent(req.user.get('id'), `service-instances ${req.params.id} had charges approved by user ${req.user.get('email')}`);
            res.json(charges);
        });
    });

    router.post('/service-instances/:id/files', validate(ServiceInstance), auth(null, ServiceInstance), multer({ storage:serviceStorage }).array('files'), function(req, res, next) {
        console.log(req.files);
        let filesToInsert = req.files.map(function(file){
            if(req.user) {
                file.user_id = req.user.data.id;
            }else{
                file.user_id = res.locals.valid_object.get("user_id");
            }
            file.name = file.originalname;
            return file
        });
        console.log(filesToInsert);
        File.batchCreate(filesToInsert, function(files){
            console.log(files);
            EventLogs.logEvent(req.user.get('id'), `service-instances ${req.params.id} had files added by user ${req.user.get('email')}`);
            res.json(files);
        });
    });

    router.get('/service-instances/:id/files',auth(null, ServiceInstance), function(req, res, next) {
        File.findFile(serviceFilePath, req.params.id, function(files){
            console.log(files);
            res.json(files);
        })
    });

    router.delete("/service-instances/:id/files/:fid", validate(File, 'fid'), auth(), function(req, res, next){
        File.findOne("id", req.params.fid, function(file){
            file.delete(function(){
                EventLogs.logEvent(req.user.get('id'), `service-instances ${req.params.id} had file ${req.params.fid} deleted by user ${req.user.get('email')}`);
                res.json({message:"File Deleted!"});
            })
        })
    });


    router.get("/service-instances/:id/files/:fid", validate(File, 'fid'), auth(null, ServiceInstance), function(req, res, next){
        File.findOne("id", req.params.fid, function(file){
            let options = {
                headers:{
                    'Content-Disposition': "inline; filename="+file.get("name")
                }
            };
            let abs = path.resolve(__dirname, "../" + file.get("path"));

            res.sendFile(abs, options)

        })
    });

    //Override post route to hide adding instances
    router.post(`/service-instances`, function(req,res,next){
        res.sendStatus(404);
    });


    require("./entity")(router, ServiceInstance, "service-instances", "user_id");

    /**
     * Used to send mail for instance update
     */
    // router.put(`/service-instances/:id(\\d+)`, (req, res, next) => {
    //     dispatchEvent(`${model.table}_created`)
    // });
    //
    return router;
};