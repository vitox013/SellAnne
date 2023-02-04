import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
    const token = useSelector(selectCurrentToken);

    if (token) {
        const decoded = jwtDecode(token);
        const { userId, currentUser, email } = decoded.UserInfo;

        return { currentUser, userId, email };
    }

    return { currentUser: "", userId: "", email: "" };
};

export default useAuth;
