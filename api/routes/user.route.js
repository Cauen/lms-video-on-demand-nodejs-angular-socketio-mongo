const express = require('express');
const app = express();
const userRoutes = express.Router();

// Require User model in our routes module
let User = require('../models/User');

// Defined store route
userRoutes.route('/add').post(function (req, res) {
    //let user = new User(req.body);
    let user = new User({username: 'emanuel', email: 'emanuel-caue14@hotmail.com', name: 'Emanuel', hash: '1jiasda8sd', salt: 'ajsd8asdj'});
  user.save()
    .then(user => {
      res.status(200).json({'user': 'user in added successfully'});
    })
    .catch(err => {
    res.status(400).send(err);
    });
});

// Defined get data(index or listing) routez
userRoutes.route('/').get(function (req, res) {
    User.find(function (err, useres){
    if(err){
      console.log(err);
    }
    else {
      res.json(useres);
    }
  });
});

// Defined edit route
userRoutes.route('/edit/:id').get(function (req, res) {
  let id = req.params.id;
  User.findById(id, function (err, user){
      res.json(user);
  });
});

//  Defined update route
userRoutes.route('/update/:id').post(function (req, res) {
    User.findById(req.params.id, function(err, user) {
    if (!user)
      return next(new Error('Could not load Document'));
    else {
        user.person_name = req.body.person_name;
        user.user_name = req.body.user_name;
        user.user_gst_number = req.body.user_gst_number;

        user.save().then(user => {
          res.json('Update complete');
      })
      .catch(err => {
            res.status(400).send("unable to update the database");
      });
    }
  });
});

// Defined delete | remove | destroy route
userRoutes.route('/delete/:id').get(function (req, res) {
    User.findByIdAndRemove({_id: req.params.id}, function(err, user){
        if(err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = userRoutes;