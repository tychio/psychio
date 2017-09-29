webpackJsonp([0],[,,,function(t,e){},function(t,e,n){function s(t){n(13)}var i=n(0)(n(7),n(24),s,null,null);t.exports=i.exports},,function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=n(2),i=n(4),a=n.n(i),r=n(5),o=n.n(r),c=n(3);n.n(c);s.default.config.productionTip=!1,s.default.use(o.a),new s.default({el:"#app",template:"<App/>",components:{App:a.a}})},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=n(21),i=n.n(s);e.default={name:"app",data:function(){return{designs:JSON.parse('{\n      "picture-naming": [\n        "001", "002", "003", "004", "005", "006", "007", "008", "009"\n      ],\n      "lexical-decision": {\n        "chinese": {\n          "words": [\n            "001", "002", "003", "004", "005"\n          ],\n          "nonwords": [\n            "001", "002", "003", "004", "005"\n          ]\n        },\n        "uyghur": {  \n          "words": [\n            "001", "002", "003", "004", "005"\n          ],\n          "nonwords": [\n            "001", "002", "003", "004", "005"\n          ]\n        }\n      }\n    }')}},components:{Dashboard:i.a}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"LexicalDecision",props:["item","language"],data:function(){return{startDate:0,status:null,result:{name:this.item.name,isNon:this.item.isNon,response:0,right:!1,src:""}}},watch:{status:function(){"end"===this.status?(this.end(),this.$emit("end",this.result)):"playing"===this.status&&(this.startDate=new Date)}},methods:{end:function(t){t?"playing"===this.status&&(clearTimeout(this.endTimeout),this.status="end",this.record(),this.result.right=13===t.keyCode):this.record()},record:function(){this.result.response=new Date-this.startDate,this.result.src=this.imageSrc,this.startDate=0}},computed:{imageSrc:function(){return"./static/lexical-decision/"+this.language+"-"+(this.item.isNon?"nonwords":"words")+"/"+this.item.name+".png"}},mounted:function(){var t=this,e=[1e3,500,4e3];this.status="start",setTimeout(function(){t.status="ready"},e[0]),setTimeout(function(){t.status="playing"},e[0]+e[1]),this.endTimeout=setTimeout(function(){t.status="end"},e[0]+e[1]+e[2])},directives:{focus:{inserted:function(t){setInterval(function(){return t.focus()},50)}}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=n(16),i=n.n(s),a=window.webkitSpeechRecognition;e.default={name:"PictureNaming",props:["item","language"],data:function(){return{startDate:0,status:null,result:{name:this.item.name,language:this.item.language,response:0,record:null,src:""},recognition:new a,media:null}},watch:{status:function(){"end"===this.status?(this.record(),this.recognition.onspeechstart=function(){},this.media.stop(),this.$emit("end",this.result)):"playing"===this.status?(this.startDate=new Date,this.media.start(4e3)):"ready"===this.status&&this.recognition.start()}},methods:{loadRecorder:function(){var t=this;navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia,navigator.getUserMedia({audio:!0},function(e){t.media=new i.a(e),t.media.mimeType="audio/wav",t.media.ondataavailable=function(e){t.result.record=e}},function(t){console.error("media error",t)})},record:function(){this.startDate&&(this.result.response=new Date-this.startDate,this.result.src=this.imageSrc,this.startDate=0)}},computed:{languageSay:function(){return{chinese:"说",uyghur:"ئېيتماق",english:"Say"}[this.item.language]},imageSrc:function(){return"./static/picture-naming/"+this.item.name+".gif"}},mounted:function(){var t=this;this.loadRecorder();var e=[1e3,500,500,4e3];this.recognition.onspeechstart=function(){"playing"===t.status&&(t.status="saying",t.record())},this.status="start",setTimeout(function(){t.status="ready"},e[0]),setTimeout(function(){t.status="prompt"},e[0]+e[1]),setTimeout(function(){t.status="playing"},e[0]+e[1]+e[2]),setTimeout(function(){t.status="end"},e[0]+e[1]+e[2]+e[3])}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var s=n(15),i=(n.n(s),n(17)),a=(n.n(i),n(20)),r=n.n(a),o=n(19),c=n.n(o);e.default={name:"Dashboard",props:["design"],data:function(){return{type:"picture-naming",language:"chinese",current:-1,list:[],results:[]}},methods:{blobUrl:function(t){return t&&URL.createObjectURL(t)},play:function(){var t=this;this.current=-1,this.results=[],i.enabled&&i.request(this.$refs.container),this.list=this.random(),this.$nextTick(function(){t.current=0})},next:function(t){var e=this;t&&(this.results.push(t),this.current===this.list.length-1?(this.current=-1,i.exit()):setTimeout(function(){e.current++},500))},random:function(){return this[{"picture-naming":"randomPictures","lexical-decision":"randomLexical"}[this.type]]()},randomLexical:function(){var t=this.items[this.language],e=s.map(t.nonwords,function(t){return{name:t,isNon:!0}}),n=s.map(t.words,function(t){return{name:t,isNon:!1}}),i=s.concat(e,n);return s.sampleSize(i,i.length)},randomPictures:function(){for(var t=["uyghur","chinese"],e=t.length,n=Math.round(this.items.length/(e*e)),i=[],a=0;a<e;a++)for(var r=0;r<e;r++)i.push({count:n,direction:[a,r]});return s.chain(this.items).sortBy(function(){return s.random(0,1,!0)>.5}).reduce(function(e,n){var a=e.length>0?e[e.length-1]:{},r=t.indexOf(a.language),o=s.sample(t);if(r>=0){var c=s.sample(s.filter(i,function(t){var e=t.direction[0],n=e===r,a=t.count>0;if(e!==t.direction[1]){var o=s.find(i,function(t){return t.direction.join("|")===[e,e].join("|")});a=t.count>1||1===t.count&&0===o.count}return a&&n}));c.count--,o=t[c.direction[1]]}return e.push({name:n,language:o}),e},[]).value()}},computed:{items:function(){return this.design[this.type]}},components:{"picture-naming":r.a,"lexical-decision":c.a}}},function(t,e){},function(t,e){},function(t,e){},function(t,e){},,,,function(t,e,n){t.exports=n.p+"static/img/logo.be50dde.png"},function(t,e,n){function s(t){n(14)}var i=n(0)(n(8),n(25),s,"data-v-804d13e4",null);t.exports=i.exports},function(t,e,n){function s(t){n(11)}var i=n(0)(n(9),n(22),s,"data-v-09783e54",null);t.exports=i.exports},function(t,e,n){function s(t){n(12)}var i=n(0)(n(10),n(23),s,null,null);t.exports=i.exports},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"show",rawName:"v-show",value:t.status,expression:"status"}],class:["stage","stage-"+t.status]},[n("div",{staticClass:"stage-pic",style:{"background-image":"url("+t.imageSrc+")"}}),t._v(" "),n("i",{staticClass:"icon icon-cross"}),t._v(" "),n("i",{staticClass:"icon icon-dot"}),t._v(" "),n("i",{staticClass:"icon icon-lang"},[t._v(t._s(t.languageSay))])])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("main",{staticClass:"phone-viewport"},[n("section",{staticClass:"container"},[n("h1",{staticClass:"md-display-2"},[t._v("PsychIO")]),t._v(" "),n("form",{staticClass:"form"},[n("md-input-container",[n("label",[t._v("Test Type/测试类型")]),t._v(" "),n("md-select",{attrs:{name:"type"},model:{value:t.type,callback:function(e){t.type=e},expression:"type"}},[n("md-option",{attrs:{value:"picture-naming"}},[t._v("Picture Naming/图片命名")]),t._v(" "),n("md-option",{attrs:{value:"lexical-decision"}},[t._v("Lexical Decision/词汇判断")])],1)],1),t._v(" "),"lexical-decision"===t.type?n("md-input-container",[n("label",[t._v("Languages/语言")]),t._v(" "),n("md-select",{attrs:{name:"type"},model:{value:t.language,callback:function(e){t.language=e},expression:"language"}},[n("md-option",{attrs:{value:"chinese"}},[t._v("Chiese/中文")]),t._v(" "),n("md-option",{attrs:{value:"uyghur"}},[t._v("Uyghur/维文")])],1)],1):t._e()],1),t._v(" "),n("md-button",{staticClass:"md-raised md-accent",nativeOn:{click:function(e){t.play(e)}}},[t._v("Play")])],1),t._v(" "),n("section",{ref:"container",class:["container",{processing:t.current>=0}]},t._l(t.list,function(e,s){return t.current>=s?n("div",{directives:[{name:"show",rawName:"v-show",value:t.current<=s,expression:"current <= index"}]},[n(t.type,{tag:"component",attrs:{item:e,language:t.language},on:{end:t.next}})],1):t._e()})),t._v(" "),n("section",{staticClass:"container"},[n("md-list",t._l(t.results,function(e,s){return n("md-list-item",{key:"index",attrs:{href:t.blobUrl(e.record),target:"_blank"}},[n("md-avatar",[n("img",{attrs:{src:e.src}})]),t._v(" "),n("span",[t._v(t._s(e.name)+" - ("+t._s(e.response)+"ms)")]),t._v(" "),e.language?n("span",[t._v("["+t._s(e.language)+"]")]):t._e(),t._v(" "),"lexical-decision"===t.type?[n("small",[t._v("Choice/选择(Fact/实际)："+t._s(e.right?"True/真":"False/假")+"("+t._s(e.isNon?"False/假":"True/真")+")")]),t._v(" "),e.right!==e.isNon?n("md-icon",{staticClass:"md-primary",attrs:{"md-theme":"green"}},[t._v("done")]):n("md-icon",{staticClass:"md-warn",attrs:{"md-theme":"orange"}},[t._v("clear")])]:t._e()],2)}))],1)])},staticRenderFns:[]}},function(t,e,n){t.exports={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{attrs:{id:"app"}},[s("img",{attrs:{src:n(18)}}),t._v(" "),s("Dashboard",{attrs:{design:t.designs}}),t._v(" "),s("ul",{staticClass:"transparent"},[t._l(t.designs["picture-naming"],function(t){return s("li",[s("img",{attrs:{src:"./static/picture-naming/"+t}})])}),t._v(" "),t._l(t.designs["lexical-decision"],function(e,n){return s("li",[t._l(e,function(e,i){return t._l(e,function(t){return s("img",{attrs:{src:"./static/"+n+"-"+i+"/"+t}})})})],2)})],2)],1)},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{directives:[{name:"show",rawName:"v-show",value:t.status,expression:"status"}],class:["stage","stage-"+t.status]},[n("div",{staticClass:"stage-pic",style:{"background-image":"url("+t.imageSrc+")"}}),t._v(" "),n("i",{staticClass:"icon icon-cross"}),t._v(" "),n("i",{staticClass:"icon icon-dot"}),t._v(" "),"playing"===t.status?n("input",{directives:[{name:"focus",rawName:"v-focus"}],attrs:{type:"text"},on:{keyup:t.end}}):t._e()])},staticRenderFns:[]}}],[6]);
//# sourceMappingURL=app.0ec673c75a5873cf2567.js.map