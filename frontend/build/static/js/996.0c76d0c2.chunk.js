"use strict";(self.webpackChunkfrontend=self.webpackChunkfrontend||[]).push([[996],{6699:function(r,e,t){var n=t(1703),o=t(3767),s=t(890),a=t(184);e.Z=function(r){return r.hasInput?null:(0,a.jsxs)(o.Z,{alignItems:"center",spacing:1,my:6,children:[(0,a.jsx)(n.Z,{sx:{width:120,height:120,color:"grey.400"}}),(0,a.jsx)(s.Z,{variant:"h5",align:"center",color:"textSecondary",children:"Type something to search"})]})}},2942:function(r,e,t){var n=t(1964),o=t(3767),s=t(890),a=t(184);e.Z=function(r){var e=r.errorMessage,t=r.errorStatus;return e?(0,a.jsxs)(o.Z,{alignItems:"center",spacing:1,my:6,children:[(0,a.jsx)(n.Z,{sx:{width:120,height:120,color:"grey.400"}}),(0,a.jsxs)(s.Z,{align:"center",component:"p",variant:"h5",color:"textSecondary",children:["Oops! ",e]}),404===t&&(0,a.jsx)(s.Z,{align:"center",color:"textSecondary",children:"Type something else"})]}):null}},7996:function(r,e,t){t.r(e),t.d(e,{content:function(){return S},resultTypes:function(){return w}});var n=t(2982),o=t(885),s=t(1918),a=t(6125),i=t(7482),c=t(493),l=t(4852),u=t(9900),d=t(5892),h=t(703),p=t(3767),f=t(890),y=t(4378),x=t(1426),g=t(2950),m=t(2791),Z=t(8385),v=t(6699),j=t(2942),b=t(184),S="...ipsum dolor sit amet consectetur adipisicing elit...",w=[{type:"post",color:"primary"},{type:"user",color:"error"},{type:"community",color:"success"}];e.default=function(r){var e=r.anchorEl,t=r.query,R=(0,g.Z)(),T=R.transitions,k=R.zIndex,I=(0,m.useRef)(null),E=Boolean(e),C=(0,m.useState)([]),M=(0,o.Z)(C,2),P=M[0],Y=M[1],L=(0,m.useMemo)((function(){return S.replaceAll(t,"<mark>".concat(t,"</mark>"))}),[t]),O=(0,x.ZP)((function(){if(t){var r=new URLSearchParams;return r.set("query",t),P.forEach((function(e){r.set(e,"1")})),"search?"+r.toString()}return null}),Z._,{shouldRetryOnError:!1}),_=(O.data,O.error),q=O.isValidating;(0,m.useEffect)((function(){I.current&&(E?(I.current.style.transform="translateY(12.8px)",I.current.style.opacity="1"):(I.current.style.transform="translateY(0)",I.current.style.opacity="0"))}),[E]);var z=function(r){var e=r.currentTarget.textContent;e&&Y((function(r){var t=r.filter((function(r){return r!==e}));return t.length===r.length?[].concat((0,n.Z)(r),[e]):t}))};return(0,b.jsx)(d.Z,{disablePortal:!0,open:E,role:void 0,anchorEl:e,style:{zIndex:k.modal},children:(0,b.jsxs)(h.Z,{ref:I,elevation:6,sx:{width:400,opacity:0,maxHeight:510,overflowY:"auto",transform:"translateY(0)",borderTopLeftRadius:.2,borderTopRightRadius:.2,transition:T.create(["transform","opacity"],{duration:T.duration.shortest,easing:T.easing.easeOut,delay:T.duration.short})},children:[(0,b.jsx)(p.Z,{direction:"row",spacing:1.5,children:w.map((function(r){var e=r.type,t=r.color;return(0,b.jsx)(s.Z,{label:e,color:t,variant:P.includes(e)?"filled":"outlined",onClick:z,sx:{height:25,borderRadius:.5}},e)}))}),(0,b.jsx)(a.Z,{in:q,children:(0,b.jsx)(i.Z,{sx:{my:1.5}})}),(0,b.jsx)(v.Z,{hasInput:!!t}),(0,b.jsx)(j.Z,{errorMessage:null===_||void 0===_?void 0:_.message,errorStatus:null===_||void 0===_?void 0:_.response.status}),t&&!_?(0,b.jsx)(c.Z,{role:"listbox",children:[1,2,3,4].map((function(r){return(0,b.jsx)(l.ZP,{role:"option",id:"item-".concat(r),button:!0,children:(0,b.jsx)(u.Z,{primary:(0,b.jsx)(f.Z,{dangerouslySetInnerHTML:{__html:L},color:q?"grey.500":"text.primary"}),secondary:(0,b.jsx)(y.Z,{}),disableTypography:!0})},r)}))}):null]})})}},4378:function(r,e,t){var n=t(1918),o=t(184);e.Z=function(){return(0,o.jsx)(n.Z,{label:"post",variant:"outlined",color:"primary",sx:{height:20,borderRadius:.5}})}}}]);
//# sourceMappingURL=996.0c76d0c2.chunk.js.map