let req = require("request");
let ch = require("cheerio");
const fs = require("fs");
const port = 8000;
const path = require('path');
const express = require('express');
const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

req("https://www.codechef.com/contests/?itm_medium=navmenu&itm_campaign=allcontests#future-contests",cb);

function cb(error, response, data) {
    if (response.statusCode == 404) {
        console.log("Page not found");
    } else if (response.statusCode == 200) {
        // console.log(data);

       parseHTML(data);
    } else {
        console.log(err);
    }

}

  //let fullpageHTML = "";
 //fullpageHTML += '<h2>Future Contests</h2>';
 var ongoing = [];
var links = [];
function parseHTML(data){
    
    let ftool = ch.load(data);
    let elem= ftool(".dataTable");

    let futureContest = ch(elem[1]);
    let contestList = futureContest.find("tbody tr");
   // console.log("Future Contests");

    for(let i = 0 ;i < contestList.length ;i++){
       // console.log(ch(contestList[i]).html());
        //  fullpageHTML += ch(contestList[i]).html() + '</br>';
      let url = ch(contestList[i]).find("td a");
      let contestName = ch(contestList[i]).find("td");
      contestName =ch(contestName[1]).text().trim();
      url = ch(url[0]).attr("href");
      let fullUrl = "https://www.codechef.com/" + url;
      let testDate = ch(contestList[i]).find("td");
      testDate = ch(testDate[2]).text().trim();
      var obj = {
          contest:fullUrl,
          name:contestName,
          source:"CodeChef",
          date:testDate
      }
      links.push(obj);
     //console.log(contestName);
   
     //fullpageHTML += '<a href="' + fullUrl  +  '">'+contestName+ '</a>' + '</br>' ;
    }
   // fs.writeFileSync("ntable.html",fullpageHTML);

   futureContest = ch(elem[0]);
   contestList = futureContest.find("tbody tr");
   for(let i = 0 ;i < contestList.length ;i++){
   url =  ch(contestList[i]).find("td a");
   contestName = ch(contestList[i]).find("td");
   contestName =ch(contestName[1]).text().trim();
   url = ch(url[0]).attr("href");
   fullUrl = "https://www.codechef.com/" + url;
   var obj = {
    contest:fullUrl,
    name:contestName,
    source:"CodeChef"
}
ongoing.push(obj);
   }

}


req("https://www.hackerearth.com/challenges/",cb2);



function cb2(error, response, data) {
    if (response.statusCode == 404) {
        console.log("Page not found");
    } else if (response.statusCode == 200) {
        // console.log(data);

       parseHTML2(data);
    } else {
        console.log(err);
    }

}
 function parseHTML2(data){
    let ftool2 = ch.load(data);
    let elems2 = ftool2(".upcoming.challenge-list");
     let futureContest2 = ch(elems2[0]);
    let contestList2 = futureContest2.find(".challenge-card-modern .challenge-list-title");
    //console.log(ch(contestList2[0]).text());
    let contestLinks2 = futureContest2.find(".challenge-card-modern .challenge-card-link");
    let testDate2 = futureContest2.find(".challenge-card-modern .date.less-margin.dark");
     for(let i = 0 ;i < contestList2.length ;i++){
   //let url2 =   ch(contestLinks2[i]).attr("href");
let fullUrl2 = 'https://assessment.hackerearth.com/' +  ch(contestLinks2[i]).attr("href");
let contestName2 = ch(contestList2[i]).text().trim();
let date2 = ch(testDate2[i]).text().trim();
     // console.log(ch(contestList2[i]).text());
     var obj = {
        contest:fullUrl2,
        name:contestName2,
        source:"HackerEarth",
        date:date2
    }

    links.push(obj);
     }
////////////LIVE
     elems2 = ftool2(".ongoing.challenge-list");
     let currenContest2 = ch(elems2[0]);
  contestList2  = currenContest2.find(".challenge-card-modern .challenge-list-title");
  contestLinks2 = futureContest2.find(".challenge-card-modern .challenge-card-link");

  for(let i = 0 ;i < contestList2.length ;i++){
    fullUrl2 = 'https://assessment.hackerearth.com/' +  ch(contestLinks2[i]).attr("href");
    contestName2 = ch(contestList2[i]).text().trim();
         var obj = {
            contest:fullUrl2,
            name:contestName2,
            source:"HackerEarth",
        }
    
        ongoing.push(obj);

  }

 }
//////////
req("https://codeforces.com/contests",cb3);


function cb3(error, response, data) {
    if (response.statusCode == 404) {
        console.log("Page not found");
    } else if (response.statusCode == 200) {
        // console.log(data);

       parseHTML3(data);
    } else {
        console.log(err);
    }

}

 function parseHTML3(data){
    let ftool3 = ch.load(data);
    let elems3 = ftool3(".contestList .datatable");
     let currenContest3= ch(elems3[0]);
    let contestList3 = ch(currenContest3).find("tbody tr");
  //  console.log(contestName3.length);
 for(let i =1;i < contestList3.length;i++){
      let contestName3 = ch(contestList3[i]).find("td");
      contestName3 = ch(contestName3[0]).text().trim();
//       let url3 = ch(contestList3[i]).find("td");
//   url3 = ch(url3[2]).find("a");
//   console.log( ch(url3[0]).attr("href"));
    var obj = {
        contest:"https://codeforces.com/contests",
        name:contestName3,
        source:"CodeForces",
    }
    ongoing.push(obj);
 }

 }






////////////////server side


app.get('/',function(req,res){

    return res.render('ost',{
        title : 'Contest Reminder',
        list_links : links,
        live: ongoing
    });
});


app.listen(port,function(err){

    if(err){
        console.log("error occured");
      
    }
      console.log("server is up and running",port);
    
    });