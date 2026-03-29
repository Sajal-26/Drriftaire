# Drriftaire

A minimal full-stack web application for booking drone-based agricultural services.

---

## Project Goal

Build a simple and clean platform where users can book drone spraying services, receive email confirmations, and track their bookings. Admins can manage and update booking statuses.

---

## Tech Stack

* Frontend: React + Tailwind (Hosted on Vercel)
* Backend: Node.js + Express (Hosted on Railway)
* Database: Supabase (PostgreSQL)
* Auth: JWT + OTP + Google Sign-In
* Email: EmailJS / Nodemailer

---

## Deployment Architecture

```text
User (Browser)
   ↓
Frontend (Vercel)
   ↓ API calls
Backend (Railway)
   ↓
Database (Supabase)
```

---

## Hosting and Cost Breakdown

| Service          | Platform             | Cost                   |
| ---------------- | -------------------- | ---------------------- |
| Frontend Hosting | Vercel               | Free                   |
| Backend Hosting  | Railway (Hobby Plan) | ~$5/month (~₹400–₹500) |
| Database         | Supabase (Free Tier) | Free                   |
| Domain           | Custom Domain        | Already owned          |

Total Cost: ~₹400–₹500 per month

---

## Core Features

### User Side

* [ ] Signup / Login
* [ ] OTP Authentication
* [ ] Google Sign-In
* [ ] Book a service
* [ ] Receive confirmation email
* [ ] View booking history
* [ ] Edit profile

---

### Admin Side

* [ ] Admin login
* [ ] View all bookings
* [ ] Approve / Reject / Complete bookings
* [ ] Basic analytics (total bookings, etc.)
* [ ] Manage users (optional)

---

## Booking System

* [ ] Booking form (name, phone, location, farm size, date)
* [ ] Store booking in database
* [ ] Send booking details to admin (email)
* [ ] Send confirmation email to user

---

## Authentication

* [ ] JWT-based authentication
* [ ] OTP verification (email/phone)
* [X] Google OAuth integration

---

## Pages

* [ ] Home Page
* [ ] About Page
* [ ] Booking Page
* [ ] User Dashboard
* [ ] Admin Panel

---

## MVP (Must Complete First)

* [ ] Basic authentication (login/signup)
* [ ] Booking form
* [ ] Email notifications
* [ ] Admin booking management

---

## Future Enhancements (Optional)

* [ ] Payment integration
* [ ] Map integration for location
* [ ] SMS notifications
* [ ] Advanced analytics dashboard

---

## Notes

* Keep UI minimal and clean
* Focus on core functionality first
* Scale infrastructure only when required