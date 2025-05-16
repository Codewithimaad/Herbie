import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import HeadingText from "../components/HeadingText";

const categories = [
    {
        title: "Account & Shopping",
        faqs: [
            {
                question: "Do I need to have an account to shop with you?",
                answer:
                    "No, but creating an account makes checkout faster and allows order tracking.",
            },
            {
                question: "How do I create an account?",
                answer:
                    "Click on the user icon > 'Create an Account' > Fill in your details > Submit.",
            },
            {
                question: "What if I forget my password?",
                answer:
                    "Use 'Forgot Password' on the login page and follow the email instructions.",
            },
            {
                question: "How can I update my address?",
                answer:
                    "Go to 'My Account' after signing in to manage your shipping/billing info.",
            },
            {
                question: "How can I view my order history?",
                answer: "Log into your account and go to 'Order History'.",
            },
        ],
    },
    {
        title: "Order Issues",
        faqs: [
            {
                question: "I haven't received a confirmation email/SMS?",
                answer:
                    "Check your spam folder. If still missing, contact our support team.",
            },
            {
                question: "Why was my order unsuccessful?",
                answer:
                    "Please verify your billing information or try using a different payment method.",
            },
            {
                question: "Why can't I checkout certain items?",
                answer:
                    "They may be out of stock or restricted by quantity limits.",
            },
            {
                question: "How can I place an order?",
                answer:
                    "Sign in, add items to your cart, proceed to checkout, and submit.",
            },
            {
                question: "How do I know you received my order?",
                answer:
                    "You'll receive a confirmation email/SMS after successful order placement.",
            },
            {
                question: "How can I track my order?",
                answer:
                    "Log into your account and check your order status in the dashboard.",
            },
            {
                question: "What if the product is out of stock?",
                answer:
                    "We'll contact you to offer alternatives or provide further assistance.",
            },
        ],
    },
];

export default function FAQsPage() {
    return (
        <div className="px-0 py-8 md:px-8 mx-auto">
            <HeadingText
                title="Frequently Asked Questions"
                description="Find answers to common questions about your shopping experience."
            />

            {categories.map((category, i) => (
                <section key={i} className="mb-10">
                    <h2 className="text-xl font-semibold text-green-700 mb-4 border-b pb-2">
                        {category.title}
                    </h2>

                    <Accordion type="single" collapsible className="space-y-3">
                        {category.faqs.map((faq, j) => (
                            <AccordionItem
                                key={`${i}-${j}`}
                                value={`${i}-${j}`}
                                className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-gray-300"
                            >
                                <AccordionTrigger className="flex items-center justify-between w-full bg-white px-4 py-3 text-left text-base font-medium text-gray-800 hover:bg-gray-50 transition-colors duration-200">
                                    {faq.question}
                                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180" />
                                </AccordionTrigger>
                                <AccordionContent className="overflow-hidden text-sm text-gray-700 transition-all duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                                    <div className="px-4 py-3 bg-gray-50 border-t">
                                        {faq.answer}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>
            ))}
        </div>
    );
}