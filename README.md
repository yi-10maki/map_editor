# マップチップエディタの説明

制作人数(githubアカウント名)：3名（yi-10maki，Scrapzero，Yukarion）

概要：マップチップ（2Dゲームにおけるマップの最小単位）を読み込んでドット絵のように描くツール．マップチップに対応する数値をcsv形式で出力し，Unity側で追加機能を実装し読み込むことで，マップチップに当たるObjectを等間隔に配置するために作成．

※制作中の2Dアクションゲームのために制作したためローカルで起動して使用する前提です．

## インストールするライブラリ

#### 1.Node.jsとnpmをインストール
https://nodejs.org/ja/

#### 2.バージョン確認
node --version
npm --version

#### 3.npmでtypescriptをインストール
npm install -g typescript

#### 4.インストールできているかの確認
tsc -v

#### 5.npmでyarnをインストール(任意)
npm install -g yarn

#### 6.react-indiana-drag-scrollをインストール
https://www.npmjs.com/package/react-indiana-drag-scroll

#### 7.react-dropzoneをインストール
https://react-dropzone.js.org/

#### 8.bootstarpをインストール
https://getbootstrap.jp/docs/5.0/getting-started/download/

#### 9.react bootstrapをインストール
npm install react-bootstrap bootstrap

#### 10.(追記)動かない場合
npm install serve してから npm run build して serve -s build して出てきた URL (localhost:3000) をブラウザに張り付けたらローカルで動かせる

## 操作説明
### 1.マップチップの作成・登録
デフォルトでmaptip1.png, maptip2.png, maptip3.png, MakeTipList.sh, TipList.csvがpublic/maptipフォルダに入っている．

・マップチップのデータ形式と名称
マップチップはすべて「maptip[番号].png」にしpublic/maptipフォルダに入れる．番号は１始まり．

・MakeTipList.sh
これを実行するとマップチップのリストが(デフォルトで入っているTipList.csvのような感じで)出力される．マップチップを追加するなどしたらこれを実行するとよい．

・TipList.csv
後述の操作で使う．

### 2.起動
map_editorファイル内(pubilcとかsrcとか.gitignoreとかあるところ)で
npm start
もしくは
yarn start
で起動できる．

### 3.TipListの選択
起動したらまず右側上部の「マップチップリストの追加」ボタンを押す．すると，
「ファイルをドロップ
　ファイルをここにドラッグ＆ドロップする、またはここをクリックしてファイルを開く」
と出てくるので操作1で作成したTipList.csvを選択する．これで上部のマップチップパレット部分にマップチップが表示され，選べるようになる．

### 4.基本操作

#### マップチップの選択
操作3でマップチップが上部に表示されているはずなのでそれをクリックすれば選択できる．

#### 消しゴムツールの選択
左上の「消」ボタンを押すと消しゴム状態に切り替わる．イメージ的にはマップチップの一つ．

#### マップサイズの変更
デフォルトで縦60マス＊横100マスになっている．右側の「縦」「横」のボックスに数値を入力して，その下にある「変更」ボタンを押すとマップサイズの変更が行われる．後述の範囲選択を切った状態で行うこと．

#### マップデータ読込
出力したマップデータを読み込むときに使う．「マップデータ読込」ボタンを押したのち操作1と同様にマップデータのcsvファイルを選択する．マップデータはpublicフォルダ等に入れておくとよい．

#### 出力ファイル名変更
デフォルトでは「sample」になっており，この状態だとsample.csvが出力される．何も書かないとmap_data.csvという名称で出力される．

#### マップデータ出力
「マップデータ出力」ボタンを押すことでマップデータのcsvファイルをダウンロードする．

#### マップチップ描画
マップキャンバスで左クリックをしている間，選択したマップチップが描画される．消しゴムは何もないを描画しているイメージなので操作は同じ．

#### 範囲選択
右クリックしたまま選択したい範囲をドラッグして離すと選択範囲が赤く表示される．
選択解除したい場合は選択範囲の外でドラッグせずに1マスだけ右クリックすると解除される．そのため1マス選択はできない．
選択中にマウスの中央ボタン（マウスホイール）をクリックすると，選択中のマップチップで塗りつぶされる．
選択範囲内で右クリックしてドラッグすると選択範囲内のマップチップを移動できる．キーボードの十字キーやマウスホイールと組み合わせればスクロールしながら移動できる．

#### ズーム（表示の拡大縮小）
キーボードの「/め」「\ろ」を押すとキャンバスの表示の拡大縮小ができる．「/」が正の一次関数「\」が負の一次関数のイメージ．

#### Redo Undo
できない．



# Getting Started with Create React App(自動生成されたもの、見なくてよい)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
