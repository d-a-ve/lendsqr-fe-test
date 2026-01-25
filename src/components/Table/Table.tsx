import * as React from 'react'
import styles from './Table.module.scss'

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div data-slot="table-container" className={styles.container}>
      <table
        data-slot="table"
        className={[styles.table, className].filter(Boolean).join(' ')}
        {...props}
      />
    </div>
  )
}

function TableHeader({
  className,
  children,
  ...props
}: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={[styles.header, className].filter(Boolean).join(' ')}
      {...props}
    >
      <tr>{children}</tr>
    </thead>
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={[styles.body, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={[styles.footer, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={[styles.row, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}

function TableHead({ className, children, ...props }: React.ComponentProps<'th'>) {
  return (
    <th data-slot="table-head" {...props}>
      <div className={[styles.head, className].filter(Boolean).join(' ')}>
        {children}
      </div>
    </th>
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={[styles.cell, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={[styles.caption, className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
}
