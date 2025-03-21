import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProtectedLayout } from "../layout/ProtectedLayout";
import { Spinner } from "../extras/Spinner";

export const ProtectedRoute = () => {
    const [access, setAccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;

        const checkAccess = async () => {
            try {
                const response = await fetch("https://rank-check.vercel.app/auth/dashboard", {
                    method: "GET",
                    credentials: "include"
                });

                if (!isMounted) return;

                const data = await response.json();
                console.log(data.message);

                // setAccess(response.ok);
                // console.log("User Data:", data);

                if (response.ok && (data.role === "Student" || data.role === "Admin")) {
                    // console.log("USer role : ", data.role)
                    setAccess(true);
                } else {
                    throw new Error("Unauthorized");
                }
            } catch (err) {
                console.error("Error in ProtectedRoute:", err);
                setAccess(false);
            }
        };

        checkAccess();

        return () => { isMounted = false; }; // Cleanup function
    }, []);

    useEffect(() => {
        if (access === false) {
            alert("Access Denied!");
            navigate("/login", { replace: true }); // Prevents extra history entries
        }
    }, [access]);

    if (access === null) return <Spinner/>;

    return access ? <ProtectedLayout /> : null;
};
