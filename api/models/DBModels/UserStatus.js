"use strict";

/**
 * Scehma of UserStatus.
 */
module.exports = function(sequelize, DataTypes) {

  var UserStatus = sequelize.define("UserStatus", {
    Id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    statusName: { type: DataTypes.STRING, allowNull: false }
  });

  UserStatus.associate = function (models) {
    UserStatus.hasMany(models.User);
  }
 
  return UserStatus;
};