import { HeaderProvider } from "../context/HeaderContext";
import { UserProvider } from "../context/UserContext";

export const Providers = ({ children }) => {
    return (
        <UserProvider>
            <HeaderProvider>
                { children }
            </HeaderProvider>
        </UserProvider>
    );
}