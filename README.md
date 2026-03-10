# JobPing

JobPing is a modern job platform connecting talented professionals with top companies. Browse jobs, build your profile, and get hired.

## Features
- **User Authentication:** Secure sign-up and sign-in flows powered by Clerk.
- **Job Board:** Browse and search for recent job postings.
- **Dashboard:** Manage jobs and applications from a dedicated dashboard.
- **Real-time Database:** Fast and scalable backend powered by Convex.
- **Modern UI:** Built with Tailwind CSS, shadcn/ui, and beautiful animations for a responsive experience.

## Tech Stack
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Authentication:** [Clerk](https://clerk.com/)
- **Database / Backend:** [Convex](https://www.convex.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm, pnpm, or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jobping
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your keys for Clerk and Convex:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   CONVEX_DEPLOYMENT=your_convex_deployment
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   
   # Note: Additional webhook secrets or API keys may be required depending on functionality.
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running locally.
