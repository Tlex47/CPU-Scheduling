# CPU Scheduling Simulator (Term Project)

โปรแกรมจำลองและเปรียบเทียบประสิทธิภาพการจัดสรรหน่วยประมวลผล (CPU Scheduling) ในรูปแบบ Web Application ที่พัฒนาด้วย HTML, CSS และ JavaScript โดยกำหนดให้โปรเซสทุกตัวมี Arrival Time (AT) = 0 ตามข้อกำหนดของโครงงาน

---

## 📌 คุณสมบัติของโปรแกรม (Features)

1. **การกำหนดโปรเซสและ Burst Time (BT):**
   - รองรับการป้อนจำนวนโปรเซส ($P_1, P_2, \dots, P_n$)
   - สามารถป้อนค่า Burst Time ด้วยตนเอง หรือใช้ปุ่มสุ่มค่า Burst Time อัตโนมัติ (จำนวนเต็มบวก)
2. **อัลกอริทึมที่รองรับ:**
   - **FCFS** (First-Come, First-Served)
   - **SJF** (Shortest Job First - แบบ Non-preemptive)
   - **Round Robin** (สามารถกำหนดค่า Time Quantum ได้ ค่าเริ่มต้นคือ 2)
3. **การแสดงผลลัพธ์:**
   - แสดงตารางข้อมูล: Process, AT, BT, ST (Start Time), CT (Completion Time), TAT (Turnaround Time) และ WT (Waiting Time)
   - คำนวณและแสดงค่า **AVG WT** (Average Waiting Time) ของแต่ละอัลกอริทึมเพื่อนำมาเปรียบเทียบกัน
4. **Data Validation:**
   - ระบบตรวจสอบความถูกต้องของข้อมูลพร้อมแจ้งเตือน เมื่อป้อนข้อมูลไม่ครบถ้วน หรือป้อนค่าที่ไม่ถูกต้อง (เช่น ค่าศูนย์ หรือติดลบ)

---

## 🛠 เครื่องมือและเวอร์ชันที่ใช้ (Tools & Versions)

- **Language & Core:** HTML5, CSS3, JavaScript
- **Testing Browsers:**
  - Google Chrome (Version 120 ขึ้นไป)
  - Microsoft Edge (Version 120 ขึ้นไป)
- **Code Editor:** Visual Studio Code

---

## 🚀 วิธีการติดตั้งและเปิดใช้งานโปรแกรม (Installation & How to Run)

โปรแกรมนี้ถูกออกแบบมาในรูปแบบ Client-side Web Application จึง**ไม่จำเป็นต้องติดตั้งโปรแกรมเสริมหรือตั้งค่า Server** เพิ่มเติม

1. ดาวน์โหลดหรือ Clone ซอร์สโค้ดทั้งหมดลงในเครื่องคอมพิวเตอร์
2. ดับเบิลคลิกที่ไฟล์ `index.html` หรือคลิกขวาแล้วเลือกเปิดด้วย **Google Chrome** หรือ **Microsoft Edge**
3. โปรแกรมจะเปิดขึ้นมาและพร้อมใช้งานทันที

---

## 🧪 ตัวอย่างชุดข้อมูลสำหรับทดสอบ (Sample Test Data)

### กรณีที่ 1: กำหนด Burst Time ด้วยตนเอง (เพื่อเปรียบเทียบ 3 อัลกอริทึม)
* **จำนวนโปรเซส:** 3 โปรเซส (AT = 0 ทุกตัว)
* **Burst Time:** $P_1 = 24$, $P_2 = 3$, $P_3 = 3$
* **Time Quantum (RR):** 4

### กรณีที่ 2: ใช้ระบบสุ่ม Burst Time
* **จำนวนโปรเซส:** 5 โปรเซส
* **Burst Time:** กดปุ่ม "สุ่มค่า Burst Time"
* **การทดสอบ:** ตรวจสอบว่าโปรแกรมสามารถคำนวณ ST, CT, TAT, WT และ AVG WT ของทุกโปรเซสได้ถูกต้องครบถ้วน

### กรณีที่ 3: เปลี่ยนค่า Time Quantum สำหรับ Round Robin
* **ชุดข้อมูลเดิม:** $P_1 = 10$, $P_2 = 5$, $P_3 = 8$
* **ทดสอบครั้งที่ 1:** Time Quantum = 2
* **ทดสอบครั้งที่ 2:** Time Quantum = 5
* **การทดสอบ:** เปรียบเทียบผลลัพธ์ AVG WT เพื่อดูผลกระทบจากการเปลี่ยนขนาด Time Quantum

---

## 🤖 การนำ AI มาใช้ในการพัฒนา (AI Usage Transparency)

ในการทำโครงงานนี้ มีการนำ AI มาช่วยในการพัฒนาอย่างโปร่งใสตามรายละเอียดดังนี้:

* **เครื่องมือ AI ที่ใช้:** Google Gemini / ChatGPT
* **ส่วนที่ AI มีส่วนช่วย:**
  1. ออกแบบโครงสร้างส่วนแสดงผลลัพธ์ (UI) ด้วย HTML/CSS ให้มีความเป็นระเบียบ อ่านง่าย
  2. ช่วยคิด Logic การสลับคิวของ Round Robin และ SJF (Non-preemptive) ในไฟล์ JavaScript
  3. ช่วยสร้างไฟล์โครงร่าง README.md และแนวทางการทดสอบโปรแกรม
* **ตัวอย่าง Prompt สำคัญที่ใช้:**
  > *"ช่วยเขียนโค้ด JavaScript คำนวณ CPU Scheduling อัลกอริทึม Round Robin สำหรับโปรเซสที่มี Arrival Time = 0 ทั้งหมด โดยรับค่า Time Quantum และคืนค่าเป็น Array ของ Process ที่มี Start Time, Completion Time, Turnaround Time และ Waiting Time"*
* **การตรวจสอบและปรับปรุง:** 
  - คณะผู้จัดทำได้ตรวจสอบ Logic คำนวณย้อนหลังด้วยการคำนวณมือ (Manual Calculation) อย่างน้อย 1 กรณี เพื่อยืนยันความถูกต้องของผลลัพธ์จาก AI ก่อนนำมาใช้งานจริง

---

## 👥 รายชื่อสมาชิกและหน้าที่รับผิดชอบ (Team Members & Roles)

1. **นาย/นางสาว A (รหัสนักศึกษา XXXXXXXX)**
   - **หน้าที่:** พัฒนาส่วน UI/UX (HTML, CSS) และจัดทำวิดีโออธิบายโปรแกรม (ส่วนที่ 2)
2. **นาย/นางสาว B (รหัสนักศึกษา XXXXXXXX)**
   - **หน้าที่:** เขียน Logic การคำนวณ FCFS, SJF, RR (JavaScript) และทำวิดีโอเบื้องหลังการใช้ AI (ส่วนที่ 3)
```
