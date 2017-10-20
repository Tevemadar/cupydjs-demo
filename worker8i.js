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
    urlformatter = new Function("l,x,y,z","return "+dataprops.urlformatter);

    xcubs = Math.floor(xdim / edge) + 1;
    ycubs = Math.floor(ydim / edge) + 1;
    zcubs = Math.floor(zdim / edge) + 1;
    xy = xcubs * ycubs;
    xyz = xy * zcubs;
}

var views = {};
function View(id, width, height) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height);
    this.cut = null;
}
function registerview(descriptor) {
    views[descriptor.id] = new View(descriptor.id, descriptor.width, descriptor.height);
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
    var loadissued = false;
    var fbloadissued = false;
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
                var vol = cubs[level * xyz + lz * xy + ly * xcubs + lx];
                if (!vol && !loadissued) { //!!
                    requestload(view, false, level, lx, ly, lz);
                    loadissued = true;
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
                        vol = cubs[fl * xyz + lz * xy + ly * xcubs + lx];
                    } while (!vol && fl < fblevel);
                    if (!vol && !fbloadissued) {
                        requestload(view, true, fl, lx, ly, lz);
                        fbloadissued = true;
                    }
                }
                if (!vol) {
                    data[idx++] = 128;
                } else {
                    data[idx++] = vol[ix + iy * edge + iz * edgeedge];
                }
            }
        }
//    postMessage({id:view.id,imagedata:view.imagedata});
    postMessage({id: view.id, view: view});
}

var loadlist = [];
function QItem(level, x, y, z) {
    this.fb = false;
    this.l = level;
    this.x = x;
    this.y = y;
    this.z = z;
    this.subs = {};
}

function requestload(view, fb, level, x, y, z) {
    var item = null;
    for (var i = 0; i < loadlist.length; i++) {
        item = loadlist[i];
        if (item.l === level && item.x === x && item.y === y && item.z === z)
            break;
        else
            item = null;
    }
    if (!item) {
        item = new QItem(level, x, y, z);
        loadlist.push(item);
    }
    item.fb |= fb;
    item.subs[view.id] = {view: view, cut: view.cut};
    tryload();
}

var loadidx = -1;
function tryload() {
    if (loadidx !== -1)
        return;
//    if(loadlist.length===0)return;
    while (loadlist.length > 0) {
        var item = loadlist[0];
        var keep = false;
        for (var s in item.subs) {
            var i = item.subs[s];
            if (i.view.cut === i.cut) {
                keep = true;
                break;
            }
        }
        if (!keep)
            loadlist.shift();//console.log("Drop: "+loadlist.shift());
        else
            break;
    }
    if (loadlist.length === 0)
        return;
    for (loadidx = 0; loadidx < loadlist.length; loadidx++)
        if (loadlist[loadidx].fb) {
            load();
            return;
        }
    loadidx = 0;
    load();
}

function load() {
    var item = loadlist[loadidx];
    postMessage({
        id: 'imgload',
        type: 'gray',
        url: urlformatter(item.l,item.x,item.y,item.z)
    });
}

function loaded(data) {
    var item = loadlist[loadidx];
    cubs[item.l * xyz + item.z * xy + item.y * xcubs + item.x] = new Uint8Array(data);

    while (loadidx < loadlist.length - 1) {
        loadlist[loadidx] = loadlist[loadidx + 1];
        loadidx++;
    }
    loadidx = -1;
    loadlist.pop();

    tryload();

    for (var s in item.subs) {
        var i = item.subs[s];
        if (i.view.cut === i.cut)
            draw(i.view);
    }
    tryload();
}
