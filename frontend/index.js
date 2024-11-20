const express = require('express');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const upload = multer();

app.post('/submit', upload.array('files'), async (req, res) => {
    const { query } = req.body;
    const files = req.files;

    const formData = new FormData();
    formData.append('query', query);

    files.forEach((file, index) => {
        formData.append(`files[${index}]`, file.buffer, file.originalname);
    });

    try {
        const response = await axios.post('http://localhost:8080/api/process-pdfs', formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
            },
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Frontend server running on http://localhost:3000');
});