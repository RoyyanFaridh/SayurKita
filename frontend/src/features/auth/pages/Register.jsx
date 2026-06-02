import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/layouts/AuthLayout';
import AuthInput from '../components/AuthInput';
import StepIndicator from '../components/StepIndicator';
import { API_AUTH } from '../../../config/api';

function buildSteps(activeNum) {
  return [
    { num: 1, label: 'Daftar diri',   done: activeNum > 1, active: activeNum === 1 },
    { num: 2, label: 'Verifikasi HP', done: activeNum > 2, active: activeNum === 2 },
    { num: 3, label: 'Selesai',       done: activeNum > 3, active: activeNum === 3 },
  ];
}

function Toast({ message, type = 'error', onDismiss }) {
  const styles = {
    info:  'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-700',
  };
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium shadow-md max-w-sm w-[calc(100%-2rem)] ${styles[type]}`}
    >
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} aria-label="Tutup notifikasi" className="text-current opacity-50 hover:opacity-100 transition-opacity text-base leading-none">✕</button>
    </div>
  );
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8)              score++;
  if (password.length >= 12)             score++;
  if (/[A-Z]/.test(password))            score++;
  if (/[0-9]/.test(password))            score++;
  if (/[^A-Za-z0-9]/.test(password))     score++;

  if (score <= 1) return { level: 'Lemah',       color: '#C4622D', width: '20%' }; // tertiary-500
  if (score === 2) return { level: 'Cukup',      color: '#E8A320', width: '40%' }; // secondary-500
  if (score === 3) return { level: 'Sedang',     color: '#EDB545', width: '60%' }; // secondary-400
  if (score === 4) return { level: 'Kuat',       color: '#4E8C72', width: '80%' }; // primary-300
  return { level: 'Sangat Kuat',                 color: '#326B54', width: '100%' }; // primary-400
}

function PasswordStrengthBar({ password }) {
  if (!password) return null;
  const { level, color, width } = getPasswordStrength(password);
  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        Kekuatan password: {level}
      </span>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();

  const [agreed, setAgreed]         = useState(false);
  const [nama, setNama]             = useState('');
  const [phone, setPhone]           = useState('');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [confirm, setConfirm]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]         = useState({});
  const [toast, setToast]           = useState(null);
  const [modal, setModal] = useState(null);

  const showToast   = (message, type = 'error') => setToast({ message, type });
  const dismissToast = () => setToast(null);

  const formatPhone = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 13);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    if (digits.length <= 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setErrors(p => ({ ...p, phone: undefined }));
  };

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const validate = () => {
    const errs = {};

    if (!nama.trim())
      errs.nama = 'Nama lengkap wajib diisi';

    const phoneDigits = phone.replace(/-/g, '');
    if (!phone.trim())
      errs.phone = 'Nomor HP wajib diisi';
    else if (phoneDigits.length < 9 || phoneDigits.length > 13)
      errs.phone = 'Nomor HP harus 9–13 digit';

    if (!email.trim())
      errs.email = 'Email wajib diisi';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Format email tidak valid';

    if (password.length < 8)
      errs.password = 'Password minimal 8 karakter';
    else if (!/[A-Z]/.test(password))
      errs.password = 'Password harus mengandung huruf kapital';
    else if (!/[0-9]/.test(password))
      errs.password = 'Password harus mengandung angka';
    else if (!/[^A-Za-z0-9]/.test(password))
      errs.password = 'Password harus mengandung karakter spesial (!@#$...)';
    else if (passwordStrength.level === 'Lemah' || passwordStrength.level === 'Cukup')
      errs.password = 'Password terlalu lemah, buat yang lebih kuat';

    if (confirm !== password)
      errs.confirm = 'Password tidak sama';

    if (!agreed)
      errs.agreed = 'Harap setujui syarat & ketentuan';

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {

      const cleanedPhone = phone.replace(/-/g, '');

      const res = await fetch(`${API_AUTH}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: nama,
          email,
          phone: cleanedPhone,
          password
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {

        showToast(
          'OTP berhasil dikirim ke WhatsApp.',
          'info'
        );

        navigate(
          `/verify?phone=${encodeURIComponent(cleanedPhone)}`
        );

      } else if (res.status === 409) {

        const msg = (data.message || '').toLowerCase();

        if (msg.includes('email')) {

          setErrors(p => ({
            ...p,
            email: 'Email sudah terdaftar'
          }));

        } else if (
          msg.includes('nomor') ||
          msg.includes('phone')
        ) {

          setErrors(p => ({
            ...p,
            phone: 'Nomor HP sudah terdaftar'
          }));

        } else {

          showToast(
            data.message ||
            'Email atau nomor HP sudah terdaftar.'
          );

        }

      } else {

        showToast(
          data.message ||
          'Registrasi gagal. Silakan coba lagi.'
        );

      }

    } catch {

      showToast(
        'Tidak dapat menghubungi server.'
      );

    } finally {

      setSubmitting(false);

    }
  };

  function Modal({ type, onClose }) {
    const content = {
      syarat: {
        title: 'Syarat & Ketentuan',
        body: `Dengan mendaftar di SayurKita, kamu menyetujui hal-hal berikut:
  1. Akun hanya boleh digunakan oleh satu orang.
  2. Kamu bertanggung jawab atas kebenaran data yang diisi.
  3. Dilarang menyalahgunakan fitur berbagi surplus untuk kepentingan komersial.
  4. SayurKita berhak menonaktifkan akun yang melanggar ketentuan.
  5. Konten yang diunggah harus sesuai dan tidak menyesatkan.`,
      },
      privasi: {
        title: 'Kebijakan Privasi',
        body: `SayurKita berkomitmen menjaga privasi penggunanya:
  1. Data pribadi (nama, email, nomor HP) hanya digunakan untuk keperluan layanan.
  2. Kami tidak menjual data pengguna kepada pihak ketiga.
  3. Nomor HP digunakan untuk verifikasi OTP dan notifikasi layanan.
  4. Lokasi hanya diakses saat kamu menggunakan fitur Selamatkan.
  5. Kamu dapat menghapus akun kapan saja melalui pengaturan.`,
      },
    };

    const { title, body } = content[type];

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto flex flex-col gap-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg m-0">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line m-0">{body}</p>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl font-semibold text-sm text-white bg-primary-900 hover:bg-primary-800 transition-colors"
          >
            Mengerti
          </button>
        </div>
      </div>
    );
  }



  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
      {modal && <Modal type={modal} onClose={() => setModal(null)} />}

      <AuthLayout
        eyebrow="Bergabung sekarang"
        title="Mulai dari"
        highlight="dapurmu"
        subtitle="Daftar dua langkah saja. Verifikasi OTP akan dikirim ke WhatsApp untuk mengaktifkan akunmu."
      >
        <StepIndicator steps={buildSteps(1)} />

        <div className="flex flex-col gap-1">
          <h2 className="font-display font-bold text-[clamp(1.375rem,2.5vw,1.75rem)] tracking-tight text-(--text-primary) m-0">
            Buat akun baru
          </h2>
          <p className="text-sm m-0 text-(--text-secondary)">
            Sudah punya akun?{' '}
            <a href="/login" className="font-semibold no-underline hover:underline text-(--accent-primary)">
              Masuk di sini
            </a>
          </p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>

          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <AuthInput
              id="nama"
              label="Nama Lengkap"
              type="text"
              placeholder="Sri Rahayu"
              value={nama}
              onChange={e => { setNama(e.target.value); setErrors(p => ({ ...p, nama: undefined })); }}
              autoComplete="name"
              error={errors.nama}
            />
            <AuthInput
              id="phone"
              label="Nomor HP"
              type="tel"
              placeholder="8xx-xxxx-xxxx"
              value={phone}
              onChange={handlePhoneChange}
              autoComplete="tel"
              prefix="+62"
              hint="Nomor WhatsApp aktif (8–13 digit tanpa awalan 0)"
              error={errors.phone}
            />
          </div>

          <AuthInput
            id="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
            autoComplete="email"
            error={errors.email}
          />

          <div className="flex flex-col gap-0">
            <AuthInput
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
              autoComplete="new-password"
              hint="Min. 8 karakter, huruf kapital, angka, dan karakter spesial"
              error={errors.password}
            />
            <PasswordStrengthBar password={password} />
          </div>

          <AuthInput
            id="confirm"
            label="Ulangi password"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: undefined })); }}
            autoComplete="new-password"
            error={errors.confirm}
          />

          <div className="flex flex-col gap-1.5">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => { setAgreed(e.target.checked); setErrors(p => ({ ...p, agreed: undefined })); }}
                className="w-4 h-4 shrink-0 mt-0.5 cursor-pointer accent-(--accent-primary)"
              />
              <span className="text-sm leading-relaxed text-(--text-secondary)">
                Saya menyetujui{' '}
                <a
                  href="#"
                  onClick={e => { e.preventDefault(); setModal('syarat'); }}
                  className="font-semibold no-underline hover:underline text-(--accent-primary)"
                >
                  Syarat & Ketentuan
                </a>
                {' '}dan{' '}
                <a
                  href="#"
                  onClick={e => { e.preventDefault(); setModal('privasi'); }}
                  className="font-semibold no-underline hover:underline text-(--accent-primary)"
                >
                  Kebijakan Privasi
                </a>
              </span>
            </label>
            {errors.agreed && (
              <p className="text-xs text-red-500 ml-7">{errors.agreed}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-13 rounded-xl font-semibold text-base text-white transition-[background-color,transform] duration-150 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed bg-primary-900 hover:bg-primary-800"
          >
            {submitting ? 'Memproses…' : 'Lanjut'}
          </button>

        </form>
      </AuthLayout>
    </>
  );
}