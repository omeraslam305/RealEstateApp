"use strict";

/**
 * Scehma of UserMessage.
 */
module.exports = function(sequelize, DataTypes) {

  var UserMessage = sequelize.define("UserMessage", {
    Id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    MessageText: { type: DataTypes.TEXT, allowNull: false },
    MsgStatus: { type: DataTypes.INTEGER },
    ConversationID: { type: DataTypes.INTEGER }
  });
  
  UserMessage.associate = function (models) {
  	UserMessage.belongsTo(models.User);
  }
 
  return UserMessage;
};