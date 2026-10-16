export interface ProductImage {
  id: string;
  src: string;
  alt: string;
  label: string;
}

export interface IncludedItem {
  id: string;
  title: string;
  description: string;
  count: string;
}

export interface HowItWorksStep {
  step: string;
  number: string;
  title: string;
  description: string;
  tip?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  length: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
}

export interface ProductData {
  brandName: string;
  brandTagline: string;
  announcementText: string;
  name: string;
  subtitle: string;
  eyebrow: string;
  heroHeadline: string;
  heroDescription: string;
  lengthSpecification: string;
  availableColor: {
    name: string;
    hex: string;
    description: string;
  };
  defaultPrice: number;
  includesNote: string;
  includedItems: IncludedItem[];
  benefits: {
    title: string;
    description: string;
    icon: string;
  }[];
  detailsSection: {
    headline: string;
    subheadline: string;
    bodyParagraphs: string[];
    specifications: { label: string; value: string }[];
  };
  lifestyleSection: {
    eyebrow: string;
    headline: string;
    description: string;
    quote: string;
    author: string;
  };
  howItWorksSteps: HowItWorksStep[];
  faqs: FAQItem[];
  images: ProductImage[];
}
