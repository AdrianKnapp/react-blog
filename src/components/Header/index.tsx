import Image from 'next/image';
import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header>
      <div className={styles.container}>
        <Link href="/">
          <a className={styles.logo}>
            <Image src="/logo.svg" alt="logo" layout="fill" />
          </a>
        </Link>
      </div>
    </header>
  );
}
