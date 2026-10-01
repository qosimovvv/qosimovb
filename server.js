const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || 'ustoztop-admin-2026';
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const UPLOAD_DIR = path.join(ROOT, 'uploads');
const DB_FILE = path.join(DATA_DIR, 'teachers.json');
for (const directory of [DATA_DIR, UPLOAD_DIR]) fs.mkdirSync(directory, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, '[]', 'utf8');

const readTeachers = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const writeTeachers = teachers => fs.writeFileSync(DB_FILE, JSON.stringify(teachers, null, 2), 'utf8');
const safeName = value => String(value || 'file').replace(/[^a-zA-Z0-9._-]/g, '-');
const storage = multer.diskStorage({
  destination: (_request, _file, callback) => callback(null, UPLOAD_DIR),
  filename: (_request, file, callback) => callback(null, `${Date.now()}-${crypto.randomBytes(5).toString('hex')}-${safeName(file.originalname)}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 7 },
  fileFilter: (_request, file, callback) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    callback(null, allowed.includes(file.mimetype));
  }
});

app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(ROOT));
app.get('/', (_request, response) => response.sendFile(path.join(ROOT, 'index.html')));
app.get('/admin', (_request, response) => response.sendFile(path.join(ROOT, 'admin.html')));

app.get('/api/health', (_request, response) => response.json({ ok: true, service: 'UstozTop API' }));
app.get('/api/teachers', (_request, response) => {
  const teachers = readTeachers().filter(teacher => teacher.status === 'verified').map(publicTeacher);
  response.json(teachers);
});
app.post('/api/teachers', upload.fields([{ name: 'certificates', maxCount: 5 }, { name: 'profile', maxCount: 1 }]), (request, response) => {
  const certificates = request.files?.certificates || [];
  if (!certificates.length) return response.status(400).json({ error: 'Kamida bitta sertifikat yuklang.' });
  const teacher = {
    id: crypto.randomUUID(),
    name: request.body.name?.trim(),
    subject: request.body.subject?.trim(),
    location: request.body.location,
    format: request.body.format,
    experience: request.body.experience?.trim(),
    price: Number(request.body.price),
    contact: request.body.contact?.trim(),
    about: request.body.about?.trim() || '',
    status: 'pending',
    certificates: certificates.map(file => ({ name: file.originalname, url: `/uploads/${file.filename}` })),
    profile: request.files?.profile?.[0] ? `/uploads/${request.files.profile[0].filename}` : '',
    createdAt: new Date().toISOString()
  };
  if (!teacher.name || !teacher.subject || !teacher.location || !teacher.format || !teacher.experience || !teacher.price || !teacher.contact) return response.status(400).json({ error: 'Majburiy maydonlarni to‘ldiring.' });
  const teachers = readTeachers();
  teachers.push(teacher);
  writeTeachers(teachers);
  response.status(201).json({ id: teacher.id, status: teacher.status, message: 'Ariza tekshiruvga yuborildi.' });
});

function isAdmin(request, response, next) {
  if (request.get('x-admin-key') !== ADMIN_KEY) return response.status(401).json({ error: 'Admin kaliti noto‘g‘ri.' });
  next();
}
function publicTeacher(teacher) {
  return { ...teacher, verified: teacher.status === 'verified', certificate: teacher.certificates?.[0]?.name || '' };
}
app.get('/api/admin/teachers', isAdmin, (_request, response) => response.json(readTeachers()));
app.post('/api/admin/teachers/:id/verify', isAdmin, (request, response) => {
  const teachers = readTeachers();
  const teacher = teachers.find(item => item.id === request.params.id);
  if (!teacher) return response.status(404).json({ error: 'Ustoz topilmadi.' });
  teacher.status = request.body.status === 'rejected' ? 'rejected' : 'verified';
  teacher.reviewedAt = new Date().toISOString();
  writeTeachers(teachers);
  response.json(publicTeacher(teacher));
});

app.listen(PORT, () => console.log(`UstozTop server: http://localhost:${PORT}`));
