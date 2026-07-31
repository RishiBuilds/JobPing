# JobPing

> A modern, full-stack job board platform connecting talented professionals with top companies.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-purple?logo=clerk)](https://clerk.com/)
[![Convex](https://img.shields.io/badge/Backend-Convex-orange)](https://www.convex.dev/)

## Overview

JobPing is a real-time job platform built for both job seekers and employers. Browse listings, track applications, and manage your hiring pipeline — all in one place.

## Features

- **Authentication** — Secure sign-up/sign-in flows with org support, powered by Clerk
- **Real-time Notifications** — Instant alerts for new applications and status changes
- **AI-Powered Matching** — Surfaces the most relevant jobs and candidates automatically
- **Job Board** — Browse, filter, and save job listings across roles, locations, and work modes
- **Employer Dashboard** — Manage job postings, track pipeline stats, and review applicants
- **Application Tracking** — Full lifecycle view from submission to offer
- **Team Collaboration** — Multi-member orgs with role-based access control
- **Secure & Private** — End-to-end encrypted data with granular visibility controls

## Tech Stack

| Layer              | Technology                                     |
| ------------------ | ---------------------------------------------- |
| Framework          | [Next.js 15](https://nextjs.org/) (App Router) |
| Language           | TypeScript                                     |
| Authentication     | [Clerk](https://clerk.com/)                    |
| Database / Backend | [Convex](https://www.convex.dev/)              |
| Styling            | [Tailwind CSS](https://tailwindcss.com/)       |
| UI Components      | [shadcn/ui](https://ui.shadcn.com/)            |

## Getting Started

### Prerequisites

- Node.js v18 or later
- `npm`, `pnpm`, or `yarn`
- A [Clerk](https://clerk.com/) account
- A [Convex](https://www.convex.dev/) project

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd jobping
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   CONVEX_DEPLOYMENT=your_convex_deployment
   NEXT_PUBLIC_CONVEX_URL=your_convex_url

   # Optional: Webhook secret for Clerk → Convex sync
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   ```

4. **Start the development server:**

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
jobping/
├── app/                   # Next.js App Router pages
│   ├── dashboard/         # Employer dashboard
│   ├── jobs/              # Public job listings
│   ├── applications/      # Job seeker application tracker
│   └── saved/             # Saved jobs
├── components/
│   ├── landing/           # Marketing/landing page sections
│   └── ui/                # shadcn/ui components
├── convex/                # Convex backend (schema, queries, mutations)
└── lib/                   # Shared utilities
```

## Contributing

Contributions are welcome! Please:

1. Fork the repo and create a feature branch (`git checkout -b feat/my-feature`)
2. Make your changes with clear, focused commits
3. Open a pull request with a description of what you changed and why

## License

MIT
