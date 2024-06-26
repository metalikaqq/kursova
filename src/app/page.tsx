"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { useSelector } from "react-redux";
import { AuthState } from "@/redux/slices/authSlice";

const Encoder: React.FC = () => {
  const { user } = useSelector((state: any) => state.authSlice);

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [showMessage, setShowMessage] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
    
  const encryptFile = async () => {
    if (file && password && user) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);
      formData.append("userId", user._id);

      try {
        const response = await fetch("http://localhost:5000/api/encrypt", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          setMessage("Файл успішно зашифрований");
          setMessageType("success");
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 5000);
        } else {
          setMessage("Помилка шифрування файлу");
          setMessageType("error");
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 5000);
        }
      } catch (error) {
        console.error("Failed to upload file", error);
        setMessage("Помилка шифрування файлу");
        setMessageType("error");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 5000);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Шифратор файлів</h1>
      {showMessage && (
        <div className={`${styles.message} ${messageType === "success" ? styles.success : styles.error}`}>
          {message}
        </div>
      )}
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
            onClick={encryptFile}
            className={styles.button}
            disabled={!file || !password}
          >
            Зашифрувати
          </button>
        </div>
      </div>
    </div>
  );
};

export default Encoder;
