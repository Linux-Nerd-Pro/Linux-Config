var brwsr = null;
if (typeof chrome != "undefined") {
    brwsr = chrome;
}
else{
    brwsr = browser;
}

window.addEventListener("load", function(event) {
	//document.getElementById('Logo').title="FB Purity v: " + chrome.runtime.getManifest().version;
	document.getElementById('vernum').textContent="v" + chrome.runtime.getManifest().version.split(/\.0$/)[0];
},false)

//let button=document.getElementById('settingsButt');
//button.addEventListener('click', setAction);
/*function setAction() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(!tabs[0].url.includes('https://www.facebook.com')) {
      alert('In order to open FBPs Settings, you need to be on https://www.facebook.com');
      return
    }
    chrome.tabs.sendMessage(tabs[0].id, "openFBPSettings");
  });
}
*/

/*

var port = brwsr.runtime.connect({
    name : "optionalPermRequestPopup"
});

if ((localStorage.revertFB!==undefined) && (localStorage.revertFB==1))
  document.querySelector(".btnOk").checked=1;

window.addEventListener("load", function(event) {
	//if((typeof (opr)) != "undefined")
	//	document.querySelector(".btnOk").style.display="none";
	
    var okButton = document.querySelector(".btnOk");
    //okButtons.forEach(function(okButton) {
        okButton.addEventListener("click", function(event) {
			//alert(event.target.checked);
			if(event.target.checked)
              port.postMessage({okButtonClicked: true});
		    else
			  port.postMessage({okButtonClicked: false});
		    document.getElementById('infodiv').textContent="Refresh any open Facebook pages to view the changed design";
        });
    //});
    port.onMessage.addListener(function(request) {
        for (var key in request) {
            switch(key){
                case "close":
                    //window.close();
                    break;
                default:
                    break;
            }               
        }
    });
});
*/

/* Firefox specific code below :  Commented out in Chrome version as was causing an error  

const permissionsToRequest = {
  permissions: ["webRequest","webRequestBlocking"]//"http://*.facebook.com/*", "https://*.facebook.com/*",
}
//,  origins: ["https://www.facebook.com/"]
function requestPermissions() {

  function onResponse(response) {
    if (response) {
      console.log("Permission was granted");
    } else {
      console.log("Permission was refused");
    }
    return browser.permissions.getAll();  
  }

  browser.permissions.request(permissionsToRequest)
    .then(onResponse)
    .then((currentPermissions) => {
    console.log(`Current permissions:`, currentPermissions);
  })
  //.then(port.postMessage({okButtonClicked: true}))
  //.then(document.getElementById('infodiv').textContent="Refresh any open Facebook pages to see the change");
  ;
}

document.querySelector(".btnOk").addEventListener("click", requestPermissions);

*/