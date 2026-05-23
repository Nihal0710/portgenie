# PortGenie 2.0 - Quick Reference Guide

## 🎨 Key Color Classes

```tsx
// Background
.cyber-bg              // #050505
.bg-[#050505]         // Dark background

// Text Colors
.text-cyber-text              // White text
.text-cyber-text-secondary    // Gray text (#a1a1aa)
.text-glow                    // Red glowing text
.text-glow-lg                 // Larger red glow

// Borders & Effects
.border-cyber-red/30          // Semi-transparent red border
.border-cyber-red             // Full red border
.shadow-glow                  // Red glow shadow
.shadow-glow-lg               // Larger red glow
.shadow-neon                  // Neon box shadow

// Cards
.glass-card                   // Generic glassmorphic card
.glass-card-cyber             // Cyberpunk styled glass card
.glass-bg                     // Glass background
```

## 🎬 Animation Classes

```tsx
// Use with motion divs
animate={{ ... }}
className="animate-glow-pulse"    // Pulsing red glow
className="animate-float"         // Floating motion
className="animate-slide-in-up"   // Slide up entrance
className="animate-fade-in"       // Fade in
```

## 🧩 Component Usage Examples

### Using Skill Gap Analyzer
```tsx
import { SkillGapAnalyzer } from '@/components/ai/skill-gap-analyzer'

<SkillGapAnalyzer />
```

### Using Interview Simulator
```tsx
import { InterviewSimulator } from '@/components/ai/interview-simulator'

<InterviewSimulator />
```

### Using Recruiter Dashboard
```tsx
import { RecruiterDashboard } from '@/components/recruiter/recruiter-dashboard'

<RecruiterDashboard />
```

### Using Portfolio Analytics
```tsx
import { PortfolioAnalytics } from '@/components/ai/portfolio-analytics'

<PortfolioAnalytics />
```

### Using Profile Card
```tsx
import { ProfileCard } from '@/components/profile-card'

<ProfileCard
  name="John Doe"
  role="Senior Developer"
  bio="Building the future of AI"
  location="San Francisco"
  image="J"
  skills={["React", "TypeScript", "AWS"]}
  verified={true}
  score={92}
/>
```

### Using Auth Form
```tsx
import { CyberpunkAuthForm } from '@/components/auth/auth-form'

// Sign In
<CyberpunkAuthForm
  title="Welcome Back"
  subtitle="Sign in to your PortGenie account"
  isSignUp={false}
/>

// Sign Up
<CyberpunkAuthForm
  title="Join PortGenie"
  subtitle="Create your AI career identity"
  isSignUp={true}
/>
```

### Using Features Showcase
```tsx
import { FeaturesShowcase } from '@/components/features-showcase'

<FeaturesShowcase />
```

## 🎨 Tailwind Configuration Reference

### Custom Colors Available
```tsx
colors: {
  'cyber-bg': '#050505',
  'cyber-red': '#ff003c',
  'cyber-red-dark': '#8b0000',
  'cyber-red-glow': '#ff4d6d',
  'cyber-text': '#ffffff',
  'cyber-text-secondary': '#a1a1aa',
  'cyber-border': 'rgba(255, 0, 60, 0.2)',
  'cyber-border-strong': 'rgba(255, 0, 60, 0.5)',
}
```

### Custom Shadows
```tsx
boxShadow: {
  glow: '0 0 20px rgba(255, 0, 60, 0.5)',
  'glow-lg': '0 0 40px rgba(255, 0, 60, 0.6)',
  'glow-xl': '0 0 60px rgba(255, 0, 60, 0.7)',
  'neon': '0 0 10px rgba(255, 77, 109, 0.6), inset 0 0 10px rgba(255, 77, 109, 0.2)',
}
```

### Custom Animations
```tsx
animation: {
  'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
  'float': 'float 3s ease-in-out infinite',
  'slide-in-up': 'slide-in-up 0.5s ease-out',
  'fade-in': 'fade-in 0.8s ease-out',
  'shimmer': 'shimmer 2s infinite',
}
```

## 🎭 Framer Motion Imports

```tsx
import { motion } from 'framer-motion'
import { 
  containerVariants, 
  itemVariants,
  slideInLeftVariants,
  slideInRightVariants,
  scaleInVariants,
  glowPulseVariants,
  floatingVariants,
  tapVariants
} from '@/lib/animations'
```

## 🧬 Common Patterns

### Animated Container with Stagger
```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  <motion.div variants={itemVariants}>Item 1</motion.div>
  <motion.div variants={itemVariants}>Item 2</motion.div>
  <motion.div variants={itemVariants}>Item 3</motion.div>
</motion.div>
```

### Hover Glow Effect
```tsx
<motion.div
  className="glass-card-cyber"
  whileHover={{ 
    boxShadow: '0 0 40px rgba(255, 0, 60, 0.8)',
    scale: 1.02
  }}
>
  Content
</motion.div>
```

### Button with Tap Animation
```tsx
<motion.button
  className="btn-neon"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click Me
</motion.button>
```

### Floating Element
```tsx
<motion.div
  animate={{ 
    y: [0, -20, 0] 
  }}
  transition={{ 
    duration: 3, 
    repeat: Infinity 
  }}
>
  Floating Content
</motion.div>
```

### View-triggered Animation
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true, margin: "-100px" }}
>
  Animates when scrolled into view
</motion.div>
```

## 📐 Font Classes

```tsx
// Heading Font (Orbitron)
className="font-orbitron font-bold"

// Body Font (Space Grotesk)
className="font-space-grotesk"
className="font-sans"  // Default

// Font Weights
font-light      // 300
font-normal     // 400
font-medium     // 500
font-semibold   // 600
font-bold       // 700
font-black      // 900
```

## 🎯 Common Patterns for Pages

### Page with Hero Section
```tsx
<div className="min-h-screen bg-cyber-bg text-cyber-text relative overflow-hidden">
  {/* Background effects */}
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    <div className="absolute -top-40 -left-40 w-80 h-80 bg-cyber-red/10 rounded-full blur-3xl opacity-20"></div>
  </div>

  {/* Content */}
  <motion.div className="relative z-10">
    {/* Your content */}
  </motion.div>
</div>
```

### Section with Grid
```tsx
<section className="py-20 px-4 md:px-6 relative">
  <div className="container mx-auto max-w-6xl">
    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Cards */}
    </motion.div>
  </div>
</section>
```

### Card Component
```tsx
<motion.div
  className="glass-card-cyber p-6 rounded-xl border-2"
  whileHover={{ y: -8 }}
>
  <h3 className="font-orbitron font-bold text-white">Title</h3>
  <p className="text-cyber-text-secondary">Description</p>
</motion.div>
```

## 🚀 Performance Tips

### 1. Lazy Load Heavy Components
```tsx
const HeavyComponent = dynamic(() => import('@/components/heavy'), {
  loading: () => <Skeleton />,
  ssr: false
})
```

### 2. Animate Only When In View
```tsx
whileInView={{ opacity: 1 }}
viewport={{ once: true }}  // Animate only once
```

### 3. Use CSS for Hover States
```tsx
// Instead of animate
className="hover:shadow-glow transition-shadow"

// For complex interactions
whileHover={{ scale: 1.05 }}
```

## 🔧 Debugging Tips

### Check Colors
- Background: Should be #050505
- Text: Should be #ffffff
- Accents: Should be #ff003c

### Check Animations
- Use browser DevTools
- Check Framer Motion performance
- Monitor fps with Chrome DevTools

### Check Responsive
- Test on mobile (375px)
- Test on tablet (768px)
- Test on desktop (1024px+)

## 📦 Install New Dependencies

If you haven't installed yet:
```bash
npm install framer-motion gsap
```

## 🎨 Design Decision Quick Reference

| Element | Color | Font | Animation |
|---------|-------|------|-----------|
| Buttons | cyber-red | orbitron | hover scale + glow |
| Headings | cyber-text | orbitron | fade-in |
| Body Text | cyber-text-secondary | space-grotesk | none |
| Cards | cyber-red/20 | - | hover lift + glow |
| Borders | cyber-red/30 | - | none |
| Backgrounds | #050505 | - | none |

## 🆘 Common Issues & Solutions

**Issue**: Glow effect not showing
**Solution**: Check that element has `shadow-glow` class or use Tailwind colors properly

**Issue**: Animation not smooth
**Solution**: Reduce animation duration, check fps, remove unnecessary effects

**Issue**: Text not visible
**Solution**: Check contrast, use `text-cyber-text` or `text-white`

**Issue**: Mobile layout broken
**Solution**: Check responsive classes (md:, lg: prefixes), test with DevTools

---

## 📚 Files to Know

- `app/globals.css` - All theme styles
- `tailwind.config.ts` - Theme configuration
- `lib/animations.ts` - Reusable animation variants
- `components/ai/*` - AI feature components
- `components/recruiter/*` - Recruiter components

---

**Ready to build!** 🚀

