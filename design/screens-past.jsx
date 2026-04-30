// PAST / CALENDAR — Liquid Glass · Apple Notes inspired

// A — 月カレンダー＋下に書いた日記
const PastA = ({ dark }) => {
  const days = Array.from({length: 35}, (_, i) => i - 2);
  const written = new Set([3,4,7,9,10,11,14,17,18,21,24,25,26]);
  const today = 26;
  return (
    <PaperBG dark={dark}>
      <div style={{ padding: '54px 20px 10px', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <Caption dark={dark} size={13} style={{ letterSpacing: 0.4 }}>2026</Caption>
          <LargeTitle dark={dark}>4月</LargeTitle>
        </div>
        <div style={{ display:'flex', gap: 6 }}>
          <GlassPill dark={dark}><Chev dark={dark} dir="left"/></GlassPill>
          <GlassPill dark={dark}><Chev dark={dark} dir="right"/></GlassPill>
        </div>
      </div>

      <div style={{ padding: '0 14px 0', display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap: 4 }}>
        {['日','月','火','水','木','金','土'].map(d => (
          <Caption key={d} dark={dark} size={11} style={{ textAlign:'center', fontWeight: 500 }}>{d}</Caption>
        ))}
      </div>

      <div style={{ padding: '6px 14px 0', display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap: 4 }}>
        {days.map((d, i) => {
          const valid = d >= 1 && d <= 30;
          const w = written.has(d);
          const isToday = d === today;
          return (
            <div key={i} style={{
              aspectRatio:'1', borderRadius:10, position:'relative',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              fontFamily:'-apple-system', fontSize: 14,
              background: isToday ? '#FF6E61' : 'transparent',
              color: isToday ? '#fff' : (valid ? (dark?'#fff':'#1c1c1e') : (dark?'rgba(255,255,255,0.2)':'rgba(60,60,67,0.3)')),
              fontWeight: isToday ? 600 : 400,
            }}>
              {valid ? d : ''}
              {w && !isToday && <div style={{ position:'absolute', bottom: 4, width:4, height:4, borderRadius:99, background:'#FFB340' }}/>}
              {w && isToday && <div style={{ position:'absolute', bottom: 4, width:4, height:4, borderRadius:99, background:'#fff' }}/>}
            </div>
          );
        })}
      </div>

      <Caption dark={dark} size={13} style={{ padding: '20px 22px 8px', textTransform:'uppercase', letterSpacing: 0.5, fontWeight: 500 }}>
        4月の日記
      </Caption>
      <div style={{ padding: '0 16px 110px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { d: '4/25', title: 'ジムで脚 day', sub: '久しぶりに筋肉痛がうれしい' },
          { d: '4/24', title: '送別会 @ 居酒屋', sub: 'Sさんの最後の日' },
          { d: '4/21', title: '健康診断', sub: '体重 +1.2kg' },
        ].map((e, i) => (
          <Glass key={i} dark={dark} radius={14}>
            <div style={{ padding:'12px 14px', display:'flex', gap: 10 }}>
              <Caption dark={dark} size={11} style={{ width: 36, fontFeatureSettings:'"tnum"', paddingTop:2 }}>{e.d}</Caption>
              <div style={{ flex:1 }}>
                <Headline dark={dark} size={14}>{e.title}</Headline>
                <Body dark={dark} size={13} style={{ marginTop:2, fontFamily:'"New York",serif',
                  color: dark?'rgba(235,235,245,0.6)':'rgba(60,60,67,0.7)' }}>{e.sub}</Body>
              </div>
            </div>
          </Glass>
        ))}
      </div>
      <TabBar active="cal" dark={dark} />
    </PaperBG>
  );
};

// B — 縦タイムライン（月ごとの背骨）
const PastB = ({ dark }) => (
  <PaperBG dark={dark}>
    <div style={{ padding: '54px 20px 8px' }}>
      <Caption dark={dark} size={13} style={{ letterSpacing: 0.4 }}>振り返り</Caption>
      <LargeTitle dark={dark}>これまで</LargeTitle>
    </div>

    {/* segmented filter */}
    <div style={{ padding: '4px 16px 12px' }}>
      <Glass dark={dark} radius={10}>
        <div style={{ display:'flex', padding: 3, gap: 2 }}>
          {['全部','仕事','人','運動','旅'].map((t, i) => (
            <div key={t} style={{
              flex:1, textAlign:'center', padding: '6px 0', borderRadius: 8,
              fontFamily:'-apple-system', fontSize: 12, fontWeight: i===0?600:500,
              color: i===0 ? (dark?'#fff':'#1c1c1e') : (dark?'rgba(255,255,255,0.6)':'rgba(60,60,67,0.6)'),
              background: i===0 ? (dark?'rgba(255,255,255,0.16)':'#fff') : 'transparent',
              boxShadow: i===0 ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
            }}>{t}</div>
          ))}
        </div>
      </Glass>
    </div>

    <div style={{ padding: '4px 22px 110px', position:'relative' }}>
      <div style={{ position:'absolute', left: 38, top: 8, bottom: 30, borderLeft: `1px dashed ${dark?'rgba(255,255,255,0.18)':'rgba(60,60,67,0.18)'}` }}/>
      {[
        { m: '4月', items: [
          { d: '26', title: 'デザインレビュー', mood: '◐', dot: '#FF6E61' },
          { d: '25', title: 'ジムで脚 day', mood: '○', dot: '#FFB340' },
          { d: '24', title: '送別会', mood: '●', dot: '#5AC8FA' },
        ]},
        { m: '3月', items: [
          { d: '30', title: '京都ひとり旅', mood: '○', dot: '#AF52DE' },
          { d: '14', title: '誕生日ディナー', mood: '○', dot: '#FF6E61' },
        ]},
      ].map((g, gi) => (
        <div key={gi} style={{ marginTop: gi ? 18 : 0 }}>
          <Headline dark={dark} size={15} style={{ marginBottom: 8 }}>{g.m}</Headline>
          {g.items.map((e, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 8 }}>
              <Caption dark={dark} size={11} style={{ width: 20, textAlign:'right', fontFeatureSettings:'"tnum"' }}>{e.d}</Caption>
              <div style={{ width: 12, height: 12, borderRadius: 99, background: e.dot, border: `2px solid ${dark?'#000':'#FFFBF1'}` }}/>
              <Glass dark={dark} radius={12} style={{ flex:1 }}>
                <div style={{ padding: '10px 12px', display:'flex', alignItems:'center', gap: 8 }}>
                  <Headline dark={dark} size={13} style={{ flex:1 }}>{e.title}</Headline>
                  <span style={{ fontSize: 14 }}>{e.mood}</span>
                </div>
              </Glass>
            </div>
          ))}
        </div>
      ))}
    </div>
    <TabBar active="cal" dark={dark} />
  </PaperBG>
);

// C — タイルグリッド
const PastC = ({ dark }) => {
  const tiles = [
    { d: 26, type:'big', text:'配色のロジック化', color:'#FF6E61' },
    { d: 25, type:'photo', color:'linear-gradient(135deg,#FFB340,#FF6E61)' },
    { d: 24, type:'text', text:'送別会' },
    { d: 23, type:'text', text:'映画' },
    { d: 22, type:'photo', color:'linear-gradient(135deg,#5AC8FA,#AF52DE)' },
    { d: 21, type:'text', text:'健診' },
    { d: 20, type:'big', text:'桜', color:'#5AC8FA' },
    { d: 19, type:'text', text:'コーヒー' },
    { d: 18, type:'photo', color:'linear-gradient(135deg,#34C759,#5AC8FA)' },
    { d: 17, type:'text', text:'ラン 5km' },
    { d: 14, type:'text', text:'読書' },
    { d: 11, type:'photo', color:'linear-gradient(135deg,#AF52DE,#FF2D55)' },
  ];
  return (
    <PaperBG dark={dark}>
      <div style={{ padding: '54px 20px 10px', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
        <div>
          <Caption dark={dark} size={13} style={{ letterSpacing: 0.4 }}>2026</Caption>
          <LargeTitle dark={dark}>4月のタイル</LargeTitle>
        </div>
        <Glass dark={dark} radius={999} style={{ padding: '6px 14px' }}>
          <Headline dark={dark} size={13}>月 ▾</Headline>
        </Glass>
      </div>

      <div style={{ padding: '8px 14px 110px', display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 8 }}>
        {tiles.map((t, i) => (
          <Glass key={i} dark={dark} radius={14} style={{ aspectRatio: '1' }}>
            {t.type === 'photo' && (
              <div style={{ position:'absolute', inset:0, borderRadius:14, background: t.color }}/>
            )}
            {t.type === 'big' && (
              <div style={{ position:'absolute', inset:0, borderRadius:14, background: `linear-gradient(180deg, ${t.color}26, ${t.color}10)` }}/>
            )}
            <div style={{ position:'absolute', top: 6, left: 8 }}>
              <Caption dark={dark} size={10} style={{ fontFeatureSettings:'"tnum"', color: t.type==='photo'?'rgba(255,255,255,0.95)':undefined }}>4/{t.d}</Caption>
            </div>
            {t.type !== 'photo' && (
              <div style={{ position:'absolute', inset:0, padding: 10, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Mincho dark={dark} size={t.type==='big'?18:14} style={{ textAlign:'center', fontWeight: 500 }}>{t.text}</Mincho>
              </div>
            )}
          </Glass>
        ))}
      </div>
      <TabBar active="cal" dark={dark} />
    </PaperBG>
  );
};

// D — 検索＋タグクラウド + 数年前の今日
const PastD = ({ dark }) => (
  <PaperBG dark={dark}>
    <div style={{ padding: '54px 20px 8px' }}>
      <Caption dark={dark} size={13} style={{ letterSpacing: 0.4 }}>探す</Caption>
      <LargeTitle dark={dark}>記憶を辿る</LargeTitle>
    </div>

    <div style={{ padding: '4px 16px 14px' }}>
      <Glass dark={dark} radius={12}>
        <div style={{ padding: '10px 14px', display:'flex', alignItems:'center', gap: 8 }}>
          <Icon name="search" size={16} color={dark?'rgba(255,255,255,0.6)':'rgba(60,60,67,0.55)'}/>
          <Caption dark={dark} size={14} style={{ flex:1 }}>「Maiと」「桜」「眠れない夜」…</Caption>
          <Icon name="mic" size={16} color={dark?'rgba(255,255,255,0.6)':'rgba(60,60,67,0.55)'}/>
        </div>
      </Glass>
    </div>

    <Caption dark={dark} size={11} style={{ padding:'0 22px 6px', textTransform:'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>よく出てくる</Caption>
    <div style={{ padding: '0 16px 14px', display:'flex', flexWrap:'wrap', gap: 6 }}>
      {[
        ['仕事', 22, true], ['ラン', 14], ['コーヒー', 12], ['Mai', 10],
        ['家族', 8], ['ごはん', 16, true], ['気づき', 9], ['英語', 5],
        ['散歩', 11], ['夜更かし', 3],
      ].map(([t, n, big], i) => (
        <Glass key={i} dark={dark} radius={999}>
          <div style={{
            padding: big?'8px 14px':'5px 12px',
            display:'flex', alignItems:'center', gap: 6,
          }}>
            <Headline dark={dark} size={big?14:12}>#{t}</Headline>
            <Caption dark={dark} size={big?12:11} style={{ fontFeatureSettings:'"tnum"' }}>{n}</Caption>
          </div>
        </Glass>
      ))}
    </div>

    <Caption dark={dark} size={11} style={{ padding: '4px 22px 6px', textTransform:'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>3年前の今日</Caption>
    <div style={{ padding: '0 16px 110px' }}>
      <Glass dark={dark} radius={18}>
        <div style={{ position:'absolute', inset:0, borderRadius:18,
          background:'linear-gradient(135deg, rgba(255,179,64,0.18), rgba(175,82,222,0.12))' }}/>
        <div style={{ padding: '14px 16px', position:'relative' }}>
          <Caption dark={dark} size={11} style={{ fontFeatureSettings:'"tnum"' }}>2023.04.26</Caption>
          <Headline dark={dark} size={16} style={{ marginTop: 4 }}>初めての引っ越し見積り</Headline>
          <Body dark={dark} size={13} style={{ marginTop: 6, fontFamily:'"New York",serif', lineHeight: 1.55 }}>
            想像の倍した。あの夜、安いところに決めて正解だった気がする。
          </Body>
        </div>
      </Glass>
    </div>
    <TabBar active="cal" dark={dark} />
  </PaperBG>
);

Object.assign(window, { PastA, PastB, PastC, PastD });
