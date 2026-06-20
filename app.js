/* app.js — Два Тупых Качка */
gsap.registerPlugin(ScrollTrigger);

// Cursor
const cur = document.getElementById('cursor');
const fol = document.getElementById('cursorFollower');
let mx = window.innerWidth/2, my = window.innerHeight/2, fx = mx, fy = my, cursorVisible = false;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx+'px'; cur.style.top = my+'px';
  if (!cursorVisible) { cursorVisible = true; gsap.to(fol, { opacity:1, duration:.3 }); }
});
(function tickFol() {
  fx += (mx-fx)*.11; fy += (my-fy)*.11;
  fol.style.left = fx+'px'; fol.style.top = fy+'px';
  requestAnimationFrame(tickFol);
})();
document.querySelectorAll('a,button,.card,.meta-pill,.ptag,.social-pill,.vs-card,.fact-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.classList.add('hovered'); fol.classList.add('hovered'); });
  el.addEventListener('mouseleave', () => { cur.classList.remove('hovered'); fol.classList.remove('hovered'); });
});

// Particles
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const PAL = ['#7c3aed','#a855f7','#ec4899','#06b6d4','#f59e0b'];
let W, H;
function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize(); window.addEventListener('resize', resize, { passive:true });
class P {
  constructor() { this.init(true); }
  init(r) { this.x=Math.random()*W; this.y=r?Math.random()*H:H+10; this.r=Math.random()*1.8+.4; this.vy=-(Math.random()*.55+.18); this.vx=(Math.random()-.5)*.35; this.c=PAL[Math.random()*PAL.length|0]; this.a=Math.random()*.5+.08; this.t=0; this.T=280+Math.random()*240; }
  tick() { this.x+=this.vx; this.y+=this.vy; this.t++; const p=this.t/this.T; this.ca=this.a*Math.sin(p*Math.PI); if(this.t>this.T||this.y<-12) this.init(false); }
  draw() { ctx.save(); ctx.globalAlpha=Math.max(0,this.ca); ctx.fillStyle=this.c; ctx.shadowColor=this.c; ctx.shadowBlur=7; ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2); ctx.fill(); ctx.restore(); }
}
const pts = Array.from({length:90}, () => new P());
(function loop() { ctx.clearRect(0,0,W,H); pts.forEach(p => { p.tick(); p.draw(); }); requestAnimationFrame(loop); })();

// Hero entrance
gsap.set('.hero-badge', {opacity:0,y:22,filter:'blur(6px)'});
gsap.set('.title-line', {opacity:0,y:60,skewY:4,filter:'blur(10px)'});
gsap.set('.hero-meta',  {opacity:0,y:22,filter:'blur(4px)'});
gsap.set('.hero-desc',  {opacity:0,y:22,filter:'blur(4px)'});
gsap.set('.hero-cta',   {opacity:0,y:18});
gsap.set('.scroll-hint',{opacity:0,y:10});
const heroTl = gsap.timeline({ delay:.15, defaults:{ease:'power3.out'} });
heroTl
  .to('.hero-badge',  {opacity:1,y:0,filter:'blur(0px)',duration:.8})
  .to('.title-line',  {opacity:1,y:0,skewY:0,filter:'blur(0px)',duration:.9,stagger:.14},'-=.5')
  .to('.hero-meta',   {opacity:1,y:0,filter:'blur(0px)',duration:.7},'-=.55')
  .to('.hero-desc',   {opacity:1,y:0,filter:'blur(0px)',duration:.7},'-=.55')
  .to('.hero-cta',    {opacity:1,y:0,duration:.6},'-=.5')
  .to('.scroll-hint', {opacity:1,y:0,duration:.5},'-=.3');

// Nav scroll
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY>60), {passive:true});

// Scroll reveal
const revealTargets = [
  {sel:'.section-label',d:'0'},{sel:'.section-title',d:'1'},
  {sel:'.fact-card',d:null},{sel:'.quote-block',d:'2'},
  {sel:'.contact-sub',d:'1'},{sel:'.contact-card',d:'2'},
  {sel:'.contact-twins',d:'1'},{sel:'.big-quote',d:'2'},
  {sel:'.profile-layout',d:'1'},{sel:'.gang-subtitle',d:'1'},
];
revealTargets.forEach(({sel,d}) => {
  document.querySelectorAll(sel).forEach((el,i) => {
    el.classList.add('reveal');
    if(d!==null) el.dataset.d=d; else el.dataset.d=String(Math.min(i+1,4));
  });
});
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){e.target.classList.add('in');revObs.unobserve(e.target);} });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// Stat counters
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    statObs.unobserve(e.target);
    const numEl = e.target.querySelector('.pstat-val');
    if(!numEl) return;
    const target = parseInt(numEl.dataset.target,10);
    let current=0; const dur=1800; const step=target/(dur/16);
    const timer=setInterval(() => {
      current=Math.min(current+step,target); numEl.textContent=Math.floor(current);
      if(current>=target) clearInterval(timer);
    },16);
    const bar=e.target.querySelector('.stat-bar');
    if(bar) setTimeout(()=>bar.classList.add('go'),100);
  });
},{threshold:.3});
document.querySelectorAll('.pstat').forEach(el => statObs.observe(el));

// GSAP parallax
gsap.to('.blob-1',{y:-180,x:80,ease:'none',scrollTrigger:{scrub:2.5,start:'top top',end:'bottom top'}});
gsap.to('.blob-2',{y:-140,x:-60,ease:'none',scrollTrigger:{scrub:3,start:'top top',end:'bottom top'}});
gsap.to('.blob-3',{y:-90,ease:'none',scrollTrigger:{scrub:2,start:'top top',end:'bottom top'}});
gsap.to('.hero-content',{y:-70,opacity:.7,ease:'none',scrollTrigger:{scrub:1.8,start:'top top',end:'45% top'}});

// Card 3D tilt
document.querySelectorAll('.card,.vs-card,.fact-card').forEach(card => {
  let raf;
  card.addEventListener('mousemove', e => {
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(() => {
      const r=card.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
      const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      card.style.transform=`perspective(900px) rotateX(${-dy*6}deg) rotateY(${dx*6}deg) translateY(-6px)`;
    });
  });
  card.addEventListener('mouseleave', () => {
    cancelAnimationFrame(raf);
    gsap.to(card,{rotateX:0,rotateY:0,y:0,duration:.6,ease:'power3.out',clearProps:'transform'});
  });
});

// Marquee hover
document.querySelectorAll('.marquee-row').forEach(mrow => {
  mrow.addEventListener('mouseenter', () => { mrow.style.animationPlayState='paused'; gsap.to(mrow,{color:'rgba(168,85,247,.8)',duration:.3}); });
  mrow.addEventListener('mouseleave', () => { mrow.style.animationPlayState='running'; gsap.to(mrow,{color:'rgba(255,255,255,.4)',duration:.3}); });
});

// Profile avatar bounce on scroll
gsap.from('.profile-avatar', {
  scale:.7, opacity:0, duration:.8, ease:'back.out(1.6)',
  scrollTrigger:{trigger:'#maxim',start:'top 80%'}
});

// Form
window.handleSend = function() {
  const name=document.getElementById('nameInput').value.trim();
  const msg=document.getElementById('msgInput').value.trim();
  const btn=document.getElementById('sendBtn');
  if(!name||!msg) {
    gsap.to('.contact-card',{x:[-10,10,-8,8,-5,5,0],duration:.4,ease:'none'});
    return;
  }
  btn.disabled=true; btn.querySelector('span').textContent='Отправляем... 🚀';
  setTimeout(() => {
    document.getElementById('nameInput').value='';
    document.getElementById('msgInput').value='';
    btn.disabled=false; btn.querySelector('span').textContent='Отправить';
    const toast=document.getElementById('toast');
    const who=Math.random()>.5?'Максим ещё в зале':'Гриша уже читает 👀';
    document.getElementById('toastMsg').textContent=`${name}, ${who}`;
    toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),3600);
  },1300);
};

// Page in
document.body.style.opacity='0';
gsap.to(document.body,{opacity:1,duration:.7,ease:'power2.out'});
console.log('%c💪 Прочайлов & Казаков в деле!','font-size:22px;color:#a855f7;font-weight:bold;');
