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
* Storage: Google Sheets

---

## Deployment Architecture

```text
User (Browser)
   ↓
Frontend (Vercel)
   ↓ API calls
Backend (Vercel)
   ↓
Google Sheets + Gmail SMTP
```

---

## Hosting and Cost Breakdown

| Service          | Platform | Cost |
| ---------------- | -------- | ---- |
| Frontend Hosting | Vercel   | Free |
| Backend Hosting  | Vercel   | Free |
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
* [X] Store booking in Spreadsheet / Excel-style sheet
* [X] Send booking details to admin (email)
* [X] Send confirmation email to user
* [X] Prevent duplicate pending bookings
* [X] Validate booking fields
* [X] Add booking rate limiting
* [X] Google Sheets chosen intentionally as per client requirement

---

## Authentication

* [X] JWT-based authentication for Admin Panel
* [X] Hashed admin password support

---

## Pages

* [ ] Home Page
* [ ] About Page
* [ ] Booking Page
* [ ] User Dashboard
* [ ] Admin Panel

---

## MVP (Must Complete First)

* [ ] Booking form
* [ ] Admin login interface
* [X] Email notifications
* [X] Admin booking management
* [X] Backend deployment

---

## Completed Enhancements

* [X] Health endpoint
* [X] Environment variable validation
* [X] Google Sheets integration working on Vercel
* [X] Booking email flow fixed on Vercel
* [X] Admin status update route fixed on Vercel
* [X] Frontend API wiring updated for deployed backend
* [X] Detailed email logging added for debugging
* [X] Mock integration test runner
* [X] Live backend test runner

---

## Current Limitations

* [ ] Queue-based email delivery
* [ ] Structured logging/monitoring
* [ ] Payment integration
* [ ] Map integration for location
* [ ] SMS notifications
* [ ] Advanced analytics dashboard

---

## Future Enhancements (Optional)

* [ ] Payment integration
* [ ] Map integration for location
* [ ] SMS notifications
* [ ] Advanced analytics dashboard
* [ ] Replace Gmail SMTP with dedicated transactional email service
* [ ] Improve scaling if traffic grows beyond free-tier comfort
* [ ] Current practical estimate: around `150-300 bookings/day`
* [ ] Current practical estimate: around `20-50 users at a time` doing backend actions
* [ ] Current practical estimate: around `10,000-50,000 monthly visitors`
* [ ] Main future bottlenecks: Google Sheets reads/writes and Gmail SMTP sending volume

---

## Project Budget

`₹7000`

---