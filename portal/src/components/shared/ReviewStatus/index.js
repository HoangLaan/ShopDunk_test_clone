import React, { useMemo } from 'react';

const REVIEW_TYPE = {
  PENDING: 2,
  ACCEPT: 1,
  REJECT: 0,
};

const REVIEW_TYPE_OPTIONS = [
  {
    label: 'Chưa duyệt',
    colorLabel: 'bw_black',
    className: '',
    icon: 'fi-rr-minus',
    value: REVIEW_TYPE.PENDING,
  },
  {
    label: 'Đã duyệt',
    colorLabel: 'bw_green',
    className: 'bw_agree',
    icon: 'fi-rr-check',
    value: REVIEW_TYPE.ACCEPT,
  },
  {
    label: 'Không duyệt',
    colorLabel: 'bw_red',
    className: 'bw_non_agree',
    icon: 'fi-rr-minus',
    value: REVIEW_TYPE.REJECT,
  },
];

const AutoReview = () => {
  const { label = '', className, icon, colorLabel } = useMemo(() => REVIEW_TYPE_OPTIONS[1], []);
  return (
    <li key={`review`} className={className}>
      <img src={'bw_image/img_cate_default.png'} alt='2' />
      <span className={`fi ${icon}`}></span>
      <p>
        Tự động duyệt <i className={colorLabel}>{label}</i>
      </p>
    </li>
  );
};

const ReviewStatus = ({ reviewList = [] }) => {
  const convertBooleanToNumber = (value) => {
    if (typeof value === 'number') return value;
    return typeof value === 'boolean' ? 1 : 0;
  };

  return (
    <ul className='bw_confirm_level'>
      {reviewList.length > 0 ? (
        reviewList.map((review, index) => {
          const findReview = REVIEW_TYPE_OPTIONS?.find(
            (p) => p?.value === parseInt(convertBooleanToNumber(review.is_reviewed)),
          );

          if (!findReview) return <>Không tìm thấy loại duyệt tương ứng</>;

          const { label = '', className, icon, colorLabel } = findReview;
          return (
            <li key={`review_${index}`} className={className}>
              <img src={review.avatar_url ?? 'bw_image/img_cate_default.png'} alt='2' />
              <span className={`fi ${icon}`}></span>
              <p>
                {[review?.review_user, review?.full_name].join(' - ')} <i className={colorLabel}>{label}</i>
              </p>
            </li>
          );
        })
      ) : (
        <AutoReview />
      )}
    </ul>
  );
};

export default ReviewStatus;
