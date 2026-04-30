// Apple Notes / iOS 26 Liquid Glass primitives for cal-notes

// Base palette helper (Apple Notes uses warm cream paper)
const PaperBG = ({ children, dark = false, style = {}, scenic = false }) => {
  const bg = dark
    ? '#000'
    : scenic
      ? 'linear-gradient(180deg, #FFF7E3 0%, #FFEED0 40%, #FCE4C2 100%)'
      : '#FFFBF1'; // notes cream
  return (
    <div style={{
      width: '100%', height: '100%',
      background: bg, position: 'relative', overflow: 'hidden', ...style,
    }}>{children}</div>
  );
};

// Glass card — translucent rounded rect with blur+tint+shine
const Glass = ({ children, dark = false, radius = 20, tint, style = {}, padding }) => {
  const baseTint = tint || (dark ? 'rgba(60,60,67,0.55)' : 'rgba(255,255,255,0.55)');
  return (
    <div style={{
      position: 'relative', borderRadius: radius, overflow: 'hidden', padding,
      ...style,
    }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: radius,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        background: baseTint,
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: radius,
        boxShadow: dark
          ? 'inset 1px 1px 1px rgba(255,255,255,0.1), inset -1px -1px 1px rgba(255,255,255,0.04)'
          : 'inset 1px 1px 1px rgba(255,255,255,0.85), inset -1px -1px 1px rgba(255,255,255,0.35)',
        border: dark ? '0.5px solid rgba(255,255,255,0.12)' : '0.5px solid rgba(0,0,0,0.05)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};

// Big SF-Pro large title (Apple style, tight)
const LargeTitle = ({ children, dark = false, style = {} }) => (
  <div style={{
    fontFamily: '-apple-system, "SF Pro Display", system-ui',
    fontSize: 34, fontWeight: 700, letterSpacing: 0.4, lineHeight: '41px',
    color: dark ? '#fff' : '#000',
    ...style,
  }}>{children}</div>
);

const Headline = ({ children, dark = false, size = 17, weight = 600, style = {} }) => (
  <div style={{
    fontFamily: '-apple-system, "SF Pro Text", system-ui',
    fontSize: size, fontWeight: weight, letterSpacing: -0.43,
    color: dark ? '#fff' : '#000', ...style,
  }}>{children}</div>
);

const Body = ({ children, dark = false, size = 15, style = {} }) => (
  <div style={{
    fontFamily: '-apple-system, "SF Pro Text", system-ui',
    fontSize: size, fontWeight: 400, lineHeight: 1.45,
    letterSpacing: -0.24,
    color: dark ? 'rgba(235,235,245,0.9)' : '#1c1c1e', ...style,
  }}>{children}</div>
);

const Caption = ({ children, dark = false, size = 13, style = {} }) => (
  <div style={{
    fontFamily: '-apple-system, "SF Pro Text", system-ui',
    fontSize: size, fontWeight: 400,
    color: dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)',
    ...style,
  }}>{children}</div>
);

const Mincho = ({ children, dark = false, size = 22, style = {} }) => (
  <div style={{
    fontFamily: '"New York", "Hiragino Mincho ProN", "Yu Mincho", serif',
    fontSize: size, fontWeight: 500, letterSpacing: 0.2,
    color: dark ? '#fff' : '#1c1c1e', ...style,
  }}>{children}</div>
);

// Status bar replica matching Apple iOS look at our small device size
const StatusBar = ({ dark = false, time = '9:41' }) => {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '14px 26px 6px', position: 'relative', zIndex: 20,
    }}>
      <span style={{
        fontFamily: '-apple-system, "SF Pro Text"', fontWeight: 600,
        fontSize: 15, color: c,
      }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <svg width="17" height="11" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill={c}/>
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill={c}/>
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill={c}/>
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill={c}/>
        </svg>
        <svg width="14" height="10" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill={c}/>
          <circle cx="8.5" cy="10.5" r="1.3" fill={c}/>
        </svg>
        <svg width="24" height="11" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke={c} strokeOpacity="0.35" fill="none"/>
          <rect x="2" y="2" width="18" height="9" rx="2" fill={c}/>
        </svg>
      </div>
    </div>
  );
};

// Glass pill button (icon, generic)
const GlassPill = ({ children, dark = false, size = 36, style = {} }) => (
  <Glass dark={dark} radius={999} style={{
    width: size, height: size, display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', boxShadow: dark
      ? '0 1px 4px rgba(0,0,0,0.3)'
      : '0 1px 3px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.05)',
    ...style,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
  </Glass>
);

const Chev = ({ dark = false, dir = 'left' }) => {
  const c = dark ? 'rgba(255,255,255,0.7)' : '#3C3C43';
  const rot = { left: 180, right: 0, down: 90, up: 270 }[dir];
  return (
    <svg width="9" height="14" viewBox="0 0 8 14" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M1 1l6 6-6 6" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

// SF-style icons (just enough for our needs)
const Icon = ({ name, size = 18, color = '#3C3C43', stroke = 1.6 }) => {
  const s = stroke;
  switch (name) {
    case 'plus':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={color} strokeWidth={s} strokeLinecap="round"/></svg>;
    case 'mic':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="9" y="3" width="6" height="12" rx="3" stroke={color} strokeWidth={s}/><path d="M5 11a7 7 0 0014 0M12 18v3" stroke={color} strokeWidth={s} strokeLinecap="round"/></svg>;
    case 'photo':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="3" stroke={color} strokeWidth={s}/><circle cx="8.5" cy="10.5" r="1.5" fill={color}/><path d="M21 16l-5-5-8 8" stroke={color} strokeWidth={s} strokeLinejoin="round"/></svg>;
    case 'search':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke={color} strokeWidth={s}/><path d="M16 16l4 4" stroke={color} strokeWidth={s} strokeLinecap="round"/></svg>;
    case 'sparkle':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z" fill={color}/><path d="M19 14l.7 1.8L21 16.5l-1.3.7L19 19l-.7-1.8L17 16.5l1.3-.7L19 14z" fill={color} opacity="0.7"/></svg>;
    case 'pencil':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" stroke={color} strokeWidth={s} strokeLinejoin="round"/></svg>;
    case 'cal':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15" rx="3" stroke={color} strokeWidth={s}/><path d="M3.5 10h17M8 3v4M16 3v4" stroke={color} strokeWidth={s} strokeLinecap="round"/></svg>;
    case 'today':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={color} strokeWidth={s}/><path d="M12 7v5l3 2" stroke={color} strokeWidth={s} strokeLinecap="round"/></svg>;
    case 'chart':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M4 19V5M4 19h16M8 15v-4M12 15V8M16 15v-2" stroke={color} strokeWidth={s} strokeLinecap="round"/></svg>;
    case 'cog':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={color} strokeWidth={s}/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" stroke={color} strokeWidth={s} strokeLinecap="round"/></svg>;
    case 'ellipsis':
      return <svg width={size+4} height={size} viewBox="0 0 22 6"><circle cx="3" cy="3" r="2.5" fill={color}/><circle cx="11" cy="3" r="2.5" fill={color}/><circle cx="19" cy="3" r="2.5" fill={color}/></svg>;
    case 'share':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 3v13M7 8l5-5 5 5M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'check':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 6" stroke={color} strokeWidth={s+0.4} strokeLinecap="round" strokeLinejoin="round"/></svg>;
    case 'tag':
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M3 12V5a2 2 0 012-2h7l9 9-9 9-9-9z" stroke={color} strokeWidth={s} strokeLinejoin="round"/><circle cx="8" cy="8" r="1.4" fill={color}/></svg>;
    default: return null;
  }
};

// Bottom tab bar — Liquid Glass floating
const TabBar = ({ active = 'today', dark = false }) => {
  const tabs = [
    { id: 'today', label: '今日', icon: 'today' },
    { id: 'cal', label: 'カレンダー', icon: 'cal' },
    { id: 'summary', label: 'まとめ', icon: 'sparkle' },
    { id: 'settings', label: '設定', icon: 'cog' },
  ];
  const active_c = dark ? '#fff' : '#1c1c1e';
  const muted_c = dark ? 'rgba(235,235,245,0.5)' : 'rgba(60,60,67,0.55)';
  return (
    <div style={{
      position: 'absolute', bottom: 14, left: 14, right: 14, zIndex: 30,
    }}>
      <Glass dark={dark} radius={28} style={{
        boxShadow: dark
          ? '0 8px 30px rgba(0,0,0,0.4)'
          : '0 4px 12px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.08)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-around',
          padding: '10px 8px 12px',
        }}>
          {tabs.map(t => {
            const c = t.id === active ? active_c : muted_c;
            return (
              <div key={t.id} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                color: c, fontFamily: '-apple-system, system-ui',
                fontSize: 10, fontWeight: t.id === active ? 600 : 500, minWidth: 44,
              }}>
                <Icon name={t.icon} size={22} color={c} />
                {t.label}
              </div>
            );
          })}
        </div>
      </Glass>
    </div>
  );
};

// Floating glass nav (top) — back button + ellipsis
const TopBarGlass = ({ leading, trailing, dark = false }) => (
  <div style={{
    position: 'absolute', top: 50, left: 14, right: 14, zIndex: 25,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  }}>
    <div>{leading || <GlassPill dark={dark} size={36}><Chev dark={dark} /></GlassPill>}</div>
    <div style={{ display: 'flex', gap: 8 }}>{trailing}</div>
  </div>
);

// Inset rounded list (Apple Notes folder list / Settings rows)
const InsetList = ({ children, dark = false, style = {} }) => (
  <div style={{
    background: dark ? 'rgba(28,28,30,0.85)' : '#fff',
    borderRadius: 14, margin: '0 16px', overflow: 'hidden',
    boxShadow: dark ? 'none' : '0 0 0 0.5px rgba(0,0,0,0.06)',
    ...style,
  }}>{children}</div>
);

const InsetRow = ({ children, isLast = false, dark = false, style = {}, leading, trailing }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
    borderBottom: !isLast ? `0.5px solid ${dark ? 'rgba(84,84,88,0.5)' : 'rgba(60,60,67,0.12)'}` : 'none',
    minHeight: 44, ...style,
  }}>
    {leading}
    <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    {trailing}
  </div>
);

// Highlighted text (Apple-style inline highlight, very subtle)
const HL = ({ children, color = 'rgba(255, 204, 0, 0.32)' }) => (
  <span style={{ background: color, padding: '0 2px', borderRadius: 2 }}>{children}</span>
);

Object.assign(window, {
  PaperBG, Glass, GlassPill, StatusBar, TopBarGlass,
  LargeTitle, Headline, Body, Caption, Mincho, HL,
  Icon, Chev, TabBar, InsetList, InsetRow,
});
