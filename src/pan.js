/*<![CDATA[*/
// MapNavigator (23-May-2011) DRAFT
// by Vic Phillips http://www.vicsjavascripts.org.uk

function zxcMapNavigator(o){
 var pobj=document.getElementById(o.ID),img=pobj.getElementsByTagName('DIV')[0],nav=document.getElementById(o.NavID),nobj=nav.getElementsByTagName('DIV')[0],r=img.offsetWidth/nav.offsetWidth,marks=o.Markers,mark,pop,z0=0;
 img.style.position='absolute';
 nobj.style.position='absolute';
 nobj.style.width=pobj.offsetWidth/r+'px';
 nobj.style.height=pobj.offsetHeight/r+'px';
 for (;z0<marks.length;z0++){
  mark=document.createElement('DIV');
  mark.className=marks[z0][0];
  img.appendChild(mark);
  mark.style.left=marks[z0][1]-mark.offsetWidth/2+'px';
  mark.style.top=marks[z0][2]-mark.offsetHeight/2+'px';
  pop=document.getElementById(marks[z0][3]);
  if (pop){
   pop.style.left=marks[z0][1]-pop.offsetWidth/2+'px';
   pop.style.top=marks[z0][2]+marks[z0][4]+'px';
   this.addevt(pop,'mouseup','popclose');
  }
  this.addevt(mark,'mouseup','markpos',[mark,pop]);
 }
 this.lst=false;
 this.img=img;
 this.pobj=pobj;
 this.nav=nav;
 this.nobj=nobj;
 this.r=r;
 this.navpos();
 this.drag=false;
 this.addevt(nobj,'mousedown','ndown');
 this.addevt(img,'mousedown','down');
 this.addevt(document,'mousemove','move');
 this.addevt(document,'mousemove','nmove');
 this.addevt(document,'mouseup','up');
}

zxcMapNavigator.prototype={

 markpos:function(e,mark){
  this.popclose();
  var img=this.img,pobj=this.pobj,m=mark[0],lft=-m.offsetLeft-m.offsetWidth/2+pobj.offsetWidth/2,top=-m.offsetTop+100;
  img.style.left=-m.offsetLeft-m.offsetWidth/2+pobj.offsetWidth/2+'px';
  img.style.top=-m.offsetTop-m.offsetHeight/2+100+'px';
  if (mark[1]){
   mark[1].style.visibility='visible';
   this.lst=mark[1];
  }
  this.navpos();
 },

 popclose:function(){
  if (this.lst){
   this.lst.style.visibility='hidden';
  }
 },

 navpos:function(){
  var img=this.img,nobj=this.nobj,r=this.r;
  nobj.style.left=-img.offsetLeft/r+'px';
  nobj.style.top=-img.offsetTop/r+'px';
 },

 imgpos:function(){
  var img=this.img,nobj=this.nobj,r=this.r;
  img.style.left=-nobj.offsetLeft*r+'px';
  img.style.top=-nobj.offsetTop*r+'px';
 },

 addevt:function(o,t,f,p){
  var oop=this;
  if (o.addEventListener) o.addEventListener(t,function(e){ return oop[f](e,p);}, false);
  else if (o.attachEvent) o.attachEvent('on'+t,function(e){ return oop[f](e,p); });
 },

 mse:function(e){
  if (window.event){
   var docs=[document.body.scrollLeft,document.body.scrollTop];
   if (!document.body.scrollTop){
    docs=[document.documentElement.scrollLeft,document.documentElement.scrollTop];
   }
   return [e.clientX+docs[0],e.clientY+docs[1]];
  }
  return [e.pageX,e.pageY];
 },

 style:function(obj,p){
  if (obj.currentStyle){
   return parseInt(obj.currentStyle[p.replace(/-/g,'')]);
  }
  return parseInt(document.defaultView.getComputedStyle(obj,null).getPropertyValue(p));
 },


 down:function(e){
  document.onselectstart=function(event){
   window.event.returnValue=false;
  }
  this.minX=-this.img.offsetWidth+this.pobj.offsetWidth;
  this.minY=-this.img.offsetHeight+this.pobj.offsetHeight;
  this.lastXY=[e.clientX,e.clientY];
  this.drag=true;
  if (!window.event){
   e.preventDefault();
  }
  return false;
 },

 move:function(e){
  if (this.drag){
   var mse=[e.clientX,e.clientY],lft=this.style(this.img,'left')+mse[0]-this.lastXY[0],top=this.style(this.img,'top')+mse[1]-this.lastXY[1];
   this.img.style.left=Math.max(Math.min(lft,0),this.minX)+'px';
   this.img.style.top=Math.max(Math.min(top,0),this.minY)+'px';
   this.lastXY=mse;
   this.navpos();
  }
  if (!window.event){
   e.preventDefault();
  }
  return false;
 },

 ndown:function(e){
  document.onselectstart=function(event){
   window.event.returnValue=false;
  }
  this.maxX=this.nav.offsetWidth-this.nobj.offsetWidth;
  this.maxY=this.nav.offsetHeight-this.nobj.offsetHeight;
  this.lastXY=[e.clientX,e.clientY];
  this.ndrag=true;
  if (!window.event){
   e.preventDefault();
  }
  return false;
 },

 nmove:function(e){
  if (this.ndrag){
   var mse=[e.clientX,e.clientY],lft=this.style(this.nobj,'left')+mse[0]-this.lastXY[0],top=this.style(this.nobj,'top')+mse[1]-this.lastXY[1];
   this.nobj.style.left=Math.max(Math.min(lft,this.maxX),0)+'px';
   this.nobj.style.top=Math.max(Math.min(top,this.maxY),0)+'px';
   this.lastXY=mse;
   this.imgpos();
  }
  if (!window.event){
   e.preventDefault();
  }
  return false;
 },

 up:function(e){
  if (this.drag||this.ndrag){
   this.drag=false;
   this.ndrag=false;
   document.onselectstart=null;
  }
 }

}

new zxcMapNavigator({
 ID:'tst',
 NavID:'nav',
 Markers:[
  ['m1',1200,290,'pop1',50],
  ['m2',1200,1290,'pop2',50]
 ]
});
/*]]>*/