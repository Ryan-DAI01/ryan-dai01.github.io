# Yixiang Dai — academic homepage

English personal homepage for Yixiang Dai at Tsinghua University.

Configured address: https://ryan-dai01.github.io/

## Publish with GitHub Pages

Repository: `Ryan-DAI01/ryan-dai01.github.io`

In **Settings → Pages**, choose **Deploy from a branch**, then **main** and **/docs**.
The committed `docs/` directory is ready to serve. `.nojekyll` disables Jekyll processing.
This repository uses plain HTML, CSS, JavaScript, and SVG; there are no runtime dependencies.

## Update the website

1. Edit `publications.json` for papers and the selected-work figures, descriptions, and order.
2. Edit `src/index.template.html` for the introduction and contact details.
3. Edit `src/styles.css` or `src/main.js` for appearance and interactions.
4. Run `node build.mjs`, then commit and push the source and `docs/` changes.

Node.js 18 or newer is sufficient for the build. The repository does not need npm packages.

Preview locally:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

Open http://127.0.0.1:4173.

## Content

- Selected works: APeG, Visual Geometric 6-DoF Grasping, and E3GNet; plus the supplied 12-publication bibliography.
- Search and year filters, publication ordering, and formatted citation copying.
- Google Scholar and email links.
- A white academic layout, readable typography, responsive paper rows, and expandable original paper figures.
- No login, analytics, remote fonts, forms, or server-side data collection.

Publication metadata follows the supplied Google Scholar snapshot. Citation counts are dated November 2026 and are not live. All three selected works use original figures with sources listed below.

Research description sources:
- https://chenthree.github.io/publication/2025-08-13-APeG
- https://chenthree.github.io/publication/2025-03-03-Uncertainty-8

GitHub Pages documentation:
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Publication order and search visibility

The order of records in publications.json is the default bibliography order: APeG, Visual Geometric, Uncertainty, and E3GNet lead, followed by related work; Charging Patterns is last. The equalContribution array marks Kaiqin Yang and Yixiang Dai in E3GNet, as confirmed in the paper. Visitors can also sort by year or citations. The built HTML contains all 12 papers without requiring JavaScript.

The homepage identifies Yixiang Dai using a consistent title, site name, and WebSite/Person/ProfilePage structured data. robots.txt permits crawling, and sitemap.xml includes the canonical homepage URL and its update date.

To request Google indexing, verify the URL-prefix property https://ryan-dai01.github.io/ in Google Search Console, submit sitemap.xml, and use URL Inspection to request indexing. Verification and indexing requests require the owner’s Google account. Crawling, indexing, and ranking are controlled by Google; these settings do not guarantee placement for a name search. Add the homepage URL to the public Google Scholar and GitHub profiles when possible.

## Figure sources

- APeG framework: https://raw.githubusercontent.com/THU-VCLab/APeG/master/images/Framework.png
- VG-Grasp framework: supplied by Yixiang Dai, stored in src/assets/visual-geometric-framework.png.
- E3GNet, Figure 1: https://arxiv.org/html/2410.22980v3/images/framework.png

Paper figures are stored locally without changing their content. Click a paper figure to open it at a larger size. Without JavaScript, its link opens the original image directly.


## Layout and readability

The layout is inspired by https://jonbarron.info/: a centered white page, biography and portrait at the top, simple blue links, and vertical paper rows. The implementation uses semantic HTML and a responsive grid. No reference-site content or code is copied.

Introduction text is 19 px, paper titles 19 px, authors and descriptions 18 px, and paper metadata 17 px. On narrow screens the portrait moves above the biography and selected-work figures stack above their paper information. Search and sorting are available in a collapsed disclosure. The previous animated scene and decorative effects are no longer displayed or loaded.

All 12 papers and all three selected works are rendered by the build, including author names and equal-contribution marks, so they remain readable without JavaScript. JavaScript enhances search, sorting, figure enlargement, and citation copying. There are no external font or JavaScript dependencies.

## Profile

Yixiang Dai is a PhD student in the Department of Electronic Engineering, Tsinghua University. He received his bachelor's degree from the School of Vehicle and Mobility, Tsinghua University, in 2023, as supplied by him. Research interests are robotic manipulation, reinforcement learning, VLA, and WAM (World Action Model), with an emphasis on stacked and occluded scenes requiring long-horizon manipulation. The portrait was supplied by Yixiang Dai and is stored unchanged; framing is handled in CSS.

The profile statement is “Enabling robots to understand the world and act within it.” The school name follows https://eng.svm.tsinghua.edu.cn/info/1002/1026.htm; the graduation year and degree are supplied by Yixiang Dai.
