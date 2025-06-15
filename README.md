# Portfolio Website

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features dark/light mode toggle, smooth animations, and accessibility-first design.

## 🚀 Features

- **Responsive Design**: Works perfectly on all devices and screen sizes
- **Dark/Light Mode**: Automatic system detection with manual toggle
- **SEO Optimized**: Meta tags, Open Graph, and structured data
- **Accessible**: ARIA labels, keyboard navigation, and screen reader friendly
- **Performance**: Optimized loading, lazy images, and minimal bundle size
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **CI/CD Pipeline**: GitHub Actions with linting, testing, and deployment

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Deployment**: [Vercel](https://vercel.com/)

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio-site.git
cd portfolio-site
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Customization

### Personal Information

Edit the data in `data/portfolio.ts` to customize:

- Personal information and bio
- Social media links
- Skills and technologies
- Projects and experience
- Education details

### Styling

The design uses Tailwind CSS with custom components in `app/globals.css`. Key customizable elements:

- Color scheme in `tailwind.config.js`
- Typography and spacing
- Animation timing and effects
- Component styling

### Content

- **Hero Section**: Update personal info and roles
- **About Section**: Add experience, education, and skills
- **Projects**: Showcase your work with descriptions and links
- **Contact**: Update contact information and form handling

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com/)
3. Deploy automatically on every push to main branch

### Static Export

For static hosting (GitHub Pages, Netlify, etc.):

```bash
npm run build
npm run export
```

## 📈 Performance

This portfolio is optimized for performance:

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Excellent scores
- **Bundle Size**: Minimal JavaScript payload
- **Images**: Optimized and lazy-loaded
- **Fonts**: Efficient loading with font display swap

## 🧪 Testing & Quality

- **ESLint**: Code linting and style enforcement
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety and better DX
- **GitHub Actions**: Automated CI/CD pipeline

Run quality checks:

```bash
npm run lint        # ESLint
npm run type-check  # TypeScript
npm run format      # Prettier
```

## 📱 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from [EDH.dev](https://edh.dev)
- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)

---

**Built with ❤️ by [Your Name](https://yourwebsite.com)**
