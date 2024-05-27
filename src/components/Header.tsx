"use client";

import React, { useState } from "react";
import s from "./Header.module.scss";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

export type HeaderProps = {};

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const dispatch = useDispatch();

  const router = useRouter();

  const { user, isUserAuth } = useSelector((state: any) => state.authSlice);

  console.log(user);

  const handleListOpener = () => {
    setShowModal(true);
  };

  const handleLogout = () => {
    if (!confirmLogout) {
      setConfirmLogout(true);
    } else {
      dispatch(logoutUser());

      localStorage.removeItem("username");
      localStorage.removeItem("password");

      router.push("/login");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setConfirmLogout(false);
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    user._id && (
      <div className={s.header}>
        <>
          <Link href={"/encoded-list"} className={s.logo}>
            <span className={s.logoText}>Список зашифрованих файлів</span>
          </Link>

          <Link href={"/"} className={s.logo}>
            <span className={s.logoText}> Зашифрувати файл </span>
          </Link>

          <Link href={"/decoder"} className={s.logo}>
            <span className={s.logoText}>Розшифрувати файл</span>
          </Link>

          <div className={s.userIconContainer} onClick={handleListOpener}>
            <div className={s.userIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>

            <span>{user.name}</span>
          </div>
        </>
        {showModal && (
          <div className={s.modalOverlay} onClick={handleOutsideClick}>
            <div className={s.modal}>
              <div className={s.modalContent}>
                {confirmLogout ? (
                  <div className={s.confirmLogout}>
                    <p className={s.text}>
                      Ви дійсно бажаєте вийти з облікового запису?
                    </p>
                    <button onClick={handleLogout} className={s.logoutButton}>
                      Вийти
                    </button>
                    <button
                      onClick={handleCloseModal}
                      className={s.cancelButton}
                    >
                      Скасувати
                    </button>
                  </div>
                ) : (
                  <button onClick={handleLogout} className={s.logoutButton}>
                    Вийти з облікового запису
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  );
}
