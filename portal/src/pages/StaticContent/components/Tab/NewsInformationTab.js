import React, { useMemo } from 'react'
import { useLocation } from 'react-router-dom';
import FormSection from 'components/shared/FormSection/index';
import NewsInformation from '../Form/NewsInformation';
import NewsContent from '../Form/NewsContent';
import NewsStatus from '../Form/NewsStatus';
import InfoSeo from '../Form/InfoSeo';
import InfoImage from '../Form/infoImage';

const NewsInformationTab = ({ disabled }) => {
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