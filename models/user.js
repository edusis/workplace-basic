'use strict';
module.exports = (sequelize, DataTypes) => {
  
  var Producto = sequelize.define('Producto', {
    categoria  : DataTypes.STRING,
    imagen_url : DataTypes.STRING,
    site_url   : DataTypes.STRING,
    precio     : DataTypes.DECIMAL,
    descripcion: DataTypes.STRING
  },
  {
    tableName:"productos"
  });

  Producto.associate = function(models) {
    // associations can be defined here
  };

  return Producto;
};