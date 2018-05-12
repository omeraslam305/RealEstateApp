"use strict";

/**
 * Scehma of FavouriteAds.
 */
module.exports = function(sequelize, DataTypes) {

  var FavouriteAds = sequelize.define("FavouriteAds", {
    Id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true }
  });

  FavouriteAds.associate = function (models) {
    FavouriteAds.belongsTo(models.RealEstateAd);
    FavouriteAds.belongsTo(models.User);
  }

  return FavouriteAds;
};