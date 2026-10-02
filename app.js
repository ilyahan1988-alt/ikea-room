"use strict";
// ================= data =================
const ROWS=[...window.CAT_RAW,...(window.CAT_RAW2||[]),...(window.CAT_RAW3||[]),...(window.CAT_RAW4||[])];
const CAT=ROWS.map(r=>({id:r[0],slot:r[1],tags:r[2],n:r[3],v:r[4],p:r[5],u:r[6],fw:r[7],fd:r[8],hex:r[9],est:!!r[10],h:r[11]||0,wall:!!r[12]}));
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
function doorBox(room){const {W,D,door}=room;if(!door||door==='none')return null;if(room.type==='balcony'){const l=door[1]==='l';return{x:l?5:W-85,y:D-80,w:80,h:80}}const s=80,left=door[1]==='l',top=door[0]==='t';return{x:left?0:W-s,y:top?10:D-s-10,w:s,h:s}}
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
 tvwall:{he:'קיר טלוויזיה',en:'TV wall (the feature wall behind the TV)',hero:[708,714,706,717],budget:3000,
  wallA:'רוחב הקיר (ס״מ)',wallB:'גובה התקרה (ס״מ)',mainWall:'המזנון',oppWall:'הקיר ממול',plan:'',
  keeps:{tvunit:'מזנון',art:'תמונות',floor:'מנורה עומדת'},
  slots:[{k:'tvunit',cat:'tvunit',he:'מזנון טלוויזיה',g:'f'},{k:'shelf',cat:'shelf',he:'מדפים',g:'d'},{k:'wlight',cat:'wlight',he:'מנורות קיר',g:'l'},{k:'bias',cat:'bias',he:'תאורה מאחורי המסך',g:'l'},{k:'cable',cat:'cable',he:'ניהול כבלים',g:'d'},
   {k:'floor',cat:'floor',he:'מנורה עומדת',g:'l'},{k:'art',cat:'art',he:'תמונות',g:'d'},{k:'plant',cat:'plant',he:'צמח',g:'d'},{k:'vase',cat:'vase',he:'אגרטל',g:'d'},{k:'candle',cat:'candle',he:'פמוטים',g:'d'}],
  drop:['candle','vase','plant','art','floor','shelf','wlight','bias']},
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
 office:{he:'חדר עבודה',en:'home office / computer corner',hero:[510,521,541,551],budget:2500,
  wallA:'אורך הקיר של השולחן (ס״מ)',wallB:'עומק — מהשולחן לקיר ממול (ס״מ)',mainWall:'השולחן',oppWall:'הקיר ממול',plan:'קיר השולחן למטה.',
  keeps:{desk:'שולחן',ochair:'כיסא',bookcase:'מדפים',lamps:'מנורות'},
  slots:[{k:'desk',cat:'desk',he:'שולחן עבודה',g:'f'},{k:'ochair',cat:'ochair',he:'כיסא עבודה',g:'f'},{k:'bookcase',cat:'bookcase',he:'ספרייה / מדפים',g:'f'},
   {k:'tlamp',cat:['tasklamp','table'],he:'מנורת שולחן',g:'l'},{k:'pendant',cat:'pendant',he:'מנורת תקרה',g:'l',on:r=>r.space==='room'},
   {k:'blind',cat:'blind',he:'וילון',g:'t'},{k:'rug',cat:'rug',he:'שטיח',g:'t',on:r=>r.space==='room'},
   {k:'deskacc',cat:'deskacc',he:'מעמד למסך / אביזר',g:'d'},{k:'art',cat:'art',he:'תמונה מעל השולחן',g:'d'},{k:'plant',cat:'plant',he:'צמח',g:'d'}],
  drop:['plant','art','rug','deskacc','pendant','blind','bookcase','tlamp']},
 kids:{he:'חדר ילדים',en:"child's bedroom",hero:[558,574,600,607],budget:4000,
  wallA:'אורך הקיר של המיטה (ס״מ)',wallB:'עומק החדר (ס״מ)',mainWall:'המיטה',oppWall:'הקיר ממול',plan:'הקיר הראשי למטה.',
  keeps:{kbed:'מיטה',kmattress:'מזרן',wardrobe:'ארון',kstorage:'אחסון צעצועים',desk:'שולחן'},
  slots:[{k:'kbed',cat:'kbed',he:'מיטה',g:'f'},{k:'kmattress',cat:['kmattress','mattress'],he:'מזרן',g:'f'},{k:'wardrobe',cat:'wardrobe',he:'ארון בגדים',g:'f'},{k:'kstorage',cat:'kstorage',he:'אחסון צעצועים',g:'f'},
   {k:'desk',cat:'desk',he:'שולחן כתיבה',g:'f',on:(r,s)=>r.age==='school'&&!(s.kbed&&s.kbed.id===564)},{k:'ktable',cat:'ktable',he:'שולחן ילדים',g:'f',on:r=>r.age!=='school'},
   {k:'kchair',cat:'kchair',he:'כיסא',g:'f',on:(r,s)=>!(s.ktable&&s.ktable.id===580)&&!!(s.ktable||s.desk||(s.kbed&&s.kbed.id===564))},
   {k:'klamp',cat:'klamp',he:'מנורת לילה / קיר',g:'l'},{k:'tlamp',cat:'tasklamp',he:'מנורת שולחן',g:'l',on:r=>r.age==='school'},{k:'pendant',cat:'pendant',he:'מנורת תקרה',g:'l'},
   {k:'curtain',cat:'curtain',he:'וילון',g:'t'},{k:'krug',cat:'krug',he:'שטיח',g:'t'},{k:'duvet',cat:'duvet',he:'מצעים',g:'t',on:(r,s)=>{const b=itemOf(s,'kbed',r);return !b||b.keep||kNom(b)[0]>=80}},
   {k:'ktextile',cat:'ktextile',he:'כרית / כילה',g:'t'},{k:'art',cat:'art',he:'תמונה',g:'d'}],
  drop:['art','ktextile','krug','tlamp','pendant','duvet','curtain','kstorage','klamp']},
 balcony:{he:'מרפסת',en:'balcony',hero:[614,620,640,647],budget:2500,
  wallA:'אורך המרפסת — לאורך קיר הבית (ס״מ)',wallB:'עומק — מקיר הבית עד המעקה (ס״מ)',mainWall:'קיר הבית',oppWall:'המעקה',plan:'קיר הבית (עם הדלת) למטה, המעקה למעלה.',
  keeps:{osofa:'ספה / ספסל',bchair:'כיסאות',otable:'שולחן',lamps:'תאורה'},
  slots:[{k:'deck',cat:'deck',he:'ריצוף דק (בלי כלים)',g:'r',on:r=>r.floor==='deck'},
   {k:'osofa',cat:'osofa',he:'ספה / ספסל',g:'f',on:r=>r.D>=90&&(r.bUses.has('coffee')||!r.bUses.has('dine'))},{k:'otable',cat:'otable',he:'שולחן',g:'f'},
   {k:'bchair',cat:'ochair2',he:'כיסאות',g:'f',on:(r,s)=>seatsLeft(r,s)>0},{k:'lounger',cat:'lounger',he:'מיטת שיזוף',g:'f',on:r=>r.bUses.has('sun')},{k:'ostorage',cat:'ostorage',he:'אחסון',g:'f'},
   {k:'olight',cat:'olight',he:'תאורה',g:'l'},{k:'olight2',cat:'olight',he:'תאורה נוספת',g:'l'},
   {k:'orug',cat:'orug',he:'שטיח חוץ',g:'t'},{k:'ocushion',cat:'ocushion',he:'כריות לכיסאות',g:'t',on:(r,s)=>{const c=itemOf(s,'bchair',r);return !!c&&!c.keep&&!/Kuddarna|כרית/.test(c.v)}},
   {k:'opot',cat:'opot',he:'כלים לצמחים',g:'d'},{k:'plant',cat:'plant',he:'צמח מלאכותי',g:'d'}],
  drop:['plant','olight2','orug','ostorage','ocushion','opot','lounger','deck']},
};
const catHas=(d,x)=>!!x&&(Array.isArray(d.cat)?d.cat.includes(x.slot):x.slot===d.cat);
const catName=d=>Array.isArray(d.cat)?d.cat[0]:d.cat;
const baseKey=k=>k.replace(/_\d+$/,'').replace(/^bedside2$/,'bedside');
const slotsOf=(room,sel)=>ROOMS[room.type].slots.filter(s=>!s.on||s.on(room,sel||{}));
const SLOTDEF=type=>Object.fromEntries(ROOMS[type].slots.map(s=>[s.k,s]));

// ================= form =================
const PER_DEF={
 living:{W:280,D:200,winWall:'sofa',winW:120,door:'none',dir:'u',keep:[],budget:5000,tv:'wall',uses:['tv','host','relax'],ksW:200,ksD:90},
 bedroom:{W:320,D:300,winWall:'left',winW:120,door:'tr',dir:'u',keep:[],budget:5000,sleepers:'couple'},
 kitchen:{W:260,D:300,winWall:'left',winW:100,door:'br',dir:'u',keep:[],budget:3000,seats:4,mode:'refresh'},
 bath:{W:200,D:180,winWall:'none',winW:60,door:'tl',dir:'u',keep:[],budget:2000,mode:'refresh',shower:'curtain'},
 office:{W:240,D:260,winWall:'left',winW:100,door:'tr',dir:'u',keep:[],budget:2500,space:'room',work:'monitor'},
 kids:{W:300,D:300,winWall:'tv',winW:120,door:'br',dir:'u',keep:[],budget:4000,age:'school',kids:1},
 balcony:{W:300,D:150,winWall:'none',winW:60,door:'bl',dir:'u',keep:[],budget:2500,bUses:['coffee','plants'],bSeats:2,floor:'keep'},
 tvwall:{W:400,D:250,winWall:'none',winW:60,door:'none',dir:'u',keep:[],budget:3000,tvIn:55,tvMount:'wall',tvPos:'center',kuW:160,kuH:50},
};
const PALETTES={
 sage:{he:'קרם · מרווה · טרקוטה',c:['#e9e1d0','#8d9b84','#b4634a'],n:['קרם','מרווה','טרקוטה']},
 navy:{he:'חול · כחול עמוק · פליז',c:['#e6dccb','#2f4050','#b08d4a'],n:['חול','כחול עמוק','פליז']},
 olive:{he:'שמנת · זית · חרדל',c:['#ece4d2','#6b7048','#c9973a'],n:['שמנת','זית','חרדל']},
 blush:{he:'שמנת · ורוד אבקתי · ירוק עמוק',c:['#eee6dc','#d8b4ab','#4f6a54'],n:['שמנת','ורוד אבקתי','ירוק עמוק']},
 sea:{he:'לבן · תכלת אפרפר · עץ בהיר',c:['#f0eee9','#9db4bd','#c7a47b'],n:['לבן','תכלת אפרפר','עץ בהיר']},
 mist:{he:'ערפל · כחול אפור · כחול לילה',c:['#e8ecef','#7c8fa3','#2e3a4a'],n:['ערפל','כחול אפור','כחול לילה']},
 mono:{he:'לבן · פחם · עץ חם',c:['#f1f0ec','#3a3b3d','#b98a5a'],n:['לבן','פחם','עץ חם']},
 coffee:{he:'בז׳ · קקאו · שחור',c:['#ddd0ba','#7a5c45','#2b2b2b'],n:['בז׳','קקאו','שחור']},
 plum:{he:'אבן · שזיף · נחושת',c:['#e9e3dc','#6a4a5a','#c58b6a'],n:['אבן','שזיף','נחושת']},
 forest:{he:'קרם · ירוק יער · כתום חרוק',c:['#e7e2d6','#3f5a4a','#c7794f'],n:['קרם','ירוק יער','כתום חרוק']}};
const CUSTOM_PAL=['#ece6da','#8a9a86','#b5654a'];
for(const t in PER_DEF)Object.assign(PER_DEF[t],{palette:'auto',pal:CUSTOM_PAL.slice(),opens:''});
let F=store.get('ikea-room-form2');
if(!F){const old=store.get('ikea-room-form')||{};F={room:'living',renter:old.renter!==undefined?old.renter:true,likes:old.likes||['natural','warm'],dis:old.dis||[],per:{}};
  for(const t in PER_DEF)F.per[t]=Object.assign({},PER_DEF[t]);
  for(const k of Object.keys(PER_DEF.living))if(old[k]!==undefined)F.per.living[k]=old[k];}
for(const t in PER_DEF)F.per[t]=Object.assign({},PER_DEF[t],F.per[t]||{});
const HEXRE=/^#[0-9a-f]{6}$/i;
function cleanPal(p){if(!p||typeof p!=='object')return;
  if(!Array.isArray(p.pal)||p.pal.length!==3||!p.pal.every(h=>typeof h==='string'&&HEXRE.test(h)))p.pal=CUSTOM_PAL.slice();
  if(p.palette!=='auto'&&p.palette!=='custom'&&!Object.prototype.hasOwnProperty.call(PALETTES,p.palette))p.palette='auto';
  if(typeof p.opens!=='string'||!/^[a-z]+$/.test(p.opens))p.opens=''}
for(const t in PER_DEF)cleanPal(F.per[t]);
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
  $('#heroTitle').innerHTML=({living:'הסלון שלך,',bedroom:'חדר השינה שלך,',kitchen:'המטבח שלך,',bath:'חדר הרחצה שלך,',office:'פינת העבודה שלך,',kids:'חדר הילדים שלך,',balcony:'המרפסת שלך,',tvwall:'קיר הטלוויזיה שלך,'})[t]+'<br>בעין של מעצב.';
  $('#winRow').classList.toggle('hidden',t==='balcony'||t==='tvwall');{const tvw=t==='tvwall';for(const id of ['doorLbl','dirLbl','dirChips','dirHint'])$('#'+id).classList.toggle('hidden',tvw)}const dsel=$('#door');if(!dsel._orig)dsel._orig=dsel.innerHTML;dsel.innerHTML=t==='balcony'?'<option value="bl">בצד שמאל של קיר הבית</option><option value="br">בצד ימין של קיר הבית</option><option value="none">לא רלוונטי</option>':dsel._orig;
  if(t==='balcony'&&!['bl','br','none'].includes(p.door))p.door='bl';$('#dirLbl').textContent=t==='balcony'?'לאיזה כיוון המרפסת פונה':'לאיזה כיוון החלון פונה';
  document.querySelectorAll('.collage img').forEach((im,i)=>{im.src=img(R.hero[i])});
  $('#lblW').textContent=R.wallA;$('#lblD').textContent=R.wallB;
  $('#winWall').innerHTML=winOptions(t);
  for(const id of ['W','D','winW']){const e=$('#'+id);e.value=p[id];e.oninput=()=>{p[id]=+e.value||0;saveForm()}}
  for(const id of ['winWall','door']){const e=$('#'+id);e.value=p[id];e.onchange=()=>{p[id]=e.value;saveForm()}}
  chipGroup($('#dirChips'),DIRS,()=>p.dir,false,k=>{p.dir=k});
  chipGroup($('#keepChips'),R.keeps,()=>p.keep,true,k=>{p.keep=toggleIn(p.keep,k);renderExtras()});
  const b=$('#budget');b.value=p.budget;$('#budgetOut').textContent=ils(p.budget);b.oninput=()=>{p.budget=+b.value;$('#budgetOut').textContent=ils(p.budget);saveForm()};
  renderPalette(p);
  const om={'':'לא'};for(const [k,R2] of Object.entries(ROOMS))if(k!==t)om[k]=R2.he;
  chipGroup($('#opensChips'),om,()=>p.opens||'',false,k=>{p.opens=k});
  renderExtras();
}
function renderPalette(p){
  const box=$('#palChips');box.innerHTML='';
  const mk=(id,label,cols)=>{const b=document.createElement('button');b.type='button';b.className='chip';b.setAttribute('aria-pressed',String(p.palette===id));b.innerHTML=(cols?`<span class="sw3">${cols.map(c=>`<i style="background:${c}"></i>`).join('')}</span>`:'')+esc(label);b.onclick=()=>{p.palette=id;saveForm();renderPalette(p)};box.appendChild(b)};
  mk('auto','אוטומטי',null);for(const [k,v] of Object.entries(PALETTES))mk(k,v.he,v.c);mk('custom','צבעים משלי',p.pal);
  const cu=$('#palCustom');if(p.palette==='custom'){cu.className='';cu.style.cssText='display:flex;gap:10px;margin-top:10px';cu.innerHTML=['בסיס (60%)','משני (30%)','הדגשה (10%)'].map((l,i)=>`<label class="cpick"><input type="color" value="${p.pal[i]}" data-i="${i}">${l}</label>`).join('');cu.querySelectorAll('input').forEach(inp=>inp.oninput=()=>{p.pal[+inp.dataset.i]=inp.value;saveForm();const sw=document.querySelector('#palChips .chip:last-child .sw3');if(sw&&sw.children[+inp.dataset.i])sw.children[+inp.dataset.i].style.background=inp.value})}else{cu.className='hidden';cu.style.cssText='';cu.innerHTML=''}
}
function renderExtras(){
  const t=F.room,p=P(),box=$('#extras');let h='';
  if(t==='living'){h+=`<label class="f"><span>טלוויזיה</span><select id="tv"><option value="wall">על הקיר / מדף צף</option><option value="unit">על מזנון (עומק 40)</option><option value="none">אין</option></select></label><label class="f"><span>בשביל מה החדר</span></label><div class="chips" id="useChips"></div>`;
    if(p.keep.includes('sofa'))h+=`<div class="row"><label class="f"><span>רוחב הספה שלך (ס״מ)</span><input type="number" id="ksW" inputmode="numeric"></label><label class="f"><span>עומק הספה שלך (ס״מ)</span><input type="number" id="ksD" inputmode="numeric"></label></div>`}
  if(t==='tvwall'){h+=`<label class="f"><span>גודל הטלוויזיה (אינץ׳)</span></label><div class="chips" id="tvInChips"></div><label class="f"><span>איך היא מורכבת</span></label><div class="chips" id="tvMountChips"></div><label class="f"><span>איפה המזנון על הקיר</span></label><div class="chips" id="tvPosChips"></div>`;
    if(p.keep.includes('tvunit'))h+=`<div class="row"><label class="f"><span>רוחב המזנון שלך (ס״מ)</span><input type="number" id="kuW" inputmode="numeric"></label><label class="f"><span>גובה המזנון שלך (ס״מ)</span><input type="number" id="kuH" inputmode="numeric"></label></div>`}
  if(t==='bedroom')h+=`<label class="f"><span>מי ישן בחדר</span></label><div class="chips" id="sleepChips"></div>`;
  if(t==='kitchen')h+=`<label class="f"><span>סוג השינוי</span></label><div class="chips" id="modeChips"></div><p class="hint" id="modeHint"></p><label class="f"><span>כמה יושבים לאכול</span></label><div class="chips" id="seatChips"></div>`;
  if(t==='bath')h+=`<label class="f"><span>סוג השינוי</span></label><div class="chips" id="modeChips"></div><p class="hint" id="modeHint"></p><label class="f"><span>מקלחת</span></label><div class="chips" id="showerChips"></div>`;
  if(t==='office')h+=`<label class="f"><span>איפה עובדים</span></label><div class="chips" id="spaceChips"></div><label class="f"><span>על מה עובדים</span></label><div class="chips" id="workChips"></div>`;
  if(t==='kids')h+=`<label class="f"><span>גיל</span></label><div class="chips" id="ageChips"></div><label class="f"><span>כמה ילדים בחדר</span></label><div class="chips" id="kidsChips"></div>`;
  if(t==='balcony')h+=`<label class="f"><span>בשביל מה המרפסת</span></label><div class="chips" id="bUseChips"></div><label class="f"><span>כמה יושבים</span></label><div class="chips" id="bSeatChips"></div><label class="f"><span>הרצפה</span></label><div class="chips" id="floorChips"></div>`;
  box.innerHTML=h;
  if(t==='tvwall'){chipGroup($('#tvInChips'),{43:'43',50:'50',55:'55',65:'65',75:'75',85:'85'},()=>p.tvIn,false,k=>{p.tvIn=+k});chipGroup($('#tvMountChips'),{wall:'תלויה על הקיר',stand:'עומדת על המזנון'},()=>p.tvMount,false,k=>{p.tvMount=k});chipGroup($('#tvPosChips'),{center:'במרכז',left:'לשמאל',right:'לימין'},()=>p.tvPos,false,k=>{p.tvPos=k});
    for(const id of ['kuW','kuH']){const e=$('#'+id);if(e){e.value=p[id];e.oninput=()=>{p[id]=+e.value||0;saveForm()}}}}
  if(t==='office'){chipGroup($('#spaceChips'),{room:'חדר עבודה',corner:'פינה בחדר אחר'},()=>p.space,false,k=>{p.space=k});chipGroup($('#workChips'),{laptop:'לפטופ',monitor:'מחשב עם מסך',gaming:'גיימינג'},()=>p.work,false,k=>{p.work=k})}
  if(t==='kids'){chipGroup($('#ageChips'),{toddler:'2–5',school:'6–12'},()=>p.age,false,k=>{p.age=k});chipGroup($('#kidsChips'),{1:'ילד אחד',2:'שניים'},()=>p.kids,false,k=>{p.kids=+k})}
  if(t==='balcony'){chipGroup($('#bUseChips'),{coffee:'קפה ומנוחה',dine:'ארוחות',plants:'צמחים',sun:'שיזוף'},()=>p.bUses,true,k=>{p.bUses=toggleIn(p.bUses,k)});chipGroup($('#bSeatChips'),{2:'2',4:'4'},()=>p.bSeats,false,k=>{p.bSeats=+k});chipGroup($('#floorChips'),{keep:'נשארת כמו שהיא',deck:'דק עץ חדש (בלי כלים)'},()=>p.floor,false,k=>{p.floor=k})}
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
  const sn=$('#statN');if(sn)sn.textContent=CAT.filter(x=>!['kx','jchair'].includes(x.slot)).length;const sr=$('#statR');if(sr)sr.textContent=Object.keys(ROOMS).length;
  const rt=$('#roomTabs');rt.innerHTML='';
  for(const [k,R] of Object.entries(ROOMS)){const b=document.createElement('button');b.type='button';b.className='chip';b.dataset.room=k;b.textContent=R.he;b.onclick=()=>{F.room=k;saveForm();renderRoomForm();$('#results').classList.add('hidden')};rt.appendChild(b)}
  $('#renter').checked=F.renter;$('#renter').onchange=e=>{F.renter=e.target.checked;saveForm();modeHint()};
  chipGroup($('#likeChips'),LIKES,()=>F.likes,true,k=>{F.likes=toggleIn(F.likes,k)});
  chipGroup($('#disChips'),DISLIKES,()=>F.dis,true,k=>{F.dis=toggleIn(F.dis,k)},true);
  $('#photo').onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;photoFile=f;const u=URL.createObjectURL(f);$('#phPrev').outerHTML='<img id="phPrev" alt="התמונה שלך" src="'+u+'">';refreshAi()};
  $('#go').onclick=()=>{generateLocal();$('#results').classList.remove('hidden');$('#results').scrollIntoView({behavior:'smooth',block:'start'})};
  $('#measB').onclick=openMeasure;
  renderRoomForm();
}

// ================= room model =================
function roomOf(){
  const p=P(),t=F.room;const W=Math.max(t==='balcony'?80:120,p.W||280),D=Math.max(t==='balcony'?60:t==='tvwall'?200:120,p.D||200);
  const r={type:t,W,D,winWall:p.winWall,winW:Math.max(40,p.winW||100),door:p.door,dir:p.dir,renter:F.renter,keep:new Set(p.keep),likes:F.likes,dis:F.dis,budget:p.budget,
    tv:p.tv||'none',uses:new Set(p.uses||[]),sleepers:p.sleepers||'couple',seats:p.seats||4,mode:p.mode||'refresh',shower:p.shower||'curtain',
    space:p.space||'room',work:p.work||'monitor',age:p.age||'school',kids:+p.kids||1,bUses:new Set(p.bUses||[]),bSeats:+p.bSeats||2,floor:p.floor||'keep'};
  if(t==='balcony')r.winWall='none';
  r.pal=resolvePal(p);r.opens=p.opens||'';
  if(t==='tvwall'){r.winWall='none';r.door='none';r.tvIn=[43,50,55,65,75,85].includes(+p.tvIn)?+p.tvIn:55;r.tvMount=p.tvMount==='stand'?'stand':'wall';r.tvPos=['left','right'].includes(p.tvPos)?p.tvPos:'center';r.keptUnit={fw:Math.max(60,p.kuW||160),h:Math.max(20,p.kuH||50)}}
  r.tvd=t==='living'?(r.tv==='unit'?40:r.tv==='wall'?8:0):0;
  r.keptSofa=t==='living'&&r.keep.has('sofa')?{fw:Math.max(80,p.ksW||200),fd:Math.max(50,p.ksD||90)}:null;
  return r;
}
const KEPT_DIMS={arm:{fw:75,fd:80},coffee:{fw:90,fd:55},rug:{fw:230,fd:160},bed:{fw:166,fd:207},mattress:{fw:160,fd:200},wardrobe:{fw:100,fd:60},dresser:{fw:80,fd:48},dtable:{fw:120,fd:80},chair:{fw:45,fd:50},desk:{fw:120,fd:60},ochair:{fw:65,fd:65},bookcase:{fw:80,fd:35},kbed:{fw:97,fd:207},kmattress:{fw:90,fd:200},kstorage:{fw:90,fd:45},osofa:{fw:120,fd:60},bchair:{fw:50,fd:55},otable:{fw:75,fd:65}};
function keptItem(slot,room){const d=slot==='sofa'?room.keptSofa:KEPT_DIMS[slot]||{fw:0,fd:0};return{keep:true,id:'k-'+slot,slot,n:'שלך',v:'נשאר מהבית',p:0,fw:d.fw,fd:d.fd,hex:'#a8a39a',tags:'',cls:[]}}
function keepsSlot(room,slot){if(room.keep.has(slot))return true;if(room.keep.has('lamps')&&['floor','table','pendant','tlamp','klamp','olight','olight2'].includes(slot))return room.type!=='living'||slot!=='pendant';if(room.keep.has('art')&&slot==='art')return true;return false}
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
  else if(EXTRA_ROOMS.includes(t)){const f=fitExtra(x,slot,sel,room);ok=f.ok;why=f.why;bonus=f.bonus}
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
  if(EXTRA_ROOMS.includes(t))return qtyExtra(slot,x,sel,room);
  return 1;
}

// ================= colour palettes =================
function resolvePal(p){if(!p)return null;if(p.palette==='custom'&&Array.isArray(p.pal)&&p.pal.length===3)return{id:'custom',he:'הצבעים שלך',c:p.pal.slice(),n:['צבע הבסיס','הצבע המשני','צבע ההדגשה']};
  const v=PALETTES[p.palette];return v?{id:p.palette,he:v.he,c:v.c,n:v.n}:null}
function labOf(h){const n=parseInt(h.slice(1),16);const [r,g,b]=[n>>16&255,n>>8&255,n&255].map(v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)});
  const x=(r*.4124+g*.3576+b*.1805)/.95047,y=r*.2126+g*.7152+b*.0722,z=(r*.0193+g*.1192+b*.9505)/1.08883;const f=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;return[116*f(y)-16,500*(f(x)-f(y)),200*(f(y)-f(z))]}
function dE(a,b){const p=labOf(a),q=labOf(b);return Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])}
const tempOf=c=>{const w=[.6,.3,.1];const T=c.reduce((s,h,i)=>s+w[i]*labOf(h)[2],0);return T>=8?'warm':T<=3?'cool':'neutral'};
const PAL_CAP=26,PAL_DIV=1.5,PAL_STYLE_MISS=2;
const PERMS=[[0,1,2],[1,0,2],[0,2,1]];
const PERM_NOTE=['בסיס רגוע, והצבע החזק במינון קטן.','הצבע המשני בתפקיד הראשי — נועז יותר.','ההדגשה מקבלת מקום גדול יותר — ניגודיות גבוהה.'];
function palRank(style,room){const r=room.styleRank&&room.styleRank[style];return((r!==undefined?r:Object.keys(STYLES).indexOf(style))%3+3)%3}
function palFor(style,room){if(!room.pal)return null;const i=palRank(style,room),pm=PERMS[i];return{i,c:pm.map(k=>room.pal.c[k]),n:pm.map(k=>room.pal.n[k])}}
const PAL_ROLE={tvunit:0,shelf:1,wlight:2,sofa:0,rug:0,blind:0,curtain:0,bedspread:0,pendant:0,tablelinen:0,bathmat:0,krug:0,orug:0,osofa:0,shower:0,
 arm:1,duvet:1,towel:1,chair:1,bchair:1,pouf:1,cushion:1,ktextile:1,
 cushion2:2,throw:2,vase:2,candle:2,ktowel:2,jars:2,opot:2,ocushion:2,klamp:2,olight:2,olight2:2,bset:2,bbox:2};
function paletteFitCheck(c,room,out){if(!room.pal)return;const pf=palFor(c.style,room);let n=0,ok=0;const miss=[];
  for(const k in c.sel){const e=c.sel[k];if(PAL_ROLE[k]===undefined||!e||e.keep||!BY[e.id]||!BY[e.id].hex)continue;const x=BY[e.id],r=PAL_ROLE[k],d=dE(x.hex,pf.c[r]);n++;if(d<=22)ok++;else if(d>=38)miss.push({d,he:(SLOTDEF(room.type)[k]||{he:k}).he,nm:x.n,role:pf.n[r]})}
  if(n<3)return;miss.sort((a,b)=>b.d-a.d);const worst=miss.slice(0,2).map(m=>`${m.he} (${m.nm}) רחוק מ"${m.role}"`).join(', ');
  if(ok/n>=0.6)out.push(['ok',`התאמה לפלטה: ${ok} מתוך ${n} פריטים בצבעים קרובים לפלטה שבחרת${worst?'. הכי רחוק: '+worst:''}.`]);
  else out.push(['warn',`התאמה חלקית לפלטה: ${ok} מתוך ${n} פריטים קרובים לצבעים שבחרת${worst?' (הכי רחוק: '+worst+')':''}. הקטלוג של איקאה ישראל לא כולל בכל קטגוריה גוון קרוב — אפשר להשלים בצבע קיר, או בטקסטיל מחנות אחרת.`])}
function harmonyChecks(room,out){const o=room.opens;if(!o||!ROOMS[o]||o===room.type)return;
  const mine=room.pal,other=resolvePal(F.per[o]),oh=ROOMS[o].he,mh=ROOMS[room.type].he;if(!mine&&!other)return;
  if(!mine){out.push(['warn',`הערת מעצב: ה${mh} פתוח ל${oh}, ושם נבחרה הפלטה "${other.he}". כדי שזה ירגיש כמו דירה אחת, כדאי לבחור פלטה קרובה גם כאן.`]);return}
  if(!other){out.push(['warn',`הערת מעצב: ה${mh} פתוח ל${oh}, ושם עוד לא נבחרה פלטה. כדאי לבחור גם שם פלטה קרובה ל"${mine.he}", כדי שהחללים ירגישו כמו דירה אחת.`]);return}
  const same=mine.c.every((h,i)=>dE(h,other.c[i])<8);
  if(same){out.push(['ok',`הערת מעצב: אותה פלטה ב${mh} וב${oh} — רציפות מלאה בין החללים.`]);return}
  const t1=tempOf(mine.c),t2=tempOf(other.c),TH={warm:'חם',cool:'קר'};
  const shared=[];mine.c.forEach((h,i)=>other.c.forEach((g,j)=>{if(dE(h,g)<12&&!shared.includes(mine.n[i]))shared.push(mine.n[i])}));
  if((t1==='warm'&&t2==='cool')||(t1==='cool'&&t2==='warm'))out.push(['warn',`הערת מעצב: ה${mh} בגוון ${TH[t1]} וה${oh} בגוון ${TH[t2]}. כשהחללים פתוחים זה לזה זה עלול להרגיש כמו שתי דירות שונות. כדי לחבר: חזרו כאן על הצבע "${other.n[0]}" מהפלטה של ה${oh} בפריט אחד או שניים (כרית, אגרטל), ושמרו על אותו גוון עץ ומתכת בשני החללים.`]);
  else if(shared.length)out.push(['ok',`הערת מעצב: יש צבע משותף (${shared.join(', ')}) בין ה${mh} ל${oh} — זה מחבר בין החללים גם כשהפלטות שונות.`]);
  else if(t1===t2&&t1!=='neutral')out.push(['ok',`הערת מעצב: שתי הפלטות בגוון ${TH[t1]} — זה מחבר גם כשהצבעים שונים. כדאי לחזור על פריט אחד בצבע "${other.n[0]}" גם כאן.`]);
  else out.push(['ok',`הערת מעצב: לפחות אחת הפלטות ניטרלית, והמעבר בין החללים יהיה רך. לחיבור, חזרו על "${other.n[0]}" מהפלטה של ה${oh} בפריט קטן אחד.`])}

// ================= scoring / builder =================
function scoreItem(x,slot,style,room,sel){
  let s=0;if(x.tags.includes(style)){s+=10;if(x.tags[0]===style)s+=2}else s-=(room.pal&&PAL_ROLE[slot]!==undefined?PAL_STYLE_MISS:6);
  for(const k of room.likes){const L=LIKES[k];if(L&&L.cls.some(c=>x.cls.includes(c)))s+=1.2}
  for(const k of room.dis){const Dd=DISLIKES[k];if(!Dd)continue;if((Dd.cls&&Dd.cls.some(c=>x.cls.includes(c)))||(Dd.ids&&Dd.ids.includes(x.id)))s-=5}
  if(slot==='cushion2'){const b=itemOf(sel,'cushion',room);if(b&&b.id===x.id)s-=20;if(['bold','black','green','wood'].some(c=>x.cls.includes(c)))s+=1.5}
  if(slot==='cushion'&&room.type==='living'&&['beige','white','grey'].some(c=>x.cls.includes(c)))s+=1;
  if(room.renter&&[434].includes(x.id))s+=1;
  const heavy=['sofa','bed','wardrobe','vanity','kunit','mattress','dtable','desk','kbed','osofa'].includes(slot)?1000:['arm','coffee','dresser','cart','mcab','tallcab','ksink','ktap','chair','ochair','bookcase','kmattress','otable','bchair','lounger','kstorage','deck'].includes(slot)?500:250;
  s-=x.p*qtyFor(slot,x,sel,room)/heavy;
  if(room.pal&&PAL_ROLE[slot]!==undefined){const pf=palFor(style,room);s-=Math.min(PAL_CAP,dE(x.hex,pf.c[PAL_ROLE[slot]])/PAL_DIV)}
  const f=fitCheck(x,slot,sel,room);return{s:s+f.bonus,ok:f.ok,why:f.why};
}
function candidates(slot,style,room,sel){const d=SLOTDEF(room.type)[slot];return CAT.filter(x=>catHas(d,x)).map(x=>Object.assign({x},scoreItem(x,slot,style,room,sel))).sort((a,b)=>(b.ok-a.ok)||(b.s-a.s))}
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
    if(best){sel[best.slot]={id:best.id,qty:best.q};revalidate(c,room,best.slot,true);continue}
    const d=ROOMS[room.type].drop.find(k=>sel[k]&&!sel[k].keep&&!sel[k].lock);const g=d&&SLOTDEF(room.type)[d].g;if(!d||g==='l'||g==='f'){if(tol<40){tol=40;continue}if(!d)break}sel[d]=null;dropped.push(d);
  }
  c.dropped=dropped;return c;
}
function localConcept(style,room){const c={style,sel:buildSel(style,room),src:'local',room:room.type};fitBudget(c,room);return c}

// ================= layouts (cm; y=0 is the wall opposite the main wall) =================
function layout(room,sel){return({living:layoutLiving,bedroom:layoutBedroom,kitchen:layoutKitchen,bath:layoutBath,office:layoutOffice,kids:layoutKids,balcony:layoutBalcony,tvwall:layoutTvwall})[room.type](room,sel)}
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
    else{P.floor={x:W-lw-2,y:tvd+2,w:lw,h:lw,round:1};notes.push('המנורה העומדת עוברת לפינה ליד הקיר ממול — אין מקום ליד הספה.')}
    const blockers=['sofa','side','arm','coffee'].map(k=>P[k]).filter(Boolean);
    if(P.floor&&blockers.some(b=>overlap(P.floor,b))){const cs=[{x:W-lw-2,y:tvd+2},{x:2,y:tvd+2},{x:W-lw-2,y:D-lw-2},{x:2,y:D-lw-2}].map(o=>({x:o.x,y:o.y,w:lw,h:lw,round:1}));
      const o=freeSpot(room,cs,blockers);if(o){P.floor=o;if(!notes.some(n=>/המנורה העומדת/.test(n)))notes.push('המנורה העומדת עוברת לפינה פנויה — אין מקום ליד הספה והכורסה.')}
      else{delete P.floor;notes.push('אין מקום פנוי למנורה העומדת — מנורת שולחן או מנורת קיר יתאימו יותר.')}}}
  if(pouf){const pw=pouf.fw,ph=pouf.fd;if(!P.coffee)P.pouf={x:sx+sw/2-pw/2,y:frontY-ph,w:pw,h:ph,round:pw===ph};
    else{const aR=P.arm&&P.arm.x>W/2;const x=aR?P.coffee.x-pw-14:P.coffee.x+P.coffee.w+14;const y=P.coffee.y+P.coffee.h/2-ph/2;
      if(x>=4&&x+pw<=W-4&&!(P.arm&&overlap({x,y,w:pw,h:ph},P.arm)))P.pouf={x,y,w:pw,h:ph,round:pw===ph};else{P.pouf={x:P.coffee.x+P.coffee.w-pw*0.7,y:P.coffee.y+P.coffee.h-ph*0.35,w:pw,h:ph,round:pw===ph,under:1};notes.push('ההדום נכנס חלקית מתחת לשולחן כשלא בשימוש.')}}}
  if(rug){const rw=rug.fw,rh=rug.fd;let ry=sy+20-rh;if(ry<tvd+10)ry=tvd+10;let rx=Math.min(Math.max(10,sx+sw/2-rw/2),W-10-rw);P.rug={x:rx,y:ry,w:rw,h:rh,under:2}}
  const taken=()=>['sofa','side','arm','floor','pouf','coffee'].map(k=>P[k]).filter(Boolean);
  if(plant){const s=plant.fw;const o=freeSpot(room,[{x:2,y:tvd+2},{x:W-s-2,y:tvd+2},{x:2,y:D-s-2},{x:W-s-2,y:D-s-2}].map(o=>({x:o.x,y:o.y,w:s,h:s,round:1})),taken());if(o)P.plant=o;else notes.push('אין פינה פנויה לצמח על הרצפה — אפשר צמח קטן על מדף.')}
  if(mirror&&mirror.id===167){const o=freeSpot(room,[{x:2,y:tvd+2,w:52,h:12},{x:W-54,y:tvd+2,w:52,h:12}],taken().concat(P.plant?[P.plant]:[]));if(o)P.mirror=o}
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

// ================= office / kids / balcony =================
const EXTRA_ROOMS=['office','kids','balcony','tvwall'];
const BUNK=[561,562],LOFT=[563,564],JUNIOR=[555,556,557,566],TODDLER_CH=[585,587,592],STUDENT_CH=[593,594,595];
function kNom(x){if(!x||x.keep)return[90,200];const m=String(x.v).match(/(\d{2,3})x(\d{3})/);return m?[+m[1],+m[2]]:[x.fw,x.fd]}
const sofaSeats=x=>!x?0:x.keep?2:x.fw>=200?3:x.fw>=100?2:1;
function seatsLeft(r,s){return Math.max(0,r.bSeats-sofaSeats(itemOf(s,'osofa',r)))}
function wallSpots(room,len,dep,cl,walls){const {W,D}=room;const out=[];
  for(const w of walls||['b','t','l','r']){const span=w==='t'||w==='b'?W:D;if(span-4<len)continue;
    for(const t of [0,1,0.5,0.25,0.75]){const p=2+(span-4-len)*t;
      if(w==='t')out.push({x:p,y:2,w:len,h:dep,cl:cl?{x:p,y:2+dep,w:len,h:cl}:null,wall:w});
      if(w==='b')out.push({x:p,y:D-dep-2,w:len,h:dep,cl:cl?{x:p,y:D-dep-2-cl,w:len,h:cl}:null,wall:w});
      if(w==='l')out.push({x:2,y:p,w:dep,h:len,cl:cl?{x:2+dep,y:p,w:cl,h:len}:null,wall:w,rot:1});
      if(w==='r')out.push({x:W-dep-2,y:p,w:dep,h:len,cl:cl?{x:W-dep-2-cl,y:p,w:cl,h:len}:null,wall:w,rot:1})}}
  return out}
const boxesOf=P=>Object.values(P).filter(b=>b&&typeof b==='object'&&b.x!==undefined&&!b.under);
function placeFree(room,P,extra,cands){const d=doorBox(room);const boxes=boxesOf(P).concat(extra||[]);const cls=Object.values(P).filter(b=>b&&b.cl).map(b=>b.cl);
  return cands.find(b=>inRoom(b,room)&&(!b.cl||inRoom(b.cl,room))&&!boxes.some(o=>overlap(b,o)||(b.cl&&overlap(b.cl,o)))&&!cls.some(o=>overlap(b,o))&&!(d&&(overlap(b,d)||(b.cl&&overlap(b.cl,d)))))||null}
function farFrom(c,d){if(!d)return c;const cx=d.x+d.w/2,cy=d.y+d.h/2;const walls=[...new Set(c.map(b=>b.wall||''))];const dist=b=>Math.hypot(b.x+b.w/2-cx,b.y+b.h/2-cy);
  return c.slice().sort((a,b)=>(walls.indexOf(a.wall||'')-walls.indexOf(b.wall||''))||(dist(b)-dist(a)))}
function chairBy(d,cw,cd,off){off=off||0;const w=d.wall;
  if(w==='b')return{x:d.x+d.w/2-cw/2+off,y:d.y-cd-2,w:cw,h:cd};if(w==='t')return{x:d.x+d.w/2-cw/2+off,y:d.y+d.h+2,w:cw,h:cd};
  if(w==='l')return{x:d.x+d.w+2,y:d.y+d.h/2-cw/2+off,w:cd,h:cw};return{x:d.x-cd-2,y:d.y+d.h/2-cw/2+off,w:cd,h:cw}}
function rugAround(room,rug,box,m){if(!rug||!box)return null;const {W,D}=room;m=m||4;const L=Math.max(rug.fw,rug.fd),S=Math.min(rug.fw,rug.fd);
  const along=box.w>=box.h;let rw=along?L:S,rh=along?S:L;if(rw>W-2*m||rh>D-2*m){[rw,rh]=[rh,rw]}if(rw>W-2*m||rh>D-2*m)return null;
  const cx=box.x+box.w/2,cy=box.y+box.h/2;return{x:Math.min(Math.max(m,cx-rw/2),W-m-rw),y:Math.min(Math.max(m,cy-rh/2),D-m-rh),w:rw,h:rh,under:2}}
function bbox(bs){bs=bs.filter(Boolean);if(!bs.length)return null;const x=Math.min(...bs.map(b=>b.x)),y=Math.min(...bs.map(b=>b.y));return{x,y,w:Math.max(...bs.map(b=>b.x+b.w))-x,h:Math.max(...bs.map(b=>b.y+b.h))-y}}
function blindFit(x,room){if(room.winWall==='none')return{ok:false,why:'אין חלון',bonus:0};const n=Math.ceil(room.winW/140),need=room.winW/n;if(x.fw<need-2)return{ok:false,why:'צר מהחלון',bonus:0};return{ok:true,why:'',bonus:-(x.fw-need)/10}}
const curtainQty=(x,room)=>{const fab=/זוג/.test(x.v)?x.fw*2:x.fw;return Math.max(1,Math.ceil(room.winW*1.8/fab))};
const WIN_WALL={sofa:'b',tv:'t',left:'l',right:'r'},OPP={b:'t',t:'b',l:'r',r:'l'};

function fitExtra(x,slot,sel,room){const t=room.type,{W,D}=room;let ok=true,why='',bonus=0;const lay=(k,v)=>layout(room,Object.assign({},sel,{[k]:v||{id:x.id}})).pos;
  if(t==='office')switch(slot){
    case 'desk':{if(!lay('desk').desk){ok=false;why='אין קיר פנוי עם 90 ס״מ לכיסא';break}
      const tg=room.space==='corner'?100:room.work==='gaming'?150:130;bonus-=Math.abs(x.fw-tg)/20;
      if(room.work!=='laptop'&&x.fd<60){bonus-=4;why='רדוד למסך (מומלץ 60+)'}if(room.work==='gaming'&&x.id===512)bonus+=2;if(room.work==='laptop'&&x.fw<=105)bonus+=1;break}
    case 'ochair':{if(STUDENT_CH.includes(x.id)||[527,529].includes(x.id)){bonus-=5;why='כיסא לילדים'}const dk=itemOf(sel,'desk',room);if(dk&&!dk.keep&&dk.fw<80&&x.fw>65)bonus-=1;if(room.work==='gaming'&&[515,517,522].includes(x.id))bonus+=1;break}
    case 'bookcase':{if(!lay('bookcase').bookcase){ok=false;why='אין קיר פנוי';break}if(room.space==='corner'&&x.fw>80)bonus-=2;break}
    case 'tlamp':{if(x.slot==='tasklamp')bonus+=6;break}
    case 'deskacc':{const mon=/מסך/.test(x.v),lap=/נייד/.test(x.v);if(room.work==='laptop')bonus+=lap?3:mon?-1:0;else bonus+=mon?2:0;if(room.work==='gaming'&&x.id===532)bonus+=2;if(x.id===538)bonus-=1;break}
    case 'pendant':{bonus-=Math.abs(x.fw-(W+D)/12)/7;break}
    case 'blind':return blindFit(x,room);
    case 'rug':{if(Math.min(x.fw,x.fd)>Math.min(W,D)-10||Math.max(x.fw,x.fd)>Math.max(W,D)-10){ok=false;why='גדול מהחדר';break}bonus-=Math.abs(x.fw-180)/40;break}
    case 'art':{const w=x.fw*artQty(x,120);if(w>140)bonus-=3;bonus-=Math.abs(w-80)/40;break}
  }
  else if(t==='kids'){const bed=itemOf(sel,'kbed',room);switch(slot){
    case 'kbed':{if(room.age==='toddler'&&LOFT.includes(x.id)){ok=false;why='מיטת גלריה — מגיל 6';break}
      if(room.age==='school'&&[556,557].includes(x.id)){ok=false;why='קטנה לגיל 6+';break}
      if(room.kids===2&&!BUNK.includes(x.id)){ok=false;why='לשני ילדים — מיטת קומתיים';break}
      if(room.kids===1&&BUNK.includes(x.id)){ok=false;why='מיטת קומתיים — לשני ילדים';break}
      if(!lay('kbed').kbed){ok=false;why='אין קיר פנוי באורך המיטה';break}
      if(room.age==='toddler'){if(JUNIOR.includes(x.id)||x.id===565)bonus+=2;if(BUNK.includes(x.id)&&room.kids===2){bonus-=2;why='קומה עליונה — מגיל 6'}}
      if(room.age==='school'&&room.kids===1&&LOFT.includes(x.id))bonus+=W*D<90000?2:-1;break}
    case 'kmattress':{const [bw,bl]=kNom(bed);if(x.slot==='mattress'&&x.fw>90){ok=false;why='מזרן זוגי';break}
      if(x.fw!==bw||x.fd!==bl){ok=false;why='לא בגודל המיטה';break}
      if(bed&&!bed.keep&&[555,566].includes(bed.id)&&x.slot!=='kmattress'){ok=false;why='למיטה מתארכת צריך מזרן מתקפל';break}
      if(bed&&!bed.keep&&(BUNK.includes(bed.id)||LOFT.includes(bed.id))&&/קפיצים/.test(x.v)){bonus-=2;why='עבה למיטת קומתיים'}if(x.slot==='kmattress')bonus+=1;break}
    case 'wardrobe':{if(!lay('wardrobe').wardrobe){ok=false;why='אין קיר פנוי עם מקום לפתיחה';break}bonus-=Math.abs(x.fw-(room.kids===2?117:80))/30;if(x.fw>150)bonus-=2;break}
    case 'kstorage':{if(x.fd>=25&&!lay('kstorage').kstorage){ok=false;why='אין מקום פנוי';break}if(room.age==='toddler'&&[571,572,573].includes(x.id))bonus+=1.5;if(room.age==='school'&&[574,575,576].includes(x.id))bonus+=1;break}
    case 'desk':{if(!lay('desk').desk){ok=false;why='אין קיר פנוי עם מקום לכיסא';break}bonus-=Math.abs(x.fw-(room.kids===2?120:100))/20;if(room.kids===2&&x.fw<118){ok=false;why='צר לשני ילדים';break}if(x.id===512)bonus-=4;break}
    case 'ktable':{if(!lay('ktable').ktable){ok=false;why='אין מקום פנוי';break}break}
    case 'kchair':{if(!(room.age==='school'?STUDENT_CH:TODDLER_CH).includes(x.id)){ok=false;why=room.age==='school'?'לא כיסא תלמיד':'לא בגובה שולחן ילדים'}break}
    case 'klamp':{if(room.age==='toddler'&&[596,601].includes(x.id))bonus+=1;break}
    case 'pendant':{bonus-=Math.abs(x.fw-(W+D)/12)/7;break}
    case 'curtain':{if(room.winWall==='none'){ok=false;why='אין חלון';break}if(/האפלה|מחשיך/.test(x.v))bonus+=1.5;break}
    case 'krug':{if(Math.max(x.fw,x.fd)>Math.max(W,D)-60||Math.min(x.fw,x.fd)>Math.min(W,D)-60){ok=false;why='גדול לחדר';break}if(W*D>=80000&&x.fw>=130)bonus+=1;break}
    case 'duvet':{if(x.fw>=200){ok=false;why='גדול למיטת יחיד'}break}
    case 'ktextile':{if(x.id===611&&bed&&!bed.keep&&(BUNK.includes(bed.id)||LOFT.includes(bed.id)))bonus-=2;break}
    case 'art':{bonus-=Math.abs(x.fw-60)/40;break}
  }}
  else if(t==='balcony')switch(slot){
    case 'osofa':{if(!lay('osofa').osofa){ok=false;why='אין מקום בלי לחסום את המעבר';break}if(D-x.fd<80)bonus-=D-x.fd<70?6:2;bonus-=Math.abs(x.fw-Math.min(W*0.5,160))/40;if(room.bSeats>=4&&x.fw>=150)bonus+=1;break}
    case 'otable':{const dine=room.bUses.has('dine'),low=[632,633].includes(x.id);if(dine&&low){ok=false;why='נמוך לארוחות';break}
      if(!lay('otable').otable){ok=false;why='אין מקום פנוי';break}
      if(dine){if(tableSeats(x)<room.bSeats){bonus-=4;why='פחות מ-'+room.bSeats+' מקומות'}}else{if(itemOf(sel,'osofa',room)&&low)bonus+=2;if(x.fw>110)bonus-=2}
      if(D<120&&[629,631].includes(x.id))bonus+=2;break}
    case 'bchair':{const n=qtyExtra('bchair',x,sel,room);const P2=lay('bchair',{id:x.id,qty:n});if(Object.keys(P2).filter(k=>baseKey(k)==='bchair').length<n){ok=false;why='אין מקום ל-'+n+' כיסאות';break}
      const dine=room.bUses.has('dine'),lounge=[620,626].includes(x.id);if(dine&&lounge){bonus-=3;why='נמוך לשולחן אוכל'}if(!dine&&lounge)bonus+=1;if(D<120&&/מתקפל/.test(x.v))bonus+=1.5;break}
    case 'lounger':{if(!lay('lounger').lounger){ok=false;why='אין מקום באורך 2 מטר'}break}
    case 'ostorage':{if(!lay('ostorage').ostorage){ok=false;why='אין מקום פנוי'}break}
    case 'orug':{const L=Math.max(x.fw,x.fd),S=Math.min(x.fw,x.fd);if(!((L<=W-8&&S<=D-8)||(S<=W-8&&L<=D-8))){ok=false;why='גדול מהמרפסת';break}bonus-=Math.abs(L*S-W*D*0.45)/8000;break}
    case 'ocushion':{const c=itemOf(sel,'bchair',room);if(c){if(x.fw!==(c.fw<48?44:50))bonus-=1.5}break}
    case 'olight2':{const a=itemOf(sel,'olight',room);if(a&&a.id===x.id)bonus-=20;if(a&&/שרשרת/.test(a.v)===/שרשרת/.test(x.v))bonus-=2;break}
    case 'opot':{if(room.bUses.has('plants')&&x.id===657)bonus+=1;break}
  }
  if(t==='tvwall')switch(slot){
    case 'tvunit':{const u=tvUnit(x,room),tv=tvDims(room);
      if(u.w>W-8){ok=false;why='רחב מהקיר';break}
      if(u.w-u.tallW<tv.w+8){ok=false;why='קצר למסך '+room.tvIn+'״';break}
      const sf=(u.wall?WALL_BOT:0)+u.surf,bot=room.tvMount==='stand'?sf+3:sf+TV_GAP,top=bot+tv.h,hc=bot+tv.h/2;
      if(top>D-22){ok=false;why='המסך יגיע כמעט עד התקרה';break}
      const gg=tvGeom(room,Object.assign({},sel,{tvunit:{id:x.id}}));if(gg.tvX<2||gg.tvX+tv.w>W-2){ok=false;why='המסך לא נכנס על הקיר';break}
      bonus-=Math.max(0,hc-125)/5;bonus-=Math.max(0,92-hc)/8;
      const tg=Math.min(Math.max(tv.w*1.45,tv.w+24),W*0.8);bonus-=Math.abs(u.w-tg)/22;
      if(u.wall&&room.renter){bonus-=5;why='תלייה על הקיר (קידוח)'}
      break}
    case 'shelf':{const q=qtyExtra('shelf',x,sel,room);const P2=lay('shelf',{id:x.id,qty:q});const n=Object.keys(P2).filter(k=>baseKey(k)==='shelf').length;if(n<1){ok=false;why='אין מקום על הקיר';break}if(n<q)bonus-=1;if(room.renter)bonus-=0.5;bonus-=Math.abs(x.fw*q-130)/60;break}
    case 'wlight':{if(room.renter&&WIRED.includes(x.id)){ok=false;why='דורשת חיבור חשמלאי';break}const P2=lay('wlight',{id:x.id,qty:2});if(!Object.keys(P2).some(k=>baseKey(k)==='wlight')){ok=false;why='אין מקום ליד המסך'}break}
    case 'cable':{if(x.id===728)bonus+=2;break}
    case 'floor':case 'plant':{if(!lay(slot)[slot]){ok=false;why='אין מקום ליד המזנון'}break}
    case 'vase':case 'candle':{if(!lay(slot)[slot]){ok=false;why='אין מקום על המזנון ליד המסך'}break}
    case 'art':{const q=artQty(x,tvDims(room).w);const P2=lay('art',{id:x.id,qty:q});if(!P2.art){ok=false;why='אין קיר פנוי ליד המסך';break}bonus-=Math.abs(x.fw-60)/40;break}
  }
  return{ok,why,bonus}}

function qtyExtra(slot,x,sel,room){const t=room.type;
  if(t==='tvwall'){if(slot==='shelf')return x.fw<=70?2:1;if(slot==='art')return artQty(x,tvDims(room).w);
    if(slot==='wlight'){const g=tvGeom(room,sel);if(!g)return 1;const l=g.tvX,r=room.W-(g.tvX+g.tv.w);return l>=34&&r>=34?2:1}return 1}
  if(t==='office')return slot==='blind'?Math.ceil(room.winW/140):1;
  if(t==='kids'){if(slot==='kmattress'){const b=itemOf(sel,'kbed',room);return b&&!b.keep&&BUNK.includes(b.id)?2:1}
    if(slot==='kchair')return room.age==='toddler'?2:room.kids;if(slot==='duvet')return room.kids;if(slot==='curtain')return curtainQty(x,room);return 1}
  if(t==='balcony'){if(slot==='bchair')return Math.min(6,seatsLeft(room,sel));if(slot==='ocushion'){const e=sel.bchair;return e?(e.qty||1):1}
    if(slot==='deck')return Math.ceil(room.W*room.D/8100);if(slot==='opot')return x.fw>60?1:room.bUses.has('plants')?3:2;return 1}
  return 1}

function layoutOffice(room,sel){const P={},notes=[],fixed=[];const it=k=>itemOf(sel,k,room);
  const dk=it('desk'),ch=it('ochair'),bc=it('bookcase'),plant=it('plant');
  if(dk){const o=placeFree(room,P,[],wallSpots(room,dk.fw,dk.fd,90,['b','l','r','t']));if(o){P.desk=o;if(ch)P.ochair=chairBy(o,Math.min(ch.fw,70),Math.min(ch.fd,70))}}
  if(bc){const o=placeFree(room,P,[],wallSpots(room,bc.fw,bc.fd,50,['l','r','t','b']));if(o)P.bookcase=o}
  const rg=rugAround(room,it('rug'),P.ochair?bbox([P.ochair,P.desk]):null);if(rg)P.rug=rg;
  if(plant){const s=plant.fw||40;const o=placeFree(room,P,[],[...wallSpots(room,s,s,0,['t','b','l','r'])].map(b=>Object.assign(b,{round:1})));if(o)P.plant=o}
  return{pos:P,notes,fixed}}

function layoutKids(room,sel){const {W,D}=room;const P={},notes=[],fixed=[];const it=k=>itemOf(sel,k,room);
  const bed=it('kbed');if(bed){const L=Math.max(bed.fw,bed.fd),S=Math.min(bed.fw,bed.fd);const o=placeFree(room,P,[],wallSpots(room,L,S,45,['b','l','r','t']));if(o)P.kbed=o}
  const wd=it('wardrobe');if(wd){const cl=wd.keep?70:[236,241].includes(wd.id)?55:Math.min(90,Math.max(60,wd.fw/(/3 דלתות/.test(wd.v)?3:2)+20));const o=placeFree(room,P,[],wallSpots(room,wd.fw,wd.fd,cl,['t','l','r','b']));if(o)P.wardrobe=o}
  const ks=it('kstorage');if(ks&&(ks.keep||ks.fd>=25)){const o=placeFree(room,P,[],wallSpots(room,ks.fw,ks.fd,50,['l','r','t','b']));if(o)P.kstorage=o}
  const n=(sel.kchair&&sel.kchair.qty)||1;const chs=it('kchair');
  const dk=it('desk');if(dk){const o=placeFree(room,P,[],wallSpots(room,dk.fw,dk.fd,85,['t','l','r','b']));if(o){P.desk=o;if(chs){const off=n>1?dk.fw/4:0;P.kchair=chairBy(o,chs.fw,chs.fd,-off);if(n>1)P.kchair_1=chairBy(o,chs.fw,chs.fd,off)}}}
  const kt=it('ktable');if(kt){const tw=kt.id===580?95:kt.fw,th=kt.id===580?70:kt.fd,withCh=kt.id!==580&&chs,ext=kt.id!==580?42:0;
    const a=placeFree(room,P,[],wallSpots(room,tw+2*ext,th,45,['t','l','r','b']));
    if(a){const hor=!a.rot;P.ktable=hor?{x:a.x+ext,y:a.y,w:tw,h:th,round:kt.id===581}:{x:a.x,y:a.y+ext,w:th,h:tw,round:kt.id===581};P.ktable.cl=a.cl;
      if(withCh){const cw=chs.fw,cd=chs.fd;const c1=hor?{x:a.x,y:a.y+th/2-cw/2,w:cd,h:cw}:{x:a.x+th/2-cw/2,y:a.y,w:cw,h:cd};const c2=hor?{x:a.x+a.w-cd,y:c1.y,w:cd,h:cw}:{x:c1.x,y:a.y+a.h-cd,w:cw,h:cd};if(!hor){c1.x=a.x+a.w/2-cw/2;c2.x=c1.x}P.kchair=c1;if(n>1)P.kchair_1=c2}}}
  const rug=it('krug');if(rug){const r=rugAround(room,rug,{x:W*0.3,y:D*0.3,w:W*0.4,h:D*0.4},20);if(r)P.krug=r}
  return{pos:P,notes,fixed}}

function layoutBalcony(room,sel){const {W,D}=room;const P={},notes=[],fixed=[];const it=k=>itemOf(sel,k,room);
  const dB=doorBox(room);let corr=null;if(dB){const left=dB.x<W/2;corr={x:left?0:W-90,y:0,w:90,h:D,label:'מעבר',zone:1};fixed.push(corr)}const ex=corr?[corr]:[];
  const so=it('osofa'),tb=it('otable'),ch=it('bchair'),lo=it('lounger'),st=it('ostorage');
  if(so){const o=placeFree(room,P,ex,farFrom(wallSpots(room,so.fw,so.fd,0,['b','l','r']),dB));if(o)P.osofa=o}
  if(tb){const tw=tb.fw,th=tb.fd;let c=[];const s=P.osofa;
    if(s){const g=so.fd<=45?6:30;if(s.wall==='b')c.push({x:s.x+s.w/2-tw/2,y:s.y-g-th,w:tw,h:th});if(s.wall==='l')c.push({x:s.x+s.w+g,y:s.y+s.h/2-tw/2,w:th,h:tw});if(s.wall==='r')c.push({x:s.x-g-th,y:s.y+s.h/2-tw/2,w:th,h:tw})}
    const mids=[0.5,0.3,0.7,0.15,0.85].map(f=>({x:(W-tw)*f,y:(D-th)/2,w:tw,h:th,wall:'m'}));
    c=c.concat(D<130?farFrom(wallSpots(room,tw,th,0,['t']),dB).concat(farFrom(mids,dB)):farFrom(mids,dB).concat(farFrom(wallSpots(room,tw,th,0,['t']),dB)));
    const o=placeFree(room,P,ex,c);if(o)P.otable=o}
  if(ch){const n=(sel.bchair&&sel.bchair.qty)||seatsLeft(room,sel)||1;const cw=Math.max(ch.fw,36),cd=Math.max(ch.fd,40);const t=P.otable;let c=[];
    if(t){const two=t.w>=2*cw+8;const xs=two?[t.x+t.w/4-cw/2,t.x+3*t.w/4-cw/2]:[t.x+t.w/2-cw/2];
      for(const x of xs)c.push({x,y:t.y-cd-4,w:cw,h:cd});if(!P.osofa)for(const x of xs)c.push({x,y:t.y+t.h+4,w:cw,h:cd});
      c.push({x:t.x-cd-4,y:t.y+t.h/2-cw/2,w:cd,h:cw},{x:t.x+t.w+4,y:t.y+t.h/2-cw/2,w:cd,h:cw})}
    c=c.concat(farFrom(wallSpots(room,cw,cd,0,['b','l','r']),dB));
    let k=0;for(const b of c){if(k>=n)break;if(placeFree(room,P,ex,[b])){P[k?'bchair_'+k:'bchair']=b;k++}}}
  if(lo){const L=Math.max(lo.fw,lo.fd),S=Math.min(lo.fw,lo.fd);const o=placeFree(room,P,ex,farFrom(wallSpots(room,L,S,0,['t','l','r','b']),dB));if(o)P.lounger=o}
  if(st){const o=placeFree(room,P,ex,farFrom(wallSpots(room,st.fw,st.fd,40,['l','r','b']),dB));if(o)P.ostorage=o}
  const seat=bbox(['osofa','otable','bchair','bchair_1','bchair_2','bchair_3'].map(k=>P[k]));const rg=rugAround(room,it('orug'),seat);if(rg&&!(corr&&overlap(rg,corr)&&rg.w>W-80))P.orug=rg;
  return{pos:P,notes,fixed,corr}}

function checksOffice(c,room,L){const P=L.pos,out=[];const {W,D}=room;const it=k=>itemOf(c.sel,k,room);const dk=it('desk'),ch=it('ochair');
  if(!dk){out.push(['bad','אין שולחן בעיצוב.']);return out}
  if(!P.desk){out.push(['bad','אין קיר פנוי לשולחן עם 90 ס״מ לכיסא.']);return out}
  const d=P.desk;const back=Math.round(d.wall==='b'?d.y:d.wall==='t'?D-d.y-d.h:d.wall==='l'?W-d.x-d.w:d.x);
  out.push(back>=100?['ok','מאחורי השולחן נשארים '+back+' ס״מ — מקום לכיסא ולמעבר.']:['warn','מאחורי השולחן '+back+' ס״מ — מספיק לכיסא, המעבר צר.']);
  if(d.wall!=='b')out.push(['ok','השולחן עבר ל'+(d.wall==='t'?'קיר ממול':'קיר הצד')+' — שם יש מקום לכיסא.']);
  if(room.work!=='laptop')out.push(dk.fd>=60?['ok','עומק השולחן '+dk.fd+' ס״מ — המסך במרחק זרוע (50–70 ס״מ).']:['warn','עומק השולחן '+dk.fd+' ס״מ — המסך קרוב מדי לעיניים. עדיף שולחן בעומק 60+.']);
  if(ch&&!ch.keep&&(STUDENT_CH.includes(ch.id)||[527,529].includes(ch.id)))out.push(['warn','נבחר כיסא תלמיד — למבוגר עדיף כיסא משרדי עם כוונון.']);
  if(room.winWall!=='none'){const ww=WIN_WALL[room.winWall];out.push(ww===d.wall?['warn','החלון מול העיניים — סנוור ביום. וילון מסנן עוזר.']:ww===OPP[d.wall]?['warn','החלון מאחורי הגב — השתקפות על המסך. וילון, או שולחן על קיר הצד.']:['ok','האור מגיע מהצד — המיקום הכי טוב לעבודה מול מסך.'])}
  out.push(['ok','ארגונומיה: מרפקים בגובה השולחן, קצה המסך העליון בגובה העיניים, כפות רגליים על הרצפה.']);
  if(c.sel.bookcase&&!c.sel.bookcase.keep)out.push(P.bookcase?['ok','הספרייה על קיר פנוי עם גישה נוחה. לעגן לקיר.']:['bad','אין קיר פנוי לספרייה.']);
  if(room.space==='corner')out.push(c.sel.tlamp?['ok','מנורת שולחן — אור עבודה ממוקד, בצד הנגדי ליד הכותבת.']:['warn','אין מנורת שולחן — בפינת עבודה זה מקור האור העיקרי.']);else lightCheck(c,out,['tlamp','pendant'],2);
  return out}
function playArea(room,P){const {W,D}=room;const bx=boxesOf(P);let n=0;for(let x=5;x<W;x+=10)for(let y=5;y<D;y+=10)if(!bx.some(b=>x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h))n++;return n/100}
function checksKids(c,room,L){const P=L.pos,out=[];const it=k=>itemOf(c.sel,k,room);const bed=it('kbed');
  if(!bed){out.push(['bad','אין מיטה בעיצוב.']);return out}
  out.push(P.kbed?['ok','המיטה לאורך הקיר — מרכז החדר נשאר פנוי.']:['bad','אין קיר פנוי באורך המיטה.']);
  const m=it('kmattress');if(m&&!m.keep&&!bed.keep){const [bw,bl]=kNom(bed);out.push(m.fw===bw&&m.fd===bl?['ok','המזרן '+m.fw+'x'+m.fd+' מתאים למיטה'+((c.sel.kmattress.qty||1)>1?' (×2, לשתי הקומות).':'.')]:['bad','המזרן לא בגודל המיטה.'])}
  if(!bed.keep&&(BUNK.includes(bed.id)||LOFT.includes(bed.id)))out.push(['warn','בקומה העליונה — מגיל 6 בלבד. מזרן דק (עד 16 ס״מ) כדי שהמעקה יישאר גבוה מספיק.']);
  if(!bed.keep&&[555,566].includes(bed.id))out.push(['ok','מיטה מתארכת — גדלה עם הילד עד 200 ס״מ.']);
  const free=playArea(room,P);out.push(free>=2?['ok','שטח פנוי למשחק: כ-'+free.toFixed(1)+' מ״ר.']:free>=1?['warn','שטח פנוי למשחק: רק כ-'+free.toFixed(1)+' מ״ר.']:['bad','כמעט אין רצפה פנויה למשחק.']);
  if(c.sel.wardrobe&&!c.sel.wardrobe.keep&&!P.wardrobe)out.push(['bad','אין קיר פנוי לארון.']);
  if(c.sel.desk&&!c.sel.desk.keep)out.push(P.desk?['ok','שולחן הכתיבה על קיר, עם מקום לכיסא.']:['bad','אין מקום לשולחן כתיבה.']);
  if(['wardrobe','kstorage'].some(k=>c.sel[k]&&!c.sel[k].keep))out.push(['warn','בטיחות: לעגן לקיר את הארון והשידות — ערכת העיגון באריזה. רהיט לא מעוגן יכול ליפול על ילד שמטפס.']);
  if(room.winWall!=='none'&&P.kbed&&P.kbed.wall===WIN_WALL[room.winWall])out.push(['warn','המיטה צמודה לקיר החלון — ודאו שיש מעצור לחלון ושאין חוטי וילון בהישג יד.']);
  if(room.age==='toddler')out.push(['ok','בגיל הזה: אחסון נמוך שהילד מגיע אליו לבד, ומגיני שקעים ופינות.']);
  lightCheck(c,out,['pendant','klamp','tlamp'],2);return out}
function checksBalcony(c,room,L){const P=L.pos,out=[];const {W,D}=room;const it=k=>itemOf(c.sel,k,room);
  if(L.corr&&!boxesOf(P).some(b=>overlap(b,L.corr)))out.push(['ok','מעבר חופשי של 90 ס״מ מהדלת עד המעקה.']);
  const so=it('osofa');const nCh=Object.keys(P).filter(k=>baseKey(k)==='bchair').length;const seats=(so&&P.osofa?sofaSeats(so):0)+nCh;
  out.push(seats>=room.bSeats?['ok','מקומות ישיבה: '+seats+' (ביקשתם '+room.bSeats+').']:['warn','מקומות ישיבה: '+seats+' בלבד (ביקשתם '+room.bSeats+').']);
  if(D<110)out.push(['warn','מרפסת צרה ('+D+' ס״מ) — עדיפים רהיטים מתקפלים ושולחן צמוד למעקה.']);
  const rail=Object.entries(P).filter(([k,b])=>b&&!b.under&&b.y<25&&['osofa','bchair','ostorage'].includes(baseKey(k)));
  if(rail.length)out.push(['warn','בטיחות: '+[...new Set(rail.map(([k])=>SLOTDEF('balcony')[baseKey(k)].he))].join(', ')+' ליד המעקה — ילד יכול לטפס. אם יש ילדים, להרחיק לפחות 30 ס״מ.']);
  if(room.dir==='s'||room.dir==='w')out.push(['warn','מרפסת '+(room.dir==='s'?'דרומית':'מערבית')+' — שמש חזקה אחה״צ: כריות להכניס פנימה, ועדיף הצללה (סוכך או שמשייה).']);
  if(c.sel.deck){const q=c.sel.deck.qty||1;out.push(['ok','ריצוף RUNNEN: '+q+' אריזות ('+(q*0.81).toFixed(1)+' מ״ר) ל-'+(W*D/10000).toFixed(1)+' מ״ר — נכנס בלחיצה, בלי כלים ובלי לפגוע בריצוף הקיים.'])}
  if([so,it('otable'),it('bchair')].some(x=>x&&!x.keep&&/חום/.test(x.v)))out.push(['ok','עץ שיטה: שמן לעץ חוץ פעם בשנה, וכיסוי בחורף.']);
  const lt=['olight','olight2'].map(k=>c.sel[k]&&BY[c.sel[k].id]).filter(Boolean);if(lt.length)out.push(['ok','תאורה בלי חשמל'+(lt.some(x=>/סולארי/.test(x.v))?' — הסולארית צריכה כמה שעות שמש ביום.':'.')]);
  return out}


// ================= TV wall (front elevation: x along the wall, y down from the ceiling) =================
const TV_GAP=15,WALL_BOT=40;
const TVU={700:{surf:54,tallW:95,side:'l'},701:{surf:53,tallW:80,side:'r'}};
const WIRED=[734,735,736,737,738,739,740];
function tvDims(room){const d=room.tvIn||55;return{w:Math.round(d*2.2138+2),h:Math.round(d*1.2452+2)}}
function tvUnit(x,room){if(!x)return null;
  if(x.keep){const k=room.keptUnit||{fw:160,h:50};return{w:k.fw,d:40,h:k.h,surf:k.h,wall:false,tallW:0,side:'l'}}
  const t=TVU[x.id]||{};return{w:x.fw,d:x.fd,h:x.h||50,surf:t.surf||x.h||50,wall:!!x.wall,tallW:t.tallW||0,side:t.side||'l'}}
function tvGeom(room,sel){const {W}=room;const tv=tvDims(room),u=tvUnit(itemOf(sel,'tvunit',room),room);if(!u)return null;
  const ux=Math.max(4,Math.min(W-u.w-4,room.tvPos==='left'?16:room.tvPos==='right'?W-u.w-16:(W-u.w)/2));
  const lowW=u.w-u.tallW,lowX=u.side==='l'?ux+u.tallW:ux,cx=lowX+lowW/2;
  const base=u.wall?WALL_BOT:0,surf=base+u.surf,tvBot=room.tvMount==='stand'?surf+3:surf+TV_GAP,tvTop=tvBot+tv.h;
  return{u,tv,ux,lowX,lowW,cx,base,surf,tvBot,tvTop,hc:tvBot+tv.h/2,tvX:cx-tv.w/2}}
function layoutTvwall(room,sel){
  const {W,D}=room;const P={},notes=[],fixed=[],marks=[];const it=k=>itemOf(sel,k,room);
  const g=tvGeom(room,sel);if(!g)return{pos:P,notes,fixed,marks};
  const {u,tv}=g,Y=h=>D-h,tvL=g.tvX,tvR=g.tvX+tv.w;
  if(u.tallW){P.tvunit={x:g.lowX,y:Y(g.base+u.surf),w:g.lowW,h:u.surf};P.tvunit_2={x:u.side==='l'?g.ux:g.ux+g.lowW,y:D-g.base-u.h,w:u.tallW,h:u.h}}
  else P.tvunit={x:g.ux,y:D-g.base-u.h,w:u.w,h:u.h};
  fixed.push({x:tvL,y:Y(g.tvTop),w:tv.w,h:tv.h,label:'טלוויזיה '+room.tvIn+'״',dark:1});
  marks.push({y:Y(g.hc),val:Math.round(g.hc)});
  const taken=()=>[...Object.values(P).filter(b=>b&&typeof b==='object'),...fixed];
  const free=(b,minY)=>inRoom(b,room)&&b.y>=(minY||0)&&!taken().some(o=>overlap(b,o));
  // shelves
  const sh=it('shelf');if(sh&&!sh.keep){const n=Math.max(1,(sel.shelf&&sel.shelf.qty)||qtyExtra('shelf',sh,sel,room)),L=sh.fw,T=6;
    const yA=Y(g.tvTop+30)-T,yB=Y(g.hc+8);
    const A1={x:g.cx-L-6,y:yA,w:L,h:T},A2={x:g.cx+6,y:yA,w:L,h:T},AC={x:g.cx-L/2,y:yA,w:L,h:T},B1={x:tvL-22-L,y:yB,w:L,h:T},B2={x:tvR+22,y:yB,w:L,h:T};
    if(n>=2){if(free(A1,16)&&free(A2,16)){P.shelf=A1;P.shelf_2=A2}else if(free(B1,16)&&free(B2,16)){P.shelf=B1;P.shelf_2=B2}
      else{let k=0;for(const b of [A1,A2,B1,B2]){if(k<n&&free(b,16)){P[k?'shelf_2':'shelf']=b;k++}}if(k<n)notes.push('אין מקום לשני מדפים — נכנס מדף אחד.')}}
    else{const b=[AC,B1,B2].find(b=>free(b,16));if(b)P.shelf=b;else notes.push('אין מקום למדף על הקיר.')}}
  // wall lights beside the TV
  const wl=it('wlight');if(wl){const n=(sel.wlight&&sel.wlight.qty)||qtyExtra('wlight',wl,sel,room);const hs=[152,168,136,176];
    const tryS=(x,key)=>{for(const hh of hs){const b={x,y:Y(hh)-13,w:14,h:26};if(free(b,8)){P[key]=b;return true}}return false};
    const L1=tvL-20-14,R1=tvR+20;const order=n>=2?[[L1,'wlight'],[R1,'wlight_2']]:(tvL>=W-tvR?[[L1,'wlight']]:[[R1,'wlight']]);
    for(const [x,k] of order)tryS(x,k)}
  // things standing on the unit
  const topY=P.tvunit.y,spL=tvL-g.lowX,spR=g.lowX+g.lowW-tvR;
  const vase=it('vase');if(vase&&!vase.keep){const m=String(vase.n+' '+vase.v).match(/(\d+)\s*ס"מ/),h=m?Math.min(40,+m[1]):20,w=Math.max(9,Math.min(16,Math.round(h*0.5))),c=[];if(spL>=w+6)c.push({x:g.lowX+3,y:topY-h,w,h});if(spR>=w+6)c.push({x:g.lowX+g.lowW-w-3,y:topY-h,w,h});const o=c.find(b=>free(b));if(o)P.vase=o}
  const can=it('candle');if(can&&!can.keep){const w=22,h=12,c=[];if(spR>=w+6)c.push({x:g.lowX+g.lowW-w-3,y:topY-h,w,h});if(spL>=w+6)c.push({x:g.lowX+3,y:topY-h,w,h});const o=c.find(b=>free(b));if(o)P.candle=o}
  // floor lamp and plant beside the unit
  for(const [k,h] of [['floor',150],['plant',100]]){const x=it(k);if(!x||x.keep)continue;const w=Math.max(20,x.fw||30);
    const c=[{x:g.ux-w-8,y:Y(h),w,h},{x:g.ux+u.w+8,y:Y(h),w,h},{x:6,y:Y(h),w,h},{x:W-w-6,y:Y(h),w,h}];const o=c.find(b=>free(b));if(o)P[k]=o;else notes.push('אין מקום פנוי ל'+SLOTDEF('tvwall')[k].he+' ליד המזנון.')}
  // pictures beside the TV
  const ar=it('art');if(ar&&!ar.keep){const q=(sel.art&&sel.art.qty)||qtyExtra('art',ar,sel,room);const m=String(ar.v).match(/(\d+)x(\d+)/),aw=ar.fw,ah=m?+m[2]:60;
    const hs=[g.hc+22,g.hc+42,g.hc,g.hc+62];const lw=[P.wlight,P.wlight_2].filter(Boolean);
    const xsL=[tvL-18-aw].concat(lw.filter(b=>b.x<tvL).map(b=>b.x-10-aw)),xsR=[tvR+18].concat(lw.filter(b=>b.x>=tvR).map(b=>b.x+b.w+10));
    const order=q>=2?[[xsL,'art'],[xsR,'art_2']]:(tvL>=W-tvR?[[xsL,'art']]:[[xsR,'art']]);
    for(const [xs,k] of order){let done=false;for(const x of xs){for(const hh of hs){const b={x,y:Y(hh)-ah/2,w:aw,h:ah};if(free(b,8)){P[k]=b;done=true;break}}if(done)break}}
    if(!P.art)notes.push('אין קיר פנוי לתמונה ליד המסך.')}
  return{pos:P,notes,fixed,marks}}
function checksTvwall(c,room,L){const P=L.pos,out=[];const {W,D}=room;const it=k=>itemOf(c.sel,k,room);const un=it('tvunit');
  if(!un){out.push(['bad','אין בקטלוג מזנון שמתאים לקיר ברוחב '+W+' ס״מ עם טלוויזיה '+room.tvIn+'״ — צריך קיר רחב יותר, או מסך קטן יותר.']);return out}
  const g=tvGeom(room,c.sel),tv=g.tv,u=g.u;const sL=Math.round(g.ux),sR=Math.round(W-g.ux-u.w);
  out.push(['ok','המזנון ('+u.w+' ס״מ) נכנס לקיר של '+W+' ס״מ ומשאיר '+sL+' ו-'+sR+' ס״מ בצדדים.']);
  out.push(g.lowW>=tv.w+8?['ok','טלוויזיה '+room.tvIn+'״ (רוחב כ-'+tv.w+' ס״מ) '+(room.tvMount==='wall'?(u.tallW?'תלויה מעל החלק הנמוך של המערכת':'תלויה מעל המזנון'):(u.tallW?'יושבת על החלק הנמוך של המערכת':'יושבת על המזנון'))+', עם כ-'+Math.round((g.lowW-tv.w)/2)+' ס״מ מכל צד.']:[room.tvMount==='wall'?'warn':'bad','הטלוויזיה ('+tv.w+' ס״מ) רחבה מהמזנון ('+Math.round(g.lowW)+' ס״מ)'+(room.tvMount==='wall'?' — תלויה על הקיר היא תעבוד, אבל המראה לא מאוזן. מזנון ברוחב '+Math.round(tv.w*1.3)+' ס״מ ומעלה יראה טוב יותר.':' — היא לא תעמוד עליו בבטחה.')]);
  const hc=Math.round(g.hc);
  out.push(hc>=90&&hc<=125?['ok','מרכז המסך בגובה '+hc+' ס״מ מהרצפה — בגובה העיניים בישיבה (90–125).']:hc>125?['warn','מרכז המסך בגובה '+hc+' ס״מ — גבוה לצפייה בישיבה (מומלץ עד 125). אפשר מזנון נמוך יותר.']:['warn','מרכז המסך בגובה '+hc+' ס״מ — נמוך מעט. אפשר להרים את הטלוויזיה או לבחור מזנון גבוה יותר.']);
  out.push(['ok','מרחק צפייה נכון למסך '+room.tvIn+'״: בין '+(room.tvIn*2.54*1.2/100).toFixed(1)+' ל-'+(room.tvIn*2.54*2/100).toFixed(1)+' מטר מהספה.']);
  const cab=it('cable');out.push(cab&&!cab.keep?['ok','כבלים: '+cab.n+' — מסדרים את הכבלים לאורך הקיר'+(room.tvMount==='wall'?', וכדאי להעביר אותם בצינור או בתעלה שנסגרת על הקיר.':'.')]:['warn','אין פתרון לכבלים — כבלים תלויים מתחת למסך שוברים את מראה הקיר.']);
  if(c.sel.bias&&!c.sel.bias.keep)out.push(['ok','פס לד מאחורי המסך, מחובר ל-USB של הטלוויזיה — מרכך את הניגוד ומפחית עייפות עיניים.']);
  const wl=it('wlight');if(wl){const n=Object.keys(P).filter(k=>baseKey(k)==='wlight').length;
    out.push(!n?['warn','לא נמצא מקום למנורות הקיר.']:WIRED.includes(wl.id)?['warn','מנורות הקיר מחווטות — צריך חשמלאי, או חיבור לנקודת חשמל קיימת.']:['ok','מנורות קיר עם כבל ושקע — בלי חשמלאי.'])}
  const aboveTv=b=>b&&b.y+b.h<=D-g.tvTop+1&&b.x<g.tvX+tv.w&&b.x+b.w>g.tvX;
  if(P.shelf)out.push(aboveTv(P.shelf)||aboveTv(P.shelf_2)?['ok','מדף מעל הטלוויזיה — להשאיר אותו עם חפצים קלים בלבד, כדי שלא יפול משהו על המסך. לעגן לקיר בדיבלים מתאימים.']:['ok','מדפים לצד המסך — לעגן לקיר בדיבלים מתאימים לסוג הקיר.']);
  if(room.renter&&(room.tvMount==='wall'||P.shelf||u.wall))out.push(['warn','תליית טלוויזיה, מדפים או מזנון על הקיר דורשת קידוח — כדאי לתאם עם בעל הדירה'+(room.tvMount==='wall'?', או להניח את הטלוויזיה על המזנון.':'.')]);
  lightCheck(c,out,['wlight','bias','floor'],2);
  return out}

// ================= checks =================
function checks(c,room){const L=layout(room,c.sel);const out=({living:checksLiving,bedroom:checksBedroom,kitchen:checksKitchen,bath:checksBath,office:checksOffice,kids:checksKids,balcony:checksBalcony,tvwall:checksTvwall})[room.type](c,room,L);
  const d=doorBox(room);if(d){const hit=Object.entries(L.pos).filter(([k,b])=>b&&typeof b==='object'&&!b.under&&k!=='rug'&&overlap(b,d)).map(([k])=>(SLOTDEF(room.type)[baseKey(k)]||{he:k}).he).concat((L.fixed||[]).filter(f=>!f.dark&&!f.zone&&overlap(f,d)).map(f=>f.label));out.push(hit.length?['bad','פתיחת הדלת נחסמת ע״י '+hit.join(', ')+'.']:['ok','אזור פתיחת הדלת פנוי.'])}
  const ks=Object.keys(L.pos).filter(k=>L.pos[k]&&typeof L.pos[k]==='object'&&!L.pos[k].under&&k!=='rug');const ov=[];for(let i=0;i<ks.length;i++)for(let j=i+1;j<ks.length;j++)if(overlap(L.pos[ks[i]],L.pos[ks[j]]))ov.push(ks[i]+'/'+ks[j]);
  for(const f of L.fixed||[])for(const k of ks)if(overlap(L.pos[k],f))ov.push(k+'/'+f.label);
  if(ov.length)out.push(['bad','חפיפה בתוכנית: '+ov.map(s=>s.split('/').map(k=>(SLOTDEF(room.type)[baseKey(k)]||{he:k}).he).join(' ו')).join(', ')+'.']);
  for(const n of L.notes)out.push(['warn',n]);paletteFitCheck(c,room,out);harmonyChecks(room,out);return{L,out}}
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
const LBL_TV={art:'תמונה',floor:'מנורה',plant:'צמח'};
const LBL={tvunit:'מזנון',sofa:'ספה',coffee:'שולחן',arm:'כורסה',pouf:'הדום',rug:'שטיח',bed:'מיטה',wardrobe:'ארון',dresser:'שידה',dtable:'שולחן',cart:'עגלה',kunit:'מטבחון',vanity:'כיור',tallcab:'ארון',bshelf:'מדפים',btrolley:'עגלה',bstool:'שרפרף',desk:'שולחן',ochair:'כיסא',bookcase:'מדפים',kbed:'מיטה',kstorage:'אחסון',ktable:'שולחן',kchair:'כיסא',osofa:'ספה',otable:'שולחן',bchair:'כיסא',lounger:'שיזוף',ostorage:'אחסון'};
function planSVG(c,room){
  const {L}=checks(c,room);const P=L.pos;const {W,D}=room;const m=26;const wall='var(--plan-wall)';const fnt='font-family="IBM Plex Sans Hebrew,Arial"';
  const itemFor=k=>{const base=baseKey(k);return itemOf(c.sel,base,room)};
  let s=`<svg viewBox="${-m} ${-m} ${W+2*m} ${D+2*m}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${room.type==='tvwall'?'חזית קיר הטלוויזיה בקנה מידה':'תוכנית קומה בקנה מידה'}"><defs><pattern id="g" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" fill="none" stroke="currentColor" stroke-opacity=".07" stroke-width=".6"/></pattern><pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0V6" stroke="currentColor" stroke-opacity=".25" stroke-width="2"/></pattern></defs><rect x="0" y="0" width="${W}" height="${D}" fill="url(#g)" style="color:var(--ink)"/>`;
  for(const f of L.fixed||[])if(f.zone)s+=`<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" fill="none" stroke="var(--ink)" stroke-opacity=".3" stroke-dasharray="5 4"/><text x="${f.x+f.w/2}" y="${f.y+f.h/2}" font-size="9" text-anchor="middle" fill="var(--muted)" ${fnt} transform="rotate(-90 ${f.x+f.w/2} ${f.y+f.h/2})">${esc(f.label)}</text>`;else s+=`<rect x="${f.x}" y="${f.y}" width="${f.w}" height="${Math.max(f.h,5)}" ${f.dark?'fill="var(--ink)" fill-opacity=".85"':'fill="url(#hatch)" stroke="var(--ink)" stroke-opacity=".35"'} style="color:var(--ink)"/>`+(f.h>=14&&f.w>=30?`<text x="${f.x+f.w/2}" y="${f.y+f.h/2+3}" font-size="9" text-anchor="middle" fill="${f.dark?'#fff':'var(--muted)'}" ${fnt}>${esc(f.label)}</text>`:`<text x="${f.x+f.w/2}" y="${f.y+Math.max(f.h,5)+11}" font-size="9" text-anchor="middle" fill="var(--muted)" ${fnt}>${esc(f.label)}</text>`);
  for(const m of L.marks||[])s+=`<line x1="0" y1="${m.y}" x2="${W}" y2="${m.y}" stroke="var(--ink)" stroke-opacity=".22" stroke-dasharray="4 4"/>`;
  const order=Object.keys(P).sort((a,b)=>(P[b].under||0)-(P[a].under||0));
  for(const k of order){const b=P[k];const x=itemFor(k);if(!b||!x||typeof b!=='object'||b.x===undefined)continue;const f=x.hex,tc=textOn(f);const isRug=/rug$/.test(k);
    s+=b.round?`<ellipse cx="${b.x+b.w/2}" cy="${b.y+b.h/2}" rx="${b.w/2}" ry="${b.h/2}" fill="${f}" stroke="${wall}" stroke-opacity=".55"/>`:`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="${isRug?2:5}" fill="${f}" ${isRug?'fill-opacity=".5"':''} stroke="${wall}" stroke-opacity="${isRug?.25:.55}" ${b.under===1?'stroke-dasharray="3 3" fill-opacity=".6"':''}/>`;
    if(b.cl)s+=`<rect x="${b.cl.x}" y="${b.cl.y}" width="${b.cl.w}" height="${b.cl.h}" fill="none" stroke="${wall}" stroke-opacity=".25" stroke-dasharray="2 3"/>`;
    const lb=(room.type==='tvwall'&&LBL_TV[baseKey(k)])||LBL[baseKey(k)];const fs=Math.max(7,Math.min(11,b.w/7));
    if(lb&&b.w>26&&b.h>14)s+=`<text x="${b.x+b.w/2}" y="${isRug?b.y+12:b.y+b.h/2+fs/3}" font-size="${fs}" text-anchor="middle" fill="${isRug?'var(--ink)':tc}" ${isRug?'fill-opacity=".6"':''} ${fnt}>${esc(lb)}${k==='sofa'||k==='bed'?' '+x.fw:''}</text>`}
  const pd=itemOf(c.sel,'pendant',room);if(pd){const anchor=P.coffee||P.dtable||P.bed||P.sofa;if(anchor){const cy=anchor===P.bed?P.bed.y+P.bed.h*0.4:anchor===P.sofa?P.sofa.y-50:anchor.y+anchor.h/2;s+=`<circle cx="${anchor.x+anchor.w/2}" cy="${cy}" r="${(pd.fw||40)/2}" fill="none" stroke="${wall}" stroke-opacity=".5" stroke-dasharray="4 3"/>`}}
  for(const m of L.marks||[])s+=`<text x="-8" y="${m.y+3}" font-size="9" text-anchor="end" direction="ltr" fill="var(--ink)" ${fnt}>${m.val}</text><path d="M-3 ${m.y} H4" stroke="var(--ink)" stroke-opacity=".6"/>`;
  s+=`<rect x="0" y="0" width="${W}" height="${D}" fill="none" stroke="${wall}" stroke-width="4"/>`;
  if(room.winWall!=='none'){const side=room.winWall==='left'||room.winWall==='right';const ww=Math.min(room.winW,side?D-20:W-20);let wx,wy,wW,wH;
    if(room.winWall==='sofa'){wx=W/2-ww/2;wy=D-2;wW=ww;wH=4}else if(room.winWall==='tv'){wx=W/2-ww/2;wy=-2;wW=ww;wH=4}else if(room.winWall==='left'){wx=-2;wy=D/2-ww/2;wW=4;wH=ww}else{wx=W-2;wy=D/2-ww/2;wW=4;wH=ww}
    const tx=room.winWall==='left'?-9:room.winWall==='right'?W+9:W/2,ty=room.winWall==='sofa'?D+16:room.winWall==='tv'?-9:D/2;
    s+=`<rect x="${wx}" y="${wy}" width="${wW}" height="${wH}" fill="#8fb7d6"/><text x="${tx}" y="${ty}" font-size="9" text-anchor="middle" fill="var(--muted)" ${fnt} ${side?`transform="rotate(-90 ${tx} ${ty})"`:''}>חלון ${room.winW}</text>`}
  const d=doorBox(room);if(d&&room.type==='balcony'){const l=room.door[1]==='l';const hx=l?5:W-5,ex=l?hx+80:hx-80;
    s+=`<line x1="${hx}" y1="${D}" x2="${ex}" y2="${D}" stroke="var(--plan-floor)" stroke-width="6"/><path d="M${hx} ${D} L${hx} ${D-80} A80 80 0 0 ${l?1:0} ${ex} ${D}" fill="var(--ink)" fill-opacity=".05" stroke="var(--ink)" stroke-opacity=".35" stroke-dasharray="3 3"/><text x="${(hx+ex)/2}" y="${D-10}" font-size="9" text-anchor="middle" fill="var(--muted)" ${fnt}>דלת</text>`}
  else if(d){const left=room.door[1]==='l';const hx=left?0:W;const y0=d.y,y1=d.y+80;
    s+=`<line x1="${hx}" y1="${y0}" x2="${hx}" y2="${y1}" stroke="var(--plan-floor)" stroke-width="6"/><path d="M${hx} ${y0} L${left?80:W-80} ${y0} A80 80 0 0 ${left?1:0} ${hx} ${y1}" fill="var(--ink)" fill-opacity=".05" stroke="var(--ink)" stroke-opacity=".35" stroke-dasharray="3 3"/><text x="${left?10:W-10}" y="${y0+44}" font-size="9" text-anchor="${left?'start':'end'}" fill="var(--muted)" ${fnt}>דלת</text>`}
  if(room.winWall!=='tv')s+=`<text x="${W/2}" y="-10" font-size="10" text-anchor="middle" fill="var(--muted)" ${fnt}>${W} ס״מ</text>`;
  if(room.type==='tvwall')s+=`<text x="${W+14}" y="${D/2}" font-size="10" text-anchor="middle" fill="var(--muted)" transform="rotate(90 ${W+14} ${D/2})" ${fnt}>גובה התקרה ${D} ס״מ</text>`;
  else if(room.winWall!=='left')s+=`<text x="-12" y="${D/2}" font-size="10" text-anchor="middle" fill="var(--muted)" transform="rotate(-90 -12 ${D/2})" ${fnt}>${D} ס״מ</text>`;
  return s+'</svg>';
}

// ================= app state / render =================
let ROOM=null,CONCEPTS=[],ACTIVE=0,sample=null,downloads=null,sampleImages=false;
function generateLocal(){ROOM=roomOf();const ss=chooseStyles(ROOM);ROOM.styleRank=Object.fromEntries(ss.map((k,i)=>[k,i]));CONCEPTS=ss.map(k=>localConcept(k,ROOM));ACTIVE=0;renderAll()}
function renderAll(){renderTabs();renderConcept()}
function renderTabs(){const el=$('#tabs');el.innerHTML='';CONCEPTS.forEach((c,i)=>{const st=STYLES[c.style];const b=document.createElement('button');b.className='tab';b.setAttribute('role','tab');b.setAttribute('aria-selected',String(i===ACTIVE));
  b.innerHTML=`<span class="tn">${esc(c.title||st.name)}</span><span class="td">${esc(st.designer)} · ${ils(totalOf(c.sel))}</span><span class="sw">${(ROOM&&ROOM.pal?palFor(c.style,ROOM).c:st.pal.map(p=>p[0])).map(h=>`<i style="background:${h}"></i>`).join('')}</span>`;b.onclick=()=>{ACTIVE=i;renderAll()};el.appendChild(b)})}
function renderConcept(){
  const c=CONCEPTS[ACTIVE];if(!c)return;const st=STYLES[c.style];const room=ROOM;const R=ROOMS[room.type];const tot=totalOf(c.sel);const over=tot>room.budget;const {out}=checks(c,room);
  $('#rhTitle').textContent='שלושה כיוונים ל'+R.he+' שלך';
  let h=`<h2 style="margin:0">${esc(c.title||st.name)}</h2><p class="designer">בהשראת ${esc(st.designer)} (${esc(st.city)})${c.src==='ai'?' · עוצב אישית ע״י Claude':c.src==='shared'?' · עיצוב ששותף איתך':''}</p><p class="why">${esc(c.why||st.idea)}</p>`;
  const up=room.pal?palFor(c.style,room):null;const barPal=up?up.c.map((hx,i)=>[hx,up.n[i],['60% בסיס','30% משני','10% הדגשה'][i]]):st.pal;
  h+=(up?`<p class="hint" style="margin:10px 0 6px">הפלטה שבחרת ('${esc(room.pal.he)}') בפרשנות של ${esc(st.designer)}: ${esc(PERM_NOTE[up.i])}</p>`:'')+`<div class="pal">${barPal.map(p=>`<div style="background:${p[0]};color:${textOn(p[0])};flex:${p[2].startsWith('60')?3:p[2].startsWith('30')?2:1}"><b>${esc(p[1])}</b>${esc(p[2])}</div>`).join('')}</div>${room.type==='tvwall'?'':`<p class="hint">${esc(DIR_NOTE[room.dir]||DIR_NOTE.u)}</p>`}`;
  h+=`<div class="total"><span class="muted small">סה״כ לקנייה${c.dropped&&c.dropped.length?' · ויתרנו על: '+c.dropped.map(k=>SLOTDEF(room.type)[k].he).join(', '):''}</span><b>${ils(tot)}</b></div><div class="bar${over?' over':''}"><i style="width:${Math.min(100,tot/room.budget*100)}%"></i></div><p class="hint">${over?'חורג מהתקציב ב-'+ils(tot-room.budget):'נשארים '+ils(room.budget-tot)+' מתוך '+ils(room.budget)}</p>`;
  if(over)h+=`<button class="btn sm ghost" id="fitB" style="margin-top:8px">התאם לתקציב</button>`;
  h+=`<div class="planbox">${planSVG(c,room)}</div><p class="hint">${room.type==='tvwall'?'חזית הקיר בקנה מידה (משבצת = 10 ס״מ), כפי שרואים אותו מהחדר: תקרה למעלה, רצפה למטה. הקו המקווקו מסמן את מרכז המסך — המספר בשוליים הוא גובהו מהרצפה בס״מ.':'תוכנית מלמעלה בקנה מידה (משבצת = 10 ס״מ).'} ${room.type==='tvwall'?'':esc(R.plan||((R.mainWall==='הספה'?'קיר הספה':R.mainWall==='ראש המיטה'?'קיר ראש המיטה':R.mainWall==='הכיור'?'קיר הכיור':'פינת האוכל')+' למטה.'))}</p>`;
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
  h+=`<div class="actions"><button class="btn" id="shareB">שיתוף העיצוב</button><button class="btn ghost" id="listB">רשימת קניות</button><button class="btn ghost" id="gemB">הדמיה ב-Gemini</button><button class="btn ghost" id="fbB">משוב</button></div><div class="ai" id="aiBox"></div>`;
  $('#concept').innerHTML=h;
  $('#concept').querySelectorAll('[data-swap]').forEach(b=>b.onclick=()=>openSwap(b.dataset.swap));
  const fb=$('#fitB');if(fb)fb.onclick=()=>{fitBudget(c,room);renderAll();toast('הותאם לתקציב')};
  $('#listB').onclick=()=>showText('רשימת קניות',listText(c),'העתקה');$('#shareB').onclick=()=>shareDesign(c);$('#fbB').onclick=()=>feedback(c);$('#gemB').onclick=()=>geminiSheet(c);refreshAi();
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
function revalidate(c,room,changed,quiet){
  for(const s of ROOMS[room.type].slots){if(s.k===changed)continue;
    if(s.on&&!s.on(room,c.sel)){c.sel[s.k]=null;continue}
    const e=c.sel[s.k];if(!e||e.keep)continue;const x=BY[e.id];
    if(!fitCheck(x,s.k,c.sel,room).ok){const cd=pick(s.k,c.style,room,Object.assign({},c.sel,{[s.k]:null}));c.sel[s.k]=cd?{id:cd.x.id,qty:qtyFor(s.k,cd.x,c.sel,room)}:null;if(!quiet)toast(s.he+' הוחלף/ה כדי שיתאים')}
    else c.sel[s.k].qty=qtyFor(s.k,x,c.sel,room)}
  if(changed==='kunit')for(const k of ['ksink','ktap']){const d=SLOTDEF(room.type)[k];if(d.on(room,c.sel)&&!c.sel[k]){const cd=pick(k,c.style,room,c.sel);c.sel[k]=cd?{id:cd.x.id,qty:1}:null}}
}
function openSheet(h){$('#sheet').innerHTML=h;$('#sheet').classList.add('on');$('#scrim').classList.add('on');const cb=$('#closeS');if(cb)cb.onclick=closeSheet}
function closeSheet(){$('#sheet').classList.remove('on');$('#scrim').classList.remove('on')}

// ================= list / Gemini =================
function listText(c){const st=STYLES[c.style];let t=`${ROOMS[ROOM.type].he} · ${c.title||st.name} — בהשראת ${st.designer}\n`;for(const s of activeSlots(ROOM,c.sel)){const e=c.sel[s.k];if(!e||e.keep||!BY[e.id])continue;const x=BY[e.id];t+=`• ${s.he}: ${x.n} — ${x.v}${(e.qty||1)>1?' ×'+e.qty:''} — ${ils(x.p*(e.qty||1))}\n  ${ikeaUrl(x)}\n`}return t+`סה״כ: ${ils(totalOf(c.sel))}`}
function geminiPrompt(c){const st=STYLES[c.style],room=ROOM,R=ROOMS[room.type];const keep=[...room.keep];const lines=[];let i=1;
  for(const s of activeSlots(room,c.sel)){const e=c.sel[s.k];if(!e||e.keep||!BY[e.id])continue;lines.push(`${i++}. ${BY[e.id].n} (${catName(s)}${(e.qty||1)>1?' x'+e.qty:''})`)}
  const place={living:`Place the sofa against the ${room.W} cm wall; keep a clear 60–90 cm walkway in front of it; rug under the sofa's front legs.`,bedroom:`Bed headboard centred on the ${room.W} cm wall, bedside tables on both sides, at least 60 cm to walk around the bed.`,kitchen:`Keep the existing kitchen cabinets${room.mode==='renovate'?' but replace the sink and tap with the ones listed':''}; place the dining table with at least 90 cm from the counter.`,bath:`Keep the existing toilet, shower/bath and tiles${room.mode==='renovate'?'; replace the vanity and mirror with the ones listed':''}.`,office:`Desk against the ${room.W} cm wall with the chair in front of it, about 90 cm free behind the chair; task lamp on the desk.`,kids:`A child's room: bed along a wall, a clear play area in the middle of the floor, storage low and reachable.`,balcony:`This is an outdoor balcony: house wall with the door at the bottom, railing opposite. Keep a clear 70 cm path from the door. Outdoor furniture only.`,tvwall:`This is ONE feature wall seen straight on: the TV unit centred under the ${room.tvIn}-inch TV (${room.tvMount==='wall'?'wall-mounted':'standing on the unit'}), shelves and wall lights beside or above the TV, a picture and a plant beside the unit, cables hidden. Keep the existing TV; do not move the walls, windows or sockets.`}[room.type];
  return `Edit the attached ${R.en} photo. Keep the exact camera angle, perspective, walls, window, floor, ceiling and daylight. ${keep.length?'Keep the existing '+keep.join(', ')+'.':'Remove the existing loose furniture and decor.'}
Furnish it in a ${st.en} style (in the spirit of ${st.designer}) using ONLY the IKEA products in the second image (numbered product sheet). Match each product's exact shape, colour and material — do not invent other furniture.
${room.type==='tvwall'?`Wall: ${room.W} cm wide x ${room.D} cm ceiling height.`:`Room: ${room.W} x ${room.D} cm.`} ${place}
Products:
${lines.join('\n')}
Colour palette: ${(palFor(c.style,room)||st).c?palFor(c.style,room).c.join(', '):st.pal.map(p=>p[0]).join(', ')} (60/30/10). Warm 2700K light. Photorealistic interior photograph, no text, no people.`}
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


// ================= share + feedback =================
const SITE='https://ilyahan1988-alt.github.io/ikea-room/';
const b64u={enc:s=>btoa(unescape(encodeURIComponent(s))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''),dec:s=>decodeURIComponent(escape(atob(s.replace(/-/g,'+').replace(/_/g,'/'))))};
function shareUrl(c){const sel={};for(const [k,e] of Object.entries(c.sel)){sel[k]=!e?0:e.keep?'k':[e.id,e.qty||1]}
  return SITE+'#d='+b64u.enc(JSON.stringify({v:1,r:ROOM.type,p:F.per[ROOM.type],rt:F.renter,s:c.style,t:c.title||'',w:c.why||'',sel}))}
async function shareDesign(c){const url=shareUrl(c);const R=ROOMS[ROOM.type];const text=`עיצוב ל${R.he} מאיקאה — ${c.title||STYLES[c.style].name}, ${ils(totalOf(c.sel))}`;
  if(navigator.share){try{await navigator.share({title:'חדר באיקאה',text,url});return}catch(e){if(e&&e.name==='AbortError')return}}
  showText('קישור לעיצוב',url,'העתקת הקישור')}
function feedback(c){const url=c?shareUrl(c):SITE;const txt=`משוב על "חדר באיקאה":\n\nמה עבד: \nמה לא עבד: \n\nהעיצוב שלי: ${url}`;
  openSheet(`<div class="hd"><h3>משוב</h3><button class="btn sm ghost" id="closeS">סגירה</button></div><p class="muted">מה אהבתם, מה הרגיש לא נכון, מה חסר? ההודעה נפתחת ב-WhatsApp עם קישור לעיצוב שלכם — בוחרים למי לשלוח.</p><div class="actions"><a class="btn" href="https://wa.me/?text=${encodeURIComponent(txt)}" target="_blank" rel="noopener">שליחה ב-WhatsApp</a><button class="btn ghost" id="fbCopy">העתקת ההודעה</button></div>`);
  $('#fbCopy').onclick=()=>copyText(txt)}
function loadShared(){const m=location.hash.match(/^#d=(.+)$/);if(!m)return false;let d;try{d=JSON.parse(b64u.dec(m[1]))}catch(e){return false}
  if(!d||!ROOMS[d.r]||!STYLES[d.s])return false;F.room=d.r;F.per[d.r]=Object.assign({},PER_DEF[d.r],d.p||{});cleanPal(F.per[d.r]);if(typeof d.rt==='boolean')F.renter=d.rt;$('#renter').checked=F.renter;renderRoomForm();
  F.per[d.r].opens='';ROOM=roomOf();ROOM.styleRank=Object.fromEntries([d.s].concat(chooseStyles(ROOM).filter(k=>k!==d.s).slice(0,2)).map((k,i)=>[k,i]));const sel={};for(const s of ROOMS[d.r].slots){const v=d.sel&&d.sel[s.k];sel[s.k]=v==='k'?{keep:true}:Array.isArray(v)&&BY[v[0]]&&catHas(s,BY[v[0]])?{id:v[0],qty:Math.max(1,Math.min(12,+v[1]||1)),lock:true}:null}
  const shared={style:d.s,sel,src:'shared',room:d.r,title:String(d.t||'').slice(0,40),why:String(d.w||'').slice(0,400)};
  CONCEPTS=[shared].concat(chooseStyles(ROOM).filter(k=>k!==d.s).slice(0,2).map(k=>localConcept(k,ROOM)));ACTIVE=0;renderAll();
  $('#results').classList.remove('hidden');setTimeout(()=>$('#results').scrollIntoView({block:'start'}),50);toast('נפתח העיצוב ששותף איתך');return true}
// ================= Claude personal design =================
let aiCtl=null,aiState={busy:false,msg:''};
function refreshAi(){const box=$('#aiBox');if(!box)return;if(!sample){box.classList.add('hidden');return}box.classList.remove('hidden');const wp=photoFile&&sampleImages;
  box.innerHTML=`<h3>עיצוב אישי עם Claude</h3><p class="small muted" style="margin-top:4px">Claude יבחר 3 סגנונות ומוצרים במיוחד לחדר שלכם${wp?' — כולל קריאה של התמונה (אור, רצפה, קירות)':''}. לוקח כחצי דקה עד שתיים, ומשתמש במכסת ה-Claude שלכם.</p><div class="row" style="margin-top:10px"><button class="btn sm" id="aiGo" ${aiState.busy?'disabled':''}>✨ עצב לי עם Claude</button>${aiState.busy?'<button class="btn sm ghost" id="aiStop">עצירה</button>':''}</div><div class="st" id="aiSt">${esc(aiState.msg)}</div>`;
  $('#aiGo').onclick=runAi;const sb=$('#aiStop');if(sb)sb.onclick=()=>aiCtl&&aiCtl.abort()}
const RULES={living:'Sofa depth + 42 + coffee-table depth + 60 must fit the room depth minus the TV; if no coffee table fits use null and a pouf. Rug at least ~85% of sofa width. Leave out an armchair that would block the walkway.',
 bedroom:'Bed must leave 60 cm on each side for a couple (45 min) and 70 cm at the foot. Mattress width must equal the bed nominal width (e.g. 160x200 bed → 160 mattress). Duvet/bedspread size must match single vs double. Wardrobe needs a free wall plus door-opening space.',
 kitchen:'Keep 100 cm between the kitchen counter and the dining table, 75 cm behind chairs. Chairs count = seats wanted. Pendant 45–60% of table width.',
 bath:'Keep 70 cm clear in front of the sink. Mirror or mirror cabinet not wider than the vanity. Prefer no-drill items for renters.',
 office:'Desk must leave 90 cm behind it for the chair. For a monitor the desk should be at least 60 cm deep. Adult office chair (not a kids chair). Task lamp on the side opposite the writing hand.',
 kids:'Age 2-5: junior/extendable bed, small table and chairs, no loft or top bunk. Age 6-12: desk and student chair. Two kids: bunk bed with two mattresses. Mattress size must equal the bed size. Leave a free play area. Low, reachable storage.',
 balcony:'Outdoor products only. Keep a 70 cm path from the door. Seats = sofa seats + chairs. Nothing climbable pressed against the railing.',
 tvwall:'Design ONE wall as a front elevation: the TV unit must be narrower than the wall and wider than the TV; the TV centre should sit 90-125 cm from the floor, so prefer a low unit. Shelves and wall lights go beside or above the TV, never overlapping it. Prefer cable management. Wall-mounted/wired items need drilling or an electrician - avoid them for renters. Keep the wall calm: a few well-chosen objects.'};
function aiPrompt(room){const R=ROOMS[room.type];const lines=[];
  for(const s of R.slots){if(keepsSlot(room,s.k))continue;if(s.on&&!s.on(room,{}))continue;const list=CAT.filter(x=>catHas(s,x)).filter(x=>!(room.renter&&x.id===71));lines.push(`[${s.k}]`);for(const x of list)lines.push(`${x.id} | ${x.n} | ${x.v} | ${x.p} | ${x.fw&&x.fd?x.fw+'x'+x.fd:'-'} | ${x.tags}${room.pal?' | '+x.hex:''}`)}
  const styles=Object.entries(STYLES).map(([k,v])=>`${k}: ${v.name} — lens ${v.designer}. ${v.idea}`).join('\n');
  const extra={living:`TV: ${room.tv}. Uses: ${[...room.uses].join(', ')}.`,bedroom:`Sleepers: ${room.sleepers}.`,kitchen:`Seats: ${room.seats}. Mode: ${room.mode}.`,bath:`Shower: ${room.shower}. Mode: ${room.mode}.`,office:`Space: ${room.space}. Work: ${room.work}.`,kids:`Age: ${room.age}. Kids: ${room.kids}.`,balcony:`Uses: ${[...room.bUses].join(', ')}. Seats: ${room.bSeats}. Floor: ${room.floor}.`,tvwall:`TV: ${room.tvIn} inch (about ${tvDims(room).w}x${tvDims(room).h} cm), ${room.tvMount==='wall'?'mounted on the wall':'standing on the unit'}. Unit position on the wall: ${room.tvPos}.`}[room.type];
  const slotsList=R.slots.filter(s=>!s.on||s.on(room,{})).map(s=>s.k).join(', ');
  return `You are a top interior designer. Design a ${R.en} using ONLY the IKEA Israel products listed below (ids). Write every text field in Hebrew.
${room.type==='tvwall'?`WALL: ${room.W} cm wide, ceiling height ${room.D} cm (front elevation of the TV wall).`:`ROOM: main wall ${room.W} cm; depth ${room.D} cm. Window ${room.winWall==='none'?'none':'on '+room.winWall+' wall, '+room.winW+' cm'}, faces ${DIRS[room.dir]}. Door: ${room.door}.`} Renter: ${room.renter?'yes':'no'}. ${extra}
Keep from home (do not buy): ${[...room.keep].join(', ')||'nothing'}. Likes: ${room.likes.map(k=>LIKES[k].he).join(', ')||'-'}. Dislikes: ${room.dis.map(k=>DISLIKES[k].he).join(', ')||'-'}.
Budget per concept: ${room.budget} ILS (sum of prices × quantities).
${room.pal?`USER PALETTE (chosen by the user, must drive the colours): base ${room.pal.c[0]} ${room.pal.n[0]}, secondary ${room.pal.c[1]} ${room.pal.n[1]}, accent ${room.pal.c[2]} ${room.pal.n[2]}. Pick products whose hex (last column) is close to the role colour of their slot. Concept 1 uses the palette as given (60/30/10); concept 2 swaps base and secondary; concept 3 swaps secondary and accent. Each concept still follows a different designer style.`:''}
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
      if(x&&catHas(s,x)&&fitCheck(x,s.k,sel,room).ok&&!(s.k==='cushion2'&&sel.cushion&&sel.cushion.id===x.id))sel[s.k]={id:x.id,qty:qtyFor(s.k,x,sel,room)};
      else{fixed++;const cd=pick(s.k,style,room,sel);sel[s.k]=cd?{id:cd.x.id,qty:qtyFor(s.k,cd.x,sel,room)}:null}}
    out.push({style,sel,src:'ai',room:room.type,title:typeof rc.title==='string'?rc.title.slice(0,40):'',why:typeof rc.why==='string'?rc.why.slice(0,400):'',tips:Array.isArray(rc.tips)?rc.tips.filter(t=>typeof t==='string').slice(0,4).map(t=>t.slice(0,220)):[]});if(out.length===3)break}
  for(const k of chooseStyles(room).concat(Object.keys(STYLES))){if(out.length>=3)break;if(!out.some(c=>c.style===k))out.push(localConcept(k,room))}
  CONCEPTS=out;ROOM=room;room.styleRank=Object.fromEntries(out.map((c,i)=>[c.style,i]));$('#results').classList.remove('hidden');return{fixed}}

// ================= measure from a photo (A4 reference) =================
const A4CM={long:29.7,short:21,two:59.4};
const measCm=(refPx,refCm,segPx)=>refPx>0?segPx*refCm/refPx:0;
const ptDist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function openMeasure(){
  const st={img:null,pts:[],ref:'long',drag:-1};
  openSheet(`<div class="hd"><div><h3>מדידה מתמונה</h3><p class="muted small">החישוב קורה במכשיר שלכם — התמונה לא נשלחת לשום מקום</p></div><button class="btn sm ghost" id="closeS">סגירה</button></div>
  <ol class="tips"><li>מדביקים דף A4 על הקיר שרוצים למדוד (נייר דבק מסכות מספיק). לדיוק טוב יותר — שני דפים בשורה.</li><li>מצלמים את הקיר ישר מלפנים, כשכל הקיר נכנס בתמונה.</li><li>מסמנים את שני קצות הדף, ואז את שני קצות הקיר. הנקודות ניתנות לגרירה לכיוונון.</li></ol>
  <div class="actions"><label class="btn sm" for="measFile">בחירת תמונה</label><input id="measFile" type="file" accept="image/*" class="hidden">${photoFile?'<button class="btn sm ghost" id="measUse">התמונה שבחרתי לחדר</button>':''}</div>
  <div id="measBox" class="hidden"><div class="chips" id="measRef" style="margin:12px 0 8px"></div>
  <p class="hint" id="measStep" style="margin:0 0 8px"></p>
  <canvas id="measCv" style="width:100%;display:block;touch-action:none;border-radius:12px;background:#e9e5dc"></canvas>
  <div id="measOut" style="margin-top:12px"></div></div>`);
  const cv=$('#measCv'),out=$('#measOut'),stepEl=$('#measStep');
  const refMap={long:'צלע ארוכה של דף (29.7)',short:'צלע קצרה (21)',two:'שני דפים בשורה (59.4) — מדויק יותר'};
  chipGroup($('#measRef'),refMap,()=>st.ref,false,k=>{st.ref=k;render()});
  const toImg=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*cv.width/r.width,y:(e.clientY-r.top)*cv.height/r.height}};
  function render(){
    const g=cv.getContext('2d');if(!g||!st.img)return;g.drawImage(st.img,0,0,cv.width,cv.height);
    const rr=Math.max(9,cv.width/80),lw=Math.max(3,cv.width/360);
    const seg=(a,b,col)=>{if(!a||!b)return;g.strokeStyle=col;g.lineWidth=lw;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()};
    seg(st.pts[0],st.pts[1],'#ff8a00');seg(st.pts[2],st.pts[3],'#18b26b');
    st.pts.forEach((q,i)=>{g.fillStyle=i<2?'#ff8a00':'#18b26b';g.strokeStyle='#fff';g.lineWidth=lw;g.beginPath();g.arc(q.x,q.y,rr,0,7);g.fill();g.stroke()});
    const n=st.pts.length;stepEl.textContent=n<2?'שלב 1: סמנו את שני הקצוות של דף ה-A4 ('+refMap[st.ref]+').':n<4?'שלב 2: סמנו את שני הקצוות של הקיר (או של כל מה שרוצים למדוד).':'';
    let h='';
    if(n===4){const refPx=ptDist(st.pts[0],st.pts[1]),cm=measCm(refPx,A4CM[st.ref],ptDist(st.pts[2],st.pts[3]));
      if(refPx<cv.width*0.05)h+=`<p class="hint">הדף קטן בתמונה, וסימון לא מדויק בכמה פיקסלים משנה את התוצאה. הדביקו שני דפים בשורה ובחרו "שני דפים", או התקרבו לקיר.</p>`;
      h+=`<div class="total"><span class="muted small">אורך משוער</span><b>${Math.round(cm)} ס״מ</b></div><p class="hint">דיוק טיפוסי ±5% כשהדף והקיר באותו מישור והצילום ישר. בדקו עם מטר אם זה חלל צפוף.</p>
      <div class="actions"><button class="btn sm" id="measW">${F.room==='tvwall'?'להזין כרוחב הקיר':'להזין כאורך'}</button><button class="btn sm" id="measD">${F.room==='tvwall'?'להזין כגובה התקרה':'להזין כעומק'}</button><button class="btn sm ghost" id="measMore">מדידה נוספת</button></div>`}
    else if(n>=2)h=`<div class="actions"><button class="btn sm ghost" id="measUndo">ביטול נקודה</button></div>`;
    else if(n===1)h=`<div class="actions"><button class="btn sm ghost" id="measUndo">ביטול נקודה</button></div>`;
    out.innerHTML=h;
    const put=id=>{const cm=Math.round(measCm(ptDist(st.pts[0],st.pts[1]),A4CM[st.ref],ptDist(st.pts[2],st.pts[3])));if(cm<40||cm>1200){toast('התוצאה ('+cm+' ס״מ) נראית לא הגיונית — נסו שוב');return}
      const p=P();p[id]=cm;$('#'+id).value=cm;saveForm();closeSheet();toast((F.room==='tvwall'?(id==='W'?'רוחב הקיר':'גובה התקרה'):id==='W'?'האורך':'העומק')+' עודכן: '+cm+' ס״מ')};
    const w=$('#measW');if(w){w.onclick=()=>put('W');$('#measD').onclick=()=>put('D');$('#measMore').onclick=()=>{st.pts=st.pts.slice(0,2);render()}}
    const u=$('#measUndo');if(u)u.onclick=()=>{st.pts.pop();render()};
  }
  function load(file){if(!file)return;const url=URL.createObjectURL(file),im=new Image();
    im.onload=()=>{st.img=im;const sc=Math.min(1,1600/Math.max(im.naturalWidth,im.naturalHeight));cv.width=Math.round(im.naturalWidth*sc);cv.height=Math.round(im.naturalHeight*sc);st.pts=[];$('#measBox').classList.remove('hidden');render();URL.revokeObjectURL(url)};
    im.onerror=()=>toast('לא הצלחתי לפתוח את התמונה');im.src=url}
  $('#measFile').onchange=e=>load(e.target.files&&e.target.files[0]);const mu=$('#measUse');if(mu)mu.onclick=()=>load(photoFile);
  cv.onpointerdown=e=>{if(!st.img)return;e.preventDefault();const q=toImg(e);const thr=cv.width/16;let bi=-1,bd=thr;st.pts.forEach((a,i)=>{const d=ptDist(a,q);if(d<bd){bd=d;bi=i}});
    if(bi>=0)st.drag=bi;else if(st.pts.length<4){st.pts.push(q);st.drag=st.pts.length-1}else return;try{cv.setPointerCapture(e.pointerId)}catch(_){}render()};
  cv.onpointermove=e=>{if(st.drag<0)return;st.pts[st.drag]=toImg(e);render()};
  cv.onpointerup=cv.onpointercancel=()=>{st.drag=-1};
}
// ================= boot =================
initForm();
loadShared();
(async()=>{if(!window.claude||!window.claude.use)return;try{sample=await window.claude.use('sample')}catch(e){sample=null}
  if(sample){try{const lim=await sample.limits();sampleImages=!!(lim&&lim.images)}catch(e){sampleImages=false}}try{downloads=await window.claude.use('downloads')}catch(e){downloads=null}refreshAi()})();
