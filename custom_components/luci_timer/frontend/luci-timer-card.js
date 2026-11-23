var Jt=Object.defineProperty;var Qt=Object.getOwnPropertyDescriptor;var p=(s,e,t,i)=>{for(var n=i>1?void 0:i?Qt(e,t):e,o=s.length-1,r;o>=0;o--)(r=s[o])&&(n=(i?r(e,t,n):r(n))||n);return i&&n&&Jt(e,t,n),n};var V=globalThis,J=V.ShadowRoot&&(V.ShadyCSS===void 0||V.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,it=Symbol(),gt=new WeakMap,I=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==it)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(J&&e===void 0){let i=t!==void 0&&t.length===1;i&&(e=gt.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&gt.set(t,e))}return e}toString(){return this.cssText}},bt=s=>new I(typeof s=="string"?s:s+"",void 0,it),y=(s,...e)=>{let t=s.length===1?s[0]:e.reduce((i,n,o)=>i+(r=>{if(r._$cssResult$===!0)return r.cssText;if(typeof r=="number")return r;throw Error("Value passed to 'css' function must be a 'css' function result: "+r+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+s[o+1],s[0]);return new I(t,s,it)},vt=(s,e)=>{if(J)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let i=document.createElement("style"),n=V.litNonce;n!==void 0&&i.setAttribute("nonce",n),i.textContent=t.cssText,s.appendChild(i)}},st=J?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(let i of e.cssRules)t+=i.cssText;return bt(t)})(s):s;var{is:Xt,defineProperty:Gt,getOwnPropertyDescriptor:Zt,getOwnPropertyNames:Yt,getOwnPropertySymbols:te,getPrototypeOf:ee}=Object,Q=globalThis,_t=Q.trustedTypes,ie=_t?_t.emptyScript:"",se=Q.reactiveElementPolyfillSupport,U=(s,e)=>s,L={toAttribute(s,e){switch(e){case Boolean:s=s?ie:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},X=(s,e)=>!Xt(s,e),yt={attribute:!0,type:String,converter:L,reflect:!1,useDefault:!1,hasChanged:X};Symbol.metadata??=Symbol("metadata"),Q.litPropertyMetadata??=new WeakMap;var $=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=yt){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let i=Symbol(),n=this.getPropertyDescriptor(e,i,t);n!==void 0&&Gt(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){let{get:n,set:o}=Zt(this.prototype,e)??{get(){return this[t]},set(r){this[t]=r}};return{get:n,set(r){let c=n?.call(this);o?.call(this,r),this.requestUpdate(e,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??yt}static _$Ei(){if(this.hasOwnProperty(U("elementProperties")))return;let e=ee(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(U("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U("properties"))){let t=this.properties,i=[...Yt(t),...te(t)];for(let n of i)this.createProperty(n,t[n])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[i,n]of t)this.elementProperties.set(i,n)}this._$Eh=new Map;for(let[t,i]of this.elementProperties){let n=this._$Eu(t,i);n!==void 0&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let i=new Set(e.flat(1/0).reverse());for(let n of i)t.unshift(st(n))}else e!==void 0&&t.push(st(e));return t}static _$Eu(e,t){let i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vt(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){let i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(n!==void 0&&i.reflect===!0){let o=(i.converter?.toAttribute!==void 0?i.converter:L).toAttribute(t,i.type);this._$Em=e,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(e,t){let i=this.constructor,n=i._$Eh.get(e);if(n!==void 0&&this._$Em!==n){let o=i.getPropertyOptions(n),r=typeof o.converter=="function"?{fromAttribute:o.converter}:o.converter?.fromAttribute!==void 0?o.converter:L;this._$Em=n;let c=r.fromAttribute(t,o.type);this[n]=c??this._$Ej?.get(n)??c,this._$Em=null}}requestUpdate(e,t,i,n=!1,o){if(e!==void 0){let r=this.constructor;if(n===!1&&(o=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??X)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:o},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),o!==!0||r!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),n===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[n,o]of i){let{wrapped:r}=o,c=this[n];r!==!0||this._$AL.has(n)||c===void 0||this.C(n,void 0,o,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[U("elementProperties")]=new Map,$[U("finalized")]=new Map,se?.({ReactiveElement:$}),(Q.reactiveElementVersions??=[]).push("2.1.2");var dt=globalThis,xt=s=>s,G=dt.trustedTypes,$t=G?G.createPolicy("lit-html",{createHTML:s=>s}):void 0,Ct="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,Tt="?"+k,ne=`<${Tt}>`,M=document,F=()=>M.createComment(""),q=s=>s===null||typeof s!="object"&&typeof s!="function",pt=Array.isArray,oe=s=>pt(s)||typeof s?.[Symbol.iterator]=="function",nt=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,wt=/-->/g,kt=/>/g,C=RegExp(`>|${nt}(?:([^\\s"'>=/]+)(${nt}*=${nt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),At=/'/g,Et=/"/g,Mt=/^(?:script|style|textarea|title)$/i,ht=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),l=ht(1),ke=ht(2),Ae=ht(3),z=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),St=new WeakMap,T=M.createTreeWalker(M,129);function zt(s,e){if(!pt(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return $t!==void 0?$t.createHTML(e):e}var re=(s,e)=>{let t=s.length-1,i=[],n,o=e===2?"<svg>":e===3?"<math>":"",r=j;for(let c=0;c<t;c++){let a=s[c],h,f,u=-1,v=0;for(;v<a.length&&(r.lastIndex=v,f=r.exec(a),f!==null);)v=r.lastIndex,r===j?f[1]==="!--"?r=wt:f[1]!==void 0?r=kt:f[2]!==void 0?(Mt.test(f[2])&&(n=RegExp("</"+f[2],"g")),r=C):f[3]!==void 0&&(r=C):r===C?f[0]===">"?(r=n??j,u=-1):f[1]===void 0?u=-2:(u=r.lastIndex-f[2].length,h=f[1],r=f[3]===void 0?C:f[3]==='"'?Et:At):r===Et||r===At?r=C:r===wt||r===kt?r=j:(r=C,n=void 0);let _=r===C&&s[c+1].startsWith("/>")?" ":"";o+=r===j?a+ne:u>=0?(i.push(h),a.slice(0,u)+Ct+a.slice(u)+k+_):a+k+(u===-2?c:_)}return[zt(s,o+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]},K=class s{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let o=0,r=0,c=e.length-1,a=this.parts,[h,f]=re(e,t);if(this.el=s.createElement(h,i),T.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(n=T.nextNode())!==null&&a.length<c;){if(n.nodeType===1){if(n.hasAttributes())for(let u of n.getAttributeNames())if(u.endsWith(Ct)){let v=f[r++],_=n.getAttribute(u).split(k),S=/([.?@])?(.*)/.exec(v);a.push({type:1,index:o,name:S[2],strings:_,ctor:S[1]==="."?rt:S[1]==="?"?at:S[1]==="@"?lt:O}),n.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:o}),n.removeAttribute(u));if(Mt.test(n.tagName)){let u=n.textContent.split(k),v=u.length-1;if(v>0){n.textContent=G?G.emptyScript:"";for(let _=0;_<v;_++)n.append(u[_],F()),T.nextNode(),a.push({type:2,index:++o});n.append(u[v],F())}}}else if(n.nodeType===8)if(n.data===Tt)a.push({type:2,index:o});else{let u=-1;for(;(u=n.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:o}),u+=k.length-1}o++}}static createElement(e,t){let i=M.createElement("template");return i.innerHTML=e,i}};function N(s,e,t=s,i){if(e===z)return e;let n=i!==void 0?t._$Co?.[i]:t._$Cl,o=q(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),o===void 0?n=void 0:(n=new o(s),n._$AT(s,t,i)),i!==void 0?(t._$Co??=[])[i]=n:t._$Cl=n),n!==void 0&&(e=N(s,n._$AS(s,e.values),n,i)),e}var ot=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??M).importNode(t,!0);T.currentNode=n;let o=T.nextNode(),r=0,c=0,a=i[0];for(;a!==void 0;){if(r===a.index){let h;a.type===2?h=new B(o,o.nextSibling,this,e):a.type===1?h=new a.ctor(o,a.name,a.strings,this,e):a.type===6&&(h=new ct(o,this,e)),this._$AV.push(h),a=i[++c]}r!==a?.index&&(o=T.nextNode(),r++)}return T.currentNode=M,n}p(e){let t=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},B=class s{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=N(this,e,t),q(e)?e===d||e==null||e===""?(this._$AH!==d&&this._$AR(),this._$AH=d):e!==this._$AH&&e!==z&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):oe(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==d&&q(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:i}=e,n=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=K.createElement(zt(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{let o=new ot(n,this),r=o.u(this.options);o.p(t),this.T(r),this._$AH=o}}_$AC(e){let t=St.get(e.strings);return t===void 0&&St.set(e.strings,t=new K(e)),t}k(e){pt(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,i,n=0;for(let o of e)n===t.length?t.push(i=new s(this.O(F()),this.O(F()),this,this.options)):i=t[n],i._$AI(o),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let i=xt(e).nextSibling;xt(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},O=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,o){this.type=1,this._$AH=d,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}_$AI(e,t=this,i,n){let o=this.strings,r=!1;if(o===void 0)e=N(this,e,t,0),r=!q(e)||e!==this._$AH&&e!==z,r&&(this._$AH=e);else{let c=e,a,h;for(e=o[0],a=0;a<o.length-1;a++)h=N(this,c[i+a],t,a),h===z&&(h=this._$AH[a]),r||=!q(h)||h!==this._$AH[a],h===d?e=d:e!==d&&(e+=(h??"")+o[a+1]),this._$AH[a]=h}r&&!n&&this.j(e)}j(e){e===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},rt=class extends O{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===d?void 0:e}},at=class extends O{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==d)}},lt=class extends O{constructor(e,t,i,n,o){super(e,t,i,n,o),this.type=5}_$AI(e,t=this){if((e=N(this,e,t,0)??d)===z)return;let i=this._$AH,n=e===d&&i!==d||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==d&&(i===d||n);n&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},ct=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){N(this,e)}};var ae=dt.litHtmlPolyfillSupport;ae?.(K,B),(dt.litHtmlVersions??=[]).push("3.3.3");var Pt=(s,e,t)=>{let i=t?.renderBefore??e,n=i._$litPart$;if(n===void 0){let o=t?.renderBefore??null;i._$litPart$=n=new B(e.insertBefore(F(),o),o,void 0,t??{})}return n._$AI(s),n};var ut=globalThis,b=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Pt(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}};b._$litElement$=!0,b.finalized=!0,ut.litElementHydrateSupport?.({LitElement:b});var le=ut.litElementPolyfillSupport;le?.({LitElement:b});(ut.litElementVersions??=[]).push("4.2.2");var ce={attribute:!0,type:String,converter:L,reflect:!1,hasChanged:X},de=(s=ce,e,t)=>{let{kind:i,metadata:n}=t,o=globalThis.litPropertyMetadata.get(n);if(o===void 0&&globalThis.litPropertyMetadata.set(n,o=new Map),i==="setter"&&((s=Object.create(s)).wrapped=!0),o.set(t.name,s),i==="accessor"){let{name:r}=t;return{set(c){let a=e.get.call(this);e.set.call(this,c),this.requestUpdate(r,a,s,!0,c)},init(c){return c!==void 0&&this.C(r,void 0,s,c),c}}}if(i==="setter"){let{name:r}=t;return function(c){let a=this[r];e.call(this,c),this.requestUpdate(r,a,s,!0,c)}}throw Error("Unsupported decorator location: "+i)};function g(s){return(e,t)=>typeof t=="object"?de(s,e,t):((i,n,o)=>{let r=n.hasOwnProperty(o);return n.constructor.createProperty(o,i),r?Object.getOwnPropertyDescriptor(n,o):void 0})(s,e,t)}function m(s){return g({...s,state:!0,attribute:!1})}var Nt=[1,3,5,10,15,30,60,120],Ot=[0,10,20,30,60],Rt=["light","switch","fan","input_boolean"],pe=["non_disponibile","spenta","in_corso","tenuta","timer_disattivato"];function he(s){return pe.includes(String(s))?s:"non_disponibile"}function mt(s){let e=Math.max(0,Math.ceil(s/1e3)),t=Math.floor(e/3600),i=Math.floor(e%3600/60),n=e%60,o=String(i).padStart(2,"0"),r=String(n).padStart(2,"0");return t>0?`${t}:${o}:${r}`:`${o}:${r}`}function A(s){if(s<60)return`${s} min`;let e=Math.floor(s/60),t=s%60;return t===0?`${e} h`:`${e} h ${t} min`}function ue(s){if(typeof s!="string"||s==="unknown"||s==="unavailable"||s==="")return null;let e=Date.parse(s);return Number.isNaN(e)?null:e}function Y(s,e,t){let i=s.entities,n=e[s.entity]?.state,o=i.stato?e[i.stato]:void 0,r=he(o?.state??s.status),c=Number(i.durata?e[i.durata]?.state:NaN),a=Number.isFinite(c)&&c>0?Math.round(c):s.minutes,h=ue(i.scadenza?e[i.scadenza]?.state:s.end),f=(i.attivo?e[i.attivo]?.state:s.enabled?"on":"off")==="on",u=n==="on",v="off",_=`Spenta \xB7 timer ${A(a)}${f?"":" (disattivato)"}`,S=null;if(n==="unavailable"||n===void 0||r==="non_disponibile")v="bad",_="Non disponibile";else if(u)if(r==="in_corso"&&h!==null){let et=Math.max(0,h-t);v="running",_=et>0?`Spegne tra ${mt(et)}`:"Sta per spegnersi",S=Math.min(1,et/(a*6e4))}else r==="tenuta"?(v="held",_="Tenuta accesa"):(v="idle",_="Accesa \xB7 timer disattivato");return{key:s.key,entity:s.entity,name:s.name,on:u,tone:v,subtitle:_,progress:S,running:r==="in_corso",held:r==="tenuta",timerOn:f,minutes:a}}function Ht(s){return s.held?{icon:"mdi:timer-lock-outline",label:`${s.name}: tenuta accesa`}:s.running?{icon:"mdi:timer-outline",label:`${s.name}: ${s.subtitle.toLowerCase()}`}:{icon:"mdi:timer-off-outline",label:`${s.name}: timer disattivato`}}var It=[5,10,15,30,60,120];function Ut(s,e){return e?s.filter(t=>t.on):s}function Lt(s,e){if(s.length===0)return"Nessuna luce: aggiungine una con l'ingranaggio.";let t=s.filter(r=>r.on).length,i=s.filter(r=>r.running).length,n=s.filter(r=>r.held).length,o=[t===0?"Tutte spente":`${t} ${t===1?"accesa":"accese"}`];return i&&o.push(`${i} timer in corso`),n&&o.push(`${n} ${n===1?"tenuta accesa":"tenute accese"}`),e||o.push("timer disattivati"),o.join(" \xB7 ")}function W(s){return s.split(".",1)[0]}function me(s){return/^[a-z_]+\.[a-z0-9_]+$/.test(s)&&Rt.includes(W(s))}function fe(s,e){return me(s.entity)?e.filter(t=>t.entity===s.entity).length>1?"Questa luce \xE8 gi\xE0 nell'elenco.":!Number.isInteger(s.minutes)||s.minutes<1||s.minutes>720?"La durata deve essere tra 1 minuto e 12 ore.":s.motions.length>6?"Al massimo 6 sensori per luce.":s.motions.some(t=>!/^(binary_sensor|input_boolean)\.[a-z0-9_]+$/.test(t))?"Un sensore di movimento non \xE8 valido.":null:"Scegli una luce, presa o ventola valida."}function ft(s){for(let e of s){let t=fe(e,s);if(t)return`${e.name||e.entity}: ${t}`}return null}function jt(s,e){let t=e?.trim()||s.split(".")[1].replace(/_/g," ").replace(/^./,i=>i.toUpperCase());return{entity:s,name:t,minutes:5,enabled:!0,motions:[],warn_seconds:0}}function Ft(s,e){return Object.values(s).filter(t=>Rt.includes(W(t.entity_id))&&!e.includes(t.entity_id)).map(t=>({id:t.entity_id,name:String(t.attributes.friendly_name??t.entity_id)})).sort((t,i)=>t.name.localeCompare(i.name,"it"))}var ge=["motion","occupancy","presence","door","opening","garage_door","window"];function qt(s,e=[]){return Object.values(s).filter(t=>W(t.entity_id)==="binary_sensor"&&ge.includes(String(t.attributes.device_class))&&!e.includes(t.entity_id)).map(t=>({id:t.entity_id,name:String(t.attributes.friendly_name??t.entity_id)})).sort((t,i)=>t.name.localeCompare(i.name,"it"))}function D(s,e){let t=s[e]?.attributes.friendly_name;return typeof t=="string"&&t?t:e}function Kt(s){if(s.runs===0)return"Nessuna accensione negli ultimi giorni.";let e=[`${s.runs} ${s.runs===1?"accensione":"accensioni"}`,`${s.expired} spente dal timer`,`${s.manual} a mano`];return s.avg_minutes!==null&&e.push(`durata media ${String(s.avg_minutes).replace(".",",")} min`),e.join(" \xB7 ")}function tt(s){return Math.min(720,Math.max(1,Math.round(s)))}function Bt(s){return{title:typeof s.title=="string"?s.title:"",only_on:s.only_on===!0,header:s.header!==!1,display:s.display==="tile"?"tile":"button",color:typeof s.color=="string"&&s.color!=="none"?s.color:"",lights:Array.isArray(s.lights)?s.lights.map(String):[]}}function Wt(s,e){let t={...s},i=(c,a,h)=>{h?t[c]=a:delete t[c]},n=typeof e.title=="string"?e.title.trim():"";i("title",n,n!==""),i("only_on",!0,e.only_on===!0),i("header",!1,e.header===!1),i("display","tile",e.display==="tile");let o=typeof e.color=="string"?e.color.trim():"";i("color",o,o!==""&&o!=="none");let r=Array.isArray(e.lights)?e.lights.map(String):[];return i("lights",r,r.length>0),t}var Dt={red:"#f44336",pink:"#e91e63",purple:"#926bc7","deep-purple":"#6e41ab",indigo:"#3f51b5",blue:"#2196f3","light-blue":"#03a9f4",cyan:"#00bcd4",teal:"#009688",green:"#4caf50","light-green":"#8bc34a",lime:"#cddc39",yellow:"#ffeb3b",amber:"#ffc107",orange:"#ff9800","deep-orange":"#ff6f22",brown:"#795548","light-grey":"#bdbdbd",grey:"#9e9e9e","dark-grey":"#606060","blue-grey":"#607d8b",black:"#000000",white:"#ffffff"};function Vt(s){if(typeof s!="string")return;let e=s.trim().toLowerCase();if(!(!e||e==="none"||e==="default")){if(e==="primary"||e==="accent")return`var(--${e}-color)`;if(Dt[e])return`var(--${e}-color, ${Dt[e]})`;if(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(e)||/^(rgb|hsl)a?\([0-9\s.,%/]+\)$/.test(e))return e}}var be={title:"Titolo",only_on:"All'inizio mostra solo le luci accese",header:"Mostra titolo e pulsanti",display:"Senza titolo: come si presenta la luce",color:"Colore della scheda",lights:"Luci da mostrare (nessuna = tutte)"},ve={only_on:"Con il pulsante in alto si passa comunque a tutte le luci.",header:"Disattivalo per inserire una luce dentro un'altra scheda, senza intestazione.",display:"Vale solo senza titolo: il pulsante compare a luce accesa e apre un popup; la tessera resta sempre visibile.",color:"Tinge lo sfondo e il bordo della scheda, come un blocco colorato della plancia; le tessere delle luci restano come sono. Nessuno lascia l'aspetto del tema.",lights:"Per mostrare solo alcune luci in questa scheda. Durate, sensori e avvisi si regolano dall'ingranaggio della scheda."},R=class extends b{constructor(){super(...arguments);this._config={type:"custom:luci-timer-card"};this._info=null;this._loading=!1;this._failed=!1}setConfig(t){this._config={...t}}updated(){this.hass&&!this._info&&!this._loading&&!this._failed&&this._load()}async _load(){this._loading=!0;try{let t={type:"luci_timer/info"};typeof this._config.entry_id=="string"&&this._config.entry_id&&(t.entry_id=this._config.entry_id),this._info=await this.hass.callWS(t)}catch{this._failed=!0}finally{this._loading=!1}}_onForm(t){t.stopPropagation();let i=Wt(this._config,t.detail.value);this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}_schema(){let t=[{name:"title",selector:{text:{}}},{name:"only_on",selector:{boolean:{}}},{name:"header",selector:{boolean:{}}},{name:"display",selector:{select:{mode:"dropdown",options:[{value:"button",label:"Pulsante del timer (apre un popup)"},{value:"tile",label:"Tessera compatta"}]}}},{name:"color",selector:{ui_color:{include_none:!0}}}],i=(this._info?.lights??[]).map(n=>({value:n.entity,label:n.name}));return i.length>0&&t.push({name:"lights",selector:{select:{multiple:!0,mode:"list",options:i}}}),t}render(){return this.hass?l`<ha-form
      .hass=${this.hass}
      .data=${Bt(this._config)}
      .schema=${this._schema()}
      .computeLabel=${t=>be[t.name]??t.name}
      .computeHelper=${t=>ve[t.name]??""}
      @value-changed=${t=>this._onForm(t)}
    ></ha-form>`:d}static{this.styles=y`
    :host { display: block; }
  `}};p([g({attribute:!1})],R.prototype,"hass",2),p([m()],R.prototype,"_config",2),p([m()],R.prototype,"_info",2);customElements.get("luci-timer-card-editor")||customElements.define("luci-timer-card-editor",R);var H=y`
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
`;var x=class extends b{constructor(){super(...arguments);this.openKey="";this._lights=[];this._master=!0;this._open="";this._add="";this._mot="";this._busy=!1;this._error="";this._onKey=t=>{t.key==="Escape"&&this._close()}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),this._lights=this.info.lights.map(t=>({entity:t.entity,name:t.name,minutes:t.minutes,enabled:t.enabled,motions:[...t.motions],warn_seconds:t.warn_seconds})),this._master=this.info.enabled,this._open=this.openKey}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey)}_close(){this.dispatchEvent(new CustomEvent("closed")),this.remove()}_patch(t,i){this._lights=this._lights.map(n=>n.entity===t?{...n,...i}:n)}_remove(t){this._lights=this._lights.filter(i=>i.entity!==t),this._open===t&&(this._open="")}_addLight(){let t=this._add.trim();if(!t)return;if(this._lights.some(n=>n.entity===t)){this._error="Questa luce \xE8 gi\xE0 nell'elenco.";return}if(!this.hass.states[t]&&!/^[a-z_]+\.[a-z0-9_]+$/.test(t)){this._error="Scegli un'entit\xE0 dall'elenco.";return}let i=this.hass.states[t]?.attributes.friendly_name;this._lights=[...this._lights,jt(t,typeof i=="string"?i:void 0)],this._open=t,this._add="",this._error=""}async _save(){let t=ft(this._lights);if(t){this._error=t;return}this._busy=!0,this._error="";try{await this.hass.callWS({type:"luci_timer/update",entry_id:this.info.entry_id,enabled:this._master,lights:this._lights}),this.dispatchEvent(new CustomEvent("saved")),this._close()}catch(i){let n=i instanceof Error?i.message:i?.message??String(i);this._error=`Impossibile salvare: ${n}`}finally{this._busy=!1}}_editor(t){let i=qt(this.hass.states,t.motions),n=W(t.entity)==="light";return l`
      <div class="ed">
        <div class="link"><ha-icon icon="mdi:link-variant"></ha-icon>Collegata a <b>${D(this.hass.states,t.entity)}</b> <code>${t.entity}</code> · ora ${this.hass.states[t.entity]?.state==="on"?"accesa":this.hass.states[t.entity]?.state==="off"?"spenta":"non disponibile"}</div>
        <label class="f">Nome<input class="txt" .value=${t.name} @change=${o=>this._patch(t.entity,{name:o.target.value.trim()||t.name})} /></label>
        <div class="f">Durata del timer
          <div class="chips">
            ${Nt.map(o=>l`<button class=${t.minutes===o?"chip on":"chip"} @click=${()=>this._patch(t.entity,{minutes:o})}>${A(o)}</button>`)}
          </div>
          <div class="step">
            <button class="st" aria-label="Meno" @click=${()=>this._patch(t.entity,{minutes:tt(t.minutes-1)})}>−</button>
            <input class="num" inputmode="numeric" .value=${String(t.minutes)} @change=${o=>{let r=Number(o.target.value.replace(",","."));this._patch(t.entity,{minutes:Number.isFinite(r)?tt(r):t.minutes})}} />
            <span class="u">min</span>
            <button class="st" aria-label="Più" @click=${()=>this._patch(t.entity,{minutes:tt(t.minutes+1)})}>+</button>
          </div>
        </div>
        <div class="row"><div class="t"><div class="lab">Timer attivo</div><div class="hint">Se è spento la luce resta accesa finché non la spegni.</div></div>
          <button class=${t.enabled?"sw on":"sw"} role="switch" aria-checked=${t.enabled?"true":"false"} aria-label="Timer attivo" @click=${()=>this._patch(t.entity,{enabled:!t.enabled})}><span class="knob"></span></button></div>
        <div class="f">Sensori di movimento o porte (facoltativi)
          <div class="chips">
            ${t.motions.map(o=>l`<span class="tag">${D(this.hass.states,o)}<button aria-label=${`Togli ${o}`} @click=${()=>this._patch(t.entity,{motions:t.motions.filter(r=>r!==o)})}>✕</button></span>`)}
            ${t.motions.length===0?l`<span class="hint">Nessuno</span>`:d}
          </div>
          <div class="addrow">
            <input class="txt" list=${`dl-mot-${t.entity}`} placeholder="binary_sensor.nome" .value=${this._mot} @input=${o=>this._mot=o.target.value} />
            <datalist id=${`dl-mot-${t.entity}`}>${i.map(o=>l`<option value=${o.id}>${o.name}</option>`)}</datalist>
            <button class="btn" ?disabled=${!this._mot.trim()} @click=${()=>{let o=this._mot.trim();o&&!t.motions.includes(o)&&this._patch(t.entity,{motions:[...t.motions,o]}),this._mot=""}}>Aggiungi</button>
          </div>
          <span class="hint">Alla scadenza, se uno di questi è ancora attivo, il timer riparte invece di spegnere.</span>
        </div>
        ${n?l`<div class="f">Avviso prima dello spegnimento
              <div class="chips">${Ot.map(o=>l`<button class=${t.warn_seconds===o?"chip on":"chip"} @click=${()=>this._patch(t.entity,{warn_seconds:o})}>${o===0?"Nessuno":`${o} s prima`}</button>`)}</div>
              <span class="hint">La luce si abbassa un istante per avvisare che sta per spegnersi.</span></div>`:d}
        <button class="btn del" @click=${()=>this._remove(t.entity)}>Togli dall'elenco</button>
      </div>`}render(){if(!this.info)return d;let t=ft(this._lights),i=Ft(this.hass.states,this._lights.map(n=>n.entity));return l`
      <div class="backdrop" @click=${n=>n.target===n.currentTarget&&this._close()}>
        <div class="panel" role="dialog" aria-modal="true" aria-label="Preferenze timer luci">
          <div class="head"><div class="title">Preferenze dei timer</div><button class="x" aria-label="Chiudi" @click=${()=>this._close()}>✕</button></div>
          <div class="body">
            <div class="row"><div class="t"><div class="lab">Timer attivi</div><div class="hint">Interruttore generale: spento, nessuna luce si spegne da sola.</div></div>
              <button class=${this._master?"sw on":"sw"} role="switch" aria-checked=${this._master?"true":"false"} aria-label="Timer attivi" @click=${()=>this._master=!this._master}><span class="knob"></span></button></div>

            <div class="sec">Luci con timer</div>
            ${this._lights.length===0?l`<div class="empty">Nessuna luce: aggiungine una qui sotto.</div>`:d}
            ${this._lights.map(n=>l`
                <div class="item">
                  <button class="head2" aria-expanded=${this._open===n.entity?"true":"false"} @click=${()=>this._open=this._open===n.entity?"":n.entity}>
                    <span class="nm">${n.name}<span class="eid">${n.entity}</span></span>
                    <span class="meta">${n.enabled?A(n.minutes):"timer spento"}${n.motions.length?` \xB7 ${n.motions.length} ${n.motions.length===1?"sensore":"sensori"}`:""}</span>
                    <span class="chev">${this._open===n.entity?"\u25BE":"\u25B8"}</span>
                  </button>
                  ${this._open===n.entity?this._editor(n):d}
                </div>`)}

            <div class="sec">Aggiungi una luce</div>
            <div class="addrow">
              <input class="txt" list="dl-add" placeholder="light.nome, switch.nome…" .value=${this._add} @input=${n=>this._add=n.target.value} />
              <datalist id="dl-add">${i.map(n=>l`<option value=${n.id}>${n.name}</option>`)}</datalist>
              <button class="btn primary" ?disabled=${!this._add.trim()} @click=${()=>this._addLight()}>Aggiungi</button>
            </div>

            ${t?l`<div class="err">${t}</div>`:d}
            ${this._error?l`<div class="err">${this._error}</div>`:d}
          </div>
          <div class="foot">
            <button class="btn" @click=${()=>this._close()}>Annulla</button>
            <button class="btn primary" ?disabled=${this._busy||!!t} @click=${()=>void this._save()}>Salva</button>
          </div>
        </div>
      </div>`}static{this.styles=[H,y`
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
    `]}};p([g({attribute:!1})],x.prototype,"hass",2),p([g({attribute:!1})],x.prototype,"info",2),p([g()],x.prototype,"openKey",2),p([m()],x.prototype,"_lights",2),p([m()],x.prototype,"_master",2),p([m()],x.prototype,"_open",2),p([m()],x.prototype,"_add",2),p([m()],x.prototype,"_mot",2),p([m()],x.prototype,"_busy",2),p([m()],x.prototype,"_error",2);customElements.get("luci-settings-dialog")||customElements.define("luci-settings-dialog",x);var P=class extends b{constructor(){super(...arguments);this.openKey="";this._now=Date.now();this._onKey=t=>{t.key==="Escape"&&this._close()}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),this._tick=window.setInterval(()=>this._now=Date.now(),1e3)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey),this._tick&&window.clearInterval(this._tick)}_close(){this.dispatchEvent(new CustomEvent("closed")),this.remove()}_act(t,i){let n={type:"luci_timer/action",entry_id:this.info.entry_id,entity:this.openKey,action:t};i&&(n.minutes=i),this.hass.callWS(n)}_openSettings(){this.dispatchEvent(new CustomEvent("settings",{detail:this.openKey})),this._close()}render(){let t=this.info?.lights.find(c=>c.entity===this.openKey);if(!t)return d;let i=Y(t,this.hass.states,this._now),n=i.running&&t.entities.scadenza?Date.parse(this.hass.states[t.entities.scadenza]?.state??""):NaN,o=Number.isFinite(n)?Math.max(0,n-this._now):null,r=t.entities.attivo?this.hass.states[t.entities.attivo]?.state==="on":t.enabled;return l`
      <div class="backdrop" @click=${c=>c.target===c.currentTarget&&this._close()}>
        <div class="panel" role="dialog" aria-modal="true" aria-label=${`Timer ${i.name}`}>
          <div class="head"><div class="title">${i.name}</div><button class="x" aria-label="Chiudi" @click=${()=>this._close()}>✕</button></div>
          <div class="body">
            <div class="big ${i.tone}">
              ${i.running&&o!==null?l`<div class="num">${mt(o)}</div><div class="cap">alla chiusura · timer da ${A(i.minutes)}</div>`:i.held?l`<div class="txt">Tenuta accesa</div><div class="cap">Non si spegne da sola finché non la spegni</div>`:i.on?l`<div class="txt">Accesa</div><div class="cap">Timer disattivato</div>`:l`<div class="txt">Spenta</div><div class="cap">Timer da ${A(i.minutes)} quando la accendi</div>`}
              ${i.progress!==null?l`<div class="bar"><i style="width:${(i.progress*100).toFixed(1)}%"></i></div>`:d}
            </div>

            ${i.on?l`<div class="grid">
                  <button class="b" @click=${()=>this._act("extend",5)}>+5 min</button>
                  <button class="b" @click=${()=>this._act("extend",15)}>+15 min</button>
                  ${i.held?l`<button class="b" @click=${()=>this._act("release")}>Riprendi timer</button>`:l`<button class="b" @click=${()=>this._act("hold")}>Tieni accesa</button>`}
                  <button class="b off" @click=${()=>{this._act("off_now")}}>Spegni ora</button>
                </div>
                <div class="sec">Spegni tra…</div>
                <div class="chips">${It.map(c=>l`<button class="chip" @click=${()=>this._act("start",c)}>${A(c)}</button>`)}</div>`:l`<div class="grid one"><button class="b primary" @click=${()=>this._act("on")}>Accendi con il timer</button></div>`}

            <div class="row">
              <div><div class="lab">Timer attivo</div><div class="hint">Collegato a ${D(this.hass.states,t.entity)} (${t.entity})</div></div>
              <button class=${r?"sw on":"sw"} role="switch" aria-checked=${r?"true":"false"} aria-label="Timer attivo"
                @click=${()=>t.entities.attivo&&void this.hass.callService("switch",r?"turn_off":"turn_on",{entity_id:t.entities.attivo})}><span class="knob"></span></button>
            </div>
            <button class="link" @click=${()=>this._openSettings()}>Durata, sensori e avviso…</button>
          </div>
        </div>
      </div>`}static{this.styles=[H,y`
      .panel { max-width: 460px; }
      .big { text-align: center; padding: 14px 10px 10px; border-radius: 16px; background: var(--secondary-background-color, #f2f2f2); }
      .big.running { background: rgba(245, 158, 11, 0.14); }
      .big.held { background: rgba(96, 165, 250, 0.15); }
      .num { font-size: 3.2rem; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1.1; }
      .txt { font-size: 1.6rem; font-weight: 600; }
      .cap { font-size: 0.85rem; color: var(--secondary-text-color, #727272); margin-top: 4px; }
      .bar { height: 8px; border-radius: 4px; background: rgba(127, 127, 127, 0.25); margin: 12px 4px 4px; overflow: hidden; }
      .bar i { display: block; height: 100%; background: #f59e0b; transition: width 1s linear; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
      .grid.one { grid-template-columns: 1fr; }
      .b { min-height: 56px; border-radius: 14px; border: 1px solid var(--divider-color, #ccc); background: var(--secondary-background-color, #f4f4f4); color: var(--primary-text-color, #212121); font-size: 1rem; cursor: pointer; }
      .b.off { color: #b91c1c; }
      .b.primary { background: var(--primary-color, #03a9f4); color: #fff; border-color: transparent; }
      .sec { font-weight: 600; font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--secondary-text-color, #727272); margin: 16px 0 8px; }
      .chips { display: flex; flex-wrap: wrap; gap: 8px; }
      .chip { min-height: 48px; padding: 0 16px; border-radius: 24px; border: 1px solid var(--divider-color, #ccc); background: transparent; color: var(--primary-text-color, #212121); font-size: 0.95rem; cursor: pointer; }
      .row { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--divider-color, #eee); }
      .lab { font-size: 0.95rem; } .hint { font-size: 0.75rem; color: var(--secondary-text-color, #727272); margin-top: 2px; }
      .sw { flex: none; width: 56px; height: 32px; border-radius: 16px; border: 0; background: var(--disabled-color, #bdbdbd); position: relative; cursor: pointer; transition: background 0.2s; }
      .sw.on { background: var(--primary-color, #03a9f4); }
      .sw .knob { position: absolute; top: 4px; left: 4px; width: 24px; height: 24px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
      .sw.on .knob { transform: translateX(24px); }
      .link { margin-top: 12px; min-height: 48px; width: 100%; border: 0; background: transparent; color: var(--primary-color, #03a9f4); font-size: 0.95rem; cursor: pointer; }
    `]}};p([g({attribute:!1})],P.prototype,"hass",2),p([g({attribute:!1})],P.prototype,"info",2),p([g()],P.prototype,"openKey",2),p([m()],P.prototype,"_now",2);customElements.get("luci-light-dialog")||customElements.define("luci-light-dialog",P);var E=class extends b{constructor(){super(...arguments);this._stats=null;this._error="";this._applied=new Set;this._onKey=t=>{t.key==="Escape"&&this._close()}}connectedCallback(){super.connectedCallback(),window.addEventListener("keydown",this._onKey),this._load()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("keydown",this._onKey)}_close(){this.dispatchEvent(new CustomEvent("closed")),this.remove()}async _load(){try{this._stats=await this.hass.callWS({type:"luci_timer/stats",entry_id:this.info.entry_id})}catch(t){this._error=`Impossibile leggere le statistiche: ${t instanceof Error?t.message:t?.message??String(t)}`}}async _apply(t,i,n){if(i)try{await this.hass.callService("number","set_value",{entity_id:i,value:n}),this._applied=new Set([...this._applied,t]),this.dispatchEvent(new CustomEvent("saved"))}catch(o){this._error=`Impossibile cambiare la durata: ${o instanceof Error?o.message:String(o)}`}}render(){return l`
      <div class="backdrop" @click=${t=>t.target===t.currentTarget&&this._close()}>
        <div class="panel" role="dialog" aria-modal="true" aria-label="Statistiche timer luci">
          <div class="head"><div class="title">Statistiche (30 giorni)</div><button class="x" aria-label="Chiudi" @click=${()=>this._close()}>✕</button></div>
          <div class="body">
            ${this._stats===null&&!this._error?l`<div class="empty">Carico…</div>`:d}
            ${this._stats?this.info.lights.map(t=>{let i=this._stats[t.key];return i?l`
                    <div class="card">
                      <div class="nm">${t.name}</div>
                      <div class="ln">${Kt(i)}</div>
                      ${i.advice?l`<div class="adv">${i.advice}</div>`:d}
                      ${i.suggested_minutes&&!this._applied.has(t.key)?l`<button class="btn primary" @click=${()=>void this._apply(t.key,t.entities.durata,i.suggested_minutes)}>Usa ${i.suggested_minutes} minuti</button>`:d}
                      ${this._applied.has(t.key)?l`<div class="okbox">Durata aggiornata.</div>`:d}
                    </div>`:d}):d}
            ${this._error?l`<div class="err">${this._error}</div>`:d}
          </div>
        </div>
      </div>`}static{this.styles=[H,y`
      .card { padding: 12px 14px; margin-bottom: 10px; border: 1px solid var(--divider-color, #ddd); border-radius: 12px; }
      .nm { font-weight: 600; } .ln { font-size: 0.85rem; color: var(--secondary-text-color, #727272); margin-top: 3px; }
      .adv { margin-top: 6px; font-size: 0.9rem; } .card .btn { margin-top: 8px; min-height: 44px; }
      .okbox { margin-top: 8px; font-size: 0.85rem; color: #166534; }
    `]}};p([g({attribute:!1})],E.prototype,"hass",2),p([g({attribute:!1})],E.prototype,"info",2),p([m()],E.prototype,"_stats",2),p([m()],E.prototype,"_error",2),p([m()],E.prototype,"_applied",2);customElements.get("luci-stats-dialog")||customElements.define("luci-stats-dialog",E);var w=class extends b{constructor(){super(...arguments);this._config={type:"custom:luci-timer-card"};this._info=null;this._error="";this._now=Date.now();this._onlyOn=!1;this._loadedAt=0;this._loading=!1;this._syncers=new Set}setConfig(t){this._config={...t},this._onlyOn=t.only_on===!0,this._info=null,this._loadedAt=0;let i=Vt(t.color);this.toggleAttribute("tinted",i!==void 0),i!==void 0?this.style.setProperty("--lt-tint",i):this.style.removeProperty("--lt-tint")}getCardSize(){return this._buttonMode()?1:6}getGridOptions(){return this._buttonMode()?{columns:3,rows:1,min_columns:1,min_rows:1}:{columns:12,min_columns:4}}_buttonMode(){return this._config.header===!1&&(this._config.display??"button")==="button"}static getStubConfig(){return{type:"custom:luci-timer-card"}}static getConfigElement(){return document.createElement("luci-timer-card-editor")}connectedCallback(){super.connectedCallback(),this._tick=window.setInterval(()=>this._now=Date.now(),1e3)}disconnectedCallback(){super.disconnectedCallback(),this._tick&&window.clearInterval(this._tick)}willUpdate(){for(let t of this._syncers)t()}updated(){this.hass&&!this._loading&&(!this._info||Date.now()-this._loadedAt>5*6e4)&&this._loadInfo()}async _loadInfo(){this._loading=!0;try{let t={type:"luci_timer/info"};this._config.entry_id&&(t.entry_id=this._config.entry_id),this._info=await this.hass.callWS(t),this._error=""}catch(t){let i=t instanceof Error?t.message:t?.message??String(t);this._error=`Timer luci non configurato o integrazione non caricata (${i}).`}finally{this._loadedAt=Date.now(),this._loading=!1}}async _open(t,i=""){if(!this._info)return;for(;this._loading;)await new Promise(r=>setTimeout(r,50));if(await this._loadInfo(),!this._info)return;let n=document.createElement(t);n.hass=this.hass,n.info=this._info,i&&(n.openKey=i),n.addEventListener("settings",r=>void this._open("luci-settings-dialog",String(r.detail??""))),n.addEventListener("saved",()=>{this._loadedAt=0,this._loadInfo()}),document.body.appendChild(n);let o=()=>{n.isConnected&&(n.hass=this.hass)};this._syncers.add(o),n.addEventListener("closed",()=>this._syncers.delete(o))}_act(t,i,n=5){this.hass.callWS({type:"luci_timer/action",entry_id:this._info?.entry_id,entity:t,action:i,minutes:n})}_toggle(t){this.hass.callService("homeassistant","toggle",{entity_id:t})}_toggleMaster(t){let i=this._info?.entities.generale;i&&this.hass.callService("switch",t?"turn_off":"turn_on",{entity_id:i})}_tile(t){return l`
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
        ${t.progress!==null?l`<div class="bar"><i style="width:${(t.progress*100).toFixed(1)}%"></i></div>`:d}
        ${t.on?l`<div class="acts">
              ${t.running||t.held?l`<button class="a" @click=${()=>this._act(t.entity,"extend",5)}>+5 min</button>`:d}
              ${t.held?l`<button class="a" @click=${()=>this._act(t.entity,"release")}>Riprendi timer</button>`:t.running?l`<button class="a" @click=${()=>this._act(t.entity,"hold")}>Tieni accesa</button>`:d}
              <button class="a off" @click=${()=>this._act(t.entity,"off_now")}>Spegni</button>
            </div>`:d}
      </div>`}render(){if(!this.hass)return d;let t=this._config.title??this._info?.title??"Timer luci";if(this._error&&!this._info)return l`<ha-card><div class="pad"><div class="title">${t}</div><div class="errbox">${this._error}</div></div></ha-card>`;if(!this._info)return l`<ha-card><div class="pad"><div class="title">${t}</div><div class="muted">Carico…</div></div></ha-card>`;let i=this.hass.states[this._info.entities.generale??""]?.state!=="off",n=Array.isArray(this._config.lights)?this._config.lights:null,r=(n?this._info.lights.filter(a=>n.includes(a.entity)):this._info.lights).map(a=>Y(a,this.hass.states,this._now)),c=Ut([...r].sort((a,h)=>Number(h.on)-Number(a.on)),this._onlyOn&&this._config.header!==!1);if(this._buttonMode()){let a=r.filter(h=>h.on);return a.length===0?d:l`<div class="btns">${a.map(h=>{let f=Ht(h);return l`<button class="tbtn ${h.tone}" aria-label=${f.label} @click=${()=>void this._open("luci-light-dialog",h.entity)}>
          <ha-icon icon=${f.icon}></ha-icon>${a.length>1?l`<span>${h.name}</span>`:d}</button>`})}</div>`}return this._config.header===!1?l`<ha-card><div class="pad compact"><div class="grid">${c.map(a=>this._tile(a))}</div></div></ha-card>`:l`
      <ha-card>
        <div class="pad">
          <div class="head">
            <div>
              <div class="title">${t}</div>
              <div class="sum">${Lt(r,i)}</div>
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
          ${c.length===0&&this._onlyOn?l`<div class="none">Nessuna luce accesa</div>`:d}
          <div class="grid">${c.map(a=>this._tile(a))}</div>
        </div>
      </ha-card>`}static{this.styles=y`
    :host { display: block; color: var(--primary-text-color, #212121); }
    .btns { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; padding: 2px; }
    .tbtn { display: inline-flex; align-items: center; gap: 6px; min-width: 48px; min-height: 48px; padding: 0 12px; justify-content: center; border-radius: 24px; border: 1px solid rgba(245, 158, 11, 0.7); background: rgba(245, 158, 11, 0.16); color: var(--primary-text-color, #212121); font-size: 0.85rem; cursor: pointer; }
    .tbtn ha-icon { --mdc-icon-size: 26px; color: #f59e0b; }
    .tbtn.held { border-color: rgba(96, 165, 250, 0.8); background: rgba(96, 165, 250, 0.16); }
    .tbtn.held ha-icon { color: #60a5fa; }
    .tbtn.idle { border-color: rgba(127, 127, 127, 0.5); background: rgba(127, 127, 127, 0.14); }
    .tbtn.idle ha-icon { color: var(--secondary-text-color, #727272); }
    ha-card { overflow: hidden; }
    /* opzione color: la tinta si mescola allo sfondo della scheda del tema; le tessere con il timer in corso o tenute accese, che sono velature, tengono sotto lo sfondo normale della scheda */
    :host([tinted]) ha-card { background: color-mix(in srgb, var(--lt-tint) 30%, var(--ha-card-background, var(--card-background-color, #fff))); border: 1px solid color-mix(in srgb, var(--lt-tint) 55%, transparent); }
    :host([tinted]) .tile.running { background: linear-gradient(rgba(245, 158, 11, 0.12), rgba(245, 158, 11, 0.12)), var(--card-background-color, #fff); }
    :host([tinted]) .tile.held { background: linear-gradient(rgba(96, 165, 250, 0.13), rgba(96, 165, 250, 0.13)), var(--card-background-color, #fff); }
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
  `}};p([g({attribute:!1})],w.prototype,"hass",2),p([m()],w.prototype,"_config",2),p([m()],w.prototype,"_info",2),p([m()],w.prototype,"_error",2),p([m()],w.prototype,"_now",2),p([m()],w.prototype,"_onlyOn",2);customElements.get("luci-timer-card")||customElements.define("luci-timer-card",w);window.customCards=window.customCards||[];window.customCards.push({type:"luci-timer-card",name:"Timer luci",description:"Luci con timer di spegnimento: conto alla rovescia, +5 minuti, tieni accesa, statistiche e preferenze."});console.info("%c LUCI-TIMER %c v0.7.0 ","color: white; background: #b45309; font-weight: 700;","color: #b45309; background: white; font-weight: 700;");export{w as LuciTimerCard};
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
