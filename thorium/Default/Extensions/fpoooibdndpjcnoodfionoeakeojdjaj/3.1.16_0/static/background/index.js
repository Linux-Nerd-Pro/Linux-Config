var e,t;"function"==typeof(e=globalThis.define)&&(t=e,e=null),function(t,r,n,i,s){var a="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o="function"==typeof a[i]&&a[i],l=o.cache||{},u="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function c(e,r){if(!l[e]){if(!t[e]){var n="function"==typeof a[i]&&a[i];if(!r&&n)return n(e,!0);if(o)return o(e,!0);if(u&&"string"==typeof e)return u(e);var s=Error("Cannot find module '"+e+"'");throw s.code="MODULE_NOT_FOUND",s}d.resolve=function(r){var n=t[e][1][r];return null!=n?n:r},d.cache={};var h=l[e]=new c.Module(e);t[e][0].call(h.exports,d,h,h.exports,this)}return l[e].exports;function d(e){var t=d.resolve(e);return!1===t?{}:c(t)}}c.isParcelRequire=!0,c.Module=function(e){this.id=e,this.bundle=c,this.exports={}},c.modules=t,c.cache=l,c.parent=o,c.register=function(e,r){t[e]=[function(e,t){t.exports=r},{}]},Object.defineProperty(c,"root",{get:function(){return a[i]}}),a[i]=c;for(var h=0;h<r.length;h++)c(r[h]);if(n){var d=c(n);"object"==typeof exports&&"undefined"!=typeof module?module.exports=d:"function"==typeof e&&e.amd?e(function(){return d}):s&&(this[s]=d)}}({kgW6q:[function(e,t,r){e("../../../src/background")},{"../../../src/background":"fx8Od"}],fx8Od:[function(e,t,r){let n;var i=e("@parcel/transformer-js/src/esmodule-helpers.js"),s=e("@firebase/firestore"),a=e("@plasmohq/storage"),o=e("./background/ga-tracking"),l=i.interopDefault(o),u=e("~background/firebase"),c=e("~background/utils"),h=e("~cs-helpers/yttm-utils"),d=e("~shared-scripts/yttm-setup"),f=e("~types");let p=new a.Storage({area:"local"});async function m(e,t=!1){async function r(e){let r={...d.initial.channelPictures},s=e.map(async(e,s)=>{let a=null;if(t){let{isStarted:e}=await p.get("statusImportChannelPictures");if(e)throw Error("Started importing therefore stopped converting legacy channel IDs to new ones")}do try{a=await i(e,s),r[e]=a,console.log("%cFetched profile picture for","color: cyan",e)}catch(t){"ERR_NETWORK"===t.code&&(console.log("%cNetwork error","color: red",n),n?.postMessage("network-error")),console.error(`Error fetching picture for channel ${e}:`,t),await new Promise(e=>setTimeout(e,5e3))}while(!a)});return await Promise.all(s),console.log("Finished fetching profile pictures"),r}async function i(e,t){return new Promise(r=>{setTimeout(async()=>{r(await (0,h.getChannelPicture)(e))},100*t)})}await p.set("channelPictures",await r(Object.keys(e))),await p.set("statusImportChannelPictures",{timestamp:Date.now(),isStarted:!1})}async function g(){let e=await p.get("watchTimeExt"),t=Object.keys(e),r=new Date(t[t.length-1]),n=(()=>{let e=new Date(r);return e.setDate(e.getDate()-7),e})(),i={};for(let r=t.length-1;r>=0;r--){let s=t[r],a=new Date(s);for(let t in e[s])i[t]||(i[t]=0),i[t]+=e[s][t].secondsSpent;if(a.getTime()<n.getTime())break}let s=Object.entries(i).sort(([,e],[,t])=>t-e).map(([e])=>e),a=Math.ceil(.6*s.length),o=s.slice(0,a),l=o.map(e=>fetch(`https://www.youtube.com/watch?v=${e}`)),u=await Promise.allSettled(l),c=await Promise.all(u.filter(e=>"fulfilled"===e.status).map(async e=>await e.value.text())),h=/<meta name="keywords" content="(.+?)">/,d=new Set(c.flatMap(e=>e.match(h)[1].split(/,\s*/)));await p.set("videoTags",{videoTags:[...d],timestamp:Date.now()})}p.watch({async user({newValue:e}){e||(u.unsubscribeFirestoreHandler?.(),await p.remove("subscription"))},async subscription({newValue:e}){if(!e)return;let t=await p.get("user"),r=await (0,u.getCredentialsForFirebase)(t),n=await (0,s.getDoc)((0,s.doc)(u.db,"usersTempSubscription",r.user.uid));if(!n.exists()){await p.remove("subscription");return}try{console.log("Verifying subscription in subscription watcher",e);let t=new URLSearchParams({planId:e?.details?.resource?.id,sandbox:(!1).toString()}),n=await fetch(`http://verifypaypalplanid-23ze2qn7kq-ew.a.run.app/?${t}`);if(!n.ok){await p.remove("subscription");return}let i=await n.json();if("ACTIVE"===i.status)return;delete i.links,await (0,s.updateDoc)((0,s.doc)(u.db,"usersTempSubscription",r.user.uid),{subscription:{details:i}})}catch{await (0,s.updateDoc)((0,s.doc)(u.db,"usersTempSubscription",r.user.uid),{subscription:{details:null}}),await p.remove("subscription")}},async statusImportChannelPictures({newValue:{isStarted:e}}){if(!e)return;let t=await p.get("watchTimeExt");if(!t)return;let r={...d.initial.channelPictures};for(let e in t)for(let n in t[e])r[t[e][n].channelId]=null;await m(r)}}),chrome.runtime.onInstalled.addListener(async({reason:e})=>{if(!(e===chrome.runtime.OnInstalledReason.INSTALL||e===chrome.runtime.OnInstalledReason.UPDATE))return;let t=await p.get("deviceId");if(!t){let e=crypto.randomUUID();await p.set("deviceId",e)}let r=new URLSearchParams({deviceId:t}),n={browser:h.browserName,currentVersion:chrome.runtime.getManifest().version,languageYouTube:await p.get("languageCode")||await (0,h.getLocale)("https://www.youtube.com"),languageExtension:chrome.i18n.getUILanguage(),userAgent:navigator.userAgent};await fetch(`https://us-central1-time-manager-726ab.cloudfunctions.net/saveTempData?${r}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),console.log("Data sent to cloud function");let i=new l.default(!1);await i.fireEvent("pushed-anonymous-data-to-cloud-function",{deviceId:t,params:n}),Promise.all([p.get("user"),p.get("subscription")]).then(async([e,t])=>{if(!e){await p.remove("subscription");return}try{let r=await (0,u.getCredentialsForFirebase)(e);if((0,u.addFirestoreListener)(r),!t)return;let n=new URLSearchParams({planId:t?.details?.resource?.id,sandbox:Number(!1).toString()}),i=await fetch(`http://verifypaypalplanid-23ze2qn7kq-ew.a.run.app?${n}`),{status:s}=await i.json();if("ACTIVE"===s)return;await p.remove("subscription")}catch{await p.remove("subscription")}})}),p.set("statusImportChannelPictures",{timestamp:0,isStarted:!1}),chrome.runtime.onConnect.addListener(e=>{"network-error-listener"===e.name&&(console.log("Network error listener connected"),n=e)}),chrome.runtime.onMessage.addListener(async(e,t,r)=>{if("ga-tracking"===e.type){let t=new l.default(!1),n=(()=>{switch(e.payload.type){case"fire-event":return t.fireEvent(e.payload.name,e.payload.params);case"fire-page-view-event":return t.firePageViewEvent(e.payload.data.extSection,e.payload.data.pageUrl,e.payload.data.additionalParams);default:return t.fireEvent(e.payload.data)}})();r(n);return}if("sign-in"===e.type){r(await (0,c.loginToGoogle)());return}if("save-sign-in-data"===e.type){let{user:t}=e.payload,n=await (0,u.getCredentialsForFirebase)(t),i=await fetch("https://createorfetchusertest-23ze2qn7kq-ew.a.run.app",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({user:t,credentials:n,sandbox:!1})}),{payload:s}=await i.json(),a=s.subscription,o=s.matchmakingPromotionStatus;delete s.subscription,delete s.matchmakingPromotionStatus,(0,u.addFirestoreListener)(n),await Promise.allSettled([p.set("user",s),p.set("subscription",a),p.set("matchmakingPromotionStatus",o)]),r();return}if("sign-out"===e.type){await (0,u.signingOut)(),u.unsubscribeFirestoreHandler?.(),r({response:"User signed out"});return}if("get-address-by-coordinates"===e.type){let t=new URLSearchParams({latlng:e.payload.coordinates,key:"AIzaSyBRwetjkvmPSxigNXERnLb7Y_7T13Eytt8"}),{results:n}=await (await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${t}`)).json();r(n[0]);return}if("dismiss-matchmaking-promotion"===e.type){let e=await (0,u.getCredentialsForFirebase)();await fetch("https://updatematchmakingpromotiontest-23ze2qn7kq-ew.a.run.app",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({credentials:e,updatedPromotionStatus:f.MatchmakingPromotionStatus.dismissed})});return}if("extract-video-tags"===e.type){g(),r();return}})},{"@firebase/firestore":"2FnHu","@plasmohq/storage":"3r5ba","./background/ga-tracking":"5SVS9","~background/firebase":"8B3mQ","~background/utils":"bbD2v","~cs-helpers/yttm-utils":"itQEy","~shared-scripts/yttm-setup":"eWQMh","~types":"ag0OM","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],"2FnHu":[function(e,t,r){var n,i,s,a,o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"AbstractUserDataWriter",()=>l6),o.export(r,"AggregateField",()=>o3),o.export(r,"AggregateQuerySnapshot",()=>o8),o.export(r,"Bytes",()=>o7),o.export(r,"CACHE_SIZE_UNLIMITED",()=>oG),o.export(r,"CollectionReference",()=>oL),o.export(r,"DocumentReference",()=>oP),o.export(r,"DocumentSnapshot",()=>un),o.export(r,"FieldPath",()=>le),o.export(r,"FieldValue",()=>lr),o.export(r,"Firestore",()=>oK),o.export(r,"FirestoreError",()=>D),o.export(r,"GeoPoint",()=>ln),o.export(r,"LoadBundleTask",()=>oz),o.export(r,"PersistentCacheIndexManager",()=>uW),o.export(r,"Query",()=>oR),o.export(r,"QueryCompositeFilterConstraint",()=>lV),o.export(r,"QueryConstraint",()=>lL),o.export(r,"QueryDocumentSnapshot",()=>ui),o.export(r,"QueryEndAtConstraint",()=>lJ),o.export(r,"QueryFieldFilterConstraint",()=>lF),o.export(r,"QueryLimitConstraint",()=>lG),o.export(r,"QueryOrderByConstraint",()=>lq),o.export(r,"QuerySnapshot",()=>us),o.export(r,"QueryStartAtConstraint",()=>lH),o.export(r,"SnapshotMetadata",()=>ur),o.export(r,"Timestamp",()=>z),o.export(r,"Transaction",()=>uV),o.export(r,"WriteBatch",()=>uF),o.export(r,"_AutoId",()=>B),o.export(r,"_ByteString",()=>e7),o.export(r,"_DatabaseId",()=>tl),o.export(r,"_DocumentKey",()=>W),o.export(r,"_EmptyAppCheckTokenProvider",()=>V),o.export(r,"_EmptyAuthCredentialsProvider",()=>O),o.export(r,"_FieldPath",()=>Q),o.export(r,"_TestingHooks",()=>u6),o.export(r,"_cast",()=>oC),o.export(r,"_debugAssert",()=>A),o.export(r,"_internalAggregationQueryToProtoRunAggregationQueryRequest",()=>u4),o.export(r,"_internalQueryToProtoQueryTarget",()=>u2),o.export(r,"_isBase64Available",()=>e8),o.export(r,"_logWarn",()=>T),o.export(r,"_validateIsNotUsedTogether",()=>oT),o.export(r,"addDoc",()=>uy),o.export(r,"aggregateFieldEqual",()=>ue),o.export(r,"aggregateQuerySnapshotEqual",()=>ut),o.export(r,"and",()=>lj),o.export(r,"arrayRemove",()=>uG),o.export(r,"arrayUnion",()=>uz),o.export(r,"average",()=>l8),o.export(r,"clearIndexedDbPersistence",()=>oZ),o.export(r,"collection",()=>oM),o.export(r,"collectionGroup",()=>oF),o.export(r,"connectFirestoreEmulator",()=>oO),o.export(r,"count",()=>l7),o.export(r,"deleteAllPersistentCacheIndexes",()=>uZ),o.export(r,"deleteDoc",()=>ug),o.export(r,"deleteField",()=>uj),o.export(r,"disableNetwork",()=>o2),o.export(r,"disablePersistentCacheIndexAutoCreation",()=>uX),o.export(r,"doc",()=>oU),o.export(r,"documentId",()=>lt),o.export(r,"enableIndexedDbPersistence",()=>oJ),o.export(r,"enableMultiTabIndexedDbPersistence",()=>oY),o.export(r,"enableNetwork",()=>o1),o.export(r,"enablePersistentCacheIndexAutoCreation",()=>uY),o.export(r,"endAt",()=>lX),o.export(r,"endBefore",()=>lY),o.export(r,"ensureFirestoreConfigured",()=>oQ),o.export(r,"executeWrite",()=>ub),o.export(r,"getAggregateFromServer",()=>uE),o.export(r,"getCountFromServer",()=>u_),o.export(r,"getDoc",()=>uo),o.export(r,"getDocFromCache",()=>uu),o.export(r,"getDocFromServer",()=>uc),o.export(r,"getDocs",()=>uh),o.export(r,"getDocsFromCache",()=>ud),o.export(r,"getDocsFromServer",()=>uf),o.export(r,"getFirestore",()=>oH),o.export(r,"getPersistentCacheIndexManager",()=>uJ),o.export(r,"increment",()=>uK),o.export(r,"initializeFirestore",()=>o$),o.export(r,"limit",()=>lK),o.export(r,"limitToLast",()=>l$),o.export(r,"loadBundle",()=>o6),o.export(r,"memoryEagerGarbageCollector",()=>uC),o.export(r,"memoryLocalCache",()=>uN),o.export(r,"memoryLruGarbageCollector",()=>uD),o.export(r,"namedQuery",()=>o9),o.export(r,"onSnapshot",()=>uv),o.export(r,"onSnapshotsInSync",()=>uw),o.export(r,"or",()=>lB),o.export(r,"orderBy",()=>lz),o.export(r,"persistentLocalCache",()=>uk),o.export(r,"persistentMultipleTabManager",()=>uL),o.export(r,"persistentSingleTabManager",()=>uP),o.export(r,"query",()=>lM),o.export(r,"queryEqual",()=>oB),o.export(r,"refEqual",()=>oV),o.export(r,"runTransaction",()=>uB),o.export(r,"serverTimestamp",()=>uq),o.export(r,"setDoc",()=>up),o.export(r,"setIndexConfiguration",()=>uH),o.export(r,"setLogLevel",()=>I),o.export(r,"snapshotEqual",()=>ua),o.export(r,"startAfter",()=>lW),o.export(r,"startAt",()=>lQ),o.export(r,"sum",()=>l3),o.export(r,"terminate",()=>o4),o.export(r,"updateDoc",()=>um),o.export(r,"waitForPendingWrites",()=>o0),o.export(r,"where",()=>lU),o.export(r,"writeBatch",()=>u$);var l=e("@firebase/app"),u=e("@firebase/component"),c=e("@firebase/logger"),h=e("@firebase/util"),d=e("@firebase/webchannel-wrapper/bloom-blob"),f=e("@firebase/webchannel-wrapper/webchannel-blob"),p=e("b72166c93fb5f66"),m=e("720cac7913d14e6d").Buffer;let g="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}y.UNAUTHENTICATED=new y(null),y.GOOGLE_CREDENTIALS=new y("google-credentials-uid"),y.FIRST_PARTY=new y("first-party-uid"),y.MOCK_USER=new y("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let v="10.12.3",w=new c.Logger("@firebase/firestore");function b(){return w.logLevel}function I(e){w.setLogLevel(e)}function _(e,...t){if(w.logLevel<=c.LogLevel.DEBUG){let r=t.map(S);w.debug(`Firestore (${v}): ${e}`,...r)}}function E(e,...t){if(w.logLevel<=c.LogLevel.ERROR){let r=t.map(S);w.error(`Firestore (${v}): ${e}`,...r)}}function T(e,...t){if(w.logLevel<=c.LogLevel.WARN){let r=t.map(S);w.warn(`Firestore (${v}): ${e}`,...r)}}function S(e){if("string"==typeof e)return e;try{/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */return JSON.stringify(e)}catch(t){return e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(e="Unexpected state"){let t=`FIRESTORE (${v}) INTERNAL ASSERTION FAILED: `+e;throw E(t),Error(t)}function A(e,t){e||x()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let C={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class D extends h.FirebaseError{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class O{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(y.UNAUTHENTICATED))}shutdown(){}}class R{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class P{constructor(e){this.t=e,this.currentUser=y.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){let r=this.i,n=e=>this.i!==r?(r=this.i,t(e)):Promise.resolve(),i=new N;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new N,e.enqueueRetryable(()=>n(this.currentUser))};let s=()=>{let t=i;e.enqueueRetryable(async()=>{await t.promise,await n(this.currentUser)})},a=e=>{_("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.auth.addAuthTokenListener(this.o),s()};this.t.onInit(e=>a(e)),setTimeout(()=>{if(!this.auth){let e=this.t.getImmediate({optional:!0});e?a(e):(_("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new N)}},0),s()}getToken(){let e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(_("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?("string"==typeof t.accessToken||x(),new k(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){let e=this.auth&&this.auth.getUid();return null===e||"string"==typeof e||x(),new y(e)}}class L{constructor(e,t,r){this.l=e,this.h=t,this.P=r,this.type="FirstParty",this.user=y.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);let e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class M{constructor(e,t,r){this.l=e,this.h=t,this.P=r}getToken(){return Promise.resolve(new L(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable(()=>t(y.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class F{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class U{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){let r=e=>{null!=e.error&&_("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);let r=e.token!==this.R;return this.R=e.token,_("FirebaseAppCheckTokenProvider",`Received ${r?"new":"existing"} token.`),r?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>r(t))};let n=e=>{_("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.appCheck.addTokenListener(this.o)};this.A.onInit(e=>n(e)),setTimeout(()=>{if(!this.appCheck){let e=this.A.getImmediate({optional:!0});e?n(e):_("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?("string"==typeof e.token||x(),this.R=e.token,new F(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}}class V{getToken(){return Promise.resolve(new F(""))}invalidateToken(){}start(e,t){}shutdown(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B{static newId(){let e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length,r="";for(;r.length<20;){let n=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){let t="undefined"!=typeof self&&(self.crypto||self.msCrypto),r=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(r);else for(let t=0;t<e;t++)r[t]=Math.floor(256*Math.random());return r}(40);for(let i=0;i<n.length;++i)r.length<20&&n[i]<t&&(r+=e.charAt(n[i]%e.length))}return r}}function j(e,t){return e<t?-1:e>t?1:0}function q(e,t,r){return e.length===t.length&&e.every((e,n)=>r(e,t[n]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0||t>=1e9)throw new D(C.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800||e>=253402300800)throw new D(C.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return z.fromMillis(Date.now())}static fromDate(e){return z.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3),r=Math.floor(1e6*(e-1e3*t));return new z(t,r)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?j(this.nanoseconds,e.nanoseconds):j(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){let e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.timestamp=e}static fromTimestamp(e){return new G(e)}static min(){return new G(new z(0,0))}static max(){return new G(new z(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K{constructor(e,t,r){void 0===t?t=0:t>e.length&&x(),void 0===r?r=e.length-t:r>e.length-t&&x(),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return 0===K.comparator(this,e)}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof K?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let r=Math.min(e.length,t.length);for(let n=0;n<r;n++){let r=e.get(n),i=t.get(n);if(r<i)return -1;if(r>i)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class $ extends K{construct(e,t,r){return new $(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let r of e){if(r.indexOf("//")>=0)throw new D(C.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter(e=>e.length>0))}return new $(t)}static emptyPath(){return new $([])}}let H=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Q extends K{construct(e,t,r){return new Q(e,t,r)}static isValidIdentifier(e){return H.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Q.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&"__name__"===this.get(0)}static keyField(){return new Q(["__name__"])}static fromServerFormat(e){let t=[],r="",n=0,i=()=>{if(0===r.length)throw new D(C.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""},s=!1;for(;n<e.length;){let t=e[n];if("\\"===t){if(n+1===e.length)throw new D(C.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let t=e[n+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new D(C.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=t,n+=2}else"`"===t?s=!s:"."!==t||s?r+=t:i(),n++}if(i(),s)throw new D(C.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Q(t)}static emptyPath(){return new Q([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class W{constructor(e){this.path=e}static fromPath(e){return new W($.fromString(e))}static fromName(e){return new W($.fromString(e).popFirst(5))}static empty(){return new W($.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===$.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return $.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new W(new $(e.slice()))}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class J{constructor(e,t,r,n){this.indexId=e,this.collectionGroup=t,this.fields=r,this.indexState=n}}function Y(e){return e.fields.find(e=>2===e.kind)}function X(e){return e.fields.filter(e=>2!==e.kind)}function Z(e,t){let r=j(e.collectionGroup,t.collectionGroup);if(0!==r)return r;for(let n=0;n<Math.min(e.fields.length,t.fields.length);++n)if(0!==(r=function(e,t){let r=Q.comparator(e.fieldPath,t.fieldPath);return 0!==r?r:j(e.kind,t.kind)}(e.fields[n],t.fields[n])))return r;return j(e.fields.length,t.fields.length)}J.UNKNOWN_ID=-1;class ee{constructor(e,t){this.fieldPath=e,this.kind=t}}class et{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new et(0,ei.min())}}function er(e,t){let r=e.toTimestamp().seconds,n=e.toTimestamp().nanoseconds+1,i=G.fromTimestamp(1e9===n?new z(r+1,0):new z(r,n));return new ei(i,W.empty(),t)}function en(e){return new ei(e.readTime,e.key,-1)}class ei{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new ei(G.min(),W.empty(),-1)}static max(){return new ei(G.max(),W.empty(),-1)}}function es(e,t){let r=e.readTime.compareTo(t.readTime);return 0!==r?r:0!==(r=W.comparator(e.documentKey,t.documentKey))?r:j(e.largestBatchId,t.largestBatchId)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ea="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class eo{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function el(e){if(e.code!==C.FAILED_PRECONDITION||e.message!==ea)throw e;_("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&x(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new eu((r,n)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(r,n)},this.catchCallback=e=>{this.wrapFailure(t,e).next(r,n)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{let t=e();return t instanceof eu?t:eu.resolve(t)}catch(e){return eu.reject(e)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):eu.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):eu.reject(t)}static resolve(e){return new eu((t,r)=>{t(e)})}static reject(e){return new eu((t,r)=>{r(e)})}static waitFor(e){return new eu((t,r)=>{let n=0,i=0,s=!1;e.forEach(e=>{++n,e.next(()=>{++i,s&&i===n&&t()},e=>r(e))}),s=!0,i===n&&t()})}static or(e){let t=eu.resolve(!1);for(let r of e)t=t.next(e=>e?eu.resolve(e):r());return t}static forEach(e,t){let r=[];return e.forEach((e,n)=>{r.push(t.call(this,e,n))}),this.waitFor(r)}static mapArray(e,t){return new eu((r,n)=>{let i=e.length,s=Array(i),a=0;for(let o=0;o<i;o++){let l=o;t(e[l]).next(e=>{s[l]=e,++a===i&&r(s)},e=>n(e))}})}static doWhile(e,t){return new eu((r,n)=>{let i=()=>{!0===e()?t().next(()=>{i()},n):r()};i()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ec{constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.V=new N,this.transaction.oncomplete=()=>{this.V.resolve()},this.transaction.onabort=()=>{t.error?this.V.reject(new ep(e,t.error)):this.V.resolve()},this.transaction.onerror=t=>{let r=ew(t.target.error);this.V.reject(new ep(e,r))}}static open(e,t,r,n){try{return new ec(t,e.transaction(n,r))}catch(e){throw new ep(t,e)}}get m(){return this.V.promise}abort(e){e&&this.V.reject(e),this.aborted||(_("SimpleDb","Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}g(){let e=this.transaction;this.aborted||"function"!=typeof e.commit||e.commit()}store(e){let t=this.transaction.objectStore(e);return new eg(t)}}class eh{constructor(e,t,r){this.name=e,this.version=t,this.p=r,12.2===eh.S((0,h.getUA)())&&E("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}static delete(e){return _("SimpleDb","Removing database:",e),ey(window.indexedDB.deleteDatabase(e)).toPromise()}static D(){if(!(0,h.isIndexedDBAvailable)())return!1;if(eh.C())return!0;let e=(0,h.getUA)(),t=eh.S(e),r=ed(e);return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||0<t&&t<10||0<r&&r<4.5)}static C(){var e;return void 0!==p&&"YES"===(null===(e=p.__PRIVATE_env)||void 0===e?void 0:e.v)}static F(e,t){return e.store(t)}static S(e){let t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),r=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(r)}async M(e){return this.db||(_("SimpleDb","Opening database:",this.name),this.db=await new Promise((t,r)=>{let n=indexedDB.open(this.name,this.version);n.onsuccess=e=>{let r=e.target.result;t(r)},n.onblocked=()=>{r(new ep(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},n.onerror=t=>{let n=t.target.error;"VersionError"===n.name?r(new D(C.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):"InvalidStateError"===n.name?r(new D(C.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+n)):r(new ep(e,n))},n.onupgradeneeded=e=>{_("SimpleDb",'Database "'+this.name+'" requires upgrade from version:',e.oldVersion);let t=e.target.result;this.p.O(t,n.transaction,e.oldVersion,this.version).next(()=>{_("SimpleDb","Database upgrade to version "+this.version+" complete")})}})),this.N&&(this.db.onversionchange=e=>this.N(e)),this.db}L(e){this.N=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,r,n){let i="readonly"===t,s=0;for(;;){++s;try{this.db=await this.M(e);let t=ec.open(this.db,e,i?"readonly":"readwrite",r),s=n(t).next(e=>(t.g(),e)).catch(e=>(t.abort(e),eu.reject(e))).toPromise();return s.catch(()=>{}),await t.m,s}catch(t){let e="FirebaseError"!==t.name&&s<3;if(_("SimpleDb","Transaction failed with error:",t.message,"Retrying:",e),this.close(),!e)return Promise.reject(t)}}}close(){this.db&&this.db.close(),this.db=void 0}}function ed(e){let t=e.match(/Android ([\d.]+)/i),r=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(r)}class ef{constructor(e){this.B=e,this.k=!1,this.q=null}get isDone(){return this.k}get K(){return this.q}set cursor(e){this.B=e}done(){this.k=!0}$(e){this.q=e}delete(){return ey(this.B.delete())}}class ep extends D{constructor(e,t){super(C.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function em(e){return"IndexedDbTransactionError"===e.name}class eg{constructor(e){this.store=e}put(e,t){let r;return void 0!==t?(_("SimpleDb","PUT",this.store.name,e,t),r=this.store.put(t,e)):(_("SimpleDb","PUT",this.store.name,"<auto-key>",e),r=this.store.put(e)),ey(r)}add(e){return _("SimpleDb","ADD",this.store.name,e,e),ey(this.store.add(e))}get(e){return ey(this.store.get(e)).next(t=>(void 0===t&&(t=null),_("SimpleDb","GET",this.store.name,e,t),t))}delete(e){return _("SimpleDb","DELETE",this.store.name,e),ey(this.store.delete(e))}count(){return _("SimpleDb","COUNT",this.store.name),ey(this.store.count())}U(e,t){let r=this.options(e,t),n=r.index?this.store.index(r.index):this.store;if("function"==typeof n.getAll){let e=n.getAll(r.range);return new eu((t,r)=>{e.onerror=e=>{r(e.target.error)},e.onsuccess=e=>{t(e.target.result)}})}{let e=this.cursor(r),t=[];return this.W(e,(e,r)=>{t.push(r)}).next(()=>t)}}G(e,t){let r=this.store.getAll(e,null===t?void 0:t);return new eu((e,t)=>{r.onerror=e=>{t(e.target.error)},r.onsuccess=t=>{e(t.target.result)}})}j(e,t){_("SimpleDb","DELETE ALL",this.store.name);let r=this.options(e,t);r.H=!1;let n=this.cursor(r);return this.W(n,(e,t,r)=>r.delete())}J(e,t){let r;t?r=e:(r={},t=e);let n=this.cursor(r);return this.W(n,t)}Y(e){let t=this.cursor({});return new eu((r,n)=>{t.onerror=e=>{let t=ew(e.target.error);n(t)},t.onsuccess=t=>{let n=t.target.result;n?e(n.primaryKey,n.value).next(e=>{e?n.continue():r()}):r()}})}W(e,t){let r=[];return new eu((n,i)=>{e.onerror=e=>{i(e.target.error)},e.onsuccess=e=>{let i=e.target.result;if(!i)return void n();let s=new ef(i),a=t(i.primaryKey,i.value,s);if(a instanceof eu){let e=a.catch(e=>(s.done(),eu.reject(e)));r.push(e)}s.isDone?n():null===s.K?i.continue():i.continue(s.K)}}).next(()=>eu.waitFor(r))}options(e,t){let r;return void 0!==e&&("string"==typeof e?r=e:t=e),{index:r,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){let r=this.store.index(e.index);return e.H?r.openKeyCursor(e.range,t):r.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function ey(e){return new eu((t,r)=>{e.onsuccess=e=>{let r=e.target.result;t(r)},e.onerror=e=>{let t=ew(e.target.error);r(t)}})}let ev=!1;function ew(e){let t=eh.S((0,h.getUA)());if(t>=12.2&&t<13){let t="An internal error was encountered in the Indexed Database server";if(e.message.indexOf(t)>=0){let e=new D("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return ev||(ev=!0,setTimeout(()=>{throw e},0)),e}}return e}class eb{constructor(e,t){this.asyncQueue=e,this.Z=t,this.task=null}start(){this.X(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return null!==this.task}X(e){_("IndexBackfiller",`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{_("IndexBackfiller",`Documents written: ${await this.Z.ee()}`)}catch(e){em(e)?_("IndexBackfiller","Ignoring IndexedDB error during index backfill: ",e):await el(e)}await this.X(6e4)})}}class eI{constructor(e,t){this.localStore=e,this.persistence=t}async ee(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.te(t,e))}te(e,t){let r=new Set,n=t,i=!0;return eu.doWhile(()=>!0===i&&n>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(t=>{if(null!==t&&!r.has(t))return _("IndexBackfiller",`Processing collection: ${t}`),this.ne(e,t,n).next(e=>{n-=e,r.add(t)});i=!1})).next(()=>t-n)}ne(e,t,r){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(n=>this.localStore.localDocuments.getNextDocuments(e,t,n,r).next(r=>{let i=r.changes;return this.localStore.indexManager.updateIndexEntries(e,i).next(()=>this.re(n,r)).next(r=>(_("IndexBackfiller",`Updating offset: ${r}`),this.localStore.indexManager.updateCollectionGroup(e,t,r))).next(()=>i.size)}))}re(e,t){let r=e;return t.changes.forEach((e,t)=>{let n=en(t);es(n,r)>0&&(r=n)}),new ei(r.readTime,r.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e_{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ie(e),this.se=e=>t.writeSequenceNumber(e))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this.se&&this.se(e),e}}function eE(e){return null==e}function eT(e){return 0===e&&1/e==-1/0}function eS(e){return"number"==typeof e&&Number.isInteger(e)&&!eT(e)&&e<=Number.MAX_SAFE_INTEGER&&e>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ex(e){var t,r;let n="";for(let t=0;t<e.length;t++)n.length>0&&(n+="\x01\x01"),n=function(e,t){let r=t,n=e.length;for(let t=0;t<n;t++){let n=e.charAt(t);switch(n){case"\x00":r+="\x01\x10";break;case"\x01":r+="\x01\x11";break;default:r+=n}}return r}(e.get(t),n);return n+"\x01\x01"}function eA(e){let t=e.length;if(t>=2||x(),2===t)return"\x01"===e.charAt(0)&&"\x01"===e.charAt(1)||x(),$.emptyPath();let r=t-2,n=[],i="";for(let s=0;s<t;){let t=e.indexOf("\x01",s);switch((t<0||t>r)&&x(),e.charAt(t+1)){case"\x01":let a;let o=e.substring(s,t);0===i.length?a=o:(i+=o,a=i,i=""),n.push(a);break;case"\x10":i+=e.substring(s,t)+"\x00";break;case"\x11":i+=e.substring(s,t+1);break;default:x()}s=t+2}return new $(n)}e_.oe=-1;/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eC=["userId","batchId"],eD={},eN=["prefixPath","collectionGroup","readTime","documentId"],ek=["prefixPath","collectionGroup","documentId"],eO=["collectionGroup","readTime","prefixPath","documentId"],eR=["canonicalId","targetId"],eP=["targetId","path"],eL=["path","targetId"],eM=["collectionId","parent"],eF=["indexId","uid"],eU=["uid","sequenceNumber"],eV=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],eB=["indexId","uid","orderedDocumentKey"],ej=["userId","collectionPath","documentId"],eq=["userId","collectionPath","largestBatchId"],ez=["userId","collectionGroup","largestBatchId"],eG=["mutationQueues","mutations","documentMutations","remoteDocuments","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries"],eK=[...eG,"documentOverlays"],e$=["mutationQueues","mutations","documentMutations","remoteDocumentsV14","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries","documentOverlays"],eH=[...e$,"indexConfiguration","indexState","indexEntries"];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eQ extends eo{constructor(e,t){super(),this._e=e,this.currentSequenceNumber=t}}function eW(e,t){return eh.F(e._e,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eJ(e){let t=0;for(let r in e)Object.prototype.hasOwnProperty.call(e,r)&&t++;return t}function eY(e,t){for(let r in e)Object.prototype.hasOwnProperty.call(e,r)&&t(r,e[r])}function eX(e,t){let r=[];for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&r.push(t(e[n],n,e));return r}function eZ(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e0{constructor(e,t){this.comparator=e,this.root=t||e2.EMPTY}insert(e,t){return new e0(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,e2.BLACK,null,null))}remove(e){return new e0(this.comparator,this.root.remove(e,this.comparator).copy(null,null,e2.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let r=this.comparator(e,t.key);if(0===r)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){let n=this.comparator(e,r.key);if(0===n)return t+r.left.size;n<0?r=r.left:(t+=r.left.size+1,r=r.right)}return -1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,r)=>(e(t,r),!1))}toString(){let e=[];return this.inorderTraversal((t,r)=>(e.push(`${t}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new e1(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new e1(this.root,e,this.comparator,!1)}getReverseIterator(){return new e1(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new e1(this.root,e,this.comparator,!0)}}class e1{constructor(e,t,r,n){this.isReverse=n,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&n&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(0===i){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class e2{constructor(e,t,r,n,i){this.key=e,this.value=t,this.color=null!=r?r:e2.RED,this.left=null!=n?n:e2.EMPTY,this.right=null!=i?i:e2.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,n,i){return new e2(null!=e?e:this.key,null!=t?t:this.value,null!=r?r:this.color,null!=n?n:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let n=this,i=r(e,n.key);return(n=i<0?n.copy(null,null,null,n.left.insert(e,t,r),null):0===i?n.copy(null,t,null,null,null):n.copy(null,null,null,null,n.right.insert(e,t,r))).fixUp()}removeMin(){if(this.left.isEmpty())return e2.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),(e=e.copy(null,null,null,e.left.removeMin(),null)).fixUp()}remove(e,t){let r,n=this;if(0>t(e,n.key))n.left.isEmpty()||n.left.isRed()||n.left.left.isRed()||(n=n.moveRedLeft()),n=n.copy(null,null,null,n.left.remove(e,t),null);else{if(n.left.isRed()&&(n=n.rotateRight()),n.right.isEmpty()||n.right.isRed()||n.right.left.isRed()||(n=n.moveRedRight()),0===t(e,n.key)){if(n.right.isEmpty())return e2.EMPTY;r=n.right.min(),n=n.copy(r.key,r.value,null,null,n.right.removeMin())}n=n.copy(null,null,null,null,n.right.remove(e,t))}return n.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=(e=(e=e.copy(null,null,null,null,e.right.rotateRight())).rotateLeft()).colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=(e=e.rotateRight()).colorFlip()),e}rotateLeft(){let e=this.copy(null,null,e2.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,e2.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){let e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw x();let e=this.left.check();if(e!==this.right.check())throw x();return e+(this.isRed()?0:1)}}e2.EMPTY=null,e2.RED=!0,e2.BLACK=!1,e2.EMPTY=new class{constructor(){this.size=0}get key(){throw x()}get value(){throw x()}get color(){throw x()}get left(){throw x()}get right(){throw x()}copy(e,t,r,n,i){return this}insert(e,t,r){return new e2(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e4{constructor(e){this.comparator=e,this.data=new e0(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,r)=>(e(t),!1))}forEachInRange(e,t){let r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){let n=r.getNext();if(this.comparator(n.key,e[1])>=0)return;t(n.key)}}forEachWhile(e,t){let r;for(r=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new e6(this.data.getIterator())}getIteratorFrom(e){return new e6(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof e4)||this.size!==e.size)return!1;let t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){let e=t.getNext().key,n=r.getNext().key;if(0!==this.comparator(e,n))return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new e4(this.comparator);return t.data=e,t}}class e6{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function e9(e){return e.hasNext()?e.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e5{constructor(e){this.fields=e,e.sort(Q.comparator)}static empty(){return new e5([])}unionWith(e){let t=new e4(Q.comparator);for(let e of this.fields)t=t.add(e);for(let r of e)t=t.add(r);return new e5(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return q(this.fields,e.fields,(e,t)=>e.isEqual(t))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e3 extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function e8(){return"undefined"!=typeof atob}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e7{constructor(e){this.binaryString=e}static fromBase64String(e){let t=function(e){try{return atob(e)}catch(e){throw"undefined"!=typeof DOMException&&e instanceof DOMException?new e3("Invalid base64 string: "+e):e}}(e);return new e7(t)}static fromUint8Array(e){let t=function(e){let t="";for(let r=0;r<e.length;++r)t+=String.fromCharCode(e[r]);return t}(e);return new e7(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return btoa(this.binaryString)}toUint8Array(){return function(e){let t=new Uint8Array(e.length);for(let r=0;r<e.length;r++)t[r]=e.charCodeAt(r);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return j(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}e7.EMPTY_BYTE_STRING=new e7("");let te=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function tt(e){if(e||x(),"string"==typeof e){let t=0,r=te.exec(e);if(r||x(),r[1]){let e=r[1];t=Number(e=(e+"000000000").substr(0,9))}let n=new Date(e);return{seconds:Math.floor(n.getTime()/1e3),nanos:t}}return{seconds:tr(e.seconds),nanos:tr(e.nanos)}}function tr(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function tn(e){return"string"==typeof e?e7.fromBase64String(e):e7.fromUint8Array(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ti(e){var t,r;return"server_timestamp"===(null===(r=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{}).__type__)||void 0===r?void 0:r.stringValue)}function ts(e){let t=e.mapValue.fields.__previous_value__;return ti(t)?ts(t):t}function ta(e){let t=tt(e.mapValue.fields.__local_write_time__.timestampValue);return new z(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class to{constructor(e,t,r,n,i,s,a,o,l){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=n,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=a,this.longPollingOptions=o,this.useFetchStreams=l}}class tl{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new tl("","")}get isDefaultDatabase(){return"(default)"===this.database}isEqual(e){return e instanceof tl&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tu={mapValue:{fields:{__type__:{stringValue:"__max__"}}}},tc={nullValue:"NULL_VALUE"};function th(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?ti(e)?4:tT(e)?9007199254740991:10:x()}function td(e,t){if(e===t)return!0;let r=th(e);if(r!==th(t))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return ta(e).isEqual(ta(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;let r=tt(e.timestampValue),n=tt(t.timestampValue);return r.seconds===n.seconds&&r.nanos===n.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return tn(e.bytesValue).isEqual(tn(t.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return tr(e.geoPointValue.latitude)===tr(t.geoPointValue.latitude)&&tr(e.geoPointValue.longitude)===tr(t.geoPointValue.longitude);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return tr(e.integerValue)===tr(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){let r=tr(e.doubleValue),n=tr(t.doubleValue);return r===n?eT(r)===eT(n):isNaN(r)&&isNaN(n)}return!1}(e,t);case 9:return q(e.arrayValue.values||[],t.arrayValue.values||[],td);case 10:return function(e,t){let r=e.mapValue.fields||{},n=t.mapValue.fields||{};if(eJ(r)!==eJ(n))return!1;for(let e in r)if(r.hasOwnProperty(e)&&(void 0===n[e]||!td(r[e],n[e])))return!1;return!0}(e,t);default:return x()}}function tf(e,t){return void 0!==(e.values||[]).find(e=>td(e,t))}function tp(e,t){if(e===t)return 0;let r=th(e),n=th(t);if(r!==n)return j(r,n);switch(r){case 0:case 9007199254740991:return 0;case 1:return j(e.booleanValue,t.booleanValue);case 2:return function(e,t){let r=tr(e.integerValue||e.doubleValue),n=tr(t.integerValue||t.doubleValue);return r<n?-1:r>n?1:r===n?0:isNaN(r)?isNaN(n)?0:-1:1}(e,t);case 3:return tm(e.timestampValue,t.timestampValue);case 4:return tm(ta(e),ta(t));case 5:return j(e.stringValue,t.stringValue);case 6:return function(e,t){let r=tn(e),n=tn(t);return r.compareTo(n)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){let r=e.split("/"),n=t.split("/");for(let e=0;e<r.length&&e<n.length;e++){let t=j(r[e],n[e]);if(0!==t)return t}return j(r.length,n.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){let r=j(tr(e.latitude),tr(t.latitude));return 0!==r?r:j(tr(e.longitude),tr(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return function(e,t){let r=e.values||[],n=t.values||[];for(let e=0;e<r.length&&e<n.length;++e){let t=tp(r[e],n[e]);if(t)return t}return j(r.length,n.length)}(e.arrayValue,t.arrayValue);case 10:return function(e,t){if(e===tu.mapValue&&t===tu.mapValue)return 0;if(e===tu.mapValue)return 1;if(t===tu.mapValue)return -1;let r=e.fields||{},n=Object.keys(r),i=t.fields||{},s=Object.keys(i);n.sort(),s.sort();for(let e=0;e<n.length&&e<s.length;++e){let t=j(n[e],s[e]);if(0!==t)return t;let a=tp(r[n[e]],i[s[e]]);if(0!==a)return a}return j(n.length,s.length)}(e.mapValue,t.mapValue);default:throw x()}}function tm(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return j(e,t);let r=tt(e),n=tt(t),i=j(r.seconds,n.seconds);return 0!==i?i:j(r.nanos,n.nanos)}function tg(e){var t,r;return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){let t=tt(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?tn(e.bytesValue).toBase64():"referenceValue"in e?(t=e.referenceValue,W.fromName(t).toString()):"geoPointValue"in e?(r=e.geoPointValue,`geo(${r.latitude},${r.longitude})`):"arrayValue"in e?function(e){let t="[",r=!0;for(let n of e.values||[])r?r=!1:t+=",",t+=tg(n);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){let t=Object.keys(e.fields||{}).sort(),r="{",n=!0;for(let i of t)n?n=!1:r+=",",r+=`${i}:${tg(e.fields[i])}`;return r+"}"}(e.mapValue):x()}function ty(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function tv(e){return!!e&&"integerValue"in e}function tw(e){return!!e&&"arrayValue"in e}function tb(e){return!!e&&"nullValue"in e}function tI(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function t_(e){return!!e&&"mapValue"in e}function tE(e){if(e.geoPointValue)return{geoPointValue:Object.assign({},e.geoPointValue)};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:Object.assign({},e.timestampValue)};if(e.mapValue){let t={mapValue:{fields:{}}};return eY(e.mapValue.fields,(e,r)=>t.mapValue.fields[e]=tE(r)),t}if(e.arrayValue){let t={arrayValue:{values:[]}};for(let r=0;r<(e.arrayValue.values||[]).length;++r)t.arrayValue.values[r]=tE(e.arrayValue.values[r]);return t}return Object.assign({},e)}function tT(e){return"__max__"===(((e.mapValue||{}).fields||{}).__type__||{}).stringValue}function tS(e,t){let r=tp(e.value,t.value);return 0!==r?r:e.inclusive&&!t.inclusive?-1:!e.inclusive&&t.inclusive?1:0}function tx(e,t){let r=tp(e.value,t.value);return 0!==r?r:e.inclusive&&!t.inclusive?1:!e.inclusive&&t.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tA{constructor(e){this.value=e}static empty(){return new tA({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(!t_(t=(t.mapValue.fields||{})[e.get(r)]))return null;return(t=(t.mapValue.fields||{})[e.lastSegment()])||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=tE(t)}setAll(e){let t=Q.emptyPath(),r={},n=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){let e=this.getFieldsMap(t);this.applyChanges(e,r,n),r={},n=[],t=i.popLast()}e?r[i.lastSegment()]=tE(e):n.push(i.lastSegment())});let i=this.getFieldsMap(t);this.applyChanges(i,r,n)}delete(e){let t=this.field(e.popLast());t_(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return td(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let n=t.mapValue.fields[e.get(r)];t_(n)&&n.mapValue.fields||(n={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=n),t=n}return t.mapValue.fields}applyChanges(e,t,r){for(let n of(eY(t,(t,r)=>e[t]=r),r))delete e[n]}clone(){return new tA(tE(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tC{constructor(e,t,r,n,i,s,a){this.key=e,this.documentType=t,this.version=r,this.readTime=n,this.createTime=i,this.data=s,this.documentState=a}static newInvalidDocument(e){return new tC(e,0,G.min(),G.min(),G.min(),tA.empty(),0)}static newFoundDocument(e,t,r,n){return new tC(e,1,t,G.min(),r,n,0)}static newNoDocument(e,t){return new tC(e,2,t,G.min(),G.min(),tA.empty(),0)}static newUnknownDocument(e,t){return new tC(e,3,t,G.min(),G.min(),tA.empty(),2)}convertToFoundDocument(e,t){return this.createTime.isEqual(G.min())&&(2===this.documentType||0===this.documentType)&&(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=tA.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=tA.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof tC&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new tC(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tD{constructor(e,t){this.position=e,this.inclusive=t}}function tN(e,t,r){let n=0;for(let i=0;i<e.position.length;i++){let s=t[i],a=e.position[i];if(n=s.field.isKeyField()?W.comparator(W.fromName(a.referenceValue),r.key):tp(a,r.data.field(s.field)),"desc"===s.dir&&(n*=-1),0!==n)break}return n}function tk(e,t){if(null===e)return null===t;if(null===t||e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let r=0;r<e.position.length;r++)if(!td(e.position[r],t.position[r]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tO{constructor(e,t="asc"){this.field=e,this.dir=t}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tR{}class tP extends tR{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,r):new tj(e,t,r):"array-contains"===t?new tK(e,r):"in"===t?new t$(e,r):"not-in"===t?new tH(e,r):"array-contains-any"===t?new tQ(e,r):new tP(e,t,r)}static createKeyFieldInFilter(e,t,r){return"in"===t?new tq(e,r):new tz(e,r)}matches(e){let t=e.data.field(this.field);return"!="===this.op?null!==t&&this.matchesComparison(tp(t,this.value)):null!==t&&th(this.value)===th(t)&&this.matchesComparison(tp(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return x()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class tL extends tR{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new tL(e,t)}matches(e){return tM(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.ae||(this.ae=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function tM(e){return"and"===e.op}function tF(e){return"or"===e.op}function tU(e){return tV(e)&&tM(e)}function tV(e){for(let t of e.filters)if(t instanceof tL)return!1;return!0}function tB(e,t){let r=e.filters.concat(t);return tL.create(r,e.op)}class tj extends tP{constructor(e,t,r){super(e,t,r),this.key=W.fromName(r.referenceValue)}matches(e){let t=W.comparator(e.key,this.key);return this.matchesComparison(t)}}class tq extends tP{constructor(e,t){super(e,"in",t),this.keys=tG("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class tz extends tP{constructor(e,t){super(e,"not-in",t),this.keys=tG("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function tG(e,t){var r;return((null===(r=t.arrayValue)||void 0===r?void 0:r.values)||[]).map(e=>W.fromName(e.referenceValue))}class tK extends tP{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return tw(t)&&tf(t.arrayValue,this.value)}}class t$ extends tP{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return null!==t&&tf(this.value.arrayValue,t)}}class tH extends tP{constructor(e,t){super(e,"not-in",t)}matches(e){if(tf(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return null!==t&&!tf(this.value.arrayValue,t)}}class tQ extends tP{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!tw(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>tf(this.value.arrayValue,e))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tW{constructor(e,t=null,r=[],n=[],i=null,s=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=n,this.limit=i,this.startAt=s,this.endAt=a,this.ue=null}}function tJ(e,t=null,r=[],n=[],i=null,s=null,a=null){return new tW(e,t,r,n,i,s,a)}function tY(e){if(null===e.ue){let t=e.path.canonicalString();null!==e.collectionGroup&&(t+="|cg:"+e.collectionGroup),t+="|f:"+e.filters.map(e=>(function e(t){if(t instanceof tP)return t.field.canonicalString()+t.op.toString()+tg(t.value);if(tU(t))return t.filters.map(t=>e(t)).join(",");{let r=t.filters.map(t=>e(t)).join(",");return`${t.op}(${r})`}})(e)).join(",")+"|ob:"+e.orderBy.map(e=>e.field.canonicalString()+e.dir).join(","),eE(e.limit)||(t+="|l:"+e.limit),e.startAt&&(t+="|lb:"+(e.startAt.inclusive?"b:":"a:")+e.startAt.position.map(e=>tg(e)).join(",")),e.endAt&&(t+="|ub:"+(e.endAt.inclusive?"a:":"b:")+e.endAt.position.map(e=>tg(e)).join(",")),e.ue=t}return e.ue}function tX(e,t){if(e.limit!==t.limit||e.orderBy.length!==t.orderBy.length)return!1;for(let i=0;i<e.orderBy.length;i++){var r,n;if(r=e.orderBy[i],n=t.orderBy[i],!(r.dir===n.dir&&r.field.isEqual(n.field)))return!1}if(e.filters.length!==t.filters.length)return!1;for(let r=0;r<e.filters.length;r++)if(!function e(t,r){return t instanceof tP?r instanceof tP&&t.op===r.op&&t.field.isEqual(r.field)&&td(t.value,r.value):t instanceof tL?r instanceof tL&&t.op===r.op&&t.filters.length===r.filters.length&&t.filters.reduce((t,n,i)=>t&&e(n,r.filters[i]),!0):void x()}(e.filters[r],t.filters[r]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!tk(e.startAt,t.startAt)&&tk(e.endAt,t.endAt)}function tZ(e){return W.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}function t0(e,t){return e.filters.filter(e=>e instanceof tP&&e.field.isEqual(t))}function t1(e,t,r){let n=tc,i=!0;for(let r of t0(e,t)){let e=tc,t=!0;switch(r.op){case"<":case"<=":var s;e="nullValue"in(s=r.value)?tc:"booleanValue"in s?{booleanValue:!1}:"integerValue"in s||"doubleValue"in s?{doubleValue:NaN}:"timestampValue"in s?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in s?{stringValue:""}:"bytesValue"in s?{bytesValue:""}:"referenceValue"in s?ty(tl.empty(),W.empty()):"geoPointValue"in s?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in s?{arrayValue:{}}:"mapValue"in s?{mapValue:{}}:x();break;case"==":case"in":case">=":e=r.value;break;case">":e=r.value,t=!1;break;case"!=":case"not-in":e=tc}0>tS({value:n,inclusive:i},{value:e,inclusive:t})&&(n=e,i=t)}if(null!==r){for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){let e=r.position[s];0>tS({value:n,inclusive:i},{value:e,inclusive:r.inclusive})&&(n=e,i=r.inclusive);break}}return{value:n,inclusive:i}}function t2(e,t,r){let n=tu,i=!0;for(let r of t0(e,t)){let e=tu,t=!0;switch(r.op){case">=":case">":var s;e="nullValue"in(s=r.value)?{booleanValue:!1}:"booleanValue"in s?{doubleValue:NaN}:"integerValue"in s||"doubleValue"in s?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in s?{stringValue:""}:"stringValue"in s?{bytesValue:""}:"bytesValue"in s?ty(tl.empty(),W.empty()):"referenceValue"in s?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in s?{arrayValue:{}}:"arrayValue"in s?{mapValue:{}}:"mapValue"in s?tu:x(),t=!1;break;case"==":case"in":case"<=":e=r.value;break;case"<":e=r.value,t=!1;break;case"!=":case"not-in":e=tu}tx({value:n,inclusive:i},{value:e,inclusive:t})>0&&(n=e,i=t)}if(null!==r){for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){let e=r.position[s];tx({value:n,inclusive:i},{value:e,inclusive:r.inclusive})>0&&(n=e,i=r.inclusive);break}}return{value:n,inclusive:i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class t4{constructor(e,t=null,r=[],n=[],i=null,s="F",a=null,o=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=n,this.limit=i,this.limitType=s,this.startAt=a,this.endAt=o,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function t6(e){return new t4(e)}function t9(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function t5(e){return null!==e.collectionGroup}function t3(e){if(null===e.ce){let t;e.ce=[];let r=new Set;for(let t of e.explicitOrderBy)e.ce.push(t),r.add(t.field.canonicalString());let n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc",i=(t=new e4(Q.comparator),e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t);i.forEach(t=>{r.has(t.canonicalString())||t.isKeyField()||e.ce.push(new tO(t,n))}),r.has(Q.keyField().canonicalString())||e.ce.push(new tO(Q.keyField(),n))}return e.ce}function t8(e){return e.le||(e.le=re(e,t3(e))),e.le}function t7(e){return e.he||(e.he=re(e,e.explicitOrderBy)),e.he}function re(e,t){if("F"===e.limitType)return tJ(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{let t="desc"===e.dir?"asc":"desc";return new tO(e.field,t)});let r=e.endAt?new tD(e.endAt.position,e.endAt.inclusive):null,n=e.startAt?new tD(e.startAt.position,e.startAt.inclusive):null;return tJ(e.path,e.collectionGroup,t,e.filters,e.limit,r,n)}}function rt(e,t){let r=e.filters.concat([t]);return new t4(e.path,e.collectionGroup,e.explicitOrderBy.slice(),r,e.limit,e.limitType,e.startAt,e.endAt)}function rr(e,t,r){return new t4(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,r,e.startAt,e.endAt)}function rn(e,t){return tX(t8(e),t8(t))&&e.limitType===t.limitType}function ri(e){return`${tY(t8(e))}|lt:${e.limitType}`}function rs(e){var t;let r;return`Query(target=${r=(t=t8(e)).path.canonicalString(),null!==t.collectionGroup&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map(e=>(function e(t){return t instanceof tP?`${t.field.canonicalString()} ${t.op} ${tg(t.value)}`:t instanceof tL?t.op.toString()+" {"+t.getFilters().map(e).join(" ,")+"}":"Filter"})(e)).join(", ")}]`),eE(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map(e=>`${e.field.canonicalString()} (${e.dir})`).join(", ")}]`),t.startAt&&(r+=", startAt: "+(t.startAt.inclusive?"b:":"a:")+t.startAt.position.map(e=>tg(e)).join(",")),t.endAt&&(r+=", endAt: "+(t.endAt.inclusive?"a:":"b:")+t.endAt.position.map(e=>tg(e)).join(",")),`Target(${r})`}; limitType=${e.limitType})`}function ra(e,t){return t.isFoundDocument()&&function(e,t){let r=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(r):W.isDocumentKey(e.path)?e.path.isEqual(r):e.path.isImmediateParentOf(r)}(e,t)&&function(e,t){for(let r of t3(e))if(!r.field.isKeyField()&&null===t.data.field(r.field))return!1;return!0}(e,t)&&function(e,t){for(let r of e.filters)if(!r.matches(t))return!1;return!0}(e,t)&&(!e.startAt||!!function(e,t,r){let n=tN(e,t,r);return e.inclusive?n<=0:n<0}(e.startAt,t3(e),t))&&(!e.endAt||!!function(e,t,r){let n=tN(e,t,r);return e.inclusive?n>=0:n>0}(e.endAt,t3(e),t))}function ro(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}function rl(e){return(t,r)=>{let n=!1;for(let i of t3(e)){let e=function(e,t,r){let n=e.field.isKeyField()?W.comparator(t.key,r.key):function(e,t,r){let n=t.data.field(e),i=r.data.field(e);return null!==n&&null!==i?tp(n,i):x()}(e.field,t,r);switch(e.dir){case"asc":return n;case"desc":return -1*n;default:return x()}}(i,t,r);if(0!==e)return e;n=n||i.field.isKeyField()}return 0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ru{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),r=this.inner[t];if(void 0!==r){for(let[t,n]of r)if(this.equalsFn(t,e))return n}}has(e){return void 0!==this.get(e)}set(e,t){let r=this.mapKeyFn(e),n=this.inner[r];if(void 0===n)return this.inner[r]=[[e,t]],void this.innerSize++;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return void(n[r]=[e,t]);n.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),r=this.inner[t];if(void 0===r)return!1;for(let n=0;n<r.length;n++)if(this.equalsFn(r[n][0],e))return 1===r.length?delete this.inner[t]:r.splice(n,1),this.innerSize--,!0;return!1}forEach(e){eY(this.inner,(t,r)=>{for(let[t,n]of r)e(t,n)})}isEmpty(){return eZ(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rc=new e0(W.comparator),rh=new e0(W.comparator);function rd(...e){let t=rh;for(let r of e)t=t.insert(r.key,r);return t}function rf(e){let t=rh;return e.forEach((e,r)=>t=t.insert(e,r.overlayedDocument)),t}function rp(){return new ru(e=>e.toString(),(e,t)=>e.isEqual(t))}let rm=new e0(W.comparator),rg=new e4(W.comparator);function ry(...e){let t=rg;for(let r of e)t=t.add(r);return t}let rv=new e4(j);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rw(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:eT(t)?"-0":t}}function rb(e){return{integerValue:""+e}}function rI(e,t){return eS(t)?rb(t):rw(e,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r_{constructor(){this._=void 0}}function rE(e,t){return e instanceof rD?tv(t)||t&&"doubleValue"in t?t:{integerValue:0}:null}class rT extends r_{}class rS extends r_{constructor(e){super(),this.elements=e}}function rx(e,t){let r=rk(t);for(let t of e.elements)r.some(e=>td(e,t))||r.push(t);return{arrayValue:{values:r}}}class rA extends r_{constructor(e){super(),this.elements=e}}function rC(e,t){let r=rk(t);for(let t of e.elements)r=r.filter(e=>!td(e,t));return{arrayValue:{values:r}}}class rD extends r_{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function rN(e){return tr(e.integerValue||e.doubleValue)}function rk(e){return tw(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rO{constructor(e,t){this.field=e,this.transform=t}}class rR{constructor(e,t){this.version=e,this.transformResults=t}}class rP{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new rP}static exists(e){return new rP(void 0,e)}static updateTime(e){return new rP(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function rL(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class rM{}function rF(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new rK(e.key,rP.none()):new rB(e.key,e.data,rP.none());{let r=e.data,n=tA.empty(),i=new e4(Q.comparator);for(let e of t.fields)if(!i.has(e)){let t=r.field(e);null===t&&e.length>1&&(e=e.popLast(),t=r.field(e)),null===t?n.delete(e):n.set(e,t),i=i.add(e)}return new rj(e.key,n,new e5(i.toArray()),rP.none())}}function rU(e,t,r,n){return e instanceof rB?function(e,t,r,n){if(!rL(e.precondition,t))return r;let i=e.value.clone(),s=rG(e.fieldTransforms,n,t);return i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null}(e,t,r,n):e instanceof rj?function(e,t,r,n){if(!rL(e.precondition,t))return r;let i=rG(e.fieldTransforms,n,t),s=t.data;return(s.setAll(rq(e)),s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null===r)?null:r.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,r,n):rL(e.precondition,t)?(t.convertToNoDocument(t.version).setHasLocalMutations(),null):r}function rV(e,t){var r,n;return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(r=e.fieldTransforms,n=t.fieldTransforms,!!(void 0===r&&void 0===n||!(!r||!n)&&q(r,n,(e,t)=>{var r,n;return e.field.isEqual(t.field)&&(r=e.transform,n=t.transform,r instanceof rS&&n instanceof rS||r instanceof rA&&n instanceof rA?q(r.elements,n.elements,td):r instanceof rD&&n instanceof rD?td(r.Pe,n.Pe):r instanceof rT&&n instanceof rT)})))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask))}class rB extends rM{constructor(e,t,r,n=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=n,this.type=0}getFieldMask(){return null}}class rj extends rM{constructor(e,t,r,n,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=n,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function rq(e){let t=new Map;return e.fieldMask.fields.forEach(r=>{if(!r.isEmpty()){let n=e.data.field(r);t.set(r,n)}}),t}function rz(e,t,r){var n;let i=new Map;e.length===r.length||x();for(let s=0;s<r.length;s++){let a=e[s],o=a.transform,l=t.data.field(a.field);i.set(a.field,(n=r[s],o instanceof rS?rx(o,l):o instanceof rA?rC(o,l):n))}return i}function rG(e,t,r){let n=new Map;for(let i of e){let e=i.transform,s=r.data.field(i.field);n.set(i.field,e instanceof rT?function(e,t){let r={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&ti(t)&&(t=ts(t)),t&&(r.fields.__previous_value__=t),{mapValue:r}}(t,s):e instanceof rS?rx(e,s):e instanceof rA?rC(e,s):function(e,t){let r=rE(e,t),n=rN(r)+rN(e.Pe);return tv(r)&&tv(e.Pe)?rb(n):rw(e.serializer,n)}(e,s))}return n}class rK extends rM{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class r$ extends rM{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rH{constructor(e,t,r,n){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=n}applyToRemoteDocument(e,t){let r=t.mutationResults;for(let t=0;t<this.mutations.length;t++){let i=this.mutations[t];if(i.key.isEqual(e.key)){var n;n=r[t],i instanceof rB?function(e,t,r){let n=e.value.clone(),i=rz(e.fieldTransforms,t,r.transformResults);n.setAll(i),t.convertToFoundDocument(r.version,n).setHasCommittedMutations()}(i,e,n):i instanceof rj?function(e,t,r){if(!rL(e.precondition,t))return void t.convertToUnknownDocument(r.version);let n=rz(e.fieldTransforms,t,r.transformResults),i=t.data;i.setAll(rq(e)),i.setAll(n),t.convertToFoundDocument(r.version,i).setHasCommittedMutations()}(i,e,n):function(e,t,r){t.convertToNoDocument(r.version).setHasCommittedMutations()}(0,e,n)}}}applyToLocalView(e,t){for(let r of this.baseMutations)r.key.isEqual(e.key)&&(t=rU(r,e,t,this.localWriteTime));for(let r of this.mutations)r.key.isEqual(e.key)&&(t=rU(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let r=rp();return this.mutations.forEach(n=>{let i=e.get(n.key),s=i.overlayedDocument,a=this.applyToLocalView(s,i.mutatedFields);a=t.has(n.key)?null:a;let o=rF(s,a);null!==o&&r.set(n.key,o),s.isValidDocument()||s.convertToNoDocument(G.min())}),r}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),ry())}isEqual(e){return this.batchId===e.batchId&&q(this.mutations,e.mutations,(e,t)=>rV(e,t))&&q(this.baseMutations,e.baseMutations,(e,t)=>rV(e,t))}}class rQ{constructor(e,t,r,n){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=n}static from(e,t,r){e.mutations.length===r.length||x();let n=rm,i=e.mutations;for(let e=0;e<i.length;e++)n=n.insert(i[e].key,r[e].version);return new rQ(e,t,r,n)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rW{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rJ{constructor(e,t,r){this.alias=e,this.aggregateType=t,this.fieldPath=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rY{constructor(e,t){this.count=e,this.unchangedNames=t}}function rX(e){switch(e){default:return x();case C.CANCELLED:case C.UNKNOWN:case C.DEADLINE_EXCEEDED:case C.RESOURCE_EXHAUSTED:case C.INTERNAL:case C.UNAVAILABLE:case C.UNAUTHENTICATED:return!1;case C.INVALID_ARGUMENT:case C.NOT_FOUND:case C.ALREADY_EXISTS:case C.PERMISSION_DENIED:case C.FAILED_PRECONDITION:case C.ABORTED:case C.OUT_OF_RANGE:case C.UNIMPLEMENTED:case C.DATA_LOSS:return!0}}function rZ(e){if(void 0===e)return E("GRPC error has no .code"),C.UNKNOWN;switch(e){case n.OK:return C.OK;case n.CANCELLED:return C.CANCELLED;case n.UNKNOWN:return C.UNKNOWN;case n.DEADLINE_EXCEEDED:return C.DEADLINE_EXCEEDED;case n.RESOURCE_EXHAUSTED:return C.RESOURCE_EXHAUSTED;case n.INTERNAL:return C.INTERNAL;case n.UNAVAILABLE:return C.UNAVAILABLE;case n.UNAUTHENTICATED:return C.UNAUTHENTICATED;case n.INVALID_ARGUMENT:return C.INVALID_ARGUMENT;case n.NOT_FOUND:return C.NOT_FOUND;case n.ALREADY_EXISTS:return C.ALREADY_EXISTS;case n.PERMISSION_DENIED:return C.PERMISSION_DENIED;case n.FAILED_PRECONDITION:return C.FAILED_PRECONDITION;case n.ABORTED:return C.ABORTED;case n.OUT_OF_RANGE:return C.OUT_OF_RANGE;case n.UNIMPLEMENTED:return C.UNIMPLEMENTED;case n.DATA_LOSS:return C.DATA_LOSS;default:return x()}}(i=n||(n={}))[i.OK=0]="OK",i[i.CANCELLED=1]="CANCELLED",i[i.UNKNOWN=2]="UNKNOWN",i[i.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",i[i.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",i[i.NOT_FOUND=5]="NOT_FOUND",i[i.ALREADY_EXISTS=6]="ALREADY_EXISTS",i[i.PERMISSION_DENIED=7]="PERMISSION_DENIED",i[i.UNAUTHENTICATED=16]="UNAUTHENTICATED",i[i.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",i[i.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",i[i.ABORTED=10]="ABORTED",i[i.OUT_OF_RANGE=11]="OUT_OF_RANGE",i[i.UNIMPLEMENTED=12]="UNIMPLEMENTED",i[i.INTERNAL=13]="INTERNAL",i[i.UNAVAILABLE=14]="UNAVAILABLE",i[i.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let r0=null;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function r1(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let r2=new d.Integer([4294967295,4294967295],0);function r4(e){let t=r1().encode(e),r=new d.Md5;return r.update(t),new Uint8Array(r.digest())}function r6(e){let t=new DataView(e.buffer),r=t.getUint32(0,!0),n=t.getUint32(4,!0),i=t.getUint32(8,!0),s=t.getUint32(12,!0);return[new d.Integer([r,n],0),new d.Integer([i,s],0)]}class r9{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new r5(`Invalid padding: ${t}`);if(r<0||e.length>0&&0===this.hashCount)throw new r5(`Invalid hash count: ${r}`);if(0===e.length&&0!==t)throw new r5(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=(0,d.Integer).fromNumber(this.Ie)}Ee(e,t,r){let n=e.add(t.multiply((0,d.Integer).fromNumber(r)));return 1===n.compare(r2)&&(n=new d.Integer([n.getBits(0),n.getBits(1)],0)),n.modulo(this.Te).toNumber()}de(e){return 0!=(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.Ie)return!1;let t=r4(e),[r,n]=r6(t);for(let e=0;e<this.hashCount;e++){let t=this.Ee(r,n,e);if(!this.de(t))return!1}return!0}static create(e,t,r){let n=new Uint8Array(Math.ceil(e/8)),i=new r9(n,e%8==0?0:8-e%8,t);return r.forEach(e=>i.insert(e)),i}insert(e){if(0===this.Ie)return;let t=r4(e),[r,n]=r6(t);for(let e=0;e<this.hashCount;e++){let t=this.Ee(r,n,e);this.Ae(t)}}Ae(e){this.bitmap[Math.floor(e/8)]|=1<<e%8}}class r5 extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r3{constructor(e,t,r,n,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=n,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,r){let n=new Map;return n.set(e,r8.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new r3(G.min(),n,new e0(j),rc,ry())}}class r8{constructor(e,t,r,n,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=n,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new r8(r,t,ry(),ry(),ry())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r7{constructor(e,t,r,n){this.Re=e,this.removedTargetIds=t,this.key=r,this.Ve=n}}class ne{constructor(e,t){this.targetId=e,this.me=t}}class nt{constructor(e,t,r=e7.EMPTY_BYTE_STRING,n=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=n}}class nr{constructor(){this.fe=0,this.ge=ns(),this.pe=e7.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return 0!==this.fe}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}Ce(){let e=ry(),t=ry(),r=ry();return this.ge.forEach((n,i)=>{switch(i){case 0:e=e.add(n);break;case 2:t=t.add(n);break;case 1:r=r.add(n);break;default:x()}}),new r8(this.pe,this.ye,e,t,r)}ve(){this.we=!1,this.ge=ns()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,this.fe>=0||x()}Ne(){this.we=!0,this.ye=!0}}class nn{constructor(e){this.Le=e,this.Be=new Map,this.ke=rc,this.qe=ni(),this.Qe=new e0(j)}Ke(e){for(let t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(let t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,t=>{let r=this.Ge(t);switch(e.state){case 0:this.ze(t)&&r.De(e.resumeToken);break;case 1:r.Oe(),r.Se||r.ve(),r.De(e.resumeToken);break;case 2:r.Oe(),r.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(r.Ne(),r.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),r.De(e.resumeToken));break;default:x()}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach((e,r)=>{this.ze(r)&&t(r)})}He(e){let t=e.targetId,r=e.me.count,n=this.Je(t);if(n){let i=n.target;if(tZ(i)){if(0===r){let e=new W(i.path);this.Ue(t,e,tC.newNoDocument(e,G.min()))}else 1===r||x()}else{let n=this.Ye(t);if(n!==r){let r=this.Ze(e),i=r?this.Xe(r,e,n):1;if(0!==i){this.je(t);let e=2===i?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,e)}null==r0||r0.et(function(e,t,r,n,i){var s,a,o,l,u,c;let h={localCacheCount:e,existenceFilterCount:t.count,databaseId:r.database,projectId:r.projectId},d=t.unchangedNames;return d&&(h.bloomFilter={applied:0===i,hashCount:null!==(s=null==d?void 0:d.hashCount)&&void 0!==s?s:0,bitmapLength:null!==(l=null===(o=null===(a=null==d?void 0:d.bits)||void 0===a?void 0:a.bitmap)||void 0===o?void 0:o.length)&&void 0!==l?l:0,padding:null!==(c=null===(u=null==d?void 0:d.bits)||void 0===u?void 0:u.padding)&&void 0!==c?c:0,mightContain:e=>{var t;return null!==(t=null==n?void 0:n.mightContain(e))&&void 0!==t&&t}}),h}(n,e.me,this.Le.tt(),r,i))}}}}Ze(e){let t,r;let n=e.me.unchangedNames;if(!n||!n.bits)return null;let{bits:{bitmap:i="",padding:s=0},hashCount:a=0}=n;try{t=tn(i).toUint8Array()}catch(e){if(e instanceof e3)return T("Decoding the base64 bloom filter in existence filter failed ("+e.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw e}try{r=new r9(t,s,a)}catch(e){return T(e instanceof r5?"BloomFilter error: ":"Applying bloom filter failed: ",e),null}return 0===r.Ie?null:r}Xe(e,t,r){return t.me.count===r-this.nt(e,t.targetId)?0:2}nt(e,t){let r=this.Le.getRemoteKeysForTarget(t),n=0;return r.forEach(r=>{let i=this.Le.tt(),s=`projects/${i.projectId}/databases/${i.database}/documents/${r.path.canonicalString()}`;e.mightContain(s)||(this.Ue(t,r,null),n++)}),n}rt(e){let t=new Map;this.Be.forEach((r,n)=>{let i=this.Je(n);if(i){if(r.current&&tZ(i.target)){let t=new W(i.target.path);null!==this.ke.get(t)||this.it(n,t)||this.Ue(n,t,tC.newNoDocument(t,e))}r.be&&(t.set(n,r.Ce()),r.ve())}});let r=ry();this.qe.forEach((e,t)=>{let n=!0;t.forEachWhile(e=>{let t=this.Je(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(n=!1,!1)}),n&&(r=r.add(e))}),this.ke.forEach((t,r)=>r.setReadTime(e));let n=new r3(e,t,this.Qe,this.ke,r);return this.ke=rc,this.qe=ni(),this.Qe=new e0(j),n}$e(e,t){if(!this.ze(e))return;let r=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,r),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,r){if(!this.ze(e))return;let n=this.Ge(e);this.it(e,t)?n.Fe(t,1):n.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),r&&(this.ke=this.ke.insert(t,r))}removeTarget(e){this.Be.delete(e)}Ye(e){let t=this.Ge(e).Ce();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new nr,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new e4(j),this.qe=this.qe.insert(e,t)),t}ze(e){let t=null!==this.Je(e);return t||_("WatchChangeAggregator","Detected inactive target",e),t}Je(e){let t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new nr),this.Le.getRemoteKeysForTarget(e).forEach(t=>{this.Ue(e,t,null)})}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function ni(){return new e0(W.comparator)}function ns(){return new e0(W.comparator)}let na={asc:"ASCENDING",desc:"DESCENDING"},no={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},nl={and:"AND",or:"OR"};class nu{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function nc(e,t){return e.useProto3Json||eE(t)?t:{value:t}}function nh(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function nd(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function nf(e){return e||x(),G.fromTimestamp(function(e){let t=tt(e);return new z(t.seconds,t.nanos)}(e))}function np(e,t){return nm(e,t).canonicalString()}function nm(e,t){let r=new $(["projects",e.projectId,"databases",e.database]).child("documents");return void 0===t?r:r.child(t)}function ng(e){let t=$.fromString(e);return nR(t)||x(),t}function ny(e,t){return np(e.databaseId,t.path)}function nv(e,t){let r=ng(t);if(r.get(1)!==e.databaseId.projectId)throw new D(C.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+r.get(1)+" vs "+e.databaseId.projectId);if(r.get(3)!==e.databaseId.database)throw new D(C.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+r.get(3)+" vs "+e.databaseId.database);return new W(n_(r))}function nw(e,t){return np(e.databaseId,t)}function nb(e){let t=ng(e);return 4===t.length?$.emptyPath():n_(t)}function nI(e){return new $(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function n_(e){return e.length>4&&"documents"===e.get(4)||x(),e.popFirst(5)}function nE(e,t,r){return{name:ny(e,t),fields:r.value.mapValue.fields}}function nT(e,t,r){let n=nv(e,t.name),i=nf(t.updateTime),s=t.createTime?nf(t.createTime):G.min(),a=new tA({mapValue:{fields:t.fields}}),o=tC.newFoundDocument(n,i,s,a);return r&&o.setHasCommittedMutations(),r?o.setHasCommittedMutations():o}function nS(e,t){var r;let n;if(t instanceof rB)n={update:nE(e,t.key,t.value)};else if(t instanceof rK)n={delete:ny(e,t.key)};else if(t instanceof rj)n={update:nE(e,t.key,t.data),updateMask:function(e){let t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}(t.fieldMask)};else{if(!(t instanceof r$))return x();n={verify:ny(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map(e=>(function(e,t){let r=t.transform;if(r instanceof rT)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(r instanceof rS)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:r.elements}};if(r instanceof rA)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:r.elements}};if(r instanceof rD)return{fieldPath:t.field.canonicalString(),increment:r.Pe};throw x()})(0,e))),t.precondition.isNone||(n.currentDocument=void 0!==(r=t.precondition).updateTime?{updateTime:nh(e,r.updateTime.toTimestamp())}:void 0!==r.exists?{exists:r.exists}:x()),n}function nx(e,t){var r;let n=t.currentDocument?void 0!==(r=t.currentDocument).updateTime?rP.updateTime(nf(r.updateTime)):void 0!==r.exists?rP.exists(r.exists):rP.none():rP.none(),i=t.updateTransforms?t.updateTransforms.map(t=>(function(e,t){let r=null;if("setToServerValue"in t)"REQUEST_TIME"===t.setToServerValue||x(),r=new rT;else if("appendMissingElements"in t){let e=t.appendMissingElements.values||[];r=new rS(e)}else if("removeAllFromArray"in t){let e=t.removeAllFromArray.values||[];r=new rA(e)}else"increment"in t?r=new rD(e,t.increment):x();let n=Q.fromServerFormat(t.fieldPath);return new rO(n,r)})(e,t)):[];if(t.update){t.update.name;let r=nv(e,t.update.name),s=new tA({mapValue:{fields:t.update.fields}});if(t.updateMask){let e=function(e){let t=e.fieldPaths||[];return new e5(t.map(e=>Q.fromServerFormat(e)))}(t.updateMask);return new rj(r,s,e,n,i)}return new rB(r,s,n,i)}if(t.delete){let r=nv(e,t.delete);return new rK(r,n)}if(t.verify){let r=nv(e,t.verify);return new r$(r,n)}return x()}function nA(e,t){return{documents:[nw(e,t.path)]}}function nC(e,t){var r,n;let i;let s={structuredQuery:{}},a=t.path;null!==t.collectionGroup?(i=a,s.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(i=a.popLast(),s.structuredQuery.from=[{collectionId:a.lastSegment()}]),s.parent=nw(e,i);let o=function(e){if(0!==e.length)return function e(t){return t instanceof tP?function(e){if("=="===e.op){if(tI(e.value))return{unaryFilter:{field:nk(e.field),op:"IS_NAN"}};if(tb(e.value))return{unaryFilter:{field:nk(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(tI(e.value))return{unaryFilter:{field:nk(e.field),op:"IS_NOT_NAN"}};if(tb(e.value))return{unaryFilter:{field:nk(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:nk(e.field),op:no[e.op],value:e.value}}}(t):t instanceof tL?function(t){let r=t.getFilters().map(t=>e(t));return 1===r.length?r[0]:{compositeFilter:{op:nl[t.op],filters:r}}}(t):x()}(tL.create(e,"and"))}(t.filters);o&&(s.structuredQuery.where=o);let l=function(e){if(0!==e.length)return e.map(e=>({field:nk(e.field),direction:na[e.dir]}))}(t.orderBy);l&&(s.structuredQuery.orderBy=l);let u=nc(e,t.limit);return null!==u&&(s.structuredQuery.limit=u),t.startAt&&(s.structuredQuery.startAt={before:(r=t.startAt).inclusive,values:r.position}),t.endAt&&(s.structuredQuery.endAt={before:!(n=t.endAt).inclusive,values:n.position}),{_t:s,parent:i}}function nD(e,t,r,n){let{_t:i,parent:s}=nC(e,t),a={},o=[],l=0;return r.forEach(e=>{let t=n?e.alias:"aggregate_"+l++;a[t]=e.alias,"count"===e.aggregateType?o.push({alias:t,count:{}}):"avg"===e.aggregateType?o.push({alias:t,avg:{field:nk(e.fieldPath)}}):"sum"===e.aggregateType&&o.push({alias:t,sum:{field:nk(e.fieldPath)}})}),{request:{structuredAggregationQuery:{aggregations:o,structuredQuery:i.structuredQuery},parent:i.parent},ut:a,parent:s}}function nN(e){var t,r,n,i,s,a,o,l;let u,c=nb(e.parent),h=e.structuredQuery,d=h.from?h.from.length:0,f=null;if(d>0){1===d||x();let e=h.from[0];e.allDescendants?f=e.collectionId:c=c.child(e.collectionId)}let p=[];h.where&&(p=function(e){let t=function e(t){return void 0!==t.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":let t=nO(e.unaryFilter.field);return tP.create(t,"==",{doubleValue:NaN});case"IS_NULL":let r=nO(e.unaryFilter.field);return tP.create(r,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":let n=nO(e.unaryFilter.field);return tP.create(n,"!=",{doubleValue:NaN});case"IS_NOT_NULL":let i=nO(e.unaryFilter.field);return tP.create(i,"!=",{nullValue:"NULL_VALUE"});default:return x()}}(t):void 0!==t.fieldFilter?tP.create(nO(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return x()}}(t.fieldFilter.op),t.fieldFilter.value):void 0!==t.compositeFilter?tL.create(t.compositeFilter.filters.map(t=>e(t)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return x()}}(t.compositeFilter.op)):x()}(e);return t instanceof tL&&tU(t)?t.getFilters():[t]}(h.where));let m=[];h.orderBy&&(m=h.orderBy.map(e=>new tO(nO(e.field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(e.direction))));let g=null;h.limit&&(g=eE(u="object"==typeof(t=h.limit)?t.value:t)?null:u);let y=null;h.startAt&&(y=function(e){let t=!!e.before,r=e.values||[];return new tD(r,t)}(h.startAt));let v=null;return h.endAt&&(v=function(e){let t=!e.before,r=e.values||[];return new tD(r,t)}(h.endAt)),r=c,n=f,i=m,s=p,a=g,o=y,l=v,new t4(r,n,i,s,a,"F",o,l)}function nk(e){return{fieldPath:e.canonicalString()}}function nO(e){return Q.fromServerFormat(e.fieldPath)}function nR(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nP{constructor(e,t,r,n,i=G.min(),s=G.min(),a=e7.EMPTY_BYTE_STRING,o=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=n,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=s,this.resumeToken=a,this.expectedCount=o}withSequenceNumber(e){return new nP(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new nP(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new nP(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new nP(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nL{constructor(e){this.ct=e}}function nM(e,t){let r=t.key,n={prefixPath:r.getCollectionPath().popLast().toArray(),collectionGroup:r.collectionGroup,documentId:r.path.lastSegment(),readTime:nF(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument()){var i;n.document={name:ny(i=e.ct,t.key),fields:t.data.value.mapValue.fields,updateTime:nh(i,t.version.toTimestamp()),createTime:nh(i,t.createTime.toTimestamp())}}else if(t.isNoDocument())n.noDocument={path:r.path.toArray(),readTime:nU(t.version)};else{if(!t.isUnknownDocument())return x();n.unknownDocument={path:r.path.toArray(),version:nU(t.version)}}return n}function nF(e){let t=e.toTimestamp();return[t.seconds,t.nanoseconds]}function nU(e){let t=e.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function nV(e){let t=new z(e.seconds,e.nanoseconds);return G.fromTimestamp(t)}function nB(e,t){let r=(t.baseMutations||[]).map(t=>nx(e.ct,t));for(let e=0;e<t.mutations.length-1;++e){let r=t.mutations[e];if(e+1<t.mutations.length&&void 0!==t.mutations[e+1].transform){let n=t.mutations[e+1];r.updateTransforms=n.transform.fieldTransforms,t.mutations.splice(e+1,1),++e}}let n=t.mutations.map(t=>nx(e.ct,t)),i=z.fromMillis(t.localWriteTimeMs);return new rH(t.batchId,i,r,n)}function nj(e){var t;let r;let n=nV(e.readTime),i=void 0!==e.lastLimboFreeSnapshotVersion?nV(e.lastLimboFreeSnapshotVersion):G.min();return r=void 0!==e.query.documents?(1===(t=e.query).documents.length||x(),t8(t6(nb(t.documents[0])))):t8(nN(e.query)),new nP(r,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,n,i,e7.fromBase64String(e.resumeToken))}function nq(e,t){let r;let n=nU(t.snapshotVersion),i=nU(t.lastLimboFreeSnapshotVersion);r=tZ(t.target)?nA(e.ct,t.target):nC(e.ct,t.target)._t;let s=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:tY(t.target),readTime:n,resumeToken:s,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:i,query:r}}function nz(e){let t=nN({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?rr(t,t.limit,"L"):t}function nG(e,t){return new rW(t.largestBatchId,nx(e.ct,t.overlayMutation))}function nK(e,t){let r=t.path.lastSegment();return[e,ex(t.path.popLast()),r]}function n$(e,t,r,n){return{indexId:e,uid:t,sequenceNumber:r,readTime:nU(n.readTime),documentKey:ex(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nH{getBundleMetadata(e,t){return nQ(e).get(t).next(e=>{if(e)return{id:e.bundleId,createTime:nV(e.createTime),version:e.version}})}saveBundleMetadata(e,t){return nQ(e).put({bundleId:t.id,createTime:nU(nf(t.createTime)),version:t.version})}getNamedQuery(e,t){return nW(e).get(t).next(e=>{if(e)return{name:e.name,query:nz(e.bundledQuery),readTime:nV(e.readTime)}})}saveNamedQuery(e,t){return nW(e).put({name:t.name,readTime:nU(nf(t.readTime)),bundledQuery:t.bundledQuery})}}function nQ(e){return eW(e,"bundles")}function nW(e){return eW(e,"namedQueries")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nJ{constructor(e,t){this.serializer=e,this.userId=t}static lt(e,t){let r=t.uid||"";return new nJ(e,r)}getOverlay(e,t){return nY(e).get(nK(this.userId,t)).next(e=>e?nG(this.serializer,e):null)}getOverlays(e,t){let r=rp();return eu.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&r.set(t,e)})).next(()=>r)}saveOverlays(e,t,r){let n=[];return r.forEach((r,i)=>{let s=new rW(t,i);n.push(this.ht(e,s))}),eu.waitFor(n)}removeOverlaysForBatchId(e,t,r){let n=new Set;t.forEach(e=>n.add(ex(e.getCollectionPath())));let i=[];return n.forEach(t=>{let n=IDBKeyRange.bound([this.userId,t,r],[this.userId,t,r+1],!1,!0);i.push(nY(e).j("collectionPathOverlayIndex",n))}),eu.waitFor(i)}getOverlaysForCollection(e,t,r){let n=rp(),i=ex(t),s=IDBKeyRange.bound([this.userId,i,r],[this.userId,i,Number.POSITIVE_INFINITY],!0);return nY(e).U("collectionPathOverlayIndex",s).next(e=>{for(let t of e){let e=nG(this.serializer,t);n.set(e.getKey(),e)}return n})}getOverlaysForCollectionGroup(e,t,r,n){let i;let s=rp(),a=IDBKeyRange.bound([this.userId,t,r],[this.userId,t,Number.POSITIVE_INFINITY],!0);return nY(e).J({index:"collectionGroupOverlayIndex",range:a},(e,t,r)=>{let a=nG(this.serializer,t);s.size()<n||a.largestBatchId===i?(s.set(a.getKey(),a),i=a.largestBatchId):r.done()}).next(()=>s)}ht(e,t){return nY(e).put(function(e,t,r){let[n,i,s]=nK(t,r.mutation.key);return{userId:t,collectionPath:i,documentId:s,collectionGroup:r.mutation.key.getCollectionGroup(),largestBatchId:r.largestBatchId,overlayMutation:nS(e.ct,r.mutation)}}(this.serializer,this.userId,t))}}function nY(e){return eW(e,"documentOverlays")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nX{constructor(){}Pt(e,t){this.It(e,t),t.Tt()}It(e,t){if("nullValue"in e)this.Et(t,5);else if("booleanValue"in e)this.Et(t,10),t.dt(e.booleanValue?1:0);else if("integerValue"in e)this.Et(t,15),t.dt(tr(e.integerValue));else if("doubleValue"in e){let r=tr(e.doubleValue);isNaN(r)?this.Et(t,13):(this.Et(t,15),eT(r)?t.dt(0):t.dt(r))}else if("timestampValue"in e){let r=e.timestampValue;this.Et(t,20),"string"==typeof r&&(r=tt(r)),t.At(`${r.seconds||""}`),t.dt(r.nanos||0)}else if("stringValue"in e)this.Rt(e.stringValue,t),this.Vt(t);else if("bytesValue"in e)this.Et(t,30),t.ft(tn(e.bytesValue)),this.Vt(t);else if("referenceValue"in e)this.gt(e.referenceValue,t);else if("geoPointValue"in e){let r=e.geoPointValue;this.Et(t,45),t.dt(r.latitude||0),t.dt(r.longitude||0)}else"mapValue"in e?tT(e)?this.Et(t,Number.MAX_SAFE_INTEGER):(this.yt(e.mapValue,t),this.Vt(t)):"arrayValue"in e?(this.wt(e.arrayValue,t),this.Vt(t)):x()}Rt(e,t){this.Et(t,25),this.St(e,t)}St(e,t){t.At(e)}yt(e,t){let r=e.fields||{};for(let e of(this.Et(t,55),Object.keys(r)))this.Rt(e,t),this.It(r[e],t)}wt(e,t){let r=e.values||[];for(let e of(this.Et(t,50),r))this.It(e,t)}gt(e,t){this.Et(t,37),W.fromName(e).path.forEach(e=>{this.Et(t,60),this.St(e,t)})}Et(e,t){e.dt(t)}Vt(e){e.dt(2)}}function nZ(e){let t=64-function(e){let t=0;for(let r=0;r<8;++r){let n=function(e){if(0===e)return 8;let t=0;return e>>4==0&&(t+=4,e<<=4),e>>6==0&&(t+=2,e<<=2),e>>7==0&&(t+=1),t}(255&e[r]);if(t+=n,8!==n)break}return t}(e);return Math.ceil(t/8)}nX.bt=new nX;class n0{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Dt(e){let t=e[Symbol.iterator](),r=t.next();for(;!r.done;)this.Ct(r.value),r=t.next();this.vt()}Ft(e){let t=e[Symbol.iterator](),r=t.next();for(;!r.done;)this.Mt(r.value),r=t.next();this.xt()}Ot(e){for(let t of e){let e=t.charCodeAt(0);if(e<128)this.Ct(e);else if(e<2048)this.Ct(960|e>>>6),this.Ct(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Ct(480|e>>>12),this.Ct(128|63&e>>>6),this.Ct(128|63&e);else{let e=t.codePointAt(0);this.Ct(240|e>>>18),this.Ct(128|63&e>>>12),this.Ct(128|63&e>>>6),this.Ct(128|63&e)}}this.vt()}Nt(e){for(let t of e){let e=t.charCodeAt(0);if(e<128)this.Mt(e);else if(e<2048)this.Mt(960|e>>>6),this.Mt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Mt(480|e>>>12),this.Mt(128|63&e>>>6),this.Mt(128|63&e);else{let e=t.codePointAt(0);this.Mt(240|e>>>18),this.Mt(128|63&e>>>12),this.Mt(128|63&e>>>6),this.Mt(128|63&e)}}this.xt()}Lt(e){let t=this.Bt(e),r=nZ(t);this.kt(1+r),this.buffer[this.position++]=255&r;for(let e=t.length-r;e<t.length;++e)this.buffer[this.position++]=255&t[e]}qt(e){let t=this.Bt(e),r=nZ(t);this.kt(1+r),this.buffer[this.position++]=~(255&r);for(let e=t.length-r;e<t.length;++e)this.buffer[this.position++]=~(255&t[e])}Qt(){this.Kt(255),this.Kt(255)}$t(){this.Ut(255),this.Ut(255)}reset(){this.position=0}seed(e){this.kt(e.length),this.buffer.set(e,this.position),this.position+=e.length}Wt(){return this.buffer.slice(0,this.position)}Bt(e){let t=function(e){let t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e,!1),new Uint8Array(t.buffer)}(e),r=0!=(128&t[0]);t[0]^=r?255:128;for(let e=1;e<t.length;++e)t[e]^=r?255:0;return t}Ct(e){let t=255&e;0===t?(this.Kt(0),this.Kt(255)):255===t?(this.Kt(255),this.Kt(0)):this.Kt(t)}Mt(e){let t=255&e;0===t?(this.Ut(0),this.Ut(255)):255===t?(this.Ut(255),this.Ut(0)):this.Ut(e)}vt(){this.Kt(0),this.Kt(1)}xt(){this.Ut(0),this.Ut(1)}Kt(e){this.kt(1),this.buffer[this.position++]=e}Ut(e){this.kt(1),this.buffer[this.position++]=~e}kt(e){let t=e+this.position;if(t<=this.buffer.length)return;let r=2*this.buffer.length;r<t&&(r=t);let n=new Uint8Array(r);n.set(this.buffer),this.buffer=n}}class n1{constructor(e){this.Gt=e}ft(e){this.Gt.Dt(e)}At(e){this.Gt.Ot(e)}dt(e){this.Gt.Lt(e)}Tt(){this.Gt.Qt()}}class n2{constructor(e){this.Gt=e}ft(e){this.Gt.Ft(e)}At(e){this.Gt.Nt(e)}dt(e){this.Gt.qt(e)}Tt(){this.Gt.$t()}}class n4{constructor(){this.Gt=new n0,this.zt=new n1(this.Gt),this.jt=new n2(this.Gt)}seed(e){this.Gt.seed(e)}Ht(e){return 0===e?this.zt:this.jt}Wt(){return this.Gt.Wt()}reset(){this.Gt.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n6{constructor(e,t,r,n){this.indexId=e,this.documentKey=t,this.arrayValue=r,this.directionalValue=n}Jt(){let e=this.directionalValue.length,t=0===e||255===this.directionalValue[e-1]?e+1:e,r=new Uint8Array(t);return r.set(this.directionalValue,0),t!==e?r.set([0],this.directionalValue.length):++r[r.length-1],new n6(this.indexId,this.documentKey,this.arrayValue,r)}}function n9(e,t){let r=e.indexId-t.indexId;return 0!==r?r:0!==(r=n5(e.arrayValue,t.arrayValue))?r:0!==(r=n5(e.directionalValue,t.directionalValue))?r:W.comparator(e.documentKey,t.documentKey)}function n5(e,t){for(let r=0;r<e.length&&r<t.length;++r){let n=e[r]-t[r];if(0!==n)return n}return e.length-t.length}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n3{constructor(e){for(let t of(this.Yt=new e4((e,t)=>Q.comparator(e.field,t.field)),this.collectionId=null!=e.collectionGroup?e.collectionGroup:e.path.lastSegment(),this.Zt=e.orderBy,this.Xt=[],e.filters))t.isInequality()?this.Yt=this.Yt.add(t):this.Xt.push(t)}get en(){return this.Yt.size>1}tn(e){if(e.collectionGroup===this.collectionId||x(),this.en)return!1;let t=Y(e);if(void 0!==t&&!this.nn(t))return!1;let r=X(e),n=new Set,i=0,s=0;for(;i<r.length&&this.nn(r[i]);++i)n=n.add(r[i].fieldPath.canonicalString());if(i===r.length)return!0;if(this.Yt.size>0){let e=this.Yt.getIterator().getNext();if(!n.has(e.field.canonicalString())){let t=r[i];if(!this.rn(e,t)||!this.sn(this.Zt[s++],t))return!1}++i}for(;i<r.length;++i){let e=r[i];if(s>=this.Zt.length||!this.sn(this.Zt[s++],e))return!1}return!0}on(){if(this.en)return null;let e=new e4(Q.comparator),t=[];for(let r of this.Xt)if(!r.field.isKeyField()){if("array-contains"===r.op||"array-contains-any"===r.op)t.push(new ee(r.field,2));else{if(e.has(r.field))continue;e=e.add(r.field),t.push(new ee(r.field,0))}}for(let r of this.Zt)r.field.isKeyField()||e.has(r.field)||(e=e.add(r.field),t.push(new ee(r.field,"asc"===r.dir?0:1)));return new J(J.UNKNOWN_ID,this.collectionId,t,et.empty())}nn(e){for(let t of this.Xt)if(this.rn(t,e))return!0;return!1}rn(e,t){if(void 0===e||!e.field.isEqual(t.fieldPath))return!1;let r="array-contains"===e.op||"array-contains-any"===e.op;return 2===t.kind===r}sn(e,t){return!!e.field.isEqual(t.fieldPath)&&(0===t.kind&&"asc"===e.dir||1===t.kind&&"desc"===e.dir)}}function n8(e){return e instanceof tP}function n7(e){return e instanceof tL&&tU(e)}function ie(e){return n8(e)||n7(e)||function(e){if(e instanceof tL&&tF(e)){for(let t of e.getFilters())if(!n8(t)&&!n7(t))return!1;return!0}return!1}(e)}function it(e,t){return e instanceof tP||e instanceof tL||x(),t instanceof tP||t instanceof tL||x(),ii(e instanceof tP?t instanceof tP?tL.create([e,t],"and"):ir(e,t):t instanceof tP?ir(t,e):function(e,t){if(e.filters.length>0&&t.filters.length>0||x(),tM(e)&&tM(t))return tB(e,t.getFilters());let r=tF(e)?e:t,n=tF(e)?t:e,i=r.filters.map(e=>it(e,n));return tL.create(i,"or")}(e,t))}function ir(e,t){if(tM(t))return tB(t,e.getFilters());{let r=t.filters.map(t=>it(e,t));return tL.create(r,"or")}}function ii(e){if(e instanceof tP||e instanceof tL||x(),e instanceof tP)return e;let t=e.getFilters();if(1===t.length)return ii(t[0]);if(tV(e))return e;let r=t.map(e=>ii(e)),n=[];return r.forEach(t=>{t instanceof tP?n.push(t):t instanceof tL&&(t.op===e.op?n.push(...t.filters):n.push(t))}),1===n.length?n[0]:tL.create(n,e.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class is{constructor(){this._n=new ia}addToCollectionParentIndex(e,t){return this._n.add(t),eu.resolve()}getCollectionParents(e,t){return eu.resolve(this._n.getEntries(t))}addFieldIndex(e,t){return eu.resolve()}deleteFieldIndex(e,t){return eu.resolve()}deleteAllFieldIndexes(e){return eu.resolve()}createTargetIndexes(e,t){return eu.resolve()}getDocumentsMatchingTarget(e,t){return eu.resolve(null)}getIndexType(e,t){return eu.resolve(0)}getFieldIndexes(e,t){return eu.resolve([])}getNextCollectionGroupToUpdate(e){return eu.resolve(null)}getMinOffset(e,t){return eu.resolve(ei.min())}getMinOffsetFromCollectionGroup(e,t){return eu.resolve(ei.min())}updateCollectionGroup(e,t,r){return eu.resolve()}updateIndexEntries(e,t){return eu.resolve()}}class ia{constructor(){this.index={}}add(e){let t=e.lastSegment(),r=e.popLast(),n=this.index[t]||new e4($.comparator),i=!n.has(r);return this.index[t]=n.add(r),i}has(e){let t=e.lastSegment(),r=e.popLast(),n=this.index[t];return n&&n.has(r)}getEntries(e){return(this.index[e]||new e4($.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let io=new Uint8Array(0);class il{constructor(e,t){this.databaseId=t,this.an=new ia,this.un=new ru(e=>tY(e),(e,t)=>tX(e,t)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.an.has(t)){let r=t.lastSegment(),n=t.popLast();e.addOnCommittedListener(()=>{this.an.add(t)});let i={collectionId:r,parent:ex(n)};return iu(e).put(i)}return eu.resolve()}getCollectionParents(e,t){let r=[],n=IDBKeyRange.bound([t,""],[t+"\x00",""],!1,!0);return iu(e).U(n).next(e=>{for(let n of e){if(n.collectionId!==t)break;r.push(eA(n.parent))}return r})}addFieldIndex(e,t){let r=ih(e),n={indexId:t.indexId,collectionGroup:t.collectionGroup,fields:t.fields.map(e=>[e.fieldPath.canonicalString(),e.kind])};delete n.indexId;let i=r.add(n);if(t.indexState){let r=id(e);return i.next(e=>{r.put(n$(e,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return i.next()}deleteFieldIndex(e,t){let r=ih(e),n=id(e),i=ic(e);return r.delete(t.indexId).next(()=>n.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){let t=ih(e),r=ic(e),n=id(e);return t.j().next(()=>r.j()).next(()=>n.j())}createTargetIndexes(e,t){return eu.forEach(this.cn(t),t=>this.getIndexType(e,t).next(r=>{if(0===r||1===r){let r=new n3(t).on();if(null!=r)return this.addFieldIndex(e,r)}}))}getDocumentsMatchingTarget(e,t){let r=ic(e),n=!0,i=new Map;return eu.forEach(this.cn(t),t=>this.ln(e,t).next(e=>{n&&(n=!!e),i.set(t,e)})).next(()=>{if(n){let e=ry(),n=[];return eu.forEach(i,(i,s)=>{_("IndexedDbIndexManager",`Using index id=${i.indexId}|cg=${i.collectionGroup}|f=${i.fields.map(e=>`${e.fieldPath}:${e.kind}`).join(",")} to execute ${tY(t)}`);let a=function(e,t){let r=Y(t);if(void 0===r)return null;for(let t of t0(e,r.fieldPath))switch(t.op){case"array-contains-any":return t.value.arrayValue.values||[];case"array-contains":return[t.value]}return null}(s,i),o=function(e,t){let r=new Map;for(let n of X(t))for(let t of t0(e,n.fieldPath))switch(t.op){case"==":case"in":r.set(n.fieldPath.canonicalString(),t.value);break;case"not-in":case"!=":return r.set(n.fieldPath.canonicalString(),t.value),Array.from(r.values())}return null}(s,i),l=function(e,t){let r=[],n=!0;for(let i of X(t)){let t=0===i.kind?t1(e,i.fieldPath,e.startAt):t2(e,i.fieldPath,e.startAt);r.push(t.value),n&&(n=t.inclusive)}return new tD(r,n)}(s,i),u=function(e,t){let r=[],n=!0;for(let i of X(t)){let t=0===i.kind?t2(e,i.fieldPath,e.endAt):t1(e,i.fieldPath,e.endAt);r.push(t.value),n&&(n=t.inclusive)}return new tD(r,n)}(s,i),c=this.hn(i,s,l),h=this.hn(i,s,u),d=this.Pn(i,s,o),f=this.In(i.indexId,a,c,l.inclusive,h,u.inclusive,d);return eu.forEach(f,i=>r.G(i,t.limit).next(t=>{t.forEach(t=>{let r=W.fromSegments(t.documentKey);e.has(r)||(e=e.add(r),n.push(r))})}))}).next(()=>n)}return eu.resolve(null)})}cn(e){let t=this.un.get(e);return t||(t=0===e.filters.length?[e]:(function(e){if(0===e.getFilters().length)return[];let t=function e(t){if(t instanceof tP||t instanceof tL||x(),t instanceof tP)return t;if(1===t.filters.length)return e(t.filters[0]);let r=t.filters.map(t=>e(t)),n=tL.create(r,t.op);return ie(n=ii(n))?n:(n instanceof tL||x(),tM(n)||x(),n.filters.length>1||x(),n.filters.reduce((e,t)=>it(e,t)))}(/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function e(t){var r,n;if(t instanceof tP||t instanceof tL||x(),t instanceof tP){if(t instanceof t$){let e=(null===(n=null===(r=t.value.arrayValue)||void 0===r?void 0:r.values)||void 0===n?void 0:n.map(e=>tP.create(t.field,"==",e)))||[];return tL.create(e,"or")}return t}let i=t.filters.map(t=>e(t));return tL.create(i,t.op)}(e));return ie(t)||x(),n8(t)||n7(t)?[t]:t.getFilters()})(tL.create(e.filters,"and")).map(t=>tJ(e.path,e.collectionGroup,e.orderBy,t.getFilters(),e.limit,e.startAt,e.endAt)),this.un.set(e,t)),t}In(e,t,r,n,i,s,a){let o=(null!=t?t.length:1)*Math.max(r.length,i.length),l=o/(null!=t?t.length:1),u=[];for(let c=0;c<o;++c){let o=t?this.Tn(t[c/l]):io,h=this.En(e,o,r[c%l],n),d=this.dn(e,o,i[c%l],s),f=a.map(t=>this.En(e,o,t,!0));u.push(...this.createRange(h,d,f))}return u}En(e,t,r,n){let i=new n6(e,W.empty(),t,r);return n?i:i.Jt()}dn(e,t,r,n){let i=new n6(e,W.empty(),t,r);return n?i.Jt():i}ln(e,t){let r=new n3(t),n=null!=t.collectionGroup?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,n).next(e=>{let t=null;for(let n of e)r.tn(n)&&(!t||n.fields.length>t.fields.length)&&(t=n);return t})}getIndexType(e,t){let r=2,n=this.cn(t);return eu.forEach(n,t=>this.ln(e,t).next(e=>{e?0!==r&&e.fields.length<function(e){let t=new e4(Q.comparator),r=!1;for(let n of e.filters)for(let e of n.getFlattenedFilters())e.field.isKeyField()||("array-contains"===e.op||"array-contains-any"===e.op?r=!0:t=t.add(e.field));for(let r of e.orderBy)r.field.isKeyField()||(t=t.add(r.field));return t.size+(r?1:0)}(t)&&(r=1):r=0})).next(()=>null!==t.limit&&n.length>1&&2===r?1:r)}An(e,t){let r=new n4;for(let n of X(e)){let e=t.data.field(n.fieldPath);if(null==e)return null;let i=r.Ht(n.kind);nX.bt.Pt(e,i)}return r.Wt()}Tn(e){let t=new n4;return nX.bt.Pt(e,t.Ht(0)),t.Wt()}Rn(e,t){let r=new n4;return nX.bt.Pt(ty(this.databaseId,t),r.Ht(function(e){let t=X(e);return 0===t.length?0:t[t.length-1].kind}(e))),r.Wt()}Pn(e,t,r){if(null===r)return[];let n=[];n.push(new n4);let i=0;for(let s of X(e)){let e=r[i++];for(let r of n)if(this.Vn(t,s.fieldPath)&&tw(e))n=this.mn(n,s,e);else{let t=r.Ht(s.kind);nX.bt.Pt(e,t)}}return this.fn(n)}hn(e,t,r){return this.Pn(e,t,r.position)}fn(e){let t=[];for(let r=0;r<e.length;++r)t[r]=e[r].Wt();return t}mn(e,t,r){let n=[...e],i=[];for(let e of r.arrayValue.values||[])for(let r of n){let n=new n4;n.seed(r.Wt()),nX.bt.Pt(e,n.Ht(t.kind)),i.push(n)}return i}Vn(e,t){return!!e.filters.find(e=>e instanceof tP&&e.field.isEqual(t)&&("in"===e.op||"not-in"===e.op))}getFieldIndexes(e,t){let r=ih(e),n=id(e);return(t?r.U("collectionGroupIndex",IDBKeyRange.bound(t,t)):r.U()).next(e=>{let t=[];return eu.forEach(e,e=>n.get([e.indexId,this.uid]).next(r=>{t.push(function(e,t){let r=t?new et(t.sequenceNumber,new ei(nV(t.readTime),new W(eA(t.documentKey)),t.largestBatchId)):et.empty(),n=e.fields.map(([e,t])=>new ee(Q.fromServerFormat(e),t));return new J(e.indexId,e.collectionGroup,n,r)}(e,r))})).next(()=>t)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(e=>0===e.length?null:(e.sort((e,t)=>{let r=e.indexState.sequenceNumber-t.indexState.sequenceNumber;return 0!==r?r:j(e.collectionGroup,t.collectionGroup)}),e[0].collectionGroup))}updateCollectionGroup(e,t,r){let n=ih(e),i=id(e);return this.gn(e).next(e=>n.U("collectionGroupIndex",IDBKeyRange.bound(t,t)).next(t=>eu.forEach(t,t=>i.put(n$(t.indexId,this.uid,e,r)))))}updateIndexEntries(e,t){let r=new Map;return eu.forEach(t,(t,n)=>{let i=r.get(t.collectionGroup);return(i?eu.resolve(i):this.getFieldIndexes(e,t.collectionGroup)).next(i=>(r.set(t.collectionGroup,i),eu.forEach(i,r=>this.pn(e,t,r).next(t=>{let i=this.yn(n,r);return t.isEqual(i)?eu.resolve():this.wn(e,n,r,t,i)}))))})}Sn(e,t,r,n){return ic(e).put({indexId:n.indexId,uid:this.uid,arrayValue:n.arrayValue,directionalValue:n.directionalValue,orderedDocumentKey:this.Rn(r,t.key),documentKey:t.key.path.toArray()})}bn(e,t,r,n){return ic(e).delete([n.indexId,this.uid,n.arrayValue,n.directionalValue,this.Rn(r,t.key),t.key.path.toArray()])}pn(e,t,r){let n=ic(e),i=new e4(n9);return n.J({index:"documentKeyIndex",range:IDBKeyRange.only([r.indexId,this.uid,this.Rn(r,t)])},(e,n)=>{i=i.add(new n6(r.indexId,t,n.arrayValue,n.directionalValue))}).next(()=>i)}yn(e,t){let r=new e4(n9),n=this.An(t,e);if(null==n)return r;let i=Y(t);if(null!=i){let s=e.data.field(i.fieldPath);if(tw(s))for(let i of s.arrayValue.values||[])r=r.add(new n6(t.indexId,e.key,this.Tn(i),n))}else r=r.add(new n6(t.indexId,e.key,io,n));return r}wn(e,t,r,n,i){_("IndexedDbIndexManager","Updating index entries for document '%s'",t.key);let s=[];return function(e,t,r,n,i){let s=e.getIterator(),a=t.getIterator(),o=e9(s),l=e9(a);for(;o||l;){let e=!1,t=!1;if(o&&l){let n=r(o,l);n<0?t=!0:n>0&&(e=!0)}else null!=o?t=!0:e=!0;e?(n(l),l=e9(a)):t?(i(o),o=e9(s)):(o=e9(s),l=e9(a))}}(n,i,n9,n=>{s.push(this.Sn(e,t,r,n))},n=>{s.push(this.bn(e,t,r,n))}),eu.waitFor(s)}gn(e){let t=1;return id(e).J({index:"sequenceNumberIndex",reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(e,r,n)=>{n.done(),t=r.sequenceNumber+1}).next(()=>t)}createRange(e,t,r){r=r.sort((e,t)=>n9(e,t)).filter((e,t,r)=>!t||0!==n9(e,r[t-1]));let n=[];for(let i of(n.push(e),r)){let r=n9(i,e),s=n9(i,t);if(0===r)n[0]=e.Jt();else if(r>0&&s<0)n.push(i),n.push(i.Jt());else if(s>0)break}n.push(t);let i=[];for(let e=0;e<n.length;e+=2){if(this.Dn(n[e],n[e+1]))return[];let t=[n[e].indexId,this.uid,n[e].arrayValue,n[e].directionalValue,io,[]],r=[n[e+1].indexId,this.uid,n[e+1].arrayValue,n[e+1].directionalValue,io,[]];i.push(IDBKeyRange.bound(t,r))}return i}Dn(e,t){return n9(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(ip)}getMinOffset(e,t){return eu.mapArray(this.cn(t),t=>this.ln(e,t).next(e=>e||x())).next(ip)}}function iu(e){return eW(e,"collectionParents")}function ic(e){return eW(e,"indexEntries")}function ih(e){return eW(e,"indexConfiguration")}function id(e){return eW(e,"indexState")}function ip(e){0!==e.length||x();let t=e[0].indexState.offset,r=t.largestBatchId;for(let n=1;n<e.length;n++){let i=e[n].indexState.offset;0>es(i,t)&&(t=i),r<i.largestBatchId&&(r=i.largestBatchId)}return new ei(t.readTime,t.documentKey,r)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let im={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class ig{constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}static withCacheSize(e){return new ig(e,ig.DEFAULT_COLLECTION_PERCENTILE,ig.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iy(e,t,r){let n=e.store("mutations"),i=e.store("documentMutations"),s=[],a=IDBKeyRange.only(r.batchId),o=0,l=n.J({range:a},(e,t,r)=>(o++,r.delete()));s.push(l.next(()=>{1===o||x()}));let u=[];for(let e of r.mutations){var c,h;let n=(c=e.key.path,h=r.batchId,[t,ex(c),h]);s.push(i.delete(n)),u.push(e.key)}return eu.waitFor(s).next(()=>u)}function iv(e){let t;if(!e)return 0;if(e.document)t=e.document;else if(e.unknownDocument)t=e.unknownDocument;else{if(!e.noDocument)throw x();t=e.noDocument}return JSON.stringify(t).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ig.DEFAULT_COLLECTION_PERCENTILE=10,ig.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,ig.DEFAULT=new ig(41943040,ig.DEFAULT_COLLECTION_PERCENTILE,ig.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),ig.DISABLED=new ig(-1,0,0);class iw{constructor(e,t,r,n){this.userId=e,this.serializer=t,this.indexManager=r,this.referenceDelegate=n,this.Cn={}}static lt(e,t,r,n){""!==e.uid||x();let i=e.isAuthenticated()?e.uid:"";return new iw(i,t,r,n)}checkEmpty(e){let t=!0,r=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return iI(e).J({index:"userMutationsIndex",range:r},(e,r,n)=>{t=!1,n.done()}).next(()=>t)}addMutationBatch(e,t,r,n){let i=i_(e),s=iI(e);return s.add({}).next(a=>{"number"==typeof a||x();let o=new rH(a,t,r,n),l=function(e,t,r){let n=r.baseMutations.map(t=>nS(e.ct,t)),i=r.mutations.map(t=>nS(e.ct,t));return{userId:t,batchId:r.batchId,localWriteTimeMs:r.localWriteTime.toMillis(),baseMutations:n,mutations:i}}(this.serializer,this.userId,o),u=[],c=new e4((e,t)=>j(e.canonicalString(),t.canonicalString()));for(let e of n){let t=[this.userId,ex(e.key.path),a];c=c.add(e.key.path.popLast()),u.push(s.put(l)),u.push(i.put(t,eD))}return c.forEach(t=>{u.push(this.indexManager.addToCollectionParentIndex(e,t))}),e.addOnCommittedListener(()=>{this.Cn[a]=o.keys()}),eu.waitFor(u).next(()=>o)})}lookupMutationBatch(e,t){return iI(e).get(t).next(e=>e?(e.userId===this.userId||x(),nB(this.serializer,e)):null)}vn(e,t){return this.Cn[t]?eu.resolve(this.Cn[t]):this.lookupMutationBatch(e,t).next(e=>{if(e){let r=e.keys();return this.Cn[t]=r,r}return null})}getNextMutationBatchAfterBatchId(e,t){let r=t+1,n=IDBKeyRange.lowerBound([this.userId,r]),i=null;return iI(e).J({index:"userMutationsIndex",range:n},(e,t,n)=>{t.userId===this.userId&&(t.batchId>=r||x(),i=nB(this.serializer,t)),n.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(e){let t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]),r=-1;return iI(e).J({index:"userMutationsIndex",range:t,reverse:!0},(e,t,n)=>{r=t.batchId,n.done()}).next(()=>r)}getAllMutationBatches(e){let t=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return iI(e).U("userMutationsIndex",t).next(e=>e.map(e=>nB(this.serializer,e)))}getAllMutationBatchesAffectingDocumentKey(e,t){let r=[this.userId,ex(t.path)],n=IDBKeyRange.lowerBound(r),i=[];return i_(e).J({range:n},(r,n,s)=>{let[a,o,l]=r,u=eA(o);if(a===this.userId&&t.path.isEqual(u))return iI(e).get(l).next(e=>{if(!e)throw x();e.userId===this.userId||x(),i.push(nB(this.serializer,e))});s.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new e4(j),n=[];return t.forEach(t=>{let i=[this.userId,ex(t.path)],s=IDBKeyRange.lowerBound(i),a=i_(e).J({range:s},(e,n,i)=>{let[s,a,o]=e,l=eA(a);s===this.userId&&t.path.isEqual(l)?r=r.add(o):i.done()});n.push(a)}),eu.waitFor(n).next(()=>this.Fn(e,r))}getAllMutationBatchesAffectingQuery(e,t){let r=t.path,n=r.length+1,i=[this.userId,ex(r)],s=IDBKeyRange.lowerBound(i),a=new e4(j);return i_(e).J({range:s},(e,t,i)=>{let[s,o,l]=e,u=eA(o);s===this.userId&&r.isPrefixOf(u)?u.length===n&&(a=a.add(l)):i.done()}).next(()=>this.Fn(e,a))}Fn(e,t){let r=[],n=[];return t.forEach(t=>{n.push(iI(e).get(t).next(e=>{if(null===e)throw x();e.userId===this.userId||x(),r.push(nB(this.serializer,e))}))}),eu.waitFor(n).next(()=>r)}removeMutationBatch(e,t){return iy(e._e,this.userId,t).next(r=>(e.addOnCommittedListener(()=>{this.Mn(t.batchId)}),eu.forEach(r,t=>this.referenceDelegate.markPotentiallyOrphaned(e,t))))}Mn(e){delete this.Cn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return eu.resolve();let r=IDBKeyRange.lowerBound([this.userId]),n=[];return i_(e).J({range:r},(e,t,r)=>{if(e[0]===this.userId){let t=eA(e[1]);n.push(t)}else r.done()}).next(()=>{0===n.length||x()})})}containsKey(e,t){return ib(e,this.userId,t)}xn(e){return iE(e).get(this.userId).next(e=>e||{userId:this.userId,lastAcknowledgedBatchId:-1,lastStreamToken:""})}}function ib(e,t,r){let n=[t,ex(r.path)],i=n[1],s=IDBKeyRange.lowerBound(n),a=!1;return i_(e).J({range:s,H:!0},(e,r,n)=>{let[s,o,l]=e;s===t&&o===i&&(a=!0),n.done()}).next(()=>a)}function iI(e){return eW(e,"mutations")}function i_(e){return eW(e,"documentMutations")}function iE(e){return eW(e,"mutationQueues")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iT{constructor(e){this.On=e}next(){return this.On+=2,this.On}static Nn(){return new iT(0)}static Ln(){return new iT(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iS{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.Bn(e).next(t=>{let r=new iT(t.highestTargetId);return t.highestTargetId=r.next(),this.kn(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.Bn(e).next(e=>G.fromTimestamp(new z(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.Bn(e).next(e=>e.highestListenSequenceNumber)}setTargetsMetadata(e,t,r){return this.Bn(e).next(n=>(n.highestListenSequenceNumber=t,r&&(n.lastRemoteSnapshotVersion=r.toTimestamp()),t>n.highestListenSequenceNumber&&(n.highestListenSequenceNumber=t),this.kn(e,n)))}addTargetData(e,t){return this.qn(e,t).next(()=>this.Bn(e).next(r=>(r.targetCount+=1,this.Qn(t,r),this.kn(e,r))))}updateTargetData(e,t){return this.qn(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>ix(e).delete(t.targetId)).next(()=>this.Bn(e)).next(t=>(t.targetCount>0||x(),t.targetCount-=1,this.kn(e,t)))}removeTargets(e,t,r){let n=0,i=[];return ix(e).J((s,a)=>{let o=nj(a);o.sequenceNumber<=t&&null===r.get(o.targetId)&&(n++,i.push(this.removeTargetData(e,o)))}).next(()=>eu.waitFor(i)).next(()=>n)}forEachTarget(e,t){return ix(e).J((e,r)=>{let n=nj(r);t(n)})}Bn(e){return iA(e).get("targetGlobalKey").next(e=>(null!==e||x(),e))}kn(e,t){return iA(e).put("targetGlobalKey",t)}qn(e,t){return ix(e).put(nq(this.serializer,t))}Qn(e,t){let r=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,r=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,r=!0),r}getTargetCount(e){return this.Bn(e).next(e=>e.targetCount)}getTargetData(e,t){let r=tY(t),n=IDBKeyRange.bound([r,Number.NEGATIVE_INFINITY],[r,Number.POSITIVE_INFINITY]),i=null;return ix(e).J({range:n,index:"queryTargetsIndex"},(e,r,n)=>{let s=nj(r);tX(t,s.target)&&(i=s,n.done())}).next(()=>i)}addMatchingKeys(e,t,r){let n=[],i=iC(e);return t.forEach(t=>{let s=ex(t.path);n.push(i.put({targetId:r,path:s})),n.push(this.referenceDelegate.addReference(e,r,t))}),eu.waitFor(n)}removeMatchingKeys(e,t,r){let n=iC(e);return eu.forEach(t,t=>{let i=ex(t.path);return eu.waitFor([n.delete([r,i]),this.referenceDelegate.removeReference(e,r,t)])})}removeMatchingKeysForTargetId(e,t){let r=iC(e),n=IDBKeyRange.bound([t],[t+1],!1,!0);return r.delete(n)}getMatchingKeysForTargetId(e,t){let r=IDBKeyRange.bound([t],[t+1],!1,!0),n=iC(e),i=ry();return n.J({range:r,H:!0},(e,t,r)=>{let n=eA(e[1]),s=new W(n);i=i.add(s)}).next(()=>i)}containsKey(e,t){let r=ex(t.path),n=IDBKeyRange.bound([r],[r+"\x00"],!1,!0),i=0;return iC(e).J({index:"documentTargetsIndex",H:!0,range:n},([e,t],r,n)=>{0!==e&&(i++,n.done())}).next(()=>i>0)}ot(e,t){return ix(e).get(t).next(e=>e?nj(e):null)}}function ix(e){return eW(e,"targets")}function iA(e){return eW(e,"targetGlobal")}function iC(e){return eW(e,"targetDocuments")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iD([e,t],[r,n]){let i=j(e,r);return 0===i?j(t,n):i}class iN{constructor(e){this.Kn=e,this.buffer=new e4(iD),this.$n=0}Un(){return++this.$n}Wn(e){let t=[e,this.Un()];if(this.buffer.size<this.Kn)this.buffer=this.buffer.add(t);else{let e=this.buffer.last();0>iD(t,e)&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}}class ik{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Gn=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.zn(6e4)}stop(){this.Gn&&(this.Gn.cancel(),this.Gn=null)}get started(){return null!==this.Gn}zn(e){_("LruGarbageCollector",`Garbage collection scheduled in ${e}ms`),this.Gn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Gn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){em(e)?_("LruGarbageCollector","Ignoring IndexedDB error during garbage collection: ",e):await el(e)}await this.zn(3e5)})}}class iO{constructor(e,t){this.jn=e,this.params=t}calculateTargetCount(e,t){return this.jn.Hn(e).next(e=>Math.floor(t/100*e))}nthSequenceNumber(e,t){if(0===t)return eu.resolve(e_.oe);let r=new iN(t);return this.jn.forEachTarget(e,e=>r.Wn(e.sequenceNumber)).next(()=>this.jn.Jn(e,e=>r.Wn(e))).next(()=>r.maxValue)}removeTargets(e,t,r){return this.jn.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.jn.removeOrphanedDocuments(e,t)}collect(e,t){return -1===this.params.cacheSizeCollectionThreshold?(_("LruGarbageCollector","Garbage collection skipped; disabled"),eu.resolve(im)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(_("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),im):this.Yn(e,t))}getCacheSize(e){return this.jn.getCacheSize(e)}Yn(e,t){let r,n,i,s,a,o,l;let u=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(t=>(t>this.params.maximumSequenceNumbersToCollect?(_("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),n=this.params.maximumSequenceNumbersToCollect):n=t,s=Date.now(),this.nthSequenceNumber(e,n))).next(n=>(r=n,a=Date.now(),this.removeTargets(e,r,t))).next(t=>(i=t,o=Date.now(),this.removeOrphanedDocuments(e,r))).next(e=>(l=Date.now(),b()<=c.LogLevel.DEBUG&&_("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${s-u}ms
	Determined least recently used ${n} in `+(a-s)+"ms\n"+`	Removed ${i} targets in `+(o-a)+"ms\n"+`	Removed ${e} documents in `+(l-o)+"ms\n"+`Total Duration: ${l-u}ms`),eu.resolve({didRun:!0,sequenceNumbersCollected:n,targetsRemoved:i,documentsRemoved:e})))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iR{constructor(e,t){this.db=e,this.garbageCollector=new iO(this,t)}Hn(e){let t=this.Zn(e);return this.db.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}Zn(e){let t=0;return this.Jn(e,e=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}Jn(e,t){return this.Xn(e,(e,r)=>t(r))}addReference(e,t,r){return iP(e,r)}removeReference(e,t,r){return iP(e,r)}removeTargets(e,t,r){return this.db.getTargetCache().removeTargets(e,t,r)}markPotentiallyOrphaned(e,t){return iP(e,t)}er(e,t){let r;return r=!1,iE(e).Y(n=>ib(e,n,t).next(e=>(e&&(r=!0),eu.resolve(!e)))).next(()=>r)}removeOrphanedDocuments(e,t){let r=this.db.getRemoteDocumentCache().newChangeBuffer(),n=[],i=0;return this.Xn(e,(s,a)=>{if(a<=t){let t=this.er(e,s).next(t=>{if(!t)return i++,r.getEntry(e,s).next(()=>(r.removeEntry(s,G.min()),iC(e).delete([0,ex(s.path)])))});n.push(t)}}).next(()=>eu.waitFor(n)).next(()=>r.apply(e)).next(()=>i)}removeTarget(e,t){let r=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,r)}updateLimboDocument(e,t){return iP(e,t)}Xn(e,t){let r=iC(e),n,i=e_.oe;return r.J({index:"documentTargetsIndex"},([e,r],{path:s,sequenceNumber:a})=>{0===e?(i!==e_.oe&&t(new W(eA(n)),i),i=a,n=s):i=e_.oe}).next(()=>{i!==e_.oe&&t(new W(eA(n)),i)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function iP(e,t){var r;return iC(e).put((r=e.currentSequenceNumber,{targetId:0,path:ex(t.path),sequenceNumber:r}))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iL{constructor(){this.changes=new ru(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,tC.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let r=this.changes.get(t);return void 0!==r?eu.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iM{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,r){return iV(e).put(r)}removeEntry(e,t,r){return iV(e).delete(function(e,t){let r=e.path.toArray();return[r.slice(0,r.length-2),r[r.length-2],nF(t),r[r.length-1]]}(t,r))}updateMetadata(e,t){return this.getMetadata(e).next(r=>(r.byteSize+=t,this.tr(e,r)))}getEntry(e,t){let r=tC.newInvalidDocument(t);return iV(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(iB(t))},(e,n)=>{r=this.nr(t,n)}).next(()=>r)}rr(e,t){let r={size:0,document:tC.newInvalidDocument(t)};return iV(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(iB(t))},(e,n)=>{r={document:this.nr(t,n),size:iv(n)}}).next(()=>r)}getEntries(e,t){let r=rc;return this.ir(e,t,(e,t)=>{let n=this.nr(e,t);r=r.insert(e,n)}).next(()=>r)}sr(e,t){let r=rc,n=new e0(W.comparator);return this.ir(e,t,(e,t)=>{let i=this.nr(e,t);r=r.insert(e,i),n=n.insert(e,iv(t))}).next(()=>({documents:r,_r:n}))}ir(e,t,r){if(t.isEmpty())return eu.resolve();let n=new e4(iq);t.forEach(e=>n=n.add(e));let i=IDBKeyRange.bound(iB(n.first()),iB(n.last())),s=n.getIterator(),a=s.getNext();return iV(e).J({index:"documentKeyIndex",range:i},(e,t,n)=>{let i=W.fromSegments([...t.prefixPath,t.collectionGroup,t.documentId]);for(;a&&0>iq(a,i);)r(a,null),a=s.getNext();a&&a.isEqual(i)&&(r(a,t),a=s.hasNext()?s.getNext():null),a?n.$(iB(a)):n.done()}).next(()=>{for(;a;)r(a,null),a=s.hasNext()?s.getNext():null})}getDocumentsMatchingQuery(e,t,r,n,i){let s=t.path,a=[s.popLast().toArray(),s.lastSegment(),nF(r.readTime),r.documentKey.path.isEmpty()?"":r.documentKey.path.lastSegment()],o=[s.popLast().toArray(),s.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return iV(e).U(IDBKeyRange.bound(a,o,!0)).next(e=>{null==i||i.incrementDocumentReadCount(e.length);let r=rc;for(let i of e){let e=this.nr(W.fromSegments(i.prefixPath.concat(i.collectionGroup,i.documentId)),i);e.isFoundDocument()&&(ra(t,e)||n.has(e.key))&&(r=r.insert(e.key,e))}return r})}getAllFromCollectionGroup(e,t,r,n){let i=rc,s=ij(t,r),a=ij(t,ei.max());return iV(e).J({index:"collectionGroupIndex",range:IDBKeyRange.bound(s,a,!0)},(e,t,r)=>{let s=this.nr(W.fromSegments(t.prefixPath.concat(t.collectionGroup,t.documentId)),t);(i=i.insert(s.key,s)).size===n&&r.done()}).next(()=>i)}newChangeBuffer(e){return new iF(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(e=>e.byteSize)}getMetadata(e){return iU(e).get("remoteDocumentGlobalKey").next(e=>(e||x(),e))}tr(e,t){return iU(e).put("remoteDocumentGlobalKey",t)}nr(e,t){if(t){let e=function(e,t){let r;if(t.document)r=nT(e.ct,t.document,!!t.hasCommittedMutations);else if(t.noDocument){let e=W.fromSegments(t.noDocument.path),n=nV(t.noDocument.readTime);r=tC.newNoDocument(e,n),t.hasCommittedMutations&&r.setHasCommittedMutations()}else{if(!t.unknownDocument)return x();{let e=W.fromSegments(t.unknownDocument.path),n=nV(t.unknownDocument.version);r=tC.newUnknownDocument(e,n)}}return t.readTime&&r.setReadTime(function(e){let t=new z(e[0],e[1]);return G.fromTimestamp(t)}(t.readTime)),r}(this.serializer,t);if(!(e.isNoDocument()&&e.version.isEqual(G.min())))return e}return tC.newInvalidDocument(e)}}class iF extends iL{constructor(e,t){super(),this.ar=e,this.trackRemovals=t,this.ur=new ru(e=>e.toString(),(e,t)=>e.isEqual(t))}applyChanges(e){let t=[],r=0,n=new e4((e,t)=>j(e.canonicalString(),t.canonicalString()));return this.changes.forEach((i,s)=>{let a=this.ur.get(i);if(t.push(this.ar.removeEntry(e,i,a.readTime)),s.isValidDocument()){let o=nM(this.ar.serializer,s);n=n.add(i.path.popLast());let l=iv(o);r+=l-a.size,t.push(this.ar.addEntry(e,i,o))}else if(r-=a.size,this.trackRemovals){let r=nM(this.ar.serializer,s.convertToNoDocument(G.min()));t.push(this.ar.addEntry(e,i,r))}}),n.forEach(r=>{t.push(this.ar.indexManager.addToCollectionParentIndex(e,r))}),t.push(this.ar.updateMetadata(e,r)),eu.waitFor(t)}getFromCache(e,t){return this.ar.rr(e,t).next(e=>(this.ur.set(t,{size:e.size,readTime:e.document.readTime}),e.document))}getAllFromCache(e,t){return this.ar.sr(e,t).next(({documents:e,_r:t})=>(t.forEach((t,r)=>{this.ur.set(t,{size:r,readTime:e.get(t).readTime})}),e))}}function iU(e){return eW(e,"remoteDocumentGlobal")}function iV(e){return eW(e,"remoteDocumentsV14")}function iB(e){let t=e.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function ij(e,t){let r=t.documentKey.path.toArray();return[e,nF(t.readTime),r.slice(0,r.length-2),r.length>0?r[r.length-1]:""]}function iq(e,t){let r=e.path.toArray(),n=t.path.toArray(),i=0;for(let e=0;e<r.length-2&&e<n.length-2;++e)if(i=j(r[e],n[e]))return i;return(i=j(r.length,n.length))||(i=j(r[r.length-2],n[n.length-2]))||j(r[r.length-1],n[n.length-1])}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iz{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iG{constructor(e,t,r,n){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=n}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next(n=>(r=n,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==r&&rU(r.mutation,e,e5.empty(),z.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,ry()).next(()=>t))}getLocalViewOfDocuments(e,t,r=ry()){let n=rp();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,r).next(e=>{let t=rd();return e.forEach((e,r)=>{t=t.insert(e,r.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){let r=rp();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,ry()))}populateOverlays(e,t,r){let n=[];return r.forEach(e=>{t.has(e)||n.push(e)}),this.documentOverlayCache.getOverlays(e,n).next(e=>{e.forEach((e,r)=>{t.set(e,r)})})}computeViews(e,t,r,n){let i=rc,s=rp(),a=rp();return t.forEach((e,t)=>{let a=r.get(t.key);n.has(t.key)&&(void 0===a||a.mutation instanceof rj)?i=i.insert(t.key,t):void 0!==a?(s.set(t.key,a.mutation.getFieldMask()),rU(a.mutation,t,a.mutation.getFieldMask(),z.now())):s.set(t.key,e5.empty())}),this.recalculateAndSaveOverlays(e,i).next(e=>(e.forEach((e,t)=>s.set(e,t)),t.forEach((e,t)=>{var r;return a.set(e,new iz(t,null!==(r=s.get(e))&&void 0!==r?r:null))}),a))}recalculateAndSaveOverlays(e,t){let r=rp(),n=new e0((e,t)=>e-t),i=ry();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(let i of e)i.keys().forEach(e=>{let s=t.get(e);if(null===s)return;let a=r.get(e)||e5.empty();a=i.applyToLocalView(s,a),r.set(e,a);let o=(n.get(i.batchId)||ry()).add(e);n=n.insert(i.batchId,o)})}).next(()=>{let s=[],a=n.getReverseIterator();for(;a.hasNext();){let n=a.getNext(),o=n.key,l=n.value,u=rp();l.forEach(e=>{if(!i.has(e)){let n=rF(t.get(e),r.get(e));null!==n&&u.set(e,n),i=i.add(e)}}),s.push(this.documentOverlayCache.saveOverlays(e,o,u))}return eu.waitFor(s)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,r,n){return W.isDocumentKey(t.path)&&null===t.collectionGroup&&0===t.filters.length?this.getDocumentsMatchingDocumentQuery(e,t.path):t5(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,n):this.getDocumentsMatchingCollectionQuery(e,t,r,n)}getNextDocuments(e,t,r,n){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,n).next(i=>{let s=n-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,n-i.size):eu.resolve(rp()),a=-1,o=i;return s.next(t=>eu.forEach(t,(t,r)=>(a<r.largestBatchId&&(a=r.largestBatchId),i.get(t)?eu.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{o=o.insert(t,e)}))).next(()=>this.populateOverlays(e,t,i)).next(()=>this.computeViews(e,o,t,ry())).next(e=>({batchId:a,changes:rf(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new W(t)).next(e=>{let t=rd();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,r,n){let i=t.collectionGroup,s=rd();return this.indexManager.getCollectionParents(e,i).next(a=>eu.forEach(a,a=>{var o;let l=(o=a.child(i),new t4(o,null,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,t.startAt,t.endAt));return this.getDocumentsMatchingCollectionQuery(e,l,r,n).next(e=>{e.forEach((e,t)=>{s=s.insert(e,t)})})}).next(()=>s))}getDocumentsMatchingCollectionQuery(e,t,r,n){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next(s=>(i=s,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,n))).next(e=>{i.forEach((t,r)=>{let n=r.getKey();null===e.get(n)&&(e=e.insert(n,tC.newInvalidDocument(n)))});let r=rd();return e.forEach((e,n)=>{let s=i.get(e);void 0!==s&&rU(s.mutation,n,e5.empty(),z.now()),ra(t,n)&&(r=r.insert(e,n))}),r})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iK{constructor(e){this.serializer=e,this.cr=new Map,this.lr=new Map}getBundleMetadata(e,t){return eu.resolve(this.cr.get(t))}saveBundleMetadata(e,t){return this.cr.set(t.id,{id:t.id,version:t.version,createTime:nf(t.createTime)}),eu.resolve()}getNamedQuery(e,t){return eu.resolve(this.lr.get(t))}saveNamedQuery(e,t){return this.lr.set(t.name,{name:t.name,query:nz(t.bundledQuery),readTime:nf(t.readTime)}),eu.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i${constructor(){this.overlays=new e0(W.comparator),this.hr=new Map}getOverlay(e,t){return eu.resolve(this.overlays.get(t))}getOverlays(e,t){let r=rp();return eu.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&r.set(t,e)})).next(()=>r)}saveOverlays(e,t,r){return r.forEach((r,n)=>{this.ht(e,t,n)}),eu.resolve()}removeOverlaysForBatchId(e,t,r){let n=this.hr.get(r);return void 0!==n&&(n.forEach(e=>this.overlays=this.overlays.remove(e)),this.hr.delete(r)),eu.resolve()}getOverlaysForCollection(e,t,r){let n=rp(),i=t.length+1,s=new W(t.child("")),a=this.overlays.getIteratorFrom(s);for(;a.hasNext();){let e=a.getNext().value,s=e.getKey();if(!t.isPrefixOf(s.path))break;s.path.length===i&&e.largestBatchId>r&&n.set(e.getKey(),e)}return eu.resolve(n)}getOverlaysForCollectionGroup(e,t,r,n){let i=new e0((e,t)=>e-t),s=this.overlays.getIterator();for(;s.hasNext();){let e=s.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>r){let t=i.get(e.largestBatchId);null===t&&(t=rp(),i=i.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}let a=rp(),o=i.getIterator();for(;o.hasNext()&&(o.getNext().value.forEach((e,t)=>a.set(e,t)),!(a.size()>=n)););return eu.resolve(a)}ht(e,t,r){let n=this.overlays.get(r.key);if(null!==n){let e=this.hr.get(n.largestBatchId).delete(r.key);this.hr.set(n.largestBatchId,e)}this.overlays=this.overlays.insert(r.key,new rW(t,r));let i=this.hr.get(t);void 0===i&&(i=ry(),this.hr.set(t,i)),this.hr.set(t,i.add(r.key))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iH{constructor(){this.Pr=new e4(iQ.Ir),this.Tr=new e4(iQ.Er)}isEmpty(){return this.Pr.isEmpty()}addReference(e,t){let r=new iQ(e,t);this.Pr=this.Pr.add(r),this.Tr=this.Tr.add(r)}dr(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.Ar(new iQ(e,t))}Rr(e,t){e.forEach(e=>this.removeReference(e,t))}Vr(e){let t=new W(new $([])),r=new iQ(t,e),n=new iQ(t,e+1),i=[];return this.Tr.forEachInRange([r,n],e=>{this.Ar(e),i.push(e.key)}),i}mr(){this.Pr.forEach(e=>this.Ar(e))}Ar(e){this.Pr=this.Pr.delete(e),this.Tr=this.Tr.delete(e)}gr(e){let t=new W(new $([])),r=new iQ(t,e),n=new iQ(t,e+1),i=ry();return this.Tr.forEachInRange([r,n],e=>{i=i.add(e.key)}),i}containsKey(e){let t=new iQ(e,0),r=this.Pr.firstAfterOrEqual(t);return null!==r&&e.isEqual(r.key)}}class iQ{constructor(e,t){this.key=e,this.pr=t}static Ir(e,t){return W.comparator(e.key,t.key)||j(e.pr,t.pr)}static Er(e,t){return j(e.pr,t.pr)||W.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iW{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.yr=1,this.wr=new e4(iQ.Ir)}checkEmpty(e){return eu.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,r,n){let i=this.yr;this.yr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let s=new rH(i,t,r,n);for(let t of(this.mutationQueue.push(s),n))this.wr=this.wr.add(new iQ(t.key,i)),this.indexManager.addToCollectionParentIndex(e,t.key.path.popLast());return eu.resolve(s)}lookupMutationBatch(e,t){return eu.resolve(this.Sr(t))}getNextMutationBatchAfterBatchId(e,t){let r=this.br(t+1),n=r<0?0:r;return eu.resolve(this.mutationQueue.length>n?this.mutationQueue[n]:null)}getHighestUnacknowledgedBatchId(){return eu.resolve(0===this.mutationQueue.length?-1:this.yr-1)}getAllMutationBatches(e){return eu.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let r=new iQ(t,0),n=new iQ(t,Number.POSITIVE_INFINITY),i=[];return this.wr.forEachInRange([r,n],e=>{let t=this.Sr(e.pr);i.push(t)}),eu.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new e4(j);return t.forEach(e=>{let t=new iQ(e,0),n=new iQ(e,Number.POSITIVE_INFINITY);this.wr.forEachInRange([t,n],e=>{r=r.add(e.pr)})}),eu.resolve(this.Dr(r))}getAllMutationBatchesAffectingQuery(e,t){let r=t.path,n=r.length+1,i=r;W.isDocumentKey(i)||(i=i.child(""));let s=new iQ(new W(i),0),a=new e4(j);return this.wr.forEachWhile(e=>{let t=e.key.path;return!!r.isPrefixOf(t)&&(t.length===n&&(a=a.add(e.pr)),!0)},s),eu.resolve(this.Dr(a))}Dr(e){let t=[];return e.forEach(e=>{let r=this.Sr(e);null!==r&&t.push(r)}),t}removeMutationBatch(e,t){0===this.Cr(t.batchId,"removed")||x(),this.mutationQueue.shift();let r=this.wr;return eu.forEach(t.mutations,n=>{let i=new iQ(n.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,n.key)}).next(()=>{this.wr=r})}Mn(e){}containsKey(e,t){let r=new iQ(t,0),n=this.wr.firstAfterOrEqual(r);return eu.resolve(t.isEqual(n&&n.key))}performConsistencyCheck(e){return this.mutationQueue.length,eu.resolve()}Cr(e,t){return this.br(e)}br(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Sr(e){let t=this.br(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iJ{constructor(e){this.vr=e,this.docs=new e0(W.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let r=t.key,n=this.docs.get(r),i=n?n.size:0,s=this.vr(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:s}),this.size+=s-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let r=this.docs.get(t);return eu.resolve(r?r.document.mutableCopy():tC.newInvalidDocument(t))}getEntries(e,t){let r=rc;return t.forEach(e=>{let t=this.docs.get(e);r=r.insert(e,t?t.document.mutableCopy():tC.newInvalidDocument(e))}),eu.resolve(r)}getDocumentsMatchingQuery(e,t,r,n){let i=rc,s=t.path,a=new W(s.child("")),o=this.docs.getIteratorFrom(a);for(;o.hasNext();){let{key:e,value:{document:a}}=o.getNext();if(!s.isPrefixOf(e.path))break;e.path.length>s.length+1||0>=es(en(a),r)||(n.has(a.key)||ra(t,a))&&(i=i.insert(a.key,a.mutableCopy()))}return eu.resolve(i)}getAllFromCollectionGroup(e,t,r,n){x()}Fr(e,t){return eu.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new iY(this)}getSize(e){return eu.resolve(this.size)}}class iY extends iL{constructor(e){super(),this.ar=e}applyChanges(e){let t=[];return this.changes.forEach((r,n)=>{n.isValidDocument()?t.push(this.ar.addEntry(e,n)):this.ar.removeEntry(r)}),eu.waitFor(t)}getFromCache(e,t){return this.ar.getEntry(e,t)}getAllFromCache(e,t){return this.ar.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iX{constructor(e){this.persistence=e,this.Mr=new ru(e=>tY(e),tX),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.Or=0,this.Nr=new iH,this.targetCount=0,this.Lr=iT.Nn()}forEachTarget(e,t){return this.Mr.forEach((e,r)=>t(r)),eu.resolve()}getLastRemoteSnapshotVersion(e){return eu.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return eu.resolve(this.Or)}allocateTargetId(e){return this.highestTargetId=this.Lr.next(),eu.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.Or&&(this.Or=t),eu.resolve()}qn(e){this.Mr.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this.Lr=new iT(t),this.highestTargetId=t),e.sequenceNumber>this.Or&&(this.Or=e.sequenceNumber)}addTargetData(e,t){return this.qn(t),this.targetCount+=1,eu.resolve()}updateTargetData(e,t){return this.qn(t),eu.resolve()}removeTargetData(e,t){return this.Mr.delete(t.target),this.Nr.Vr(t.targetId),this.targetCount-=1,eu.resolve()}removeTargets(e,t,r){let n=0,i=[];return this.Mr.forEach((s,a)=>{a.sequenceNumber<=t&&null===r.get(a.targetId)&&(this.Mr.delete(s),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),n++)}),eu.waitFor(i).next(()=>n)}getTargetCount(e){return eu.resolve(this.targetCount)}getTargetData(e,t){let r=this.Mr.get(t)||null;return eu.resolve(r)}addMatchingKeys(e,t,r){return this.Nr.dr(t,r),eu.resolve()}removeMatchingKeys(e,t,r){this.Nr.Rr(t,r);let n=this.persistence.referenceDelegate,i=[];return n&&t.forEach(t=>{i.push(n.markPotentiallyOrphaned(e,t))}),eu.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.Nr.Vr(t),eu.resolve()}getMatchingKeysForTargetId(e,t){let r=this.Nr.gr(t);return eu.resolve(r)}containsKey(e,t){return eu.resolve(this.Nr.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iZ{constructor(e,t){this.Br={},this.overlays={},this.kr=new e_(0),this.qr=!1,this.qr=!0,this.referenceDelegate=e(this),this.Qr=new iX(this),this.indexManager=new is,this.remoteDocumentCache=new iJ(e=>this.referenceDelegate.Kr(e)),this.serializer=new nL(t),this.$r=new iK(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.qr=!1,Promise.resolve()}get started(){return this.qr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new i$,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.Br[e.toKey()];return r||(r=new iW(t,this.referenceDelegate),this.Br[e.toKey()]=r),r}getTargetCache(){return this.Qr}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.$r}runTransaction(e,t,r){_("MemoryPersistence","Starting transaction:",e);let n=new i0(this.kr.next());return this.referenceDelegate.Ur(),r(n).next(e=>this.referenceDelegate.Wr(n).next(()=>e)).toPromise().then(e=>(n.raiseOnCommittedEvent(),e))}Gr(e,t){return eu.or(Object.values(this.Br).map(r=>()=>r.containsKey(e,t)))}}class i0 extends eo{constructor(e){super(),this.currentSequenceNumber=e}}class i1{constructor(e){this.persistence=e,this.zr=new iH,this.jr=null}static Hr(e){return new i1(e)}get Jr(){if(this.jr)return this.jr;throw x()}addReference(e,t,r){return this.zr.addReference(r,t),this.Jr.delete(r.toString()),eu.resolve()}removeReference(e,t,r){return this.zr.removeReference(r,t),this.Jr.add(r.toString()),eu.resolve()}markPotentiallyOrphaned(e,t){return this.Jr.add(t.toString()),eu.resolve()}removeTarget(e,t){this.zr.Vr(t.targetId).forEach(e=>this.Jr.add(e.toString()));let r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.Jr.add(e.toString()))}).next(()=>r.removeTargetData(e,t))}Ur(){this.jr=new Set}Wr(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return eu.forEach(this.Jr,r=>{let n=W.fromPath(r);return this.Yr(e,n).next(e=>{e||t.removeEntry(n,G.min())})}).next(()=>(this.jr=null,t.apply(e)))}updateLimboDocument(e,t){return this.Yr(e,t).next(e=>{e?this.Jr.delete(t.toString()):this.Jr.add(t.toString())})}Kr(e){return 0}Yr(e,t){return eu.or([()=>eu.resolve(this.zr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Gr(e,t)])}}class i2{constructor(e,t){this.persistence=e,this.Zr=new ru(e=>ex(e.path),(e,t)=>e.isEqual(t)),this.garbageCollector=new iO(this,t)}static Hr(e,t){return new i2(e,t)}Ur(){}Wr(e){return eu.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Hn(e){let t=this.Zn(e);return this.persistence.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}Zn(e){let t=0;return this.Jn(e,e=>{t++}).next(()=>t)}Jn(e,t){return eu.forEach(this.Zr,(r,n)=>this.er(e,r,n).next(e=>e?eu.resolve():t(n)))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0,n=this.persistence.getRemoteDocumentCache(),i=n.newChangeBuffer();return n.Fr(e,n=>this.er(e,n,t).next(e=>{e||(r++,i.removeEntry(n,G.min()))})).next(()=>i.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,t){return this.Zr.set(t,e.currentSequenceNumber),eu.resolve()}removeTarget(e,t){let r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.Zr.set(r,e.currentSequenceNumber),eu.resolve()}removeReference(e,t,r){return this.Zr.set(r,e.currentSequenceNumber),eu.resolve()}updateLimboDocument(e,t){return this.Zr.set(t,e.currentSequenceNumber),eu.resolve()}Kr(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=function e(t){switch(th(t)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:let r=ts(t);return r?16+e(r):16;case 5:return 2*t.stringValue.length;case 6:return tn(t.bytesValue).approximateByteSize();case 7:return t.referenceValue.length;case 9:return(t.arrayValue.values||[]).reduce((t,r)=>t+e(r),0);case 10:var n;let i;return n=t.mapValue,i=0,eY(n.fields,(t,r)=>{i+=t.length+e(r)}),i;default:throw x()}}(e.data.value)),t}er(e,t,r){return eu.or([()=>this.persistence.Gr(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{let e=this.Zr.get(t);return eu.resolve(void 0!==e&&e>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i4{constructor(e){this.serializer=e}O(e,t,r,n){let i=new ec("createOrUpgrade",t);r<1&&n>=1&&(function(e){e.createObjectStore("owner")}(e),e.createObjectStore("mutationQueues",{keyPath:"userId"}),e.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",eC,{unique:!0}),e.createObjectStore("documentMutations"),i6(e),function(e){e.createObjectStore("remoteDocuments")}(e));let s=eu.resolve();return r<3&&n>=3&&(0!==r&&(e.deleteObjectStore("targetDocuments"),e.deleteObjectStore("targets"),e.deleteObjectStore("targetGlobal"),i6(e)),s=s.next(()=>(function(e){let t=e.store("targetGlobal"),r={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:G.min().toTimestamp(),targetCount:0};return t.put("targetGlobalKey",r)})(i))),r<4&&n>=4&&(0!==r&&(s=s.next(()=>i.store("mutations").U().next(t=>{e.deleteObjectStore("mutations"),e.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",eC,{unique:!0});let r=i.store("mutations"),n=t.map(e=>r.put(e));return eu.waitFor(n)}))),s=s.next(()=>{!function(e){e.createObjectStore("clientMetadata",{keyPath:"clientId"})}(e)})),r<5&&n>=5&&(s=s.next(()=>this.Xr(i))),r<6&&n>=6&&(s=s.next(()=>((function(e){e.createObjectStore("remoteDocumentGlobal")})(e),this.ei(i)))),r<7&&n>=7&&(s=s.next(()=>this.ti(i))),r<8&&n>=8&&(s=s.next(()=>this.ni(e,i))),r<9&&n>=9&&(s=s.next(()=>{e.objectStoreNames.contains("remoteDocumentChanges")&&e.deleteObjectStore("remoteDocumentChanges")})),r<10&&n>=10&&(s=s.next(()=>this.ri(i))),r<11&&n>=11&&(s=s.next(()=>{(function(e){e.createObjectStore("bundles",{keyPath:"bundleId"})})(e),function(e){e.createObjectStore("namedQueries",{keyPath:"name"})}(e)})),r<12&&n>=12&&(s=s.next(()=>{!function(e){let t=e.createObjectStore("documentOverlays",{keyPath:ej});t.createIndex("collectionPathOverlayIndex",eq,{unique:!1}),t.createIndex("collectionGroupOverlayIndex",ez,{unique:!1})}(e)})),r<13&&n>=13&&(s=s.next(()=>(function(e){let t=e.createObjectStore("remoteDocumentsV14",{keyPath:eN});t.createIndex("documentKeyIndex",ek),t.createIndex("collectionGroupIndex",eO)})(e)).next(()=>this.ii(e,i)).next(()=>e.deleteObjectStore("remoteDocuments"))),r<14&&n>=14&&(s=s.next(()=>this.si(e,i))),r<15&&n>=15&&(s=s.next(()=>{e.createObjectStore("indexConfiguration",{keyPath:"indexId",autoIncrement:!0}).createIndex("collectionGroupIndex","collectionGroup",{unique:!1}),e.createObjectStore("indexState",{keyPath:eF}).createIndex("sequenceNumberIndex",eU,{unique:!1}),e.createObjectStore("indexEntries",{keyPath:eV}).createIndex("documentKeyIndex",eB,{unique:!1})})),r<16&&n>=16&&(s=s.next(()=>{t.objectStore("indexState").clear()}).next(()=>{t.objectStore("indexEntries").clear()})),s}ei(e){let t=0;return e.store("remoteDocuments").J((e,r)=>{t+=iv(r)}).next(()=>{let r={byteSize:t};return e.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey",r)})}Xr(e){let t=e.store("mutationQueues"),r=e.store("mutations");return t.U().next(t=>eu.forEach(t,t=>{let n=IDBKeyRange.bound([t.userId,-1],[t.userId,t.lastAcknowledgedBatchId]);return r.U("userMutationsIndex",n).next(r=>eu.forEach(r,r=>{r.userId===t.userId||x();let n=nB(this.serializer,r);return iy(e,t.userId,n).next(()=>{})}))}))}ti(e){let t=e.store("targetDocuments"),r=e.store("remoteDocuments");return e.store("targetGlobal").get("targetGlobalKey").next(e=>{let n=[];return r.J((r,i)=>{let s=new $(r),a=[0,ex(s)];n.push(t.get(a).next(r=>r?eu.resolve():t.put({targetId:0,path:ex(s),sequenceNumber:e.highestListenSequenceNumber})))}).next(()=>eu.waitFor(n))})}ni(e,t){e.createObjectStore("collectionParents",{keyPath:eM});let r=t.store("collectionParents"),n=new ia,i=e=>{if(n.add(e)){let t=e.lastSegment(),n=e.popLast();return r.put({collectionId:t,parent:ex(n)})}};return t.store("remoteDocuments").J({H:!0},(e,t)=>{let r=new $(e);return i(r.popLast())}).next(()=>t.store("documentMutations").J({H:!0},([e,t,r],n)=>{let s=eA(t);return i(s.popLast())}))}ri(e){let t=e.store("targets");return t.J((e,r)=>{let n=nj(r),i=nq(this.serializer,n);return t.put(i)})}ii(e,t){let r=t.store("remoteDocuments"),n=[];return r.J((e,r)=>{let i=t.store("remoteDocumentsV14"),s=(r.document?new W($.fromString(r.document.name).popFirst(5)):r.noDocument?W.fromSegments(r.noDocument.path):r.unknownDocument?W.fromSegments(r.unknownDocument.path):x()).path.toArray(),a={prefixPath:s.slice(0,s.length-2),collectionGroup:s[s.length-2],documentId:s[s.length-1],readTime:r.readTime||[0,0],unknownDocument:r.unknownDocument,noDocument:r.noDocument,document:r.document,hasCommittedMutations:!!r.hasCommittedMutations};n.push(i.put(a))}).next(()=>eu.waitFor(n))}si(e,t){var r;let n=t.store("mutations"),i=(r=this.serializer,new iM(r)),s=new iZ(i1.Hr,this.serializer.ct);return n.U().next(e=>{let r=new Map;return e.forEach(e=>{var t;let n=null!==(t=r.get(e.userId))&&void 0!==t?t:ry();nB(this.serializer,e).keys().forEach(e=>n=n.add(e)),r.set(e.userId,n)}),eu.forEach(r,(e,r)=>{let n=new y(r),a=nJ.lt(this.serializer,n),o=s.getIndexManager(n),l=iw.lt(n,this.serializer,o,s.referenceDelegate);return new iG(i,l,a,o).recalculateAndSaveOverlaysForDocumentKeys(new eQ(t,e_.oe),e).next()})})}}function i6(e){e.createObjectStore("targetDocuments",{keyPath:eP}).createIndex("documentTargetsIndex",eL,{unique:!0}),e.createObjectStore("targets",{keyPath:"targetId"}).createIndex("queryTargetsIndex",eR,{unique:!0}),e.createObjectStore("targetGlobal")}let i9="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class i5{constructor(e,t,r,n,i,s,a,o,l,u,c=16){var h;if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=r,this.oi=i,this.window=s,this.document=a,this._i=l,this.ai=u,this.ui=c,this.kr=null,this.qr=!1,this.isPrimary=!1,this.networkEnabled=!0,this.ci=null,this.inForeground=!1,this.li=null,this.hi=null,this.Pi=Number.NEGATIVE_INFINITY,this.Ii=e=>Promise.resolve(),!i5.D())throw new D(C.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new iR(this,n),this.Ti=t+"main",this.serializer=new nL(o),this.Ei=new eh(this.Ti,this.ui,new i4(this.serializer)),this.Qr=new iS(this.referenceDelegate,this.serializer),this.remoteDocumentCache=(h=this.serializer,new iM(h)),this.$r=new nH,this.window&&this.window.localStorage?this.di=this.window.localStorage:(this.di=null,!1===u&&E("IndexedDbPersistence","LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Ai().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new D(C.FAILED_PRECONDITION,i9);return this.Ri(),this.Vi(),this.mi(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.Qr.getHighestSequenceNumber(e))}).then(e=>{this.kr=new e_(e,this._i)}).then(()=>{this.qr=!0}).catch(e=>(this.Ei&&this.Ei.close(),Promise.reject(e)))}fi(e){return this.Ii=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ei.L(async t=>{null===t.newVersion&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.oi.enqueueAndForget(async()=>{this.started&&await this.Ai()}))}Ai(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>i8(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.gi(e).next(e=>{e||(this.isPrimary=!1,this.oi.enqueueRetryable(()=>this.Ii(!1)))})}).next(()=>this.pi(e)).next(t=>this.isPrimary&&!t?this.yi(e).next(()=>!1):!!t&&this.wi(e).next(()=>!0))).catch(e=>{if(em(e))return _("IndexedDbPersistence","Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return _("IndexedDbPersistence","Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.oi.enqueueRetryable(()=>this.Ii(e)),this.isPrimary=e})}gi(e){return i3(e).get("owner").next(e=>eu.resolve(this.Si(e)))}bi(e){return i8(e).delete(this.clientId)}async Di(){if(this.isPrimary&&!this.Ci(this.Pi,18e5)){this.Pi=Date.now();let e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",e=>{let t=eW(e,"clientMetadata");return t.U().next(e=>{let r=this.vi(e,18e5),n=e.filter(e=>-1===r.indexOf(e));return eu.forEach(n,e=>t.delete(e.clientId)).next(()=>n)})}).catch(()=>[]);if(this.di)for(let t of e)this.di.removeItem(this.Fi(t.clientId))}}mi(){this.hi=this.oi.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.Ai().then(()=>this.Di()).then(()=>this.mi()))}Si(e){return!!e&&e.ownerId===this.clientId}pi(e){return this.ai?eu.resolve(!0):i3(e).get("owner").next(t=>{if(null!==t&&this.Ci(t.leaseTimestampMs,5e3)&&!this.Mi(t.ownerId)){if(this.Si(t)&&this.networkEnabled)return!0;if(!this.Si(t)){if(!t.allowTabSynchronization)throw new D(C.FAILED_PRECONDITION,i9);return!1}}return!(!this.networkEnabled||!this.inForeground)||i8(e).U().next(e=>void 0===this.vi(e,5e3).find(e=>{if(this.clientId!==e.clientId){let t=!this.networkEnabled&&e.networkEnabled,r=!this.inForeground&&e.inForeground,n=this.networkEnabled===e.networkEnabled;if(t||r&&n)return!0}return!1}))}).next(e=>(this.isPrimary!==e&&_("IndexedDbPersistence",`Client ${e?"is":"is not"} eligible for a primary lease.`),e))}async shutdown(){this.qr=!1,this.xi(),this.hi&&(this.hi.cancel(),this.hi=null),this.Oi(),this.Ni(),await this.Ei.runTransaction("shutdown","readwrite",["owner","clientMetadata"],e=>{let t=new eQ(e,e_.oe);return this.yi(t).next(()=>this.bi(t))}),this.Ei.close(),this.Li()}vi(e,t){return e.filter(e=>this.Ci(e.updateTimeMs,t)&&!this.Mi(e.clientId))}Bi(){return this.runTransaction("getActiveClients","readonly",e=>i8(e).U().next(e=>this.vi(e,18e5).map(e=>e.clientId)))}get started(){return this.qr}getMutationQueue(e,t){return iw.lt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Qr}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new il(e,this.serializer.ct.databaseId)}getDocumentOverlayCache(e){return nJ.lt(this.serializer,e)}getBundleCache(){return this.$r}runTransaction(e,t,r){var n;let i;_("IndexedDbPersistence","Starting transaction:",e);let s="readonly"===t?"readonly":"readwrite",a=16===(n=this.ui)?eH:15===n?eH:14===n?e$:13===n?e$:12===n?eK:11===n?eG:void x();return this.Ei.runTransaction(e,s,a,n=>(i=new eQ(n,this.kr?this.kr.next():e_.oe),"readwrite-primary"===t?this.gi(i).next(e=>!!e||this.pi(i)).next(t=>{if(!t)throw E(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.oi.enqueueRetryable(()=>this.Ii(!1)),new D(C.FAILED_PRECONDITION,ea);return r(i)}).next(e=>this.wi(i).next(()=>e)):this.ki(i).next(()=>r(i)))).then(e=>(i.raiseOnCommittedEvent(),e))}ki(e){return i3(e).get("owner").next(e=>{if(null!==e&&this.Ci(e.leaseTimestampMs,5e3)&&!this.Mi(e.ownerId)&&!this.Si(e)&&!(this.ai||this.allowTabSynchronization&&e.allowTabSynchronization))throw new D(C.FAILED_PRECONDITION,i9)})}wi(e){let t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return i3(e).put("owner",t)}static D(){return eh.D()}yi(e){let t=i3(e);return t.get("owner").next(e=>this.Si(e)?(_("IndexedDbPersistence","Releasing primary lease."),t.delete("owner")):eu.resolve())}Ci(e,t){let r=Date.now();return!(e<r-t)&&(!(e>r)||(E(`Detected an update time that is in the future: ${e} > ${r}`),!1))}Ri(){null!==this.document&&"function"==typeof this.document.addEventListener&&(this.li=()=>{this.oi.enqueueAndForget(()=>(this.inForeground="visible"===this.document.visibilityState,this.Ai()))},this.document.addEventListener("visibilitychange",this.li),this.inForeground="visible"===this.document.visibilityState)}Oi(){this.li&&(this.document.removeEventListener("visibilitychange",this.li),this.li=null)}Vi(){var e;"function"==typeof(null===(e=this.window)||void 0===e?void 0:e.addEventListener)&&(this.ci=()=>{this.xi();let e=/(?:Version|Mobile)\/1[456]/;(0,h.isSafari)()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.oi.enterRestrictedMode(!0),this.oi.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.ci))}Ni(){this.ci&&(this.window.removeEventListener("pagehide",this.ci),this.ci=null)}Mi(e){var t;try{let r=null!==(null===(t=this.di)||void 0===t?void 0:t.getItem(this.Fi(e)));return _("IndexedDbPersistence",`Client '${e}' ${r?"is":"is not"} zombied in LocalStorage`),r}catch(e){return E("IndexedDbPersistence","Failed to get zombied client id.",e),!1}}xi(){if(this.di)try{this.di.setItem(this.Fi(this.clientId),String(Date.now()))}catch(e){E("Failed to set zombie client id.",e)}}Li(){if(this.di)try{this.di.removeItem(this.Fi(this.clientId))}catch(e){}}Fi(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function i3(e){return eW(e,"owner")}function i8(e){return eW(e,"clientMetadata")}function i7(e,t){let r=e.projectId;return e.isDefaultDatabase||(r+="."+e.database),"firestore/"+t+"/"+r+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class se{constructor(e,t,r,n){this.targetId=e,this.fromCache=t,this.qi=r,this.Qi=n}static Ki(e,t){let r=ry(),n=ry();for(let e of t.docChanges)switch(e.type){case 0:r=r.add(e.doc.key);break;case 1:n=n.add(e.doc.key)}return new se(e,t.fromCache,r,n)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class st{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sr{constructor(){this.$i=!1,this.Ui=!1,this.Wi=100,this.Gi=(0,h.isSafari)()?8:ed((0,h.getUA)())>0?6:4}initialize(e,t){this.zi=e,this.indexManager=t,this.$i=!0}getDocumentsMatchingQuery(e,t,r,n){let i={result:null};return this.ji(e,t).next(e=>{i.result=e}).next(()=>{if(!i.result)return this.Hi(e,t,n,r).next(e=>{i.result=e})}).next(()=>{if(i.result)return;let r=new st;return this.Ji(e,t,r).next(n=>{if(i.result=n,this.Ui)return this.Yi(e,t,r,n.size)})}).next(()=>i.result)}Yi(e,t,r,n){return r.documentReadCount<this.Wi?(b()<=c.LogLevel.DEBUG&&_("QueryEngine","SDK will not create cache indexes for query:",rs(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Wi,"documents"),eu.resolve()):(b()<=c.LogLevel.DEBUG&&_("QueryEngine","Query:",rs(t),"scans",r.documentReadCount,"local documents and returns",n,"documents as results."),r.documentReadCount>this.Gi*n?(b()<=c.LogLevel.DEBUG&&_("QueryEngine","The SDK decides to create cache indexes for query:",rs(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,t8(t))):eu.resolve())}ji(e,t){if(t9(t))return eu.resolve(null);let r=t8(t);return this.indexManager.getIndexType(e,r).next(n=>0===n?null:(null!==t.limit&&1===n&&(r=t8(t=rr(t,null,"F"))),this.indexManager.getDocumentsMatchingTarget(e,r).next(n=>{let i=ry(...n);return this.zi.getDocuments(e,i).next(n=>this.indexManager.getMinOffset(e,r).next(r=>{let s=this.Zi(t,n);return this.Xi(t,s,i,r.readTime)?this.ji(e,rr(t,null,"F")):this.es(e,s,t,r)}))})))}Hi(e,t,r,n){return t9(t)||n.isEqual(G.min())?eu.resolve(null):this.zi.getDocuments(e,r).next(i=>{let s=this.Zi(t,i);return this.Xi(t,s,r,n)?eu.resolve(null):(b()<=c.LogLevel.DEBUG&&_("QueryEngine","Re-using previous result from %s to execute query: %s",n.toString(),rs(t)),this.es(e,s,t,er(n,-1)).next(e=>e))})}Zi(e,t){let r=new e4(rl(e));return t.forEach((t,n)=>{ra(e,n)&&(r=r.add(n))}),r}Xi(e,t,r,n){if(null===e.limit)return!1;if(r.size!==t.size)return!0;let i="F"===e.limitType?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(n)>0)}Ji(e,t,r){return b()<=c.LogLevel.DEBUG&&_("QueryEngine","Using full collection scan to execute query:",rs(t)),this.zi.getDocumentsMatchingQuery(e,t,ei.min(),r)}es(e,t,r,n){return this.zi.getDocumentsMatchingQuery(e,r,n).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn{constructor(e,t,r,n){this.persistence=e,this.ts=t,this.serializer=n,this.ns=new e0(j),this.rs=new ru(e=>tY(e),tX),this.ss=new Map,this.os=e.getRemoteDocumentCache(),this.Qr=e.getTargetCache(),this.$r=e.getBundleCache(),this._s(r)}_s(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new iG(this.os,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.os.setIndexManager(this.indexManager),this.ts.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.ns))}}async function si(e,t){return await e.persistence.runTransaction("Handle user change","readonly",r=>{let n;return e.mutationQueue.getAllMutationBatches(r).next(i=>(n=i,e._s(t),e.mutationQueue.getAllMutationBatches(r))).next(t=>{let i=[],s=[],a=ry();for(let e of n)for(let t of(i.push(e.batchId),e.mutations))a=a.add(t.key);for(let e of t)for(let t of(s.push(e.batchId),e.mutations))a=a.add(t.key);return e.localDocuments.getDocuments(r,a).next(e=>({us:e,removedBatchIds:i,addedBatchIds:s}))})})}function ss(e){return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Qr.getLastRemoteSnapshotVersion(t))}function sa(e,t,r){let n=ry(),i=ry();return r.forEach(e=>n=n.add(e)),t.getEntries(e,n).next(e=>{let n=rc;return r.forEach((r,s)=>{let a=e.get(r);s.isFoundDocument()!==a.isFoundDocument()&&(i=i.add(r)),s.isNoDocument()&&s.version.isEqual(G.min())?(t.removeEntry(r,s.readTime),n=n.insert(r,s)):!a.isValidDocument()||s.version.compareTo(a.version)>0||0===s.version.compareTo(a.version)&&a.hasPendingWrites?(t.addEntry(s),n=n.insert(r,s)):_("LocalStore","Ignoring outdated watch update for ",r,". Current version:",a.version," Watch version:",s.version)}),{cs:n,ls:i}})}function so(e,t){return e.persistence.runTransaction("Allocate target","readwrite",r=>{let n;return e.Qr.getTargetData(r,t).next(i=>i?(n=i,eu.resolve(n)):e.Qr.allocateTargetId(r).next(i=>(n=new nP(t,i,"TargetPurposeListen",r.currentSequenceNumber),e.Qr.addTargetData(r,n).next(()=>n))))}).then(r=>{let n=e.ns.get(r.targetId);return(null===n||r.snapshotVersion.compareTo(n.snapshotVersion)>0)&&(e.ns=e.ns.insert(r.targetId,r),e.rs.set(t,r.targetId)),r})}async function sl(e,t,r){let n=e.ns.get(t);try{r||await e.persistence.runTransaction("Release target",r?"readwrite":"readwrite-primary",t=>e.persistence.referenceDelegate.removeTarget(t,n))}catch(e){if(!em(e))throw e;_("LocalStore",`Failed to update sequence numbers for target ${t}: ${e}`)}e.ns=e.ns.remove(t),e.rs.delete(n.target)}function su(e,t,r){let n=G.min(),i=ry();return e.persistence.runTransaction("Execute query","readwrite",s=>(function(e,t,r){let n=e.rs.get(r);return void 0!==n?eu.resolve(e.ns.get(n)):e.Qr.getTargetData(t,r)})(e,s,t8(t)).next(t=>{if(t)return n=t.lastLimboFreeSnapshotVersion,e.Qr.getMatchingKeysForTargetId(s,t.targetId).next(e=>{i=e})}).next(()=>e.ts.getDocumentsMatchingQuery(s,t,r?n:G.min(),r?i:ry())).next(r=>(sd(e,ro(t),r),{documents:r,hs:i})))}function sc(e,t){let r=e.Qr,n=e.ns.get(t);return n?Promise.resolve(n.target):e.persistence.runTransaction("Get target data","readonly",e=>r.ot(e,t).next(e=>e?e.target:null))}function sh(e,t){let r=e.ss.get(t)||G.min();return e.persistence.runTransaction("Get new document changes","readonly",n=>e.os.getAllFromCollectionGroup(n,t,er(r,-1),Number.MAX_SAFE_INTEGER)).then(r=>(sd(e,t,r),r))}function sd(e,t,r){let n=e.ss.get(t)||G.min();r.forEach((e,t)=>{t.readTime.compareTo(n)>0&&(n=t.readTime)}),e.ss.set(t,n)}async function sf(e,t,r,n){let i=ry(),s=rc;for(let e of r){let r=t.Ps(e.metadata.name);e.document&&(i=i.add(r));let n=t.Is(e);n.setReadTime(t.Ts(e.metadata.readTime)),s=s.insert(r,n)}let a=e.os.newChangeBuffer({trackRemovals:!0}),o=await so(e,t8(t6($.fromString(`__bundle__/docs/${n}`))));return e.persistence.runTransaction("Apply bundle documents","readwrite",t=>sa(t,a,s).next(e=>(a.apply(t),e)).next(r=>e.Qr.removeMatchingKeysForTargetId(t,o.targetId).next(()=>e.Qr.addMatchingKeys(t,i,o.targetId)).next(()=>e.localDocuments.getLocalViewOfDocuments(t,r.cs,r.ls)).next(()=>r.cs)))}async function sp(e,t,r=ry()){let n=await so(e,t8(nz(t.bundledQuery)));return e.persistence.runTransaction("Save named query","readwrite",i=>{let s=nf(t.readTime);if(n.snapshotVersion.compareTo(s)>=0)return e.$r.saveNamedQuery(i,t);let a=n.withResumeToken(e7.EMPTY_BYTE_STRING,s);return e.ns=e.ns.insert(a.targetId,a),e.Qr.updateTargetData(i,a).next(()=>e.Qr.removeMatchingKeysForTargetId(i,n.targetId)).next(()=>e.Qr.addMatchingKeys(i,r,n.targetId)).next(()=>e.$r.saveNamedQuery(i,t))})}function sm(e,t){return`firestore_clients_${e}_${t}`}function sg(e,t,r){let n=`firestore_mutations_${e}_${r}`;return t.isAuthenticated()&&(n+=`_${t.uid}`),n}function sy(e,t){return`firestore_targets_${e}_${t}`}class sv{constructor(e,t,r,n){this.user=e,this.batchId=t,this.state=r,this.error=n}static Es(e,t,r){let n=JSON.parse(r),i,s="object"==typeof n&&-1!==["pending","acknowledged","rejected"].indexOf(n.state)&&(void 0===n.error||"object"==typeof n.error);return s&&n.error&&(s="string"==typeof n.error.message&&"string"==typeof n.error.code)&&(i=new D(n.error.code,n.error.message)),s?new sv(e,t,n.state,i):(E("SharedClientState",`Failed to parse mutation state for ID '${t}': ${r}`),null)}ds(){let e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class sw{constructor(e,t,r){this.targetId=e,this.state=t,this.error=r}static Es(e,t){let r=JSON.parse(t),n,i="object"==typeof r&&-1!==["not-current","current","rejected"].indexOf(r.state)&&(void 0===r.error||"object"==typeof r.error);return i&&r.error&&(i="string"==typeof r.error.message&&"string"==typeof r.error.code)&&(n=new D(r.error.code,r.error.message)),i?new sw(e,r.state,n):(E("SharedClientState",`Failed to parse target state for ID '${e}': ${t}`),null)}ds(){let e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class sb{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Es(e,t){let r=JSON.parse(t),n="object"==typeof r&&r.activeTargetIds instanceof Array,i=rv;for(let e=0;n&&e<r.activeTargetIds.length;++e)n=eS(r.activeTargetIds[e]),i=i.add(r.activeTargetIds[e]);return n?new sb(e,i):(E("SharedClientState",`Failed to parse client data for instance '${e}': ${t}`),null)}}class sI{constructor(e,t){this.clientId=e,this.onlineState=t}static Es(e){let t=JSON.parse(e);return"object"==typeof t&&-1!==["Unknown","Online","Offline"].indexOf(t.onlineState)&&"string"==typeof t.clientId?new sI(t.clientId,t.onlineState):(E("SharedClientState",`Failed to parse online state: ${e}`),null)}}class s_{constructor(){this.activeTargetIds=rv}As(e){this.activeTargetIds=this.activeTargetIds.add(e)}Rs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}ds(){let e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class sE{constructor(e,t,r,n,i){this.window=e,this.oi=t,this.persistenceKey=r,this.Vs=n,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.fs=this.gs.bind(this),this.ps=new e0(j),this.started=!1,this.ys=[];let s=r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.ws=sm(this.persistenceKey,this.Vs),this.Ss=`firestore_sequence_number_${this.persistenceKey}`,this.ps=this.ps.insert(this.Vs,new s_),this.bs=RegExp(`^firestore_clients_${s}_([^_]*)$`),this.Ds=RegExp(`^firestore_mutations_${s}_(\\d+)(?:_(.*))?$`),this.Cs=RegExp(`^firestore_targets_${s}_(\\d+)$`),this.vs=`firestore_online_state_${this.persistenceKey}`,this.Fs=`firestore_bundle_loaded_v2_${this.persistenceKey}`,this.window.addEventListener("storage",this.fs)}static D(e){return!(!e||!e.localStorage)}async start(){let e=await this.syncEngine.Bi();for(let t of e){if(t===this.Vs)continue;let e=this.getItem(sm(this.persistenceKey,t));if(e){let r=sb.Es(t,e);r&&(this.ps=this.ps.insert(r.clientId,r))}}this.Ms();let t=this.storage.getItem(this.vs);if(t){let e=this.xs(t);e&&this.Os(e)}for(let e of this.ys)this.gs(e);this.ys=[],this.window.addEventListener("pagehide",()=>this.shutdown()),this.started=!0}writeSequenceNumber(e){this.setItem(this.Ss,JSON.stringify(e))}getAllActiveQueryTargets(){return this.Ns(this.ps)}isActiveQueryTarget(e){let t=!1;return this.ps.forEach((r,n)=>{n.activeTargetIds.has(e)&&(t=!0)}),t}addPendingMutation(e){this.Ls(e,"pending")}updateMutationState(e,t,r){this.Ls(e,t,r),this.Bs(e)}addLocalQueryTarget(e){let t="not-current";if(this.isActiveQueryTarget(e)){let r=this.storage.getItem(sy(this.persistenceKey,e));if(r){let n=sw.Es(e,r);n&&(t=n.state)}}return this.ks.As(e),this.Ms(),t}removeLocalQueryTarget(e){this.ks.Rs(e),this.Ms()}isLocalQueryTarget(e){return this.ks.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(sy(this.persistenceKey,e))}updateQueryState(e,t,r){this.qs(e,t,r)}handleUserChange(e,t,r){t.forEach(e=>{this.Bs(e)}),this.currentUser=e,r.forEach(e=>{this.addPendingMutation(e)})}setOnlineState(e){this.Qs(e)}notifyBundleLoaded(e){this.Ks(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.fs),this.removeItem(this.ws),this.started=!1)}getItem(e){let t=this.storage.getItem(e);return _("SharedClientState","READ",e,t),t}setItem(e,t){_("SharedClientState","SET",e,t),this.storage.setItem(e,t)}removeItem(e){_("SharedClientState","REMOVE",e),this.storage.removeItem(e)}gs(e){if(e.storageArea===this.storage){if(_("SharedClientState","EVENT",e.key,e.newValue),e.key===this.ws)return void E("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.oi.enqueueRetryable(async()=>{if(this.started){if(null!==e.key){if(this.bs.test(e.key)){if(null==e.newValue){let t=this.$s(e.key);return this.Us(t,null)}{let t=this.Ws(e.key,e.newValue);if(t)return this.Us(t.clientId,t)}}else if(this.Ds.test(e.key)){if(null!==e.newValue){let t=this.Gs(e.key,e.newValue);if(t)return this.zs(t)}}else if(this.Cs.test(e.key)){if(null!==e.newValue){let t=this.js(e.key,e.newValue);if(t)return this.Hs(t)}}else if(e.key===this.vs){if(null!==e.newValue){let t=this.xs(e.newValue);if(t)return this.Os(t)}}else if(e.key===this.Ss){let t=function(e){let t=e_.oe;if(null!=e)try{let r=JSON.parse(e);"number"==typeof r||x(),t=r}catch(e){E("SharedClientState","Failed to read sequence number from WebStorage",e)}return t}(e.newValue);t!==e_.oe&&this.sequenceNumberHandler(t)}else if(e.key===this.Fs){let t=this.Js(e.newValue);await Promise.all(t.map(e=>this.syncEngine.Ys(e)))}}}else this.ys.push(e)})}}get ks(){return this.ps.get(this.Vs)}Ms(){this.setItem(this.ws,this.ks.ds())}Ls(e,t,r){let n=new sv(this.currentUser,e,t,r),i=sg(this.persistenceKey,this.currentUser,e);this.setItem(i,n.ds())}Bs(e){let t=sg(this.persistenceKey,this.currentUser,e);this.removeItem(t)}Qs(e){let t={clientId:this.Vs,onlineState:e};this.storage.setItem(this.vs,JSON.stringify(t))}qs(e,t,r){let n=sy(this.persistenceKey,e),i=new sw(e,t,r);this.setItem(n,i.ds())}Ks(e){let t=JSON.stringify(Array.from(e));this.setItem(this.Fs,t)}$s(e){let t=this.bs.exec(e);return t?t[1]:null}Ws(e,t){let r=this.$s(e);return sb.Es(r,t)}Gs(e,t){let r=this.Ds.exec(e),n=Number(r[1]),i=void 0!==r[2]?r[2]:null;return sv.Es(new y(i),n,t)}js(e,t){let r=this.Cs.exec(e),n=Number(r[1]);return sw.Es(n,t)}xs(e){return sI.Es(e)}Js(e){return JSON.parse(e)}async zs(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Zs(e.batchId,e.state,e.error);_("SharedClientState",`Ignoring mutation for non-active user ${e.user.uid}`)}Hs(e){return this.syncEngine.Xs(e.targetId,e.state,e.error)}Us(e,t){let r=t?this.ps.insert(e,t):this.ps.remove(e),n=this.Ns(this.ps),i=this.Ns(r),s=[],a=[];return i.forEach(e=>{n.has(e)||s.push(e)}),n.forEach(e=>{i.has(e)||a.push(e)}),this.syncEngine.eo(s,a).then(()=>{this.ps=r})}Os(e){this.ps.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}Ns(e){let t=rv;return e.forEach((e,r)=>{t=t.unionWith(r.activeTargetIds)}),t}}class sT{constructor(){this.no=new s_,this.ro={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e){return this.no.As(e),this.ro[e]||"not-current"}updateQueryState(e,t,r){this.ro[e]=t}removeLocalQueryTarget(e){this.no.Rs(e)}isLocalQueryTarget(e){return this.no.activeTargetIds.has(e)}clearQueryState(e){delete this.ro[e]}getAllActiveQueryTargets(){return this.no.activeTargetIds}isActiveQueryTarget(e){return this.no.activeTargetIds.has(e)}start(){return this.no=new s_,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sS{io(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sx{constructor(){this.so=()=>this.oo(),this._o=()=>this.ao(),this.uo=[],this.co()}io(e){this.uo.push(e)}shutdown(){window.removeEventListener("online",this.so),window.removeEventListener("offline",this._o)}co(){window.addEventListener("online",this.so),window.addEventListener("offline",this._o)}oo(){for(let e of(_("ConnectivityMonitor","Network connectivity changed: AVAILABLE"),this.uo))e(0)}ao(){for(let e of(_("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE"),this.uo))e(1)}static D(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sA=null;function sC(){return null===sA?sA=268435456+Math.round(2147483648*Math.random()):sA++,"0x"+sA.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sD={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sN{constructor(e){this.lo=e.lo,this.ho=e.ho}Po(e){this.Io=e}To(e){this.Eo=e}Ao(e){this.Ro=e}onMessage(e){this.Vo=e}close(){this.ho()}send(e){this.lo(e)}mo(){this.Io()}fo(){this.Eo()}po(e){this.Ro(e)}yo(e){this.Vo(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sk="WebChannelConnection";class sO extends class{constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),n=encodeURIComponent(this.databaseId.database);this.wo=t+"://"+e.host,this.So=`projects/${r}/databases/${n}`,this.bo="(default)"===this.databaseId.database?`project_id=${r}`:`project_id=${r}&database_id=${n}`}get Do(){return!1}Co(e,t,r,n,i){let s=sC(),a=this.vo(e,t.toUriEncodedString());_("RestConnection",`Sending RPC '${e}' ${s}:`,a,r);let o={"google-cloud-resource-prefix":this.So,"x-goog-request-params":this.bo};return this.Fo(o,n,i),this.Mo(e,a,o,r).then(t=>(_("RestConnection",`Received RPC '${e}' ${s}: `,t),t),t=>{throw T("RestConnection",`RPC '${e}' ${s} failed with error: `,t,"url: ",a,"request:",r),t})}xo(e,t,r,n,i,s){return this.Co(e,t,r,n,i)}Fo(e,t,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+v}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,r)=>e[r]=t),r&&r.headers.forEach((t,r)=>e[r]=t)}vo(e,t){let r=sD[e];return`${this.wo}/v1/${t}:${r}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Mo(e,t,r,n){let i=sC();return new Promise((s,a)=>{let o=new f.XhrIo;o.setWithCredentials(!0),o.listenOnce(f.EventType.COMPLETE,()=>{try{switch(o.getLastErrorCode()){case f.ErrorCode.NO_ERROR:let t=o.getResponseJson();_(sk,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(t)),s(t);break;case f.ErrorCode.TIMEOUT:_(sk,`RPC '${e}' ${i} timed out`),a(new D(C.DEADLINE_EXCEEDED,"Request time out"));break;case f.ErrorCode.HTTP_ERROR:let r=o.getStatus();if(_(sk,`RPC '${e}' ${i} failed with status:`,r,"response text:",o.getResponseText()),r>0){let e=o.getResponseJson();Array.isArray(e)&&(e=e[0]);let t=null==e?void 0:e.error;if(t&&t.status&&t.message){let e=function(e){let t=e.toLowerCase().replace(/_/g,"-");return Object.values(C).indexOf(t)>=0?t:C.UNKNOWN}(t.status);a(new D(e,t.message))}else a(new D(C.UNKNOWN,"Server responded with status "+o.getStatus()))}else a(new D(C.UNAVAILABLE,"Connection failed."));break;default:x()}}finally{_(sk,`RPC '${e}' ${i} completed.`)}});let l=JSON.stringify(n);_(sk,`RPC '${e}' ${i} sending request:`,n),o.send(t,"POST",l,r,15)})}Oo(e,t,r){let i=sC(),s=[this.wo,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=(0,f.createWebChannelTransport)(),o=(0,f.getStatEventTarget)(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;void 0!==u&&(l.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(l.xmlHttpFactory=new f.FetchXmlHttpFactory({})),this.Fo(l.initMessageHeaders,t,r),l.encodeInitMessageHeaders=!0;let c=s.join("");_(sk,`Creating RPC '${e}' stream ${i}: ${c}`,l);let h=a.createWebChannel(c,l),d=!1,p=!1,m=new sN({lo:t=>{p?_(sk,`Not sending because RPC '${e}' stream ${i} is closed:`,t):(d||(_(sk,`Opening RPC '${e}' stream ${i} transport.`),h.open(),d=!0),_(sk,`RPC '${e}' stream ${i} sending:`,t),h.send(t))},ho:()=>h.close()}),g=(e,t,r)=>{e.listen(t,e=>{try{r(e)}catch(e){setTimeout(()=>{throw e},0)}})};return g(h,f.WebChannel.EventType.OPEN,()=>{p||(_(sk,`RPC '${e}' stream ${i} transport opened.`),m.mo())}),g(h,f.WebChannel.EventType.CLOSE,()=>{p||(p=!0,_(sk,`RPC '${e}' stream ${i} transport closed`),m.po())}),g(h,f.WebChannel.EventType.ERROR,t=>{p||(p=!0,T(sk,`RPC '${e}' stream ${i} transport errored:`,t),m.po(new D(C.UNAVAILABLE,"The operation could not be completed")))}),g(h,f.WebChannel.EventType.MESSAGE,t=>{var r;if(!p){let s=t.data[0];s||x();let a=s.error||(null===(r=s[0])||void 0===r?void 0:r.error);if(a){_(sk,`RPC '${e}' stream ${i} received error:`,a);let t=a.status,r=function(e){let t=n[e];if(void 0!==t)return rZ(t)}(t),s=a.message;void 0===r&&(r=C.INTERNAL,s="Unknown error status: "+t+" with message "+a.message),p=!0,m.po(new D(r,s)),h.close()}else _(sk,`RPC '${e}' stream ${i} received:`,s),m.yo(s)}}),g(o,f.Event.STAT_EVENT,t=>{t.stat===f.Stat.PROXY?_(sk,`RPC '${e}' stream ${i} detected buffering proxy`):t.stat===f.Stat.NOPROXY&&_(sk,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{m.fo()},0),m}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sR(){return"undefined"!=typeof window?window:null}function sP(){return"undefined"!=typeof document?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sL(e){return new nu(e,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sM{constructor(e,t,r=1e3,n=1.5,i=6e4){this.oi=e,this.timerId=t,this.No=r,this.Lo=n,this.Bo=i,this.ko=0,this.qo=null,this.Qo=Date.now(),this.reset()}reset(){this.ko=0}Ko(){this.ko=this.Bo}$o(e){this.cancel();let t=Math.floor(this.ko+this.Uo()),r=Math.max(0,Date.now()-this.Qo),n=Math.max(0,t-r);n>0&&_("ExponentialBackoff",`Backing off for ${n} ms (base delay: ${this.ko} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.qo=this.oi.enqueueAfterDelay(this.timerId,n,()=>(this.Qo=Date.now(),e())),this.ko*=this.Lo,this.ko<this.No&&(this.ko=this.No),this.ko>this.Bo&&(this.ko=this.Bo)}Wo(){null!==this.qo&&(this.qo.skipDelay(),this.qo=null)}cancel(){null!==this.qo&&(this.qo.cancel(),this.qo=null)}Uo(){return(Math.random()-.5)*this.ko}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sF{constructor(e,t,r,n,i,s,a,o){this.oi=e,this.Go=r,this.zo=n,this.connection=i,this.authCredentialsProvider=s,this.appCheckCredentialsProvider=a,this.listener=o,this.state=0,this.jo=0,this.Ho=null,this.Jo=null,this.stream=null,this.Yo=new sM(e,t)}Zo(){return 1===this.state||5===this.state||this.Xo()}Xo(){return 2===this.state||3===this.state}start(){4!==this.state?this.auth():this.e_()}async stop(){this.Zo()&&await this.close(0)}t_(){this.state=0,this.Yo.reset()}n_(){this.Xo()&&null===this.Ho&&(this.Ho=this.oi.enqueueAfterDelay(this.Go,6e4,()=>this.r_()))}i_(e){this.s_(),this.stream.send(e)}async r_(){if(this.Xo())return this.close(0)}s_(){this.Ho&&(this.Ho.cancel(),this.Ho=null)}o_(){this.Jo&&(this.Jo.cancel(),this.Jo=null)}async close(e,t){this.s_(),this.o_(),this.Yo.cancel(),this.jo++,4!==e?this.Yo.reset():t&&t.code===C.RESOURCE_EXHAUSTED?(E(t.toString()),E("Using maximum backoff delay to prevent overloading the backend."),this.Yo.Ko()):t&&t.code===C.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.__(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Ao(t)}__(){}auth(){this.state=1;let e=this.a_(this.jo),t=this.jo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,r])=>{this.jo===t&&this.u_(e,r)},t=>{e(()=>{let e=new D(C.UNKNOWN,"Fetching auth token failed: "+t.message);return this.c_(e)})})}u_(e,t){let r=this.a_(this.jo);this.stream=this.l_(e,t),this.stream.Po(()=>{r(()=>this.listener.Po())}),this.stream.To(()=>{r(()=>(this.state=2,this.Jo=this.oi.enqueueAfterDelay(this.zo,1e4,()=>(this.Xo()&&(this.state=3),Promise.resolve())),this.listener.To()))}),this.stream.Ao(e=>{r(()=>this.c_(e))}),this.stream.onMessage(e=>{r(()=>this.onMessage(e))})}e_(){this.state=5,this.Yo.$o(async()=>{this.state=0,this.start()})}c_(e){return _("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}a_(e){return t=>{this.oi.enqueueAndForget(()=>this.jo===e?t():(_("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class sU extends sF{constructor(e,t,r,n,i,s){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,n,s),this.serializer=i}l_(e,t){return this.connection.Oo("Listen",e,t)}onMessage(e){this.Yo.reset();let t=function(e,t){let r;if("targetChange"in t){var n,i;t.targetChange;let s="NO_CHANGE"===(n=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===n?1:"REMOVE"===n?2:"CURRENT"===n?3:"RESET"===n?4:x(),a=t.targetChange.targetIds||[],o=(i=t.targetChange.resumeToken,e.useProto3Json?(void 0===i||"string"==typeof i||x(),e7.fromBase64String(i||"")):(void 0===i||i instanceof m||i instanceof Uint8Array||x(),e7.fromUint8Array(i||new Uint8Array))),l=t.targetChange.cause,u=l&&function(e){let t=void 0===e.code?C.UNKNOWN:rZ(e.code);return new D(t,e.message||"")}(l);r=new nt(s,a,o,u||null)}else if("documentChange"in t){t.documentChange;let n=t.documentChange;n.document,n.document.name,n.document.updateTime;let i=nv(e,n.document.name),s=nf(n.document.updateTime),a=n.document.createTime?nf(n.document.createTime):G.min(),o=new tA({mapValue:{fields:n.document.fields}}),l=tC.newFoundDocument(i,s,a,o),u=n.targetIds||[],c=n.removedTargetIds||[];r=new r7(u,c,l.key,l)}else if("documentDelete"in t){t.documentDelete;let n=t.documentDelete;n.document;let i=nv(e,n.document),s=n.readTime?nf(n.readTime):G.min(),a=tC.newNoDocument(i,s),o=n.removedTargetIds||[];r=new r7([],o,a.key,a)}else if("documentRemove"in t){t.documentRemove;let n=t.documentRemove;n.document;let i=nv(e,n.document),s=n.removedTargetIds||[];r=new r7([],s,i,null)}else{if(!("filter"in t))return x();{t.filter;let e=t.filter;e.targetId;let{count:n=0,unchangedNames:i}=e,s=new rY(n,i),a=e.targetId;r=new ne(a,s)}}return r}(this.serializer,e),r=function(e){if(!("targetChange"in e))return G.min();let t=e.targetChange;return t.targetIds&&t.targetIds.length?G.min():t.readTime?nf(t.readTime):G.min()}(e);return this.listener.h_(t,r)}P_(e){let t={};t.database=nI(this.serializer),t.addTarget=function(e,t){let r;let n=t.target;if((r=tZ(n)?{documents:nA(e,n)}:{query:nC(e,n)._t}).targetId=t.targetId,t.resumeToken.approximateByteSize()>0){r.resumeToken=nd(e,t.resumeToken);let n=nc(e,t.expectedCount);null!==n&&(r.expectedCount=n)}else if(t.snapshotVersion.compareTo(G.min())>0){r.readTime=nh(e,t.snapshotVersion.toTimestamp());let n=nc(e,t.expectedCount);null!==n&&(r.expectedCount=n)}return r}(this.serializer,e);let r=function(e,t){let r=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return x()}}(t.purpose);return null==r?null:{"goog-listen-tags":r}}(this.serializer,e);r&&(t.labels=r),this.i_(t)}I_(e){let t={};t.database=nI(this.serializer),t.removeTarget=e,this.i_(t)}}class sV extends sF{constructor(e,t,r,n,i,s){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,n,s),this.serializer=i,this.T_=!1}get E_(){return this.T_}start(){this.T_=!1,this.lastStreamToken=void 0,super.start()}__(){this.T_&&this.d_([])}l_(e,t){return this.connection.Oo("Write",e,t)}onMessage(e){var t,r;if(e.streamToken||x(),this.lastStreamToken=e.streamToken,this.T_){this.Yo.reset();let n=(t=e.writeResults,r=e.commitTime,t&&t.length>0?(void 0!==r||x(),t.map(e=>{let t;return(t=e.updateTime?nf(e.updateTime):nf(r)).isEqual(G.min())&&(t=nf(r)),new rR(t,e.transformResults||[])})):[]),i=nf(e.commitTime);return this.listener.A_(i,n)}return e.writeResults&&0!==e.writeResults.length&&x(),this.T_=!0,this.listener.R_()}V_(){let e={};e.database=nI(this.serializer),this.i_(e)}d_(e){let t={streamToken:this.lastStreamToken,writes:e.map(e=>nS(this.serializer,e))};this.i_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sB extends class{}{constructor(e,t,r,n){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=n,this.m_=!1}f_(){if(this.m_)throw new D(C.FAILED_PRECONDITION,"The client has already been terminated.")}Co(e,t,r,n){return this.f_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.Co(e,nm(t,r),n,i,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===C.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new D(C.UNKNOWN,e.toString())})}xo(e,t,r,n,i){return this.f_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.xo(e,nm(t,r),n,s,a,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===C.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new D(C.UNKNOWN,e.toString())})}terminate(){this.m_=!0,this.connection.terminate()}}class sj{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.g_=0,this.p_=null,this.y_=!0}w_(){0===this.g_&&(this.S_("Unknown"),this.p_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.p_=null,this.b_("Backend didn't respond within 10 seconds."),this.S_("Offline"),Promise.resolve())))}D_(e){"Online"===this.state?this.S_("Unknown"):(this.g_++,this.g_>=1&&(this.C_(),this.b_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.S_("Offline")))}set(e){this.C_(),this.g_=0,"Online"===e&&(this.y_=!1),this.S_(e)}S_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}b_(e){let t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.y_?(E(t),this.y_=!1):_("OnlineStateTracker",t)}C_(){null!==this.p_&&(this.p_.cancel(),this.p_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sq{constructor(e,t,r,n,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.v_=[],this.F_=new Map,this.M_=new Set,this.x_=[],this.O_=i,this.O_.io(e=>{r.enqueueAndForget(async()=>{sY(this)&&(_("RemoteStore","Restarting streams for network reachability change."),await async function(e){e.M_.add(4),await sG(e),e.N_.set("Unknown"),e.M_.delete(4),await sz(e)}(this))})}),this.N_=new sj(r,n)}}async function sz(e){if(sY(e))for(let t of e.x_)await t(!0)}async function sG(e){for(let t of e.x_)await t(!1)}function sK(e,t){e.F_.has(t.targetId)||(e.F_.set(t.targetId,t),sJ(e)?sW(e):an(e).Xo()&&sH(e,t))}function s$(e,t){let r=an(e);e.F_.delete(t),r.Xo()&&sQ(e,t),0===e.F_.size&&(r.Xo()?r.n_():sY(e)&&e.N_.set("Unknown"))}function sH(e,t){if(e.L_.xe(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(G.min())>0){let r=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(r)}an(e).P_(t)}function sQ(e,t){e.L_.xe(t),an(e).I_(t)}function sW(e){e.L_=new nn({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),ot:t=>e.F_.get(t)||null,tt:()=>e.datastore.serializer.databaseId}),an(e).start(),e.N_.w_()}function sJ(e){return sY(e)&&!an(e).Zo()&&e.F_.size>0}function sY(e){return 0===e.M_.size}async function sX(e){e.N_.set("Online")}async function sZ(e){e.F_.forEach((t,r)=>{sH(e,t)})}async function s0(e,t){e.L_=void 0,sJ(e)?(e.N_.D_(t),sW(e)):e.N_.set("Unknown")}async function s1(e,t,r){if(e.N_.set("Online"),t instanceof nt&&2===t.state&&t.cause)try{await async function(e,t){let r=t.cause;for(let n of t.targetIds)e.F_.has(n)&&(await e.remoteSyncer.rejectListen(n,r),e.F_.delete(n),e.L_.removeTarget(n))}(e,t)}catch(r){_("RemoteStore","Failed to remove targets %s: %s ",t.targetIds.join(","),r),await s2(e,r)}else if(t instanceof r7?e.L_.Ke(t):t instanceof ne?e.L_.He(t):e.L_.We(t),!r.isEqual(G.min()))try{let t=await ss(e.localStore);r.compareTo(t)>=0&&await function(e,t){let r=e.L_.rt(t);return r.targetChanges.forEach((r,n)=>{if(r.resumeToken.approximateByteSize()>0){let i=e.F_.get(n);i&&e.F_.set(n,i.withResumeToken(r.resumeToken,t))}}),r.targetMismatches.forEach((t,r)=>{let n=e.F_.get(t);if(!n)return;e.F_.set(t,n.withResumeToken(e7.EMPTY_BYTE_STRING,n.snapshotVersion)),sQ(e,t);let i=new nP(n.target,t,r,n.sequenceNumber);sH(e,i)}),e.remoteSyncer.applyRemoteEvent(r)}(e,r)}catch(t){_("RemoteStore","Failed to raise snapshot:",t),await s2(e,t)}}async function s2(e,t,r){if(!em(t))throw t;e.M_.add(1),await sG(e),e.N_.set("Offline"),r||(r=()=>ss(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{_("RemoteStore","Retrying IndexedDB access"),await r(),e.M_.delete(1),await sz(e)})}function s4(e,t){return t().catch(r=>s2(e,r,t))}async function s6(e){let t=ai(e),r=e.v_.length>0?e.v_[e.v_.length-1].batchId:-1;for(;sY(e)&&e.v_.length<10;)try{let n=await function(e,t){return e.persistence.runTransaction("Get next mutation batch","readonly",r=>(void 0===t&&(t=-1),e.mutationQueue.getNextMutationBatchAfterBatchId(r,t)))}(e.localStore,r);if(null===n){0===e.v_.length&&t.n_();break}r=n.batchId,function(e,t){e.v_.push(t);let r=ai(e);r.Xo()&&r.E_&&r.d_(t.mutations)}(e,n)}catch(t){await s2(e,t)}s9(e)&&s5(e)}function s9(e){return sY(e)&&!ai(e).Zo()&&e.v_.length>0}function s5(e){ai(e).start()}async function s3(e){ai(e).V_()}async function s8(e){let t=ai(e);for(let r of e.v_)t.d_(r.mutations)}async function s7(e,t,r){let n=e.v_.shift(),i=rQ.from(n,t,r);await s4(e,()=>e.remoteSyncer.applySuccessfulWrite(i)),await s6(e)}async function ae(e,t){t&&ai(e).E_&&await async function(e,t){var r;if(rX(r=t.code)&&r!==C.ABORTED){let r=e.v_.shift();ai(e).t_(),await s4(e,()=>e.remoteSyncer.rejectFailedWrite(r.batchId,t)),await s6(e)}}(e,t),s9(e)&&s5(e)}async function at(e,t){e.asyncQueue.verifyOperationInProgress(),_("RemoteStore","RemoteStore received new credentials");let r=sY(e);e.M_.add(3),await sG(e),r&&e.N_.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.M_.delete(3),await sz(e)}async function ar(e,t){t?(e.M_.delete(2),await sz(e)):t||(e.M_.add(2),await sG(e),e.N_.set("Unknown"))}function an(e){var t,r,n;return e.B_||(e.B_=(t=e.datastore,r=e.asyncQueue,n={Po:sX.bind(null,e),To:sZ.bind(null,e),Ao:s0.bind(null,e),h_:s1.bind(null,e)},t.f_(),new sU(r,t.connection,t.authCredentials,t.appCheckCredentials,t.serializer,n)),e.x_.push(async t=>{t?(e.B_.t_(),sJ(e)?sW(e):e.N_.set("Unknown")):(await e.B_.stop(),e.L_=void 0)})),e.B_}function ai(e){var t,r,n;return e.k_||(e.k_=(t=e.datastore,r=e.asyncQueue,n={Po:()=>Promise.resolve(),To:s3.bind(null,e),Ao:ae.bind(null,e),R_:s8.bind(null,e),A_:s7.bind(null,e)},t.f_(),new sV(r,t.connection,t.authCredentials,t.appCheckCredentials,t.serializer,n)),e.x_.push(async t=>{t?(e.k_.t_(),await s6(e)):(await e.k_.stop(),e.v_.length>0&&(_("RemoteStore",`Stopping write stream with ${e.v_.length} pending writes`),e.v_=[]))})),e.k_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class as{constructor(e,t,r,n,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=n,this.removalCallback=i,this.deferred=new N,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,n,i){let s=Date.now()+r,a=new as(e,t,s,n,i);return a.start(r),a}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new D(C.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function aa(e,t){if(E("AsyncQueue",`${t}: ${e}`),em(e))return new D(C.UNAVAILABLE,`${t}: ${e}`);throw e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ao{constructor(e){this.comparator=e?(t,r)=>e(t,r)||W.comparator(t.key,r.key):(e,t)=>W.comparator(e.key,t.key),this.keyedMap=rd(),this.sortedSet=new e0(this.comparator)}static emptySet(e){return new ao(e.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){let t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,r)=>(e(t),!1))}add(e){let t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){let t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof ao)||this.size!==e.size)return!1;let t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){let e=t.getNext().key,n=r.getNext().key;if(!e.isEqual(n))return!1}return!0}toString(){let e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){let r=new ao;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class al{constructor(){this.q_=new e0(W.comparator)}track(e){let t=e.doc.key,r=this.q_.get(t);r?0!==e.type&&3===r.type?this.q_=this.q_.insert(t,e):3===e.type&&1!==r.type?this.q_=this.q_.insert(t,{type:r.type,doc:e.doc}):2===e.type&&2===r.type?this.q_=this.q_.insert(t,{type:2,doc:e.doc}):2===e.type&&0===r.type?this.q_=this.q_.insert(t,{type:0,doc:e.doc}):1===e.type&&0===r.type?this.q_=this.q_.remove(t):1===e.type&&2===r.type?this.q_=this.q_.insert(t,{type:1,doc:r.doc}):0===e.type&&1===r.type?this.q_=this.q_.insert(t,{type:2,doc:e.doc}):x():this.q_=this.q_.insert(t,e)}Q_(){let e=[];return this.q_.inorderTraversal((t,r)=>{e.push(r)}),e}}class au{constructor(e,t,r,n,i,s,a,o,l){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=n,this.mutatedKeys=i,this.fromCache=s,this.syncStateChanged=a,this.excludesMetadataChanges=o,this.hasCachedResults=l}static fromInitialDocuments(e,t,r,n,i){let s=[];return t.forEach(e=>{s.push({type:0,doc:e})}),new au(e,t,ao.emptySet(t),s,r,n,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&rn(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;let t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let e=0;e<t.length;e++)if(t[e].type!==r[e].type||!t[e].doc.isEqual(r[e].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ac{constructor(){this.K_=void 0,this.U_=[]}W_(){return this.U_.some(e=>e.G_())}}class ah{constructor(){this.queries=new ru(e=>ri(e),rn),this.onlineState="Unknown",this.z_=new Set}}async function ad(e,t){let r=3,n=t.query,i=e.queries.get(n);i?!i.W_()&&t.G_()&&(r=2):(i=new ac,r=t.G_()?0:1);try{switch(r){case 0:i.K_=await e.onListen(n,!0);break;case 1:i.K_=await e.onListen(n,!1);break;case 2:await e.onFirstRemoteStoreListen(n)}}catch(r){let e=aa(r,`Initialization of query '${rs(t.query)}' failed`);return void t.onError(e)}e.queries.set(n,i),i.U_.push(t),t.j_(e.onlineState),i.K_&&t.H_(i.K_)&&ag(e)}async function af(e,t){let r=t.query,n=3,i=e.queries.get(r);if(i){let e=i.U_.indexOf(t);e>=0&&(i.U_.splice(e,1),0===i.U_.length?n=t.G_()?0:1:!i.W_()&&t.G_()&&(n=2))}switch(n){case 0:return e.queries.delete(r),e.onUnlisten(r,!0);case 1:return e.queries.delete(r),e.onUnlisten(r,!1);case 2:return e.onLastRemoteStoreUnlisten(r);default:return}}function ap(e,t){let r=!1;for(let n of t){let t=n.query,i=e.queries.get(t);if(i){for(let e of i.U_)e.H_(n)&&(r=!0);i.K_=n}}r&&ag(e)}function am(e,t,r){let n=e.queries.get(t);if(n)for(let e of n.U_)e.onError(r);e.queries.delete(t)}function ag(e){e.z_.forEach(e=>{e.next()})}(a=s||(s={})).J_="default",a.Cache="cache";class ay{constructor(e,t,r){this.query=e,this.Y_=t,this.Z_=!1,this.X_=null,this.onlineState="Unknown",this.options=r||{}}H_(e){if(!this.options.includeMetadataChanges){let t=[];for(let r of e.docChanges)3!==r.type&&t.push(r);e=new au(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Z_?this.ea(e)&&(this.Y_.next(e),t=!0):this.ta(e,this.onlineState)&&(this.na(e),t=!0),this.X_=e,t}onError(e){this.Y_.error(e)}j_(e){this.onlineState=e;let t=!1;return this.X_&&!this.Z_&&this.ta(this.X_,e)&&(this.na(this.X_),t=!0),t}ta(e,t){return!(e.fromCache&&this.G_())||(!this.options.ra||!("Offline"!==t))&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}ea(e){if(e.docChanges.length>0)return!0;let t=this.X_&&this.X_.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}na(e){e=au.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Z_=!0,this.Y_.next(e)}G_(){return this.options.source!==s.Cache}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class av{constructor(e,t){this.ia=e,this.byteLength=t}sa(){return"metadata"in this.ia}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aw{constructor(e){this.serializer=e}Ps(e){return nv(this.serializer,e)}Is(e){return e.metadata.exists?nT(this.serializer,e.document,!1):tC.newNoDocument(this.Ps(e.metadata.name),this.Ts(e.metadata.readTime))}Ts(e){return nf(e)}}class ab{constructor(e,t,r){this.oa=e,this.localStore=t,this.serializer=r,this.queries=[],this.documents=[],this.collectionGroups=new Set,this.progress=aI(e)}_a(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.ia.namedQuery)this.queries.push(e.ia.namedQuery);else if(e.ia.documentMetadata){this.documents.push({metadata:e.ia.documentMetadata}),e.ia.documentMetadata.exists||++t;let r=$.fromString(e.ia.documentMetadata.name);this.collectionGroups.add(r.get(r.length-2))}else e.ia.document&&(this.documents[this.documents.length-1].document=e.ia.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,Object.assign({},this.progress)):null}aa(e){let t=new Map,r=new aw(this.serializer);for(let n of e)if(n.metadata.queries){let e=r.Ps(n.metadata.name);for(let r of n.metadata.queries){let n=(t.get(r)||ry()).add(e);t.set(r,n)}}return t}async complete(){let e=await sf(this.localStore,new aw(this.serializer),this.documents,this.oa.id),t=this.aa(this.documents);for(let e of this.queries)await sp(this.localStore,e,t.get(e.name));return this.progress.taskState="Success",{progress:this.progress,ua:this.collectionGroups,ca:e}}}function aI(e){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:e.totalDocuments,totalBytes:e.totalBytes}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class a_{constructor(e){this.key=e}}class aE{constructor(e){this.key=e}}class aT{constructor(e,t){this.query=e,this.la=t,this.ha=null,this.hasCachedResults=!1,this.current=!1,this.Pa=ry(),this.mutatedKeys=ry(),this.Ia=rl(e),this.Ta=new ao(this.Ia)}get Ea(){return this.la}da(e,t){let r=t?t.Aa:new al,n=t?t.Ta:this.Ta,i=t?t.mutatedKeys:this.mutatedKeys,s=n,a=!1,o="F"===this.query.limitType&&n.size===this.query.limit?n.last():null,l="L"===this.query.limitType&&n.size===this.query.limit?n.first():null;if(e.inorderTraversal((e,t)=>{let u=n.get(e),c=ra(this.query,t)?t:null,h=!!u&&this.mutatedKeys.has(u.key),d=!!c&&(c.hasLocalMutations||this.mutatedKeys.has(c.key)&&c.hasCommittedMutations),f=!1;u&&c?u.data.isEqual(c.data)?h!==d&&(r.track({type:3,doc:c}),f=!0):this.Ra(u,c)||(r.track({type:2,doc:c}),f=!0,(o&&this.Ia(c,o)>0||l&&0>this.Ia(c,l))&&(a=!0)):!u&&c?(r.track({type:0,doc:c}),f=!0):u&&!c&&(r.track({type:1,doc:u}),f=!0,(o||l)&&(a=!0)),f&&(c?(s=s.add(c),i=d?i.add(e):i.delete(e)):(s=s.delete(e),i=i.delete(e)))}),null!==this.query.limit)for(;s.size>this.query.limit;){let e="F"===this.query.limitType?s.last():s.first();s=s.delete(e.key),i=i.delete(e.key),r.track({type:1,doc:e})}return{Ta:s,Aa:r,Xi:a,mutatedKeys:i}}Ra(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,n){let i=this.Ta;this.Ta=e.Ta,this.mutatedKeys=e.mutatedKeys;let s=e.Aa.Q_();s.sort((e,t)=>(function(e,t){let r=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return x()}};return r(e)-r(t)})(e.type,t.type)||this.Ia(e.doc,t.doc)),this.Va(r),n=null!=n&&n;let a=t&&!n?this.ma():[],o=0===this.Pa.size&&this.current&&!n?1:0,l=o!==this.ha;return(this.ha=o,0!==s.length||l)?{snapshot:new au(this.query,e.Ta,i,s,e.mutatedKeys,0===o,l,!1,!!r&&r.resumeToken.approximateByteSize()>0),fa:a}:{fa:a}}j_(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({Ta:this.Ta,Aa:new al,mutatedKeys:this.mutatedKeys,Xi:!1},!1)):{fa:[]}}ga(e){return!this.la.has(e)&&!!this.Ta.has(e)&&!this.Ta.get(e).hasLocalMutations}Va(e){e&&(e.addedDocuments.forEach(e=>this.la=this.la.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.la=this.la.delete(e)),this.current=e.current)}ma(){if(!this.current)return[];let e=this.Pa;this.Pa=ry(),this.Ta.forEach(e=>{this.ga(e.key)&&(this.Pa=this.Pa.add(e.key))});let t=[];return e.forEach(e=>{this.Pa.has(e)||t.push(new aE(e))}),this.Pa.forEach(r=>{e.has(r)||t.push(new a_(r))}),t}pa(e){this.la=e.hs,this.Pa=ry();let t=this.da(e.documents);return this.applyChanges(t,!0)}ya(){return au.fromInitialDocuments(this.query,this.Ta,this.mutatedKeys,0===this.ha,this.hasCachedResults)}}class aS{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class ax{constructor(e){this.key=e,this.wa=!1}}class aA{constructor(e,t,r,n,i,s){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=n,this.currentUser=i,this.maxConcurrentLimboResolutions=s,this.Sa={},this.ba=new ru(e=>ri(e),rn),this.Da=new Map,this.Ca=new Set,this.va=new e0(W.comparator),this.Fa=new Map,this.Ma=new iH,this.xa={},this.Oa=new Map,this.Na=iT.Ln(),this.onlineState="Unknown",this.La=void 0}get isPrimaryClient(){return!0===this.La}}async function aC(e,t,r=!0){let n;let i=a9(e),s=i.ba.get(t);return s?(i.sharedClientState.addLocalQueryTarget(s.targetId),n=s.view.ya()):n=await aN(i,t,r,!0),n}async function aD(e,t){let r=a9(e);await aN(r,t,!0,!1)}async function aN(e,t,r,n){let i;let s=await so(e.localStore,t8(t)),a=s.targetId,o=r?e.sharedClientState.addLocalQueryTarget(a):"not-current";return n&&(i=await ak(e,t,a,"current"===o,s.resumeToken)),e.isPrimaryClient&&r&&sK(e.remoteStore,s),i}async function ak(e,t,r,n,i){e.Ba=(t,r,n)=>(async function(e,t,r,n){let i=t.view.da(r);i.Xi&&(i=await su(e.localStore,t.query,!1).then(({documents:e})=>t.view.da(e,i)));let s=n&&n.targetChanges.get(t.targetId),a=n&&null!=n.targetMismatches.get(t.targetId),o=t.view.applyChanges(i,e.isPrimaryClient,s,a);return aK(e,t.targetId,o.fa),o.snapshot})(e,t,r,n);let s=await su(e.localStore,t,!0),a=new aT(t,s.hs),o=a.da(s.documents),l=r8.createSynthesizedTargetChangeForCurrentChange(r,n&&"Offline"!==e.onlineState,i),u=a.applyChanges(o,e.isPrimaryClient,l);aK(e,r,u.fa);let c=new aS(t,r,a);return e.ba.set(t,c),e.Da.has(r)?e.Da.get(r).push(t):e.Da.set(r,[t]),u.snapshot}async function aO(e,t,r){let n=e.ba.get(t),i=e.Da.get(n.targetId);if(i.length>1)return e.Da.set(n.targetId,i.filter(e=>!rn(e,t))),void e.ba.delete(t);e.isPrimaryClient?(e.sharedClientState.removeLocalQueryTarget(n.targetId),e.sharedClientState.isActiveQueryTarget(n.targetId)||await sl(e.localStore,n.targetId,!1).then(()=>{e.sharedClientState.clearQueryState(n.targetId),r&&s$(e.remoteStore,n.targetId),az(e,n.targetId)}).catch(el)):(az(e,n.targetId),await sl(e.localStore,n.targetId,!0))}async function aR(e,t){let r=e.ba.get(t),n=e.Da.get(r.targetId);e.isPrimaryClient&&1===n.length&&(e.sharedClientState.removeLocalQueryTarget(r.targetId),s$(e.remoteStore,r.targetId))}async function aP(e,t,r){let n=a5(e);try{var i;let e;let s=await function(e,t){let r,n;let i=z.now(),s=t.reduce((e,t)=>e.add(t.key),ry());return e.persistence.runTransaction("Locally write mutations","readwrite",a=>{let o=rc,l=ry();return e.os.getEntries(a,s).next(e=>{(o=e).forEach((e,t)=>{t.isValidDocument()||(l=l.add(e))})}).next(()=>e.localDocuments.getOverlayedDocuments(a,o)).next(n=>{r=n;let s=[];for(let e of t){let t=function(e,t){let r=null;for(let n of e.fieldTransforms){let e=t.data.field(n.field),i=rE(n.transform,e||null);null!=i&&(null===r&&(r=tA.empty()),r.set(n.field,i))}return r||null}(e,r.get(e.key).overlayedDocument);null!=t&&s.push(new rj(e.key,t,function e(t){let r=[];return eY(t.fields,(t,n)=>{let i=new Q([t]);if(t_(n)){let t=e(n.mapValue).fields;if(0===t.length)r.push(i);else for(let e of t)r.push(i.child(e))}else r.push(i)}),new e5(r)}(t.value.mapValue),rP.exists(!0)))}return e.mutationQueue.addMutationBatch(a,i,s,t)}).next(t=>{n=t;let i=t.applyToLocalDocumentSet(r,l);return e.documentOverlayCache.saveOverlays(a,t.batchId,i)})}).then(()=>({batchId:n.batchId,changes:rf(r)}))}(n.localStore,t);n.sharedClientState.addPendingMutation(s.batchId),i=s.batchId,(e=n.xa[n.currentUser.toKey()])||(e=new e0(j)),e=e.insert(i,r),n.xa[n.currentUser.toKey()]=e,await aH(n,s.changes),await s6(n.remoteStore)}catch(t){let e=aa(t,"Failed to persist write");r.reject(e)}}async function aL(e,t){try{let r=await function(e,t){let r=t.snapshotVersion,n=e.ns;return e.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{let s=e.os.newChangeBuffer({trackRemovals:!0});n=e.ns;let a=[];t.targetChanges.forEach((s,o)=>{var l;let u=n.get(o);if(!u)return;a.push(e.Qr.removeMatchingKeys(i,s.removedDocuments,o).next(()=>e.Qr.addMatchingKeys(i,s.addedDocuments,o)));let c=u.withSequenceNumber(i.currentSequenceNumber);null!==t.targetMismatches.get(o)?c=c.withResumeToken(e7.EMPTY_BYTE_STRING,G.min()).withLastLimboFreeSnapshotVersion(G.min()):s.resumeToken.approximateByteSize()>0&&(c=c.withResumeToken(s.resumeToken,r)),n=n.insert(o,c),l=c,(0===u.resumeToken.approximateByteSize()||l.snapshotVersion.toMicroseconds()-u.snapshotVersion.toMicroseconds()>=3e8||s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size>0)&&a.push(e.Qr.updateTargetData(i,c))});let o=rc,l=ry();if(t.documentUpdates.forEach(r=>{t.resolvedLimboDocuments.has(r)&&a.push(e.persistence.referenceDelegate.updateLimboDocument(i,r))}),a.push(sa(i,s,t.documentUpdates).next(e=>{o=e.cs,l=e.ls})),!r.isEqual(G.min())){let t=e.Qr.getLastRemoteSnapshotVersion(i).next(t=>e.Qr.setTargetsMetadata(i,i.currentSequenceNumber,r));a.push(t)}return eu.waitFor(a).next(()=>s.apply(i)).next(()=>e.localDocuments.getLocalViewOfDocuments(i,o,l)).next(()=>o)}).then(t=>(e.ns=n,t))}(e.localStore,t);t.targetChanges.forEach((t,r)=>{let n=e.Fa.get(r);n&&(t.addedDocuments.size+t.modifiedDocuments.size+t.removedDocuments.size<=1||x(),t.addedDocuments.size>0?n.wa=!0:t.modifiedDocuments.size>0?n.wa||x():t.removedDocuments.size>0&&(n.wa||x(),n.wa=!1))}),await aH(e,r,t)}catch(e){await el(e)}}function aM(e,t,r){var n;if(e.isPrimaryClient&&0===r||!e.isPrimaryClient&&1===r){let r;let i=[];e.ba.forEach((e,r)=>{let n=r.view.j_(t);n.snapshot&&i.push(n.snapshot)}),(n=e.eventManager).onlineState=t,r=!1,n.queries.forEach((e,n)=>{for(let e of n.U_)e.j_(t)&&(r=!0)}),r&&ag(n),i.length&&e.Sa.h_(i),e.onlineState=t,e.isPrimaryClient&&e.sharedClientState.setOnlineState(t)}}async function aF(e,t,r){e.sharedClientState.updateQueryState(t,"rejected",r);let n=e.Fa.get(t),i=n&&n.key;if(i){let r=new e0(W.comparator);r=r.insert(i,tC.newNoDocument(i,G.min()));let n=ry().add(i),s=new r3(G.min(),new Map,new e0(j),r,n);await aL(e,s),e.va=e.va.remove(i),e.Fa.delete(t),a$(e)}else await sl(e.localStore,t,!1).then(()=>az(e,t,r)).catch(el)}async function aU(e,t){var r;let n=t.batch.batchId;try{let i=await (r=e.localStore).persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{let n=t.batch.keys(),i=r.os.newChangeBuffer({trackRemovals:!0});return(function(e,t,r,n){let i=r.batch,s=i.keys(),a=eu.resolve();return s.forEach(e=>{a=a.next(()=>n.getEntry(t,e)).next(t=>{let s=r.docVersions.get(e);null!==s||x(),0>t.version.compareTo(s)&&(i.applyToRemoteDocument(t,r),t.isValidDocument()&&(t.setReadTime(r.commitVersion),n.addEntry(t)))})}),a.next(()=>e.mutationQueue.removeMutationBatch(t,i))})(r,e,t,i).next(()=>i.apply(e)).next(()=>r.mutationQueue.performConsistencyCheck(e)).next(()=>r.documentOverlayCache.removeOverlaysForBatchId(e,n,t.batch.batchId)).next(()=>r.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=ry();for(let r=0;r<e.mutationResults.length;++r)e.mutationResults[r].transformResults.length>0&&(t=t.add(e.batch.mutations[r].key));return t}(t))).next(()=>r.localDocuments.getDocuments(e,n))});aq(e,n,null),aj(e,n),e.sharedClientState.updateMutationState(n,"acknowledged"),await aH(e,i)}catch(e){await el(e)}}async function aV(e,t,r){var n;try{let i=await (n=e.localStore).persistence.runTransaction("Reject batch","readwrite-primary",e=>{let r;return n.mutationQueue.lookupMutationBatch(e,t).next(t=>(null!==t||x(),r=t.keys(),n.mutationQueue.removeMutationBatch(e,t))).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,r)).next(()=>n.localDocuments.getDocuments(e,r))});aq(e,t,r),aj(e,t),e.sharedClientState.updateMutationState(t,"rejected",r),await aH(e,i)}catch(e){await el(e)}}async function aB(e,t){var r;sY(e.remoteStore)||_("SyncEngine","The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{let n=await (r=e.localStore).persistence.runTransaction("Get highest unacknowledged batch id","readonly",e=>r.mutationQueue.getHighestUnacknowledgedBatchId(e));if(-1===n)return void t.resolve();let i=e.Oa.get(n)||[];i.push(t),e.Oa.set(n,i)}catch(r){let e=aa(r,"Initialization of waitForPendingWrites() operation failed");t.reject(e)}}function aj(e,t){(e.Oa.get(t)||[]).forEach(e=>{e.resolve()}),e.Oa.delete(t)}function aq(e,t,r){let n=e.xa[e.currentUser.toKey()];if(n){let i=n.get(t);i&&(r?i.reject(r):i.resolve(),n=n.remove(t)),e.xa[e.currentUser.toKey()]=n}}function az(e,t,r=null){for(let n of(e.sharedClientState.removeLocalQueryTarget(t),e.Da.get(t)))e.ba.delete(n),r&&e.Sa.ka(n,r);e.Da.delete(t),e.isPrimaryClient&&e.Ma.Vr(t).forEach(t=>{e.Ma.containsKey(t)||aG(e,t)})}function aG(e,t){e.Ca.delete(t.path.canonicalString());let r=e.va.get(t);null!==r&&(s$(e.remoteStore,r),e.va=e.va.remove(t),e.Fa.delete(r),a$(e))}function aK(e,t,r){for(let n of r)n instanceof a_?(e.Ma.addReference(n.key,t),function(e,t){let r=t.key,n=r.path.canonicalString();e.va.get(r)||e.Ca.has(n)||(_("SyncEngine","New document in limbo: "+r),e.Ca.add(n),a$(e))}(e,n)):n instanceof aE?(_("SyncEngine","Document no longer in limbo: "+n.key),e.Ma.removeReference(n.key,t),e.Ma.containsKey(n.key)||aG(e,n.key)):x()}function a$(e){for(;e.Ca.size>0&&e.va.size<e.maxConcurrentLimboResolutions;){let t=e.Ca.values().next().value;e.Ca.delete(t);let r=new W($.fromString(t)),n=e.Na.next();e.Fa.set(n,new ax(r)),e.va=e.va.insert(r,n),sK(e.remoteStore,new nP(t8(t6(r.path)),n,"TargetPurposeLimboResolution",e_.oe))}}async function aH(e,t,r){let n=[],i=[],s=[];e.ba.isEmpty()||(e.ba.forEach((a,o)=>{s.push(e.Ba(o,t,r).then(t=>{var s;if((t||r)&&e.isPrimaryClient){let n=t?!t.fromCache:null===(s=null==r?void 0:r.targetChanges.get(o.targetId))||void 0===s?void 0:s.current;e.sharedClientState.updateQueryState(o.targetId,n?"current":"not-current")}if(t){n.push(t);let e=se.Ki(o.targetId,t);i.push(e)}}))}),await Promise.all(s),e.Sa.h_(n),await async function(e,t){try{await e.persistence.runTransaction("notifyLocalViewChanges","readwrite",r=>eu.forEach(t,t=>eu.forEach(t.qi,n=>e.persistence.referenceDelegate.addReference(r,t.targetId,n)).next(()=>eu.forEach(t.Qi,n=>e.persistence.referenceDelegate.removeReference(r,t.targetId,n)))))}catch(e){if(!em(e))throw e;_("LocalStore","Failed to update sequence numbers: "+e)}for(let r of t){let t=r.targetId;if(!r.fromCache){let r=e.ns.get(t),n=r.snapshotVersion,i=r.withLastLimboFreeSnapshotVersion(n);e.ns=e.ns.insert(t,i)}}}(e.localStore,i))}async function aQ(e,t){if(!e.currentUser.isEqual(t)){_("SyncEngine","User change. New user:",t.toKey());let r=await si(e.localStore,t);e.currentUser=t,e.Oa.forEach(e=>{e.forEach(e=>{e.reject(new D(C.CANCELLED,"'waitForPendingWrites' promise is rejected due to a user change."))})}),e.Oa.clear(),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await aH(e,r.us)}}function aW(e,t){let r=e.Fa.get(t);if(r&&r.wa)return ry().add(r.key);{let r=ry(),n=e.Da.get(t);if(!n)return r;for(let t of n){let n=e.ba.get(t);r=r.unionWith(n.view.Ea)}return r}}async function aJ(e,t){let r=await su(e.localStore,t.query,!0),n=t.view.pa(r);return e.isPrimaryClient&&aK(e,t.targetId,n.fa),n}async function aY(e,t){return sh(e.localStore,t).then(t=>aH(e,t))}async function aX(e,t,r,n){let i=await function(e,t){let r=e.mutationQueue;return e.persistence.runTransaction("Lookup mutation documents","readonly",n=>r.vn(n,t).next(t=>t?e.localDocuments.getDocuments(n,t):eu.resolve(null)))}(e.localStore,t);null!==i?("pending"===r?await s6(e.remoteStore):"acknowledged"===r||"rejected"===r?(aq(e,t,n||null),aj(e,t),function(e,t){e.mutationQueue.Mn(t)}(e.localStore,t)):x(),await aH(e,i)):_("SyncEngine","Cannot apply mutation batch with id: "+t)}async function aZ(e,t){if(a9(e),a5(e),!0===t&&!0!==e.La){let t=e.sharedClientState.getAllActiveQueryTargets(),r=await a0(e,t.toArray());for(let t of(e.La=!0,await ar(e.remoteStore,!0),r))sK(e.remoteStore,t)}else if(!1===t&&!1!==e.La){let t=[],r=Promise.resolve();e.Da.forEach((n,i)=>{e.sharedClientState.isLocalQueryTarget(i)?t.push(i):r=r.then(()=>(az(e,i),sl(e.localStore,i,!0))),s$(e.remoteStore,i)}),await r,await a0(e,t),e.Fa.forEach((t,r)=>{s$(e.remoteStore,r)}),e.Ma.mr(),e.Fa=new Map,e.va=new e0(W.comparator),e.La=!1,await ar(e.remoteStore,!1)}}async function a0(e,t,r){let n=[],i=[];for(let r of t){let t;let s=e.Da.get(r);if(s&&0!==s.length)for(let r of(t=await so(e.localStore,t8(s[0])),s)){let t=e.ba.get(r),n=await aJ(e,t);n.snapshot&&i.push(n.snapshot)}else{let n=await sc(e.localStore,r);t=await so(e.localStore,n),await ak(e,a1(n),r,!1,t.resumeToken)}n.push(t)}return e.Sa.h_(i),n}function a1(e){var t,r,n,i,s,a,o;return t=e.path,r=e.collectionGroup,n=e.orderBy,i=e.filters,s=e.limit,a=e.startAt,o=e.endAt,new t4(t,r,n,i,s,"F",a,o)}function a2(e){return e.localStore.persistence.Bi()}async function a4(e,t,r,n){if(e.La)return void _("SyncEngine","Ignoring unexpected query state notification.");let i=e.Da.get(t);if(i&&i.length>0)switch(r){case"current":case"not-current":{let n=await sh(e.localStore,ro(i[0])),s=r3.createSynthesizedRemoteEventForCurrentChange(t,"current"===r,e7.EMPTY_BYTE_STRING);await aH(e,n,s);break}case"rejected":await sl(e.localStore,t,!0),az(e,t,n);break;default:x()}}async function a6(e,t,r){let n=a9(e);if(n.La){for(let e of t){if(n.Da.has(e)&&n.sharedClientState.isActiveQueryTarget(e)){_("SyncEngine","Adding an already active target "+e);continue}let t=await sc(n.localStore,e),r=await so(n.localStore,t);await ak(n,a1(t),r.targetId,!1,r.resumeToken),sK(n.remoteStore,r)}for(let e of r)n.Da.has(e)&&await sl(n.localStore,e,!1).then(()=>{s$(n.remoteStore,e),az(n,e)}).catch(el)}}function a9(e){return e.remoteStore.remoteSyncer.applyRemoteEvent=aL.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=aW.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=aF.bind(null,e),e.Sa.h_=ap.bind(null,e.eventManager),e.Sa.ka=am.bind(null,e.eventManager),e}function a5(e){return e.remoteStore.remoteSyncer.applySuccessfulWrite=aU.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=aV.bind(null,e),e}class a3{constructor(){this.synchronizeTabs=!1}async initialize(e){this.serializer=sL(e.databaseInfo.databaseId),this.sharedClientState=this.createSharedClientState(e),this.persistence=this.createPersistence(e),await this.persistence.start(),this.localStore=this.createLocalStore(e),this.gcScheduler=this.createGarbageCollectionScheduler(e,this.localStore),this.indexBackfillerScheduler=this.createIndexBackfillerScheduler(e,this.localStore)}createGarbageCollectionScheduler(e,t){return null}createIndexBackfillerScheduler(e,t){return null}createLocalStore(e){var t,r,n,i;return t=this.persistence,r=new sr,n=e.initialUser,i=this.serializer,new sn(t,r,n,i)}createPersistence(e){return new iZ(i1.Hr,this.serializer)}createSharedClientState(e){return new sT}async terminate(){var e,t;null===(e=this.gcScheduler)||void 0===e||e.stop(),null===(t=this.indexBackfillerScheduler)||void 0===t||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}class a8 extends a3{constructor(e){super(),this.cacheSizeBytes=e}createGarbageCollectionScheduler(e,t){this.persistence.referenceDelegate instanceof i2||x();let r=this.persistence.referenceDelegate.garbageCollector;return new ik(r,e.asyncQueue,t)}createPersistence(e){let t=void 0!==this.cacheSizeBytes?ig.withCacheSize(this.cacheSizeBytes):ig.DEFAULT;return new iZ(e=>i2.Hr(e,t),this.serializer)}}class a7 extends a3{constructor(e,t,r){super(),this.Qa=e,this.cacheSizeBytes=t,this.forceOwnership=r,this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Qa.initialize(this,e),await a5(this.Qa.syncEngine),await s6(this.Qa.remoteStore),await this.persistence.fi(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}createLocalStore(e){var t,r,n,i;return t=this.persistence,r=new sr,n=e.initialUser,i=this.serializer,new sn(t,r,n,i)}createGarbageCollectionScheduler(e,t){let r=this.persistence.referenceDelegate.garbageCollector;return new ik(r,e.asyncQueue,t)}createIndexBackfillerScheduler(e,t){let r=new eI(t,this.persistence);return new eb(e.asyncQueue,r)}createPersistence(e){let t=i7(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),r=void 0!==this.cacheSizeBytes?ig.withCacheSize(this.cacheSizeBytes):ig.DEFAULT;return new i5(this.synchronizeTabs,t,e.clientId,r,e.asyncQueue,sR(),sP(),this.serializer,this.sharedClientState,!!this.forceOwnership)}createSharedClientState(e){return new sT}}class oe extends a7{constructor(e,t){super(e,t,!1),this.Qa=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);let t=this.Qa.syncEngine;this.sharedClientState instanceof sE&&(this.sharedClientState.syncEngine={Zs:aX.bind(null,t),Xs:a4.bind(null,t),eo:a6.bind(null,t),Bi:a2.bind(null,t),Ys:aY.bind(null,t)},await this.sharedClientState.start()),await this.persistence.fi(async e=>{await aZ(this.Qa.syncEngine,e),this.gcScheduler&&(e&&!this.gcScheduler.started?this.gcScheduler.start():e||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(e&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():e||this.indexBackfillerScheduler.stop())})}createSharedClientState(e){let t=sR();if(!sE.D(t))throw new D(C.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");let r=i7(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new sE(t,e.asyncQueue,r,e.clientId,e.initialUser)}}class ot{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>aM(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=aQ.bind(null,this.syncEngine),await ar(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new ah}createDatastore(e){var t,r,n;let i=sL(e.databaseInfo.databaseId),s=(t=e.databaseInfo,new sO(t));return r=e.authCredentials,n=e.appCheckCredentials,new sB(r,n,s,i)}createRemoteStore(e){var t,r,n,i;return t=this.localStore,r=this.datastore,n=e.asyncQueue,i=sx.D()?new sx:new sS,new sq(t,r,n,e=>aM(this.syncEngine,e,0),i)}createSyncEngine(e,t){return function(e,t,r,n,i,s,a){let o=new aA(e,t,r,n,i,s);return a&&(o.La=!0),o}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e;await async function(e){_("RemoteStore","RemoteStore shutting down."),e.M_.add(5),await sG(e),e.O_.shutdown(),e.N_.set("Unknown")}(this.remoteStore),null===(e=this.datastore)||void 0===e||e.terminate()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function or(e,t=10240){let r=0;return{async read(){if(r<e.byteLength){let n={value:e.slice(r,r+t),done:!1};return r+=t,n}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on{constructor(e){this.observer=e,this.muted=!1}next(e){this.observer.next&&this.Ka(this.observer.next,e)}error(e){this.observer.error?this.Ka(this.observer.error,e):E("Uncaught Error in snapshot listener:",e.toString())}$a(){this.muted=!0}Ka(e,t){this.muted||setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oi{constructor(e,t){this.Ua=e,this.serializer=t,this.metadata=new N,this.buffer=new Uint8Array,this.Wa=new TextDecoder("utf-8"),this.Ga().then(e=>{e&&e.sa()?this.metadata.resolve(e.ia.metadata):this.metadata.reject(Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(null==e?void 0:e.ia)}`))},e=>this.metadata.reject(e))}close(){return this.Ua.cancel()}async getMetadata(){return this.metadata.promise}async qa(){return await this.getMetadata(),this.Ga()}async Ga(){let e=await this.za();if(null===e)return null;let t=this.Wa.decode(e),r=Number(t);isNaN(r)&&this.ja(`length string (${t}) is not valid number`);let n=await this.Ha(r);return new av(JSON.parse(n),e.length+r)}Ja(){return this.buffer.findIndex(e=>123===e)}async za(){for(;0>this.Ja()&&!await this.Ya(););if(0===this.buffer.length)return null;let e=this.Ja();e<0&&this.ja("Reached the end of bundle when a length string is expected.");let t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async Ha(e){for(;this.buffer.length<e;)await this.Ya()&&this.ja("Reached the end of bundle when more is expected.");let t=this.Wa.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}ja(e){throw this.Ua.cancel(),Error(`Invalid bundle format: ${e}`)}async Ya(){let e=await this.Ua.read();if(!e.done){let t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class os{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new D(C.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;let t=await async function(e,t){let r={documents:t.map(t=>ny(e.serializer,t))},n=await e.xo("BatchGetDocuments",e.serializer.databaseId,$.emptyPath(),r,t.length),i=new Map;n.forEach(t=>{var r;let n=(r=e.serializer,"found"in t?function(e,t){t.found||x(),t.found.name,t.found.updateTime;let r=nv(e,t.found.name),n=nf(t.found.updateTime),i=t.found.createTime?nf(t.found.createTime):G.min(),s=new tA({mapValue:{fields:t.found.fields}});return tC.newFoundDocument(r,n,i,s)}(r,t):"missing"in t?function(e,t){t.missing||x(),t.readTime||x();let r=nv(e,t.missing),n=nf(t.readTime);return tC.newNoDocument(r,n)}(r,t):x());i.set(n.key.toString(),n)});let s=[];return t.forEach(e=>{let t=i.get(e.toString());t||x(),s.push(t)}),s}(this.datastore,e);return t.forEach(e=>this.recordVersion(e)),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(e){this.lastTransactionError=e}this.writtenDocs.add(e.toString())}delete(e){this.write(new rK(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;let e=this.readVersions;this.mutations.forEach(t=>{e.delete(t.key.toString())}),e.forEach((e,t)=>{let r=W.fromPath(t);this.mutations.push(new r$(r,this.precondition(r)))}),await async function(e,t){let r={writes:t.map(t=>nS(e.serializer,t))};await e.Co("Commit",e.serializer.databaseId,$.emptyPath(),r)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw x();t=G.min()}let r=this.readVersions.get(e.key.toString());if(r){if(!t.isEqual(r))throw new D(C.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){let t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(G.min())?rP.exists(!1):rP.updateTime(t):rP.none()}preconditionForUpdate(e){let t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(G.min()))throw new D(C.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return rP.updateTime(t)}return rP.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oa{constructor(e,t,r,n,i){this.asyncQueue=e,this.datastore=t,this.options=r,this.updateFunction=n,this.deferred=i,this.Za=r.maxAttempts,this.Yo=new sM(this.asyncQueue,"transaction_retry")}Xa(){this.Za-=1,this.eu()}eu(){this.Yo.$o(async()=>{let e=new os(this.datastore),t=this.tu(e);t&&t.then(t=>{this.asyncQueue.enqueueAndForget(()=>e.commit().then(()=>{this.deferred.resolve(t)}).catch(e=>{this.nu(e)}))}).catch(e=>{this.nu(e)})})}tu(e){try{let t=this.updateFunction(e);return!eE(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(e){return this.deferred.reject(e),null}}nu(e){this.Za>0&&this.ru(e)?(this.Za-=1,this.asyncQueue.enqueueAndForget(()=>(this.eu(),Promise.resolve()))):this.deferred.reject(e)}ru(e){if("FirebaseError"===e.name){let t=e.code;return"aborted"===t||"failed-precondition"===t||"already-exists"===t||!rX(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oo{constructor(e,t,r,n){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=n,this.user=y.UNAUTHENTICATED,this.clientId=B.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(r,async e=>{_("FirestoreClient","Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(r,e=>(_("FirestoreClient","Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new D(C.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();let e=new N;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(r){let t=aa(r,"Failed to shutdown persistence");e.reject(t)}}),e.promise}}async function ol(e,t){e.asyncQueue.verifyOperationInProgress(),_("FirestoreClient","Initializing OfflineComponentProvider");let r=e.configuration;await t.initialize(r);let n=r.initialUser;e.setCredentialChangeListener(async e=>{n.isEqual(e)||(await si(t.localStore,e),n=e)}),t.persistence.setDatabaseDeletedListener(()=>e.terminate()),e._offlineComponents=t}async function ou(e,t){e.asyncQueue.verifyOperationInProgress();let r=await oh(e);_("FirestoreClient","Initializing OnlineComponentProvider"),await t.initialize(r,e.configuration),e.setCredentialChangeListener(e=>at(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,r)=>at(t.remoteStore,r)),e._onlineComponents=t}function oc(e){return"FirebaseError"===e.name?e.code===C.FAILED_PRECONDITION||e.code===C.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&e instanceof DOMException)||22===e.code||20===e.code||11===e.code}async function oh(e){if(!e._offlineComponents){if(e._uninitializedComponentsProvider){_("FirestoreClient","Using user provided OfflineComponentProvider");try{await ol(e,e._uninitializedComponentsProvider._offline)}catch(t){if(!oc(t))throw t;T("Error using user provided cache. Falling back to memory cache: "+t),await ol(e,new a3)}}else _("FirestoreClient","Using default OfflineComponentProvider"),await ol(e,new a3)}return e._offlineComponents}async function od(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(_("FirestoreClient","Using user provided OnlineComponentProvider"),await ou(e,e._uninitializedComponentsProvider._online)):(_("FirestoreClient","Using default OnlineComponentProvider"),await ou(e,new ot))),e._onlineComponents}function of(e){return oh(e).then(e=>e.persistence)}function op(e){return oh(e).then(e=>e.localStore)}function om(e){return od(e).then(e=>e.remoteStore)}function og(e){return od(e).then(e=>e.syncEngine)}function oy(e){return od(e).then(e=>e.datastore)}async function ov(e){let t=await od(e),r=t.eventManager;return r.onListen=aC.bind(null,t.syncEngine),r.onUnlisten=aO.bind(null,t.syncEngine),r.onFirstRemoteStoreListen=aD.bind(null,t.syncEngine),r.onLastRemoteStoreUnlisten=aR.bind(null,t.syncEngine),r}function ow(e,t,r={}){let n=new N;return e.asyncQueue.enqueueAndForget(async()=>(function(e,t,r,n,i){let s=new on({next:s=>{t.enqueueAndForget(()=>af(e,a));let o=s.docs.has(r);!o&&s.fromCache?i.reject(new D(C.UNAVAILABLE,"Failed to get document because the client is offline.")):o&&s.fromCache&&n&&"server"===n.source?i.reject(new D(C.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):i.resolve(s)},error:e=>i.reject(e)}),a=new ay(t6(r.path),s,{includeMetadataChanges:!0,ra:!0});return ad(e,a)})(await ov(e),e.asyncQueue,t,r,n)),n.promise}function ob(e,t,r={}){let n=new N;return e.asyncQueue.enqueueAndForget(async()=>(function(e,t,r,n,i){let s=new on({next:r=>{t.enqueueAndForget(()=>af(e,a)),r.fromCache&&"server"===n.source?i.reject(new D(C.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):i.resolve(r)},error:e=>i.reject(e)}),a=new ay(r,s,{includeMetadataChanges:!0,ra:!0});return ad(e,a)})(await ov(e),e.asyncQueue,t,r,n)),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oI(e){let t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let o_=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oE(e,t,r){if(!r)throw new D(C.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function oT(e,t,r,n){if(!0===t&&!0===n)throw new D(C.INVALID_ARGUMENT,`${e} and ${r} cannot be used together.`)}function oS(e){if(!W.isDocumentKey(e))throw new D(C.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function ox(e){if(W.isDocumentKey(e))throw new D(C.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function oA(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{var t;let r=(t=e).constructor?t.constructor.name:null;return r?`a custom ${r} object`:"an object"}}return"function"==typeof e?"a function":x()}function oC(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new D(C.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let r=oA(e);throw new D(C.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${r}`)}}return e}function oD(e,t){if(t<=0)throw new D(C.INVALID_ARGUMENT,`Function ${e}() requires a positive number, but it was: ${t}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oN{constructor(e){var t,r;if(void 0===e.host){if(void 0!==e.ssl)throw new D(C.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=null===(t=e.ssl)||void 0===t||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new D(C.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}oT("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=oI(null!==(r=e.experimentalLongPollingOptions)&&void 0!==r?r:{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new D(C.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new D(C.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new D(C.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){var t,r;return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,r=e.experimentalLongPollingOptions,t.timeoutSeconds===r.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class ok{constructor(e,t,r,n){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=n,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new oN({}),this._settingsFrozen=!1}get app(){if(!this._app)throw new D(C.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return void 0!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new D(C.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new oN(e),void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new O;switch(e.type){case"firstParty":return new M(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new D(C.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){let t=o_.get(e);t&&(_("ComponentProvider","Removing Datastore"),o_.delete(e),t.terminate())}(this),Promise.resolve()}}function oO(e,t,r,n={}){var i;let s=(e=oC(e,ok))._getSettings(),a=`${t}:${r}`;if("firestore.googleapis.com"!==s.host&&s.host!==a&&T("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),e._setSettings(Object.assign(Object.assign({},s),{host:a,ssl:!1})),n.mockUserToken){let t,r;if("string"==typeof n.mockUserToken)t=n.mockUserToken,r=y.MOCK_USER;else{t=(0,h.createMockUserToken)(n.mockUserToken,null===(i=e._app)||void 0===i?void 0:i.options.projectId);let s=n.mockUserToken.sub||n.mockUserToken.user_id;if(!s)throw new D(C.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");r=new y(s)}e._authCredentials=new R(new k(t,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oR{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new oR(this.firestore,e,this._query)}}class oP{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new oL(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new oP(this.firestore,e,this._key)}}class oL extends oR{constructor(e,t,r){super(e,t,t6(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new oP(this.firestore,null,new W(e))}withConverter(e){return new oL(this.firestore,e,this._path)}}function oM(e,t,...r){if(e=(0,h.getModularInstance)(e),oE("collection","path",t),e instanceof ok){let n=$.fromString(t,...r);return ox(n),new oL(e,null,n)}{if(!(e instanceof oP||e instanceof oL))throw new D(C.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let n=e._path.child($.fromString(t,...r));return ox(n),new oL(e.firestore,null,n)}}function oF(e,t){if(e=oC(e,ok),oE("collectionGroup","collection id",t),t.indexOf("/")>=0)throw new D(C.INVALID_ARGUMENT,`Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new oR(e,null,new t4($.emptyPath(),t))}function oU(e,t,...r){if(e=(0,h.getModularInstance)(e),1==arguments.length&&(t=B.newId()),oE("doc","path",t),e instanceof ok){let n=$.fromString(t,...r);return oS(n),new oP(e,null,new W(n))}{if(!(e instanceof oP||e instanceof oL))throw new D(C.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let n=e._path.child($.fromString(t,...r));return oS(n),new oP(e.firestore,e instanceof oL?e.converter:null,new W(n))}}function oV(e,t){return e=(0,h.getModularInstance)(e),t=(0,h.getModularInstance)(t),(e instanceof oP||e instanceof oL)&&(t instanceof oP||t instanceof oL)&&e.firestore===t.firestore&&e.path===t.path&&e.converter===t.converter}function oB(e,t){return e=(0,h.getModularInstance)(e),t=(0,h.getModularInstance)(t),e instanceof oR&&t instanceof oR&&e.firestore===t.firestore&&rn(e._query,t._query)&&e.converter===t.converter}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oj{constructor(){this.iu=Promise.resolve(),this.su=[],this.ou=!1,this._u=[],this.au=null,this.uu=!1,this.cu=!1,this.lu=[],this.Yo=new sM(this,"async_queue_retry"),this.hu=()=>{let e=sP();e&&_("AsyncQueue","Visibility state changed to "+e.visibilityState),this.Yo.Wo()};let e=sP();e&&"function"==typeof e.addEventListener&&e.addEventListener("visibilitychange",this.hu)}get isShuttingDown(){return this.ou}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Pu(),this.Iu(e)}enterRestrictedMode(e){if(!this.ou){this.ou=!0,this.cu=e||!1;let t=sP();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this.hu)}}enqueue(e){if(this.Pu(),this.ou)return new Promise(()=>{});let t=new N;return this.Iu(()=>this.ou&&this.cu?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.su.push(e),this.Tu()))}async Tu(){if(0!==this.su.length){try{await this.su[0](),this.su.shift(),this.Yo.reset()}catch(e){if(!em(e))throw e;_("AsyncQueue","Operation failed with retryable error: "+e)}this.su.length>0&&this.Yo.$o(()=>this.Tu())}}Iu(e){let t=this.iu.then(()=>(this.uu=!0,e().catch(e=>{let t;this.au=e,this.uu=!1;let r=(t=e.message||"",e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t);throw E("INTERNAL UNHANDLED ERROR: ",r),e}).then(e=>(this.uu=!1,e))));return this.iu=t,t}enqueueAfterDelay(e,t,r){this.Pu(),this.lu.indexOf(e)>-1&&(t=0);let n=as.createAndSchedule(this,e,t,r,e=>this.Eu(e));return this._u.push(n),n}Pu(){this.au&&x()}verifyOperationInProgress(){}async du(){let e;do e=this.iu,await e;while(e!==this.iu)}Au(e){for(let t of this._u)if(t.timerId===e)return!0;return!1}Ru(e){return this.du().then(()=>{for(let t of(this._u.sort((e,t)=>e.targetTimeMs-t.targetTimeMs),this._u))if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.du()})}Vu(e){this.lu.push(e)}Eu(e){let t=this._u.indexOf(e);this._u.splice(t,1)}}function oq(e){return function(e,t){if("object"!=typeof e||null===e)return!1;for(let r of t)if(r in e&&"function"==typeof e[r])return!0;return!1}(e,["next","error","complete"])}class oz{constructor(){this._progressObserver={},this._taskCompletionResolver=new N,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,r){this._progressObserver={next:e,error:t,complete:r}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let oG=-1;class oK extends ok{constructor(e,t,r,n){super(e,t,r,n),this.type="firestore",this._queue=new oj,this._persistenceKey=(null==n?void 0:n.name)||"[DEFAULT]"}_terminate(){return this._firestoreClient||oW(this),this._firestoreClient.terminate()}}function o$(e,t,r){r||(r="(default)");let n=(0,l._getProvider)(e,"firestore");if(n.isInitialized(r)){let e=n.getImmediate({identifier:r}),i=n.getOptions(r);if((0,h.deepEqual)(i,t))return e;throw new D(C.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(void 0!==t.cacheSizeBytes&&void 0!==t.localCache)throw new D(C.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(void 0!==t.cacheSizeBytes&&-1!==t.cacheSizeBytes&&t.cacheSizeBytes<1048576)throw new D(C.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return n.initialize({options:t,instanceIdentifier:r})}function oH(e,t){let r="object"==typeof e?e:(0,l.getApp)(),n=(0,l._getProvider)(r,"firestore").getImmediate({identifier:"string"==typeof e?e:t||"(default)"});if(!n._initialized){let e=(0,h.getDefaultEmulatorHostnameAndPort)("firestore");e&&oO(n,...e)}return n}function oQ(e){return e._firestoreClient||oW(e),e._firestoreClient.verifyNotTerminated(),e._firestoreClient}function oW(e){var t,r,n,i,s,a;let o=e._freezeSettings(),l=(i=e._databaseId,s=(null===(t=e._app)||void 0===t?void 0:t.options.appId)||"",a=e._persistenceKey,new to(i,s,a,o.host,o.ssl,o.experimentalForceLongPolling,o.experimentalAutoDetectLongPolling,oI(o.experimentalLongPollingOptions),o.useFetchStreams));e._firestoreClient=new oo(e._authCredentials,e._appCheckCredentials,e._queue,l),(null===(r=o.localCache)||void 0===r?void 0:r._offlineComponentProvider)&&(null===(n=o.localCache)||void 0===n?void 0:n._onlineComponentProvider)&&(e._firestoreClient._uninitializedComponentsProvider={_offlineKind:o.localCache.kind,_offline:o.localCache._offlineComponentProvider,_online:o.localCache._onlineComponentProvider})}function oJ(e,t){o5(e=oC(e,oK));let r=oQ(e);if(r._uninitializedComponentsProvider)throw new D(C.FAILED_PRECONDITION,"SDK cache is already specified.");T("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");let n=e._freezeSettings(),i=new ot;return oX(r,i,new a7(i,n.cacheSizeBytes,null==t?void 0:t.forceOwnership))}function oY(e){o5(e=oC(e,oK));let t=oQ(e);if(t._uninitializedComponentsProvider)throw new D(C.FAILED_PRECONDITION,"SDK cache is already specified.");T("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");let r=e._freezeSettings(),n=new ot;return oX(t,n,new oe(n,r.cacheSizeBytes))}function oX(e,t,r){let n=new N;return e.asyncQueue.enqueue(async()=>{try{await ol(e,r),await ou(e,t),n.resolve()}catch(e){if(!oc(e))throw e;T("Error enabling indexeddb cache. Falling back to memory cache: "+e),n.reject(e)}}).then(()=>n.promise)}function oZ(e){if(e._initialized&&!e._terminated)throw new D(C.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");let t=new N;return e._queue.enqueueAndForgetEvenWhileRestricted(async()=>{try{await async function(e){if(!eh.D())return Promise.resolve();await eh.delete(e+"main")}(i7(e._databaseId,e._persistenceKey)),t.resolve()}catch(e){t.reject(e)}}),t.promise}function o0(e){return function(e){let t=new N;return e.asyncQueue.enqueueAndForget(async()=>aB(await og(e),t)),t.promise}(oQ(e=oC(e,oK)))}function o1(e){var t;return(t=oQ(e=oC(e,oK))).asyncQueue.enqueue(async()=>{let e=await of(t),r=await om(t);return e.setNetworkEnabled(!0),r.M_.delete(0),sz(r)})}function o2(e){var t;return(t=oQ(e=oC(e,oK))).asyncQueue.enqueue(async()=>{let e=await of(t),r=await om(t);return e.setNetworkEnabled(!1),async function(e){e.M_.add(0),await sG(e),e.N_.set("Offline")}(r)})}function o4(e){return(0,l._removeServiceInstance)(e.app,"firestore",e._databaseId.database),e._delete()}function o6(e,t){let r=oQ(e=oC(e,oK)),n=new oz;return function(e,t,r,n){var i,s;let a=(i=sL(t),s=function(e,t){if(e instanceof Uint8Array)return or(e,t);if(e instanceof ArrayBuffer)return or(new Uint8Array(e),t);if(e instanceof ReadableStream)return e.getReader();throw Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}("string"==typeof r?r1().encode(r):r),new oi(s,i));e.asyncQueue.enqueueAndForget(async()=>{!function(e,t,r){(async function(e,t,r){try{var n;let i=await t.getMetadata();if(await function(e,t){let r=nf(t.createTime);return e.persistence.runTransaction("hasNewerBundle","readonly",r=>e.$r.getBundleMetadata(r,t.id)).then(e=>!!e&&e.createTime.compareTo(r)>=0)}(e.localStore,i))return await t.close(),r._completeWith({taskState:"Success",documentsLoaded:i.totalDocuments,bytesLoaded:i.totalBytes,totalDocuments:i.totalDocuments,totalBytes:i.totalBytes}),Promise.resolve(new Set);r._updateProgress(aI(i));let s=new ab(i,e.localStore,t.serializer),a=await t.qa();for(;a;){let e=await s._a(a);e&&r._updateProgress(e),a=await t.qa()}let o=await s.complete();return await aH(e,o.ca,void 0),await (n=e.localStore).persistence.runTransaction("Save bundle","readwrite",e=>n.$r.saveBundleMetadata(e,i)),r._completeWith(o.progress),Promise.resolve(o.ua)}catch(e){return T("SyncEngine",`Loading bundle failed with ${e}`),r._failWith(e),Promise.resolve(new Set)}})(e,t,r).then(t=>{e.sharedClientState.notifyBundleLoaded(t)})}(await og(e),a,n)})}(r,e._databaseId,t,n),n}function o9(e,t){var r;return(r=oQ(e=oC(e,oK))).asyncQueue.enqueue(async()=>{var e;return(e=await op(r)).persistence.runTransaction("Get named query","readonly",r=>e.$r.getNamedQuery(r,t))}).then(t=>t?new oR(e,null,t.query):null)}function o5(e){if(e._initialized||e._terminated)throw new D(C.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o3{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class o8{constructor(e,t,r){this._userDataWriter=t,this._data=r,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o7{constructor(e){this._byteString=e}static fromBase64String(e){try{return new o7(e7.fromBase64String(e))}catch(e){throw new D(C.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(e){return new o7(e7.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new D(C.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Q(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function lt(){return new le("__name__")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lr{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ln{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new D(C.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new D(C.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return j(this._lat,e._lat)||j(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let li=/^__.*__$/;class ls{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return null!==this.fieldMask?new rj(e,this.data,this.fieldMask,t,this.fieldTransforms):new rB(e,this.data,t,this.fieldTransforms)}}class la{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new rj(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function lo(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw x()}}class ll{constructor(e,t,r,n,i,s){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=n,void 0===i&&this.mu(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get fu(){return this.settings.fu}gu(e){return new ll(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}pu(e){var t;let r=null===(t=this.path)||void 0===t?void 0:t.child(e),n=this.gu({path:r,yu:!1});return n.wu(e),n}Su(e){var t;let r=null===(t=this.path)||void 0===t?void 0:t.child(e),n=this.gu({path:r,yu:!1});return n.mu(),n}bu(e){return this.gu({path:void 0,yu:!0})}Du(e){return lC(e,this.settings.methodName,this.settings.Cu||!1,this.path,this.settings.vu)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}mu(){if(this.path)for(let e=0;e<this.path.length;e++)this.wu(this.path.get(e))}wu(e){if(0===e.length)throw this.Du("Document fields must not be empty");if(lo(this.fu)&&li.test(e))throw this.Du('Document fields cannot begin and end with "__"')}}class lu{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||sL(e)}Fu(e,t,r,n=!1){return new ll({fu:e,methodName:t,vu:r,path:Q.emptyPath(),yu:!1,Cu:n},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function lc(e){let t=e._freezeSettings(),r=sL(e._databaseId);return new lu(e._databaseId,!!t.ignoreUndefinedProperties,r)}function lh(e,t,r,n,i,s={}){let a,o;let l=e.Fu(s.merge||s.mergeFields?2:0,t,r,i);lT("Data must be an object, but it was:",l,n);let u=l_(n,l);if(s.merge)a=new e5(l.fieldMask),o=l.fieldTransforms;else if(s.mergeFields){let e=[];for(let n of s.mergeFields){let i=lS(t,n,r);if(!l.contains(i))throw new D(C.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);lD(e,i)||e.push(i)}a=new e5(e),o=l.fieldTransforms.filter(e=>a.covers(e.field))}else a=null,o=l.fieldTransforms;return new ls(new tA(u),a,o)}class ld extends lr{_toFieldTransform(e){if(2!==e.fu)throw 1===e.fu?e.Du(`${this._methodName}() can only appear at the top level of your update data`):e.Du(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof ld}}function lf(e,t,r){return new ll({fu:3,vu:t.settings.vu,methodName:e._methodName,yu:r},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class lp extends lr{_toFieldTransform(e){return new rO(e.path,new rT)}isEqual(e){return e instanceof lp}}class lm extends lr{constructor(e,t){super(e),this.Mu=t}_toFieldTransform(e){let t=lf(this,e,!0),r=this.Mu.map(e=>lI(e,t)),n=new rS(r);return new rO(e.path,n)}isEqual(e){return e instanceof lm&&(0,h.deepEqual)(this.Mu,e.Mu)}}class lg extends lr{constructor(e,t){super(e),this.Mu=t}_toFieldTransform(e){let t=lf(this,e,!0),r=this.Mu.map(e=>lI(e,t)),n=new rA(r);return new rO(e.path,n)}isEqual(e){return e instanceof lg&&(0,h.deepEqual)(this.Mu,e.Mu)}}class ly extends lr{constructor(e,t){super(e),this.xu=t}_toFieldTransform(e){let t=new rD(e.serializer,rI(e.serializer,this.xu));return new rO(e.path,t)}isEqual(e){return e instanceof ly&&this.xu===e.xu}}function lv(e,t,r,n){let i=e.Fu(1,t,r);lT("Data must be an object, but it was:",i,n);let s=[],a=tA.empty();eY(n,(e,n)=>{let o=lA(t,e,r);n=(0,h.getModularInstance)(n);let l=i.Su(o);if(n instanceof ld)s.push(o);else{let e=lI(n,l);null!=e&&(s.push(o),a.set(o,e))}});let o=new e5(s);return new la(a,o,i.fieldTransforms)}function lw(e,t,r,n,i,s){let a=e.Fu(1,t,r),o=[lS(t,n,r)],l=[i];if(s.length%2!=0)throw new D(C.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let e=0;e<s.length;e+=2)o.push(lS(t,s[e])),l.push(s[e+1]);let u=[],c=tA.empty();for(let e=o.length-1;e>=0;--e)if(!lD(u,o[e])){let t=o[e],r=l[e];r=(0,h.getModularInstance)(r);let n=a.Su(t);if(r instanceof ld)u.push(t);else{let e=lI(r,n);null!=e&&(u.push(t),c.set(t,e))}}let d=new e5(u);return new la(c,d,a.fieldTransforms)}function lb(e,t,r,n=!1){return lI(r,e.Fu(n?4:3,t))}function lI(e,t){if(lE(e=(0,h.getModularInstance)(e)))return lT("Unsupported field value:",t,e),l_(e,t);if(e instanceof lr)return function(e,t){if(!lo(t.fu))throw t.Du(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.Du(`${e._methodName}() is not currently supported inside arrays`);let r=e._toFieldTransform(t);r&&t.fieldTransforms.push(r)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.yu&&4!==t.fu)throw t.Du("Nested arrays are not supported");return function(e,t){let r=[],n=0;for(let i of e){let e=lI(i,t.bu(n));null==e&&(e={nullValue:"NULL_VALUE"}),r.push(e),n++}return{arrayValue:{values:r}}}(e,t)}return function(e,t){if(null===(e=(0,h.getModularInstance)(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return rI(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){let r=z.fromDate(e);return{timestampValue:nh(t.serializer,r)}}if(e instanceof z){let r=new z(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:nh(t.serializer,r)}}if(e instanceof ln)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof o7)return{bytesValue:nd(t.serializer,e._byteString)};if(e instanceof oP){let r=t.databaseId,n=e.firestore._databaseId;if(!n.isEqual(r))throw t.Du(`Document reference is for database ${n.projectId}/${n.database} but should be for database ${r.projectId}/${r.database}`);return{referenceValue:np(e.firestore._databaseId||t.databaseId,e._key.path)}}throw t.Du(`Unsupported field value: ${oA(e)}`)}(e,t)}function l_(e,t){let r={};return eZ(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):eY(e,(e,n)=>{let i=lI(n,t.pu(e));null!=i&&(r[e]=i)}),{mapValue:{fields:r}}}function lE(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof z||e instanceof ln||e instanceof o7||e instanceof oP||e instanceof lr)}function lT(e,t,r){if(!lE(r)||!("object"==typeof r&&null!==r&&(Object.getPrototypeOf(r)===Object.prototype||null===Object.getPrototypeOf(r)))){let n=oA(r);throw"an object"===n?t.Du(e+" a custom object"):t.Du(e+" "+n)}}function lS(e,t,r){if((t=(0,h.getModularInstance)(t))instanceof le)return t._internalPath;if("string"==typeof t)return lA(e,t);throw lC("Field path arguments must be of type string or ",e,!1,void 0,r)}let lx=RegExp("[~\\*/\\[\\]]");function lA(e,t,r){if(t.search(lx)>=0)throw lC(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,r);try{return new le(...t.split("."))._internalPath}catch(n){throw lC(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,r)}}function lC(e,t,r,n,i){let s=n&&!n.isEmpty(),a=void 0!==i,o=`Function ${t}() called with invalid data`;r&&(o+=" (via `toFirestore()`)"),o+=". ";let l="";return(s||a)&&(l+=" (found",s&&(l+=` in field ${n}`),a&&(l+=` in document ${i}`),l+=")"),new D(C.INVALID_ARGUMENT,o+e+l)}function lD(e,t){return e.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lN{constructor(e,t,r,n,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=n,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new oP(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){let e=new lk(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){let t=this._document.data.field(lO("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class lk extends lN{data(){return super.data()}}function lO(e,t){return"string"==typeof t?lA(e,t):t instanceof le?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lR(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new D(C.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class lP{}class lL extends lP{}function lM(e,t,...r){let n=[];for(let i of(t instanceof lP&&n.push(t),function(e){let t=e.filter(e=>e instanceof lV).length,r=e.filter(e=>e instanceof lF).length;if(t>1||t>0&&r>0)throw new D(C.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(n=n.concat(r)),n))e=i._apply(e);return e}class lF extends lL{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new lF(e,t,r)}_apply(e){let t=this._parse(e);return l2(e._query,t),new oR(e.firestore,e.converter,rt(e._query,t))}_parse(e){let t=lc(e.firestore),r=function(e,t,r,n,i,s,a){let o;if(i.isKeyField()){if("array-contains"===s||"array-contains-any"===s)throw new D(C.INVALID_ARGUMENT,`Invalid Query. You can't perform '${s}' queries on documentId().`);if("in"===s||"not-in"===s){l1(a,s);let t=[];for(let r of a)t.push(l0(n,e,r));o={arrayValue:{values:t}}}else o=l0(n,e,a)}else"in"!==s&&"not-in"!==s&&"array-contains-any"!==s||l1(a,s),o=lb(r,t,a,"in"===s||"not-in"===s);return tP.create(i,s,o)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value);return r}}function lU(e,t,r){let n=lO("where",e);return lF._create(n,t,r)}class lV extends lP{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new lV(e,t)}_parse(e){let t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:tL.create(t,this._getOperator())}_apply(e){let t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let r=e,n=t.getFlattenedFilters();for(let e of n)l2(r,e),r=rt(r,e)}(e._query,t),new oR(e.firestore,e.converter,rt(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}function lB(...e){return e.forEach(e=>l4("or",e)),lV._create("or",e)}function lj(...e){return e.forEach(e=>l4("and",e)),lV._create("and",e)}class lq extends lL{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new lq(e,t)}_apply(e){let t=function(e,t,r){if(null!==e.startAt)throw new D(C.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new D(C.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new tO(t,r)}(e._query,this._field,this._direction);return new oR(e.firestore,e.converter,function(e,t){let r=e.explicitOrderBy.concat([t]);return new t4(e.path,e.collectionGroup,r,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function lz(e,t="asc"){let r=lO("orderBy",e);return lq._create(r,t)}class lG extends lL{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new lG(e,t,r)}_apply(e){return new oR(e.firestore,e.converter,rr(e._query,this._limit,this._limitType))}}function lK(e){return oD("limit",e),lG._create("limit",e,"F")}function l$(e){return oD("limitToLast",e),lG._create("limitToLast",e,"L")}class lH extends lL{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new lH(e,t,r)}_apply(e){var t;let r=lZ(e,this.type,this._docOrFields,this._inclusive);return new oR(e.firestore,e.converter,(t=e._query,new t4(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,r,t.endAt)))}}function lQ(...e){return lH._create("startAt",e,!0)}function lW(...e){return lH._create("startAfter",e,!1)}class lJ extends lL{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new lJ(e,t,r)}_apply(e){var t;let r=lZ(e,this.type,this._docOrFields,this._inclusive);return new oR(e.firestore,e.converter,(t=e._query,new t4(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,t.startAt,r)))}}function lY(...e){return lJ._create("endBefore",e,!1)}function lX(...e){return lJ._create("endAt",e,!0)}function lZ(e,t,r,n){if(r[0]=(0,h.getModularInstance)(r[0]),r[0]instanceof lN)return function(e,t,r,n,i){if(!n)throw new D(C.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${r}().`);let s=[];for(let r of t3(e))if(r.field.isKeyField())s.push(ty(t,n.key));else{let e=n.data.field(r.field);if(ti(e))throw new D(C.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+r.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(null===e){let e=r.field.canonicalString();throw new D(C.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${e}' (used as the orderBy) does not exist.`)}s.push(e)}return new tD(s,i)}(e._query,e.firestore._databaseId,t,r[0]._document,n);{let i=lc(e.firestore);return function(e,t,r,n,i,s){let a=e.explicitOrderBy;if(i.length>a.length)throw new D(C.INVALID_ARGUMENT,`Too many arguments provided to ${n}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);let o=[];for(let s=0;s<i.length;s++){let l=i[s];if(a[s].field.isKeyField()){if("string"!=typeof l)throw new D(C.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${n}(), but got a ${typeof l}`);if(!t5(e)&&-1!==l.indexOf("/"))throw new D(C.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${n}() must be a plain document ID, but '${l}' contains a slash.`);let r=e.path.child($.fromString(l));if(!W.isDocumentKey(r))throw new D(C.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${n}() must result in a valid document path, but '${r}' is not because it contains an odd number of segments.`);let i=new W(r);o.push(ty(t,i))}else{let e=lb(r,n,l);o.push(e)}}return new tD(o,s)}(e._query,e.firestore._databaseId,i,t,r,n)}}function l0(e,t,r){if("string"==typeof(r=(0,h.getModularInstance)(r))){if(""===r)throw new D(C.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!t5(t)&&-1!==r.indexOf("/"))throw new D(C.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${r}' contains a '/' character.`);let n=t.path.child($.fromString(r));if(!W.isDocumentKey(n))throw new D(C.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return ty(e,new W(n))}if(r instanceof oP)return ty(e,r._key);throw new D(C.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${oA(r)}.`)}function l1(e,t){if(!Array.isArray(e)||0===e.length)throw new D(C.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function l2(e,t){let r=function(e,t){for(let r of e)for(let e of r.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==r)throw r===t.op?new D(C.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new D(C.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${r.toString()}' filters.`)}function l4(e,t){if(!(t instanceof lF||t instanceof lV))throw new D(C.INVALID_ARGUMENT,`Function ${e}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}class l6{convertValue(e,t="none"){switch(th(e)){case 0:return null;case 1:return e.booleanValue;case 2:return tr(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(tn(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 10:return this.convertObject(e.mapValue,t);default:throw x()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let r={};return eY(e,(e,n)=>{r[e]=this.convertValue(n,t)}),r}convertGeoPoint(e){return new ln(tr(e.latitude),tr(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":let r=ts(e);return null==r?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(ta(e));default:return null}}convertTimestamp(e){let t=tt(e);return new z(t.seconds,t.nanos)}convertDocumentKey(e,t){let r=$.fromString(e);nR(r)||x();let n=new tl(r.get(1),r.get(3)),i=new W(r.popFirst(5));return n.isEqual(t)||E(`Document ${i} contains a document reference within a different database (${n.projectId}/${n.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function l9(e,t,r){return e?r&&(r.merge||r.mergeFields)?e.toFirestore(t,r):e.toFirestore(t):t}class l5 extends l6{constructor(e){super(),this.firestore=e}convertBytes(e){return new o7(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new oP(this.firestore,null,t)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function l3(e){return new o3("sum",lS("sum",e))}function l8(e){return new o3("avg",lS("average",e))}function l7(){return new o3("count")}function ue(e,t){var r,n;return e instanceof o3&&t instanceof o3&&e.aggregateType===t.aggregateType&&(null===(r=e._internalFieldPath)||void 0===r?void 0:r.canonicalString())===(null===(n=t._internalFieldPath)||void 0===n?void 0:n.canonicalString())}function ut(e,t){return oB(e.query,t.query)&&(0,h.deepEqual)(e.data(),t.data())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ur{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class un extends lN{constructor(e,t,r,n,i,s){super(e,t,r,n,s),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){let t=new ui(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){let r=this._document.data.field(lO("DocumentSnapshot.get",e));if(null!==r)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}}class ui extends un{data(e={}){return super.data(e)}}class us{constructor(e,t,r,n){this._firestore=e,this._userDataWriter=t,this._snapshot=n,this.metadata=new ur(n.hasPendingWrites,n.fromCache),this.query=r}get docs(){let e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(e,t){this._snapshot.docs.forEach(r=>{e.call(t,new ui(this._firestore,this._userDataWriter,r.key,r,new ur(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){let t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new D(C.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map(r=>{let n=new ui(e._firestore,e._userDataWriter,r.doc.key,r.doc,new ur(e._snapshot.mutatedKeys.has(r.doc.key),e._snapshot.fromCache),e.query.converter);return r.doc,{type:"added",doc:n,oldIndex:-1,newIndex:t++}})}{let r=e._snapshot.oldDocs;return e._snapshot.docChanges.filter(e=>t||3!==e.type).map(t=>{let n=new ui(e._firestore,e._userDataWriter,t.doc.key,t.doc,new ur(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter),i=-1,s=-1;return 0!==t.type&&(i=r.indexOf(t.doc.key),r=r.delete(t.doc.key)),1!==t.type&&(s=(r=r.add(t.doc)).indexOf(t.doc.key)),{type:function(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return x()}}(t.type),doc:n,oldIndex:i,newIndex:s}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function ua(e,t){return e instanceof un&&t instanceof un?e._firestore===t._firestore&&e._key.isEqual(t._key)&&(null===e._document?null===t._document:e._document.isEqual(t._document))&&e._converter===t._converter:e instanceof us&&t instanceof us&&e._firestore===t._firestore&&oB(e.query,t.query)&&e.metadata.isEqual(t.metadata)&&e._snapshot.isEqual(t._snapshot)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uo(e){e=oC(e,oP);let t=oC(e.firestore,oK);return ow(oQ(t),e._key).then(r=>uI(t,e,r))}class ul extends l6{constructor(e){super(),this.firestore=e}convertBytes(e){return new o7(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new oP(this.firestore,null,t)}}function uu(e){e=oC(e,oP);let t=oC(e.firestore,oK),r=oQ(t),n=new ul(t);return(function(e,t){let r=new N;return e.asyncQueue.enqueueAndForget(async()=>(async function(e,t,r){try{let n=await e.persistence.runTransaction("read document","readonly",r=>e.localDocuments.getDocument(r,t));n.isFoundDocument()?r.resolve(n):n.isNoDocument()?r.resolve(null):r.reject(new D(C.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(n){let e=aa(n,`Failed to get document '${t} from cache`);r.reject(e)}})(await op(e),t,r)),r.promise})(r,e._key).then(r=>new un(t,n,e._key,r,new ur(null!==r&&r.hasLocalMutations,!0),e.converter))}function uc(e){e=oC(e,oP);let t=oC(e.firestore,oK);return ow(oQ(t),e._key,{source:"server"}).then(r=>uI(t,e,r))}function uh(e){e=oC(e,oR);let t=oC(e.firestore,oK),r=oQ(t),n=new ul(t);return lR(e._query),ob(r,e._query).then(r=>new us(t,n,e,r))}function ud(e){e=oC(e,oR);let t=oC(e.firestore,oK),r=oQ(t),n=new ul(t);return(function(e,t){let r=new N;return e.asyncQueue.enqueueAndForget(async()=>(async function(e,t,r){try{let n=await su(e,t,!0),i=new aT(t,n.hs),s=i.da(n.documents),a=i.applyChanges(s,!1);r.resolve(a.snapshot)}catch(n){let e=aa(n,`Failed to execute query '${t} against cache`);r.reject(e)}})(await op(e),t,r)),r.promise})(r,e._query).then(r=>new us(t,n,e,r))}function uf(e){e=oC(e,oR);let t=oC(e.firestore,oK),r=oQ(t),n=new ul(t);return ob(r,e._query,{source:"server"}).then(r=>new us(t,n,e,r))}function up(e,t,r){e=oC(e,oP);let n=oC(e.firestore,oK),i=l9(e.converter,t,r);return ub(n,[lh(lc(n),"setDoc",e._key,i,null!==e.converter,r).toMutation(e._key,rP.none())])}function um(e,t,r,...n){e=oC(e,oP);let i=oC(e.firestore,oK),s=lc(i);return ub(i,[("string"==typeof(t=(0,h.getModularInstance)(t))||t instanceof le?lw(s,"updateDoc",e._key,t,r,n):lv(s,"updateDoc",e._key,t)).toMutation(e._key,rP.exists(!0))])}function ug(e){return ub(oC(e.firestore,oK),[new rK(e._key,rP.none())])}function uy(e,t){let r=oC(e.firestore,oK),n=oU(e),i=l9(e.converter,t);return ub(r,[lh(lc(e.firestore),"addDoc",n._key,i,null!==e.converter,{}).toMutation(n._key,rP.exists(!1))]).then(()=>n)}function uv(e,...t){var r,n,i;let s,a,o;e=(0,h.getModularInstance)(e);let l={includeMetadataChanges:!1,source:"default"},u=0;"object"!=typeof t[0]||oq(t[u])||(l=t[u],u++);let c={includeMetadataChanges:l.includeMetadataChanges,source:l.source};if(oq(t[u])){let e=t[u];t[u]=null===(r=e.next)||void 0===r?void 0:r.bind(e),t[u+1]=null===(n=e.error)||void 0===n?void 0:n.bind(e),t[u+2]=null===(i=e.complete)||void 0===i?void 0:i.bind(e)}if(e instanceof oP)a=oC(e.firestore,oK),o=t6(e._key.path),s={next:r=>{t[u]&&t[u](uI(a,e,r))},error:t[u+1],complete:t[u+2]};else{let r=oC(e,oR);a=oC(r.firestore,oK),o=r._query;let n=new ul(a);s={next:e=>{t[u]&&t[u](new us(a,n,r,e))},error:t[u+1],complete:t[u+2]},lR(e._query)}return function(e,t,r,n){let i=new on(n),s=new ay(t,i,r);return e.asyncQueue.enqueueAndForget(async()=>ad(await ov(e),s)),()=>{i.$a(),e.asyncQueue.enqueueAndForget(async()=>af(await ov(e),s))}}(oQ(a),o,c,s)}function uw(e,t){return function(e,t){let r=new on(t);return e.asyncQueue.enqueueAndForget(async()=>{(await ov(e)).z_.add(r),r.next()}),()=>{r.$a(),e.asyncQueue.enqueueAndForget(async()=>(function(e,t){e.z_.delete(t)})(await ov(e),r))}}(oQ(e=oC(e,oK)),oq(t)?t:{next:t})}function ub(e,t){return function(e,t){let r=new N;return e.asyncQueue.enqueueAndForget(async()=>aP(await og(e),t,r)),r.promise}(oQ(e),t)}function uI(e,t,r){let n=r.docs.get(t._key),i=new ul(e);return new un(e,i,t._key,n,new ur(r.hasPendingWrites,r.fromCache),t.converter)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function u_(e){return uE(e,{count:l7()})}function uE(e,t){let r=oC(e.firestore,oK),n=oQ(r),i=eX(t,(e,t)=>new rJ(t,e.aggregateType,e._internalFieldPath));return(function(e,t,r){let n=new N;return e.asyncQueue.enqueueAndForget(async()=>{try{let i=await oy(e);n.resolve(async function(e,t,r){var n;let{request:i,ut:s,parent:a}=nD(e.serializer,t7(t),r);e.connection.Do||delete i.parent;let o=(await e.xo("RunAggregationQuery",e.serializer.databaseId,a,i,1)).filter(e=>!!e.result);1===o.length||x();let l=null===(n=o[0].result)||void 0===n?void 0:n.aggregateFields;return Object.keys(l).reduce((e,t)=>(e[s[t]]=l[t],e),{})}(i,t,r))}catch(e){n.reject(e)}}),n.promise})(n,e._query,i).then(t=>(function(e,t,r){let n=new ul(e);return new o8(t,n,r)})(r,e,t))}class uT{constructor(e){this.kind="memory",this._onlineComponentProvider=new ot,(null==e?void 0:e.garbageCollector)?this._offlineComponentProvider=e.garbageCollector._offlineComponentProvider:this._offlineComponentProvider=new a3}toJSON(){return{kind:this.kind}}}class uS{constructor(e){let t;this.kind="persistent",(null==e?void 0:e.tabManager)?(e.tabManager._initialize(e),t=e.tabManager):(t=uP(void 0))._initialize(e),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class ux{constructor(){this.kind="memoryEager",this._offlineComponentProvider=new a3}toJSON(){return{kind:this.kind}}}class uA{constructor(e){this.kind="memoryLru",this._offlineComponentProvider=new a8(e)}toJSON(){return{kind:this.kind}}}function uC(){return new ux}function uD(e){return new uA(null==e?void 0:e.cacheSizeBytes)}function uN(e){return new uT(e)}function uk(e){return new uS(e)}class uO{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=new ot,this._offlineComponentProvider=new a7(this._onlineComponentProvider,null==e?void 0:e.cacheSizeBytes,this.forceOwnership)}}class uR{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=new ot,this._offlineComponentProvider=new oe(this._onlineComponentProvider,null==e?void 0:e.cacheSizeBytes)}}function uP(e){return new uO(null==e?void 0:e.forceOwnership)}function uL(){return new uR}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let uM={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uF{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=lc(e)}set(e,t,r){this._verifyNotCommitted();let n=uU(e,this._firestore),i=l9(n.converter,t,r),s=lh(this._dataReader,"WriteBatch.set",n._key,i,null!==n.converter,r);return this._mutations.push(s.toMutation(n._key,rP.none())),this}update(e,t,r,...n){let i;this._verifyNotCommitted();let s=uU(e,this._firestore);return i="string"==typeof(t=(0,h.getModularInstance)(t))||t instanceof le?lw(this._dataReader,"WriteBatch.update",s._key,t,r,n):lv(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(i.toMutation(s._key,rP.exists(!0))),this}delete(e){this._verifyNotCommitted();let t=uU(e,this._firestore);return this._mutations=this._mutations.concat(new rK(t._key,rP.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new D(C.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function uU(e,t){if((e=(0,h.getModularInstance)(e)).firestore!==t)throw new D(C.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uV extends class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=lc(e)}get(e){let t=uU(e,this._firestore),r=new l5(this._firestore);return this._transaction.lookup([t._key]).then(e=>{if(!e||1!==e.length)return x();let n=e[0];if(n.isFoundDocument())return new lN(this._firestore,r,n.key,n,t.converter);if(n.isNoDocument())return new lN(this._firestore,r,t._key,null,t.converter);throw x()})}set(e,t,r){let n=uU(e,this._firestore),i=l9(n.converter,t,r),s=lh(this._dataReader,"Transaction.set",n._key,i,null!==n.converter,r);return this._transaction.set(n._key,s),this}update(e,t,r,...n){let i;let s=uU(e,this._firestore);return i="string"==typeof(t=(0,h.getModularInstance)(t))||t instanceof le?lw(this._dataReader,"Transaction.update",s._key,t,r,n):lv(this._dataReader,"Transaction.update",s._key,t),this._transaction.update(s._key,i),this}delete(e){let t=uU(e,this._firestore);return this._transaction.delete(t._key),this}}{constructor(e,t){super(e,t),this._firestore=e}get(e){let t=uU(e,this._firestore),r=new ul(this._firestore);return super.get(e).then(e=>new un(this._firestore,r,t._key,e._document,new ur(!1,!1),t.converter))}}function uB(e,t,r){e=oC(e,oK);let n=Object.assign(Object.assign({},uM),r);return function(e){if(e.maxAttempts<1)throw new D(C.INVALID_ARGUMENT,"Max attempts must be at least 1")}(n),function(e,t,r){let n=new N;return e.asyncQueue.enqueueAndForget(async()=>{let i=await oy(e);new oa(e.asyncQueue,i,r,t,n).Xa()}),n.promise}(oQ(e),r=>t(new uV(e,r)),n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uj(){return new ld("deleteField")}function uq(){return new lp("serverTimestamp")}function uz(...e){return new lm("arrayUnion",e)}function uG(...e){return new lg("arrayRemove",e)}function uK(e){return new ly("increment",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function u$(e){return oQ(e=oC(e,oK)),new uF(e,t=>ub(e,t))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uH(e,t){var r;let n=oQ(e=oC(e,oK));if(!n._uninitializedComponentsProvider||"memory"===(null===(r=n._uninitializedComponentsProvider)||void 0===r?void 0:r._offlineKind))return T("Cannot enable indexes when persistence is disabled"),Promise.resolve();let i=function(e){let t="string"==typeof e?function(e){try{return JSON.parse(e)}catch(e){throw new D(C.INVALID_ARGUMENT,"Failed to parse JSON: "+(null==e?void 0:e.message))}}(e):e,r=[];if(Array.isArray(t.indexes))for(let e of t.indexes){let t=uQ(e,"collectionGroup"),n=[];if(Array.isArray(e.fields))for(let t of e.fields){let e=lA("setIndexConfiguration",uQ(t,"fieldPath"));"CONTAINS"===t.arrayConfig?n.push(new ee(e,2)):"ASCENDING"===t.order?n.push(new ee(e,0)):"DESCENDING"===t.order&&n.push(new ee(e,1))}r.push(new J(J.UNKNOWN_ID,t,n,et.empty()))}return r}(t);return n.asyncQueue.enqueue(async()=>(async function(e,t){let r=e.indexManager,n=[];return e.persistence.runTransaction("Configure indexes","readwrite",e=>r.getFieldIndexes(e).next(i=>/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(function(e,t,r,n,i){t=[...t],(e=[...e]).sort(r),t.sort(r);let s=e.length,a=t.length,o=0,l=0;for(;o<a&&l<s;){let s=r(e[l],t[o]);s<0?i(e[l++]):s>0?n(t[o++]):(o++,l++)}for(;o<a;)n(t[o++]);for(;l<s;)i(e[l++])})(i,t,Z,t=>{n.push(r.addFieldIndex(e,t))},t=>{n.push(r.deleteFieldIndex(e,t))})).next(()=>eu.waitFor(n)))})(await op(n),i))}function uQ(e,t){if("string"!=typeof e[t])throw new D(C.INVALID_ARGUMENT,"Missing string value for: "+t);return e[t]}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uW{constructor(e){this._client=e,this.type="PersistentCacheIndexManager"}}function uJ(e){var t;e=oC(e,oK);let r=u1.get(e);if(r)return r;let n=oQ(e);if("persistent"!==(null===(t=n._uninitializedComponentsProvider)||void 0===t?void 0:t._offlineKind))return null;let i=new uW(n);return u1.set(e,i),i}function uY(e){u0(e,!0)}function uX(e){u0(e,!1)}function uZ(e){var t;e._client.verifyNotTerminated(),(t=e._client).asyncQueue.enqueue(async()=>(function(e){let t=e.indexManager;return e.persistence.runTransaction("Delete All Indexes","readwrite",e=>t.deleteAllFieldIndexes(e))})(await op(t))).then(e=>_("deleting all persistent cache indexes succeeded")).catch(e=>T("deleting all persistent cache indexes failed",e))}function u0(e,t){var r;e._client.verifyNotTerminated(),(r=e._client).asyncQueue.enqueue(async()=>{(await op(r)).ts.Ui=t}).then(e=>_(`setting persistent cache index auto creation isEnabled=${t} succeeded`)).catch(e=>T(`setting persistent cache index auto creation isEnabled=${t} failed`,e))}let u1=new WeakMap;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function u2(e){var t;let r=null===(t=oQ(oC(e.firestore,oK))._onlineComponents)||void 0===t?void 0:t.datastore.serializer;return void 0===r?null:nC(r,t8(e._query))._t}function u4(e,t){var r;let n=eX(t,(e,t)=>new rJ(t,e.aggregateType,e._internalFieldPath)),i=null===(r=oQ(oC(e.firestore,oK))._onlineComponents)||void 0===r?void 0:r.datastore.serializer;return void 0===i?null:nD(i,t7(e._query),n,!0).request}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u6{constructor(){throw Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return u9.instance.onExistenceFilterMismatch(e)}}class u9{constructor(){this.Ou=new Map}static get instance(){return u5||function(e){if(r0)throw Error("a TestingHooksSpi instance is already set");r0=e}(u5=new u9),u5}et(e){this.Ou.forEach(t=>t(e))}onExistenceFilterMismatch(e){let t=Symbol(),r=this.Ou;return r.set(t,e),()=>r.delete(t)}}let u5=null;!function(e,t=!0){v=l.SDK_VERSION,(0,l._registerComponent)(new(0,u.Component)("firestore",(e,{instanceIdentifier:r,options:n})=>{let i=e.getProvider("app").getImmediate(),s=new oK(new P(e.getProvider("auth-internal")),new U(e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new D(C.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new tl(e.options.projectId,t)}(i,r),i);return n=Object.assign({useFetchStreams:t},n),s._setSettings(n),s},"PUBLIC").setMultipleInstances(!0)),(0,l.registerVersion)(g,"4.6.4",void 0),(0,l.registerVersion)(g,"4.6.4","esm2017")}()},{b72166c93fb5f66:"k5N9S","720cac7913d14e6d":"f1Eh0","@firebase/app":"d239L","@firebase/component":"8ml9B","@firebase/logger":"aO433","@firebase/util":"aD5S7","@firebase/webchannel-wrapper/bloom-blob":"bseDX","@firebase/webchannel-wrapper/webchannel-blob":"dOImX","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],k5N9S:[function(e,t,r){var n,i,s,a,o=Object.create,l=Object.defineProperty,u=Object.getOwnPropertyDescriptor,c=Object.getOwnPropertyNames,h=Object.getPrototypeOf,d=Object.prototype.hasOwnProperty,f=(e,t,r,n)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let i of c(t))d.call(e,i)||i===r||l(e,i,{get:()=>t[i],enumerable:!(n=u(t,i))||n.enumerable});return e},p=(e,t,r)=>(r=null!=e?o(h(e)):{},f(!t&&e&&e.__esModule?r:l(r,"default",{value:e,enumerable:!0}),e)),m=(n=(e,t)=>{var r,n,i=t.exports={};function s(){throw Error("setTimeout has not been defined")}function a(){throw Error("clearTimeout has not been defined")}function o(e){if(r===setTimeout)return setTimeout(e,0);if((r===s||!r)&&setTimeout)return r=setTimeout,setTimeout(e,0);try{return r(e,0)}catch(t){try{return r.call(null,e,0)}catch(t){return r.call(this,e,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:s}catch(e){r=s}try{n="function"==typeof clearTimeout?clearTimeout:a}catch(e){n=a}}();var l,u=[],c=!1,h=-1;function d(){c&&l&&(c=!1,l.length?u=l.concat(u):h=-1,u.length&&f())}function f(){if(!c){var e=o(d);c=!0;for(var t=u.length;t;){for(l=u,u=[];++h<t;)l&&l[h].run();h=-1,t=u.length}l=null,c=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===a||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function p(e,t){this.fun=e,this.array=t}function m(){}i.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];u.push(new p(e,t)),1!==u.length||c||o(f)},p.prototype.run=function(){this.fun.apply(null,this.array)},i.title="browser",i.browser=!0,i.env={},i.argv=[],i.version="",i.versions={},i.on=m,i.addListener=m,i.once=m,i.off=m,i.removeListener=m,i.removeAllListeners=m,i.emit=m,i.prependListener=m,i.prependOnceListener=m,i.listeners=function(e){return[]},i.binding=function(e){throw Error("process.binding is not supported")},i.cwd=function(){return"/"},i.chdir=function(e){throw Error("process.chdir is not supported")},i.umask=function(){return 0}},()=>(i||n((i={exports:{}}).exports,i),i.exports)),g={};((e,t)=>{for(var r in t)l(e,r,{get:t[r],enumerable:!0})})(g,{default:()=>v}),t.exports=f(l({},"__esModule",{value:!0}),g);var y=p(m());s=p(m()),a=t.exports,f(g,s,"default"),a&&f(a,s,"default");var v=y.default},{}],f1Eh0:[function(e,t,r){var n,i,s=Object.create,a=Object.defineProperty,o=Object.getOwnPropertyDescriptor,l=Object.getOwnPropertyNames,u=Object.getPrototypeOf,c=Object.prototype.hasOwnProperty,h=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),d=(e,t,r,n)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let i of l(t))c.call(e,i)||i===r||a(e,i,{get:()=>t[i],enumerable:!(n=o(t,i))||n.enumerable});return e},f=(e,t,r)=>(r=null!=e?s(u(e)):{},d(!t&&e&&e.__esModule?r:a(r,"default",{value:e,enumerable:!0}),e)),p=h(e=>{e.byteLength=function(e){var t=o(e),r=t[0],n=t[1];return(r+n)*3/4-n},e.toByteArray=function(e){var t,r,n=o(e),a=n[0],l=n[1],u=new s((a+l)*3/4-l),c=0,h=l>0?a-4:a;for(r=0;r<h;r+=4)t=i[e.charCodeAt(r)]<<18|i[e.charCodeAt(r+1)]<<12|i[e.charCodeAt(r+2)]<<6|i[e.charCodeAt(r+3)],u[c++]=t>>16&255,u[c++]=t>>8&255,u[c++]=255&t;return 2===l&&(t=i[e.charCodeAt(r)]<<2|i[e.charCodeAt(r+1)]>>4,u[c++]=255&t),1===l&&(t=i[e.charCodeAt(r)]<<10|i[e.charCodeAt(r+1)]<<4|i[e.charCodeAt(r+2)]>>2,u[c++]=t>>8&255,u[c++]=255&t),u},e.fromByteArray=function(e){for(var t,r=e.length,i=r%3,s=[],a=0,o=r-i;a<o;a+=16383)s.push(function(e,t,r){for(var i,s=[],a=t;a<r;a+=3)s.push(n[(i=(e[a]<<16&16711680)+(e[a+1]<<8&65280)+(255&e[a+2]))>>18&63]+n[i>>12&63]+n[i>>6&63]+n[63&i]);return s.join("")}(e,a,a+16383>o?o:a+16383));return 1===i?s.push(n[(t=e[r-1])>>2]+n[t<<4&63]+"=="):2===i&&s.push(n[(t=(e[r-2]<<8)+e[r-1])>>10]+n[t>>4&63]+n[t<<2&63]+"="),s.join("")};var t,r,n=[],i=[],s="u">typeof Uint8Array?Uint8Array:Array,a="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(t=0,r=a.length;t<r;++t)n[t]=a[t],i[a.charCodeAt(t)]=t;function o(e){var t=e.length;if(t%4>0)throw Error("Invalid string. Length must be a multiple of 4");var r=e.indexOf("=");-1===r&&(r=t);var n=r===t?0:4-r%4;return[r,n]}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63}),m=h(e=>{e.read=function(e,t,r,n,i){var s,a,o=8*i-n-1,l=(1<<o)-1,u=l>>1,c=-7,h=r?i-1:0,d=r?-1:1,f=e[t+h];for(h+=d,s=f&(1<<-c)-1,f>>=-c,c+=o;c>0;s=256*s+e[t+h],h+=d,c-=8);for(a=s&(1<<-c)-1,s>>=-c,c+=n;c>0;a=256*a+e[t+h],h+=d,c-=8);if(0===s)s=1-u;else{if(s===l)return a?NaN:(f?-1:1)*(1/0);a+=Math.pow(2,n),s-=u}return(f?-1:1)*a*Math.pow(2,s-n)},e.write=function(e,t,r,n,i,s){var a,o,l,u=8*s-i-1,c=(1<<u)-1,h=c>>1,d=23===i?5960464477539062e-23:0,f=n?0:s-1,p=n?1:-1,m=t<0||0===t&&1/t<0?1:0;for(isNaN(t=Math.abs(t))||t===1/0?(o=isNaN(t)?1:0,a=c):(a=Math.floor(Math.log(t)/Math.LN2),t*(l=Math.pow(2,-a))<1&&(a--,l*=2),a+h>=1?t+=d/l:t+=d*Math.pow(2,1-h),t*l>=2&&(a++,l/=2),a+h>=c?(o=0,a=c):a+h>=1?(o=(t*l-1)*Math.pow(2,i),a+=h):(o=t*Math.pow(2,h-1)*Math.pow(2,i),a=0));i>=8;e[r+f]=255&o,f+=p,o/=256,i-=8);for(a=a<<i|o,u+=i;u>0;e[r+f]=255&a,f+=p,a/=256,u-=8);e[r+f-p]|=128*m}}),g=h(e=>{var t=p(),r=m(),n="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;function i(e){if(e>2147483647)throw RangeError('The value "'+e+'" is invalid for option "size"');let t=new Uint8Array(e);return Object.setPrototypeOf(t,s.prototype),t}function s(e,t,r){if("number"==typeof e){if("string"==typeof t)throw TypeError('The "string" argument must be of type string. Received type number');return l(e)}return a(e,t,r)}function a(e,t,r){if("string"==typeof e)return function(e,t){if(("string"!=typeof t||""===t)&&(t="utf8"),!s.isEncoding(t))throw TypeError("Unknown encoding: "+t);let r=0|d(e,t),n=i(r),a=n.write(e,t);return a!==r&&(n=n.slice(0,a)),n}(e,t);if(ArrayBuffer.isView(e))return function(e){if(F(e,Uint8Array)){let t=new Uint8Array(e);return c(t.buffer,t.byteOffset,t.byteLength)}return u(e)}(e);if(null==e)throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(F(e,ArrayBuffer)||e&&F(e.buffer,ArrayBuffer)||"u">typeof SharedArrayBuffer&&(F(e,SharedArrayBuffer)||e&&F(e.buffer,SharedArrayBuffer)))return c(e,t,r);if("number"==typeof e)throw TypeError('The "value" argument must not be of type number. Received type number');let n=e.valueOf&&e.valueOf();if(null!=n&&n!==e)return s.from(n,t,r);let a=function(e){var t;if(s.isBuffer(e)){let t=0|h(e.length),r=i(t);return 0===r.length||e.copy(r,0,0,t),r}return void 0!==e.length?"number"!=typeof e.length||(t=e.length)!=t?i(0):u(e):"Buffer"===e.type&&Array.isArray(e.data)?u(e.data):void 0}(e);if(a)return a;if("u">typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof e[Symbol.toPrimitive])return s.from(e[Symbol.toPrimitive]("string"),t,r);throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}function o(e){if("number"!=typeof e)throw TypeError('"size" argument must be of type number');if(e<0)throw RangeError('The value "'+e+'" is invalid for option "size"')}function l(e){return o(e),i(e<0?0:0|h(e))}function u(e){let t=e.length<0?0:0|h(e.length),r=i(t);for(let n=0;n<t;n+=1)r[n]=255&e[n];return r}function c(e,t,r){let n;if(t<0||e.byteLength<t)throw RangeError('"offset" is outside of buffer bounds');if(e.byteLength<t+(r||0))throw RangeError('"length" is outside of buffer bounds');return Object.setPrototypeOf(n=void 0===t&&void 0===r?new Uint8Array(e):void 0===r?new Uint8Array(e,t):new Uint8Array(e,t,r),s.prototype),n}function h(e){if(e>=2147483647)throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");return 0|e}function d(e,t){if(s.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||F(e,ArrayBuffer))return e.byteLength;if("string"!=typeof e)throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);let r=e.length,n=arguments.length>2&&!0===arguments[2];if(!n&&0===r)return 0;let i=!1;for(;;)switch(t){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":return P(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return L(e).length;default:if(i)return n?-1:P(e).length;t=(""+t).toLowerCase(),i=!0}}function f(e,r,n){let i=!1;if((void 0===r||r<0)&&(r=0),r>this.length||((void 0===n||n>this.length)&&(n=this.length),n<=0)||(n>>>=0)<=(r>>>=0))return"";for(e||(e="utf8");;)switch(e){case"hex":return function(e,t,r){let n=e.length;(!t||t<0)&&(t=0),(!r||r<0||r>n)&&(r=n);let i="";for(let n=t;n<r;++n)i+=U[e[n]];return i}(this,r,n);case"utf8":case"utf-8":return w(this,r,n);case"ascii":return function(e,t,r){let n="";r=Math.min(e.length,r);for(let i=t;i<r;++i)n+=String.fromCharCode(127&e[i]);return n}(this,r,n);case"latin1":case"binary":return function(e,t,r){let n="";r=Math.min(e.length,r);for(let i=t;i<r;++i)n+=String.fromCharCode(e[i]);return n}(this,r,n);case"base64":var s,a;return s=r,a=n,0===s&&a===this.length?t.fromByteArray(this):t.fromByteArray(this.slice(s,a));case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return function(e,t,r){let n=e.slice(t,r),i="";for(let e=0;e<n.length-1;e+=2)i+=String.fromCharCode(n[e]+256*n[e+1]);return i}(this,r,n);default:if(i)throw TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),i=!0}}function g(e,t,r){let n=e[t];e[t]=e[r],e[r]=n}function y(e,t,r,n,i){var a;if(0===e.length)return -1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),(a=r=+r)!=a&&(r=i?0:e.length-1),r<0&&(r=e.length+r),r>=e.length){if(i)return -1;r=e.length-1}else if(r<0){if(!i)return -1;r=0}if("string"==typeof t&&(t=s.from(t,n)),s.isBuffer(t))return 0===t.length?-1:v(e,t,r,n,i);if("number"==typeof t)return t&=255,"function"==typeof Uint8Array.prototype.indexOf?i?Uint8Array.prototype.indexOf.call(e,t,r):Uint8Array.prototype.lastIndexOf.call(e,t,r):v(e,[t],r,n,i);throw TypeError("val must be string, number or Buffer")}function v(e,t,r,n,i){let s,a=1,o=e.length,l=t.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(e.length<2||t.length<2)return -1;a=2,o/=2,l/=2,r/=2}function u(e,t){return 1===a?e[t]:e.readUInt16BE(t*a)}if(i){let n=-1;for(s=r;s<o;s++)if(u(e,s)===u(t,-1===n?0:s-n)){if(-1===n&&(n=s),s-n+1===l)return n*a}else -1!==n&&(s-=s-n),n=-1}else for(r+l>o&&(r=o-l),s=r;s>=0;s--){let r=!0;for(let n=0;n<l;n++)if(u(e,s+n)!==u(t,n)){r=!1;break}if(r)return s}return -1}function w(e,t,r){r=Math.min(e.length,r);let n=[],i=t;for(;i<r;){let t=e[i],s=null,a=t>239?4:t>223?3:t>191?2:1;if(i+a<=r){let r,n,o,l;switch(a){case 1:t<128&&(s=t);break;case 2:(192&(r=e[i+1]))==128&&(l=(31&t)<<6|63&r)>127&&(s=l);break;case 3:r=e[i+1],n=e[i+2],(192&r)==128&&(192&n)==128&&(l=(15&t)<<12|(63&r)<<6|63&n)>2047&&(l<55296||l>57343)&&(s=l);break;case 4:r=e[i+1],n=e[i+2],o=e[i+3],(192&r)==128&&(192&n)==128&&(192&o)==128&&(l=(15&t)<<18|(63&r)<<12|(63&n)<<6|63&o)>65535&&l<1114112&&(s=l)}}null===s?(s=65533,a=1):s>65535&&(s-=65536,n.push(s>>>10&1023|55296),s=56320|1023&s),n.push(s),i+=a}return function(e){let t=e.length;if(t<=4096)return String.fromCharCode.apply(String,e);let r="",n=0;for(;n<t;)r+=String.fromCharCode.apply(String,e.slice(n,n+=4096));return r}(n)}function b(e,t,r){if(e%1!=0||e<0)throw RangeError("offset is not uint");if(e+t>r)throw RangeError("Trying to access beyond buffer length")}function I(e,t,r,n,i,a){if(!s.isBuffer(e))throw TypeError('"buffer" argument must be a Buffer instance');if(t>i||t<a)throw RangeError('"value" argument is out of bounds');if(r+n>e.length)throw RangeError("Index out of range")}function _(e,t,r,n,i){N(t,n,i,e,r,7);let s=Number(t&BigInt(4294967295));e[r++]=s,s>>=8,e[r++]=s,s>>=8,e[r++]=s,s>>=8,e[r++]=s;let a=Number(t>>BigInt(32)&BigInt(4294967295));return e[r++]=a,a>>=8,e[r++]=a,a>>=8,e[r++]=a,a>>=8,e[r++]=a,r}function E(e,t,r,n,i){N(t,n,i,e,r,7);let s=Number(t&BigInt(4294967295));e[r+7]=s,s>>=8,e[r+6]=s,s>>=8,e[r+5]=s,s>>=8,e[r+4]=s;let a=Number(t>>BigInt(32)&BigInt(4294967295));return e[r+3]=a,a>>=8,e[r+2]=a,a>>=8,e[r+1]=a,a>>=8,e[r]=a,r+8}function T(e,t,r,n,i,s){if(r+n>e.length||r<0)throw RangeError("Index out of range")}function S(e,t,n,i,s){return t=+t,n>>>=0,s||T(e,t,n,4,34028234663852886e22,-34028234663852886e22),r.write(e,t,n,i,23,4),n+4}function x(e,t,n,i,s){return t=+t,n>>>=0,s||T(e,t,n,8,17976931348623157e292,-17976931348623157e292),r.write(e,t,n,i,52,8),n+8}e.Buffer=s,e.SlowBuffer=function(e){return+e!=e&&(e=0),s.alloc(+e)},e.INSPECT_MAX_BYTES=50,e.kMaxLength=2147483647,s.TYPED_ARRAY_SUPPORT=function(){try{let e=new Uint8Array(1),t={foo:function(){return 42}};return Object.setPrototypeOf(t,Uint8Array.prototype),Object.setPrototypeOf(e,t),42===e.foo()}catch(e){return!1}}(),!s.TYPED_ARRAY_SUPPORT&&"u">typeof console&&"function"==typeof console.error&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(s.prototype,"parent",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.buffer}}),Object.defineProperty(s.prototype,"offset",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.byteOffset}}),s.poolSize=8192,s.from=function(e,t,r){return a(e,t,r)},Object.setPrototypeOf(s.prototype,Uint8Array.prototype),Object.setPrototypeOf(s,Uint8Array),s.alloc=function(e,t,r){return o(e),e<=0?i(e):void 0!==t?"string"==typeof r?i(e).fill(t,r):i(e).fill(t):i(e)},s.allocUnsafe=function(e){return l(e)},s.allocUnsafeSlow=function(e){return l(e)},s.isBuffer=function(e){return null!=e&&!0===e._isBuffer&&e!==s.prototype},s.compare=function(e,t){if(F(e,Uint8Array)&&(e=s.from(e,e.offset,e.byteLength)),F(t,Uint8Array)&&(t=s.from(t,t.offset,t.byteLength)),!s.isBuffer(e)||!s.isBuffer(t))throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(e===t)return 0;let r=e.length,n=t.length;for(let i=0,s=Math.min(r,n);i<s;++i)if(e[i]!==t[i]){r=e[i],n=t[i];break}return r<n?-1:n<r?1:0},s.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(e,t){let r;if(!Array.isArray(e))throw TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return s.alloc(0);if(void 0===t)for(t=0,r=0;r<e.length;++r)t+=e[r].length;let n=s.allocUnsafe(t),i=0;for(r=0;r<e.length;++r){let t=e[r];if(F(t,Uint8Array))i+t.length>n.length?(s.isBuffer(t)||(t=s.from(t)),t.copy(n,i)):Uint8Array.prototype.set.call(n,t,i);else if(s.isBuffer(t))t.copy(n,i);else throw TypeError('"list" argument must be an Array of Buffers');i+=t.length}return n},s.byteLength=d,s.prototype._isBuffer=!0,s.prototype.swap16=function(){let e=this.length;if(e%2!=0)throw RangeError("Buffer size must be a multiple of 16-bits");for(let t=0;t<e;t+=2)g(this,t,t+1);return this},s.prototype.swap32=function(){let e=this.length;if(e%4!=0)throw RangeError("Buffer size must be a multiple of 32-bits");for(let t=0;t<e;t+=4)g(this,t,t+3),g(this,t+1,t+2);return this},s.prototype.swap64=function(){let e=this.length;if(e%8!=0)throw RangeError("Buffer size must be a multiple of 64-bits");for(let t=0;t<e;t+=8)g(this,t,t+7),g(this,t+1,t+6),g(this,t+2,t+5),g(this,t+3,t+4);return this},s.prototype.toString=function(){let e=this.length;return 0===e?"":0==arguments.length?w(this,0,e):f.apply(this,arguments)},s.prototype.toLocaleString=s.prototype.toString,s.prototype.equals=function(e){if(!s.isBuffer(e))throw TypeError("Argument must be a Buffer");return this===e||0===s.compare(this,e)},s.prototype.inspect=function(){let t="",r=e.INSPECT_MAX_BYTES;return t=this.toString("hex",0,r).replace(/(.{2})/g,"$1 ").trim(),this.length>r&&(t+=" ... "),"<Buffer "+t+">"},n&&(s.prototype[n]=s.prototype.inspect),s.prototype.compare=function(e,t,r,n,i){if(F(e,Uint8Array)&&(e=s.from(e,e.offset,e.byteLength)),!s.isBuffer(e))throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof e);if(void 0===t&&(t=0),void 0===r&&(r=e?e.length:0),void 0===n&&(n=0),void 0===i&&(i=this.length),t<0||r>e.length||n<0||i>this.length)throw RangeError("out of range index");if(n>=i&&t>=r)return 0;if(n>=i)return -1;if(t>=r)return 1;if(t>>>=0,r>>>=0,n>>>=0,i>>>=0,this===e)return 0;let a=i-n,o=r-t,l=Math.min(a,o),u=this.slice(n,i),c=e.slice(t,r);for(let e=0;e<l;++e)if(u[e]!==c[e]){a=u[e],o=c[e];break}return a<o?-1:o<a?1:0},s.prototype.includes=function(e,t,r){return -1!==this.indexOf(e,t,r)},s.prototype.indexOf=function(e,t,r){return y(this,e,t,r,!0)},s.prototype.lastIndexOf=function(e,t,r){return y(this,e,t,r,!1)},s.prototype.write=function(e,t,r,n){var i,s,a,o,l,u,c,h;if(void 0===t)n="utf8",r=this.length,t=0;else if(void 0===r&&"string"==typeof t)n=t,r=this.length,t=0;else if(isFinite(t))t>>>=0,isFinite(r)?(r>>>=0,void 0===n&&(n="utf8")):(n=r,r=void 0);else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");let d=this.length-t;if((void 0===r||r>d)&&(r=d),e.length>0&&(r<0||t<0)||t>this.length)throw RangeError("Attempt to write outside buffer bounds");n||(n="utf8");let f=!1;for(;;)switch(n){case"hex":return function(e,t,r,n){let i;r=Number(r)||0;let s=e.length-r;n?(n=Number(n))>s&&(n=s):n=s;let a=t.length;for(n>a/2&&(n=a/2),i=0;i<n;++i){let n=parseInt(t.substr(2*i,2),16);if(n!=n)break;e[r+i]=n}return i}(this,e,t,r);case"utf8":case"utf-8":return i=t,s=r,M(P(e,this.length-i),this,i,s);case"ascii":case"latin1":case"binary":return a=t,o=r,M(function(e){let t=[];for(let r=0;r<e.length;++r)t.push(255&e.charCodeAt(r));return t}(e),this,a,o);case"base64":return l=t,u=r,M(L(e),this,l,u);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return c=t,h=r,M(function(e,t){let r,n,i=[];for(let s=0;s<e.length&&!((t-=2)<0);++s)n=(r=e.charCodeAt(s))>>8,i.push(r%256),i.push(n);return i}(e,this.length-c),this,c,h);default:if(f)throw TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),f=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},s.prototype.slice=function(e,t){let r=this.length;e=~~e,t=void 0===t?r:~~t,e<0?(e+=r)<0&&(e=0):e>r&&(e=r),t<0?(t+=r)<0&&(t=0):t>r&&(t=r),t<e&&(t=e);let n=this.subarray(e,t);return Object.setPrototypeOf(n,s.prototype),n},s.prototype.readUintLE=s.prototype.readUIntLE=function(e,t,r){e>>>=0,t>>>=0,r||b(e,t,this.length);let n=this[e],i=1,s=0;for(;++s<t&&(i*=256);)n+=this[e+s]*i;return n},s.prototype.readUintBE=s.prototype.readUIntBE=function(e,t,r){e>>>=0,t>>>=0,r||b(e,t,this.length);let n=this[e+--t],i=1;for(;t>0&&(i*=256);)n+=this[e+--t]*i;return n},s.prototype.readUint8=s.prototype.readUInt8=function(e,t){return e>>>=0,t||b(e,1,this.length),this[e]},s.prototype.readUint16LE=s.prototype.readUInt16LE=function(e,t){return e>>>=0,t||b(e,2,this.length),this[e]|this[e+1]<<8},s.prototype.readUint16BE=s.prototype.readUInt16BE=function(e,t){return e>>>=0,t||b(e,2,this.length),this[e]<<8|this[e+1]},s.prototype.readUint32LE=s.prototype.readUInt32LE=function(e,t){return e>>>=0,t||b(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},s.prototype.readUint32BE=s.prototype.readUInt32BE=function(e,t){return e>>>=0,t||b(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},s.prototype.readBigUInt64LE=V(function(e){k(e>>>=0,"offset");let t=this[e],r=this[e+7];(void 0===t||void 0===r)&&O(e,this.length-8);let n=t+256*this[++e]+65536*this[++e]+16777216*this[++e],i=this[++e]+256*this[++e]+65536*this[++e]+16777216*r;return BigInt(n)+(BigInt(i)<<BigInt(32))}),s.prototype.readBigUInt64BE=V(function(e){k(e>>>=0,"offset");let t=this[e],r=this[e+7];(void 0===t||void 0===r)&&O(e,this.length-8);let n=16777216*t+65536*this[++e]+256*this[++e]+this[++e],i=16777216*this[++e]+65536*this[++e]+256*this[++e]+r;return(BigInt(n)<<BigInt(32))+BigInt(i)}),s.prototype.readIntLE=function(e,t,r){e>>>=0,t>>>=0,r||b(e,t,this.length);let n=this[e],i=1,s=0;for(;++s<t&&(i*=256);)n+=this[e+s]*i;return n>=(i*=128)&&(n-=Math.pow(2,8*t)),n},s.prototype.readIntBE=function(e,t,r){e>>>=0,t>>>=0,r||b(e,t,this.length);let n=t,i=1,s=this[e+--n];for(;n>0&&(i*=256);)s+=this[e+--n]*i;return s>=(i*=128)&&(s-=Math.pow(2,8*t)),s},s.prototype.readInt8=function(e,t){return e>>>=0,t||b(e,1,this.length),128&this[e]?-((255-this[e]+1)*1):this[e]},s.prototype.readInt16LE=function(e,t){e>>>=0,t||b(e,2,this.length);let r=this[e]|this[e+1]<<8;return 32768&r?4294901760|r:r},s.prototype.readInt16BE=function(e,t){e>>>=0,t||b(e,2,this.length);let r=this[e+1]|this[e]<<8;return 32768&r?4294901760|r:r},s.prototype.readInt32LE=function(e,t){return e>>>=0,t||b(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},s.prototype.readInt32BE=function(e,t){return e>>>=0,t||b(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},s.prototype.readBigInt64LE=V(function(e){k(e>>>=0,"offset");let t=this[e],r=this[e+7];return(void 0===t||void 0===r)&&O(e,this.length-8),(BigInt(this[e+4]+256*this[e+5]+65536*this[e+6]+(r<<24))<<BigInt(32))+BigInt(t+256*this[++e]+65536*this[++e]+16777216*this[++e])}),s.prototype.readBigInt64BE=V(function(e){k(e>>>=0,"offset");let t=this[e],r=this[e+7];return(void 0===t||void 0===r)&&O(e,this.length-8),(BigInt((t<<24)+65536*this[++e]+256*this[++e]+this[++e])<<BigInt(32))+BigInt(16777216*this[++e]+65536*this[++e]+256*this[++e]+r)}),s.prototype.readFloatLE=function(e,t){return e>>>=0,t||b(e,4,this.length),r.read(this,e,!0,23,4)},s.prototype.readFloatBE=function(e,t){return e>>>=0,t||b(e,4,this.length),r.read(this,e,!1,23,4)},s.prototype.readDoubleLE=function(e,t){return e>>>=0,t||b(e,8,this.length),r.read(this,e,!0,52,8)},s.prototype.readDoubleBE=function(e,t){return e>>>=0,t||b(e,8,this.length),r.read(this,e,!1,52,8)},s.prototype.writeUintLE=s.prototype.writeUIntLE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){let n=Math.pow(2,8*r)-1;I(this,e,t,r,n,0)}let i=1,s=0;for(this[t]=255&e;++s<r&&(i*=256);)this[t+s]=e/i&255;return t+r},s.prototype.writeUintBE=s.prototype.writeUIntBE=function(e,t,r,n){if(e=+e,t>>>=0,r>>>=0,!n){let n=Math.pow(2,8*r)-1;I(this,e,t,r,n,0)}let i=r-1,s=1;for(this[t+i]=255&e;--i>=0&&(s*=256);)this[t+i]=e/s&255;return t+r},s.prototype.writeUint8=s.prototype.writeUInt8=function(e,t,r){return e=+e,t>>>=0,r||I(this,e,t,1,255,0),this[t]=255&e,t+1},s.prototype.writeUint16LE=s.prototype.writeUInt16LE=function(e,t,r){return e=+e,t>>>=0,r||I(this,e,t,2,65535,0),this[t]=255&e,this[t+1]=e>>>8,t+2},s.prototype.writeUint16BE=s.prototype.writeUInt16BE=function(e,t,r){return e=+e,t>>>=0,r||I(this,e,t,2,65535,0),this[t]=e>>>8,this[t+1]=255&e,t+2},s.prototype.writeUint32LE=s.prototype.writeUInt32LE=function(e,t,r){return e=+e,t>>>=0,r||I(this,e,t,4,4294967295,0),this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e,t+4},s.prototype.writeUint32BE=s.prototype.writeUInt32BE=function(e,t,r){return e=+e,t>>>=0,r||I(this,e,t,4,4294967295,0),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},s.prototype.writeBigUInt64LE=V(function(e,t=0){return _(this,e,t,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeBigUInt64BE=V(function(e,t=0){return E(this,e,t,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeIntLE=function(e,t,r,n){if(e=+e,t>>>=0,!n){let n=Math.pow(2,8*r-1);I(this,e,t,r,n-1,-n)}let i=0,s=1,a=0;for(this[t]=255&e;++i<r&&(s*=256);)e<0&&0===a&&0!==this[t+i-1]&&(a=1),this[t+i]=(e/s>>0)-a&255;return t+r},s.prototype.writeIntBE=function(e,t,r,n){if(e=+e,t>>>=0,!n){let n=Math.pow(2,8*r-1);I(this,e,t,r,n-1,-n)}let i=r-1,s=1,a=0;for(this[t+i]=255&e;--i>=0&&(s*=256);)e<0&&0===a&&0!==this[t+i+1]&&(a=1),this[t+i]=(e/s>>0)-a&255;return t+r},s.prototype.writeInt8=function(e,t,r){return e=+e,t>>>=0,r||I(this,e,t,1,127,-128),e<0&&(e=255+e+1),this[t]=255&e,t+1},s.prototype.writeInt16LE=function(e,t,r){return e=+e,t>>>=0,r||I(this,e,t,2,32767,-32768),this[t]=255&e,this[t+1]=e>>>8,t+2},s.prototype.writeInt16BE=function(e,t,r){return e=+e,t>>>=0,r||I(this,e,t,2,32767,-32768),this[t]=e>>>8,this[t+1]=255&e,t+2},s.prototype.writeInt32LE=function(e,t,r){return e=+e,t>>>=0,r||I(this,e,t,4,2147483647,-2147483648),this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24,t+4},s.prototype.writeInt32BE=function(e,t,r){return e=+e,t>>>=0,r||I(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e,t+4},s.prototype.writeBigInt64LE=V(function(e,t=0){return _(this,e,t,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeBigInt64BE=V(function(e,t=0){return E(this,e,t,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeFloatLE=function(e,t,r){return S(this,e,t,!0,r)},s.prototype.writeFloatBE=function(e,t,r){return S(this,e,t,!1,r)},s.prototype.writeDoubleLE=function(e,t,r){return x(this,e,t,!0,r)},s.prototype.writeDoubleBE=function(e,t,r){return x(this,e,t,!1,r)},s.prototype.copy=function(e,t,r,n){if(!s.isBuffer(e))throw TypeError("argument should be a Buffer");if(r||(r=0),n||0===n||(n=this.length),t>=e.length&&(t=e.length),t||(t=0),n>0&&n<r&&(n=r),n===r||0===e.length||0===this.length)return 0;if(t<0)throw RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw RangeError("Index out of range");if(n<0)throw RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),e.length-t<n-r&&(n=e.length-t+r);let i=n-r;return this===e&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(t,r,n):Uint8Array.prototype.set.call(e,this.subarray(r,n),t),i},s.prototype.fill=function(e,t,r,n){let i;if("string"==typeof e){if("string"==typeof t?(n=t,t=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),void 0!==n&&"string"!=typeof n)throw TypeError("encoding must be a string");if("string"==typeof n&&!s.isEncoding(n))throw TypeError("Unknown encoding: "+n);if(1===e.length){let t=e.charCodeAt(0);("utf8"===n&&t<128||"latin1"===n)&&(e=t)}}else"number"==typeof e?e&=255:"boolean"==typeof e&&(e=Number(e));if(t<0||this.length<t||this.length<r)throw RangeError("Out of range index");if(r<=t)return this;if(t>>>=0,r=void 0===r?this.length:r>>>0,e||(e=0),"number"==typeof e)for(i=t;i<r;++i)this[i]=e;else{let a=s.isBuffer(e)?e:s.from(e,n),o=a.length;if(0===o)throw TypeError('The value "'+e+'" is invalid for argument "value"');for(i=0;i<r-t;++i)this[i+t]=a[i%o]}return this};var A={};function C(e,t,r){A[e]=class extends r{constructor(){super(),Object.defineProperty(this,"message",{value:t.apply(this,arguments),writable:!0,configurable:!0}),this.name="".concat(this.name," [").concat(e,"]"),this.stack,delete this.name}get code(){return e}set code(e){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:e,writable:!0})}toString(){return"".concat(this.name," [").concat(e,"]: ").concat(this.message)}}}function D(e){let t="",r=e.length,n="-"===e[0]?1:0;for(;r>=n+4;r-=3)t="_".concat(e.slice(r-3,r)).concat(t);return"".concat(e.slice(0,r)).concat(t)}function N(e,t,r,n,i,s){if(e>r||e<t){let n="bigint"==typeof t?"n":"",i;throw i=s>3?0===t||t===BigInt(0)?">= 0".concat(n," and < 2").concat(n," ** ").concat((s+1)*8).concat(n):">= -(2".concat(n," ** ").concat((s+1)*8-1).concat(n,") and < 2 ** ")+"".concat((s+1)*8-1).concat(n):">= ".concat(t).concat(n," and <= ").concat(r).concat(n),new A.ERR_OUT_OF_RANGE("value",i,e)}k(i,"offset"),(void 0===n[i]||void 0===n[i+s])&&O(i,n.length-(s+1))}function k(e,t){if("number"!=typeof e)throw new A.ERR_INVALID_ARG_TYPE(t,"number",e)}function O(e,t,r){throw Math.floor(e)!==e?(k(e,r),new A.ERR_OUT_OF_RANGE(r||"offset","an integer",e)):t<0?new A.ERR_BUFFER_OUT_OF_BOUNDS:new A.ERR_OUT_OF_RANGE(r||"offset",">= ".concat(r?1:0," and <= ").concat(t),e)}C("ERR_BUFFER_OUT_OF_BOUNDS",function(e){return e?"".concat(e," is outside of buffer bounds"):"Attempt to access memory outside buffer bounds"},RangeError),C("ERR_INVALID_ARG_TYPE",function(e,t){return'The "'.concat(e,'" argument must be of type number. Received type ').concat(typeof t)},TypeError),C("ERR_OUT_OF_RANGE",function(e,t,r){let n='The value of "'.concat(e,'" is out of range.'),i=r;return Number.isInteger(r)&&Math.abs(r)>4294967296?i=D(String(r)):"bigint"==typeof r&&(i=String(r),(r>BigInt(2)**BigInt(32)||r<-(BigInt(2)**BigInt(32)))&&(i=D(i)),i+="n"),n+=" It must be ".concat(t,". Received ").concat(i)},RangeError);var R=/[^+/0-9A-Za-z-_]/g;function P(e,t){t=t||1/0;let r,n=e.length,i=null,s=[];for(let a=0;a<n;++a){if((r=e.charCodeAt(a))>55295&&r<57344){if(!i){if(r>56319||a+1===n){(t-=3)>-1&&s.push(239,191,189);continue}i=r;continue}if(r<56320){(t-=3)>-1&&s.push(239,191,189),i=r;continue}r=(i-55296<<10|r-56320)+65536}else i&&(t-=3)>-1&&s.push(239,191,189);if(i=null,r<128){if((t-=1)<0)break;s.push(r)}else if(r<2048){if((t-=2)<0)break;s.push(r>>6|192,63&r|128)}else if(r<65536){if((t-=3)<0)break;s.push(r>>12|224,r>>6&63|128,63&r|128)}else if(r<1114112){if((t-=4)<0)break;s.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}else throw Error("Invalid code point")}return s}function L(e){return t.toByteArray(function(e){if((e=(e=e.split("=")[0]).trim().replace(R,"")).length<2)return"";for(;e.length%4!=0;)e+="=";return e}(e))}function M(e,t,r,n){let i;for(i=0;i<n&&!(i+r>=t.length||i>=e.length);++i)t[i+r]=e[i];return i}function F(e,t){return e instanceof t||null!=e&&null!=e.constructor&&null!=e.constructor.name&&e.constructor.name===t.name}var U=function(){let e="0123456789abcdef",t=Array(256);for(let r=0;r<16;++r){let n=16*r;for(let i=0;i<16;++i)t[n+i]=e[r]+e[i]}return t}();function V(e){return typeof BigInt>"u"?B:e}function B(){throw Error("BigInt not supported")}}),y={};((e,t)=>{for(var r in t)a(e,r,{get:t[r],enumerable:!0})})(y,{default:()=>w}),t.exports=d(a({},"__esModule",{value:!0}),y);var v=f(g());n=f(g()),i=t.exports,d(y,n,"default"),i&&d(i,n,"default");var w=v.default;/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/},{}],d239L:[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"FirebaseError",()=>a.FirebaseError),n.export(r,"SDK_VERSION",()=>C),n.export(r,"_DEFAULT_ENTRY_NAME",()=>d),n.export(r,"_addComponent",()=>y),n.export(r,"_addOrOverwriteComponent",()=>v),n.export(r,"_apps",()=>p),n.export(r,"_clearComponents",()=>T),n.export(r,"_components",()=>g),n.export(r,"_getProvider",()=>b),n.export(r,"_isFirebaseApp",()=>_),n.export(r,"_isFirebaseServerApp",()=>E),n.export(r,"_registerComponent",()=>w),n.export(r,"_removeServiceInstance",()=>I),n.export(r,"_serverApps",()=>m),n.export(r,"deleteApp",()=>R),n.export(r,"getApp",()=>k),n.export(r,"getApps",()=>O),n.export(r,"initializeApp",()=>D),n.export(r,"initializeServerApp",()=>N),n.export(r,"onLog",()=>L),n.export(r,"registerVersion",()=>P),n.export(r,"setLogLevel",()=>M);var i=e("@firebase/component"),s=e("@firebase/logger"),a=e("@firebase/util"),o=e("idb");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l{constructor(e){this.container=e}getPlatformInfoString(){let e=this.container.getProviders();return e.map(e=>{if(!function(e){let t=e.getComponent();return(null==t?void 0:t.type)==="VERSION"}(e))return null;{let t=e.getImmediate();return`${t.library}/${t.version}`}}).filter(e=>e).join(" ")}}let u="@firebase/app",c="0.10.6",h=new s.Logger("@firebase/app"),d="[DEFAULT]",f={[u]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","@firebase/vertexai-preview":"fire-vertex","fire-js":"fire-js",firebase:"fire-js-all"},p=new Map,m=new Map,g=new Map;function y(e,t){try{e.container.addComponent(t)}catch(r){h.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,r)}}function v(e,t){e.container.addOrOverwriteComponent(t)}function w(e){let t=e.name;if(g.has(t))return h.debug(`There were multiple attempts to register component ${t}.`),!1;for(let r of(g.set(t,e),p.values()))y(r,e);for(let t of m.values())y(t,e);return!0}function b(e,t){let r=e.container.getProvider("heartbeat").getImmediate({optional:!0});return r&&r.triggerHeartbeat(),e.container.getProvider(t)}function I(e,t,r=d){b(e,t).clearInstance(r)}function _(e){return void 0!==e.options}function E(e){return void 0!==e.settings}function T(){g.clear()}let S=new a.ErrorFactory("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class x{constructor(e,t,r){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new i.Component("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw S.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A extends x{constructor(e,t,r,n){let i=void 0!==t.automaticDataCollectionEnabled&&t.automaticDataCollectionEnabled,s={name:r,automaticDataCollectionEnabled:i};void 0!==e.apiKey?super(e,s,n):super(e.options,s,n),this._serverConfig=Object.assign({automaticDataCollectionEnabled:i},t),this._finalizationRegistry=null,"undefined"!=typeof FinalizationRegistry&&(this._finalizationRegistry=new FinalizationRegistry(()=>{this.automaticCleanup()})),this._refCount=0,this.incRefCount(this._serverConfig.releaseOnDeref),this._serverConfig.releaseOnDeref=void 0,t.releaseOnDeref=void 0,P(u,c,"serverapp")}toJSON(){}get refCount(){return this._refCount}incRefCount(e){this.isDeleted||(this._refCount++,void 0!==e&&null!==this._finalizationRegistry&&this._finalizationRegistry.register(e,this))}decRefCount(){return this.isDeleted?0:--this._refCount}automaticCleanup(){R(this)}get settings(){return this.checkDestroyed(),this._serverConfig}checkDestroyed(){if(this.isDeleted)throw S.create("server-app-deleted")}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let C="10.12.3";function D(e,t={}){let r=e;if("object"!=typeof t){let e=t;t={name:e}}let n=Object.assign({name:d,automaticDataCollectionEnabled:!1},t),s=n.name;if("string"!=typeof s||!s)throw S.create("bad-app-name",{appName:String(s)});if(r||(r=(0,a.getDefaultAppConfig)()),!r)throw S.create("no-options");let o=p.get(s);if(o){if((0,a.deepEqual)(r,o.options)&&(0,a.deepEqual)(n,o.config))return o;throw S.create("duplicate-app",{appName:s})}let l=new i.ComponentContainer(s);for(let e of g.values())l.addComponent(e);let u=new x(r,n,l);return p.set(s,u),u}function N(e,t){let r;if((0,a.isBrowser)()&&!(0,a.isWebWorker)())throw S.create("invalid-server-app-environment");void 0===t.automaticDataCollectionEnabled&&(t.automaticDataCollectionEnabled=!1),r=_(e)?e.options:e;let n=Object.assign(Object.assign({},t),r);if(void 0!==n.releaseOnDeref&&delete n.releaseOnDeref,void 0!==t.releaseOnDeref&&"undefined"==typeof FinalizationRegistry)throw S.create("finalization-registry-not-supported",{});let s=""+[...JSON.stringify(n)].reduce((e,t)=>Math.imul(31,e)+t.charCodeAt(0)|0,0),o=m.get(s);if(o)return o.incRefCount(t.releaseOnDeref),o;let l=new i.ComponentContainer(s);for(let e of g.values())l.addComponent(e);let u=new A(r,t,s,l);return m.set(s,u),u}function k(e=d){let t=p.get(e);if(!t&&e===d&&(0,a.getDefaultAppConfig)())return D();if(!t)throw S.create("no-app",{appName:e});return t}function O(){return Array.from(p.values())}async function R(e){let t=!1,r=e.name;p.has(r)?(t=!0,p.delete(r)):m.has(r)&&0>=e.decRefCount()&&(m.delete(r),t=!0),t&&(await Promise.all(e.container.getProviders().map(e=>e.delete())),e.isDeleted=!0)}function P(e,t,r){var n;let s=null!==(n=f[e])&&void 0!==n?n:e;r&&(s+=`-${r}`);let a=s.match(/\s|\//),o=t.match(/\s|\//);if(a||o){let e=[`Unable to register library "${s}" with version "${t}":`];a&&e.push(`library name "${s}" contains illegal characters (whitespace or "/")`),a&&o&&e.push("and"),o&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),h.warn(e.join(" "));return}w(new i.Component(`${s}-version`,()=>({library:s,version:t}),"VERSION"))}function L(e,t){if(null!==e&&"function"!=typeof e)throw S.create("invalid-log-argument");(0,s.setUserLogHandler)(e,t)}function M(e){(0,s.setLogLevel)(e)}let F="firebase-heartbeat-store",U=null;function V(){return U||(U=(0,o.openDB)("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(F)}catch(e){console.warn(e)}}}).catch(e=>{throw S.create("idb-open",{originalErrorMessage:e.message})})),U}async function B(e){try{let t=await V(),r=t.transaction(F),n=await r.objectStore(F).get(q(e));return await r.done,n}catch(e){if(e instanceof a.FirebaseError)h.warn(e.message);else{let t=S.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});h.warn(t.message)}}}async function j(e,t){try{let r=await V(),n=r.transaction(F,"readwrite"),i=n.objectStore(F);await i.put(t,q(e)),await n.done}catch(e){if(e instanceof a.FirebaseError)h.warn(e.message);else{let t=S.create("idb-set",{originalErrorMessage:null==e?void 0:e.message});h.warn(t.message)}}}function q(e){return`${e.name}!${e.options.appId}`}class z{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new K(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){var e,t;let r=this.container.getProvider("platform-logger").getImmediate(),n=r.getPlatformInfoString(),i=G();return(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)==null)?void 0:this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(e=>e.date===i)?void 0:(this._heartbeatsCache.heartbeats.push({date:i,agent:n}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(e=>{let t=new Date(e.date).valueOf(),r=Date.now();return r-t<=2592e6}),this._storage.overwrite(this._heartbeatsCache))}async getHeartbeatsHeader(){var e;if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)==null||0===this._heartbeatsCache.heartbeats.length)return"";let t=G(),{heartbeatsToSend:r,unsentEntries:n}=function(e,t=1024){let r=[],n=e.slice();for(let i of e){let e=r.find(e=>e.agent===i.agent);if(e){if(e.dates.push(i.date),$(r)>t){e.dates.pop();break}}else if(r.push({agent:i.agent,dates:[i.date]}),$(r)>t){r.pop();break}n=n.slice(1)}return{heartbeatsToSend:r,unsentEntries:n}}(this._heartbeatsCache.heartbeats),i=(0,a.base64urlEncodeWithoutPadding)(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}}function G(){let e=new Date;return e.toISOString().substring(0,10)}class K{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!(0,a.isIndexedDBAvailable)()&&(0,a.validateIndexedDBOpenable)().then(()=>!0).catch(()=>!1)}async read(){let e=await this._canUseIndexedDBPromise;if(!e)return{heartbeats:[]};{let e=await B(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}}async overwrite(e){var t;let r=await this._canUseIndexedDBPromise;if(r){let r=await this.read();return j(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;let r=await this._canUseIndexedDBPromise;if(r){let r=await this.read();return j(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}}}function $(e){return(0,a.base64urlEncodeWithoutPadding)(JSON.stringify({version:2,heartbeats:e})).length}w(new i.Component("platform-logger",e=>new l(e),"PRIVATE")),w(new i.Component("heartbeat",e=>new z(e),"PRIVATE")),P(u,c,""),P(u,c,"esm2017"),P("fire-js","")},{"@firebase/component":"8ml9B","@firebase/logger":"aO433","@firebase/util":"aD5S7",idb:"bF9bp","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],"8ml9B":[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"Component",()=>s),n.export(r,"ComponentContainer",()=>l),n.export(r,"Provider",()=>o);var i=e("@firebase/util");class s{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let a="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class o{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let e=new i.Deferred;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{let r=this.getOrInitializeService({instanceIdentifier:t});r&&e.resolve(r)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;let r=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),n=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(this.isInitialized(r)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:r})}catch(e){if(n)return null;throw e}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if("EAGER"===e.instantiationMode)try{this.getOrInitializeService({instanceIdentifier:a})}catch(e){}for(let[e,t]of this.instancesDeferred.entries()){let r=this.normalizeInstanceIdentifier(e);try{let e=this.getOrInitializeService({instanceIdentifier:r});t.resolve(e)}catch(e){}}}}clearInstance(e=a){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=a){return this.instances.has(e)}getOptions(e=a){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let n=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[e,t]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(e);r===i&&t.resolve(n)}return n}onInit(e,t){var r;let n=this.normalizeInstanceIdentifier(t),i=null!==(r=this.onInitCallbacks.get(n))&&void 0!==r?r:new Set;i.add(e),this.onInitCallbacks.set(n,i);let s=this.instances.get(n);return s&&e(s,n),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let n of r)try{n(e,t)}catch(e){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:e===a?void 0:e,options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch(e){}return r||null}normalizeInstanceIdentifier(e=a){return this.component?this.component.multipleInstances?e:a:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class l{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){let t=this.getProvider(e.name);t.isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new o(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}},{"@firebase/util":"aD5S7","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],aD5S7:[function(e,t,r){/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"CONSTANTS",()=>a),n.export(r,"DecodeBase64StringError",()=>d),n.export(r,"Deferred",()=>A),n.export(r,"ErrorFactory",()=>K),n.export(r,"FirebaseError",()=>G),n.export(r,"MAX_VALUE_MILLIS",()=>e_),n.export(r,"RANDOM_FACTOR",()=>eE),n.export(r,"Sha1",()=>eu),n.export(r,"areCookiesEnabled",()=>z),n.export(r,"assert",()=>o),n.export(r,"assertionError",()=>l),n.export(r,"async",()=>ed),n.export(r,"base64",()=>h),n.export(r,"base64Decode",()=>m),n.export(r,"base64Encode",()=>f),n.export(r,"base64urlEncodeWithoutPadding",()=>p),n.export(r,"calculateBackoffMillis",()=>eT),n.export(r,"contains",()=>ee),n.export(r,"createMockUserToken",()=>C),n.export(r,"createSubscribe",()=>ec),n.export(r,"decode",()=>W),n.export(r,"deepCopy",()=>g),n.export(r,"deepEqual",()=>function e(t,r){if(t===r)return!0;let n=Object.keys(t),i=Object.keys(r);for(let s of n){if(!i.includes(s))return!1;let n=t[s],a=r[s];if(ei(n)&&ei(a)){if(!e(n,a))return!1}else if(n!==a)return!1}for(let e of i)if(!n.includes(e))return!1;return!0}),n.export(r,"deepExtend",()=>y),n.export(r,"errorPrefix",()=>em),n.export(r,"extractQuerystring",()=>el),n.export(r,"getDefaultAppConfig",()=>S),n.export(r,"getDefaultEmulatorHost",()=>E),n.export(r,"getDefaultEmulatorHostnameAndPort",()=>T),n.export(r,"getDefaults",()=>_),n.export(r,"getExperimentalSetting",()=>x),n.export(r,"getGlobal",()=>v),n.export(r,"getModularInstance",()=>ex),n.export(r,"getUA",()=>D),n.export(r,"isAdmin",()=>Z),n.export(r,"isBrowser",()=>O),n.export(r,"isBrowserExtension",()=>P),n.export(r,"isElectron",()=>M),n.export(r,"isEmpty",()=>er),n.export(r,"isIE",()=>F),n.export(r,"isIndexedDBAvailable",()=>j),n.export(r,"isMobileCordova",()=>N),n.export(r,"isNode",()=>k),n.export(r,"isNodeSdk",()=>V),n.export(r,"isReactNative",()=>L),n.export(r,"isSafari",()=>B),n.export(r,"isUWP",()=>U),n.export(r,"isValidFormat",()=>X),n.export(r,"isValidTimestamp",()=>J),n.export(r,"isWebWorker",()=>R),n.export(r,"issuedAtTime",()=>Y),n.export(r,"jsonEval",()=>H),n.export(r,"map",()=>en),n.export(r,"ordinal",()=>eS),n.export(r,"promiseWithTimeout",()=>es),n.export(r,"querystring",()=>ea),n.export(r,"querystringDecode",()=>eo),n.export(r,"safeGet",()=>et),n.export(r,"stringLength",()=>eb),n.export(r,"stringToByteArray",()=>ew),n.export(r,"stringify",()=>Q),n.export(r,"uuidv4",()=>eI),n.export(r,"validateArgCount",()=>ep),n.export(r,"validateCallback",()=>ey),n.export(r,"validateContextObject",()=>ev),n.export(r,"validateIndexedDBOpenable",()=>q),n.export(r,"validateNamespace",()=>eg);var i=arguments[3],s=e("318fa585782f0f7c");let a={NODE_CLIENT:!1,NODE_ADMIN:!1,SDK_VERSION:"${JSCORE_VERSION}"},o=function(e,t){if(!e)throw l(t)},l=function(e){return Error("Firebase Database ("+a.SDK_VERSION+") INTERNAL ASSERT FAILED: "+e)},u=function(e){let t=[],r=0;for(let n=0;n<e.length;n++){let i=e.charCodeAt(n);i<128?t[r++]=i:(i<2048?t[r++]=i>>6|192:((64512&i)==55296&&n+1<e.length&&(64512&e.charCodeAt(n+1))==56320?(i=65536+((1023&i)<<10)+(1023&e.charCodeAt(++n)),t[r++]=i>>18|240,t[r++]=i>>12&63|128):t[r++]=i>>12|224,t[r++]=i>>6&63|128),t[r++]=63&i|128)}return t},c=function(e){let t=[],r=0,n=0;for(;r<e.length;){let i=e[r++];if(i<128)t[n++]=String.fromCharCode(i);else if(i>191&&i<224){let s=e[r++];t[n++]=String.fromCharCode((31&i)<<6|63&s)}else if(i>239&&i<365){let s=e[r++],a=e[r++],o=e[r++],l=((7&i)<<18|(63&s)<<12|(63&a)<<6|63&o)-65536;t[n++]=String.fromCharCode(55296+(l>>10)),t[n++]=String.fromCharCode(56320+(1023&l))}else{let s=e[r++],a=e[r++];t[n++]=String.fromCharCode((15&i)<<12|(63&s)<<6|63&a)}}return t.join("")},h={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let r=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let t=0;t<e.length;t+=3){let i=e[t],s=t+1<e.length,a=s?e[t+1]:0,o=t+2<e.length,l=o?e[t+2]:0,u=i>>2,c=(3&i)<<4|a>>4,h=(15&a)<<2|l>>6,d=63&l;o||(d=64,s||(h=64)),n.push(r[u],r[c],r[h],r[d])}return n.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(u(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):c(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let r=t?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let t=0;t<e.length;){let i=r[e.charAt(t++)],s=t<e.length,a=s?r[e.charAt(t)]:0;++t;let o=t<e.length,l=o?r[e.charAt(t)]:64;++t;let u=t<e.length,c=u?r[e.charAt(t)]:64;if(++t,null==i||null==a||null==l||null==c)throw new d;let h=i<<2|a>>4;if(n.push(h),64!==l){let e=a<<4&240|l>>2;if(n.push(e),64!==c){let e=l<<6&192|c;n.push(e)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class d extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}let f=function(e){let t=u(e);return h.encodeByteArray(t,!0)},p=function(e){return f(e).replace(/\./g,"")},m=function(e){try{return h.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g(e){return y(void 0,e)}function y(e,t){if(!(t instanceof Object))return t;switch(t.constructor){case Date:return new Date(t.getTime());case Object:void 0===e&&(e={});break;case Array:e=[];break;default:return t}for(let r in t)t.hasOwnProperty(r)&&"__proto__"!==r&&(e[r]=y(e[r],t[r]));return e}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==i)return i;throw Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let w=()=>v().__FIREBASE_DEFAULTS__,b=()=>{if(void 0===s||void 0===s.env)return;let e=void 0;if(e)return JSON.parse(e)},I=()=>{let e;if("undefined"==typeof document)return;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}let t=e&&m(e[1]);return t&&JSON.parse(t)},_=()=>{try{return w()||b()||I()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},E=e=>{var t,r;return null===(r=null===(t=_())||void 0===t?void 0:t.emulatorHosts)||void 0===r?void 0:r[e]},T=e=>{let t=E(e);if(!t)return;let r=t.lastIndexOf(":");if(r<=0||r+1===t.length)throw Error(`Invalid host ${t} with no separate hostname and port!`);let n=parseInt(t.substring(r+1),10);return"["===t[0]?[t.substring(1,r-1),n]:[t.substring(0,r),n]},S=()=>{var e;return null===(e=_())||void 0===e?void 0:e.config},x=e=>{var t;return null===(t=_())||void 0===t?void 0:t[`_${e}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function C(e,t){if(e.uid)throw Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');let r=t||"demo-project",n=e.iat||0,i=e.sub||e.user_id;if(!i)throw Error("mockUserToken must contain 'sub' or 'user_id' field!");let s=Object.assign({iss:`https://securetoken.google.com/${r}`,aud:r,iat:n,exp:n+3600,auth_time:n,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}}},e);return[p(JSON.stringify({alg:"none",type:"JWT"})),p(JSON.stringify(s)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function N(){return"undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(D())}function k(){var e;let t=null===(e=_())||void 0===e?void 0:e.forceEnvironment;if("node"===t)return!0;if("browser"===t)return!1;try{return"[object process]"===Object.prototype.toString.call(i.process)}catch(e){return!1}}function O(){return"undefined"!=typeof window||R()}function R(){return"undefined"!=typeof WorkerGlobalScope&&"undefined"!=typeof self&&self instanceof WorkerGlobalScope}function P(){let e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}function L(){return"object"==typeof navigator&&"ReactNative"===navigator.product}function M(){return D().indexOf("Electron/")>=0}function F(){let e=D();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}function U(){return D().indexOf("MSAppHost/")>=0}function V(){return!0===a.NODE_CLIENT||!0===a.NODE_ADMIN}function B(){return!k()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function j(){try{return"object"==typeof indexedDB}catch(e){return!1}}function q(){return new Promise((e,t)=>{try{let r=!0,n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),r||self.indexedDB.deleteDatabase(n),e(!0)},i.onupgradeneeded=()=>{r=!1},i.onerror=()=>{var e;t((null===(e=i.error)||void 0===e?void 0:e.message)||"")}}catch(e){t(e)}})}function z(){return"undefined"!=typeof navigator&&!!navigator.cookieEnabled}class G extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name="FirebaseError",Object.setPrototypeOf(this,G.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,K.prototype.create)}}class K{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},n=`${this.service}/${e}`,i=this.errors[e],s=i?i.replace($,(e,t)=>{let n=r[t];return null!=n?String(n):`<${t}?>`}):"Error",a=`${this.serviceName}: ${s} (${n}).`,o=new G(n,a,r);return o}}let $=/\{\$([^}]+)}/g;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function H(e){return JSON.parse(e)}function Q(e){return JSON.stringify(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let W=function(e){let t={},r={},n={},i="";try{let s=e.split(".");t=H(m(s[0])||""),r=H(m(s[1])||""),i=s[2],n=r.d||{},delete r.d}catch(e){}return{header:t,claims:r,data:n,signature:i}},J=function(e){let t=W(e).claims,r=Math.floor(new Date().getTime()/1e3),n=0,i=0;return"object"==typeof t&&(t.hasOwnProperty("nbf")?n=t.nbf:t.hasOwnProperty("iat")&&(n=t.iat),i=t.hasOwnProperty("exp")?t.exp:n+86400),!!r&&!!n&&!!i&&r>=n&&r<=i},Y=function(e){let t=W(e).claims;return"object"==typeof t&&t.hasOwnProperty("iat")?t.iat:null},X=function(e){let t=W(e),r=t.claims;return!!r&&"object"==typeof r&&r.hasOwnProperty("iat")},Z=function(e){let t=W(e).claims;return"object"==typeof t&&!0===t.admin};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ee(e,t){return Object.prototype.hasOwnProperty.call(e,t)}function et(e,t){return Object.prototype.hasOwnProperty.call(e,t)?e[t]:void 0}function er(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function en(e,t,r){let n={};for(let i in e)Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=t.call(r,e[i],i,e));return n}function ei(e){return null!==e&&"object"==typeof e}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function es(e,t=2e3){let r=new A;return setTimeout(()=>r.reject("timeout!"),t),e.then(r.resolve,r.reject),r.promise}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ea(e){let t=[];for(let[r,n]of Object.entries(e))Array.isArray(n)?n.forEach(e=>{t.push(encodeURIComponent(r)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(r)+"="+encodeURIComponent(n));return t.length?"&"+t.join("&"):""}function eo(e){let t={},r=e.replace(/^\?/,"").split("&");return r.forEach(e=>{if(e){let[r,n]=e.split("=");t[decodeURIComponent(r)]=decodeURIComponent(n)}}),t}function el(e){let t=e.indexOf("?");if(!t)return"";let r=e.indexOf("#",t);return e.substring(t,r>0?r:void 0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{constructor(){this.chain_=[],this.buf_=[],this.W_=[],this.pad_=[],this.inbuf_=0,this.total_=0,this.blockSize=64,this.pad_[0]=128;for(let e=1;e<this.blockSize;++e)this.pad_[e]=0;this.reset()}reset(){this.chain_[0]=1732584193,this.chain_[1]=4023233417,this.chain_[2]=2562383102,this.chain_[3]=271733878,this.chain_[4]=3285377520,this.inbuf_=0,this.total_=0}compress_(e,t){let r,n;t||(t=0);let i=this.W_;if("string"==typeof e)for(let r=0;r<16;r++)i[r]=e.charCodeAt(t)<<24|e.charCodeAt(t+1)<<16|e.charCodeAt(t+2)<<8|e.charCodeAt(t+3),t+=4;else for(let r=0;r<16;r++)i[r]=e[t]<<24|e[t+1]<<16|e[t+2]<<8|e[t+3],t+=4;for(let e=16;e<80;e++){let t=i[e-3]^i[e-8]^i[e-14]^i[e-16];i[e]=(t<<1|t>>>31)&4294967295}let s=this.chain_[0],a=this.chain_[1],o=this.chain_[2],l=this.chain_[3],u=this.chain_[4];for(let e=0;e<80;e++){e<40?e<20?(r=l^a&(o^l),n=1518500249):(r=a^o^l,n=1859775393):e<60?(r=a&o|l&(a|o),n=2400959708):(r=a^o^l,n=3395469782);let t=(s<<5|s>>>27)+r+u+n+i[e]&4294967295;u=l,l=o,o=(a<<30|a>>>2)&4294967295,a=s,s=t}this.chain_[0]=this.chain_[0]+s&4294967295,this.chain_[1]=this.chain_[1]+a&4294967295,this.chain_[2]=this.chain_[2]+o&4294967295,this.chain_[3]=this.chain_[3]+l&4294967295,this.chain_[4]=this.chain_[4]+u&4294967295}update(e,t){if(null==e)return;void 0===t&&(t=e.length);let r=t-this.blockSize,n=0,i=this.buf_,s=this.inbuf_;for(;n<t;){if(0===s)for(;n<=r;)this.compress_(e,n),n+=this.blockSize;if("string"==typeof e){for(;n<t;)if(i[s]=e.charCodeAt(n),++s,++n,s===this.blockSize){this.compress_(i),s=0;break}}else for(;n<t;)if(i[s]=e[n],++s,++n,s===this.blockSize){this.compress_(i),s=0;break}}this.inbuf_=s,this.total_+=t}digest(){let e=[],t=8*this.total_;this.inbuf_<56?this.update(this.pad_,56-this.inbuf_):this.update(this.pad_,this.blockSize-(this.inbuf_-56));for(let e=this.blockSize-1;e>=56;e--)this.buf_[e]=255&t,t/=256;this.compress_(this.buf_);let r=0;for(let t=0;t<5;t++)for(let n=24;n>=0;n-=8)e[r]=this.chain_[t]>>n&255,++r;return e}}function ec(e,t){let r=new eh(e,t);return r.subscribe.bind(r)}class eh{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let n;if(void 0===e&&void 0===t&&void 0===r)throw Error("Missing Observer.");void 0===(n=!function(e,t){if("object"!=typeof e||null===e)return!1;for(let r of t)if(r in e&&"function"==typeof e[r])return!0;return!1}(e,["next","error","complete"])?{next:e,error:t,complete:r}:e).next&&(n.next=ef),void 0===n.error&&(n.error=ef),void 0===n.complete&&(n.complete=ef);let i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?n.error(this.finalError):n.complete()}catch(e){}}),this.observers.push(n),i}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(e){"undefined"!=typeof console&&console.error&&console.error(e)}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function ed(e,t){return(...r)=>{Promise.resolve(!0).then(()=>{e(...r)}).catch(e=>{t&&t(e)})}}function ef(){}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ep=function(e,t,r,n){let i;if(n<t?i="at least "+t:n>r&&(i=0===r?"none":"no more than "+r),i){let t=e+" failed: Was called with "+n+(1===n?" argument.":" arguments.")+" Expects "+i+".";throw Error(t)}};function em(e,t){return`${e} failed: ${t} argument `}function eg(e,t,r){if((!r||t)&&"string"!=typeof t)throw Error(em(e,"namespace")+"must be a valid firebase namespace.")}function ey(e,t,r,n){if((!n||r)&&"function"!=typeof r)throw Error(em(e,t)+"must be a valid function.")}function ev(e,t,r,n){if((!n||r)&&("object"!=typeof r||null===r))throw Error(em(e,t)+"must be a valid context object.")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ew=function(e){let t=[],r=0;for(let n=0;n<e.length;n++){let i=e.charCodeAt(n);if(i>=55296&&i<=56319){let t=i-55296;o(++n<e.length,"Surrogate pair missing trail surrogate.");let r=e.charCodeAt(n)-56320;i=65536+(t<<10)+r}i<128?t[r++]=i:(i<2048?t[r++]=i>>6|192:(i<65536?t[r++]=i>>12|224:(t[r++]=i>>18|240,t[r++]=i>>12&63|128),t[r++]=i>>6&63|128),t[r++]=63&i|128)}return t},eb=function(e){let t=0;for(let r=0;r<e.length;r++){let n=e.charCodeAt(r);n<128?t++:n<2048?t+=2:n>=55296&&n<=56319?(t+=4,r++):t+=3}return t},eI=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,e=>{let t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)})},e_=144e5,eE=.5;function eT(e,t=1e3,r=2){let n=t*Math.pow(r,e),i=Math.round(eE*n*(Math.random()-.5)*2);return Math.min(e_,n+i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eS(e){return Number.isFinite(e)?e+function(e){e=Math.abs(e);let t=e%100;if(t>=10&&t<=20)return"th";let r=e%10;return 1===r?"st":2===r?"nd":3===r?"rd":"th"}(e):`${e}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ex(e){return e&&e._delegate?e._delegate:e}},{"318fa585782f0f7c":"k5N9S","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],hbR2Q:[function(e,t,r){r.interopDefault=function(e){return e&&e.__esModule?e:{default:e}},r.defineInteropFlag=function(e){Object.defineProperty(e,"__esModule",{value:!0})},r.exportAll=function(e,t){return Object.keys(e).forEach(function(r){"default"===r||"__esModule"===r||t.hasOwnProperty(r)||Object.defineProperty(t,r,{enumerable:!0,get:function(){return e[r]}})}),t},r.export=function(e,t,r){Object.defineProperty(e,t,{enumerable:!0,get:r})}},{}],aO433:[function(e,t,r){/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var n,i,s=e("@parcel/transformer-js/src/esmodule-helpers.js");s.defineInteropFlag(r),s.export(r,"LogLevel",()=>i),s.export(r,"Logger",()=>h),s.export(r,"setLogLevel",()=>d),s.export(r,"setUserLogHandler",()=>f);let a=[];(n=i||(i={}))[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT";let o={debug:i.DEBUG,verbose:i.VERBOSE,info:i.INFO,warn:i.WARN,error:i.ERROR,silent:i.SILENT},l=i.INFO,u={[i.DEBUG]:"log",[i.VERBOSE]:"log",[i.INFO]:"info",[i.WARN]:"warn",[i.ERROR]:"error"},c=(e,t,...r)=>{if(t<e.logLevel)return;let n=new Date().toISOString(),i=u[t];if(i)console[i](`[${n}]  ${e.name}:`,...r);else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class h{constructor(e){this.name=e,this._logLevel=l,this._logHandler=c,this._userLogHandler=null,a.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in i))throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?o[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,i.DEBUG,...e),this._logHandler(this,i.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,i.VERBOSE,...e),this._logHandler(this,i.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,i.INFO,...e),this._logHandler(this,i.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,i.WARN,...e),this._logHandler(this,i.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,i.ERROR,...e),this._logHandler(this,i.ERROR,...e)}}function d(e){a.forEach(t=>{t.setLogLevel(e)})}function f(e,t){for(let r of a){let n=null;t&&t.level&&(n=o[t.level]),null===e?r.userLogHandler=null:r.userLogHandler=(t,r,...s)=>{let a=s.map(e=>{if(null==e)return null;if("string"==typeof e)return e;if("number"==typeof e||"boolean"==typeof e)return e.toString();if(e instanceof Error)return e.message;try{return JSON.stringify(e)}catch(e){return null}}).filter(e=>e).join(" ");r>=(null!=n?n:t.logLevel)&&e({level:i[r].toLowerCase(),message:a,args:s,type:t.name})}}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],bF9bp:[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"unwrap",()=>i.u),n.export(r,"wrap",()=>i.w),n.export(r,"deleteDB",()=>a),n.export(r,"openDB",()=>s);var i=e("./wrap-idb-value.js");function s(e,t,{blocked:r,upgrade:n,blocking:s,terminated:a}={}){let o=indexedDB.open(e,t),l=(0,i.w)(o);return n&&o.addEventListener("upgradeneeded",e=>{n((0,i.w)(o.result),e.oldVersion,e.newVersion,(0,i.w)(o.transaction),e)}),r&&o.addEventListener("blocked",e=>r(e.oldVersion,e.newVersion,e)),l.then(e=>{a&&e.addEventListener("close",()=>a()),s&&e.addEventListener("versionchange",e=>s(e.oldVersion,e.newVersion,e))}).catch(()=>{}),l}function a(e,{blocked:t}={}){let r=indexedDB.deleteDatabase(e);return t&&r.addEventListener("blocked",e=>t(e.oldVersion,e)),(0,i.w)(r).then(()=>void 0)}let o=["get","getKey","getAll","getAllKeys","count"],l=["put","add","delete","clear"],u=new Map;function c(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(u.get(t))return u.get(t);let r=t.replace(/FromIndex$/,""),n=t!==r,i=l.includes(r);if(!(r in(n?IDBIndex:IDBObjectStore).prototype)||!(i||o.includes(r)))return;let s=async function(e,...t){let s=this.transaction(e,i?"readwrite":"readonly"),a=s.store;return n&&(a=a.index(t.shift())),(await Promise.all([a[r](...t),i&&s.done]))[0]};return u.set(t,s),s}(0,i.r)(e=>({...e,get:(t,r,n)=>c(t,r)||e.get(t,r,n),has:(t,r)=>!!c(t,r)||e.has(t,r)}))},{"./wrap-idb-value.js":"bi0fX","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],bi0fX:[function(e,t,r){let n,i;var s=e("@parcel/transformer-js/src/esmodule-helpers.js");s.defineInteropFlag(r),s.export(r,"a",()=>h),s.export(r,"i",()=>a),s.export(r,"r",()=>f),s.export(r,"u",()=>m),s.export(r,"w",()=>p);let a=(e,t)=>t.some(t=>e instanceof t),o=new WeakMap,l=new WeakMap,u=new WeakMap,c=new WeakMap,h=new WeakMap,d={get(e,t,r){if(e instanceof IDBTransaction){if("done"===t)return l.get(e);if("objectStoreNames"===t)return e.objectStoreNames||u.get(e);if("store"===t)return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return p(e[t])},set:(e,t,r)=>(e[t]=r,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function f(e){d=e(d)}function p(e){var t;if(e instanceof IDBRequest)return function(e){let t=new Promise((t,r)=>{let n=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{t(p(e.result)),n()},s=()=>{r(e.error),n()};e.addEventListener("success",i),e.addEventListener("error",s)});return t.then(t=>{t instanceof IDBCursor&&o.set(t,e)}).catch(()=>{}),h.set(t,e),t}(e);if(c.has(e))return c.get(e);let r="function"==typeof(t=e)?t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(i||(i=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(m(this),e),p(o.get(this))}:function(...e){return p(t.apply(m(this),e))}:function(e,...r){let n=t.call(m(this),e,...r);return u.set(n,e.sort?e.sort():[e]),p(n)}:(t instanceof IDBTransaction&&function(e){if(l.has(e))return;let t=new Promise((t,r)=>{let n=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{t(),n()},s=()=>{r(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});l.set(e,t)}(t),a(t,n||(n=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(t,d):t;return r!==e&&(c.set(e,r),h.set(r,e)),r}let m=e=>h.get(e)},{"@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],bseDX:[function(e,t,r){var n,i,s=e("@parcel/transformer-js/src/esmodule-helpers.js");s.defineInteropFlag(r),s.export(r,"Integer",()=>n),s.export(r,"Md5",()=>i),s.export(r,"default",()=>l);var a=arguments[3],o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:void 0!==a?a:"undefined"!=typeof self?self:{},l={};(function(){function e(){this.blockSize=-1,this.blockSize=64,this.g=[,,,,],this.B=Array(this.blockSize),this.o=this.h=0,this.s()}function t(e,t,r){r||(r=0);var n=Array(16);if("string"==typeof t)for(var i=0;16>i;++i)n[i]=t.charCodeAt(r++)|t.charCodeAt(r++)<<8|t.charCodeAt(r++)<<16|t.charCodeAt(r++)<<24;else for(i=0;16>i;++i)n[i]=t[r++]|t[r++]<<8|t[r++]<<16|t[r++]<<24;t=e.g[0],r=e.g[1],i=e.g[2];var s=e.g[3],a=t+(s^r&(i^s))+n[0]+3614090360&4294967295;a=s+(i^(t=r+(a<<7&4294967295|a>>>25))&(r^i))+n[1]+3905402710&4294967295,a=i+(r^(s=t+(a<<12&4294967295|a>>>20))&(t^r))+n[2]+606105819&4294967295,a=r+(t^(i=s+(a<<17&4294967295|a>>>15))&(s^t))+n[3]+3250441966&4294967295,a=t+(s^(r=i+(a<<22&4294967295|a>>>10))&(i^s))+n[4]+4118548399&4294967295,a=s+(i^(t=r+(a<<7&4294967295|a>>>25))&(r^i))+n[5]+1200080426&4294967295,a=i+(r^(s=t+(a<<12&4294967295|a>>>20))&(t^r))+n[6]+2821735955&4294967295,a=r+(t^(i=s+(a<<17&4294967295|a>>>15))&(s^t))+n[7]+4249261313&4294967295,a=t+(s^(r=i+(a<<22&4294967295|a>>>10))&(i^s))+n[8]+1770035416&4294967295,a=s+(i^(t=r+(a<<7&4294967295|a>>>25))&(r^i))+n[9]+2336552879&4294967295,a=i+(r^(s=t+(a<<12&4294967295|a>>>20))&(t^r))+n[10]+4294925233&4294967295,a=r+(t^(i=s+(a<<17&4294967295|a>>>15))&(s^t))+n[11]+2304563134&4294967295,a=t+(s^(r=i+(a<<22&4294967295|a>>>10))&(i^s))+n[12]+1804603682&4294967295,a=s+(i^(t=r+(a<<7&4294967295|a>>>25))&(r^i))+n[13]+4254626195&4294967295,a=i+(r^(s=t+(a<<12&4294967295|a>>>20))&(t^r))+n[14]+2792965006&4294967295,a=r+(t^(i=s+(a<<17&4294967295|a>>>15))&(s^t))+n[15]+1236535329&4294967295,r=i+(a<<22&4294967295|a>>>10),a=t+(i^s&(r^i))+n[1]+4129170786&4294967295,t=r+(a<<5&4294967295|a>>>27),a=s+(r^i&(t^r))+n[6]+3225465664&4294967295,s=t+(a<<9&4294967295|a>>>23),a=i+(t^r&(s^t))+n[11]+643717713&4294967295,i=s+(a<<14&4294967295|a>>>18),a=r+(s^t&(i^s))+n[0]+3921069994&4294967295,r=i+(a<<20&4294967295|a>>>12),a=t+(i^s&(r^i))+n[5]+3593408605&4294967295,t=r+(a<<5&4294967295|a>>>27),a=s+(r^i&(t^r))+n[10]+38016083&4294967295,s=t+(a<<9&4294967295|a>>>23),a=i+(t^r&(s^t))+n[15]+3634488961&4294967295,i=s+(a<<14&4294967295|a>>>18),a=r+(s^t&(i^s))+n[4]+3889429448&4294967295,r=i+(a<<20&4294967295|a>>>12),a=t+(i^s&(r^i))+n[9]+568446438&4294967295,t=r+(a<<5&4294967295|a>>>27),a=s+(r^i&(t^r))+n[14]+3275163606&4294967295,s=t+(a<<9&4294967295|a>>>23),a=i+(t^r&(s^t))+n[3]+4107603335&4294967295,i=s+(a<<14&4294967295|a>>>18),a=r+(s^t&(i^s))+n[8]+1163531501&4294967295,r=i+(a<<20&4294967295|a>>>12),a=t+(i^s&(r^i))+n[13]+2850285829&4294967295,t=r+(a<<5&4294967295|a>>>27),a=s+(r^i&(t^r))+n[2]+4243563512&4294967295,s=t+(a<<9&4294967295|a>>>23),a=i+(t^r&(s^t))+n[7]+1735328473&4294967295,i=s+(a<<14&4294967295|a>>>18),a=r+(s^t&(i^s))+n[12]+2368359562&4294967295,a=t+((r=i+(a<<20&4294967295|a>>>12))^i^s)+n[5]+4294588738&4294967295,a=s+((t=r+(a<<4&4294967295|a>>>28))^r^i)+n[8]+2272392833&4294967295,a=i+((s=t+(a<<11&4294967295|a>>>21))^t^r)+n[11]+1839030562&4294967295,a=r+((i=s+(a<<16&4294967295|a>>>16))^s^t)+n[14]+4259657740&4294967295,a=t+((r=i+(a<<23&4294967295|a>>>9))^i^s)+n[1]+2763975236&4294967295,a=s+((t=r+(a<<4&4294967295|a>>>28))^r^i)+n[4]+1272893353&4294967295,a=i+((s=t+(a<<11&4294967295|a>>>21))^t^r)+n[7]+4139469664&4294967295,a=r+((i=s+(a<<16&4294967295|a>>>16))^s^t)+n[10]+3200236656&4294967295,a=t+((r=i+(a<<23&4294967295|a>>>9))^i^s)+n[13]+681279174&4294967295,a=s+((t=r+(a<<4&4294967295|a>>>28))^r^i)+n[0]+3936430074&4294967295,a=i+((s=t+(a<<11&4294967295|a>>>21))^t^r)+n[3]+3572445317&4294967295,a=r+((i=s+(a<<16&4294967295|a>>>16))^s^t)+n[6]+76029189&4294967295,a=t+((r=i+(a<<23&4294967295|a>>>9))^i^s)+n[9]+3654602809&4294967295,a=s+((t=r+(a<<4&4294967295|a>>>28))^r^i)+n[12]+3873151461&4294967295,a=i+((s=t+(a<<11&4294967295|a>>>21))^t^r)+n[15]+530742520&4294967295,a=r+((i=s+(a<<16&4294967295|a>>>16))^s^t)+n[2]+3299628645&4294967295,r=i+(a<<23&4294967295|a>>>9),a=t+(i^(r|~s))+n[0]+4096336452&4294967295,t=r+(a<<6&4294967295|a>>>26),a=s+(r^(t|~i))+n[7]+1126891415&4294967295,s=t+(a<<10&4294967295|a>>>22),a=i+(t^(s|~r))+n[14]+2878612391&4294967295,i=s+(a<<15&4294967295|a>>>17),a=r+(s^(i|~t))+n[5]+4237533241&4294967295,r=i+(a<<21&4294967295|a>>>11),a=t+(i^(r|~s))+n[12]+1700485571&4294967295,t=r+(a<<6&4294967295|a>>>26),a=s+(r^(t|~i))+n[3]+2399980690&4294967295,s=t+(a<<10&4294967295|a>>>22),a=i+(t^(s|~r))+n[10]+4293915773&4294967295,i=s+(a<<15&4294967295|a>>>17),a=r+(s^(i|~t))+n[1]+2240044497&4294967295,r=i+(a<<21&4294967295|a>>>11),a=t+(i^(r|~s))+n[8]+1873313359&4294967295,t=r+(a<<6&4294967295|a>>>26),a=s+(r^(t|~i))+n[15]+4264355552&4294967295,s=t+(a<<10&4294967295|a>>>22),a=i+(t^(s|~r))+n[6]+2734768916&4294967295,i=s+(a<<15&4294967295|a>>>17),a=r+(s^(i|~t))+n[13]+1309151649&4294967295,r=i+(a<<21&4294967295|a>>>11),a=t+(i^(r|~s))+n[4]+4149444226&4294967295,t=r+(a<<6&4294967295|a>>>26),a=s+(r^(t|~i))+n[11]+3174756917&4294967295,s=t+(a<<10&4294967295|a>>>22),a=i+(t^(s|~r))+n[2]+718787259&4294967295,i=s+(a<<15&4294967295|a>>>17),a=r+(s^(i|~t))+n[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(i+(a<<21&4294967295|a>>>11))&4294967295,e.g[2]=e.g[2]+i&4294967295,e.g[3]=e.g[3]+s&4294967295}function r(e,t){this.h=t;for(var r=[],n=!0,i=e.length-1;0<=i;i--){var s=0|e[i];n&&s==t||(r[i]=s,n=!1)}this.g=r}(function(e,t){function r(){}r.prototype=t.prototype,e.D=t.prototype,e.prototype=new r,e.prototype.constructor=e,e.C=function(e,r,n){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[r].apply(e,i)}})(e,function(){this.blockSize=-1}),e.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0},e.prototype.u=function(e,r){void 0===r&&(r=e.length);for(var n=r-this.blockSize,i=this.B,s=this.h,a=0;a<r;){if(0==s)for(;a<=n;)t(this,e,a),a+=this.blockSize;if("string"==typeof e){for(;a<r;)if(i[s++]=e.charCodeAt(a++),s==this.blockSize){t(this,i),s=0;break}}else for(;a<r;)if(i[s++]=e[a++],s==this.blockSize){t(this,i),s=0;break}}this.h=s,this.o+=r},e.prototype.v=function(){var e=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;var r=8*this.o;for(t=e.length-8;t<e.length;++t)e[t]=255&r,r/=256;for(this.u(e),e=Array(16),t=r=0;4>t;++t)for(var n=0;32>n;n+=8)e[r++]=this.g[t]>>>n&255;return e};var s,a={};function o(e){return -128<=e&&128>e?Object.prototype.hasOwnProperty.call(a,e)?a[e]:a[e]=new r([0|e],0>e?-1:0):new r([0|e],0>e?-1:0)}function u(e){if(isNaN(e)||!isFinite(e))return c;if(0>e)return m(u(-e));for(var t=[],n=1,i=0;e>=n;i++)t[i]=e/n|0,n*=4294967296;return new r(t,0)}var c=o(0),h=o(1),d=o(16777216);function f(e){if(0!=e.h)return!1;for(var t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function p(e){return -1==e.h}function m(e){for(var t=e.g.length,n=[],i=0;i<t;i++)n[i]=~e.g[i];return new r(n,~e.h).add(h)}function g(e,t){return e.add(m(t))}function y(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function v(e,t){this.g=e,this.h=t}function w(e,t){if(f(t))throw Error("division by zero");if(f(e))return new v(c,c);if(p(e))return t=w(m(e),t),new v(m(t.g),m(t.h));if(p(t))return t=w(e,m(t)),new v(m(t.g),t.h);if(30<e.g.length){if(p(e)||p(t))throw Error("slowDivide_ only works with positive integers.");for(var r=h,n=t;0>=n.l(e);)r=b(r),n=b(n);var i=I(r,1),s=I(n,1);for(n=I(n,2),r=I(r,2);!f(n);){var a=s.add(n);0>=a.l(e)&&(i=i.add(r),s=a),n=I(n,1),r=I(r,1)}return t=g(e,i.j(t)),new v(i,t)}for(i=c;0<=e.l(t);){for(n=48>=(n=Math.ceil(Math.log(r=Math.max(1,Math.floor(e.m()/t.m())))/Math.LN2))?1:Math.pow(2,n-48),a=(s=u(r)).j(t);p(a)||0<a.l(e);)r-=n,a=(s=u(r)).j(t);f(s)&&(s=h),i=i.add(s),e=g(e,a)}return new v(i,e)}function b(e){for(var t=e.g.length+1,n=[],i=0;i<t;i++)n[i]=e.i(i)<<1|e.i(i-1)>>>31;return new r(n,e.h)}function I(e,t){var n=t>>5;t%=32;for(var i=e.g.length-n,s=[],a=0;a<i;a++)s[a]=0<t?e.i(a+n)>>>t|e.i(a+n+1)<<32-t:e.i(a+n);return new r(s,e.h)}(s=r.prototype).m=function(){if(p(this))return-m(this).m();for(var e=0,t=1,r=0;r<this.g.length;r++){var n=this.i(r);e+=(0<=n?n:4294967296+n)*t,t*=4294967296}return e},s.toString=function(e){if(2>(e=e||10)||36<e)throw Error("radix out of range: "+e);if(f(this))return"0";if(p(this))return"-"+m(this).toString(e);for(var t=u(Math.pow(e,6)),r=this,n="";;){var i=w(r,t).g,s=((0<(r=g(r,i.j(t))).g.length?r.g[0]:r.h)>>>0).toString(e);if(f(r=i))return s+n;for(;6>s.length;)s="0"+s;n=s+n}},s.i=function(e){return 0>e?0:e<this.g.length?this.g[e]:this.h},s.l=function(e){return p(e=g(this,e))?-1:f(e)?0:1},s.abs=function(){return p(this)?m(this):this},s.add=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0,s=0;s<=t;s++){var a=i+(65535&this.i(s))+(65535&e.i(s)),o=(a>>>16)+(this.i(s)>>>16)+(e.i(s)>>>16);i=o>>>16,a&=65535,o&=65535,n[s]=o<<16|a}return new r(n,-2147483648&n[n.length-1]?-1:0)},s.j=function(e){if(f(this)||f(e))return c;if(p(this))return p(e)?m(this).j(m(e)):m(m(this).j(e));if(p(e))return m(this.j(m(e)));if(0>this.l(d)&&0>e.l(d))return u(this.m()*e.m());for(var t=this.g.length+e.g.length,n=[],i=0;i<2*t;i++)n[i]=0;for(i=0;i<this.g.length;i++)for(var s=0;s<e.g.length;s++){var a=this.i(i)>>>16,o=65535&this.i(i),l=e.i(s)>>>16,h=65535&e.i(s);n[2*i+2*s]+=o*h,y(n,2*i+2*s),n[2*i+2*s+1]+=a*h,y(n,2*i+2*s+1),n[2*i+2*s+1]+=o*l,y(n,2*i+2*s+1),n[2*i+2*s+2]+=a*l,y(n,2*i+2*s+2)}for(i=0;i<t;i++)n[i]=n[2*i+1]<<16|n[2*i];for(i=t;i<2*t;i++)n[i]=0;return new r(n,0)},s.A=function(e){return w(this,e).h},s.and=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0;i<t;i++)n[i]=this.i(i)&e.i(i);return new r(n,this.h&e.h)},s.or=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0;i<t;i++)n[i]=this.i(i)|e.i(i);return new r(n,this.h|e.h)},s.xor=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],i=0;i<t;i++)n[i]=this.i(i)^e.i(i);return new r(n,this.h^e.h)},e.prototype.digest=e.prototype.v,e.prototype.reset=e.prototype.s,e.prototype.update=e.prototype.u,i=l.Md5=e,r.prototype.add=r.prototype.add,r.prototype.multiply=r.prototype.j,r.prototype.modulo=r.prototype.A,r.prototype.compare=r.prototype.l,r.prototype.toNumber=r.prototype.m,r.prototype.toString=r.prototype.toString,r.prototype.getBits=r.prototype.i,r.fromNumber=u,r.fromString=function e(t,r){if(0==t.length)throw Error("number format error: empty string");if(2>(r=r||10)||36<r)throw Error("radix out of range: "+r);if("-"==t.charAt(0))return m(e(t.substring(1),r));if(0<=t.indexOf("-"))throw Error('number format error: interior "-" character');for(var n=u(Math.pow(r,8)),i=c,s=0;s<t.length;s+=8){var a=Math.min(8,t.length-s),o=parseInt(t.substring(s,s+a),r);8>a?(a=u(Math.pow(r,a)),i=i.j(a).add(u(o))):i=(i=i.j(n)).add(u(o))}return i},n=l.Integer=r}).apply(void 0!==o?o:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],dOImX:[function(e,t,r){var n,i,s,a,o,l,u,c,h,d=e("@parcel/transformer-js/src/esmodule-helpers.js");d.defineInteropFlag(r),d.export(r,"ErrorCode",()=>o),d.export(r,"Event",()=>u),d.export(r,"EventType",()=>a),d.export(r,"FetchXmlHttpFactory",()=>i),d.export(r,"Stat",()=>l),d.export(r,"WebChannel",()=>s),d.export(r,"XhrIo",()=>n),d.export(r,"createWebChannelTransport",()=>h),d.export(r,"default",()=>m),d.export(r,"getStatEventTarget",()=>c);var f=arguments[3],p="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:void 0!==f?f:"undefined"!=typeof self?self:{},m={};(function(){var e,t,r,d="function"==typeof Object.defineProperties?Object.defineProperty:function(e,t,r){return e==Array.prototype||e==Object.prototype||(e[t]=r.value),e},f=function(e){e=["object"==typeof globalThis&&globalThis,e,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof p&&p];for(var t=0;t<e.length;++t){var r=e[t];if(r&&r.Math==Math)return r}throw Error("Cannot find global object")}(this);!function(e,t){if(t)e:{var r=f;e=e.split(".");for(var n=0;n<e.length-1;n++){var i=e[n];if(!(i in r))break e;r=r[i]}(t=t(n=r[e=e[e.length-1]]))!=n&&null!=t&&d(r,e,{configurable:!0,writable:!0,value:t})}}("Array.prototype.values",function(e){return e||function(){var e,t,r,n;return e=this,e instanceof String&&(e+=""),t=0,r=!1,(n={next:function(){if(!r&&t<e.length)return{value:e[t++],done:!1};return r=!0,{done:!0,value:void 0}}})[Symbol.iterator]=function(){return n},n}});var g=g||{},y=this||self;function v(e){var t=typeof e;return"array"==(t="object"!=t?t:e?Array.isArray(e)?"array":t:"null")||"object"==t&&"number"==typeof e.length}function w(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function b(e,t,r){return e.call.apply(e.bind,arguments)}function I(e,t,r){if(!e)throw Error();if(2<arguments.length){var n=Array.prototype.slice.call(arguments,2);return function(){var r=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(r,n),e.apply(t,r)}}return function(){return e.apply(t,arguments)}}function _(e,t,r){return(_=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?b:I).apply(null,arguments)}function E(e,t){var r=Array.prototype.slice.call(arguments,1);return function(){var t=r.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function T(e,t){function r(){}r.prototype=t.prototype,e.aa=t.prototype,e.prototype=new r,e.prototype.constructor=e,e.Qb=function(e,r,n){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return t.prototype[r].apply(e,i)}}function S(e){let t=e.length;if(0<t){let r=Array(t);for(let n=0;n<t;n++)r[n]=e[n];return r}return[]}function x(e,t){for(let t=1;t<arguments.length;t++){let r=arguments[t];if(v(r)){let t=e.length||0,n=r.length||0;e.length=t+n;for(let i=0;i<n;i++)e[t+i]=r[i]}else e.push(r)}}function A(e){return/^[\s\xa0]*$/.test(e)}function C(){var e=y.navigator;return e&&(e=e.userAgent)?e:""}function D(e){return D[" "](e),e}D[" "]=function(){};var N=-1!=C().indexOf("Gecko")&&!(-1!=C().toLowerCase().indexOf("webkit")&&-1==C().indexOf("Edge"))&&!(-1!=C().indexOf("Trident")||-1!=C().indexOf("MSIE"))&&-1==C().indexOf("Edge");function k(e,t,r){for(let n in e)t.call(r,e[n],n,e)}function O(e){let t={};for(let r in e)t[r]=e[r];return t}let R="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function P(e,t){let r,n;for(let t=1;t<arguments.length;t++){for(r in n=arguments[t])e[r]=n[r];for(let t=0;t<R.length;t++)r=R[t],Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}}var L=new class{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return 0<this.h?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}(()=>new M,e=>e.reset());class M{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}}let F,U=!1,V=new class{constructor(){this.h=this.g=null}add(e,t){let r=L.get();r.set(e,t),this.h?this.h.next=r:this.g=r,this.h=r}},B=()=>{let e=y.Promise.resolve(void 0);F=()=>{e.then(j)}};var j=()=>{let e;for(var t;e=null,V.g&&(e=V.g,V.g=V.g.next,V.g||(V.h=null),e.next=null),t=e;){try{t.h.call(t.g)}catch(e){!function(e){y.setTimeout(()=>{throw e},0)}(e)}L.j(t),100>L.h&&(L.h++,t.next=L.g,L.g=t)}U=!1};function q(){this.s=this.s,this.C=this.C}function z(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}q.prototype.s=!1,q.prototype.ma=function(){this.s||(this.s=!0,this.N())},q.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()},z.prototype.h=function(){this.defaultPrevented=!0};var G=function(){if(!y.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{let e=()=>{};y.addEventListener("test",e,t),y.removeEventListener("test",e,t)}catch(e){}return e}();function K(e,t){if(z.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e){var r=this.type=e.type,n=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;if(this.target=e.target||e.srcElement,this.g=t,t=e.relatedTarget){if(N){e:{try{D(t.nodeName);var i=!0;break e}catch(e){}i=!1}i||(t=null)}}else"mouseover"==r?t=e.fromElement:"mouseout"==r&&(t=e.toElement);this.relatedTarget=t,n?(this.clientX=void 0!==n.clientX?n.clientX:n.pageX,this.clientY=void 0!==n.clientY?n.clientY:n.pageY,this.screenX=n.screenX||0,this.screenY=n.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType="string"==typeof e.pointerType?e.pointerType:$[e.pointerType]||"",this.state=e.state,this.i=e,e.defaultPrevented&&K.aa.h.call(this)}}T(K,z);var $={2:"touch",3:"pen",4:"mouse"};K.prototype.h=function(){K.aa.h.call(this);var e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var H="closure_listenable_"+(1e6*Math.random()|0),Q=0;function W(e,t,r,n,i){this.listener=e,this.proxy=null,this.src=t,this.type=r,this.capture=!!n,this.ha=i,this.key=++Q,this.da=this.fa=!1}function J(e){e.da=!0,e.listener=null,e.proxy=null,e.src=null,e.ha=null}function Y(e){this.src=e,this.g={},this.h=0}function X(e,t){var r=t.type;if(r in e.g){var n,i=e.g[r],s=Array.prototype.indexOf.call(i,t,void 0);(n=0<=s)&&Array.prototype.splice.call(i,s,1),n&&(J(t),0==e.g[r].length&&(delete e.g[r],e.h--))}}function Z(e,t,r,n){for(var i=0;i<e.length;++i){var s=e[i];if(!s.da&&s.listener==t&&!!r==s.capture&&s.ha==n)return i}return -1}Y.prototype.add=function(e,t,r,n,i){var s=e.toString();(e=this.g[s])||(e=this.g[s]=[],this.h++);var a=Z(e,t,n,i);return -1<a?(t=e[a],r||(t.fa=!1)):((t=new W(t,this.src,s,!!n,i)).fa=r,e.push(t)),t};var ee="closure_lm_"+(1e6*Math.random()|0),et={};function er(e,t,r,n,i,s){if(!t)throw Error("Invalid event type");var a=w(i)?!!i.capture:!!i,o=ea(e);if(o||(e[ee]=o=new Y(e)),(r=o.add(t,r,n,a,s)).proxy)return r;if(n=function e(t){return es.call(e.src,e.listener,t)},r.proxy=n,n.src=e,n.listener=r,e.addEventListener)G||(i=a),void 0===i&&(i=!1),e.addEventListener(t.toString(),n,i);else if(e.attachEvent)e.attachEvent(ei(t.toString()),n);else if(e.addListener&&e.removeListener)e.addListener(n);else throw Error("addEventListener and attachEvent are unavailable.");return r}function en(e){if("number"!=typeof e&&e&&!e.da){var t=e.src;if(t&&t[H])X(t.i,e);else{var r=e.type,n=e.proxy;t.removeEventListener?t.removeEventListener(r,n,e.capture):t.detachEvent?t.detachEvent(ei(r),n):t.addListener&&t.removeListener&&t.removeListener(n),(r=ea(t))?(X(r,e),0==r.h&&(r.src=null,t[ee]=null)):J(e)}}}function ei(e){return e in et?et[e]:et[e]="on"+e}function es(e,t){if(e.da)e=!0;else{t=new K(t,this);var r=e.listener,n=e.ha||e.src;e.fa&&en(e),e=r.call(n,t)}return e}function ea(e){return(e=e[ee])instanceof Y?e:null}var eo="__closure_events_fn_"+(1e9*Math.random()>>>0);function el(e){return"function"==typeof e?e:(e[eo]||(e[eo]=function(t){return e.handleEvent(t)}),e[eo])}function eu(){q.call(this),this.i=new Y(this),this.M=this,this.F=null}function ec(e,t){var r,n=e.F;if(n)for(r=[];n;n=n.F)r.push(n);if(e=e.M,n=t.type||t,"string"==typeof t)t=new z(t,e);else if(t instanceof z)t.target=t.target||e;else{var i=t;P(t=new z(n,e),i)}if(i=!0,r)for(var s=r.length-1;0<=s;s--){var a=t.g=r[s];i=eh(a,n,!0,t)&&i}if(i=eh(a=t.g=e,n,!0,t)&&i,i=eh(a,n,!1,t)&&i,r)for(s=0;s<r.length;s++)i=eh(a=t.g=r[s],n,!1,t)&&i}function eh(e,t,r,n){if(!(t=e.i.g[String(t)]))return!0;t=t.concat();for(var i=!0,s=0;s<t.length;++s){var a=t[s];if(a&&!a.da&&a.capture==r){var o=a.listener,l=a.ha||a.src;a.fa&&X(e.i,a),i=!1!==o.call(l,n)&&i}}return i&&!n.defaultPrevented}function ed(e,t,r){if("function"==typeof e)r&&(e=_(e,r));else if(e&&"function"==typeof e.handleEvent)e=_(e.handleEvent,e);else throw Error("Invalid listener argument");return 2147483647<Number(t)?-1:y.setTimeout(e,t||0)}T(eu,q),eu.prototype[H]=!0,eu.prototype.removeEventListener=function(e,t,r,n){!function e(t,r,n,i,s){if(Array.isArray(r))for(var a=0;a<r.length;a++)e(t,r[a],n,i,s);else(i=w(i)?!!i.capture:!!i,n=el(n),t&&t[H])?(t=t.i,(r=String(r).toString())in t.g&&-1<(n=Z(a=t.g[r],n,i,s))&&(J(a[n]),Array.prototype.splice.call(a,n,1),0==a.length&&(delete t.g[r],t.h--))):t&&(t=ea(t))&&(r=t.g[r.toString()],t=-1,r&&(t=Z(r,n,i,s)),(n=-1<t?r[t]:null)&&en(n))}(this,e,t,r,n)},eu.prototype.N=function(){if(eu.aa.N.call(this),this.i){var e,t=this.i;for(e in t.g){for(var r=t.g[e],n=0;n<r.length;n++)J(r[n]);delete t.g[e],t.h--}}this.F=null},eu.prototype.K=function(e,t,r,n){return this.i.add(String(e),t,!1,r,n)},eu.prototype.L=function(e,t,r,n){return this.i.add(String(e),t,!0,r,n)};class ef extends q{constructor(e,t){super(),this.m=e,this.l=t,this.h=null,this.i=!1,this.g=null}j(e){this.h=arguments,this.g?this.i=!0:function e(t){t.g=ed(()=>{t.g=null,t.i&&(t.i=!1,e(t))},t.l);let r=t.h;t.h=null,t.m.apply(null,r)}(this)}N(){super.N(),this.g&&(y.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ep(e){q.call(this),this.h=e,this.g={}}T(ep,q);var em=[];function eg(e){k(e.g,function(e,t){this.g.hasOwnProperty(t)&&en(e)},e),e.g={}}ep.prototype.N=function(){ep.aa.N.call(this),eg(this)},ep.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ey=y.JSON.stringify,ev=y.JSON.parse,ew=class{stringify(e){return y.JSON.stringify(e,void 0)}parse(e){return y.JSON.parse(e,void 0)}};function eb(){}function eI(e){return e.h||(e.h=e.i())}function e_(){}eb.prototype.h=null;var eE={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function eT(){z.call(this,"d")}function eS(){z.call(this,"c")}T(eT,z),T(eS,z);var ex={},eA=null;function eC(){return eA=eA||new eu}function eD(e){z.call(this,ex.La,e)}function eN(e){let t=eC();ec(t,new eD(t))}function ek(e,t){z.call(this,ex.STAT_EVENT,e),this.stat=t}function eO(e){let t=eC();ec(t,new ek(t,e))}function eR(e,t){z.call(this,ex.Ma,e),this.size=t}function eP(e,t){if("function"!=typeof e)throw Error("Fn must not be null and must be a function");return y.setTimeout(function(){e()},t)}function eL(){this.g=!0}function eM(e,t,r,n){e.info(function(){return"XMLHTTP TEXT ("+t+"): "+function(e,t){if(!e.g)return t;if(!t)return null;try{var r=JSON.parse(t);if(r){for(e=0;e<r.length;e++)if(Array.isArray(r[e])){var n=r[e];if(!(2>n.length)){var i=n[1];if(Array.isArray(i)&&!(1>i.length)){var s=i[0];if("noop"!=s&&"stop"!=s&&"close"!=s)for(var a=1;a<i.length;a++)i[a]=""}}}}return ey(r)}catch(e){return t}}(e,r)+(n?" "+n:"")})}ex.La="serverreachability",T(eD,z),ex.STAT_EVENT="statevent",T(ek,z),ex.Ma="timingevent",T(eR,z),eL.prototype.xa=function(){this.g=!1},eL.prototype.info=function(){};var eF={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},eU={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"};function eV(){}function eB(e,t,r,n){this.j=e,this.i=t,this.l=r,this.R=n||1,this.U=new ep(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new ej}function ej(){this.i=null,this.g="",this.h=!1}T(eV,eb),eV.prototype.g=function(){return new XMLHttpRequest},eV.prototype.i=function(){return{}},t=new eV;var eq={},ez={};function eG(e,t,r){e.L=1,e.v=ts(te(t)),e.m=r,e.P=!0,eK(e,null)}function eK(e,t){e.F=Date.now(),eH(e),e.A=te(e.v);var r=e.A,n=e.R;Array.isArray(n)||(n=[String(n)]),tv(r.i,"t",n),e.C=0,r=e.j.J,e.h=new ej,e.g=t6(e.j,r?t:null,!e.m),0<e.O&&(e.M=new ef(_(e.Y,e,e.g),e.O)),t=e.U,r=e.g,n=e.ca;var i="readystatechange";Array.isArray(i)||(i&&(em[0]=i.toString()),i=em);for(var s=0;s<i.length;s++){var a=function e(t,r,n,i,s){if(i&&i.once)return function e(t,r,n,i,s){if(Array.isArray(r)){for(var a=0;a<r.length;a++)e(t,r[a],n,i,s);return null}return n=el(n),t&&t[H]?t.L(r,n,w(i)?!!i.capture:!!i,s):er(t,r,n,!0,i,s)}(t,r,n,i,s);if(Array.isArray(r)){for(var a=0;a<r.length;a++)e(t,r[a],n,i,s);return null}return n=el(n),t&&t[H]?t.K(r,n,w(i)?!!i.capture:!!i,s):er(t,r,n,!1,i,s)}(r,i[s],n||t.handleEvent,!1,t.h||t);if(!a)break;t.g[a.key]=a}t=e.H?O(e.H):{},e.m?(e.u||(e.u="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ea(e.A,e.u,e.m,t)):(e.u="GET",e.g.ea(e.A,e.u,null,t)),eN(),function(e,t,r,n,i,s){e.info(function(){if(e.g){if(s)for(var a="",o=s.split("&"),l=0;l<o.length;l++){var u=o[l].split("=");if(1<u.length){var c=u[0];u=u[1];var h=c.split("_");a=2<=h.length&&"type"==h[1]?a+(c+"=")+u+"&":a+(c+"=redacted&")}}else a=null}else a=s;return"XMLHTTP REQ ("+n+") [attempt "+i+"]: "+t+"\n"+r+"\n"+a})}(e.i,e.u,e.A,e.l,e.R,e.m)}function e$(e){return!!e.g&&"GET"==e.u&&2!=e.L&&e.j.Ca}function eH(e){e.S=Date.now()+e.I,eQ(e,e.I)}function eQ(e,t){if(null!=e.B)throw Error("WatchDog timer not null");e.B=eP(_(e.ba,e),t)}function eW(e){e.B&&(y.clearTimeout(e.B),e.B=null)}function eJ(e){0==e.j.G||e.J||tZ(e.j,e)}function eY(e){eW(e);var t=e.M;t&&"function"==typeof t.ma&&t.ma(),e.M=null,eg(e.U),e.g&&(t=e.g,e.g=null,t.abort(),t.ma())}function eX(e,t){try{var r=e.j;if(0!=r.G&&(r.g==e||e4(r.h,e))){if(!e.K&&e4(r.h,e)&&3==r.G){try{var n=r.Da.g.parse(t)}catch(e){n=null}if(Array.isArray(n)&&3==n.length){var i=n;if(0==i[0]){e:if(!r.u){if(r.g){if(r.g.F+3e3<e.F)tX(r),tq(r);else break e}tW(r),eO(18)}}else r.za=i[1],0<r.za-r.T&&37500>i[2]&&r.F&&0==r.v&&!r.C&&(r.C=eP(_(r.Za,r),6e3));if(1>=e2(r.h)&&r.ca){try{r.ca()}catch(e){}r.ca=void 0}}else t1(r,11)}else if((e.K||r.g==e)&&tX(r),!A(t))for(i=r.Da.g.parse(t),t=0;t<i.length;t++){let o=i[t];if(r.T=o[0],o=o[1],2==r.G){if("c"==o[0]){r.K=o[1],r.ia=o[2];let t=o[3];null!=t&&(r.la=t,r.j.info("VER="+r.la));let i=o[4];null!=i&&(r.Aa=i,r.j.info("SVER="+r.Aa));let l=o[5];null!=l&&"number"==typeof l&&0<l&&(n=1.5*l,r.L=n,r.j.info("backChannelRequestTimeoutMs_="+n)),n=r;let u=e.g;if(u){let e=u.g?u.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var s=n.h;s.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(s.j=s.l,s.g=new Set,s.h&&(e6(s,s.h),s.h=null))}if(n.D){let e=u.g?u.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(n.ya=e,ti(n.I,n.D,e))}}if(r.G=3,r.l&&r.l.ua(),r.ba&&(r.R=Date.now()-e.F,r.j.info("Handshake RTT: "+r.R+"ms")),(n=r).qa=t4(n,n.J?n.ia:null,n.W),e.K){e9(n.h,e);var a=n.L;a&&(e.I=a),e.B&&(eW(e),eH(e)),n.g=e}else tQ(n);0<r.i.length&&tG(r)}else"stop"!=o[0]&&"close"!=o[0]||t1(r,7)}else 3==r.G&&("stop"==o[0]||"close"==o[0]?"stop"==o[0]?t1(r,7):tj(r):"noop"!=o[0]&&r.l&&r.l.ta(o),r.v=0)}}eN(4)}catch(e){}}eB.prototype.ca=function(e){e=e.target;let t=this.M;t&&3==tF(e)?t.j():this.Y(e)},eB.prototype.Y=function(e){try{if(e==this.g)e:{let h=tF(this.g);var t=this.g.Ba();let d=this.g.Z();if(!(3>h)&&(3!=h||this.g&&(this.h.h||this.g.oa()||tU(this.g)))){this.J||4!=h||7==t||(8==t||0>=d?eN(3):eN(2)),eW(this);var r=this.g.Z();this.X=r;t:if(e$(this)){var n=tU(this.g);e="";var i=n.length,s=4==tF(this.g);if(!this.h.i){if("undefined"==typeof TextDecoder){eY(this),eJ(this);var a="";break t}this.h.i=new y.TextDecoder}for(t=0;t<i;t++)this.h.h=!0,e+=this.h.i.decode(n[t],{stream:!(s&&t==i-1)});n.length=0,this.h.g+=e,this.C=0,a=this.h.g}else a=this.g.oa();if(this.o=200==r,function(e,t,r,n,i,s,a){e.info(function(){return"XMLHTTP RESP ("+n+") [ attempt "+i+"]: "+t+"\n"+r+"\n"+s+" "+a})}(this.i,this.u,this.A,this.l,this.R,h,r),this.o){if(this.T&&!this.K){t:{if(this.g){var o,l=this.g;if((o=l.g?l.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!A(o)){var u=o;break t}}u=null}if(r=u)eM(this.i,this.l,r,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,eX(this,r);else{this.o=!1,this.s=3,eO(12),eY(this),eJ(this);break e}}if(this.P){let e;for(r=!0;!this.J&&this.C<a.length;)if((e=function(e,t){var r=e.C,n=t.indexOf("\n",r);return -1==n?ez:isNaN(r=Number(t.substring(r,n)))?eq:(n+=1)+r>t.length?ez:(t=t.slice(n,n+r),e.C=n+r,t)}(this,a))==ez){4==h&&(this.s=4,eO(14),r=!1),eM(this.i,this.l,null,"[Incomplete Response]");break}else if(e==eq){this.s=4,eO(15),eM(this.i,this.l,a,"[Invalid Chunk]"),r=!1;break}else eM(this.i,this.l,e,null),eX(this,e);if(e$(this)&&0!=this.C&&(this.h.g=this.h.g.slice(this.C),this.C=0),4!=h||0!=a.length||this.h.h||(this.s=1,eO(16),r=!1),this.o=this.o&&r,r){if(0<a.length&&!this.W){this.W=!0;var c=this.j;c.g==this&&c.ba&&!c.M&&(c.j.info("Great, no buffering proxy detected. Bytes received: "+a.length),tJ(c),c.M=!0,eO(11))}}else eM(this.i,this.l,a,"[Invalid Chunked Response]"),eY(this),eJ(this)}else eM(this.i,this.l,a,null),eX(this,a);4==h&&eY(this),this.o&&!this.J&&(4==h?tZ(this.j,this):(this.o=!1,eH(this)))}else(function(e){let t={};e=(e.g&&2<=tF(e)&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let n=0;n<e.length;n++){if(A(e[n]))continue;var r=function(e){var t=1;e=e.split(":");let r=[];for(;0<t&&e.length;)r.push(e.shift()),t--;return e.length&&r.push(e.join(":")),r}(e[n]);let i=r[0];if("string"!=typeof(r=r[1]))continue;r=r.trim();let s=t[i]||[];t[i]=s,s.push(r)}!function(e,t){for(let r in e)t.call(void 0,e[r],r,e)}(t,function(e){return e.join(", ")})})(this.g),400==r&&0<a.indexOf("Unknown SID")?(this.s=3,eO(12)):(this.s=0,eO(13)),eY(this),eJ(this)}}}catch(e){}finally{}},eB.prototype.cancel=function(){this.J=!0,eY(this)},eB.prototype.ba=function(){this.B=null;let e=Date.now();0<=e-this.S?(function(e,t){e.info(function(){return"TIMEOUT: "+t})}(this.i,this.A),2!=this.L&&(eN(),eO(17)),eY(this),this.s=2,eJ(this)):eQ(this,this.S-e)};var eZ=class{constructor(e,t){this.g=e,this.map=t}};function e0(e){this.l=e||10,e=y.PerformanceNavigationTiming?0<(e=y.performance.getEntriesByType("navigation")).length&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol):!!(y.chrome&&y.chrome.loadTimes&&y.chrome.loadTimes()&&y.chrome.loadTimes().wasFetchedViaSpdy),this.j=e?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function e1(e){return!!e.h||!!e.g&&e.g.size>=e.j}function e2(e){return e.h?1:e.g?e.g.size:0}function e4(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function e6(e,t){e.g?e.g.add(t):e.h=t}function e9(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function e5(e){if(null!=e.h)return e.i.concat(e.h.D);if(null!=e.g&&0!==e.g.size){let t=e.i;for(let r of e.g.values())t=t.concat(r.D);return t}return S(e.i)}function e3(e,t){if(e.forEach&&"function"==typeof e.forEach)e.forEach(t,void 0);else if(v(e)||"string"==typeof e)Array.prototype.forEach.call(e,t,void 0);else for(var r=function(e){if(e.na&&"function"==typeof e.na)return e.na();if(!e.V||"function"!=typeof e.V){if("undefined"!=typeof Map&&e instanceof Map)return Array.from(e.keys());if(!("undefined"!=typeof Set&&e instanceof Set)){if(v(e)||"string"==typeof e){var t=[];e=e.length;for(var r=0;r<e;r++)t.push(r);return t}for(let n in t=[],r=0,e)t[r++]=n;return t}}}(e),n=function(e){if(e.V&&"function"==typeof e.V)return e.V();if("undefined"!=typeof Map&&e instanceof Map||"undefined"!=typeof Set&&e instanceof Set)return Array.from(e.values());if("string"==typeof e)return e.split("");if(v(e)){for(var t=[],r=e.length,n=0;n<r;n++)t.push(e[n]);return t}for(n in t=[],r=0,e)t[r++]=e[n];return t}(e),i=n.length,s=0;s<i;s++)t.call(void 0,n[s],r&&r[s],e)}e0.prototype.cancel=function(){if(this.i=e5(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(let e of this.g.values())e.cancel();this.g.clear()}};var e8=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function e7(e){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,e instanceof e7){this.h=e.h,tt(this,e.j),this.o=e.o,this.g=e.g,tr(this,e.s),this.l=e.l;var t=e.i,r=new tp;r.i=t.i,t.g&&(r.g=new Map(t.g),r.h=t.h),tn(this,r),this.m=e.m}else e&&(t=String(e).match(e8))?(this.h=!1,tt(this,t[1]||"",!0),this.o=ta(t[2]||""),this.g=ta(t[3]||"",!0),tr(this,t[4]),this.l=ta(t[5]||"",!0),tn(this,t[6]||"",!0),this.m=ta(t[7]||"")):(this.h=!1,this.i=new tp(null,this.h))}function te(e){return new e7(e)}function tt(e,t,r){e.j=r?ta(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function tr(e,t){if(t){if(isNaN(t=Number(t))||0>t)throw Error("Bad port number "+t);e.s=t}else e.s=null}function tn(e,t,r){var n,i;t instanceof tp?(e.i=t,n=e.i,(i=e.h)&&!n.j&&(tm(n),n.i=null,n.g.forEach(function(e,t){var r=t.toLowerCase();t!=r&&(tg(this,t),tv(this,r,e))},n)),n.j=i):(r||(t=to(t,td)),e.i=new tp(t,e.h))}function ti(e,t,r){e.i.set(t,r)}function ts(e){return ti(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function ta(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function to(e,t,r){return"string"==typeof e?(e=encodeURI(e).replace(t,tl),r&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function tl(e){return"%"+((e=e.charCodeAt(0))>>4&15).toString(16)+(15&e).toString(16)}e7.prototype.toString=function(){var e=[],t=this.j;t&&e.push(to(t,tu,!0),":");var r=this.g;return(r||"file"==t)&&(e.push("//"),(t=this.o)&&e.push(to(t,tu,!0),"@"),e.push(encodeURIComponent(String(r)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(r=this.s)&&e.push(":",String(r))),(r=this.l)&&(this.g&&"/"!=r.charAt(0)&&e.push("/"),e.push(to(r,"/"==r.charAt(0)?th:tc,!0))),(r=this.i.toString())&&e.push("?",r),(r=this.m)&&e.push("#",to(r,tf)),e.join("")};var tu=/[#\/\?@]/g,tc=/[#\?:]/g,th=/[#\?]/g,td=/[#\?@]/g,tf=/#/g;function tp(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function tm(e){e.g||(e.g=new Map,e.h=0,e.i&&function(e,t){if(e){e=e.split("&");for(var r=0;r<e.length;r++){var n=e[r].indexOf("="),i=null;if(0<=n){var s=e[r].substring(0,n);i=e[r].substring(n+1)}else s=e[r];t(s,i?decodeURIComponent(i.replace(/\+/g," ")):"")}}}(e.i,function(t,r){e.add(decodeURIComponent(t.replace(/\+/g," ")),r)}))}function tg(e,t){tm(e),t=tw(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function ty(e,t){return tm(e),t=tw(e,t),e.g.has(t)}function tv(e,t,r){tg(e,t),0<r.length&&(e.i=null,e.g.set(tw(e,t),S(r)),e.h+=r.length)}function tw(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}function tb(e,t,r,n,i){try{i&&(i.onload=null,i.onerror=null,i.onabort=null,i.ontimeout=null),n(r)}catch(e){}}function tI(){this.g=new ew}function t_(e){this.l=e.Ub||null,this.j=e.eb||!1}function tE(e,t){eu.call(this),this.D=e,this.o=t,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}function tT(e){e.j.read().then(e.Pa.bind(e)).catch(e.ga.bind(e))}function tS(e){e.readyState=4,e.l=null,e.j=null,e.v=null,tx(e)}function tx(e){e.onreadystatechange&&e.onreadystatechange.call(e)}function tA(e){let t="";return k(e,function(e,r){t+=r+":"+e+"\r\n"}),t}function tC(e,t,r){e:{for(n in r){var n=!1;break e}n=!0}n||(r=tA(r),"string"==typeof e?null!=r&&encodeURIComponent(String(r)):ti(e,t,r))}function tD(e){eu.call(this),this.headers=new Map,this.o=e||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}(r=tp.prototype).add=function(e,t){tm(this),this.i=null,e=tw(this,e);var r=this.g.get(e);return r||this.g.set(e,r=[]),r.push(t),this.h+=1,this},r.forEach=function(e,t){tm(this),this.g.forEach(function(r,n){r.forEach(function(r){e.call(t,r,n,this)},this)},this)},r.na=function(){tm(this);let e=Array.from(this.g.values()),t=Array.from(this.g.keys()),r=[];for(let n=0;n<t.length;n++){let i=e[n];for(let e=0;e<i.length;e++)r.push(t[n])}return r},r.V=function(e){tm(this);let t=[];if("string"==typeof e)ty(this,e)&&(t=t.concat(this.g.get(tw(this,e))));else{e=Array.from(this.g.values());for(let r=0;r<e.length;r++)t=t.concat(e[r])}return t},r.set=function(e,t){return tm(this),this.i=null,ty(this,e=tw(this,e))&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},r.get=function(e,t){return e&&0<(e=this.V(e)).length?String(e[0]):t},r.toString=function(){if(this.i)return this.i;if(!this.g)return"";let e=[],t=Array.from(this.g.keys());for(var r=0;r<t.length;r++){var n=t[r];let s=encodeURIComponent(String(n)),a=this.V(n);for(n=0;n<a.length;n++){var i=s;""!==a[n]&&(i+="="+encodeURIComponent(String(a[n]))),e.push(i)}}return this.i=e.join("&")},T(t_,eb),t_.prototype.g=function(){return new tE(this.l,this.j)},t_.prototype.i=(e={},function(){return e}),T(tE,eu),(r=tE.prototype).open=function(e,t){if(0!=this.readyState)throw this.abort(),Error("Error reopening a connection");this.B=e,this.A=t,this.readyState=1,tx(this)},r.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.g=!0;let t={headers:this.u,method:this.B,credentials:this.m,cache:void 0};e&&(t.body=e),(this.D||y).fetch(new Request(this.A,t)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&4!=this.readyState&&(this.g=!1,tS(this)),this.readyState=0},r.Sa=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,tx(this)),this.g&&(this.readyState=3,tx(this),this.g))){if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(void 0!==y.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;tT(this)}else e.text().then(this.Ra.bind(this),this.ga.bind(this))}},r.Pa=function(e){if(this.g){if(this.o&&e.value)this.response.push(e.value);else if(!this.o){var t=e.value?e.value:new Uint8Array(0);(t=this.v.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?tS(this):tx(this),3==this.readyState&&tT(this)}},r.Ra=function(e){this.g&&(this.response=this.responseText=e,tS(this))},r.Qa=function(e){this.g&&(this.response=e,tS(this))},r.ga=function(){this.g&&tS(this)},r.setRequestHeader=function(e,t){this.u.append(e,t)},r.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";let e=[],t=this.h.entries();for(var r=t.next();!r.done;)e.push((r=r.value)[0]+": "+r[1]),r=t.next();return e.join("\r\n")},Object.defineProperty(tE.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}}),T(tD,eu);var tN=/^https?$/i,tk=["POST","PUT"];function tO(e,t){e.h=!1,e.g&&(e.j=!0,e.g.abort(),e.j=!1),e.l=t,e.m=5,tR(e),tL(e)}function tR(e){e.A||(e.A=!0,ec(e,"complete"),ec(e,"error"))}function tP(e){if(e.h&&void 0!==g&&(!e.v[1]||4!=tF(e)||2!=e.Z())){if(e.u&&4==tF(e))ed(e.Ea,0,e);else if(ec(e,"readystatechange"),4==tF(e)){e.h=!1;try{let a=e.Z();switch(a){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t,r,n=!0;break;default:n=!1}if(!(t=n)){if(r=0===a){var i=String(e.D).match(e8)[1]||null;!i&&y.self&&y.self.location&&(i=y.self.location.protocol.slice(0,-1)),r=!tN.test(i?i.toLowerCase():"")}t=r}if(t)ec(e,"complete"),ec(e,"success");else{e.m=6;try{var s=2<tF(e)?e.g.statusText:""}catch(e){s=""}e.l=s+" ["+e.Z()+"]",tR(e)}}finally{tL(e)}}}}function tL(e,t){if(e.g){tM(e);let r=e.g,n=e.v[0]?()=>{}:null;e.g=null,e.v=null,t||ec(e,"ready");try{r.onreadystatechange=n}catch(e){}}}function tM(e){e.I&&(y.clearTimeout(e.I),e.I=null)}function tF(e){return e.g?e.g.readyState:0}function tU(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.H){case"":case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(e){return null}}function tV(e,t,r){return r&&r.internalChannelParams&&r.internalChannelParams[e]||t}function tB(e){this.Aa=0,this.i=[],this.j=new eL,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=tV("failFast",!1,e),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=tV("baseRetryDelayMs",5e3,e),this.cb=tV("retryDelaySeedMs",1e4,e),this.Wa=tV("forwardChannelMaxRetries",2,e),this.wa=tV("forwardChannelRequestTimeoutMs",2e4,e),this.pa=e&&e.xmlHttpFactory||void 0,this.Xa=e&&e.Tb||void 0,this.Ca=e&&e.useFetchStreams||!1,this.L=void 0,this.J=e&&e.supportsCrossDomainXhr||!1,this.K="",this.h=new e0(e&&e.concurrentRequestLimit),this.Da=new tI,this.P=e&&e.fastHandshake||!1,this.O=e&&e.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=e&&e.Rb||!1,e&&e.xa&&this.j.xa(),e&&e.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&e&&e.detectBufferingProxy||!1,this.ja=void 0,e&&e.longPollingTimeout&&0<e.longPollingTimeout&&(this.ja=e.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}function tj(e){if(tz(e),3==e.G){var t=e.U++,r=te(e.I);if(ti(r,"SID",e.K),ti(r,"RID",t),ti(r,"TYPE","terminate"),t$(e,r),(t=new eB(e,e.j,t)).L=2,t.v=ts(te(r)),r=!1,y.navigator&&y.navigator.sendBeacon)try{r=y.navigator.sendBeacon(t.v.toString(),"")}catch(e){}!r&&y.Image&&((new Image).src=t.v,r=!0),r||(t.g=t6(t.j,null),t.g.ea(t.v)),t.F=Date.now(),eH(t)}t2(e)}function tq(e){e.g&&(tJ(e),e.g.cancel(),e.g=null)}function tz(e){tq(e),e.u&&(y.clearTimeout(e.u),e.u=null),tX(e),e.h.cancel(),e.s&&("number"==typeof e.s&&y.clearTimeout(e.s),e.s=null)}function tG(e){if(!e1(e.h)&&!e.s){e.s=!0;var t=e.Ga;F||B(),U||(F(),U=!0),V.add(t,e),e.B=0}}function tK(e,t){var r;r=t?t.l:e.U++;let n=te(e.I);ti(n,"SID",e.K),ti(n,"RID",r),ti(n,"AID",e.T),t$(e,n),e.m&&e.o&&tC(n,e.m,e.o),r=new eB(e,e.j,r,e.B+1),null===e.m&&(r.H=e.o),t&&(e.i=t.D.concat(e.i)),t=tH(e,r,1e3),r.I=Math.round(.5*e.wa)+Math.round(.5*e.wa*Math.random()),e6(e.h,r),eG(r,n,t)}function t$(e,t){e.H&&k(e.H,function(e,r){ti(t,r,e)}),e.l&&e3({},function(e,r){ti(t,r,e)})}function tH(e,t,r){r=Math.min(e.i.length,r);var n=e.l?_(e.l.Na,e.l,e):null;e:{var i=e.i;let t=-1;for(;;){let e=["count="+r];-1==t?0<r?(t=i[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let s=!0;for(let a=0;a<r;a++){let r=i[a].g,o=i[a].map;if(0>(r-=t))t=Math.max(0,i[a].g-100),s=!1;else try{!function(e,t,r){let n=r||"";try{e3(e,function(e,r){let i=e;w(e)&&(i=ey(e)),t.push(n+r+"="+encodeURIComponent(i))})}catch(e){throw t.push(n+"type="+encodeURIComponent("_badmap")),e}}(o,e,"req"+r+"_")}catch(e){n&&n(o)}}if(s){n=e.join("&");break e}}}return e=e.i.splice(0,r),t.D=e,n}function tQ(e){if(!e.g&&!e.u){e.Y=1;var t=e.Fa;F||B(),U||(F(),U=!0),V.add(t,e),e.v=0}}function tW(e){return!e.g&&!e.u&&!(3<=e.v)&&(e.Y++,e.u=eP(_(e.Fa,e),t0(e,e.v)),e.v++,!0)}function tJ(e){null!=e.A&&(y.clearTimeout(e.A),e.A=null)}function tY(e){e.g=new eB(e,e.j,"rpc",e.Y),null===e.m&&(e.g.H=e.o),e.g.O=0;var t=te(e.qa);ti(t,"RID","rpc"),ti(t,"SID",e.K),ti(t,"AID",e.T),ti(t,"CI",e.F?"0":"1"),!e.F&&e.ja&&ti(t,"TO",e.ja),ti(t,"TYPE","xmlhttp"),t$(e,t),e.m&&e.o&&tC(t,e.m,e.o),e.L&&(e.g.I=e.L);var r=e.g;e=e.ia,r.L=1,r.v=ts(te(t)),r.m=null,r.P=!0,eK(r,e)}function tX(e){null!=e.C&&(y.clearTimeout(e.C),e.C=null)}function tZ(e,t){var r=null;if(e.g==t){tX(e),tJ(e),e.g=null;var n=2}else{if(!e4(e.h,t))return;r=t.D,e9(e.h,t),n=1}if(0!=e.G){if(t.o){if(1==n){r=t.m?t.m.length:0,t=Date.now()-t.F;var i,s=e.B;ec(n=eC(),new eR(n,r)),tG(e)}else tQ(e)}else if(3==(s=t.s)||0==s&&0<t.X||!(1==n&&(i=t,!(e2(e.h)>=e.h.j-(e.s?1:0))&&(e.s?(e.i=i.D.concat(e.i),!0):1!=e.G&&2!=e.G&&!(e.B>=(e.Va?0:e.Wa))&&(e.s=eP(_(e.Ga,e,i),t0(e,e.B)),e.B++,!0)))||2==n&&tW(e)))switch(r&&0<r.length&&((t=e.h).i=t.i.concat(r)),s){case 1:t1(e,5);break;case 4:t1(e,10);break;case 3:t1(e,6);break;default:t1(e,2)}}}function t0(e,t){let r=e.Ta+Math.floor(Math.random()*e.cb);return e.isActive()||(r*=2),r*t}function t1(e,t){if(e.j.info("Error code "+t),2==t){var r=_(e.fb,e),n=e.Xa;let t=!n;n=new e7(n||"//www.google.com/images/cleardot.gif"),y.location&&"http"==y.location.protocol||tt(n,"https"),ts(n),t?function(e,t){let r=new eL;if(y.Image){let n=new Image;n.onload=E(tb,r,"TestLoadImage: loaded",!0,t,n),n.onerror=E(tb,r,"TestLoadImage: error",!1,t,n),n.onabort=E(tb,r,"TestLoadImage: abort",!1,t,n),n.ontimeout=E(tb,r,"TestLoadImage: timeout",!1,t,n),y.setTimeout(function(){n.ontimeout&&n.ontimeout()},1e4),n.src=e}else t(!1)}(n.toString(),r):function(e,t){let r=new eL,n=new AbortController,i=setTimeout(()=>{n.abort(),tb(r,"TestPingServer: timeout",!1,t)},1e4);fetch(e,{signal:n.signal}).then(e=>{clearTimeout(i),e.ok?tb(r,"TestPingServer: ok",!0,t):tb(r,"TestPingServer: server error",!1,t)}).catch(()=>{clearTimeout(i),tb(r,"TestPingServer: error",!1,t)})}(n.toString(),r)}else eO(2);e.G=0,e.l&&e.l.sa(t),t2(e),tz(e)}function t2(e){if(e.G=0,e.ka=[],e.l){let t=e5(e.h);(0!=t.length||0!=e.i.length)&&(x(e.ka,t),x(e.ka,e.i),e.h.i.length=0,S(e.i),e.i.length=0),e.l.ra()}}function t4(e,t,r){var n=r instanceof e7?te(r):new e7(r);if(""!=n.g)t&&(n.g=t+"."+n.g),tr(n,n.s);else{var i=y.location;n=i.protocol,t=t?t+"."+i.hostname:i.hostname,i=+i.port;var s=new e7(null);n&&tt(s,n),t&&(s.g=t),i&&tr(s,i),r&&(s.l=r),n=s}return r=e.D,t=e.ya,r&&t&&ti(n,r,t),ti(n,"VER",e.la),t$(e,n),n}function t6(e,t,r){if(t&&!e.J)throw Error("Can't create secondary domain capable XhrIo object.");return(t=new tD(e.Ca&&!e.pa?new t_({eb:r}):e.pa)).Ha(e.J),t}function t9(){}function t5(){}function t3(e,t){eu.call(this),this.g=new tB(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.o=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.va&&(e?e["X-WebChannel-Client-Profile"]=t.va:e={"X-WebChannel-Client-Profile":t.va}),this.g.S=e,(e=t&&t.Sb)&&!A(e)&&(this.g.m=e),this.v=t&&t.supportsCrossDomainXhr||!1,this.u=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!A(t)&&(this.g.D=t,null!==(e=this.h)&&t in e&&t in(e=this.h)&&delete e[t]),this.j=new re(this)}function t8(e){eT.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(let r in t){e=r;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function t7(){eS.call(this),this.status=1}function re(e){this.g=e}(r=tD.prototype).Ha=function(e){this.J=e},r.ea=function(e,r,n,i){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+e);r=r?r.toUpperCase():"GET",this.D=e,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():t.g(),this.v=this.o?eI(this.o):eI(t),this.g.onreadystatechange=_(this.Ea,this);try{this.B=!0,this.g.open(r,String(e),!0),this.B=!1}catch(e){tO(this,e);return}if(e=n||"",n=new Map(this.headers),i){if(Object.getPrototypeOf(i)===Object.prototype)for(var s in i)n.set(s,i[s]);else if("function"==typeof i.keys&&"function"==typeof i.get)for(let e of i.keys())n.set(e,i.get(e));else throw Error("Unknown input type for opt_headers: "+String(i))}for(let[t,a]of(i=Array.from(n.keys()).find(e=>"content-type"==e.toLowerCase()),s=y.FormData&&e instanceof y.FormData,!(0<=Array.prototype.indexOf.call(tk,r,void 0))||i||s||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8"),n))this.g.setRequestHeader(t,a);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{tM(this),this.u=!0,this.g.send(e),this.u=!1}catch(e){tO(this,e)}},r.abort=function(e){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=e||7,ec(this,"complete"),ec(this,"abort"),tL(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),tL(this,!0)),tD.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?tP(this):this.bb())},r.bb=function(){tP(this)},r.isActive=function(){return!!this.g},r.Z=function(){try{return 2<tF(this)?this.g.status:-1}catch(e){return -1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch(e){return""}},r.Oa=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),ev(t)}},r.Ba=function(){return this.m},r.Ka=function(){return"string"==typeof this.l?this.l:String(this.l)},(r=tB.prototype).la=8,r.G=1,r.connect=function(e,t,r,n){eO(0),this.W=e,this.H=t||{},r&&void 0!==n&&(this.H.OSID=r,this.H.OAID=n),this.F=this.X,this.I=t4(this,null,this.W),tG(this)},r.Ga=function(e){if(this.s){if(this.s=null,1==this.G){if(!e){this.U=Math.floor(1e5*Math.random()),e=this.U++;let i=new eB(this,this.j,e),s=this.o;if(this.S&&(s?P(s=O(s),this.S):s=this.S),null!==this.m||this.O||(i.H=s,s=null),this.P)e:{for(var t=0,r=0;r<this.i.length;r++){t:{var n=this.i[r];if("__data__"in n.map&&"string"==typeof(n=n.map.__data__)){n=n.length;break t}n=void 0}if(void 0===n)break;if(4096<(t+=n)){t=r;break e}if(4096===t||r===this.i.length-1){t=r+1;break e}}t=1e3}else t=1e3;t=tH(this,i,t),ti(r=te(this.I),"RID",e),ti(r,"CVER",22),this.D&&ti(r,"X-HTTP-Session-Id",this.D),t$(this,r),s&&(this.O?t="headers="+encodeURIComponent(String(tA(s)))+"&"+t:this.m&&tC(r,this.m,s)),e6(this.h,i),this.Ua&&ti(r,"TYPE","init"),this.P?(ti(r,"$req",t),ti(r,"SID","null"),i.T=!0,eG(i,r,null)):eG(i,r,t),this.G=2}}else 3==this.G&&(e?tK(this,e):0==this.i.length||e1(this.h)||tK(this))}},r.Fa=function(){if(this.u=null,tY(this),this.ba&&!(this.M||null==this.g||0>=this.R)){var e=2*this.R;this.j.info("BP detection timer enabled: "+e),this.A=eP(_(this.ab,this),e)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,eO(10),tq(this),tY(this))},r.Za=function(){null!=this.C&&(this.C=null,tq(this),tW(this),eO(19))},r.fb=function(e){e?(this.j.info("Successfully pinged google.com"),eO(2)):(this.j.info("Failed to ping google.com"),eO(1))},r.isActive=function(){return!!this.l&&this.l.isActive(this)},(r=t9.prototype).ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){},t5.prototype.g=function(e,t){return new t3(e,t)},T(t3,eu),t3.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},t3.prototype.close=function(){tj(this.g)},t3.prototype.o=function(e){var t=this.g;if("string"==typeof e){var r={};r.__data__=e,e=r}else this.u&&((r={}).__data__=ey(e),e=r);t.i.push(new eZ(t.Ya++,e)),3==t.G&&tG(t)},t3.prototype.N=function(){this.g.l=null,delete this.j,tj(this.g),delete this.g,t3.aa.N.call(this)},T(t8,eT),T(t7,eS),T(re,t9),re.prototype.ua=function(){ec(this.g,"a")},re.prototype.ta=function(e){ec(this.g,new t8(e))},re.prototype.sa=function(e){ec(this.g,new t7)},re.prototype.ra=function(){ec(this.g,"b")},t5.prototype.createWebChannel=t5.prototype.g,t3.prototype.send=t3.prototype.o,t3.prototype.open=t3.prototype.m,t3.prototype.close=t3.prototype.close,h=m.createWebChannelTransport=function(){return new t5},c=m.getStatEventTarget=function(){return eC()},u=m.Event=ex,l=m.Stat={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},eF.NO_ERROR=0,eF.TIMEOUT=8,eF.HTTP_ERROR=6,o=m.ErrorCode=eF,eU.COMPLETE="complete",a=m.EventType=eU,e_.EventType=eE,eE.OPEN="a",eE.CLOSE="b",eE.ERROR="c",eE.MESSAGE="d",eu.prototype.listen=eu.prototype.K,s=m.WebChannel=e_,i=m.FetchXmlHttpFactory=t_,tD.prototype.listenOnce=tD.prototype.L,tD.prototype.getLastError=tD.prototype.Ka,tD.prototype.getLastErrorCode=tD.prototype.Ba,tD.prototype.getStatus=tD.prototype.Z,tD.prototype.getResponseJson=tD.prototype.Oa,tD.prototype.getResponseText=tD.prototype.oa,tD.prototype.send=tD.prototype.ea,tD.prototype.setWithCredentials=tD.prototype.Ha,n=m.XhrIo=tD}).apply(void 0!==p?p:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],"3r5ba":[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"BaseStorage",()=>o),n.export(r,"Storage",()=>l);var i=e("pify"),s=n.interopDefault(i),a=()=>{try{let e=globalThis.navigator?.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)||[];if("Chrome"===e[1])return 100>parseInt(e[2])||globalThis.chrome.runtime?.getManifest()?.manifest_version===2}catch{}return!1},o=class{#e;#t;get primaryClient(){return this.#t}#r;get secondaryClient(){return this.#r}#n;get area(){return this.#n}get hasWebApi(){try{return"u">typeof window&&!!window.localStorage}catch(e){return console.error(e),!1}}#i=new Map;#s;get copiedKeySet(){return this.#s}isCopied=e=>this.hasWebApi&&(this.allCopied||this.copiedKeySet.has(e));#a=!1;get allCopied(){return this.#a}getExtStorageApi=()=>globalThis.browser?.storage||globalThis.chrome?.storage;get hasExtensionApi(){try{return!!this.getExtStorageApi()}catch(e){return console.error(e),!1}}isWatchSupported=()=>this.hasExtensionApi;keyNamespace="";isValidKey=e=>e.startsWith(this.keyNamespace);getNamespacedKey=e=>`${this.keyNamespace}${e}`;getUnnamespacedKey=e=>e.slice(this.keyNamespace.length);serde={serializer:JSON.stringify,deserializer:JSON.parse};constructor({area:e="sync",allCopied:t=!1,copiedKeyList:r=[],serde:n={}}={}){this.setCopiedKeySet(r),this.#n=e,this.#a=t,this.serde={...this.serde,...n};try{this.hasWebApi&&(t||r.length>0)&&(this.#r=window.localStorage)}catch{}try{this.hasExtensionApi&&(this.#e=this.getExtStorageApi(),a()?this.#t=(0,s.default)(this.#e[this.area],{exclude:["getBytesInUse"],errorFirst:!1}):this.#t=this.#e[this.area])}catch{}}setCopiedKeySet(e){this.#s=new Set(e)}rawGetAll=()=>this.#t?.get();getAll=async()=>Object.entries(await this.rawGetAll()).filter(([e])=>this.isValidKey(e)).reduce((e,[t,r])=>(e[this.getUnnamespacedKey(t)]=r,e),{});copy=async e=>{let t=void 0===e;if(!t&&!this.copiedKeySet.has(e)||!this.allCopied||!this.hasExtensionApi)return!1;let r=this.allCopied?await this.rawGetAll():await this.#t.get((t?[...this.copiedKeySet]:[e]).map(this.getNamespacedKey));if(!r)return!1;let n=!1;for(let e in r){let t=r[e],i=this.#r?.getItem(e);this.#r?.setItem(e,t),n||=t!==i}return n};rawGet=async e=>this.hasExtensionApi?(await this.#t.get(e))[e]:this.isCopied(e)?this.#r?.getItem(e):null;rawSet=async(e,t)=>(this.isCopied(e)&&this.#r?.setItem(e,t),this.hasExtensionApi&&await this.#t.set({[e]:t}),null);clear=async(e=!1)=>{e&&this.#r?.clear(),await this.#t.clear()};rawRemove=async e=>{this.isCopied(e)&&this.#r?.removeItem(e),this.hasExtensionApi&&await this.#t.remove(e)};removeAll=async()=>{let e=Object.keys(await this.getAll());await Promise.all(e.map(this.remove))};watch=e=>{let t=this.isWatchSupported();return t&&this.#o(e),t};#o=e=>{for(let t in e){let r=this.getNamespacedKey(t),n=this.#i.get(r)?.callbackSet||new Set;if(n.add(e[t]),n.size>1)continue;let i=(e,t)=>{if(t!==this.area||!e[r])return;let n=this.#i.get(r);if(!n)throw Error(`Storage comms does not exist for nsKey: ${r}`);Promise.all([this.parseValue(e[r].newValue),this.parseValue(e[r].oldValue)]).then(([e,r])=>{for(let i of n.callbackSet)i({newValue:e,oldValue:r},t)})};this.#e.onChanged.addListener(i),this.#i.set(r,{callbackSet:n,listener:i})}};unwatch=e=>{let t=this.isWatchSupported();return t&&this.#l(e),t};#l(e){for(let t in e){let r=this.getNamespacedKey(t),n=e[t],i=this.#i.get(r);i&&(i.callbackSet.delete(n),0===i.callbackSet.size&&(this.#i.delete(r),this.#e.onChanged.removeListener(i.listener)))}}unwatchAll=()=>this.#u();#u(){this.#i.forEach(({listener:e})=>this.#e.onChanged.removeListener(e)),this.#i.clear()}async getItem(e){return this.get(e)}async setItem(e,t){await this.set(e,t)}async removeItem(e){return this.remove(e)}},l=class extends o{get=async e=>{let t=this.getNamespacedKey(e),r=await this.rawGet(t);return this.parseValue(r)};set=async(e,t)=>{let r=this.getNamespacedKey(e),n=this.serde.serializer(t);return this.rawSet(r,n)};remove=async e=>{let t=this.getNamespacedKey(e);return this.rawRemove(t)};setNamespace=e=>{this.keyNamespace=e};parseValue=async e=>{try{if(void 0!==e)return this.serde.deserializer(e)}catch(e){console.error(e)}}}},{pify:"9arDK","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],"9arDK":[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"default",()=>a);let i=(e,t,r,n)=>function(...i){let s=t.promiseModule;return new s((s,a)=>{t.multiArgs?i.push((...e)=>{t.errorFirst?e[0]?a(e):(e.shift(),s(e)):s(e)}):t.errorFirst?i.push((e,t)=>{e?a(e):s(t)}):i.push(s);let o=this===r?n:this;Reflect.apply(e,o,i)})},s=new WeakMap;function a(e,t){t={exclude:[/.+(?:Sync|Stream)$/],errorFirst:!0,promiseModule:Promise,...t};let r=typeof e;if(!(null!==e&&("object"===r||"function"===r)))throw TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${null===e?"null":r}\``);let n=(e,r)=>{let n=s.get(e);if(n||(n={},s.set(e,n)),r in n)return n[r];let i=e=>"string"==typeof e||"symbol"==typeof r?r===e:e.test(r),a=Reflect.getOwnPropertyDescriptor(e,r),o=void 0===a||a.writable||a.configurable,l=t.include?t.include.some(e=>i(e)):!t.exclude.some(e=>i(e)),u=l&&o;return n[r]=u,u},a=new WeakMap,o=new Proxy(e,{apply(e,r,n){let s=a.get(e);if(s)return Reflect.apply(s,r,n);let l=t.excludeMain?e:i(e,t,o,e);return a.set(e,l),Reflect.apply(l,r,n)},get(e,r){let s=e[r];if(!n(e,r)||s===Function.prototype[r])return s;let l=a.get(s);if(l)return l;if("function"==typeof s){let r=i(s,t,o,e);return a.set(s,r),r}return s}});return o}},{"@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],"5SVS9":[function(e,t,r){e("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(r),r.default=class{constructor(e=!1){this.debug=e}async getOrCreateClientId(){let{clientId:e}=await chrome.storage.local.get("clientId");return e||(e=crypto.randomUUID(),await chrome.storage.local.set({clientId:e})),e}async getOrCreateSessionId(){let{sessionData:e}=await chrome.storage.session.get("sessionData"),t=Date.now();if(e&&e.timestamp){let r=(t-e.timestamp)/6e4;r>30?e=null:(e.timestamp=t,await chrome.storage.session.set({sessionData:e}))}return e||(e={session_id:t.toString(),timestamp:t.toString()},await chrome.storage.session.set({sessionData:e})),e.session_id}async fireEvent(e,t={}){t.session_id||(t.session_id=await this.getOrCreateSessionId()),t.engagement_time_msec||(t.engagement_time_msec=100),t.debug_mode||(t.debug_mode=this.debug);try{let r=new URLSearchParams({measurement_id:"G-2JS3041R4W",api_secret:"dkgE6vAlS9eUt0eKKO1UQg"}),n=await (await fetch(`https://www.google-analytics.com/mp/collect?${r}`,{method:"POST",body:JSON.stringify({client_id:await this.getOrCreateClientId(),events:[{name:e,params:t}]})})).text();if(!this.debug)return;console.log("Google Analytics response:",n)}catch(e){console.error("Google Analytics request failed with an exception",e)}}async firePageViewEvent(e,t,r={}){return this.fireEvent("page_view",{ext_section:e,page_url:t,...r})}async fireErrorEvent(e,t={}){return this.fireEvent("extension_error",{...e,...t})}}},{"@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],"8B3mQ":[function(e,t,r){let n;var i=e("@parcel/transformer-js/src/esmodule-helpers.js");i.defineInteropFlag(r),i.export(r,"app",()=>c),i.export(r,"db",()=>h),i.export(r,"auth",()=>d),i.export(r,"unsubscribeFirestoreHandler",()=>n),i.export(r,"getCredentialsForFirebase",()=>p),i.export(r,"addFirestoreListener",()=>m),i.export(r,"signingOut",()=>g);var s=e("@firebase/app"),a=e("@firebase/auth/web-extension"),o=e("@firebase/firestore"),l=e("@plasmohq/storage"),u=e("~background/utils");let c=(0,s.initializeApp)({apiKey:"AIzaSyCD3FfsBUporfw89orhVdGa1F5yNGh7_XU",authDomain:"time-manager-726ab.firebaseapp.com",projectId:"time-manager-726ab",storageBucket:"time-manager-726ab.appspot.com",messagingSenderId:"1031786013885",appId:"1:1031786013885:web:005c46e295054ac6f983d4",measurementId:void 0}),h=(0,o.getFirestore)(c),d=(0,a.getAuth)(c),f=new l.Storage({area:"local"});async function p(e){let t,{authData:r,user:n,info:i}=e||await f.get("user"),s=async()=>{let e=(0,a.GoogleAuthProvider).credential(r.id_token,r.access_token);t=await (0,a.signInWithCredential)(d,e)};try{await s()}catch(a){if("auth/invalid-credential"!==a.code)throw console.error("Error signing in with Google",a),a;let{refresh_token:e}=r;(r=await (0,u.getGoogleAuthData)({refresh_token:e})).refresh_token=e,await s(),await f.set("user",{authData:r,authFirebase:t,user:n,info:i})}return t}function m(e){n=(0,o.onSnapshot)((0,o.doc)(h,"usersTempSubscription",e.user.uid),async e=>{let t=e.data();await f.set("subscription",t.subscription)})}async function g(){await (0,a.signOut)(d)}},{"@firebase/app":"d239L","@firebase/auth/web-extension":"mnyPU","@firebase/firestore":"2FnHu","@plasmohq/storage":"3r5ba","~background/utils":"bbD2v","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],mnyPU:[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"ActionCodeURL",()=>i.Y),n.export(r,"AuthCredential",()=>i.m),n.export(r,"AuthErrorCodes",()=>i.A),n.export(r,"EmailAuthCredential",()=>i.E),n.export(r,"EmailAuthProvider",()=>i.q),n.export(r,"FacebookAuthProvider",()=>i.F),n.export(r,"GithubAuthProvider",()=>i.t),n.export(r,"GoogleAuthProvider",()=>i.G),n.export(r,"OAuthCredential",()=>i.O),n.export(r,"OAuthProvider",()=>i.w),n.export(r,"PhoneAuthCredential",()=>i.P),n.export(r,"SAMLAuthProvider",()=>i.S),n.export(r,"TotpMultiFactorGenerator",()=>i.T),n.export(r,"TotpSecret",()=>i.b),n.export(r,"TwitterAuthProvider",()=>i.x),n.export(r,"applyActionCode",()=>i.J),n.export(r,"beforeAuthStateChanged",()=>i.e),n.export(r,"checkActionCode",()=>i.K),n.export(r,"confirmPasswordReset",()=>i.I),n.export(r,"connectAuthEmulator",()=>i.c),n.export(r,"createUserWithEmailAndPassword",()=>i.M),n.export(r,"debugErrorMap",()=>i.l),n.export(r,"deleteUser",()=>i.k),n.export(r,"fetchSignInMethodsForEmail",()=>i.V),n.export(r,"getAdditionalUserInfo",()=>i.a4),n.export(r,"getIdToken",()=>i.a1),n.export(r,"getIdTokenResult",()=>i.a2),n.export(r,"getMultiFactorResolver",()=>i.a6),n.export(r,"inMemoryPersistence",()=>i.n),n.export(r,"indexedDBLocalPersistence",()=>i.a),n.export(r,"initializeAuth",()=>i.i),n.export(r,"initializeRecaptchaConfig",()=>i.d),n.export(r,"isSignInWithEmailLink",()=>i.R),n.export(r,"linkWithCredential",()=>i.B),n.export(r,"multiFactor",()=>i.a7),n.export(r,"onAuthStateChanged",()=>i.f),n.export(r,"onIdTokenChanged",()=>i.o),n.export(r,"parseActionCodeURL",()=>i.Z),n.export(r,"prodErrorMap",()=>i.p),n.export(r,"reauthenticateWithCredential",()=>i.C),n.export(r,"reload",()=>i.a5),n.export(r,"revokeAccessToken",()=>i.j),n.export(r,"sendEmailVerification",()=>i.W),n.export(r,"sendPasswordResetEmail",()=>i.H),n.export(r,"sendSignInLinkToEmail",()=>i.Q),n.export(r,"setPersistence",()=>i.s),n.export(r,"signInAnonymously",()=>i.y),n.export(r,"signInWithCredential",()=>i.z),n.export(r,"signInWithCustomToken",()=>i.D),n.export(r,"signInWithEmailAndPassword",()=>i.N),n.export(r,"signInWithEmailLink",()=>i.U),n.export(r,"signOut",()=>i.h),n.export(r,"unlink",()=>i.a3),n.export(r,"updateCurrentUser",()=>i.g),n.export(r,"updateEmail",()=>i.$),n.export(r,"updatePassword",()=>i.a0),n.export(r,"updateProfile",()=>i._),n.export(r,"useDeviceLanguage",()=>i.u),n.export(r,"validatePassword",()=>i.v),n.export(r,"verifyBeforeUpdateEmail",()=>i.X),n.export(r,"verifyPasswordResetCode",()=>i.L),n.export(r,"getAuth",()=>o);var i=e("./register-83348242.js"),s=e("@firebase/app"),a=e("@firebase/util");/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function o(e=(0,s.getApp)()){let t=(0,s._getProvider)(e,"auth");if(t.isInitialized())return t.getImmediate();let r=(0,i.i)(e,{persistence:[i.a]}),n=(0,a.getDefaultEmulatorHost)("auth");return n&&(0,i.c)(r,`http://${n}`),r}e("tslib"),e("@firebase/component"),e("@firebase/logger"),(0,i.r)("WebExtension")},{"./register-83348242.js":"dHeZr","@firebase/app":"d239L","@firebase/util":"aD5S7",tslib:"e3YiB","@firebase/component":"8ml9B","@firebase/logger":"aO433","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],dHeZr:[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"$",()=>t5),n.export(r,"A",()=>f),n.export(r,"B",()=>tL),n.export(r,"C",()=>tM),n.export(r,"D",()=>tU),n.export(r,"E",()=>tt),n.export(r,"F",()=>tg),n.export(r,"G",()=>ty),n.export(r,"H",()=>tG),n.export(r,"I",()=>tK),n.export(r,"J",()=>t$),n.export(r,"K",()=>tH),n.export(r,"L",()=>tQ),n.export(r,"M",()=>tW),n.export(r,"N",()=>tJ),n.export(r,"O",()=>tn),n.export(r,"P",()=>tu),n.export(r,"Q",()=>tY),n.export(r,"R",()=>tX),n.export(r,"S",()=>tb),n.export(r,"T",()=>rH),n.export(r,"U",()=>tZ),n.export(r,"V",()=>t1),n.export(r,"W",()=>t2),n.export(r,"X",()=>t4),n.export(r,"Y",()=>tc),n.export(r,"Z",()=>th),n.export(r,"_",()=>t9),n.export(r,"a",()=>rz),n.export(r,"a0",()=>t3),n.export(r,"a1",()=>W),n.export(r,"a2",()=>J),n.export(r,"a3",()=>tD),n.export(r,"a4",()=>rs),n.export(r,"a5",()=>ei),n.export(r,"a6",()=>rw),n.export(r,"a7",()=>rT),n.export(r,"a8",()=>rS),n.export(r,"a9",()=>eN),n.export(r,"aA",()=>g),n.export(r,"aB",()=>T),n.export(r,"aC",()=>b),n.export(r,"aD",()=>rA),n.export(r,"aE",()=>tf),n.export(r,"aF",()=>em),n.export(r,"aG",()=>P),n.export(r,"aH",()=>S),n.export(r,"aI",()=>eq),n.export(r,"aJ",()=>D),n.export(r,"aK",()=>eb),n.export(r,"aL",()=>ev),n.export(r,"aM",()=>eA),n.export(r,"aN",()=>tp),n.export(r,"aO",()=>rN),n.export(r,"aP",()=>r$),n.export(r,"aQ",()=>rI),n.export(r,"aR",()=>rK),n.export(r,"aS",()=>eV),n.export(r,"aT",()=>e_),n.export(r,"aU",()=>ex),n.export(r,"aV",()=>ec),n.export(r,"aW",()=>eL),n.export(r,"aX",()=>ek),n.export(r,"aY",()=>N),n.export(r,"aZ",()=>tw),n.export(r,"aa",()=>eD),n.export(r,"ab",()=>eC),n.export(r,"ac",()=>ew),n.export(r,"ad",()=>eS),n.export(r,"ae",()=>_),n.export(r,"af",()=>C),n.export(r,"ag",()=>rD),n.export(r,"ah",()=>B),n.export(r,"ai",()=>y),n.export(r,"aj",()=>ej),n.export(r,"ak",()=>eB),n.export(r,"al",()=>ez),n.export(r,"am",()=>eM),n.export(r,"an",()=>x),n.export(r,"ao",()=>rk),n.export(r,"ap",()=>z),n.export(r,"aq",()=>w),n.export(r,"ar",()=>tk),n.export(r,"as",()=>rb),n.export(r,"at",()=>rG),n.export(r,"au",()=>ti),n.export(r,"av",()=>tN),n.export(r,"aw",()=>ed),n.export(r,"ax",()=>tR),n.export(r,"ay",()=>tO),n.export(r,"az",()=>tr),n.export(r,"b",()=>rW),n.export(r,"c",()=>eW),n.export(r,"d",()=>ro),n.export(r,"e",()=>rc),n.export(r,"f",()=>rh),n.export(r,"g",()=>rf),n.export(r,"h",()=>rp),n.export(r,"i",()=>eQ),n.export(r,"j",()=>rm),n.export(r,"k",()=>rg),n.export(r,"l",()=>c),n.export(r,"m",()=>eX),n.export(r,"n",()=>ep),n.export(r,"o",()=>ru),n.export(r,"p",()=>h),n.export(r,"q",()=>td),n.export(r,"r",()=>r0),n.export(r,"s",()=>ra),n.export(r,"t",()=>tv),n.export(r,"u",()=>rd),n.export(r,"v",()=>rl),n.export(r,"w",()=>tm),n.export(r,"x",()=>tI),n.export(r,"y",()=>tS),n.export(r,"z",()=>tP);var i=e("@firebase/app"),s=e("@firebase/util"),a=e("tslib"),o=e("@firebase/component"),l=e("@firebase/logger");function u(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}let c=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(){return{"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","emulator-config-failed":'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',"expired-action-code":"The action code has expired.","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal AuthError has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registed for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal AuthError has occurred.","invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-emulator-scheme":"Emulator URL must start with a valid scheme (http:// or https://).","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is incorrect, malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].","invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.","login-blocked":"Login blocked by user-provided method: {$originalMessage}","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.","missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal AuthError has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.","missing-password":"A non-empty password must be provided","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal AuthError has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.","rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.","unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled.","already-initialized":"initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.","missing-recaptcha-token":"The reCAPTCHA token is missing when sending request to the backend.","invalid-recaptcha-token":"The reCAPTCHA token is invalid when sending request to the backend.","invalid-recaptcha-action":"The reCAPTCHA action is invalid when sending request to the backend.","recaptcha-not-enabled":"reCAPTCHA Enterprise integration is not enabled for this project.","missing-client-type":"The reCAPTCHA client type is missing when sending request to the backend.","missing-recaptcha-version":"The reCAPTCHA version is missing when sending request to the backend.","invalid-req-type":"Invalid request parameters.","invalid-recaptcha-version":"The reCAPTCHA version is invalid when sending request to the backend.","unsupported-password-policy-schema-version":"The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.","password-does-not-meet-requirements":"The password does not meet the requirements."}},h=u,d=new s.ErrorFactory("auth","Firebase",u()),f={ADMIN_ONLY_OPERATION:"auth/admin-restricted-operation",ARGUMENT_ERROR:"auth/argument-error",APP_NOT_AUTHORIZED:"auth/app-not-authorized",APP_NOT_INSTALLED:"auth/app-not-installed",CAPTCHA_CHECK_FAILED:"auth/captcha-check-failed",CODE_EXPIRED:"auth/code-expired",CORDOVA_NOT_READY:"auth/cordova-not-ready",CORS_UNSUPPORTED:"auth/cors-unsupported",CREDENTIAL_ALREADY_IN_USE:"auth/credential-already-in-use",CREDENTIAL_MISMATCH:"auth/custom-token-mismatch",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"auth/requires-recent-login",DEPENDENT_SDK_INIT_BEFORE_AUTH:"auth/dependent-sdk-initialized-before-auth",DYNAMIC_LINK_NOT_ACTIVATED:"auth/dynamic-link-not-activated",EMAIL_CHANGE_NEEDS_VERIFICATION:"auth/email-change-needs-verification",EMAIL_EXISTS:"auth/email-already-in-use",EMULATOR_CONFIG_FAILED:"auth/emulator-config-failed",EXPIRED_OOB_CODE:"auth/expired-action-code",EXPIRED_POPUP_REQUEST:"auth/cancelled-popup-request",INTERNAL_ERROR:"auth/internal-error",INVALID_API_KEY:"auth/invalid-api-key",INVALID_APP_CREDENTIAL:"auth/invalid-app-credential",INVALID_APP_ID:"auth/invalid-app-id",INVALID_AUTH:"auth/invalid-user-token",INVALID_AUTH_EVENT:"auth/invalid-auth-event",INVALID_CERT_HASH:"auth/invalid-cert-hash",INVALID_CODE:"auth/invalid-verification-code",INVALID_CONTINUE_URI:"auth/invalid-continue-uri",INVALID_CORDOVA_CONFIGURATION:"auth/invalid-cordova-configuration",INVALID_CUSTOM_TOKEN:"auth/invalid-custom-token",INVALID_DYNAMIC_LINK_DOMAIN:"auth/invalid-dynamic-link-domain",INVALID_EMAIL:"auth/invalid-email",INVALID_EMULATOR_SCHEME:"auth/invalid-emulator-scheme",INVALID_IDP_RESPONSE:"auth/invalid-credential",INVALID_LOGIN_CREDENTIALS:"auth/invalid-credential",INVALID_MESSAGE_PAYLOAD:"auth/invalid-message-payload",INVALID_MFA_SESSION:"auth/invalid-multi-factor-session",INVALID_OAUTH_CLIENT_ID:"auth/invalid-oauth-client-id",INVALID_OAUTH_PROVIDER:"auth/invalid-oauth-provider",INVALID_OOB_CODE:"auth/invalid-action-code",INVALID_ORIGIN:"auth/unauthorized-domain",INVALID_PASSWORD:"auth/wrong-password",INVALID_PERSISTENCE:"auth/invalid-persistence-type",INVALID_PHONE_NUMBER:"auth/invalid-phone-number",INVALID_PROVIDER_ID:"auth/invalid-provider-id",INVALID_RECIPIENT_EMAIL:"auth/invalid-recipient-email",INVALID_SENDER:"auth/invalid-sender",INVALID_SESSION_INFO:"auth/invalid-verification-id",INVALID_TENANT_ID:"auth/invalid-tenant-id",MFA_INFO_NOT_FOUND:"auth/multi-factor-info-not-found",MFA_REQUIRED:"auth/multi-factor-auth-required",MISSING_ANDROID_PACKAGE_NAME:"auth/missing-android-pkg-name",MISSING_APP_CREDENTIAL:"auth/missing-app-credential",MISSING_AUTH_DOMAIN:"auth/auth-domain-config-required",MISSING_CODE:"auth/missing-verification-code",MISSING_CONTINUE_URI:"auth/missing-continue-uri",MISSING_IFRAME_START:"auth/missing-iframe-start",MISSING_IOS_BUNDLE_ID:"auth/missing-ios-bundle-id",MISSING_OR_INVALID_NONCE:"auth/missing-or-invalid-nonce",MISSING_MFA_INFO:"auth/missing-multi-factor-info",MISSING_MFA_SESSION:"auth/missing-multi-factor-session",MISSING_PHONE_NUMBER:"auth/missing-phone-number",MISSING_SESSION_INFO:"auth/missing-verification-id",MODULE_DESTROYED:"auth/app-deleted",NEED_CONFIRMATION:"auth/account-exists-with-different-credential",NETWORK_REQUEST_FAILED:"auth/network-request-failed",NULL_USER:"auth/null-user",NO_AUTH_EVENT:"auth/no-auth-event",NO_SUCH_PROVIDER:"auth/no-such-provider",OPERATION_NOT_ALLOWED:"auth/operation-not-allowed",OPERATION_NOT_SUPPORTED:"auth/operation-not-supported-in-this-environment",POPUP_BLOCKED:"auth/popup-blocked",POPUP_CLOSED_BY_USER:"auth/popup-closed-by-user",PROVIDER_ALREADY_LINKED:"auth/provider-already-linked",QUOTA_EXCEEDED:"auth/quota-exceeded",REDIRECT_CANCELLED_BY_USER:"auth/redirect-cancelled-by-user",REDIRECT_OPERATION_PENDING:"auth/redirect-operation-pending",REJECTED_CREDENTIAL:"auth/rejected-credential",SECOND_FACTOR_ALREADY_ENROLLED:"auth/second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"auth/maximum-second-factor-count-exceeded",TENANT_ID_MISMATCH:"auth/tenant-id-mismatch",TIMEOUT:"auth/timeout",TOKEN_EXPIRED:"auth/user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"auth/too-many-requests",UNAUTHORIZED_DOMAIN:"auth/unauthorized-continue-uri",UNSUPPORTED_FIRST_FACTOR:"auth/unsupported-first-factor",UNSUPPORTED_PERSISTENCE:"auth/unsupported-persistence-type",UNSUPPORTED_TENANT_OPERATION:"auth/unsupported-tenant-operation",UNVERIFIED_EMAIL:"auth/unverified-email",USER_CANCELLED:"auth/user-cancelled",USER_DELETED:"auth/user-not-found",USER_DISABLED:"auth/user-disabled",USER_MISMATCH:"auth/user-mismatch",USER_SIGNED_OUT:"auth/user-signed-out",WEAK_PASSWORD:"auth/weak-password",WEB_STORAGE_UNSUPPORTED:"auth/web-storage-unsupported",ALREADY_INITIALIZED:"auth/already-initialized",RECAPTCHA_NOT_ENABLED:"auth/recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"auth/missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"auth/invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"auth/invalid-recaptcha-action",MISSING_CLIENT_TYPE:"auth/missing-client-type",MISSING_RECAPTCHA_VERSION:"auth/missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"auth/invalid-recaptcha-version",INVALID_REQ_TYPE:"auth/invalid-req-type"},p=new l.Logger("@firebase/auth");function m(e,...t){p.logLevel<=l.LogLevel.ERROR&&p.error(`Auth (${i.SDK_VERSION}): ${e}`,...t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g(e,...t){throw I(e,...t)}function y(e,...t){return I(e,...t)}function v(e,t,r){let n=Object.assign(Object.assign({},h()),{[t]:r}),i=new s.ErrorFactory("auth","Firebase",n);return i.create(t,{appName:e.name})}function w(e){return v(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function b(e,t,r){if(!(t instanceof r))throw r.name!==t.constructor.name&&g(e,"argument-error"),v(e,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function I(e,...t){if("string"!=typeof e){let r=t[0],n=[...t.slice(1)];return n[0]&&(n[0].appName=e.name),e._errorFactory.create(r,...n)}return d.create(e,...t)}function _(e,t,...r){if(!e)throw I(t,...r)}function E(e){let t="INTERNAL ASSERTION FAILED: "+e;throw m(t),Error(t)}function T(e,t){e||E(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function S(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.href)||""}function x(){return"http:"===A()||"https:"===A()}function A(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class C{constructor(e,t){this.shortDelay=e,this.longDelay=t,T(t>e,"Short delay should be less than long delay!"),this.isMobile=(0,s.isMobileCordova)()||(0,s.isReactNative)()}get(){return!("undefined"!=typeof navigator&&navigator&&"onLine"in navigator&&"boolean"==typeof navigator.onLine&&(x()||(0,s.isBrowserExtension)()||"connection"in navigator))||navigator.onLine?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function D(e,t){T(e.emulator,"Emulator should always be set here");let{url:r}=e.emulator;return t?`${r}${t.startsWith("/")?t.slice(1):t}`:r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class N{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:"undefined"!=typeof globalThis&&globalThis.fetch?globalThis.fetch:"undefined"!=typeof fetch?fetch:void E("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:"undefined"!=typeof globalThis&&globalThis.Headers?globalThis.Headers:"undefined"!=typeof Headers?Headers:void E("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:"undefined"!=typeof globalThis&&globalThis.Response?globalThis.Response:"undefined"!=typeof Response?Response:void E("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let k={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},O=new C(3e4,6e4);function R(e,t){return e.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:e.tenantId}):t}async function P(e,t,r,n,i={}){return L(e,i,async()=>{let i={},a={};n&&("GET"===t?a=n:i={body:JSON.stringify(n)});let o=(0,s.querystring)(Object.assign({key:e.config.apiKey},a)).slice(1),l=await e._getAdditionalHeaders();return l["Content-Type"]="application/json",e.languageCode&&(l["X-Firebase-Locale"]=e.languageCode),N.fetch()(F(e,e.config.apiHost,r,o),Object.assign({method:t,headers:l,referrerPolicy:"no-referrer"},i))})}async function L(e,t,r){e._canInitEmulator=!1;let n=Object.assign(Object.assign({},k),t);try{let t=new U(e),i=await Promise.race([r(),t.promise]);t.clearNetworkTimeout();let s=await i.json();if("needConfirmation"in s)throw V(e,"account-exists-with-different-credential",s);if(i.ok&&!("errorMessage"in s))return s;{let t=i.ok?s.errorMessage:s.error.message,[r,a]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===r)throw V(e,"credential-already-in-use",s);if("EMAIL_EXISTS"===r)throw V(e,"email-already-in-use",s);if("USER_DISABLED"===r)throw V(e,"user-disabled",s);let o=n[r]||r.toLowerCase().replace(/[_\s]+/g,"-");if(a)throw v(e,o,a);g(e,o)}}catch(t){if(t instanceof s.FirebaseError)throw t;g(e,"network-request-failed",{message:String(t)})}}async function M(e,t,r,n,i={}){let s=await P(e,t,r,n,i);return"mfaPendingCredential"in s&&g(e,"multi-factor-auth-required",{_serverResponse:s}),s}function F(e,t,r,n){let i=`${t}${r}?${n}`;return e.config.emulator?D(e.config,i):`${e.config.apiScheme}://${i}`}class U{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(y(this.auth,"network-request-failed")),O.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function V(e,t,r){let n={appName:e.name};r.email&&(n.email=r.email),r.phoneNumber&&(n.phoneNumber=r.phoneNumber);let i=y(e,t,n);return i.customData._tokenResponse=r,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(e){return void 0!==e&&void 0!==e.getResponse}function j(e){return void 0!==e&&void 0!==e.enterprise}class q{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],void 0===e.recaptchaKey)throw Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||0===this.recaptchaEnforcementState.length)return null;for(let t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return function(e){switch(e){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}(t.enforcementState);return null}isProviderEnabled(e){return"ENFORCE"===this.getProviderEnforcementState(e)||"AUDIT"===this.getProviderEnforcementState(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function z(e){return(await P(e,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function G(e,t){return P(e,"GET","/v2/recaptchaConfig",R(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function K(e,t){return P(e,"POST","/v1/accounts:delete",t)}async function $(e,t){return P(e,"POST","/v1/accounts:update",t)}async function H(e,t){return P(e,"POST","/v1/accounts:lookup",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q(e){if(e)try{let t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(e){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function W(e,t=!1){return(0,s.getModularInstance)(e).getIdToken(t)}async function J(e,t=!1){let r=(0,s.getModularInstance)(e),n=await r.getIdToken(t),i=X(n);_(i&&i.exp&&i.auth_time&&i.iat,r.auth,"internal-error");let a="object"==typeof i.firebase?i.firebase:void 0,o=null==a?void 0:a.sign_in_provider;return{claims:i,token:n,authTime:Q(Y(i.auth_time)),issuedAtTime:Q(Y(i.iat)),expirationTime:Q(Y(i.exp)),signInProvider:o||null,signInSecondFactor:(null==a?void 0:a.sign_in_second_factor)||null}}function Y(e){return 1e3*Number(e)}function X(e){let[t,r,n]=e.split(".");if(void 0===t||void 0===r||void 0===n)return m("JWT malformed, contained fewer than 3 sections"),null;try{let e=(0,s.base64Decode)(r);if(!e)return m("Failed to decode base64 JWT payload"),null;return JSON.parse(e)}catch(e){return m("Caught error parsing JWT payload as JSON",null==e?void 0:e.toString()),null}}function Z(e){let t=X(e);return _(t,"internal-error"),_(void 0!==t.exp,"internal-error"),_(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ee(e,t,r=!1){if(r)return t;try{return await t}catch(t){throw t instanceof s.FirebaseError&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}(t)&&e.auth.currentUser===e&&await e.auth.signOut(),t}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){let e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;let e=null!==(t=this.user.stsTokenManager.expirationTime)&&void 0!==t?t:0,r=e-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(null==e?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class er{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=Q(this.lastLoginAt),this.creationTime=Q(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function en(e){var t;let r=e.auth,n=await e.getIdToken(),i=await ee(e,H(r,{idToken:n}));_(null==i?void 0:i.users.length,r,"internal-error");let s=i.users[0];e._notifyReloadListener(s);let a=(null===(t=s.providerUserInfo)||void 0===t?void 0:t.length)?es(s.providerUserInfo):[],o=function(e,t){let r=e.filter(e=>!t.some(t=>t.providerId===e.providerId));return[...r,...t]}(e.providerData,a),l=e.isAnonymous,u=!(e.email&&s.passwordHash)&&!(null==o?void 0:o.length),c={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new er(s.createdAt,s.lastLoginAt),isAnonymous:!!l&&u};Object.assign(e,c)}async function ei(e){let t=(0,s.getModularInstance)(e);await en(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function es(e){return e.map(e=>{var{providerId:t}=e,r=(0,a.__rest)(e,["providerId"]);return{providerId:t,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ea(e,t){let r=await L(e,{},async()=>{let r=(0,s.querystring)({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:n,apiKey:i}=e.config,a=F(e,n,"/v1/token",`key=${i}`),o=await e._getAdditionalHeaders();return o["Content-Type"]="application/x-www-form-urlencoded",N.fetch()(a,{method:"POST",headers:o,body:r})});return{accessToken:r.access_token,expiresIn:r.expires_in,refreshToken:r.refresh_token}}async function eo(e,t){return P(e,"POST","/v2/accounts:revokeToken",R(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class el{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){_(e.idToken,"internal-error"),_(void 0!==e.idToken,"internal-error"),_(void 0!==e.refreshToken,"internal-error");let t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):Z(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){_(0!==e.length,"internal-error");let t=Z(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return t||!this.accessToken||this.isExpired?(_(this.refreshToken,e,"user-token-expired"),this.refreshToken)?(await this.refresh(e,this.refreshToken),this.accessToken):null:this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:r,refreshToken:n,expiresIn:i}=await ea(e,t);this.updateTokensAndExpiration(r,n,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*r}static fromJSON(e,t){let{refreshToken:r,accessToken:n,expirationTime:i}=t,s=new el;return r&&(_("string"==typeof r,"internal-error",{appName:e}),s.refreshToken=r),n&&(_("string"==typeof n,"internal-error",{appName:e}),s.accessToken=n),i&&(_("number"==typeof i,"internal-error",{appName:e}),s.expirationTime=i),s}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new el,this.toJSON())}_performRefresh(){return E("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eu(e,t){_("string"==typeof e||void 0===e,"internal-error",{appName:t})}class ec{constructor(e){var{uid:t,auth:r,stsTokenManager:n}=e,i=(0,a.__rest)(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new et(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=r,this.stsTokenManager=n,this.accessToken=n.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new er(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){let t=await ee(this,this.stsTokenManager.getToken(this.auth,e));return _(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return J(this,e)}reload(){return ei(this)}_assign(e){this!==e&&(_(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>Object.assign({},e)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new ec(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){_(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await en(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if((0,i._isFirebaseServerApp)(this.auth.app))return Promise.reject(w(this.auth));let e=await this.getIdToken();return await ee(this,K(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var r,n,i,s,a,o,l,u;let c=null!==(r=t.displayName)&&void 0!==r?r:void 0,h=null!==(n=t.email)&&void 0!==n?n:void 0,d=null!==(i=t.phoneNumber)&&void 0!==i?i:void 0,f=null!==(s=t.photoURL)&&void 0!==s?s:void 0,p=null!==(a=t.tenantId)&&void 0!==a?a:void 0,m=null!==(o=t._redirectEventId)&&void 0!==o?o:void 0,g=null!==(l=t.createdAt)&&void 0!==l?l:void 0,y=null!==(u=t.lastLoginAt)&&void 0!==u?u:void 0,{uid:v,emailVerified:w,isAnonymous:b,providerData:I,stsTokenManager:E}=t;_(v&&E,e,"internal-error");let T=el.fromJSON(this.name,E);_("string"==typeof v,e,"internal-error"),eu(c,e.name),eu(h,e.name),_("boolean"==typeof w,e,"internal-error"),_("boolean"==typeof b,e,"internal-error"),eu(d,e.name),eu(f,e.name),eu(p,e.name),eu(m,e.name),eu(g,e.name),eu(y,e.name);let S=new ec({uid:v,auth:e,email:h,emailVerified:w,displayName:c,isAnonymous:b,photoURL:f,phoneNumber:d,tenantId:p,stsTokenManager:T,createdAt:g,lastLoginAt:y});return I&&Array.isArray(I)&&(S.providerData=I.map(e=>Object.assign({},e))),m&&(S._redirectEventId=m),S}static async _fromIdTokenResponse(e,t,r=!1){let n=new el;n.updateFromServerResponse(t);let i=new ec({uid:t.localId,auth:e,stsTokenManager:n,isAnonymous:r});return await en(i),i}static async _fromGetAccountInfoResponse(e,t,r){let n=t.users[0];_(void 0!==n.localId,"internal-error");let i=void 0!==n.providerUserInfo?es(n.providerUserInfo):[],s=!(n.email&&n.passwordHash)&&!(null==i?void 0:i.length),a=new el;a.updateFromIdToken(r);let o=new ec({uid:n.localId,auth:e,stsTokenManager:a,isAnonymous:s}),l={uid:n.localId,displayName:n.displayName||null,photoURL:n.photoUrl||null,email:n.email||null,emailVerified:n.emailVerified||!1,phoneNumber:n.phoneNumber||null,tenantId:n.tenantId||null,providerData:i,metadata:new er(n.createdAt,n.lastLoginAt),isAnonymous:!(n.email&&n.passwordHash)&&!(null==i?void 0:i.length)};return Object.assign(o,l),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eh=new Map;function ed(e){T(e instanceof Function,"Expected a class definition");let t=eh.get(e);return t?T(t instanceof e,"Instance stored in cache mismatched with class"):(t=new e,eh.set(e,t)),t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ef{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}ef.type="NONE";let ep=ef;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function em(e,t,r){return`firebase:${e}:${t}:${r}`}class eg{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;let{config:n,name:i}=this.auth;this.fullUserKey=em(this.userKey,n.apiKey,i),this.fullPersistenceKey=em("persistence",n.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);return e?ec._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new eg(ed(ep),e,r);let n=(await Promise.all(t.map(async e=>{if(await e._isAvailable())return e}))).filter(e=>e),i=n[0]||ed(ep),s=em(r,e.config.apiKey,e.name),a=null;for(let r of t)try{let t=await r._get(s);if(t){let n=ec._fromJSON(e,t);r!==i&&(a=n),i=r;break}}catch(e){}let o=n.filter(e=>e._shouldAllowMigration);return i._shouldAllowMigration&&o.length&&(i=o[0],a&&await i._set(s,a.toJSON()),await Promise.all(t.map(async e=>{if(e!==i)try{await e._remove(s)}catch(e){}}))),new eg(i,e,r)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ey(e){let t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";{if(eI(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(ev(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(eE(t))return"Blackberry";if(eT(t))return"Webos";if(ew(t))return"Safari";if((t.includes("chrome/")||eb(t))&&!t.includes("edge/"))return"Chrome";if(e_(t))return"Android";let r=e.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/);if((null==r?void 0:r.length)===2)return r[1]}return"Other"}function ev(e=(0,s.getUA)()){return/firefox\//i.test(e)}function ew(e=(0,s.getUA)()){let t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function eb(e=(0,s.getUA)()){return/crios\//i.test(e)}function eI(e=(0,s.getUA)()){return/iemobile/i.test(e)}function e_(e=(0,s.getUA)()){return/android/i.test(e)}function eE(e=(0,s.getUA)()){return/blackberry/i.test(e)}function eT(e=(0,s.getUA)()){return/webos/i.test(e)}function eS(e=(0,s.getUA)()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function ex(e=(0,s.getUA)()){return/(iPad|iPhone|iPod).*OS 7_\d/i.test(e)||/(iPad|iPhone|iPod).*OS 8_\d/i.test(e)}function eA(e=(0,s.getUA)()){var t;return eS(e)&&!!(null===(t=window.navigator)||void 0===t?void 0:t.standalone)}function eC(){return(0,s.isIE)()&&10===document.documentMode}function eD(e=(0,s.getUA)()){return eS(e)||e_(e)||eT(e)||eE(e)||/windows phone/i.test(e)||eI(e)}function eN(){try{return!!(window&&window!==window.top)}catch(e){return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ek(e,t=[]){let r;switch(e){case"Browser":r=ey((0,s.getUA)());break;case"Worker":r=`${ey((0,s.getUA)())}-${e}`;break;default:r=e}let n=t.length?t.join(","):"FirebaseCore-web";return`${r}/JsCore/${i.SDK_VERSION}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eO{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let r=t=>new Promise((r,n)=>{try{let n=e(t);r(n)}catch(e){n(e)}});r.onAbort=t,this.queue.push(r);let n=this.queue.length-1;return()=>{this.queue[n]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(e){for(let e of(t.reverse(),t))try{e()}catch(e){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null==e?void 0:e.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eR(e,t={}){return P(e,"GET","/v2/passwordPolicy",R(e,t))}class eP{constructor(e){var t,r,n,i;let s=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=null!==(t=s.minPasswordLength)&&void 0!==t?t:6,s.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=s.maxPasswordLength),void 0!==s.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=s.containsLowercaseCharacter),void 0!==s.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=s.containsUppercaseCharacter),void 0!==s.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=s.containsNumericCharacter),void 0!==s.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=s.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=null!==(n=null===(r=e.allowedNonAlphanumericCharacters)||void 0===r?void 0:r.join(""))&&void 0!==n?n:"",this.forceUpgradeOnSignin=null!==(i=e.forceUpgradeOnSignin)&&void 0!==i&&i,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,r,n,i,s,a;let o={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,o),this.validatePasswordCharacterOptions(e,o),o.isValid&&(o.isValid=null===(t=o.meetsMinPasswordLength)||void 0===t||t),o.isValid&&(o.isValid=null===(r=o.meetsMaxPasswordLength)||void 0===r||r),o.isValid&&(o.isValid=null===(n=o.containsLowercaseLetter)||void 0===n||n),o.isValid&&(o.isValid=null===(i=o.containsUppercaseLetter)||void 0===i||i),o.isValid&&(o.isValid=null===(s=o.containsNumericCharacter)||void 0===s||s),o.isValid&&(o.isValid=null===(a=o.containsNonAlphanumericCharacter)||void 0===a||a),o}validatePasswordLengthOptions(e,t){let r=this.customStrengthOptions.minPasswordLength,n=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),n&&(t.meetsMaxPasswordLength=e.length<=n)}validatePasswordCharacterOptions(e,t){let r;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let n=0;n<e.length;n++)r=e.charAt(n),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,n,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=n)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eL{constructor(e,t,r,n){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=n,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new eF(this),this.idTokenSubscription=new eF(this),this.beforeStateQueue=new eO(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=d,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=n.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=ed(t)),this._initializationPromise=this.queue(async()=>{var r,n;if(!this._deleted&&(this.persistenceManager=await eg.create(this,e),!this._deleted)){if(null===(r=this._popupRedirectResolver)||void 0===r?void 0:r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(e){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null===(n=this.currentUser)||void 0===n?void 0:n.uid)||null,this._deleted||(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(this.currentUser||e){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{let t=await H(this,{idToken:e}),r=await ec._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(e){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if((0,i._isFirebaseServerApp)(this.app)){let e=this.app.settings.authIdToken;return e?new Promise(t=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(e).then(t,t))}):this.directlySetCurrentUser(null)}let r=await this.assertedPersistence.getCurrentUser(),n=r,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let r=null===(t=this.redirectUser)||void 0===t?void 0:t._redirectEventId,i=null==n?void 0:n._redirectEventId,a=await this.tryRedirectSignIn(e);(!r||r===i)&&(null==a?void 0:a.user)&&(n=a.user,s=!0)}if(!n)return this.directlySetCurrentUser(null);if(!n._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(n)}catch(e){n=r,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(e))}return n?this.reloadAndSetCurrentUserOrClear(n):this.directlySetCurrentUser(null)}return(_(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===n._redirectEventId)?this.directlySetCurrentUser(n):this.reloadAndSetCurrentUserOrClear(n)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(e){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await en(e)}catch(e){if((null==e?void 0:e.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;let e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if((0,i._isFirebaseServerApp)(this.app))return Promise.reject(w(this));let t=e?(0,s.getModularInstance)(e):null;return t&&_(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&_(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return(0,i._isFirebaseServerApp)(this.app)?Promise.reject(w(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return(0,i._isFirebaseServerApp)(this.app)?Promise.reject(w(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(ed(e))})}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await eR(this),t=new eP(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new s.ErrorFactory("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){let t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};null!=this.tenantId&&(r.tenantId=this.tenantId),await eo(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null===(e=this._currentUser)||void 0===e?void 0:e.toJSON()}}async _setRedirectUser(e,t){let r=await this.getOrInitRedirectPersistenceManager(t);return null===e?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&ed(e)||this._popupRedirectResolver;_(t,this,"argument-error"),this.redirectPersistenceManager=await eg.create(this,[ed(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return(this._isInitialized&&await this.queue(async()=>{}),(null===(t=this._currentUser)||void 0===t?void 0:t._redirectEventId)===e)?this._currentUser:(null===(r=this.redirectUser)||void 0===r?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let r=null!==(t=null===(e=this.currentUser)||void 0===e?void 0:e.uid)&&void 0!==t?t:null;this.lastNotifiedUid!==r&&(this.lastNotifiedUid=r,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,n){if(this._deleted)return()=>{};let i="function"==typeof t?t:t.next.bind(t),s=!1,a=this._isInitialized?Promise.resolve():this._initializationPromise;if(_(a,this,"internal-error"),a.then(()=>{s||i(this.currentUser)}),"function"==typeof t){let i=e.addObserver(t,r,n);return()=>{s=!0,i()}}{let r=e.addObserver(t);return()=>{s=!0,r()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return _(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=ek(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;let t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);let r=await (null===(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getHeartbeatsHeader());r&&(t["X-Firebase-Client"]=r);let n=await this._getAppCheckToken();return n&&(t["X-Firebase-AppCheck"]=n),t}async _getAppCheckToken(){var e;let t=await (null===(e=this.appCheckServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getToken());return(null==t?void 0:t.error)&&function(e,...t){p.logLevel<=l.LogLevel.WARN&&p.warn(`Auth (${i.SDK_VERSION}): ${e}`,...t)}(`Error while retrieving App Check token: ${t.error}`),null==t?void 0:t.token}}function eM(e){return(0,s.getModularInstance)(e)}class eF{constructor(e){this.auth=e,this.observer=null,this.addObserver=(0,s.createSubscribe)(e=>this.observer=e)}get next(){return _(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eU={async loadJS(){throw Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function eV(e){eU=e}function eB(e){return eU.loadJS(e)}function ej(){return eU.recaptchaV2Script}function eq(){return eU.gapiScript}function ez(e){return`__${e}${Math.floor(1e6*Math.random())}`}class eG{constructor(e){this.type="recaptcha-enterprise",this.auth=eM(e)}async verify(e="verify",t=!1){async function r(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,r)=>{G(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(n=>{if(void 0===n.recaptchaKey)r(Error("recaptcha Enterprise site key undefined"));else{let r=new q(n);return null==e.tenantId?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,t(r.siteKey)}}).catch(e=>{r(e)})})}function n(t,r,n){let i=window.grecaptcha;j(i)?i.enterprise.ready(()=>{i.enterprise.execute(t,{action:e}).then(e=>{r(e)}).catch(()=>{r("NO_RECAPTCHA")})}):n(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((e,i)=>{r(this.auth).then(r=>{if(!t&&j(window.grecaptcha))n(r,e,i);else{if("undefined"==typeof window){i(Error("RecaptchaVerifier is only supported in browser"));return}let t=eU.recaptchaEnterpriseScript;0!==t.length&&(t+=r),eB(t).then(()=>{n(r,e,i)}).catch(e=>{i(e)})}}).catch(e=>{i(e)})})}}async function eK(e,t,r,n=!1){let i;let s=new eG(e);try{i=await s.verify(r)}catch(e){i=await s.verify(r,!0)}let a=Object.assign({},t);return n?Object.assign(a,{captchaResp:i}):Object.assign(a,{captchaResponse:i}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function e$(e,t,r,n){var i;if(null===(i=e._getRecaptchaConfig())||void 0===i||!i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER"))return n(e,t).catch(async i=>{if("auth/missing-recaptcha-token"!==i.code)return Promise.reject(i);{console.log(`${r} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);let i=await eK(e,t,r,"getOobCode"===r);return n(e,i)}});{let i=await eK(e,t,r,"getOobCode"===r);return n(e,i)}}async function eH(e){let t=eM(e),r=await G(t,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),n=new q(r);if(null==t.tenantId?t._agentRecaptchaConfig=n:t._tenantRecaptchaConfigs[t.tenantId]=n,n.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){let e=new eG(t);e.verify()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eQ(e,t){let r=(0,i._getProvider)(e,"auth");if(r.isInitialized()){let e=r.getImmediate(),n=r.getOptions();if((0,s.deepEqual)(n,null!=t?t:{}))return e;g(e,"already-initialized")}let n=r.initialize({options:t});return n}function eW(e,t,r){let n=eM(e);_(n._canInitEmulator,n,"emulator-config-failed"),_(/^https?:\/\//.test(t),n,"invalid-emulator-scheme");let i=!!(null==r?void 0:r.disableWarnings),s=eJ(t),{host:a,port:o}=function(e){let t=eJ(e),r=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!r)return{host:"",port:null};let n=r[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(n);if(i){let e=i[1];return{host:e,port:eY(n.substr(e.length+1))}}{let[e,t]=n.split(":");return{host:e,port:eY(t)}}}(t),l=null===o?"":`:${o}`;n.config.emulator={url:`${s}//${a}${l}/`},n.settings.appVerificationDisabledForTesting=!0,n.emulatorConfig=Object.freeze({host:a,port:o,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),i||function(){function e(){let e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&"function"==typeof console.info&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",e):e())}()}function eJ(e){let t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function eY(e){if(!e)return null;let t=Number(e);return isNaN(t)?null:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eX{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return E("not implemented")}_getIdTokenResponse(e){return E("not implemented")}_linkToIdToken(e,t){return E("not implemented")}_getReauthenticationResolver(e){return E("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function eZ(e,t){return P(e,"POST","/v1/accounts:resetPassword",R(e,t))}async function e0(e,t){return P(e,"POST","/v1/accounts:update",t)}async function e1(e,t){return P(e,"POST","/v1/accounts:signUp",t)}async function e2(e,t){return P(e,"POST","/v1/accounts:update",R(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function e4(e,t){return M(e,"POST","/v1/accounts:signInWithPassword",R(e,t))}async function e6(e,t){return P(e,"POST","/v1/accounts:sendOobCode",R(e,t))}async function e9(e,t){return e6(e,t)}async function e5(e,t){return e6(e,t)}async function e3(e,t){return e6(e,t)}async function e8(e,t){return e6(e,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function e7(e,t){return M(e,"POST","/v1/accounts:signInWithEmailLink",R(e,t))}async function te(e,t){return M(e,"POST","/v1/accounts:signInWithEmailLink",R(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt extends eX{constructor(e,t,r,n=null){super("password",r),this._email=e,this._password=t,this._tenantId=n}static _fromEmailAndPassword(e,t){return new tt(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new tt(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t="string"==typeof e?JSON.parse(e):e;if((null==t?void 0:t.email)&&(null==t?void 0:t.password)){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":let t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return e$(e,t,"signInWithPassword",e4);case"emailLink":return e7(e,{email:this._email,oobCode:this._password});default:g(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":let r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return e$(e,r,"signUpPassword",e1);case"emailLink":return te(e,{idToken:t,email:this._email,oobCode:this._password});default:g(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tr(e,t){return M(e,"POST","/v1/accounts:signInWithIdp",R(e,t))}class tn extends eX{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new tn(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):g("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t="string"==typeof e?JSON.parse(e):e,{providerId:r,signInMethod:n}=t,i=(0,a.__rest)(t,["providerId","signInMethod"]);if(!r||!n)return null;let s=new tn(r,n);return s.idToken=i.idToken||void 0,s.accessToken=i.accessToken||void 0,s.secret=i.secret,s.nonce=i.nonce,s.pendingToken=i.pendingToken||null,s}_getIdTokenResponse(e){let t=this.buildRequest();return tr(e,t)}_linkToIdToken(e,t){let r=this.buildRequest();return r.idToken=t,tr(e,r)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,tr(e,t)}buildRequest(){let e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=(0,s.querystring)(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ti(e,t){return P(e,"POST","/v1/accounts:sendVerificationCode",R(e,t))}async function ts(e,t){return M(e,"POST","/v1/accounts:signInWithPhoneNumber",R(e,t))}async function ta(e,t){let r=await M(e,"POST","/v1/accounts:signInWithPhoneNumber",R(e,t));if(r.temporaryProof)throw V(e,"account-exists-with-different-credential",r);return r}let to={USER_NOT_FOUND:"user-not-found"};async function tl(e,t){let r=Object.assign(Object.assign({},t),{operation:"REAUTH"});return M(e,"POST","/v1/accounts:signInWithPhoneNumber",R(e,r),to)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tu extends eX{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new tu({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new tu({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return ts(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return ta(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return tl(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:n}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:n}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){"string"==typeof e&&(e=JSON.parse(e));let{verificationId:t,verificationCode:r,phoneNumber:n,temporaryProof:i}=e;return r||t||n||i?new tu({verificationId:t,verificationCode:r,phoneNumber:n,temporaryProof:i}):null}}class tc{constructor(e){var t,r,n,i,a,o;let l=(0,s.querystringDecode)((0,s.extractQuerystring)(e)),u=null!==(t=l.apiKey)&&void 0!==t?t:null,c=null!==(r=l.oobCode)&&void 0!==r?r:null,h=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}(null!==(n=l.mode)&&void 0!==n?n:null);_(u&&c&&h,"argument-error"),this.apiKey=u,this.operation=h,this.code=c,this.continueUrl=null!==(i=l.continueUrl)&&void 0!==i?i:null,this.languageCode=null!==(a=l.languageCode)&&void 0!==a?a:null,this.tenantId=null!==(o=l.tenantId)&&void 0!==o?o:null}static parseLink(e){let t=function(e){let t=(0,s.querystringDecode)((0,s.extractQuerystring)(e)).link,r=t?(0,s.querystringDecode)((0,s.extractQuerystring)(t)).deep_link_id:null,n=(0,s.querystringDecode)((0,s.extractQuerystring)(e)).deep_link_id,i=n?(0,s.querystringDecode)((0,s.extractQuerystring)(n)).link:null;return i||n||r||t||e}(e);try{return new tc(t)}catch(e){return null}}}function th(e){return tc.parseLink(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class td{constructor(){this.providerId=td.PROVIDER_ID}static credential(e,t){return tt._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let r=tc.parseLink(t);return _(r,"argument-error"),tt._fromEmailAndCode(e,r.code,r.tenantId)}}td.PROVIDER_ID="password",td.EMAIL_PASSWORD_SIGN_IN_METHOD="password",td.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tf{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tp extends tf{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class tm extends tp{static credentialFromJSON(e){let t="string"==typeof e?JSON.parse(e):e;return _("providerId"in t&&"signInMethod"in t,"argument-error"),tn._fromParams(t)}credential(e){return this._credential(Object.assign(Object.assign({},e),{nonce:e.rawNonce}))}_credential(e){return _(e.idToken||e.accessToken,"argument-error"),tn._fromParams(Object.assign(Object.assign({},e),{providerId:this.providerId,signInMethod:this.providerId}))}static credentialFromResult(e){return tm.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return tm.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:r,oauthTokenSecret:n,pendingToken:i,nonce:s,providerId:a}=e;if(!r&&!n&&!t&&!i||!a)return null;try{return new tm(a)._credential({idToken:t,accessToken:r,nonce:s,pendingToken:i})}catch(e){return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tg extends tp{constructor(){super("facebook.com")}static credential(e){return tn._fromParams({providerId:tg.PROVIDER_ID,signInMethod:tg.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return tg.credentialFromTaggedObject(e)}static credentialFromError(e){return tg.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return tg.credential(e.oauthAccessToken)}catch(e){return null}}}tg.FACEBOOK_SIGN_IN_METHOD="facebook.com",tg.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ty extends tp{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return tn._fromParams({providerId:ty.PROVIDER_ID,signInMethod:ty.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return ty.credentialFromTaggedObject(e)}static credentialFromError(e){return ty.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return ty.credential(t,r)}catch(e){return null}}}ty.GOOGLE_SIGN_IN_METHOD="google.com",ty.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tv extends tp{constructor(){super("github.com")}static credential(e){return tn._fromParams({providerId:tv.PROVIDER_ID,signInMethod:tv.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return tv.credentialFromTaggedObject(e)}static credentialFromError(e){return tv.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return tv.credential(e.oauthAccessToken)}catch(e){return null}}}tv.GITHUB_SIGN_IN_METHOD="github.com",tv.PROVIDER_ID="github.com";class tw extends eX{constructor(e,t){super(e,e),this.pendingToken=t}_getIdTokenResponse(e){let t=this.buildRequest();return tr(e,t)}_linkToIdToken(e,t){let r=this.buildRequest();return r.idToken=t,tr(e,r)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,tr(e,t)}toJSON(){return{signInMethod:this.signInMethod,providerId:this.providerId,pendingToken:this.pendingToken}}static fromJSON(e){let t="string"==typeof e?JSON.parse(e):e,{providerId:r,signInMethod:n,pendingToken:i}=t;return r&&n&&i&&r===n?new tw(r,i):null}static _create(e,t){return new tw(e,t)}buildRequest(){return{requestUri:"http://localhost",returnSecureToken:!0,pendingToken:this.pendingToken}}}class tb extends tf{constructor(e){_(e.startsWith("saml."),"argument-error"),super(e)}static credentialFromResult(e){return tb.samlCredentialFromTaggedObject(e)}static credentialFromError(e){return tb.samlCredentialFromTaggedObject(e.customData||{})}static credentialFromJSON(e){let t=tw.fromJSON(e);return _(t,"argument-error"),t}static samlCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{pendingToken:t,providerId:r}=e;if(!t||!r)return null;try{return tw._create(r,t)}catch(e){return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tI extends tp{constructor(){super("twitter.com")}static credential(e,t){return tn._fromParams({providerId:tI.PROVIDER_ID,signInMethod:tI.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return tI.credentialFromTaggedObject(e)}static credentialFromError(e){return tI.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return tI.credential(t,r)}catch(e){return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function t_(e,t){return M(e,"POST","/v1/accounts:signUp",R(e,t))}tI.TWITTER_SIGN_IN_METHOD="twitter.com",tI.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tE{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,n=!1){let i=await ec._fromIdTokenResponse(e,r,n),s=tT(r),a=new tE({user:i,providerId:s,_tokenResponse:r,operationType:t});return a}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);let n=tT(r);return new tE({user:e,providerId:n,_tokenResponse:r,operationType:t})}}function tT(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tS(e){var t;if((0,i._isFirebaseServerApp)(e.app))return Promise.reject(w(e));let r=eM(e);if(await r._initializationPromise,null===(t=r.currentUser)||void 0===t?void 0:t.isAnonymous)return new tE({user:r.currentUser,providerId:null,operationType:"signIn"});let n=await t_(r,{returnSecureToken:!0}),s=await tE._fromIdTokenResponse(r,"signIn",n,!0);return await r._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tx extends s.FirebaseError{constructor(e,t,r,n){var i;super(t.code,t.message),this.operationType=r,this.user=n,Object.setPrototypeOf(this,tx.prototype),this.customData={appName:e.name,tenantId:null!==(i=e.tenantId)&&void 0!==i?i:void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,n){return new tx(e,t,r,n)}}function tA(e,t,r,n){let i="reauthenticate"===t?r._getReauthenticationResolver(e):r._getIdTokenResponse(e);return i.catch(r=>{if("auth/multi-factor-auth-required"===r.code)throw tx._fromErrorAndOperation(e,r,t,n);throw r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tC(e){return new Set(e.map(({providerId:e})=>e).filter(e=>!!e))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tD(e,t){let r=(0,s.getModularInstance)(e);await tk(!0,r,t);let{providerUserInfo:n}=await $(r.auth,{idToken:await r.getIdToken(),deleteProvider:[t]}),i=tC(n||[]);return r.providerData=r.providerData.filter(e=>i.has(e.providerId)),i.has("phone")||(r.phoneNumber=null),await r.auth._persistUserIfCurrent(r),r}async function tN(e,t,r=!1){let n=await ee(e,t._linkToIdToken(e.auth,await e.getIdToken()),r);return tE._forOperation(e,"link",n)}async function tk(e,t,r){await en(t);let n=tC(t.providerData),i=!1===e?"provider-already-linked":"no-such-provider";_(n.has(r)===e,t.auth,i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tO(e,t,r=!1){let{auth:n}=e;if((0,i._isFirebaseServerApp)(n.app))return Promise.reject(w(n));let s="reauthenticate";try{let i=await ee(e,tA(n,s,t,e),r);_(i.idToken,n,"internal-error");let a=X(i.idToken);_(a,n,"internal-error");let{sub:o}=a;return _(e.uid===o,n,"user-mismatch"),tE._forOperation(e,s,i)}catch(e){throw(null==e?void 0:e.code)==="auth/user-not-found"&&g(n,"user-mismatch"),e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tR(e,t,r=!1){if((0,i._isFirebaseServerApp)(e.app))return Promise.reject(w(e));let n="signIn",s=await tA(e,n,t),a=await tE._fromIdTokenResponse(e,n,s);return r||await e._updateCurrentUser(a.user),a}async function tP(e,t){return tR(eM(e),t)}async function tL(e,t){let r=(0,s.getModularInstance)(e);return await tk(!1,r,t.providerId),tN(r,t)}async function tM(e,t){return tO((0,s.getModularInstance)(e),t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tF(e,t){return M(e,"POST","/v1/accounts:signInWithCustomToken",R(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tU(e,t){if((0,i._isFirebaseServerApp)(e.app))return Promise.reject(w(e));let r=eM(e),n=await tF(r,{token:t,returnSecureToken:!0}),s=await tE._fromIdTokenResponse(r,"signIn",n);return await r._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tV{constructor(e,t){this.factorId=e,this.uid=t.mfaEnrollmentId,this.enrollmentTime=new Date(t.enrolledAt).toUTCString(),this.displayName=t.displayName}static _fromServerResponse(e,t){return"phoneInfo"in t?tB._fromServerResponse(e,t):"totpInfo"in t?tj._fromServerResponse(e,t):g(e,"internal-error")}}class tB extends tV{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,t){return new tB(t)}}class tj extends tV{constructor(e){super("totp",e)}static _fromServerResponse(e,t){return new tj(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tq(e,t,r){var n;_((null===(n=r.url)||void 0===n?void 0:n.length)>0,e,"invalid-continue-uri"),_(void 0===r.dynamicLinkDomain||r.dynamicLinkDomain.length>0,e,"invalid-dynamic-link-domain"),t.continueUrl=r.url,t.dynamicLinkDomain=r.dynamicLinkDomain,t.canHandleCodeInApp=r.handleCodeInApp,r.iOS&&(_(r.iOS.bundleId.length>0,e,"missing-ios-bundle-id"),t.iOSBundleId=r.iOS.bundleId),r.android&&(_(r.android.packageName.length>0,e,"missing-android-pkg-name"),t.androidInstallApp=r.android.installApp,t.androidMinimumVersionCode=r.android.minimumVersion,t.androidPackageName=r.android.packageName)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tz(e){let t=eM(e);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function tG(e,t,r){let n=eM(e),i={requestType:"PASSWORD_RESET",email:t,clientType:"CLIENT_TYPE_WEB"};r&&tq(n,i,r),await e$(n,i,"getOobCode",e5)}async function tK(e,t,r){await eZ((0,s.getModularInstance)(e),{oobCode:t,newPassword:r}).catch(async t=>{throw"auth/password-does-not-meet-requirements"===t.code&&tz(e),t})}async function t$(e,t){await e2((0,s.getModularInstance)(e),{oobCode:t})}async function tH(e,t){let r=(0,s.getModularInstance)(e),n=await eZ(r,{oobCode:t}),i=n.requestType;switch(_(i,r,"internal-error"),i){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":_(n.newEmail,r,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":_(n.mfaInfo,r,"internal-error");default:_(n.email,r,"internal-error")}let a=null;return n.mfaInfo&&(a=tV._fromServerResponse(eM(r),n.mfaInfo)),{data:{email:("VERIFY_AND_CHANGE_EMAIL"===n.requestType?n.newEmail:n.email)||null,previousEmail:("VERIFY_AND_CHANGE_EMAIL"===n.requestType?n.email:n.newEmail)||null,multiFactorInfo:a},operation:i}}async function tQ(e,t){let{data:r}=await tH((0,s.getModularInstance)(e),t);return r.email}async function tW(e,t,r){if((0,i._isFirebaseServerApp)(e.app))return Promise.reject(w(e));let n=eM(e),s=e$(n,{returnSecureToken:!0,email:t,password:r,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",t_),a=await s.catch(t=>{throw"auth/password-does-not-meet-requirements"===t.code&&tz(e),t}),o=await tE._fromIdTokenResponse(n,"signIn",a);return await n._updateCurrentUser(o.user),o}function tJ(e,t,r){return(0,i._isFirebaseServerApp)(e.app)?Promise.reject(w(e)):tP((0,s.getModularInstance)(e),td.credential(t,r)).catch(async t=>{throw"auth/password-does-not-meet-requirements"===t.code&&tz(e),t})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tY(e,t,r){let n=eM(e),i={requestType:"EMAIL_SIGNIN",email:t,clientType:"CLIENT_TYPE_WEB"};_(r.handleCodeInApp,n,"argument-error"),r&&tq(n,i,r),await e$(n,i,"getOobCode",e3)}function tX(e,t){let r=tc.parseLink(t);return(null==r?void 0:r.operation)==="EMAIL_SIGNIN"}async function tZ(e,t,r){if((0,i._isFirebaseServerApp)(e.app))return Promise.reject(w(e));let n=(0,s.getModularInstance)(e),a=td.credentialWithLink(t,r||S());return _(a._tenantId===(n.tenantId||null),n,"tenant-id-mismatch"),tP(n,a)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function t0(e,t){return P(e,"POST","/v1/accounts:createAuthUri",R(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function t1(e,t){let r=x()?S():"http://localhost",{signinMethods:n}=await t0((0,s.getModularInstance)(e),{identifier:t,continueUri:r});return n||[]}async function t2(e,t){let r=(0,s.getModularInstance)(e),n=await e.getIdToken(),i={requestType:"VERIFY_EMAIL",idToken:n};t&&tq(r.auth,i,t);let{email:a}=await e9(r.auth,i);a!==e.email&&await e.reload()}async function t4(e,t,r){let n=(0,s.getModularInstance)(e),i=await e.getIdToken(),a={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:i,newEmail:t};r&&tq(n.auth,a,r);let{email:o}=await e8(n.auth,a);o!==e.email&&await e.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function t6(e,t){return P(e,"POST","/v1/accounts:update",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function t9(e,{displayName:t,photoURL:r}){if(void 0===t&&void 0===r)return;let n=(0,s.getModularInstance)(e),i=await n.getIdToken(),a=await ee(n,t6(n.auth,{idToken:i,displayName:t,photoUrl:r,returnSecureToken:!0}));n.displayName=a.displayName||null,n.photoURL=a.photoUrl||null;let o=n.providerData.find(({providerId:e})=>"password"===e);o&&(o.displayName=n.displayName,o.photoURL=n.photoURL),await n._updateTokensIfNecessary(a)}function t5(e,t){let r=(0,s.getModularInstance)(e);return(0,i._isFirebaseServerApp)(r.auth.app)?Promise.reject(w(r.auth)):t8(r,t,null)}function t3(e,t){return t8((0,s.getModularInstance)(e),null,t)}async function t8(e,t,r){let{auth:n}=e,i=await e.getIdToken(),s={idToken:i,returnSecureToken:!0};t&&(s.email=t),r&&(s.password=r);let a=await ee(e,e0(n,s));await e._updateTokensIfNecessary(a,!0)}class t7{constructor(e,t,r={}){this.isNewUser=e,this.providerId=t,this.profile=r}}class re extends t7{constructor(e,t,r,n){super(e,t,r),this.username=n}}class rt extends t7{constructor(e,t){super(e,"facebook.com",t)}}class rr extends re{constructor(e,t){super(e,"github.com",t,"string"==typeof(null==t?void 0:t.login)?null==t?void 0:t.login:null)}}class rn extends t7{constructor(e,t){super(e,"google.com",t)}}class ri extends re{constructor(e,t,r){super(e,"twitter.com",t,r)}}function rs(e){let{user:t,_tokenResponse:r}=e;return t.isAnonymous&&!r?{providerId:null,isNewUser:!1,profile:null}:/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){var t,r;if(!e)return null;let{providerId:n}=e,i=e.rawUserInfo?JSON.parse(e.rawUserInfo):{},s=e.isNewUser||"identitytoolkit#SignupNewUserResponse"===e.kind;if(!n&&(null==e?void 0:e.idToken)){let n=null===(r=null===(t=X(e.idToken))||void 0===t?void 0:t.firebase)||void 0===r?void 0:r.sign_in_provider;if(n){let e="anonymous"!==n&&"custom"!==n?n:null;return new t7(s,e)}}if(!n)return null;switch(n){case"facebook.com":return new rt(s,i);case"github.com":return new rr(s,i);case"google.com":return new rn(s,i);case"twitter.com":return new ri(s,i,e.screenName||null);case"custom":case"anonymous":return new t7(s,null);default:return new t7(s,n,i)}}(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ra(e,t){return(0,s.getModularInstance)(e).setPersistence(t)}function ro(e){return eH(e)}async function rl(e,t){let r=eM(e);return r.validatePassword(t)}function ru(e,t,r,n){return(0,s.getModularInstance)(e).onIdTokenChanged(t,r,n)}function rc(e,t,r){return(0,s.getModularInstance)(e).beforeAuthStateChanged(t,r)}function rh(e,t,r,n){return(0,s.getModularInstance)(e).onAuthStateChanged(t,r,n)}function rd(e){(0,s.getModularInstance)(e).useDeviceLanguage()}function rf(e,t){return(0,s.getModularInstance)(e).updateCurrentUser(t)}function rp(e){return(0,s.getModularInstance)(e).signOut()}function rm(e,t){let r=eM(e);return r.revokeAccessToken(t)}async function rg(e){return(0,s.getModularInstance)(e).delete()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ry{constructor(e,t,r){this.type=e,this.credential=t,this.user=r}static _fromIdtoken(e,t){return new ry("enroll",e,t)}static _fromMfaPendingCredential(e){return new ry("signin",e)}toJSON(){let e="enroll"===this.type?"idToken":"pendingCredential";return{multiFactorSession:{[e]:this.credential}}}static fromJSON(e){var t,r;if(null==e?void 0:e.multiFactorSession){if(null===(t=e.multiFactorSession)||void 0===t?void 0:t.pendingCredential)return ry._fromMfaPendingCredential(e.multiFactorSession.pendingCredential);if(null===(r=e.multiFactorSession)||void 0===r?void 0:r.idToken)return ry._fromIdtoken(e.multiFactorSession.idToken)}return null}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rv{constructor(e,t,r){this.session=e,this.hints=t,this.signInResolver=r}static _fromError(e,t){let r=eM(e),n=t.customData._serverResponse,i=(n.mfaInfo||[]).map(e=>tV._fromServerResponse(r,e));_(n.mfaPendingCredential,r,"internal-error");let s=ry._fromMfaPendingCredential(n.mfaPendingCredential);return new rv(s,i,async e=>{let i=await e._process(r,s);delete n.mfaInfo,delete n.mfaPendingCredential;let a=Object.assign(Object.assign({},n),{idToken:i.idToken,refreshToken:i.refreshToken});switch(t.operationType){case"signIn":let o=await tE._fromIdTokenResponse(r,t.operationType,a);return await r._updateCurrentUser(o.user),o;case"reauthenticate":return _(t.user,r,"internal-error"),tE._forOperation(t.user,t.operationType,a);default:g(r,"internal-error")}})}async resolveSignIn(e){return this.signInResolver(e)}}function rw(e,t){var r;let n=(0,s.getModularInstance)(e);return _(t.customData.operationType,n,"argument-error"),_(null===(r=t.customData._serverResponse)||void 0===r?void 0:r.mfaPendingCredential,n,"argument-error"),rv._fromError(n,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rb(e,t){return P(e,"POST","/v2/accounts/mfaEnrollment:start",R(e,t))}function rI(e,t){return P(e,"POST","/v2/accounts/mfaEnrollment:finalize",R(e,t))}class r_{constructor(e){this.user=e,this.enrolledFactors=[],e._onReload(t=>{t.mfaInfo&&(this.enrolledFactors=t.mfaInfo.map(t=>tV._fromServerResponse(e.auth,t)))})}static _fromUser(e){return new r_(e)}async getSession(){return ry._fromIdtoken(await this.user.getIdToken(),this.user)}async enroll(e,t){let r=await this.getSession(),n=await ee(this.user,e._process(this.user.auth,r,t));return await this.user._updateTokensIfNecessary(n),this.user.reload()}async unenroll(e){let t="string"==typeof e?e:e.uid,r=await this.user.getIdToken();try{var n;let e=await ee(this.user,(n=this.user.auth,P(n,"POST","/v2/accounts/mfaEnrollment:withdraw",R(n,{idToken:r,mfaEnrollmentId:t}))));this.enrolledFactors=this.enrolledFactors.filter(({uid:e})=>e!==t),await this.user._updateTokensIfNecessary(e),await this.user.reload()}catch(e){throw e}}}let rE=new WeakMap;function rT(e){let t=(0,s.getModularInstance)(e);return rE.has(t)||rE.set(t,r_._fromUser(t)),rE.get(t)}let rS="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rx{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;let r=new rx(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let{eventId:t,eventType:r,data:n}=e.data,i=this.handlersMap[r];if(!(null==i?void 0:i.size))return;e.ports[0].postMessage({status:"ack",eventId:t,eventType:r});let s=Array.from(i).map(async t=>t(e.origin,n)),a=await Promise.all(s.map(async e=>{try{let t=await e;return{fulfilled:!0,value:t}}catch(e){return{fulfilled:!1,reason:e}}}));e.ports[0].postMessage({status:"done",eventId:t,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rA(e="",t=10){let r="";for(let e=0;e<t;e++)r+=Math.floor(10*Math.random());return e+r}rx.receivers=[];/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rC{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){let n,i;let s="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!s)throw Error("connection_unavailable");return new Promise((a,o)=>{let l=rA("",20);s.port1.start();let u=setTimeout(()=>{o(Error("unsupported_event"))},r);i={messageChannel:s,onMessage(e){if(e.data.eventId===l)switch(e.data.status){case"ack":clearTimeout(u),n=setTimeout(()=>{o(Error("timeout"))},3e3);break;case"done":clearTimeout(n),a(e.data.response);break;default:clearTimeout(u),clearTimeout(n),o(Error("invalid_response"))}}},this.handlers.add(i),s.port1.addEventListener("message",i.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[s.port2])}).finally(()=>{i&&this.removeMessageHandler(i)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rD(){return window}function rN(e){rD().location.href=e}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rk(){return void 0!==rD().WorkerGlobalScope&&"function"==typeof rD().importScripts}async function rO(){if(!(null==navigator?void 0:navigator.serviceWorker))return null;try{let e=await navigator.serviceWorker.ready;return e.active}catch(e){return null}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rR="firebaseLocalStorageDb",rP="firebaseLocalStorage",rL="fbase_key";class rM{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function rF(e,t){return e.transaction([rP],t?"readwrite":"readonly").objectStore(rP)}function rU(){let e=indexedDB.open(rR,1);return new Promise((t,r)=>{e.addEventListener("error",()=>{r(e.error)}),e.addEventListener("upgradeneeded",()=>{let t=e.result;try{t.createObjectStore(rP,{keyPath:rL})}catch(e){r(e)}}),e.addEventListener("success",async()=>{let r=e.result;r.objectStoreNames.contains(rP)?t(r):(r.close(),await function(){let e=indexedDB.deleteDatabase(rR);return new rM(e).toPromise()}(),t(await rU()))})})}async function rV(e,t,r){let n=rF(e,!0).put({[rL]:t,value:r});return new rM(n).toPromise()}async function rB(e,t){let r=rF(e,!1).get(t),n=await new rM(r).toPromise();return void 0===n?null:n.value}function rj(e,t){let r=rF(e,!0).delete(t);return new rM(r).toPromise()}class rq{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db||(this.db=await rU()),this.db}async _withRetries(e){let t=0;for(;;)try{let t=await this._openDb();return await e(t)}catch(e){if(t++>3)throw e;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return rk()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=rx._getInstance(rk()?self:null),this.receiver._subscribe("keyChanged",async(e,t)=>{let r=await this._poll();return{keyProcessed:r.includes(t.key)}}),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await rO(),!this.activeServiceWorker)return;this.sender=new rC(this.activeServiceWorker);let r=await this.sender._send("ping",{},800);r&&(null===(e=r[0])||void 0===e?void 0:e.fulfilled)&&(null===(t=r[0])||void 0===t?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){var t;if(this.sender&&this.activeServiceWorker&&((null===(t=null==navigator?void 0:navigator.serviceWorker)||void 0===t?void 0:t.controller)||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(e){}}async _isAvailable(){try{if(!indexedDB)return!1;let e=await rU();return await rV(e,rS,"1"),await rj(e,rS),!0}catch(e){}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>rV(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(t=>rB(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>rj(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){let e=await this._withRetries(e=>{let t=rF(e,!1).getAll();return new rM(t).toPromise()});if(!e||0!==this.pendingWrites)return[];let t=[],r=new Set;if(0!==e.length)for(let{fbase_key:n,value:i}of e)r.add(n),JSON.stringify(this.localCache[n])!==JSON.stringify(i)&&(this.notifyListeners(n,i),t.push(n));for(let e of Object.keys(this.localCache))this.localCache[e]&&!r.has(e)&&(this.notifyListeners(e,null),t.push(e));return t}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let e of Array.from(r))e(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}}rq.type="LOCAL";let rz=rq;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rG(e,t){return P(e,"POST","/v2/accounts/mfaSignIn:start",R(e,t))}function rK(e,t){return P(e,"POST","/v2/accounts/mfaSignIn:finalize",R(e,t))}class r${constructor(e){this.factorId=e}_process(e,t,r){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,r);case"signin":return this._finalizeSignIn(e,t.credential);default:return E("unexpected MultiFactorSessionType")}}}class rH{static assertionForEnrollment(e,t){return rQ._fromSecret(e,t)}static assertionForSignIn(e,t){return rQ._fromEnrollmentId(e,t)}static async generateSecret(e){var t,r;_(void 0!==(null===(t=e.user)||void 0===t?void 0:t.auth),"internal-error");let n=await P(r=e.user.auth,"POST","/v2/accounts/mfaEnrollment:start",R(r,{idToken:e.credential,totpEnrollmentInfo:{}}));return rW._fromStartTotpMfaEnrollmentResponse(n,e.user.auth)}}rH.FACTOR_ID="totp";class rQ extends r${constructor(e,t,r){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=r}static _fromSecret(e,t){return new rQ(t,void 0,e)}static _fromEnrollmentId(e,t){return new rQ(t,e)}async _finalizeEnroll(e,t,r){return _(void 0!==this.secret,e,"argument-error"),P(e,"POST","/v2/accounts/mfaEnrollment:finalize",R(e,{idToken:t,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)}))}async _finalizeSignIn(e,t){_(void 0!==this.enrollmentId&&void 0!==this.otp,e,"argument-error");let r={verificationCode:this.otp};return P(e,"POST","/v2/accounts/mfaSignIn:finalize",R(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r}))}}class rW{constructor(e,t,r,n,i,s,a){this.sessionInfo=s,this.auth=a,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=r,this.codeIntervalSeconds=n,this.enrollmentCompletionDeadline=i}static _fromStartTotpMfaEnrollmentResponse(e,t){return new rW(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var r;let n=!1;return(rJ(e)||rJ(t))&&(n=!0),n&&(rJ(e)&&(e=(null===(r=this.auth.currentUser)||void 0===r?void 0:r.email)||"unknownuser"),rJ(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}}function rJ(e){return void 0===e||(null==e?void 0:e.length)===0}var rY="@firebase/auth",rX="1.7.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rZ{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null===(e=this.auth.currentUser)||void 0===e?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;let t=await this.auth.currentUser.getIdToken(e);return{accessToken:t}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(t=>{e((null==t?void 0:t.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){_(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}function r0(e){(0,i._registerComponent)(new(0,o.Component)("auth",(t,{options:r})=>{let n=t.getProvider("app").getImmediate(),i=t.getProvider("heartbeat"),s=t.getProvider("app-check-internal"),{apiKey:a,authDomain:o}=n.options;_(a&&!a.includes(":"),"invalid-api-key",{appName:n.name});let l={apiKey:a,authDomain:o,clientPlatform:e,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:ek(e)},u=new eL(n,i,s,l);return function(e,t){let r=(null==t?void 0:t.persistence)||[],n=(Array.isArray(r)?r:[r]).map(ed);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(n,null==t?void 0:t.popupRedirectResolver)}(u,r),u},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{let n=e.getProvider("auth-internal");n.initialize()})),(0,i._registerComponent)(new(0,o.Component)("auth-internal",e=>{let t=eM(e.getProvider("auth").getImmediate());return new rZ(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),(0,i.registerVersion)(rY,rX,/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}(e)),(0,i.registerVersion)(rY,rX,"esm2017")}},{"@firebase/app":"d239L","@firebase/util":"aD5S7",tslib:"e3YiB","@firebase/component":"8ml9B","@firebase/logger":"aO433","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],e3YiB:[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"__extends",()=>s),n.export(r,"__assign",()=>a),n.export(r,"__rest",()=>o),n.export(r,"__decorate",()=>l),n.export(r,"__param",()=>u),n.export(r,"__esDecorate",()=>c),n.export(r,"__runInitializers",()=>h),n.export(r,"__propKey",()=>d),n.export(r,"__setFunctionName",()=>f),n.export(r,"__metadata",()=>p),n.export(r,"__awaiter",()=>m),n.export(r,"__generator",()=>g),n.export(r,"__createBinding",()=>y),n.export(r,"__exportStar",()=>v),n.export(r,"__values",()=>w),n.export(r,"__read",()=>b),n.export(r,"__spread",()=>I),n.export(r,"__spreadArrays",()=>_),n.export(r,"__spreadArray",()=>E),n.export(r,"__await",()=>T),n.export(r,"__asyncGenerator",()=>S),n.export(r,"__asyncDelegator",()=>x),n.export(r,"__asyncValues",()=>A),n.export(r,"__makeTemplateObject",()=>C),n.export(r,"__importStar",()=>N),n.export(r,"__importDefault",()=>k),n.export(r,"__classPrivateFieldGet",()=>O),n.export(r,"__classPrivateFieldSet",()=>R),n.export(r,"__classPrivateFieldIn",()=>P),n.export(r,"__addDisposableResource",()=>L),n.export(r,"__disposeResources",()=>F);var i=function(e,t){return(i=Object.setPrototypeOf||({__proto__:[]})instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)};function s(e,t){if("function"!=typeof t&&null!==t)throw TypeError("Class extends value "+String(t)+" is not a constructor or null");function r(){this.constructor=e}i(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}var a=function(){return(a=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var i in t=arguments[r])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}).apply(this,arguments)};function o(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var i=0,n=Object.getOwnPropertySymbols(e);i<n.length;i++)0>t.indexOf(n[i])&&Object.prototype.propertyIsEnumerable.call(e,n[i])&&(r[n[i]]=e[n[i]]);return r}function l(e,t,r,n){var i,s=arguments.length,a=s<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,r):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(e,t,r,n);else for(var o=e.length-1;o>=0;o--)(i=e[o])&&(a=(s<3?i(a):s>3?i(t,r,a):i(t,r))||a);return s>3&&a&&Object.defineProperty(t,r,a),a}function u(e,t){return function(r,n){t(r,n,e)}}function c(e,t,r,n,i,s){function a(e){if(void 0!==e&&"function"!=typeof e)throw TypeError("Function expected");return e}for(var o,l=n.kind,u="getter"===l?"get":"setter"===l?"set":"value",c=!t&&e?n.static?e:e.prototype:null,h=t||(c?Object.getOwnPropertyDescriptor(c,n.name):{}),d=!1,f=r.length-1;f>=0;f--){var p={};for(var m in n)p[m]="access"===m?{}:n[m];for(var m in n.access)p.access[m]=n.access[m];p.addInitializer=function(e){if(d)throw TypeError("Cannot add initializers after decoration has completed");s.push(a(e||null))};var g=(0,r[f])("accessor"===l?{get:h.get,set:h.set}:h[u],p);if("accessor"===l){if(void 0===g)continue;if(null===g||"object"!=typeof g)throw TypeError("Object expected");(o=a(g.get))&&(h.get=o),(o=a(g.set))&&(h.set=o),(o=a(g.init))&&i.unshift(o)}else(o=a(g))&&("field"===l?i.unshift(o):h[u]=o)}c&&Object.defineProperty(c,n.name,h),d=!0}function h(e,t,r){for(var n=arguments.length>2,i=0;i<t.length;i++)r=n?t[i].call(e,r):t[i].call(e);return n?r:void 0}function d(e){return"symbol"==typeof e?e:"".concat(e)}function f(e,t,r){return"symbol"==typeof t&&(t=t.description?"[".concat(t.description,"]"):""),Object.defineProperty(e,"name",{configurable:!0,value:r?"".concat(r," ",t):t})}function p(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}function m(e,t,r,n){return new(r||(r=Promise))(function(i,s){function a(e){try{l(n.next(e))}catch(e){s(e)}}function o(e){try{l(n.throw(e))}catch(e){s(e)}}function l(e){var t;e.done?i(e.value):((t=e.value)instanceof r?t:new r(function(e){e(t)})).then(a,o)}l((n=n.apply(e,t||[])).next())})}function g(e,t){var r,n,i,s,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return s={next:o(0),throw:o(1),return:o(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function o(o){return function(l){return function(o){if(r)throw TypeError("Generator is already executing.");for(;s&&(s=0,o[0]&&(a=0)),a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=(i=a.trys).length>0&&i[i.length-1])&&(6===o[0]||2===o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a)}catch(e){o=[6,e],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,l])}}}var y=Object.create?function(e,t,r,n){void 0===n&&(n=r);var i=Object.getOwnPropertyDescriptor(t,r);(!i||("get"in i?!t.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,i)}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]};function v(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||y(t,e,r)}function w(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function b(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var n,i,s=r.call(e),a=[];try{for(;(void 0===t||t-- >0)&&!(n=s.next()).done;)a.push(n.value)}catch(e){i={error:e}}finally{try{n&&!n.done&&(r=s.return)&&r.call(s)}finally{if(i)throw i.error}}return a}function I(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(b(arguments[t]));return e}function _(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;for(var n=Array(e),i=0,t=0;t<r;t++)for(var s=arguments[t],a=0,o=s.length;a<o;a++,i++)n[i]=s[a];return n}function E(e,t,r){if(r||2==arguments.length)for(var n,i=0,s=t.length;i<s;i++)!n&&i in t||(n||(n=Array.prototype.slice.call(t,0,i)),n[i]=t[i]);return e.concat(n||Array.prototype.slice.call(t))}function T(e){return this instanceof T?(this.v=e,this):new T(e)}function S(e,t,r){if(!Symbol.asyncIterator)throw TypeError("Symbol.asyncIterator is not defined.");var n,i=r.apply(e,t||[]),s=[];return n={},a("next"),a("throw"),a("return",function(e){return function(t){return Promise.resolve(t).then(e,u)}}),n[Symbol.asyncIterator]=function(){return this},n;function a(e,t){i[e]&&(n[e]=function(t){return new Promise(function(r,n){s.push([e,t,r,n])>1||o(e,t)})},t&&(n[e]=t(n[e])))}function o(e,t){try{var r;(r=i[e](t)).value instanceof T?Promise.resolve(r.value.v).then(l,u):c(s[0][2],r)}catch(e){c(s[0][3],e)}}function l(e){o("next",e)}function u(e){o("throw",e)}function c(e,t){e(t),s.shift(),s.length&&o(s[0][0],s[0][1])}}function x(e){var t,r;return t={},n("next"),n("throw",function(e){throw e}),n("return"),t[Symbol.iterator]=function(){return this},t;function n(n,i){t[n]=e[n]?function(t){return(r=!r)?{value:T(e[n](t)),done:!1}:i?i(t):t}:i}}function A(e){if(!Symbol.asyncIterator)throw TypeError("Symbol.asyncIterator is not defined.");var t,r=e[Symbol.asyncIterator];return r?r.call(e):(e=w(e),t={},n("next"),n("throw"),n("return"),t[Symbol.asyncIterator]=function(){return this},t);function n(r){t[r]=e[r]&&function(t){return new Promise(function(n,i){(function(e,t,r,n){Promise.resolve(n).then(function(t){e({value:t,done:r})},t)})(n,i,(t=e[r](t)).done,t.value)})}}}function C(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}var D=Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t};function N(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&y(t,e,r);return D(t,e),t}function k(e){return e&&e.__esModule?e:{default:e}}function O(e,t,r,n){if("a"===r&&!n)throw TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!n:!t.has(e))throw TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?n:"a"===r?n.call(e):n?n.value:t.get(e)}function R(e,t,r,n,i){if("m"===n)throw TypeError("Private method is not writable");if("a"===n&&!i)throw TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!i:!t.has(e))throw TypeError("Cannot write private member to an object whose class did not declare it");return"a"===n?i.call(e,r):i?i.value=r:t.set(e,r),r}function P(e,t){if(null===t||"object"!=typeof t&&"function"!=typeof t)throw TypeError("Cannot use 'in' operator on non-object");return"function"==typeof e?t===e:e.has(t)}function L(e,t,r){if(null!=t){var n,i;if("object"!=typeof t&&"function"!=typeof t)throw TypeError("Object expected.");if(r){if(!Symbol.asyncDispose)throw TypeError("Symbol.asyncDispose is not defined.");n=t[Symbol.asyncDispose]}if(void 0===n){if(!Symbol.dispose)throw TypeError("Symbol.dispose is not defined.");n=t[Symbol.dispose],r&&(i=n)}if("function"!=typeof n)throw TypeError("Object not disposable.");i&&(n=function(){try{i.call(this)}catch(e){return Promise.reject(e)}}),e.stack.push({value:t,dispose:n,async:r})}else r&&e.stack.push({async:!0});return t}var M="function"==typeof SuppressedError?SuppressedError:function(e,t,r){var n=Error(r);return n.name="SuppressedError",n.error=e,n.suppressed=t,n};function F(e){function t(t){e.error=e.hasError?new M(t,e.error,"An error was suppressed during disposal."):t,e.hasError=!0}return function r(){for(;e.stack.length;){var n=e.stack.pop();try{var i=n.dispose&&n.dispose.call(n.value);if(n.async)return Promise.resolve(i).then(r,function(e){return t(e),r()})}catch(e){t(e)}}if(e.hasError)throw e.error}()}r.default={__extends:s,__assign:a,__rest:o,__decorate:l,__param:u,__metadata:p,__awaiter:m,__generator:g,__createBinding:y,__exportStar:v,__values:w,__read:b,__spread:I,__spreadArrays:_,__spreadArray:E,__await:T,__asyncGenerator:S,__asyncDelegator:x,__asyncValues:A,__makeTemplateObject:C,__importStar:N,__importDefault:k,__classPrivateFieldGet:O,__classPrivateFieldSet:R,__classPrivateFieldIn:P,__addDisposableResource:L,__disposeResources:F}},{"@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],bbD2v:[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"getGoogleAuthData",()=>s),n.export(r,"loginToGoogle",()=>a),n.export(r,"getDateTimeKey",()=>o);var i=e("~background/firebase");async function s({code:e,refresh_token:t}){try{let r={client_id:"1031786013885-4lv2in7sli17366m2j387sd4a4do6oh0.apps.googleusercontent.com",client_secret:"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",redirect_uri:"https://fpoooibdndpjcnoodfionoeakeojdjaj.chromiumapp.org",...t?{grant_type:"refresh_token",refresh_token:t}:{grant_type:"authorization_code",code:e}};return(await fetch("https://oauth2.googleapis.com/token",{method:"POST",body:JSON.stringify(r)})).json()}catch(e){throw console.error("Error getting access token",e),e}}async function a(){var e;let{code:t}=(e=await chrome.identity.launchWebAuthFlow({interactive:!0,url:`https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({redirect_uri:"https://fpoooibdndpjcnoodfionoeakeojdjaj.chromiumapp.org",client_id:"1031786013885-4lv2in7sli17366m2j387sd4a4do6oh0.apps.googleusercontent.com",access_type:"offline",response_type:"code",prompt:"consent",scope:"https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read"})}`}),Object.fromEntries(new URL(e).searchParams.entries())),r=await s({code:t}),[n,a]=await Promise.all([fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${r.access_token}`}}),fetch(`https://people.googleapis.com/v1/people/me?${new URLSearchParams({personFields:"birthdays,genders"})}`,{headers:{Authorization:`Bearer ${r.access_token}`}})]),[o,l]=await Promise.all([n.json(),a.json()]);return{authData:r,authFirebase:await (0,i.getCredentialsForFirebase)({user:o,authData:r,info:l}),user:o,info:l}}function o(e){let[t,r,n]=[e.getFullYear(),e.getMonth()+1,e.getDate()].map(e=>e.toString().padStart(2,"0")),i=`${t}-${r}-${n}`,s=e.getHours().toString().padStart(2,"0");return`${i}T${s}:00:00`}},{"~background/firebase":"8B3mQ","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],itQEy:[function(e,t,r){var n,i,s=e("@parcel/transformer-js/src/esmodule-helpers.js");s.defineInteropFlag(r),s.export(r,"OBSERVER_OPTIONS",()=>u),s.export(r,"REGEX",()=>c),s.export(r,"SELECTORS",()=>i),s.export(r,"getVisibleElement",()=>h),s.export(r,"getElementByMutationObserver",()=>d),s.export(r,"addGlobalEventListener",()=>f),s.export(r,"getVideoAndChannel",()=>g),s.export(r,"getChannelPicture",()=>y),s.export(r,"getComparableDateString",()=>v),s.export(r,"getLocale",()=>w),s.export(r,"secondsToTimeColon",()=>b),s.export(r,"secondsToTimeText",()=>I),s.export(r,"getMaxWatchTimeForDate",()=>_),s.export(r,"getNonEmptyHiddenChannels",()=>E),s.export(r,"browserName",()=>T);var a=e("pretty-ms"),o=s.interopDefault(a),l=e("yt-scraping-utilities");let u=Object.freeze({childList:!0,subtree:!0}),c={videoData:/ytInitialPlayerResponse\s*=\s*({.+?})\s*;/,initialData:/ytInitialData\s*=\s*({.+?})\s*;/,playerData:/set\(({.+?})\);/,channelPicture:/https:\/\/yt\d+\.googleusercontent\.com[^"]+/};function h(e){let t=[...document.querySelectorAll(e)];return t.find(location.pathname.startsWith("/shorts")?m:p)}async function d(e,t=!0){return new Promise(r=>{new MutationObserver((n,i)=>{let s=t?h(e):document.querySelector(e);s&&(i.disconnect(),r(s))}).observe(document,u)})}async function f(e){let t=document.documentElement.querySelector(i.title)||await d(i.title,!1);new MutationObserver(e).observe(t,u)}function p(e){return e?.offsetWidth>0&&e?.offsetHeight>0}function m(e){let t=e.getBoundingClientRect();return t.top>=0&&t.left>=0&&t.bottom<=innerHeight&&t.right<=innerWidth}async function g(e=location.href){let t=new URL(e),r=await (await fetch(t.href)).text(),n=t.pathname.match(/^(?:\/watch|\/shorts)/);if(n){let{ytInitialPlayerResponse:{videoDetails:{videoId:e,channelId:t},microformat:{playerMicroformatRenderer:{ownerProfileUrl:n,category:i}}}}=(0,l.parseRawData)({source:r,ytInitialPlayerResponse:!0});return{videoId:e,channelHandle:n.match(/@.+/)[0],channelId:t,category:i}}let s=t.pathname.startsWith("/@");if(s){let e=h(i.linkVideo),t=new URLSearchParams(e.search).get("v"),{ytInitialData:{metadata:{channelMetadataRenderer:{vanityChannelUrl:n,externalId:s}}}}=(0,l.parseRawData)({source:r,ytInitialData:!0});return{videoId:t,channelHandle:n.match(/@.+/)[0],channelId:s}}console.error("[YouTube Time Manager] Unsupported URL:",e)}async function y(e){let t=e.startsWith("@")?e:`channel/${e}`,r=await (await fetch(`https://www.youtube.com/${t}`)).text(),n=r.match(c.channelPicture);try{return n[0].replace(/=s\d+/,"=s72")}catch(t){throw console.log(`Couldn't get channel picture for ${e} data:
`,n),Error(e)}}function v(e){return new Date(e.getFullYear(),e.getMonth(),e.getDate())}async function w(e=location.href){let t=await (await fetch(e)).text(),r=t.match(c.playerData),{HL:n,GL:i}=JSON.parse(r[1]);return`${n}-${i}`.match(/[^-]+-[^-]+/)[0]}function b(e){return(0,o.default)(1e3*Math.floor(e),{colonNotation:!0})}function I(e){return 0===e?"0s":(0,o.default)(1e3*Math.floor(e))}function _(e){let t={};for(let r in e){let n=e[r],i=n.timestamp;(!t[i]||t[i]<n.secondsSpent)&&(t[i]=n.secondsSpent)}return Object.values(t).reduce((e,t)=>e+t,0)}function E(e=[]){return e.filter(e=>!!e.trim())}(n=i||(i={})).dashboardTriggerContainer="#buttons.ytd-masthead",n.title="title",n.video=".html5-video-player:not(#inline-preview-player) video[style]",n.player=".html5-video-player:not(#inline-preview-player)",n.adParent=".ytp-ad-module",n.adOverlay=".ytp-ad-player-overlay-layout",n.linkVideo="a[href*='/watch']",n.dashboardContainer="#yttm-dashboard-trigger-wrapper-plasmo",n.popoverDashboard=".popover-dashboard",n.popoverMatchmaking=".popover-matchmaking",n.popoverAccountLogin=".popover-account-login",n.popoverDashboardPromotion=".popover-dashboard-promotion";let T=(()=>{let e=chrome.runtime.getURL(""),t=e.startsWith("moz-extension://");if(t)return"firefox";let{userAgent:r}=navigator,n=r.includes("OPR");if(n)return"opera";let i=r.includes("Edg");return i?"edge":"chrome"})()},{"pretty-ms":"6JRue","yt-scraping-utilities":"g0JWt","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],"6JRue":[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"default",()=>u);var i=e("parse-ms"),s=n.interopDefault(i);let a=e=>0===e||0n===e,o=(e,t)=>1===t||1n===t?e:`${e}s`,l=24n*60n*60n*1000n;function u(e,t){let r="bigint"==typeof e;if(!r&&!Number.isFinite(e))throw TypeError("Expected a finite number or bigint");(t={...t}).colonNotation&&(t.compact=!1,t.formatSubMilliseconds=!1,t.separateMilliseconds=!1,t.verbose=!1),t.compact&&(t.unitCount=1,t.secondsDecimalDigits=0,t.millisecondsDecimalDigits=0);let n=[],i=(e,r,i,s)=>{if(!((0===n.length||!t.colonNotation)&&a(e))||t.colonNotation&&"m"===i){if(s=s??String(e),t.colonNotation){let e=s.includes(".")?s.split(".")[0].length:s.length,t=n.length>0?2:1;s="0".repeat(Math.max(0,t-e))+s}else s+=t.verbose?" "+o(r,e):i;n.push(s)}},u=(0,s.default)(e),c=BigInt(u.days);if(i(c/365n,"year","y"),i(c%365n,"day","d"),i(Number(u.hours),"hour","h"),i(Number(u.minutes),"minute","m"),t.separateMilliseconds||t.formatSubMilliseconds||!t.colonNotation&&e<1e3){let e=Number(u.seconds),r=Number(u.milliseconds),n=Number(u.microseconds),s=Number(u.nanoseconds);if(i(e,"second","s"),t.formatSubMilliseconds)i(r,"millisecond","ms"),i(n,"microsecond","\xb5s"),i(s,"nanosecond","ns");else{let e=r+n/1e3+s/1e6,a="number"==typeof t.millisecondsDecimalDigits?t.millisecondsDecimalDigits:0,o=a?e.toFixed(a):e>=1?Math.round(e):Math.ceil(e);i(Number.parseFloat(o),"millisecond","ms",o)}}else{let n=(r?Number(e%l):e)/1e3%60,s="number"==typeof t.secondsDecimalDigits?t.secondsDecimalDigits:1,a=((e,t)=>{let r=Math.floor(e*10**t+1e-7),n=Math.round(r)/10**t;return n.toFixed(t)})(n,s),o=t.keepDecimalsOnWholeSeconds?a:a.replace(/\.0+$/,"");i(Number.parseFloat(o),"second","s",o)}if(0===n.length)return"0"+(t.verbose?" milliseconds":"ms");let h=t.colonNotation?":":" ";return"number"==typeof t.unitCount&&(n=n.slice(0,Math.max(t.unitCount,1))),n.join(h)}},{"parse-ms":"fLTS8","@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],fLTS8:[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"default",()=>s);let i=e=>Number.isFinite(e)?e:0;function s(e){switch(typeof e){case"number":if(Number.isFinite(e))return{days:Math.trunc(e/864e5),hours:Math.trunc(e/36e5%24),minutes:Math.trunc(e/6e4%60),seconds:Math.trunc(e/1e3%60),milliseconds:Math.trunc(e%1e3),microseconds:Math.trunc(i(1e3*e)%1e3),nanoseconds:Math.trunc(i(1e6*e)%1e3)};break;case"bigint":return{days:e/86400000n,hours:e/3600000n%24n,minutes:e/60000n%60n,seconds:e/1000n%60n,milliseconds:e%1000n,microseconds:0n,nanoseconds:0n}}throw TypeError("Expected a finite number or bigint")}},{"@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],g0JWt:[function(e,t,r){var n=this&&this.__createBinding||(Object.create?function(e,t,r,n){void 0===n&&(n=r);var i=Object.getOwnPropertyDescriptor(t,r);(!i||("get"in i?!t.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,n,i)}:function(e,t,r,n){void 0===n&&(n=r),e[n]=t[r]}),i=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||n(t,e,r)};Object.defineProperty(r,"__esModule",{value:!0}),r.findActiveTab=r.parseRawData=r.ytInitialPlayerResponseRegex=r.ytInitialDataRegex=void 0,i(e("80da46c812df4774"),r),i(e("2981d7843469d341"),r),i(e("52d93fc3365a94fb"),r),i(e("984f45f0ea38f189"),r),i(e("99c177b83bdcd141"),r);var s=e("6ea9b15e301ea26d");Object.defineProperty(r,"ytInitialDataRegex",{enumerable:!0,get:function(){return s.initialDataRe}}),Object.defineProperty(r,"ytInitialPlayerResponseRegex",{enumerable:!0,get:function(){return s.playerResponseRe}}),Object.defineProperty(r,"parseRawData",{enumerable:!0,get:function(){return s.parseRawData}}),Object.defineProperty(r,"findActiveTab",{enumerable:!0,get:function(){return s.findActiveTab}})},{"80da46c812df4774":"fU3wA","2981d7843469d341":"ewdMZ","52d93fc3365a94fb":"dha0v","984f45f0ea38f189":"1FK7c","99c177b83bdcd141":"1IsRe","6ea9b15e301ea26d":"2Zub0"}],fU3wA:[function(e,t,r){Object.defineProperty(r,"__esModule",{value:!0}),r.extractChannelInfo=void 0;let n=e("5f6e3acf8720434a");r.extractChannelInfo=function(e){let t;let r="string"==typeof e?(0,n.parseRawData)({source:e,ytInitialData:!0}).ytInitialData:e;if(!r)throw TypeError("No YT initial data in provided source.");let i=r.metadata?.channelMetadataRenderer;if(!i)throw Error("Could not find channel metadata.");let{title:s,description:a,externalId:o,vanityChannelUrl:l,avatar:u,isFamilySafe:c,keywords:h}=i,d=(0,n.getThumbnail)(u.thumbnails),f=r.microformat?.microformatDataRenderer;if(f){let{tags:e}=f;t=e}else t=h.split(" ");let p={name:s,description:a,id:o,isFamilySafe:c,avatarUrl:d,tags:t},m=l.split("/")[4];return m!==o&&(p.vanityId=m),p}},{"5f6e3acf8720434a":"2Zub0"}],"2Zub0":[function(e,t,r){function n(e){let{source:t,ytInitialData:n,ytInitialPlayerResponse:i}=e;if(!t)throw TypeError("No source string to search provided.");if(!n&&!i)throw TypeError("At least one of ytInitialData and ytInitialPlayerResponse need to be parsed.");let s={};if(n){let e=r.initialDataRe.exec(t);e&&(s.ytInitialData=JSON.parse(e[0]))}if(i){let e=r.playerResponseRe.exec(t);e&&(s.ytInitialPlayerResponse=JSON.parse(e[0]))}return s}Object.defineProperty(r,"__esModule",{value:!0}),r.transformYtInitialData=r.getTextOrMergedRuns=r.getThumbnail=r.tryParseDate=r.isValidDate=r.mergeRuns=r.sanitizeUrl=r.getLastItem=r.findValuesByKeys=r.findActiveTab=r.parseRawData=r.playerResponseRe=r.initialDataRe=void 0,r.initialDataRe=/(?<=var ytInitialData *\= *)\{.*?}(?=\;)(?<![A-z<>])/,r.playerResponseRe=/(?<=var ytInitialPlayerResponse *\= *)\{.*?}(?=\;)(?<![A-z<>])/,r.parseRawData=n,r.findActiveTab=function(e){try{return e.contents.twoColumnBrowseResultsRenderer.tabs.find(e=>e.tabRenderer.selected)}catch(e){throw Error(`Error accessing initial data: ${e}`)}},r.findValuesByKeys=(e,t)=>{let r=[],n=new WeakSet,i=(e,t)=>(Object.keys(e).some(s=>{t.includes(s)?r.push(e[s]):e[s]&&!n.has(e[s])&&"object"==typeof e[s]&&(i(e[s],t),n.add(e[s]))}),r);return i(e,t)},r.getLastItem=e=>e[e.length-1],r.sanitizeUrl=(e,t=0)=>e.split("=").slice(0,t+1).join(""),r.mergeRuns=e=>e.map(e=>e.text).join(""),r.isValidDate=e=>!isNaN(e.getTime()),r.tryParseDate=e=>{let t=new Date(e);if((0,r.isValidDate)(t))return t},r.getThumbnail=e=>(0,r.sanitizeUrl)((0,r.getLastItem)(e).url),r.getTextOrMergedRuns=e=>e.simpleText??(0,r.mergeRuns)(e.runs),r.transformYtInitialData=function(e,t,i){"object"!=typeof e&&(e=n({ytInitialData:!0,source:e}).ytInitialData);let s=(0,r.findValuesByKeys)(e,t);return s.map(i)}},{}],ewdMZ:[function(e,t,r){var n,i;Object.defineProperty(r,"__esModule",{value:!0}),r.extractCommunityPosts=r.extractPost=r.AttachmentType=void 0;let s=e("1d4f6b2a7370fea1");(i=n=r.AttachmentType||(r.AttachmentType={})).Image="Image",i.Poll="Poll",i.Video="Video",i.Playlist="Playlist",i.SharedPost="SharedPost",i.None="None";let a=["sharedPostRenderer","backstagePostRenderer"];function o(e){let t;let{postId:r,contentText:i,backstageAttachment:a,originalPost:l,content:u}=e;switch(!0){case l?.backstagePostRenderer!==void 0:t=n.SharedPost;break;case!a:t=n.None;break;case void 0!=a.backstageImageRenderer||void 0!=a.postMultiImageRenderer:t=n.Image;break;case void 0!=a.pollRenderer:t=n.Poll;break;case void 0!=a.videoRenderer:t=n.Video;break;case void 0!=a.playlistRenderer:t=n.Playlist;break;default:t="INVALID"}if("INVALID"===t)throw Error(`Could not resolve attachmentType in ${JSON.stringify(a)}! Please open an issue with this error!`);let c=(()=>{let e=e=>{let{text:t,navigationEndpoint:r}=e;if(r){let e;let{commandMetadata:n}=r,{url:i}=n.webCommandMetadata,s=new URL(n.webCommandMetadata.url,i.startsWith("http")?void 0:"https://youtube.com/");if(!(e=s.searchParams.has("q")?s.searchParams.get("q"):s.toString()))throw Error(`Could not find URL in ${JSON.stringify(r)}! Please open an issue with this error message!`);return{text:t,url:e}}return{text:t}};return i?.runs?.map(e)??(i?.simpleText?{text:i.simpleText}:void 0)??u?.runs?.map(e)??(u?.simpleText?{text:u.simpleText}:void 0)})(),h={id:r,content:c,attachmentType:t},d=(()=>{if(t!==n.Image)return;let e=[],r=t=>{e.push((0,s.getThumbnail)(t.image.thumbnails))};if(a.backstageImageRenderer)r(a.backstageImageRenderer);else for(let{backstageImageRenderer:e}of a.postMultiImageRenderer.images)r(e);return e})(),f=(()=>{if(t!==n.Poll)return;let{choices:e}=a.pollRenderer;return e.map(e=>{let t=(0,s.mergeRuns)(e.text.runs),r={text:t};return e.image&&(r.imageUrl=(0,s.getThumbnail)(e.image.thumbnails)),r})})(),p=(()=>{if(t!==n.Video)return;let{videoId:e,thumbnail:r,title:i,descriptionSnippet:o,badges:l}=a.videoRenderer,u=(0,s.getThumbnail)(r.thumbnails),c=i.simpleText??(0,s.mergeRuns)(i.runs),h=o?(0,s.mergeRuns)(o.runs):void 0,d=(l&&l.some(({metadataBadgeRenderer:e})=>e?.style=="BADGE_STYLE_TYPE_MEMBERS_ONLY"))??!1;return{id:e,title:c,descriptionSnippet:h,thumbnail:u,membersOnly:d}})(),m=(()=>{if(t!==n.Playlist)return;let{title:e,thumbnailRenderer:r,playlistId:i}=a.playlistRenderer,o=e.simpleText??(0,s.mergeRuns)(e.text.runs),l=(0,s.getThumbnail)(r.playlistVideoThumbnailRenderer.thumbnail.thumbnails);return{id:i,title:o,thumbail:l}})();return h.attachmentType===n.Image?h.images=d:h.attachmentType===n.Poll?h.choices=f:h.attachmentType===n.Video?h.video=p:h.attachmentType===n.Playlist?h.playlist=m:h.attachmentType===n.SharedPost&&(h.sharedPost=o(l.backstagePostRenderer)),h}r.extractPost=o,r.extractCommunityPosts=function(e){return(0,s.transformYtInitialData)(e,a,o)}},{"1d4f6b2a7370fea1":"2Zub0"}],dha0v:[function(e,t,r){var n,i;Object.defineProperty(r,"__esModule",{value:!0}),r.extractPlayerInfo=r.Playability=void 0;let s=e("abec5e0a58f77aa6");(i=n=r.Playability||(r.Playability={})).Ok="Ok",i.Unplayable="Unplayable";let a={OK:n.Ok,UNPLAYABLE:n.Unplayable};r.extractPlayerInfo=function(e){let t="string"==typeof e?(0,s.parseRawData)({source:e,ytInitialPlayerResponse:!0}).ytInitialPlayerResponse:e;if(!t)throw TypeError("No player response in provided source! Make sure the source is from /watch or a youtu.be link!");let{playabilityStatus:r,streamingData:n,videoDetails:i,microformat:o}=t,{videoId:l,lengthSeconds:u,keywords:c,channelId:h,thumbnail:d,viewCount:f,author:p,isLiveContent:m,allowRatings:g}=i,y=(0,s.sanitizeUrl)((0,s.getLastItem)(d.thumbnails).url),{status:v,playableInEmbed:w,miniplayer:b,errorScreen:I}=r,{title:_,description:E,isFamilySafe:T,isUnlisted:S,liveBroadcastDetails:x}=o.playerMicroformatRenderer,A={videoId:l,channelId:h,channelName:p,description:E.simpleText,thumbnail:y,viewers:f,ratable:g,title:_.simpleText,length:u,keywords:c,playability:a[v],unlisted:S,familySafe:T,membersOnly:I?.playerLegacyDesktopYpcOfferRenderer.offerId==="sponsors_only_video",embeddable:w,isStream:m,live:!1,hasEnded:!1};if(n){let{formats:e}=n;e&&(A.formats=e.map(e=>({url:e.url,mimeType:e.mimeType,label:e.qualityLabel,bitrate:e.bitrate,video:{width:e.width,height:e.height,fps:e.fps},audio:{sampleRate:Number(e.sampleRate),channels:e.channels}})))}if(x){let{isLiveNow:e,startTimestamp:t,endTimestamp:r}=x;if(A.live=e,A.startTime=(0,s.tryParseDate)(t),A.endTime=(0,s.tryParseDate)(r),A.endTime&&(A.hasEnded=!0),n){var{dashManifestUrl:C,hlsManifestUrl:D}=n;let e={};C&&(e.dash=C),D&&(e.hls=D),A.manifests=e}}return A}},{abec5e0a58f77aa6:"2Zub0"}],"1FK7c":[function(e,t,r){var n,i;Object.defineProperty(r,"__esModule",{value:!0}),r.extractVideoRenderer=r.VideoRendererStatus=r.extractGridVideoRenderers=void 0;let s=e("80bc31aeaba7f799");r.extractGridVideoRenderers=function(e){return(0,s.transformYtInitialData)(e,["richItemRenderer"],e=>o(e.content.videoRenderer))},(i=n=r.VideoRendererStatus||(r.VideoRendererStatus={})).Offline="offline",i.Upcoming="upcoming",i.Live="live";let a={DEFAULT:n.Offline,SHORTS:n.Offline,UPCOMING:n.Upcoming,LIVE:n.Live};function o(e){let{videoId:t,title:r,thumbnailOverlays:n}=e,i=(()=>{let e=n.find(e=>e.thumbnailOverlayTimeStatusRenderer)?.thumbnailOverlayTimeStatusRenderer?.style;if(!e)throw TypeError(`Could not find matching status for videoRenderer status ${e}`);return a[e]})();return{id:t,title:(0,s.mergeRuns)(r.runs),status:i}}r.extractVideoRenderer=o},{"80bc31aeaba7f799":"2Zub0"}],"1IsRe":[function(e,t,r){Object.defineProperty(r,"__esModule",{value:!0}),r.extractReelVideoRenderer=r.extractReelItemRenderers=void 0;let n=e("f34bf2469cf45e28"),i=e("672c6d6f7777d8d0");function s(e){let{videoId:t,headline:r}=e;return{id:t,title:(0,i.getTextOrMergedRuns)(r),status:n.VideoRendererStatus.Offline}}r.extractReelItemRenderers=function(e){return(0,i.transformYtInitialData)(e,["reelItemRenderer"],s)},r.extractReelVideoRenderer=s},{f34bf2469cf45e28:"1FK7c","672c6d6f7777d8d0":"2Zub0"}],eWQMh:[function(e,t,r){var n=e("@parcel/transformer-js/src/esmodule-helpers.js");n.defineInteropFlag(r),n.export(r,"initial",()=>i);let i={watchTimeExt:{},channelPictures:{},hiddenChannels:[]}},{"@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}],ag0OM:[function(e,t,r){var n,i,s,a,o=e("@parcel/transformer-js/src/esmodule-helpers.js");o.defineInteropFlag(r),o.export(r,"PayPalSubscriptionStatus",()=>s),o.export(r,"MatchmakingPromotionStatus",()=>a),(n=s||(s={})).created="BILLING.SUBSCRIPTION.CREATED",n.activated="BILLING.SUBSCRIPTION.ACTIVATED",n.updated="BILLING.SUBSCRIPTION.UPDATED",n.expired="BILLING.SUBSCRIPTION.EXPIRED",n.cancelled="BILLING.SUBSCRIPTION.CANCELLED",n.suspended="BILLING.SUBSCRIPTION.SUSPENDED",n.paymentFailed="BILLING.SUBSCRIPTION.PAYMENT.FAILED",(i=a||(a={})).shown="shown",i.dismissed="dismissed"},{"@parcel/transformer-js/src/esmodule-helpers.js":"hbR2Q"}]},["kgW6q"],"kgW6q","parcelRequire7729"),globalThis.define=t;