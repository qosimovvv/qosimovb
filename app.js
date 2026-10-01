const teachers = [
  {name:'Madina Abdurahmonova', subject:'Matematika', location:'Andijon', format:'Online', experience:'7 yil tajriba', price:80000, rating:'5.0', verified:true, certificate:'Matematika bo‘yicha milliy sertifikat', image:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'},
  {name:"Azizbek Toshpo'latov", subject:'Ingliz tili', location:'Toshkent', format:'Online', experience:'5 yil tajriba', price:100000, rating:'4.9', verified:true, certificate:'IELTS 8.0 sertifikati', image:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'},
  {name:"Zarina Yo'ldosheva", subject:'Fizika', location:'Samarqand', format:'Offline', experience:'9 yil tajriba', price:70000, rating:'4.9', verified:true, certificate:'Fizika fani o‘qituvchisi diplomi', image:'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=300&q=80'},
  {name:'Javohir Qodirov', subject:'Kimyo', location:'Farg\'ona', format:'Online', experience:'4 yil tajriba', price:60000, rating:'4.8', verified:false, certificate:'', image:'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'},
  {name:'Nilufar Ismoilova', subject:'Ona tili', location:'Namangan', format:'Offline', experience:'11 yil tajriba', price:50000, rating:'5.0', verified:true, certificate:'Pedagogika oliy ma’lumot diplomi', image:'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80'},
  {name:'Sardor Karimov', subject:'Matematika', location:'Toshkent', format:'Online', experience:'6 yil tajriba', price:120000, rating:'4.9', verified:false, certificate:'', image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'}
];
const grid = document.querySelector('#teacher-grid');
const results = document.querySelector('#results-count');
const empty = document.querySelector('#empty-state');
const formatMoney = amount => new Intl.NumberFormat('uz-UZ').format(amount);
function renderTeachers(list = teachers) {
  grid.innerHTML = list.map(teacher => `<article class="teacher-card"><img class="teacher-avatar" src="${teacher.image}" alt="${teacher.name}"><div class="teacher-info"><h3>${teacher.name}</h3><div class="teacher-subject">${teacher.subject}</div><div class="teacher-details"><span>⌖ ${teacher.location}</span><span>◉ ${teacher.format}</span></div>${teacher.verified ? '<span class="verification-badge">✓ Tasdiqlangan ustoz</span>' : ''}</div><div class="teacher-bottom"><span class="teacher-price"><strong>${formatMoney(teacher.price)}</strong> so'm / soat <span> · ★ ${teacher.rating}</span></span><button class="contact-button" data-contact="${teacher.name}">${teacher.verified ? 'Sertifikatni ko\'rish' : 'Bog\'lanish'}</button></div></article>`).join('');
  results.textContent = `${list.length} ta ustoz`;
  empty.hidden = list.length > 0;
}
function filterTeachers() {
  const subject = document.querySelector('#subject-filter').value;
  const location = document.querySelector('#location-filter').value;
  const format = document.querySelector('#format-filter').value;
  const maxPrice = Number(document.querySelector('#price-filter').value);
  renderTeachers(teachers.filter(teacher => (!subject || teacher.subject === subject) && (!location || teacher.location === location) && (!format || teacher.format === format) && (!maxPrice || teacher.price <= maxPrice)));
}
document.querySelector('#search-form').addEventListener('submit', event => { event.preventDefault(); filterTeachers(); document.querySelector('#ustozlar').scrollIntoView({behavior:'smooth'}); });
document.querySelector('#reset-filters').addEventListener('click', () => { document.querySelector('#search-form').reset(); renderTeachers(); });
const modal = document.querySelector('#teacher-modal');
document.querySelectorAll('[data-open-modal]').forEach(button => button.addEventListener('click', () => { modal.hidden = false; document.querySelector('#teacher-form').hidden = false; document.querySelector('#form-success').hidden = true; }));
document.querySelector('[data-close-modal]').addEventListener('click', () => { modal.hidden = true; });
modal.addEventListener('click', event => { if(event.target === modal) modal.hidden = true; });
document.addEventListener('keydown', event => { if(event.key === 'Escape') modal.hidden = true; });
document.querySelector('#teacher-form').addEventListener('submit', async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Yuborilmoqda...';
  try {
    const response = await fetch('/api/teachers', { method: 'POST', body: new FormData(form) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Ariza yuborilmadi.');
    form.hidden = true;
    document.querySelector('#form-success').hidden = false;
  } catch (error) {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Profilni tekshiruvga yuborish <span>→</span>';
    document.querySelector('#form-success').textContent = `Serverga ulanishda muammo: ${error.message}`;
    document.querySelector('#form-success').hidden = false;
  }
});
const certificateInput = document.querySelector('#certificate-input');
const certificateList = document.querySelector('#certificate-list');
certificateInput.addEventListener('change', () => { certificateList.innerHTML = Array.from(certificateInput.files).map(file => `<span class="certificate-chip">✓ ${file.name}</span>`).join(''); });
document.querySelector('#profile-input').addEventListener('change', event => { const file = event.target.files[0]; document.querySelector('#profile-preview').textContent = file ? `✓ ${file.name} tanlandi` : ''; });
grid.addEventListener('click', event => { const button = event.target.closest('[data-contact]'); if(button) { const teacher = teachers.find(item => item.name === button.dataset.contact); alert(teacher.verified ? `${teacher.name}: ${teacher.certificate}` : `${teacher.name} bilan bog'lanish funksiyasi tez orada ishlaydi.`); } });

const rotateOptions = (answer, distractors, index) => { const options = [answer, ...distractors]; const shift = index % options.length; return {options:options.slice(shift).concat(options.slice(0, shift)), correct:(options.length - shift) % options.length}; };
function generateMathQuestions() { const templates = [index => { const a = index % 19 + 2; const x = index % 47 + 1; const b = index % 23 + 1; return {question:`${a}x + ${b} = ${a * x + b} bo‘lsa, x nechaga teng?`, answer:String(x), wrong:[String(x + 1),String(x - 1),String(x + 2)], topic:'Algebra'}; }, index => { const w = index % 12 + 3; const h = index % 9 + 2; return {question:`Tomonlari ${w} sm va ${h} sm bo‘lgan to‘g‘ri to‘rtburchak yuzasi nechaga teng?`, answer:String(w * h), wrong:[String(w + h),String(w * 2 + h),String(w * h + 2)], topic:'Geometriya'}; }, index => { const n = index % 8 + 2; const p = index % 5 * 10 + 10; const answer = n * 10 * p / 100; return {question:`${n * 10} sonining ${p}% i nechaga teng?`, answer:String(answer), wrong:[String(answer + 2),String(answer - 2),String(answer * 2)], topic:'Foizlar'}; }, index => { const a = index % 7 + 2; const d = index % 5 + 2; return {question:`${a}, ${a + d}, ${a + d * 2}, ... ketma-ketlikdagi 5-sonni toping.`, answer:String(a + d * 4), wrong:[String(a + d * 3),String(a + d * 5),String(a * d)], topic:'Ketma-ketliklar'}; }, index => { const r = index % 8 + 2; return {question:`Radiusi ${r} sm bo‘lgan doiraning diametri nechaga teng?`, answer:String(r * 2), wrong:[String(r),String(r * 3),String(r * r)], topic:'Geometriya'}; }]; return Array.from({length:1000}, (_item, index) => { const item = templates[index % templates.length](index); const choices = rotateOptions(item.answer, item.wrong, index); return {question:item.question, ...choices, topic:item.topic}; }); }
function generateEnglishQuestions() { const templates = [index => ({question:'Choose the correct sentence: She ___ to school every day.', answer:['goes','reads','works','plays','studies'][index % 5], wrong:['go','going','gone'], topic:'Grammar'}), index => ({question:'“Reliable” so‘zining o‘zbekcha ma’nosi qaysi?', answer:'Ishonchli', wrong:['Tezkor','Qimmat','Qiziqarli'], topic:'Vocabulary'}), index => ({question:'I have lived here ___ 2020.', answer:'since', wrong:['for','at','from'], topic:'Grammar'}), index => ({question:'If I ___ more time, I would travel.', answer:'had', wrong:['have','will have','having'], topic:'Conditionals'}), index => ({question:'“Environment” so‘zining tarjimasi qaysi?', answer:'Atrof-muhit', wrong:['Imkoniyat','Sog‘liq','Tajriba'], topic:'Vocabulary'})]; return Array.from({length:1000}, (_item, index) => { const item = templates[index % templates.length](index); const choices = rotateOptions(item.answer, item.wrong, index); return {question:item.question, ...choices, topic:item.topic}; }); }
function generateHistoryQuestions() { const facts = [['Amir Temur davlatining poytaxti qaysi shahar bo‘lgan?','Samarqand',['Buxoro','Xiva','Toshkent'],'O‘zbekiston tarixi'],['“Boburnoma” asarining muallifi kim?','Zahiriddin Muhammad Bobur',['Alisher Navoiy','Mirzo Ulug‘bek','Beruniy'],'Adabiy meros'],['O‘zbekiston mustaqilligi qachon e’lon qilingan?','1991-yil',['1990-yil','1992-yil','1995-yil'],'Mustaqillik tarixi'],['Mirzo Ulug‘bek qaysi sohada mashhur bo‘lgan?','Astronomiya',['Tibbiyot','Me’morchilik','Musiqa'],'Ilm-fan tarixi'],['Qadimgi Misr yozuvi qanday atalgan?','Iyeroglif',['Mixxat','Lotin','Runik'],'Qadimgi dunyo'],['“Xamsa” asari nechta dostondan iborat?','5 ta',['3 ta','4 ta','7 ta'],'Adabiyot tarixi'],['Ikkinchi jahon urushi qaysi yilda tugagan?','1945-yil',['1941-yil','1943-yil','1947-yil'],'Jahon tarixi']]; return Array.from({length:1000}, (_item, index) => { const fact = facts[index % facts.length]; const choices = rotateOptions(fact[1], fact[2], index); return {question:fact[0], ...choices, topic:fact[3]}; }); }
const quizBank = {'Matematika':generateMathQuestions(), 'Ingliz tili':generateEnglishQuestions(), 'Tarix':generateHistoryQuestions()};
let quizState = {questions:[], index:0, score:0, answered:0, wrongTopics:[]};
let currentQuestionAnswered = false;
const quizStart = document.querySelector('#quiz-start');
const quizQuestion = document.querySelector('#quiz-question');
const quizResult = document.querySelector('#quiz-result');
function renderQuizQuestion() {
  const question = quizState.questions[quizState.index];
  currentQuestionAnswered = false;
  document.querySelector('#question-number').textContent = `${quizState.index + 1}-savol`;
  document.querySelector('#question-topic').textContent = question.topic;
  document.querySelector('#question-text').textContent = question.question;
  document.querySelector('#answer-options').innerHTML = question.options.map((option, index) => `<button class="answer-option" data-answer="${index}">${option}</button>`).join('');
  document.querySelector('#answer-feedback').hidden = true;
  document.querySelector('#next-question').hidden = true;
  document.querySelector('#finish-quiz').hidden = false;
}
const shuffleQuestions = questions => [...questions].sort(() => Math.random() - 0.5);
document.querySelector('#start-quiz').addEventListener('click', () => { quizState = {questions:shuffleQuestions(quizBank[document.querySelector('#quiz-subject').value]), index:0, score:0, answered:0, wrongTopics:[]}; quizStart.hidden = true; quizResult.hidden = true; document.querySelector('#quiz-result-actions').hidden = true; quizQuestion.hidden = false; renderQuizQuestion(); });
document.querySelector('#answer-options').addEventListener('click', event => {
  const button = event.target.closest('[data-answer]');
  if (!button || currentQuestionAnswered) return;
  currentQuestionAnswered = true;
  const question = quizState.questions[quizState.index];
  const answer = Number(button.dataset.answer);
  quizState.answered += 1;
  document.querySelectorAll('.answer-option').forEach(option => { option.disabled = true; if(Number(option.dataset.answer) === question.correct) option.classList.add('correct'); });
  const feedback = document.querySelector('#answer-feedback');
  if(answer === question.correct) { quizState.score += 1; feedback.textContent = 'To‘g‘ri! +50 XP'; feedback.className = 'answer-feedback'; } else { button.classList.add('wrong'); quizState.wrongTopics.push(question.topic); feedback.textContent = `Bu savol ${question.topic} mavzusidan edi. Shu mavzuni takrorlab ko‘ring.`; feedback.className = 'answer-feedback wrong'; }
  feedback.hidden = false;
  document.querySelector('#next-question').hidden = false;
  document.querySelector('#finish-quiz').hidden = false;
});
document.querySelector('#next-question').addEventListener('click', () => { quizState.index += 1; if(quizState.index >= quizState.questions.length) quizState.questions = shuffleQuestions(quizState.questions); quizState.index %= quizState.questions.length; renderQuizQuestion(); });
function finishQuiz() { const total = quizState.answered; const missed = [...new Set(quizState.wrongTopics)]; quizQuestion.hidden = true; quizResult.hidden = false; document.querySelector('#quiz-result-actions').hidden = false; const feedback = total ? (missed.length ? `Ko‘proq mashq kerak: ${missed.map(topic => `<span class="weak-topic">${topic}</span>`).join('')}` : 'Ajoyib! Barcha javoblaringiz to‘g‘ri.') : 'Hali javob berilmadi. Testni davom ettirib, natijangizni oling.'; quizResult.innerHTML = `<strong>${quizState.score} / ${total} to‘g‘ri</strong>${feedback}`; if(total) updateXp(quizState.score * 50); }
document.querySelector('#finish-quiz').addEventListener('click', finishQuiz);
document.querySelector('#quit-quiz').addEventListener('click', () => { quizQuestion.hidden = true; quizResult.hidden = true; document.querySelector('#quiz-result-actions').hidden = true; quizStart.hidden = false; });
document.querySelector('#other-subject').addEventListener('click', () => { quizResult.hidden = true; document.querySelector('#quiz-result-actions').hidden = true; quizStart.hidden = false; });
document.querySelector('#close-quiz').addEventListener('click', () => { quizResult.hidden = true; document.querySelector('#quiz-result-actions').hidden = true; quizStart.hidden = false; });

const psychQuestions = [
  {question:'Yangi mavzuni qanday o‘zlashtirish sizga qulay?', options:[['Video, rasm va sxemalar orqali','visual'],['Ustozni tinglab va suhbat orqali','auditory'],['Mashq qilib, o‘zim sinab ko‘rib','practice']]},
  {question:'Qiyin mavzuga duch kelganda nima qilasiz?', options:[['Uni chizib yoki jadvalga solib chiqaman','visual'],['Boshqa odam bilan muhokama qilaman','auditory'],['Masalani bo‘lib, amalda yechaman','practice']]},
  {question:'Ideal dars siz uchun qanday bo‘ladi?', options:[['Ko‘rgazmali va tartibli','visual'],['Savol-javobga boy','auditory'],['Ko‘p topshiriq va tajribali','practice']]},
  {question:'Eslab qolishda qaysi usul kuchliroq?', options:[['Rangli konspekt va xaritalar','visual'],['Ovoz chiqarib takrorlash','auditory'],['Test va amaliy vazifalar','practice']]},
  {question:'Ustozdan eng ko‘p nimani kutasiz?', options:[['Aniq grafik va misollarni','visual'],['Tushuntirish va fikr almashishni','auditory'],['Xatolarimni ko‘rsatib, mashq berishini','practice']]}
];
let psychState = {index:0, scores:{visual:0,auditory:0,practice:0}};
const psychStart = document.querySelector('#psych-start');
const psychQuestion = document.querySelector('#psych-question');
const psychResult = document.querySelector('#psych-result');
function renderPsychQuestion() { const item = psychQuestions[psychState.index]; document.querySelector('#psych-number').textContent = `${psychState.index + 1} / ${psychQuestions.length}`; document.querySelector('#psych-text').textContent = item.question; document.querySelector('#psych-options').innerHTML = item.options.map(option => `<button class="answer-option" data-style="${option[1]}">${option[0]}</button>`).join(''); }
document.querySelector('#start-psych').addEventListener('click', () => { psychState = {index:0,scores:{visual:0,auditory:0,practice:0}}; psychStart.hidden = true; psychResult.hidden = true; psychQuestion.hidden = false; renderPsychQuestion(); });
document.querySelector('#psych-options').addEventListener('click', event => { const option = event.target.closest('[data-style]'); if(!option) return; psychState.scores[option.dataset.style] += 1; psychState.index += 1; if(psychState.index < psychQuestions.length) return renderPsychQuestion(); const type = Object.entries(psychState.scores).sort((_a, _b) => _b[1] - _a[1])[0][0]; const results = {visual:['Vizual o‘rganuvchi','Sizga video, diagramma, rangli konspekt va ko‘rgazmali darslar mos keladi.'],auditory:['Muloqotchi o‘rganuvchi','Sizga suhbat, savol-javob, audio darslar va ustoz bilan faol muloqot mos keladi.'],practice:['Amaliy o‘rganuvchi','Sizga ko‘proq mashq, test, real misol va natijani darhol tekshirish mos keladi.']}; psychQuestion.hidden = true; psychResult.hidden = false; psychResult.innerHTML = `<span class="psych-result-title">${results[type][0]}</span>${results[type][1]}<br><small>Bu tavsiya faqat o‘qish uslubingizni tanlashga yordam beradi.</small>`; updateXp(100); });

const planTemplates = {ielts:['Listening: kundalik 20 daqiqa','Reading: 2 ta matn va yangi so‘zlar','Writing: Task 1 va xatolar tahlili','Speaking: 15 daqiqa suhbat'], math:['Algebra asoslari va formulalar','Tenglamalar bo‘yicha 20 ta mashq','Geometriya: shakllar va isbotlar','Aralash imtihon varianti'], english:['100 ta kundalik so‘z','Present va past zamonlar','Audio tinglash va shadowing','Erkin suhbat: 20 daqiqa']};
document.querySelector('#goal-form').addEventListener('submit', event => { event.preventDefault(); const target = document.querySelector('#goal-target').value; const hours = document.querySelector('#goal-hours').value; const goalResult = document.querySelector('#goal-result'); goalResult.hidden = false; goalResult.innerHTML = `<strong>Shu haftadagi reja · ${hours} soat</strong>${planTemplates[target].map((item, index) => `<div class="plan-week"><b>0${index + 1}</b><span>${item}</span></div>`).join('')}`; });

let xp = 8240;
let streak = 12;
function updateXp(amount) { xp += amount; document.querySelector('#xp-value').textContent = `${formatMoney(xp)} XP`; document.querySelector('#leader-xp').textContent = formatMoney(xp); document.querySelector('#level-progress').style.width = `${Math.min(100, Math.round((xp % 5000) / 50))}%`; document.querySelector('#level-value').textContent = `Level ${Math.floor(xp / 1500) + 3}`; }
document.querySelector('#streak-button').addEventListener('click', event => { if(event.currentTarget.dataset.done) return; event.currentTarget.dataset.done = 'true'; streak += 1; updateXp(20); document.querySelector('#streak-value').textContent = `${streak} kun`; event.currentTarget.innerHTML = 'Bugungi streak bajarildi <b>✓</b>'; });
async function loadVerifiedTeachers() {
  try {
    const response = await fetch('/api/teachers');
    if (!response.ok) return;
    const verifiedTeachers = await response.json();
    if (!verifiedTeachers.length) return;
    teachers.push(...verifiedTeachers.map(teacher => ({ ...teacher, image: teacher.profile || teachers[0].image })));
    renderTeachers();
  } catch (_error) {
    // The static demo data remains available when the backend is not running.
  }
}
loadVerifiedTeachers();
renderTeachers();
