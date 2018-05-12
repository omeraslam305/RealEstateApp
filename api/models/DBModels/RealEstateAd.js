"use strict";

/**
 * Scehma of RealEstateAds.
 */
module.exports = function(sequelize, DataTypes) {

  var RealEstateAd = sequelize.define("RealEstateAd", {
    ID: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    AgentId: { type: DataTypes.INTEGER },
    BedRooms: { type: DataTypes.INTEGER },
    BathRooms: { type: DataTypes.INTEGER },
    Kitchen: { type: DataTypes.INTEGER },
    LivingRooms: { type: DataTypes.INTEGER },
    SquareFeet: { type: DataTypes.INTEGER },
    Price: { type: DataTypes.FLOAT },
    Address: { type: DataTypes.TEXT },
    Zip: { type: DataTypes.INTEGER },
    State: { type: DataTypes.STRING },
    City: { type: DataTypes.STRING },
    AdDescription: { type: DataTypes.TEXT },
    Parking: { type: DataTypes.INTEGER },
    NumOfFloors: { type: DataTypes.INTEGER },
    LotArea: { type: DataTypes.FLOAT },
    Title: { type: DataTypes.STRING },
    Latitude: { type: DataTypes.STRING },
    Longitude: { type: DataTypes.STRING }
  });

  RealEstateAd.associate = function (models) {
    RealEstateAd.hasMany(models.AdMedia);
    RealEstateAd.hasMany(models.FavouriteAds);
    RealEstateAd.belongsTo(models.AdType);
    RealEstateAd.belongsTo(models.AdStatus);
    RealEstateAd.belongsTo(models.RealEstateCategory);
  }
 
  return RealEstateAd;
};