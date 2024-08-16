import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqList = [
  {
    question: "What is PolyFox AI?",
    answer:
      "PolyFox AI is an all in one platform offering multiple AI features at attractive plans.",
  },
  {
    question: "What AI features does PolyFox offer?",
    answer:
      "Our platform offers advanced chat capabilities using GPT-4 Turbo and image generators such as DALL-E 3 and STABLE DIFFUSION. Additionally, we have a QR code generator to help you get started.",
  },
  {
    question: "Can I try the platform first? ",
    answer:
      "Absolutely, the platform is live at app.polyfox.ai (with mobile support)",
  },
  {
    question: "How do I top up credits to my account?",
    answer:
      "Currently, to top up your credits, you can invest in our Solana native coin $PYFOX or use a debit card.",
  },
  {
    question: "How flexible are the pricing plans?",
    answer:
      "We provide our users with multiple options to add credits to their account, including debit cards, cryptocurrencies, native coins, and project-supported tokens. Moreover, our credit system lasts for a year, and you only get charged for the credits that you use. Unlike other AI providers, we believe in offering our users flexibility and transparency.",
  },
  {
    question: "Why should we invest in your project?",
    answer:
      "At Polyfox AI, we are always researching and exploring new AI features that we can add to our platform. You can use these features with the credits you have preloaded. Our goal is to add 12 additional AIs by the end of next year, each offering unique capabilities. Making our platform the Ultimate AI fusion hub. ",
  },
];

const Item = ({ item }: { item: any }) => {
  return (
    <AccordionItem value={item}>
      <AccordionTrigger>{item?.question}</AccordionTrigger>
      <AccordionContent>{item?.answer}</AccordionContent>
    </AccordionItem>
  );
};

const FAQ = () => {
  return (
    <section className="bg-base-200" id="faq">
      <div className="py-12 px-8 max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        <div className="flex flex-col text-left basis-1/2">
          <p className="inline-block font-semibold text-primary mb-4">FAQ</p>
          <p className="sm:text-4xl text-3xl font-extrabold text-base-content">
            Frequently Asked Questions
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqList.map((item, i) => (
            <Item key={i} item={item} />
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
