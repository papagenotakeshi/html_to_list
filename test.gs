//正規表現を作る
function makereg() {
  var datereg='<h2 id="a20\\d+[^<>]+">.*?<\\/h2>';
  var timereg='(<p>[^<>]*<strong>[^<>]*([0-9０−９]{1,2}:[0-9０−９]{1,2})?[^<>]*([0-9０−９]{1,2}:[0-9０−９]{1,2})?[^<>]*<\\/strong>[^<>]*<\\/p>[^<>]*){1,2}';
  var contentreg='(<ul>[^<>]*(<li>[^<>]*(<a class=[^<>]*>[^<>]*<\\/a>[^<>]*)?(<pre class="wiki">[^<>]+<\\/pre>)?[^<>]*<\\/li>[^<>]*)+<\\/ul>)?(<pre class="wiki">[^<>]+<\\/pre>)?(<p>[^<>]*<\\/p>)?[^<>]*';
  var namereg='<p>\\n[a-z].[a-z]+\\n<\\/p>'
  var gapreg='\\s*[^<>]*\\s*';
  let reg='(date)+gap(time)?gap(content)+?gap(name)?';
  let reg2=reg.replace('date',datereg).replace('time',timereg).replace('content',contentreg).replace('name',namereg).replace(/gap/g,gapreg);
  return reg2;
}
