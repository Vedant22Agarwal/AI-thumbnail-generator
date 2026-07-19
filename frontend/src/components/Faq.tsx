import { ChevronDown, ChevronUp } from "lucide-react";
import { faqs } from "../data/faq.ts";
import { useState } from "react";

const Faq = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    return (
        <>
            <div className="mx-auto mt-28 max-w-5xl">

                <div className="text-center">

                    <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm text-pink-300 backdrop-blur">
                        FAQ
                    </span>

                    <h2 className="mt-6 text-4xl font-semibold text-white">
                        Frequently Asked Questions
                    </h2>

                    <p className="mt-4 text-zinc-400">
                        Find quick answers to the questions creators ask most.
                    </p>

                </div>

                <div className="mt-14 space-y-4">

                    {faqs.map((faq, index) => {
                        const open = openFaq === index;

                        return (
                            <div
                                key={index}
                                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur transition-all duration-300 hover:border-pink-500/40"
                            >

                                <button
                                    onClick={() =>
                                        setOpenFaq(open ? null : index)
                                    }
                                    className="flex w-full items-center justify-between px-6 py-5 text-left"
                                >

                                    <span className="text-lg font-medium text-white">
                                        {faq.question}
                                    </span>

                                    {open ? (
                                        <ChevronUp
                                            className="text-pink-400"
                                            size={22}
                                        />
                                    ) : (
                                        <ChevronDown
                                            className="text-zinc-400"
                                            size={22}
                                        />
                                    )}

                                </button>

                                <div
                                    className={`grid transition-all duration-300 ${open
                                        ? "grid-rows-[1fr]"
                                        : "grid-rows-[0fr]"
                                        }`}
                                >
                                    <div className="overflow-hidden">
                                        <p className="px-6 pb-6 leading-7 text-zinc-400">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>
        </>
    )
}

export default Faq