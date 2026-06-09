import { useRef, useState } from 'react';
import {
  ArrowDown,
  BookOpen,
  CheckCircle2,
  Download,
  FileDown,
  Globe2,
  Heart,
  Leaf,
  Megaphone,
  Newspaper,
  PawPrint,
  Play,
  Sparkles,
  Trophy,
  Utensils,
  Volume2,
} from 'lucide-react';

// ViteがGitHub Pages用の公開パスを教えてくれる値です。
const baseUrl = import.meta.env.BASE_URL;

// publicフォルダ内の画像・音声・PDFを、公開パス込みで呼び出すための関数です。
const asset = (path) => `${baseUrl}${path}`;

// PDFダウンロードボタンが使う資料ファイルの場所です。
const presentationPdfUrl = asset('downloads/beagle-presentation.pdf');

// 遠吠えボタンが使う音声ファイルの場所です。
const howlAudioUrl = asset('audio/beagle-howling.mp3');

// メイン背景に散らすビーグル写真の一覧です。
const heroCollageImages = [
  {
    src: 'images/hero-collage-park.png',
    alt: '公園でこちらを見るビーグル',
    className: 'hero-collage__photo hero-collage__photo--park',
  },
  {
    src: 'images/hero-collage-running.png',
    alt: '芝生を元気に走るビーグル',
    className: 'hero-collage__photo hero-collage__photo--running',
  },
  {
    src: 'images/hero-collage-sniffing.png',
    alt: '散歩道で匂いを嗅ぐビーグル',
    className: 'hero-collage__photo hero-collage__photo--sniffing',
  },
  {
    src: 'images/hero-collage-food.png',
    alt: 'ご飯を待っているビーグル',
    className: 'hero-collage__photo hero-collage__photo--food',
  },
  {
    src: 'images/hero-collage-tail.png',
    alt: '白いしっぽを立てて歩くビーグル',
    className: 'hero-collage__photo hero-collage__photo--tail',
  },
  {
    src: 'images/hero-collage-relax.png',
    alt: '家でくつろぐビーグル',
    className: 'hero-collage__photo hero-collage__photo--relax',
  },
];

// 5つの可愛いをカードとして表示するための文章と画像です。
const cuteReasons = [
  {
    icon: Utensils,
    image: 'images/cute-food.png',
    alt: 'キッチンでご飯を待つ若いビーグル',
    title: '食べ物への愛が全力すぎる',
    text: '食べ物が大好きで、薬まで美味しそうに食べてくれることも。食わず嫌いの少なさまで、ビーグルらしい愛嬌です。',
  },
  {
    icon: Heart,
    image: 'images/cute-friends.png',
    alt: '公園で他の犬と挨拶するビーグル',
    title: '人も犬も大好き',
    text: '人間も、他の犬も、だいたい大好き。誰にでも懐きにいくフレンドリーさが、見ていてたまらなく可愛いです。',
  },
  {
    icon: Sparkles,
    image: 'images/cute-nose-pro.png',
    alt: '荷物の匂いを真剣に嗅ぐビーグル',
    title: '実は鼻のプロ。検疫探知犬にもなる実力派',
    text: '可愛い顔をして、嗅覚は本格派。空港などで検疫探知犬として活躍するビーグルもいます。',
  },
  {
    icon: PawPrint,
    image: 'images/cute-tail.png',
    alt: '白いしっぽを立てて草むらを歩くビーグル',
    title: 'オシャレな模様と筆みたいなしっぽがズルすぎる',
    text: '三色の模様はまるで毎日違って見えるおしゃれ着。草むらでも見つけやすい、白い筆みたいなしっぽも最高です。',
  },
  {
    icon: Leaf,
    image: 'images/cute-outdoor.png',
    alt: '青空の下で元気に走るビーグル',
    title: '笑顔で外へ連れ出してくれる相棒',
    text: '元気で健脚、アウトドア適性も高め。楽しそうな笑顔で「外、行こうよ」と誘ってくれる相棒です。',
  },
];

// 3つの大変ポイントをカードとして表示するための文章と画像です。
const challengePoints = [
  {
    icon: Megaphone,
    image: 'images/challenge-howl.png',
    alt: '遠吠えをするビーグル',
    title: '可愛すぎる遠吠え、でも躾はしっかり',
    text: 'ビーグルの声は個性的で、思わず聞きたくなる可愛さがあります。ただしよく通る声なので、暮らしに合わせた躾は大切です。',
    hasAudio: true,
  },
  {
    icon: Newspaper,
    image: 'images/challenge-sniffing.png',
    alt: '歩道で長く匂いを嗅ぐビーグル',
    title: '長すぎるクン活。本人は新聞を読んでいるつもり',
    text: '匂いを嗅ぐ時間は、ビーグルにとって大事な情報収集。人間から見ると長いけれど、本人は真剣に世界を読んでいます。',
  },
  {
    icon: Sparkles,
    image: 'images/challenge-mischief.png',
    alt: 'おもちゃの近くで得意げに座るビーグル',
    title: 'イタズラ大好き、そこも愛して',
    text: '好奇心が強いぶん、思わぬイタズラをすることもあります。困る日もあるけれど、その前向きさまでビーグルらしさです。',
  },
];

// 現在の状況を数字カードとして見せるためのデータです。
const statusCards = [
  {
    icon: Trophy,
    label: 'アメリカ人気',
    value: 'AKC 2025年 7位',
    text: 'AKC人気犬種ランキングでは、ビーグルは今も上位の常連です。',
  },
  {
    icon: PawPrint,
    label: '日本での登録',
    value: 'JKC 2025年 27位 / 1,973頭',
    text: 'これは飼育総数ではなく、その年に犬籍登録された頭数です。',
  },
  {
    icon: Sparkles,
    label: '鼻のプロ',
    value: '検疫探知犬として活躍',
    text: '嗅覚を活かして、人の暮らしを支えるビーグルもいます。',
  },
];

// PDF資料に入る内容をLP側でも短く見せるための一覧です。
const presentationPoints = [
  'ビーグルってどんな犬？',
  '5つの可愛い',
  '3つの大変ポイント',
  'こんな人におすすめ',
  'ビーグルという幸せのまとめ',
];

// 参照情報をフッターにまとめて表示するための一覧です。
const sourceLinks = [
  {
    href: 'https://www.akc.org/expert-advice/dog-breeds/most-popular-dog-breeds-2025/',
    label: 'AKC 2025人気犬種ランキング',
  },
  {
    href: 'https://www.jkc.or.jp/registr-statistics/',
    label: 'JKC 犬種別犬籍登録頭数',
  },
  {
    href: 'https://www.maff.go.jp/aqs/job/detectordog.html',
    label: '農林水産省 動植物検疫探知犬',
  },
  {
    href: 'https://freesound.org/people/Jace/sounds/155315/',
    label: 'Freesound Dog Extended Howl.wav',
  },
];

// LP全体を表示する一番外側のReact部品です。
function App() {
  return (
    <>
      <SiteHeader />
      <main id="top">
        <HeroSection />
        <CuteSection />
        <ChallengeSection />
        <HistorySection />
        <StatusSection />
        <DownloadSection />
      </main>
      <Footer />
      <FixedDownloadCta />
    </>
  );
}

// ページ上部に固定されるナビゲーションを表示する部品です。
function SiteHeader() {
  return (
    <header className="site-header" aria-label="サイトヘッダー">
      <a className="brand" href="#top" aria-label="トップへ戻る">
        <PawPrint aria-hidden="true" />
        <span>Beagle Happiness</span>
      </a>
      <nav className="nav-links" aria-label="ページ内ナビゲーション">
        <a href="#cute">5つの可愛い</a>
        <a href="#challenge">大変ポイント</a>
        <a href="#history">ヒストリー</a>
        <a href="#download">資料</a>
      </nav>
    </header>
  );
}

// 最初の画面に表示するメインビジュアルを作る部品です。
function HeroSection() {
  return (
    <section className="hero" aria-label="ビーグル犬LPのメイン">
      <div className="hero-collage" aria-hidden="true">
        {heroCollageImages.map((image) => (
          <img key={image.src} src={asset(image.src)} alt="" className={image.className} />
        ))}
      </div>

      <img
        className="hero__paws-beagle"
        src={asset('images/hero-paws-beagle.png')}
        alt="前足をかけてこちらを見るビーグル"
      />

      <div className="hero__shade" aria-hidden="true" />

      <div className="hero__title-band">
        <h1>
          <span>ビーグルという</span>
          <span>幸せ</span>
        </h1>
      </div>

      <div className="hero__subtitle">
        <p>
          人もご飯も犬も！みんな大好き！
          <br />
          ミラクルハッピードッグの魅力を知ろう！
        </p>
      </div>

      <a className="hero__arrow" href="#cute" aria-label="次のセクションへ進む">
        <ArrowDown aria-hidden="true" />
      </a>
    </section>
  );
}

// 5つの可愛いを、画像付きの番号カードとして表示する部品です。
function CuteSection() {
  return (
    <section id="cute" className="section section--paper">
      <div className="section__inner">
        <SectionHeading
          label="5 Cute Points"
          title="5つの可愛い"
          text="飼うべき理由というより、知ったら好きになってしまう理由。ビーグルの魅力を、少し大げさなくらい正直に並べます。"
        />

        <div className="cute-list">
          {cuteReasons.map((reason, index) => (
            <CuteReasonCard key={reason.title} reason={reason} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 5つの可愛いのうち、1つ分のカードを表示する部品です。
function CuteReasonCard({ reason, index }) {
  // 配列に入っているアイコン部品を、JSXで使いやすい名前に変えています。
  const Icon = reason.icon;

  return (
    <article className="cute-card">
      <div className="cute-card__image-wrap">
        <img src={asset(reason.image)} alt={reason.alt} />
      </div>
      <div className="cute-card__body">
        <div className="card-kicker">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <Icon aria-hidden="true" />
        </div>
        <h3>{reason.title}</h3>
        <p>{reason.text}</p>
      </div>
    </article>
  );
}

// 大変ポイントと音声ボタンを表示する部品です。
function ChallengeSection() {
  // 音声ファイルをJavaScriptから操作するための参照です。
  const audioRef = useRef(null);

  // 音声が再生中かどうかをボタン表示に反映するための状態です。
  const [isHowlPlaying, setIsHowlPlaying] = useState(false);

  // 遠吠えの再生を止めて、次に押したときは最初から鳴るように戻す関数です。
  const stopHowlPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsHowlPlaying(false);
  };

  // 遠吠えボタンを押したときに音声を再生・停止する関数です。
  const handleHowlClick = async () => {
    if (!audioRef.current) return;

    if (!audioRef.current.paused) {
      stopHowlPlayback();
      return;
    }

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
      setIsHowlPlaying(true);
    } catch {
      setIsHowlPlaying(false);
    }
  };

  return (
    <section id="challenge" className="section section--green">
      <div className="section__inner">
        <SectionHeading
          label="Lovely Challenges"
          title="3つの大変ポイント"
          text="大変だけど、そこもビーグルらしさ。可愛さに流されすぎず、暮らす前に知っておきたいポイントです。"
        />

        <div className="challenge-grid">
          {challengePoints.map((point) => {
            const Icon = point.icon;

            return (
              <article className="challenge-card" key={point.title}>
                <img src={asset(point.image)} alt={point.alt} />
                <div className="challenge-card__body">
                  <div className="card-kicker">
                    <Icon aria-hidden="true" />
                    <span>大変だけど可愛い</span>
                  </div>
                  <h3>{point.title}</h3>
                  <p>{point.text}</p>
                  {point.hasAudio ? (
                    <button className="audio-button" type="button" onClick={handleHowlClick}>
                      {isHowlPlaying ? <Volume2 aria-hidden="true" /> : <Play aria-hidden="true" />}
                      <span>{isHowlPlaying ? '再生中' : 'ビーグルの声を聞いてみる'}</span>
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <audio
          ref={audioRef}
          src={howlAudioUrl}
          preload="none"
          onEnded={stopHowlPlayback}
        />
      </div>
    </section>
  );
}

// ビーグルの歴史を読み物として表示する部品です。
function HistorySection() {
  return (
    <section id="history" className="history-section">
      <img
        className="history-section__image"
        src={asset('images/history-beagle.png')}
        alt="森で鼻を使って匂いを追うビーグル"
      />
      <div className="history-section__overlay" aria-hidden="true" />
      <div className="section__inner history-section__content">
        <p className="eyebrow">History</p>
        <h2>ビーグル犬のヒストリー</h2>
        <div className="reading-text">
          <p>
            ビーグルは、ただ可愛いだけの犬ではありません。昔から人のそばで働いてきた、小さな相棒です。
          </p>
          <p>
            もともとはイギリスで発展したハウンド犬。ハウンドとは、獲物を探したり追ったりする猟犬の仲間です。ビーグルはその中でもコンパクトで、野ウサギの足跡を鼻で追う犬として活躍してきました。
          </p>
          <p>
            つまり、あの長すぎるクン活には理由があります。ビーグルにとって匂いを嗅ぐことは、世界を読むこと。道ばたの匂いも、草むらの匂いも、本人にとっては大事なニュースなのです。
          </p>
          <p>
            そしてビーグルは、アメリカでも大人気の犬になっていきます。1885年にはAKC（American Kennel Club：アメリカの主要な犬種登録団体）に登録され、家庭犬としても愛される存在になりました。
          </p>
          <p>
            今のビーグルは、猟の相棒から、暮らしの相棒へ。人が好きで、犬も好きで、ご飯も大好き。昔から人と一緒に動いてきた明るさが、今も家庭の中でミラクルハッピーに輝いています。
          </p>
        </div>
      </div>
    </section>
  );
}

// ビーグルの現在の立ち位置を数字カードで表示する部品です。
function StatusSection() {
  return (
    <section className="section section--paper">
      <div className="section__inner status-layout">
        <div className="status-layout__image">
          <img src={asset('images/status-beagle.png')} alt="公園で誇らしげに立つビーグル" />
        </div>
        <div className="status-layout__content">
          <SectionHeading
            label="Now"
            title="現在の状況"
            text="ビーグルは、爆発的な流行だけで語る犬ではありません。国や役割ごとに、今も根強く愛され、活躍しています。"
          />

          <div className="status-grid">
            {statusCards.map((card) => {
              const Icon = card.icon;

              return (
                <article className="status-card" key={card.label}>
                  <Icon aria-hidden="true" />
                  <p className="status-card__label">{card.label}</p>
                  <h3>{card.value}</h3>
                  <p>{card.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// PDF資料の説明とダウンロードボタンを表示する部品です。
function DownloadSection() {
  return (
    <section id="download" className="section download-section">
      <div className="section__inner download-layout">
        <div className="download-layout__cover">
          <img src={asset('images/pdf-cover.png')} alt="ビーグル犬プレゼン資料の表紙画像" />
        </div>

        <div className="download-layout__content">
          <p className="eyebrow">Support Beagles</p>
          <h2>ビーグル犬を応援しよう</h2>
          <p>
            ビーグルの魅力は、見れば見るほど、知れば知るほど伝えたくなります。このLPの内容を、誰かへ気軽に紹介できる無料プレゼン資料にまとめました。
          </p>

          <ul className="check-list" aria-label="PDF資料に含まれる内容">
            {presentationPoints.map((point) => (
              <li key={point}>
                <CheckCircle2 aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <a className="button button--primary" href={presentationPdfUrl} download>
            <FileDown aria-hidden="true" />
            <span>ビーグル犬プレゼン資料をダウンロード</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// 各セクションの見出しを同じ見た目で表示する部品です。
function SectionHeading({ label, title, text }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

// 画面下に小さく固定するPDFダウンロード導線です。
function FixedDownloadCta() {
  return (
    <a className="fixed-cta" href={presentationPdfUrl} download>
      <Download aria-hidden="true" />
      <span>ビーグル資料をダウンロード</span>
    </a>
  );
}

// ページ末尾に、趣味LPであることと参考情報を表示する部品です。
function Footer() {
  return (
    <footer className="site-footer">
      <div className="section__inner footer-layout">
        <div>
          <div className="footer-brand">
            <BookOpen aria-hidden="true" />
            <span>ビーグルという幸せ</span>
          </div>
          <p>
            このページは、ビーグル犬の良さを伝えるための趣味・非販売目的の無料LPです。飼育や健康に関する判断は、専門家や信頼できる飼育者にも相談してください。
          </p>
        </div>
        <div>
          <p className="footer-title">参考情報</p>
          <ul className="source-list">
            {sourceLinks.map((source) => (
              <li key={source.href}>
                <Globe2 aria-hidden="true" />
                <a href={source.href} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default App;
