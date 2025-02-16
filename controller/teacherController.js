const models = require("../models");


async function register(req,res){
    try{
        const {teacher,students} = req.body;

        const teacherRecord = await models.Teacher.findByPk(teacher);

        if (!teacherRecord){
            return res.status(404).json({
                message: "Teacher not found"
            });
        }
        for (let student of students){
                let studentRecord = await models.Student.findByPk(student);
                
                if (!studentRecord){
                    studentRecord = await models.Student.create({
                        email: student,
                        is_suspended: false,
                    });
                }
                
                await models.StudentTeacher.create({
                    teacher_email: teacher,
                    student_email: student,
                })
                
            }
            return res.status(204);
            }
            
            
        catch (error) {
            return res.status(500).json({
              message: "Error occurred while registering teacher and students",
              error: error.message
        });
    }

}

async function commonStudents(req, res) {
    const common_students = [];
    try {
        const teachers = req.query.teacher;  
        //1. check whether the query is multiple teacher or a single teacher
        //2. if it is multiple teachers
        if (Array.isArray(teachers)) {
            //3. find the list of students of the first teacher
            const studentsOfFirstTeacher = await models.StudentTeacher.findAll({
                where: { teacher_email: teachers[0] },
                attributes: ['student_email'],
            });

            // 4. convert the students to an array of common students
            let common_students = studentsOfFirstTeacher.map(entry => entry.student_email);


            //5. loop through the other teachers in the query
            for (let i = 1; i < teachers.length; i++) {
                // 6. Get students of the current teacher
                const studentsOfTeacher = await models.StudentTeacher.findAll({
                    where: { teacher_email: teachers[i] },
                    attributes: ['student_email'],
                });


                // 7. get the students from the teachers list
                const studentsOfTeacherEmails = studentsOfTeacher.map(entry => entry.student_email);

                //8. filter common students to only include students whose email is present 
                //in the current teacher's array 
                common_students = common_students.filter(studentEmail =>
                    studentsOfTeacherEmails.includes(studentEmail)
                );


                //9. check number of students in commonstudent array, if no stduent
                if (common_students.length === 0) {
                    return res.status(200).json({ message: "No common students found" });
                }
            }

            return res.status(200).json({ common_students });

        }
        // 10. Case when there is only one teacher
        else {
            const studentsOfTeacher = await models.StudentTeacher.findAll({
                where: { teacher_email: teachers },
                attributes: ['student_email'],
            });

            //11. extracts the student_email from model instance and add it into the array
            const common_students = studentsOfTeacher.map(entry => entry.student_email);
            return res.status(200).json({ common_students });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while retrieving common students",
            error: error.message
        });
    }
}

async function suspend(req, res){
    try{
        const student = req.body;
        if (student) {
            const db_student = await models.Student.findByPk(student.student);
            if (db_student) {
                await db_student.update({ is_suspended: true });
                return res.status(204).json(); // Student suspended successfully
            } else {
                return res.status(404).json({
                    message: "Student not found"
                });
            }
        } 
        else{
            return res.status(400).json({
                message: "No student data provided"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred while suspending student",
            error: error.message
        });
    }
}

async function retrievefornotifications(req,res){
    //1. get the list of students under the teacher
    //2. check whether students are suspended
    //3. add it to the list to be returned
    //4. notification processing
    //5. retrieve students mentioned in the list
    //6. check whether student is suspended, if yes ignore
    //7. if not suspended add to the list
    try {
        const {teacher, notification} = req.body;
        const students_sent_to = [];
        
        //step 1
        const current_students = await models.StudentTeacher.findAll({
            where: {teacher_email: teacher}
        });
        for (let student of current_students){
            //step 2
            const studentRecord = await models.Student.findByPk(student.student_email);
            //step 3
            if (studentRecord && !studentRecord.is_suspended){
                if(!students_sent_to.includes(studentRecord.email)){
                    students_sent_to.push(studentRecord.email);
                }
            }
        }
        //step 4 - process notification, step 5
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        //find all emails in the string
        const emails = notification.match(emailRegex);
        for (email of emails){
            studentRecord = await models.Student.findByPk(email);
            //step 6, step 7
            if (!studentRecord.is_suspended){
                if(!students_sent_to.includes(studentRecord.email)){
                    students_sent_to.push(studentRecord.email);
                }
               
            }
        }
        return res.status(200).json({
            receipients: students_sent_to,
        });
    }
    catch(error){
        return res.status(500).json({
            message: "Error occurred while retrieving students notifications are sent to ",
            error: error.message
        });
    }
    
}

module.exports = {
    register: register,
    commonStudents: commonStudents,
    suspend: suspend,
    retrievefornotifications:retrievefornotifications,
}