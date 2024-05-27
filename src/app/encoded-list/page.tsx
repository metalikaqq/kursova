"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { IUser, IFile } from "@/models/IUser";
import { useSelector } from "react-redux";
import { AuthState } from "@/redux/slices/authSlice";

const FileList = () => {
  const { user } = useSelector((state: { authSlice: AuthState }) => state.authSlice);
  const [files, setFiles] = useState<IFile[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (user) {
        const response = await fetch(`http://localhost:5000/api/files/${user._id}`);
        const data = await response.json();
        setFiles(data);
      }
    };

    fetchFiles();
  }, [user]);

  const downloadFile = async (fileId: string, filename: string) => {
    const response = await fetch(`http://localhost:5000/api/download/${fileId}`);
    const blob = await response.blob();
  
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
  
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    } else {
      document.body.removeChild(link);
    }
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.fileList}>
        <h2 className={styles.heading}>Список зашифрованих файлів</h2>
        <ul className={styles.fileListItems}>
          {files.map((file: IFile, index: number) => (
            <li key={file._id} className={styles.fileListItem}>
              <div className={styles.fileName} onClick={() => downloadFile(file._id, file.filename)}>
                {file.filename}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileList;
