// EVENT DETAIL + DIARY INPUT — Liquid Glass · Apple Notes inspired

// A — 王道: Apple Notes の編集画面そのもの
const DetailA = ({ dark }) => (
  <PaperBG dark={dark}>
    <TopBarGlass dark={dark}
      trailing={<>
        <GlassPill dark={dark}><Icon name="share" size={16} color={dark?'#fff':'#3C3C43'}/></GlassPill>
        <GlassPill dark={dark}><Icon name="ellipsis" size={16} color={dark?'#fff':'#3C3C43'}/></GlassPill>
      </>}
    />
    <div style={{ padding: '100px 20px 12px' }}>
      <Caption dark={dark} size={12} style={{ letterSpacing: 0.4, textTransform: 'uppercase' }}>
        2026年4月26日 10:00 – 11:00
      </Caption>
      <LargeTitle dark={dark} size={28} style={{ marginTop: 4, fontSize: 28, lineHeight: '34px' }}>
        デザインレビュー
      </LargeTitle>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        {dot('#FF6E61')}
        <Caption dark={dark} size={12}>仕事 · オフィス会議室B · 3名</Caption>
      </div>
    </div>

    <div style={{ height: 0.5, background: dark?'rgba(255,255,255,0.1)':'rgba(60,60,67,0.12)', margin: '0 20px' }} />

    <div style={{ padding: '14px 22px 0' }}>
      <Body dark={dark} size={16} style={{
        fontFamily: '"New York", "Hiragino Mincho ProN", serif', lineHeight: 1.7,
      }}>
        Yukiの色提案。最初は方向ちがうと思ったけど、<br/>
        「これを伝えるからこの色」と理由を聞いたら<HL>納得した</HL>。<br/><br/>
        自分は感覚で選びすぎていたのかも。<br/>
        夜にもう一度、配色やり直す。<br/><br/>
        <span style={{ color: dark?'rgba(255,255,255,0.5)':'rgba(60,60,67,0.5)' }}>次回まで：</span><br/>
        ・カラーパレット v3<br/>
        ・空状態のコピー
      </Body>
    </div>

    {/* attachments */}
    <div style={{ padding: '20px 16px 0', display: 'flex', gap: 8 }}>
      {[1,2].map(i => (
        <Glass key={i} dark={dark} radius={12} style={{ width: 64, height: 64 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 12,
            background: i===1?'linear-gradient(135deg,#5AC8FA,#007AFF)':'linear-gradient(135deg,#FFB340,#FF6E61)' }} />
        </Glass>
      ))}
    </div>

    {/* bottom glass input bar */}
    <div style={{ position: 'absolute', bottom: 18, left: 14, right: 14, zIndex: 30 }}>
      <Glass dark={dark} radius={26} style={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 16px 40px rgba(0,0,0,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px' }}>
          <GlassPill dark={dark} size={36}><Icon name="photo" size={16} color={dark?'#fff':'#3C3C43'}/></GlassPill>
          <GlassPill dark={dark} size={36}><Icon name="mic" size={16} color={dark?'#fff':'#3C3C43'}/></GlassPill>
          <Caption dark={dark} size={14} style={{ flex: 1, padding: '0 4px' }}>つづきを書く…</Caption>
          <Glass dark={dark} radius={999} style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position:'absolute', inset:0, borderRadius:999, background:'#FF6E61' }} />
            <Icon name="check" size={16} color="#fff" />
          </Glass>
        </div>
      </Glass>
    </div>
  </PaperBG>
);

// B — プロンプト誘導
const DetailB = ({ dark }) => (
  <PaperBG dark={dark}>
    <TopBarGlass dark={dark}
      trailing={<GlassPill dark={dark}><Icon name="ellipsis" size={16} color={dark?'#fff':'#3C3C43'}/></GlassPill>}
    />
    <div style={{ padding: '100px 20px 8px' }}>
      <Caption dark={dark} size={12} style={{ letterSpacing: 0.4, textTransform: 'uppercase' }}>4/26 仕事 · 10:00</Caption>
      <LargeTitle dark={dark} style={{ marginTop: 4, fontSize: 26, lineHeight: '32px' }}>デザインレビュー</LargeTitle>
    </div>

    <div style={{ padding: '12px 16px 0' }}>
      <Caption dark={dark} size={11} style={{ textTransform: 'uppercase', letterSpacing: 0.6, padding: '0 6px 6px' }}>
        書きはじめる
      </Caption>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { q: '今日いちばん印象に残ったこと？', open: true, a: 'Yukiの配色提案。理由を聞いたら腑に落ちた。' },
          { q: '誰のどんな発言が刺さった？' },
          { q: '気分を一言で言うと？' },
          { q: '次にやりたいことは？' },
        ].map((p, i) => (
          <Glass key={i} dark={dark} radius={14} style={{
            background: p.open ? 'rgba(255,179,64,0.18)' : undefined,
          }}>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Headline dark={dark} size={14} weight={500}>{p.q}</Headline>
                <Icon name={p.open?'check':'plus'} size={16} color={dark?'#fff':'#3C3C43'}/>
              </div>
              {p.a && (
                <Body dark={dark} size={14} style={{
                  marginTop: 8, fontFamily: '"New York", serif', lineHeight: 1.5,
                }}>{p.a}</Body>
              )}
            </div>
          </Glass>
        ))}
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 18, left: 14, right: 14, display: 'flex', gap: 8 }}>
      <Glass dark={dark} radius={26} style={{ flex: 1 }}>
        <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <Icon name="mic" size={16} color={dark?'#fff':'#3C3C43'}/>
          <Headline dark={dark} size={14}>音声で答える</Headline>
        </div>
      </Glass>
      <Glass dark={dark} radius={26} style={{ flex: 1 }}>
        <div style={{ position:'absolute', inset:0, borderRadius:26, background:'#1c1c1e' }} />
        <div style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, position:'relative' }}>
          <Icon name="pencil" size={16} color="#fff"/>
          <Headline size={14} style={{ color:'#fff' }}>書く</Headline>
        </div>
      </Glass>
    </div>
  </PaperBG>
);

// C — ミニマル: 大きな自由ノート
const DetailC = ({ dark }) => (
  <PaperBG dark={dark}>
    <TopBarGlass dark={dark}
      trailing={<>
        <GlassPill dark={dark}><Icon name="photo" size={16} color={dark?'#fff':'#3C3C43'}/></GlassPill>
        <GlassPill dark={dark}><Icon name="mic" size={16} color={dark?'#fff':'#3C3C43'}/></GlassPill>
        <GlassPill dark={dark}><Icon name="ellipsis" size={16} color={dark?'#fff':'#3C3C43'}/></GlassPill>
      </>}
    />

    {/* compact event chip */}
    <div style={{ padding: '100px 20px 0', display: 'flex' }}>
      <Glass dark={dark} radius={999} style={{
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          {dot('#FF6E61')}
          <Headline dark={dark} size={13}>デザインレビュー</Headline>
          <Caption dark={dark} size={12}>10:00 · 60分</Caption>
        </div>
      </Glass>
    </div>

    <div style={{ padding: '20px 26px 0' }}>
      <Mincho dark={dark} size={26} style={{ lineHeight: 1.4, fontWeight: 500 }}>
        いい配色は<br/>説明できるんだ、<br/>と思った。
      </Mincho>
      <Body dark={dark} size={15} style={{
        marginTop: 18, fontFamily:'"New York","Hiragino Mincho ProN",serif', lineHeight: 1.75,
      }}>
        Yukiは「これを伝えたいから、この色」と<br/>
        毎回理由を持っていた。<br/>
        自分は感覚で選んでいた、<br/>
        ことに気づいた。
        <span style={{
          display:'inline-block', width:2, height:18, background:'#FF6E61',
          verticalAlign:'middle', marginLeft:2, animation:'blink 1s infinite',
        }}/>
      </Body>
    </div>

    {/* AI subtle */}
    <div style={{ position: 'absolute', left: 14, right: 14, bottom: 80 }}>
      <Glass dark={dark} radius={14}>
        <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="sparkle" size={14} color="#AF52DE"/>
          <Caption dark={dark} size={12} style={{ flex: 1 }}>
            タグ提案：<HL>#自己理解</HL>
          </Caption>
          <Headline dark={dark} size={13} style={{ color:'#FF6E61' }}>追加</Headline>
        </div>
      </Glass>
    </div>

    <div style={{ position: 'absolute', bottom: 18, left: 14, right: 14, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <Glass dark={dark} radius={999} style={{ padding: '8px 14px' }}>
        <Caption dark={dark} size={12} style={{ fontFeatureSettings:'"tnum"' }}>132字 · 自動保存</Caption>
      </Glass>
      <Glass dark={dark} radius={999} style={{ padding: '8px 18px' }}>
        <Headline dark={dark} size={14} style={{ color:'#FF6E61' }}>完了</Headline>
      </Glass>
    </div>
  </PaperBG>
);

// D — 音声＋写真ファースト
const DetailD = ({ dark }) => (
  <PaperBG dark={dark}>
    <TopBarGlass dark={dark}
      trailing={<GlassPill dark={dark}><Headline dark={dark} size={14} style={{ color:'#FF6E61', padding:'0 4px' }}>完了</Headline></GlassPill>}
    />

    <div style={{ padding: '100px 22px 6px' }}>
      <Caption dark={dark} size={12} style={{ letterSpacing: 0.4, textTransform:'uppercase' }}>仕事 · 10:00 – 11:00</Caption>
      <LargeTitle dark={dark} style={{ fontSize: 26, marginTop: 4 }}>デザインレビュー</LargeTitle>
    </div>

    {/* voice hero */}
    <div style={{ padding: '12px 16px' }}>
      <Glass dark={dark} radius={22} style={{
        boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          position:'absolute', inset:0, borderRadius:22,
          background: dark
            ? 'linear-gradient(180deg, rgba(255,110,97,0.18), rgba(175,82,222,0.12))'
            : 'linear-gradient(180deg, rgba(255,179,64,0.22), rgba(255,110,97,0.12))',
        }}/>
        <div style={{ padding: '16px', position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 12 }}>
            <Glass dark={dark} radius={999} style={{
              width: 52, height: 52, display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <div style={{ position:'absolute', inset:4, borderRadius:999, background:'#FF3B30' }}/>
              <div style={{ position:'relative', width:14, height:14, borderRadius:3, background:'#fff' }}/>
            </Glass>
            <div style={{ flex:1 }}>
              <Headline dark={dark} size={15}>録音中…</Headline>
              <Caption dark={dark} size={12}>無音で自動停止 · あとで編集OK</Caption>
            </div>
            <Caption dark={dark} size={13} style={{ fontFeatureSettings:'"tnum"' }}>0:42</Caption>
          </div>
          <div style={{ marginTop: 14, display:'flex', gap: 2, alignItems:'center', height: 32 }}>
            {Array.from({length: 48}).map((_, i) => (
              <div key={i} style={{
                width: 3, height: 4 + Math.abs(Math.sin(i*0.7))*26,
                background: i < 28 ? '#FF6E61' : (dark?'rgba(255,255,255,0.3)':'rgba(60,60,67,0.3)'),
                borderRadius: 2,
              }}/>
            ))}
          </div>
        </div>
      </Glass>
    </div>

    {/* photo strip */}
    <div style={{ padding: '4px 16px', display:'flex', gap: 8 }}>
      {[1,2].map(i => (
        <Glass key={i} dark={dark} radius={14} style={{ width: 88, height: 88 }}>
          <div style={{ position:'absolute', inset:0, borderRadius:14,
            background: i===1?'linear-gradient(135deg,#5AC8FA,#AF52DE)':'linear-gradient(135deg,#FFB340,#FF6E61)' }}/>
        </Glass>
      ))}
      <Glass dark={dark} radius={14} style={{ width: 88, height: 88, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Icon name="plus" size={20} color={dark?'#fff':'#3C3C43'}/>
      </Glass>
    </div>

    {/* transcript */}
    <div style={{ padding: '14px 16px' }}>
      <Glass dark={dark} radius={14}>
        <div style={{ padding: '12px 14px' }}>
          <Caption dark={dark} size={11} style={{ textTransform:'uppercase', letterSpacing: 0.5 }}>書きおこし · 編集できます</Caption>
          <Body dark={dark} size={14} style={{ marginTop: 6, fontFamily:'"New York",serif', lineHeight: 1.55 }}>
            えーと、今日のレビューはYukiが配色の提案をしてくれて、最初は違和感あったんだけど、<HL>理由を聞いたら腑に落ちた</HL>。
          </Body>
        </div>
      </Glass>
    </div>
  </PaperBG>
);

Object.assign(window, { DetailA, DetailB, DetailC, DetailD });
