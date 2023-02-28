import React, {
  FC,
  useCallback,
  useRef,
  useEffect,
  PropsWithChildren,
  ChangeEventHandler,
} from "react";

interface UploadProps {
  upload: (file: File[]) => void;
  accept?: string;
  enableDrop?: boolean;
  multiple?: boolean;
}
export const Upload: FC<PropsWithChildren<UploadProps>> = (props) => {
  const {
    children,
    upload,
    accept = "image/*",
    enableDrop = false,
    multiple = true,
  } = props;
  const ref = useRef<HTMLDivElement | null>();
  const inputRef = useRef<HTMLInputElement | null>();
  const handleclick = () => {
    inputRef.current?.click();
  };
  const uploadFile: ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      e.persist?.();
      const files = [].slice.call(e.target.files) as File[];
      upload(files);
    },
    [upload]
  );
  useEffect(() => {
    const dragover = (e: DragEvent) => {
      e.stopPropagation();
      e.preventDefault();
    };
    const drop = (e: any) => {
      dragover(e);
      e.target!.files = e.dataTransfer!.files;
      uploadFile(e);
    };
    if (enableDrop) {
      ref.current?.addEventListener("dragover", dragover);
      ref.current?.addEventListener("drop", drop);
    }
    return () => {
      if (enableDrop) {
        ref.current?.removeEventListener("dragover", dragover);
        ref.current?.removeEventListener("drop", drop);
      }
    };
  }, [enableDrop, uploadFile]);
  return (
    <div ref={(el) => (ref.current = el)}>
      {children && <div onClick={handleclick}>{children}</div>}
      <input
        type="file"
        accept={accept}
        onChange={uploadFile}
        multiple={multiple}
        style={{ display: children ? "none" : "initial" }}
        ref={(el) => (inputRef.current = el)}
      />
    </div>
  );
};
