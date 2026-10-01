# UstozTop backend

## Ishga tushirish

1. Node.js 18+ o‘rnating.
2. Loyihada terminal oching va dependency o‘rnating:

```bash
npm install
```

3. Admin kalitini o‘rnating. PowerShell:

```powershell
$env:ADMIN_KEY = "o'zingizning-maxfiy-kalitingiz"
```

4. Serverni ishga tushiring:

```bash
npm start
```

Sayt: `http://localhost:3000/index.html`
Admin: `http://localhost:3000/admin.html`

Admin panelga kirish uchun `admin.html` sahifasidagi `Admin kaliti` joyiga server ishga tushirilganda bergan `ADMIN_KEY` qiymatini yozing. Agar alohida qiymat berilmasa, lokal rejimdagi standart kalit `ustoztop-admin-2026` bo‘ladi. Internetga joylaganda bu standart qiymatni ishlatmang.

Admin sahifasida `ADMIN_KEY` qiymatini kiriting. Yangi ustoz arizasi `pending` holatda saqlanadi. Sertifikatlarni ko‘rib chiqib, `Tasdiqlash` bosilgandan keyin ustoz ommaviy katalogda ko‘rinadi.

## Saqlash

- Arizalar: `data/teachers.json`
- Sertifikat va profil rasmlari: `uploads/`
- Fayl turi: PDF, JPG, PNG, WEBP
- Maksimal hajm: har bir fayl 8 MB

Production uchun JSON omborini PostgreSQL/Supabase bilan almashtirish, HTTPS yoqish va `ADMIN_KEY`ni environment secret sifatida saqlash kerak.

## Internetga joylash

`render.yaml` Render deployment konfiguratsiyasini o‘z ichiga oladi:

1. GitHub'ga loyihani yuklang.
2. Render'da **New → Blueprint** tanlang va repository'ni ulang.
3. `ADMIN_KEY` uchun yangi maxfiy qiymat kiriting.
4. Deploy tugagach sayt `https://ustoztop.onrender.com` kabi manzilda ochiladi.

O‘z domeningizni Render dashboard'dagi **Custom Domains** bo‘limidan ulang. Doimiy sertifikat va ariza saqlash uchun production'da Supabase Storage/Database yoki hosting persistent diskini ulang.
