const express = require('express');
const fs = require('fs');
const axios = require('axios'); // برای ارسال درخواست HTTP
const app = express();
const port = 3000;

// خواندن لینک‌ها از فایل متنی به صورت غیرهمزمان
const loadLinks = () => {
  try {
    // خواندن محتوای فایل متنی
    const data = fs.readFileSync('links.txt', 'utf8');
    
    // جدا کردن لینک‌ها بر اساس خط
    const links = data.split('\n').map(link => link.trim()).filter(link => link.length > 0);
    
    return links;
  } catch (err) {
    console.error('Error reading the links file:', err);
    return [];
  }
};

// بررسی اینکه آیا لینک حاوی تصویر است
const isImageLink = async (url) => {
  try {
    const response = await axios.head(url); // استفاده از درخواست HEAD برای گرفتن متادیتای فایل
    const contentType = response.headers['content-type'];
    return contentType && contentType.startsWith('image/');
  } catch (err) {
    console.error('Error checking image URL:', err);
    return false;
  }
};

// مسیر API برای برگرداندن یک لینک تصادفی
app.get('/s', async (req, res) => {
  const links = loadLinks();
  
  // اگر لینک‌ها خالی بودند، ارور برمی‌گردانیم
  if (links.length === 0) {
    return res.status(500).json({ error: 'No links available.' });
  }

  let selectedLink = '';
  let isImage = false;

  // تلاش برای یافتن لینک تصویری
  for (let i = 0; i < links.length; i++) {
    selectedLink = links[i];
    isImage = await isImageLink(selectedLink);

    if (isImage) {
      break;
    }
  }

  // اگر هیچ لینک تصویری یافت نشد، ارور برمی‌گردانیم
  if (!isImage) {
    return res.status(500).json({ error: 'No image link available.' });
  }

  res.json({ 
    url: selectedLink,
    developer: 'Ehsan Fazli'  // اضافه کردن نام توسعه‌دهنده به خروجی
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
