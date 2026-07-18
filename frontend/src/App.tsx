import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate.tsx";
import MyGeneration from "./pages/MyGeneration.tsx";
import YtPreview from "./pages/YtPreview.tsx";
import Login from "./components/Login.tsx";
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';

export default function App() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname])
    return (
        <>
        <Toaster/>
            {/* <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#111827", // Dark background
                        color: "#F9FAFB",      // Light text
                        border: "1px solid #374151",
                        borderRadius: "12px",
                        padding: "14px 18px",
                        fontSize: "14px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#22C55E",
                            secondary: "#111827",
                        },
                        style: {
                            border: "1px solid #22C55E",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#EF4444",
                            secondary: "#111827",
                        },
                        style: {
                            border: "1px solid #EF4444",
                        },
                    },
                }}
            /> */}
            <LenisScroll />
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/generate/:id" element={<Generate />} />
                <Route path="/my-generation" element={<MyGeneration />} />
                <Route path="/preview" element={<YtPreview />} />
                <Route path="/login" element={<Login />} />



            </Routes>
            <Footer />
        </>
    );
}