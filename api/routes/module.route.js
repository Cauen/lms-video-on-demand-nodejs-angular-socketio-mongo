const express = require('express');
const app = express();
const moduleRoutes = express.Router();

// Require Module model in our routes module
let Module = require('../models/Module');

// Defined store route
moduleRoutes.route('/add').post(function (req, res) {
  let module = new Module(req.body);
  module.save()
    .then(module => {
      res.status(200).json({'module': 'module in added successfully'});
    })
    .catch(err => {
    res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
moduleRoutes.route('/').get(function (req, res) {
    Module.find(function (err, modulees){
    if(err){
      console.log(err);
    }
    else {
      res.json(modulees);
    }
  });
});

// Defined edit route
moduleRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  Module.findById(id, function (err, module){
      res.json(module);
  });
});

//  Defined update route
moduleRoutes.route('/update/:id').post(function (req, res) {
    Module.findById(req.params.id, function(err, module) {
    if (!module)
      return next(new Error('Could not load Document'));
    else {
        module.person_name = req.body.person_name;
        module.module_name = req.body.module_name;
        module.module_gst_number = req.body.module_gst_number;

        module.save().then(module => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
moduleRoutes.route('/delete/:id').get(function (req, res) {
    Module.findByIdAndRemove({_id: req.params.id}, function(err, module){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = moduleRoutes;