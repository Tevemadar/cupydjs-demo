function putgraydata1x(view,workerview,low,high){
    var data=view.imagedata.data;
    var wdata=workerview.data;
    for(var i=0;i<wdata.length;i++)
        data[i*4]=data[i*4+1]=data[i*4+2]=
            (wdata[i]-low)*255/(high-low);
    view.ctx.putImageData(view.imagedata,0,0);
}

function putgraydata2x(view,workerview,low,high){
    var data=view.imagedata.data;
    var wdata=workerview.data;
    var stride=view.imagedata.width*4;
    var i=0;
    var wi=0;
    for(var y=0;y<workerview.height;y++){
        for(var x=0;x<workerview.width;x++){
            data[i]=data[i+1]=data[i+2]=
            data[i+4]=data[i+5]=data[i+6]=
            data[i+stride]=data[i+1+stride]=data[i+2+stride]=
            data[i+4+stride]=data[i+5+stride]=data[i+6+stride]=
                (wdata[wi++]-low)*255/(high-low);
            i+=8;
        }
        i+=stride;
    }
    view.ctx.putImageData(view.imagedata,0,0);
}

function putcolordata1x(view,workerview){
    var data=view.imagedata.data;
    var wdata=workerview.data;
    for(var i=0,i4=0;i<wdata.length;i4++){
        data[i4++]=wdata[i++];
        data[i4++]=wdata[i++];
        data[i4++]=wdata[i++];
    }
    view.ctx.putImageData(view.imagedata,0,0);
}

function putcolordata2x(view,workerview,low,high){
    var data=view.imagedata.data;
    var wdata=workerview.data;
    var stride=view.imagedata.width*4;
    var i=0;
    var wi=0;
    for(var y=0;y<workerview.height;y++){
        for(var x=0;x<workerview.width;x++){
            data[i]=data[i+4]=data[i+stride]=data[i+stride+4]=wdata[wi++];
            i++;
            data[i]=data[i+4]=data[i+stride]=data[i+stride+4]=wdata[wi++];
            i++;
            data[i]=data[i+4]=data[i+stride]=data[i+stride+4]=wdata[wi++];
            i+=6;
        }
        i+=stride;
    }
    view.ctx.putImageData(view.imagedata,0,0);
}

function putidxdata1x(view,workerview,low,high){
    var data=view.imagedata.data;
    var wdata=workerview.data;
    for(var i=0;i<wdata.length;i++){
        var pal=wdata[i]*3;
        data[i*4]=rgbpalette[pal];
        data[i*4+1]=rgbpalette[pal+1];
        data[i*4+2]=rgbpalette[pal+2];
//        data[i*4]=data[i*4+1]=data[i*4+2]=
//            (wdata[i]-low)*255/(high-low);
    }
    view.ctx.putImageData(view.imagedata,0,0);
}

function putidxdata2x(view,workerview,low,high){
    var data=view.imagedata.data;
    var wdata=workerview.data;
    var stride=view.imagedata.width*4;
    var i=0;
    var wi=0;
    for(var y=0;y<workerview.height;y++){
        for(var x=0;x<workerview.width;x++){
            var pal=wdata[wi++]*3;
            data[i]=data[i+4]=data[i+stride]=data[i+4+stride]=rgbpalette[pal];
            data[i+1]=data[i+5]=data[i+stride+1]=data[i+5+stride]=rgbpalette[pal+1];
            data[i+2]=data[i+6]=data[i+stride+2]=data[i+6+stride]=rgbpalette[pal+2];
//            data[i]=data[i+1]=data[i+2]=
//            data[i+4]=data[i+5]=data[i+6]=
//            data[i+stride]=data[i+1+stride]=data[i+2+stride]=
//            data[i+4+stride]=data[i+5+stride]=data[i+6+stride]=
//                (wdata[wi++]-low)*255/(high-low);
            i+=8;
        }
        i+=stride;
    }
    view.ctx.putImageData(view.imagedata,0,0);
}

function cubeloaded(event,worker,type,idx){
    var img=event.target;
    var canvas=document.createElement("canvas");
    canvas.width=img.width;
    canvas.height=img.height;
    var ctx=canvas.getContext("2d");
    ctx.drawImage(img,0,0);
    var imgdata=ctx.getImageData(0,0,img.width,img.height).data;
    var rawdata;
    switch(type){
        case "gray":
            rawdata=new Uint8Array(64*64*64);
            for(var i=0;i<262144;i++)
                rawdata[i]=imgdata[i<<2];
            break;
        case "rgb":
            rawdata=new Uint8Array(3*64*64*64);
            for(var i=0;i<262144;i++){
                rawdata[i*3]=imgdata[i*4];
                rawdata[i*3+1]=imgdata[i*4+1];
                rawdata[i*3+2]=imgdata[i*4+2];
            }
            break;
        case "blob":
            rawdata=new Uint8Array(imgdata.length*3/4);
            for(var i=0;i<imgdata.length/4;i++){
                rawdata[i*3]=imgdata[i*4];
                rawdata[i*3+1]=imgdata[i*4+1];
                rawdata[i*3+2]=imgdata[i*4+2];
            }
            break;
    }
    try{
        worker.postMessage({opcode:"imgloaded",data:rawdata.buffer,idx:idx},[rawdata.buffer]);
    } catch (ex) {
        worker.postMessage({opcode:"imgloaded",data:rawdata.buffer,idx:idx}); // IE comp
    }
}
