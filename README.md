# UrbanEase – Home Services Booking Platform (MERN Stack)

UrbanEase is a full‑featured home services marketplace where users can book services, providers can manage their offerings, and admins can oversee the entire platform.

---

## 🚀 Features

### 🔐 Authentication & Security
- Email + OTP verification  
- Login with JWT authentication  
- Password reset using OTP  

### 👤 User Features
- Browse & search services  
- View detailed service pages  
- Book services with date & address  
- Booking history  
- Profile management  

### 🧰 Provider Features
- Add, edit & delete services  
- Upload service images (Cloudinary)  
- Manage bookings  
- Update booking statuses (Scheduled → In‑Progress → Completed)  

### 🛡 Admin Features
- Manage all users  
- Manage all providers  
- View & delete services  
- View all bookings  

---

## 🛠 Tech Stack

### **Frontend**
- React
- Tailwind CSS  
- React Router  
- React Icons / Lucide Icons  

### **Backend**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- JWT Auth  
- Nodemailer (OTP Emails)  
- Multer + Cloudinary (File Uploads)


## ⚙️ Environment Variables (.env)

### **Backend**
```
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret
NODEMAILER_HOST=smtp.example.com
NODEMAILER_PORT=587
NODEMAILER_USER=your_email
NODEMAILER_PASS=your_email_password

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

## ▶️ Run App

### Backend
```bash
npm run dev
```

### Frontend
```bash
npm run dev
```

---

## 📸 Screenshots (Optional)
Add your screenshots here.

---

## 🤝 Contributing
Pull requests are welcome!

---

## ⭐ If you like this project, don't forget to star the repo!
