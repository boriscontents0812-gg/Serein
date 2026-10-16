import { ProductData } from '../types';

export const productData: ProductData = {
  brandName: "SEREIN",
  brandTagline: "Mindful, heat-free styling rituals designed for modern living.",
  announcementText: "Your softer styling routine starts here",
  
  name: "The Serein Heatless Curl Set",
  subtitle: "Extra-long 60-inch curling rod and accessories",
  eyebrow: "HEATLESS STYLING",
  heroHeadline: "Soft curls, on your own time.",
  heroDescription: "Meet your new at-home styling ritual: an extra-long curling rod designed to wrap around your hair without heated styling tools.",
  lengthSpecification: "60-inch extra-long set · Teal",
  
  availableColor: {
    name: "Teal",
    hex: "#25B6A7",
    description: "Plush velvet exterior with subtle sheen"
  },
  
  // Editable placeholder price (strictly not $16.37 supplier cost)
  defaultPrice: 48.00,
  
  includesNote: "Includes the items shown in the product photos",
  
  includedItems: [
    {
      id: "rod",
      count: "1×",
      title: "60-Inch Extra-Long Curling Rod",
      description: "Generously proportioned with a plush teal velvet exterior and a soft, flexible inner core for comfortable wear."
    },
    {
      id: "scrunchies",
      count: "2×",
      title: "Matching Teal Scrunchies",
      description: "Designed to gently hold hair ends in place without snagging or leaving harsh crease lines."
    },
    {
      id: "clip",
      count: "1×",
      title: "Matte Hair Claw Clip",
      description: "A wide-tooth matte clip to steady the center of the rod at the crown during wrapping."
    },
    {
      id: "pouch",
      count: "1×",
      title: "Velvet Storage Pouch",
      description: "Drawstring travel pouch with delicate champagne ribbon to store your complete set neatly between uses."
    }
  ],

  benefits: [
    {
      title: "Style without heated tools",
      description: "Shapes your hair naturally through gentle mechanical wrapping, letting hair set as it dries without hot plates or blowers.",
      icon: "Sparkles"
    },
    {
      title: "Extra-long 60-inch design",
      description: "Extended length provides plenty of wrapping surface, offering ample space for medium, long, and thicker hair lengths.",
      icon: "Ruler"
    },
    {
      title: "Simple at-home routine",
      description: "Wrap your hair in a few calm minutes and go about your evening, read, sleep, or unwind while your curls take shape.",
      icon: "Clock"
    }
  ],

  detailsSection: {
    headline: "A gentler-feeling way to style",
    subheadline: "Designed for touch, comfort, and unhurried self-care.",
    bodyParagraphs: [
      "The Serein Heatless Curl Set was developed around a quiet observation: modern styling routines often feel rushed, repetitive, and harsh. We designed an extra-long 60-inch rod wrapped in plush, tactile teal velvet that grips sections smoothly without tugging.",
      "Inside, a soft, cushioned core flexes naturally with the contours of your head. Whether wrapped loosely for relaxed, open waves or wrapped more closely for defined curls, the experience remains comfortable and calm from start to finish."
    ],
    specifications: [
      { label: "Curling Rod Length", value: "60 inches (approx. 152 cm)" },
      { label: "Exterior Material", value: "Plush woven velvet in signature Teal" },
      { label: "Core Composition", value: "High-resilience soft cushioned foam" },
      { label: "Included Accessories", value: "2 scrunchies, 1 claw clip, 1 storage pouch" },
      { label: "Care Instructions", value: "Spot clean gently with damp cloth; air dry flat" }
    ]
  },

  lifestyleSection: {
    eyebrow: "THE RITUAL",
    headline: "Make room for a slower styling ritual",
    description: "An intentional evening habit. Wrap your lengths with deliberate ease, secure the ends with soft velvet scrunchies, and wake up to effortless movement. No cords, no waiting for plates to heat, no rush.",
    quote: "Beauty doesn't need to be loud to be transformative. When we remove heat from our routine, we make room for ease.",
    author: "Serein Beauty Studio"
  },

  howItWorksSteps: [
    {
      step: "01",
      number: "1",
      title: "Lightly damp hair",
      description: "Start with freshly washed, roughly 80% dry hair, or mist dry lengths lightly with water for responsive shaping.",
      tip: "Hair should feel cool and pliable, not soaking wet."
    },
    {
      step: "02",
      number: "2",
      title: "Position and secure",
      description: "Center the 60-inch curling rod across the top of your head. Use the claw clip at the crown to temporarily hold it in place.",
      tip: "Even rod distribution makes wrapping both sides symmetrical."
    },
    {
      step: "03",
      number: "3",
      title: "Wrap sections of hair",
      description: "Beginning at the front hairline, wrap small-to-medium sections around the rod away from your face, gathering more hair as you work down.",
      tip: "Wrap tighter for defined curls, or looser for soft beach waves."
    },
    {
      step: "04",
      number: "4",
      title: "Secure the ends",
      description: "Fasten each side with a matching teal scrunchie at the ends. Remove the crown claw clip once hair is securely tied.",
      tip: "Leave in place for 4 to 6 hours or overnight until hair is completely dry."
    },
    {
      step: "05",
      number: "5",
      title: "Unwrap and style",
      description: "Gently remove the scrunchies and slide the rod upward to release your curls. Lightly finger-comb to blend and separate waves.",
      tip: "Finish with a drop of hair oil if desired for added shine."
    }
  ],

  faqs: [
    {
      id: "use",
      question: "How do I use the heatless curling rod?",
      answer: "Center the rod over the crown of your head, secure it with the included claw clip, and wrap sections of slightly damp hair around each side moving downward. Fasten the ends with the matching scrunchies, remove the top clip, and leave the set in place until hair is fully dry."
    },
    {
      id: "moisture",
      question: "Should my hair be wet or dry?",
      answer: "We recommend lightly damp hair—roughly 80% dry after washing—or dry hair lightly misted with clean water. Hair sets as it transitions from damp to dry, creating natural hold without heat. Completely soaked hair will take significantly longer to dry."
    },
    {
      id: "included",
      question: "What comes in the set?",
      answer: "Each Serein set includes one extra-long 60-inch teal velvet curling rod, two matching teal scrunchies, one matte hair claw clip, and a drawstring velvet travel pouch. All items shown in the product photos are included."
    },
    {
      id: "price",
      question: "Is the price shown the final retail price?",
      answer: "The price displayed on the store reflects our set direct retail price. It covers the full 4-piece set and custom packaging. Taxes and destination-specific shipping rates (if applicable) are calculated transparently during checkout."
    },
    {
      id: "shipping",
      question: "Where can I find shipping and return details?",
      answer: "Orders are processed within 1 to 2 business days. We provide tracking updates for all deliveries. For hygiene reasons, curling sets in opened inner packaging are subject to our standard wellness return policy. Visit our Shipping & Returns links in the footer for full policy terms."
    }
  ],

  images: [
    {
      id: "hero",
      src: "/images/product-hero.jpg",
      alt: "The Serein Heatless Curl Set - Extra-long 60-inch teal velvet curling rod in elegant curve",
      label: "Curling Rod"
    },
    {
      id: "accessories",
      src: "/images/product-accessories.jpg",
      alt: "The Serein Complete Set - 60-inch rod, two scrunchies, matte claw clip, and velvet travel pouch",
      label: "What's Included"
    },
    {
      id: "macro",
      src: "/images/product-macro.jpg",
      alt: "Macro texture detail of the rich teal velvet fabric, fine stitching, and Serein brand signature",
      label: "Velvet Detail"
    }
  ]
};
