(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{144:function(e,t,n){"use strict";n.r(t);var a=n(151),r=(n(90),n(87)),l=n(19),o=n(1),c=n.n(o),i=n(9),u=n(83),s=n(149),d=n(31),m=n(69),b=n(152),f=["2","3","4","5","6","7","8","9",{value:"0",label:"10",isJoker:!1},"J","Q","K","A",{value:"X",label:"Joker",isJoker:!0}].map(function(e){if("object"===typeof e)return e;return{label:e,value:e,isJoker:!1}}),g=f.reduce(function(e,t){return e[t.value]=t,e},{}),k={H:{value:"H",label:"\u2665",color:"red"},D:{value:"D",label:"\u2666",color:"red"},S:{value:"S",label:"\u2660",color:"black"},C:{value:"C",label:"\u2663",color:"black"},B:{value:"B",label:"",color:"black"},R:{value:"R",label:"",color:"red"}},v=[k.H,k.S,k.C,k.D],h=[k.B,k.R];function y(e){var t=e.rank,n=e.setRank;return c.a.createElement(i.a,{style:{flexDirection:"row"}},c.a.createElement(u.a,{style:{fontSize:22,marginHorizontal:6}},"\u5f53\u524d\u6253",c.a.createElement(b.a,{selectedValue:t,onValueChange:function(e){return n(e)}},f.filter(function(e){return!e.isJoker}).map(function(e){return c.a.createElement(b.a.Item,{key:e.value,label:e.label,value:e.value})}))," ",c.a.createElement(u.a,{style:{color:k.H.color}},k.H.label,g[t].label),"\u662f\u767e\u642d"))}var E=n(2),p=n(150),C=n(86),w=n(85),j=E.a.create({divider:{height:2,backgroundColor:"black"}});function S(){return c.a.createElement(i.a,{style:j.divider})}var O="rgb(33, 150, 243)",x={0:"black",4:"rgb(161, 161, 161)",6:"rgb(223, 223, 223)",8:"white"},R={disabled:{background:x[6],text:x[4]},button:{background:O}};function B(e){var t=e.rank,n=e.suit,a=e.isStacked,r=g[t],l=k[n];return c.a.createElement(i.a,{style:[A.card,a&&A.cardStacked]},c.a.createElement(u.a,{style:{fontFamily:"monospace",fontSize:16,color:l.color,lineHeight:16,textAlign:"center",width:20,marginTop:4,fontWeight:"bold"}},"10"===r.label?r.label:r.label.split("").join("\n"),"\n",l.label))}var H=function(e){var t=e.style,n=e.titleStyle,a=e.title,r=e.disabled,l=Object(C.a)(e,["style","titleStyle","title","disabled"]);return c.a.createElement(w.a,Object.assign({style:[{backgroundColor:r?R.disabled.background:R.button.background,borderRadius:2,padding:4,alignItems:"center",justifyContent:"center"},t],disabled:r},l),c.a.createElement(u.a,{style:[{color:r?R.disabled.text:"white"},n]},a))},D=E.a.create({incDecButton:{flex:2,minWidth:100,maxWidth:200,margin:10},clearButton:{flex:1,minWidth:100,maxWidth:150,margin:10},buttonTitle:{fontSize:30}}),J=function(e){return c.a.createElement(i.a,{style:{flexDirection:"row",justifyContent:"center",alignContent:"center"}},c.a.createElement(H,{onPress:e.clearCards,title:"\u6e05\u9664",disabled:0===e.numberOfCards,style:D.clearButton,titleStyle:D.buttonTitle}),c.a.createElement(H,{onPress:e.decRank,disabled:e.rankID<=0,title:"<",style:D.incDecButton,titleStyle:D.buttonTitle}),c.a.createElement(H,{onPress:e.incRank,title:">",disabled:e.rankID>=f.length-1,style:D.incDecButton,titleStyle:D.buttonTitle}))};function W(e){var t=e.cards,n=e.addCard,a=e.clearCards,r=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=Object(o.useState)(e),n=Object(l.a)(t,2),a=n[0],r=n[1];return{value:a,increase:Object(o.useCallback)(function(){return r(function(e){return e+1})},[r]),decrease:Object(o.useCallback)(function(){return r(function(e){return e-1})},[r])}}(),u=r.value,s=r.increase,d=r.decrease;return c.a.createElement(i.a,{style:{flex:1}},c.a.createElement(p.a,{style:{flex:1,minHeight:60},contentContainerStyle:{flexWrap:"wrap",flexDirection:"row",paddingRight:60,paddingBottom:60,overflow:"hidden"}},t.map(function(e,t){return c.a.createElement(B,Object.assign({key:e.rank+e.suit+t},e,{isStacked:!0}))})),c.a.createElement(S,null),c.a.createElement(p.a,{style:{height:110,flexGrow:0},contentContainerStyle:{flex:1,justifyContent:"center"},horizontal:!0},(f[u].isJoker?h:v).map(function(e){return c.a.createElement(w.a,{key:e.value,onPress:function(){return n({suit:e.value,rank:f[u].value})}},c.a.createElement(B,{suit:e.value,rank:f[u].value}))})),c.a.createElement(J,{numberOfCards:t.length,clearCards:a,rankID:u,incRank:s,decRank:d}))}var A=E.a.create({card:{width:80,height:60*1.618,backgroundColor:"white",borderColor:"black",borderWidth:2,margin:3},cardStacked:{marginRight:-60,marginBottom:-60}});function P(e){for(var t=[],n=0;n<e.size();++n)t.push(e.get(n));return t}function z(e){return{calc:function(t,n){var a=e.calc(t,n.charCodeAt(0));return{minHands:a.minHands,solutions:P(a.solutions)}}}}var I=null;var T=E.a.create({container:{padding:10},borderBox:{borderWidth:2,borderColor:"black"}});function M(e){var t=e.screenProps;Object(o.useEffect)(function(){new Promise(function(e,t){if(window.Module)return e(z(window.Module));var n=document.createElement("script");n.src="res/strategy.js",n.onload=function(){var n=window.Module;n.onRuntimeInitialized=function(){e(z(window.Module))},n.onAbort=function(){t("wasm module aborted during loading")}},n.onerror=function(){return t("wasm module failed to load")},document.body.appendChild(n)}).then(function(e){I=e})},[]);var n=t.rank,a=t.setRank,r=t.cards,d=t.clearCards,m=t.addCard,b=Object(o.useState)(null),f=Object(l.a)(b,2),g=f[0],k=f[1];return c.a.createElement(p.a,{style:[T.borderBox,{height:"100%"}],contentContainerStyle:{height:"100%"}},c.a.createElement(u.a,{style:{fontSize:20,padding:4,textAlign:"center"}},"\u62c6\u724c\u7b56\u7565\u8ba1\u7b97\u7ed3\u679c"),c.a.createElement(S,null),c.a.createElement(p.a,{style:[T.container,{flex:1}]},g&&c.a.createElement(c.a.Fragment,null,c.a.createElement(u.a,null,"\u6700\u5c11".concat(g.minHands,"\u624b\u53ef\u4ee5\u51fa\u5b8c")),c.a.createElement(u.a,null,g.solutions.join("\n")))),c.a.createElement(S,null),c.a.createElement(i.a,{style:[T.container,{height:40,justifyContent:"center",alignItems:"center"}]},c.a.createElement(y,{rank:n,setRank:a})),c.a.createElement(S,null),c.a.createElement(i.a,{style:[T.container,{flex:3}]},c.a.createElement(W,{cards:r,addCard:m,clearCards:d})),c.a.createElement(S,null),c.a.createElement(i.a,{style:[T.container,{height:34,justifyContent:"center",padding:0}]},c.a.createElement(s.a,{title:"\u8ba1\u7b97\u7b56\u7565",onPress:function(){if(null!=I){var e=function(e){return e.map(function(e){return"X"===e.rank?"R"===e.suit?"BJ":"SJ":e.rank+e.suit}).join("")}(r);console.log(e),k(I.calc(e,n))}}})))}M.navigationOptions={title:"\u63bc\u86cb\u7b56\u7565\u8ba1\u7b97"};var F=Object(d.createSwitchNavigator)({Home:M,Details:function(e){return c.a.createElement(i.a,null,c.a.createElement(u.a,null,"Details"),c.a.createElement(s.a,{title:"Go to Home",onPress:function(){return e.navigation.navigate("Home")}}))}},{initialRouteName:"Home"});function G(e){var t=Object(o.useState)("2"),n=Object(l.a)(t,2),a=n[0],u=n[1],s=function(){var e=Object(o.useState)([]),t=Object(l.a)(e,2),n=t[0],a=t[1];return{cards:n,clearCards:Object(o.useCallback)(function(){return a([])},[a]),addCard:Object(o.useCallback)(function(e){return a(function(t){return t.concat(e)})},[a])}}();return c.a.createElement(i.a,{style:{flex:1,backgroundColor:"lightblue",height:"100%"}},c.a.createElement(F,Object.assign({screenProps:Object(r.a)({rank:a,setRank:u},s)},e)))}G.router=F.router;var N=Object(m.createBrowserApp)(G);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a.a.registerComponent("App",function(){return N}),a.a.runApplication("App",{rootTag:document.getElementById("root")}),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},89:function(e,t,n){e.exports=n(144)},90:function(e,t,n){}},[[89,1,2]]]);
//# sourceMappingURL=main.9f0251d6.chunk.js.map