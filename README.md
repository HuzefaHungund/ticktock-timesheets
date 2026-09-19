TickTock - Timesheet Management Application
A responsive, SaaS-style Timesheet Management application built with Next.js (App Router), TypeScript, NextAuth, and Tailwind CSS, developed according to provided Figma designs and technical assessment requirements.

🛠️ Frameworks & Libraries Used
Framework: Next.js 14/15 (App Router, React Server Components & Client Components)

Language: TypeScript

Styling: Tailwind CSS v4

Typography: Inter Font (via next/font/google)

Authentication: NextAuth.js v4 (Credentials Provider with JWT strategy)

Icons: Custom SVG icons matching Figma specifications

Validation & Schemas: Zod

🚀 Setup Instructions
Follow these steps to run the application locally on your machine:

1. Prerequisites
Ensure you have Node.js 18.x or higher installed on your system.

2. Clone the Repository
Bash
git clone https://github.com/HuzefaHungund/ticktock-timesheets.git
cd ticktock-timesheets
3. Install Dependencies
Bash
npm install
4. Configure Environment Variables
Create a .env.local file in the root directory of the project (alongside package.json):

Code snippet
NEXTAUTH_SECRET=your_super_secret_key_here_123456789
NEXTAUTH_URL=http://localhost:3000
Note: Make sure the file is named .env.local and not .env.local.txt.

5. Run the Development Server
Bash
npm run dev
Open http://localhost:3000 in your browser.

6. Demo Credentials
Use the following credentials on the split-screen login page to authenticate:

Email: user@example.com

Password: password123

📝 Key Features & Implementation Details
Split-Screen Authentication: High-fidelity implementation of the Figma split login screen featuring responsive layout switching, brand summary, and NextAuth session integration.

Interactive Dashboard Table: Complete dynamic table displaying weekly timesheets, color-coded status badges (COMPLETED, INCOMPLETE, MISSING), and dynamic action links (View, Update, Create).

In-Memory Local API Routes: Built internal Next.js API routes (/api/timesheets) supporting GET, POST, and PUT methods without directly hardcoding data into client components.

Modal Operations: Context-aware modal allowing users to view existing records, update incomplete timesheets, or create new entries.

Filtering & Client-Side Pagination: Integrated dynamic filtering by status and page control logic with customizable items-per-page options (5, 10, 20 per page).

🧠 Assumptions & Notes
Data Persistence: In accordance with assessment instructions for local/mock endpoints, data is stored in-memory inside the internal API route (app/api/timesheets/route.ts). Restarting the dev server resets mock entries to their default state.

Session Persistence: NextAuth uses JWT session strategies to maintain state across pages without requiring a external database.

Tailwind v4 Configuration: Typography variables (such as Inter font classes) and theme extension directives are configured inside app/globals.css.
