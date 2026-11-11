import {locations} from "#constants";
import clsx from "clsx";
import {useGSAP} from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import useWindowStore from "#store/window.js";
import useLocationStore from "#store/location.js";
import { Folder } from "lucide-react";

const projects = locations.work?.children ?? [];


const Home = () => {

    const { setActiveLocation } = useLocationStore();

    const { openWindow } = useWindowStore();

    const handleOpenProjectFinder = (project) => {
        setActiveLocation(project);
        openWindow("finder");
    };

    useGSAP(() => {
        Draggable.create(".folder")
    },[])

    return (
        <section id="home">
            <ul>
                {projects.map((project, i) => (
                    <li key={project.id} style={{ "--i": i }} className={clsx("group folder px-folder", project.windowPosition)}>
                        <button type="button" onDoubleClick={() => handleOpenProjectFinder(project)} onClick={() => handleOpenProjectFinder(project)} aria-label={`Open ${project.name}`}>
                            <Folder strokeWidth={1.25} aria-hidden />
                            <b>{project.children.length}</b>
                            <p>{project.name}</p>
                        </button>
                    </li>
                ))}
            </ul>
            <p className="px-note" aria-hidden>← start here</p>
        </section>
    )
}
export default Home
