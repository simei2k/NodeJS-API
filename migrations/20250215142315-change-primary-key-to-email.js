'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the 'id' column
    await queryInterface.removeColumn('Teachers', 'id');
    await queryInterface.removeColumn('Students', 'id');

    // Change email to be the primary key
    await queryInterface.changeColumn('Teachers', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true  // Set email as primary key
    });

    await queryInterface.changeColumn('Students', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true  // Set email as primary key
    });
  },

  down: async (queryInterface, Sequelize) => {
    // In case of rollback, add 'id' back as the primary key
    await queryInterface.addColumn('Teachers', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    });

    await queryInterface.addColumn('Students', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    });
  }
};
