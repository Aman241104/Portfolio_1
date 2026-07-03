import { MoveRight } from "lucide-react";
import { blogPosts } from "#constants";

const MobileRepos = () => {
    return (
        <div className="p-5">
            <h2 className="text-white text-xl font-semibold mb-4">Repos</h2>
            <div className="space-y-4">
                {blogPosts.map(({ id, title, image, date, link, description }) => (
                    <a
                        key={id}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-white/10 rounded-xl overflow-hidden"
                    >
                        <img src={image} alt={title} className="w-full h-36 object-cover" />
                        <div className="p-3">
                            <p className="text-white/50 text-xs mb-1">{date}</p>
                            <h3 className="text-white text-sm font-semibold mb-1">{title}</h3>
                            {description && (
                                <p className="text-white/70 text-xs mb-2 line-clamp-2">{description}</p>
                            )}
                            <span className="flex items-center gap-1 text-blue-300 text-xs">
                                View repo <MoveRight size={12} />
                            </span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default MobileRepos;
