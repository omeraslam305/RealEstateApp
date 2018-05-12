"use strict";

/**
 * Scehma of RealEstateCompanies.
 */
module.exports = function(sequelize, DataTypes) {

  var RealEstateCompanies = sequelize.define("RealEstateCompanies", {
    Id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    CompanyName: { type: DataTypes.STRING, allowNull: false, defaultValue: 0 }
  });

  RealEstateCompanies.associate = function (models) {
    RealEstateCompanies.hasMany(models.User);
  }
 
  return RealEstateCompanies;
};