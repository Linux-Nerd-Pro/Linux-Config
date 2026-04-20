'use strict';
// Copyright 2012-2024 : https://www.fbpurity.com
// No unauthorised copying or distribution allowed

//if(typeof(localStorage.fbpoptsjson)=='undefined')
//  localStorage.fbpoptsjson='initial value';


/*  
//CONTENT SCRIPT CODE
  chrome.extension.sendRequest({method: "getLocalStorage", key: "fbpoptsjson"}, function(response) {
  console.log(response.data);
});
  chrome.extension.sendRequest({method: "setLocalStorage", key: "fbpoptsjson", value: ""}, function(response) {
  console.log(response.data);
});
*/

var blockHoverCards=0;// tagsuggestions=0;
var userAgentEdge=0;
//var blockNotifications=0;

// Edge & WebExtensions Suppport
if (typeof msBrowser !== 'undefined') {
  chrome = msBrowser;
}
else if (typeof browser != 'undefined')
{
  chrome = browser;
}

// BACKGROUND SCRIPT CODE
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == "getLocalStorage"){
	//if(request.key.match(/fbpoptsjson/))
	//  console.log("request key"request.key);
    sendResponse({data: localStorage[request.key]}); // decodeURIComponent
  }
  else if (request.method == "setLocalStorage")
	sendResponse({data: localStorage[request.key]=request.value});
  else if (request.method=="dumpLocalStorage")
	sendResponse({data: localStorage});
  else if (request.method=="clearLocalStorage")
	sendResponse({data: "localStorage was cleared. All that is left is: " + localStorage.clear()});
  else if (request.method == "blockHoverCards"){
	//sendResponse({data: localStorage[request.key]=request.value});
    if(request.key==0) {
      blockHoverCards=0;
	  //console.log('block hovercards is off');
    }
    else{
	  blockHoverCards=1;
	  //console.log('block hovercards is on');
	}
  }
  else if (request.method == "userAgentEdge"){
	//sendResponse({data: localStorage[request.key]=request.value});
    if(request.key==0) {
      userAgentEdge=0;
	  console.log('User Agent is set to default.');
    }
    else{
	  userAgentEdge=1;
	  console.log('User Agent is set to Edge.');
	}
  }
  /*else if (request.method == "tagsuggestions"){
	//sendResponse({data: localStorage[request.key]=request.value});
    if(request.key==0) {
      tagsuggestions=0;
	  console.log('hide auto tag suggestions is off');
    }
    else{
	  tagsuggestions=1;
	  console.log('hide  auto tag suggestions is on');
	}
  }*/
  /*else if (request.method == "blockNotifications"){
	//sendResponse({data: localStorage[request.key]=request.value});
    if(request.key==0) {
      blockNotifications=0;
	  //console.log('block hovercards is off');
    }
    else{
	  blockNotifications=1;
	  //console.log('block hovercards is on');
	}
  }*/
  else if (request.method == "GetFBPNews"){
	//console.log('in getfbp news on the background page');
	fetch('https://www.fbpurity.com/fbpnewsupdates.txt',{ cache: "no-store" }).then(function (response) {
	  return response.text();
    }).then(function (html) {
	  if(html.match(/<date>(.*?)<\/date>/)) {
	    //console.log(html.match(/<abbr>(.*?)<\/abbr>/));
		//console.log(new Date(html.match(/<abbr>(.*?)<\/abbr>/)[1].replace(/at /,'')));
		sendResponse({data: html});
	    //sendResponse({data: html.match(/<date>(.*?)<\/date>/)[1]}); //.replace(/at /,'')
	  }
	  else 
		console.log("when checking for news update, didnt find date tag in ", html);
    }).catch(function (err) {
	// There was an error
	  console.warn('Something went wrong with fetching the FBP NEWS Feed.', err);
    });
  }
  //else
  //  sendResponse({}); // send empty response
  return true;
});

/*var brwsr = null;
if (typeof chrome != "undefined") {
    brwsr = chrome;
}
else{
    brwsr = browser;
}
*/

/* Add context menus, not got time to finish this, so commenting out for now
     when adding back, remember to add the following permissions: "contextMenus", "activeTab"
function genericOnClick(info, tab) {
  // google translate API
  // https://translate.google.com/?q=&sl=en&tl=ru#view=home&op=translate&sl=auto&tl=ru&text=feck%20off%20twit
  // bing translate API
  // https://www.bing.com/translator/?text=feck%20off%20hippy&from=auto
  
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));

  //if its a text selection ( items 2 (text filter) & 3 (autohide) )
  if(typeof(info.selectionText)!='undefined')
	  if(info.menuItemId==2){
	    console.log("selected Text Filter text: " + info.selectionText);
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ chrome.tabs.sendMessage(tabs[0].id, {action: "addSelectedTextToTextFilter",selectedText:info.selectionText}, function(response) {;}); });
	  }
      else{		  
   	    console.log("selected Auto Hide Filter text: " + info.selectionText);
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ chrome.tabs.sendMessage(tabs[0].id, {action: "addSelectedTextToAuthoHideFilter",selectedText:info.selectionText}, function(response) {;}); });
	  }

  // if its a link (item 4)
  if(typeof(info.linkUrl)!='undefined'){
	console.log("Link URL: " + info.linkUrl);
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ chrome.tabs.sendMessage(tabs[0].id, {action: "translate_link",linkUrl:info.linkUrl}, function(response) {;}); });
	// send message to content script
  }

  // if its an image (item 4)
  if(typeof(info.srcUrl)!='undefined') {
	console.log("Image Src URL: " + info.srcUrl);
	// send message to content script
	//chrome.tabs.query({active: true}, function(tabs){ chrome.tabs.sendMessage(tab.id, {action: "translate_image",url:info.srcUrl}, function(response) {});});
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ chrome.tabs.sendMessage(tabs[0].id, {action: "translate_image",imageUrl:info.srcUrl}, function(response) {;}); });
	
	
	//might need to loop through matching images, as there may be at least 2 images with same URL on the page
	//document.querySelectorAll('img[src="https://scontent-lhr8-1.xx.fbcdn.net/v/t1.0-9/94918753_3134254486618036_7618208115409813504_n.jpg?_nc_cat=111&ccb=2&_nc_sid=825194&_nc_ohc=3bLo0npSiUAAX_LtznL&_nc_ht=scontent-lhr8-1.xx&oh=c8378c3c6f971f27ed73840f8adc205c&oe=5FE790BE"]')[1].alt.split('\'')[1]
	// document.querySelectorAll('img[src="https://scontent-lhr8-1.xx.fbcdn.net/v/t1.0-9/94918753_3134254486618036_7618208115409813504_n.jpg?_nc_cat=111&ccb=2&_nc_sid=825194&_nc_ohc=3bLo0npSiUAAX_LtznL&_nc_ht=scontent-lhr8-1.xx&oh=c8378c3c6f971f27ed73840f8adc205c&oe=5FE790BE"]')[1].alt.split('\'')[1]
	// "Image may contain: text" (send to actual image translator site)
	
	//submit form to https://translateimages.site/results 
	//image: (binary)
    //imageURL: https://scontent-lhr8-1.xx.fbcdn.net/v/t1.0-0/p526x296/127716981_740295173228633_575232987696076831_n.jpg?_nc_cat=104&ccb=2&_nc_sid=ca434c&_nc_ohc=r9o5Gi090dgAX9Ljsc8&_nc_ht=scontent-lhr8-1.xx&tp=6&oh=eaa12c32db23f3f29159190b7a099297&oe=5FE9EED1
    //imageB64: 
    //srcLang: auto
    //destLang: en
  }
}
									   
var showForPages = ["https://www.facebook.com/*"];

var parent = brwsr.contextMenus.create({"title": "F.B. Purity","contexts":["selection","image","link"], "documentUrlPatterns":showForPages});
var child1 = brwsr.contextMenus.create(
  {"title": "Add Selected Text to Text Filter", "parentId": parent, "contexts":["selection"], "onclick": genericOnClick, "documentUrlPatterns":showForPages});
var child2 = brwsr.contextMenus.create(
  {"title": "Add Selected Text to Auto Hide Filter", "parentId": parent, "contexts":["selection"], "onclick": genericOnClick, "documentUrlPatterns":showForPages});
var child3 = brwsr.contextMenus.create({"title": "Translate image text", "parentId": parent, "contexts":["image","link"], "onclick": genericOnClick, "documentUrlPatterns":showForPages});  
//console.log("parent:" + parent + " child1:" + child1 + " child2:" + child2);
console.log({parent},{child1},{child2});

*/
