import NP from "number-precision";
import { UPNG } from "./UPNG";
/**
 * 格式化文件大小
 * @param size
 * @returns
 */
export const formatFileSize = (size: number) => {
  if (size >= Math.pow(1000, 4)) {
    return NP.divide(size, Math.pow(1000, 4)).toFixed(1) + "TB";
  } else if (size >= Math.pow(1000, 3)) {
    return NP.divide(size, Math.pow(1000, 3)).toFixed(1) + "GB";
  } else if (size >= Math.pow(1000, 2)) {
    return NP.divide(size, Math.pow(1000, 2)).toFixed(1) + "MB";
  } else if (size >= 1000) {
    return NP.divide(size, 1000).toFixed(1) + "KB";
  } else {
    return size + "B";
  }
};
/**
 * file转换成img对象
 * @param file
 * @returns
 */
export const fileToImg = (file: File) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = function (e) {
      img.src = e!.target!.result as string;
    };
    reader.onerror = function (e) {
      reject(e);
    };
    reader.readAsDataURL(file);
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function (e) {
      reject(e);
    };
  });
};
/**
 * @name 文件压缩
 * @description
 *  1、将文件转img对象
 *  2、canvas重新绘制图片
 *  3、canvas转二进制对象转文件对象，返回
 * @returns { File } 文件
 */
export const imgCompress = async (file: File) => {
  const img: any = await fileToImg(file);
  return new Promise<string>((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    // 获取文件宽高
    const { width: targetWidth, height: targetHeight } = img;
    // 还可以自定义等比例缩放宽高属性，这里用的是固定800宽度，高度是等比例缩放
    // const { width: originWidth, height: originHeight } = img;
    // const scale = +(originWidth / originHeight).toFixed(2); // 比例取小数点后两位)
    // const targetWidth = 800; // 固定宽
    // const targetHeight = Math.round(800 / scale); // 等比例缩放高

    canvas.width = targetWidth;
    canvas.height = targetHeight;
    context.clearRect(0, 0, targetWidth, targetHeight);
    // canvas重新绘制图片
    context.drawImage(img, 0, 0, targetWidth, targetHeight);
    // 生成base64
    // const base64 = canvas.toDataURL(file.type, 0.1);
    let base64 = "";
    if (file.type === "image/png") {
      let dta = context.getImageData(0, 0, targetWidth, targetHeight).data;
      let png = UPNG.encode([dta.buffer], targetWidth, targetHeight, 256);
      let bytes = new Uint8Array(png);
      base64 = transformArrayBufferToBase64(bytes);
    } else {
      base64 = canvas.toDataURL("image/jpeg", 0.90);
    }
    resolve(base64);
  });
};

/**
 * buffer to base64
 */
const transformArrayBufferToBase64 = (bytes: Uint8Array) => {
  let data = "";
  let len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    data += String.fromCharCode(bytes[i]);
  }
  return "data:image/png;base64," + window.btoa(data);
};

/**
 * base64转化为Blob对象
 * @param dataurl
 * @returns
 */
export const dataURLtoBlob = (dataurl: string) => {
  let arr = dataurl.split(",");
  //注意base64的最后面中括号和引号是不转译的
  let _arr = arr[1].substring(0, arr[1].length - 2);
  let mime = arr[0].match(/:(.*?);/)![1],
    bstr = window.atob(_arr),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime,
  });
};

/**
 * blob下载
 * @param {*} blob 文件blob对象
 * @param {*} filename 下载后的文件名
 */
export const downloadFile = (blob: Blob, filename: string) => {
  let url = window.URL.createObjectURL(blob);
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
};
