import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../layout/AdminLayout";

export const AdminRoute = () => {
    const [access, setAccess] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const response = await fetch("http://localhost:3000/auth/admin-panel", {
                    method: "GET",
                    credentials: "include"
                }); 

                const data = await response.json();

                if (response.ok) {
                    setAccess(true);
                } else {
                    setAccess(false);
                }
            } catch (err) {
                console.error("Error in Admin Route:", err);
                setAccess(false);
            }
        };

        checkAccess();
    }, []);

    useEffect(() => {
        if (access === false) {
            alert("Access Denied!");
            navigate("/login");
        }
    }, [access]);

    if (access === null) return <div>Loading...</div>;

    return access ? <AdminLayout /> : null;  // ✅ Correctly render nested routes
};