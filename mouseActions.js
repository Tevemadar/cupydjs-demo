var cur={x:0,y:0,z:0};
function cut2cur(/*x,y,z*/){
    /*if(x)*/cur.x=((dsq-volprops.width)/2+cut.cx)*sq/dsq;
    /*if(y)*/cur.y=((dsq-volprops.height)/2+cut.cy)*sq/dsq;
    /*if(z)*/cur.z=((dsq-volprops.depth)/2+cut.cz)*sq/dsq;
}
function cur2cut(x,y,z){
    if(x)cut.cx=cur.x*dsq/sq-(dsq-volprops.width)/2;
    if(y)cut.cy=cur.y*dsq/sq-(dsq-volprops.height)/2;
    if(z)cut.cz=cur.z*dsq/sq-(dsq-volprops.depth)/2;
}

function dodrag(event,drag,xsel,ysel){
    var mx=event.offsetX;
    var my=event.offsetY;
    cur[xsel]+=mx-drag.x;
    cur[ysel]+=my-drag.y;
    drag.x=mx;
    drag.y=my;
    cur2cut(true,true,true);
    redrawall();
}
function dorot(event,rot,xsel,ysel){
    var mx=event.offsetX;
    var my=event.offsetY;
    var x1=mx-cur[xsel];
    var y1=my-cur[ysel];
    var x2=rot.x-cur[xsel];
    var y2=rot.y-cur[ysel];
    var l1=Math.sqrt(x1*x1+y1*y1);
    var l2=Math.sqrt(x2*x2+y2*y2);
    var dot=x1*x2+y1*y2;
    var cross=y1*x2-x1*y2;
    var cos=dot/l1/l2;
    var sin=cross/l1/l2;

    var cx=cut["u"+xsel];
    var cy=cut["u"+ysel];
    cut["u"+xsel]=cx*cos-cy*sin;
    cut["u"+ysel]=cx*sin+cy*cos;
    cx=cut["v"+xsel];
    cy=cut["v"+ysel];
    cut["v"+xsel]=cx*cos-cy*sin;
    cut["v"+ysel]=cx*sin+cy*cos;

    rot.x=mx;
    rot.y=my;
    redrawall();
}

var sdrag,srot;
function sdown(event){
    event.preventDefault();
    var pick={x:event.offsetX,y:event.offsetY};
    if(Math.pow(pick.x-cur.z,2)+Math.pow(pick.y-cur.y,2)<100)
    sdrag=pick;else srot=pick;
    ovly();
}
function sup(event){
    sdrag=srot=undefined;
    ovly();
}
function smove(event){
    if(sdrag)dodrag(event,sdrag,"z","y");
    else if(srot)dorot(event,srot,"z","y");
//                cur2cut(false,true,true);
}
var cdrag,crot;
function cdown(event){
    event.preventDefault();
    var pick={x:event.offsetX,y:event.offsetY};
    if(Math.pow(pick.x-cur.x,2)+Math.pow(pick.y-cur.y,2)<100)
    cdrag=pick;else crot=pick;
    ovly();
}
function cup(event){
    cdrag=crot=undefined;
    ovly();
}
function cmove(event){
    if(cdrag)dodrag(event,cdrag,"x","y");
    else if(crot)dorot(event,crot,"x","y");
//                cur2cut(true,true,false);
}
var hdrag,hrot;
function hdown(event){
    event.preventDefault();
    var pick={x:event.offsetX,y:event.offsetY};
    if(Math.pow(pick.x-cur.x,2)+Math.pow(pick.y-cur.z,2)<100)
    hdrag=pick;else hrot=pick;
    ovly();
}
function hup(event){
    hdrag=hrot=undefined;
    ovly();
}
function hmove(event){
    if(hdrag)dodrag(event,hdrag,"x","z");
    else if(hrot)dorot(event,hrot,"x","z");
//                cur2cut(true,false,true);
}

function mwheel(event){
    if(event.deltaY<0){
        var u=(event.offsetX/main.width-0.5)*cut.w*0.1;
        var v=(event.offsetY/main.height-0.5)*cut.h*0.1;
        cut.cx+=u*cut.ux+v*cut.vx;
        cut.cy+=u*cut.uy+v*cut.vy;
        cut.cz+=u*cut.uz+v*cut.vz;
        cut.h*=0.9;
        cut.w*=0.9;
    }else{
        cut.h/=0.9;
        cut.w/=0.9;
        var u=(event.offsetX/main.width-0.5)*cut.w*0.1;
        var v=(event.offsetY/main.height-0.5)*cut.h*0.1;
        cut.cx-=u*cut.ux+v*cut.vx;
        cut.cy-=u*cut.uy+v*cut.vy;
        cut.cz-=u*cut.uz+v*cut.vz;
    }
    cut2cur();
    redrawall();
}

var mdrag;//,hrot;
function mdown(event){
    event.preventDefault();
    mdrag={x:event.offsetX,y:event.offsetY};
}
function mup(event){
    mdrag=undefined;
}
function mmove(event){
    if(mdrag){
        var u=(event.offsetX-mdrag.x)*cut.w/main.width;
        var v=(event.offsetY-mdrag.y)*cut.h/main.height;
        cut.cx-=u*cut.ux+v*cut.vx;
        cut.cy-=u*cut.uy+v*cut.vy;
        cut.cz-=u*cut.uz+v*cut.vz;
        mdrag.x=event.offsetX;
        mdrag.y=event.offsetY;
        cut2cur();
        redrawall();
    }
}
