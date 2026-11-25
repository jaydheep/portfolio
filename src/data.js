// ✏️ EDIT HERE: change text, add projects, fix links. The site updates automatically.
export const projects = [
  { name: 'ReviewGenX', url: 'https://app.reviewgenx.ai/', tag: 'AI product',
    blurb: 'AI-powered review platform I helped build and ship.', stack: ['Python', 'LLM', 'FastAPI'], hue: 265 },
  { name: 'VisualGenX', url: 'https://appvisualgenx.deepknit.ai/', tag: 'AI product',
    blurb: 'AI visual generation application running live on DeepKnit.', stack: ['Python', 'AI models', 'Flask'], hue: 190 },
  { name: 'AI Gateway', url: 'http://ai.deepknit.ai/', tag: 'AI security',
    blurb: 'Sits between apps and the LLM. Blocks prompt injection and keeps sensitive data from reaching the model.', stack: ['Python', 'LLM security', 'Guardrails'], hue: 155 },
  { name: 'DK Platform', url: 'https://dkpstaging.deepknit.ai/login', tag: 'Platform',
    blurb: 'DeepKnit platform with backend services, data pipelines and automation behind it.', stack: ['Django', 'MongoDB', 'Pandas'], hue: 215 },
]

export const automation = [
  ['XML-to-PDF documents', 'PDFs generated straight from XML, replacing manual formatting.'],
  ['Configurable reports', 'Reports and charts that adapt when the data structure changes.'],
  ['Pandas data pipelines', 'Cleansing, transformation and validation of large datasets.'],
  ['Background processing', 'Flask-based AI service pipelines and background jobs.'],
  ['Python tooling', 'Automation tools that streamline manual processes.'],
  ['AI guardrails', 'Gateway checks that stop risky prompts before they reach the model.'],
]

export const skills = [
  ['Backend', ['Python', 'Flask', 'Django', 'FastAPI', 'REST APIs']],
  ['AI and data', ['AI model integration', 'RAG', 'Pandas', 'Data visualisation']],
  ['Databases', ['MongoDB', 'MySQL']],
  ['Tools', ['VS Code', 'Git', 'GitHub', 'SVN']],
  ['Strengths', ['Problem solving', 'Backend architecture', 'Performance tuning']],
]

export const jobs = [
  { role: 'Software Developer, Sanjeevi Technology Solutions', when: '2023 – 2026 (3+ years)', points: [
    'Developed backend applications with Flask, Django and FastAPI, including AI model integration in production systems.',
    'Designed logic-heavy processing workflows and scalable backend services on MongoDB.',
    'Built Flask-based AI service pipelines and background processing systems, and collaborated on AI-driven project delivery.' ] },
  { role: 'Software Engineer, Genevix Solution', when: '2022 – 2023 (8 months)', points: [
    'Worked full-stack on a sales product and delivered user stories that exceeded customer expectations.',
    'Built React screens and modules: Dashboard, Transaction Activity, Company Registration, and Buyer/Seller Activity.' ] },
]

export const ragSteps = [
  ['API request', 'A client calls a Flask or FastAPI endpoint. The service validates the request and hands the work to a background pipeline.'],
  ['Clean data', 'Pandas cleans, transforms and validates the incoming data so the model only sees consistent, trustworthy records.'],
  ['Retrieve', 'Relevant records are retrieved from MongoDB-backed data services, so answers come from the company’s own data.'],
  ['LLM answer', 'The LLM combines the question and the retrieved context to produce an answer for intelligent data retrieval.'],
  ['Report', 'Results flow into configurable reports and visualisations, including XML-to-PDF documents.'],
]
