"use strict";

/**
 * Scehma of UserType.
 */
module.exports = function(sequelize, DataTypes) {

  var UserType = sequelize.define("UserType", {
    Id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    UserTypeName: { type: DataTypes.STRING, allowNull: false }
  });

  UserType.associate = function (models) {
    UserType.hasMany(models.User);
  }
 
  return UserType;
};