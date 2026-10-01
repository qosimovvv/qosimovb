const keyInput = document.querySelector('#admin-key');
const list = document.querySelector('#admin-list');
const message = document.querySelector('#admin-message');
const key = () => keyInput.value.trim();
function showMessage(text, error = false) { message.textContent = text; message.style.color = error ? '#b34e3e' : '#688178'; }
function render(teachers) {
  if (!teachers.length) { list.innerHTML = '<div class="admin-message" style="padding:20px">Hozircha arizalar yo‘q.</div>'; return; }
  list.innerHTML = teachers.map(teacher => `<div class="admin-row"><strong>${teacher.name}</strong><span>${teacher.subject}<br>${teacher.location}</span><span>${(teacher.certificates || []).map(file => `<a href="${file.url}" target="_blank">${file.name}</a>`).join('<br>')}</span><span class="admin-status ${teacher.status}">${teacher.status === 'pending' ? 'Kutilmoqda' : teacher.status === 'verified' ? 'Tasdiqlangan' : 'Rad etilgan'}</span><span>${teacher.status === 'pending' ? `<button class="verify-button" data-id="${teacher.id}" data-status="verified">Tasdiqlash</button><button class="reject-button" data-id="${teacher.id}" data-status="rejected">Rad etish</button>` : 'Ko‘rib chiqilgan'}</span></div>`).join('');
}
async function loadTeachers() {
  if (!key()) return showMessage('Admin kalitini kiriting.', true);
  const response = await fetch('/api/admin/teachers', { headers: { 'x-admin-key': key() } });
  const data = await response.json();
  if (!response.ok) return showMessage(data.error || 'Yuklashda xato.', true);
  render(data); showMessage(`${data.length} ta ariza topildi.`);
}
document.querySelector('#load-button').addEventListener('click', loadTeachers);
list.addEventListener('click', async event => {
  const button = event.target.closest('[data-id]');
  if (!button) return;
  const response = await fetch(`/api/admin/teachers/${button.dataset.id}/verify`, { method: 'POST', headers: {'Content-Type':'application/json', 'x-admin-key': key()}, body: JSON.stringify({status: button.dataset.status}) });
  const data = await response.json();
  if (!response.ok) return showMessage(data.error || 'Amal bajarilmadi.', true);
  showMessage(button.dataset.status === 'verified' ? 'Ustoz tasdiqlandi va ommaviy ro‘yxatga qo‘shildi.' : 'Ariza rad etildi.');
  loadTeachers();
});
