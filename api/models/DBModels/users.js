"use strict";

/**
 * Scehma of Users.
 */
module.exports = function(sequelize, DataTypes) {

  var User = sequelize.define("User", {
    UserId: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    UserName: { type: DataTypes.STRING, allowNull: false },
    Password: { type: DataTypes.STRING, allowNull: false },
    FirstName: { type: DataTypes.STRING, allowNull: false },
    LastName: { type: DataTypes.STRING, allowNull: false },
    Email: { type: DataTypes.STRING, allowNull: false },
    Address: { type: DataTypes.TEXT },
    MobileNumber: { type: DataTypes.STRING },
    UserImagePath: { type: DataTypes.STRING, defaultValue: '/images/default.jpg' }
  });

 
  User.associate = function (models) {
    User.hasMany(models.UserMessage, {foreignKey: 'SenderID'});
    User.hasMany(models.UserMessage, {foreignKey: 'ReceiverID'});
    User.belongsTo(models.RealEstateCompanies);
  }

  return User;
};