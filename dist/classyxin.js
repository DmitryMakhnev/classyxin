!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define(n):"object"==typeof exports?exports.classyxin=n():t.classyxin=n()}(this,function(){return function(t){function n(e){if(r[e])return r[e].exports;var o=r[e]={exports:{},id:e,loaded:!1};return t[e].call(o.exports,o,o.exports,n),o.loaded=!0,o.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t){function n(t,n,r){for(var e in t)!t.hasOwnProperty(e)||r&&!r(e)||(n[e]=t[e]);return n}function r(t){switch(t){case"init":case"destructor":case"__Constructor":case"constructor":return!1}return!0}function e(t,n){for(var r=0,e=t.length;e>r;r+=1)n.push(t[r]);return n}function o(t){return 0!==t.length}function s(){function t(){var t=this,n=t.__Constructor.__inits;if(n)for(var r=0,e=n.length;e>r;r+=1)n[r].apply(t,arguments);return t}return t.__cmId=l,t.prototype.__Constructor=t,l+=1,t}function i(){var t=this,n=t.__Constructor.__destructors;if(n)for(var r=n.length;r--;)n[r].apply(t,arguments)}function u(t,n,r){var e=this;e.parent=t,e.settings=n,e.notAutoDestruct=r||!1}function c(t){var n=this;n.base=t,n.__mixinId=l,l+=1}function _(t){return"function"==typeof t}function a(t){return t instanceof u}function f(t){return t instanceof c}function p(t){return!_(t)&&!a(t)&&!f(t)}function d(){function t(t,n){t.__classesIds&&e(t.__classesIds,I),t.__cmId&&I.push(t.__cmId),t.__inits&&e(t.__inits,g),t.prototype.init&&n&&!n.needInit&&g.pop(),t.__mixinsIds&&e(t.__mixinsIds,y),t.__destructors&&e(t.__destructors,C),m=t.prototype}var u,c,d=arguments;d.length>0&&(c=d[d.length-1],p(c)&&(u=c));var l,x,h,v,m=null,I=[],y=[],g=[],C=[];for(x=0,h=d.length;h>x;x+=1)v=d[x],_(v)?t(v):a(v)?(t(v.parent,v.settings),v.notAutoDestruct||v.destructor()):f(v)&&(y.push(v.__mixinId),m=v.base),m&&(l||(l={}),n(m,l,r),m=null);l&&(u&&n(u,l),u=l);var b=s();u&&(b.prototype=u);var w=b.prototype;return w.__Constructor=b,I.push(b.__cmId),w.destructor&&C.push(w.destructor),w.init&&g.push(w.init),b.__classesIds=I,o(y)&&(b.__mixinsIds=y),o(g)&&(b.__inits=g),o(C)&&(b.__destructors=C),w.destructor=i,b}var l=1;u.prototype.destructor=function(){var t=this;t.parent=null,t.settings=null},c.prototype.destructor=function(){var t=this;t.base=null,t.__mixinId=null};var x={createClassConstructor:s,ParentConfigurator:u,configureParent:function(t,n,r){return new u(t,n,r)},Mixin:c,createMixin:function(t){return new c(t)},createClass:d,instanceOf:function(t,n){var r=t.__Constructor;if(r){var e=r.__classesIds;if(e)return-1!==e.indexOf(n.__cmId)}return!1},hasMixin:function(t,n){var r=t.__Constructor;if(r){var e=r.__mixinsIds;if(e)return-1!==e.indexOf(n.__cmId)}return!1}};t.exports=x}])});