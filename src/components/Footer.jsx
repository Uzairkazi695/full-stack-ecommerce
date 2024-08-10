import React from 'react'
import { FaHome, FaPhoneAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

export default function Footer() {
  return (
    <>
        <div className='bg-primary text-white grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            <div className='ml-4'>
                <h2 className='text-xl mt-2'>Contact Us</h2>
                <div className='mt-2 flex'>
                    <span className='mt-1 mr-2'><FaHome /></span>
                    Gujarat, India
                </div>
                <div className='mt-2 flex'>
                    <span className='mt-1 mr-2'><FaPhoneAlt /></span>
                    <a href="tel: +91-123-965-4856">+91 1239654856</a>
                </div>
                <div className='mt-2 flex'>
                    <span className='mt-1 mr-2'><IoIosMail /></span>
                    <a href="mailto:contact@trendmart.com">contact@trendmart.com</a>
                </div>
            </div>
            <div className='ml-4'>
                <h2 className='text-xl mt-2'>Get Help</h2>
                <div className='mt-2'>FAQs</div>
                <div className='mt-2'>Shipping</div>
                <div className='mt-2'>Returns</div>
                <div className='mt-2'>Terms and Conditions</div>
            </div>
            <div className='ml-4'>
                <h2 className='text-xl mt-2'>Our Stores</h2>
                <div className='mt-2'>India</div>
                <div className='mt-2'>USA</div>
                <div className='mt-2'>Japan</div>
                <div className='mt-2'>Dubai</div>
            </div>
            <div className='ml-4'>
                <h2 className='text-xl my-2'>Follow Us</h2>
                <div className='flex gap-5 text-xl '>
                    <FaFacebook />
                    <FaInstagram />
                    <FaTwitter />
                    <FaLinkedin />
                </div>
            </div>
            <div className='ml-4'>
                <h2 className='text-xl my-2'>Newsletter</h2>
                <div>
                    <input type="text" placeholder='Your Email Here'/><br />
                    <button>Subscribe</button>
                </div>
            </div>
        </div>
        <div className='h-20 bg-primary-foreground text-pretty text-xl flex justify-center items-center'>
            <p>Copyright © Trend Mart 2024. All rights reserved.</p>
        </div>
    </>
  )
}