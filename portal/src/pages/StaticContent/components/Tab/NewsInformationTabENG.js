import React, { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom';
import FormSection from 'components/shared/FormSection/index';
import NewsInformation from '../Form/NewsInformationENG';
import NewsContent from '../Form/NewsContentENG';
import NewsStatus from '../Form/NewsStatus';
import InfoSeo from '../Form/InfoSeoENG';
import InfoImage from '../Form/InfoImageENG';

const NewsInformationTabENG = ({disabled}) => {
    const { pathname } = useLocation();
    let disabledView = useMemo(() => pathname.includes('/detail'), [pathname]);
    disabled = disabledView ? disabledView : disabled
    const detailForm = [
        {
            title: 'Thông tin trang tĩnh',
            id: 'information_news',
            component: NewsInformation,
            fieldActive: ['static_name'],
        },
        {
            title: 'Hình ảnh',
            id: 'information_image',
            component: InfoImage,
        },
        {
            title: 'Nội dung',
            id: 'news_content',
            component: NewsContent,
            fieldActive: ['keyword'],
        },
        {
            title: 'Thông tin SEO',
            id: 'info-seo',
            component: InfoSeo,
        },
        // {
        //     id: 'status',
        //     title: 'Trạng thái',
        //     component: NewsStatus
        // },
    ];

    return (
        <FormSection detailForm={detailForm} disabled={disabled} />
    )
}

export default NewsInformationTabENG