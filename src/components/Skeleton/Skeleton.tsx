import { type ComponentPropsWithRef } from 'react'
import styles from './Skeleton.module.scss'

export const Skeleton = ({
  className,
  heightInPx: height,
  widthInPx: width,
  ...props
}: ComponentPropsWithRef<'div'> & { heightInPx?: number, widthInPx?: number }) => {
  return (
    <div
      className={[styles.skeleton, className].filter(Boolean).join(' ')}
      {...props}
      style={{ height: `${height}px`, width: `${width}px` }}
    />
  )
}
