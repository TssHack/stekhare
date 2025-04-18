const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// خواندن لینک‌ها از فایل متنی به صورت غیرهمزمان
const loadLinks = () => {
  try {
    // خواندن محتوای فایل متنی
    const linksPath = path.join(__dirname, 'links.txt');
    const data = fs.readFileSync(linksPath, 'utf8');
    
    // جدا کردن لینک‌ها بر اساس خط
    const links = data.split('\n').map(link => link.trim()).filter(link => link.length > 0);
    
    return links;
  } catch (err) {
    console.error('Error reading the links file:', err);
    return [];
  }
};

// مسیر API برای برگرداندن یک لینک تصادفی
app.get('/s', (req, res) => {
  const links = loadLinks();
  
  // اگر لینک‌ها خالی بودند، ارور برمی‌گردانیم
  if (links.length === 0) {
    return res.status(500).json({ error: 'No links available.' });
  }

  const randomIndex = Math.floor(Math.random() * links.length);
  res.json({ 
    url: links[randomIndex],
    developer: 'Ehsan Fazli'  // اضافه کردن نام توسعه‌دهنده به خروجی
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
