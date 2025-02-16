module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StudentTeacher', {
      teacher_email: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Teachers',
          key: 'email'  // Reference the email column
        },
        onDelete: 'CASCADE'
      },
      student_email: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Students',
          key: 'email'  // Reference the email column
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('StudentTeacher');
  }
};
