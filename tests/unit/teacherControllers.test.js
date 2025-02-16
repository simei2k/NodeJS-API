const request = require('supertest'); 
const app = require('../../app'); 
const models = require("../../models");
const { seedTestData } = require('./studentteacherFixture');

describe('Retrieve Notification Function', () => {
  beforeAll(async () => {
    //insert data into database
    await seedTestData();
  });

  afterAll(async () => {
    // Clean up data after tests
    //need to destory teacherstudent first due to foreign key constraint
    try {
      await models.StudentTeacher.destroy({ where: {}, truncate: true });
      await models.Student.destroy({ where: {}, truncate: true });
      await models.Teacher.destroy({ where: {}, truncate: true });
    } catch (error) {
      console.error('Error during truncation:', error);
    }
    await models.sequelize.close();

  });

  it('should return a list of students who are not suspended', async () => {
    const response = await request(app)
      .post('/retrievefornotifications')
      .send({ 
        teacher: 'teacherken@gmail.com', 
        notification: 'Hello @onlyteacherjohnstudent@gmail.com@onlyteacherkenstudent@gmail.com' 
    });

    expect(response.status).toBe(200);
    expect(response.body.receipients).toEqual(["commonstudent1@gmail.com","commonstudent2@gmail.com","onlyteacherkenstudent@gmail.com","onlyteacherjohnstudent@gmail.com"]);
  });

  it('should ignore suspended students', async () => {
    // Mark student as suspended for the test
    const student = await models.Student.findOne({ where: { email: 'studentwhogetsuspended@gmail.com' } });
    await student.update({ is_suspended: true });

    const response = await request(app)
      .post('/retrievefornotifications')
      .send({ 
        teacher: 'teacherken@gmail.com', 
        notification: 'Hello @onlyteacherjohnstudent@gmail.com@onlyteacherkenstudent@gmail.com'     });

    expect(response.status).toBe(200);
    expect(response.body.receipients).not.toContain('studentwhogetsuspended@gmail.com');
  });
});
