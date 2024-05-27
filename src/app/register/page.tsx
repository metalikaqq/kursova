/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import styles from "./page.module.scss";
import Link from "next/link";
// import { useAppDispatch } from "@/hooks/redux";
import { setUser } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

interface Помилки {
  username?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface UserData {
  name: string;
  password: string;
}


const Register = () => {
  const router = useRouter();


  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<Помилки>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();


  const registerUser = async (userData: UserData) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const data = await response.json();

      dispatch(setUser(data))

      localStorage.setItem('username', userData.name); // Зберігаємо ім'я користувача в localStorage
      localStorage.setItem('password', userData.password); // Зберігаємо пароль в localStorage

      console.log("Registration successful:", data);

      router.push("/");

    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: "Невідома помилка" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: Помилки = {};

    if (username.length < 3) {
      errors.username = "Ім'я користувача повинно містити не менше 3 символів";
    } else {
      // Очистити помилку імені користувача, якщо введені дані коректні
      setErrors((prevErrors) => ({ ...prevErrors, username: undefined }));
    }

    if (password.length < 8) {
      errors.password = "Пароль повинен містити не менше 8 символів";
    } else {
      // Очистити помилку пароля, якщо введені дані коректні
      setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Паролі не збігаються";
    } else {
      // Очистити помилку підтвердження пароля, якщо введені дані коректні
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: undefined,
      }));
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const userData = { name: username, password };
      await registerUser(userData);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Реєстрація</h1>
      <div
        className={`${styles.errorContainer} ${
          errors.general ? styles.errorContainerVisible : ""
        }`}
      >
        <p className={styles.errorMessage}>{errors.general}</p>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>
            Ім'я користувача
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`${styles.input} ${
              errors.username ? styles.inputError : ""
            }`}
          />
          {errors.username && (
            <p className={`${styles.error} ${styles.errorAnimation}`}>
              {errors.username}
            </p>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Пароль
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${styles.input} ${
              errors.password ? styles.inputError : ""
            }`}
          />
          {errors.password && (
            <p className={`${styles.error} ${styles.errorAnimation}`}>
              {errors.password}
            </p>
          )}
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Підтвердіть пароль
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`${styles.input} ${
              errors.confirmPassword ? styles.inputError : ""
            }`}
          />
          {errors.confirmPassword && (
            <p className={`${styles.error} ${styles.errorAnimation}`}>
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? (
            <div className={styles.loader}>
              <div className={styles.loaderBar}></div>
            </div>
          ) : (
            "Зареєструватися"
          )}
        </button>
        <Link href="/login" className={styles.link}>
          Вже маєте обліковий запис? Увійдіть
        </Link>
      </form>
    </div>
  );
};

export default Register;