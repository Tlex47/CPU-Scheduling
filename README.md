# CPU Scheduling Simulator

เว็บจำลองการจัดสรร CPU สำหรับเปรียบเทียบ FCFS, SJF แบบ Non-preemptive และ Round Robin โดยกำหนด Arrival Time ของทุกโปรเซสเป็น 0

## ทดลองใช้งานบนเครื่อง

เปิด `index.html` ในเว็บเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้ง dependencies หรือเปิดเซิร์ฟเวอร์

## เผยแพร่ด้วย GitHub Pages

โปรเจกต์มี GitHub Actions workflow สำหรับ deploy เว็บไซต์อัตโนมัติเมื่อ push ไปยัง branch `main`

1. สร้าง repository ใหม่บน GitHub
2. ตั้งค่า repository เป็น **Public**
3. อัปโหลดไฟล์โปรเจกต์ หรือเปิด Terminal ในโฟลเดอร์นี้แล้วรันคำสั่งต่อไปนี้ โดยแทน URL ด้วย repository ของคุณ:

   ```bash
   git init
   git add .
   git commit -m "Add CPU scheduling simulator"
   git branch -M main
   git remote add origin https://github.com/<username>/<repository>.git
   git push -u origin main
   ```

4. ใน GitHub เปิด **Settings → Pages** แล้วตั้ง **Build and deployment → Source** เป็น **GitHub Actions**
5. เปิดแท็บ **Actions** เพื่อตรวจสอบ workflow `Deploy GitHub Pages` เมื่อทำงานเสร็จ เว็บไซต์จะอยู่ที่:

   ```text
   https://<username>.github.io/<repository>/
   ```

หลังจากนั้น เมื่อ push การแก้ไขไปยัง `main` GitHub Actions จะ deploy เวอร์ชันใหม่ให้อัตโนมัติ

## การใช้งาน

1. กรอกจำนวนโปรเซส แล้วกด **สร้างช่องกรอกข้อมูล**
2. กรอก Burst Time ให้ครบ หรือกด **สุ่มค่า Burst Time**
3. กำหนด Time Quantum สำหรับ Round Robin (ค่าเริ่มต้นคือ 2)
4. กด **คำนวณผลลัพธ์** เพื่อดูตารางและค่าเฉลี่ย Waiting Time ของแต่ละอัลกอริทึม

## โครงสร้างไฟล์

- `index.html` — โครงสร้างหน้าเว็บ
- `style.css` — รูปแบบและการจัดวางหน้าเว็บ
- `script.js` — ตรวจสอบข้อมูลและคำนวณผลลัพธ์
- `.github/workflows/deploy-pages.yml` — workflow สำหรับเผยแพร่ GitHub Pages
