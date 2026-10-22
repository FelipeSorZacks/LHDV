// Partículas de fuego + menú (compartido por las dos páginas)
const canvas=document.getElementById('fireCanvas'),ctx=canvas.getContext('2d');
const esMovil=matchMedia('(max-width:700px)').matches,sinMov=matchMedia('(prefers-reduced-motion: reduce)').matches;
const rs=()=>{canvas.width=innerWidth;canvas.height=innerHeight};rs();addEventListener('resize',rs);
const nueva=i=>({x:Math.random()*canvas.width,y:i?Math.random()*canvas.height:canvas.height+10,size:Math.random()*2.6+.8,sy:Math.random()*1.2+.4,sx:(Math.random()-.5)*.7,c:Math.random()>.45?'#F5C518':'#D92323',a:Math.random()*.6+.25});
const ps=Array.from({length:esMovil?28:70},()=>nueva(true));
(function anim(){ctx.clearRect(0,0,canvas.width,canvas.height);
ps.forEach((p,i)=>{ctx.globalAlpha=p.a;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,7);ctx.fill();
if(!esMovil){ctx.globalAlpha=p.a*.25;ctx.beginPath();ctx.arc(p.x,p.y,p.size*2.6,0,7);ctx.fill()}
p.y-=p.sy;p.x+=p.sx+Math.sin(p.y/40)*.25;if(p.y<-10)ps[i]=nueva(false)});
if(!sinMov)requestAnimationFrame(anim)})();
const nt=document.querySelector('.nav-toggle'),nl=document.querySelector('.nav-links');
const cerrar=()=>{nl.classList.remove('open');nt.setAttribute('aria-expanded','false');nt.textContent='☰ MENÚ'};
nt.addEventListener('click',()=>{const o=nl.classList.toggle('open');nt.setAttribute('aria-expanded',o);nt.textContent=o?'✕ CERRAR':'☰ MENÚ'});
nl.querySelectorAll('a').forEach(a=>a.addEventListener('click',cerrar));
