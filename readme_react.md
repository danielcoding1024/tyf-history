# Tongyuanfang Historical Memory H5 Project Technical Documentation

## 📋 Project Overview

Tongyuanfang Historical Memory is a mobile H5 application developed with React + TypeScript + Vite, designed to showcase the history, architecture, figures, and oral history of Tongyuanfang Catholic Church. The project adopts modern frontend technology stack, providing smooth user experience and rich interactive features.

## 🎨 Design Philosophy

### 1. Overall Architecture Design

#### 1.1 Mobile-First Design
- **Responsive Layout**: Designed with 375px × 812px (iPhone X standard size) as the baseline
- **Single Page Application (SPA)**: Uses React Router for page routing, providing smooth page transition experience
- **Unified Global Background**: All pages use a unified background image to maintain visual consistency

#### 1.2 Component-Based Development
- **Reusable Components**: Encapsulate common functionality into independent components (language switching, carousel, animations, etc.)
- **Separation of Concerns**: Page components, business components, and animation components are managed in layers
- **Configuration-Driven**: Resource paths and text content are managed uniformly through configuration files for easy maintenance and extension

#### 1.3 Internationalization Design
- **Bilingual Support**: Complete Chinese/English switching functionality
- **State Management**: Uses Zustand to manage global language state
- **Content Adaptation**: All text, images, and PDFs are dynamically loaded based on language

### 2. User Experience Design

#### 2.1 Visual Design
- **Unified Fonts**: English uses Times New Roman, Chinese uses system fonts
- **Color Scheme**: Primary color `#d8c3ae`, creating a historical atmosphere
- **Image Optimization**: Comprehensive use of WebP format to improve loading speed
- **Animation Effects**: Breathing animations and typewriter effects enhance interactive experience

#### 2.2 Interaction Design
- **Navigation Flow**: Cover → Home → Detail → Chat, clear user path
- **Fixed Elements**: Chat page header and input box are fixed, content area scrolls
- **Audio Playback**: Oral history page supports audio playback with visual playback state
- **Scroll Optimization**: Hidden scrollbars to keep interface clean

### 3. Performance Optimization Design

#### 3.1 Resource Management
- **On-Demand Loading**: Route-level code splitting
- **Resource Compression**: Use WebP format to reduce image size
- **Lazy Loading**: Images and components loaded on demand

#### 3.2 State Management
- **Lightweight State Library**: Use Zustand instead of Redux to reduce bundle size
- **Local State**: Component internal state managed with React Hooks
- **State Persistence**: Language selection state persists during session

## 🚀 Implemented Features

### 1. Page Features

#### 1.1 Cover Page
- **Title Display**: Uses image format title with transparent background support
- **Main Image Display**: Building image centered with left and right margins
- **Language Switch**: Language switching button in the top right corner
- **Description Text**: Bilingual description information with adjustable font color
- **Start Button**: Image format button that navigates to home page

#### 1.2 Home Page
- **Title Display**: Supports image or text format title
- **Main Image Display**: Home page main image with click-to-view details support
- **Read E-book**: Opens corresponding PDF file based on language
- **Question Button**: Typewriter animation effect, click to enter chat page
- **Timeline Navigation**: 4 category entries (Overview/History/Architecture/Voices)
- **Language Switch**: Located between title and main image

#### 1.3 Detail Page
- **Category Display**: Supports 4 categories (Overview/History/Architecture/Voices)
- **Carousel**: Architecture category supports multi-image carousel
- **Tab Switching**: Different categories display different tab content
- **Oral History Features**:
  - 3 oral history stories with bilingual support (Chinese/English)
  - Each story corresponds to an audio file (MP3)
  - Audio playback control (play/pause)
  - Visual playback state (muted icon/playing icon)
  - Automatically stops audio when switching pages
- **Back Navigation**: Return to home page functionality
- **Chat Entry**: Enter chat page

#### 1.4 Chat Page
- **Fixed Header**: Title centered, back button on the left
- **Greeting Area**: Greeting bubble + digital avatar model (breathing animation)
- **Message Display**:
  - User messages right-aligned
  - Bot messages left-aligned
  - Bubble background images adapt automatically
- **Suggested Questions**: Display corresponding question list based on language
- **Input Box**: Fixed at bottom, width adapted to H5 size
- **API Integration**: Pure English interface with error handling support

### 2. Component Features

#### 2.1 LanguageSwitch Component
- **Bilingual Switching**: Chinese/English switching
- **State Synchronization**: Global state management, synchronized across all pages
- **Visual Feedback**: Current language highlighted

#### 2.2 Carousel Component
- **Auto Play**: Supports automatic carousel
- **Manual Switching**: Click to switch images
- **Infinite Loop**: Loop playback

#### 2.3 BreathingAnimation Component
- **CSS Animation**: Uses CSS keyframes to achieve breathing effect
- **Reusable**: Wraps any child elements
- **Performance Optimization**: Uses transform and opacity for hardware acceleration

#### 2.4 Typewriter Component
- **Character-by-Character Display**: Text displays character by character animation
- **Configurable**: Supports speed, delay, and other configurations

### 3. Core Features

#### 3.1 Resource Management
- **Unified Configuration**: All resource paths configured in `assets.config.ts`
- **Format Support**: Supports PNG, JPG, WebP, PDF, MP3, and other formats
- **Path Management**: Relative path management for easy deployment

#### 3.2 State Management
- **Global State**: Language state managed with Zustand
- **Local State**: Component internal state uses React Hooks
- **State Synchronization**: Language switching affects all page content

#### 3.3 Route Management
- **Page Routing**: Uses React Router to implement SPA routing
- **Parameter Routing**: Detail page supports category parameters
- **Navigation Guard**: Default route redirects to cover page

#### 3.4 Audio Management
- **Audio Playback**: HTML5 Audio API
- **State Management**: Playback state managed with React Hooks
- **Lifecycle**: Automatically stops audio when switching pages and component unmounts
- **Multi-Audio Control**: Only one audio can play at a time

## 🛠️ Development Technology Stack

### 1. Core Frameworks

#### 1.1 React 19
- **Version**: 19.2.0
- **Features**: Functional components, Hooks API, Context API
- **Advantages**: Component-based development, Virtual DOM, performance optimization

#### 1.2 TypeScript
- **Version**: 5.9.3
- **Features**: Type safety, interface definitions, generic support
- **Advantages**: Code hints, type checking, refactoring-friendly

#### 1.3 Vite
- **Version**: 7.2.4
- **Features**: Fast build, HMR, ESM support
- **Advantages**: Great development experience, fast build speed, simple configuration

### 2. Routing and State Management

#### 2.1 React Router
- **Version**: 6.28.0
- **Features**: Page routing, parameter routing, navigation guards
- **Use Cases**: Page navigation, route parameter passing

#### 2.2 Zustand
- **Version**: 4.5.5
- **Features**: Lightweight state management, global state sharing
- **Use Cases**: Language state management

### 3. Styling and Animation

#### 3.1 CSS3
- **Features**:
  - Flexbox layout
  - Grid layout (partial use)
  - CSS Variables
  - Keyframes animations
  - Transform and Transition
- **Advantages**: Good performance, strong compatibility, easy maintenance

#### 3.2 Animation Techniques
- **Breathing Animation**: Uses CSS keyframes + transform scale
- **Typewriter Effect**: JavaScript controls character-by-character text display
- **Transition Animation**: CSS transition for smooth transitions

### 4. Build and Development Tools

#### 4.1 Vite Plugins
- **@vitejs/plugin-react**: React support
- **Features**: JSX transformation, HMR, Fast Refresh

#### 4.2 ESLint
- **Version**: 9.39.1
- **Configuration**: React Hooks rules, TypeScript rules
- **Features**: Code checking, code standards

### 5. Resource Formats

#### 5.1 Image Formats
- **WebP**: Primary image format, small size, high quality
- **PNG**: Transparent background images
- **GIF**: Animated images (partial use)

#### 5.2 Other Formats
- **PDF**: E-book files
- **MP3**: Audio files

### 6. API Integration

#### 6.1 HTTP Requests
- **Fetch API**: Native browser API
- **Error Handling**: Network errors, HTTP errors, response format errors
- **Request Configuration**: Content-Type, request body format

#### 6.2 Proxy Configuration
- **Development Proxy**: Vite development server proxy
- **Production Deployment**: Requires reverse proxy configuration

## 📁 Project Structure

```
frontend/
├── public/                    # Static resources directory
│   └── assets/               # Resource files
│       ├── images/           # Image resources
│       └── pdfs/             # PDF files
├── src/
│   ├── components/           # Components directory
│   │   ├── animations/       # Animation components
│   │   │   ├── BreathingAnimation.tsx
│   │   │   ├── BreathingAnimation.css
│   │   │   ├── Typewriter.tsx
│   │   │   └── Typewriter.css
│   │   ├── Carousel.tsx      # Carousel component
│   │   ├── Carousel.css
│   │   ├── LanguageSwitch.tsx  # Language switch component
│   │   └── LanguageSwitch.css
│   ├── config/               # Configuration files
│   │   ├── assets.config.ts  # Resource path configuration
│   │   ├── design.config.ts  # Design configuration
│   │   └── questions.config.ts  # Questions configuration
│   ├── pages/                # Page components
│   │   ├── Cover.tsx         # Cover page
│   │   ├── Cover.css
│   │   ├── Home.tsx          # Home page
│   │   ├── Home.css
│   │   ├── Detail.tsx        # Detail page
│   │   ├── Detail.css
│   │   ├── Chat.tsx          # Chat page
│   │   └── Chat.css
│   ├── store/                # State management
│   │   └── languageStore.ts  # Language state
│   ├── App.tsx               # Main application component
│   ├── App.css               # Global styles
│   ├── index.css             # Base styles
│   └── main.tsx              # Entry file
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies
```

## 🔧 Key Technical Implementations

### 1. Language Switching Implementation

```typescript
// Use Zustand to manage global language state
const useLanguageStore = create<LanguageState>((set) => ({
  language: 'EN' as Language,
  setLanguage: (lang: Language) => set({ language: lang }),
  toggleLanguage: () => set((state) => ({
    language: state.language === 'CN' ? 'EN' : 'CN'
  })),
}));
```

### 2. Audio Playback Implementation

```typescript
// Use useRef to manage audio instances
const audioRefs = useRef<Array<HTMLAudioElement | null>>([null, null, null]);
const [playingIndex, setPlayingIndex] = useState<number | null>(null);

// Automatically stop audio when switching pages
useEffect(() => {
  return () => {
    audioRefs.current.forEach((audio) => {
      if (audio && !audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  };
}, []);
```

### 3. Resource Path Management

```typescript
// Unified configuration of all resource paths
export const assetsConfig = {
  voices: {
    cn: [voiceCn01, voiceCn02, voiceCn03],
    en: [voiceEn01, voiceEn02, voiceEn03],
    playing: voicePlaying,
    muted: voiceMuted,
  },
  // ...
};
```

### 4. Responsive Layout

```css
/* Use CSS Variables to uniformly manage design variables */
:root {
  --font-title: 'Times New Roman', Times, serif;
  --font-body: 'Times New Roman', Times, serif;
  --font-chinese: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
}

/* Mobile adaptation */
@media (max-width: 375px) {
  #root {
    max-width: 100vw;
  }
}
```

## 🎯 Performance Optimization Strategies

### 1. Resource Optimization
- **WebP Format**: All images use WebP format, reducing size by 30-50%
- **On-Demand Loading**: Route-level code splitting
- **Lazy Loading**: Images and components loaded on demand

### 2. Code Optimization
- **Component Reuse**: Reduce duplicate code
- **State Management**: Reasonable use of global and local state
- **Event Handling**: Avoid unnecessary re-renders

### 3. Rendering Optimization
- **CSS Animations**: Use transform and opacity for hardware acceleration
- **Virtual Scrolling**: Use virtual scrolling for long lists (if needed)
- **Debounce/Throttle**: Use debounce/throttle for scroll and input events

## 🔒 Browser Compatibility

- **iOS Safari**: 12+
- **Chrome Mobile**: 90+
- **Other Modern Mobile Browsers**: Support ES6+ and CSS3

## 📝 Development Standards

### 1. Code Standards
- **TypeScript**: Strict mode, type checking
- **ESLint**: Code standard checking
- **Naming Conventions**: Components use PascalCase, files use kebab-case

### 2. Component Standards
- **Functional Components**: Use functional components and Hooks
- **Props Types**: Define clear Props interfaces
- **Style Isolation**: Each component has independent CSS file

### 3. Commit Standards
- **Commit Messages**: Clear commit messages
- **Code Review**: Important features require code review

## 🚀 Deployment Instructions

### 1. Build Production Version

```bash
npm run build
```

### 2. Deployment Requirements
- **Static File Server**: Nginx, Apache, etc.
- **Route Configuration**: Requires SPA route redirect configuration
- **API Proxy**: Requires backend API proxy configuration

### 3. Environment Variables
- **API Address**: Production environment requires correct API address configuration
- **Resource Paths**: Ensure resource paths are correct

## 📚 References

- [React Official Documentation](https://react.dev/)
- [TypeScript Official Documentation](https://www.typescriptlang.org/)
- [Vite Official Documentation](https://vitejs.dev/)
- [React Router Official Documentation](https://reactrouter.com/)
- [Zustand Official Documentation](https://zustand-demo.pmnd.rs/)

## 📄 License

This project is an internal project, copyright belongs to the project owner.

---

**Document Version**: 1.0.0  
**Last Updated**: January 2025  
**Maintainer**: Development Team
