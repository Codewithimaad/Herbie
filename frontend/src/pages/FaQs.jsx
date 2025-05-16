import { useState } from "react";
import { Accordion, AccordionItem } from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import HeadingText from "../components/HeadingText";

const categories = [
    {
        title: "Account & Shopping",
        faqs: [
            {
                question: "Do I need to have an account to shop with you?",
                answer:
                    "No, but setting up an account will allow you to order without having to enter your details every time you shop with us, making your shopping experience seamless.",
            },
            {
                question: "How do I create an account with Saeed Ghani?",
                answer:
                    "Click on the ‘User’ sign > Click on the ‘Create an Account’ tab > Fill in your personal details > Click ‘Create an Account’.",
            },
            {
                question: "What if I forget my password, how will I retrieve it?",
                answer:
                    "Select 'FORGOT PASSWORD' on the login page, enter your email and follow the reset link. If you don't receive the email, check junk mail or contact us.",
            },
            {
                question: "How can I update/edit my shipping or billing address details?",
                answer:
                    "Sign in, go to ‘My Account’, and update your address. For confirmed orders, contact customer service to request changes.",
            },
            {
                question: "How will I view my order details and history?",
                answer:
                    "Sign into ‘My Account’ and click on the order ID you wish to view. A confirmation email/SMS will also be sent after placing an order.",
            },
        ],
    },
    {
        title: "Order Issues",
        faqs: [
            {
                question: "I have not received a confirmation email/SMS?",
                answer:
                    "Check your email address and contact number. Also, check junk mail. If not received within 4 hours, contact us with your order name.",
            },
            {
                question: "I received an email to say my order was unsuccessful",
                answer:
                    "There may be various reasons. Check billing info and try again or contact our customer service.",
            },
            {
                question: "I can't checkout with some of the items in my basket",
                answer:
                    "This may mean the item is out of stock. Also check if there’s a quantity limit per item.",
            },
            {
                question: "How can I place an order?",
                answer:
                    "Sign in or create an account, add products to cart, proceed to checkout, enter billing/shipping info, select payment mode, and submit.",
            },
            {
                question: "How will I know that you have received my order?",
                answer:
                    "You will receive an email/SMS with order ID, items, price, and estimated delivery after verification.",
            },
            {
                question: "How can I check the status of my order?",
                answer:
                    "Log into your account and check order history for updates.",
            },
            {
                question: "What happens if the product ordered is out of stock?",
                answer:
                    "We will contact you if we cannot deliver. You may get a replacement recommendation or visit our store.",
            },
        ],
    },
    // Add other categories similarly like "Order Amends & Cancellation", "Issue with Items Received", etc.
];

export default function FAQsPage() {
    const [openCategory, setOpenCategory] = useState(null);

    return (
        <div className="p-6">
            < HeadingText title='FAQS' />
            {categories.map((category, i) => (
                <div key={i} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-purple-700 border-b pb-2">
                        {category.title}
                    </h2>
                    <Accordion type="single" collapsible className="space-y-3">
                        {category.faqs.map((faq, j) => (
                            <AccordionItem
                                value={`${i}-${j}`}
                                key={`${i}-${j}`}
                                className="bg-white shadow-sm rounded-xl border border-gray-200"
                            >
                                <button
                                    className="flex justify-between items-center w-full p-4 text-left text-lg font-medium hover:bg-gray-50 rounded-t-xl"
                                    onClick={() =>
                                        setOpenCategory((prev) =>
                                            prev === `${i}-${j}` ? null : `${i}-${j}`
                                        )
                                    }
                                >
                                    {faq.question}
                                    <ChevronDown
                                        className={`transition-transform duration-200 ${openCategory === `${i}-${j}` ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {openCategory === `${i}-${j}` && (
                                    <div className="p-4 text-gray-700 border-t text-base">
                                        {faq.answer}
                                    </div>
                                )}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ))}
        </div>
    );
}

