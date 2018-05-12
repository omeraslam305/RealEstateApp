/**
 * @author Copyright Abdul-Bari.
 */

var config = {}

// Application Information
config.app = {}
config.app.mode = {}
config.app.user = {}
config.app.errorUrl   = '/error';
config.app.mode.DEVELOPMENT = 'development';
config.app.mode.PRODUCTION = 'production';
config.app.mode.current = config.app.mode.DEVELOPMENT;

//server base URL
config.baseUrl = (config.app.mode.current == config.app.mode.DEVELOPMENT ) ? '/' : '/fa17g19/';

// Log files
config.logger = {}
config.logger.errorFile = __dirname + '/logs/error.log';
config.logger.consoleFile = __dirname + '/logs/console.log';
config.logger.maxFileSize = 1000000;
config.logger.maxFiles = 1;


config.bodyParserLimit = '100mb';
config.imageFileSize = 104857600; // Image Size : 100 * 1024 * 1024
config.displayPictureUploadPath = '';
config.pictureUploadPath = '/default.jpg';
config.getMostFollowedListsCount = 5;
config.getMostLikedListCount = 10;


config.dbPath = ( config.app.mode.current == config.app.mode.DEVELOPMENT) ? 'mysql://root@localhost:3306/fa17g19' : 'mysql://root@localhost:3306/fa17g19';
config.db = {}
config.db.host = config.dbPath;

config.imageFolderPath = '/../../Client/images/';
config.imageDbPath = 'images/';
config.defaultHomeImage = 'home-default.jpg';
module.exports = config;