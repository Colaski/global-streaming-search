var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function r(t){t.forEach(e)}function o(t){return"function"==typeof t}function c(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let l,s;function i(t,e){return l||(l=document.createElement("a")),l.href=e,t===l.href}function a(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function f(t){t.parentNode.removeChild(t)}function p(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function d(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function m(){return h(" ")}function g(){return h("")}function v(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function $(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function y(t,e){t.value=null==e?"":e}function b(t,e,n,r){t.style.setProperty(e,n,r?"important":"")}function w(t,e){for(let n=0;n<t.options.length;n+=1){const r=t.options[n];if(r.__value===e)return void(r.selected=!0)}t.selectedIndex=-1}function k(t){s=t}function _(){if(!s)throw new Error("Function called outside component initialization");return s}const x=[],E=[],j=[],N=[],S=Promise.resolve();let L=!1;function q(t){j.push(t)}let P=!1;const O=new Set;function z(){if(!P){P=!0;do{for(let t=0;t<x.length;t+=1){const e=x[t];k(e),C(e.$$)}for(k(null),x.length=0;E.length;)E.pop()();for(let t=0;t<j.length;t+=1){const e=j[t];O.has(e)||(O.add(e),e())}j.length=0}while(x.length);for(;N.length;)N.pop()();L=!1,P=!1,O.clear()}}function C(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(q)}}const T=new Set;let H;function J(){H={r:0,c:[],p:H}}function R(){H.r||r(H.c),H=H.p}function U(t,e){t&&t.i&&(T.delete(t),t.i(e))}function A(t,e,n,r){if(t&&t.o){if(T.has(t))return;T.add(t),H.c.push((()=>{T.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}}function I(t,e){const n=e.token={};function r(t,r,o,c){if(e.token!==n)return;e.resolved=c;let l=e.ctx;void 0!==o&&(l=l.slice(),l[o]=c);const s=t&&(e.current=t)(l);let i=!1;e.block&&(e.blocks?e.blocks.forEach(((t,n)=>{n!==r&&t&&(J(),A(t,1,1,(()=>{e.blocks[n]===t&&(e.blocks[n]=null)})),R())})):e.block.d(1),s.c(),U(s,1),s.m(e.mount(),e.anchor),i=!0),e.block=s,e.blocks&&(e.blocks[r]=s),i&&z()}if((o=t)&&"object"==typeof o&&"function"==typeof o.then){const n=_();if(t.then((t=>{k(n),r(e.then,1,e.value,t),k(null)}),(t=>{if(k(n),r(e.catch,2,e.error,t),k(null),!e.hasCatch)throw t})),e.current!==e.pending)return r(e.pending,0),!0}else{if(e.current!==e.then)return r(e.then,1,e.value,t),!0;e.resolved=t}var o}function M(t,e,n){const r=e.slice(),{resolved:o}=t;t.current===t.then&&(r[t.value]=o),t.current===t.catch&&(r[t.error]=o),t.block.p(r,n)}function B(t){t&&t.c()}function D(t,n,c,l){const{fragment:s,on_mount:i,on_destroy:a,after_update:u}=t.$$;s&&s.m(n,c),l||q((()=>{const n=i.map(e).filter(o);a?a.push(...n):r(n),t.$$.on_mount=[]})),u.forEach(q)}function F(t,e){const n=t.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function G(t,e){-1===t.$$.dirty[0]&&(x.push(t),L||(L=!0,S.then(z)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function K(e,o,c,l,i,a,u,p=[-1]){const d=s;k(e);const h=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:i,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(d?d.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:o.target||d.$$.root};u&&u(h.root);let m=!1;if(h.ctx=c?c(e,o.props||{},((t,n,...r)=>{const o=r.length?r[0]:n;return h.ctx&&i(h.ctx[t],h.ctx[t]=o)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](o),m&&G(e,t)),n})):[],h.update(),m=!0,r(h.before_update),h.fragment=!!l&&l(h.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);h.fragment&&h.fragment.l(t),t.forEach(f)}else h.fragment&&h.fragment.c();o.intro&&U(e.$$.fragment),D(e,o.target,o.anchor,o.customElement),z()}k(d)}class Q{$destroy(){F(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}class V{constructor(t,e){this.country=t,this.full_locale=e}}async function W(){const t=await async function(){const t=await fetch("https://apis.justwatch.com/content/locales/state");if(0==t.ok)throw new Error("Http Error: "+t.status);return await t.json()}();var e=[];return t.forEach((t=>{var n=new V(t.country,t.full_locale);e.push(n)})),e}async function X(){const t=await W();var e=[],n=t.map((async t=>{var n=await async function(t){const e=`https://apis.justwatch.com/content/providers/locale/${t}`,n=await fetch(e);if(0==n.ok)throw new Error("Http Error: "+n.status);return n.json()}(t.full_locale),r={country:t.country,providers:n};e.push(r)}));return await Promise.all(n),e}class Y{constructor(t,e,n,r,o,c){this.title=t,this.id=e,this.poster_uri=n,this.type=r,this.release_year=o,this.query_locale=c}}async function Z(t,e){const n=await async function(t,e){const n=`https://apis.justwatch.com/content/titles/${e}/popular`,r={query:t},o=await fetch(n,{method:"POST",body:JSON.stringify(r),headers:{"Content-Type":"application/json"}});if(0==o.ok)throw new Error("Http Error: "+o.status);return await o.json()}(t,e.full_locale);var r=[];return n.items.forEach((t=>{var n,o=new RegExp("\\s*([0-9]+)").exec(t.poster);n=null==o?"NULL":`https://images.justwatch.com/poster/${o[0]}/s592/poster.webp`,r.push(new Y(t.title,t.id,n,t.object_type,t.original_release_year,e))})),r}function tt(e){let n;return{c(){n=d("div"),n.innerHTML='<div class="svelte-1ayfjdk"></div><div class="svelte-1ayfjdk"></div><div class="svelte-1ayfjdk"></div><div class="svelte-1ayfjdk"></div><div class="svelte-1ayfjdk"></div><div class="svelte-1ayfjdk"></div><div class="svelte-1ayfjdk"></div><div class="svelte-1ayfjdk"></div>',$(n,"class","lds-roller svelte-1ayfjdk")},m(t,e){u(t,n,e)},p:t,i:t,o:t,d(t){t&&f(n)}}}class et extends Q{constructor(t){super(),K(this,t,null,tt,c,{})}}function nt(t,e,n){const r=t.slice();return r[7]=e[n],r}function rt(t){let e,n,r={ctx:t,current:null,token:null,hasCatch:!1,pending:it,then:lt,catch:ct,value:4,blocks:[,,,]};return I(t[4],r),{c(){e=d("div"),r.block.c(),$(e,"class","class svelte-1twxtb7")},m(t,o){u(t,e,o),r.block.m(e,r.anchor=null),r.mount=()=>e,r.anchor=null,n=!0},p(e,n){M(r,t=e,n)},i(t){n||(U(r.block),n=!0)},o(t){for(let t=0;t<3;t+=1){A(r.blocks[t])}n=!1},d(t){t&&f(e),r.block.d(),r.token=null,r=null}}}function ot(t){let e,n;return e=new Kt({props:{page:"SearchResults",search:t[0]+",",locale:JSON.parse(t[1])}}),{c(){B(e.$$.fragment)},m(t,r){D(e,t,r),n=!0},p(t,n){const r={};1&n&&(r.search=t[0]+","),2&n&&(r.locale=JSON.parse(t[1])),e.$set(r)},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){A(e.$$.fragment,t),n=!1},d(t){F(e,t)}}}function ct(e){return{c:t,m:t,p:t,i:t,o:t,d:t}}function lt(e){let n,o,c,l,s,i,h,g,k,_,x,E=e[4],j=[];for(let t=0;t<E.length;t+=1)j[t]=st(nt(e,E,t));return{c(){n=d("h1"),n.textContent="Search",o=m(),c=d("div"),l=d("form"),s=d("input"),i=m(),h=d("select");for(let t=0;t<j.length;t+=1)j[t].c();g=m(),k=d("input"),$(n,"class","svelte-1twxtb7"),$(s,"class","search svelte-1twxtb7"),$(s,"type","text"),$(s,"placeholder","Title"),$(h,"class","search svelte-1twxtb7"),void 0===e[1]&&q((()=>e[6].call(h))),$(k,"type","submit"),$(k,"class","search svelte-1twxtb7"),b(c,"display","inline-block")},m(t,r){u(t,n,r),u(t,o,r),u(t,c,r),a(c,l),a(l,s),y(s,e[0]),a(l,i),a(l,h);for(let t=0;t<j.length;t+=1)j[t].m(h,null);var f;w(h,e[1]),a(l,g),a(l,k),_||(x=[v(s,"input",e[5]),v(h,"change",e[6]),v(l,"submit",(f=e[3],function(t){return t.preventDefault(),f.call(this,t)}))],_=!0)},p(t,e){if(1&e&&s.value!==t[0]&&y(s,t[0]),16&e){let n;for(E=t[4],n=0;n<E.length;n+=1){const r=nt(t,E,n);j[n]?j[n].p(r,e):(j[n]=st(r),j[n].c(),j[n].m(h,null))}for(;n<j.length;n+=1)j[n].d(1);j.length=E.length}18&e&&w(h,t[1])},i:t,o:t,d(t){t&&f(n),t&&f(o),t&&f(c),p(j,t),_=!1,r(x)}}}function st(e){let n,r,o,c=e[7].country+"";return{c(){n=d("option"),r=h(c),n.__value=o=JSON.stringify(e[7]),n.value=n.__value},m(t,e){u(t,n,e),a(n,r)},p:t,d(t){t&&f(n)}}}function it(e){let n,r;return n=new et({}),{c(){B(n.$$.fragment)},m(t,e){D(n,t,e),r=!0},p:t,i(t){r||(U(n.$$.fragment,t),r=!0)},o(t){A(n.$$.fragment,t),r=!1},d(t){F(n,t)}}}function at(t){let e,n,r,o;const c=[ot,rt],l=[];function s(t,e){return t[2]?0:1}return e=s(t),n=l[e]=c[e](t),{c(){n.c(),r=g()},m(t,n){l[e].m(t,n),u(t,r,n),o=!0},p(t,[o]){let i=e;e=s(t),e===i?l[e].p(t,o):(J(),A(l[i],1,1,(()=>{l[i]=null})),R(),n=l[e],n?n.p(t,o):(n=l[e]=c[e](t),n.c()),U(n,1),n.m(r.parentNode,r))},i(t){o||(U(n),o=!0)},o(t){A(n),o=!1},d(t){l[e].d(t),t&&f(r)}}}function ut(t,e,n){let r,o,c=W(),l=!1;return[r,o,l,function(){null!=r?n(2,l=!0):alert("Please input a valid title.")},c,function(){r=this.value,n(0,r)},function(){o=function(t){const e=t.querySelector(":checked")||t.options[0];return e&&e.__value}(this),n(1,o),n(4,c)}]}class ft extends Q{constructor(t){super(),K(this,t,ut,at,c,{})}}class pt extends Y{constructor(t,e,n,r,o){super(t.title,t.id,t.poster_uri,t.type,t.release_year,t.query_locale),this.short_description=e,this.number_seasons=n,this.backdrop_url=r,this.offers=o}}async function dt(t,e){console.time("test");const n=await W();let r=[];var o=n.map((async e=>{let n=await async function(t,e,n){const r=`https://apis.justwatch.com/content/titles/${n}/${t}/locale/${e}`,o=await fetch(r);if(0==o.ok)throw new Error("Http Error: "+o.status);return o.json()}(t.id,e.full_locale,t.type);r.push({country:e.country,info:n})}));await Promise.all(o);let c=r.filter((e=>e.country===t.query_locale.country));c=c[0].info;let l=c.short_description,s=new RegExp("\\s*([0-9]+)").exec(c.backdrops[0].backdrop_url),i=null!=s?`https://images.justwatch.com/backdrop/${s[0]}/s1920/backdrop.webp`:"NULL",a="seasons"in c?c.seasons:"NULL",u=[];var f=r.map((async t=>{let n=t.country;if("offers"in(t=t.info)){let o=[];var r=t.offers.map((async t=>{t.monitization_types,e.forEach((e=>{t.provider_id==e.id&&o.push({id:e.id,short_name:e.short_name,clear_name:e.clear_name,icon_uri:e.icon_uri,monetization_types:e.monetization_types,url:t.urls.standard_web})}))}));await Promise.all(r),u.push({country:n,offers:o})}}));return await Promise.all(f),console.timeEnd("test"),new pt(t,l,a,i,u)}class ht{constructor(t,e,n,r,o){this.id=t,this.short_name=e,this.clear_name=n,this.icon_uri=r,this.monetization_types=o}}function mt(t,e,n){const r=t.slice();return r[7]=e[n],r}function gt(t){let e,n,r,o,c,l,s,i={ctx:t,current:null,token:null,hasCatch:!1,pending:Et,then:yt,catch:$t,value:4,blocks:[,,,]};return I(t[4],i),{c(){e=d("h2"),n=h("Results for "),r=d("span"),o=h(t[0]),c=m(),l=g(),i.block.c(),b(r,"color","red"),b(e,"color","white"),b(e,"text-align","center")},m(t,f){u(t,e,f),a(e,n),a(e,r),a(r,o),u(t,c,f),u(t,l,f),i.block.m(t,i.anchor=f),i.mount=()=>l.parentNode,i.anchor=l,s=!0},p(e,n){t=e,(!s||1&n)&&function(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}(o,t[0]),M(i,t,n)},i(t){s||(U(i.block),s=!0)},o(t){for(let t=0;t<3;t+=1){A(i.blocks[t])}s=!1},d(t){t&&f(e),t&&f(c),t&&f(l),i.block.d(t),i.token=null,i=null}}}function vt(t){let e,n;return e=new Kt({props:{page:"Selection",selection:t[2]}}),{c(){B(e.$$.fragment)},m(t,r){D(e,t,r),n=!0},p(t,n){const r={};4&n&&(r.selection=t[2]),e.$set(r)},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){A(e.$$.fragment,t),n=!1},d(t){F(e,t)}}}function $t(e){return{c:t,m:t,p:t,i:t,o:t,d:t}}function yt(e){let n;let r=function(t,e){return t[4].length>0?wt:bt}(e),o=r(e);return{c(){o.c(),n=g()},m(t,e){o.m(t,e),u(t,n,e)},p(t,e){o.p(t,e)},i:t,o:t,d(t){o.d(t),t&&f(n)}}}function bt(e){let n;return{c(){n=d("span"),n.innerHTML="<h1>No results 😭</h1> \n        <h2>please reload the page and try a different title.</h2>",b(n,"color","white"),b(n,"text-align","center")},m(t,e){u(t,n,e)},p:t,d(t){t&&f(n)}}}function wt(t){let e,n=t[4],r=[];for(let e=0;e<n.length;e+=1)r[e]=xt(mt(t,n,e));return{c(){e=d("div");for(let t=0;t<r.length;t+=1)r[t].c();$(e,"class","results svelte-1rudybt")},m(t,n){u(t,e,n);for(let t=0;t<r.length;t+=1)r[t].m(e,null)},p(t,o){if(24&o){let c;for(n=t[4],c=0;c<n.length;c+=1){const l=mt(t,n,c);r[c]?r[c].p(l,o):(r[c]=xt(l),r[c].c(),r[c].m(e,null))}for(;c<r.length;c+=1)r[c].d(1);r.length=n.length}},d(t){t&&f(e),p(r,t)}}}function kt(e){let n,r;return{c(){n=d("img"),i(n.src,r="./images/noImage.webp")||$(n,"src","./images/noImage.webp"),$(n,"alt","No image found for the "+e[7].type+" "+e[7].title),$(n,"class","svelte-1rudybt")},m(t,e){u(t,n,e)},p:t,d(t){t&&f(n)}}}function _t(e){let n,r;return{c(){n=d("img"),i(n.src,r=e[7].poster_uri)||$(n,"src",r),$(n,"alt","Poster for the "+e[7].type+" "+e[7].title),$(n,"class","svelte-1rudybt")},m(t,e){u(t,n,e)},p:t,d(t){t&&f(n)}}}function xt(t){let e,n,r,o,c,l,s,i,p,g,y,w,k,_,x,E,j,N=t[7].title+"",S=t[7].release_year+"",L=t[7].type+"";let q=function(t,e){return"NULL"!=t[7].poster_uri?_t:kt}(t),P=q(t);function O(){return t[6](t[7])}return{c(){e=d("div"),n=d("div"),P.c(),r=m(),o=d("span"),c=d("h2"),l=h(N),s=m(),i=d("h4"),p=h("("),g=h(S),y=h(")"),w=m(),k=d("h4"),_=h(L),x=m(),$(o,"class","resultinfo svelte-1rudybt"),$(n,"class","result svelte-1rudybt"),b(e,"display","inline-block"),b(e,"margin-left","2rem"),b(e,"margin-right","2rem"),b(e,"margin-bottom","2rem")},m(t,f){u(t,e,f),a(e,n),P.m(n,null),a(n,r),a(n,o),a(o,c),a(c,l),a(o,s),a(o,i),a(i,p),a(i,g),a(i,y),a(o,w),a(o,k),a(k,_),a(e,x),E||(j=v(o,"click",O),E=!0)},p(e,n){t=e,P.p(t,n)},d(t){t&&f(e),P.d(),E=!1,j()}}}function Et(e){let n,r;return n=new et({}),{c(){B(n.$$.fragment)},m(t,e){D(n,t,e),r=!0},p:t,i(t){r||(U(n.$$.fragment,t),r=!0)},o(t){A(n.$$.fragment,t),r=!1},d(t){F(n,t)}}}function jt(t){let e,n,r,o;const c=[vt,gt],l=[];function s(t,e){return t[1]?0:1}return e=s(t),n=l[e]=c[e](t),{c(){n.c(),r=g()},m(t,n){l[e].m(t,n),u(t,r,n),o=!0},p(t,[o]){let i=e;e=s(t),e===i?l[e].p(t,o):(J(),A(l[i],1,1,(()=>{l[i]=null})),R(),n=l[e],n?n.p(t,o):(n=l[e]=c[e](t),n.c()),U(n,1),n.m(r.parentNode,r))},i(t){o||(U(n),o=!0)},o(t){A(n),o=!1},d(t){l[e].d(t),t&&f(r)}}}function Nt(t,e,n){let{query:r}=e,{locale:o}=e;r=r.replace(",,","");let c,l=async function(t,e){return await Z(t,e)}(r,o),s=!1;function i(t){n(1,s=!0),n(2,c=JSON.stringify(t))}return t.$$set=t=>{"query"in t&&n(0,r=t.query),"locale"in t&&n(5,o=t.locale)},[r,s,c,i,l,o,t=>i(t)]}class St extends Q{constructor(t){super(),K(this,t,Nt,jt,c,{query:0,locale:5})}}function Lt(t,e,n){const r=t.slice();return r[4]=e[n],r}function qt(t,e,n){const r=t.slice();return r[7]=e[n],r}function Pt(e){return{c:t,m:t,p:t,i:t,o:t,d:t}}function Ot(e){let n,r,o,c,l,s,g,v,y,w,k,_,x,E,j,N,S,L,q=e[3].title+"",P=e[3].release_year+"",O=e[3].short_description+"",z=e[3].offers,C=[];for(let t=0;t<z.length;t+=1)C[t]=Ct(Lt(e,z,t));return{c(){n=d("div"),r=d("div"),o=m(),c=d("div"),l=d("div"),s=d("img"),v=m(),y=d("div"),w=d("h1"),k=h(q),_=m(),x=d("h3"),E=h(P),j=m(),N=d("p"),S=h(O),L=m();for(let t=0;t<C.length;t+=1)C[t].c();b(r,"background-color","transparent"),b(r,"height","15rem"),i(s.src,g=e[3].poster_uri)||$(s,"src",g),$(s,"alt","Poster for the "+e[3].type+" "+e[3].title),$(s,"class","svelte-1k9vcow"),$(y,"class","text svelte-1k9vcow"),b(l,"display","flex"),b(l,"align-items","left"),$(c,"class","box svelte-1k9vcow"),$(n,"class","selection svelte-1k9vcow"),b(n,"--backdrop-url","url("+e[3].backdrop_url+")")},m(t,e){u(t,n,e),a(n,r),a(n,o),a(n,c),a(c,l),a(l,s),a(l,v),a(l,y),a(y,w),a(w,k),a(y,_),a(y,x),a(x,E),a(y,j),a(y,N),a(N,S),a(y,L);for(let t=0;t<C.length;t+=1)C[t].m(y,null)},p(t,e){if(1&e){let n;for(z=t[3].offers,n=0;n<z.length;n+=1){const r=Lt(t,z,n);C[n]?C[n].p(r,e):(C[n]=Ct(r),C[n].c(),C[n].m(y,null))}for(;n<C.length;n+=1)C[n].d(1);C.length=z.length}},i:t,o:t,d(t){t&&f(n),p(C,t)}}}function zt(e){let n,r,o,c,l,s,p,g,v,y=e[7].clear_name+"";return{c(){n=d("div"),r=d("span"),o=d("a"),c=d("img"),s=m(),p=d("label"),g=h(y),i(c.src,l=e[7].icon_uri)||$(c,"src",l),$(c,"alt","Icon for "+e[7].clear_name),$(c,"id",e[7].short_name),$(c,"class","svelte-1k9vcow"),$(o,"href",e[7].url),$(p,"for",v=e[7].short_name),$(p,"class","svelte-1k9vcow"),b(r,"text-align","center"),b(r,"display","inline-block"),b(n,"display","inline-block")},m(t,e){u(t,n,e),a(n,r),a(r,o),a(o,c),a(r,s),a(r,p),a(p,g)},p:t,d(t){t&&f(n)}}}function Ct(t){let e,n,r,o,c,l=t[4].country+"",s=t[4].offers,i=[];for(let e=0;e<s.length;e+=1)i[e]=zt(qt(t,s,e));return{c(){e=d("div"),n=d("h4"),r=h(l),o=m();for(let t=0;t<i.length;t+=1)i[t].c();c=m(),$(e,"class","offer svelte-1k9vcow")},m(t,l){u(t,e,l),a(e,n),a(n,r),a(e,o);for(let t=0;t<i.length;t+=1)i[t].m(e,null);a(e,c)},p(t,n){if(1&n){let r;for(s=t[4].offers,r=0;r<s.length;r+=1){const o=qt(t,s,r);i[r]?i[r].p(o,n):(i[r]=zt(o),i[r].c(),i[r].m(e,c))}for(;r<i.length;r+=1)i[r].d(1);i.length=s.length}},d(t){t&&f(e),p(i,t)}}}function Tt(e){let n,r;return n=new et({}),{c(){B(n.$$.fragment)},m(t,e){D(n,t,e),r=!0},p:t,i(t){r||(U(n.$$.fragment,t),r=!0)},o(t){A(n.$$.fragment,t),r=!1},d(t){F(n,t)}}}function Ht(t){let e,n,r={ctx:t,current:null,token:null,hasCatch:!1,pending:Tt,then:Ot,catch:Pt,value:3,blocks:[,,,]};return I(t[0],r),{c(){e=g(),r.block.c()},m(t,o){u(t,e,o),r.block.m(t,r.anchor=o),r.mount=()=>e.parentNode,r.anchor=e,n=!0},p(e,[n]){M(r,t=e,n)},i(t){n||(U(r.block),n=!0)},o(t){for(let t=0;t<3;t+=1){A(r.blocks[t])}n=!1},d(t){t&&f(e),r.block.d(t),r.token=null,r=null}}}function Jt(t,e,n){let{providers:r}=e,{selection:o}=e;o=JSON.parse(o);let c=dt(o,r);return t.$$set=t=>{"providers"in t&&n(2,r=t.providers),"selection"in t&&n(1,o=t.selection)},[c,o,r]}class Rt extends Q{constructor(t){super(),K(this,t,Jt,Ht,c,{providers:2,selection:1})}}function Ut(e){return{c:t,m:t,p:t,i:t,o:t,d:t}}function At(t){let e,n,r,o;const c=[Bt,Mt,It],l=[];function s(t,e){return"search"==t[0]?0:"SearchResults"==t[0]?1:"Selection"==t[0]?2:-1}return~(e=s(t))&&(n=l[e]=c[e](t)),{c(){n&&n.c(),r=g()},m(t,n){~e&&l[e].m(t,n),u(t,r,n),o=!0},p(t,o){let i=e;e=s(t),e===i?~e&&l[e].p(t,o):(n&&(J(),A(l[i],1,1,(()=>{l[i]=null})),R()),~e?(n=l[e],n?n.p(t,o):(n=l[e]=c[e](t),n.c()),U(n,1),n.m(r.parentNode,r)):n=null)},i(t){o||(U(n),o=!0)},o(t){A(n),o=!1},d(t){~e&&l[e].d(t),t&&f(r)}}}function It(t){let e,n;return e=new Rt({props:{providers:t[4],selection:t[3]}}),{c(){B(e.$$.fragment)},m(t,r){D(e,t,r),n=!0},p(t,n){const r={};8&n&&(r.selection=t[3]),e.$set(r)},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){A(e.$$.fragment,t),n=!1},d(t){F(e,t)}}}function Mt(t){let e,n;return e=new St({props:{query:t[1]+",",locale:t[2]}}),{c(){B(e.$$.fragment)},m(t,r){D(e,t,r),n=!0},p(t,n){const r={};2&n&&(r.query=t[1]+","),4&n&&(r.locale=t[2]),e.$set(r)},i(t){n||(U(e.$$.fragment,t),n=!0)},o(t){A(e.$$.fragment,t),n=!1},d(t){F(e,t)}}}function Bt(e){let n,r;return n=new ft({}),{c(){B(n.$$.fragment)},m(t,e){D(n,t,e),r=!0},p:t,i(t){r||(U(n.$$.fragment,t),r=!0)},o(t){A(n.$$.fragment,t),r=!1},d(t){F(n,t)}}}function Dt(e){let n,r;return n=new et({}),{c(){B(n.$$.fragment)},m(t,e){D(n,t,e),r=!0},p:t,i(t){r||(U(n.$$.fragment,t),r=!0)},o(t){A(n.$$.fragment,t),r=!1},d(t){F(n,t)}}}function Ft(t){let e,n,r={ctx:t,current:null,token:null,hasCatch:!1,pending:Dt,then:At,catch:Ut,value:4,blocks:[,,,]};return I(t[4],r),{c(){e=g(),r.block.c()},m(t,o){u(t,e,o),r.block.m(t,r.anchor=o),r.mount=()=>e.parentNode,r.anchor=e,n=!0},p(e,[n]){M(r,t=e,n)},i(t){n||(U(r.block),n=!0)},o(t){for(let t=0;t<3;t+=1){A(r.blocks[t])}n=!1},d(t){t&&f(e),r.block.d(t),r.token=null,r=null}}}function Gt(t,e,n){let r=async function(){var t=await X(),e=[],n=t.map((async t=>{t.providers.forEach((t=>{if(t.monetization_types.includes("flatrate")||t.monetization_types.includes("free")||t.monetization_types.includes("ads")){var n=t.monetization_types,r=new RegExp("\\s*([0-9]+)").exec(t.icon_url);let o=null!=r?`https://www.justwatch.com/images/icon/${r[0]}/s100/icon.webp`:"NULL";e.push(new ht(t.id,t.short_name,t.clear_name,o,n))}}))}));return await Promise.all(n),[...new Map(e.map((t=>[t.id,t]))).values()]}(),{page:o="search"}=e,{search:c}=e,{locale:l}=e,{selection:s}=e;return t.$$set=t=>{"page"in t&&n(0,o=t.page),"search"in t&&n(1,c=t.search),"locale"in t&&n(2,l=t.locale),"selection"in t&&n(3,s=t.selection)},[o,c,l,s,r]}class Kt extends Q{constructor(t){super(),K(this,t,Gt,Ft,c,{page:0,search:1,locale:2,selection:3})}}function Qt(e){let n,r,o,c,l,s;return l=new Kt({}),{c(){n=d("meta"),r=d("html"),o=m(),c=d("main"),B(l.$$.fragment),document.title="Steaming Search",$(n,"name","viewport"),$(n,"content","width=device-width, initial-scale=1.0"),$(r,"lang","en")},m(t,e){a(document.head,n),a(document.head,r),u(t,o,e),u(t,c,e),D(l,c,null),s=!0},p:t,i(t){s||(U(l.$$.fragment,t),s=!0)},o(t){A(l.$$.fragment,t),s=!1},d(t){f(n),f(r),t&&f(o),t&&f(c),F(l)}}}return new class extends Q{constructor(t){super(),K(this,t,null,Qt,c,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
