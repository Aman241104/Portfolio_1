import { techStack } from "#constants";

const MobileSkills = () => {
    return (
        <div className="p-5 space-y-5">
            <h2 className="text-white text-xl font-semibold">Skills</h2>
            {techStack.map(({ category, items }) => (
                <div key={category}>
                    <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">
                        {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {items.map((item) => (
                            <span
                                key={item}
                                className="bg-white/10 text-white text-sm rounded-full px-3 py-1.5"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MobileSkills;
