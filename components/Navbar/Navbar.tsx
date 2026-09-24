import Image from "next/image";
import { inviteCopy } from "@/lib/inviteCopy";
import styles from "./Navbar.module.css";

type NavbarProps = {
  hidden?: boolean;
};

export function Navbar({ hidden = false }: NavbarProps) {
  return (
    <header
      className={styles.bar}
      data-part="navbar"
      data-hidden={hidden ? "true" : "false"}
      aria-hidden={hidden}
    >
      <a
        className={styles.brand}
        href="./"
        aria-label={`${inviteCopy.brand} Broker`}
      >
        <Image
          className={styles.logo}
          src="./brand/shiver-logo.png"
          alt="Shiver Broker"
          width={200}
          height={48}
          priority
        />
      </a>
    </header>
  );
}
