# CupydJS-demo
Proof-of-concept 3D slicer for tiled ("cubed") multiscale volume pyramids.

This is a [working example](https://tevemadar.github.io/cupydjs-demo/), under construction. Things can be dragged around (requires mouse for now) and modalities can be switched.

Data comes from Waxholm Space Atlas of the Sprague Dawley Rat Brain v2.0  
Papp et al., Neuroimage 97: 374–386, 2014  
Kjonigsen et al., Neuroimage 108: 441-9, 2015  
Downloaded from [NITRC](https://www.nitrc.org/projects/whs-sd-atlas).

* MRI - T2* volume converted to 8-bit grayscale
* DTI - Color FA volume, 24-bit RGB
* Segmentation - 79 anatomical structures

Quality of image volumes is low, quality of JPEG compression has been set to 80% in order to reduce overall amount of data  

Segmentation is stored in a lossless format:

|Offset|Length|Content|
|:---:|---:|---|
|0|10|"PyraBlobv1", ASCII text|
|10|1|BPV, bytes per voxel, 1 or 2|
|11|2|Dimension 1 in voxels|
|13|2|Dimension 2 in voxels|
|15|2|Dimension 3 in voxels|
|17|1|Number of Flat types|
|18|BPP|Flat1|
||BPV|...|
||BPV|Flatn|
||4|Blob offset/FlatID of first cube|
||4|...|
||4|Blob offset/FlatID of last cube|
||4|Blobsize in bytes|
|||RLE encoded cube 1|
|||...|
|||RLE encoded cube n|

Clarifications:

* Multibyte numbers are represented in big-endian byte order
* Cube size is hardcoded 64x64x64 voxels
* "Flat" cubes contain the same value in every voxel, demo dataset has a single type, containing 0-s
* Cubes and cube contents are both encoded in dim1, dim2, dim3 order, e.g. (0,0,0) ... (63,0,0), (0,1,0)... for a cube
* First pyramid level has the original dimensions (rounded upwards to a multiple of 64)
* Last pyramid level is a single cube
* 4-byte cube codes signed integers: negative values are "-FlatID"-s, non-negative values are offsets in datablob (0-based)
* RLE format: value (BPV sized), repetitions (1 byte, unsigned), 64x64x64 voxels in total
* Result is packed into a lossless image, RGB channels are used only