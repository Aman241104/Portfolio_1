import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Signal, Wifi, BatteryFull } from "lucide-react";

const StatusBar = () => {
    const [now, setNow] = useState(() => dayjs());

    useEffect(() => {
        const id = setInterval(() => setNow(dayjs()), 30_000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="fixed top-0 inset-x-0 z-[60] h-11 flex items-center justify-between px-6 text-white text-sm font-semibold select-none">
            <span>{now.format("h:mm A")}</span>
            <div className="flex items-center gap-1.5">
                <Signal size={15} />
                <Wifi size={15} />
                <BatteryFull size={17} />
            </div>
        </div>
    );
};

export default StatusBar;
