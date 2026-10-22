# Richa Rai — Personal Portfolio (Jekyll)

A minimal, responsive personal portfolio website built with **Jekyll** and deployed via **GitHub Pages**.

---

## 📁 Project Structure

```
Richa Portfolio/
├── _config.yml              ← Site configuration (title, URL, author)
├── _data/
│   ├── skills.yml           ← Technical skills by category
│   ├── projects.yml         ← Featured project cards
│   └── learning.yml         ← "Currently exploring" items
├── _includes/
│   ├── head.html            ← <head> with meta tags, fonts, CSS link
│   ├── header.html          ← Navigation bar + mobile drawer
│   ├── hero.html            ← Hero section
│   ├── about.html           ← About me + pillars
│   ├── skills.html          ← Skills grid (loops _data/skills.yml)
│   ├── projects.html        ← Project cards (loops _data/projects.yml)
│   ├── learning.html        ← Learning journey (loops _data/learning.yml)
│   ├── contact.html         ← Contact links
│   └── footer.html          ← Footer with dynamic year
├── _layouts/
│   └── default.html         ← Base HTML layout
├── assets/
│   ├── css/style.css        ← All styles (design system)
│   └── js/main.js           ← Navigation, animations, interactions
├── index.html               ← Main page (front matter + includes)
├── Gemfile                  ← Ruby gem dependencies
├── _config.yml
└── .gitignore
```

> **Old files** (`style.css`, `main.js` at the root) are kept as originals.
> Jekyll uses `assets/css/style.css` and `assets/js/main.js` instead.

---

## 🚀 Running Locally

### 1. Install Ruby

Download and install Ruby+Devkit from **[rubyinstaller.org](https://rubyinstaller.org/downloads/)**.
Choose the **Ruby+Devkit** version (e.g. 3.2.x with Devkit). Run all default options.

### 2. Install Bundler and Jekyll

Open a new Command Prompt and run:

```bash
gem install bundler jekyll
```

### 3. Install project gems

In the portfolio folder:

```bash
cd "c:\Users\Richa rai\Documents\Richa Portfolio"
bundle install
```

### 4. Serve locally

```bash
bundle exec jekyll serve
```

Then open **http://localhost:4000** in your browser.

> Add `--livereload` to auto-refresh the browser when you save files:
> ```bash
> bundle exec jekyll serve --livereload
> ```

---

## 🏗️ Building for Production

```bash
bundle exec jekyll build
```

The generated static site is output to `_site/`. You can upload that folder to any static host.

---

## 📝 Customising Content

All content is in plain text files — no rebuilding needed when editing data files.

### Update your contact links

Edit [`_includes/contact.html`](_includes/contact.html) and replace the placeholder `href` values:

```html
<!-- Email -->
href="mailto:richa@example.com"

<!-- GitHub -->
href="https://github.com/your-actual-username"

<!-- LinkedIn -->
href="https://linkedin.com/in/richa-rai"
```

Remove `data-placeholder="true"` from each link once the real URL is set.

### Add or remove skills

Edit [`_data/skills.yml`](_data/skills.yml):

```yaml
- category: Programming
  tags:
    - Python
    - C
    - JavaScript   # ← add new skills here
```

### Add a new project

Edit [`_data/projects.yml`](_data/projects.yml) and add a new block:

```yaml
- number: "05"
  title: My New Project
  description: "What it does and what you learned."
  tech:
    - Python
    - Pandas
  github_url: "https://github.com/your-username/new-project"
  live_url: ""
  wip: false
```

### Update learning interests

Edit [`_data/learning.yml`](_data/learning.yml).

---

## 🌐 Deploying to GitHub Pages

### Option A — GitHub Pages (username.github.io)

1. Create a repo named `your-username.github.io` on GitHub.
2. In `_config.yml`, set:
   ```yaml
   url: "https://your-username.github.io"
   baseurl: ""
   ```
3. Push all files to the `main` branch.
4. Go to **Settings → Pages** and set Source to `main` / `/ (root)`.

GitHub Pages will build and serve your Jekyll site automatically.

### Option B — Project repo (username.github.io/portfolio)

1. Create a repo named `portfolio` (or any name) on GitHub.
2. In `_config.yml`, set:
   ```yaml
   url: "https://your-username.github.io"
   baseurl: "/portfolio"
   ```
3. Push all files to the `main` branch.
4. Go to **Settings → Pages** and set Source to `main` / `/ (root)`.

### Option C — Custom domain

1. Set your `url` to your custom domain in `_config.yml`.
2. Set `baseurl: ""`.
3. Create a `CNAME` file in the repo root containing just your domain:
   ```
   yourportfolio.com
   ```
4. Configure your DNS provider to point to GitHub Pages.

---

## ⚠️ Things Still Needing Your Attention

| Item | Where to edit |
|------|---------------|
| Real email address | `_includes/contact.html` — replace `your.email@example.com` |
| GitHub profile URL | `_includes/contact.html` — replace `#` with real URL |
| LinkedIn profile URL | `_includes/contact.html` — replace `#` with real URL |
| Project GitHub URLs | `_data/projects.yml` — fill in `github_url` for each project |
| Portfolio live URL | `_data/projects.yml` — fill in `live_url` for project 03 |
| Site URL | `_config.yml` — set `url` and `baseurl` before deploying |

---

*Designed and built by Richa Rai.*
