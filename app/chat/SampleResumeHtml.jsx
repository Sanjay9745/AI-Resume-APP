// Sample resume HTML templates for preview functionality
export const getSampleResumeHtml = () => {
  return `
    <div class="header">
      <h1>John Doe</h1>
      <div class="contact-info">
        <span>john.doe@example.com</span>
        <span>•</span>
        <span>(91) 123-4567</span>
        <span>•</span>
        <span>New York, NY</span>
        <span>•</span>
        <span>linkedin.com/in/johndoe</span>
      </div>
    </div>
    
    <div class="section">
      <h2>Summary</h2>
      <p>Experienced software engineer with over 5 years of expertise in developing mobile applications using React Native and cross-platform solutions. Passionate about creating performant and user-friendly applications with clean code practices.</p>
    </div>
    
    <div class="section">
      <h2>Experience</h2>
      
      <div class="experience-item">
        <div class="job-title">Senior Mobile Developer</div>
        <div class="company-date">
          <div>TechCorp Inc.</div>
          <div>Jan 2021 - Present</div>
        </div>
        <ul>
          <li>Led development of flagship mobile application with React Native, achieving 4.8 star rating on app stores.</li>
          <li>Implemented CI/CD pipelines that reduced deployment time by 70%.</li>
          <li>Mentored junior developers and conducted code reviews to ensure code quality.</li>
          <li>Optimized app performance resulting in 40% reduction in load times.</li>
        </ul>
      </div>
      
      <div class="experience-item">
        <div class="job-title">Mobile Developer</div>
        <div class="company-date">
          <div>App Solutions LLC</div>
          <div>Mar 2018 - Dec 2020</div>
        </div>
        <ul>
          <li>Developed and maintained multiple React Native applications for clients in finance and healthcare sectors.</li>
          <li>Collaborated with UX/UI designers to implement pixel-perfect interfaces.</li>
          <li>Created reusable component libraries that increased development speed by 30%.</li>
        </ul>
      </div>
    </div>
    
    <div class="section">
      <h2>Education</h2>
      <div class="education-item">
        <div class="degree">Bachelor of Science in Computer Science</div>
        <div class="school-date">
          <div>University of Technology</div>
          <div>2014 - 2018</div>
        </div>
        <p>Graduated with honors. Specialization in Mobile Computing.</p>
      </div>
    </div>
    
    <div class="section">
      <h2>Skills</h2>
      <div class="skills">
        <div class="skill">React Native</div>
        <div class="skill">JavaScript</div>
        <div class="skill">TypeScript</div>
        <div class="skill">Redux</div>
        <div class="skill">Node.js</div>
        <div class="skill">GraphQL</div>
        <div class="skill">Git</div>
        <div class="skill">CI/CD</div>
        <div class="skill">Firebase</div>
        <div class="skill">AWS</div>
        <div class="skill">Unit Testing</div>
        <div class="skill">UI/UX Design</div>
      </div>
    </div>
    
    <div class="section">
      <h2>Projects</h2>
      <div class="experience-item">
        <div class="job-title">Health Tracker App</div>
        <div>An open-source mobile application for tracking health metrics, with over 10k downloads.</div>
        <ul>
          <li>Implemented real-time data synchronization using Firebase.</li>
          <li>Integrated with health devices using Bluetooth connectivity.</li>
        </ul>
      </div>
    </div>
  `;
};

// Additional templates can be added here
export const getMinimalResumeHtml = () => {
  return `
    <div class="header">
      <h1>Jane Smith</h1>
      <div class="contact-info">
        <span>jane.smith@example.com</span>
        <span>•</span>
        <span>(555) 987-6543</span>
        <span>•</span>
        <span>San Francisco, CA</span>
      </div>
    </div>
    
    <div class="section">
      <h2>Professional Profile</h2>
      <p>Marketing specialist with 3+ years of experience in digital marketing and social media campaigns. Proven track record of increasing engagement and conversion rates.</p>
    </div>
    
    <div class="section">
      <h2>Work History</h2>
      <div class="experience-item">
        <div class="job-title">Marketing Specialist</div>
        <div class="company-date">
          <div>Digital Trends Agency</div>
          <div>2020 - Present</div>
        </div>
        <ul>
          <li>Managed social media accounts increasing follower base by 45% in 6 months</li>
          <li>Developed email marketing campaigns with 28% open rate (industry average: 20%)</li>
        </ul>
      </div>
    </div>
    
    <div class="section">
      <h2>Education</h2>
      <div class="education-item">
        <div class="degree">BA in Marketing Communications</div>
        <div class="school-date">
          <div>State University</div>
          <div>2016 - 2020</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2>Skills</h2>
      <div class="skills">
        <div class="skill">Social Media Marketing</div>
        <div class="skill">Content Creation</div>
        <div class="skill">SEO/SEM</div>
        <div class="skill">Email Marketing</div>
        <div class="skill">Adobe Creative Suite</div>
        <div class="skill">Google Analytics</div>
      </div>
    </div>
  `;
};