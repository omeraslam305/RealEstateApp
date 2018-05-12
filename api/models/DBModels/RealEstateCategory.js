"use strict";

/**
 * Scehma of RealEstateCategory.
 */
module.exports = function(sequelize, DataTypes) {

  var RealEstateCategory = sequelize.define("RealEstateCategory", {
    Id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    CategoryName: { type: DataTypes.STRING, allowNull: false }
  });

  RealEstateCategory.associate = function (models) {
    RealEstateCategory.hasMany(models.RealEstateAd);
  }
 
  return RealEstateCategory;
};