'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsToMany(models.Teacher,{
        through: 'StudentTeacher',
        foreignKey: 'student_email'
      })
    }
  }
  Student.init({
    email: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    is_suspended: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};