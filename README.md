<div align="center">

# 🎯 Card Sorting Platform - Free Open Source UX Research Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-4285F4?logo=vercel&logoColor=white)](https://card-sorting-ux.vercel.app/)

**The most powerful, free, and privacy-focused card sorting tool for UX designers, product owners, and researchers.**

Validate information architecture, test menu structures, and uncover users' mental models - all in the browser with no server required.

[🚀 Try Live Demo](https://card-sorting-ux.vercel.app/) • [📖 Documentation](#-how-to-use) • [🐛 Report Bug](https://github.com/HydrogenB/CardSorting-UX/issues)

</div>
---

<div align="center">

**⭐ Star this repo if it helped you!**

Made with ❤️ by [Jirad Srirattana-arporn](https://th.linkedin.com/in/jirads)

[![GitHub stars](https://img.shields.io/github/stars/HydrogenB/CardSorting-UX?style=social)](https://github.com/HydrogenB/CardSorting-UX)
[![GitHub forks](https://img.shields.io/github/forks/HydrogenB/CardSorting-UX?style=social)](https://github.com/HydrogenB/CardSorting-UX/fork)

[Back to Top ↑](#-card-sorting-platform---free-open-source-ux-research-tool)

</div>


---

## 🚀 Why Choose This Card Sorting Tool?

✅ **100% Free & Open Source** - No hidden costs, no premium tiers  
✅ **Privacy-First** - All data stays in your browser, never sent to servers  
✅ **Works Offline** - Perfect for user testing in any environment  
✅ **Image Support** - Add visual cards and category banners (16:9 aspect ratio)  
✅ **Multi-language** - English & Thai support with professional UX writing  
✅ **Real-time Collaboration Ready** - Export/import JSON templates  
✅ **Professional Results** - Export detailed analytics for stakeholder presentations  

---

## 🎯 Perfect For

### 👩‍💻 **UX Designers**
- Validate information architecture before development
- Test navigation structures with real users
- Create intuitive menu hierarchies
- Generate IA insights for stakeholder buy-in

### 👔 **Product Owners**
- Make data-driven decisions on feature organization
- Reduce support tickets through better navigation
- Optimize user onboarding flows
- Prioritize roadmap based on user mental models

### 🔬 **UX Researchers**
- Conduct open, closed, and hybrid card sorting studies
- Export results for quantitative analysis
- Compare multiple sorting patterns
- Generate dendrogram-ready data

---

## ✨ Key Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| 🎨 **Visual Card Design** | Add images to cards and categories (16:9) | More realistic testing with visual stimuli |
| 📊 **Three Sort Types** | Open, Closed, Hybrid | Flexibility for any research methodology |
| 🔄 **Drag & Drop Interface** | Smooth dnd-kit powered sorting | Reduced cognitive load for participants |
| 🌐 **Multi-language** | English & Thai support | Localized UX research |
| 📱 **Mobile Responsive** | Works on tablets and phones | Test users in their natural environment |
| 💾 **Local Storage** | Auto-saves progress | No data loss during sessions |
| 📤 **Export Templates** | Share study setups as JSON | Team collaboration made easy |
| 📈 **Rich Analytics** | Time tracking, move counts | Deeper insights into user behavior |
| 🔒 **Privacy Compliant** | GDPR & CCPA ready | Enterprise-friendly security |

---

## 🚀 Quick Start

### Option 1: Use Live Demo (No Installation)
1. Visit [Live Demo](https://card-sorting-ux.vercel.app/)
2. Create your study instantly
3. Export results when done

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/HydrogenB/CardSorting-UX.git
cd CardSorting-UX

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Option 3: Deploy Your Own
```bash
# Build for production
npm run build

# Deploy to Vercel, Netlify, or GitHub Pages
```

---

## 📖 How to Use

### 1. **Create Your Study** (Builder Page)
- Add categories (for closed/hybrid sorts)
- Create cards with optional images and descriptions
- Configure settings (randomization, unsure bucket, etc.)
- Export template for sharing

### 2. **Run the Study** (Studio Page)
- Import template or use builder
- Start card sorting session
- Participants sort cards by dragging and dropping
- Real-time progress tracking

### 3. **Analyze Results**
- Export detailed JSON results
- Includes timestamps, move counts, and final groupings
- Ready for analysis in Excel, R, or specialized tools

---

## 🆚 Comparison with Alternatives

| Feature | This Tool | OptimalWorkshop | UserZoom | Maze |
|---------|-----------|-----------------|----------|------|
| **Free Forever** | ✅ | ❌ | ❌ | ❌ |
| **No Registration** | ✅ | ❌ | ❌ | ❌ |
| **Works Offline** | ✅ | ❌ | ❌ | ❌ |
| **Image Support** | ✅ | ❌ | Premium | Premium |
| **Open Source** | ✅ | ❌ | ❌ | ❌ |
| **GDPR Compliant** | ✅ | ❌ | ✅ | ✅ |
| **Self-Hostable** | ✅ | ❌ | ❌ | ❌ |

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit/core
- **State Management**: Zustand
- **i18n**: Custom React Context
- **Storage**: LocalStorage with Zustand persist

---

## 🤝 Contributing

We welcome contributions! 

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋‍♀️ FAQ

**Q: Do I need to register or create an account?**  
A: No! The tool works entirely in your browser with no registration required.

**Q: Can I use this for commercial projects?**  
A: Yes, it's MIT licensed - free for personal and commercial use.

**Q: How do participants access my study?**  
A: Export your template, share the JSON file, and have participants import it.

**Q: Can I analyze results in Excel?**  
A: Yes! Export results as human-readable JSON that can be imported into Excel or other analysis tools.

**Q: Is it GDPR compliant?**  
A: Absolutely! No data leaves the browser, making it fully privacy compliant.

**Q: Does it work on mobile devices?**  
A: Yes, fully responsive with touch support for tablets and phones.

---

## 📞 Support & Contact

- 🐛 **Issues**: [GitHub Issues](https://github.com/HydrogenB/CardSorting-UX/issues)
- 💼 **LinkedIn**: [Jirad Srirattana-arporn](https://th.linkedin.com/in/jirads)
- 💻 **GitHub**: [@HydrogenB](https://github.com/HydrogenB).


---

## 👨‍💻 Author

<table>
  <tr>
    <td align="center">
      <a href="https://th.linkedin.com/in/jirads">
        <img src="https://github.com/HydrogenB.png" width="100px;" alt="Jirad Srirattana-arporn"/>
        <br />
        <sub><b>Jirad Srirattana-arporn</b></sub>
      </a>
      <br />
      <a href="https://github.com/HydrogenB" title="GitHub">💻</a>
      <a href="https://th.linkedin.com/in/jirads" title="LinkedIn">💼</a>
    </td>
  </tr>
</table>

- **GitHub**: [@HydrogenB](https://github.com/HydrogenB)
- **LinkedIn**: [Jirad Srirattana-arporn](https://th.linkedin.com/in/jirads)
- **Project**: [CardSorting-UX](https://github.com/HydrogenB/CardSorting-UX)


