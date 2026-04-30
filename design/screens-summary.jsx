// AI 振り返り — カテゴリ/タグ別 通時的振り返り + AIチャットへの遷移
// Ryoga FB: 週次/月次は③に寄せる。④は「これまで全部」をカテゴリ/タグ別にAIが振り返り、ユーザーは
// チャット画面でさらにAIと対話できる。

// 共通: カテゴリ定義
const CATEGORIES = [
  { id:'work',    label:'仕事',     emoji:'💼', color:'#5AC8FA', count: 142, last:'昨日' },
  { id:'hobby',   label:'趣味',     emoji:'🎨', color:'#FF6E61', count: 87,  last:'4日前' },
  { id:'fitness', label:'運動',     emoji:'🏃', color:'#34C759', count: 64,  last:'今日' },
  { id:'family',  label:'家族',     emoji:'🏠', color:'#FFB340', count: 31,  last:'1週間前' },
  { id:'study',   label:'学び',     emoji:'📚', color:'#AF52DE', count: 56,  last:'3日前' },
  { id:'food',    label:'食',       emoji:'🍜', color:'#FF9500', count: 48,  last:'今日' },
];

// ============================================================
// A — カテゴリ・グリッド + AI振り返り Bottom Sheet
// 全カテゴリを俯瞰 → タップでAI振り返り → 「もっと話す」でチャット
// ============================================================
const SummaryA = ({ dark }) => (
  <PaperBG dark={dark}>
    <div style={{ padding: '54px 20px 8px' }}>
      <Caption dark={dark} size={13} style={{ letterSpacing: 0.4 }}>cal-notes · 振り返り</Caption>
      <LargeTitle dark={dark} style={{ marginTop: 2 }}>テーマ別に読む</LargeTitle>
      <Caption dark={dark} style={{ marginTop: 4 }}>
        428件の日記を <HL>AI</HL> がカテゴリ別に整理しています
      </Caption>
    </div>

    {/* セグメント: 期間 */}
    <div style={{ padding: '8px 16px 4px', display:'flex', gap: 6 }}>
      {['すべて', '今年', '今月', '今週'].map((s, i) => (
        <Glass key={i} dark={dark} radius={999}>
          <div style={{ padding:'7px 14px',
            background: i===0 ? (dark?'rgba(255,255,255,0.18)':'rgba(0,0,0,0.06)') : 'transparent',
            borderRadius:999 }}>
            <Headline dark={dark} size={12} weight={i===0?600:500}>{s}</Headline>
          </div>
        </Glass>
      ))}
    </div>

    {/* カテゴリグリッド */}
    <div style={{ padding: '10px 16px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10 }}>
      {CATEGORIES.slice(0, 4).map((c, i) => (
        <Glass key={c.id} dark={dark} radius={18}>
          <div style={{ position:'absolute', inset:0, borderRadius:18,
            background: `linear-gradient(135deg, ${c.color}28, ${c.color}10)` }}/>
          <div style={{ padding: '14px', position:'relative', minHeight: 118 }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{c.emoji}</div>
            <Headline dark={dark} size={15}>{c.label}</Headline>
            <Caption dark={dark} size={11} style={{ marginTop: 2 }}>
              {c.count}件 · 最終 {c.last}
            </Caption>
            <Body dark={dark} size={12} style={{
              marginTop: 8, lineHeight: 1.5,
              fontFamily:'"New York","Hiragino Mincho ProN",serif',
              fontStyle:'italic',
              color: dark ? 'rgba(235,235,245,0.78)' : 'rgba(60,60,67,0.78)',
            }}>
              {[
                '“説明できる選択”が増えた',
                '色とリズムへの興味、再燃',
                '脚 day が定着してきた',
                'お母さんの誕生日が近い',
              ][i]}
            </Body>
          </div>
        </Glass>
      ))}
    </div>

    {/* 選択中: AI振り返り Bottom Sheet */}
    <div style={{ position:'absolute', bottom: 76, left: 12, right: 12 }}>
      <Glass dark={dark} radius={22} style={{
        boxShadow: dark ? '0 -8px 30px rgba(0,0,0,0.5)' : '0 -8px 30px rgba(0,0,0,0.08)',
      }}>
        <div style={{ position:'absolute', inset:0, borderRadius:22,
          background:'linear-gradient(180deg, rgba(90,200,250,0.18), transparent 60%)' }}/>
        <div style={{ padding: '14px 16px 14px', position:'relative' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2,
            background: dark?'rgba(255,255,255,0.3)':'rgba(60,60,67,0.25)',
            margin:'0 auto 10px' }}/>
          <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 18 }}>💼</div>
            <Headline dark={dark} size={15}>仕事 · AIの振り返り</Headline>
            <div style={{ marginLeft:'auto' }}>
              <Caption dark={dark} size={10}>142件</Caption>
            </div>
          </div>
          <Body dark={dark} size={13} style={{ lineHeight: 1.65 }}>
            この半年、レビュー会の前後にメモが集中しています。
            「<HL>説明できる選択</HL>」という言葉が <b>11回</b> 登場し、
            判断の言語化を意識してきた様子。
          </Body>
          <div style={{ display:'flex', gap: 8, marginTop: 12 }}>
            <Glass dark={dark} radius={999} style={{ flex: 2 }}>
              <div style={{ padding:'10px', display:'flex', alignItems:'center', justifyContent:'center', gap: 6,
                background: dark?'rgba(90,200,250,0.25)':'rgba(90,200,250,0.18)', borderRadius: 999 }}>
                <Icon name="sparkle" size={13} color={dark?'#5AC8FA':'#0A84FF'}/>
                <Headline dark={dark} size={12}>AIともっと話す</Headline>
              </div>
            </Glass>
            <Glass dark={dark} radius={999} style={{ flex: 1 }}>
              <div style={{ padding:'10px', display:'flex', alignItems:'center', justifyContent:'center', gap: 4 }}>
                <Headline dark={dark} size={12}>日記を読む</Headline>
              </div>
            </Glass>
          </div>
        </div>
      </Glass>
    </div>

    <TabBar active="summary" dark={dark} />
  </PaperBG>
);

// ============================================================
// B — タグ別 縦リスト + AIメッセージカード
// 全タグを縦に並べ、各タグごとにAIからの一言＋チャットボタン
// ============================================================
const SummaryB = ({ dark }) => (
  <PaperBG dark={dark}>
    <div style={{ padding: '54px 20px 6px', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
      <div>
        <Caption dark={dark} size={13} style={{ letterSpacing: 0.4 }}>これまでの全部から</Caption>
        <LargeTitle dark={dark}>テーマで読む</LargeTitle>
      </div>
      <GlassPill dark={dark} size={32}>
        <Icon name="search" size={14} color={dark?'#fff':'#3C3C43'}/>
      </GlassPill>
    </div>

    {/* タググルーピングモード切替 */}
    <div style={{ padding: '6px 16px 4px', display:'flex', gap: 6 }}>
      {[
        { l:'カテゴリ', on:true },
        { l:'タグ', on:false },
        { l:'人物', on:false },
        { l:'場所', on:false },
      ].map((t, i) => (
        <div key={i} style={{
          padding:'5px 12px', borderRadius:999,
          background: t.on ? (dark?'#fff':'#1c1c1e') : 'transparent',
          color: t.on ? (dark?'#000':'#fff') : (dark?'rgba(255,255,255,0.6)':'rgba(60,60,67,0.6)'),
          fontSize: 12, fontWeight: t.on?600:500,
          fontFamily:'-apple-system',
          border: t.on ? 'none' : `0.5px solid ${dark?'rgba(255,255,255,0.2)':'rgba(60,60,67,0.18)'}`,
        }}>{t.l}</div>
      ))}
    </div>

    <div style={{ padding: '8px 16px 110px', display:'flex', flexDirection:'column', gap: 10 }}>
      {CATEGORIES.slice(0, 4).map((c, i) => (
        <Glass key={c.id} dark={dark} radius={16}>
          <div style={{ padding: '14px 14px 12px' }}>
            {/* ヘッダー行 */}
            <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10,
                background: c.color+'22', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize: 16 }}>{c.emoji}</div>
              <div style={{ flex: 1 }}>
                <Headline dark={dark} size={14}>{c.label}</Headline>
                <Caption dark={dark} size={11}>{c.count}件 · {c.last}まで</Caption>
              </div>
              <Chev dark={dark} dir="right"/>
            </div>

            {/* AI コメント (引用風) */}
            <div style={{
              borderLeft: `2px solid ${c.color}`,
              paddingLeft: 10, marginBottom: 10,
            }}>
              <Body dark={dark} size={13} style={{
                fontFamily:'"New York","Hiragino Mincho ProN",serif',
                lineHeight: 1.6,
                color: dark?'rgba(235,235,245,0.85)':'rgba(28,28,30,0.85)',
              }}>
                {[
                  '半年で <b>レビュー前のメモ</b> が増え、判断の言語化が進んだ。',
                  '春先から <b>色とリズム</b> の話題が再び増加中。',
                  '週2回のジムが定着。<b>「気持ちいい疲労」</b>という表現が頻出。',
                  '誕生日や記念日まわりに <b>家族</b> の話題が集まる。',
                ][i].split(/<b>(.*?)<\/b>/).map((s, j) =>
                  j%2===1 ? <HL key={j}>{s}</HL> : s
                )}
              </Body>
            </div>

            {/* アクション行 */}
            <div style={{ display:'flex', gap: 6 }}>
              <Glass dark={dark} radius={999} style={{ flex:1 }}>
                <div style={{ padding:'8px', display:'flex', alignItems:'center', justifyContent:'center', gap: 5,
                  background: c.color+'1f', borderRadius: 999 }}>
                  <Icon name="sparkle" size={11} color={c.color}/>
                  <Headline dark={dark} size={11} weight={600}>AIと話す</Headline>
                </div>
              </Glass>
              <Glass dark={dark} radius={999} style={{ flex:1 }}>
                <div style={{ padding:'8px', display:'flex', alignItems:'center', justifyContent:'center', gap: 5 }}>
                  <Icon name="cal" size={11} color={dark?'#fff':'#3C3C43'}/>
                  <Headline dark={dark} size={11} weight={500}>該当の予定</Headline>
                </div>
              </Glass>
            </div>
          </div>
        </Glass>
      ))}
    </div>

    <TabBar active="summary" dark={dark} />
  </PaperBG>
);

// ============================================================
// C — AIチャット画面（タップ後の遷移先）
// 「仕事」カテゴリのAI振り返りから入った会話
// ============================================================
const SummaryC = ({ dark }) => (
  <PaperBG dark={dark}>
    {/* Top bar */}
    <div style={{ padding: '54px 16px 10px', display:'flex', alignItems:'center', gap: 10 }}>
      <GlassPill dark={dark} size={32}><Chev dark={dark}/></GlassPill>
      <div style={{ flex:1 }}>
        <Caption dark={dark} size={11}>振り返りチャット</Caption>
        <Headline dark={dark} size={15}>💼 仕事 について</Headline>
      </div>
      <GlassPill dark={dark} size={32}>
        <Icon name="ellipsis" size={14} color={dark?'#fff':'#3C3C43'}/>
      </GlassPill>
    </div>

    {/* Context chip — どの範囲を読んでいるか */}
    <div style={{ padding: '0 16px 8px' }}>
      <Glass dark={dark} radius={999}>
        <div style={{ padding:'6px 12px', display:'flex', alignItems:'center', gap: 6 }}>
          <Icon name="tag" size={11} color={dark?'#5AC8FA':'#0A84FF'}/>
          <Caption dark={dark} size={11} style={{ color: dark?'#5AC8FA':'#0A84FF' }}>
            142件の日記を参照中 · 2024.10〜
          </Caption>
        </div>
      </Glass>
    </div>

    {/* Messages */}
    <div style={{ padding: '6px 16px 110px', display:'flex', flexDirection:'column', gap: 10 }}>
      {/* AI: opening summary */}
      <div style={{ display:'flex', gap: 8, alignItems:'flex-start' }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, flexShrink:0,
          background:'linear-gradient(135deg, #5AC8FA, #AF52DE)',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="sparkle" size={12} color="#fff"/>
        </div>
        <Glass dark={dark} radius={16} style={{ maxWidth: '82%' }}>
          <div style={{ padding:'10px 12px' }}>
            <Body dark={dark} size={13} style={{ lineHeight: 1.6 }}>
              「仕事」の142件、ざっと読みました。<br/>
              <HL>レビュー会前後</HL> にメモが集まっていて、特に半年前から
              「<HL>説明できる選択</HL>」という言葉が増えています。
            </Body>
          </div>
        </Glass>
      </div>

      {/* AI follow-up: suggestions */}
      <div style={{ display:'flex', gap: 8, alignItems:'flex-start' }}>
        <div style={{ width: 26, flexShrink: 0 }}/>
        <Glass dark={dark} radius={16} style={{ maxWidth: '82%' }}>
          <div style={{ padding:'10px 12px' }}>
            <Body dark={dark} size={13} style={{ lineHeight: 1.6 }}>気になるのはどれですか？</Body>
            <div style={{ marginTop: 8, display:'flex', flexDirection:'column', gap: 6 }}>
              {[
                '「説明できる選択」が増えた背景は？',
                '伸びている部分・課題に感じている部分',
                'この半年で印象的だった日を3つ',
              ].map((q, i) => (
                <div key={i} style={{
                  padding:'7px 10px', borderRadius: 10,
                  background: dark?'rgba(90,200,250,0.14)':'rgba(90,200,250,0.12)',
                  fontSize: 12, fontFamily:'-apple-system',
                  color: dark?'#5AC8FA':'#0A84FF', fontWeight: 500,
                }}>{q}</div>
              ))}
            </div>
          </div>
        </Glass>
      </div>

      {/* User reply */}
      <div style={{ display:'flex', gap: 8, justifyContent:'flex-end' }}>
        <div style={{ maxWidth:'78%', padding:'10px 12px', borderRadius: 16,
          background: dark?'#0A84FF':'#007AFF', color:'#fff',
          fontFamily:'-apple-system', fontSize: 14, lineHeight: 1.5,
        }}>
          印象的だった3日を教えて
        </div>
      </div>

      {/* AI: rich answer */}
      <div style={{ display:'flex', gap: 8, alignItems:'flex-start' }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, flexShrink:0,
          background:'linear-gradient(135deg, #5AC8FA, #AF52DE)',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon name="sparkle" size={12} color="#fff"/>
        </div>
        <div style={{ maxWidth:'82%', display:'flex', flexDirection:'column', gap: 6 }}>
          <Glass dark={dark} radius={16}>
            <div style={{ padding:'10px 12px' }}>
              <Body dark={dark} size={13} style={{ lineHeight: 1.6 }}>3つ挙げますね。</Body>
            </div>
          </Glass>
          {[
            { d:'2024.11.07', t:'初回レビュー', s:'「言葉にすると怖くない」と書いた日' },
            { d:'2025.01.15', t:'年明けの方針会', s:'説明する側に回った日' },
            { d:'2025.04.22', t:'配色のロジック化', s:'Yukiの提案で考え方が変わった' },
          ].map((d, i) => (
            <Glass key={i} dark={dark} radius={12}>
              <div style={{ padding:'9px 12px', display:'flex', alignItems:'center', gap: 8 }}>
                <Caption dark={dark} size={10} style={{ width: 70, fontFeatureSettings:'"tnum"' }}>{d.d}</Caption>
                <div style={{ flex: 1 }}>
                  <Headline dark={dark} size={12}>{d.t}</Headline>
                  <Caption dark={dark} size={10}>{d.s}</Caption>
                </div>
                <Chev dark={dark} dir="right"/>
              </div>
            </Glass>
          ))}
        </div>
      </div>
    </div>

    {/* Composer */}
    <div style={{ position:'absolute', left: 12, right: 12, bottom: 14 }}>
      <Glass dark={dark} radius={26} style={{
        boxShadow: dark ? '0 8px 30px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.06)',
      }}>
        <div style={{ padding:'8px 8px 8px 16px', display:'flex', alignItems:'center', gap: 8 }}>
          <Caption dark={dark} size={13} style={{ flex:1 }}>聞いてみる…</Caption>
          <GlassPill dark={dark} size={32}><Icon name="mic" size={14} color={dark?'#fff':'#3C3C43'}/></GlassPill>
          <div style={{ width: 32, height: 32, borderRadius: 16,
            background: dark?'#0A84FF':'#007AFF',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </Glass>
    </div>
  </PaperBG>
);

// ============================================================
// D — シナリオ・コレクション（攻めた案）
// AIがカテゴリを跨いだ「物語」として束ねる。タップで詳細チャット。
// ============================================================
const SummaryD = ({ dark }) => (
  <PaperBG dark={dark} scenic={!dark}>
    {!dark && (
      <div style={{ position:'absolute', top:-40, right:-60, width:240, height:240, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(175,82,222,0.32), transparent 70%)' }}/>
    )}

    <div style={{ padding: '54px 20px 8px' }}>
      <Caption dark={dark} size={11} style={{ textTransform:'uppercase', letterSpacing: 0.6 }}>
        AI が見つけたつながり
      </Caption>
      <LargeTitle dark={dark} style={{ marginTop: 4, fontSize: 30 }}>
        あなたの<br/><span style={{
          fontFamily:'"New York","Hiragino Mincho ProN",serif',
          fontStyle:'italic', fontWeight: 600,
        }}>物語</span>
      </LargeTitle>
    </div>

    {/* Filter row */}
    <div style={{ padding: '6px 16px 4px', display:'flex', gap: 6, overflowX:'hidden' }}>
      {['すべて', '💼仕事', '🎨趣味', '🏃運動', '🏠家族', '📚学び'].map((t, i) => (
        <div key={i} style={{
          padding:'6px 11px', borderRadius:999,
          background: i===0 ? (dark?'rgba(255,255,255,0.95)':'#1c1c1e') : (dark?'rgba(255,255,255,0.08)':'rgba(255,255,255,0.6)'),
          color: i===0 ? (dark?'#000':'#fff') : (dark?'rgba(255,255,255,0.85)':'#1c1c1e'),
          fontSize: 11, fontWeight: i===0?600:500,
          fontFamily:'-apple-system',
          border: i===0 ? 'none' : `0.5px solid ${dark?'rgba(255,255,255,0.15)':'rgba(60,60,67,0.12)'}`,
          flexShrink: 0,
        }}>{t}</div>
      ))}
    </div>

    {/* Story cards */}
    <div style={{ padding: '12px 16px 110px', display:'flex', flexDirection:'column', gap: 14 }}>
      {/* Featured card */}
      <Glass dark={dark} radius={22} style={{ minHeight: 200 }}>
        <div style={{ position:'absolute', inset:0, borderRadius: 22,
          background:'linear-gradient(135deg, rgba(255,179,64,0.28), rgba(255,110,97,0.18))' }}/>
        <div style={{ padding: '18px 20px', position:'relative', display:'flex', flexDirection:'column', gap: 10, minHeight: 200 }}>
          <div style={{ display:'flex', gap: 6 }}>
            {['💼','📚'].map((e, i) => (
              <div key={i} style={{ fontSize: 14,
                width: 26, height: 26, borderRadius: 13,
                background: dark?'rgba(0,0,0,0.3)':'rgba(255,255,255,0.7)',
                display:'flex', alignItems:'center', justifyContent:'center' }}>{e}</div>
            ))}
            <div style={{ marginLeft:'auto' }}>
              <Caption dark={dark} size={10} style={{ textTransform:'uppercase', letterSpacing:0.5 }}>
                仕事 × 学び
              </Caption>
            </div>
          </div>
          <Mincho dark={dark} size={22} style={{ lineHeight: 1.5, fontWeight: 500, flex: 1 }}>
            「<HL>説明する</HL>」が、<br/>あなたの一年のテーマでした。
          </Mincho>
          <Body dark={dark} size={12} style={{ lineHeight: 1.55 }}>
            この一年で <b>27回</b> 出てきた言葉。読書記録ともゆるくつながっています。
          </Body>
          <div style={{ display:'flex', gap: 6 }}>
            <Glass dark={dark} radius={999} style={{ flex: 1 }}>
              <div style={{ padding:'9px', display:'flex', alignItems:'center', justifyContent:'center', gap: 5,
                background: dark?'rgba(255,179,64,0.3)':'rgba(255,179,64,0.4)', borderRadius: 999 }}>
                <Icon name="sparkle" size={11} color={dark?'#FFB340':'#A06000'}/>
                <Headline dark={dark} size={11} weight={600}>AIと深掘る</Headline>
              </div>
            </Glass>
            <Glass dark={dark} radius={999} style={{ flex: 1 }}>
              <div style={{ padding:'9px', display:'flex', alignItems:'center', justifyContent:'center', gap: 5 }}>
                <Headline dark={dark} size={11} weight={500}>関連 27件を見る</Headline>
              </div>
            </Glass>
          </div>
        </div>
      </Glass>

      {/* Smaller cards */}
      {[
        { es:['🎨'],     t:'色とリズムへの興味、再燃中',          c:'rgba(255,110,97,0.2)', cnt: 41 },
        { es:['🏃','🍜'], t:'運動した日は、夜のメモが短い',       c:'rgba(52,199,89,0.2)',   cnt: 18 },
      ].map((s, i) => (
        <Glass key={i} dark={dark} radius={16}>
          <div style={{ position:'absolute', inset:0, borderRadius: 16,
            background:`linear-gradient(135deg, ${s.c}, transparent 70%)` }}/>
          <div style={{ padding: '14px', position:'relative', display:'flex', alignItems:'center', gap: 12 }}>
            <div style={{ display:'flex', flexDirection:'column', gap: 3 }}>
              {s.es.map((e, j) => (
                <div key={j} style={{ width: 30, height: 30, borderRadius: 15,
                  background: dark?'rgba(0,0,0,0.3)':'rgba(255,255,255,0.7)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize: 14 }}>{e}</div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <Mincho dark={dark} size={15} style={{ lineHeight: 1.45, fontWeight: 500 }}>{s.t}</Mincho>
              <Caption dark={dark} size={10} style={{ marginTop: 4 }}>関連 {s.cnt}件 · タップで対話</Caption>
            </div>
            <Icon name="sparkle" size={16} color={dark?'#AF52DE':'#7B3FCC'}/>
          </div>
        </Glass>
      ))}
    </div>

    <TabBar active="summary" dark={dark} />
  </PaperBG>
);

Object.assign(window, { SummaryA, SummaryB, SummaryC, SummaryD });
