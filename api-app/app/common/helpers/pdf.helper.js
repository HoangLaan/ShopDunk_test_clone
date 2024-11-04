var pdf = require('pdf-creator-node');
var fs = require('fs');
var path = require('path');
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const appRoot = require('app-root-path');
const {minimal_args} = require('../const/pdf.const');

const write = (template, serviceRes, productDetail, companyInfo, filename = 'output.pdf') => {
    const html = fs.readFileSync(`app/templates/pdf/print-file/${template}.html`, 'utf8');
    const options = {
        format: 'A4',
        orientation: 'landscape',
        border: '0mm',
        header: {
            height: '0mm',
        },
        footer: {
            height: '0mm',
            contents: {},
        },
    };

    const document = {
        html: html,
        data: {
            serviceRes: serviceRes,
            productDetail: productDetail,
            companyInfo: companyInfo,
        },
        path: `storage/pdf/${filename}.pdf`,
        type: '',
    };
    return new Promise((resolve, reject) => {
        pdf.create(document, options)
            .then(res => {
                resolve(true);
            })
            .catch(error => {
                reject(error);
            });
    });
};
const writeDeliveryslip = (template, deliveryslip, data, filename, companyInfo = 'output.pdf') => {
    const html = fs.readFileSync(`app/templates/pdf/print-file/${template}.html`, 'utf8');
    const options = {
        format: 'A4',
        orientation: 'landscape',
        border: '0mm',
        header: {
            height: '0mm',
        },
        footer: {
            height: '0mm',
            contents: {},
        },
    };

    const document = {
        html: html,
        data: {
            deliveryslip: deliveryslip,
            companyInfo: companyInfo,
            data: data,
        },
        path: `storage/pdf/${filename}.pdf`,
        type: '',
    };
    return new Promise((resolve, reject) => {
        pdf.create(document, options)
            .then(res => {
                resolve(true);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const create = (template, data, filename = 'output.pdf', orientation = 'portrait') => {
    const html = fs.readFileSync(`app/templates/pdf/print-file/${template}.html`, 'utf8');
    const options = {
        orientation,
        childProcessOptions: {
            env: {
                OPENSSL_CONF: '/dev/null',
            },
        },
    };
    const document = {
        html: html,
        data,
        path: `storage/pdf/${filename}.pdf`,
        type: '',
    };
    return new Promise((resolve, reject) => {
        pdf.create(document, options)
            .then(res => {
                resolve(true);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const createStocksTransfer = (template, data, filename = 'output.pdf', orientation = 'portrait') => {
    const html = fs.readFileSync(`app/templates/pdf/print-file/${template}.html`, 'utf8');
    const options = {
        orientation,
    };
    const document = {
        html: html,
        data: {
            serviceRes: data ? [data] : [],
            productDetail: data.product_list ? data.product_list : [],
            companyInfo: data.company ? [data.company] : [],
        },
        path: `storage/pdf/${filename}.pdf`,
        type: '',
    };

    return new Promise((resolve, reject) => {
        pdf.create(document, options)
            .then(res => {
                resolve(true);
            })
            .catch(error => {
                reject(error);
            });
    });
};

const createBarcode = (template, data, filename = 'barcode.pdf', {width = '40mm', height = '30mm'}) => {
    const html = fs.readFileSync(`app/templates/barcode/${template}.html`, 'utf8');
    const options = {
        width,
        height,
    };
    const document = {
        html: html,
        data,
        path: `storage/barcode/${filename}.pdf`,
        type: 'pdf',
    };
    return new Promise((resolve, reject) => {
        pdf.create(document, options)
            .then(res => {
                resolve(true);
            })
            .catch(error => {
                reject(error);
            });
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
    pageBreak = true,
}) => {
    let browser;

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
        const html = await ejs.renderFile(`${appRoot}/app/templates/pdf/print-file/${template}`, {data: data});
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

        if (pageBreak) {
            // Tính số lần phải ngắt trang dựa trên chiều cao của nội dung và chiều cao trang A5
            const numPages = Math.ceil(contentHeight / 595); // 595 là chiều cao trang A5 (trong px)

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
    write,
    writeDeliveryslip,
    create,
    createBarcode,
    createStocksTransfer,
    printPDF,
};
