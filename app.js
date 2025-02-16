const express = require('express');

const app = express();

const teacherRoute = require('./routes/teacherRoutes')
app.use(express.json())

const db = require('./models');

// Sync all models with the database
//added if environment not test because unit tests cldnt run
if (process.env.NODE_ENV !== 'test'){
  db.sequelize.sync({ force: false })  // force: true will drop and recreate tables
  .then(() => {
    console.log("Database synchronized");
  })
  .catch(err => {
    console.error("Error synchronizing the database: ", err);
  });
}



app.use("/",teacherRoute);

module.exports = app;