## 1、图片格式为 jpg、webp

将 File 转为 Image,使用 canvas 重新绘制 Image 来压缩图片，得到压缩后的 base64,将 base64 转为 Blob 下载下来
（1）修改 0.10 这个参数可以调整压缩后图片的质量，取值 0 ～ 1，值越小，质量越低，体积越小
canvas.toDataURL("image/jpeg", 0.10)

## 2、图片格式为 png

使用算法压缩，因为 canvas 只能压缩 jpg、webp。png 图片使用 canvas 压缩，可能体积更大且失去透明效果。
（1）修改 256 这个参数，0 无损压缩，256 有损压缩。
UPNG.encode([dta.buffer], targetWidth, targetHeight, 256)

参考：
https://segmentfault.com/a/1190000023486410

https://codeantenna.com/a/Qyk45ulvWE

png 压缩：
https://github.com/photopea/UPNG.js
