"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./SplashScreen.module.css";

export default function SplashScreen() {
  const router = useRouter();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      router.replace("/login");
    }, 3200);

    return () => clearTimeout(timer);
  }, [router]);

  if (!show) return null;

  return (
    <div className={styles.splashContainer}>
      <div className={styles.splashContent}>
        <Image
          src="/YASARTSCADA.jpg"
          alt="YASART Engineering PLC"
          width={220}
          height={220}
          className={styles.logo}
        />
        <p className={styles.text}>YASART Engineering PLC</p>
      </div>
    </div>
  );
}
