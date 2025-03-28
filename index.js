const express = require('express');
const fs = require('fs'); // برای خواندن فایل
const app = express();
const port = 3000;

// خواندن لینک‌ها از فایل JSON
let links = [];

fs.readFile('links.json', 'utf8', (err, data) => {
    if (err) {
        console.log('Error reading the file:', err);
        return;
    }
    const jsonData = JSON.parse(data);
    links = jsonData.links; // لینک‌ها از فایل JSON بارگذاری می‌شوند
});

// مسیر API برای برگرداندن یک لینک تصادفی
app.get('/s', (req, res) => {
    if (links.length === 0) {
        return res.status(500).json({ error: "No links available" });
    }

    const randomIndex = Math.floor(Math.random() * links.length);
    res.json({ url: links[randomIndex] });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
