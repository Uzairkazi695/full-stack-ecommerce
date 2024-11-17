import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export const FileUploader = ({
  value,
  onValueChange,
  dropzoneOptions,
  className = "",
  children,
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onValueChange(acceptedFiles);
    },
    [onValueChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    ...dropzoneOptions,
    onDrop,
  });

  return (
    <div {...getRootProps({ className })}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export const FileInput = ({ id, className = "", children }) => {
  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
};

export const FileUploaderContent = ({ children }) => {
  return <div>{children}</div>;
};

export const FileUploaderItem = ({ children, index }) => {
  return <div key={index}>{children}</div>;
};
