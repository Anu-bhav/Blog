function e(){}function t(e,t){for(const n in t)e[n]=t[n];return e}function n(e){return e()}function r(){return Object.create(null)}function s(e){e.forEach(n)}function o(e){return"function"==typeof e}function a(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function c(e,n,r){return e[1]?t({},t(n.$$scope.ctx,e[1](r?r(n):{}))):n.$$scope.ctx}function l(e,t){e.appendChild(t)}function i(e,t,n){e.insertBefore(t,n||null)}function u(e){e.parentNode.removeChild(e)}function f(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}function p(e){return document.createElement(e)}function m(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function h(e){return document.createTextNode(e)}function d(){return h(" ")}function g(){return h("")}function $(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function v(e,t,n){null==n?e.removeAttribute(t):e.setAttribute(t,n)}function b(e){return Array.from(e.childNodes)}function y(e,t,n,r){for(let r=0;r<e.length;r+=1){const s=e[r];if(s.nodeName===t){for(let e=0;e<s.attributes.length;e+=1){const t=s.attributes[e];n[t.name]||s.removeAttribute(t.name)}return e.splice(r,1)[0]}}return r?m(t):p(t)}function E(e,t){for(let n=0;n<e.length;n+=1){const r=e[n];if(3===r.nodeType)return r.data=t,e.splice(n,1)[0]}return h(t)}function _(e,t){t=""+t,e.data!==t&&(e.data=t)}function x(e,t,n){e.classList[n?"add":"remove"](t)}let S;function w(e){S=e}function A(){if(!S)throw new Error("Function called outside component initialization");return S}const N=[],P=Promise.resolve();let R=!1;const q=[],L=[],C=[];function k(e){L.push(e)}function j(){const e=new Set;do{for(;N.length;){const e=N.shift();w(e),O(e.$$)}for(;q.length;)q.shift()();for(;L.length;){const t=L.pop();e.has(t)||(t(),e.add(t))}}while(N.length);for(;C.length;)C.pop()();R=!1}function O(e){e.fragment&&(e.update(e.dirty),s(e.before_render),e.fragment.p(e.dirty,e.ctx),e.dirty=null,e.after_render.forEach(k))}let T;function B(){T={remaining:0,callbacks:[]}}function U(){T.remaining||s(T.callbacks)}function D(e){T.callbacks.push(e)}function H(e,t){const n={},r={},s={$$scope:1};let o=e.length;for(;o--;){const a=e[o],c=t[o];if(c){for(const e in a)e in c||(r[e]=1);for(const e in c)s[e]||(n[e]=c[e],s[e]=1);e[o]=c}else for(const e in a)s[e]=1}for(const e in r)e in n||(n[e]=void 0);return n}function I(e,t,r){const{fragment:a,on_mount:c,on_destroy:l,after_render:i}=e.$$;a.m(t,r),k(()=>{const t=c.map(n).filter(o);l?l.push(...t):s(t),e.$$.on_mount=[]}),i.forEach(k)}function V(e,t){e.$$.dirty||(N.push(e),R||(R=!0,P.then(j)),e.$$.dirty=r()),e.$$.dirty[t]=!0}function J(t,n,o,a,c,l){const i=S;w(t);const u=n.props||{},f=t.$$={fragment:null,ctx:null,props:l,update:e,not_equal:c,bound:r(),on_mount:[],on_destroy:[],before_render:[],after_render:[],context:new Map(i?i.$$.context:[]),callbacks:r(),dirty:null};let p=!1;f.ctx=o?o(t,u,(e,n)=>{f.ctx&&c(f.ctx[e],f.ctx[e]=n)&&(f.bound[e]&&f.bound[e](n),p&&V(t,e))}):u,f.update(),p=!0,s(f.before_render),f.fragment=a(f.ctx),n.target&&(n.hydrate?f.fragment.l(b(n.target)):f.fragment.c(),n.intro&&t.$$.fragment.i&&t.$$.fragment.i(),I(t,n.target,n.anchor),j()),w(i)}class M{$destroy(){var t,n;n=!0,(t=this).$$&&(s(t.$$.on_destroy),t.$$.fragment.d(n),t.$$.on_destroy=t.$$.fragment=null,t.$$.ctx={}),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(){}}function F(t,n=e){let r;const s=[];function o(e){if(a(t,e)){if(t=e,!r)return;s.forEach(e=>e[1]()),s.forEach(e=>e[0](t))}}return{set:o,update:function(e){o(e(t))},subscribe:function(a,c=e){const l=[a,c];return s.push(l),1===s.length&&(r=n(o)||e),a(t),()=>{const e=s.indexOf(l);-1!==e&&s.splice(e,1),0===s.length&&r()}}}}const K={},W=()=>({});function Y(t){var n,r;return{c(){n=p("a"),r=p("img"),this.h()},l(e){var t=b(n=y(e,"A",{href:!0},!1));b(r=y(t,"IMG",{alt:!0,src:!0,class:!0},!1)).forEach(u),t.forEach(u),this.h()},h(){r.alt="Sapper",r.src="as-logo2.ico",r.className="svelte-1u41owj",n.href="/"},m(e,t){i(e,n,t),l(n,r)},p:e,i:e,o:e,d(e){e&&u(n)}}}class G extends M{constructor(e){super(),J(this,e,null,Y,a,[])}}function z(t){var n,r,s,o,a,c,f,m,g,$,v,_;return{c(){n=p("nav"),r=p("a"),s=h("Home"),a=d(),c=p("a"),f=h("Blog"),g=d(),$=p("a"),v=h("Website"),this.h()},l(e){var t=b(n=y(e,"NAV",{class:!0},!1)),o=b(r=y(t,"A",{class:!0,href:!0},!1));s=E(o,"Home"),o.forEach(u),a=E(t,"\n  ");var l=b(c=y(t,"A",{rel:!0,class:!0,href:!0},!1));f=E(l,"Blog"),l.forEach(u),g=E(t,"\n  ");var i=b($=y(t,"A",{class:!0,href:!0},!1));v=E(i,"Website"),i.forEach(u),t.forEach(u),this.h()},h(){r.className=o=(void 0===t.segment?"selected":"")+" svelte-16qpxtx",r.href=".",c.rel="prefetch",c.className=m=("blog"===t.segment?"selected":"")+" svelte-16qpxtx",c.href="blog",$.className=_=("website"===t.segment?"selected":"")+" svelte-16qpxtx",$.href="https://anu-bhav.github.io",n.className="svelte-16qpxtx"},m(e,t){i(e,n,t),l(n,r),l(r,s),l(n,a),l(n,c),l(c,f),l(n,g),l(n,$),l($,v)},p(e,t){e.segment&&o!==(o=(void 0===t.segment?"selected":"")+" svelte-16qpxtx")&&(r.className=o),e.segment&&m!==(m=("blog"===t.segment?"selected":"")+" svelte-16qpxtx")&&(c.className=m),e.segment&&_!==(_=("website"===t.segment?"selected":"")+" svelte-16qpxtx")&&($.className=_)},i:e,o:e,d(e){e&&u(n)}}}function X(e,t,n){let{segment:r}=t;return e.$set=e=>{"segment"in e&&n("segment",r=e.segment)},{segment:r}}class Q extends M{constructor(e){super(),J(this,e,X,z,a,["segment"])}}function Z(e){var t,n,r,s=new G({}),o=new Q({props:{segment:e.segment}});return{c(){t=p("header"),s.$$.fragment.c(),n=d(),o.$$.fragment.c(),this.h()},l(e){var r=b(t=y(e,"HEADER",{class:!0},!1));s.$$.fragment.l(r),n=E(r,"\n  "),o.$$.fragment.l(r),r.forEach(u),this.h()},h(){t.className="svelte-y9ah38"},m(e,a){i(e,t,a),I(s,t,null),l(t,n),I(o,t,null),r=!0},p(e,t){var n={};e.segment&&(n.segment=t.segment),o.$set(n)},i(e){r||(s.$$.fragment.i(e),o.$$.fragment.i(e),r=!0)},o(e){s.$$.fragment.o(e),o.$$.fragment.o(e),r=!1},d(e){e&&u(t),s.$destroy(),o.$destroy()}}}function ee(e,t,n){let{segment:r}=t;return e.$set=e=>{"segment"in e&&n("segment",r=e.segment)},{segment:r}}class te extends M{constructor(e){super(),J(this,e,ee,Z,a,["segment"])}}function ne(e){var n,r,s,o,a,f,m,g,$,v,_,x,S,w,A,N,P=(new Date).getFullYear(),R=new te({props:{segment:e.segment}});const q=e.$$slots.default,L=function(e,t,n){if(e){const r=c(e,t,n);return e[0](r)}}(q,e,null);return{c(){n=p("div"),R.$$.fragment.c(),r=d(),s=p("main"),L&&L.c(),o=d(),a=p("footer"),f=p("span"),m=h("© "),g=h(P),$=h(" Personal Blog.\n      Powered by "),v=p("a"),_=h("Sapper"),x=h(".\n      Template by "),S=p("a"),w=h("Anubhavsingh Sawdagur"),A=h("."),this.h()},l(e){var t=b(n=y(e,"DIV",{class:!0},!1));R.$$.fragment.l(t),r=E(t,"\n\n  ");var c=b(s=y(t,"MAIN",{class:!0},!1));L&&L.l(c),c.forEach(u),o=E(t,"\n\n  ");var l=b(a=y(t,"FOOTER",{class:!0},!1)),i=b(f=y(l,"SPAN",{},!1));m=E(i,"© "),g=E(i,P),$=E(i," Personal Blog.\n      Powered by ");var p=b(v=y(i,"A",{href:!0,target:!0},!1));_=E(p,"Sapper"),p.forEach(u),x=E(i,".\n      Template by ");var h=b(S=y(i,"A",{href:!0,target:!0},!1));w=E(h,"Anubhavsingh Sawdagur"),h.forEach(u),A=E(i,"."),i.forEach(u),l.forEach(u),t.forEach(u),this.h()},h(){s.className="svelte-v25qrq",v.href="https://sapper.svelte.dev",v.target="_blank",S.href="https://anu-bhav.github.io",S.target="_blank",a.className="svelte-v25qrq",n.className="layout svelte-v25qrq"},m(e,t){i(e,n,t),I(R,n,null),l(n,r),l(n,s),L&&L.m(s,null),l(n,o),l(n,a),l(a,f),l(f,m),l(f,g),l(f,$),l(f,v),l(v,_),l(f,x),l(f,S),l(S,w),l(f,A),N=!0},p(e,n){var r={};e.segment&&(r.segment=n.segment),R.$set(r),L&&L.p&&e.$$scope&&L.p(function(e,n,r,s){return e[1]?t({},t(n.$$scope.changed||{},e[1](s?s(r):{}))):n.$$scope.changed||{}}(q,n,e,null),c(q,n,null))},i(e){N||(R.$$.fragment.i(e),L&&L.i&&L.i(e),N=!0)},o(e){R.$$.fragment.o(e),L&&L.o&&L.o(e),N=!1},d(e){e&&u(n),R.$destroy(),L&&L.d(e)}}}function re(e,t,n){let{segment:r}=t,{$$slots:s={},$$scope:o}=t;return e.$set=e=>{"segment"in e&&n("segment",r=e.segment),"$$scope"in e&&n("$$scope",o=e.$$scope)},{segment:r,$$slots:s,$$scope:o}}class se extends M{constructor(e){super(),J(this,e,re,ne,a,["segment"])}}function oe(e){var t,n,r=e.error.stack;return{c(){t=p("pre"),n=h(r)},l(e){var s=b(t=y(e,"PRE",{},!1));n=E(s,r),s.forEach(u)},m(e,r){i(e,t,r),l(t,n)},p(e,t){e.error&&r!==(r=t.error.stack)&&_(n,r)},d(e){e&&u(t)}}}function ae(t){var n,r,s,o,a,c,f,m,$,v=t.error.message;document.title=n=t.status;var x=t.dev&&t.error.stack&&oe(t);return{c(){r=d(),s=p("h1"),o=h(t.status),a=d(),c=p("p"),f=h(v),m=d(),x&&x.c(),$=g(),this.h()},l(e){r=E(e,"\n\n");var n=b(s=y(e,"H1",{class:!0},!1));o=E(n,t.status),n.forEach(u),a=E(e,"\n\n");var l=b(c=y(e,"P",{class:!0},!1));f=E(l,v),l.forEach(u),m=E(e,"\n\n"),x&&x.l(e),$=g(),this.h()},h(){s.className="svelte-8od9u6",c.className="svelte-8od9u6"},m(e,t){i(e,r,t),i(e,s,t),l(s,o),i(e,a,t),i(e,c,t),l(c,f),i(e,m,t),x&&x.m(e,t),i(e,$,t)},p(e,t){e.status&&n!==(n=t.status)&&(document.title=n),e.status&&_(o,t.status),e.error&&v!==(v=t.error.message)&&_(f,v),t.dev&&t.error.stack?x?x.p(e,t):((x=oe(t)).c(),x.m($.parentNode,$)):x&&(x.d(1),x=null)},i:e,o:e,d(e){e&&(u(r),u(s),u(a),u(c),u(m)),x&&x.d(e),e&&u($)}}}function ce(e,t,n){let{status:r,error:s}=t;return e.$set=e=>{"status"in e&&n("status",r=e.status),"error"in e&&n("error",s=e.error)},{status:r,error:s,dev:!1}}class le extends M{constructor(e){super(),J(this,e,ce,ae,a,["status","error"])}}function ie(e){var n,r,s=[e.level1.props],o=e.level1.component;function a(e){let n={};for(var r=0;r<s.length;r+=1)n=t(n,s[r]);return{props:n}}if(o)var c=new o(a());return{c(){c&&c.$$.fragment.c(),n=g()},l(e){c&&c.$$.fragment.l(e),n=g()},m(e,t){c&&I(c,e,t),i(e,n,t),r=!0},p(e,t){var r=e.level1?H(s,[t.level1.props]):{};if(o!==(o=t.level1.component)){if(c){B();const e=c;D(()=>{e.$destroy()}),e.$$.fragment.o(1),U()}o?((c=new o(a())).$$.fragment.c(),c.$$.fragment.i(1),I(c,n.parentNode,n)):c=null}else o&&c.$set(r)},i(e){r||(c&&c.$$.fragment.i(e),r=!0)},o(e){c&&c.$$.fragment.o(e),r=!1},d(e){e&&u(n),c&&c.$destroy(e)}}}function ue(e){var t,n=new le({props:{error:e.error,status:e.status}});return{c(){n.$$.fragment.c()},l(e){n.$$.fragment.l(e)},m(e,r){I(n,e,r),t=!0},p(e,t){var r={};e.error&&(r.error=t.error),e.status&&(r.status=t.status),n.$set(r)},i(e){t||(n.$$.fragment.i(e),t=!0)},o(e){n.$$.fragment.o(e),t=!1},d(e){n.$destroy(e)}}}function fe(e){var t,n,r,s,o=[ue,ie],a=[];function c(e){return e.error?0:1}return t=c(e),n=a[t]=o[t](e),{c(){n.c(),r=g()},l(e){n.l(e),r=g()},m(e,n){a[t].m(e,n),i(e,r,n),s=!0},p(e,s){var l=t;(t=c(s))===l?a[t].p(e,s):(B(),D(()=>{a[l].d(1),a[l]=null}),n.o(1),U(),(n=a[t])||(n=a[t]=o[t](s)).c(),n.i(1),n.m(r.parentNode,r))},i(e){s||(n&&n.i(),s=!0)},o(e){n&&n.o(),s=!1},d(e){a[t].d(e),e&&u(r)}}}function pe(e){var n,r=[{segment:e.segments[0]},e.level0.props];let s={$$slots:{default:[fe]},$$scope:{ctx:e}};for(var o=0;o<r.length;o+=1)s=t(s,r[o]);var a=new se({props:s});return{c(){a.$$.fragment.c()},l(e){a.$$.fragment.l(e)},m(e,t){I(a,e,t),n=!0},p(e,t){var n=e.segments||e.level0?H(r,[e.segments&&{segment:t.segments[0]},e.level0&&t.level0.props]):{};(e.$$scope||e.error||e.status||e.level1)&&(n.$$scope={changed:e,ctx:t}),a.$set(n)},i(e){n||(a.$$.fragment.i(e),n=!0)},o(e){a.$$.fragment.o(e),n=!1},d(e){a.$destroy(e)}}}function me(e,t,n){let{stores:r,error:s,status:o,segments:a,level0:c,level1:l=null,notify:i}=t;var u,f,p;return u=i,A().$$.after_render.push(u),f=K,p=r,A().$$.context.set(f,p),e.$set=e=>{"stores"in e&&n("stores",r=e.stores),"error"in e&&n("error",s=e.error),"status"in e&&n("status",o=e.status),"segments"in e&&n("segments",a=e.segments),"level0"in e&&n("level0",c=e.level0),"level1"in e&&n("level1",l=e.level1),"notify"in e&&n("notify",i=e.notify)},{stores:r,error:s,status:o,segments:a,level0:c,level1:l,notify:i}}class he extends M{constructor(e){super(),J(this,e,me,pe,a,["stores","error","status","segments","level0","level1","notify"])}}const de=[/^\/blog\.json$/,/^\/blog\/posts\/THM_AdventOfCyber3\/?$/,/^\/blog\/posts\/first-post-test\/?$/,/^\/blog\/posts\/markdown-test\/?$/,/^\/blog\/posts\/hello-world\/?$/,/^\/blog\/posts\/second-post\/?$/,/^\/blog\/posts\/Brainfuck\/?$/,/^\/blog\/posts\/Nibbles\/?$/,/^\/blog\/posts\/Shocker\/?$/,/^\/blog\/posts\/testing\/?$/,/^\/blog\/posts\/Bashed\/?$/,/^\/blog\/posts\/Cronos\/?$/,/^\/blog\/posts\/Beep\/?$/,/^\/blog\/posts\/Lame\/?$/,/^\/blog\/([^\/]+?)\.json$/],ge=[{js:()=>import("./index.2d7f3d95.js"),css:[]},{js:()=>import("./about.de4c3978.js"),css:[]},{js:()=>import("./index.24b83d7a.js"),css:[]},{js:()=>import("./BackToTop.639327d7.js"),css:[]},{js:()=>import("./[slug].afa8da3f.js"),css:[]}],$e=(ve=decodeURIComponent,[{pattern:/^\/$/,parts:[{i:0}]},{pattern:/^\/about\/?$/,parts:[{i:1}]},{pattern:/^\/blog\/?$/,parts:[{i:2}]},{pattern:/^\/blog\/BackToTop\/?$/,parts:[null,{i:3}]},{pattern:/^\/blog\/([^\/]+?)\/?$/,parts:[null,{i:4,params:e=>({slug:ve(e[1])})}]}]);var ve;const be="undefined"!=typeof __SAPPER__&&__SAPPER__;let ye,Ee,_e,xe=!1,Se=[],we="{}";const Ae={page:function(e){const t=F(e);let n=!0;return{notify:function(){n=!0,t.update(e=>e)},set:function(e){n=!1,t.set(e)},subscribe:function(e){let r;return t.subscribe(t=>{(void 0===r||n&&t!==r)&&e(r=t)})}}}({}),preloading:F(null),session:F(be&&be.session)};let Ne,Pe;Ae.session.subscribe(async e=>{if(Ne=e,!xe)return;Pe=!0;const t=Te(new URL(location.href)),n=Ee={},{redirect:r,props:s,branch:o}=await He(t);n===Ee&&await De(r,o,s,t.page)});let Re,qe=null;let Le,Ce=1;const ke="undefined"!=typeof history?history:{pushState:(e,t,n)=>{},replaceState:(e,t,n)=>{},scrollRestoration:""},je={};function Oe(e){const t=Object.create(null);return e.length>0&&e.slice(1).split("&").forEach(e=>{let[,n,r=""]=/([^=]*)(?:=(.*))?/.exec(decodeURIComponent(e.replace(/\+/g," ")));"string"==typeof t[n]&&(t[n]=[t[n]]),"object"==typeof t[n]?t[n].push(r):t[n]=r}),t}function Te(e){if(e.origin!==location.origin)return null;if(!e.pathname.startsWith(be.baseUrl))return null;let t=e.pathname.slice(be.baseUrl.length);if(""===t&&(t="/"),!de.some(e=>e.test(t)))for(let n=0;n<$e.length;n+=1){const r=$e[n],s=r.pattern.exec(t);if(s){const n=Oe(e.search),o=r.parts[r.parts.length-1],a=o.params?o.params(s):{},c={host:location.host,path:t,query:n,params:a};return{href:e.href,route:r,match:s,page:c}}}}function Be(){return{x:pageXOffset,y:pageYOffset}}async function Ue(e,t,n,r){if(t)Le=t;else{const e=Be();je[Le]=e,t=Le=++Ce,je[Le]=n?e:{x:0,y:0}}Le=t,ye&&Ae.preloading.set(!0);const s=qe&&qe.href===e.href?qe.promise:He(e);qe=null;const o=Ee={},{redirect:a,props:c,branch:l}=await s;if(o===Ee&&(await De(a,l,c,e.page),document.activeElement&&document.activeElement.blur(),!n)){let e=je[t];if(r){const t=document.getElementById(r.slice(1));t&&(e={x:0,y:t.getBoundingClientRect().top+scrollY})}je[Le]=e,e&&scrollTo(e.x,e.y)}}async function De(e,t,n,r){if(e)return function(e,t={replaceState:!1}){const n=Te(new URL(e,document.baseURI));return n?(ke[t.replaceState?"replaceState":"pushState"]({id:Le},"",e),Ue(n,null).then(()=>{})):(location.href=e,new Promise(e=>{}))}(e.location,{replaceState:!0});if(Ae.page.set(r),Ae.preloading.set(!1),ye)ye.$set(n);else{n.stores={page:{subscribe:Ae.page.subscribe},preloading:{subscribe:Ae.preloading.subscribe},session:Ae.session},n.level0={props:await _e},n.notify=Ae.page.notify;const e=document.querySelector("#sapper-head-start"),t=document.querySelector("#sapper-head-end");if(e&&t){for(;e.nextSibling!==t;)Ve(e.nextSibling);Ve(e),Ve(t)}ye=new he({target:Re,props:n,hydrate:!0})}Se=t,we=JSON.stringify(r.query),xe=!0,Pe=!1}async function He(e){const{route:t,page:n}=e,r=n.path.split("/").filter(Boolean);let s=null;const o={error:null,status:200,segments:[r[0]]},a={fetch:(e,t)=>fetch(e,t),redirect:(e,t)=>{if(s&&(s.statusCode!==e||s.location!==t))throw new Error("Conflicting redirects");s={statusCode:e,location:t}},error:(e,t)=>{o.error="string"==typeof t?new Error(t):t,o.status=e}};let c;_e||(_e=be.preloaded[0]||W.call(a,{host:n.host,path:n.path,query:n.query,params:{}},Ne));let l=1;try{const s=JSON.stringify(n.query),i=t.pattern.exec(n.path);let u=!1;c=await Promise.all(t.parts.map(async(t,c)=>{const f=r[c];if(function(e,t,n,r){if(r!==we)return!0;const s=Se[e];return!!s&&(t!==s.segment||!(!s.match||JSON.stringify(s.match.slice(1,e+2))===JSON.stringify(n.slice(1,e+2)))||void 0)}(c,f,i,s)&&(u=!0),o.segments[l]=r[c+1],!t)return{segment:f};const p=l++;if(!Pe&&!u&&Se[c]&&Se[c].part===t.i)return Se[c];u=!1;const{default:m,preload:h}=await function(e){const t="string"==typeof e.css?[]:e.css.map(Ie);return t.unshift(e.js()),Promise.all(t).then(e=>e[0])}(ge[t.i]);let d;return d=xe||!be.preloaded[c+1]?h?await h.call(a,{host:n.host,path:n.path,query:n.query,params:t.params?t.params(e.match):{}},Ne):{}:be.preloaded[c+1],o["level"+p]={component:m,props:d,segment:f,match:i,part:t.i}}))}catch(e){o.error=e,o.status=500,c=[]}return{redirect:s,props:o,branch:c}}function Ie(e){const t="client/"+e;if(!document.querySelector(`link[href="${t}"]`))return new Promise((e,n)=>{const r=document.createElement("link");r.rel="stylesheet",r.href=t,r.onload=()=>e(),r.onerror=n,document.head.appendChild(r)})}function Ve(e){e.parentNode.removeChild(e)}function Je(e){const t=Te(new URL(e,document.baseURI));if(t)return qe&&e===qe.href||function(e,t){qe={href:e,promise:t}}(e,He(t)),qe.promise}let Me;function Fe(e){clearTimeout(Me),Me=setTimeout(()=>{Ke(e)},20)}function Ke(e){const t=Ye(e.target);t&&"prefetch"===t.rel&&Je(t.href)}function We(e){if(1!==function(e){return null===e.which?e.button:e.which}(e))return;if(e.metaKey||e.ctrlKey||e.shiftKey)return;if(e.defaultPrevented)return;const t=Ye(e.target);if(!t)return;if(!t.href)return;const n="object"==typeof t.href&&"SVGAnimatedString"===t.href.constructor.name,r=String(n?t.href.baseVal:t.href);if(r===location.href)return void(location.hash||e.preventDefault());if(t.hasAttribute("download")||"external"===t.getAttribute("rel"))return;if(n?t.target.baseVal:t.target)return;const s=new URL(r);if(s.pathname===location.pathname&&s.search===location.search)return;const o=Te(s);if(o){Ue(o,null,t.hasAttribute("sapper-noscroll"),s.hash),e.preventDefault(),ke.pushState({id:Le},"",s.href)}}function Ye(e){for(;e&&"A"!==e.nodeName.toUpperCase();)e=e.parentNode;return e}function Ge(e){if(je[Le]=Be(),e.state){const t=Te(new URL(location.href));t?Ue(t,e.state.id):location.href=location.href}else Ce=Ce+1,function(e){Le=e}(Ce),ke.replaceState({id:Le},"",location.href)}var ze;ze={target:document.querySelector("#sapper")},"scrollRestoration"in ke&&(ke.scrollRestoration="manual"),addEventListener("beforeunload",()=>{ke.scrollRestoration="auto"}),addEventListener("load",()=>{ke.scrollRestoration="manual"}),function(e){Re=e}(ze.target),addEventListener("click",We),addEventListener("popstate",Ge),addEventListener("touchstart",Ke),addEventListener("mousemove",Fe),Promise.resolve().then(()=>{const{hash:e,href:t}=location;ke.replaceState({id:Ce},"",t);const n=new URL(location.href);if(be.error)return function(e){const{host:t,pathname:n,search:r}=location,{session:s,preloaded:o,status:a,error:c}=be;_e||(_e=o&&o[0]),De(null,[],{error:c,status:a,session:s,level0:{props:_e},level1:{props:{status:a,error:c},component:le},segments:o},{host:t,path:n,query:Oe(r),params:{}})}();const r=Te(n);return r?Ue(r,Ce,!0,e):void 0});export{M as S,d as a,y as b,E as c,b as d,p as e,u as f,i as g,l as h,J as i,_ as j,f as k,m as l,I as m,e as n,v as o,g as p,x as q,$ as r,a as s,h as t,s as u};
