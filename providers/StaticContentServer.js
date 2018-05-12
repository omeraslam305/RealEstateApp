contentServer = module.exports = {};

contentServer.setup = function( app ) {

  app.get('/', function(req,res) {
    console.log('iam ahere');
    console.log( __dirname+'/../Client/index.html');
    res.sendFile( __dirname+'/../Client/index.html');
  });


}