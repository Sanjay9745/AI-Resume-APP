export const RESUME_TEMPLATES = {
  technical: {
    title: "Software Engineer Template",
    content: `
      <div class="section">
        <h1>Software Engineer Resume</h1>
        <div class="contact-info">
          <p>email@example.com • (555) 123-4567 • City, State</p>
          <p>LinkedIn: /in/example • GitHub: github.com/example</p>
        </div>
      </div>

      <div class="section">
        <h2>Professional Summary</h2>
        <p>Senior Software Engineer with 5+ years of experience in full-stack development...</p>
      </div>

      <div class="section">
        <h2>Technical Skills</h2>
        <div class="skills-grid">
          <div class="skill-category">
            <h3>Languages</h3>
            <p>JavaScript, TypeScript, Python, Java</p>
          </div>
          <div class="skill-category">
            <h3>Frontend</h3>
            <p>React, Vue.js, Angular, HTML5, CSS3</p>
          </div>
          <div class="skill-category">
            <h3>Backend</h3>
            <p>Node.js, Express, Django, Spring Boot</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Work Experience</h2>
        <div class="experience">
          <h3>Senior Software Engineer</h3>
          <p class="company-info">Tech Company, Inc. • 2020 - Present</p>
          <ul>
            <li>Led development of microservices architecture...</li>
            <li>Implemented CI/CD pipeline reducing deployment time by 60%...</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <h2>Education</h2>
        <div class="education">
          <h3>Bachelor of Science in Computer Science</h3>
          <p>University Name • Graduated 2018</p>
        </div>
      </div>
    `
  },
  
  business: {
    title: "Business Professional Template",
    content: `
      <div class="section">
        <h1>Business Development Manager</h1>
        <div class="contact-info">
          <p>business@example.com • (555) 987-6543 • City, State</p>
          <p>LinkedIn: /in/business-example</p>
        </div>
      </div>

      <div class="section">
        <h2>Professional Summary</h2>
        <p>Results-driven Business Development Manager with 8+ years of experience...</p>
      </div>

      <div class="section">
        <h2>Core Competencies</h2>
        <div class="skills-grid">
          <div class="skill-category">
            <h3>Business Development</h3>
            <p>Strategic Planning, Market Analysis, Revenue Growth</p>
          </div>
          <div class="skill-category">
            <h3>Leadership</h3>
            <p>Team Management, Client Relations, Negotiations</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Professional Experience</h2>
        <div class="experience">
          <h3>Business Development Manager</h3>
          <p class="company-info">Business Corp • 2018 - Present</p>
          <ul>
            <li>Increased revenue by 150% through strategic partnerships...</li>
            <li>Led team of 10 sales professionals to exceed targets...</li>
          </ul>
        </div>
      </div>
    `
  },
  
  creative: {
    title: "Creative Professional Template",
    content: `
      <div class="section">
        <h1>Creative Director</h1>
        <div class="contact-info">
          <p>creative@example.com • (555) 234-5678 • City, State</p>
          <p>Portfolio: www.example.com</p>
        </div>
      </div>

      <div class="section">
        <h2>Profile</h2>
        <p>Award-winning Creative Director with 10+ years of experience...</p>
      </div>

      <div class="section">
        <h2>Skills & Expertise</h2>
        <div class="skills-grid">
          <div class="skill-category">
            <h3>Design</h3>
            <p>Adobe Creative Suite, UI/UX, Brand Development</p>
          </div>
          <div class="skill-category">
            <h3>Leadership</h3>
            <p>Team Management, Client Relations, Project Management</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Featured Projects</h2>
        <div class="experience">
          <h3>Brand Redesign - Major Client</h3>
          <p class="project-info">2022</p>
          <ul>
            <li>Led complete brand redesign increasing brand recognition by 40%...</li>
            <li>Managed team of 5 designers to deliver project ahead of schedule...</li>
          </ul>
        </div>
      </div>
    `
  }
};

export const getTemplateContent = (templateType) => {
  return RESUME_TEMPLATES[templateType]?.content || RESUME_TEMPLATES.technical.content;
};

export const getTemplateStyles = () => `
  <style>
    /* Base styles */
    .section {
      margin-bottom: 1.5rem;
      position: relative;
      break-inside: avoid;
    }
    
    /* Print-specific styles */
    @media print {
      @page {
        size: A4;
        margin: 2cm;
      }
      
      body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      .section {
        page-break-inside: avoid;
      }
      
      .page-break {
        page-break-after: always;
      }
      
      .drag-handle, .drop-zone, #toolbar {
        display: none !important;
      }
    }
    
    .contact-info {
      text-align: center;
      color: #666;
      margin-bottom: 1.5rem;
    }
    
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }
    
    .skill-category {
      background: #f8fafc;
      padding: 1rem;
      border-radius: 0.5rem;
    }
    
    .skill-category h3 {
      color: #1e40af;
      margin: 0 0 0.5rem 0;
    }
    
    .experience, .education {
      margin-bottom: 1rem;
    }
    
    .company-info, .project-info {
      color: #666;
      font-style: italic;
      margin: 0.25rem 0;
    }
    
    ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
    }
    
    li {
      margin-bottom: 0.25rem;
    }
    
    h1 {
      text-align: center;
      color: #1e40af;
      margin-bottom: 0.5rem;
    }
    
    h2 {
      color: #1e40af;
      border-bottom: 2px solid #93c5fd;
      padding-bottom: 0.25rem;
      margin-bottom: 1rem;
    }

    /* Enhanced PDF styling */
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      break-inside: avoid;
    }
    
    .skill {
      background-color: #f0f9ff;
      border: 1px solid #dbeafe;
      border-radius: 15px;
      padding: 5px 10px;
      color: #3b82f6;
      break-inside: avoid;
    }
    
    .experience-item, .education-item {
      break-inside: avoid;
      margin-bottom: 1rem;
    }
    
    ul, li {
      break-inside: avoid;
    }
    
    h1, h2, h3 {
      break-after: avoid;
    }
    
    .contact-info {
      break-inside: avoid;
      text-align: center;
      color: #666;
      margin-bottom: 1.5rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }
  </style>
`;