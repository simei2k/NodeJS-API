const express = require('express');

const app = express();


const teacherRoute = require('./routes/teacherRoutes')
app.use(express.json())

app.use("/posts",teacherRoute)

module.exports = app;