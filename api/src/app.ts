import express, { Response } from 'express';
import stream from 'stream';
import { getBrowser } from './browser';
import { PaperFormat } from 'puppeteer';
import { body, ContextRunner, oneOf } from 'express-validator';
import marked from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom'
const { window } = new JSDOM('<!DOCTYPE html>')
const domPurify = DOMPurify(window)

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ strict: true }));

type FileRequest<T = {}> = T & {
    responseType?: "inline" | "attachment",
    filename?: string,
}

type HtmlPdfBody = {
    source?: string,
    margin?: {
        top?: number | string,
        bottom?: number | string,
        left?: number | string,
        right?: number | string,
    },
    landscape?: boolean,
    format?: PaperFormat,
    scale?: number,
    header?: string,
    footer?: string
};

type MdPdfBody = HtmlPdfBody;

const htmlToPdf = async (body: HtmlPdfBody) => {
    const browser = await getBrowser();
    const page = await browser.newPage();

    await page.setViewport({width: 1920, height: 1080});

    if(body.source && body.source.startsWith("http")){
        await page.goto(body.source, {
            waitUntil: "networkidle2",
            timeout: 10000
        });
    }
    else if (body.source) {
        await page.setContent(body.source, {
            waitUntil: "networkidle2",
            timeout: 10000
        });
    }

    let width = undefined;
    let height = undefined;
    if(body.format && /^\d+[in|cm]x\d+[in|cm]$/.test(body.format.toLowerCase())) {
        const split = body.format.toLowerCase().split("x");
        width = split[0] as string;
        height = split[1] as string;
    }

    const pdf = await page.pdf({
        margin: {...{
            bottom: 0,
            left: 0,
            right: 0,
            top: 0
        }, ...(body.margin || {})},
        printBackground: true,
        waitForFonts: true,
        landscape: body.landscape === true || false,
        format: (body.format || "").toLowerCase() as PaperFormat,
        scale: body.scale || 1,
        displayHeaderFooter: (!!body.header || !!body.footer),
        headerTemplate: body.header || "",
        footerTemplate: body.footer || "",
        width: width as any,
        height: height as any
    });

    await page.close();

    return pdf;
};

const mdToHtml = async (md: string): Promise<string> => {
    const parsed = await marked.parse(md);
    const sanitized = domPurify.sanitize(parsed, { USE_PROFILES: { html: true } });
    return sanitized;
};

const writeFileResponse = (req: FileRequest, buffer: Buffer, res: Response) => {
    const readStream = new stream.PassThrough();
    readStream.end(buffer);
    res.set("Content-disposition", `${req.responseType || "attachment"}; filename=${req.filename || "Document"}${req.filename && !req.filename.toLowerCase().endsWith(".pdf") ? ".pdf" : ""}`);
    res.set("Content-Type", "application/pdf");
    readStream.pipe(res);
};

const validate = (validations: ContextRunner[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // sequential processing, stops running validations chain if one fails.
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }

    next();
  };
};

const htmlToPdfValidation = [
    body("source").notEmpty(),
    body("margin").optional().isObject(),
    body("margin.*").optional().isInt().isString(),
    body("landscape").optional().isBoolean(),
    oneOf([
        body("format").optional().isString().toLowerCase().isIn(["letter","legal","tabloid","ledger","a0","a1","a2","a3","a4","a5","a6"]),
        body("format").optional().isString().toLowerCase().matches(/^\d+[in|cm]x\d+[in|cm]$/)
    ]),
    body("scale").optional().isFloat(),
    body("header").optional().isString(),
    body("footer").optional().isString()
];

app.post<any,any,any,FileRequest<HtmlPdfBody>>("/v1/convert/html/pdf", 
    validate(htmlToPdfValidation),
    async (req, res) => {
        const pdf = await htmlToPdf(req.body);
        writeFileResponse(req.body, Buffer.from(pdf), res);
});

app.post<any,any,any,FileRequest<MdPdfBody>>("/v1/convert/md/pdf", 
    validate(htmlToPdfValidation),
    async (req, res) => {
        const html = await mdToHtml(req.body.source || "");
        req.body.source = html;
        const pdf = await htmlToPdf(req.body);
        writeFileResponse(req.body, Buffer.from(pdf), res);
});

// app.post<any,any,any,FileRequest<HtmlPdfBody>>("/v1/convert/json/pdf", 
//     validate([]),
//     async (req, res) => {
//         throw new Error("Not Implemented");
// });

// app.post<any,any,any,FileRequest<HtmlPdfBody>>("/v1/convert/docx/pdf", 
//     validate([]),
//     async (req, res) => {
//         throw new Error("Not Implemented");
// });

// app.post<any,any,any,FileRequest<HtmlPdfBody>>("/v1/convert/tex/pdf", 
//     validate([]),
//     async (req, res) => {
//         throw new Error("Not Implemented");
// });

// app.post<any,any,any,FileRequest<HtmlPdfBody>>("/v1/convert/rtf/pdf", 
//     validate([]),
//     async (req, res) => {
//         throw new Error("Not Implemented");
// });

const PORT = process.env.PORT || "3000";
app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});