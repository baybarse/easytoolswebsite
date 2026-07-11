const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const SRC_DIR = path.join(ROOT_DIR, 'src');
const OUT_DIR = path.join(ROOT_DIR, 'out');

// Ensure out directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

// 1. Parse projects.txt
const projectsRaw = fs.readFileSync(path.join(ROOT_DIR, 'projects.txt'), 'utf-8');
const projectBlocks = projectsRaw.split('---').map(block => block.trim()).filter(Boolean);

const projects = [];
const allTags = new Set();

projectBlocks.forEach(block => {
  const lines = block.split('\n');
  const project = {};
  
  lines.forEach(line => {
    const splitIndex = line.indexOf(':');
    if (splitIndex > -1) {
      const key = line.slice(0, splitIndex).trim();
      const value = line.slice(splitIndex + 1).trim();
      project[key] = value;
    }
  });

  if (project.Tags) {
    const tags = project.Tags.split(',').map(t => t.trim());
    tags.forEach(t => allTags.add(t));
    project.tagsArray = tags;
  } else {
    project.tagsArray = [];
  }
  
  projects.push(project);
});

// 2. Generate Filters HTML
let filtersHtml = '';
allTags.forEach(tag => {
  filtersHtml += `\n        <button class="filter-btn" data-filter="${tag}">${tag}</button>`;
});

// 3. Generate Projects HTML
let projectsHtml = '';
projects.forEach(p => {
  const tagsHtml = p.tagsArray.map(t => `<span class="tag">${t}</span>`).join('');
  const linkPrimary = p.Link ? `<a href="${p.Link}" target="_blank" rel="noopener noreferrer" class="project-link link-primary">Visit Site</a>` : '';
  const linkSecondary = p.Repo ? `<a href="${p.Repo}" target="_blank" rel="noopener noreferrer" class="project-link link-secondary">GitHub Repo</a>` : '';
  
  const titleHtml = p.Link ? `<a href="${p.Link}" target="_blank" rel="noopener noreferrer">${p.Title || 'Proje'}</a>` : (p.Title || 'Proje');
  
  projectsHtml += `
            <div class="project-card" data-tags="${p.tagsArray.join(',').toLowerCase()}">
                <h3 class="project-title">${titleHtml}</h3>
                <p class="project-desc">${p.Description || ''}</p>
                <div class="project-tags">
                    ${tagsHtml}
                </div>
                <div class="project-links">
                    ${linkPrimary}
                    ${linkSecondary}
                </div>
            </div>`;
});

// 4. Read template and replace placeholders
let templateHtml = fs.readFileSync(path.join(SRC_DIR, 'index.template.html'), 'utf-8');
templateHtml = templateHtml.replace('{{FILTERS}}', filtersHtml);
templateHtml = templateHtml.replace('{{PROJECTS}}', projectsHtml);

// 5. Write index.html to out dir
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), templateHtml);

// 6. Copy CSS and JS to out dir
fs.copyFileSync(path.join(SRC_DIR, 'style.css'), path.join(OUT_DIR, 'style.css'));
fs.copyFileSync(path.join(SRC_DIR, 'script.js'), path.join(OUT_DIR, 'script.js'));

console.log(`✅ Build successful! Generated ${projects.length} projects.`);
