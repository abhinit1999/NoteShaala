import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Need service role to bypass RLS for inserts if RLS is strict, or just use anon key if RLS allows anon insert (unlikely for categories)

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or Key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const newCategories = [
  { title: 'Machine Learning', slug: 'machine-learning', description: 'Resources and notes for Machine Learning algorithms and models.' },
  { title: 'Deep Learning', slug: 'deep-learning', description: 'Advanced Deep Learning architectures, neural networks, and research.' },
  { title: 'Stock Market', slug: 'stock-market', description: 'Trading strategies, financial analysis, and stock market insights.' },
  { title: 'Data Engineering', slug: 'data-engineering', description: 'Data pipelines, ETL, databases, and big data architecture.' },
  { title: 'Data Analyst', slug: 'data-analyst', description: 'Data visualization, statistics, and business intelligence.' },
  { title: 'Cloud Computing', slug: 'cloud-computing', description: 'AWS, Azure, GCP, and cloud architecture resources.' },
  { title: 'Robotics', slug: 'robotics', description: 'Hardware, control systems, and robotics engineering.' },
  { title: 'DevOps', slug: 'devops', description: 'CI/CD, automation, containerization, and infrastructure as code.' },
  { title: 'Git & GitHub', slug: 'git-github', description: 'Version control best practices, workflows, and collaboration.' }
]

async function seed() {
  console.log('Inserting new categories...')
  const { data, error } = await supabase
    .from('categories')
    .upsert(newCategories, { onConflict: 'slug' })
    .select()

  if (error) {
    console.error('Error inserting categories:', error)
  } else {
    console.log('Successfully inserted categories:', data.length)
  }
}

seed()
