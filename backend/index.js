const express = require('express');
const cors = require('cors');
const resumeRouter = require('./routes/resume');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // optional

app.use('/api/resume', resumeRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));