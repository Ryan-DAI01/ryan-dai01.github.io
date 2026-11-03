(() => {
  'use strict';
  const records = JSON.parse(document.getElementById('publication-data').textContent);
  const byId = new Map(records.map(p => [p.id, p]));
  const rows = [...document.querySelectorAll('.publication-row')];
  const rowById = new Map(rows.map(row => [row.dataset.id, row]));
  const byCitations = (a, b) => b.citations - a.citations || b.year - a.year || a.title.localeCompare(b.title);
  function renderOrder() {
    let sections;
    if (sort.value === 'recent') {
      sections = [...new Set(records.map(p => p.year))].sort((a,b) => b-a)
        .map(y => ({key:'year-'+y, label:String(y), papers:records.filter(p => p.year===y).sort(byCitations)}));
      orderHint.textContent = 'Ordered by publication year, newest first.';
    } else if (sort.value === 'cited') {
      sections = [{key:'cited', label:'Citations', papers:[...records].sort(byCitations)}];
      orderHint.textContent = 'Ordered by citation count, highest first.';
    } else {
      sections = [{key:'selected', label:'', papers:records}];
      orderHint.textContent = '';
    }
    orderHint.hidden = sort.value === 'featured';
    const fragment = document.createDocumentFragment();
    for (const group of sections) {
      const section = document.createElement(group.label ? 'section' : 'div');
      section.className = 'publication-group' + (group.label ? '' : ' publication-group-flat');
      if (group.label) {
        const heading = document.createElement('h3');
        heading.id = 'publication-group-' + group.key;
        heading.textContent = group.label;
        section.setAttribute('aria-labelledby', heading.id);
        section.appendChild(heading);
      }
      const list = document.createElement('div');
      for (const p of group.papers) list.appendChild(rowById.get(p.id));
      section.appendChild(list);
      fragment.appendChild(section);
    }
    document.getElementById('publication-list').replaceChildren(fragment);
  }

  const search = document.getElementById('publication-search');
  const year = document.getElementById('year-filter');
  const sort = document.getElementById('publication-sort');
  const orderHint = document.getElementById('order-hint');
  const count = document.getElementById('result-count');
  document.getElementById('filters').hidden = false;
  document.getElementById('copy-email').hidden = false;
  document.querySelectorAll('.cite-button').forEach(b => { b.hidden = false; });
  function filter() {
    const query = search.value.trim().toLocaleLowerCase();
    let visible = 0;
    for (const row of rows) {
      const p = byId.get(row.dataset.id);
      const haystack = [p.title, p.authors, p.displayAuthors || '', p.venue, p.short, p.year, 'Yixiang Dai'].join(' ').toLocaleLowerCase();
      const matches = (year.value === 'all' || String(p.year) === year.value) && haystack.includes(query);
      row.hidden = !matches;
      if (matches) visible++;
    }
    for (const group of document.querySelectorAll('.publication-group')) group.hidden = ![...group.querySelectorAll('.publication-row')].some(r => !r.hidden);
    count.textContent = visible === records.length ? visible + ' publications' : visible + ' of ' + records.length + ' publications';
    document.getElementById('empty-state').hidden = visible > 0;
  }
  search.addEventListener('input', filter);
  year.addEventListener('change', filter);
  sort.addEventListener('change', () => { renderOrder(); filter(); });
  document.getElementById('filters').addEventListener('submit', e => e.preventDefault());
  document.getElementById('reset-filters').addEventListener('click', () => {
    search.value = ''; year.value = 'all'; sort.value = 'featured'; renderOrder(); filter(); search.focus();
  });
  const figureDialog = document.getElementById('figure-dialog');
  document.querySelectorAll('[data-figure]').forEach(link => link.addEventListener('click', event => {
    // Preserve open-in-new-tab gestures and the plain image link without JavaScript.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const source = link.querySelector('img');
    const expanded = document.getElementById('figure-image');
    expanded.src = source.src;
    expanded.alt = source.alt;
    document.getElementById('figure-title').textContent = link.dataset.figure;
    document.getElementById('figure-caption').textContent = link.dataset.caption;
    figureDialog.showModal();
    document.getElementById('close-figure').focus();
  }));
  document.getElementById('close-figure').addEventListener('click', () => figureDialog.close());
  figureDialog.addEventListener('click', event => {
    if (event.target !== figureDialog) return;
    const rect = figureDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) figureDialog.close();
  });

  const dialog = document.getElementById('citation-dialog');
  const citationText = document.getElementById('citation-text');
  const copyStatus = document.getElementById('copy-status');
  document.getElementById('publication-list').addEventListener('click', e => {
    const button = e.target.closest('.cite-button');
    if (!button) return;
    const p = byId.get(button.dataset.cite);
    citationText.value = p.authors + ' (' + p.year + '). ' + p.title + '. ' + p.venue + '. ' + p.url;
    copyStatus.textContent = '';
    dialog.showModal();
    document.getElementById('close-citation').focus();
  });
  document.getElementById('close-citation').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    if (e.target === dialog) { const rect = dialog.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) dialog.close(); }
  });
  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(value); return true; } catch {}
    }
    const field = document.createElement('textarea');
    field.value = value; field.style.position = 'fixed'; field.style.top = '0'; field.style.left = '-10000px';
    const oldFocus = document.activeElement;
    (dialog.open ? dialog : document.body).appendChild(field);
    field.focus(); field.select();
    let success = false;
    try { success = document.execCommand('copy'); } catch {}
    field.remove(); oldFocus?.focus();
    return success;
  }
  document.getElementById('copy-citation').addEventListener('click', async () => {
    const ok = await copyText(citationText.value);
    copyStatus.textContent = ok ? 'Citation copied.' : 'Select the citation above to copy it.';
    if (!ok) { citationText.focus(); citationText.select(); }
  });
  document.getElementById('copy-email').addEventListener('click', async () => {
    const ok = await copyText('daiyx23@mails.tsinghua.edu.cn');
    document.getElementById('email-status').textContent = ok ? 'Email address copied.' : 'Email: daiyx23@mails.tsinghua.edu.cn';
  });
})();

(() => {
  'use strict';
  const root = document.documentElement;
  const toggle = document.getElementById('motion-toggle');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let saved = null;
  try { saved = localStorage.getItem('homepage-motion'); } catch {}
  let running = saved ? saved === 'running' : !preference.matches;
  let inView = true, frame = 0, clock = 0, lastFrame = 0;
  const shell = document.querySelector('.hero-shell');
  const canvas = document.getElementById('ambient-network');
  const context = canvas?.getContext('2d');
  const art = document.querySelector('.hero-art');
  let width = 1, height = 1, pointer = null;
  const seeds = Array.from({length:48}, (_, i) => ({
    x: ((i * 73 + 17) % 101) / 101,
    y: ((i * 37 + 11) % 97) / 97,
    phase: i * 2.399,
    r: i % 5 === 0 ? 2 : 1.1
  }));

  const scene = document.getElementById('grasp-scene');
  const upperLink = document.getElementById('upper-arm-path');
  const forearmLink = document.getElementById('forearm-path');
  const elbowNode = document.getElementById('robot-elbow');
  const handNode = document.getElementById('robot-gripper');
  const shoulderNode = document.getElementById('robot-shoulder');
  const upperBody = document.getElementById('humanoid-upper-body');
  const headNode = document.getElementById('humanoid-head');
  const gazeNode = document.getElementById('humanoid-gaze');
  const supportUpper = document.getElementById('support-upper-arm-path');
  const supportForearm = document.getElementById('support-forearm-path');
  const supportShoulder = document.getElementById('support-shoulder');
  const supportElbow = document.getElementById('support-elbow');
  const leftJaw = document.getElementById('left-jaw');
  const rightJaw = document.getElementById('right-jaw');
  const objectLayer = document.getElementById('scene-objects');
  const heldLayer = document.getElementById('held-object-layer');
  const targetFrame = document.getElementById('target-frame');
  const targetScan = document.getElementById('target-scan');
  const transferPath = document.getElementById('transfer-path');
  const placementRipple = document.getElementById('placement-ripple');
  const sceneTask = document.getElementById('scene-task');
  const placedCount = document.getElementById('placed-count');
  const objects = [...document.querySelectorAll('#grasp-scene .movable-object')].map(node => ({
    node,
    id: node.id.slice(7),
    source: {x: Number(node.dataset.sourceX), y: Number(node.dataset.sourceY)},
    destination: {x: Number(node.dataset.placeX), y: Number(node.dataset.placeY)},
    depth: Number(node.dataset.depth),
    color: node.dataset.color,
    shadow: document.getElementById(node.id.replace('object-', 'shadow-')),
    slot: document.getElementById(node.id.replace('object-', 'slot-'))
  }));
  const sequenceSteps = [...document.querySelectorAll('.grasp-steps li')];
  const smooth = value => { const t = Math.max(0,Math.min(1,value)); return t*t*(3-2*t); };
  const mix = (a,b,t) => a+(b-a)*smooth(t);
  const number = value => Number(value.toFixed(3));
  const safeHeight = x => 140 + Math.max(0,x-400)*.42;
  const pose = (node,x,y) => node.setAttribute('transform','translate('+number(x)+' '+number(y)+')');
  let previousPhase = '', previousMove = -1, previousOrder = '';
  function renderRobot(time) {
    if (!scene || objects.length !== 3) return;
    // Clear from the top down, then rebuild from the bottom up. Every loop
    // boundary has the same object arrangement and neutral wrist pose.
    const move = Math.floor(time / 12) % 6, t = time % 12;
    const reverse = move >= 3, index = reverse ? 5-move : move;
    const activeObject = objects[index];
    const from = reverse ? activeObject.destination : activeObject.source;
    const to = reverse ? activeObject.source : activeObject.destination;
    const offset = 70, openGap = 45, closedGap = 30;
    let x = 300, y = 142, gap = openGap, phase = 'approach', holding = false;
    const released = t >= 8.1;
    if (t < .7) {
      // A short perception dwell makes the next target legible.
    } else if (t < 1.8) {
      x=mix(300,from.x,(t-.7)/1.1); y=mix(142,safeHeight(from.x),(t-.7)/1.1);
    } else if (t < 3) {
      x=from.x; y=mix(safeHeight(x),from.y-offset,(t-1.8)/1.2);
    } else if (t < 3.65) {
      x=from.x; y=from.y-offset; gap=mix(openGap,closedGap,(t-3)/.65); phase='grasp';
    } else if (t < 4.9) {
      x=from.x; y=mix(from.y-offset,safeHeight(x),(t-3.65)/1.25); gap=closedGap; phase='lift'; holding=true;
    } else if (t < 6.6) {
      const u=smooth((t-4.9)/1.7);
      x=from.x+(to.x-from.x)*u; y=safeHeight(x)-10*Math.sin(Math.PI*u); gap=closedGap; phase='transfer'; holding=true;
    } else if (t < 8.1) {
      x=to.x; y=mix(safeHeight(x),to.y-offset,(t-6.6)/1.5); gap=closedGap; phase='place'; holding=true;
    } else if (t < 8.8) {
      x=to.x; y=to.y-offset; gap=mix(closedGap,openGap,(t-8.1)/.7); phase='place';
    } else if (t < 9.9) {
      x=to.x; y=mix(to.y-offset,safeHeight(x),(t-8.8)/1.1); phase='return';
    } else {
      x=mix(to.x,300,(t-9.9)/2.1); y=mix(safeHeight(to.x),142,(t-9.9)/2.1); phase='return';
    }

    let count = 0, activeX = from.x, activeY = from.y;
    objects.forEach((object,i) => {
      let onTray = reverse ? i <= index : i < index;
      let position = onTray ? object.destination : object.source;
      const carried = i === index && holding;
      if (i === index) {
        onTray = holding ? false : released ? !reverse : reverse;
        position = holding ? {x,y:y+offset} : released ? to : from;
        activeX=position.x; activeY=position.y;
      }
      if (onTray) count++;
      const layer=carried ? heldLayer : objectLayer;
      if (object.node.parentNode !== layer) layer.append(object.node);
      pose(object.node,position.x,position.y);
      object.node.dataset.location=carried ? 'held' : onTray ? 'tray' : 'pile';
      object.node.dataset.depth=carried ? 1000 : onTray ? object.destination.y+32 : object.depth;
      let floorY=onTray ? object.destination.y+17 : 386;
      if (carried) {
        const u=smooth((t-4.9)/1.7);
        floorY=(reverse ? object.destination.y+17 : 386)*(1-u)+(reverse ? 386 : object.destination.y+17)*u;
      }
      const elevation=Math.max(0,floorY-position.y-17);
      object.shadow.setAttribute('cx',number(position.x));
      object.shadow.setAttribute('cy',number(floorY));
      object.shadow.setAttribute('rx',number(27+elevation*.055));
      object.shadow.setAttribute('opacity',number(Math.max(.1,.3-elevation*.001)));
      object.slot.dataset.occupied=String(onTray);
      object.slot.setAttribute('opacity',onTray ? '1' : '.6');
    });
    // Keep the pile depth sorted. The separate carried-object layer sits
    // between the forearm and fingers, so the arm cannot obscure its grasp.
    const ordered=[...objectLayer.children].sort((a,b)=>Number(a.dataset.depth)-Number(b.dataset.depth));
    const order=ordered.map(node=>node.id).join(',');
    if (order !== previousOrder) { objectLayer.append(...ordered); previousOrder=order; }

    // Solve a 3D arm, then project its joints into the illustration. The
    // forward wrist depth allows a natural elbow posture across the torso.
    const lean=(x-300)*.025, breath=.6*Math.sin(time*Math.PI/6);
    const sx=350+lean, sy=145+breath, a=125, b=150, wristDepth=95;
    const delta=[x-sx,y-sy,wristDepth], distance=Math.hypot(...delta);
    const axis=delta.map(value=>value/distance);
    const along=(a*a-b*b+distance*distance)/(2*distance);
    const radius=Math.sqrt(Math.max(0,a*a-along*along));
    const pole=[1,.85,-.15];
    const dot=pole.reduce((sum,value,i)=>sum+value*axis[i],0);
    const normal=pole.map((value,i)=>value-dot*axis[i]);
    const normalLength=Math.hypot(...normal);
    const joint=axis.map((value,i)=>value*along+normal[i]*radius/normalLength);
    const ex=sx+joint[0], ey=sy+joint[1], ez=joint[2];
    upperLink.setAttribute('d','M'+number(sx)+' '+number(sy)+' L'+number(ex)+' '+number(ey));
    forearmLink.setAttribute('d','M'+number(ex)+' '+number(ey)+' L'+number(x)+' '+number(y));
    pose(shoulderNode,sx,sy);
    pose(elbowNode,ex,ey); pose(handNode,x,y);
    pose(upperBody,lean,breath);
    headNode.setAttribute('transform','rotate('+number(1.5+(x-300)*.025)+' 297 122)');
    pose(gazeNode,(x-300)*.012,Math.max(-1.5,Math.min(2,(y-200)*.015)));
    const supportX=243+lean, supportY=145+breath;
    const supportElbowX=207+lean*.3, supportElbowY=226+breath*.3;
    supportUpper.setAttribute('d','M'+number(supportX)+' '+number(supportY)+' L'+number(supportElbowX)+' '+number(supportElbowY));
    supportForearm.setAttribute('d','M'+number(supportElbowX)+' '+number(supportElbowY)+' L205 308');
    pose(supportShoulder,supportX,supportY); pose(supportElbow,supportElbowX,supportElbowY);
    scene.dataset.shoulderX=number(sx); scene.dataset.shoulderY=number(sy);
    scene.dataset.elbowZ=number(ez); scene.dataset.wristZ=String(wristDepth);
    pose(leftJaw,-gap,0); pose(rightJaw,gap,0);
    pose(targetFrame,activeX,activeY);
    targetFrame.setAttribute('stroke',activeObject.color);
    targetFrame.querySelector('circle').setAttribute('fill',activeObject.color);
    targetFrame.setAttribute('opacity',phase==='return' ? '.25' : number(.65+.16*Math.sin(t*2)));
    targetScan.setAttribute('transform','translate(0 '+number(-27+54*(.5-.5*Math.cos(t*2.5)))+')');
    targetScan.setAttribute('opacity',phase==='approach' ? '.7' : '0');
    transferPath.setAttribute('stroke-dashoffset',number(-time*14));
    transferPath.setAttribute('opacity',phase==='transfer' ? '.55' : '.2');
    const ripple = (t-8.1)/1.2;
    placementRipple.setAttribute('cx',to.x); placementRipple.setAttribute('cy',to.y+17);
    placementRipple.setAttribute('rx',number(31+Math.max(0,ripple)*16));
    placementRipple.setAttribute('ry',number(12+Math.max(0,ripple)*6));
    placementRipple.setAttribute('stroke',activeObject.color);
    placementRipple.setAttribute('opacity',ripple>=0 && ripple<=1 ? number(.65*(1-ripple)) : '0');

    if (move !== previousMove) {
      const points=Array.from({length:17},(_,i)=>{
        const u=i/16, px=from.x+(to.x-from.x)*u;
        return number(px)+' '+number(safeHeight(px)-10*Math.sin(Math.PI*u));
      });
      transferPath.setAttribute('d','M'+from.x+' '+(from.y-offset)+' L'+points.join(' L')+' L'+to.x+' '+(to.y-offset));
      sceneTask.textContent=reverse ? 'Rebuilding the stack' : 'Clearing the stack';
      previousMove=move;
    }
    if (placedCount.dataset.count !== String(count)) {
      placedCount.textContent=count+' / 3 placed';
      placedCount.dataset.count=String(count);
    }
    Object.assign(scene.dataset,{
      phase, holding:String(holding), target:activeObject.id,
      move:String(move), direction:reverse?'restack':'sort', placedCount:String(count),
      objectX:String(number(activeX)), objectY:String(number(activeY)),
      wristX:String(number(x)), wristY:String(number(y)), jawGap:String(number(gap))
    });
    if (phase !== previousPhase) {
      const active = phase === 'return' ? 'place' : phase === 'transfer' ? 'lift' : phase;
      for (const step of sequenceSteps) {
        const on=step.dataset.step===active;
        step.dataset.active=String(on);
        if (on) step.setAttribute('aria-current','step'); else step.removeAttribute('aria-current');
      }
      previousPhase=phase;
    }
  }

  function draw(time) {
    renderRobot(time);
    if (!context) return;
    context.clearRect(0, 0, width, height);
    const count = width < 600 ? 24 : 48;
    const positions = seeds.slice(0,count).map(p => ({
      x:p.x * width + Math.sin(time * .22 + p.phase) * 28,
      y:p.y * height + Math.cos(time * .18 + p.phase) * 22,
      r:p.r
    }));
    for (let i=0;i<positions.length;i++) {
      const a = positions[i];
      for (let j=i+1;j<positions.length;j++) {
        const b = positions[j], distance = Math.hypot(a.x-b.x,a.y-b.y);
        if (distance < 145) {
          context.strokeStyle = 'rgba(126,214,195,' + ((1-distance/145)*.16) + ')';
          context.lineWidth = .8;
          context.beginPath(); context.moveTo(a.x,a.y); context.lineTo(b.x,b.y); context.stroke();
        }
      }
      if (pointer) {
        const distance = Math.hypot(a.x-pointer.x,a.y-pointer.y);
        if (distance < 160) {
          context.strokeStyle = 'rgba(147,239,209,' + ((1-distance/160)*.3) + ')';
          context.beginPath(); context.moveTo(a.x,a.y); context.lineTo(pointer.x,pointer.y); context.stroke();
        }
      }
      context.beginPath(); context.arc(a.x,a.y,a.r,0,Math.PI*2);
      context.fillStyle = 'rgba(151,223,211,.50)'; context.fill();
    }
  }
  function tick(now) {
    if (!running || !inView || document.hidden) { frame = 0; return; }
    if (!lastFrame) lastFrame = now;
    const elapsed = now - lastFrame;
    if (elapsed >= 1000/30) {
      clock += Math.min(elapsed,80)/1000;
      lastFrame = now;
      draw(clock);
    }
    frame = requestAnimationFrame(tick);
  }
  function syncFrame() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0; lastFrame = 0;
    if (running && inView && !document.hidden) frame = requestAnimationFrame(tick);
    else { pointer = null; draw(clock); }
  }
  function setMotion(value, persist = false) {
    running = value;
    root.dataset.motion = running ? 'running' : 'paused';
    toggle.setAttribute('aria-pressed',String(!running));
    toggle.querySelector('.motion-label').textContent = running ? 'Pause motion' : 'Play motion';
    toggle.querySelector('.motion-icon').textContent = running ? 'Ⅱ' : '▷';
    if (!running) {
      art.style.removeProperty('--tilt-x');
      art.style.removeProperty('--tilt-y');
    }
    if (persist) {
      saved = root.dataset.motion;
      try { localStorage.setItem('homepage-motion',saved); } catch {}
    }
    syncFrame();
  }
  toggle.hidden = false;
  toggle.addEventListener('click',() => setMotion(!running,true));
  preference.addEventListener('change',event => { if (!saved) setMotion(!event.matches); });
  document.addEventListener('visibilitychange',syncFrame);
  function resize() {
    if (!context) return;
    width = shell.clientWidth; height = shell.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1,2);
    canvas.width = Math.round(width*ratio); canvas.height = Math.round(height*ratio);
    context.setTransform(ratio,0,0,ratio,0,0); draw(clock);
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(shell);
  else window.addEventListener('resize',resize,{passive:true});
  resize();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      shell.classList.toggle('scene-offscreen',!inView);
      syncFrame();
    },{rootMargin:'100px'}).observe(shell);
    const reveal = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        if (running) entry.target.classList.add('revealed');
        reveal.unobserve(entry.target);
      }
    },{threshold:.07});
    document.querySelectorAll('.hero-copy,.section-heading,.research-card,.publication-row,.contact-section').forEach(node=>reveal.observe(node));
    const links = [...document.querySelectorAll('.header-inner nav a')];
    const nav = new IntersectionObserver(entries => {
      const active = entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (!active) return;
      for (const link of links) {
        if (link.hash === '#'+active.target.id) link.setAttribute('aria-current','location');
        else link.removeAttribute('aria-current');
      }
    },{rootMargin:'-15% 0px -65% 0px'});
    document.querySelectorAll('main section[id]').forEach(section=>nav.observe(section));
  }
  let pointerFrame = 0;
  const finePointer = matchMedia('(pointer: fine)');
  shell.addEventListener('pointermove',event => {
    if (!running || !finePointer.matches) return;
    const rect = shell.getBoundingClientRect();
    pointer = {x:event.clientX-rect.left,y:event.clientY-rect.top};
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      if (!running || !pointer) return;
      const box = art.getBoundingClientRect();
      art.style.setProperty('--tilt-x',Math.max(-3,Math.min(3,(box.top+box.height/2-event.clientY)/box.height*5))+'deg');
      art.style.setProperty('--tilt-y',Math.max(-4,Math.min(4,(event.clientX-box.left-box.width/2)/box.width*6))+'deg');
    });
  },{passive:true});
  shell.addEventListener('pointerleave',() => {
    pointer = null;
    art.style.removeProperty('--tilt-x'); art.style.removeProperty('--tilt-y');
  });
  const progress = document.querySelector('.scroll-progress');
  let scrollFrame = 0;
  function updateProgress() {
    scrollFrame = 0;
    const distance = document.documentElement.scrollHeight-innerHeight;
    progress.style.transform = 'scaleX('+(distance > 0 ? Math.min(1,scrollY/distance) : 0)+')';
  }
  addEventListener('scroll',() => { if (!scrollFrame) scrollFrame=requestAnimationFrame(updateProgress); },{passive:true});
  addEventListener('resize',updateProgress,{passive:true});
  updateProgress();
  setMotion(running);
})();
