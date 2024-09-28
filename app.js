const express = require('express');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(express.json());

app.use('/api', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { 
    console.log(`Server is running on port ${PORT}`);
});
