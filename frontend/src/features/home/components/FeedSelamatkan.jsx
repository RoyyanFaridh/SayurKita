import { MapPin, Clock, Package, Bookmark, MessageCircle, ArrowRight } from 'lucide-react';

const STATUS_MAP = {
  segar:        { label: 'Segar',        bg: '#F6FBF8', color: '#657F6D', bar: '#2A5C40' },
  warning:      { label: 'Segera ambil', bg: '#FDF6E9', color: '#b07d12', bar: '#E8A320' },
  danger:       { label: 'Hari ini!',    bg: '#F9EFEA', color: '#C4622D', bar: '#C4622D' },
};

const FEED_ITEMS = [
  {
    id: 1,
    initials: 'RS',
    avatarBg: '#E8F5E9',
    avatarColor: '#2A5C40',
    title: 'Rendang Sisa Lebaran',
    description: 'Rendang buatan sendiri, sudah dimasak kemarin. Masih enak, belum dihangatkan.',
    location: 'Perumahan Asri Blok C, Condongcatur',
    distance: '736 m',
    time: '1 jam lalu',
    quantity: '2 porsi',
    donor: 'Sri Rahayu',
    status: 'segar',
  },
  {
    id: 2,
    initials: 'NK',
    avatarBg: '#FFF8E1',
    avatarColor: '#b07d12',
    title: 'Nasi Kotak Sisa Acara RT',
    description: 'Tersisa dari acara rapat RT kemarin. Masih sangat layak makan, lauk rendang dan ayam goreng.',
    location: 'Jl. Mawar No. 12, Baciro',
    distance: '870 m',
    time: '30 mnt lalu',
    quantity: '10 box',
    donor: 'Sari Dewi',
    status: 'segar',
  },
  {
    id: 3,
    initials: 'SB',
    avatarBg: '#FDF6E9',
    avatarColor: '#b07d12',
    title: 'Sayur Bayam & Wortel',
    description: 'Sisa masak siang, belum layu. Perlu segera dikonsumsi hari ini.',
    location: 'Jl. Kaliurang KM 6.5',
    distance: '1.9 km',
    time: '2 jam lalu',
    quantity: 'Cukup 3 orang',
    donor: 'Joko Santoso',
    status: 'warning',
  },
];

const avatarColors = [
  { bg: '#E8F5E9', color: '#2A5C40' },
  { bg: '#FFF8E1', color: '#b07d12' },
  { bg: '#F9EFEA', color: '#C4622D' },
];

function FeedCard({ item }) {
  const status = STATUS_MAP[item.status];
  return (
    <div
      className="flex items-start gap-4 bg-white rounded-2xl overflow-hidden"
      style={{
        border: '1px solid #EAEAEA',
        boxShadow: '2px 2px 10px rgba(0,0,0,0.05)',
        borderLeft: `4px solid ${status.bar}`,
        padding: 'clamp(1rem, 1.5vw, 1.25rem) clamp(1rem, 1.5vw, 1.25rem)',
      }}
    >
      {/* Avatar */}
      <div
        className="shrink-0 flex items-center justify-center rounded-xl font-bold text-sm"
        style={{
          width: '2.75rem',
          height: '2.75rem',
          backgroundColor: item.avatarBg,
          color: item.avatarColor,
          fontFamily: 'var(--font-body)',
        }}
      >
        {item.initials}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="m-0 font-bold leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
              color: 'var(--text-primary)',
            }}
          >
            {item.title}
          </h3>
          <span
            className="shrink-0 rounded-full font-semibold"
            style={{
              backgroundColor: status.bg,
              color: status.color,
              fontSize: '0.7rem',
              padding: '0.25rem 0.75rem',
              whiteSpace: 'nowrap',
            }}
          >
            {status.label}
          </span>
        </div>

        <p
          className="m-0"
          style={{
            fontSize: 'clamp(0.75rem, 0.85vw, 0.8125rem)',
            color: 'var(--text-secondary)',
            lineHeight: '1.55',
          }}
        >
          {item.description}
        </p>

        {/* Meta */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1"
          style={{ fontSize: '0.7rem', color: '#9E9E9E' }}
        >
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {item.location} · <strong style={{ color: '#5D5D5D' }}>{item.distance}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {item.time}
          </span>
          <span className="flex items-center gap-1">
            <Package size={11} />
            {item.quantity}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-full text-xs font-bold"
              style={{
                width: '1.5rem',
                height: '1.5rem',
                backgroundColor: item.avatarBg,
                color: item.avatarColor,
                fontSize: '0.6rem',
              }}
            >
              {item.initials[0]}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {item.donor}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center justify-center rounded-xl transition-colors duration-150"
              style={{
                width: '2rem',
                height: '2rem',
                border: '1px solid #EAEAEA',
                backgroundColor: 'white',
                color: '#9E9E9E',
              }}
              aria-label="Simpan"
            >
              <Bookmark size={13} />
            </button>
            <button
              className="flex items-center gap-1.5 rounded-xl font-medium transition-colors duration-150"
              style={{
                height: '2rem',
                padding: '0 0.75rem',
                border: '1px solid #EAEAEA',
                backgroundColor: 'white',
                color: 'var(--text-primary)',
                fontSize: '0.75rem',
              }}
            >
              <MessageCircle size={13} />
              Hubungi
            </button>
            <button
              className="flex items-center gap-1 rounded-xl font-semibold text-white transition-all duration-150"
              style={{
                height: '2rem',
                padding: '0 0.875rem',
                backgroundColor: 'var(--bg-card-dark)',
                fontSize: '0.75rem',
              }}
            >
              Detail
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeedSelamatkan() {
  return (
    <section
      style={{
        backgroundColor: 'var(--bg-base)',
        paddingBlock: 'clamp(4rem, 8vw, 7rem)',
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: '1920px',
          paddingInline: 'clamp(var(--space-8), 6vw, var(--space-32))',
        }}
      >
        <div className="feed-layout">
          <style>{`
            .feed-layout {
              display: grid;
              grid-template-columns: 1fr 1.6fr;
              gap: clamp(3rem, 6vw, 6rem);
              align-items: center;
            }
            @media (max-width: 900px) {
              .feed-layout {
                grid-template-columns: 1fr;
                gap: 2.5rem;
              }
            }
          `}</style>

          {/* Kolom kiri — header */}
          <div className="flex flex-col gap-5 sticky top-0">
            <span
                className="inline-flex items-center w-fit font-bold uppercase"
                style={{
                    color: 'var(--color-tertiary-600)',
                    fontSize: 'var(--text-fluid-xs)',
                    letterSpacing: '0.25em',
                }}
            >
                Feed Surplus
            </span>

            <h2
              className="font-extrabold leading-tight m-0"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Makanan surplus di{' '}
              <span style={{ color: 'var(--accent-primary)' }}>sekitarmu</span>
            </h2>

            <p
              className="m-0"
              style={{
                fontSize: 'clamp(0.9rem, 1.1vw, 1.0625rem)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                maxWidth: '38ch',
              }}
            >
              Lihat bahan dan makanan surplus yang dibagikan warga sekitar. Ambil sebelum terbuang — gratis, mudah, bermakna.
            </p>

            <div className="flex flex-col gap-3 mt-2">
              {[
                { dot: '#2A5C40', bg: '#F6FBF8', label: 'Masih segar — aman dikonsumsi' },
                { dot: '#E8A320', bg: '#FDF6E9', label: 'Segera ambil — hampir habis waktunya' },
                { dot: '#C4622D', bg: '#F9EFEA', label: 'Hari ini — butuh tindakan segera' },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="shrink-0 rounded-full"
                    style={{ width: '8px', height: '8px', backgroundColor: l.dot }}
                  />
                  <span
                    style={{
                      fontSize: 'clamp(0.75rem, 0.9vw, 0.8125rem)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom kanan — feed */}
          <div className="flex flex-col gap-4">
            {FEED_ITEMS.map(item => (
              <FeedCard key={item.id} item={item} />
            ))}

            {/* Teaser card */}
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{
                border: '1.5px dashed #D1D5DB',
                padding: '1.5rem',
                gap: '0.5rem',
              }}
            >
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: '#9E9E9E',
                }}
              >
                + puluhan surplus lainnya tersedia hari ini
              </span>
              <a
                href="#daftar"
                className="font-semibold flex items-center gap-1"
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-forest-600)',
                }}
              >
                Daftar untuk lihat <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}