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

- Selected works: APeG, Visual Geometric 6-DoF Grasping, and E3GNet; plus the supplied 12-publication bibliography.
- Search and year filters, publication ordering, and formatted citation copying.
- Google Scholar and email links.
- Large, high-contrast typography; responsive layouts; expandable paper figures; and an animated robot concept illustration.
- No login, analytics, remote fonts, forms, or server-side data collection.

Publication metadata follows the supplied Google Scholar snapshot. Citation counts are dated November 2026 and are not live. The hero is a concept illustration. All three selected works use original figures with sources listed below.

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


## Motion and readability

The dark navy and mint interface uses 20–22 px introduction text, 18 px author names, and at least 16 px metadata. The hero shows a cluttered bin with stacked blocks, cylinders, and scattered parts next to a separate placement tray. A humanoid with a head, torso, two arms, and legs uses a spatial shoulder–elbow–wrist chain to select and grasp three blocks from top to bottom, lift above the clutter, transfer, set down, and release. Each block follows the working gripper only while held and remains in the tray after release. The reverse sequence restacks the blocks from bottom to top, so the 72-second loop has no teleporting resets. The working arm is solved in three dimensions and projected into the scene, with head tracking and a slight torso lean. Both wrists use the same compact parallel gripper. The working gripper approaches from above and closes symmetrically along an isometric cube axis; its pads meet opposite faces. Rear and front jaw layers keep the target visible throughout approach, grasp, and release. The other gripper waits beside the bin. No articulated hands or finger-curl animation are used. Depth ordering, body motion, target scanning, the transfer path, and placement ripples share the robot clock and stop with Pause motion. A lightweight point network provides the background. Cards enter as visitors scroll, and the header shows reading progress.

The Pause motion control stops animation and remembers the preference in localStorage on that browser. A reduced-motion system preference starts the site paused; visitors may explicitly enable it. The canvas stops rendering when the hero is offscreen or the tab is hidden. All content remains available without JavaScript.


## Profile

Yixiang Dai is a PhD student in the Department of Electronic Engineering, Tsinghua University. He received his bachelor's degree from the School of Vehicle and Mobility, Tsinghua University, in 2023, as supplied by him. Research interests are robotic manipulation, reinforcement learning, VLA, and WAM (World Action Model), with an emphasis on stacked and occluded scenes requiring long-horizon manipulation. The portrait was supplied by Yixiang Dai and is stored unchanged; framing is handled in CSS.

The profile statement is “Enabling robots to understand the world and act within it.” The school name follows https://eng.svm.tsinghua.edu.cn/info/1002/1026.htm; the graduation year and degree are supplied by Yixiang Dai.
