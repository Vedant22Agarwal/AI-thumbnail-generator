import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SoftBackDrop from "../components/SoftBackDrop";
import api from "../config/api";

const About = () => {
    const [stats, setStats] = useState({
        users: 0,
        thumbnails: 0,
    });

    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get("/api/users/stats");
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <>
            <SoftBackDrop />

            <section className="relative overflow-hidden">
                <div className="mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-28 text-center">

                    <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium tracking-wide text-pink-300 backdrop-blur">
                        ✨ AI Powered Thumbnail Creation
                    </span>

                    <h1 className="mt-8 max-w-5xl text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-7xl">
                        Create Stunning
                        <br />
                        <span className="bg-gradient-to-r from-pink-500 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent">
                            AI Thumbnails
                        </span>
                        <br />
                        That Get Clicks
                    </h1>

                    <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-400 md:text-xl">
                        Thumblify helps creators generate stunning AI-powered
                        YouTube thumbnails that grab attention, increase
                        click-through rates, and save hours of manual design work.
                    </p>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-5">

                        <Link
                            to="/generate"
                            className="rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 px-8 py-4 font-semibold text-white transition duration-300 hover:scale-105"
                        >
                            Start Creating →
                        </Link>

                        <button
                            onClick={() =>
                                document.getElementById("features")?.scrollIntoView({
                                    behavior: "smooth",
                                })
                            }
                            className="rounded-xl border border-zinc-700 bg-zinc-900/60 px-8 py-4 font-semibold text-zinc-200 backdrop-blur transition duration-300 hover:border-pink-500 hover:text-white"
                        >
                            Explore Features
                        </button>
                    </div>

                    <div className="mt-24 grid w-full max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">
                                                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition duration-300 hover:border-pink-500/40 hover:bg-zinc-900/70">
                            <h2 className="text-4xl font-bold text-white">
                                {loadingStats
                                    ? "--"
                                    : stats.thumbnails.toLocaleString()}
                            </h2>
                            <p className="mt-2 text-zinc-400">
                                Thumbnails Generated
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition duration-300 hover:border-pink-500/40 hover:bg-zinc-900/70">
                            <h2 className="text-4xl font-bold text-white">
                                {loadingStats
                                    ? "--"
                                    : stats.users.toLocaleString()}
                            </h2>
                            <p className="mt-2 text-zinc-400">
                                Creators Joined
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition duration-300 hover:border-pink-500/40 hover:bg-zinc-900/70">
                            <h2 className="text-4xl font-bold text-white">
                                4+
                            </h2>
                            <p className="mt-2 text-zinc-400">
                                AI Styles
                            </p>
                        </div>

                        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur transition hover:border-pink-500/40 hover:bg-zinc-900/70">
                            <h2 className="text-4xl font-bold text-white">
                                24/7
                            </h2>
                            <p className="mt-2 text-zinc-400">
                                AI Availability
                            </p>
                        </div>

                    </div>

                </div>
            </section>
        </>
    );
};

export default About;