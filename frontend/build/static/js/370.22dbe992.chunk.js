"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[370,996],{6699:function(r,e,t){var n=t(1703),o=t(3767),s=t(890),a=t(184);e.Z=function(r){return r.hasInput?null:(0,a.jsxs)(o.Z,{alignItems:"center",spacing:1,my:6,children:[(0,a.jsx)(n.Z,{sx:{width:120,height:120,color:"grey.400"}}),(0,a.jsx)(s.Z,{variant:"h5",align:"center",color:"textSecondary",children:"Type something to search"})]})}},2942:function(r,e,t){var n=t(1964),o=t(3767),s=t(890),a=t(184);e.Z=function(r){var e=r.errorMessage,t=r.errorStatus;return e?(0,a.jsxs)(o.Z,{alignItems:"center",spacing:1,my:6,children:[(0,a.jsx)(n.Z,{sx:{width:120,height:120,color:"grey.400"}}),(0,a.jsxs)(s.Z,{align:"center",component:"p",variant:"h5",color:"textSecondary",children:["Oops! ",e]}),404===t&&(0,a.jsx)(s.Z,{align:"center",color:"textSecondary",children:"Type something else"})]}):null}},7996:function(r,e,t){t.r(e),t.d(e,{content:function(){return S},resultTypes:function(){return T}});var n=t(2982),o=t(885),s=t(1918),a=t(6125),i=t(7482),c=t(493),l=t(4852),u=t(9900),d=t(5892),h=t(703),f=t(3767),p=t(890),x=t(4378),y=t(1426),g=t(2950),m=t(2791),Z=t(8385),j=t(6699),v=t(2942),b=t(184),S="...ipsum dolor sit amet consectetur adipisicing elit...",T=[{type:"post",color:"primary"},{type:"user",color:"error"},{type:"community",color:"success"}];e.default=function(r){var e=r.anchorEl,t=r.query,R=(0,g.Z)(),k=R.transitions,w=R.zIndex,I=(0,m.useRef)(null),E=Boolean(e),M=(0,m.useState)([]),C=(0,o.Z)(M,2),P=C[0],_=C[1],L=(0,m.useMemo)((function(){return S.replaceAll(t,"<mark>".concat(t,"</mark>"))}),[t]),q=(0,y.ZP)((function(){if(t){var r=new URLSearchParams;return r.set("query",t),P.forEach((function(e){r.set(e,"1")})),"search?"+r.toString()}return null}),Z._,{shouldRetryOnError:!1}),O=(q.data,q.error),Y=q.isValidating;(0,m.useEffect)((function(){I.current&&(E?(I.current.style.transform="translateY(12.8px)",I.current.style.opacity="1"):(I.current.style.transform="translateY(0)",I.current.style.opacity="0"))}),[E]);var H=function(r){var e=r.currentTarget.textContent;e&&_((function(r){var t=r.filter((function(r){return r!==e}));return t.length===r.length?[].concat((0,n.Z)(r),[e]):t}))};return(0,b.jsx)(d.Z,{disablePortal:!0,open:E,role:void 0,anchorEl:e,style:{zIndex:w.modal},children:(0,b.jsxs)(h.Z,{ref:I,elevation:6,sx:{width:400,opacity:0,maxHeight:510,overflowY:"auto",transform:"translateY(0)",borderTopLeftRadius:.2,borderTopRightRadius:.2,transition:k.create(["transform","opacity"],{duration:k.duration.shortest,easing:k.easing.easeOut,delay:k.duration.short})},children:[(0,b.jsx)(f.Z,{direction:"row",spacing:1.5,children:T.map((function(r){var e=r.type,t=r.color;return(0,b.jsx)(s.Z,{label:e,color:t,variant:P.includes(e)?"filled":"outlined",onClick:H,sx:{height:25,borderRadius:.5}},e)}))}),(0,b.jsx)(a.Z,{in:Y,children:(0,b.jsx)(i.Z,{sx:{my:1.5}})}),(0,b.jsx)(j.Z,{hasInput:!!t}),(0,b.jsx)(v.Z,{errorMessage:null===O||void 0===O?void 0:O.message,errorStatus:null===O||void 0===O?void 0:O.response.status}),t&&!O?(0,b.jsx)(c.Z,{role:"listbox",children:[1,2,3,4].map((function(r){return(0,b.jsx)(l.ZP,{role:"option",id:"item-".concat(r),button:!0,children:(0,b.jsx)(u.Z,{primary:(0,b.jsx)(p.Z,{dangerouslySetInnerHTML:{__html:L},color:Y?"grey.500":"text.primary"}),secondary:(0,b.jsx)(x.Z,{}),disableTypography:!0})},r)}))}):null]})})}},4378:function(r,e,t){var n=t(1918),o=t(184);e.Z=function(){return(0,o.jsx)(n.Z,{label:"post",variant:"outlined",color:"primary",sx:{height:20,borderRadius:.5}})}},6370:function(r,e,t){t.r(e);var n=t(2982),o=t(885),s=t(1426),a=t(3767),i=t(1918),c=t(6125),l=t(7482),u=t(493),d=t(4852),h=t(9900),f=t(890),p=t(2791),x=t(3504),y=t(1731),g=t(7996),m=t(6699),Z=t(2942),j=t(4378),v=t(184);e.default=function(){var r=(0,x.lr)(),e=(0,o.Z)(r,2),t=e[0],b=e[1],S=(0,p.useState)([]),T=(0,o.Z)(S,2),R=T[0],k=T[1],w=(0,p.useMemo)((function(){return t.get("query")}),[t]),I=(0,p.useMemo)((function(){return w?g.content.replaceAll(w,"<mark>".concat(w,"</mark>")):g.content}),[w]),E=(0,s.ZP)(w?"search?"+t.toString():null,y._i,{shouldRetryOnError:!1}),M=(E.data,E.error),C=E.isValidating;(0,p.useEffect)((function(){var r=new URLSearchParams;w&&r.set("query",w),R.forEach((function(e){r.set(e,"1")})),b(r.toString(),{replace:!0})}),[R,w]);var P=function(r){var e=r.currentTarget.textContent;e&&k((function(r){var t=r.filter((function(r){return r!==e}));return t.length===r.length?[].concat((0,n.Z)(r),[e]):t}))};return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(a.Z,{direction:"row",justifyContent:"center",spacing:1.5,children:g.resultTypes.map((function(r){var e=r.type,t=r.color;return(0,v.jsx)(i.Z,{label:e,color:t,variant:R.includes(e)?"filled":"outlined",onClick:P,sx:{height:25,borderRadius:.5}},e)}))}),(0,v.jsx)(c.Z,{in:C,children:(0,v.jsx)(l.Z,{sx:{my:1.5}})}),(0,v.jsx)(m.Z,{hasInput:!!w}),(0,v.jsx)(Z.Z,{errorMessage:null===M||void 0===M?void 0:M.message,errorStatus:null===M||void 0===M?void 0:M.response.status}),w&&!M?(0,v.jsx)(u.Z,{role:"listbox",children:[1,2,3,4].map((function(r){return(0,v.jsx)(d.ZP,{role:"option",id:"item-".concat(r),button:!0,children:(0,v.jsx)(h.Z,{primary:(0,v.jsx)(f.Z,{dangerouslySetInnerHTML:{__html:I},color:C?"grey.500":"text.primary"}),secondary:(0,v.jsx)(j.Z,{}),disableTypography:!0})},r)}))}):null]})}}}]);
//# sourceMappingURL=370.22dbe992.chunk.js.map