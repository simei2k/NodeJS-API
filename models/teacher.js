'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Teacher.belongsToMany(models.Student,{
        through: 'StudentTeacher',
        foreignKey: 'teacher_email'
      })
    }
  }
  Teacher.init({
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    }
  }, {
    sequelize,
    modelName: 'Teacher',
  });
  return Teacher;
};