import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,mkdirSync,cpSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(readFileSync(path.join(root,'site.config.json'),'utf8'));
const siteUrl = new URL(config.url);
if(siteUrl.protocol !== 'https:' || siteUrl.pathname !== '/' || siteUrl.search || siteUrl.hash || siteUrl.username || siteUrl.password) throw new Error('Set site.config.json to the HTTPS homepage origin.');
const pubs = JSON.parse(readFileSync(path.join(root,'publications.json'),'utf8'));
const escape = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const authors = p => (p.displayAuthors || p.authors).split(', ').map(name => {
  const author = name === 'Y Dai' ? '<strong>Yixiang Dai</strong>' : escape(name);
  return author + (p.equalContribution?.includes(name) ? '<sup class="equal-contribution" aria-label="Equal contribution">*</sup>' : '');
}).join(', ');
function paper(p) {
 return '<article class="publication-row" data-id="'+escape(p.id)+'" aria-labelledby="title-'+escape(p.id)+'">'+
 '<div class="publication-top"><span class="venue-tag">'+escape(p.short)+'</span><span class="paper-year">'+p.year+'</span></div>'+
 '<h4 id="title-'+escape(p.id)+'"><a href="'+escape(p.url)+'" target="_blank" rel="noopener noreferrer">'+escape(p.title)+'</a></h4>'+
 '<p class="authors">'+authors(p)+'</p><p class="venue">'+escape(p.venue)+'</p>'+
 '<div class="publication-bottom"><div class="paper-actions"><a href="'+escape(p.url)+'" target="_blank" rel="noopener noreferrer" aria-label="Read paper: '+escape(p.title)+'">Paper <span aria-hidden="true">↗</span></a>'+
 (p.code?'<a href="'+escape(p.code)+'" target="_blank" rel="noopener noreferrer" aria-label="Source code for '+escape(p.title)+'">Code <span aria-hidden="true">↗</span></a>':'')+
 '<button type="button" class="cite-button" data-cite="'+escape(p.id)+'" aria-label="Cite: '+escape(p.title)+'" hidden>Cite <span aria-hidden="true">⧉</span></button></div>'+
 '<span class="citation-count">'+p.citations+' '+(p.citations===1?'citation':'citations')+'</span></div></article>';
}
const years=[...new Set(pubs.map(p=>p.year))].sort((a,b)=>b-a);
const html='<div class="publication-group publication-group-flat"><div>'+pubs.map(paper).join('')+'</div></div>';
const out=path.join(root,'docs');
mkdirSync(out,{recursive:true});
let template=readFileSync(path.join(root,'src/index.template.html'),'utf8');
template=template.replaceAll('{{SITE_URL}}',siteUrl.href).replace('{{PUBLICATIONS}}',html).replace('{{PUBLICATION_DATA}}',JSON.stringify(pubs).replace(/</g,'\\u003c'));
template=template.replace('{{HERO_ART}}',readFileSync(path.join(root,'src/assets/robot-manipulation.svg'),'utf8')).replace('{{GEOMETRY_ART}}',readFileSync(path.join(root,'src/assets/visual-geometric-concept.svg'),'utf8'));
const assetVersion = name => createHash('sha256').update(readFileSync(path.join(root,'src',name))).digest('hex').slice(0,12);
template=template.replace('href="styles.css"','href="styles.css?v='+assetVersion('styles.css')+'"').replace('src="main.js"','src="main.js?v='+assetVersion('main.js')+'"');
if (/\{\{[A-Z_]+\}\}/.test(template)) throw new Error('Unresolved template');
writeFileSync(path.join(out,'index.html'),template);
for(const file of ['styles.css','main.js','assets']) cpSync(path.join(root,'src',file),path.join(out,file),{recursive:true});
writeFileSync(path.join(out,'.nojekyll'),'');
writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+siteUrl.href+'sitemap.xml\n');
writeFileSync(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>'+siteUrl.href+'</loc><lastmod>'+new Date().toISOString().slice(0,10)+'</lastmod></url></urlset>');
console.log('Built '+pubs.length+' publications across '+years.length+' years.');
