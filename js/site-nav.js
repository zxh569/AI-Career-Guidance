// Header navigation: marks the current page or the section in view.
(function(){
  'use strict';
  const nav=document.querySelector('.site-nav');
  if(!nav)return;
  const links=[...nav.querySelectorAll('a')];
  const local=links.filter(a=>a.getAttribute('href').startsWith('#'));
  const sections=local.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  if(!sections.length)return;
  const set=link=>links.forEach(a=>{if(a===link)a.setAttribute('aria-current','true');else if(a.getAttribute('aria-current')==='true')a.removeAttribute('aria-current');});
  let queued=false;
  function update(){
    queued=false;
    const atBottom=window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-2;
    const passed=sections.filter(s=>s.getBoundingClientRect().top<=window.innerHeight*0.3);
    const section=atBottom?sections[sections.length-1]:passed[passed.length-1];
    set(section?local.find(a=>a.getAttribute('href')==='#'+section.id):null);
  }
  window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
  window.addEventListener('resize',update);
  update();
})();
