import cn from 'classnames';
import { FC, forwardRef } from 'react';

import { IField } from './form.interface';
import styles from './form.module.scss';

export const Field = forwardRef<HTMLInputElement, IField>(
  ({ placeholder, error, type = 'text', style, ...rest }, ref) => {
    return (
      <div className={cn(styles.common, styles.field)} style={style}>
        <label>
          <span>{placeholder}</span>
          <input type={type} ref={ref} {...rest} />
        </label>
        {error && <div className={styles.error}>{error.message}</div>}
      </div>
    );
  }
);
Field.displayName = 'Field';
