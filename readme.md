# Drriftaire

A minimal full-stack web application for booking drone-based agricultural services.

---

## Project Goal

Build a simple and clean platform where users can book drone spraying services, receive email confirmations, and track their bookings. Admins can manage and update booking statuses.

---

## Tech Stack

* Frontend: React + Tailwind (Hosted on Vercel)
* Backend: Node.js + Express (Hosted on Vercel)
* Auth: JWT
* Email: Nodemailer
* Storage: Supabase (PostgreSQL)

---

## Deployment Architecture

```text
User (Browser)
   ↓
Frontend (Vercel)
   ↓ API calls
Backend (Vercel)
   ↓
Supabase Database + Gmail SMTP
```

---

## Hosting and Cost Breakdown

| Service          | Platform | Cost |
| ---------------- | -------- | ---- |
| Frontend Hosting | Vercel   | Free |
| Backend Hosting  | Vercel   | Free |
| Database         | Supabase | Free |
| Domain           | Custom   | Done |

Current stack cost can stay at `₹0` on free tier while traffic is low.

---

## Core Features

### User Side

* [X] Book a service (No login required)
* [X] Receive confirmation email

---

### Admin Side

* [X] Admin login
* [X] View all bookings
* [X] Approve / Reject / Complete bookings
* [X] Basic analytics (total bookings, etc.)

---

## Booking System

* [X] Booking form (name, phone, location, farm size, date)
* [X] Store booking in Supabase database
* [X] Send booking details to admin (email)
* [X] Send confirmation email to user
* [X] Prevent duplicate pending bookings
* [X] Validate booking fields
* [X] Add booking rate limiting

---

## Authentication

* [X] JWT-based authentication for Admin Panel
* [X] Hashed admin password support

---

## Pages

* [ ] Home Page
* [ ] About Page
* [X] Booking Page
* [ ] User Dashboard
* [ ] Admin Panel

---

## MVP (Must Complete First)

* [X] Booking form
* [X] Admin login interface
* [X] Email notifications
* [X] Admin booking management
* [X] Backend deployment

---

## Completed Enhancements

* [X] Health endpoint
* [X] Environment variable validation
* [X] Supabase integration working on Vercel
* [X] Booking email flow fixed on Vercel
* [X] Admin status update route fixed on Vercel
* [X] Frontend API wiring updated for deployed backend
* [X] Detailed email logging added for debugging
* [X] Mock integration test runner
* [X] Live backend test runner

---

## Future Enhancements & Scaling

* [ ] Payment integration (UPI/Razorpay)
* [ ] Map integration for precise farm location
* [ ] SMS notifications for status updates
* [ ] Queue-based email delivery (for higher volumes)
* [ ] Replace Gmail SMTP with dedicated transactional email service (SendGrid/Postmark)
* [ ] Advanced analytics dashboard (charts/trends)

### Current Practical Capacity (Free Tier)
* Estimated `~50-100 bookings/day`
* Estimated `~10-20 concurrent users`
* Estimated `~5,000 monthly visitors`

---

## Project Budget

`₹7000`

---