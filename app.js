const nav=document.getElementById('nav');
addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40));

// cinematic band: zoom out to reveal the full photo as it scrolls through view
// cinematic band: zoom out to reveal the full photo as it scrolls through view
const band=document.getElementById('band'), bandImg=band.querySelector('.band-fore');
const START=1.4, END=1;                     // scale range: zoomed-in -> full picture
bandImg.style.willChange='transform';       // own GPU layer
bandImg.style.backfaceVisibility='hidden';

let vh=innerHeight, vw=innerWidth;
let current=START, target=START;

function computeTarget(){
  const r=band.getBoundingClientRect();
  let p=(vh-r.top)/(vh+r.height)/0.45;      // normalize active travel to 0..1
  p=Math.max(0,Math.min(1,p));
  const e=1-Math.pow(1-p,3);                // easeOutCubic
  target=START-e*(START-END);
}

let running=false;
function loop(){
  computeTarget();
  current+=(target-current)*0.14;           // damping — lower = smoother
  const done=Math.abs(target-current)<0.0006;
  if(done) current=target;
  bandImg.style.transform='scale('+current.toFixed(4)+')';
  if(done){ running=false; return; }
  requestAnimationFrame(loop);
}
function kick(){ if(!running){ running=true; requestAnimationFrame(loop); } }

addEventListener('scroll',kick,{passive:true});
addEventListener('resize',()=>{ if(innerWidth!==vw){ vw=innerWidth; vh=innerHeight; } kick(); },{passive:true});
addEventListener('orientationchange',()=>{ vw=innerWidth; vh=innerHeight; kick(); });
addEventListener('load',()=>{ computeTarget(); current=target; bandImg.style.transform='scale('+current.toFixed(4)+')'; });
computeTarget(); current=target; bandImg.style.transform='scale('+current.toFixed(4)+')';


const gl=document.getElementById('gridLines');
window.addEventListener('load',()=>{[...gl.children].forEach((s,i)=>setTimeout(()=>s.classList.add('on'),200+i*90));});

const io=new IntersectionObserver((es)=>{
  es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})
},{threshold:.14});
document.querySelectorAll('.rv,.step,#craftVis,#band').forEach(el=>io.observe(el));

// back-to-top button: appears as the footer gets close, scrolls to top on click
const toTop=document.getElementById('toTop'), footEl=document.querySelector('footer');
function toggleTop(){
  if(!toTop||!footEl)return;
  const near=footEl.getBoundingClientRect().top < innerHeight + 240;
  toTop.classList.toggle('show',near);
}
addEventListener('scroll',toggleTop,{passive:true});
addEventListener('resize',toggleTop);
toggleTop();
if(toTop) toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// Booking form: opens the visitor's mail app with a pre-filled message to
// contact@wahabinnovations.com. This uses a mailto: link (no network call),
// so it is safe inside the sandbox and works on the live site too.
function thanks(e){
  e.preventDefault();
  const f=e.target, b=f.querySelector('button');
  const name=(f.elements['name'].value||'').trim();
  const email=(f.elements['email'].value||'').trim();
  const interest=f.elements['interest'].value;
  const subject=encodeURIComponent('Fitting request from '+(name||'a client'));
  const body=encodeURIComponent('Name: '+name+'\nEmail: '+email+'\nLooking for: '+interest);
  window.location.href='mailto:contact@wahabinnovations.com?subject='+subject+'&body='+body;
  b.textContent='Opening your email...';
  setTimeout(()=>{f.reset();b.textContent='Request an appointment';},2800);
}
const bookForm=document.getElementById('bookForm');
if(bookForm) bookForm.addEventListener('submit',thanks);
