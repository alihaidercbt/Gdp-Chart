$("a:contains('[nofollow]')").each(function (){
			var newLinkText = $(this).text().substr(10);
      console.log(newLinkText);
      $(this).html(newLinkText);
      $(this).attr("rel" , "nofollow");
});
$("a:contains('[sponsored]')").each(function (){
			var newLinkText = $(this).text().substr(11);
      console.log(newLinkText);
      $(this).html(newLinkText);
      $(this).attr("rel" , "sponsored");
});
$("a:contains('[ugc]')").each(function (){
			var newLinkText = $(this).text().substr(5);
      console.log(newLinkText);
      $(this).html(newLinkText);
      $(this).attr("rel" , "ugc");
});
