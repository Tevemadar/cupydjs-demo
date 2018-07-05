var edge = 64;
var edgeedge = edge * edge;
var mask = edge - 1;
var shift = 6;
var fblimit = edge / 2;

var xdim, ydim, zdim;
var maxlevel;
var urlformatter;

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
            var view = viewmap[event.data.id];
            view.cut = event.data.cut;
            scheduledraw(view);
            break;
        case "imgloaded":
            loaded(event.data.idx,event.data.data);
            break;
        default:
            close();
    }
};

var redrawlist=[];
var redrawmap={};
var redrawing=false;

function scheduledraw(view){
    if(!redrawmap[view.id]){
        redrawmap[view.id]=true;
        redrawlist.push(view);
    }
    if(!redrawing){
        redrawing=true;
        setTimeout(redraw,0);
    }
}

function redraw(){
    redrawing=false;
    redrawlist.forEach(draw);
    redrawmap={};
    redrawlist.length=0;
}

function registerprops(dataprops) {
    xdim = dataprops.xdim;
    ydim = dataprops.ydim;
    zdim = dataprops.zdim;
    maxlevel = dataprops.maxlevel;
    urlformatter = new Function("l,x,y,z","return "+dataprops.urlformatter);

    xcubs = Math.floor((xdim+edge-1)/edge);
    ycubs = Math.floor((ydim+edge-1)/edge);
    zcubs = Math.floor((zdim+edge-1)/edge);
    xy = xcubs * ycubs;
    xyz = xy * zcubs;
}

var viewmap = {};
var viewlist = [];
function View(id, width, height) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height);
    this.cut = null;
    this.waitmap = [];
}
function registerview(descriptor) {
    var view = new View(descriptor.id, descriptor.width, descriptor.height);
    viewmap[descriptor.id] = view;
    viewlist.push(view);
}

var cubs = [];
var cubslen = 0;

function draw(view) {
    var cut = view.cut;
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
    var fbu = u, fbv = v, fblevel = level;
    while (fbu > fblimit && fbv > fblimit && fblevel < maxlevel) {
        fbu /= 2;
        fbv /= 2;
        fblevel++;
    }
    var waitmap=[];//,loadlist=[],fblist=[];
    var idx = 0;
    for (var y = 0; y < h; y++)
        for (var x = 0; x < w; x++) {
            var lx = Math.round(ox + ux * x / w + vx * y / h);
            var ly = Math.round(oy + uy * x / w + vy * y / h);
            var lz = Math.round(oz + uz * x / w + vz * y / h);
            if (lx < 0 || ly < 0 || lz < 0 || lx >= xd || ly >= yd || lz >= zd)
                data[idx++] = 255;//128;
            else {
                var ix = lx & mask;
                var iy = ly & mask;
                var iz = lz & mask;
                lx >>= shift;
                ly >>= shift;
                lz >>= shift;
                var loadidx = level * xyz + lz * xy + ly * xcubs + lx;
                var vol = cubs[loadidx];
                if(!vol  && !waitmap[loadidx]) {
                    waitmap[loadidx]=true;
                    tryload(loadidx,2,level,lx,ly,lz);
                }
                if (!vol && level < fblevel) {
                    var fl = level;
                    do {
                        fl++;
                        ix = (ix + edge * (lx & 1)) >> 1;
                        iy = (iy + edge * (ly & 1)) >> 1;
                        iz = (iz + edge * (lz & 1)) >> 1;
                        lx >>= 1;
                        ly >>= 1;
                        lz >>= 1;
                        loadidx = fl * xyz + lz * xy + ly * xcubs + lx;
                        vol = cubs[loadidx];
                        var cont=!vol && fl < fblevel;
                        if(cont && !waitmap[loadidx])waitmap[loadidx]=true;
                    } while (cont);
                    if (!vol && !waitmap[loadidx]) {
                        waitmap[loadidx]=true;
                        tryload(loadidx,1,fblevel,lx,ly,lz);
                    }
                }
                if (!vol) {
                    data[idx++] = 128;
                } else {
                    data[idx++] = vol[ix + iy * edge + iz * edgeedge];
                }
            }
        }
    postMessage({id: view.id, view: {width:view.width,height:view.height,data:view.data}});
    view.waitmap=waitmap;
}

var loadmap=[];
function tryload(idx,priority,level,x,y,z) {
    if(!loadmap[idx] || loadmap[idx]>priority) {
        loadmap[idx]=priority;
        postMessage({
            id: 'imgload',
            type: 'gray',
            idx: idx,
            priority: priority,
            url: urlformatter(level,x,y,z)
        });
    }
}

function loaded(idx,data) {
    cubs[idx] = new Uint8Array(data);
    for(var i=0;i<viewlist.length;i++)
        if(viewlist[i].waitmap[idx])
            scheduledraw(viewlist[i]);
}
