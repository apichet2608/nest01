## **NestJS API Structure**

```bash
npm i -g @nestjs/cli
nest new project-name
```

1. **Controller** - รับผิดชอบการจัดการ HTTP requests และ responses
2. **Service** - รับผิดชอบ business logic
3. **Module** - รวม controllers และ services เข้าด้วยกัน
4. **DTO (Data Transfer Object)** หรือ **Entity** - กำหนดโครงสร้างข้อมูล

คำสั่งสร้าง **Module** 

```bash
nest g resource <mudule_name>
```

```bash
nest01/
└── src/
    ├── main.ts                    # Entry point ของแอป NestJS
    ├── app.module.ts              # โมดูลหลักของแอป
    ├── config
    │   ├──pgsql
    │       ├── database.module.ts   # รวม service 
    │       ├── database.service.ts  # กำหนด service การจัดการการเชื่อมต่อ
    │       ├── pgsql.config.ts      # config การเชื่อมต่อกับ database
    ├── smart                      # โมดูล smart
        ├── services               # Services ที่จัดการ business logic
        │   ├── smart-query.service.ts        # แยก logic การ query (1 req = 1 file)
        ├── smart.controller.ts               # จัดการ HTTP requests & responses
        ├── smart.module.ts                   # รวม controller และ service เข้าด้วยกัน
        │   smart.service.ts                  # จัดการ API หลักที่เปิดให้ใช้งาน

```

- smart เป็น module ตัวอย่าง

Example Code

https://github.com/apichet2608/nest01