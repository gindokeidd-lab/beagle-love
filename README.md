# ビーグルという幸せ

ビーグル犬の魅力を伝える、趣味・非販売目的の無料LPです。React/Viteで作成し、GitHub Pagesでの無料公開を想定しています。
https://gindokeidd-lab.github.io/beagle-love/

## 内容

- メインビジュアル
- 5つの可愛い
- 3つの大変ポイント
- ビーグル犬のヒストリー
- 現在の状況
- 6枚構成のビーグル犬プレゼン資料ダウンロード

音声素材は、FreesoundのCC0素材「Dog Extended Howl.wav」を使用しています。

## ローカル開発

```bash
npm install
npm run dev
```

PDF資料はビルド前に自動生成されます。単体で更新する場合は次を実行します。

```bash
npm run generate:pdf
```

## ビルド

```bash
npm run build
npm run preview
```

## GitHub Pages

`.github/workflows/deploy.yml`でGitHub Pagesへ静的ファイルを公開します。通常のプロジェクトページでは、Viteの`base`はリポジトリ名から自動推定します。ユーザー/組織ページや別URLで公開する場合は、Actionsの環境変数`VITE_BASE`で上書きしてください。
