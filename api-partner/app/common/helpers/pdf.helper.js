var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require("path");
const ejs = require('ejs');
const puppeteer = require('puppeteer');
const appRoot = require('app-root-path');

const write = (template, serviceRes, productDetail, companyInfo, filename = 'output.pdf') => {
    const html = fs.readFileSync(`app/templates/pdf/print-file/${template}.html`, 'utf8');
    const options = {
        format: "A4",
        orientation: "landscape",
        border: "0mm",
        header: {
            height: "0mm",
        },
        footer: {
            height: "0mm",
            contents: {
            }
        }
    };

    const document = {
        html: html,
        data: {
            serviceRes: serviceRes,
            productDetail: productDetail,
            companyInfo: companyInfo,
        },
        path: `storage/pdf/${filename}.pdf`,
        type: "",
    };
    return new Promise((resolve, reject) => {
        pdf
            .create(document, options)
            .then((res) => {
                resolve(true)
            })
            .catch((error) => {
                reject(error)
            });
    })
}
const writeDeliveryslip = (template, deliveryslip, data, filename, companyInfo = 'output.pdf') => {
    const html = fs.readFileSync(`app/templates/pdf/print-file/${template}.html`, 'utf8');
    const options = {
        format: "A4",
        orientation: "landscape",
        border: "0mm",
        header: {
            height: "0mm",
        },
        footer: {
            height: "0mm",
            contents: {
            }
        }
    };

    const document = {
        html: html,
        data: {
            deliveryslip: deliveryslip,
            companyInfo: companyInfo,
            data: data
        },
        path: `storage/pdf/${filename}.pdf`,
        type: "",
    };
    return new Promise((resolve, reject) => {
        pdf
            .create(document, options)
            .then((res) => {
                resolve(true)
            })
            .catch((error) => {
                reject(error)
            });
    })
}

const create = (template, data, filename = 'output.pdf', orientation = 'portrait') => {
    const html = fs.readFileSync(`app/templates/pdf/print-file/${template}.html`, 'utf8');
    const options = {
        orientation,
        childProcessOptions: {
            env: {
                OPENSSL_CONF: '/dev/null',
            },
        }
    };
    const document = {
        html: html,
        data,
        path: `storage/pdf/${filename}.pdf`,
        type: "",
    };
    return new Promise((resolve, reject) => {
        pdf
            .create(document, options)
            .then((res) => {
                resolve(true)

            })
            .catch((error) => {
                reject(error)
            });
    })
}

const createStocksTransfer = (template, data, filename = 'output.pdf', orientation = 'portrait') => {
    const html = fs.readFileSync(`app/templates/pdf/print-file/${template}.html`, 'utf8');
    const options = {
        orientation
    };
    const document = {
        html: html,
        data: {
            serviceRes: data ? [data] : [],
            productDetail: data.product_list ? data.product_list : [],
            companyInfo: data.company ? [data.company] : []
        },
        path: `storage/pdf/${filename}.pdf`,
        type: "",
    };

    return new Promise((resolve, reject) => {
        pdf
            .create(document, options)
            .then((res) => {
                resolve(true)

            })
            .catch((error) => {
                reject(error)
            });
    })
}

const createBarcode = (template, data, filename = 'barcode.pdf', {
    width = '40mm',
    height = '30mm'
}) => {
    const html = fs.readFileSync(`app/templates/barcode/${template}.html`, 'utf8');
    const options = {
        width, height
    };
    const document = {
        html: html,
        data,
        path: `storage/barcode/${filename}.pdf`,
        type: "pdf",
    };
    return new Promise((resolve, reject) => {
        pdf
            .create(document, options)
            .then((res) => {
                resolve(true)

            })
            .catch((error) => {
                reject(error)
            });
    })
}

const printPDF = async ({ template, data, filename = 'file_to_print', orientation = 'portrait' }) => {
    const minimal_args = [
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
    ];

    let browser;

    return new Promise((resolve, reject) => {
        (async () => {
            let params = {
                executablePath: 'google-chrome',
                headless: true,
                args: minimal_args,
            };
            // if (!config.runLocal) {
            //     params = {
            //         executablePath: 'google-chrome',
            //         headless: true,
            //         args: minimal_args,
            //     };
            // }
            const browser = await puppeteer.launch(params);
            const [page] = await browser.pages();
            const html = await ejs.renderFile(`${appRoot}/app/templates/pdf/print-file/${template}`, { data: data });
            await page.setContent(html);
            page.pdf({
                path: `storage/pdf/${filename}.pdf`,
                format: 'A4',
                printBackground: true,
                orientation,
            })
                .then(e => {
                    resolve(e);
                })
                .catch(error => {
                    resolve(error);
                });
        })()
            .catch(error => {
                reject(error);
            })
            .finally(() => browser?.close());
    });
};

module.exports = {
    write,
    writeDeliveryslip,
    create,
    createBarcode,
    createStocksTransfer,
    printPDF
}