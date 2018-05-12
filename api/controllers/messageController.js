"use strict";

/**
 * @author Copyright Saud Bin Habib
 */



const fs = require('fs');

var admin = require("firebase-admin");

// var serviceAccount = require("C:/Users/Omer/Documents/Backup/realState/fir-demo-91215-firebase-adminsdk-a6o1o-de8b67103d.json");
//console.log(__dirname + '../../fir-demo-91215-firebase-adminsdk-a6o1o-de8b67103d.json');
var serviceAccount = require( __dirname + '/../../fir-demo-91215-firebase-adminsdk-a6o1o-de8b67103d.json' );

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-demo-91215.firebaseio.com"
});

var registrationToken = 'epvAF80ph-A:APA91bHDAVtgtOJHV_mhKP4brmZS_8Kv2h2p1rxEmzoQyTH2KQMhjg0EeMs-lz-KRj1cfz9vk22m9P_v4xmh1HCwZHm481jtrucOseiaTFGWdLtA9_Sivyb7DTmFL__D8oUUHimv_sFy';

var message = module.exports = {};

message.setup = function user(app, logger, STRINGS, HTTP, models, http, request, bcrypt, config, OP , nodemailer) {


  /**
   * @api {post}  /api/referListing  Refer Listing.
   * @apiName referListing
   * @apiGroup MessageController
   *
   * @apiSuccess (Success) {JSON} new users.
   */
  app.post('/api/referListing', function InsertUserCallback( req, res ) {
    logger.info('Inside post /api/messageController');
    var response = {
      success: false
    };
    
    var transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
            user: 'omer.aslamteam@gmail.com',
            pass: 'omerAslam12'
        }
    });
    
    const mailOptions = {
      from: 'Group 15 & 19 <omer.aslamteam@gmail.com>', 
      to: req.body.email,
      subject: req.body.subject,
      html: "<p> Mr "+ req.body.name+" refer this property to you <br> This is a perfect house for purchasing. Feel free to contact with the Agent. <br> <br> For Checking the Property please <a href='" + req.body.url + "'> Click here </a> </p>"
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if(err){
        console.log(err);
        logger.info(STRINGS.RESULT_FAILED);
        response.success = false;
        response.message = STRINGS.ERROR_MESSAGE;
        response.data = err;
        res.status( HTTP.OK ).jsonp( response );
      }else{ 
        logger.info ( STRINGS.RESULT_SUCCESS );
        response.success = true;
        response.message = STRINGS.USER_MESSAGE_SEND;
        response.data = info;
        res.status( HTTP.OK ).jsonp( response );
      }    
    });  
  });

  /**
   * @api {Post}  /api/PostMessage  Send Message.
   * @apiName PostMessage
   * @apiGroup messageController
   *
   * @apiSuccess (Success) {JSON} messages.
  */
  app.post('/api/PostMessage', function insertingMessage( req , res ) {
    logger.info('Inside post /api/postMessage');
    var me = this;
    var response = {
      success: false
    };
    models.UserMessage.findOne({
      where: {
        [OP.or]: [{
          [OP.and]: [
            { SenderID: req.body.senderId },
            { ReceiverID: req.body.receiverId }
          ]},
          {[OP.and]: [
            { ReceiverID: req.body.senderId },
            { SenderID: req.body.receiverId }
          ]
        }]
      }
    }).then(message => {
        if(message !== null && message !== '') {
          models.UserMessage.create({
            MessageText: req.body.msgTxt,
            MsgStatus: 0,
            ConversationID: message.ConversationID,
            SenderID: req.body.senderId,
            ReceiverID: req.body.receiverId, 
          }).then(function ( message ){

             models.sequelize.query("Select concat(u1.FirstName, ' ', u1.LastName) as SenderName, (SELECT concat(u2.FirstName, ' ', u2.LastName)  FROM `fa17g19`.`users` as u2 where u2.UserId = "+ req.body.receiverId +") as ReceiverName FROM `fa17g19`.`users` as u1 where u1.UserId = " + req.body.senderId, 
            { type: models.sequelize.QueryTypes.SELECT}).then(usersname => {    
              if(usersname !== null && usersname !== '') {
                // console.log(message.ConversationID);
                console.log("usersname: " + usersname[0].ReceiverName + ", " + usersname[0].SenderName);
                logger.info ( STRINGS.RESULT_SUCCESS );

                console.log("now sending push notification")
                var payload = {
                  notification: {
                    title: 'New message from Homies',
                    body: message.MessageText
                  },
                  data : {
                    ReceiverId : req.body.receiverId.toString(),
                    ReceiverName : usersname[0].ReceiverName,
                    SenderId : req.body.senderId.toString(),
                    SenderName : usersname[0].SenderName,
                    ConId : message.ConversationID.toString()
                  }
                };

                var options = {
                  priority: "high",
                  timeToLivë: 60*60*24
                };

                admin.messaging().sendToDevice(registrationToken,payload,options)
                  .then(function(response){
                    console.log("Firebase Message sent successfully: " + response);
                  })
                  .catch(function(error){
                    console.log("Firebase Error: " + error);
                  });

                console.log("FB message end");
                
                     
              } else {
                logger.info ( STRINGS.RESULT_SUCCESS );
                
              }
            }).catch(function(err) {
              console.log(err);
              logger.info(STRINGS.RESULT_FAILED);
              
            });


            // console.log("now sending push notification")
            // var payload = {
            //   notification: {
            //     title: 'New message from Homies',
            //     body: message.MessageText
            //   },
            //   data : {
            //     ReceiverId : req.body.receiverId,
            //     SenderId : req.body.senderId,
            //     ConId : message.ConversationID.toString()
            //   }
            // };

            // var options = {
            //   priority: "high",
            //   timeToLivë: 60*60*24
            // };

            // admin.messaging().sendToDevice(registrationToken,payload,options)
            //   .then(function(response){
            //     console.log("Firebase Message sent successfully: " + response);
            //   })
            //   .catch(function(error){
            //     console.log("Firebase Error: " + error);
            //   });

            // console.log("FB message end");

            logger.info(STRINGS.RESULT_SUCCESS );
            response.success = true;
            response.message = STRINGS.USER_MESSAGE_SEND;
            response.data = message;
            res.status( HTTP.OK ).jsonp( response );
          }).catch(function(err) {
            logger.info(STRINGS.RESULT_FAILED);
            response.message = STRINGS.ERROR_MESSAGE;
            response.data = err
            res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );
          });
        } else {
      models.UserMessage.max('ConversationID').then(max => {  
        var conId ;
        if ( isNaN(parseInt(max)) ) {
          conId = 1;
        } else {
          conId = parseInt(max) + 1;
        }
        models.UserMessage.create({
              MessageText: req.body.msgTxt,
              MsgStatus: 0,
              ConversationID: conId,
              SenderID: req.body.senderId,
              ReceiverID: req.body.receiverId, 
            }).then(function ( message ){
              logger.info(STRINGS.RESULT_SUCCESS );
              response.success = true;
              response.message = STRINGS.USER_MESSAGE_SEND;
              response.data = message;
              res.status( HTTP.OK ).jsonp( response );
            }).catch(function(err) {
              logger.info(STRINGS.RESULT_FAILED);
              response.message = STRINGS.ERROR_MESSAGE;
              response.data = err
              res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );
            });
      });
        }  
      }).catch(function(err) {
        logger.info(STRINGS.RESULT_FAILED);
        response.message = STRINGS.ERROR_MESSAGE;
        response.data = err;
        res.status( HTTP.INTERNAL_SERVER_ERROR ).jsonp( response );
     });
    });


  /**
    * @api {get}  /api/GetAllMessages  Get All messages.
    * @apiName GetAllMessages
    * @apiGroup messageController
    *
    * @apiSuccess (Success) {JSON} messages.
  */
   
  app.get('/api/GetAllMessages', function getUserCallback( req, res ) {
    logger.info('Inside get /api/GetAllMessages');

    var me = this;
    console.log(req.query.conversationID);
    var response = {
      success: false
    };

    models.sequelize.query("SELECT m.Id, m.MessageText, m.ConversationID, DATE_FORMAT(m.createdAt, '%D %b, %y %h:%i') as MsgDate, m.SenderID, concat(u1.FirstName, ' ', u1.LastName) as SenderName, m.ReceiverID, concat(u2.FirstName, ' ', u2.LastName) as ReceiverName,    m.MsgStatus, u1.UserImagePath as SenderImage, u2.UserImagePath as ReceiverImage FROM `fa17g19`.`UserMessages` as m inner join `fa17g19`.`Users` as u1 on u1.UserId = m.SenderId inner join `fa17g19`.`Users` as u2 on u2.UserId = m.ReceiverId where m.ConversationID = " + req.query.conversationID + " order by m.createdAt asc;", 
    { type: models.sequelize.QueryTypes.SELECT}).then(message => {    
      if(message !== null && message !== '') {
        // console.log(message.ConversationID);
        logger.info ( STRINGS.RESULT_SUCCESS );
        response.success = true;
        response.message = STRINGS.USER_MESSAGE_RETEREIVE
        response.data = message;
        res.status( HTTP.OK ).jsonp( response );
             
      } else {
        logger.info ( STRINGS.RESULT_SUCCESS );
        response.message = STRINGS.PASSWORD_INCORRECT;
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
  * @api {get}  /api/GetAllConversastions  Get All Conversations.
  * @apiName GetAllConversastions
  * @apiGroup messageController
  *
  * @apiSuccess (Success) {JSON} messages.
*/

app.get('/api/GetAllConversations', function getUserCallback( req, res ) {
    logger.info('Inside get /api/GetAllConversations');
    var me = this;
    var response = {
      success: false
    };
    // models.sequelize.query(" SELECT M.Id, M.ConversationID, M.SenderID, M.ReceiverID,DATE_FORMAT(M.createdAt, '%D %b, %y %h:%i') as MsgDate, M.MessageText, concat(u1.FirstName, ' ', u1.LastName) as ReceiverName, concat(u2.FirstName, ' ', u2.LastName) as SendererName, u2.UserImagePath as image FROM `fa17g19`.`usermessages` as M inner join `fa17g19`.`users` as u1 on u1.UserId = m.ReceiverId inner join `fa17g19`.`users` as u2 on u2.UserId = m.SenderId INNER JOIN (SELECT SenderID, max(Id) as maxId FROM `fa17g19`.`usermessages` WHERE ReceiverID = " + req.query.receiverID + " GROUP BY SenderID)T ON M.Id = T.maxId order by M.createdAt desc;" , 
    models.sequelize.query("Select M.Id, M.ConversationID, M.SenderID, M.ReceiverID,DATE_FORMAT(M.createdAt, '%D %b, %y %h:%i') as MsgDate, M.MessageText, concat(u1.FirstName, ' ', u1.LastName) as ReceiverName, concat(u2.FirstName, ' ', u2.LastName) as SendererName, u2.UserImagePath as SenderImage , u1.UserImagePath as ReceiverImage from `fa17g19`.`UserMessages` as M inner join `fa17g19`.`Users` as u1 on u1.UserId = M.ReceiverID inner join `fa17g19`.`Users` as u2 on u2.UserId = M.SenderID where Id in (Select t1.MsgId from (SELECT ConversationID, max(Id) as MsgId FROM `fa17g19`.`UserMessages` where SenderID = " + req.query.receiverID + " or ReceiverID = " + req.query.receiverID + " group by ConversationID) as t1) order by M.createdAt desc;" , 
    { type: models.sequelize.QueryTypes.SELECT}).then(message => {    
      
      if(message !== null && message !== '') {
        logger.info ( STRINGS.RESULT_SUCCESS );
        response.success = true;
        response.message = STRINGS.USER_MESSAGE_RETEREIVE
        response.data = message;
        res.status( HTTP.OK ).jsonp( response );       
      } else {
        logger.info ( STRINGS.RESULT_SUCCESS );
        response.message = STRINGS.USER_MESSAGE_NOT_EXIST;
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