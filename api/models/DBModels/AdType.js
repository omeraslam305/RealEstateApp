"use strict";

/**
 * Scehma of AdType.
 */
module.exports = function(sequelize, DataTypes) {

  var AdType = sequelize.define("AdType", {
    Id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    AdTypeName: { type: DataTypes.STRING, allowNull: false }
  });

  AdType.associate = function (models) {
    AdType.hasMany(models.RealEstateAd);
  }
 
  return AdType;
};