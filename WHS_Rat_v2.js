var rawpalette=JSON.parse('{\
"0":{"r":255,"g":255,"b":255,"text":"Clear Label"},\
"1":{"r":255,"g":52,"b":39,"text":"descending corticofugal pathways"},\
"2":{"r":255,"g":186,"b":0,"text":"substantia nigra"},\
"3":{"r":0,"g":0,"b":255,"text":"subthalamic nucleus"},\
"4":{"r":255,"g":255,"b":0,"text":"molecular layer of the cerebellum"},\
"5":{"r":0,"g":255,"b":255,"text":"granule cell level of the cerebellum"},\
"6":{"r":255,"g":0,"b":255,"text":"alveus of the hippocampus"},\
"7":{"r":52,"g":255,"b":13,"text":"inferior cerebellar peduncle"},\
"10":{"r":29,"g":104,"b":235,"text":"cingulate cortex, area 2"},\
"30":{"r":129,"g":79,"b":255,"text":"striatum"},\
"31":{"r":255,"g":145,"b":186,"text":"globus pallidus"},\
"32":{"r":26,"g":231,"b":255,"text":"entopeduncular nucleus"},\
"33":{"r":2,"g":44,"b":255,"text":"ventricular system"},\
"34":{"r":212,"g":255,"b":0,"text":"medial lemniscus"},\
"35":{"r":0,"g":176,"b":63,"text":"facial nerve"},\
"36":{"r":124,"g":252,"b":0,"text":"anterior commissure, anterior part"},\
"37":{"r":255,"g":186,"b":0,"text":"anterior commissure, posterior part"},\
"38":{"r":174,"g":0,"b":232,"text":"ventral hippocampal commissure"},\
"39":{"r":0,"g":100,"b":0,"text":"thalamus"},\
"40":{"r":255,"g":8,"b":0,"text":"septal region"},\
"41":{"r":48,"g":218,"b":0,"text":"optic nerve"},\
"42":{"r":38,"g":126,"b":255,"text":"optic tract and optic chiasm"},\
"43":{"r":218,"g":170,"b":62,"text":"pineal gland"},\
"44":{"r":0,"g":165,"b":21,"text":"inner ear"},\
"45":{"r":134,"g":255,"b":90,"text":"spinal cord"},\
"46":{"r":33,"g":230,"b":255,"text":"commissure of the superior colliculus"},\
"47":{"r":153,"g":83,"b":255,"text":"brainstem"},\
"48":{"r":226,"g":120,"b":161,"text":"hypothalamic region"},\
"49":{"r":238,"g":47,"b":44,"text":"inferior colliculus"},\
"50":{"r":86,"g":0,"b":221,"text":"superficial gray layer of the superior colliculus"},\
"51":{"r":7,"g":255,"b":89,"text":"periaqueductal gray"},\
"52":{"r":21,"g":192,"b":255,"text":"fornix"},\
"53":{"r":238,"g":186,"b":0,"text":"mammillothalamic tract"},\
"54":{"r":173,"g":255,"b":47,"text":"commissural stria terminalis"},\
"55":{"r":225,"g":151,"b":15,"text":"deeper layers of the superior colliculus"},\
"56":{"r":235,"g":87,"b":255,"text":"periventricular gray"},\
"57":{"r":250,"g":244,"b":247,"text":"genu of the facial nerve"},\
"58":{"r":0,"g":215,"b":11,"text":"pontine nuclei"},\
"59":{"r":0,"g":255,"b":29,"text":"fimbria of the hippocampus"},\
"60":{"r":244,"g":67,"b":69,"text":"fasciculus retroflexus"},\
"61":{"r":255,"g":252,"b":0,"text":"stria medullaris of the thalamus"},\
"62":{"r":238,"g":117,"b":51,"text":"stria terminalis"},\
"63":{"r":255,"g":0,"b":218,"text":"posterior commissure"},\
"64":{"r":15,"g":109,"b":230,"text":"glomerular layer of the accessory olfactory bulb"},\
"65":{"r":255,"g":227,"b":0,"text":"glomerular layer of the olfactory bulb"},\
"66":{"r":255,"g":135,"b":0,"text":"olfactory bulb"},\
"67":{"r":255,"g":110,"b":0,"text":"corpus callosum and associated subcortical white matter"},\
"68":{"r":188,"g":32,"b":173,"text":"brachium of the superior colliculus"},\
"69":{"r":147,"g":255,"b":39,"text":"commissure of the inferior colliculus"},\
"70":{"r":39,"g":244,"b":253,"text":"central canal"},\
"71":{"r":63,"g":192,"b":255,"text":"interpeduncular nucleus"},\
"72":{"r":179,"g":28,"b":53,"text":"ascending fibers of the facial nerve"},\
"73":{"r":255,"g":79,"b":206,"text":"anterior commissure"},\
"74":{"r":0,"g":246,"b":14,"text":"inferior olive"},\
"75":{"r":91,"g":241,"b":255,"text":"spinal trigeminal nuclus"},\
"76":{"r":250,"g":128,"b":114,"text":"spinal trigeminal tract"},\
"77":{"r":206,"g":211,"b":7,"text":"frontal associiation cortex"},\
"78":{"r":134,"g":204,"b":76,"text":"middle cerebellar peduncle"},\
"79":{"r":128,"g":170,"b":255,"text":"transverse fibers of the pons"},\
"80":{"r":69,"g":235,"b":202,"text":"habenular commissure"},\
"81":{"r":222,"g":7,"b":237,"text":"nucleus of the stria medullaris"},\
"82":{"r":225,"g":240,"b":13,"text":"basal forebrain region"},\
"83":{"r":250,"g":170,"b":64,"text":"supraoptic decussation"},\
"84":{"r":65,"g":150,"b":255,"text":"medial lemniscus decussation"},\
"85":{"r":114,"g":9,"b":212,"text":"pyramidal decussation"},\
"92":{"r":3,"g":193,"b":45,"text":"neocortex"},\
"93":{"r":0,"g":8,"b":182,"text":"bed nucleus of the stria terminalis"},\
"94":{"r":255,"g":87,"b":30,"text":"pretectal region"},\
"95":{"r":165,"g":131,"b":107,"text":"cornu ammonis 3"},\
"96":{"r":91,"g":45,"b":10,"text":"dentate gyrus"},\
"97":{"r":255,"g":255,"b":0,"text":"cornu ammonis 2"},\
"98":{"r":217,"g":104,"b":13,"text":"cornu ammonis 1"},\
"99":{"r":255,"g":82,"b":82,"text":"fasciola cinereum"},\
"100":{"r":255,"g":192,"b":0,"text":"subiculum"},\
"108":{"r":40,"g":112,"b":130,"text":"postrhinal cortex"},\
"109":{"r":80,"g":123,"b":175,"text":"presubiculum"},\
"110":{"r":23,"g":54,"b":96,"text":"parasubiculum"},\
"112":{"r":205,"g":51,"b":255,"text":"perirhinal area 35"},\
"113":{"r":112,"g":48,"b":160,"text":"perirhinal area 36"},\
"114":{"r":12,"g":92,"b":8,"text":"entorhinal cortex"},\
"115":{"r":221,"g":166,"b":36,"text":"lateral entorhinal cortex"}\
}');

var rgbpalette=new Uint8Array(3*65536);
var textpalette=[];
for(var idx in rawpalette){
    if(rawpalette.hasOwnProperty(idx)){
        var item=rawpalette[idx];
        idx=parseInt(idx);
        textpalette[idx]=item.text;
        idx*=3;
        rgbpalette[idx]=parseInt(item.r);
        rgbpalette[idx+1]=parseInt(item.g);
        rgbpalette[idx+2]=parseInt(item.b);
    }
}
