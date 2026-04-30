// HOME / TODAY — Liquid Glass · Apple Notes inspired · 4 variants

const dot = (c) => (
  <div style={{ width: 8, height: 8, borderRadius: 99, background: c, flexShrink: 0 }} />
);

// A — 王道 Apple Notes風 タイムライン: 上に大タイトル、下にイベントカード
const HomeA = ({ dark }) => {
  const events = [
    { t: '7:30', title: '朝のラン', sub: '皇居 · 5km', dot: '#FFB340', written: true, preview: '久々の5km。脚が軽かった。' },
    { t: '10:00', title: 'デザインレビュー', sub: 'チームMTG · 60分', dot: '#FF6E61', written: true, preview: '配色の話、Yukiの理由づけが鋭かった。' },
    { t: '13:00', title: 'ランチ @ Bear Pond', sub: 'Mai と', dot: '#5AC8FA', written: false },
    { t: '19:00', title: '英会話レッスン', sub: 'Cambly · 30分', dot: '#AF52DE', written: false },
  ];
  return (
    <PaperBG dark={dark}>
      <div style={{ padding: '54px 20px 4px' }}>
        <Caption dark={dark} size={13} style={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          4月26日 日曜日
        </Caption>
        <LargeTitle dark={dark} style={{ marginTop: 2 }}>今日</LargeTitle>
        <Caption dark={dark} style={{ marginTop: 4 }}>
          4件 · <HL>2件は日記まだ</HL>
        </Caption>
      </div>

      <div style={{ padding: '54px 16px 110px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {events.map((e, i) => (
          <Glass key={i} dark={dark} radius={18} style={{
            boxShadow: dark ? 'none' : '0 1px 3px rgba(0,0,0,0.04), 0 8px 20px rgba(0,0,0,0.04)',
          }}>
            <div style={{ padding: '12px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 44, paddingTop: 2 }}>
                <Caption dark={dark} size={11} style={{
                  fontFamily: '-apple-system, "SF Pro Text"', fontFeatureSettings: '"tnum"',
                  fontWeight: 600, color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(60,60,67,0.7)',
                }}>{e.t}</Caption>
              </div>
              <div style={{ marginTop: 6 }}>{dot(e.dot)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Headline dark={dark} size={15}>{e.title}</Headline>
                <Caption dark={dark} size={12} style={{ marginTop: 2 }}>{e.sub}</Caption>
                {e.written && (
                  <div style={{
                    marginTop: 8, padding: '8px 10px', borderRadius: 10,
                    background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(255,179,64,0.08)',
                    fontFamily: '"New York", "Hiragino Mincho ProN", serif',
                    fontSize: 13, lineHeight: 1.5, color: dark ? 'rgba(255,255,255,0.85)' : '#3a342c',
                  }}>{e.preview}</div>
                )}
              </div>
              {!e.written && (
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, borderRadius: 99,
                  background: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }}>
                  <Icon name="pencil" size={14} color={dark ? '#fff' : '#3C3C43'} />
                </div>
              )}
            </div>
          </Glass>
        ))}
      </div>

      {/* floating compose */}
      <div style={{ position: 'absolute', right: 20, bottom: 90, zIndex: 28 }}>
        <Glass dark={dark} radius={999} style={{
          width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
          background: dark ? undefined : undefined,
        }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 999, background: 'linear-gradient(180deg, #FFB340, #FF8A00)' }} />
          <div style={{ position: 'relative', zIndex: 2 }}><Icon name="pencil" size={22} color="#fff" /></div>
        </Glass>
      </div>

      <TabBar active="today" dark={dark} />
    </PaperBG>
  );
};

// B — 時刻軸つき縦タイムライン (Calendar Day View 寄り)
const HomeB = ({ dark }) => {
  const blocks = [
    { start: 7.5, dur: 1, title: '朝のラン', sub: '皇居 · 5km', color: '#FFB340', written: true },
    { start: 10, dur: 1, title: 'デザインレビュー', sub: 'チームMTG', color: '#FF6E61', written: true },
    { start: 13, dur: 1, title: 'ランチ @ Bear Pond', sub: 'Mai と', color: '#5AC8FA', written: false },
    { start: 19, dur: 0.5, title: '英会話レッスン', sub: 'Cambly', color: '#AF52DE', written: false },
  ];
  const hourH = 30;
  const startH = 7;
  return (
    <PaperBG dark={dark}>
      <div style={{ padding: '54px 20px 8px' }}>
        <Caption dark={dark} size={13} style={{ textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 500 }}>
          4月26日 日
        </Caption>
        <LargeTitle dark={dark} style={{ marginTop: 2 }}>今日</LargeTitle>
      </div>

      {/* week strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 16px 12px' }}>
        {['月','火','水','木','金','土','日'].map((d, i) => {
          const day = 20 + i;
          const today = day === 26;
          return (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              width: 44,
            }}>
              <Caption dark={dark} size={11}>{d}</Caption>
              <div style={{
                width: 32, height: 32, borderRadius: 99,
                background: today ? '#FF6E61' : 'transparent',
                color: today ? '#fff' : (dark ? '#fff' : '#1c1c1e'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '-apple-system', fontSize: 16, fontWeight: today ? 600 : 400,
              }}>{day}</div>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'relative', padding: '0 16px 110px', height: 13*hourH }}>
        {/* hour lines */}
        {Array.from({length: 14}).map((_, i) => (
          <div key={i} style={{
            position: 'absolute', left: 16, right: 16, top: i*hourH,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{
              width: 36, fontSize: 10, fontFamily: '-apple-system',
              color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(60,60,67,0.5)',
              fontFeatureSettings: '"tnum"',
            }}>{startH + i}:00</span>
            <div style={{ flex: 1, height: 0.5, background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(60,60,67,0.1)' }} />
          </div>
        ))}
        {blocks.map((b, i) => (
          <div key={i} style={{
            position: 'absolute', left: 60, right: 16,
            top: (b.start - startH) * hourH + 2,
            height: b.dur * hourH - 4,
          }}>
            <Glass dark={dark} radius={12} style={{
              height: '100%',
              background: undefined,
            }}>
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 12,
                background: `linear-gradient(180deg, ${b.color}26, ${b.color}10)`,
              }} />
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: b.color, borderRadius: '12px 0 0 12px' }} />
              <div style={{ padding: '6px 10px', position: 'relative' }}>
                <Headline dark={dark} size={13}>{b.title}</Headline>
                <Caption dark={dark} size={11}>{b.sub}</Caption>
                {b.written && (
                  <div style={{
                    position: 'absolute', right: 6, top: 6,
                    width: 6, height: 6, borderRadius: 99, background: b.color,
                  }} />
                )}
              </div>
            </Glass>
          </div>
        ))}
        {/* now line */}
        <div style={{
          position: 'absolute', left: 50, right: 16, top: (10.5-startH)*hourH,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 99, background: '#FF3B30' }} />
          <div style={{ flex: 1, height: 1.5, background: '#FF3B30' }} />
        </div>
      </div>

      <TabBar active="today" dark={dark} />
    </PaperBG>
  );
};

// C — Notes folder風: 大タイトル "今日のノート"、下にカードのリスト
const HomeC = ({ dark }) => {
  const items = [
    { t: '10:00', title: 'デザインレビュー', body: '配色のロジック化。Yukiの提案、最初は違和感があったけど…', written: true },
    { t: '7:30', title: '朝のラン', body: '皇居 5km、26分。久しぶりに脚が軽い。', written: true },
    { t: '13:00', title: 'ランチ @ Bear Pond', body: '', written: false },
    { t: '19:00', title: '英会話レッスン', body: '', written: false },
  ];
  return (
    <PaperBG dark={dark}>
      <div style={{ padding: '54px 20px 8px' }}>
        <Caption dark={dark} size={13} style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
          2026.04.26 SUN
        </Caption>
        <LargeTitle dark={dark} style={{ marginTop: 2 }}>今日のノート</LargeTitle>
      </div>

      {/* search field glass */}
      <div style={{ padding: '0 16px 14px' }}>
        <Glass dark={dark} radius={12} style={{
          padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon name="search" size={16} color={dark ? 'rgba(255,255,255,0.6)' : 'rgba(60,60,67,0.55)'} />
          <Caption dark={dark} size={14} style={{ flex: 1 }}>今日の予定を検索</Caption>
        </Glass>
      </div>

      <div style={{ padding: '0 16px 110px', display: 'flex', flexDirection: 'column', gap: 1,
        background: dark ? 'rgba(28,28,30,0.6)' : '#fff',
        margin: '0 16px', borderRadius: 14, overflow: 'hidden',
      }}>
        {items.map((it, i) => (
          <div key={i} style={{
            padding: '14px 16px',
            borderBottom: i < items.length-1 ? `0.5px solid ${dark ? 'rgba(84,84,88,0.4)' : 'rgba(60,60,67,0.1)'}` : 'none',
            background: dark ? 'rgba(28,28,30,0.6)' : '#fff',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Headline dark={dark} size={15}>{it.title}</Headline>
              <Caption dark={dark} size={11}>{it.t}</Caption>
            </div>
            {it.body ? (
              <Caption dark={dark} size={13} style={{
                marginTop: 4, lineHeight: 1.45,
                color: dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.7)',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>{it.body}</Caption>
            ) : (
              <Caption dark={dark} size={12} style={{
                marginTop: 4, color: dark ? 'rgba(255,179,64,0.9)' : '#C57A00',
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <Icon name="pencil" size={12} color={dark ? '#FFB340' : '#C57A00'} />
                書きはじめる
              </Caption>
            )}
          </div>
        ))}
      </div>

      <TabBar active="today" dark={dark} />
    </PaperBG>
  );
};

// D — 攻めた案: Liquid Glass ブロック（カード重なり）+ 上にメッシュ
const HomeD = ({ dark }) => {
  const events = [
    { t: '7:30', title: '朝のラン', dot: '#FFB340', written: true },
    { t: '10:00', title: 'デザインレビュー', dot: '#FF6E61', written: true },
    { t: '13:00', title: 'ランチ', dot: '#5AC8FA', written: false },
    { t: '19:00', title: '英会話', dot: '#AF52DE', written: false },
  ];
  return (
    <PaperBG dark={dark} scenic={!dark}>
      {/* color mesh background */}
      {!dark && (
        <>
          <div style={{ position: 'absolute', top: -40, right: -60, width: 240, height: 240, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,179,64,0.5), transparent 70%)' }} />
          <div style={{ position: 'absolute', top: 200, left: -80, width: 260, height: 260, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(90,200,250,0.35), transparent 70%)' }} />
        </>
      )}
      <div style={{ padding: '54px 22px 0' }}>
        <Caption dark={dark} size={13} style={{ letterSpacing: 0.5 }}>4月26日 日曜</Caption>
        <Mincho dark={dark} size={32} style={{ marginTop: 6, lineHeight: 1.25 }}>
          春のひかり、<br/>すこし風つよし。
        </Mincho>
        <Caption dark={dark} size={13} style={{ marginTop: 8 }}>
          21° / 12°  ·  気分ふつう  ·  4件
        </Caption>
      </div>

      {/* big writing prompt card */}
      <div style={{ padding: '18px 16px 12px' }}>
        <Glass dark={dark} radius={20} style={{
          boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 16px 40px rgba(0,0,0,0.06)',
        }}>
          <div style={{ padding: '14px 16px' }}>
            <Caption dark={dark} size={11} style={{ textTransform: 'uppercase', letterSpacing: 0.6 }}>
              ✦ AIから今朝のひと言
            </Caption>
            <Body dark={dark} size={15} style={{ marginTop: 6, fontFamily: '"New York", serif', lineHeight: 1.4 }}>
              昨日の続き、配色の理由づけは進みましたか？
            </Body>
          </div>
        </Glass>
      </div>

      <div style={{ padding: '0 16px 110px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {events.map((e, i) => (
          <Glass key={i} dark={dark} radius={14}>
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              {dot(e.dot)}
              <div style={{ flex: 1 }}>
                <Headline dark={dark} size={14}>{e.title}</Headline>
              </div>
              <Caption dark={dark} size={12} style={{ fontFeatureSettings: '"tnum"' }}>{e.t}</Caption>
              {e.written && <Icon name="check" size={14} color={dark ? '#FFB340' : '#FFB340'} />}
            </div>
          </Glass>
        ))}
      </div>

      <TabBar active="today" dark={dark} />
    </PaperBG>
  );
};

Object.assign(window, { HomeA, HomeB, HomeC, HomeD });
