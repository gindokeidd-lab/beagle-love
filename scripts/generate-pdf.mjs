import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// このスクリプトが置かれているフォルダの場所を取得します。
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// プロジェクトの一番上のフォルダを取得します。
const rootDir = path.resolve(__dirname, '..');

// 生成するPDFファイルの保存先です。
const outPath = path.join(rootDir, 'public', 'downloads', 'beagle-presentation.pdf');

// PDF表紙に埋め込むJPEG画像の保存先です。
const coverPath = path.join(rootDir, 'public', 'images', 'pdf-cover.jpg');

// PDFの1ページあたりの横幅と高さです。
const page = { width: 960, height: 540 };

// 表紙画像のバイナリデータを読み込みます。
const coverImage = fs.readFileSync(coverPath);

// 表紙画像の横幅と高さをPDFに伝えるための情報です。
const coverSize = getJpegSize(coverImage);

// PDFに入れる6枚のスライド本文です。
const slides = [
  {
    kind: 'cover',
    label: 'FREE BEAGLE PDF',
    title: 'ビーグルという幸せ',
    body: ['人もご飯も犬も！みんな大好き！', 'ミラクルハッピードッグの魅力を知ろう！'],
  },
  {
    label: '01 / OVERVIEW',
    title: 'ビーグルってどんな犬？',
    body: [
      '明るく、人なつっこく、食べることと匂いを嗅ぐことが大好きな犬。',
      'もともとはイギリスで発展したハウンド犬です。',
      'アメリカでも人気犬種上位の常連で、2025年のAKC人気犬種ランキングでは7位です。',
      'AKCは、American Kennel Clubの略で、アメリカの主要な犬種登録団体です。',
    ],
  },
  {
    label: '02 / CUTE POINTS',
    title: '5つの可愛い',
    body: [
      '1. 食べ物への愛が全力すぎる',
      '2. 人も犬も大好き',
      '3. 実は鼻のプロ',
      '4. オシャレな模様と筆みたいなしっぽ',
      '5. 笑顔で外へ連れ出してくれる相棒',
    ],
  },
  {
    label: '03 / CHALLENGES',
    title: '3つの大変ポイント',
    body: [
      '1. 可愛すぎる遠吠え、でも躾はしっかり',
      '2. 長すぎるクン活。本人は新聞を読んでいるつもり',
      '3. イタズラ大好き、そこも愛して',
      '大変だけど、そこもビーグルらしさです。',
    ],
  },
  {
    label: '04 / RECOMMENDED',
    title: 'こんな人におすすめ',
    body: [
      '明るくて人なつっこい犬が好きな人。',
      '散歩やアウトドアを一緒に楽しみたい人。',
      '食いしん坊で、ちょっとお茶目な相棒に惹かれる人。',
      '犬の個性も含めて、楽しく向き合いたい人。',
    ],
  },
  {
    label: '05 / SUMMARY',
    title: 'ビーグルは、ちょっと大変で、ものすごく可愛い。',
    body: [
      '人と一緒に笑って、歩いて、暮らしてくれる相棒です。',
      'ご飯も、人も、犬も、匂いの世界も大好き。',
      'ビーグルという幸せを、少しだけ広げてみませんか。',
    ],
    note: 'この資料は趣味・非販売目的の無料コンテンツです。',
  },
];

// PDF内部に書き込むオブジェクトを順番に入れる配列です。
const objects = [];

// PDF内部のオブジェクトを追加し、その番号を返す関数です。
const addObject = (body) => {
  objects.push(Buffer.isBuffer(body) ? body : Buffer.from(body, 'binary'));
  return objects.length;
};

// PDF全体の目次にあたるカタログオブジェクトの番号です。
const catalogId = addObject('CATALOG');

// PDF内のページ一覧を管理するオブジェクトの番号です。
const pagesId = addObject('PAGES');

// 日本語を表示するためのフォント設定です。
const fontId = addObject(
  '<< /Type /Font /Subtype /Type0 /BaseFont /HeiseiKakuGo-W5 /Encoding /UniJIS-UCS2-H /DescendantFonts [4 0 R] >>',
);

// PDFフォントの詳細設定です。
const descendantFontId = addObject(
  '<< /Type /Font /Subtype /CIDFontType0 /BaseFont /HeiseiKakuGo-W5 /CIDSystemInfo << /Registry (Adobe) /Ordering (Japan1) /Supplement 5 >> /FontDescriptor 5 0 R /DW 1000 >>',
);

// PDFフォントの見た目に関する情報です。
const descriptorId = addObject(
  '<< /Type /FontDescriptor /FontName /HeiseiKakuGo-W5 /Flags 6 /FontBBox [0 -200 1000 900] /ItalicAngle 0 /Ascent 880 /Descent -120 /CapHeight 700 /StemV 80 >>',
);

// 表紙画像をPDF内部で使える画像オブジェクトに変換します。
const coverImageId = addObject(
  Buffer.concat([
    Buffer.from(
      `<< /Type /XObject /Subtype /Image /Width ${coverSize.width} /Height ${coverSize.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${coverImage.length} >>\nstream\n`,
      'binary',
    ),
    coverImage,
    Buffer.from('\nendstream', 'binary'),
  ]),
);

// PDF内部の番号が想定どおりかを確認します。
if (fontId !== 3 || descendantFontId !== 4 || descriptorId !== 5 || coverImageId !== 6) {
  throw new Error('Unexpected PDF object numbering.');
}

// 生成したページオブジェクトの番号を入れておく配列です。
const pageIds = [];

// slides配列を1枚ずつPDFページに変換します。
for (const slide of slides) {
  const contentId = addObject(makeContent(slide));
  const pageId = addObject(
    `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /Font << /F1 ${fontId} 0 R >> /XObject << /Cover ${coverImageId} 0 R >> >> /Contents ${contentId} 0 R >>`,
  );
  pageIds.push(pageId);
}

objects[catalogId - 1] = Buffer.from(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`, 'binary');
objects[pagesId - 1] = Buffer.from(
  `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`,
  'binary',
);

writePdf(outPath, objects);
console.log(`Generated ${path.relative(rootDir, outPath)}`);

// 1枚のスライドをPDF描画命令へ変換する関数です。
function makeContent(slide) {
  const commands = [];
  rect(commands, 0, 0, page.width, page.height, '#fffefa');
  rect(commands, 0, 0, 18, page.height, '#2d6f4b');
  rect(commands, 18, 0, page.width - 18, 76, '#e9f5fb');

  if (slide.kind === 'cover') {
    rect(commands, 0, 0, page.width, page.height, '#f7fbef');
    drawImage(commands, 585, 0, 375, 540);
    rect(commands, 0, 0, 22, page.height, '#e8634f');
    text(commands, slide.label, 70, 424, 18, '#2d6f4b');
    multiline(commands, slide.title, 70, 326, 44, 1.15, '#143d2a');
    multiline(commands, slide.body, 74, 186, 21, 1.6, '#34443a');
    rect(commands, 70, 80, 254, 44, '#e8634f');
    text(commands, '無料PDF / 趣味コンテンツ', 92, 94, 18, '#ffffff');
  } else {
    text(commands, slide.label, 66, 484, 16, '#2d6f4b');
    multiline(commands, slide.title, 66, 400, 35, 1.15, '#143d2a');
    line(commands, 66, 354, 848, 354, '#f2b84b', 4);
    const bodyStart = slide.body.length >= 5 ? 302 : 292;
    bulletList(commands, slide.body, 78, bodyStart, 23, '#34443a');
    if (slide.note) {
      rect(commands, 66, 54, 828, 42, '#e9f5fb');
      text(commands, slide.note, 86, 68, 15, '#12324a');
    }
  }

  const stream = commands.join('\n');
  return `<< /Length ${Buffer.byteLength(stream, 'binary')} >>\nstream\n${stream}\nendstream`;
}

// 塗りつぶしの四角形をPDFに描く関数です。
function rect(commands, x, y, width, height, color) {
  commands.push(`${rgb(color)} rg ${x} ${y} ${width} ${height} re f`);
}

// 線をPDFに描く関数です。
function line(commands, x1, y1, x2, y2, color, width) {
  commands.push(`${rgb(color)} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
}

// 表紙画像をPDFに描く関数です。
function drawImage(commands, x, y, width, height) {
  commands.push(`q ${width} 0 0 ${height} ${x} ${y} cm /Cover Do Q`);
}

// 1行の文字をPDFに描く関数です。
function text(commands, value, x, y, size, color) {
  commands.push(`BT ${rgb(color)} rg /F1 ${size} Tf 1 0 0 1 ${x} ${y} Tm <${toUcs2Hex(value)}> Tj ET`);
}

// 複数行の文字をPDFに描く関数です。
function multiline(commands, value, x, y, size, lineHeight, color) {
  const lines = Array.isArray(value) ? value : wrap(value, size >= 40 ? 15 : 25);
  lines.forEach((lineText, index) => {
    text(commands, lineText, x, y - index * size * lineHeight, size, color);
  });
}

// 箇条書きをPDFに描く関数です。
function bulletList(commands, items, x, y, size, color) {
  let yOffset = 0;

  items.forEach((item, index) => {
    const lines = wrap(item, 32);
    const itemY = y - yOffset;
    rect(commands, x - 20, itemY - 4, 8, 8, '#e8634f');
    lines.forEach((lineText, lineIndex) => {
      text(commands, lineText, x, itemY - 3 - lineIndex * size * 1.28, size, color);
    });
    yOffset += lines.length * size * 1.28 + (index === items.length - 1 ? 0 : 16);
  });
}

// 長い文章を指定した文字数ごとに折り返す関数です。
function wrap(value, maxChars) {
  const chars = [...value];
  const lines = [];
  for (let i = 0; i < chars.length; i += maxChars) {
    lines.push(chars.slice(i, i + maxChars).join(''));
  }
  return lines;
}

// CSSで使う16進数カラーをPDF用のRGB値に変換する関数です。
function rgb(hex) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

// 日本語文字列をPDFの文字コードに変換する関数です。
function toUcs2Hex(value) {
  return [...value]
    .map((char) => char.charCodeAt(0).toString(16).padStart(4, '0'))
    .join('');
}

// PDFファイル全体を書き出す関数です。
function writePdf(filePath, objectBodies) {
  const header = Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'binary');
  const chunks = [header];
  const offsets = [0];
  let offset = header.length;

  objectBodies.forEach((body, index) => {
    offsets.push(offset);
    const before = Buffer.from(`${index + 1} 0 obj\n`, 'binary');
    const after = Buffer.from('\nendobj\n', 'binary');
    chunks.push(before, body, after);
    offset += before.length + body.length + after.length;
  });

  const xrefOffset = offset;
  const xrefLines = [
    'xref',
    `0 ${objectBodies.length + 1}`,
    '0000000000 65535 f ',
    ...offsets.slice(1).map((entry) => `${String(entry).padStart(10, '0')} 00000 n `),
    'trailer',
    `<< /Size ${objectBodies.length + 1} /Root ${catalogId} 0 R >>`,
    'startxref',
    String(xrefOffset),
    '%%EOF',
    '',
  ];

  chunks.push(Buffer.from(xrefLines.join('\n'), 'binary'));
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, Buffer.concat(chunks));
}

// JPEG画像の横幅と高さを読み取る関数です。
function getJpegSize(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: buffer.readUInt16BE(offset + 5),
        width: buffer.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  throw new Error('Could not read JPEG dimensions.');
}
