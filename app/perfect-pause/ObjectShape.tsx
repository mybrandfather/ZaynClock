import type { ObjectKind } from './game'
import styles from './perfect-pause.module.css'

type Props = {
  kind: ObjectKind
  ghost?: boolean
  label?: string
}

function Geometry({ kind }: { kind: ObjectKind }) {
  switch (kind) {
    case 'tomato':
      return (
        <>
          <path className={styles.tomatoBody} d="M17 48C17 27 32 18 50 18s33 9 33 30c0 24-15 39-33 39S17 72 17 48Z" />
          <path className={styles.tomatoLeaf} d="M49 22 36 11l4 15-18-2 14 10-10 8 20-6 4 13 5-13 20 6-11-9 14-9-18 2 4-15Z" />
          <path className={styles.tomatoShine} d="M30 45c2-9 8-14 16-16" />
        </>
      )
    case 'lemon':
      return (
        <>
          <path className={styles.lemonBody} d="M13 50c8-7 8-18 18-27C43 12 62 12 74 23c10 9 10 20 13 27-3 7-3 18-13 27-12 11-31 11-43 0C21 68 21 57 13 50Z" />
          <path className={styles.lemonShine} d="M34 33c9-8 20-9 28-5" />
        </>
      )
    case 'soccer':
      return (
        <>
          <circle className={styles.ballBase} cx="50" cy="50" r="39" />
          <path className={styles.ballDark} d="m50 31 12 9-5 15H43l-5-15Zm-31 8 19 1 5-17-12-7Zm62 0-19 1-5-17 12-7ZM29 73l14-18-14-11-14 9 5 17Zm42 0L57 55l14-11 14 9-5 17ZM43 88l7-18 7 18-7 1Z" />
          <circle className={styles.ballLine} cx="50" cy="50" r="39" />
        </>
      )
    case 'star':
      return (
        <>
          <path className={styles.starBody} d="m50 8 11.2 26.8L90 37.2 68.1 56l6.7 28.2L50 69.1 25.2 84.2 31.9 56 10 37.2l28.8-2.4Z" />
          <path className={styles.starShine} d="m50 18 6.9 22.3 23.3 1.1-19.5 12.8 6.2 22.5L50 62.4Z" />
        </>
      )
    case 'diamond':
      return (
        <>
          <path className={styles.diamondBody} d="M12 35 29 13h42l17 22-38 53Z" />
          <path className={styles.diamondLight} d="m12 35 23 1 15 52Zm76 0-23 1-15 52ZM29 13l6 23 15-23 15 23 6-23Z" />
          <path className={styles.diamondLine} d="M12 35h76M29 13l6 23 15-23 15 23 6-23M35 36l15 52 15-52" />
        </>
      )
  }
}

export default function ObjectShape({ kind, ghost = false, label }: Props) {
  return (
    <svg
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`${styles.objectSvg} ${ghost ? styles.ghostSvg : ''}`}
      data-shape={kind}
      data-variant={ghost ? 'target' : 'moving'}
      viewBox="0 0 100 100"
    >
      <Geometry kind={kind} />
    </svg>
  )
}
