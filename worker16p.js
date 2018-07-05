var edge = 64;
var edgeedge = edge * edge;
var mask = edge - 1;
var shift = 6;
var fblimit = edge / 2;

var xdim, ydim, zdim;
var maxlevel;
//var urlformatter;

var xcubs, ycubs, zcubs;
var xy;
var xyz;

onmessage = function(event) {
    switch (event.data.opcode) {
        case "dataprops":
            registerprops(event.data.props);
            break;
        case "registerview":
            registerview(event.data.view);
            break;
        case "draw":
            var view = views[event.data.id];
            view.cut = event.data.cut;
            draw(view);
            break;
        case "imgloaded":
            loaded(event.data.data);
            break;
        default:
            close();
    }
};

function registerprops(dataprops) {
    xdim = dataprops.xdim;
    ydim = dataprops.ydim;
    zdim = dataprops.zdim;
    maxlevel = dataprops.maxlevel;
//    urlformatter = new Function("l,x,y,z","return "+dataprops.urlformatter);

    xcubs = Math.floor(xdim / edge) + 1;
    ycubs = Math.floor(ydim / edge) + 1;
    zcubs = Math.floor(zdim / edge) + 1;
    xy = xcubs * ycubs;
    xyz = xy * zcubs;
    
    postMessage({
        id: 'imgload',
        type: 'blob',
        url: dataprops.urlformatter
    });
}

var views = {};
function View(id, width, height) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.data = new Uint16Array(width * height);
    this.cut = null;
}
function registerview(descriptor) {
    views[descriptor.id] = new View(descriptor.id, descriptor.width, descriptor.height);
}

var cubs = [];
var cubslen = 0;

function draw(view) {
    if(!rleblob)return;
    var cut = view.cut;
    view.cut=null;
    var ox = cut.ox, oy = cut.oy, oz = cut.oz;
    var ux = cut.ux, uy = cut.uy, uz = cut.uz;
    var vx = cut.vx, vy = cut.vy, vz = cut.vz;

    var data = view.data;
    var w = view.width;
    var h = view.height;
    var xd = xdim;
    var yd = ydim;
    var zd = zdim;

    var u = Math.sqrt(ux * ux + uy * uy + uz * uz);
    var v = Math.sqrt(vx * vx + vy * vy + vz * vz);
    var level = 0;
    while (u > w * 2 && v > h * 2 && level < maxlevel) {
        ox /= 2;
        oy /= 2;
        oz /= 2;
        ux /= 2;
        uy /= 2;
        uz /= 2;
        vx /= 2;
        vy /= 2;
        vz /= 2;
        u /= 2;
        v /= 2;
        level++;
        xd = (xd + 1) >> 1;
        yd = (yd + 1) >> 1;
        zd = (zd + 1) >> 1;
    }
    var idx = 0;
    for (var y = 0; y < h; y++)
        for (var x = 0; x < w; x++) {
            var lx = Math.round(ox + ux * x / w + vx * y / h);
            var ly = Math.round(oy + uy * x / w + vy * y / h);
            var lz = Math.round(oz + uz * x / w + vz * y / h);
            if (lx < 0 || ly < 0 || lz < 0 || lx >= xd || ly >= yd || lz >= zd)
                data[idx++] = 0;//255;//128;
            else {
                var ix = lx & mask;
                var iy = ly & mask;
                var iz = lz & mask;
                lx >>= shift;
                ly >>= shift;
                lz >>= shift;
                var vol = cubs[level * xyz + lz * xy + ly * xcubs + lx];
                if (!vol) { //!!
                    vol=getCub(level,lx,ly,lz);
                    cubs[level * xyz + lz * xy + ly * xcubs + lx]=vol;
                }
                data[idx++] = vol[ix + iy * edge + iz * edgeedge];
            }
        }
//    postMessage({id:view.id,imagedata:view.imagedata});
    postMessage({id: view.id, view: view});
}
var count=0;
function getCub(l,x,y,z){
    var vol=new Uint8Array(64*64*64);
    var pos=pyramid[l][z][y][x];
    if(pos>=0){
        var idx=0;
        while(idx<vol.length){
            var cur=rleblob[pos++];
            var cnt=rleblob[pos++];
            do{
                vol[idx++]=cur;
            }while(cnt--)
        }
        console.log(idx,++count);
    }
    return vol;
}

var rleblob=null;
var pyramid=[];
function loaded(data) {
    var datablob=new DataView(data);
    var hdr="";
    for(var i=0;i<10;i++)
        hdr+=String.fromCharCode(datablob.getUint8(i));
    console.log(hdr);
    var bpp=datablob.getUint8(10);
    console.log(bpp);
    var xd=datablob.getUint16(11);
    var yd=datablob.getUint16(13);
    var zd=datablob.getUint16(15);
    var flats=datablob.getUint8(17);
    var flat=datablob.getUint8(18);
    var pos=19;
    console.log(xd,yd,zd);
    console.log(flats,flat);
    var count=0;
    while(xd>edge/2 || yd>edge/2 || zd>edge/2){
        var xc=Math.ceil(xd/edge);
        var yc=Math.ceil(yd/edge);
        var zc=Math.ceil(zd/edge);
        var la=[];
        pyramid.push(la);
        for(var z=0;z<zc;z++){
            var za=[];
            la.push(za);
            for(var y=0;y<yc;y++){
                var ya=[];
                za.push(ya);
                for(var x=0;x<xc;x++){
                    var code=datablob.getInt32(pos);
//                    ya.push({
//                        flat:code<0,
//                        offset:code,
//                        cube:null
//                    });
                    ya.push(code);
                    pos+=4;
                    count++;
                }
            }
        }
        xd=Math.ceil(xd/2);
        yd=Math.ceil(yd/2);
        zd=Math.ceil(zd/2);
    }
    console.log(count,pyramid.length);
    var blobsize=datablob.getUint32(pos);
    pos+=4;
    console.log(blobsize);
    rleblob=new Uint8Array(data,pos,blobsize);
    
    for(var view in views)
        if(views[view].cut)
            draw(views[view]);
}
