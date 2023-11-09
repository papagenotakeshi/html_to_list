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
  var title = filename.match(/.*?(?=\..*?)/);
  //ファイルの中身を取得
  var fc = file
    .getBlob()
    .getDataAsString("utf-8");
  //正規表現作成
  var reg = makereg();
  //ファイルの部分を取得
  var infs = fc.match(RegExp(reg, 'g'));
  //ファイルの状況
  if (!infs) {
    text = 'ファイルが存在しません';
    sheet4 = ss.getSheets()[4];
    var st = [[filename, text]];
    sheet4.getRange(sheet4.getLastRow() + 1, 1, 1, 2).setValues(st);
  } else {

    //出力する箱
    var boxes = [];
    infs.forEach(function (inf) {

      //日付
      var dates = inf.match(/(?<=<h2 id="a20\d+[^<>]+">).*?(?=<\/h2>)/g);
      //時間
      var times = inf.match(/(<p>[^<>]*<strong>[^<>]*([0-9０−９]{1,2}:[0-9０−９]{1,2})?[^<>]*([0-9０−９]{1,2}:[0-9０−９]{1,2})?[^<>]*<\/strong>[^<>]*<\/p>[^<>]*){1,2}/g);
      //内容
      var contents = inf.match(/(?<=<\/strong>[^<>]*<\/p>[^<>]*)((<ul>[^<>]*(<li>[^<>]*(<a class=[^<>]*>[^<>]*<\/a>[^<>]*)?(<pre class="wiki">[^<>]+<\/pre>)?[^<>]*<\/li>[^<>]*)+<\/ul>)?(<pre class="wiki">[^<>]+<\/pre>)?(<p>[^<>]*<\/p>)?[^<>]*)+(?=[^<>]*<p>[^<>]*[a-z]\.[a-z]+\n<\/p>)/g);
      //担当者名
      var names = inf.match(/(?<=<p>\n)[a-z].[a-z]+(?=\n<\/p>)/g);
      let box = [title];
      if (dates) {
        box.push(dates[0]);
      } else {
        box.push(dates);
      }
      if (times) {
        time = times[0].replace(/(\s*<[^<>]*>\s*)+/g, '');
        box.push(time);
      } else {
        box.push(times);
      }
      if (contents) {
        content = contents[0].replace(/(\s*<[^<>]*>\s*)+/g, '');
        box.push(content);
      } else {
        box.push(contents);
      }
      if (names) {
        box.push(names[0]);
      } else {
        box.push(names);
      }
      boxes.push(box);
    })
    console.log(filename);
    print(boxes);
    file.moveTo(mfolder);
  }
}
function print(boxes) {
  //出力範囲
  //保守履歴を指定
  const sheet = ss.getSheets()[3];
  let range = sheet.getRange(sheet.getLastRow() + 1, 1, boxes.length, boxes[0].length);
  range.setValues(boxes);
}
function test(){
  const id="1dAxjpukn8tVvR6KX611P7Q8pdvDowdQ3";
  const file=DriveApp.getFileById(id);
  print2(file.getBlob().getDataAsString("utf-8"));
}
function print2(fc){
  var tables=fc.match(/(?<=<tr>[^<>]*(<td>[^<>]*<strong>[^<>]*<\/strong>[^<>]*<\/td>[^<>]*)+<\/tr>)[^<>]*<tr>[^<>]*(<td>[^<>]*<\/td>[^<>]*)+[^<>]*<\/tr>[^<>]*/g);
  //var text1=fc.match(/<tr>[^<>]*<td>[^<>]*<strong>[^<>]*DB[^<>]*<\/strong>[^<>]*<\/td>[^<>]*<td>[^<>]*<strong>[^<>]*USER[^<>]*<\/strong>[^<>]*<\/td>[^<>]*<td>[^<>]*<strong>[^<>]*ENCODE[^<>]*<\/strong>[^<>]*<\/td>[^<>]*<td>[^<>]*<strong>[^<>]*VERSION[^<>]*<\/strong>[^<>]*<\/td>[^<>]*<td>[^<>]*<strong>[^<>]*WEB[^<>]*<\/strong>[^<>]*<\/td>[^<>]*<td>[^<>]*<strong>[^<>]*RECITAL[^<>]*<\/strong>[^<>]*<\/td>[^<>]*<\/tr>[^<>]*<tr>[^<>]*<td>[^<>]*topaz[^<>]*<\/td>[^<>]*<td>[^<>]*<\/td>[^<>]*<td>[^<>]*<\/td>[^<>]*<td>[^<>]*<\/td>[^<>]*<td>[^<>]*<\/td>[^<>]*<td>[^<>]*<\/td>[^<>]*<\/tr>[^<>]*<\/table>/g);
  var boxes=[];
  tables.forEach(function(table){
    boxes.push(table.match(/(?<=<td>)[^<>]*(?=<\/td>)/g));
  })
  console.log(boxes);
}
