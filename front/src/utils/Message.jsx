import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearMsg } from "../features/infoMsg/msgSlice";

function Message({ type, msg }) {
    const [visible, setVisible] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (!msg) {
            setVisible(false);
            return;
        }

        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            dispatch(clearMsg());
        }, 3000);
        return () => clearTimeout(timer);
    }, [msg]);

    return (
        <>
            {visible && (
                <p className={`${type} mt-2 text-center mb-0`}>{msg}</p>
            )}
        </>
    );
}

export default Message;
