const request = require('supertest'); 
const app = require('../../app'); 
const models = require("../../models");
const { seedTestData } = require('./studentteacherFixture');

describe('POST /register', () => {
  beforeEach(async () => {
    //detroy all records before running tet
    //disable foreign key checks if not wont be unable to delete table
    await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await models.StudentTeacher.destroy({ where: {}, truncate: true });
    await models.Student.destroy({ where: {}, truncate: true });
    await models.Teacher.destroy({ where: {}, truncate: true });
  });

  it('should register multiple students to a teacher', async () => {
    const teacherEmail = 'teacherken@gmail.com';
    const students = ['student1@gmail.com', 'student2@gmail.com'];

    const response = await request(app)
      .post('/register')
      .send({ teacher: teacherEmail, students: students })
    expect(response.status).toBe(204);

    const studentTeacherRecords = await models.StudentTeacher.findAll({
      where: { teacher_email: teacherEmail },
    });

    expect(studentTeacherRecords.length).toBe(2);
    expect(studentTeacherRecords[0].student_email).toBe(students[0]);
    expect(studentTeacherRecords[1].student_email).toBe(students[1]);
  });
});

describe('GET /commonstudents', () => {
  beforeEach(async () => {
    await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await models.StudentTeacher.destroy({ where: {}, truncate: true });    
    await models.Student.destroy({ where: {}, truncate: true });
    await models.Teacher.destroy({ where: {}, truncate: true });
  });

  it('should retrieve a list of students common to a given teacher', async () => {
    const teacherEmail = 'teacherken@gmail.com';
    const studentEmails = ['student1@gmail.com', 'student2@gmail.com'];

    await models.Teacher.create({ email: teacherEmail });
    for (let studentEmail of studentEmails) {
      await models.Student.create({ email: studentEmail, is_suspended: false });
      await models.StudentTeacher.create({
        teacher_email: teacherEmail,
        student_email: studentEmail,
      });
    }

    const response = await request(app)
      .get('/commonstudents')
      .query({ teacher: teacherEmail });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(studentEmails));
  });

  it('should retrieve students common to two teachers', async () => {
    const teacherEmails = ['teacherken@gmail.com', 'teacherjoe@gmail.com'];
    const studentEmails = ['student1@gmail.com', 'student2@gmail.com'];

    // Create teachers and students
    for (let teacherEmail of teacherEmails) {
      await models.Teacher.create({ email: teacherEmail });
    }
    for (let studentEmail of studentEmails) {
      await models.Student.create({ email: studentEmail, is_suspended: false });
    }

    // Register students to both teachers
    for (let studentEmail of studentEmails) {
      await models.StudentTeacher.create({
        teacher_email: teacherEmails[0],
        student_email: studentEmail,
      });
      await models.StudentTeacher.create({
        teacher_email: teacherEmails[1],
        student_email: studentEmail,
      });
    }

    const response = await request(app)
      .get('/commonstudents')
      .query({ teacher: teacherEmails[0], teacher: teacherEmails[1] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(studentEmails));
  });
});


describe('POST /suspend', () => {
  beforeEach(async () => {
    await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await models.StudentTeacher.destroy({ where: {}, truncate: true });    
    await models.Student.destroy({ where: {}, truncate: true });
    await models.Teacher.destroy({ where: {}, truncate: true });
  });

  it('should suspend a specified student', async () => {
    await models.Student.upsert({ email: 'studentwhogetsuspended@gmail.com', is_suspended: false });
    const studentEmail = 'studentwhogetsuspended@gmail.com';


    const response = await request(app)
      .post('/suspend')
      .send({ student: studentEmail })

    expect(response.status).toBe(204);

    const studentRecord = await models.Student.findOne({
      where: { email: studentEmail },
    });

    expect(studentRecord.is_suspended).toBe(true);
  });
});

describe('Retrieve Notification Function', () => {
  beforeAll(async () => {
    await models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
    await models.StudentTeacher.destroy({ where: {}, truncate: true });    
    await models.Student.destroy({ where: {}, truncate: true });
    await models.Teacher.destroy({ where: {}, truncate: true });
    //insert data into database
    await seedTestData();
  });

  afterAll(async () => {
    // Clean up data after tests
    //need to destory teacherstudent first due to foreign key constraint
    try {
      await models.StudentTeacher.destroy({ where: {} });
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
