'use strict';
module.exports = (sequelize, DataTypes) => {
  
  var Users = sequelize.define('users', {
    id          : {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    workplaceId : DataTypes.STRING,
    email       : DataTypes.STRING,
  },
  {
    tableName:"users"
  });

  Users.associate = function(models) {
    // associations can be defined here
  };

  return Users;
};