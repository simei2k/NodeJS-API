const { Student, Teacher, StudentTeacher } = require('../../models');

// Sample data to be used in tests
async function seedTestData() {
  try {
    //upsert instead of create to check whether the data exists before creating
    await Teacher.upsert({ email: 'teacherken@gmail.com' });
    await Teacher.upsert({ email: 'teacherjohn@gmail.com' });
    await Student.upsert({ email: 'commonstudent1@gmail.com', is_suspended: false });
    await Student.upsert({ email: 'commonstudent2@gmail.com', is_suspended: false });
    await Student.upsert({ email: 'onlyteacherkenstudent@gmail.com', is_suspended: false });
    await Student.upsert({ email: 'onlyteacherjohnstudent@gmail.com', is_suspended: false });
    await Student.upsert({ email: 'studentwhogetsuspended@gmail.com', is_suspended: true });
    await StudentTeacher.create({teacher_email:'teacherken@gmail.com',student_email:'commonstudent1@gmail.com'});
    await StudentTeacher.create({teacher_email:'teacherken@gmail.com',student_email:'commonstudent2@gmail.com'});
    await StudentTeacher.create({teacher_email:'teacherken@gmail.com',student_email:'onlyteacherkenstudent@gmail.com'});
    await StudentTeacher.create({teacher_email:'teacherken@gmail.com',student_email:'studentwhogetsuspended@gmail.com'});
    await StudentTeacher.create({teacher_email:'teacherjohn@gmail.com',student_email:'onlyteacherjohnstudent@gmail.com'});
    await StudentTeacher.create({teacher_email:'teacherjohn@gmail.com',student_email:'commonstudent2@gmail.com'});
    await StudentTeacher.create({teacher_email:'teacherjohn@gmail.com',student_email:'commonstudent1@gmail.com'});
  } 
  catch (error) {
    console.error('Error seeding test data:', error);
  }
} 

module.exports = { seedTestData };
