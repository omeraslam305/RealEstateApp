"use strict";

/**
 * @author Copyright Abdu-Bari.
 */

const fs = require('fs');

var user = module.exports = {};


/**
 * user Class.
 * @class User
 * @author Abdul-Bari
 * @param {file} app app filepath.
 * @param {file} logger logger filepath.
 * @param {file} STRINGS STRINGS filepath.
 * @param {file} HTTP HTTP filepath.
 * @param {file} model database models.
 * @param {file} http http String filepath.
 * @param {file} request request filepath.
 * @param {Object} Sequelize operators
 *
 * @returns {void}
 */
user.setup = function user(app, logger, STRINGS, HTTP, models, http, request, bcrypt, config, OP) {

  /**
   * @api {get}  /api/users  List Of All Registered Users.
   * @apiName ListAllUsers
   * @apiGroup User
   *
   * @apiSuccess (Success) {JSON} all users.
   */

  app.get('/api/users', function getUsersCallback( req, res ) {
    logger.info('Inside get /api/users');


    var response = {};
    models.User.findAll({
      where: { UserTypeId: {[OP.eq]: req.query.usertypeid}}
    }).then(users => {
      logger.info ( STRINGS.RESULT_SUCCESS );
      res.status( HTTP.OK ).jsonp( users );
    }).catch(function(err) {
      logger.info(STRINGS.RESULT_FAILED);
      res.status( HTTP.OK ).jsonp( err );
    })
  });


  /**
   * @api {get}  /api/user  Get Specific User.
   * @apiName GetUser
   * @apiGroup User
   *
   * @apiSuccess (Success) {JSON} users.
   */
  app.get('/api/user', function getUserCallback( req, res ) {
    logger.info('Inside get /api/user');

    var me = this;

    models.User.findOne({
      where: { username: {[me.OP.eq]: req.query.username}}
    }).then(user => {
      logger.info ( STRINGS.RESULT_SUCCESS );
      res.status( HTTP.OK ).jsonp( user );
    }).catch(function(err) {
      logger.info(STRINGS.RESULT_FAILED);
      res.status( HTTP.OK ).jsonp( err );
    })
  });

  /**
   * @api {get}  /api/GetAgentListing  Get All Agents Listing.
   * @apiName GetAgentListing
   * @apiGroup User
   *
   * @apiSuccess (Success) {JSON} new users.
   */
  app.get('/api/GetAgentListing', function getUserCallback( req, res ) {
    logger.info('Inside get /api/user');

    var me = this;
    console.log(req.query.conversationID);
    var response = {
      success: false
    };

    models.sequelize.query(" SELECT u.UserId, u.UserImagePath , u.UserName, concat(u.FirstName, ' ', u.LastName) as AgentName, u.Email,  u.Address, u.MobileNumber, c.CompanyName,c.id as CompanyID FROM `fa17g19`.`RealEstateCompanies` as c inner join `fa17g19`.`Users` as u on u.RealEstateCompanyID = c.Id where u.UserTypeId = 2;", 
    { type: models.sequelize.QueryTypes.SELECT}).then(agent => {    
      if(agent !== null && agent !== '') {
        // console.log(agent.ConversationID);
        logger.info ( STRINGS.RESULT_SUCCESS );
        response.success = true;
        response.message = STRINGS.AGENTS_RETEREIVE
        response.data = agent;
        res.status( HTTP.OK ).jsonp( response );
             
      } else {
        logger.info ( STRINGS.RESULT_SUCCESS );
        response.message = STRINGS.AGENTS_RETEREIVE_FAILED;
        response.data = null;
        res.status( HTTP.OK ).jsonp( response );
      }
    }).catch(function(err) {
      console.log(err);
      logger.info(STRINGS.RESULT_FAILED);
      response.message = STRINGS.ERROR_MESSAGE;
      response.data = err;
      res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );
    });
  });  


  /**
   * @api {post}  /api/user  inser new User.
   * @apiName PostUser
   * @apiGroup User
   *
   * @apiSuccess (Success) {JSON} new users.
   */
  app.post('/api/user', function InsertUserCallback( req, res ) {
    logger.info('Inside post /api/user');

    var date = new Date();

    models.User.create({
      username: req.body.username,
      createdAt: date.now,
      updatedAt: date.now,
    }).then(function(user) {
      logger.info ( STRINGS.RESULT_SUCCESS );
      res.status( HTTP.OK ).jsonp( user );
    }).catch(function(err) {
      logger.info(STRINGS.RESULT_FAILED);
      res.status( HTTP.OK ).jsonp( err );
    });

  });

  /**
   * @api {post}  /api/user/update  update User.
   * @apiName UpdateUser
   * @apiGroup User
   *
   * @apiSuccess (Success) {JSON} updated user.
   */
  app.post('/api/user/update', function updateUserCallBack( req, res ) {
    logger.info('Inside post /api/user/update');
    var response = {
      success: false
    };

    if( (req.body.userId !== undefined && req.body.userId != '') ) {
      if(req.body.email != undefined && req.body.email != '') {
        models.User.findOne({
          where: { Email: {[OP.eq]: req.body.email} }
        }).then(user => {
          if( user == null || user.dataValues.UserId == req.body.userId ) {
            var file = req.files.userImage;
            if( file && file.size > 0 ) {
              var date = new Date();
              var timeStamp = Math.floor(date);
              try {
                var is = fs.createReadStream(req.files.userImage.path);
                var os = fs.createWriteStream( __dirname + config.imageFolderPath + timeStamp + req.files.userImage.name);

                is.pipe(os);

                is.on('end', function() {
                  // remove file
                  fs.unlinkSync(req.files.userImage.path);
                  models.User.update({
                    FirstName: req.body.fname,
                    LastName: req.body.lname,
                    Email: req.body.email,
                    Address: req.body.address,
                    MobileNumber: req.body.mobile,
                    UserImagePath: config.imageDbPath +timeStamp + req.files.userImage.name
                  },
                  {
                    where: {
                      UserId: {[OP.eq]: req.body.userId}
                    }
                  }).then(function(updatedUser){
                    models.User.findById(req.body.userId).then(function(updatedUser){
                      logger.info ( STRINGS.RESULT_SUCCESS );
                      response.success = true;
                      response.message = STRINGS.USER_UPDATE_SUCCESS;
                      response.data = updatedUser;
                      res.status( HTTP.OK ).jsonp( response );
                    })
                  }).catch(function(err){
                    logger.info ( STRINGS.IMAGE_UPLOAD_FAILED );
                    response.success = false;
                    response.data = err;
                    response.message = STRINGS.IMAGE_UPLOAD_FAILED;
                    res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );
                  })
                });
              } catch ( err ) {
                logger.info ( STRINGS.IMAGE_UPLOAD_FAILED );
                response.success = false;
                response.data = err;
                response.message = STRINGS.IMAGE_UPLOAD_FAILED;
                res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );
              }

            } else {
              models.User.update({
                FirstName: req.body.fname,
                LastName: req.body.lname,
                Email: req.body.email,
                Address: req.body.address,
                MobileNumber: req.body.mobile
              },
              {
                where: {
                  UserId: {[OP.eq]: req.body.userId}
                }
              }).then(function(users) {
                models.User.findById(req.body.userId).then(function(updatedUser){
                  logger.info ( STRINGS.RESULT_SUCCESS );
                  response.success = true;
                  response.message = STRINGS.USER_UPDATE_SUCCESS;
                  response.data = updatedUser;
                  res.status( HTTP.OK ).jsonp( response );
                }).catch(function(err){
                  console.log(err);
                  logger.info(STRINGS.RESULT_FAILED);
                  response.data = err;
                  response.message = STRINGS.ERROR_MESSAGE;
                  res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );
                })
              })
            }
          } else {
            logger.info(STRINGS.RESULT_FAILED);
            response.data = null;
            response.message = STRINGS.EMAIL_DUPLICATE;
            res.status( HTTP.OK ).jsonp( response );
          }
        }).catch(function(err) {
          logger.info(STRINGS.RESULT_FAILED);
          response.message = STRINGS.ERROR_MESSAGE;
          response.data = err
          res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );
        })
      } else {
        logger.info(STRINGS.RESULT_FAILED);
        response.data = null;
        response.message = STRINGS.EMAIL_NOT_EXIST;
        res.status( HTTP.BAD_REQUEST ).jsonp( response );
      }
            
    } else {
      logger.info(STRINGS.RESULT_FAILED);
      response.data = null;
      response.message = STRINGS.ACCESS_DENIED;
      res.status( HTTP.BAD_REQUEST ).jsonp( response );
    }
  });

  /**
   * @api {post}  /api/user/resetpassword  reset User password.
   * @apiName changePassword
   * @apiGroup User
   *
   * @apiSuccess (Success) {JSON} user.
   */
  app.post('/api/user/resetpassword', function changePasswordCallBack( req, res ) {
    
    logger.info('Inside post /api/user/resetpassword');
    var response = {
      success: false
    };

    if( (req.body.userId !== undefined && req.body.userId != '') ) {
      if((req.body.oldPassword !== undefined && req.body.oldPassword !== '') && (req.body.newPassword !== undefined && req.body.newPassword !== ''))  {
        if(req.body.newPassword === req.body.cpassword) {
          models.User.findOne({
            where: {$and: [{UserId: {[OP.eq]: req.body.userId}}]}
          }).then(user => {
            if(user !== null && user !== '') {
              bcrypt.compare(req.body.oldPassword,user.Password, function( error, success) {
                if ( !success ) {
                  logger.info ( STRINGS.RESULT_SUCCESS );
                  response.message = STRINGS.OLD_PASSWORD_INCORRECT;
                  response.data = error; 
                  res.status( HTTP.OK ).jsonp( response );

                } else {
                  var hash = bcrypt.hashSync(req.body.newPassword);
                  models.User.update({
                    Password: hash
                  },
                  {
                    where: {
                      UserId: {[OP.eq]: req.body.userId}
                    }
                  }).then(result => {
                      logger.info ( STRINGS.RESULT_SUCCESS );
                      response.success = true;
                      response.message = STRINGS.PASSWORD_CHANGE_SUCCESS;
                      response.data = user;
                      res.status( HTTP.OK ).jsonp( response );
                  }).catch(function(err) {
                    logger.info(STRINGS.RESULT_FAILED);
                    response.data = err;
                    response.message = STRINGS.ERROR_MESSAGE;
                    res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );
                  });
                }
              });
            }
          }).catch(function(err) {
            logger.info(STRINGS.RESULT_FAILED);
            response.data = err;
            response.message = STRINGS.ERROR_MESSAGE;
            res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );
          });
        } else {
          logger.info(STRINGS.RESULT_FAILED);
          response.data = null;
          response.message = STRINGS.PASSWORD_MIS_MATCH;
          res.status( HTTP.OK ).jsonp( response );
        }
      } else {
        logger.info(STRINGS.RESULT_FAILED);
        response.data = null;
        response.message = STRINGS.PASSWORD_EMPTY;
        res.status( HTTP.BAD_REQUEST ).jsonp( response );
      }
    } else {
      logger.info(STRINGS.RESULT_FAILED);
      response.data = null;
      response.message = STRINGS.ACCESS_DENIED;
      res.status( HTTP.BAD_REQUEST ).jsonp( response );
    }

  });

  /**
   * @api {post}  /api/signup  insert new User.
   * @apiName PostUser
   * @apiGroup User
   *
   * @params: req Request Object
   * @params: res Response Object
   *
   * @apiSuccess (Success) {JSON} new users.
   */
  app.post('/api/signup', function insertingUser( req , res ) {
    logger.info('Inside post /api/signup');

    var date = new Date();
    var response = {
      success: false
    };

    models.User.findOne({
      where: {$or: [{UserName: {[OP.eq]: req.body.username}}, {Email: {[OP.eq]: req.body.email}}]}
    }).then(function(user) {
      if(user === null) {
        if(req.body.password === req.body.cpassword) {
          var hash = bcrypt.hashSync(req.body.password);
          var picturePath = config.pictureUploadPath ;

          models.User.create({
            UserName: req.body.username,
            Password: hash,
            FirstName: req.body.fname,
            LastName: req.body.lname,
            Email: req.body.email,
            MobileNumber: req.body.phone,
            RealEstateCompanyId: 4,
            UserStatusId: 1,
            UserTypeId: 1,
          }).then(function ( user ){
            logger.info(STRINGS.RESULT_SUCCESS );
            response.success = true;
            response.message = STRINGS.USER_SIGN_UP_SUCCESS;
            response.data = user;
            res.status( HTTP.OK ).jsonp( response );
          }).catch(function(err) {
            logger.info(STRINGS.RESULT_FAILED);
            response.message = STRINGS.ERROR_MESSAGE;
            response.data = err
            res.status( HTTP.OK ).jsonp( response );
          });     
        } else {
          logger.info(STRINGS.PASSWORD_MIS_MATCH);
          response.message = STRINGS.PASSWORD_MIS_MATCH;
          response.data = null;
          res.status( HTTP.OK ).jsonp( response );
        }
      } else {
        logger.info(STRINGS.USER_NAME_EMAIL_EXIST);
        response.message = STRINGS.USER_NAME_EMAIL_EXIST;
        response.data = null;
        res.status( HTTP.OK ).jsonp( response );
      }

    }).catch(function(err){
      logger.info(STRINGS.RESULT_FAILED);
      response.message = STRINGS.ERROR_MESSAGE;
      response.data = err
      res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );

    });

  });

  /**
   * @api {post}  /api/login  login User.
   * @apiName PostUser
   * @apiGroup User
   *
   * @params: req Request Object
   * @params: res Response Object
   *
   * @apiSuccess (Success) {JSON} new users.
   */
  app.post('/api/login' , function loginCallBack ( req , res ){
    logger.info('Inside post /api/login.');
    var me = this;
    var response = {
      success: false
    };
    
    models.User.findOne({
      where: {$and: [{username: {[OP.eq]: req.body.username}}]}
    }).then(user => {
      if(user !== null && user !== '') {
        bcrypt.compare(req.body.password,user.Password, function( error, success) {
          if ( !success ) {
            logger.info ( STRINGS.RESULT_SUCCESS );
            response.message = STRINGS.PASSWORD_INCORRECT;
            response.data = error; 
            res.status( HTTP.OK ).jsonp( response );

          } else {
            logger.info ( STRINGS.RESULT_SUCCESS );
            response.success = true;
            response.message = STRINGS.LOG_IN_SUCCESS
            response.data = user;
            res.status( HTTP.OK ).jsonp( response );
          }
      
        });
      } else {
        logger.info ( STRINGS.RESULT_SUCCESS );
        response.message = STRINGS.PASSWORD_INCORRECT;
        response.data = null;
        res.status( HTTP.OK ).jsonp( response );
      }
        
      
    }).catch(function(err) {
      logger.info(STRINGS.RESULT_FAILED);
      response.message = STRINGS.ERROR_MESSAGE;
      response.data = err;
      res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );
   });
      

  });

 
}
