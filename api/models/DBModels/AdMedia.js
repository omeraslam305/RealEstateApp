"use strict";

/**
 * Scehma of AdMedia.
 */
module.exports = function(sequelize, DataTypes) {

  var AdMedia = sequelize.define("AdMedia", {
    Id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    ImagePath: { type: DataTypes.STRING, allowNull: false }
  });

  return AdMedia;
};