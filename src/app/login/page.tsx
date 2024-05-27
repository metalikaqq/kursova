/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import styles from "./page.module.scss";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/authSlice";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

interface Errors {
  username?: string;
  password?: string;
  general?: string;
}

interface UserData {
  name: string;
  password: string;
}


const Login = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch(); 
  
  const router = useRouter(); // Use the useRouter hook from next/navigation



  const loginUser = async (userData: UserData) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/login", {
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

      localStorage.setItem('username', userData.name);
      localStorage.setItem('password', userData.password);

      console.log("Login successful:", data);

      router.push("/");

    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else if (error instanceof Error) {
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
    const errors: Errors = {};

    if (username.length < 3) {
      errors.username = "Ім'я користувача повинно містити не менше 3 символів";
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, username: undefined }));
    }

    if (password.length < 8) {
      errors.password = "Пароль повинен містити не менше 8 символів";
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
    } else {
      const userData = { name: username, password };
      await loginUser(userData);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Логін</h1>
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
            Імя
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
        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? (
            <div className={styles.loader}>
              <div className={styles.loaderBar}></div>
            </div>
          ) : (
            "Логін"
          )}
        </button>
        <Link href="/register" className={styles.link}>
          У вас немає аккаунту? Зареєструватися
        </Link>
      </form>
    </div>
  );
};

export default Login;