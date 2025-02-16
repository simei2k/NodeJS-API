'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StudentTeacher extends Model {
    static associate(models) {
    }
  }
  StudentTeacher.init({
    teacher_email: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Teachers',
        key: 'email'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    student_email: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Students',
        key: 'email'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  }, {
    sequelize,
    modelName: 'StudentTeacher',
  });

  return StudentTeacher;
};
