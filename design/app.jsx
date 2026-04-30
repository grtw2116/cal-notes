// app.jsx — Liquid Glass redesign

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "appearance": "light",
  "accent": "warm",
  "fontStyle": "mixed"
}/*EDITMODE-END*/;

function applyTweaks(t) {
  // accent variants are scoped per-screen; nothing global needed for now
}

const Frame = ({ dark, children }) => (
  <IOSDevice width={390} height={780} dark={dark}>
    {children}
  </IOSDevice>
);

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(tweaks); }, [tweaks]);

  const dark = tweaks.appearance === 'dark';

  const ab = (id, label, Comp) => (
    <DCArtboard id={id} label={label} width={390} height={780}>
      <Frame dark={dark}><Comp dark={dark} /></Frame>
    </DCArtboard>
  );

  return (
    <>
      <DesignCanvas
        title="cal-notes · ワイヤーフレーム"
        subtitle="iPhone · iOS 26 Liquid Glass · Apple Notes inspired · 各画面 4 案"
      >
        <DCSection id="home" title="① ホーム / 今日" subtitle="1日の流れと “書く / 読む” の入り口 — A 案を採用">
          {ab('home-a', '★ A · Notes風 タイムラインカード（採用）', HomeA)}
          {ab('home-b', 'B · Calendar Day View（時刻軸）', HomeB)}
          {ab('home-c', 'C · Notes フォルダ風リスト', HomeC)}
          {ab('home-d', 'D · 季節ヘッダ + Glass（攻めた案）', HomeD)}
        </DCSection>

        <DCSection id="detail" title="② 予定詳細 + 日記入力" subtitle="1予定 = 1ノート — A 案を採用">
          {ab('detail-a', '★ A · Apple Notes 編集画面（採用）', DetailA)}
          {ab('detail-b', 'B · プロンプト誘導', DetailB)}
          {ab('detail-c', 'C · ミニマル 自由ノート', DetailC)}
          {ab('detail-d', 'D · 音声＋写真ファースト', DetailD)}
        </DCSection>

        <DCSection id="past" title="③ 振り返り / カレンダー" subtitle="あとから読む。検索する。週次/月次サマリーもここに含める想定（4案そのまま継続検討）">
          {ab('past-a', 'A · 月カレンダー＋日記リスト', PastA)}
          {ab('past-b', 'B · 縦タイムライン（年月）', PastB)}
          {ab('past-c', 'C · タイルグリッド', PastC)}
          {ab('past-d', 'D · 検索＋タグクラウド（攻めた案）', PastD)}
        </DCSection>

        <DCSection id="summary" title="④ AI による振り返り — テーマ別" subtitle="これまで全部の日記を、カテゴリ・タグ別に AI が振り返り、対話に繋げる">
          {ab('sum-a', 'A · カテゴリグリッド + AI Bottom Sheet', SummaryA)}
          {ab('sum-b', 'B · タグ別 縦リスト + AI 引用', SummaryB)}
          {ab('sum-c', 'C · AI チャット画面（遷移先）', SummaryC)}
          {ab('sum-d', 'D · AI が見つけた物語コレクション', SummaryD)}
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="アピアランス">
          <TweakRadio
            value={tweaks.appearance}
            onChange={(v) => setTweak('appearance', v)}
            options={[
              { value: 'light', label: 'ライト' },
              { value: 'dark', label: 'ダーク' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
