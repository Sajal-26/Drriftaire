# Drriftaire

A minimal full-stack web application for booking drone-based agricultural services.

---

## Project Goal

Build a simple and clean platform where users can book drone spraying services, receive email confirmations, and track their bookings. Admins can manage and update booking statuses.

---

## Tech Stack

* Frontend: React + Tailwind (Hosted on Vercel)
* Backend: Node.js + Express (Hosted on Railway)
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
```

---

## Hosting and Cost Breakdown

| Service          | Platform             | Cost                   |
| ---------------- | -------------------- | ---------------------- |
| Frontend Hosting | Vercel               | Free                   |
| Backend Hosting  | Railway (Hobby Plan) | ~$5/month (~₹400–₹500) |
| Domain           | Custom Domain        | Already owned          |

Total Cost: ~₹400–₹500 per month

---

## Core Features

### User Side

* [ ] Signup / Login
* [ ] OTP Authentication
* [X] Google Sign-In
* [X] Book a service
* [X] Receive confirmation email
* [ ] View booking history

---

### Admin Side

* [ ] Admin login
* [ ] View all bookings
* [ ] Approve / Reject / Complete bookings
* [ ] Basic analytics (total bookings, etc.)
* [ ] Manage users (optional)

---

## Booking System

* [X] Booking form (name, phone, location, farm size, date)
* [X] Store booking in database
* [X] Send booking details to admin (email)
* [X] Send confirmation email to user

---

## Authentication

* [X] JWT-based authentication
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
* [X] Booking form
* [X] Email notifications
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