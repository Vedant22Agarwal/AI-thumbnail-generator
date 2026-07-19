import { Mail, Github, Linkedin, Clock, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import SoftBackDrop from "../components/SoftBackDrop";
import Faq from "../components/Faq.tsx";
import useAuthContext from "../contexts/authContext.tsx";


const Contact = () => {

    const { isLoggedIn, user } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: user?.name ?? "",
        email: user?.email ?? "",
        subject: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);

        try {
            // Call your backend here

            await new Promise((r) => setTimeout(r, 1500));

            toast.success("Message sent successfully!");

            if (isLoggedIn) {
                setForm((prev) => ({
                    ...prev,
                    subject: "",
                    message: "",
                }));
            } else {
                setForm({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });
            }
        } catch {
            toast.error("Failed to send message.");
        }

        setLoading(false);
    };

    useEffect(() => {
        if (isLoggedIn && user) {
            setForm((prev) => ({
                ...prev,
                name: user.name,
                email: user.email,
            }));
        }
    }, [isLoggedIn, user]);

    return (
        <>
            <SoftBackDrop />

            <section className="relative min-h-screen px-6 py-24">

                <div className="mx-auto max-w-7xl">

                    <div className="text-center">

                        <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm text-pink-300 backdrop-blur">
                            Contact Us
                        </span>

                        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white md:text-6xl">
                            We'd Love to Hear
                            <span className="bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">
                                {" "}From You
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
                            Have questions, feature requests, bug reports, or
                            just want to say hello? Reach out anytime.
                        </p>

                    </div>

                    <div className="mt-20 grid gap-10 lg:grid-cols-5">

                        {/* LEFT */}

                        <div className="space-y-6 lg:col-span-2">

                            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur">

                                <h2 className="text-2xl font-semibold text-white">
                                    Contact Information
                                </h2>

                                <p className="mt-3 text-zinc-400">
                                    We'll get back to you as quickly as
                                    possible.
                                </p>

                                <div className="mt-10 space-y-8">

                                    <div className="flex items-start gap-4">
                                        <Mail className="text-pink-400" />
                                        <div>
                                            <h3 className="text-white">
                                                Email
                                            </h3>
                                            <p className="text-zinc-400">
                                                agarwal23vedant@gmail.com
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Github className="text-pink-400" />
                                        <div>
                                            <h3 className="text-white">
                                                GitHub
                                            </h3>
                                            <a
                                                href="https://github.com/Vedant22Agarwal"
                                                target="_blank"
                                                className="text-zinc-400 hover:text-pink-400"
                                            >
                                                github.com/Vedant22Agarwal
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Linkedin className="text-pink-400" />
                                        <div>
                                            <h3 className="text-white">
                                                LinkedIn
                                            </h3>
                                            <a
                                                href="https://www.linkedin.com/in/vedant-agarwal-1a68a4285"
                                                target="_blank"
                                                className="text-zinc-400 hover:text-pink-400"
                                            >
                                                linkedin.com/in
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <Clock className="text-pink-400" />
                                        <div>
                                            <h3 className="text-white">
                                                Response Time
                                            </h3>
                                            <p className="text-zinc-400">
                                                Usually within 24 hours.
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* RIGHT */}

                        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur lg:col-span-3">

                            <h2 className="text-2xl font-semibold text-white">
                                Send us a Message
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-8 space-y-6"
                            >

                                {isLoggedIn ? (
                                    <>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                                Name
                                            </label>
                                            <input
                                                value={form.name}
                                                readOnly
                                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-4 text-white cursor-default"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                readOnly
                                                className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-4 text-white cursor-default"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Your Name"
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950/70 px-5 py-4 text-white outline-none transition focus:border-pink-500"
                                            required
                                        />

                                        <input
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="Email Address"
                                            className="w-full rounded-xl border border-zinc-700 bg-zinc-950/70 px-5 py-4 text-white outline-none transition focus:border-pink-500"
                                            required
                                        />
                                    </>
                                )}

                                <input
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="Subject"
                                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950/70 px-5 py-4 text-white outline-none transition focus:border-pink-500"
                                    required
                                />

                                <textarea
                                    rows={6}
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Write your message..."
                                    className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950/70 px-5 py-4 text-white outline-none transition focus:border-pink-500"
                                    required
                                />

                                <button
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? (
                                        "Sending Message..."
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Message
                                        </>
                                    )}
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </section>
            {/* FAQ */}
            <Faq />


        </>
    );
};

export default Contact;