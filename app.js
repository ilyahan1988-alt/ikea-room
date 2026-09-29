"use strict";
// ================= data =================
const ROWS=[...window.CAT_RAW,...(window.CAT_RAW2||[])];
const CAT=ROWS.map(r=>({id:r[0],slot:r[1],tags:r[2],n:r[3],v:r[4],p:r[5],u:r[6],fw:r[7],fd:r[8],hex:r[9],est:!!r[10]}));
const BY=Object.fromEntries(CAT.map(x=>[x.id,x]));
const nomW=x=>{const m=String(x.v).match(/(\d{2,3})x(\d{3})/);return m?+m[1]:0};

const STYLES={
  J:{name:'יפנדי',en:'Japandi',designer:'Norm Architects',city:'קופנהגן',
     idea:'שקט יפני-סקנדינבי: עץ אלון בהיר, פשתן, טקסטורות טבעיות ונגיעות שחור מדודות. פחות חפצים, יותר אוויר.',
     pal:[['#F2EEE7','לבן חם','60% קירות'],['#D9CFBF','שיבולת שועל','30% טקסטיל'],['#B08D63','אלון','30% עץ'],['#3A3836','פחם','10% הדגשה'],['#6E7355','זית','10% צמח']],
     tips:['שלוש נגיעות שחור בלבד, בגבהים שונים — כדי שהעין תטייל בחדר.','משטחים ריקים הם חלק מהעיצוב: לא יותר מ-3 חפצים על משטח.']},
  S:{name:'מינימליזם בהיר',en:'warm minimalism',designer:'John Pawson',city:'לונדון',
     idea:'לבן חם, קווים נקיים וכמעט בלי קישוט. האור והפרופורציות הם הקישוט.',
     pal:[['#F5F4F0','לבן גיר','60% קירות'],['#E4E1DA','אפור נייר','30% טקסטיל'],['#E2CFAE','ליבנה','30% עץ'],['#6D7F8F','כחול צפחה','10% הדגשה'],['#2A2A2A','שחור','10% קו']],
     tips:['פחות פריטים, אבל בפרופורציה נכונה לקיר — ריק זה בסדר.','כל הטקסטיל באותה משפחת גוון; ההבדל נוצר מהמרקם.']},
  M:{name:'ים-תיכוני טבעי',en:'natural Mediterranean wabi-sabi',designer:'Axel Vervoordt',city:'אנטוורפן',
     idea:'חומרים גולמיים — רטאן, במבוק, פשתן ויוטה — בגווני טיח, חול וטרקוטה. יופי של לא-מושלם.',
     pal:[['#EDE6DA','טיח','60% קירות'],['#CDB894','חול','30% טקסטיל'],['#B58A55','רטאן','30% סיבים'],['#A9573B','טרקוטה','10% הדגשה'],['#707A5A','זית','10% צמח']],
     tips:['לערבב לפחות שלושה סיבים טבעיים שונים (יוטה, רטאן, פשתן).','תאורה רכה ונמוכה בערב — אהיל קלוע יוצר דוגמת צל על הקיר.']},
  G:{name:'גרפי שחור-לבן',en:'graphic black-and-white',designer:'Dorothy Draper',city:'ניו יורק',
     idea:'ניגודיות חדה של שחור ולבן, צורות ברורות וביטחון — עם חום אחד של עץ או סיב כדי שלא יהיה קר.',
     pal:[['#F4F2EE','לבן','60% קירות'],['#1F1F1F','שחור','30% רהיטים'],['#8E8580','אפור חם','30% טקסטיל'],['#C4A77D','יוטה','10% חום'],['#C99A33','חרדל','10% הדגשה']],
     tips:['לחזור על השחור בשלושה גבהים: רגלי רהיט, גוף תאורה, מסגרת.','צבע הדגשה אחד בלבד, שלוש פעמים בחדר.']},
  W:{name:'מודרני חם',en:'warm modern classic',designer:'Studio McGee',city:'יוטה',
     idea:'קלאסי-מודרני ונעים: קרם, עץ אגוז, ירוק מרווה ופליז. נוח, מזמין, לא מתאמץ.',
     pal:[['#EFE9DC','קרם','60% קירות'],['#CFC3AE','גרייג׳','30% טקסטיל'],['#6B4A33','אגוז','30% עץ'],['#9AA58C','מרווה','10% הדגשה'],['#C9A54A','פליז','10% מתכת']],
     tips:['לשלב עץ בהיר ועץ כהה — אבל לחזור על כל אחד לפחות פעמיים.','פליז בשני מקומות מספיק כדי לחמם את החדר.']},
  C:{name:'צבע בביטחון',en:'confident colour',designer:'India Mahdavi',city:'פריז',
     idea:'צבע כשמחה: ירוק אמרלד, חרדל, ורוד מאובק וצורות מעוגלות — על רקע שמנת רגוע.',
     pal:[['#F3ECDF','שמנת','60% קירות'],['#EBC9B8','ורוד מאובק','30% טקסטיל'],['#1F7A4D','אמרלד','10% הדגשה'],['#E3A52B','חרדל','10% הדגשה'],['#2F4C8A','כחול קובלט','נקודה']],
     tips:['שני צבעים חזקים לכל היותר, וכל אחד חוזר שלוש פעמים.','צורות מעוגלות — שולחן עגול, מראה עגולה — כדי שהצבע ירגיש רך.']},
};
const STYLE_BASE={J:1.3,M:1.2,C:1.1,W:1.0,S:0.9,G:0.8};
const LIKES={natural:{he:'טבעי ובהיר',st:{J:2,S:2,M:2},cls:['beige','white','wood']},bw:{he:'שחור-לבן',st:{G:3,J:1},cls:['black','white']},warm:{he:'חמים ועץ',st:{W:3,M:2,J:1},cls:['wood','beige']},green:{he:'ירוקים',st:{C:2,M:1,W:1},cls:['green']},bold:{he:'צבעוני ונועז',st:{C:3,G:1},cls:['bold']},blue:{he:'כחולים',st:{S:1,C:2},cls:['blue']}};
const DISLIKES={grey:{he:'אפור',st:{S:-1,G:-1},cls:['grey']},beige:{he:'בז׳',st:{J:-1,W:-1,M:-1},cls:['beige']},black:{he:'שחור',st:{G:-3},cls:['black']},bold:{he:'צבעים חזקים',st:{C:-3},cls:['bold']},busy:{he:'דוגמאות עמוסות',st:{C:-1},ids:[66,67,113,116,124,125,127,134,255,260,264,419,424,425]}};
const DIRS={n:'צפון',e:'מזרח',s:'דרום',w:'מערב',u:'לא יודע'};
const DIR_NOTE={n:'חלון לצפון: אור קריר ואחיד. עדיף לבן חם ונורות 2700K.',e:'חלון למזרח: אור חם בבוקר וקריר אחה״צ — תאורת ערב חמה חשובה במיוחד.',s:'חלון לדרום: הרבה אור חם — גוונים קרירים ורגועים יעבדו טוב, ווילון יסנן סנוור.',w:'חלון למערב: שמש חמה וחזקה אחה״צ — עדיף לא להגזים בכתום/צהוב, ווילון שמסנן.',u:'כיוון החלון לא ידוע: הלוח נבחר ניטרלי-חם שעובד בכל אור. בדיקה: אם השמש נכנסת לרצפה אחה״צ — החלון מערבי.'};
const GROUPS={f:'רהיטים',l:'תאורה',t:'טקסטיל',d:'קישוט ואחסון',r:'שיפוץ'};
const SEAT_GAP=42,MIN_PASS=60,GOOD_PASS=90;

// ================= helpers =================
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ils=n=>'₪'+Math.round(n).toLocaleString('he-IL');
const img=id=>(window.IMGS&&window.IMGS[id])||('p/'+id+'.jpg');
const ikeaUrl=x=>'https://www.ikea.com/il/he/p/'+x.u+'/';
function hsl(hex){const n=parseInt(hex.slice(1),16);let r=(n>>16&255)/255,g=(n>>8&255)/255,b=(n&255)/255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0;const l=(mx+mn)/2;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h*=60}return{h,s,l}}
function colorCls(hex){const {h,s,l}=hsl(hex);const c=[];if(l<0.24)c.push('black');else if(l>0.9)c.push('white');if(s<0.12&&l>=0.24&&l<=0.9)c.push('grey');if(h>=20&&h<=55&&s>=0.08&&s<0.5&&l>0.55)c.push('beige');if(s>=0.45&&l>0.25&&l<0.75)c.push('bold');if(h>=70&&h<=170&&s>0.12&&l<0.8)c.push('green');if(h>=190&&h<=250&&s>0.15)c.push('blue');if(h>=15&&h<=45&&l<0.62&&l>0.2&&s>0.25)c.push('wood');return c}
CAT.forEach(x=>x.cls=colorCls(x.hex));
function textOn(hex){return hsl(hex).l>0.58?'#1d1c1a':'#ffffff'}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('on'),2200)}
const store={get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const overlap=(a,b)=>a.x<b.x+b.w-1&&a.x+a.w>b.x+1&&a.y<b.y+b.h-1&&a.y+a.h>b.y+1;
const inRoom=(b,room)=>b.x>=-0.5&&b.y>=-0.5&&b.x+b.w<=room.W+0.5&&b.y+b.h<=room.D+0.5;
function doorBox(room){const {W,D,door}=room;if(!door||door==='none')return null;const s=80,left=door[1]==='l',top=door[0]==='t';return{x:left?0:W-s,y:top?10:D-s-10,w:s,h:s}}
function freeSpot(room,cands,taken){const d=doorBox(room);return cands.find(b=>inRoom(b,room)&&!taken.some(o=>overlap(b,o))&&!(d&&overlap(b,d)))||null}

// ================= rooms =================
// slot: k key, cat catalogue slot, he label, g group, on(room,sel) optional condition
const ROOMS={
 living:{he:'סלון',en:'living room',hero:[12,90,20,137],budget:5000,
  wallA:'אורך הקיר של הספה (ס״מ)',wallB:'עומק — מהספה לקיר ממול (ס״מ)',mainWall:'הספה',oppWall:'הקיר ממול (טלוויזיה)',
  keeps:{sofa:'ספה',arm:'כורסה',coffee:'שולחן קפה',rug:'שטיח',lamps:'מנורות',art:'תמונות'},
  slots:[{k:'sofa',cat:'sofa',he:'ספה',g:'f'},{k:'coffee',cat:'coffee',he:'שולחן קפה',g:'f'},{k:'rug',cat:'rug',he:'שטיח',g:'t'},{k:'arm',cat:'arm',he:'כורסה',g:'f'},{k:'side',cat:'side',he:'שולחן צד',g:'f'},{k:'pouf',cat:'pouf',he:'הדום',g:'f'},
   {k:'pendant',cat:'pendant',he:'מנורת תקרה',g:'l'},{k:'floor',cat:'floor',he:'מנורה עומדת',g:'l'},{k:'table',cat:'table',he:'מנורת שולחן',g:'l'},{k:'blind',cat:'blind',he:'וילון',g:'t'},
   {k:'art',cat:'art',he:'תמונה לקיר',g:'d'},{k:'shelf',cat:'shelf',he:'מדף',g:'d'},{k:'mirror',cat:'mirror',he:'מראה',g:'d'},{k:'plant',cat:'plant',he:'צמח',g:'d'},
   {k:'cushion',cat:'cushion',he:'כיסוי כרית (בסיס)',g:'t'},{k:'cushion2',cat:'cushion',he:'כיסוי כרית (הדגשה)',g:'t'},{k:'throw',cat:'throw',he:'שמיכה',g:'t'},{k:'vase',cat:'vase',he:'אגרטל',g:'d'},{k:'candle',cat:'candle',he:'נרות',g:'d'}],
  drop:['mirror','plant','vase','shelf','candle','throw','cushion2','pouf','art','table','side','arm','floor','rug']},
 bedroom:{he:'חדר שינה',en:'bedroom',hero:[206,226,220,261],budget:5000,
  wallA:'אורך הקיר של ראש המיטה (ס״מ)',wallB:'עומק — מראש המיטה לקיר ממול (ס״מ)',mainWall:'ראש המיטה',oppWall:'הקיר ממול',
  keeps:{bed:'מיטה',mattress:'מזרן',wardrobe:'ארון בגדים',dresser:'שידה',rug:'שטיח',lamps:'מנורות'},
  slots:[{k:'bed',cat:'bed',he:'מיטה',g:'f'},{k:'mattress',cat:'mattress',he:'מזרן',g:'f'},{k:'bedside',cat:'bedside',he:'שידת לילה',g:'f'},{k:'wardrobe',cat:'wardrobe',he:'ארון בגדים',g:'f'},{k:'dresser',cat:'dresser',he:'שידת מגירות',g:'f'},
   {k:'rug',cat:'rug',he:'שטיח',g:'t'},{k:'pendant',cat:'pendant',he:'מנורת תקרה',g:'l'},{k:'table',cat:'table',he:'מנורת לילה',g:'l'},{k:'curtain',cat:'curtain',he:'וילון',g:'t'},
   {k:'duvet',cat:'duvet',he:'מצעים',g:'t'},{k:'bedspread',cat:'bedspread',he:'כיסוי מיטה',g:'t'},{k:'cushion',cat:'cushion',he:'כיסוי כרית נוי',g:'t'},{k:'throw',cat:'throw',he:'שמיכה לרגליים',g:'t'},
   {k:'art',cat:'art',he:'תמונה מעל המיטה',g:'d'},{k:'mirror',cat:'mirror',he:'מראה',g:'d'},{k:'plant',cat:'plant',he:'צמח',g:'d'},{k:'underbed',cat:'underbed',he:'אחסון מתחת למיטה',g:'d',on:(r,s)=>{const b=itemOf(s,'bed',r);return !b||b.keep||![207,208,211].includes(b.id)}}],
  drop:['plant','mirror','underbed','throw','cushion','art','bedspread','dresser','rug','pendant','curtain','table','bedside','wardrobe']},
 kitchen:{he:'מטבח',en:'kitchen and dining corner',hero:[292,309,319,370],budget:3000,
  wallA:'אורך קיר המטבח (ס״מ)',wallB:'עומק — מקיר המטבח לקיר ממול (ס״מ)',mainWall:'פינת האוכל',oppWall:'קיר המטבח',
  keeps:{dtable:'שולחן אוכל',chair:'כיסאות',lamps:'מנורות'},
  slots:[{k:'kunit',cat:'kunit',he:'מטבחון קומפקטי',g:'r',on:r=>r.mode==='renovate'&&r.W<=180},{k:'ksink',cat:'ksink',he:'כיור מטבח',g:'r',on:(r,s)=>r.mode==='renovate'&&!(s.kunit&&s.kunit.id!=null)},{k:'ktap',cat:'ktap',he:'ברז מטבח',g:'r',on:(r,s)=>r.mode==='renovate'&&!(s.kunit&&s.kunit.id!=null)},
   {k:'dtable',cat:'dtable',he:'שולחן אוכל',g:'f'},{k:'chair',cat:'chair',he:'כיסאות',g:'f'},{k:'cart',cat:'cart',he:'עגלה / אי',g:'f'},
   {k:'pendant',cat:'pendant',he:'מנורה מעל השולחן',g:'l'},{k:'klight',cat:'klight',he:'תאורה מתחת לארונות',g:'l'},
   {k:'krail',cat:'krail',he:'מדף / מוט תלייה',g:'d'},{k:'jars',cat:'jars',he:'צנצנות ואחסון',g:'d'},{k:'art',cat:'art',he:'תמונה',g:'d'},{k:'plant',cat:'plant',he:'צמח',g:'d'},
   {k:'tablelinen',cat:'tablelinen',he:'טקסטיל לשולחן',g:'t'},{k:'ktowel',cat:'ktowel',he:'מגבות מטבח',g:'t'}],
  drop:['art','plant','jars','ktowel','tablelinen','krail','klight','cart','pendant']},
 bath:{he:'חדר רחצה',en:'bathroom',hero:[454,375,407,431],budget:2000,
  wallA:'אורך הקיר של הכיור (ס״מ)',wallB:'עומק — מקיר הכיור לקיר ממול (ס״מ)',mainWall:'הכיור',oppWall:'הקיר ממול',
  keeps:{bmirror:'מראה',blight:'תאורה',towel:'מגבות'},
  slots:[{k:'vanity',cat:'vanity',he:'ארון כיור + כיור',g:'r',on:r=>r.mode==='renovate'},{k:'btap',cat:'btap',he:'ברז לכיור',g:'r',on:r=>r.mode==='renovate'},{k:'mcab',cat:'mcab',he:'ארון מראה',g:'r',on:r=>r.mode==='renovate'},{k:'tallcab',cat:'tallcab',he:'ארון גבוה',g:'r',on:r=>r.mode==='renovate'},
   {k:'bshelf',cat:'bshelf',he:'יחידת מדפים',g:'f',on:r=>r.mode!=='renovate'},{k:'btrolley',cat:'btrolley',he:'עגלת אחסון',g:'f'},{k:'bstool',cat:'bstool',he:'שרפרף / ספסל',g:'f'},
   {k:'bmirror',cat:'bmirror',he:'מראה',g:'d',on:r=>r.mode!=='renovate'},{k:'bwall',cat:'bwall',he:'ארון קיר',g:'d',on:r=>r.mode!=='renovate'},{k:'blight',cat:'blight',he:'תאורה',g:'l'},
   {k:'towel',cat:'towel',he:'מגבות',g:'t'},{k:'bathmat',cat:'bathmat',he:'שטיחון',g:'t'},{k:'shower',cat:'shower',he:'וילון מקלחת',g:'t',on:r=>r.shower!=='glass'},{k:'rod',cat:'rod',he:'מוט לוילון',g:'d',on:r=>r.shower!=='glass'},
   {k:'bset',cat:'bset',he:'סט אביזרים',g:'d'},{k:'bhook',cat:'bhook',he:'מתלה / מדף מקלחת',g:'d'},{k:'bbox',cat:'bbox',he:'קופסאות',g:'d'},{k:'plant',cat:'plant',he:'צמח',g:'d'}],
  drop:['plant','bbox','bstool','btrolley','bhook','bset','bwall','tallcab','blight','bathmat','bshelf']},
};
const slotsOf=(room,sel)=>ROOMS[room.type].slots.filter(s=>!s.on||s.on(room,sel||{}));
const SLOTDEF=type=>Object.fromEntries(ROOMS[type].slots.map(s=>[s.k,s]));

// ================= form =================
const PER_DEF={
 living:{W:280,D:200,winWall:'sofa',winW:120,door:'none',dir:'u',keep:[],budget:5000,tv:'wall',uses:['tv','host','relax'],ksW:200,ksD:90},
 bedroom:{W:320,D:300,winWall:'left',winW:120,door:'tr',dir:'u',keep:[],budget:5000,sleepers:'couple'},
 kitchen:{W:260,D:300,winWall:'left',winW:100,door:'br',dir:'u',keep:[],budget:3000,seats:4,mode:'refresh'},
 bath:{W:200,D:180,winWall:'none',winW:60,door:'tl',dir:'u',keep:[],budget:2000,mode:'refresh',shower:'curtain'},
};
let F=store.get('ikea-room-form2');
if(!F){const old=store.get('ikea-room-form')||{};F={room:'living',renter:old.renter!==undefined?old.renter:true,likes:old.likes||['natural','warm'],dis:old.dis||[],per:{}};
  for(const t in PER_DEF)F.per[t]=Object.assign({},PER_DEF[t]);
  for(const k of Object.keys(PER_DEF.living))if(old[k]!==undefined)F.per.living[k]=old[k];}
for(const t in PER_DEF)F.per[t]=Object.assign({},PER_DEF[t],F.per[t]||{});
const P=()=>F.per[F.room];
let photoFile=null;
function saveForm(){store.set('ikea-room-form2',F)}
const toggleIn=(a,k)=>a.includes(k)?a.filter(x=>x!==k):[...a,k];
function chipGroup(el,map,getSel,multi,onChange,neg){
  el.innerHTML='';
  for(const [k,v] of Object.entries(map)){
    const b=document.createElement('button');b.type='button';b.className='chip'+(neg?' neg':'');b.textContent=typeof v==='string'?v:v.he;
    const on=()=>b.setAttribute('aria-pressed',String(multi?getSel().includes(k):String(getSel())===String(k)));on();b._on=on;
    b.onclick=()=>{onChange(k);[...el.children].forEach(c=>c._on());saveForm()};el.appendChild(b);
  }
}
function winOptions(t){const m=ROOMS[t].mainWall,o=ROOMS[t].oppWall;return `<option value="sofa">מאחורי ${esc(m)}</option><option value="tv">ב${esc(o)}</option><option value="left">בקיר הצד (שמאל בתוכנית)</option><option value="right">בקיר הצד (ימין בתוכנית)</option><option value="none">אין חלון</option>`}
function renderRoomForm(){
  const t=F.room,R=ROOMS[t],p=P();
  document.querySelectorAll('#roomTabs .chip').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.room===t)));
  $('#heroTitle').innerHTML=({living:'הסלון שלך,',bedroom:'חדר השינה שלך,',kitchen:'המטבח שלך,',bath:'חדר הרחצה שלך,'})[t]+'<br>בעין של מעצב.';
  document.querySelectorAll('.collage img').forEach((im,i)=>{im.src=img(R.hero[i])});
  $('#lblW').textContent=R.wallA;$('#lblD').textContent=R.wallB;
  $('#winWall').innerHTML=winOptions(t);
  for(const id of ['W','D','winW']){const e=$('#'+id);e.value=p[id];e.oninput=()=>{p[id]=+e.value||0;saveForm()}}
  for(const id of ['winWall','door']){const e=$('#'+id);e.value=p[id];e.onchange=()=>{p[id]=e.value;saveForm()}}
  chipGroup($('#dirChips'),DIRS,()=>p.dir,false,k=>{p.dir=k});
  chipGroup($('#keepChips'),R.keeps,()=>p.keep,true,k=>{p.keep=toggleIn(p.keep,k);renderExtras()});
  const b=$('#budget');b.value=p.budget;$('#budgetOut').textContent=ils(p.budget);b.oninput=()=>{p.budget=+b.value;$('#budgetOut').textContent=ils(p.budget);saveForm()};
  renderExtras();
}
function renderExtras(){
  const t=F.room,p=P(),box=$('#extras');let h='';
  if(t==='living'){h+=`<label class="f"><span>טלוויזיה</span><select id="tv"><option value="wall">על הקיר / מדף צף</option><option value="unit">על מזנון (עומק 40)</option><option value="none">אין</option></select></label><label class="f"><span>בשביל מה החדר</span></label><div class="chips" id="useChips"></div>`;
    if(p.keep.includes('sofa'))h+=`<div class="row"><label class="f"><span>רוחב הספה שלך (ס״מ)</span><input type="number" id="ksW" inputmode="numeric"></label><label class="f"><span>עומק הספה שלך (ס״מ)</span><input type="number" id="ksD" inputmode="numeric"></label></div>`}
  if(t==='bedroom')h+=`<label class="f"><span>מי ישן בחדר</span></label><div class="chips" id="sleepChips"></div>`;
  if(t==='kitchen')h+=`<label class="f"><span>סוג השינוי</span></label><div class="chips" id="modeChips"></div><p class="hint" id="modeHint"></p><label class="f"><span>כמה יושבים לאכול</span></label><div class="chips" id="seatChips"></div>`;
  if(t==='bath')h+=`<label class="f"><span>סוג השינוי</span></label><div class="chips" id="modeChips"></div><p class="hint" id="modeHint"></p><label class="f"><span>מקלחת</span></label><div class="chips" id="showerChips"></div>`;
  box.innerHTML=h;
  if(t==='living'){const tv=$('#tv');tv.value=p.tv;tv.onchange=()=>{p.tv=tv.value;saveForm()};chipGroup($('#useChips'),{tv:'טלוויזיה',host:'אירוח',read:'קריאה',relax:'מנוחה'},()=>p.uses,true,k=>{p.uses=toggleIn(p.uses,k)});
    for(const id of ['ksW','ksD']){const e=$('#'+id);if(e){e.value=p[id];e.oninput=()=>{p[id]=+e.value||0;saveForm()}}}}
  if(t==='bedroom')chipGroup($('#sleepChips'),{single:'אדם אחד',couple:'זוג'},()=>p.sleepers,false,k=>{p.sleepers=k});
  if(t==='kitchen'||t==='bath'){chipGroup($('#modeChips'),{refresh:'רענון בלי שיפוץ',renovate:'כולל שיפוץ'},()=>p.mode,false,k=>{p.mode=k;modeHint()});modeHint()}
  if(t==='kitchen')chipGroup($('#seatChips'),{2:'2',4:'4',6:'6'},()=>p.seats,false,k=>{p.seats=+k});
  if(t==='bath')chipGroup($('#showerChips'),{curtain:'מקלחון עם וילון',glass:'מקלחון זכוכית',bath:'אמבטיה'},()=>p.shower,false,k=>{p.shower=k});
  saveForm();
}
function modeHint(){const e=$('#modeHint');if(!e)return;const p=P();const k=F.room==='kitchen';
  e.textContent=p.mode==='renovate'?(k?'כולל כיור וברז חדשים (צריך אינסטלטור). במטבח קצר עד 180 ס״מ — גם מטבחון שלם. ארונות מטבח מלאים מתכננים בכלי התכנון של איקאה.':'כולל ארון כיור עם כיור, ברז וארון מראה (צריך אינסטלטור וקידוחים).')+(F.renter?' שימו לב: סימנתם שכירות — כדאי לתאם עם בעל הדירה.':''):'רק מה שנכנס בלי כלי עבודה: אחסון, תאורה, טקסטיל ואביזרים.'}
function initForm(){
  const rt=$('#roomTabs');rt.innerHTML='';
  for(const [k,R] of Object.entries(ROOMS)){const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.room=k;b.textContent=R.he;b.onclick=()=>{F.room=k;saveForm();renderRoomForm();$('#results').classList.add('hidden')};rt.appendChild(b)}
  $('#renter').checked=F.renter;$('#renter').onchange=e=>{F.renter=e.target.checked;saveForm();modeHint()};
  chipGroup($('#likeChips'),LIKES,()=>F.likes,true,k=>{F.likes=toggleIn(F.likes,k)});
  chipGroup($('#disChips'),DISLIKES,()=>F.dis,true,k=>{F.dis=toggleIn(F.dis,k)},true);
  $('#photo').onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;photoFile=f;const u=URL.createObjectURL(f);$('#phPrev').outerHTML='<img id="phPrev" alt="התמונה שלך" src="'+u+'">';refreshAi()};
  $('#go').onclick=()=>{generateLocal();$('#results').classList.remove('hidden');$('#results').scrollIntoView({behavior:'smooth',block:'start'})};
  renderRoomForm();
}

// ================= room model =================
function roomOf(){
  const p=P(),t=F.room;const W=Math.max(120,p.W||280),D=Math.max(120,p.D||200);
  const r={type:t,W,D,winWall:p.winWall,winW:Math.max(40,p.winW||100),door:p.door,dir:p.dir,renter:F.renter,keep:new Set(p.keep),likes:F.likes,dis:F.dis,budget:p.budget,
    tv:p.tv||'none',uses:new Set(p.uses||[]),sleepers:p.sleepers||'couple',seats:p.seats||4,mode:p.mode||'refresh',shower:p.shower||'curtain'};
  r.tvd=t==='living'?(r.tv==='unit'?40:r.tv==='wall'?8:0):0;
  r.keptSofa=t==='living'&&r.keep.has('sofa')?{fw:Math.max(80,p.ksW||200),fd:Math.max(50,p.ksD||90)}:null;
  return r;
}
const KEPT_DIMS={arm:{fw:75,fd:80},coffee:{fw:90,fd:55},rug:{fw:230,fd:160},bed:{fw:166,fd:207},mattress:{fw:160,fd:200},wardrobe:{fw:100,fd:60},dresser:{fw:80,fd:48},dtable:{fw:120,fd:80},chair:{fw:45,fd:50}};
function keptItem(slot,room){const d=slot==='sofa'?room.keptSofa:KEPT_DIMS[slot]||{fw:0,fd:0};return{keep:true,id:'k-'+slot,slot,n:'שלך',v:'נשאר מהבית',p:0,fw:d.fw,fd:d.fd,hex:'#a8a39a',tags:'',cls:[]}}
function keepsSlot(room,slot){if(room.keep.has(slot))return true;if(room.keep.has('lamps')&&['floor','table','pendant'].includes(slot))return room.type!=='living'||slot!=='pendant';if(room.keep.has('art')&&slot==='art')return true;return false}
function itemOf(sel,slot,room){const e=sel[slot];if(!e)return null;if(e.keep)return keptItem(slot,room);return BY[e.id]||null}

// ================= fit + qty =================
const artQty=(x,w)=>x.fw<(w||160)*0.33&&x.fw<=61?2:1;
function fitCheck(x,slot,sel,room){
  const t=room.type;let ok=true,why='',bonus=0;const {W,D}=room;
  if(room.renter&&x.id===71)return{ok:false,why:'דורשת חיבור חשמלאי',bonus:0};
  if(t==='living'){const tvd=room.tvd;const sofa=itemOf(sel,'sofa',room);const sw=sofa?sofa.fw:0,sd=sofa?sofa.fd:0;
   switch(slot){
    case 'sofa':{if(x.fw>W-10){ok=false;why='רחבה מהקיר';break}if(x.fd>D-tvd-SEAT_GAP-MIN_PASS){ok=false;why='עמוקה מדי לחדר';break}const tg=Math.min(Math.max(W*0.72,120),230);bonus-=Math.abs(x.fw-tg)/25;bonus-=Math.max(0,x.fd-0.42*D)/8;if(room.uses.has('host')&&x.fw>=180)bonus+=1.5;if(W-x.fw>=48)bonus+=1;break}
    case 'coffee':{const av=D-tvd-sd-SEAT_GAP-MIN_PASS;if(x.fd>av){ok=false;why='לא נשאר מעבר של 60 ס״מ';break}const r=sw?x.fw/sw:0.6;if(r>0.8){bonus-=3;why='ארוך יחסית לספה'}else if(r<0.4)bonus-=1.5;if(av-x.fd>=GOOD_PASS-MIN_PASS)bonus+=1;break}
    case 'rug':{if(x.fw>W-20||x.fd>D-tvd-20){ok=false;why='גדול מהחדר';break}if(sw&&x.fw<sw*0.6){bonus-=3;why='קטן ביחס לספה'}else if(sw&&x.fw>=sw*0.85)bonus+=2;bonus-=Math.max(0,Math.min(W-40,sw+40)-x.fw)/30;break}
    case 'arm':{if(!layout(room,Object.assign({},sel,{arm:{id:x.id}})).pos.arm){ok=false;why='אין מקום בלי לחסום מעבר'}else if(room.uses.has('read'))bonus+=0.5;break}
    case 'side':{if(!layout(room,Object.assign({},sel,{side:{id:x.id}})).pos.side){ok=false;why='אין מקום ליד הספה'}else if(sd&&x.fd>sd+5)bonus-=1;break}
    case 'floor':{if(room.uses.has('read')&&[69,76,70].includes(x.id))bonus+=1;break}
    case 'pouf':{const hc=!!itemOf(sel,'coffee',room);if(!hc){const av=D-tvd-sd-SEAT_GAP-MIN_PASS;if(x.fd>av){ok=false;why='לא נשאר מעבר';break}bonus+=x.fw>=50?1.5:0}else bonus-=x.fw>60?1:0;if(room.uses.has('host'))bonus+=0.5;break}
    case 'pendant':{bonus-=Math.abs(x.fw-(W+D)/12)/7;break}
    case 'blind':{if(room.winWall==='none'){ok=false;why='אין חלון';break}const n=Math.ceil(room.winW/140),need=room.winW/n;if(x.fw<need-2){ok=false;why='צר מהחלון';break}bonus-=(x.fw-need)/10;break}
    case 'art':{const q=artQty(x,sw);const w=x.fw*q+(q-1)*8;if(w>(sw||W)*1.05){bonus-=4;why='רחבה מהספה'}bonus-=Math.abs(w-(sw||160)*0.62)/40;break}
    case 'shelf':{if(x.fw>W-40){ok=false;why='ארוך מהקיר'}break}
    case 'mirror':{if(x.id===167&&room.renter)bonus+=1;break}
   }}
  else if(t==='bedroom'){const bed=itemOf(sel,'bed',room);const bw=bed?bed.fw:0,bl=bed?bed.fd:0;const nw=bed?(bed.keep?160:nomW(bed)):0;
   switch(slot){
    case 'bed':{const n=nomW(x);if(x.fw>W-20){ok=false;why='רחבה מהקיר';break}if(x.fd>D-60){ok=false;why='ארוכה מדי לחדר';break}
      const want=room.sleepers==='couple'?160:90;if(room.sleepers==='couple'&&n<140){ok=false;why='צרה לזוג';break}if(room.sleepers!=='couple'&&n>140){ok=false;why='גדולה לאדם אחד';break}{const d=doorBox(room);if(d&&overlap({x:(W-x.fw)/2,y:D-x.fd,w:x.fw,h:x.fd},d)){bonus-=6;why='חוסמת את הדלת'}}bonus-=Math.abs(n-want)/25;
      const side=(W-x.fw)/2;if(side<40)bonus-=3;else if(side>=55)bonus+=1;if(D-x.fd<70)bonus-=2;break}
    case 'mattress':{const n=x.fw;if(bed&&!bed.keep&&n!==nw){ok=false;why='לא בגודל המיטה';break}if(bed&&bed.keep&&n<140&&room.sleepers==='couple'){ok=false;why='צר לזוג'}break}
    case 'bedside':{const L=layout(room,Object.assign({},sel,{bedside:{id:x.id}}));if(!L.pos.bedside){ok=false;why='אין מקום ליד המיטה'}break}
    case 'wardrobe':{const L=layout(room,Object.assign({},sel,{wardrobe:{id:x.id}}));if(!L.pos.wardrobe){ok=false;why='אין קיר פנוי עם מקום לפתיחה';break}
      const need=room.sleepers==='couple'?150:90;bonus-=Math.max(0,need-x.fw)/30;bonus-=Math.max(0,x.fw-need-60)/40;break}
    case 'dresser':{const L=layout(room,Object.assign({},sel,{dresser:{id:x.id}}));if(!L.pos.dresser){ok=false;why='אין קיר פנוי'}break}
    case 'rug':{if(x.fw>W-20||x.fd>D-20){ok=false;why='גדול מהחדר';break}const tg=bw+60;if(bw&&x.fd<bw+20&&x.fw<bw+20){bonus-=3;why='צר מהמיטה'}bonus-=Math.abs(Math.max(x.fw,x.fd)-tg)/40;break}
    case 'duvet':{const dbl=nw>=140||room.sleepers==='couple';if(dbl!==(x.fw>=200)){ok=false;why=dbl?'קטן למיטה זוגית':'גדול למיטת יחיד'}break}
    case 'bedspread':{const dbl=nw>=140||room.sleepers==='couple';if(dbl!==(x.fw>=200)){ok=false;why=dbl?'קטן למיטה זוגית':'גדול למיטת יחיד'}break}
    case 'curtain':{if(room.winWall==='none'){ok=false;why='אין חלון';break}if(/האפלה|מחשיך/.test(x.v))bonus+=room.dir==='w'||room.dir==='s'||room.dir==='e'?2:1;break}
    case 'pendant':{bonus-=Math.abs(x.fw-(W+D)/12)/7;break}
    case 'art':{const q=artQty(x,bw);const w=x.fw*q+(q-1)*8;if(w>(bw||W)*1.05){bonus-=4;why='רחבה מהמיטה'}bonus-=Math.abs(w-(bw||140)*0.6)/40;break}
    case 'mirror':{if(x.id===167&&room.renter)bonus+=1.5;break}
   }}
  else if(t==='kitchen'){
   switch(slot){
    case 'kunit':{if(x.fw>W){ok=false;why='רחב מהקיר'}break}
    case 'dtable':{const L=layout(room,Object.assign({},sel,{dtable:{id:x.id}}));if(!L.pos.dtable){ok=false;why='אין מקום עם מעבר מסביב';break}if(x.fw>W-110){bonus-=4;why='ארוך לחדר'}const cap=tableSeats(x);if(cap<room.seats){bonus-=4;why='פחות מ-'+room.seats+' מקומות'}bonus-=Math.max(0,cap-room.seats)*0.7;break}
    case 'chair':{const tb=itemOf(sel,'dtable',room);if(tb&&!tb.keep&&x.fw>62){bonus-=1}break}
    case 'cart':{const L=layout(room,Object.assign({},sel,{cart:{id:x.id}}));if(!L.pos.cart){ok=false;why='אין מקום פנוי';break}if(x.fw>100)bonus-=W<260?3:0.5;break}
    case 'pendant':{const tb=itemOf(sel,'dtable',room);const tw=tb?Math.min(tb.fw,tb.fd):80;if(x.fw>tw-20){bonus-=2;why='רחבה מהשולחן'}bonus-=Math.abs(x.fw-tw*0.45)/10;break}
   }}
  else if(t==='bath'){
   switch(slot){
    case 'vanity':{if(x.fw>Math.max(60,W-90)){ok=false;why='רחב מהקיר (צריך מקום גם לאסלה)';break}if(D-x.fd<70){bonus-=3;why='מעבר צר מולו'}bonus-=Math.abs(x.fw-Math.min(100,(W-90)*0.7))/30;break}
    case 'mcab':{const v=itemOf(sel,'vanity',room);const vw=v?v.fw:60;if(x.fw>vw+2){ok=false;why='רחב מהכיור'}else bonus-=(vw-x.fw)/25;if(room.renter&&/תאורה/.test(x.v))bonus-=1;break}
    case 'bmirror':{if(x.fw>90){bonus-=2}break}
    case 'tallcab':case 'bshelf':case 'btrolley':case 'bstool':{const L=layout(room,Object.assign({},sel,{[slot]:{id:x.id}}));if(!L.pos[slot]){ok=false;why='אין מקום פנוי על הרצפה'}break}
    case 'bhook':{if(room.renter&&x.id===434)bonus+=2;if(room.shower==='bath'&&x.id===436)bonus+=1;break}
    case 'rod':{if(room.renter)bonus+=0}
   }}
  return{ok,why,bonus};
}
function tableSeats(x){if(!x)return 0;const round=x.fw===x.fd;if(round)return x.fw>=100?4:2;if(x.fw>=175)return 6;if(x.fw>=110)return 4;return 2}
function qtyFor(slot,x,sel,room){
  const t=room.type;
  if(t==='living'){if(slot==='art')return artQty(x,(itemOf(sel,'sofa',room)||{}).fw);if(slot==='cushion'){const s=itemOf(sel,'sofa',room);return s&&s.fw>=180?2:1}if(slot==='blind')return Math.ceil(room.winW/140);return 1}
  if(t==='bedroom'){const bed=itemOf(sel,'bed',room);const dbl=bed?(bed.keep?room.sleepers==='couple':nomW(bed)>=140):room.sleepers==='couple';
    if(slot==='bedside'||slot==='table')return dbl?2:1;if(slot==='cushion')return 2;if(slot==='underbed')return 2;if(slot==='art')return artQty(x,bed?bed.fw:140);
    if(slot==='curtain'){const fab=/זוג/.test(x.v)?x.fw*2:x.fw;return Math.max(1,Math.ceil(room.winW*1.8/fab))}return 1}
  if(t==='kitchen'){if(slot==='chair'){const tb=itemOf(sel,'dtable',room);const cap=tb?(tb.keep?room.seats:tableSeats(tb)):room.seats;return Math.min(room.seats,cap)}
    if(slot==='tablelinen')return /פלייסמט/.test(x.v)?room.seats:1;if(slot==='ktowel')return /סט|יחידות/.test(x.v)?1:2;if(slot==='jars')return /סט/.test(x.v)?1:3;return 1}
  if(t==='bath'){if(slot==='towel')return 2;return 1}
  return 1;
}

// ================= scoring / builder =================
function scoreItem(x,slot,style,room,sel){
  let s=0;if(x.tags.includes(style)){s+=10;if(x.tags[0]===style)s+=2}else s-=6;
  for(const k of room.likes){const L=LIKES[k];if(L&&L.cls.some(c=>x.cls.includes(c)))s+=1.2}
  for(const k of room.dis){const Dd=DISLIKES[k];if(!Dd)continue;if((Dd.cls&&Dd.cls.some(c=>x.cls.includes(c)))||(Dd.ids&&Dd.ids.includes(x.id)))s-=5}
  if(slot==='cushion2'){const b=itemOf(sel,'cushion',room);if(b&&b.id===x.id)s-=20;if(['bold','black','green','wood'].some(c=>x.cls.includes(c)))s+=1.5}
  if(slot==='cushion'&&room.type==='living'&&['beige','white','grey'].some(c=>x.cls.includes(c)))s+=1;
  if(room.renter&&[434].includes(x.id))s+=1;
  const heavy=['sofa','bed','wardrobe','vanity','kunit','mattress','dtable'].includes(slot)?1000:['arm','coffee','dresser','cart','mcab','tallcab','ksink','ktap','chair'].includes(slot)?500:250;
  s-=x.p*qtyFor(slot,x,sel,room)/heavy;
  const f=fitCheck(x,slot,sel,room);return{s:s+f.bonus,ok:f.ok,why:f.why};
}
function candidates(slot,style,room,sel){const d=SLOTDEF(room.type)[slot];return CAT.filter(x=>x.slot===d.cat).map(x=>Object.assign({x},scoreItem(x,slot,style,room,sel))).sort((a,b)=>(b.ok-a.ok)||(b.s-a.s))}
function chooseStyles(room){const sc={};for(const k in STYLES)sc[k]=STYLE_BASE[k];for(const l of room.likes)for(const [k,v] of Object.entries((LIKES[l]||{}).st||{}))sc[k]+=v;for(const d of room.dis)for(const [k,v] of Object.entries((DISLIKES[d]||{}).st||{}))sc[k]+=v;return Object.keys(sc).sort((a,b)=>sc[b]-sc[a]).slice(0,3)}
function pick(slot,style,room,sel){const cs=candidates(slot,style,room,sel);return cs.find(c=>c.ok)||null}
function buildSel(style,room){
  const sel={};
  for(const s of ROOMS[room.type].slots){
    if(s.on&&!s.on(room,sel)){sel[s.k]=null;continue}
    if(keepsSlot(room,s.k)){sel[s.k]={keep:true};continue}
    const c=pick(s.k,style,room,sel);sel[s.k]=c?{id:c.x.id,qty:qtyFor(s.k,c.x,sel,room)}:null;
  }
  return sel;
}
const activeSlots=(room,sel)=>ROOMS[room.type].slots.filter(s=>!s.on||s.on(room,sel));
function totalOf(sel){let t=0;for(const k in sel){const e=sel[k];if(e&&!e.keep&&e.id!=null&&BY[e.id])t+=BY[e.id].p*(e.qty||1)}return t}
function fitBudget(c,room){
  const sel=c.sel;let guard=0;const dropped=[];
  let tol=9;
  while(totalOf(sel)>room.budget&&guard++<120){
    let best=null;
    for(const s of activeSlots(room,sel)){const e=sel[s.k];if(!e||e.keep||e.lock)continue;const cur=BY[e.id];const curS=scoreItem(cur,s.k,c.style,room,sel).s;
      for(const cd of candidates(s.k,c.style,room,sel)){if(!cd.ok||cd.x.p>=cur.p||cd.s<curS-tol)continue;const q=qtyFor(s.k,cd.x,sel,room);const save=cur.p*(e.qty||1)-cd.x.p*q;if(save<=0)continue;const ratio=save/(curS-cd.s+2);if(!best||ratio>best.ratio)best={slot:s.k,id:cd.x.id,q,ratio}}}
    if(best){sel[best.slot]={id:best.id,qty:best.q};continue}
    const d=ROOMS[room.type].drop.find(k=>sel[k]&&!sel[k].keep&&!sel[k].lock);const g=d&&SLOTDEF(room.type)[d].g;if(!d||g==='l'||g==='f'){if(tol<40){tol=40;continue}if(!d)break}sel[d]=null;dropped.push(d);
  }
  c.dropped=dropped;return c;
}
function localConcept(style,room){const c={style,sel:buildSel(style,room),src:'local',room:room.type};fitBudget(c,room);return c}

// ================= layouts (cm; y=0 is the wall opposite the main wall) =================
function layout(room,sel){return({living:layoutLiving,bedroom:layoutBedroom,kitchen:layoutKitchen,bath:layoutBath})[room.type](room,sel)}
function layoutLiving(room,sel){
  const {W,D,tvd}=room;const P={},notes=[],fixed=[];const it=k=>itemOf(sel,k,room);
  const sofa=it('sofa'),coffee=it('coffee'),arm=it('arm'),side=it('side'),lamp=it('floor'),pouf=it('pouf'),rug=it('rug'),plant=it('plant'),mirror=it('mirror');
  if(room.tv==='unit')fixed.push({x:W/2-80,y:0,w:160,h:40,label:'טלוויזיה',dark:1});else if(room.tv==='wall')fixed.push({x:W/2-62,y:0,w:124,h:6,label:'טלוויזיה',dark:1});
  if(!sofa)return{pos:P,notes,fixed};
  const sw=sofa.fw,sd=sofa.fd;let sx=(W-sw)/2;const sy=D-sd;let gapL=sx,gapR=W-sx-sw;
  if(side){const need=side.fw+4;if(gapL>=need)P.side={x:sx-side.fw-2,y:D-side.fd-2,w:side.fw,h:side.fd};else if(gapL+gapR>=need){sx=need;gapL=sx;gapR=W-sx-sw;P.side={x:2,y:D-side.fd-2,w:side.fw,h:side.fd}}}
  P.sofa={x:sx,y:sy,w:sw,h:sd};const frontY=sy-SEAT_GAP;
  if(coffee)P.coffee={x:sx+sw/2-coffee.fw/2,y:frontY-coffee.fd,w:coffee.fw,h:coffee.fd,round:coffee.fw===coffee.fd&&[30,36].includes(coffee.id)};
  if(arm){const cy=P.coffee?P.coffee.y+P.coffee.h/2:frontY-30;const ah=arm.fw,aw=arm.fd;let ay=Math.max(Math.min(cy-ah/2,sy-6-ah),tvd+4);
    const cR=P.coffee?P.coffee.x+P.coffee.w:sx+sw*0.7,cL=P.coffee?P.coffee.x:sx+sw*0.3;const pOK=y=>y>=tvd+4&&y+ah<=sy-4;
    if(W-(cR+38)>=aw+4&&pOK(ay)&&!(P.side&&P.side.x>sx))P.arm={x:W-aw-4,y:ay,w:aw,h:ah,face:'l'};
    else if(cL-38>=aw+4&&pOK(ay)&&!(P.side&&P.side.x<sx&&P.side.y<ay+ah))P.arm={x:4,y:ay,w:aw,h:ah,face:'r'};
    else if(gapR>=arm.fw+4)P.arm={x:sx+sw+2,y:D-arm.fd-2,w:arm.fw,h:arm.fd,face:'u'};
    else if(gapL>=arm.fw+4&&!P.side)P.arm={x:sx-arm.fw-2,y:D-arm.fd-2,w:arm.fw,h:arm.fd,face:'u'}}
  if(lamp){const lw=lamp.fw;const fR=W-(sx+sw)-(P.arm&&P.arm.face==='u'&&P.arm.x>sx?P.arm.w+2:0);const fL=sx-(P.side?P.side.w+2:0)-(P.arm&&P.arm.face==='u'&&P.arm.x<sx?P.arm.w+2:0);
    if(fR>=lw+2)P.floor={x:W-lw-2,y:D-lw-2,w:lw,h:lw,round:1};else if(fL>=lw+2)P.floor={x:2,y:D-lw-2,w:lw,h:lw,round:1};
    else if(P.arm&&P.arm.face!=='u'){const r=P.arm.face==='l';P.floor={x:r?W-lw-2:2,y:Math.max(tvd+2,P.arm.y-lw-2),w:lw,h:lw,round:1}}
    else{P.floor={x:W-lw-2,y:tvd+2,w:lw,h:lw,round:1};notes.push('המנורה העומדת עוברת לפינה ליד הקיר ממול — אין מקום ליד הספה.')}}
  if(pouf){const pw=pouf.fw,ph=pouf.fd;if(!P.coffee)P.pouf={x:sx+sw/2-pw/2,y:frontY-ph,w:pw,h:ph,round:pw===ph};
    else{const aR=P.arm&&P.arm.x>W/2;const x=aR?P.coffee.x-pw-14:P.coffee.x+P.coffee.w+14;const y=P.coffee.y+P.coffee.h/2-ph/2;
      if(x>=4&&x+pw<=W-4&&!(P.arm&&overlap({x,y,w:pw,h:ph},P.arm)))P.pouf={x,y,w:pw,h:ph,round:pw===ph};else{P.pouf={x:P.coffee.x+P.coffee.w-pw*0.7,y:P.coffee.y+P.coffee.h-ph*0.35,w:pw,h:ph,round:pw===ph,under:1};notes.push('ההדום נכנס חלקית מתחת לשולחן כשלא בשימוש.')}}}
  if(rug){const rw=rug.fw,rh=rug.fd;let ry=sy+20-rh;if(ry<tvd+10)ry=tvd+10;let rx=Math.min(Math.max(10,sx+sw/2-rw/2),W-10-rw);P.rug={x:rx,y:ry,w:rw,h:rh,under:2}}
  const taken=()=>['sofa','side','arm','floor','pouf','coffee'].map(k=>P[k]).filter(Boolean);
  if(plant){const s=plant.fw;const o=freeSpot(room,[{x:2,y:tvd+2},{x:W-s-2,y:tvd+2},{x:2,y:D-s-2},{x:W-s-2,y:D-s-2}].map(o=>({x:o.x,y:o.y,w:s,h:s,round:1})),taken());if(o)P.plant=o;else notes.push('אין פינה פנויה לצמח על הרצפה — אפשר צמח קטן על מדף.')}
  if(mirror&&mirror.id===167){const o=freeSpot(room,[{x:2,y:tvd+2,w:52,h:12},{x:W-54,y:tvd+2,w:52,h:12}],taken());if(o)P.mirror=o}
  return{pos:P,notes,fixed};
}
function layoutBedroom(room,sel){
  const {W,D}=room;const P={},notes=[],fixed=[];const it=k=>itemOf(sel,k,room);
  const bed=it('bed'),bs=it('bedside'),wd=it('wardrobe'),dr=it('dresser'),rug=it('rug'),plant=it('plant'),mirror=it('mirror');
  if(!bed)return{pos:P,notes,fixed};
  const bw=bed.fw,bl=bed.fd;const bx=(W-bw)/2,by=D-bl;P.bed={x:bx,y:by,w:bw,h:bl};
  if(bs){const dbl=(sel.bedside&&sel.bedside.qty)>1||qtyFor('bedside',bs,sel,room)>1;const gap=bx;if(gap>=bs.fw+3){P.bedside={x:bx-bs.fw-2,y:D-bs.fd-2,w:bs.fw,h:bs.fd};if(dbl)P.bedside2={x:bx+bw+2,y:D-bs.fd-2,w:bs.fw,h:bs.fd}}}
  const taken=()=>['bed','bedside','bedside2','wardrobe','dresser'].map(k=>P[k]).filter(Boolean);
  const clearOf=(x)=>x&&[236,241].includes(x.id)?55:x&&x.keep?70:Math.min(90,Math.max(60,(x?x.fw:80)/ (x&&/3 דלתות/.test(x.v)?3:2)+20));
  const place=(x,key)=>{if(!x)return;const fw=x.fw,fd=x.fd,cl=clearOf(x);
    const c=[{x:W-fw-2,y:2,w:fw,h:fd,cl:{x:W-fw-2,y:2+fd,w:fw,h:cl}},{x:2,y:2,w:fw,h:fd,cl:{x:2,y:2+fd,w:fw,h:cl}},{x:(W-fw)/2,y:2,w:fw,h:fd,cl:{x:(W-fw)/2,y:2+fd,w:fw,h:cl}},
      {x:2,y:2,w:fd,h:fw,cl:{x:2+fd,y:2,w:cl,h:fw},rot:1},{x:W-fd-2,y:2,w:fd,h:fw,cl:{x:W-fd-2-cl,y:2,w:cl,h:fw},rot:1}];
    const d=doorBox(room);const o=c.find(b=>inRoom(b,room)&&inRoom(b.cl,room)&&!taken().some(t=>overlap(b,t)||overlap(b.cl,t))&&!(d&&(overlap(b,d)||overlap(b.cl,d)))&&!Object.values(P).some(p=>p.cl&&overlap(b,p.cl)));
    if(o)P[key]=o};
  place(wd,'wardrobe');place(dr,'dresser');
  if(rug){const rw=Math.max(rug.fw,rug.fd),rh=Math.min(rug.fw,rug.fd);const rx=Math.min(Math.max(10,bx+bw/2-rw/2),W-10-rw);const ry=Math.min(D-rh-10,by+bl*0.35);P.rug={x:rx,y:Math.max(10,ry),w:rw,h:rh,under:2}}
  if(plant){const s=plant.fw;const o=freeSpot(room,[{x:2,y:D-s-2},{x:W-s-2,y:D-s-2},{x:2,y:2},{x:W-s-2,y:2}].map(o=>({x:o.x,y:o.y,w:s,h:s,round:1})),taken().concat(Object.values(P).filter(p=>p.cl).map(p=>p.cl)));if(o)P.plant=o}
  if(mirror&&mirror.id===167){const o=freeSpot(room,[{x:2,y:D/2,w:12,h:52},{x:W-14,y:D/2,w:12,h:52}],taken());if(o)P.mirror=o}
  return{pos:P,notes,fixed};
}
function layoutKitchen(room,sel){
  const {W,D}=room;const P={},notes=[],fixed=[];const it=k=>itemOf(sel,k,room);
  const ku=it('kunit'),tb=it('dtable'),cart=it('cart'),plant=it('plant');
  const cd=60;if(ku){P.kunit={x:2,y:0,w:ku.fw,h:ku.fd}}else fixed.push({x:0,y:0,w:W,h:cd,label:room.mode==='renovate'?'משטח המטבח (כיור חדש)':'המטבח הקיים'});
  const top=ku?ku.fd:cd;
  if(tb){const round=tb.fw===tb.fd;const tw=tb.fw,th=tb.fd;const cx=W/2;
    let y=Math.max(top+90,Math.min(D-th-70,(top+D)/2-th/2));let wallSide=false;
    if(y+th+70>D){y=D-th-2;wallSide=true}
    const dB=doorBox(room);const xs=[cx-tw/2,65,W-tw-65,2,W-tw-2];
    const x=xs.find(x=>x>=0&&x+tw<=W&&!(dB&&overlap({x:x-45,y:y-45,w:tw+90,h:th+(wallSide?45:90)},dB)));
    if(x!==undefined&&y>=top+85&&y+th<=D){P.dtable={x,y,w:tw,h:th,round};if(wallSide)P.dtableWall='bottom'}}
  const taken=()=>[P.dtable?{x:P.dtable.x-45,y:P.dtable.y-45,w:P.dtable.w+90,h:P.dtable.h+(P.dtableWall?45:90)}:null].filter(Boolean);
  if(cart){const w=cart.fw,h=cart.fd;const o=freeSpot(room,[{x:W-w-2,y:top+20,w,h},{x:2,y:top+20,w,h},{x:2,y:D-h-2,w,h},{x:W-w-2,y:D-h-2,w,h},{x:W-h-2,y:top+20,w:h,h:w},{x:2,y:top+20,w:h,h:w}],taken());if(o)P.cart=o}
  if(plant){const s=plant.fw;const o=freeSpot(room,[{x:2,y:D-s-2},{x:W-s-2,y:D-s-2}].map(o=>({x:o.x,y:o.y,w:s,h:s,round:1})),taken().concat([P.cart].filter(Boolean)));if(o)P.plant=o}
  return{pos:P,notes,fixed,top};
}
function layoutBath(room,sel){
  const {W,D}=room;const P={},notes=[],fixed=[];const it=k=>itemOf(sel,k,room);
  const v=it('vanity');const sinkW=v?v.fw:60,sinkD=v?v.fd:45;const flip=room.door==='bl';
  const sx=flip?Math.max(4,W-44-22-sinkW-4):Math.max(4,Math.min(W*0.3-sinkW/2,W-sinkW-80));
  if(v)P.vanity={x:sx,y:D-sinkD,w:sinkW,h:sinkD};else fixed.push({x:sx,y:D-sinkD,w:sinkW,h:sinkD,label:'הכיור הקיים'});
  const toilet={x:flip?W-44:Math.min(W-44,sx+sinkW+22),y:D-68,w:40,h:66,label:'אסלה'};fixed.push(toilet);
  let shower;const dl=room.door==='tl',dr=room.door==='tr';if(room.shower==='bath'){const bw=Math.min(170,W-4-(dl||dr?85:0));shower={x:dr?0:W-bw,y:0,w:bw,h:70,label:'אמבטיה'}}else{shower={x:dr?0:W-90,y:0,w:90,h:90,label:room.shower==='glass'?'מקלחון זכוכית':'מקלחון'}}fixed.push(shower);
  const block=fixed.concat([P.vanity].filter(Boolean));
  const clear=[{x:sx,y:D-sinkD-60,w:sinkW,h:60},{x:toilet.x-10,y:toilet.y-55,w:60,h:55},{x:shower.x,y:shower.h,w:shower.w,h:55}];
  const taken=()=>block.concat(clear,Object.values(P));
  const put=(key,x,cands)=>{if(!x)return;const o=freeSpot(room,cands(x.fw,x.fd),taken());if(o)P[key]=o};
  const spots=(w,h)=>[{x:sx-w-2,y:D-h-2,w,h},{x:2,y:D-h-2,w,h},{x:2,y:2,w,h},{x:shower.x-w-2,y:2,w,h},{x:2,y:D/2-w/2,w:h,h:w},{x:W-h-2,y:shower.h+60,w:h,h:w}];
  put('tallcab',it('tallcab'),spots);put('bshelf',it('bshelf'),spots);put('btrolley',it('btrolley'),spots);put('bstool',it('bstool'),spots);
  const pl=it('plant');if(pl){const s=Math.min(40,pl.fw);put('plant',{fw:s,fd:s},spots)}
  return{pos:P,notes,fixed,sink:{x:sx,w:sinkW,d:sinkD},toilet,shower};
}

// ================= checks =================
function checks(c,room){const L=layout(room,c.sel);const out=({living:checksLiving,bedroom:checksBedroom,kitchen:checksKitchen,bath:checksBath})[room.type](c,room,L);
  const d=doorBox(room);if(d){const hit=Object.entries(L.pos).filter(([k,b])=>b&&typeof b==='object'&&!b.under&&k!=='rug'&&overlap(b,d)).map(([k])=>(SLOTDEF(room.type)[k.replace(/2$/,'')]||{he:k}).he).concat((L.fixed||[]).filter(f=>!f.dark&&overlap(f,d)).map(f=>f.label));out.push(hit.length?['bad','פתיחת הדלת נחסמת ע״י '+hit.join(', ')+'.']:['ok','אזור פתיחת הדלת פנוי.'])}
  const ks=Object.keys(L.pos).filter(k=>L.pos[k]&&typeof L.pos[k]==='object'&&!L.pos[k].under&&k!=='rug');const ov=[];for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++)if(overlap(L.pos[ks[i]],L.pos[ks[j]]))ov.push(ks[i]+'/'+ks[j]);
  for(const f of L.fixed||[])for(const k of ks)if(overlap(L.pos[k],f))ov.push(k+'/'+f.label);
  if(ov.length)out.push(['bad','חפיפה בתוכנית: '+ov.map(s=>s.split('/').map(k=>(SLOTDEF(room.type)[k.replace(/2$/,'')]||{he:k}).he).join(' ו')).join(', ')+'.']);
  for(const n of L.notes)out.push(['warn',n]);return{L,out}}
function checksLiving(c,room,L){const P=L.pos,out=[];const {W,D,tvd}=room;const it=k=>itemOf(c.sel,k,room);const sofa=it('sofa');
  if(!sofa){out.push(['bad','אין ספה בעיצוב.']);return out}
  out.push(sofa.fw<=W-10?['ok','הספה ('+sofa.fw+' ס״מ) נכנסת לקיר של '+W+' ס״מ ומשאירה '+Math.round(W-sofa.fw)+' ס״מ בצדדים.']:['bad','הספה רחבה מהקיר.']);
  const front=P.coffee||(P.pouf&&!it('coffee')&&P.pouf);const pass=Math.round((front?front.y:P.sofa.y-SEAT_GAP)-tvd);
  out.push(pass>=GOOD_PASS?['ok','מעבר של '+pass+' ס״מ מול הספה — נוח.']:pass>=MIN_PASS?['warn','מעבר של '+pass+' ס״מ מול הספה — עובר, אבל צר (מומלץ 90).']:['bad','נשארים רק '+pass+' ס״מ מעבר — צפוף מדי.']);
  if(!it('coffee'))out.push(['warn','בעומק '+D+' ס״מ אין מקום לשולחן קפה עם מעבר — '+(P.pouf?'ההדום משמש כשולחן (עם מגש).':'כדאי שולחן צד ליד הספה.')]);
  else{const r=it('coffee').fw/sofa.fw;out.push(r>=0.5&&r<=0.75?['ok','שולחן הקפה ביחס '+Math.round(r*100)+'% לספה — הפרופורציה הקלאסית.']:['warn','שולחן הקפה ביחס '+Math.round(r*100)+'% לספה (מומלץ 50–75%).'])}
  if(room.tv!=='none'){const dist=Math.round(P.sofa.y+sofa.fd*0.45-tvd);out.push(['ok','מרחק צפייה כ-'+dist+' ס״מ — מתאים למסך עד '+Math.round(dist/1.2/2.54/5)*5+' אינץ׳.'])}
  if(c.sel.arm&&!c.sel.arm.keep)out.push(P.arm?['ok','הכורסה ממוקמת '+(P.arm.face==='u'?'ליד הספה':'בצד, פונה לשולחן')+' בלי לחסום מעבר.']:['bad','אין מקום לכורסה בלי לחסום מעבר.']);
  const rug=it('rug');if(rug&&P.rug){const mb=Math.round(Math.min(P.rug.x,W-P.rug.x-P.rug.w,P.rug.y-tvd));const cov=rug.fw>=sofa.fw*0.85;out.push(cov&&mb>=15?['ok','השטיח רחב כמו הספה ונכנס מתחת לרגליים הקדמיות, עם '+mb+' ס״מ רצפה בשוליים.']:!cov?['warn','השטיח צר מהספה — מומלץ לפחות ברוחבה.']:['warn','השטיח קרוב לקירות ('+mb+' ס״מ) — מומלץ 20.'])}
  lightCheck(c,out,['pendant','floor','table','candle']);
  const pd=it('pendant');if(pd&&!pd.keep){const tg=Math.round((W+D)/12);out.push(Math.abs(pd.fw-tg)<=tg*0.35?['ok','גוף התאורה בקוטר '+pd.fw+' ס״מ — מתאים לחדר.']:['warn','גוף התאורה בקוטר '+pd.fw+' ס״מ — לחדר הזה מתאים סביב '+tg+'.'])}
  artCheck(c,out,sofa.fw,'מהספה');
  if(room.renter&&c.sel.pendant&&!c.sel.pendant.keep)out.push(['ok','מנורת התקרה מתחברת לנקודה הקיימת. לשמור את האהיל הישן לסוף השכירות.']);
  return out}
function lightCheck(c,out,keys,min=3){const n=keys.filter(k=>c.sel[k]).length;out.push(n>=min?['ok','תאורה בשכבות ('+n+' מקורות). כל הנורות 2700K.']:['warn','רק '+n+' מקורות אור — מומלץ 3 שכבות.'])}
function artCheck(c,out,w,what){const e=c.sel.art;if(!e||e.keep||!BY[e.id])return;const a=BY[e.id],q=e.qty||1,aw=a.fw*q+(q-1)*8,r=aw/w;out.push(r>=0.45&&r<=0.8?['ok',(q>1?q+' תמונות':'התמונה')+' ברוחב '+aw+' ס״מ ≈ '+Math.round(r*100)+'% '+what+'.']:['warn',(q>1?q+' תמונות':'התמונה')+' ברוחב '+aw+' ס״מ = '+Math.round(r*100)+'% '+what+' (מומלץ ⅔).'])}
function checksBedroom(c,room,L){const P=L.pos,out=[];const {W,D}=room;const it=k=>itemOf(c.sel,k,room);const bed=it('bed');
  if(!bed){out.push(['bad','אין מיטה בעיצוב.']);return out}
  const side=Math.round((W-bed.fw)/2);const foot=Math.round(P.bed.y-(Math.max(0,...['wardrobe','dresser'].filter(k=>P[k]&&P[k].y<P.bed.y&&P[k].x<P.bed.x+P.bed.w-10&&P[k].x+P[k].w>P.bed.x+10).map(k=>P[k].y+P[k].h))));
  const dbl=bed.keep?room.sleepers==='couple':nomW(bed)>=140;
  out.push(side>=60?['ok','מעבר של '+side+' ס״מ בכל צד של המיטה — נוח ('+(dbl?'חשוב לזוג':'מספיק')+').']:side>=45?['warn','מעבר של '+side+' ס״מ בצדי המיטה — עובר, אבל צר (מומלץ 60).']:['bad','רק '+side+' ס״מ בצדי המיטה — '+(dbl?'לזוג זה צפוף מדי; שקלו להצמיד צד אחד לקיר':'שקלו להצמיד את המיטה לקיר')+'.']);
  out.push(foot>=75?['ok','מעבר של '+foot+' ס״מ לרגלי המיטה.']:foot>=60?['warn','מעבר של '+foot+' ס״מ לרגלי המיטה — צר (מומלץ 75).']:['bad','רק '+foot+' ס״מ לרגלי המיטה.']);
  const m=it('mattress');if(m&&!m.keep&&!bed.keep)out.push(m.fw===nomW(bed)?['ok','המזרן '+m.fw+'x200 מתאים למיטה.']:['bad','המזרן לא בגודל המיטה.']);
  if(!bed.keep&&[200,201,208].includes(bed.id))out.push(['warn','במסגרת הזו צריך גם בסיס מפסי עץ (LURÖY) — לא כלול במחיר.']);
  if(c.sel.wardrobe&&!c.sel.wardrobe.keep)out.push(P.wardrobe?['ok','הארון עומד '+(P.wardrobe.rot?'לאורך קיר הצד':'מול המיטה')+' עם מקום לפתוח דלתות.']:['bad','אין קיר פנוי לארון עם מקום לפתיחה.']);
  if(c.sel.dresser&&!c.sel.dresser.keep&&!P.dresser)out.push(['bad','אין מקום לשידה.']);
  if(c.sel.bedside&&!c.sel.bedside.keep)out.push(P.bedside?['ok','שידות הלילה נכנסות ליד המיטה.']:['bad','אין מקום לשידות לילה — שקלו מדף צף.']);
  const rug=it('rug');if(rug&&P.rug&&!rug.keep){const ext=Math.round((P.rug.w-bed.fw)/2);out.push(ext>=30?['ok','השטיח בולט '+ext+' ס״מ מכל צד — רך לרגליים בבוקר.']:['warn','השטיח בולט רק '+Math.max(0,ext)+' ס״מ מצדי המיטה (מומלץ 40–60).'])}
  if(c.sel.curtain&&BY[c.sel.curtain.id]&&/האפלה|מחשיך/.test(BY[c.sel.curtain.id].v))out.push(['ok','וילון האפלה — '+(room.dir==='e'?'חשוב בחלון מזרחי (שמש בבוקר).':'חושך מלא לשינה.')]);
  lightCheck(c,out,['pendant','table'],2);artCheck(c,out,bed.fw,'מהמיטה');return out}
function checksKitchen(c,room,L){const P=L.pos,out=[];const {W,D}=room;const it=k=>itemOf(c.sel,k,room);const tb=it('dtable');const top=L.top||60;
  if(tb&&!tb.keep){if(!P.dtable)out.push(['bad','אין מקום לשולחן עם מעבר.']);else{const gap=Math.round(P.dtable.y-top);out.push(gap>=100?['ok','מעבר של '+gap+' ס״מ בין המטבח לשולחן — אפשר לעבוד ולשבת בו-זמנית.']:gap>=85?['warn','מעבר של '+gap+' ס״מ בין המטבח לשולחן — עובר (מומלץ 100+).']:['bad','רק '+gap+' ס״מ בין המטבח לשולחן.']);
    const back=Math.round(D-P.dtable.y-P.dtable.h);if(!P.dtableWall)out.push(back>=75?['ok','מקום של '+back+' ס״מ להזיז כיסאות מאחור.']:['warn','רק '+back+' ס״מ להזזת כיסאות מאחור (מומלץ 75).']);else out.push(['warn','השולחן צמוד לקיר בצד אחד — הכיסאות בשלושה צדדים.']);if(P.dtable.x<45||P.dtable.x+P.dtable.w>W-45)out.push(['warn','השולחן צמוד לקיר הצד (כדי לא לחסום את הדלת) — בצד הזה אין כיסא.']);
    const cap=tableSeats(tb);out.push(cap>=room.seats?['ok','השולחן מושיב '+cap+' (ביקשתם '+room.seats+').']:['warn','השולחן מושיב '+cap+' בלבד (ביקשתם '+room.seats+').'])}}
  const pd=it('pendant');if(pd&&tb&&!pd.keep){out.push(['ok','תלו את המנורה 70–80 ס״מ מעל השולחן, במרכזו.']);if(pd.fw>Math.min(tb.fw,tb.fd)-20)out.push(['warn','המנורה רחבה יחסית לשולחן.'])}
  if(c.sel.klight)out.push(['ok','תאורה מתחת לארונות — אור עבודה בלי צל על המשטח.']);
  if(room.mode==='renovate'){if(c.sel.kunit&&c.sel.kunit.id!=null)out.push(['warn','מטבחון שלם מחליף את המטבח הקיים — ודאו חיבורי מים וחשמל ובדקו בדף המוצר מה כלול.']);else out.push(['warn','כיור וברז דורשים אינסטלטור, וכיור שקוע דורש חיתוך משטח — בדקו את מידת החור במשטח הקיים.']);
    out.push(['ok','לתכנון ארונות מטבח מלאים (METOD) — כלי התכנון החינמי של איקאה.'])}
  lightCheck(c,out,['pendant','klight'],2);return out}
function checksBath(c,room,L){const P=L.pos,out=[];const {W,D}=room;const it=k=>itemOf(c.sel,k,room);
  const sinkD=L.sink.d;const front=Math.round(D-sinkD-(room.shower==='bath'||L.shower.x<L.sink.x+L.sink.w?0:0)-0);const fr=Math.round(D-sinkD-(L.shower.x<L.sink.x+L.sink.w?L.shower.h:0));
  out.push(fr>=70?['ok','מקום של '+fr+' ס״מ מול הכיור.']:fr>=60?['warn','מקום של '+fr+' ס״מ מול הכיור — צר (מומלץ 70).']:['bad','רק '+fr+' ס״מ מול הכיור.']);
  const v=it('vanity');if(v&&!v.keep)out.push(['ok','ארון הכיור '+v.fw+' ס״מ, עם מקום לאסלה לצדו.']);
  const mc=it('mcab');if(mc&&v&&!mc.keep)out.push(mc.fw<=v.fw?['ok','ארון המראה ('+mc.fw+') לא רחב מהכיור ('+v.fw+') — נראה מאוזן.']:['warn','ארון המראה רחב מהכיור.']);
  const bm=it('bmirror');if(bm&&!bm.keep&&bm.fw>80)out.push(['warn','המראה רחבה — ודאו שהיא לא רחבה מהכיור הקיים.']);
  if(c.sel.blight&&!c.sel.blight.keep)out.push(['ok','תאורה מאיקאה לחדר רחצה מוגנת מרטיבות — בכל זאת, התקנה ע״י חשמלאי.']);
  if(room.renter){const nd=[434,426,427].filter(id=>Object.values(c.sel).some(e=>e&&e.id===id));out.push(['ok','בשכירות: '+(nd.length?'יש פריטים בלי קידוח (מוט טלסקופי / מתלה בהדבקה). ':'')+'לארוני קיר ומראות צריך 2–4 חורים — לתאם עם בעל הדירה.'])}
  if(room.shower!=='glass'&&c.sel.rod)out.push(['ok','מוט טלסקופי 120–200 ס״מ — בלי קידוח.']);
  if(room.mode==='renovate')out.push(['warn','החלפת ארון כיור וברז דורשת אינסטלטור. בדקו את מיקום נקודות המים והניקוז.']);
  return out}

// ================= plan SVG =================
const LBL={sofa:'ספה',coffee:'שולחן',arm:'כורסה',pouf:'הדום',rug:'שטיח',bed:'מיטה',wardrobe:'ארון',dresser:'שידה',dtable:'שולחן',cart:'עגלה',kunit:'מטבחון',vanity:'כיור',tallcab:'ארון',bshelf:'מדפים',btrolley:'עגלה',bstool:'שרפרף'};
function planSVG(c,room){
  const {L}=checks(c,room);const P=L.pos;const {W,D}=room;const m=26;const wall='var(--plan-wall)';const fnt='font-family="IBM Plex Sans Hebrew,Arial"';
  const itemFor=k=>{const base=k.replace(/2$/,'');return itemOf(c.sel,base,room)};
  let s=`<svg viewBox="${-m} ${-m} ${W+2*m} ${D+2*m}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="תוכנית קומה בקנה מידה"><defs><pattern id="g" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="currentColor" stroke-opacity=".07" stroke-width=".6"/></pattern><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke="currentColor" stroke-opacity=".25" stroke-width="2"/></pattern></defs><rect x="0" y="0" width="${W}" height="${D}" fill="url(#g)" style="color:var(--ink)"/>`;
  for(const f of L.fixed||[])s+=`<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${Math.max(f.h,5)}" ${f.dark?'fill="var(--ink)" fill-opacity=".85"':'fill="url(#hatch)" stroke="var(--ink)" stroke-opacity=".35"'} style="color:var(--ink)"/>`+(f.h>=14&&f.w>=30?`<text x="${f.x+f.w/2}" y="${f.y+f.h/2+3}" font-size="9" text-anchor="middle" fill="var(--muted)" ${fnt}>${esc(f.label)}</text>`:`<text x="${f.x+f.w/2}" y="${f.y+Math.max(f.h,5)+11}" font-size="9" text-anchor="middle" fill="var(--muted)" ${fnt}>${esc(f.label)}</text>`);
  const order=Object.keys(P).sort((a,b)=>(P[b].under||0)-(P[a].under||0));
  for(const k of order){const b=P[k];const x=itemFor(k);if(!b||!x||typeof b!=='object'||b.x===undefined)continue;const f=x.hex,tc=textOn(f);const isRug=k==='rug';
    s+=b.round?`<ellipse cx="${b.x+b.w/2}" cy="${b.y+b.h/2}" rx="${b.w/2}" ry="${b.h/2}" fill="${f}" stroke="${wall}" stroke-opacity=".55"/>`:`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${isRug?2:5}" fill="${f}" ${isRug?'fill-opacity=".5"':''} stroke="${wall}" stroke-opacity="${isRug?.25:.55}" ${b.under===1?'stroke-dasharray="3 3" fill-opacity=".6"':''}/>`;
    if(b.cl)s+=`<rect x="${b.cl.x}" y="${b.cl.y}" width="${b.cl.w}" height="${b.cl.h}" fill="none" stroke="${wall}" stroke-opacity=".25" stroke-dasharray="2 3"/>`;
    const lb=LBL[k.replace(/2$/,'')];const fs=Math.max(7,Math.min(11,b.w/7));
    if(lb&&b.w>26&&b.h>14)s+=`<text x="${b.x+b.w/2}" y="${isRug?b.y+12:b.y+b.h/2+fs/3}" font-size="${fs}" text-anchor="middle" fill="${isRug?'var(--ink)':tc}" ${isRug?'fill-opacity=".6"':''} ${fnt}>${esc(lb)}${k==='sofa'||k==='bed'?' '+x.fw:''}</text>`}
  const pd=itemOf(c.sel,'pendant',room);if(pd){const anchor=P.coffee||P.dtable||P.bed||P.sofa;if(anchor){const cy=anchor===P.bed?P.bed.y+P.bed.h*0.4:anchor===P.sofa?P.sofa.y-50:anchor.y+anchor.h/2;s+=`<circle cx="${anchor.x+anchor.w/2}" cy="${cy}" r="${(pd.fw||40)/2}" fill="none" stroke="${wall}" stroke-opacity=".5" stroke-dasharray="4 3"/>`}}
  s+=`<rect x="0" y="0" width="${W}" height="${D}" fill="none" stroke="${wall}" stroke-width="4"/>`;
  if(room.winWall!=='none'){const side=room.winWall==='left'||room.winWall==='right';const ww=Math.min(room.winW,side?D-20:W-20);let wx,wy,wW,wH;
    if(room.winWall==='sofa'){wx=W/2-ww/2;wy=D-2;wW=ww;wH=4}else if(room.winWall==='tv'){wx=W/2-ww/2;wy=-2;wW=ww;wH=4}else if(room.winWall==='left'){wx=-2;wy=D/2-ww/2;wW=4;wH=ww}else{wx=W-2;wy=D/2-ww/2;wW=4;wH=ww}
    const tx=room.winWall==='left'?-9:room.winWall==='right'?W+9:W/2,ty=room.winWall==='sofa'?D+16:room.winWall==='tv'?-9:D/2;
    s+=`<rect x="${wx}" y="${wy}" width="${wW}" height="${wH}" fill="#8fb7d6"/><text x="${tx}" y="${ty}" font-size="9" text-anchor="middle" fill="var(--muted)" ${fnt} ${side?`transform="rotate(-90 ${tx} ${ty})"`:''}>חלון ${room.winW}</text>`}
  const d=doorBox(room);if(d){const left=room.door[1]==='l';const hx=left?0:W;const y0=d.y,y1=d.y+80;
    s+=`<line x1="${hx}" y1="${y0}" x2="${hx}" y2="${y1}" stroke="var(--plan-floor)" stroke-width="6"/><path d="M${hx} ${y0} L${left?80:W-80} ${y0} A80 80 0 0 ${left?1:0} ${hx} ${y1}" fill="var(--ink)" fill-opacity=".05" stroke="var(--ink)" stroke-opacity=".35" stroke-dasharray="3 3"/><text x="${left?10:W-10}" y="${y0+44}" font-size="9" text-anchor="${left?'start':'end'}" fill="var(--muted)" ${fnt}>דלת</text>`}
  if(room.winWall!=='tv')s+=`<text x="${W/2}" y="-10" font-size="10" text-anchor="middle" fill="var(--muted)" ${fnt}>${W} ס״מ</text>`;
  if(room.winWall!=='left')s+=`<text x="-12" y="${D/2}" font-size="10" text-anchor="middle" fill="var(--muted)" transform="rotate(-90 -12 ${D/2})" ${fnt}>${D} ס״מ</text>`;
  return s+'</svg>';
}

// ================= app state / render =================
let ROOM=null,CONCEPTS=[],ACTIVE=0,sample=null,downloads=null,sampleImages=false;
function generateLocal(){ROOM=roomOf();CONCEPTS=chooseStyles(ROOM).map(k=>localConcept(k,ROOM));ACTIVE=0;renderAll()}
function renderAll(){renderTabs();renderConcept()}
function renderTabs(){const el=$('#tabs');el.innerHTML='';CONCEPTS.forEach((c,i)=>{const st=STYLES[c.style];const b=document.createElement('button');b.className='tab';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(i===ACTIVE));
  b.innerHTML=`<span class="tn">${esc(c.title||st.name)}</span><span class="td">${esc(st.designer)} · ${ils(totalOf(c.sel))}</span><span class="sw">${st.pal.map(p=>`<i style="background:${p[0]}"></i>`).join('')}</span>`;b.onclick=()=>{ACTIVE=i;renderAll()};el.appendChild(b)})}
function renderConcept(){
  const c=CONCEPTS[ACTIVE];if(!c)return;const st=STYLES[c.style];const room=ROOM;const R=ROOMS[room.type];const tot=totalOf(c.sel);const over=tot>room.budget;const {out}=checks(c,room);
  $('#rhTitle').textContent='שלושה כיוונים ל'+R.he+' שלך';
  let h=`<h2 style="margin:0">${esc(c.title||st.name)}</h2><p class="designer">בהשראת ${esc(st.designer)} (${esc(st.city)})${c.src==='ai'?' · עוצב אישית ע״י Claude':''}</p><p class="why">${esc(c.why||st.idea)}</p>`;
  h+=`<div class="pal">${st.pal.map(p=>`<div style="background:${p[0]};color:${textOn(p[0])};flex:${p[2].startsWith('60')?3:p[2].startsWith('30')?2:1}"><b>${esc(p[1])}</b>${esc(p[2])}</div>`).join('')}</div><p class="hint">${esc(DIR_NOTE[room.dir]||DIR_NOTE.u)}</p>`;
  h+=`<div class="total"><span class="muted small">סה״כ לקנייה${c.dropped&&c.dropped.length?' · ויתרנו על: '+c.dropped.map(k=>SLOTDEF(room.type)[k].he).join(', '):''}</span><b>${ils(tot)}</b></div><div class="bar${over?' over':''}"><i style="width:${Math.min(100,tot/room.budget*100)}%"></i></div><p class="hint">${over?'חורג מהתקציב ב-'+ils(tot-room.budget):'נשארים '+ils(room.budget-tot)+' מתוך '+ils(room.budget)}</p>`;
  if(over)h+=`<button class="btn sm ghost" id="fitB" style="margin-top:8px">התאם לתקציב</button>`;
  h+=`<div class="planbox">${planSVG(c,room)}</div><p class="hint">תוכנית מלמעלה בקנה מידה (משבצת = 10 ס״מ). ${esc(R.mainWall==='הספה'?'קיר הספה':R.mainWall==='ראש המיטה'?'קיר ראש המיטה':R.mainWall==='הכיור'?'קיר הכיור':'פינת האוכל')} למטה.</p>`;
  h+=`<ul class="checks">${out.map(([k,t])=>`<li class="${k}"><span class="ic">${k==='ok'?'✓':k==='warn'?'!':'✕'}</span><span>${esc(t)}</span></li>`).join('')}</ul>`;
  const act=activeSlots(room,c.sel);
  for(const g of ['r','f','l','t','d']){const rows=act.filter(s=>s.g===g);if(!rows.length)continue;h+=`<div class="group"><h3>${GROUPS[g]}</h3>`;
    for(const s of rows){const e=c.sel[s.k];
      if(e&&e.keep){h+=`<div class="item"><div class="ph" style="width:76px;height:76px;border-radius:14px;border:1px dashed var(--line);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--muted)">מהבית</div><div><div class="sl">${s.he}</div><div class="vr">נשאר מהבית — העיצוב נבנה סביבו</div></div><div></div></div>`;continue}
      if(!e||!BY[e.id]){h+=`<div class="item empty"><div style="width:76px;height:76px;border-radius:14px;border:1px dashed var(--line)"></div><div><div class="sl">${s.he}</div><div class="vr">בלי</div><div class="acts"><button data-swap="${s.k}">הוספה</button></div></div><div></div></div>`;continue}
      const x=BY[e.id];const q=e.qty||1;const fit=fitCheck(x,s.k,c.sel,room);
      h+=`<div class="item"><img src="${img(x.id)}" alt="" loading="lazy"><div><div class="sl">${s.he}${q>1?' ×'+q:''}${x.est&&x.fw?'<span class="tag warn">מידה משוערת</span>':''}${!fit.ok?'<span class="tag warn">'+esc(fit.why)+'</span>':''}${e.lock?'<span class="tag ok">בחירה שלך</span>':''}</div><div class="nm">${esc(x.n)}</div><div class="vr">${esc(x.v)}</div><div class="acts"><button data-swap="${s.k}">החלפה</button><a href="${ikeaUrl(x)}" target="_blank" rel="noopener">באיקאה ↗</a></div></div><div class="pr">${ils(x.p*q)}</div></div>`}
    h+=`</div>`}
  if(room.type==='living'||room.type==='bedroom')h+=`<p class="hint">כיסויי כריות נמכרים בלי מילוי — צריך כרית פנימית בנפרד.</p>`;
  if(room.type==='kitchen'&&room.mode==='renovate')h+=`<p class="hint"><a href="https://www.ikea.com/il/he/planners/kitchen-planner/" target="_blank" rel="noopener">לתכנון ארונות מטבח מלא — כלי התכנון של איקאה ↗</a></p>`;
  h+=`<h3 style="margin-top:18px">טיפים של המעצב</h3><ul class="tips">${(c.tips&&c.tips.length?c.tips:st.tips).map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;
  h+=`<div class="actions"><button class="btn ghost" id="listB">רשימת קניות</button><button class="btn ghost" id="gemB">הדמיה ב-Gemini</button></div><div class="ai" id="aiBox"></div>`;
  $('#concept').innerHTML=h;
  $('#concept').querySelectorAll('[data-swap]').forEach(b=>b.onclick=()=>openSwap(b.dataset.swap));
  const fb=$('#fitB');if(fb)fb.onclick=()=>{fitBudget(c,room);renderAll();toast('הותאם לתקציב')};
  $('#listB').onclick=()=>showText('רשימת קניות',listText(c),'העתקה');$('#gemB').onclick=()=>geminiSheet(c);refreshAi();
}

// ================= swap =================
function openSwap(slot){
  const c=CONCEPTS[ACTIVE],room=ROOM,e=c.sel[slot],cur=e&&!e.keep&&BY[e.id]?BY[e.id]:null;const rest=Object.assign({},c.sel);delete rest[slot];
  const cands=candidates(slot,c.style,room,rest);const sd=SLOTDEF(room.type)[slot];
  let h=`<div class="hd"><div><h3>${esc(sd.he)}</h3><p class="muted small">ממוין לפי התאמה ל${esc(STYLES[c.style].name)} ולחדר</p></div><button class="btn sm ghost" id="closeS">סגירה</button></div>`;
  h+=`<button class="alt" data-id="none"><div style="width:60px;height:60px;border-radius:12px;border:1px dashed var(--line)"></div><div><b>בלי ${esc(sd.he)}</b><div class="muted small">להוריד מהעיצוב</div></div><div class="d dn">${cur?'−'+ils(cur.p*(e.qty||1)):''}</div></button>`;
  for(const cd of cands){const x=cd.x;const q=qtyFor(slot,x,rest,room);const diff=x.p*q-(cur?cur.p*(e.qty||1):0);const isCur=cur&&cur.id===x.id;
    h+=`<button class="alt" data-id="${x.id}" ${isCur?'aria-current="true"':''} ${cd.ok?'':'disabled'}><img src="${img(x.id)}" alt="" loading="lazy"><div><b style="direction:ltr;unicode-bidi:plaintext">${esc(x.n)}</b>${x.tags.includes(c.style)?'<span class="tag ok">בסגנון</span>':''}${cd.why?'<span class="tag warn">'+esc(cd.why)+'</span>':''}<div class="muted small">${esc(x.v)}${q>1?' · ×'+q:''}</div></div><div class="d ${diff<0?'dn':diff>0?'up':''}">${isCur?'נוכחי':(diff>0?'+':diff<0?'−':'')+(diff?ils(Math.abs(diff)):'אותו מחיר')}</div></button>`}
  openSheet(h);
  $('#sheet').querySelectorAll('.alt').forEach(b=>b.onclick=()=>{const id=b.dataset.id;if(id==='none')c.sel[slot]=null;else{const x=BY[+id];c.sel[slot]={id:x.id,qty:qtyFor(slot,x,c.sel,room),lock:true}}revalidate(c,room,slot);closeSheet();renderAll()});
}
function revalidate(c,room,changed){
  for(const s of ROOMS[room.type].slots){if(s.k===changed)continue;
    if(s.on&&!s.on(room,c.sel)){c.sel[s.k]=null;continue}
    const e=c.sel[s.k];if(!e||e.keep)continue;const x=BY[e.id];
    if(!fitCheck(x,s.k,c.sel,room).ok){const cd=pick(s.k,c.style,room,Object.assign({},c.sel,{[s.k]:null}));c.sel[s.k]=cd?{id:cd.x.id,qty:qtyFor(s.k,cd.x,c.sel,room)}:null;toast(s.he+' הוחלף/ה כדי שיתאים')}
    else c.sel[s.k].qty=qtyFor(s.k,x,c.sel,room)}
  if(changed==='kunit')for(const k of ['ksink','ktap']){const d=SLOTDEF(room.type)[k];if(d.on(room,c.sel)&&!c.sel[k]){const cd=pick(k,c.style,room,c.sel);c.sel[k]=cd?{id:cd.x.id,qty:1}:null}}
}
function openSheet(h){$('#sheet').innerHTML=h;$('#sheet').classList.add('on');$('#scrim').classList.add('on');const cb=$('#closeS');if(cb)cb.onclick=closeSheet}
function closeSheet(){$('#sheet').classList.remove('on');$('#scrim').classList.remove('on')}

// ================= list / Gemini =================
function listText(c){const st=STYLES[c.style];let t=`${ROOMS[ROOM.type].he} · ${c.title||st.name} — בהשראת ${st.designer}\n`;for(const s of activeSlots(ROOM,c.sel)){const e=c.sel[s.k];if(!e||e.keep||!BY[e.id])continue;const x=BY[e.id];t+=`• ${s.he}: ${x.n} — ${x.v}${(e.qty||1)>1?' ×'+e.qty:''} — ${ils(x.p*(e.qty||1))}\n  ${ikeaUrl(x)}\n`}return t+`סה״כ: ${ils(totalOf(c.sel))}`}
function geminiPrompt(c){const st=STYLES[c.style],room=ROOM,R=ROOMS[room.type];const keep=[...room.keep];const lines=[];let i=1;
  for(const s of activeSlots(room,c.sel)){const e=c.sel[s.k];if(!e||e.keep||!BY[e.id])continue;lines.push(`${i++}. ${BY[e.id].n} (${s.cat}${(e.qty||1)>1?' x'+e.qty:''})`)}
  const place={living:`Place the sofa against the ${room.W} cm wall; keep a clear 60–90 cm walkway in front of it; rug under the sofa's front legs.`,bedroom:`Bed headboard centred on the ${room.W} cm wall, bedside tables on both sides, at least 60 cm to walk around the bed.`,kitchen:`Keep the existing kitchen cabinets${room.mode==='renovate'?' but replace the sink and tap with the ones listed':''}; place the dining table with at least 90 cm from the counter.`,bath:`Keep the existing toilet, shower/bath and tiles${room.mode==='renovate'?'; replace the vanity and mirror with the ones listed':''}.`}[room.type];
  return `Edit the attached ${R.en} photo. Keep the exact camera angle, perspective, walls, window, floor, ceiling and daylight. ${keep.length?'Keep the existing '+keep.join(', ')+'.':'Remove the existing loose furniture and decor.'}
Furnish it in a ${st.en} style (in the spirit of ${st.designer}) using ONLY the IKEA products in the second image (numbered product sheet). Match each product's exact shape, colour and material — do not invent other furniture.
Room: ${room.W} x ${room.D} cm. ${place}
Products:
${lines.join('\n')}
Colour palette: ${st.pal.map(p=>p[0]).join(', ')} (60/30/10). Warm 2700K light. Photorealistic interior photograph, no text, no people.`}
async function geminiSheet(c){
  const st=STYLES[c.style];const items=[];for(const s of activeSlots(ROOM,c.sel)){const e=c.sel[s.k];if(!e||e.keep||!BY[e.id])continue;items.push({x:BY[e.id],q:e.qty||1})}
  const cols=4,cw=300,ch=360,pad=24,head=150,rows=Math.ceil(items.length/cols);const cv=document.createElement('canvas');cv.width=cols*cw+pad*2;cv.height=head+rows*ch+pad;const g=cv.getContext('2d');
  let blob=null;if(g){g.fillStyle='#fff';g.fillRect(0,0,cv.width,cv.height);g.fillStyle='#1d1c1a';g.font='600 40px Georgia, serif';g.textAlign='left';g.fillText('IKEA product sheet — '+st.en,pad,62);g.font='24px Arial';g.fillStyle='#6b675f';g.fillText(ROOMS[ROOM.type].en+' · use ONLY these products · '+ROOM.W+' x '+ROOM.D+' cm',pad,100);
    st.pal.forEach((p,i)=>{g.fillStyle=p[0];g.fillRect(cv.width-pad-(5-i)*54,40,48,48)});
    await Promise.all(items.map((it,i)=>new Promise(res=>{const im=new Image();im.onload=()=>{const x=pad+(i%cols)*cw,y=head+Math.floor(i/cols)*ch;g.drawImage(im,x+10,y,cw-20,cw-20);g.fillStyle='#1d1c1a';g.font='600 22px Arial';g.fillText((i+1)+'. '+it.x.n+(it.q>1?' x'+it.q:''),x+10,y+cw+8);g.font='18px Arial';g.fillStyle='#6b675f';g.fillText(it.x.u.split('-').slice(1).filter(w=>!/\d{5,}/.test(w)).join(' ').slice(0,32),x+10,y+cw+34);res()};im.onerror=res;im.src=img(it.x.id)})));
    blob=await new Promise(r=>cv.toBlob(r,'image/png'))}
  const prompt=geminiPrompt(c);
  openSheet(`<div class="hd"><h3>הדמיה ב-Gemini</h3><button class="btn sm ghost" id="closeS">סגירה</button></div><ol class="tips"><li>שומרים את גיליון המוצרים.</li><li>פותחים את Gemini, מעלים את <b>תמונת החדר</b> + <b>הגיליון</b>.</li><li>מדביקים את ההנחיה ושולחים. לתיקונים — כותבים באותה שיחה.</li></ol>${blob?`<img alt="גיליון מוצרים" style="width:100%;border:1px solid var(--line);border-radius:12px;margin-top:10px;background:#fff" src="${URL.createObjectURL(blob)}">`:''}<div class="actions"><button class="btn" id="saveSheet">שמירת הגיליון</button><button class="btn ghost" id="copyP">העתקת ההנחיה</button></div><a class="btn ghost block" style="margin-top:8px" href="https://gemini.google.com/app" target="_blank" rel="noopener">פתיחת Gemini ↗</a><p class="hint">ההדמיה נותנת תחושה, אבל לא שומרת על מידות — התוכנית היא האמת לגבי מה נכנס.</p><label class="f"><span>ההנחיה (באנגלית, עובד טוב יותר)</span><textarea readonly id="pTxt">${esc(prompt)}</textarea></label>`);
  $('#copyP').onclick=()=>copyText(prompt,$('#pTxt'));
  $('#saveSheet').onclick=async()=>{if(!blob)return;if(downloads){try{await downloads.save({filename:'ikea-'+ROOM.type+'-'+c.style+'.png',data:blob});toast('נשמר');return}catch(e){if(e&&e.code==='declined')return}}toast('לחיצה ארוכה על התמונה כדי לשמור')};
}
function showText(title,txt,btn){openSheet(`<div class="hd"><h3>${esc(title)}</h3><button class="btn sm ghost" id="closeS">סגירה</button></div><textarea readonly id="tTxt" style="direction:rtl;text-align:right;min-height:260px">${esc(txt)}</textarea><div class="actions"><button class="btn" id="cpy">${esc(btn)}</button>${downloads?'<button class="btn ghost" id="dl">שמירה כקובץ</button>':''}</div>`);
  $('#cpy').onclick=()=>copyText(txt,$('#tTxt'));const dl=$('#dl');if(dl)dl.onclick=async()=>{try{await downloads.save({filename:'ikea-list.txt',data:txt});toast('נשמר')}catch(e){}}}
async function copyText(t,ta){try{await navigator.clipboard.writeText(t);toast('הועתק')}catch(e){if(ta){ta.focus();ta.select();try{document.execCommand('copy');toast('הועתק')}catch(_){toast('סמנו והעתיקו ידנית')}}}}
$('#scrim').onclick=closeSheet;

// ================= Claude personal design =================
let aiCtl=null,aiState={busy:false,msg:''};
function refreshAi(){const box=$('#aiBox');if(!box)return;if(!sample){box.classList.add('hidden');return}box.classList.remove('hidden');const wp=photoFile&&sampleImages;
  box.innerHTML=`<h3>עיצוב אישי עם Claude</h3><p class="small muted" style="margin-top:4px">Claude יבחר 3 סגנונות ומוצרים במיוחד לחדר שלכם${wp?' — כולל קריאה של התמונה (אור, רצפה, קירות)':''}. לוקח כחצי דקה עד שתיים, ומשתמש במכסת ה-Claude שלכם.</p><div class="row" style="margin-top:10px"><button class="btn sm" id="aiGo" ${aiState.busy?'disabled':''}>✨ עצב לי עם Claude</button>${aiState.busy?'<button class="btn sm ghost" id="aiStop">עצירה</button>':''}</div><div class="st" id="aiSt">${esc(aiState.msg)}</div>`;
  $('#aiGo').onclick=runAi;const sb=$('#aiStop');if(sb)sb.onclick=()=>aiCtl&&aiCtl.abort()}
const RULES={living:'Sofa depth + 42 + coffee-table depth + 60 must fit the room depth minus the TV; if no coffee table fits use null and a pouf. Rug at least ~85% of sofa width. Leave out an armchair that would block the walkway.',
 bedroom:'Bed must leave 60 cm on each side for a couple (45 min) and 70 cm at the foot. Mattress width must equal the bed nominal width (e.g. 160x200 bed → 160 mattress). Duvet/bedspread size must match single vs double. Wardrobe needs a free wall plus door-opening space.',
 kitchen:'Keep 100 cm between the kitchen counter and the dining table, 75 cm behind chairs. Chairs count = seats wanted. Pendant 45–60% of table width.',
 bath:'Keep 70 cm clear in front of the sink. Mirror or mirror cabinet not wider than the vanity. Prefer no-drill items for renters.'};
function aiPrompt(room){const R=ROOMS[room.type];const lines=[];
  for(const s of R.slots){if(keepsSlot(room,s.k))continue;if(s.on&&!s.on(room,{}))continue;const list=CAT.filter(x=>x.slot===s.cat).filter(x=>!(room.renter&&x.id===71));lines.push(`[${s.k}]`);for(const x of list)lines.push(`${x.id} | ${x.n} | ${x.v} | ${x.p} | ${x.fw&&x.fd?x.fw+'x'+x.fd:'-'} | ${x.tags}`)}
  const styles=Object.entries(STYLES).map(([k,v])=>`${k}: ${v.name} — lens ${v.designer}. ${v.idea}`).join('\n');
  const extra={living:`TV: ${room.tv}. Uses: ${[...room.uses].join(', ')}.`,bedroom:`Sleepers: ${room.sleepers}.`,kitchen:`Seats: ${room.seats}. Mode: ${room.mode}.`,bath:`Shower: ${room.shower}. Mode: ${room.mode}.`}[room.type];
  const slotsList=R.slots.filter(s=>!s.on||s.on(room,{})).map(s=>s.k).join(', ');
  return `You are a top interior designer. Design a ${R.en} using ONLY the IKEA Israel products listed below (ids). Write every text field in Hebrew.
ROOM: main wall ${room.W} cm; depth ${room.D} cm. Window ${room.winWall==='none'?'none':'on '+room.winWall+' wall, '+room.winW+' cm'}, faces ${DIRS[room.dir]}. Door: ${room.door}. Renter: ${room.renter?'yes':'no'}. ${extra}
Keep from home (do not buy): ${[...room.keep].join(', ')||'nothing'}. Likes: ${room.likes.map(k=>LIKES[k].he).join(', ')||'-'}. Dislikes: ${room.dis.map(k=>DISLIKES[k].he).join(', ')||'-'}.
Budget per concept: ${room.budget} ILS (sum of prices × quantities).
${photoFile&&sampleImages?'The attached photo is the room: read its light, floor, wall colour and fixed elements and adapt.':''}
TASK: 3 concepts, each a DIFFERENT style key (best fit for likes/dislikes):
${styles}
RULES: ids only from the matching [slot] list; null to leave a slot empty. Slots: ${slotsList}. ${RULES[room.type]} Three light layers at 2700K; 60-30-10 colour with the accent repeated 3 times; at least 3 textures.
PRODUCTS (id | name | variant | ILS | w x d cm | style tags):
${lines.join('\n')}
Reply with only JSON: {"roomRead":"<one Hebrew sentence or empty>","concepts":[{"style":"J","title":"<2-4 Hebrew words>","why":"<2 Hebrew sentences>","items":{"<slot>":<id or null>},"tips":["<Hebrew tip>","<Hebrew tip>","<Hebrew tip>"]}]}`}
async function runAi(){if(!sample||aiState.busy)return;ROOM=roomOf();aiState={busy:true,msg:'Claude חושב על החדר… (הבקשה הראשונה מבקשת אישור)'};refreshAi();aiCtl=new AbortController();
  try{const opts={signal:aiCtl.signal,onText:()=>{if(aiState.msg.indexOf('כותב')<0){aiState.msg='Claude כותב את העיצובים…';const s=$('#aiSt');if(s)s.textContent=aiState.msg}}};if(photoFile&&sampleImages)opts.images=[photoFile];
    const res=await sample.json(aiPrompt(ROOM),opts);const got=applyAi(res,ROOM);aiState={busy:false,msg:(res&&res.roomRead?'מה Claude ראה: '+res.roomRead+'\n':'')+(got.fixed?'תוקנו אוטומטית '+got.fixed+' בחירות שלא התאימו לחדר.':'')};ACTIVE=0;renderAll();toast('העיצובים של Claude מוכנים')}
  catch(e){const code=e&&e.code;const map={cancelled:'',not_granted:'לא ניתן אישור להשתמש ב-Claude.',sampling_disabled:'Claude לא זמין בחשבון הזה.',rate_limited:'יותר מדי בקשות — נסו שוב בעוד כמה דקות.',invalid_json:'התשובה לא הגיעה בפורמט הנכון — אפשר לנסות שוב.',image_rejected:'לא הצלחתי לשלוח את התמונה.',session_expired:'צריך להתחבר מחדש ל-Claude.',refused:'Claude לא השלים את הבקשה.'};
    aiState={busy:false,msg:code in map?map[code]:'משהו השתבש — אפשר לנסות שוב.'};if(code==='not_granted'||code==='sampling_disabled')sample=null;refreshAi()}}
function applyAi(res,room){let fixed=0;const out=[],seen=new Set();const list=res&&Array.isArray(res.concepts)?res.concepts:[];
  for(const rc of list){const style=String(rc&&rc.style||'').toUpperCase();if(!STYLES[style]||seen.has(style))continue;seen.add(style);const sel={},items=rc.items||{};
    for(const s of ROOMS[room.type].slots){if(s.on&&!s.on(room,sel)){sel[s.k]=null;continue}if(keepsSlot(room,s.k)){sel[s.k]={keep:true};continue}
      const raw=items[s.k];if(raw===null||raw===undefined||raw===''){sel[s.k]=null;continue}const x=BY[+raw];
      if(x&&x.slot===s.cat&&fitCheck(x,s.k,sel,room).ok&&!(s.k==='cushion2'&&sel.cushion&&sel.cushion.id===x.id))sel[s.k]={id:x.id,qty:qtyFor(s.k,x,sel,room)};
      else{fixed++;const cd=pick(s.k,style,room,sel);sel[s.k]=cd?{id:cd.x.id,qty:qtyFor(s.k,cd.x,sel,room)}:null}}
    out.push({style,sel,src:'ai',room:room.type,title:typeof rc.title==='string'?rc.title.slice(0,40):'',why:typeof rc.why==='string'?rc.why.slice(0,400):'',tips:Array.isArray(rc.tips)?rc.tips.filter(t=>typeof t==='string').slice(0,4).map(t=>t.slice(0,220)):[]});if(out.length===3)break}
  for(const k of chooseStyles(room).concat(Object.keys(STYLES))){if(out.length>=3)break;if(!out.some(c=>c.style===k))out.push(localConcept(k,room))}
  CONCEPTS=out;ROOM=room;$('#results').classList.remove('hidden');return{fixed}}

// ================= boot =================
initForm();
(async()=>{if(!window.claude||!window.claude.use)return;try{sample=await window.claude.use('sample')}catch(e){sample=null}
  if(sample){try{const lim=await sample.limits();sampleImages=!!(lim&&lim.images)}catch(e){sampleImages=false}}try{downloads=await window.claude.use('downloads')}catch(e){downloads=null}refreshAi()})();
