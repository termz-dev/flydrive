import type { Metadata } from "next";
import { LegalPage } from "@/ui/LegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Flydrive's privacy notice. Awaiting legal approval.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy notice"
      sections={[
        {
          id: "who",
          heading: "Who we are",
          covers: "Flydrive's legal name, registration and address.",
        },
        {
          id: "what",
          heading: "What we collect",
          covers:
            "Account and booking details, vehicle details, driver application and verification information, payment references, handover notes and support messages.",
        },
        {
          id: "why",
          heading: "Why we use it",
          covers: "The purpose and lawful basis for each category.",
        },
        {
          id: "share",
          heading: "Who we share it with",
          covers: "Payment, screening, messaging and hosting providers, and what each receives.",
        },
        {
          id: "keep",
          heading: "How long we keep it",
          covers: "The retention period for each category.",
        },
        {
          id: "rights",
          heading: "Your rights",
          covers:
            "How to access, correct or delete your data, object to its use, or complain under Nigerian data protection law.",
        },
        { id: "contact", heading: "Contact", covers: "Our data protection contact." },
      ]}
    />
  );
}
