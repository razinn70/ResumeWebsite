# Portfolio Customization Guide

This guide will help you customize your portfolio website with your own information and preferences.

## 📝 Quick Start Customization

### 1. Personal Information

Edit `data/portfolio.ts` to update your personal information:

```typescript
personal: {
  name: 'Your Full Name',
  title: 'Your Title/Role',
  roles: [
    'Your Primary Role',
    'Your Secondary Role',
    'Your Tertiary Role'
  ],
  email: 'your.email@example.com',
  location: 'Your City, State/Country',
  bio: 'Your personal bio/description...',
  avatar: '/your-avatar.jpg' // Add your photo to public folder
}
```

### 2. Social Media Links

Update the social links array:

```typescript
social: [
  {
    name: 'GitHub',
    url: 'https://github.com/yourusername',
    icon: 'github'
  },
  {
    name: 'LinkedIn', 
    url: 'https://linkedin.com/in/yourusername',
    icon: 'linkedin'
  },
  // Add more social links...
]
```

### 3. Projects

Add your projects in the projects array:

```typescript
projects: [
  {
    id: 'unique-project-id',
    title: 'Project Name',
    description: 'Brief description of your project...',
    technologies: ['React', 'TypeScript', 'Next.js'],
    year: 2024,
    featured: true, // Set to true for featured projects
    liveUrl: 'https://your-project.com',
    githubUrl: 'https://github.com/yourusername/project',
    status: 'completed'
  },
  // Add more projects...
]
```

### 4. Experience & Education

Update your work experience and education:

```typescript
experience: [
  {
    id: 'exp-1',
    title: 'Job Title',
    company: 'Company Name',
    location: 'City, State',
    startDate: '2024-01',
    endDate: '2024-12', // or undefined for current
    description: [
      'Bullet point describing your achievements',
      'Another accomplishment',
    ],
    technologies: ['Tech', 'Stack', 'Used'],
    type: 'internship' // or 'job', 'freelance', 'volunteer'
  }
]
```

### 5. Skills

Organize your skills by category:

```typescript
skills: [
  {
    category: 'Programming Languages',
    items: ['JavaScript', 'TypeScript', 'Python', 'Java']
  },
  {
    category: 'Frontend Development', 
    items: ['React', 'Next.js', 'Vue.js', 'Tailwind CSS']
  },
  // Add more skill categories...
]
```

## 🎨 Design Customization

### Colors

Edit `tailwind.config.js` to change the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Change these hex values to your preferred colors
        50: '#f0f9ff',
        100: '#e0f2fe',
        // ... rest of color scale
        900: '#0c4a6e',
      },
    },
  },
}
```

### Typography

Update fonts in `app/layout.tsx`:

```typescript
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

// Add custom Google Fonts as needed
```

### Animations

Modify animations in `app/globals.css`:

```css
@keyframes yourCustomAnimation {
  from { /* starting state */ }
  to { /* ending state */ }
}

.your-custom-class {
  animation: yourCustomAnimation 1s ease-in-out;
}
```

## 🖼️ Assets

### Adding Your Photo

1. Add your profile photo to `public/avatar.jpg`
2. Update the avatar path in `data/portfolio.ts`
3. Optimize the image (recommended: 400x400px, WebP format)

### Project Screenshots

1. Add project images to `public/projects/`
2. Update project objects with image paths:

```typescript
{
  // ... other project properties
  image: '/projects/your-project-screenshot.jpg'
}
```

### Favicon

Replace the default favicon files in the `public/` directory:
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`

## 🔧 Advanced Customization

### Adding New Sections

1. Create a new component in `components/`
2. Import and add it to `app/page.tsx`
3. Add navigation link in `components/navigation.tsx`

### Custom Components

Create reusable components for repeated elements:

```typescript
// components/custom-card.tsx
export function CustomCard({ title, content }: Props) {
  return (
    <div className="custom-card">
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  )
}
```

### Metadata & SEO

Update SEO information in `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: 'Your Name - Your Title',
  description: 'Your customized description...',
  // Update other metadata fields
}
```

## 🚀 Deployment

### Domain & URLs

Before deploying, update these files with your domain:

1. `public/sitemap.xml` - Update URLs
2. `public/robots.txt` - Update sitemap URL  
3. `app/layout.tsx` - Update metadataBase URL

### Environment Variables

For production, you may want to add:

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## 📱 Testing Your Changes

1. Run the development server: `npm run dev`
2. Test on different devices and screen sizes
3. Check accessibility with browser dev tools
4. Validate HTML and run Lighthouse audits

## 🔄 Keeping Content Updated

### Regular Updates

- Add new projects as you complete them
- Update your skills as you learn new technologies
- Keep experience section current
- Update bio and roles as you grow

### Content Strategy

- Feature your best 4-6 projects
- Keep descriptions concise but informative
- Use action verbs in experience descriptions
- Highlight measurable achievements

## 🆘 Troubleshooting

### Common Issues

**Build Errors**: Check TypeScript types and imports
**Styling Issues**: Verify Tailwind classes and custom CSS
**Performance**: Optimize images and minimize JavaScript

### Getting Help

- Check the Next.js documentation
- Review Tailwind CSS docs for styling
- Use browser dev tools for debugging
- Check the GitHub repository for updates

---

Remember to test your changes thoroughly and keep your content professional and up-to-date!
