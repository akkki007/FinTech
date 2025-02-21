import React from "react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const Pricing = () => {
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
        <section className="py-24 bg-amber-50 poppins-medium">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
                <h2 className="font-manrope text-5xl text-center font-bold text-gray-900 mb-4"
                ref={(el) => (boxRef.current[0] = el)} 
                >Choose your plan </h2>
                <p className="text-gray-500 text-center leading-6 mb-9"
                ref={(el) => (boxRef.current[1] = el)} 
                >7 Days free trial. No credit card required.</p>
             
                <div className="flex justify-center items-center"ref={(el) => (boxRef.current[2] = el)} >
                    <label className="min-w-[3.5rem] text-xl relative text-gray-900 mr-4 font-medium">Bill Monthly</label>
                    <input type="checkbox" id="basic-with-description"
                        className="relative shrink-0 w-11 h-6 p-0.5 bg-indigo-100 checked:bg-none checked:bg-indigo-100 rounded-full cursor-pointer transition-colors ease-in-out duration-200  focus:border-b-emerald-900  appearance-none 

                            before:inline-block before:w-5 before:h-5 before:bg-[#4F772D] checked:before:bg-[#4F772D] before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform  before:transition before:ease-in-out before:duration-200 "/>
                    <label className="relative min-w-[3.5rem] font-medium text-xl text-gray-500 ml-4 ">
                        Bill Yearly
                    </label>
                </div>
            
            </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-8 lg:space-y-0 lg:items-center">
                    
                    <div className="flex flex-col mx-auto max-w-sm text-gray-900 rounded-2xl bg-[#ECF39E] p-6 xl:py-9 xl:px-12 transition-all duration-500 hover:bg-white"
                    ref={(el) => (boxRef.current[3] = el)} 
                    >
                        <h3 className="font-manrope text-2xl font-bold mb-3">Free</h3>
                        <div className="flex items-center mb-6">
                            <span className="font-manrope mr-2 text-6xl font-semibold">$0</span>
                            <span className="text-xl text-gray-500 ">/ month</span>
                        </div>
                       
                        <ul className="mb-12 space-y-6 text-left text-lg text-gray-500">
                            <li className="flex items-center space-x-4">
                       
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>2 auto tracking</span>
                            </li>
                            <li className="flex items-center space-x-4">
                               
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>7 Day transaction clearing </span>
                            </li>
                            <li className="flex items-center space-x-4">
                          
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>24/7 Customer support </span>
                            </li>
                            <li className="flex items-center space-x-4">
                         
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>All widget access</span>
                            </li>
                        </ul>
                        <a href="javascript:;"  className="py-2.5 px-5 bg-[#4F772D] shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit mx-auto hover:bg-[#132A13]">Purchase Plan</a>
                   
                    </div> 
                  
                    <div className="flex flex-col mx-auto max-w-sm text-gray-900 rounded-2xl bg-[#ECF39E] transition-all duration-500 hover:bg-white "
                    ref={(el) => (boxRef.current[4] = el)} 
                    >
                        <div className="uppercase bg-[#4F772D] rounded-t-2xl p-3 text-center text-white">
                            MOST POPULAR
                        </div>   
                        <div className="p-6 xl:py-9 xl:px-12">
                        <h3 className="font-manrope text-2xl font-bold mb-3">Advanced</h3>
                        <div className="flex items-center mb-6">
                            <span className="font-manrope mr-2 text-6xl font-semibold text-black">$150</span>
                            <span className="text-xl text-gray-500 ">/ month</span>
                        </div>
                      
                        <ul className="mb-12 space-y-6 text-left text-lg ">
                            <li className="flex items-center space-x-4">
                                
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>AI Advisor</span>
                            </li>
                            <li className="flex items-center space-x-4">
                          
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>Unlimited auto tracking</span>
                            </li>
                            <li className="flex items-center space-x-4">
                               
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>1 Day transaction clearing </span>
                            </li>
                            <li className="flex items-center space-x-4">
                            
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>Priority customer support</span>
                            </li>
                            <li className="flex items-center space-x-4">
                         
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>All Widget Access</span>
                            </li>
                        </ul>
                        <a href="javascript:;"  className="py-2.5 px-5 bg-[#4F772D] shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit block mx-auto hover:bg-[#132A13]">Purchase Plan</a>
                        
                    </div>
                    </div> 
                     
                     <div className="flex flex-col mx-auto max-w-sm text-gray-900 rounded-2xl bg-[#ECF39E] p-6 xl:py-9 xl:px-12 transition-all duration-500 hover:bg-white"
                     ref={(el) => (boxRef.current[5] = el)} >
                        <h3 className="font-manrope text-2xl font-bold mb-3">Team</h3>
                        <div className="flex items-center mb-6">
                            <span className="font-manrope mr-2 text-6xl font-semibold">$180</span>
                            <span className="text-xl text-gray-500 ">/ month</span>
                        </div>
                     
                        <ul className="mb-12 space-y-6 text-left text-lg text-gray-500">
                            <li className="flex items-center space-x-4">
                            
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>AI Advisor</span>
                            </li>
                            <li className="flex items-center space-x-4">
                          
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>Unlimited auto tracking </span>
                            </li>
                            <li className="flex items-center space-x-4">
                      
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>1 Day transaction clearing </span>
                            </li>
                            <li className="flex items-center space-x-4">
                        
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>Priority customer support</span>
                            </li>
                            <li className="flex items-center space-x-4">
                               
                                <svg className="flex-shrink-0 w-6 h-6 text-black" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 14.7875L13.0959 17.8834C13.3399 18.1274 13.7353 18.1275 13.9794 17.8838L20.625 11.25M15 27.5C8.09644 27.5 2.5 21.9036 2.5 15C2.5 8.09644 8.09644 2.5 15 2.5C21.9036 2.5 27.5 8.09644 27.5 15C27.5 21.9036 21.9036 27.5 15 27.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                <span>All Widget Access</span>
                            </li>
                        </ul>
                        <a href="javascript:;"  className="py-2.5 px-5 bg-[#4F772D] shadow-sm rounded-full transition-all duration-500 text-base text-white font-semibold text-center w-fit mx-auto hover:bg-[#132A13]">Purchase Plan</a>
                       
                    </div> 
                </div>
                
            
        </div>
    </section>
                                            
    );
  };
  
  export default Pricing;

