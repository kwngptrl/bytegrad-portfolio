"use server";

import React from "react";
import { Resend } from "resend";
import { validateString, getErrorMessage } from "@/lib/utils";
import ContactFormEmail from "@/email/contact-form-email";

const resend = new Resend(process.env.ORIG_RESEND_API_KEY);
/* 
const getErrorMessage = (error: unknown): string => {
    let message: string;

    if (error instanceof Error) {
        message = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
        message = String(error.message);
    } else if (typeof error === "string") {
        message = error;
    } else {
        message = "Something went wrong";
    }
    return message;
} */

export const sendEmail = async (formData: FormData) => {
    /* console.log("Running on server");
    console.log(formData.get("senderEmail"));
    console.log(formData.get("message")); */
    const senderEmail = formData.get('senderEmail');
    const message = formData.get('message');

    /* simple server-side validation */
    if (!validateString(senderEmail, 500)) {
        return {
            error: "Invalid sender email",
        };
    }
    if (!validateString(message, 5000)) {
        return {
            error: "Invalid message",
        };
    }

    let data;
    try {
        await resend.emails.send({
            from: "Contact Form <onboarding@resend.dev>",
            to: "tact41524@gmail.com",
            subject: `Message from contact form today ${new Date().toUTCString()}`,
            reply_to: senderEmail as string,
            /* text: message as string, */
            /* react: <ContactFormEmail message={message} senderEmail={senderEmail} /> */
            react: React.createElement(ContactFormEmail, {
                message: message as string,
                senderEmail: senderEmail as string,
            })
        });
    } catch (error: unknown) {
        return {
            error: getErrorMessage(error)
        }
    }
    return {
        data,
    };
}