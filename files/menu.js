// ============ DATOS (edita aquí precios y menús) ============
const WA='525510455547';
const PAQUETES={
 clasica:{nombre:'Parrilla Clásica',min:30,tag:'Bufé · mínimo 30 personas',prep:'2:30 h',serv:'2:30 h',
  desc:'Leña de encino y carbón, carne Prime Sonorense. Incluye plato de madera de parota, taza de peltre, servilleta de tela y cubertería metálica.',
  tiers:[[35,480],[50,470],[70,460],[100,450],[150,440],[200,430]],
  grupos:{'Cortes y embutidos':['Tomahawk y Picanha','Arrachera y Gaonera de filete','Costilla St. Louis','Espaldilla de jabalí','Chorizo argentino y chistorra'],
   'Guarniciones':['Jugo de carne (180 ml)','Mini choripán y slider de filete','Taco regio','Papa criolla y espárragos','Mac and cheese','Ensalada de fresa y queso de cabra'],
   'Salsas':['Guacamole','Piña y habanero','Chimichurri y cebollas caramelizadas','Salsa Macha "Las Hijas de Villa"','Baguette y limones']}},
 tradicional:{nombre:'Parrilla Tradicional',min:20,tag:'Asado al carbón · mínimo 20 personas',prep:'2:00 h',serv:'2:00 h',
  desc:'Servicio práctico y completo a la brasa, carne mexicana TIF calidad Prime Sonorense. Plato plástico retornable incluido.',
  tiers:[[30,390],[50,380],[70,370],[100,360],[150,350],[200,340]],
  grupos:{'Cortes y embutidos':['Rib Eye y New York','Arrachera y Gaonera de filete','Muslos de pollo al limón','Chorizo argentino y chistorra'],
   'Guarniciones':['Chili poppers con tocino','Mini choripán','Sliders de filete','Papa en mantequilla de ajo y romero','Espárragos asados'],
   'Salsas':['Pepino con habanero','Pico de gallo con aguacate','Chimichurri','Salsa Macha "Las Hijas de Villa"','Tortillas, limones y servilletas']}},
 // TODO: el cliente debe dar menú y precios reales de estos dos
 ejecutivo:{nombre:'Parrilla Ejecutiva',min:20,tag:'Corporativo',prep:'2:00 h',serv:'2:00 h',desc:'Pendiente: descripción del paquete.',tiers:null,
  grupos:{'Cortes y embutidos':['Por definir'],'Guarniciones':['Por definir'],'Salsas':['Por definir']}},
 exotico:{nombre:'Parrilla Exótica',min:20,tag:'Carnes exóticas',prep:'2:30 h',serv:'2:30 h',desc:'Pendiente: descripción del paquete.',tiers:null,
  grupos:{'Cortes y embutidos':['Jabalí, búfalo, venado… (por definir)'],'Guarniciones':['Por definir'],'Salsas':['Por definir']}}
};
const SALSAS=[ // archivo = nombre real en Imagenes/Salsas/
 {id:'s1',nombre:'Tres Chiles y Semillas',img:'salsa-1-TresChilesYSemillas.jpeg'},
 {id:'s2',nombre:'Cacao y Chipotle',img:'salsa-2-CacaoYChipotle.jpeg'},
 {id:'s3',nombre:'Ceniza de Jalapeño',img:'salsa-3-CenizaDeJalapeno.jpeg'},
 {id:'s4',nombre:'Jamaica y Morita',img:'salsa-4-JamaicaYMorita.jpeg'},
 {id:'s5',nombre:'Habanero y Ajonjolí',img:'salsa-5-HabaneroYAjonjoli.jpeg'},
 {id:'s6',nombre:'Chapulín y Chile de Árbol',img:'salsa-6-ChapulinYChileDeArbol.jpeg'}];
const TAMANOS={125:95,235:145}; // gramos : precio MXN
// ============ LÓGICA ============
const $=id=>document.getElementById(id),mx=n=>'$'+n.toLocaleString('es-MX',{minimumFractionDigits:2});
const precio=(k,n)=>{const t=PAQUETES[k].tiers;if(!t)return null;return(t.find(x=>n<=x[0])||t[t.length-1])[1]};
// Pestañas + paneles
let actual='clasica';
function panel(k){const p=PAQUETES[k];actual=k;
 document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active',b.dataset.k===k));
 let r=p.tiers?p.tiers.map((t,i)=>`<div class="precio-tier"><span>${i?'Hasta '+t[0]:'Hasta '+t[0]} pers.</span><strong>${mx(t[1])}</strong></div>`).join(''):'<p class="tiers-note">Precio: solicítalo por WhatsApp.</p>';
 $('panel').innerHTML=`<div class="paquete-panel active"><span class="tag-minimo">${p.tag}</span><h3 style="font-family:'Bebas Neue';font-size:2.4rem">${p.nombre}</h3>
 <p style="color:#ccc;line-height:1.6;margin:6px 0 14px">${p.desc}</p>
 <div class="tiempos"><div><b>⏰ Tú eliges la hora de comida</b>Nos dices a qué hora quieres comer.</div>
 <div><b>🔥 ${p.prep} antes</b>El chef llega, monta y prepara la carne.</div><div><b>🍽️ ${p.serv} de servicio</b>Se queda sirviendo a tus invitados.</div></div>
 <div class="ventanas">${Object.entries(p.grupos).map(([g,l])=>`<details><summary>${g}</summary><ul>${l.map(x=>`<li>${x}</li>`).join('')}</ul></details>`).join('')}</div>
 <h4 class="sub-precios">Costo por invitado:</h4><div class="precios-grid">${r}</div></div>`;}
$('tabs').innerHTML=Object.entries(PAQUETES).map(([k,p])=>`<button class="tab-btn" data-k="${k}">${p.nombre.replace('Parrilla ','')}</button>`).join('');
$('tabs').onclick=e=>{if(e.target.dataset.k)panel(e.target.dataset.k)};
$('selP').innerHTML=Object.entries(PAQUETES).map(([k,p])=>`<option value="${k}">${p.nombre} (mín. ${p.min})</option>`).join('');
panel('clasica');
// Cotizador
let q={};
function cotiza(){const k=$('selP').value,p=PAQUETES[k];let n=+$('rng').value;$('nInv').textContent=n;
 $('aviso').textContent=n<p.min?`* Mínimo ${p.min} personas (se calcula sobre ${p.min}).`:'';n=Math.max(n,p.min);
 const u=precio(k,n),tue=Math.max(0,+$('qTue').value||0),mol=Math.max(0,+$('qMol').value||0);
 if(u==null){$('pPer').textContent='Por cotizar';$('pTot').textContent='—';q=null;return}
 const tot=u*n+tue*75+mol*55;$('pPer').textContent=mx(u);$('pTot').textContent=mx(tot);
 q={k,n,tue,mol,tot,txt:`${p.nombre} · ${n} personas`+(tue?` · ${tue} tuétano`:'')+(mol?` · ${mol} molleja`:'')}}
['selP','rng','qTue','qMol'].forEach(i=>$(i).addEventListener('input',cotiza));cotiza();
// Salsas
$('productos').innerHTML=SALSAS.map(p=>`<div class="foto-card"><img class="prod" src="Imagenes/Salsas/${p.img}" alt="${p.nombre}" loading="lazy"><div class="txt"><h3>${p.nombre}</h3>
<select id="t-${p.id}">${Object.entries(TAMANOS).map(([g,pr])=>`<option value="${g}">${g} g — ${mx(pr)}</option>`).join('')}</select>
<button class="btn-card btn-sm" data-id="${p.id}">Añadir al carrito</button></div></div>`).join('');
$('productos').onclick=e=>{const p=SALSAS.find(x=>x.id===e.target.dataset.id);if(!p)return;const g=$('t-'+p.id).value;add({txt:`Salsa Macha ${p.nombre} (${g} g)`,tot:TAMANOS[g]})};
// Carrito
let cart=[];
function add(i){cart.push(i);draw();$('cart').classList.add('open')}
function draw(){$('cnt').textContent=cart.length;
 $('items').innerHTML=cart.map((c,i)=>`<div class="cart-item"><span>${c.txt}<br><small>${c.pend?'Precio por confirmar':mx(c.tot)}</small></span><button data-i="${i}">✕</button></div>`).join('')||'<p style="color:#999">Aún no agregas nada.</p>';
 const t=cart.reduce((s,c)=>s+c.tot,0);$('tot').textContent='Total: '+mx(t)+(cart.some(c=>c.pend)?' + por confirmar':'');
 const m=`Hola Los Hijos de Villa, quiero hacer este pedido:\n`+cart.map(c=>'• '+c.txt+(c.pend?'':' ('+mx(c.tot)+')')).join('\n')+`\nTotal estimado: ${mx(t)}`;
 $('wa').href=`https://wa.me/${WA}?text=${encodeURIComponent(m)}`}
$('items').onclick=e=>{if(e.target.dataset.i!==undefined){cart.splice(+e.target.dataset.i,1);draw()}};
$('addPaq').onclick=()=>q?add({txt:q.txt,tot:q.tot}):add({txt:PAQUETES[$('selP').value].nombre+' (cotizar)',tot:0,pend:true});
$('fab').onclick=()=>$('cart').classList.add('open');$('cerrar').onclick=()=>$('cart').classList.remove('open');draw();
