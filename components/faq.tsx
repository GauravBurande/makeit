import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqList = [
  {
    question: "Can I use these designs for my business?",
    answer:
      "Definitely! If you've got a paid subscription that covers commercial use, you’re good to go. Just make sure your usage fits within the terms of your plan.",
  },
  {
    question: "What should I provide to get the best design results?",
    answer:
      "Whether you’re redesigning an existing space or starting fresh, the more details you share, the better. You can upload photos with a good quality and resolution which will help generate the best results. We'll take care of the rest!",
  },
  {
    question: "Do I still need an interior designer?",
    answer:
      "MakeIt.ai is super versatile and might be all you need. But if your project is more complex, an interior designer could bring extra value. We like to think of it as AI and designers working hand-in-hand.",
  },
  {
    question: "Is my payment secure?",
    answer:
      "Absolutely. We use Stripe to process payments, so your info is safe and sound. Stripe is a top-notch payment processor known for its security.",
  },
  {
    question: "How do you handle my data and privacy?",
    answer:
      "We take your privacy seriously and keep your uploads confidential. We won’t share anything without your permission, and we stick to strict data protection practices. You can check out our Privacy Policy for more details.",
  },
  {
    question: "How can I change the color scheme of my room with MakeIt.ai?",
    answer:
      "It’s easy! You can pick from our color palettes or create your own. The AI will show you how the colors look in your room, so you can play around before deciding.",
  },
  {
    question: "Can MakeIt.ai help me arrange my furniture?",
    answer:
      "Yep, our AI can suggest furniture layouts based on your room’s shape and size. You can try different setups and see how they work with the overall design.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit and debit cards, plus a few digital payment options. All payments go through Stripe, so they’re secure and reliable.",
  },
  // {
  //   question: "What if I’m not happy with the service? Can I get a refund?",
  //   answer:
  //     "We want you to be satisfied with MakeIt.ai. If you’re not, reach out to our support team. Refunds are handled case by case, according to our policy.",
  // },
];

const Item = ({ item }: { item: any }) => {
  return (
    <AccordionItem value={item}>
      <AccordionTrigger className="text-start">
        {item?.question}
      </AccordionTrigger>
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
