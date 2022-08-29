import cn from 'classnames';
import Image from 'next/image';
import { FC } from 'react';

import { SkeletonLoader } from '../../SkeletonLoader';
import { IUploadField } from '../form.interface';
import styles from '../form.module.scss';

import { useUpload } from './useUpload';

export const UploadField: FC<IUploadField> = ({
  isNoImage,
  value,
  folder,
  placeholder,
  error,
  style,
  onChange,
}) => {
  const { uploadFile, isLoading } = useUpload(onChange, folder);
  return (
    <div className={cn(styles.field, styles.uploadField)} style={style}>
      <div className={styles.uploadFlex}>
        <label>
          <span>{placeholder}</span>
          <input type="file" onChange={uploadFile} />
          {error && <div className={styles.error}>{error.message}</div>}
        </label>
        {!isNoImage ? (
          <div className={styles.uploadImageContainer}>
            {isLoading ? (
              <SkeletonLoader count={1} className="w-24 h-24" />
            ) : (
              value && <Image alt="" src={value} layout="fill" unoptimized />
            )}
          </div>
        ) : (
          <>
            {isLoading && (
              <div className={styles.uploadImageContainer}>
                <SkeletonLoader count={1} className="w-24 h-24" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
