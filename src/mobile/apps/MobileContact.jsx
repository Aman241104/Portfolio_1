import { locations } from "#constants";
import { Contact } from "#windows/Contact.jsx";

const aboutText = locations.about.children.find((c) => c.name === "about-me.txt");

const MobileContact = () => {
    return (
        <div className="pb-8">
            {aboutText && (
                <div className="p-5 pb-2 space-y-2">
                    <img
                        src={aboutText.image}
                        alt="Aman Patel"
                        className="size-20 rounded-full mb-2 object-cover"
                    />
                    {aboutText.description.map((line, i) => (
                        <p key={i} className="text-white/80 text-sm leading-relaxed">
                            {line}
                        </p>
                    ))}
                </div>
            )}

            <div className="[&_h3]:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:mt-2
                             [&_p]:text-white/80 [&_p]:text-sm [&_p]:mb-3
                             [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:mt-3
                             [&_li]:rounded-xl [&_li]:px-4 [&_li]:py-3
                             [&_li_a]:flex [&_li_a]:items-center [&_li_a]:gap-3 [&_li_a]:text-white [&_li_a]:text-sm [&_li_a]:font-medium
                             px-5">
                <Contact embedded />
            </div>
        </div>
    );
};

export default MobileContact;
