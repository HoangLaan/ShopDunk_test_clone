const fs = require('fs');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const appRoot = require('app-root-path');
const config = require('../../../config/config');
const { minimal_args } = require('../const/pdf.const');

const createBarcode = (template, data, filename = 'barcode.pdf', option = { width: '40mm', height: '30mm' }) => {
    const html = fs.readFileSync(`app/templates/barcode/${template}.html`, 'utf8');
    return new Promise((resolve, reject) => {
        axios
            .post(
                `${config.api_print}/print/barcode`,
                {
                    html,
                    data,
                    filename,
                    option,
                },
                { headers: { Authorization: `APIKEY ${config.api_print_key}` } },
            )
            .then((res) => resolve(res.data))
            .catch(reject);
    });
};

const printPDF = async ({
    template,
    data,
    filename = 'file_to_print',
    orientation = 'portrait',
    landscape = false,
    format = 'A4',
    width,
    isOnlyFirstPage = false,
    pageBreak = false,
}) => {
    let browser;

    if (!fs.existsSync(`${appRoot}/storage/pdf`)) {
        fs.mkdirSync(`${appRoot}/storage/pdf`, { recursive: true });
    }

    try {
        // if (!config.runLocal) {
        //     params = {
        //         executablePath: 'google-chrome',
        //         headless: true,
        //         args: minimal_args,
        //     };
        // }
        browser = await puppeteer.launch({
            headless: true,
            args: minimal_args,
            // headless: 'new',
        });
        const [page] = await browser.pages();
        const html = await ejs.renderFile(`${appRoot}/app/templates/pdf/print-file/${template}`, { data: data });
        await page.setContent(html);
        const pdfOptions = {
            path: `storage/pdf/${filename}.pdf`,
            format,
            printBackground: true,
            orientation,
            landscape,
        };

        // Nếu có format thì width sẽ ko có tác dụng
        if (width) {
            delete pdfOptions.format;
            pdfOptions.width = width;
        }

        // Lấy trang đầu tiên
        if (isOnlyFirstPage) pdfOptions.pageRanges = '1';

        if (pageBreak) {
            // Xác định chiều cao thực tế của nội dung trên trang
            const contentHeight = await page.evaluate(() => {
                const body = document.body;
                const html = document.documentElement;

                return Math.max(
                    body.scrollHeight,
                    body.offsetHeight,
                    html.clientHeight,
                    html.scrollHeight,
                    html.offsetHeight,
                );
            });
            // Tính số lần phải ngắt trang dựa trên chiều cao của nội dung và chiều cao trang A5
            // const numPages = Math.ceil(contentHeight / 595); // 595 là chiều cao trang A5 (trong px)
            const numPages = format === 'A4' ? Math.ceil(contentHeight / 1684) : Math.ceil(contentHeight / 595)

            // Lặp qua từng trang để in
            for (let i = 0; i < numPages; i++) {
                if (i > 0) {
                    // Tạo trang mới trước khi in nội dung tiếp theo
                    await page.evaluate(() => {
                        const pageBreak = document.createElement('div');
                        pageBreak.style.pageBreakBefore = 'always';
                        document.body.appendChild(pageBreak);
                    });
                }
            }
        }

        await page.pdf(pdfOptions);
        return {
            ok: true,
        };
    } catch (error) {
        return {
            ok: false,
        };
    } finally {
        browser?.close();
    }
};

module.exports = {
    printPDF,
    createBarcode,
};
