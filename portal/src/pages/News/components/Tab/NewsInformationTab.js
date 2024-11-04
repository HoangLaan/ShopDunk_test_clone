import React, { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom';
import FormSection from 'components/shared/FormSection/index';
import NewsInformation from '../Form/NewsInformation';
import NewsContent from '../Form/NewsContent';
import NewsStatus from '../Form/NewsStatus';

const NewsInformationTab = ({disabled}) => {
    const { pathname } = useLocation();
    let disabledView = useMemo(() => pathname.includes('/detail'), [pathname]);
    disabled = disabledView ? disabledView : disabled
    const detailForm = [
        {
            title: 'Thông tin',
            id: 'information_news',
            component: NewsInformation,
            fieldActive: ['news_title'],
        },
        {
            title: 'Nội dung',
            id: 'news_content',
            component: NewsContent,
            fieldActive: ['content'],
        },
        {
            id: 'status',
            title: 'Trạng thái',
            component: NewsStatus
        },
    ];

    return (
        <FormSection detailForm={detailForm} disabled={disabled} />
    )
}

export default NewsInformationTab