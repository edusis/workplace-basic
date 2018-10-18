'use strict';
module.exports = (sequelize, DataTypes) => {
  
  var Users = sequelize.define('users', {
    id          : DataTypes.INTEGER,
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