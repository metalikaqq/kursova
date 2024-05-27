"use client";
import React, { useState } from "react";
import styles from "./page.module.scss";
import { useSelector } from "react-redux";
import { AuthState } from "@/redux/slices/authSlice";
import { redirect } from "next/navigation";

const Decoder: React.FC = () => {
  const { user } = useSelector((state: { authSlice: AuthState }) => state.authSlice);

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const decryptFile = async () => {
    if (file && password && user) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);
      formData.append("userId", user._id);

      try {
        const response = await fetch("http://localhost:5000/api/decrypt", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(new Blob([blob]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.name.replace(".encrypted", "")); // Set the file name here
          document.body.appendChild(link);
          link.click();

          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
        } else {
          setError("Failed to decrypt file");
        }
      } catch (error) {
        console.error("Error during decryption", error);
        setError("Error during decryption");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Дешифратор файлів</h1>
      <div className={styles.formContainer}>
        <div className={styles.inputGroup}>
          <label htmlFor="file" className={styles.label}>
            Оберіть файл
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Введіть пароль
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            className={styles.input}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button
            onClick={decryptFile}
            className={styles.button}
            disabled={!file || !password}
          >
            Дешифрувати
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
};

export default Decoder;
