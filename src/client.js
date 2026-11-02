const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#main-nav');
toggle?.addEventListener('click',()=>{
 const open=toggle.getAttribute('aria-expanded')!=='true';
 toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
 nav.classList.toggle('open',open);
 toggle.querySelector('img').src=`/icons/${open?'x':'menu'}.svg`;
});
const gsap=window.gsap;
if(gsap&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
 const revealTargets=document.querySelectorAll('.section-heading,.category-item,.tech-layout > *, .product-card,.page-intro,.detail-photo,.detail-summary,.detail-information > *, .technology-grid article,.faq-list section,.contact-layout > *, .source-strip > *, .inquiry-band .container > *');
 const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  gsap.from(entry.target,{y:22,opacity:0,duration:.65,ease:'power2.out'});
  reveal.unobserve(entry.target);
 }),{threshold:.12});
 revealTargets.forEach(element=>reveal.observe(element));
 gsap.from('.hero-content > *',{y:22,opacity:0,duration:.72,stagger:.1,ease:'power2.out',delay:.12});
 document.querySelectorAll('.product-card,.category-item').forEach(card=>{
  card.addEventListener('pointerenter',()=>gsap.to(card,{y:-4,duration:.22,ease:'power2.out'}));
  card.addEventListener('pointerleave',()=>gsap.to(card,{y:0,duration:.25,ease:'power2.out'}));
 });
 const heroImage=document.querySelector('.hero-image');
 if(heroImage&&window.matchMedia('(min-width: 801px)').matches){
  window.addEventListener('scroll',()=>gsap.to(heroImage,{y:Math.min(window.scrollY*.06,28),duration:.25,ease:'power1.out'}),{passive:true});
 }
}
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){toggle.click();toggle.focus();}});
if(document.querySelector('[data-catalogue]')){
 const search=document.querySelector('#product-search'),series=document.querySelector('#series-filter'),performance=document.querySelector('#performance-filter'),sort=document.querySelector('#sort-filter'),grid=document.querySelector('#product-grid');
 const cards=[...grid.children];
 function filter(){
  const query=search.value.trim().toLowerCase();let count=0;
  const ordered=[...cards].sort((a,b)=>sort.value==='name'?a.dataset.name.localeCompare(b.dataset.name):sort.value==='thickness'?Number(a.dataset.thickness)-Number(b.dataset.thickness):cards.indexOf(a)-cards.indexOf(b));
  ordered.forEach(card=>{const show=card.dataset.search.includes(query)&&(!series.value||card.dataset.series===series.value)&&(!performance.value||card.dataset.performance.split(' ').includes(performance.value));card.hidden=!show;if(show)count++;grid.append(card);});
  document.querySelector('#result-count').textContent=`${count} ${count===1?'product':'products'}`;
  document.querySelector('#empty-state').hidden=count!==0;
 }
 function reset(){search.value='';series.value='';performance.value='';sort.value='default';filter();search.focus();}
 search.addEventListener('input',filter);series.addEventListener('change',filter);performance.addEventListener('change',filter);sort.addEventListener('change',filter);
 document.querySelector('#reset-filters').addEventListener('click',reset);document.querySelector('#empty-reset').addEventListener('click',reset);
}
const form=document.querySelector('#inquiry-form');
if(form){
 const params=new URLSearchParams(location.search);const selected=params.get('product');
 if([...form.product.options].some(o=>o.value===selected))form.product.value=selected;
 const status=document.querySelector('#form-status');
 function validate(){
  let first;
  for(const field of form.querySelectorAll('[required]')){
   let error='';const value=field.value.trim();
   if(!value)error='Please complete this field.';
   else if(field.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))error='Enter a valid email address.';
   else if(field.name==='message'&&value.length<10)error='Please enter at least 10 characters.';
   field.setAttribute('aria-invalid',String(!!error));field.setAttribute('aria-describedby',field.id+'-error');
   document.getElementById(field.id+'-error').textContent=error;
   if(error&&!first)first=field;
  }
  if(first){first.focus();status.textContent='Please check the highlighted fields.';return false;}return true;
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!validate())return;
  const data=Object.fromEntries(new FormData(form));data.productName=form.product.selectedOptions[0].textContent;
  if(!form.dataset.endpoint){
   const text=`AUTO TAILOR PRODUCT INQUIRY\nDRAFT ONLY - NOT SENT\n\n${Object.entries(data).map(([k,v])=>`${k}: ${v}`).join('\n\n')}\n`;
   const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
   const a=document.createElement('a');a.href=url;a.download=`auto-tailor-inquiry-${data.product}.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   status.textContent='Draft downloaded. Nothing has been sent. A receiving service must be configured before online inquiries are available.';return;
  }
  const button=form.querySelector('[type="submit"]');button.disabled=true;form.setAttribute('aria-busy','true');status.textContent='Sending your inquiry…';
  try{
   const response=await fetch(form.dataset.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
   const result=await response.json();
   if(!response.ok||result.success!==true)throw Error('Not accepted');
   status.textContent='Your inquiry was accepted by the receiving service. Delivery and a response depend on that service.';
  }catch{status.textContent='Your inquiry could not be confirmed. It may not have been received. Please try again or use a listed contact channel.';}
  finally{button.disabled=false;form.removeAttribute('aria-busy');}
 });
}
