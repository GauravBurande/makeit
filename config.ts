const configs = {
  domain: "makeit.ai",
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
    bucket: "bucket-name",
    bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
    cdn: "https://cdn-id.cloudfront.net/",
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
};

export default configs;
