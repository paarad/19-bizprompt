# 🚀 BizPrompt - AI-Powered Business Idea Generator

Generate personalized, high-quality business ideas using AI. From side hustles to SaaS companies, get actionable business concepts tailored to your skills, budget, and goals.

## ✨ Features

- **AI-Powered Ideas**: Generate business concepts using GPT-4
- **Personalized Results**: Ideas matched to your skills, budget, and preferences  
- **Instant Generation**: Get actionable business ideas in seconds
- **Save & Explore**: Save ideas to Supabase and explore public submissions
- **Clean UI**: Modern, minimalist interface built with shadcn/ui
- **Responsive Design**: Works perfectly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui
- **AI**: OpenAI GPT-4
- **Database**: Supabase
- **Hosting**: Vercel
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- OpenAI API key
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/paarad/19-bizprompt.git
cd 19-bizprompt
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OpenAI Configuration  
OPENAI_API_KEY=your_openai_api_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL in `supabase-schema.sql` in your Supabase SQL editor
   - This creates the `business_ideas` table with proper RLS policies

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🚀 Deployment

### Deploy to Vercel

1. Connect your GitHub repository to Vercel
2. Set the environment variables in Vercel dashboard
3. Deploy!

The app will be automatically deployed on every push to main.

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (your production URL)

## 📊 Database Schema

The app uses a single `business_ideas` table:

```sql
business_ideas (
  id: UUID (primary key)
  prompt: TEXT (user's input prompt)
  generated_idea: JSONB (AI-generated business idea)
  filters: JSONB (optional filters applied)
  created_at: TIMESTAMP
  user_id: UUID (optional, for authenticated users)
  is_public: BOOLEAN (whether idea appears in explore page)
  view_count: INTEGER (number of times viewed)
)
```

## 🎯 How It Works

1. **Input**: User enters a business prompt describing their situation/goals
2. **AI Generation**: GPT-4 generates a structured business idea with:
   - Business name and description
   - Monetization strategy  
   - Required tools/skills
   - Time to MVP
   - Difficulty level
   - Category classification
3. **Display**: Results shown in a clean, structured format
4. **Actions**: Users can regenerate, copy, or save ideas
5. **Explore**: Public ideas can be browsed and filtered by category

## 💡 Example Prompts

- "I'm a broke college student who wants to start a side hustle with minimal upfront cost"
- "Give me a SaaS idea for solo developers that can be built in 3 months"
- "I want a local business with recurring revenue that doesn't require technical skills"
- "Help me create a service business that leverages AI to automate client work"

## 🔮 Future Enhancements

- User authentication and personal idea libraries
- Advanced filtering (budget, industry, skill level)  
- "First 3 steps" action plan generator
- MVP roadmap generator
- Shareable idea links
- Export to Notion/Airtable
- API access for programmatic generation

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
