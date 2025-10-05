const configs = {
  domain: "makeit.guaravvan.com",
  appName: "makeIt",
  description:
    "Reimagine your space and rooms with AI-powered interior design. Get instant, personalized room ideas tailored to your style and needs. Explore countless design possibilities effortlessly, whether you're a homeowner or design pro. Transform your home with a click.",
  auth: {
    signinUrl: `/signin`,
    callbackUrl: "/studio",
  },
  crisp: {
    id: "",
    onlyShowOnRoutes: ["/"],
  },
  r2: {
    bucket: "makeit",
    bucketUrl: "https://makeit-cdn.gauravvan.com",
    cdn: "https://cdn-id.cloudfront.net",
  },
  mailgun: {
    subdomain: "mg",
    fromNoReply: `MakeIt <noreply@mg.makeit.ai>`,
    fromAdmin: `Vincent at MakeIt <vincent@mg.makeit.ai>`,
    supportEmail: "vincent@mg.makeit.ai",
    forwardRepliesTo: "openuniverse.ai@gmail.com",
  },
  colors: {
    main: "#E39C4E",
  },
  pricing: [
    {
      name: "Personal",
      priceId:
        process.env.NODE_ENV === "development"
          ? "price_1Q518uDNglLxTGmdGvr9S31g"
          : "price_1QLnASDNglLxTGmdcTlpehSU",
      yearlyPriceId:
        process.env.NODE_ENV === "development"
          ? "price_1Q51p8DNglLxTGmdckA7kAOv"
          : "price_1QLnASDNglLxTGmdgZQAq7RB",
      price: 29,
      description:
        "Discover your inner designer and create your dream home with our cost-effective, user-friendly software.",
      features: [
        "250 interior images per month",
        "Create up to 4 interior designs in parallel",
        "1GB cloud storage for images",
        "Personal-use only",
        "Small watermark",
      ],
    },
    {
      name: "Pro",
      priceId:
        process.env.NODE_ENV === "development"
          ? "price_1Q51BQDNglLxTGmddR9eTo3t"
          : "price_1QLnAODNglLxTGmdAj7JziXl",
      yearlyPriceId:
        process.env.NODE_ENV === "development"
          ? "price_1Q51swDNglLxTGmdpv7HEXJt"
          : "price_1QLnAODNglLxTGmdU2mNh6LN",
      price: 59,
      description:
        "Brainstorm ideas quickly, impress clients with stunning visuals, and close deals faster using our professional tools.",
      features: [
        "1,000 interior images per month",
        "Create up to 8 interior designs in parallel",
        "5GB cloud storage for images",
        "AI Prompt suggestions",
        "Commercial license",
        "No watermark",
      ],
      popular: true,
    },
    {
      name: "Premium",
      priceId:
        process.env.NODE_ENV === "development"
          ? "price_1Q51ugDNglLxTGmdPFMy97Z4"
          : "price_1QLnADDNglLxTGmdMcJGM8fp",
      yearlyPriceId:
        process.env.NODE_ENV === "development"
          ? "price_1Q51vDDNglLxTGmdUSATlves"
          : "price_1QLnADDNglLxTGmdGdyFnchP",
      price: 99,
      description:
        "Empower your firm with cutting-edge AI technology to enhance efficiency and stay competitive in the market.",
      features: [
        "5,000 interior images per month",
        "Create up to 16 interior designs in parallel",
        "25GB cloud storage for images",
        "AI Prompt suggestions",
        "Commercial license",
        "No watermark",
      ],
    },
  ],
};

export default configs;
