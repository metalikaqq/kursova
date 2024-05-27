// components/Loader.js
import styles from './Loader.module.scss'; // Створіть відповідні стилі для лоудера

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Loader;
