import React from "react";
import {
  FaHome,
  FaPhoneAlt,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const FooterLink = ({ href, children }) => (
  <a
    href={href}
    className="transition-colors duration-200 hover:text-primary-foreground/80"
  >
    {children}
  </a>
);

const FooterSection = ({ title, children }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold tracking-wide">{title}</h2>
    {children}
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary to-primary/90 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <FooterSection title="Contact Us">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 group">
                <FaHome className="text-lg group-hover:text-primary-foreground/80" />
                <span>Gujarat, India</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <FaPhoneAlt className="text-lg group-hover:text-primary-foreground/80" />
                <FooterLink>
                  +91 1239654856
                </FooterLink>
              </div>
              <div className="flex items-center space-x-3 group">
                <IoIosMail className="text-lg group-hover:text-primary-foreground/80" />
                <FooterLink>
                  contact@cartify.com
                </FooterLink>
              </div>
            </div>
          </FooterSection>

          <FooterSection title="Get Help">
            <ul className="space-y-2">
              {["FAQs", "Shipping", "Returns", "Terms and Conditions"].map(
                (item) => (
                  <li key={item}>
                    <FooterLink href="#">{item}</FooterLink>
                  </li>
                )
              )}
            </ul>
          </FooterSection>

          <FooterSection title="Our Stores">
            <ul className="space-y-2">
              {["India", "USA", "Japan", "Dubai"].map((location) => (
                <li key={location}>
                  <FooterLink>{location}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterSection>

          <FooterSection title="Follow Us">
            <div className="flex space-x-4">
              {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-2xl hover:text-primary-foreground/80 transition-colors duration-200"
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </FooterSection>

          <FooterSection title="Newsletter">
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your Email Here"
                className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none focus:border-white/40 transition-colors duration-200"
              />
              <button className="w-full px-4 py-2 bg-white text-primary font-semibold rounded hover:bg-white/90 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </FooterSection>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm md:text-base">
            Copyright © Cartify {new Date().getFullYear()}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
