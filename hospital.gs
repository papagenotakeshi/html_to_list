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
  var datereg = '<h2 id="a20\\d+[^<>]+">[^<>]*<\\/h2>';
  var timereg = '(<p>[^<>]*<strong>[^<>]*([0-9０−９]{1,2}:[0-9０−９]{1,2})?[^<>]*([0-9０−９]{1,2}:[0-9０−９]{1,2})?[^<>]*<\\/strong>[^<>]*<\\/p>[^<>]*){1,2}';
  var namereg = '<p>\\n[a-z].[a-z]+\\n<\\/p>';
  //各情報を分ける.
  //サーバー情報
  f0 = fa.match(/(?<=<table class="wiki">\s*)<tr[^<>]*>\s*<td[^<>]*>\s*TTL名称.*?<\/td>\s*<\/tr>\s*<\/table>/s);
  //正DB
  f1 = fa.match(/(?<=<h2 id="\s*正DB"\s*>\s*正DB\s*<\/h2>).*?(?=<h2 id="\s*副DB"\s*>\s*副DB\s*<\/h2>)/s);
  //副DB
  f2 = fa.match(/(?<=<h2 id="\s*副DB"\s*>\s*副DB\s*<\/h2>).*?(?=<h2 id="\s*保守履歴"\s*>\s*保守履歴\s*<\/h2>)/s);
  //保守履歴
  f3 = fa.match(/(?<=<h2 id="\s*保守履歴"\s*>\s*保守履歴\s*<\/h2>).*?(?=<\/html>)/s);
//ページの有無の確認
  if (f1) {
    //サーバー情報
    let db0 = table2(hosname, f0[0]);
    const sheet0 = ss.getSheets()[0];
    sheet0.getRange(sheet0.getLastRow() + 1, 1, db0.length, db0[0].length).setValues(db0);
    //正DB
    let db1 = table(hosname, f1[0]);
    const sheet1 = ss.getSheets()[1];
    sheet1.getRange(sheet1.getLastRow() + 1, 1, db1.length, db1[0].length).setValues(db1);
    //副DB
    let db2 = table(hosname, f2[0]);
    const sheet2 = ss.getSheets()[2];
    sheet2.getRange(sheet2.getLastRow() + 1, 1, db2.length, db2[0].length).setValues(db2);
    //保守履歴
    fc = f3[0];
    boxes = fc.match(RegExp(datereg + '.*?' + namereg, 'gs'));
    if (boxes) {
      var newboxes = [];
      boxes.forEach(function (box) {
        let date = box.match(datereg)[0];
        let time = box.match(timereg);
        let name = box.match(namereg);
        let newbox = [hosname, date.replace(/<[^<>]*>|\s/g, '')];
        if (time) {
          newbox.push(time[0].replace(/<[^<>]*>|\s/g, ''));
        } else {
          newbox.push(time);
        }
        let content = box.replace(RegExp(datereg + '|' + timereg + '|' + namereg, 'g'), '');
        newbox.push(content.replace(/<[^<>]*>|\s/g, ''));
        if (name) {
          newbox.push(name[0].replace(/<[^<>]*>|\s/g, ''));
        } else {
          newbox.push(name);
        }
        newboxes.push(newbox);
      })
      print(newboxes);
      //保守履歴を記録できたファイルの移動
      file.moveto(mfolder);
      console.log(filename);
    }
    else 
    {
      var stbox = [[filename, 'ページが存在しません']];
      //処理状況
      sheet4 = ss.getSheets()[4];
      let lastrow = sheet4.getLastRow();
      sheet4.getRange(lastrow + 1, 1, 1, 2).setValues(stbox);
    }
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
