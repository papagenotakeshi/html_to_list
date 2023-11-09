const ss = SpreadsheetApp.getActiveSpreadsheet();
//移動先フォルダId
const mfolderId = "1oLFk4QaV7ewsY8wPaNrALNqLZCr3svvc";
//https://drive.google.com/drive/folders/1oLFk4QaV7ewsY8wPaNrALNqLZCr3svvc?usp=drive_link
//移動先ファルダ
const mfolder = DriveApp.getFolderById(mfolderId);
function main() {
  //ファルダID
  const folderId = "1Dwzhievk2HFVcSyA1tiqgUlm-W3n_VsP";
  //https://drive.google.com/drive/folders/1Dwzhievk2HFVcSyA1tiqgUlm-W3n_VsP?usp=drive_link
  //フォルダ内の全てのファイルを取得
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();
  //各ファイルを処理
  while (files.hasNext()) {
    let file = files.next();
    makefile(file);
  }
}
function makefile(file) {
  //title
  let filename = file.getName();
  console.log(filename);
  var title = filename.match(/.*?(?=\..*?)/);
  //ファイルの中身を取得
  var fc = file
    .getBlob()
    .getDataAsString("utf-8");
  //日付
  var dates = fc.match(/(?<=<h2 id="a20\d+[^<>]+">).*?(?=<\/h2>)/g);
  //時間
  var times = fc.match(/(<p>[^<>]*<strong>[^<>]*([0-9０−９]{1,2}:[0-9０−９]{1,2})?[^<>]*([0-9０−９]{1,2}:[0-9０−９]{1,2})?[^<>]*<\/strong>[^<>]*<\/p>[^<>]*){1,2}/g);
  //内容
  var contents = fc.match(/(?<=<\/strong>[^<>]*<\/p>[^<>]*)((<ul>[^<>]*(<li>[^<>]*(<a class=[^<>]*>[^<>]*<\/a>[^<>]*)?(<pre class="wiki">[^<>]+<\/pre>)?[^<>]*<\/li>[^<>]*)+<\/ul>)?(<pre class="wiki">[^<>]+<\/pre>)?(<p>[^<>]*<\/p>)?[^<>]*)+(?=[^<>]*<p>[^<>]*[a-z]\.[a-z]+\n<\/p>)/g);
  //担当者名
  var names = fc.match(/(?<=<p>\n)[a-z].[a-z]+(?=\n<\/p>)/g);
  //出力する箱
  var boxes = [];


  //出力するテキスト
  let text = '完了';
  if (dates) {

    //出力数
    let rows = dates.length;
    if (rows != dates.length) {
      text = '日付の数が異なります.';
    } else if (rows != times.length) {
      text = '時間の数が異なります.';
    } else if (rows > contents.length) {
      text = '内容の数が少ないです';
    } else if (rows != names.length) {
      text = '担当者名の数が異なります';
    }

    else {

      //時間書き換え
      let newtimes = [];
      times.forEach(function (time) {
        newtimes.push(time.replace(/(\s*<[^<>]*>\s*)+/g, ''));
      })
      //内容書き換え
      let newcontents = [];
      contents.forEach(function (content) {
        newcontents.push(content.replace(/(\s*<[^<>]*>\s*)+/g, ''));
      })
      //二次元配列に挿入
      for (let i = 0; i < rows; i++) {
        let box = [title];
        box.push(dates[i]);
        box.push(newtimes[i]);
        box.push(newcontents[i]);
        box.push(names[i]);
        boxes.push(box);
      }
      //スプレッドシートに出力
      print(boxes, rows);
      file.moveTo(mfolder);
    }
  }else{
    text="ファイルが存在しません"
  }
  //処理状況の確認
  var stbox = [[filename, text]];
  sheet4 = ss.getSheets()[4];
  let lastrow = sheet4.getLastRow();
  sheet4.getRange(lastrow + 1, 1, 1, 2).setValues(stbox);

}
function print(boxes, rows) {
  //出力範囲
  //保守履歴を指定
  const sheet = ss.getSheets()[3];
  let range = sheet.getRange(sheet.getLastRow() + 1, 1, rows, boxes[0].length);
  range.setValues(boxes);
}
