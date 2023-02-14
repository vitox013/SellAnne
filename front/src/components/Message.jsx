import { useState, useEffect } from "react";

function Message({ type, msg }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!msg) {
            setVisible(false);
            return;
        }

        setVisible(true);
        const timer = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(timer);
    }, [msg]);

    return (
        <>
            {visible && (
                <div className={`message ${type} mt-2 text-center`}>{msg}</div>
            )}
        </>
    );
}

export default Message;
