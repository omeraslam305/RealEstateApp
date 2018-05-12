  "use strict";

  /**
   * Scehma of AdStatus.
   */
  module.exports = function(sequelize, DataTypes) {

    var AdStatus = sequelize.define("AdStatus", {
      Id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      AdStatusName: { type: DataTypes.STRING, allowNull: false }
    });

    AdStatus.associate = function (models) {
      AdStatus.hasMany(models.RealEstateAd);
    }
   
    return AdStatus;
  };