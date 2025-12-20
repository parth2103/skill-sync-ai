# SkillSync AI

![SkillSync AI Banner](https://img.shields.io/badge/Status-Public%20Beta-blue) [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38b2ac)](https://tailwindcss.com/)

**Tailor your resume to any job in seconds with AI.**

SkillSync AI is a powerful tool designed to help job seekers optimize their resumes for specific job descriptions (JDs). By leveraging the OpenAI API, it provides real-time scoring, tailored bullet point suggestions, and deep insights into how well your profile matches the role you're applying for.

## ✨ Key Features

- **Real-Time Match Scoring**: Get an instant compatibility score as you edit your resume against a target JD.
- **AI-Powered Optimization**:
  - **Bullet Point Generator**: detailed, action-oriented bullet points based on your skills and the JD's requirements.
  - **Keyword Matching**: Identify missing keywords and skills critical for passing ATS (Applicant Tracking Systems).
- **Interactive Editor**: A rich text editor experience for fine-tuning your resume.
- **PDF Resume Import**: Easily upload and parse your existing PDF resume to get started immediately.
- **Privacy-First**: Your personal data is processed locally or via secure API calls and is not stored permanently on our servers.

## 🛠️ Technology Stack

Built with a modern, performance-oriented stack:

- **Frontend Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Radix UI](https://www.radix-ui.com/) primitives & [Lucide React](https://lucide.dev/) icons
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) for efficient client-side state
- **AI Integration**: [OpenAI API](https://openai.com/api/) (GPT-4o/GPT-3.5-turbo models)
- **Utilities**:
  - `pdf-parse`: For extracting text from uploaded resumes.
  - `clsx` & `tailwind-merge`: For dynamic class name management.

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js 18+ installed
- An OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jd-resume-matcher.git
   cd jd-resume-matcher
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open locally**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add your `OPENAI_API_KEY` in the Vercel Environment Variables.
4. Deploy!

## 📄 License

This project is licensed under the MIT License.
