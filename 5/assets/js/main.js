(() => {
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const refreshIcons=()=>window.lucide?.createIcons(); refreshIcons();
const save=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const root=document.documentElement;
function syncPrefs(){ $$('.theme-toggle').forEach(b=>{b.setAttribute('aria-label',root.dataset.theme==='dark'?'Switch to light mode':'Switch to dark mode');b.innerHTML=`<i data-lucide="${root.dataset.theme==='dark'?'sun':'moon'}"></i>`});$$('.direction-toggle').forEach(b=>{const isRtl=root.dir==='rtl';const label=isRtl?'Switch to left-to-right layout':'Switch to right-to-left layout';b.setAttribute('aria-label',label);b.setAttribute('title',label);b.innerHTML=`<span class="dir-badge">${isRtl?'LTR':'RTL'}</span>`});refreshIcons() }
$$('.theme-toggle').forEach(b=>b.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';save('bm-theme',root.dataset.theme);syncPrefs()}));
$$('.direction-toggle').forEach(b=>b.addEventListener('click',()=>{root.dir=root.dir==='rtl'?'ltr':'rtl';save('bm-direction',root.dir);syncPrefs()}));syncPrefs();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',e=>{try{if(!localStorage.getItem('bm-theme')){root.dataset.theme=e.matches?'dark':'light';syncPrefs()}}catch(err){}});
const menu=$('.mobile-menu'),nav=$('#main-nav');function setMenuOpen(open){if(!menu||!nav)return;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.innerHTML=`<i data-lucide="${open?'x':'menu'}"></i>`;nav.classList.toggle('open',open);refreshIcons()}menu?.addEventListener('click',e=>{e.stopPropagation();const isOpen=menu.getAttribute('aria-expanded')==='true';setMenuOpen(!isOpen)});$$('.nav-more-toggle').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const parent=b.parentElement,open=b.getAttribute('aria-expanded')!=='true';$$('.nav-more').forEach(n=>{if(n!==parent){n.classList.remove('open');$('button',n)?.setAttribute('aria-expanded','false')}});b.setAttribute('aria-expanded',String(open));parent.classList.toggle('open',open)}));document.addEventListener('click',e=>{if(!e.target.closest('.nav-more')){$$('.nav-more').forEach(n=>{n.classList.remove('open');$('button',n)?.setAttribute('aria-expanded','false')})}if(nav?.classList.contains('open')&&!e.target.closest('.site-header')){setMenuOpen(false)}});$$('a',nav).forEach(link=>{link.addEventListener('click',()=>{if(nav?.classList.contains('open'))setMenuOpen(false)})});document.addEventListener('keydown',e=>{if(e.key==='Escape'){$$('.nav-more').forEach(n=>{n.classList.remove('open');$('button',n)?.setAttribute('aria-expanded','false')});if(nav?.classList.contains('open')){setMenuOpen(false);menu?.focus()}}});window.addEventListener('resize',()=>{if(window.innerWidth>900&&nav?.classList.contains('open')){setMenuOpen(false)}});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){document.body.classList.add('js-motion');const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach((e,i)=>{e.style.transitionDelay=`${Math.min(i%4,3)*65}ms`;obs.observe(e)})}
let toastTimer;window.showToast=(message)=>{const toast=$('.toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),6500)};
window.openDetail=(html)=>{const dialog=$('#detail-dialog');if(!dialog)return;$('#dialog-content').innerHTML=html;refreshIcons();try{if(!dialog.open)dialog.showModal()}catch(err){dialog.setAttribute('open','')}};
window.closeDetail=()=>{const dialog=$('#detail-dialog');if(!dialog)return;try{if(dialog.open)dialog.close()}catch(err){dialog.removeAttribute('open')}};
document.addEventListener('click',e=>{if(e.target.closest('.close-dialog')||e.target.closest('.close-dialog-btn')){closeDetail()}const dialog=$('#detail-dialog');if(dialog&&e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetail()}});
document.addEventListener('click',e=>{const b=e.target.closest('.password-toggle');if(!b)return;const input=$('input',b.parentElement);if(!input)return;const reveal=input.type==='password';input.type=reveal?'text':'password';b.setAttribute('aria-label',reveal?'Hide password':'Show password');b.innerHTML=`<i data-lucide="${reveal?'eye-off':'eye'}"></i>`;refreshIcons()});
$$('.tabs').forEach(group=>{const tabs=$$('[role=tab]',group);tabs.forEach((tab,i)=>{tab.tabIndex=tab.getAttribute('aria-selected')==='true'?0:-1;tab.addEventListener('click',()=>{tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1});const panelId=tab.getAttribute('aria-controls');if(panelId)document.getElementById(panelId)?.setAttribute('aria-labelledby',tab.id);group.dispatchEvent(new CustomEvent('tabchange',{detail:tab.dataset.value,bubbles:true}))});tab.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();let next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?(root.dir==='rtl'?-1:1):(root.dir==='rtl'?1:-1))+tabs.length)%tabs.length;tabs[next].focus();tabs[next].click()}})})});
// Validate each field and associate a specific, persistent inline message.
function validate(form){let valid=true;$$('input,select,textarea',form).forEach(input=>{if(input.type==='submit'||input.type==='button')return;let message='';if(input.required&&!input.value.trim())message='Please complete this field.';else if(input.type==='checkbox'&&input.required&&!input.checked)message='Please agree before continuing.';else if(input.type==='email'&&input.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value))message='Enter a valid email address.';else if(input.minLength>0&&input.value.length<input.minLength)message=`Use at least ${input.minLength} characters.`;else if((input.name==='confirmPassword'||input.name==='resetConfirm')&&input.value!==$('[name=password],[name=resetPassword]',form)?.value)message='Your passwords do not match.';else if(input.type==='tel'&&input.value.replace(/\D/g,'').length<10)message='Enter a phone number with at least 10 digits.';const field=input.closest('.field')||input.closest('.checkbox-row');if(!field)return;let error=$('.form-error',field);if(!error){error=document.createElement('span');error.className='form-error';error.id=`${input.id}-error`;field.appendChild(error)}error.textContent=message;input.setAttribute('aria-describedby',error.id);input.setAttribute('aria-invalid',String(!!message));field.classList.toggle('invalid',!!message);if(message)valid=false});if(!valid)$('[aria-invalid=true]',form)?.focus();return valid}
$$('form[data-form]').forEach(form=>{form.noValidate=true;form.addEventListener('submit',e=>{e.preventDefault();if(!validate(form))return;const type=form.dataset.form;if(type==='signin'){location.href='dashboard.html'}else if(type==='forgot'){showToast('Password reset successfully! You can now sign in.');setTimeout(()=>location.href='signin.html',1200)}else if(type==='signup'){openDetail('<p class="eyebrow" style="padding-inline-end:44px">Demo registration</p><h2 style="padding-inline-end:44px">Your form is ready.</h2><p>Your details passed validation. This preview does not create accounts or store passwords.</p><p>A live registration service can be connected when the website is deployed for students.</p><a class="button" href="dashboard.html">Explore the demo dashboard</a>');form.reset()}else if(type==='contact'){openDetail('<p class="eyebrow" style="padding-inline-end:44px">Enquiry preview</p><h2 style="padding-inline-end:44px">Thank you for reaching out.</h2><p>Your enquiry passed validation. This is a demonstration form; no message has been sent or stored.</p><p>In the live website, the centre will use these details to help you choose a subject and batch.</p>');form.reset()}else if(type==='notify'){showToast('Email validated. This demo does not subscribe or store your address.');form.reset()}})});
$$('[data-demo-login]').forEach(b=>b.addEventListener('click',()=>location.href='dashboard.html'));
function openForgotPasswordModal(){const currentEmail=$('#email')?.value.trim()||'';const html=`<div class="forgot-modal"><p class="eyebrow" style="padding-inline-end:44px">Account recovery</p><h2 style="padding-inline-end:44px">Reset your password</h2><p style="margin:8px 0 18px;font-size:.92rem;color:var(--muted)">Enter your email address and new password below to restore access to your student portal.</p><form id="forgot-modal-form"><div class="field"><label for="modal-reset-email">Email address</label><input id="modal-reset-email" name="email" type="email" placeholder="Enter your email address" required autocomplete="email" value="${currentEmail.replace(/"/g,'&quot;')}"></div><div class="field"><label for="modal-reset-password">New password</label><div class="password-wrap"><input type="password" id="modal-reset-password" name="password" placeholder="Enter new password (min. 8 characters)" required minlength="8" autocomplete="new-password"><button type="button" class="icon-button password-toggle" aria-label="Show password"><i data-lucide="eye"></i></button></div></div><div class="field"><label for="modal-reset-confirm">Confirm new password</label><div class="password-wrap"><input type="password" id="modal-reset-confirm" name="confirmPassword" placeholder="Re-enter new password" required minlength="8" autocomplete="new-password"><button type="button" class="icon-button password-toggle" aria-label="Show password"><i data-lucide="eye"></i></button></div></div><div style="display:flex;flex-direction:column;gap:10px;margin-top:20px"><button class="button full" type="submit">Reset &amp; save password <i data-lucide="check"></i></button><button class="button secondary full" type="button" id="modal-btn-email-link">Send reset link to email instead</button></div></form><div style="margin-top:16px;text-align:center"><button type="button" class="close-dialog-btn" style="background:none;border:0;color:var(--blue);font-size:.85rem;cursor:pointer;font-weight:600">Back to sign in</button></div></div>`;openDetail(html);const modalForm=$('#forgot-modal-form');modalForm?.addEventListener('submit',e=>{e.preventDefault();if(!validate(modalForm))return;const email=$('#modal-reset-email',modalForm).value.trim();const newPw=$('#modal-reset-password',modalForm).value;const sEmail=$('#email'),sPw=$('#password');if(sEmail)sEmail.value=email;if(sPw)sPw.value=newPw;closeDetail();showToast('Password reset successfully! You can now sign in.');sPw?.focus()});$('#modal-btn-email-link')?.addEventListener('click',()=>{$$('#modal-reset-password,#modal-reset-confirm',modalForm).forEach(input=>{const f=input.closest('.field');if(f){f.classList.remove('invalid');input.removeAttribute('aria-invalid');const err=$('.form-error',f);if(err)err.textContent=''}});const emailInput=$('#modal-reset-email',modalForm);const email=emailInput?.value.trim();if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){let field=emailInput.closest('.field'),error=$('.form-error',field);if(!error){error=document.createElement('span');error.className='form-error';error.id=`${emailInput.id}-error`;field.appendChild(error)}error.textContent=!email?'Please enter your registered email address.':'Please enter a valid email address.';emailInput.setAttribute('aria-describedby',error.id);emailInput.setAttribute('aria-invalid','true');field.classList.add('invalid');emailInput.focus();return}const safeEmail=email.replace(/</g,'&lt;').replace(/>/g,'&gt;');$('#dialog-content').innerHTML=`<div style="text-align:center;padding:15px 5px"><div class="icon-tile soft-green" style="width:60px;height:60px;border-radius:50%;margin-inline:auto;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px"><i data-lucide="mail-check" style="width:30px;height:30px"></i></div><p class="eyebrow" style="color:var(--green);margin-bottom:6px">Reset link sent</p><h2 style="margin-bottom:12px;font-size:1.8rem">Check your email</h2><p style="margin-bottom:18px;font-size:.95rem;color:var(--muted);line-height:1.6">We have sent password reset instructions to <strong style="color:var(--navy)">${safeEmail}</strong>. Please check your inbox and follow the link to reset your password.</p><p class="tiny" style="margin-bottom:24px">Didn’t receive an email? Check your spam folder or try again.</p><div style="display:flex;flex-direction:column;gap:10px"><button class="button full close-dialog-btn" type="button">Back to sign in</button><button class="button secondary full" type="button" id="modal-btn-resend-link">Resend reset email</button></div></div>`;refreshIcons();showToast(`Password reset link sent to ${email}`);$('#modal-btn-resend-link')?.addEventListener('click',()=>{showToast(`Password reset link resent to ${email}`)})})}
$$('[data-forgot]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openForgotPasswordModal()}));
function handleStandaloneEmailResetLink(){const emailInput=$('#reset-email');if(!emailInput)return;const form=emailInput.closest('form');if(form){$$('#reset-password,#reset-confirm',form).forEach(input=>{const f=input.closest('.field');if(f){f.classList.remove('invalid');input.removeAttribute('aria-invalid');const err=$('.form-error',f);if(err)err.textContent=''}})}const email=emailInput.value.trim();const isValid=email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);if(!isValid){const field=emailInput.closest('.field');if(field){let error=$('.form-error',field);if(!error){error=document.createElement('span');error.className='form-error';error.id=`${emailInput.id}-error`;field.appendChild(error)}error.textContent=!email?'Please enter your registered email address.':'Please enter a valid email address.';emailInput.setAttribute('aria-describedby',error.id);emailInput.setAttribute('aria-invalid','true');field.classList.add('invalid');emailInput.focus()}return}const emailField=emailInput.closest('.field');if(emailField){emailField.classList.remove('invalid');emailInput.removeAttribute('aria-invalid');const err=$('.form-error',emailField);if(err)err.textContent=''}const safeEmail=email.replace(/</g,'&lt;').replace(/>/g,'&gt;');const wrap=$('#forgot-form-wrap')||emailInput.closest('.auth-form');if(wrap){if(!window._forgotInitialMarkup){window._forgotInitialMarkup=wrap.innerHTML}wrap.innerHTML=`<div style="text-align:center;padding:12px 0 20px" class="reveal is-visible"><div class="icon-tile soft-green" style="width:62px;height:62px;border-radius:50%;margin-inline:auto;display:inline-flex;align-items:center;justify-content:center;margin-bottom:18px"><i data-lucide="mail-check" style="width:32px;height:32px"></i></div><p class="eyebrow" style="color:var(--green);margin-bottom:8px">Reset link sent</p><h2 style="font-size:1.85rem;margin-bottom:12px">Check your email</h2><p style="font-size:.95rem;color:var(--muted);margin-bottom:18px;line-height:1.6">We have sent password reset instructions to <strong style="color:var(--navy)">${safeEmail}</strong>. Please check your inbox and follow the link to reset your password.</p><p class="tiny" style="margin-bottom:26px">Didn’t receive an email? Check your spam folder or try again.</p><div style="display:flex;flex-direction:column;gap:10px"><a class="button full" href="signin.html">Back to sign in <i data-lucide="arrow-right"></i></a><button class="button secondary full" type="button" id="btn-resend-link">Resend reset email</button></div><p class="form-note" style="margin-top:22px"><button type="button" id="btn-diff-email" style="background:none;border:0;color:var(--blue);font-size:.875rem;cursor:pointer;font-weight:600">Use a different email address</button></p><p class="form-note"><a href="../index.html">Back to home</a></p></div>`;refreshIcons();showToast(`Password reset link sent to ${email}`);$('#btn-resend-link')?.addEventListener('click',()=>{showToast(`Password reset link resent to ${email}`)});$('#btn-diff-email')?.addEventListener('click',()=>{if(window._forgotInitialMarkup){wrap.innerHTML=window._forgotInitialMarkup;refreshIcons();initStandaloneForgot();const reEmail=$('#reset-email');if(reEmail){reEmail.value='';reEmail.focus()}}})}else{openDetail(`<div style="text-align:center;padding:15px 5px"><div class="icon-tile soft-green" style="width:58px;height:58px;border-radius:50%;margin-inline:auto;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px"><i data-lucide="mail-check" style="width:30px;height:30px"></i></div><p class="eyebrow" style="color:var(--green)">Reset link sent</p><h2 style="margin-bottom:12px">Check your email</h2><p style="margin-bottom:20px;font-size:.95rem;color:var(--muted)">We have sent password reset instructions to <strong style="color:var(--navy)">${safeEmail}</strong>. Please check your inbox and follow the link to reset your password.</p><p class="tiny" style="margin-bottom:24px">Didn’t receive an email? Check your spam folder or try again.</p><a class="button full" href="signin.html">Back to sign in</a></div>`);showToast(`Password reset link sent to ${email}`)}}
function initStandaloneForgot(){const form=$('form[data-form="forgot"]');if(form){form.noValidate=true;form.onsubmit=(e)=>{e.preventDefault();if(!validate(form))return;showToast('Password reset successfully! You can now sign in.');setTimeout(()=>location.href='signin.html',1200)}}const btn=$('#btn-email-link');if(btn){btn.onclick=(e)=>{e.preventDefault();handleStandaloneEmailResetLink()}}}
initStandaloneForgot();
// Course explorer.
const courseInfo={Mathematics:{icon:'calculator',topics:['Number sense & arithmetic','Algebra & equations','Geometry & measurement','Practice and problem solving']},Science:{icon:'flask-conical',topics:['Understanding scientific concepts','Practical examples & experiments','Physics, chemistry & biology','Revision and exam practice']},English:{icon:'book-open',topics:['Reading comprehension','Grammar foundations','Creative & structured writing','Literature and communication']},'Social Studies':{icon:'globe-2',topics:['History through stories','Geography & our environment','Civics and citizenship','Maps, timelines & revision']}};
const curriculum={
'1–5':{Mathematics:['Number sense and place value','Addition, subtraction, multiplication and division','Shapes and measurement','Everyday word problems'],Science:['Plants, animals and habitats','The human body and healthy habits','Materials and simple observations','Weather and our environment'],English:['Reading fluency and vocabulary','Sentence-building and punctuation','Short stories and comprehension','Speaking and creative writing'],'Social Studies':['Family, school and community','Our neighbourhood and local maps','People and everyday responsibilities','Festivals, places and the world around us']},
'6–8':{Mathematics:['Fractions, ratios and percentages','Integers and algebra foundations','Geometry and measurement','Data handling and word problems'],Science:['Matter, materials and reactions','Force, motion and electricity','Living systems and ecosystems','Practical investigations'],English:['Reading comprehension','Grammar and sentence structure','Creative and formal writing','Literature and communication'],'Social Studies':['History through sources and stories','Physical and human geography','Civics and citizenship','Maps, timelines and revision']},
'9–10':{Mathematics:['Polynomials and quadratic equations','Coordinate geometry and triangles','Trigonometry and mensuration','Statistics, probability and board practice'],Science:['Chemical reactions and equations','Life processes and heredity','Light, electricity and magnetism','Textbook-based experiments and revision'],English:['Prescribed prose and poetry','Analytical reading and comprehension','Grammar and writing formats','Timed exam practice'],'Social Studies':['Nationalism and modern history','Resources and economic development','Democratic politics','Map skills and structured answers']},
'11–12':{Mathematics:['Functions, limits and calculus','Matrices and determinants','Vectors and three-dimensional geometry','Probability and board preparation'],Science:['Physics: mechanics to electricity','Chemistry: physical, organic and inorganic','Biology: cells, genetics and ecology','Stream-specific numerical and practical support'],English:['Advanced comprehension and analysis','Prescribed literature','Formal and creative writing','Board-paper planning and practice'],'Social Studies':['History and source analysis','Geography and map interpretation','Political science foundations','Humanities subject-specific exam support']}
};
let grade='6–8';const courseTabs=$('[data-course-tabs]');courseTabs?.addEventListener('tabchange',e=>{grade=e.detail;$$('[data-grade-label]').forEach(x=>x.textContent=`Classes ${grade}`);const duration=['1–5','6–8'].includes(grade)?'60-min classes':'90-min classes';$$('[data-course-duration]').forEach(x=>x.textContent=duration);$$('[data-course]').forEach(b=>{const card=b.closest('.course-card'),name=b.dataset.course;card.querySelector('p').textContent=curriculum[grade][name].slice(0,2).join('. ')+'.';if(name==='Social Studies')card.querySelector('h3').textContent=grade==='11–12'?'Humanities':'Social Studies'})});
$$('[data-course]').forEach(b=>b.addEventListener('click',()=>{const name=b.dataset.course,c=courseInfo[name];openDetail(`<span class="icon-tile"><i data-lucide="${c.icon}"></i></span><p class="eyebrow" style="margin-top:22px;padding-inline-end:44px">Classes ${grade} · CBSE & ICSE</p><h2 style="padding-inline-end:44px">${name}, made clearer.</h2><p>A small-group programme that meets students where they are and builds confidence one concept at a time.</p><ul class="check-list">${curriculum[grade][name].map(t=>`<li><i data-lucide="check"></i>${t}</li>`).join('')}</ul><p>Includes weekly assessments, tutor feedback, study notes and a monthly progress review.</p><a class="button" href="contact.html?subject=${encodeURIComponent(name)}&grade=${encodeURIComponent('Class '+grade)}&gradeBand=${encodeURIComponent(grade)}">Ask about this course</a>`)}));
// Grade-aware fee calculator, with accurate savings against individual subjects.
const pricing={'1–5':[1200,2200,3100,3900],'6–8':[1500,2800,4000,5000],'9–10':[1800,3400,4800,6200],'11–12':[2200,4200,6000,7600]};let feeGrade='6–8';const money=n=>'₹'+n.toLocaleString('en-IN');
function updateFees(){if(!$('[data-fee-summary]'))return;const prices=pricing[feeGrade];$$('[data-plan-price]').forEach((x,i)=>x.textContent=money(prices[i]));$$('[data-save]').forEach(x=>{let i=Number(x.dataset.save);x.textContent=`Save ${Math.round((1-prices[i]/(prices[0]*(i+1)))*100)}%`});const count=Number($('input[name=plan]:checked')?.value||1);const planPrice=money(prices[count-1]);const planName=count+' Subject'+(count===1?'':'s');$('[data-total]').textContent=planPrice;$('[data-summary-grade]').textContent='Classes '+feeGrade;$('[data-summary-subjects]').textContent=count+' subject'+(count===1?'':'s');$('[data-monthly-saving]').textContent=money(prices[0]*count-prices[count-1]);const enquireBtn=$('[data-enquire]');if(enquireBtn){enquireBtn.href=`contact.html?grade=${encodeURIComponent('Class '+feeGrade)}&gradeBand=${encodeURIComponent(feeGrade)}&subjects=${count}&plan=${encodeURIComponent(planName)}&price=${encodeURIComponent(planPrice)}`}}
$('[data-enquire]')?.addEventListener('click',updateFees);
$('[data-fee-tabs]')?.addEventListener('tabchange',e=>{feeGrade=e.detail;updateFees()});$$('input[name=plan]').forEach(x=>x.addEventListener('change',updateFees));updateFees();
const tutorBios={Rohit:'Rohit holds an M.Sc. in Mathematics and has six years of teaching experience. He breaks complex ideas into manageable steps and helps Classes 9–12 develop strong problem-solving habits.',Priya:'Priya holds an M.Sc. in Physics and has five years of experience. Her practical examples and guided experiments help Classes 6–10 connect science to everyday life.',Kavita:'Kavita holds an M.A. in English and has eight years of experience. She supports Classes 6–12 with reading, writing, grammar and confident communication.',Arjun:'Arjun holds an M.A. in History and has seven years of experience. He brings history, geography and civics to life for Classes 6–10 with stories and thoughtful discussion.',Radhika:'Dr. Radhika Sen brings 22+ years of educational leadership and mathematics curriculum expertise. A former Senior ICSE Examiner and textbook author, she oversees academic rigor, concept sequencing, and assessment benchmarks across all grade levels.',Narayanan:'Prof. M. K. Narayanan has 28+ years of science pedagogy experience as a retired Professor of Physics. He leads our inquiry-based STEM frameworks and coaches senior students for National Science Olympiads and competitive entrance readiness.',Shalini:'Dr. Shalini Mehta holds a doctorate in Child and Adolescent Psychology with 16+ years of guidance experience. She conducts dedicated workshops and one-on-one sessions helping students overcome exam anxiety, build focus, and cultivate positive academic self-belief.'};$$('[data-tutor]').forEach(b=>b.addEventListener('click',()=>openDetail(`<p class="eyebrow" style="padding-inline-end:44px">Meet your tutor</p><h2 style="padding-inline-end:44px">${b.dataset.name}</h2><p>${tutorBios[b.dataset.tutor]}</p><p>Every lesson includes time for questions, guided practice and individual feedback.</p><a class="button" href="contact.html?tutor=${encodeURIComponent(b.dataset.name)}">Ask about available batches</a>`)));
const articles=[
{
  tag: 'STUDY HABITS · 6 MIN READ',
  author: 'By Dr. Radhika Sen & Academic Mentors',
  authorShort: 'Dr. Radhika Sen',
  tutor: 'Dr. Radhika Sen',
  defaultGrade: 'Class 9–10',
  defaultSubject: 'I need guidance',
  subjects: [
    { label: 'Study habits & revision routine (I need guidance)', value: 'I need guidance' },
    { label: 'Mathematics (Dr. Radhika Sen)', value: 'Mathematics' },
    { label: 'Multiple subjects (All-round review)', value: 'Multiple subjects' }
  ],
  title: 'A Revision Routine That Actually Sticks: The Science of High-Retention Study',
  shortTitle: 'A revision routine that actually sticks',
  ctaText: 'Consult with Dr. Radhika Sen',
  intro: 'Many school students spend hours re-reading highlighted notes or staring at textbooks, only to find their minds blanking on test day. Cognitive science reveals why: <strong>passive re-reading produces the "illusion of competence"</strong>—it feels easy because the material is right in front of you, but it fails to encode knowledge into long-term retrieval pathways. Genuine, durable retention occurs only when the brain actively retrieves and reconstructs information without assistance.',
  sections: [
    {
      heading: '1. The 25/5 Pomodoro Cycle with Feynman Blurting',
      content: 'Long, continuous 2-hour study blocks lead to severe cognitive fatigue, with attention dropping by more than 50% after the 35-minute mark. To maintain peak focus, structure your study into <strong>25-minute focused sprints followed by a 5-minute cognitive rest</strong>.<br><br>During each sprint, focus strictly on one specific sub-topic (e.g., Quadratic Equations or Refraction of Light). Immediately when the timer rings, close all notes and execute <em>Feynman Blurting</em>: grab a blank sheet and write down everything you remember—formulas, definitions, diagram steps, and key conditions. Then open your textbook with a contrasting pen and check the gaps. The concepts you missed in those two minutes are the exact blind spots your brain was about to drop.'
    },
    {
      heading: '2. The Spaced Repetition Schedule (The 1-3-7-14 Day Rule)',
      content: 'Ebbinghaus’s Forgetting Curve demonstrates that learners forget up to 70% of new information within 48 hours unless it is systematically reinforced. We recommend a 4-touch review ladder:<br><ul style="margin:10px 0 0;padding-inline-start:20px;display:grid;gap:6px"><li><strong>Day 1</strong>: Initial lesson and creation of active flashcards (write questions on front, answers on back).</li><li><strong>Day 3</strong>: First recall check. Answer flashcard questions aloud or solve 2 practice problems without looking at solutions.</li><li><strong>Day 7</strong>: Interleaving session. Mix problems from this topic with two older chapters to practice identifying which formula applies where.</li><li><strong>Day 14</strong>: Timed board-pattern question drill under strict exam conditions.</li></ul>'
    },
    {
      heading: '3. Maintain an "Error Taxonomy Log"',
      content: 'Top-scoring students don’t just solve lots of questions; they deeply examine their mistakes. Instead of marking an incorrect answer with an "X" and moving on, record every missed question in a dedicated <strong>Error Logbook</strong> classified into three buckets:<br><ul style="margin:10px 0 0;padding-inline-start:20px;display:grid;gap:6px"><li><strong>Conceptual Misunderstanding</strong>: The fundamental theorem or definition was unclear (requires tutor help).</li><li><strong>Calculation or Sign Slip</strong>: The method was correct, but a minus sign or arithmetic step was rushed.</li><li><strong>Question Misread</strong>: Rushing led to answering for the wrong variable or missing a condition (e.g., finding radius instead of diameter).</li></ul><br>Every question in your Error Logbook must be re-solved cleanly from scratch 48 hours later.'
    },
    {
      heading: '4. Sleep Hygiene as an Academic Superpower',
      content: 'Memory consolidation is not an active waking task—it takes place primarily during slow-wave and REM sleep, where the hippocampus transfers temporary memories into permanent neocortical storage. Sacrificing sleep to study late before a test impairs executive cognitive function and problem-solving speed by up to 30%. Maintaining 8 hours of regular sleep is not a luxury; it is an indispensable component of high academic performance.'
    }
  ],
  takeaways: [
    'Replace passive re-reading with active recall and Feynman blurting.',
    'Space your revision across Days 1, 3, 7, and 14 to overcome the forgetting curve.',
    'Maintain an Error Taxonomy Log to eliminate repeating the same mistakes.',
    'Prioritize 8 hours of sleep for neurological memory consolidation.'
  ]
},
{
  tag: 'FOR PARENTS · 5 MIN READ',
  author: 'By Dr. Shalini Mehta (Student Wellness Advisor)',
  authorShort: 'Dr. Shalini Mehta',
  tutor: 'Dr. Shalini Mehta',
  defaultGrade: 'Class 6–8',
  defaultSubject: 'I need guidance',
  subjects: [
    { label: 'Parent counselling & student wellness (I need guidance)', value: 'I need guidance' },
    { label: 'Multiple subjects (Confidence & habits)', value: 'Multiple subjects' }
  ],
  title: 'Helping Your Child Ask Better Questions: Overcoming Hesitation & Cultivating Curiosity',
  shortTitle: 'Helping your child ask better questions',
  ctaText: 'Book counselling with Dr. Shalini Mehta',
  intro: 'When parents ask, <em>"Did you understand everything in class today?"</em>, the almost universal response is a polite, non-committal <em>"Yes"</em>. Yet a few hours later, tension, hesitation, and frustration boil over when completing evening homework. Asking questions in front of peers or admitting confusion to teachers can be intimidating for school students. Children often worry about looking "foolish" or simply lack the vocabulary to articulate where their thinking went off track. Here is how parents can dismantle this hesitation and empower students to become proactive learners.',
  sections: [
    {
      heading: '1. Replace Dead-End Inquiries with Curiosity Prompts',
      content: 'Broad, generic questions trigger defensive, one-word replies. Shift the dinner table conversation towards specific, low-pressure invitations:<br><ul style="margin:10px 0 0;padding-inline-start:20px;display:grid;gap:8px"><li>Instead of <em>"Did you understand math?"</em>, ask: <strong>"Which math problem took the longest or felt trickiest today?"</strong></li><li>Instead of <em>"Did you pay attention in science?"</em>, ask: <strong>"What was the most surprising thing your teacher demonstrated today?"</strong></li><li>Instead of <em>"Why didn’t you ask the teacher?"</em>, ask: <strong>"If we could ask your teacher one question together tomorrow, which part would help most?"</strong></li></ul>'
    },
    {
      heading: '2. Reframe Confusion as Neural Growth',
      content: 'Children naturally internalize confusion as a sign of intellectual inadequacy. However, cognitive psychology confirms that intellectual struggle—what researchers call the <strong>Zone of Proximal Development</strong>—is the exact moment new synapses are formed.<br><br>Remind your child: <em>"When a question makes you pause and scratch your head, that is your brain lifting heavy weights and growing stronger. Confusion isn’t failure; it is the starting line of real understanding."</em>'
    },
    {
      heading: '3. The 3-Step "Doubt Pinpointer" Method',
      content: 'Help your child formulate structured, confident questions using this 3-step formula:<br><ul style="margin:10px 0 0;padding-inline-start:20px;display:grid;gap:6px"><li><strong>Step 1 — Acknowledge what is clear</strong>: <em>"I understand the definition and the initial formula..."</em></li><li><strong>Step 2 — Identify the exact pivot point</strong>: <em>"...but when the example moves from step 2 to step 3, I am not sure why this term is divided..."</em></li><li><strong>Step 3 — Request a concrete demonstration</strong>: <em>"Could you show me one more example where this condition changes?"</em></li></ul><br>By teaching children this formula, questions transform from vague admissions of defeat into sharp, insightful inquiries that teachers love to answer.'
    },
    {
      heading: '4. The "Question Parking Lot" at Your Study Desk',
      content: 'Keep a small notepad or sticky notes next to your child’s study area. When they encounter an obstacle while working through homework, have them write it down on the "Parking Lot" pad rather than spiraling into anxiety. Reassure them that it is completely fine to leave that question for the morning and discuss it directly with their Northstar tutor or school educator.'
    }
  ],
  takeaways: [
    'Ask open, specific questions that invite curiosity rather than one-word defenses.',
    'Celebrate the act of asking questions as evidence of deep mental engagement.',
    'Teach the 3-step formula: What I know + Where I stopped + What I need.',
    'Implement a study-desk Question Parking Lot to reduce homework friction.'
  ]
},
{
  tag: 'EXAM PREPARATION · 6 MIN READ',
  author: 'By Prof. M. K. Narayanan & Science Pedagogy Team',
  authorShort: 'Prof. M. K. Narayanan',
  tutor: 'Prof. M. K. Narayanan',
  defaultGrade: 'Class 9–10',
  defaultSubject: 'Science',
  subjects: [
    { label: 'Science & physics pedagogy (Prof. M. K. Narayanan)', value: 'Science' },
    { label: 'Board exam preparation (Multiple subjects)', value: 'Multiple subjects' },
    { label: 'Exam strategy & anxiety coaching (I need guidance)', value: 'I need guidance' }
  ],
  title: 'From Exam Nerves to a Clear Plan: Transforming Pre-Test Anxiety into Peak Performance',
  shortTitle: 'From exam nerves to a clear plan',
  ctaText: 'Enquire about board batches with Prof. Narayanan',
  intro: 'A pounding heart, shallow breathing, and the distressing feeling of having forgotten every formula—exam anxiety is an experience familiar to more than 65% of school students before term assessments and board examinations. It is vital to recognize that <strong>nervous energy is not a sign of deficiency; it is simply adrenaline without an organized channel</strong>. When students replace unpredictable cramming with an orderly countdown plan, nervous apprehension transforms into calm, deliberate competence.',
  sections: [
    {
      heading: '1. The 3-Week Reverse Countdown Plan',
      content: 'Working backward from exam day removes the frightening unpredictability of a sprawling syllabus:<br><ul style="margin:10px 0 0;padding-inline-start:20px;display:grid;gap:6px"><li><strong>Week 3 (Diagnostic & Gap-Filling)</strong>: Audit the entire syllabus against official board chapter weightages. Spend 60% of your energy on high-weightage topics where confidence has historically been shaky.</li><li><strong>Week 2 (Active Board-Style Problem Solving)</strong>: Put aside textbooks and work directly through past 5-year board question papers. Time each section to build pacing awareness.</li><li><strong>Week 1 (Exam Simulation & Stamina)</strong>: Sit for at least two full 3-hour practice papers under strictly authentic conditions: no phone, no notes, silent room, and identical pens. Building physical and mental stamina prevents late-exam fatigue.</li></ul>'
    },
    {
      heading: '2. The "Traffic Light" Syllabus Audit',
      content: 'Take your syllabus sheet and highlight every chapter using three markers:<br><ul style="margin:10px 0 0;padding-inline-start:20px;display:grid;gap:6px"><li><strong>Green (Mastered)</strong>: You can comfortably solve 8 out of 10 board problems without hints. Needs only weekly 15-minute formula reinforcement.</li><li><strong>Amber (Needs Practice)</strong>: You grasp the theory, but stumble on multi-step numericals or complex application questions. Dedicate daily targeted problem sets here.</li><li><strong>Red (Urgent Focus)</strong>: Core concepts feel overwhelming or unclear. Flag these immediately for a 1-on-1 session with your tutor.</li></ul>'
    },
    {
      heading: '3. Real-Time Panic Reduction in the Exam Hall',
      content: 'What should a student do if anxiety strikes the moment the question paper is placed on their desk?<br><ul style="margin:10px 0 0;padding-inline-start:20px;display:grid;gap:8px"><li><strong>The 4-7-8 Parasympathetic Reset</strong>: Inhale quietly through your nose for 4 seconds, hold your breath for 7 seconds, and exhale slowly through your mouth for 8 seconds. Repeating this three times physiologically lowers heart rate, halts adrenaline spikes, and restores blood flow to the prefrontal cortex where memory retrieval occurs.</li><li><strong>The 15-Minute Reading Rule</strong>: Never start writing instantly. Use the initial 15-minute reading time to mentally star 4 questions you know perfectly. Answering these first guarantees early marks and provides a psychological confidence boost that carries you through the entire paper.</li></ul>'
    },
    {
      heading: '4. The 24-Hour Eve-of-Exam Protocol',
      content: '• <strong>Halt studying by 6:00 PM</strong>: Never try to learn brand-new chapters the evening before an exam. It creates cognitive interference and scrambles previously learned formulas.<br>• <strong>Pack your gear before sunset</strong>: Admit card/hall ticket, approved ballpoint pens, geometry tools, and water bottle.<br>• <strong>Eat a light, balanced dinner</strong>: Avoid heavy sugars or oily foods that cause sluggishness.<br>• <strong>Lights out by 10:00 PM</strong>: A well-rested brain calculates 25% faster than an exhausted one.'
    }
  ],
  takeaways: [
    'Reverse-engineer your syllabus 3 weeks out to avoid last-minute panic.',
    'Use the Traffic Light Audit (Green/Amber/Red) to prioritize study hours.',
    'Master the 4-7-8 breathing reset to maintain composure in the exam hall.',
    'Protect the final 24 hours: pack early, eat well, and prioritize restorative sleep.'
  ]
}
];
$$('[data-article]').forEach(b=>b.addEventListener('click',()=>{
  const art=articles[Number(b.dataset.article)];
  if(!art)return;
  const sectionsHtml=art.sections.map(s=>`
    <div style="margin-top:18px">
      <h3 style="font-size:1.15rem;color:var(--navy);margin-bottom:8px">${s.heading}</h3>
      <p style="font-size:0.92rem;line-height:1.68;color:var(--text);margin-bottom:0">${s.content}</p>
    </div>
  `).join('');
  const takeawaysHtml=art.takeaways.map(t=>`
    <li><i data-lucide="check" style="color:var(--green);width:16px;height:16px;flex-shrink:0"></i><span>${t}</span></li>
  `).join('');

  const makeJournalUrl=(g,s,t)=>`contact.html?tutor=${encodeURIComponent(t)}&grade=${encodeURIComponent(g)}&subject=${encodeURIComponent(s)}&article=${encodeURIComponent(art.shortTitle)}`;
  const initialUrl=makeJournalUrl(art.defaultGrade, art.defaultSubject, art.tutor);

  openDetail(`
    <article class="journal-full-article" style="padding-bottom:10px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-inline-end:48px">
        <span class="tag" style="font-size:0.75rem">${art.tag}</span>
        <span class="tiny" style="color:var(--muted);font-size:0.8rem">Northstar Learning Journal</span>
      </div>
      <h2 style="font-size:1.65rem;line-height:1.24;color:var(--navy);margin-bottom:14px;padding-inline-end:48px">${art.title}</h2>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:22px;padding-bottom:14px;border-bottom:1px solid var(--line);font-size:0.88rem;color:var(--muted)">
        <span class="icon-tile soft-purple" style="width:30px;height:30px;border-radius:50%;flex-shrink:0"><i data-lucide="user" style="width:15px;height:15px"></i></span>
        <div>
          <strong style="color:var(--navy);font-size:0.9rem;display:inline-block">${art.author}</strong>
          <span style="font-size:0.78rem;color:var(--muted);margin-left:6px">· Academic Faculty</span>
        </div>
      </div>
      <div style="background:var(--pale);border-inline-start:4px solid var(--blue);padding:16px 20px;border-radius:8px;margin-bottom:22px;font-size:0.94rem;line-height:1.65;color:var(--text)">
        ${art.intro}
      </div>
      <div style="display:grid;gap:14px;margin-bottom:26px">
        ${sectionsHtml}
      </div>
      <div style="background:var(--soft);border:1px solid var(--line);border-radius:10px;padding:22px;margin-bottom:26px">
        <h4 style="font-size:1rem;color:var(--navy);display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <i data-lucide="check-circle" style="color:var(--green);width:18px;height:18px"></i> Core Takeaways for Students &amp; Parents
        </h4>
        <ul class="check-list" style="gap:8px;font-size:0.88rem">
          ${takeawaysHtml}
        </ul>
      </div>

      <div class="journal-enquiry-box" style="background:var(--soft);border:1px solid var(--line);border-radius:12px;padding:22px;margin-top:24px">
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px">
          <span class="icon-tile soft-purple" style="width:36px;height:36px;border-radius:50%;flex-shrink:0"><i data-lucide="calendar-check" style="width:18px;height:18px"></i></span>
          <div>
            <h4 style="font-size:1.05rem;color:var(--navy);margin:0 0 4px">Put this guidance into practice</h4>
            <p style="font-size:0.86rem;color:var(--muted);margin:0;line-height:1.5">Choose your preferences below to automatically select your options on our contact page:</p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px">
          <div>
            <label for="journal-modal-grade" style="display:block;font-size:0.8rem;font-weight:600;color:var(--navy);margin-bottom:6px">Student's grade</label>
            <select id="journal-modal-grade" style="width:100%;height:40px;padding:0 12px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--text);font-size:0.88rem;cursor:pointer">
              <option value="Class 1–5"${art.defaultGrade==='Class 1–5'?' selected':''}>Class 1–5 (Primary)</option>
              <option value="Class 6–8"${art.defaultGrade==='Class 6–8'?' selected':''}>Class 6–8 (Middle School)</option>
              <option value="Class 9–10"${art.defaultGrade==='Class 9–10'?' selected':''}>Class 9–10 (Secondary / Board)</option>
              <option value="Class 11–12"${art.defaultGrade==='Class 11–12'?' selected':''}>Class 11–12 (Senior Secondary)</option>
            </select>
          </div>
          <div>
            <label for="journal-modal-subject" style="display:block;font-size:0.8rem;font-weight:600;color:var(--navy);margin-bottom:6px">Subject / Focus area</label>
            <select id="journal-modal-subject" style="width:100%;height:40px;padding:0 12px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--text);font-size:0.88rem;cursor:pointer">
              ${art.subjects.map(s=>`<option value="${s.value}"${s.value===art.defaultSubject?' selected':''}>${s.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label for="journal-modal-tutor" style="display:block;font-size:0.8rem;font-weight:600;color:var(--navy);margin-bottom:6px">Preferred tutor</label>
            <select id="journal-modal-tutor" style="width:100%;height:40px;padding:0 12px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--text);font-size:0.88rem;cursor:pointer">
              <option value="${art.tutor}" selected>${art.tutor} (${art.authorShort===art.tutor?'Author':'Mentor'})</option>
              <option value="">No preference / Any tutor</option>
            </select>
          </div>
        </div>

        <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between;border-top:1px solid var(--line);padding-top:16px">
          <a id="journal-modal-cta" class="button" href="${initialUrl}"><span>${art.ctaText}</span> <i data-lucide="arrow-right"></i></a>
          <button type="button" class="button secondary close-dialog-btn">Close article</button>
        </div>
      </div>
    </article>
  `);

  const gradeSel=$('#journal-modal-grade');
  const subjSel=$('#journal-modal-subject');
  const tutorSel=$('#journal-modal-tutor');
  const ctaBtn=$('#journal-modal-cta');

  const updateModalCta=()=>{
    if(!ctaBtn)return;
    const g=gradeSel?gradeSel.value:art.defaultGrade;
    const s=subjSel?subjSel.value:art.defaultSubject;
    const t=tutorSel?tutorSel.value:art.tutor;
    ctaBtn.href=makeJournalUrl(g,s,t);
  };

  gradeSel?.addEventListener('change',updateModalCta);
  subjSel?.addEventListener('change',updateModalCta);
  tutorSel?.addEventListener('change',updateModalCta);
}));
const achievements={'cbse':['98%','97%','96%'],'icse':['97%','96%','95%'],'12':['96%','98%','97%']};$('[data-results-tabs]')?.addEventListener('tabchange',e=>{if(e.detail==='achievements'){$('[data-results-podium]').hidden=true;$('[data-other-achievements]').hidden=false}else{$('[data-results-podium]').hidden=false;$('[data-other-achievements]').hidden=true;$$('[data-result-score]').forEach((x,i)=>x.textContent=achievements[e.detail][i]);$$('[data-result-class]').forEach(x=>x.textContent=e.detail==='12'?'Class 12 · 2026':`Class 10 · ${e.detail.toUpperCase()} · 2026`)}});
const countdown=$('[data-countdown]');if(countdown){const target=new Date('2027-01-15T09:00:00+05:30').getTime();const tick=()=>{let t=Math.max(0,target-Date.now());const values=[Math.floor(t/864e5),Math.floor(t/36e5)%24,Math.floor(t/6e4)%60,Math.floor(t/1000)%60];$$('strong',countdown).forEach((x,i)=>x.textContent=String(values[i]).padStart(2,'0'));if(!t){$('[data-launch-text]').textContent='Our new learning space is opening soon.'}};tick();setInterval(tick,1000)}
const params=new URLSearchParams(location.search);
if(courseTabs&&params.has('grade')){
  $$('[role=tab]',courseTabs).find(t=>t.dataset.value===params.get('grade'))?.click();
}
const contactForm=$('form[data-form=contact]');
if(contactForm){
  const gradeSelect=$('[name=grade]',contactForm);
  const subjectSelect=$('[name=subject]',contactForm);
  const tutorSelect=$('[name=tutor]',contactForm);
  const messageInput=$('[name=message]',contactForm);
  const norm=s=>(s||'').replace(/[–—]/g,'-').toLowerCase().trim();

  // Helper dictionary mapping tutor disciplines
  const tutorDisciplines = {
    'radhika': 'Mathematics',
    'rohit': 'Mathematics',
    'narayanan': 'Science',
    'priya': 'Science',
    'kavita': 'English',
    'arjun': 'Social Studies',
    'shalini': 'I need guidance'
  };

  const findTutorOption = (query) => {
    if (!tutorSelect || !query) return null;
    const target = norm(query);
    // 1. Exact value or text match
    let found = Array.from(tutorSelect.options).find(o => norm(o.value) === target || norm(o.text) === target);
    if (found) return found;
    // 2. Substring match
    found = Array.from(tutorSelect.options).find(o => {
      const v = norm(o.value), t = norm(o.text);
      return v && (v.includes(target) || target.includes(v) || t.includes(target));
    });
    return found;
  };

  // 1. Automatically select Grade in dropdown
  if(gradeSelect&&(params.has('grade')||params.has('gradeBand'))){
    const rawG=params.get('grade')||params.get('gradeBand');
    const target=norm(rawG);
    let matchedG=Array.from(gradeSelect.options).find(o=>{
      const v=norm(o.value), t=norm(o.text);
      return v===target||t===target||v==='class '+target||t==='class '+target;
    });
    if(!matchedG){
      matchedG=Array.from(gradeSelect.options).find(o=>{
        const v=norm(o.value), t=norm(o.text);
        return v.includes(target)||t.includes(target);
      });
    }
    if(matchedG){
      gradeSelect.value=matchedG.value;
      gradeSelect.dispatchEvent(new Event('change',{bubbles:true}));
    }
  }

  // 2. Automatically select Tutor in dropdown
  if(tutorSelect&&params.has('tutor')){
    const matchedT = findTutorOption(params.get('tutor'));
    if(matchedT){
      tutorSelect.value = matchedT.value;
      tutorSelect.dispatchEvent(new Event('change',{bubbles:true}));
    }
  }

  // 3. Automatically select Subject / Plan in dropdown
  if(subjectSelect){
    let matchedS=null;
    if(params.has('subject')){
      const sTarget=norm(params.get('subject'));
      matchedS=Array.from(subjectSelect.options).find(o=>norm(o.value)===sTarget||norm(o.text)===sTarget);
    }
    if(!matchedS&&params.has('plan')){
      const pTarget=norm(params.get('plan'));
      matchedS=Array.from(subjectSelect.options).find(o=>norm(o.value)===pTarget||norm(o.text)===pTarget);
    }
    if(!matchedS&&params.has('subjects')){
      const count=parseInt(params.get('subjects'),10);
      const planName=count+' subject'+(count===1?'':'s');
      matchedS=Array.from(subjectSelect.options).find(o=>norm(o.value)===planName||norm(o.text)===planName);
      if(!matchedS){
        if(count>1){
          matchedS=Array.from(subjectSelect.options).find(o=>norm(o.value)==='multiple subjects'||norm(o.text)==='multiple subjects');
        }else if(count===1){
          matchedS=Array.from(subjectSelect.options).find(o=>norm(o.value)==='1 subject'||norm(o.text)==='1 subject'||norm(o.value)==='i need guidance');
        }
      }
    }
    if(!matchedS&&(params.has('tutor')||tutorSelect?.value)){
      const tVal = norm(tutorSelect?.value || params.get('tutor'));
      for(const [key, subj] of Object.entries(tutorDisciplines)){
        if(tVal.includes(key)){
          matchedS = Array.from(subjectSelect.options).find(o=>norm(o.value)===norm(subj)||norm(o.text)===norm(subj));
          if(matchedS) break;
        }
      }
    }
    if(matchedS){
      subjectSelect.value=matchedS.value;
      subjectSelect.dispatchEvent(new Event('change',{bubbles:true}));
    }
  }

  // If user changes tutor manually on the contact page, automatically suggest corresponding subject
  if(tutorSelect&&subjectSelect){
    tutorSelect.addEventListener('change', (e) => {
      if(!e.isTrusted && params.has('subject')) return;
      const chosenTutor = norm(tutorSelect.value);
      if(!chosenTutor) return;
      if(!subjectSelect.value || subjectSelect.value === 'I need guidance'){
        for(const [key, subj] of Object.entries(tutorDisciplines)){
          if(chosenTutor.includes(key)){
            const opt = Array.from(subjectSelect.options).find(o=>norm(o.value)===norm(subj)||norm(o.text)===norm(subj));
            if(opt){
              subjectSelect.value = opt.value;
              subjectSelect.dispatchEvent(new Event('change',{bubbles:true}));
            }
            break;
          }
        }
      }
    });
  }

  // 4. Pre-fill Message with plan, tutor, journal article, and pricing context
  if(messageInput&&(params.has('grade')||params.has('gradeBand')||params.has('subjects')||params.has('plan')||params.has('subject')||params.has('tutor')||params.has('article')||params.has('topic'))){
    const rawG=params.get('grade')||params.get('gradeBand')||'';
    const gradeFormatted=rawG?(rawG.toLowerCase().startsWith('class')?rawG:'Classes '+rawG):'';
    const planName=params.get('plan')||(params.get('subjects')?params.get('subjects')+' Subject'+(params.get('subjects')==='1'?'':'s'):'');
    const price=params.get('price');
    const priceText=price?` (${price} / month)`:'';
    const tutorParam=tutorSelect?.value || params.get('tutor') || '';
    const subjectParam=subjectSelect?.value || params.get('subject') || '';

    if(params.has('article')){
      const artTitle = params.get('article');
      const tutorPart = tutorParam ? ` with ${tutorParam}` : '';
      const gradePart = gradeFormatted ? ` for ${gradeFormatted}` : '';
      const subjPart = subjectParam && norm(subjectParam) !== 'i need guidance' ? ` in ${subjectParam}` : '';
      messageInput.value = `I read your Learning Journal article "${artTitle}" and would like to enquire about guidance and available batches${tutorPart}${gradePart}${subjPart}. Please share batch timings and consultation availability.`;
    } else if(params.has('topic')){
      const topicTitle = params.get('topic');
      messageInput.value = `I would like to request the free ${topicTitle} (Weekly Revision Planner, Formula Quick-Sheets, Exam Morning Checklist) mentioned in the Learning Journal. Please share how we can access them.`;
    } else if(tutorParam && gradeFormatted){
      messageInput.value=`I would like to enquire about available batches with ${tutorParam} for ${gradeFormatted}. Please share batch timings and trial session availability.`;
    } else if(tutorParam){
      messageInput.value=`I would like to enquire about available batches with ${tutorParam}. Please share batch timings and enrollment details.`;
    } else if(planName&&gradeFormatted){
      messageInput.value=`I would like to enquire about the ${planName} plan${priceText} for ${gradeFormatted}. Please share available batch timings and enrollment details.`;
    } else if(params.has('subject')){
      messageInput.value=`I would like to enquire about the ${params.get('subject')} programme${gradeFormatted?' for '+gradeFormatted:''}. Please share available batch timings and syllabus details.`;
    } else if(gradeFormatted){
      messageInput.value=`I would like to enquire about courses for ${gradeFormatted}. Please share available subject options and batch timings.`;
    }
  }

  // 5. Render selected plan / tutor / journal notification banner inside the form
  if((params.has('grade')||params.has('gradeBand')||params.has('subjects')||params.has('plan')||params.has('subject')||params.has('tutor')||params.has('article')||params.has('topic'))&&!document.getElementById('selected-plan-banner')){
    const rawG=params.get('grade')||params.get('gradeBand')||'';
    const gFormatted=rawG?(rawG.toLowerCase().startsWith('class')?rawG:'Classes '+rawG):'';
    const planName=params.get('plan')||(params.get('subjects')?params.get('subjects')+' Subject'+(params.get('subjects')==='1'?'':'s'):'');
    const tutorName=tutorSelect?.value || (params.get('tutor') ? params.get('tutor') : '');
    const subjectName=subjectSelect?.value || params.get('subject') || '';
    const articleName=params.get('article');
    const topicName=params.get('topic');
    const price=params.get('price');
    const priceFormatted=price?` · ${price} / month`:'';
    const banner=document.createElement('div');
    banner.id='selected-plan-banner';
    banner.style.cssText='margin-bottom:22px;padding:14px 18px;border-radius:10px;background:var(--soft);border:1px solid var(--line);font-size:.9rem;display:flex;align-items:center;justify-content:space-between;gap:12px;';

    let headingText = '';
    let subtitleText = '';
    let badgeText = 'Auto-Selected';

    if(articleName){
      const items = [gFormatted, subjectName, tutorName ? `Tutor: ${tutorName}` : ''].filter(Boolean).join(' · ');
      headingText = `Enquiring from Learning Journal: "${articleName}"`;
      subtitleText = items ? `${items} · Form options auto-selected from your journal selection` : 'Form options auto-selected from your journal selection';
      badgeText = 'From Journal';
    } else if(topicName){
      headingText = `Requesting: ${topicName}`;
      subtitleText = 'Form options auto-selected from your Learning Journal selection';
      badgeText = 'From Journal';
    } else {
      const enquiryItems = [gFormatted, planName||params.get('subject'), tutorName?`Tutor: ${tutorName}`:''].filter(Boolean).join(' · ');
      headingText = `Enquiring about: ${enquiryItems}`;
      subtitleText = tutorName ? 'Preferred tutor & batch options auto-selected below' : 'Tuition plan' + priceFormatted + ' · Form options auto-selected below';
    }

    banner.innerHTML=`<div style="display:flex;align-items:center;gap:12px"><span class="icon-tile soft-green" style="width:34px;height:34px;flex-shrink:0"><i data-lucide="check" style="width:18px;height:18px"></i></span><div><strong style="color:var(--navy);display:block;font-size:.92rem">${headingText}</strong><span style="font-size:.82rem;color:var(--muted)">${subtitleText}</span></div></div><span class="tag" style="margin:0;font-size:.7rem;padding:3px 8px;background:var(--pale);color:var(--blue);border-radius:4px;white-space:nowrap">${badgeText}</span>`;
    const formHeading=contactForm.querySelector('h2');
    if(formHeading&&formHeading.nextSibling){
      formHeading.parentNode.insertBefore(banner,formHeading.nextSibling);
    }else{
      contactForm.prepend(banner);
    }
    refreshIcons();
  }

  // 6. Scroll smoothly to form if came from an enquiry action
  if(params.has('grade')||params.has('gradeBand')||params.has('subjects')||params.has('plan')||params.has('subject')||params.has('tutor')||params.has('article')||params.has('topic')){
    setTimeout(()=>{contactForm.scrollIntoView({behavior:'smooth',block:'center'})},120);
  }
}
})();
