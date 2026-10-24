var Lt=Object.defineProperty;var jt=Object.getOwnPropertyDescriptor;var h=(n,e,t,i)=>{for(var s=i>1?void 0:i?jt(e,t):e,r=n.length-1,o;r>=0;r--)(o=n[r])&&(s=(i?o(e,t,s):o(s))||s);return i&&s&&Lt(e,t,s),s};var D=globalThis,K=D.ShadowRoot&&(D.ShadyCSS===void 0||D.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,G=Symbol(),ht=new WeakMap,O=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==G)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(K&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=ht.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&ht.set(t,e))}return e}toString(){return this.cssText}},ut=n=>new O(typeof n=="string"?n:n+"",void 0,G),$=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((i,s,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+n[r+1],n[0]);return new O(t,n,G)},mt=(n,e)=>{if(K)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),s=D.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=t.cssText,n.appendChild(i)}},Y=K?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return ut(t)})(n):n;var{is:qt,defineProperty:Dt,getOwnPropertyDescriptor:Kt,getOwnPropertyNames:Wt,getOwnPropertySymbols:Bt,getPrototypeOf:Vt}=Object,W=globalThis,ft=W.trustedTypes,Ft=ft?ft.emptyScript:"",Jt=W.reactiveElementPolyfillSupport,N=(n,e)=>n,H={toAttribute(n,e){switch(e){case Boolean:n=n?Ft:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},B=(n,e)=>!qt(n,e),gt={attribute:!0,type:String,converter:H,reflect:!1,useDefault:!1,hasChanged:B};Symbol.metadata??=Symbol("metadata"),W.litPropertyMetadata??=new WeakMap;var x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=gt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),s=this.getPropertyDescriptor(e,i,t);s!==void 0&&Dt(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){let{get:s,set:r}=Kt(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:s,set(o){let c=s?.call(this);r?.call(this,o),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??gt}static _$Ei(){if(this.hasOwnProperty(N("elementProperties")))return;let e=Vt(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(N("properties"))){let t=this.properties,i=[...Wt(t),...Bt(t)];for(let s of i)this.createProperty(s,t[s])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,s]of t)this.elementProperties.set(i,s)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let s=this._$Eu(t,i);s!==void 0&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let s of i)t.unshift(Y(s))}else e!==void 0&&t.push(Y(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return mt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(s!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:H).toAttribute(t,i.type);this._$Em=e,r==null?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){let i=this.constructor,s=i._$Eh.get(e);if(s!==void 0&&this._$Em!==s){let r=i.getPropertyOptions(s),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:H;this._$Em=s;let c=o.fromAttribute(t,r.type);this[s]=c??this._$Ej?.get(s)??c,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(e!==void 0){let o=this.constructor;if(s===!1&&(r=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??B)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),r!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),s===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[s,r]of this._$Ep)this[s]=r;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[s,r]of i){let{wrapped:o}=r,c=this[s];o!==!0||this._$AL.has(s)||c===void 0||this.C(s,void 0,r,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[N("elementProperties")]=new Map,x[N("finalized")]=new Map,Jt?.({ReactiveElement:x}),(W.reactiveElementVersions??=[]).push("2.1.2");var ot=globalThis,vt=n=>n,V=ot.trustedTypes,bt=V?V.createPolicy("lit-html",{createHTML:n=>n}):void 0,At="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,Et="?"+A,Qt=`<${Et}>`,M=document,R=()=>M.createComment(""),I=n=>n===null||typeof n!="object"&&typeof n!="function",at=Array.isArray,Xt=n=>at(n)||typeof n?.[Symbol.iterator]=="function",tt=`[ 	
\f\r]`,U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_t=/-->/g,yt=/>/g,S=RegExp(`>|${tt}(?:([^\\s"'>=/]+)(${tt}*=${tt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),$t=/'/g,xt=/"/g,kt=/^(?:script|style|textarea|title)$/i,lt=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),d=lt(1),me=lt(2),fe=lt(3),T=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),wt=new WeakMap,C=M.createTreeWalker(M,129);function St(n,e){if(!at(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return bt!==void 0?bt.createHTML(e):e}var Zt=(n,e)=>{let t=n.length-1,i=[],s,r=e===2?"<svg>":e===3?"<math>":"",o=U;for(let c=0;c<t;c++){let a=n[c],u,m,p=-1,g=0;for(;g<a.length&&(o.lastIndex=g,m=o.exec(a),m!==null);)g=o.lastIndex,o===U?m[1]==="!--"?o=_t:m[1]!==void 0?o=yt:m[2]!==void 0?(kt.test(m[2])&&(s=RegExp("</"+m[2],"g")),o=S):m[3]!==void 0&&(o=S):o===S?m[0]===">"?(o=s??U,p=-1):m[1]===void 0?p=-2:(p=o.lastIndex-m[2].length,u=m[1],o=m[3]===void 0?S:m[3]==='"'?xt:$t):o===xt||o===$t?o=S:o===_t||o===yt?o=U:(o=S,s=void 0);let v=o===S&&n[c+1].startsWith("/>")?" ":"";r+=o===U?a+Qt:p>=0?(i.push(u),a.slice(0,p)+At+a.slice(p)+A+v):a+A+(p===-2?c:v)}return[St(n,r+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},L=class n{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,o=0,c=e.length-1,a=this.parts,[u,m]=Zt(e,t);if(this.el=n.createElement(u,i),C.currentNode=this.el.content,t===2||t===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(s=C.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(let p of s.getAttributeNames())if(p.endsWith(At)){let g=m[o++],v=s.getAttribute(p).split(A),k=/([.?@])?(.*)/.exec(g);a.push({type:1,index:r,name:k[2],strings:v,ctor:k[1]==="."?it:k[1]==="?"?st:k[1]==="@"?nt:z}),s.removeAttribute(p)}else p.startsWith(A)&&(a.push({type:6,index:r}),s.removeAttribute(p));if(kt.test(s.tagName)){let p=s.textContent.split(A),g=p.length-1;if(g>0){s.textContent=V?V.emptyScript:"";for(let v=0;v<g;v++)s.append(p[v],R()),C.nextNode(),a.push({type:2,index:++r});s.append(p[g],R())}}}else if(s.nodeType===8)if(s.data===Et)a.push({type:2,index:r});else{let p=-1;for(;(p=s.data.indexOf(A,p+1))!==-1;)a.push({type:7,index:r}),p+=A.length-1}r++}}static createElement(e,t){let i=M.createElement("template");return i.innerHTML=e,i}};function P(n,e,t=n,i){if(e===T)return e;let s=i!==void 0?t._$Co?.[i]:t._$Cl,r=I(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),r===void 0?s=void 0:(s=new r(n),s._$AT(n,t,i)),i!==void 0?(t._$Co??=[])[i]=s:t._$Cl=s),s!==void 0&&(e=P(n,s._$AS(n,e.values),s,i)),e}var et=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??M).importNode(t,!0);C.currentNode=s;let r=C.nextNode(),o=0,c=0,a=i[0];for(;a!==void 0;){if(o===a.index){let u;a.type===2?u=new j(r,r.nextSibling,this,e):a.type===1?u=new a.ctor(r,a.name,a.strings,this,e):a.type===6&&(u=new rt(r,this,e)),this._$AV.push(u),a=i[++c]}o!==a?.index&&(r=C.nextNode(),o++)}return C.currentNode=M,s}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},j=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=P(this,e,t),I(e)?e===l||e==null||e===""?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==T&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Xt(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&I(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,s=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=L.createElement(St(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{let r=new et(s,this),o=r.u(this.options);r.p(t),this.T(o),this._$AH=r}}_$AC(e){let t=wt.get(e.strings);return t===void 0&&wt.set(e.strings,t=new L(e)),t}k(e){at(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,s=0;for(let r of e)s===t.length?t.push(i=new n(this.O(R()),this.O(R()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=vt(e).nextSibling;vt(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},z=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=l}_$AI(e,t=this,i,s){let r=this.strings,o=!1;if(r===void 0)e=P(this,e,t,0),o=!I(e)||e!==this._$AH&&e!==T,o&&(this._$AH=e);else{let c=e,a,u;for(e=r[0],a=0;a<r.length-1;a++)u=P(this,c[i+a],t,a),u===T&&(u=this._$AH[a]),o||=!I(u)||u!==this._$AH[a],u===l?e=l:e!==l&&(e+=(u??"")+r[a+1]),this._$AH[a]=u}o&&!s&&this.j(e)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},it=class extends z{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},st=class extends z{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},nt=class extends z{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=P(this,e,t,0)??l)===T)return;let i=this._$AH,s=e===l&&i!==l||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==l&&(i===l||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},rt=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){P(this,e)}};var Gt=ot.litHtmlPolyfillSupport;Gt?.(L,j),(ot.litHtmlVersions??=[]).push("3.3.3");var Ct=(n,e,t)=>{let i=t?.renderBefore??e,s=i._$litPart$;if(s===void 0){let r=t?.renderBefore??null;i._$litPart$=s=new j(e.insertBefore(R(),r),r,void 0,t??{})}return s._$AI(n),s};var ct=globalThis,_=class extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Ct(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return T}};_._$litElement$=!0,_.finalized=!0,ct.litElementHydrateSupport?.({LitElement:_});var Yt=ct.litElementPolyfillSupport;Yt?.({LitElement:_});(ct.litElementVersions??=[]).push("4.2.2");var te={attribute:!0,type:String,converter:H,reflect:!1,hasChanged:B},ee=(n=te,e,t)=>{let{kind:i,metadata:s}=t,r=globalThis.litPropertyMetadata.get(s);if(r===void 0&&globalThis.litPropertyMetadata.set(s,r=new Map),i==="setter"&&((n=Object.create(n)).wrapped=!0),r.set(t.name,n),i==="accessor"){let{name:o}=t;return{set(c){let a=e.get.call(this);e.set.call(this,c),this.requestUpdate(o,a,n,!0,c)},init(c){return c!==void 0&&this.C(o,void 0,n,c),c}}}if(i==="setter"){let{name:o}=t;return function(c){let a=this[o];e.call(this,c),this.requestUpdate(o,a,n,!0,c)}}throw Error("Unsupported decorator location: "+i)};function y(n){return(e,t)=>typeof t=="object"?ee(n,e,t):((i,s,r)=>{let o=s.hasOwnProperty(r);return s.constructor.createProperty(r,i),o?Object.getOwnPropertyDescriptor(s,r):void 0})(n,e,t)}function f(n){return y({...n,state:!0,attribute:!1})}var Mt=[1,3,5,10,15,30,60,120],Tt=[0,10,20,30,60],Pt=["light","switch","fan","input_boolean"],ie=["non_disponibile","spenta","in_corso","tenuta","timer_disattivato"];function se(n){return ie.includes(String(n))?n:"non_disponibile"}function ne(n){let e=Math.max(0,Math.ceil(n/1e3)),t=Math.floor(e/3600),i=Math.floor(e%3600/60),s=e%60,r=String(i).padStart(2,"0"),o=String(s).padStart(2,"0");return t>0?`${t}:${r}:${o}`:`${r}:${o}`}function J(n){if(n<60)return`${n} min`;let e=Math.floor(n/60),t=n%60;return t===0?`${e} h`:`${e} h ${t} min`}function re(n){if(typeof n!="string"||n==="unknown"||n==="unavailable"||n==="")return null;let e=Date.parse(n);return Number.isNaN(e)?null:e}function zt(n,e,t){let i=n.entities,s=e[n.entity]?.state,r=i.stato?e[i.stato]:void 0,o=se(r?.state??n.status),c=Number(i.durata?e[i.durata]?.state:NaN),a=Number.isFinite(c)&&c>0?Math.round(c):n.minutes,u=re(i.scadenza?e[i.scadenza]?.state:n.end),m=(i.attivo?e[i.attivo]?.state:n.enabled?"on":"off")==="on",p=s==="on",g="off",v=`Spenta \xB7 timer ${J(a)}${m?"":" (disattivato)"}`,k=null;if(s==="unavailable"||s===void 0||o==="non_disponibile")g="bad",v="Non disponibile";else if(p)if(o==="in_corso"&&u!==null){let Z=Math.max(0,u-t);g="running",v=Z>0?`Spegne tra ${ne(Z)}`:"Sta per spegnersi",k=Math.min(1,Z/(a*6e4))}else o==="tenuta"?(g="held",v="Tenuta accesa"):(g="idle",v="Accesa \xB7 timer disattivato");return{key:n.key,entity:n.entity,name:n.name,on:p,tone:g,subtitle:v,progress:k,running:o==="in_corso",held:o==="tenuta",timerOn:m,minutes:a}}function Ot(n,e){return e?n.filter(t=>t.on):n}function Nt(n,e){if(n.length===0)return"Nessuna luce: aggiungine una con l'ingranaggio.";let t=n.filter(o=>o.on).length,i=n.filter(o=>o.running).length,s=n.filter(o=>o.held).length,r=[t===0?"Tutte spente":`${t} ${t===1?"accesa":"accese"}`];return i&&r.push(`${i} timer in corso`),s&&r.push(`${s} ${s===1?"tenuta accesa":"tenute accese"}`),e||r.push("timer disattivati"),r.join(" \xB7 ")}function q(n){return n.split(".",1)[0]}function oe(n){return/^[a-z_]+\.[a-z0-9_]+$/.test(n)&&Pt.includes(q(n))}function ae(n,e){return oe(n.entity)?e.filter(t=>t.entity===n.entity).length>1?"Questa luce \xE8 gi\xE0 nell'elenco.":!Number.isInteger(n.minutes)||n.minutes<1||n.minutes>720?"La durata deve essere tra 1 minuto e 12 ore.":n.motions.length>6?"Al massimo 6 sensori per luce.":n.motions.some(t=>!/^(binary_sensor|input_boolean)\.[a-z0-9_]+$/.test(t))?"Un sensore di movimento non \xE8 valido.":null:"Scegli una luce, presa o ventola valida."}function dt(n){for(let e of n){let t=ae(e,n);if(t)return`${e.name||e.entity}: ${t}`}return null}function Ht(n,e){let t=e?.trim()||n.split(".")[1].replace(/_/g," ").replace(/^./,i=>i.toUpperCase());return{entity:n,name:t,minutes:5,enabled:!0,motions:[],warn_seconds:0}}function Ut(n,e){return Object.values(n).filter(t=>Pt.includes(q(t.entity_id))&&!e.includes(t.entity_id)).map(t=>({id:t.entity_id,name:String(t.attributes.friendly_name??t.entity_id)})).sort((t,i)=>t.name.localeCompare(i.name,"it"))}var le=["motion","occupancy","presence","door","opening","garage_door","window"];function Rt(n,e=[]){return Object.values(n).filter(t=>q(t.entity_id)==="binary_sensor"&&le.includes(String(t.attributes.device_class))&&!e.includes(t.entity_id)).map(t=>({id:t.entity_id,name:String(t.attributes.friendly_name??t.entity_id)})).sort((t,i)=>t.name.localeCompare(i.name,"it"))}function pt(n,e){let t=n[e]?.attributes.friendly_name;return typeof t=="string"&&t?t:e}function It(n){if(n.runs===0)return"Nessuna accensione negli ultimi giorni.";let e=[`${n.runs} ${n.runs===1?"accensione":"accensioni"}`,`${n.expired} spente dal timer`,`${n.manual} a mano`];return n.avg_minutes!==null&&e.push(`durata media ${String(n.avg_minutes).replace(".",",")} min`),e.join(" \xB7 ")}function Q(n){return Math.min(720,Math.max(1,Math.round(n)))}var X=$`
  :host {
    position: fixed;
    inset: 0;
    z-index: 10000;
    color: var(--primary-text-color, #212121);
    font-family: var(--paper-font-body1_-_font-family, Roboto, Helvetica, Arial, sans-serif);
  }
  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px;
    box-sizing: border-box;
  }
  .panel {
    background: var(--card-background-color, #fff);
    border-radius: 16px;
    width: 100%;
    max-width: 560px;
    max-height: min(88vh, 780px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  }
  .panel.wide {
    max-width: 760px;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-bottom: 1px solid var(--divider-color, #e0e0e0);
  }
  .title {
    font-size: 1.1rem;
    font-weight: 600;
  }
  .x {
    border: 0;
    background: transparent;
    color: inherit;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 8px;
  }
  .x:hover {
    background: var(--secondary-background-color, #f0f0f0);
  }
  .body {
    overflow: auto;
    padding: 12px 16px 16px;
  }
  .foot {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding: 10px 16px;
    border-top: 1px solid var(--divider-color, #e0e0e0);
  }
  .btn {
    border: 1px solid var(--divider-color, #ccc);
    background: var(--secondary-background-color, #f4f4f4);
    color: inherit;
    border-radius: 10px;
    padding: 8px 14px;
    font-size: 0.9rem;
    cursor: pointer;
  }
  .btn.primary {
    background: var(--primary-color, #03a9f4);
    color: #fff;
    border-color: transparent;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: default;
  }
  .err {
    margin-top: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    background: rgba(220, 38, 38, 0.12);
    color: #b91c1c;
    font-size: 0.85rem;
  }
  .ok {
    margin-top: 10px;
    padding: 8px 10px;
    border-radius: 8px;
    background: rgba(22, 163, 74, 0.12);
    color: #166534;
    font-size: 0.85rem;
  }
  .empty {
    padding: 24px 8px;
    text-align: center;
    color: var(--secondary-text-color, #727272);
  }
`;var b=class extends _{constructor(){super(...arguments);this.openKey="";this._lights=[];this._master=!0;this._open="";this._add="";this._mot="";this._busy=!1;this._error="";this._onKey=t=>{t.key==="Escape"&&this._close()}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),this._lights=this.info.lights.map(t=>({entity:t.entity,name:t.name,minutes:t.minutes,enabled:t.enabled,motions:[...t.motions],warn_seconds:t.warn_seconds})),this._master=this.info.enabled,this._open=this.openKey}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey)}_close(){this.dispatchEvent(new CustomEvent("closed")),this.remove()}_patch(t,i){this._lights=this._lights.map(s=>s.entity===t?{...s,...i}:s)}_remove(t){this._lights=this._lights.filter(i=>i.entity!==t),this._open===t&&(this._open="")}_addLight(){let t=this._add.trim();if(!t)return;if(this._lights.some(s=>s.entity===t)){this._error="Questa luce \xE8 gi\xE0 nell'elenco.";return}if(!this.hass.states[t]&&!/^[a-z_]+\.[a-z0-9_]+$/.test(t)){this._error="Scegli un'entit\xE0 dall'elenco.";return}let i=this.hass.states[t]?.attributes.friendly_name;this._lights=[...this._lights,Ht(t,typeof i=="string"?i:void 0)],this._open=t,this._add="",this._error=""}async _save(){let t=dt(this._lights);if(t){this._error=t;return}this._busy=!0,this._error="";try{await this.hass.callWS({type:"luci_timer/update",entry_id:this.info.entry_id,enabled:this._master,lights:this._lights}),this.dispatchEvent(new CustomEvent("saved")),this._close()}catch(i){let s=i instanceof Error?i.message:i?.message??String(i);this._error=`Impossibile salvare: ${s}`}finally{this._busy=!1}}_editor(t){let i=Rt(this.hass.states,t.motions),s=q(t.entity)==="light";return d`
      <div class="ed">
        <div class="link"><ha-icon icon="mdi:link-variant"></ha-icon>Collegata a <b>${pt(this.hass.states,t.entity)}</b> <code>${t.entity}</code> · ora ${this.hass.states[t.entity]?.state==="on"?"accesa":this.hass.states[t.entity]?.state==="off"?"spenta":"non disponibile"}</div>
        <label class="f">Nome<input class="txt" .value=${t.name} @change=${r=>this._patch(t.entity,{name:r.target.value.trim()||t.name})} /></label>
        <div class="f">Durata del timer
          <div class="chips">
            ${Mt.map(r=>d`<button class=${t.minutes===r?"chip on":"chip"} @click=${()=>this._patch(t.entity,{minutes:r})}>${J(r)}</button>`)}
          </div>
          <div class="step">
            <button class="st" aria-label="Meno" @click=${()=>this._patch(t.entity,{minutes:Q(t.minutes-1)})}>−</button>
            <input class="num" inputmode="numeric" .value=${String(t.minutes)} @change=${r=>{let o=Number(r.target.value.replace(",","."));this._patch(t.entity,{minutes:Number.isFinite(o)?Q(o):t.minutes})}} />
            <span class="u">min</span>
            <button class="st" aria-label="Più" @click=${()=>this._patch(t.entity,{minutes:Q(t.minutes+1)})}>+</button>
          </div>
        </div>
        <div class="row"><div class="t"><div class="lab">Timer attivo</div><div class="hint">Se è spento la luce resta accesa finché non la spegni.</div></div>
          <button class=${t.enabled?"sw on":"sw"} role="switch" aria-checked=${t.enabled?"true":"false"} aria-label="Timer attivo" @click=${()=>this._patch(t.entity,{enabled:!t.enabled})}><span class="knob"></span></button></div>
        <div class="f">Sensori di movimento o porte (facoltativi)
          <div class="chips">
            ${t.motions.map(r=>d`<span class="tag">${pt(this.hass.states,r)}<button aria-label=${`Togli ${r}`} @click=${()=>this._patch(t.entity,{motions:t.motions.filter(o=>o!==r)})}>✕</button></span>`)}
            ${t.motions.length===0?d`<span class="hint">Nessuno</span>`:l}
          </div>
          <div class="addrow">
            <input class="txt" list=${`dl-mot-${t.entity}`} placeholder="binary_sensor.nome" .value=${this._mot} @input=${r=>this._mot=r.target.value} />
            <datalist id=${`dl-mot-${t.entity}`}>${i.map(r=>d`<option value=${r.id}>${r.name}</option>`)}</datalist>
            <button class="btn" ?disabled=${!this._mot.trim()} @click=${()=>{let r=this._mot.trim();r&&!t.motions.includes(r)&&this._patch(t.entity,{motions:[...t.motions,r]}),this._mot=""}}>Aggiungi</button>
          </div>
          <span class="hint">Alla scadenza, se uno di questi è ancora attivo, il timer riparte invece di spegnere.</span>
        </div>
        ${s?d`<div class="f">Avviso prima dello spegnimento
              <div class="chips">${Tt.map(r=>d`<button class=${t.warn_seconds===r?"chip on":"chip"} @click=${()=>this._patch(t.entity,{warn_seconds:r})}>${r===0?"Nessuno":`${r} s prima`}</button>`)}</div>
              <span class="hint">La luce si abbassa un istante per avvisare che sta per spegnersi.</span></div>`:l}
        <button class="btn del" @click=${()=>this._remove(t.entity)}>Togli dall'elenco</button>
      </div>`}render(){if(!this.info)return l;let t=dt(this._lights),i=Ut(this.hass.states,this._lights.map(s=>s.entity));return d`
      <div class="backdrop" @click=${s=>s.target===s.currentTarget&&this._close()}>
        <div class="panel" role="dialog" aria-modal="true" aria-label="Preferenze timer luci">
          <div class="head"><div class="title">Preferenze dei timer</div><button class="x" aria-label="Chiudi" @click=${()=>this._close()}>✕</button></div>
          <div class="body">
            <div class="row"><div class="t"><div class="lab">Timer attivi</div><div class="hint">Interruttore generale: spento, nessuna luce si spegne da sola.</div></div>
              <button class=${this._master?"sw on":"sw"} role="switch" aria-checked=${this._master?"true":"false"} aria-label="Timer attivi" @click=${()=>this._master=!this._master}><span class="knob"></span></button></div>

            <div class="sec">Luci con timer</div>
            ${this._lights.length===0?d`<div class="empty">Nessuna luce: aggiungine una qui sotto.</div>`:l}
            ${this._lights.map(s=>d`
                <div class="item">
                  <button class="head2" aria-expanded=${this._open===s.entity?"true":"false"} @click=${()=>this._open=this._open===s.entity?"":s.entity}>
                    <span class="nm">${s.name}<span class="eid">${s.entity}</span></span>
                    <span class="meta">${s.enabled?J(s.minutes):"timer spento"}${s.motions.length?` \xB7 ${s.motions.length} ${s.motions.length===1?"sensore":"sensori"}`:""}</span>
                    <span class="chev">${this._open===s.entity?"\u25BE":"\u25B8"}</span>
                  </button>
                  ${this._open===s.entity?this._editor(s):l}
                </div>`)}

            <div class="sec">Aggiungi una luce</div>
            <div class="addrow">
              <input class="txt" list="dl-add" placeholder="light.nome, switch.nome…" .value=${this._add} @input=${s=>this._add=s.target.value} />
              <datalist id="dl-add">${i.map(s=>d`<option value=${s.id}>${s.name}</option>`)}</datalist>
              <button class="btn primary" ?disabled=${!this._add.trim()} @click=${()=>this._addLight()}>Aggiungi</button>
            </div>

            ${t?d`<div class="err">${t}</div>`:l}
            ${this._error?d`<div class="err">${this._error}</div>`:l}
          </div>
          <div class="foot">
            <button class="btn" @click=${()=>this._close()}>Annulla</button>
            <button class="btn primary" ?disabled=${this._busy||!!t} @click=${()=>void this._save()}>Salva</button>
          </div>
        </div>
      </div>`}static{this.styles=[X,$`
      .sec { font-weight: 600; font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--secondary-text-color, #727272); margin: 16px 0 6px; }
      .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 0; }
      .t { flex: 1; min-width: 0; } .lab { font-size: 0.95rem; }
      .hint { font-size: 0.78rem; color: var(--secondary-text-color, #727272); margin-top: 2px; line-height: 1.3; }
      .sw { flex: none; width: 52px; height: 30px; border-radius: 15px; border: 0; background: var(--disabled-color, #bdbdbd); position: relative; cursor: pointer; transition: background 0.2s; }
      .sw.on { background: var(--primary-color, #03a9f4); }
      .sw .knob { position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
      .sw.on .knob { transform: translateX(22px); }
      .item { border: 1px solid var(--divider-color, #ddd); border-radius: 12px; margin-bottom: 8px; overflow: hidden; }
      .head2 { width: 100%; display: flex; align-items: center; gap: 10px; padding: 12px 14px; min-height: 48px; background: transparent; border: 0; color: inherit; cursor: pointer; text-align: left; font-size: 0.95rem; }
      .nm { flex: 1; font-weight: 500; display: flex; flex-direction: column; min-width: 0; }
      .eid { font-weight: 400; font-size: 0.75rem; color: var(--secondary-text-color, #727272); overflow: hidden; text-overflow: ellipsis; }
      .link { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-top: 12px; padding: 10px 12px; border-radius: 10px; background: var(--secondary-background-color, #f2f2f2); font-size: 0.85rem; }
      .link ha-icon { --mdc-icon-size: 18px; }
      .link code { font-size: 0.78rem; color: var(--secondary-text-color, #727272); } .meta { color: var(--secondary-text-color, #727272); font-size: 0.85rem; } .chev { color: var(--secondary-text-color, #727272); }
      .ed { padding: 4px 14px 14px; border-top: 1px solid var(--divider-color, #eee); }
      .f { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; font-size: 0.85rem; color: var(--secondary-text-color, #727272); }
      .txt { box-sizing: border-box; width: 100%; padding: 11px 12px; border-radius: 10px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); font-size: 0.95rem; min-height: 44px; }
      .chips { display: flex; gap: 8px; flex-wrap: wrap; }
      .chip { min-height: 44px; padding: 0 14px; border-radius: 22px; border: 1px solid var(--divider-color, #ccc); background: transparent; color: var(--primary-text-color, #212121); font-size: 0.9rem; cursor: pointer; }
      .chip.on { background: var(--primary-color, #03a9f4); color: #fff; border-color: transparent; }
      .step { display: flex; align-items: center; gap: 8px; }
      .st { width: 48px; height: 48px; border-radius: 12px; border: 1px solid var(--divider-color, #ccc); background: var(--secondary-background-color, #f4f4f4); color: var(--primary-text-color, #212121); font-size: 1.3rem; cursor: pointer; }
      .num { width: 76px; text-align: center; padding: 11px 6px; border-radius: 10px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff); color: var(--primary-text-color, #212121); font-size: 1rem; }
      .u { color: var(--secondary-text-color, #727272); }
      .del { margin-top: 14px; color: #b91c1c; }
      .addrow { display: flex; gap: 8px; } .addrow .txt { flex: 1; }
      .tag { display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 0 6px 0 12px; border-radius: 18px; background: var(--secondary-background-color, #eee); color: var(--primary-text-color, #212121); font-size: 0.85rem; }
      .tag button { border: 0; background: transparent; color: inherit; width: 30px; height: 30px; border-radius: 15px; cursor: pointer; }
    `]}};h([y({attribute:!1})],b.prototype,"hass",2),h([y({attribute:!1})],b.prototype,"info",2),h([y()],b.prototype,"openKey",2),h([f()],b.prototype,"_lights",2),h([f()],b.prototype,"_master",2),h([f()],b.prototype,"_open",2),h([f()],b.prototype,"_add",2),h([f()],b.prototype,"_mot",2),h([f()],b.prototype,"_busy",2),h([f()],b.prototype,"_error",2);customElements.get("luci-settings-dialog")||customElements.define("luci-settings-dialog",b);var E=class extends _{constructor(){super(...arguments);this._stats=null;this._error="";this._applied=new Set;this._onKey=t=>{t.key==="Escape"&&this._close()}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),this._load()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey)}_close(){this.dispatchEvent(new CustomEvent("closed")),this.remove()}async _load(){try{this._stats=await this.hass.callWS({type:"luci_timer/stats",entry_id:this.info.entry_id})}catch(t){this._error=`Impossibile leggere le statistiche: ${t instanceof Error?t.message:t?.message??String(t)}`}}async _apply(t,i,s){if(i)try{await this.hass.callService("number","set_value",{entity_id:i,value:s}),this._applied=new Set([...this._applied,t]),this.dispatchEvent(new CustomEvent("saved"))}catch(r){this._error=`Impossibile cambiare la durata: ${r instanceof Error?r.message:String(r)}`}}render(){return d`
      <div class="backdrop" @click=${t=>t.target===t.currentTarget&&this._close()}>
        <div class="panel" role="dialog" aria-modal="true" aria-label="Statistiche timer luci">
          <div class="head"><div class="title">Statistiche (30 giorni)</div><button class="x" aria-label="Chiudi" @click=${()=>this._close()}>✕</button></div>
          <div class="body">
            ${this._stats===null&&!this._error?d`<div class="empty">Carico…</div>`:l}
            ${this._stats?this.info.lights.map(t=>{let i=this._stats[t.key];return i?d`
                    <div class="card">
                      <div class="nm">${t.name}</div>
                      <div class="ln">${It(i)}</div>
                      ${i.advice?d`<div class="adv">${i.advice}</div>`:l}
                      ${i.suggested_minutes&&!this._applied.has(t.key)?d`<button class="btn primary" @click=${()=>void this._apply(t.key,t.entities.durata,i.suggested_minutes)}>Usa ${i.suggested_minutes} minuti</button>`:l}
                      ${this._applied.has(t.key)?d`<div class="okbox">Durata aggiornata.</div>`:l}
                    </div>`:l}):l}
            ${this._error?d`<div class="err">${this._error}</div>`:l}
          </div>
        </div>
      </div>`}static{this.styles=[X,$`
      .card { padding: 12px 14px; margin-bottom: 10px; border: 1px solid var(--divider-color, #ddd); border-radius: 12px; }
      .nm { font-weight: 600; } .ln { font-size: 0.85rem; color: var(--secondary-text-color, #727272); margin-top: 3px; }
      .adv { margin-top: 6px; font-size: 0.9rem; } .card .btn { margin-top: 8px; min-height: 44px; }
      .okbox { margin-top: 8px; font-size: 0.85rem; color: #166534; }
    `]}};h([y({attribute:!1})],E.prototype,"hass",2),h([y({attribute:!1})],E.prototype,"info",2),h([f()],E.prototype,"_stats",2),h([f()],E.prototype,"_error",2),h([f()],E.prototype,"_applied",2);customElements.get("luci-stats-dialog")||customElements.define("luci-stats-dialog",E);var w=class extends _{constructor(){super(...arguments);this._config={type:"custom:luci-timer-card"};this._info=null;this._error="";this._now=Date.now();this._onlyOn=!1;this._loadedAt=0;this._loading=!1;this._syncers=new Set}setConfig(t){this._config={...t},this._onlyOn=t.only_on===!0,this._info=null,this._loadedAt=0}getCardSize(){return 6}static getStubConfig(){return{type:"custom:luci-timer-card"}}connectedCallback(){super.connectedCallback(),this._tick=window.setInterval(()=>this._now=Date.now(),1e3)}disconnectedCallback(){super.disconnectedCallback(),this._tick&&window.clearInterval(this._tick)}willUpdate(){for(let t of this._syncers)t()}updated(){this.hass&&!this._loading&&(!this._info||Date.now()-this._loadedAt>5*6e4)&&this._loadInfo()}async _loadInfo(){this._loading=!0;try{let t={type:"luci_timer/info"};this._config.entry_id&&(t.entry_id=this._config.entry_id),this._info=await this.hass.callWS(t),this._error=""}catch(t){let i=t instanceof Error?t.message:t?.message??String(t);this._error=`Timer luci non configurato o integrazione non caricata (${i}).`}finally{this._loadedAt=Date.now(),this._loading=!1}}async _open(t,i=""){if(!this._info)return;for(;this._loading;)await new Promise(o=>setTimeout(o,50));if(await this._loadInfo(),!this._info)return;let s=document.createElement(t);s.hass=this.hass,s.info=this._info,i&&(s.openKey=i),s.addEventListener("saved",()=>{this._loadedAt=0,this._loadInfo()}),document.body.appendChild(s);let r=()=>{s.isConnected&&(s.hass=this.hass)};this._syncers.add(r),s.addEventListener("closed",()=>this._syncers.delete(r))}_act(t,i,s=5){this.hass.callWS({type:"luci_timer/action",entry_id:this._info?.entry_id,entity:t,action:i,minutes:s})}_toggle(t){this.hass.callService("homeassistant","toggle",{entity_id:t})}_toggleMaster(t){let i=this._info?.entities.generale;i&&this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:i})}_tile(t){return d`
      <div class="tile ${t.tone}">
        <div class="top">
          <button class="power" aria-label=${t.on?`Spegni ${t.name}`:`Accendi ${t.name}`} aria-pressed=${t.on?"true":"false"} @click=${()=>this._toggle(t.entity)}>
            <ha-icon icon=${t.on?"mdi:lightbulb-on":"mdi:lightbulb-outline"}></ha-icon>
          </button>
          <button class="name" @click=${()=>void this._open("luci-settings-dialog",t.entity)} aria-label=${`Impostazioni di ${t.name}`}>
            <span class="n">${t.name}</span>
            <span class="s">${t.subtitle}</span>
          </button>
        </div>
        ${t.progress!==null?d`<div class="bar"><i style="width:${(t.progress*100).toFixed(1)}%"></i></div>`:l}
        ${t.on?d`<div class="acts">
              ${t.running||t.held?d`<button class="a" @click=${()=>this._act(t.entity,"extend",5)}>+5 min</button>`:l}
              ${t.held?d`<button class="a" @click=${()=>this._act(t.entity,"release")}>Riprendi timer</button>`:t.running?d`<button class="a" @click=${()=>this._act(t.entity,"hold")}>Tieni accesa</button>`:l}
              <button class="a off" @click=${()=>this._act(t.entity,"off_now")}>Spegni</button>
            </div>`:l}
      </div>`}render(){if(!this.hass)return l;let t=this._config.title??this._info?.title??"Timer luci";if(this._error&&!this._info)return d`<ha-card><div class="pad"><div class="title">${t}</div><div class="errbox">${this._error}</div></div></ha-card>`;if(!this._info)return d`<ha-card><div class="pad"><div class="title">${t}</div><div class="muted">Carico…</div></div></ha-card>`;let i=this.hass.states[this._info.entities.generale??""]?.state!=="off",s=Array.isArray(this._config.lights)?this._config.lights:null,o=(s?this._info.lights.filter(a=>s.includes(a.entity)):this._info.lights).map(a=>zt(a,this.hass.states,this._now)),c=Ot([...o].sort((a,u)=>Number(u.on)-Number(a.on)),this._onlyOn&&this._config.header!==!1);return this._config.header===!1?d`<ha-card><div class="pad compact"><div class="grid">${c.map(a=>this._tile(a))}</div></div></ha-card>`:d`
      <ha-card>
        <div class="pad">
          <div class="head">
            <div>
              <div class="title">${t}</div>
              <div class="sum">${Nt(o,i)}</div>
            </div>
            <div class="tools">
              <button class=${i?"mst on":"mst"} role="switch" aria-checked=${i?"true":"false"} @click=${()=>this._toggleMaster(i)}>
                <ha-icon icon=${i?"mdi:timer-check-outline":"mdi:timer-off-outline"}></ha-icon>${i?"Timer attivi":"Timer spenti"}
              </button>
              <button class=${this._onlyOn?"mst on":"mst"} aria-pressed=${this._onlyOn?"true":"false"} @click=${()=>this._onlyOn=!this._onlyOn}>
                <ha-icon icon=${this._onlyOn?"mdi:filter-check":"mdi:filter-variant"}></ha-icon>${this._onlyOn?"Solo accese":"Tutte"}
              </button>
              <button class="ib" aria-label="Statistiche" @click=${()=>void this._open("luci-stats-dialog")}><ha-icon icon="mdi:chart-box-outline"></ha-icon></button>
              <button class="ib" aria-label="Preferenze" @click=${()=>void this._open("luci-settings-dialog")}><ha-icon icon="mdi:cog"></ha-icon></button>
            </div>
          </div>
          ${c.length===0&&this._onlyOn?d`<div class="none">Nessuna luce accesa</div>`:l}
          <div class="grid">${c.map(a=>this._tile(a))}</div>
        </div>
      </ha-card>`}static{this.styles=$`
    :host { display: block; color: var(--primary-text-color, #212121); }
    ha-card { overflow: hidden; }
    .pad { padding: 14px 16px 16px; }
    .pad.compact { padding: 8px; }
    .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
    .title { font-size: 1.15rem; font-weight: 600; }
    .sum { font-size: 0.85rem; color: var(--secondary-text-color, #727272); margin-top: 2px; }
    .muted { color: var(--secondary-text-color, #727272); font-size: 0.85rem; }
    .errbox { margin-top: 8px; padding: 10px; border-radius: 10px; background: rgba(220, 38, 38, 0.1); color: #b91c1c; font-size: 0.9rem; }
    .tools { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .none { padding: 14px 4px; color: var(--secondary-text-color, #727272); font-size: 0.9rem; }
    .mst { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; padding: 0 14px; border-radius: 22px; border: 1px solid var(--divider-color, #ccc); background: var(--secondary-background-color, #f4f4f4); color: inherit; font-size: 0.88rem; cursor: pointer; }
    .mst.on { background: rgba(22, 163, 74, 0.16); border-color: #16a34a; color: #166534; }
    .ib { width: 44px; height: 44px; border-radius: 22px; border: 1px solid var(--divider-color, #ccc); background: var(--secondary-background-color, #f4f4f4); color: inherit; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
    ha-icon { --mdc-icon-size: 22px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(230px, 100%), 1fr)); gap: 10px; align-items: start; }
    .tile { padding: 10px 12px; border-radius: 14px; background: var(--secondary-background-color, #f2f2f2); border: 1px solid transparent; }
    .tile.running { border-color: rgba(245, 158, 11, 0.7); background: rgba(245, 158, 11, 0.12); }
    .tile.held { border-color: rgba(96, 165, 250, 0.8); background: rgba(96, 165, 250, 0.13); }
    .tile.idle { border-color: rgba(127, 127, 127, 0.4); }
    .tile.bad { opacity: 0.6; }
    .top { display: flex; gap: 10px; align-items: center; }
    .power { flex: none; width: 48px; height: 48px; border-radius: 24px; border: 0; background: rgba(127, 127, 127, 0.2); color: var(--secondary-text-color, #727272); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
    .tile.running .power, .tile.held .power, .tile.idle .power { background: #f59e0b; color: #fff; }
    .name { flex: 1; min-width: 0; text-align: left; background: transparent; border: 0; padding: 4px 0; color: inherit; cursor: pointer; display: flex; flex-direction: column; min-height: 44px; justify-content: center; }
    .n { font-size: 0.98rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .s { font-size: 0.82rem; color: var(--secondary-text-color, #727272); }
    .tile.running .s { color: var(--primary-text-color, #212121); font-weight: 500; font-variant-numeric: tabular-nums; }
    .bar { height: 6px; border-radius: 3px; background: rgba(127, 127, 127, 0.25); margin: 8px 0 2px; overflow: hidden; }
    .bar i { display: block; height: 100%; background: #f59e0b; transition: width 1s linear; }
    .acts { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
    .a { flex: 1; min-width: 70px; min-height: 44px; border-radius: 12px; border: 1px solid var(--divider-color, #ccc); background: var(--card-background-color, #fff); color: inherit; font-size: 0.85rem; cursor: pointer; }
    .a.off { color: #b91c1c; }
  `}};h([y({attribute:!1})],w.prototype,"hass",2),h([f()],w.prototype,"_config",2),h([f()],w.prototype,"_info",2),h([f()],w.prototype,"_error",2),h([f()],w.prototype,"_now",2),h([f()],w.prototype,"_onlyOn",2);customElements.get("luci-timer-card")||customElements.define("luci-timer-card",w);window.customCards=window.customCards||[];window.customCards.push({type:"luci-timer-card",name:"Timer luci",description:"Luci con timer di spegnimento: conto alla rovescia, +5 minuti, tieni accesa, statistiche e preferenze."});console.info("%c LUCI-TIMER %c v0.4.1 ","color: white; background: #b45309; font-weight: 700;","color: #b45309; background: white; font-weight: 700;");export{w as LuciTimerCard};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
