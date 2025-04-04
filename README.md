
# Todolist - แอปพลิเคชัน Next.js

แอปพลิเคชัน **Todolist** ที่สร้างด้วย **Next.js** ใช้ **Material-UI (MUI)** สำหรับส่วนประกอบของ UI และ **TailwindCSS** สำหรับการจัดสไตล์ มีฟังก์ชันการจัดเรียงตามวันที่ และการกรองตามประเภทงาน พร้อมเก็บข้อมูลไว้ใน **IndexedDB**

## Demo

คุณสามารถดูแอปพลิเคชันตัวอย่างได้ที่: [Todolist Demo](https://todolist-nontachai.netlify.app/)

## ฟีเจอร์

- **จัดเรียงตามวันที่**: สามารถจัดเรียงงานตามวันที่ครบกำหนด
- **กรองตามประเภทงาน**: กรองงานตามประเภทที่เลือก
- **CRUD Operations**: สร้าง, อ่าน, อัปเดต, ลบ งาน
- **ค้นหา**: ค้นหางานตามชื่อ
- **ทำเครื่องหมายงานที่เสร็จสมบูรณ์**: ทำเครื่องหมายงานว่าเสร็จสมบูรณ์หรือยังไม่เสร็จ
- **เก็บข้อมูลใน IndexedDB**: ข้อมูลงานจะถูกเก็บใน **IndexedDB** เพื่อให้สามารถเข้าถึงข้อมูลได้แม้ในโหมดออฟไลน์

## เทคโนโลยีที่ใช้

- **Next.js**: เฟรมเวิร์กสำหรับสร้างแอปพลิเคชันที่เรนเดอร์บนเซิร์ฟเวอร์
- **Material-UI (MUI)**: ใช้สำหรับสร้างส่วนประกอบ UI ที่ดูทันสมัย
- **TailwindCSS**: ใช้สำหรับการจัดสไตล์ให้กับแอปพลิเคชัน
- **IndexedDB**: ใช้สำหรับเก็บข้อมูลในเบราว์เซอร์เพื่อให้แอปทำงานได้ในโหมดออฟไลน์

## การติดตั้ง

หากต้องการรันโปรเจ็กต์นี้ในเครื่องของคุณ ให้ทำตามขั้นตอนนี้:

1. โคลนโปรเจ็กต์:

   ```bash
   git clone https://github.com/Gas-nontachai/Skuberg_Test_Frontend_ToDoList_Nontachai.git
   ```

2. เข้าไปในโฟลเดอร์โปรเจ็กต์:

   ```bash
   cd Skuberg_Test_Frontend_ToDoList_Nontachai
   ```

3. ติดตั้ง dependencies:

   ```bash
   npm install
   ```

4. รันเซิร์ฟเวอร์พัฒนา:

   ```bash
   npm run dev
   ```

5. เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์ของคุณเพื่อดูแอป

## การใช้งาน

1. เพิ่มงานใหม่โดยการพิมพ์ในช่องกรอกข้อมูลและคลิกปุ่ม **Add Task**
2. แก้ไขงานโดยการคลิกที่ชื่อของงาน
3. ลบงานโดยการคลิกปุ่ม **Delete** ข้างๆ งานนั้น
4. ทำเครื่องหมายงานว่าเสร็จสมบูรณ์โดยการคลิกปุ่ม **Complete**
5. ใช้ช่องค้นหาเพื่อค้นหางานเฉพาะ
6. จัดเรียงงานตามวันที่โดยการเลือกจากเมนู **Sort by Date**
7. กรองงานตามประเภทงานโดยการเลือกจากเมนู **Filter by Category** 

---

# Todolist - Next.js Application

This is a simple **Todolist** application built using **Next.js** with **Material-UI (MUI)** for UI components and **TailwindCSS** for styling. It includes functionalities for sorting tasks by date, filtering tasks by category, and stores data using **IndexedDB**.

## Demo

You can view the live application here: [Todolist Demo](https://todolist-nontachai.netlify.app/)

## Features

- **Sort by Date**: Sort tasks by their due date.
- **Filter by Category**: Filter tasks based on selected categories.
- **CRUD Operations**: Create, Read, Update, and Delete tasks.
- **Search**: Search for tasks by name.
- **Complete Task**: Mark tasks as completed or incomplete.
- **IndexedDB**: Stores task data in **IndexedDB** for offline access.

## Technologies Used

- **Next.js**: A React framework for building server-side rendered applications.
- **Material-UI (MUI)**: For creating modern UI components.
- **TailwindCSS**: For styling the application.
- **IndexedDB**: For storing task data in the browser to support offline functionality.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Gas-nontachai/Skuberg_Test_Frontend_ToDoList_Nontachai.git
   ```

2. Navigate into the project directory:

   ```bash
   cd Skuberg_Test_Frontend_ToDoList_Nontachai
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

1. Add a new task by typing in the input field and clicking the **Add Task** button.
2. Edit a task by clicking on the task name.
3. Delete a task by clicking the **Delete** button next to the task.
4. Mark a task as completed by clicking the **Complete** button.
5. Use the search bar to find specific tasks.
6. Sort tasks by date by selecting from the **Sort by Date** dropdown.
7. Filter tasks by category by selecting from the **Filter by Category** dropdown. 
