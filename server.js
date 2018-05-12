var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');;

// Get the configurations
var config = require ( __dirname + '/config' );

//var db = require(__dirname + '/database/db');
var models = require(__dirname + '/api/models/DBModels');
// Our logger for logging to file and console
var logger = require ( __dirname + '/logger' );

// HTTP Codes Constant file
var HTTP = require(__dirname + '/http-response');

// Constant file
var STRINGS = require(__dirname + '/strings');

// Instance for express server
var request = require('request');
var http = require ( 'http' );

var bcrypt = require ('bcrypt-nodejs');

var nodemailer = require('nodemailer');

var path = require('path');

var app = module.exports = express();

var option = {
  maxFieldsSize: config.imageFileSize
};

var multipart = require('connect-multiparty');

app.use(multipart(option));

models.sequelize.sync().then(function() {
  /**
   * Listen on provided port
   */
  app.listen(port, function () {
    console.log('Listening on Port 3000');

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    var public = __dirname + '/Client/html/';
    var partials = __dirname + '/Client/html/partials/';
    var javaScriptFiles = __dirname + '/Client/js/';
    var cssFiles = __dirname + '/Client/css/';
    var images = __dirname + '/Client/images/';
    var fonts = __dirname + '/Client/fonts/';

    var baseUrl = config.baseUrl;

    app.get(baseUrl, function(req, res) {
      res.sendFile(path.join(public + "home.html"));
    });

    app.get(baseUrl+'about', function(req, res) {
      res.sendFile(path.join(public + "about.html"));
    });

    app.get(baseUrl+'contact', function(req, res) {
      res.sendFile(path.join(public + "contact.html"));
    });

    app.use( baseUrl + 'partials', express.static(partials));
    app.use(baseUrl + 'js', express.static(javaScriptFiles));
    app.use(baseUrl + 'css', express.static(cssFiles));
    app.use(baseUrl + 'images', express.static(images));
    app.use(baseUrl + 'fonts', express.static(fonts));
    app.use(baseUrl, express.static(public));

    // Support for cross domain.
    app.all('*', function callbackAccessControl (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });

    // Setup user controller
    var userController = require( __dirname + '/api/controllers/usersController' );
    userController.setup( app, logger, STRINGS, HTTP, models, http, request, bcrypt, config, models.OP );

    // Setup realEstate controller
    var realEstateController = require( __dirname + '/api/controllers/realEstateController' );
    realEstateController.setup( app, logger, STRINGS, HTTP, models, http, request, models.OP, config );

    // Setup message controller
    var messageController = require( __dirname + '/api/controllers/messageController' );
    messageController.setup(app, logger, STRINGS, HTTP, models, http, request, bcrypt, config, models.OP , nodemailer);

  });
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});;



