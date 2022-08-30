import cn from 'classnames';
import { FC } from 'react';
import Skeleton, { SkeletonProps } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const SkeletonLoader: FC<SkeletonProps> = ({ className, ...rest }) => {
  return (
    <div>
      <Skeleton
        className={cn('rounded-lg', className)}
        highlightColor="#292a2e"
        baseColor="#1f2125"
        {...rest}
      />
    </div>
  );
};
