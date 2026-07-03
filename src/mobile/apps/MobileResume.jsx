import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Document, pdfjs, Page } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const MobileResume = () => {
    const [pageWidth, setPageWidth] = useState(() =>
        Math.min(window.innerWidth - 40, 480)
    );

    useEffect(() => {
        const onResize = () => setPageWidth(Math.min(window.innerWidth - 40, 480));
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    return (
        <div className="p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-semibold">Resume</h2>
                <a
                    href="/files/resume.pdf"
                    download
                    className="flex items-center gap-1.5 text-white text-sm bg-white/10 rounded-full px-3 py-1.5"
                >
                    <Download size={14} /> Download
                </a>
            </div>

            <div className="rounded-xl overflow-hidden">
                <Document file="/files/resume.pdf">
                    <Page pageNumber={1} width={pageWidth} renderTextLayer renderAnnotationLayer />
                </Document>
            </div>
        </div>
    );
};

export default MobileResume;
