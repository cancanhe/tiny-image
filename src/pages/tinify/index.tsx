import React, { FC, useState } from "react";
import {
  formatFileSize,
  imgCompress,
  dataURLtoBlob,
  downloadFile,
} from "./index.util";
import { Upload } from "./upload";
import "./index.css";

export const TinifyPage: FC = (props) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const upload = (files: File[]) => {
    files.forEach((file) => {
      imgCompress(file).then((res) => {
        setFileList((pre) => {
          let temp = JSON.parse(JSON.stringify(pre));
          const newFile = new File([dataURLtoBlob(res)], file.name);
          temp.push({
            source: res,
            file: {
              oldFileSize: formatFileSize(file.size),
              newFileSize: formatFileSize(newFile.size),
              name: file.name,
            },
          });
          return temp;
        });
      });
    });
  };

  return (
    <div className="container">
      <Upload upload={upload} enableDrop={true}>
        <div className="upload-box">点击上传或者拖拽上传</div>
      </Upload>
      {fileList.length !== 0 && (
        <>
          <div
            className="download-all"
            onClick={() => {
              fileList.map((i) =>
                downloadFile(dataURLtoBlob(i.source), i.file.name)
              );
            }}
          >
            download all
          </div>
          <table>
            <tr>
              <th>Name</th>
              <th>Size</th>
              <th>Download</th>
            </tr>
            {fileList.map((i, index) => (
              <tr key={index}>
                <td>{i.file.name}</td>
                <td>
                  {i.file.oldFileSize}
                  {" => "}
                  {i.file.newFileSize}
                </td>
                <td>
                  <div
                    style={{ color: "#198bec" }}
                    onClick={() =>
                      downloadFile(dataURLtoBlob(i.source), i.file.name)
                    }
                  >
                    download it
                  </div>
                </td>
              </tr>
            ))}
          </table>
        </>
      )}
    </div>
  );
};
