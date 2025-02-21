import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Pricing from "../components/Pricing";
import { Link } from "react-router-dom";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const cardData = [
  {
    title: "On Time Service",
    description: "It refers to the ability of a business to deliver products, services, or solutions within the promised timeframe. Timely service builds trust",
    linkText: "Read More",
    icon: (
      <img src="/images/card1.png" className="h-15 w-15 object-cover" alt="Home" />
    ),
  },
  {
    title: "Team of Professionals",
    description: "Effective communication, mutual respect, and shared objectives are essential for fostering a cohesive and productive team environment.",
    linkText: "Read More",
    icon: (
      <img src="/images/card2.png" className="h-15 w-15 object-cover" alt="Home" />
    ),
  },
  {
    title: "Analyze Your Business",
    description: "A thorough business analysis enables you to set realistic goals, allocate resources effectively, and mitigate risks. It fosters innovation and adaptability",
    linkText: "Read More",
    icon: (
      <img src="/images/card3.png" className="h-15 w-15 object-cover" alt="Home" />
    ),
  },
];

const Home = () => {
  const boxRef = useRef([]);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      boxRef.current,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.3,
        scrollTrigger: {
          trigger: boxRef.current[0],
          start: "top 65%", 
        },
      }
    );

    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, x: 100 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".grid",
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <>
      <Navbar />

      {/* Image Section */}
      <div className="relative h-screen w-full poppins-medium">
        <img src="/images/home2.jpg" className="h-full w-full object-cover" alt="Home" />
        <div className="absolute inset-0 bg-green-900 opacity-50"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
        <h1
          className="mb-4 text-7xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl"
          ref={(el) => (boxRef.current[0] = el)} 
        >
            Financial Expertise you can trust and secure.
          </h1>
          <p
          className="mb-6 text-3xl font-normal lg:text-2xl px-4 md:px-16"
          ref={(el) => (boxRef.current[1] = el)} 
        >
            Simplifies financial health with automated budgeting, expense tracking, and real-time insights.
          </p>
          <Link to="/Register" className="px-5 py-3 font-semibold bg-[#ECF39E] hover:bg-[#b0cb6f] text-black rounded-lg" ref={(el) => (boxRef.current[2] = el)}>
            Get started
          </Link>
        </div>
      </div>

      {/* Card Section */}
      <div className="grid grid-cols-3 gap-20 p-30 bg-amber-50 poppins-medium">
      {cardData.map((card, index) => (
        <div
          key={index}
          ref={(el) => (cardsRef.current[index] = el)}
          className="max-w-sm p-6 bg-white border rounded-lg shadow-sm dark:bg-[#cfed8b]"
        >
          <div className="flex items-center gap-3">
            {card.icon}
            <h5 className="text-xl font-semibold text-gray-900 dark:text-black">{card.title}</h5>
          </div>
          <p className="ml-5 mt-6 mb-3 text-black dark:text-black">{card.description}</p>
          <a
            href="#"
            className="ml-5 text-black hover:underline hover:text-blue-600 flex items-center"
          >
            {card.linkText}
            <svg className="w-3 h-3 ms-2.5" viewBox="0 0 18 18">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
              />
            </svg>
          </a>
        </div>
      ))}
    </div>
      {/* stats */}
      <section className="py-20 bg-[#e9f2cb] poppins-medium">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-col flex-1 gap-10 lg:gap-0 lg:flex-row lg:justify-between">
            <div className="w-full lg:w-1/4 border-b pb-10 lg:border-b-0 lg:pb-0 lg:border-r border-gray-600">
              <div
                className="font-manrope font-bold text-5xl text-gray-900 mb-5 text-center "
                ref={(el) => (boxRef.current[3] = el)} 
                >
                260+
              </div>
              <span className="text-xl text-gray-500 text-center block "ref={(el) => (boxRef.current[4] = el)} >Expert Consultants
              </span>
            </div>
            <div className="w-full lg:w-1/4 border-b pb-10 lg:border-b-0 lg:pb-0 lg:border-r border-gray-600">
              <div
                className="font-manrope font-bold text-5xl text-gray-900 mb-5 text-center" 
                ref={(el) => (boxRef.current[5] = el)} 
                >
                975+
              </div>
              <span className="text-xl text-gray-500 text-center block " ref={(el) => (boxRef.current[6] = el)} >Active Clients
              </span>
            </div>
            <div className="w-full lg:w-1/4 border-b pb-10 lg:border-b-0 lg:pb-0 lg:border-r border-gray-600">
              <div
                className="font-manrope font-bold text-5xl text-gray-900 mb-5 text-center "
                ref={(el) => (boxRef.current[7] = el)} 
                >
                724+
              </div>
              <span className="text-xl text-gray-500 text-center block "ref={(el) => (boxRef.current[8] = el)} >Projects Delivered
              </span>
            </div>
            <div className="w-full lg:w-1/4  ">
              <div
                className="font-manrope font-bold text-5xl text-gray-900 mb-5 text-center "
                ref={(el) => (boxRef.current[9] = el)} 
                >
                89+
              </div>
              <span className="text-xl text-gray-500 text-center block "ref={(el) => (boxRef.current[10] = el)} >Orders in Queue
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 relative xl:mr-0 lg:mr-5 mr-0 bg-amber-50 poppins-medium">
        <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto ">
          <div className="w-full justify-start items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
            <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
              <div className="w-full flex-col justify-center items-start gap-8 flex">
                <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                  <h6 className="text-[#132a13] text-base font-normal leading-relaxed">About Us</h6>
                  <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                    <h2 className="text-[#132a13] text-4xl font-bold leading-normal lg:text-start text-center"
                    ref={(el) => (boxRef.current[10] = el)} 
                    >
                      The Tale of Our Achievement Story
                    </h2>
                    <p className="text-[#4F772D] text-base font-normal leading-relaxed lg:text-start text-center"
                    ref={(el) => (boxRef.current[11] = el)} 
                    >
                      Our achievement story is a testament to teamwork and perseverance. Together, we've overcome challenges,
                      celebrated victories, and created a narrative of progress and success.
                    </p>
                  </div>
                </div>
                <div className="w-full flex-col justify-center items-start gap-6 flex">
                  <div className="w-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                    <div className="w-full h-full p-3.5 rounded-xl border hover:bg-[#ECF39E] border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex"
                    ref={(el) => (boxRef.current[12] = el)} 
                    >
                      <h4 className="text-[#132A13] text-2xl font-bold leading-9">33+ Years</h4>
                      <p className="text-[#31572C] text-base font-normal leading-relaxed">Influencing Digital Landscapes Together</p>
                    </div>
                    <div className="w-full h-full p-3.5 rounded-xl border hover:bg-[#ECF39E] border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex"
                    ref={(el) => (boxRef.current[13] = el)} 
                    >
                      <h4 className="text-[#132A13] text-2xl font-bold leading-9">125+ Projects</h4>
                      <p className="text-[#31572C] text-base font-normal leading-relaxed">Excellence Achieved Through Success</p>
                    </div>
                  </div>
                  <div className="w-full h-full justify-start items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                    <div className="w-full p-3.5 rounded-xl border hover:bg-[#ECF39E] border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex"
                    ref={(el) => (boxRef.current[14] = el)} 
                    >
                      <h4 className="text-[#132A13] text-2xl font-bold leading-9">26+ Awards</h4>
                      <p className="text-[#31572C] text-base font-normal leading-relaxed">Our Dedication to Innovation Wins Understanding</p>
                    </div>
                    <div className="w-full h-full p-3.5 rounded-xl border hover:bg-[#ECF39E] border-[#4F772D] hover:border-[#90A955] transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex"
                    ref={(el) => (boxRef.current[15] = el)} 
                    >
                      <h4 className="text-[#132A13] text-2xl font-bold leading-9">99% Happy Clients</h4>
                      <p className="text-[#31572C] text-base font-normal leading-relaxed">Mirrors our Focus on Client Satisfaction.</p>
                    </div>
                  </div>
                </div>
              </div>
              <button className="sm:w-fit w-full group px-3.5 py-2 bg-[#ECF39E] hover:bg-[#90A955] rounded-lg shadow-md transition-all duration-700 ease-in-out justify-center items-center flex"
              ref={(el) => (boxRef.current[16] = el)} 
              >
                <span className="px-1.5 text-black text-sm font-medium leading-6 group-hover:-translate-x-0.5 transition-all duration-700 ease-in-out"
                >
                  Read More
                </span>
                <svg className="group-hover:translate-x-0.5 transition-all duration-700 ease-in-out" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996" stroke="#4F772D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <div className="w-full lg:justify-start justify-center items-start flex">
              <div className="sm:w-[564px] w-full sm:h-[646px] h-full bg-[#90a955] rounded-3xl border border-[#90a955] relative shadow-2xl">
                <img className="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover" src="https://pagedone.io/asset/uploads/1717742431.png" alt="about Us image" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* services */}
      <div>
        <section class="py-24 bg-[#e9f2cb] poppins-medium">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="mb-10 lg:mb-16 flex justify-center items-center flex-col gap-x-0 gap-y-6 lg:gap-y-0 lg:flex-row lg:justify-between max-md:max-w-lg max-md:mx-auto">
              <div class="relative w-full text-center lg:text-left lg:w-2/4">
                <h2 class="text-4xl font-bold text-gray-900 leading-[3.25rem] lg:mb-6 mx-auto max-w-max lg:max-w-md lg:mx-0"
                ref={(el) => (boxRef.current[17] = el)}
                >Enjoy the finest features with our products</h2>
              </div>
              <div class="relative w-full text-center  lg:text-left lg:w-2/4">
                <p class="text-lg font-normal text-gray-500 mb-5" ref={(el) => (boxRef.current[18] = el)}>We provide all the advantages that can simplify all your financial transactions without any further requirements</p>
                <a href="#" class="flex flex-row items-center justify-center gap-2 text-base font-semibold text-black lg:justify-start hover:text-emerald-900 ">Button CTA <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 15L11.0858 11.4142C11.7525 10.7475 12.0858 10.4142 12.0858 10C12.0858 9.58579 11.7525 9.25245 11.0858 8.58579L7.5 5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                </a>
              </div>
            </div>
            <div class="flex justify-center items-center  gap-x-5 gap-y-8 lg:gap-y-0 flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between lg:gap-x-8">
              <div class="group relative w-full bg-[#ECF39E] rounded-2xl p-4 transition-all duration-500 max-md:max-w-md max-md:mx-auto md:w-2/5 md:h-64 xl:p-7 xl:w-1/4 hover:bg-[#90A955]"
              ref={(el) => (boxRef.current[19] = el)}
              >
                <div class="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14 ">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.7222 11.6667V7.22225C24.7222 5.99495 23.7273 5 22.5 5H4.72222C3.49492 5 2.5 5.99492 2.5 7.22222V22.7778C2.5 24.0051 3.49492 25 4.72222 25H22.5C23.7273 25 24.7222 24.005 24.7222 22.7777V17.7778M20.8333 17.7778H25.2778C26.5051 17.7778 27.5 16.7829 27.5 15.5556V13.8889C27.5 12.6616 26.5051 11.6667 25.2778 11.6667H20.8333C19.606 11.6667 18.6111 12.6616 18.6111 13.8889V15.5556C18.6111 16.7829 19.606 17.7778 20.8333 17.7778Z" stroke="#4F772D" stroke-width="2"></path>
                  </svg>

                </div>
                <h4 class="text-xl font-semibold text-gray-900 mb-3 capitalize transition-all duration-500 group-hover:text-black">Financial Planning</h4>
                <p class="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 group-hover:text-black">
                  It involves assessing your current financial situation, setting realistic objectives, and creating a roadmap.
                </p>
              </div>
              <div class="group relative w-full bg-[#ECF39E] rounded-2xl p-4 transition-all duration-500 max-md:max-w-md max-md:mx-auto md:w-2/5 md:h-64 xl:p-7 xl:w-1/4 hover:bg-[#90A955]"
              ref={(el) => (boxRef.current[20] = el)}
              >
                <div class="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14 ">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.375 15.8571C16.1009 15.8571 17.5 14.458 17.5 12.7321C17.5 11.0062 16.1009 9.6071 14.375 9.6071C12.6491 9.6071 11.25 11.0062 11.25 12.7321C11.25 14.458 12.6491 15.8571 14.375 15.8571ZM14.375 15.8571V20.8571M3.75 13.2264V15.2343C3.75 17.6868 3.75 18.9131 4.27747 19.9685C4.80493 21.0239 5.78567 21.76 7.74715 23.2322L8.57248 23.8516C11.4626 26.0208 12.9077 27.1054 14.5753 27.1054C16.243 27.1054 17.688 26.0208 20.5782 23.8516L21.4035 23.2322C23.365 21.76 24.3457 21.0239 24.8732 19.9685C25.4006 18.9131 25.4006 17.6868 25.4006 15.2343V13.2264C25.4006 9.95932 25.4006 8.32576 24.546 7.05852C23.6913 5.79128 22.1768 5.17918 19.1477 3.95499L18.3223 3.62144C16.4724 2.87381 15.5475 2.5 14.5753 2.5C13.6032 2.5 12.6782 2.87381 10.8283 3.62144L10.003 3.95499C6.97389 5.17919 5.45934 5.79128 4.60467 7.05852C3.75 8.32576 3.75 9.95932 3.75 13.2264Z" stroke="#4F772D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>

                </div>
                <h4 class="text-xl font-semibold text-gray-900 mb-3 capitalize transition-all duration-500 group-hover:text-black">Investment Advisory</h4>
                <p class="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 group-hover:text-black">
                  Regular monitoring and adjustments ensure investments remain aligned with changing goals and market trends.
                </p>
              </div>
              <div class="group relative w-full bg-[#ECF39E] rounded-2xl p-4 transition-all duration-500 max-md:max-w-md max-md:mx-auto md:w-2/5 md:h-64 xl:p-7 xl:w-1/4 hover:bg-[#90A955]"
              ref={(el) => (boxRef.current[21] = el)}
              >
                <div class="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14 ">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.0067 10V15.6652C15.0067 16.0358 15.1712 16.3873 15.4556 16.6248L18.75 19.375M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="#4F772D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>

                </div>
                <h4 class="text-xl font-semibold text-gray-900 mb-3 capitalize transition-all duration-500 group-hover:text-black">Tax Planning</h4>
                <p class="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 group-hover:text-black">
                  Proper tax planning can help individuals and businesses reduce taxable income, defer taxes, and optimize tax-saving.
                </p>
              </div>
              <div class="group relative w-full bg-[#ECF39E] rounded-2xl p-4 transition-all duration-500 max-md:max-w-md max-md:mx-auto md:w-2/5 md:h-64 xl:p-7 xl:w-1/4 hover:bg-[#90A955]"
              ref={(el) => (boxRef.current[22] = el)}>
                <div class="bg-white rounded-full flex justify-center items-center mb-5 w-14 h-14 ">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="#4F772D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>

                </div>
                <h4 class="text-xl font-semibold text-gray-900 mb-3 capitalize transition-all duration-500 group-hover:text-black">Corporate Finance</h4>
                <p class="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 group-hover:text-black">
                  Financial analysis and forecasting help in making informed strategic decisions. Managing working capital efficiently.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div>
        <Pricing />
      </div>
      <div>
        <div className="flex flex-col poppins-medium">
          <div className="mt-0">
            <h3 className="font-manrope text-5xl text-center font-bold text-gray-900 bg-[#e9f2cb]">
            <br></br>Contact us
            </h3>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center p-8 bg-[#e9f2cb]">
            {/* Left Side - Contact Form */}
            <div className="w-full md:w-1/2 bg-[#e9f2cb] p-8 shadow-lg shadow-lime-700 rounded-lg">
              <h2 className="text-2xl font-bold mb-4 text-[#31572c]">Send us a Message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name *"
                    className="p-3 border rounded-md w-full border-[#4f772d] text-black"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    className="p-3 border rounded-md w-full border-[#4f772d] text-black"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email *"
                  className="p-3 border rounded-md w-full border-[#4f772d] text-black"
                />
                <input
                  type="text"
                  placeholder="Subject *"
                  className="p-3 border rounded-md w-full border-[#4f772d] text-black"
                />
                <textarea
                  placeholder="Message"
                  className="p-3 border rounded-md w-full h-32 border-[#4f772d] text-black"
                ></textarea>
                <button className="bg-[#31572c] text-white p-3 rounded-md w-full hover:bg-[#132a13]">
                  SEND MESSAGE
                </button>
              </form>
            </div>

            {/* Right Side - Info Cards & Map */}
            <div className="w-full md:w-1/2 flex flex-col items-center md:ml-8 mt-8 md:mt-0">
              {/* Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full">
                {/* Address Card */}
                <div className="bg-[#90a955] p-6 rounded-lg shadow-md flex items-center space-x-4">
                  <FaMapMarkerAlt className="text-white text-3xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Our Address</h3>
                    <p className="text-white text-sm">132, Tic St, Kingston, NY 12401, USA</p>
                  </div>
                </div>

                {/* Opening Hours Card */}
                <div className="bg-[#4f772d] p-6 rounded-lg shadow-md flex items-center space-x-4">
                  <FaClock className="text-white text-3xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">Opening Hours</h3>
                    <p className="text-white text-sm">Sat - Mon: 10 AM - 8 PM</p>
                  </div>
                </div>
              </div>

              {/* Google Map */}
              <iframe
                className="w-full h-72 rounded-md shadow-lg border border-[#31572c]"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242118.1410851368!2d-74.25986779260588!3d40.697670063580234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c250b457aabcdf%3A0x7550d153b52d89b1!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1700000000000"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
