import React, { Component } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
export class About extends Component {
    static propTypes = {};

    render() {
        return (
            <>
                <Navbar />
                <section className="poppins-medium">
                    <section className="py-24 relative xl:mr-0 lg:mr-5 mr-0 bg-amber-50">
                        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto ">
                            <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
                                <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
                                    <div className="w-full flex-col justify-center items-start gap-8 flex">
                                        <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                                            <h6 className="text-[#132a13] text-base font-normal leading-relaxed">
                                                About Us
                                            </h6>
                                            <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                                                <h2 className="text-[#132a13] text-4xl font-bold leading-normal lg:text-start text-center">
                                                    The Tale of Our Achievement Story
                                                </h2>
                                                <p className="text-[#4F772D] text-base font-normal leading-relaxed lg:text-start text-center">
                                                    Our achievement story is a testament to teamwork and
                                                    perseverance. Together, we've overcome challenges,
                                                    celebrated victories, and created a narrative of
                                                    progress and success.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full flex-col justify-center items-start gap-6 flex">
                                            <div className="w-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                                                <div className="w-full h-full p-3.5 rounded-xl border hover:bg-[#ECF39E] border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                                    <h4 className="text-[#132A13] text-2xl font-bold leading-9 ">
                                                        33+ Years
                                                    </h4>
                                                    <p className="text-[#31572C] text-base font-normal leading-relaxed ">
                                                        Influencing Digital Landscapes Together
                                                    </p>
                                                </div>
                                                <div className="w-full h-full p-3.5 rounded-xl border hover:bg-[#ECF39E] border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                                    <h4 className="text-[#132A13] text-2xl font-bold leading-9">
                                                        125+ Projects
                                                    </h4>
                                                    <p className="text-[#31572C] text-base font-normal leading-relaxed">
                                                        Excellence Achieved Through Success
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="w-full h-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                                                <div className="w-full p-3.5 rounded-xl border hover:bg-[#ECF39E] border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                                    <h4 className="text-[#132A13] text-2xl font-bold leading-9">
                                                        26+ Awards
                                                    </h4>
                                                    <p className="text-[#31572C] text-base font-normal leading-relaxed">
                                                        Our Dedication to Innovation Wins Understanding
                                                    </p>
                                                </div>
                                                <div className="w-full h-full p-3.5 rounded-xl border hover:bg-[#ECF39E] border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex">
                                                    <h4 className="text-[#132A13] text-2xl font-bold leading-9">
                                                        99% Happy Clients
                                                    </h4>
                                                    <p className="text-[#31572C] text-base font-normal leading-relaxed">
                                                        Mirrors our Focus on Client Satisfaction.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="sm:w-fit w-full group px-3.5 py-2 bg-[#ECF39E] hover:bg-[#90A955] rounded-lg shadow-md transition-all duration-700 ease-in-out justify-center items-center flex">
                                        <span className="px-1.5 text-black text-sm font-medium leading-6 group-hover:-translate-x-0.5 transition-all duration-700 ease-in-out">
                                            Read More
                                        </span>
                                        <svg
                                            className="group-hover:translate-x-0.5 transition-all duration-700 ease-in-out"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="18"
                                            height="18"
                                            viewBox="0 0 18 18"
                                            fill="none"
                                        >
                                            <path
                                                d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996"
                                                stroke="#4F772D"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div className="w-full lg:justify-start justify-center items-start flex">
                                    <div className="sm:w-[564px] w-full sm:h-[646px] h-full bg-[#90a955] rounded-3xl border border-[#90a955] relative shadow-2xl">
                                        <img
                                            className="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover"
                                            src="https://pagedone.io/asset/uploads/1717742431.png"
                                            alt="about Us image"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="py-24 bg-[#fefae0]">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-12">
                                <h2 className="font-manrope text-5xl text-center font-bold text-[#132a13] mb-6">
                                    Meet the Brains
                                </h2>
                                <p className="text-lg text-[#31572c] text-center">
                                    These people work on making our product the best.
                                </p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-y-14 max-w-3xl mx-auto lg:max-w-full">
                                {[
                                    {
                                        name: "Marvin McKinney",
                                        role: "Founder",
                                        img: "1698649968.png",
                                    },
                                    { name: "Kathryn Murphy", role: "CTO", img: "1698650000.png" },
                                    { name: "Jerome Bell", role: "CMO", img: "1698659360.png" },
                                    { name: "Wade Warren", role: "CEO", img: "1698650109.png" },
                                    {
                                        name: "Leslie Alexander",
                                        role: "Customer Support",
                                        img: "1698650146.png",
                                    },
                                    { name: "Guy Hawkins", role: "HR", img: "1698650184.png" },
                                    {
                                        name: "Ronald Richards",
                                        role: "Co-Founder",
                                        img: "1698650213.png",
                                    },
                                    {
                                        name: "Devon Lane",
                                        role: "UI Designer",
                                        img: "1698650242.png",
                                    },
                                    {
                                        name: "Dianne Russell",
                                        role: "Product Designer",
                                        img: "1698650271.png",
                                    },
                                ].map((person, index) => (
                                    <div
                                        key={index}
                                        className="group block text-center lg:w-1/5 sm:w-1/3 min-[450px]:w-1/2 w-full"
                                    >
                                        <div className="relative mb-5">
                                            <img
                                                src={`https://pagedone.io/asset/uploads/${person.img}`}
                                                alt={`${person.name} image`}
                                                className="w-28 h-28 rounded-2xl object-cover mx-auto transition-all duration-500 border-2 border-solid border-[#e6e6e6] group-hover:border-[#2f4f2f]"
                                            />
                                        </div>
                                        <h4 className="text-xl font-semibold text-center mb-2 transition-all duration-500 text-[#132a13] group-hover:text-[#2f4f2f]">
                                            {person.name}
                                        </h4>
                                        <span className="text-[#31572c] text-center block transition-all duration-500 group-hover:text-[#132a13]">
                                            {person.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="py-24 bg-[#ecf39e]">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full">
                                <div className="w-full lg:w-1/2">
                                    <img
                                        src="https://pagedone.io/asset/uploads/1696230182.png"
                                        alt="FAQ section"
                                        className="w-full rounded-xl object-cover"
                                    />
                                </div>
                                <div className="w-full lg:w-1/2">
                                    <div className="lg:max-w-xl">
                                        <div className="mb-6 lg:mb-16">
                                            <h6 className="text-lg text-center font-medium text-[#4f772d] mb-2 lg:text-left">
                                                FAQs
                                            </h6>
                                            <h2 className="text-4xl text-center font-bold text-[#132a13] leading-[3.25rem] mb-5 lg:text-left">
                                                Looking for answers?
                                            </h2>
                                        </div>
                                        <div className="accordion-group">
                                            {/* Accordion Item 1 */}
                                            <div className="accordion pb-8 border-b border-solid border-[#90a955] active">
                                                <button className="accordion-toggle group inline-flex items-center justify-between text-xl font-normal leading-8 text-[#31572c] w-full transition duration-500 hover:text-[#4f772d]">
                                                    <h5>How to create an account?</h5>
                                                    <svg
                                                        className="text-[#132a13] transition duration-500 group-hover:text-[#4f772d] accordion-active:rotate-180"
                                                        width="22"
                                                        height="22"
                                                        viewBox="0 0 22 22"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                                                            stroke="currentColor"
                                                            strokeWidth="1.6"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        ></path>
                                                    </svg>
                                                </button>
                                                <div className="accordion-content w-full px-0 overflow-hidden pr-4 active">
                                                    <p className="text-base font-normal text-[#31572c]">
                                                        To create an account, find the 'Sign up' button, fill
                                                        in your details, and verify your email.
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Accordion Item 2 */}
                                            <div className="accordion py-8 border-b border-solid border-[#90a955]">
                                                <button className="accordion-toggle group inline-flex items-center justify-between text-xl font-normal leading-8 text-[#31572c] w-full transition duration-500 hover:text-[#4f772d]">
                                                    <h5>Have any trust issues?</h5>
                                                    <svg
                                                        className="text-[#132a13] transition duration-500 group-hover:text-[#4f772d] accordion-active:rotate-180"
                                                        width="22"
                                                        height="22"
                                                        viewBox="0 0 22 22"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                                                            stroke="currentColor"
                                                            strokeWidth="1.6"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        ></path>
                                                    </svg>
                                                </button>
                                                <div className="accordion-content w-full px-0 overflow-hidden pr-4">
                                                    <p className="text-base font-normal text-[#31572c]">
                                                        We ensure secure transactions and data protection,
                                                        keeping your trust at the forefront.
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Accordion Item 3 */}
                                            <div className="accordion py-8 border-b border-solid border-[#90a955]">
                                                <button className="accordion-toggle group inline-flex items-center justify-between text-xl font-normal leading-8 text-[#31572c] w-full transition duration-500 hover:text-[#4f772d]">
                                                    <h5>How can I reset my password?</h5>
                                                    <svg
                                                        className="text-[#132a13] transition duration-500 group-hover:text-[#4f772d] accordion-active:rotate-180"
                                                        width="22"
                                                        height="22"
                                                        viewBox="0 0 22 22"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                                                            stroke="currentColor"
                                                            strokeWidth="1.6"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        ></path>
                                                    </svg>
                                                </button>
                                                <div className="accordion-content w-full px-0 overflow-hidden pr-4">
                                                    <p className="text-base font-normal text-[#31572c]">
                                                        Click on ‘Forgot password,’ enter your email, and
                                                        follow the instructions to reset.
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Accordion Item 4 */}
                                            <div className="accordion py-8">
                                                <button className="accordion-toggle group inline-flex items-center justify-between text-xl font-normal leading-8 text-[#31572c] w-full transition duration-500 hover:text-[#4f772d]">
                                                    <h5>What is the payment process?</h5>
                                                    <svg
                                                        className="text-[#132a13] transition duration-500 group-hover:text-[#4f772d] accordion-active:rotate-180"
                                                        width="22"
                                                        height="22"
                                                        viewBox="0 0 22 22"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                                                            stroke="currentColor"
                                                            strokeWidth="1.6"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        ></path>
                                                    </svg>
                                                </button>
                                                <div className="accordion-content w-full px-0 overflow-hidden pr-4">
                                                    <p className="text-base font-normal text-[#31572c]">
                                                        Payments are processed securely through multiple
                                                        options, including cards and digital wallets.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </section>
                <Footer />
            </>
        );
    }
}

export default About;
