import { PortfolioData } from '../types'

export const portfolioData: PortfolioData = {
  personal: {
    name: 'Rajin Uddin',
    title: 'Computer Science Student',
    roles: [
      'Full-Stack Developer',
      'DevOps Enthusiast',
      'Open Source Contributor'
    ],
    email: 'razinn70@gmail.com',
    location: 'Guelph, Ontario, Canada',
    bio: 'Passionate computer science student with a love for building scalable web applications and automating workflows. Currently pursuing a BS in Computer Science with a focus on software engineering and cloud technologies.',
    avatar: '/avatar.jpg'
  },
  social: [
    {
      name: 'GitHub',
      url: 'https://github.com/razinn70',
      icon: 'github'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/razinn70',
      icon: 'linkedin'
    },
    {
      name: 'Twitter',
      url: 'https://twitter.com/alexjohnson',
      icon: 'twitter'
    },
    {
      name: 'Email',
      url: 'mailto:razinn70@gmail.com',
      icon: 'mail'
    }
  ],
  technologies: [
    { name: 'TypeScript', category: 'language', color: '#3178C6' },
    { name: 'JavaScript', category: 'language', color: '#F7DF1E' },
    { name: 'Python', category: 'language', color: '#3776AB' },
    { name: 'Java', category: 'language', color: '#ED8B00' },
    { name: 'React', category: 'frontend', color: '#61DAFB' },
    { name: 'Next.js', category: 'frontend', color: '#000000' },
    { name: 'Vue.js', category: 'frontend', color: '#4FC08D' },
    { name: 'Tailwind CSS', category: 'frontend', color: '#06B6D4' },
    { name: 'Node.js', category: 'backend', color: '#339933' },
    { name: 'Express', category: 'backend', color: '#000000' },
    { name: 'FastAPI', category: 'backend', color: '#009688' },
    { name: 'PostgreSQL', category: 'database', color: '#336791' },
    { name: 'MongoDB', category: 'database', color: '#47A248' },
    { name: 'Redis', category: 'database', color: '#DC382D' },
    { name: 'Docker', category: 'devops', color: '#2496ED' },
    { name: 'Kubernetes', category: 'devops', color: '#326CE5' },
    { name: 'AWS', category: 'devops', color: '#FF9900' },
    { name: 'GitHub Actions', category: 'devops', color: '#2088FF' },
    { name: 'Terraform', category: 'devops', color: '#623CE4' }
  ],
  projects: [
    {
      id: 'project-1',
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce platform with real-time inventory management, payment processing, and admin dashboard. Built with microservices architecture and deployed on Kubernetes.',
      technologies: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes', 'Stripe API'],
      year: 2024,
      featured: true,
      liveUrl: 'https://ecommerce-demo.vercel.app',
      githubUrl: 'https://github.com/alexjohnson/ecommerce-platform',
      status: 'completed'
    },
    {
      id: 'project-2',
      title: 'DevOps Automation Suite',
      description: 'Comprehensive CI/CD pipeline automation tool with infrastructure as code, automated testing, and deployment strategies. Reduces deployment time by 80%.',
      technologies: ['Python', 'Terraform', 'GitHub Actions', 'AWS', 'Docker', 'Ansible'],
      year: 2024,
      featured: true,
      githubUrl: 'https://github.com/alexjohnson/devops-suite',
      status: 'completed'
    },
    {
      id: 'project-3',
      title: 'Real-time Chat Application',
      description: 'WebSocket-based chat application with rooms, file sharing, and message encryption. Supports 1000+ concurrent users with horizontal scaling.',
      technologies: ['React', 'Socket.io', 'Node.js', 'MongoDB', 'JWT', 'Cloudinary'],
      year: 2023,
      liveUrl: 'https://chat-app-demo.herokuapp.com',
      githubUrl: 'https://github.com/alexjohnson/realtime-chat',
      status: 'completed'
    },
    {
      id: 'project-4',
      title: 'Machine Learning API',
      description: 'RESTful API for image classification using TensorFlow. Deployed with auto-scaling and load balancing for high availability.',
      technologies: ['Python', 'FastAPI', 'TensorFlow', 'Docker', 'AWS Lambda', 'API Gateway'],
      year: 2023,
      githubUrl: 'https://github.com/alexjohnson/ml-api',
      status: 'completed'
    },
    {
      id: 'project-5',
      title: 'Task Management Dashboard',
      description: 'Kanban-style project management tool with team collaboration, time tracking, and analytics. Built with modern React patterns and state management.',
      technologies: ['React', 'TypeScript', 'Zustand', 'Tailwind CSS', 'Supabase'],
      year: 2023,
      liveUrl: 'https://taskboard-demo.netlify.app',
      githubUrl: 'https://github.com/alexjohnson/task-dashboard',
      status: 'completed'
    },
    {
      id: 'project-6',
      title: 'Personal Blog Engine',
      description: 'Static site generator with MDX support, syntax highlighting, and SEO optimization. Features dark mode and responsive design.',
      technologies: ['Next.js', 'MDX', 'Tailwind CSS', 'Vercel'],
      year: 2022,
      liveUrl: 'https://blog.alexjohnson.dev',
      githubUrl: 'https://github.com/alexjohnson/blog-engine',
      status: 'completed'
    }
  ],
  experience: [
    {
      id: 'exp-1',
      title: 'Software Engineering Intern',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      startDate: '2024-06',
      endDate: '2024-08',
      description: [
        'Developed microservices architecture for user authentication system serving 100k+ users',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
        'Collaborated with senior engineers on code reviews and architectural decisions',
        'Built automated testing suite achieving 95% code coverage'
      ],
      technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS', 'Jest'],
      type: 'internship'
    },
    {
      id: 'exp-2',
      title: 'Full-Stack Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      startDate: '2023-09',
      endDate: '2024-05',
      description: [
        'Built and maintained React-based dashboard for customer analytics',
        'Designed RESTful APIs handling 10k+ requests per minute',
        'Optimized database queries improving response times by 40%',
        'Mentored junior developers and conducted technical interviews'
      ],
      technologies: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'Redis', 'AWS'],
      type: 'job'
    }
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2022-08',
      endDate: '2026-05',
      gpa: '3.8',
      relevant_coursework: [
        'Data Structures and Algorithms',
        'Computer Systems',
        'Database Systems',
        'Software Engineering',
        'Machine Learning',
        'Computer Networks'
      ],
      achievements: [
        'Dean\'s List (Fall 2023, Spring 2024)',
        'CS Honor Society Member',
        'Hackathon Winner - Cal Hacks 2023'
      ]
    }
  ],
  skills: [
    {
      category: 'Programming Languages',
      items: ['TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'SQL', 'Bash']
    },
    {
      category: 'Frontend Development',
      items: ['React', 'Next.js', 'Vue.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Sass', 'Responsive Design']
    },
    {
      category: 'Backend Development',
      items: ['Node.js', 'Express', 'FastAPI', 'Django', 'REST APIs', 'GraphQL', 'Microservices']
    },
    {
      category: 'Databases',
      items: ['PostgreSQL', 'MongoDB', 'Redis', 'MySQL', 'Supabase', 'Database Design']
    },
    {
      category: 'DevOps & Cloud',
      items: ['Docker', 'Kubernetes', 'AWS', 'GitHub Actions', 'Terraform', 'CI/CD', 'Monitoring']
    },
    {
      category: 'Tools & Other',
      items: ['Git', 'Linux', 'VS Code', 'Figma', 'Postman', 'Jest', 'Agile/Scrum']
    }
  ]
}
