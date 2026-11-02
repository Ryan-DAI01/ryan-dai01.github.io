# Yixiang Dai — academic homepage

English personal homepage for Yixiang Dai at Tsinghua University.

Configured address: https://ryan-dai01.github.io/

## Publish with GitHub Pages

Repository: `Ryan-DAI01/ryan-dai01.github.io`

In **Settings → Pages**, choose **Deploy from a branch**, then **main** and **/docs**.
The committed `docs/` directory is ready to serve. `.nojekyll` disables Jekyll processing.
This repository uses plain HTML, CSS, JavaScript, and SVG; there are no runtime dependencies.

## Update the website

1. Edit `publications.json` for papers.
2. Edit `src/index.template.html` for the introduction, selected research, or contact details.
3. Edit `src/styles.css` or `src/main.js` for appearance and interactions.
4. Run `node build.mjs`, then commit and push the source and `docs/` changes.

Node.js 18 or newer is sufficient for the build. The repository does not need npm packages.

Preview locally:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

Open http://127.0.0.1:4173.

## Content

- Three selected first-author works and the supplied 12-publication bibliography.
- Search, year and authorship filters, and formatted citation copying.
- Google Scholar and email links.
- Responsive layouts and original conceptual SVG illustrations.
- No login, analytics, remote fonts, forms, or server-side data collection.

Publication metadata follows the supplied Google Scholar snapshot. Citation counts are dated November 2026 and are not live. The conceptual illustrations are not experimental results.

Research description sources:
- https://chenthree.github.io/publication/2025-08-13-APeG
- https://chenthree.github.io/publication/2025-03-03-Uncertainty-8

GitHub Pages documentation:
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Publication order and search visibility

The default bibliography shows first-author papers first, with each group ordered by the supplied citation counts. Visitors can also sort by year or citations. The built HTML contains all 12 papers without requiring JavaScript.

The homepage identifies Yixiang Dai using a consistent title, site name, and WebSite/Person/ProfilePage structured data. robots.txt permits crawling, and sitemap.xml includes the canonical homepage URL and its update date.

To request Google indexing, verify the URL-prefix property https://ryan-dai01.github.io/ in Google Search Console, submit sitemap.xml, and use URL Inspection to request indexing. Verification and indexing requests require the owner’s Google account. Crawling, indexing, and ranking are controlled by Google; these settings do not guarantee placement for a name search. Add the homepage URL to the public Google Scholar and GitHub profiles when possible.
