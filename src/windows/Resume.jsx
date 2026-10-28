import WindowWrapper from "@hoc/WindowWrapper.jsx";
import {WindowControls} from "@components";

import {Download} from "lucide-react";
import {Document, pdfjs, Page} from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"; // vendored from pdfjs-dist into public/

const Resume = () => {
    return (
        <>
            <div id="window-header">
                <WindowControls target="resume" />
                <h2>Resume.pdf</h2>

                <a
                    href="/files/resume.pdf"
                    download
                    className="cursor-pointer"
                    title="Download resume"
                >
                    <Download className="icon"/>
                </a>
            </div>
            <Document file="/files/resume.pdf">
                <Page pageNumber={1} renderTextLayer renderAnnotationLayer />
            </Document>

        </>
    )
}

const ResumeWindow = WindowWrapper(Resume, "resume");
export default ResumeWindow;
