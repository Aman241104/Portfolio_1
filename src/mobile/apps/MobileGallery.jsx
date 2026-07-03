import { useState } from "react";
import { X } from "lucide-react";
import { gallery } from "#constants";

const MobileGallery = () => {
    const [full, setFull] = useState(null);

    if (full) {
        return (
            <div className="p-5">
                <button
                    type="button"
                    onClick={() => setFull(null)}
                    className="flex items-center gap-1 text-white mb-4"
                >
                    <X size={18} />
                </button>
                <img src={full} alt="Gallery" className="w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="p-5">
            <h2 className="text-white text-xl font-semibold mb-4">Gallery</h2>
            <div className="grid grid-cols-2 gap-3">
                {gallery.map(({ id, img }) => (
                    <button key={id} type="button" onClick={() => setFull(img)}>
                        <img
                            src={img}
                            alt="Gallery"
                            className="w-full h-32 object-cover rounded-xl"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MobileGallery;
