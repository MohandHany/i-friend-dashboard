export type HelpTicket = {
  id: number;
  name: string;
  title: string;
  description: string;
  attachments: number; // number of attachment images (0 means none)
};

export const mockHelpTickets: HelpTicket[] = [
  {
    id: 500,
    name: "Ahmed Sami Alawadi",
    title: "Login Issue",
    description:
      "I tried logging in multiple times, but the app keeps rejecting my credentials even though I'm sure they're correct. I've already reset my password twice and the issue persists.",
    attachments: 3,
  },
  {
    id: 499,
    name: "Layla Mohamed Khattab",
    title: "Feature Suggestion",
    description:
      "It would be great if the app included a dark mode option to make it easier on the eyes at night. Many users have been requesting this and it would improve usability significantly.",
    attachments: 0,
  },
  {
    id: 498,
    name: "Youssef Emad Morad",
    title: "Slow Loading",
    description:
      "Pages take a very long time to load even though my internet connection is fast. The dashboard in particular takes over 10 seconds to become interactive after logging in.",
    attachments: 1,
  },
  {
    id: 497,
    name: "Mariam Khaled Selim",
    title: "Not Working",
    description:
      "I'm not receiving notifications even though they're enabled in the settings. I've tried reinstalling the app and the issue continues on both my phone and tablet.",
    attachments: 1,
  },
  {
    id: 496,
    name: "Omar Hany Altayeb",
    title: "Question About Subscription",
    description:
      "I'd like to know if there's a way to upgrade my plan from monthly to yearly mid-cycle and whether I'd receive a prorated refund or credit for the remaining days.",
    attachments: 0,
  },
  {
    id: 495,
    name: "Nour Tarek Farouk",
    title: "App Crash",
    description:
      "The app crashes every time I try to open the reports section. I've tried clearing the cache and reinstalling but the problem remains on my Android device.",
    attachments: 2,
  },
  {
    id: 494,
    name: "Sara Ahmed Hassan",
    title: "Payment Failed",
    description:
      "My payment was declined even though my card has sufficient funds and the details are correct. I was charged once but never gained access to the premium features.",
    attachments: 0,
  },
  {
    id: 493,
    name: "Khalid Mahmoud Nasser",
    title: "Account Locked",
    description:
      "My account got locked after a few failed login attempts and I'm unable to unlock it through the standard process. The unlock email is not arriving in my inbox.",
    attachments: 0,
  },
  {
    id: 492,
    name: "Dina Walid Shaker",
    title: "Data Sync Issue",
    description:
      "My data isn't syncing properly between my phone and the web version. Changes made on mobile don't appear on the browser and vice versa, causing a lot of confusion.",
    attachments: 1,
  },
  {
    id: 491,
    name: "Mostafa Ibrahim Zaki",
    title: "Wrong Billing Amount",
    description:
      "I was charged a different amount than what was shown during checkout. The invoice confirms the higher amount but the plan page clearly showed a discounted price for my region.",
    attachments: 2,
  },
  {
    id: 490,
    name: "Hana Fady Mansour",
    title: "Profile Picture Upload",
    description:
      "I'm unable to upload a profile picture. Every time I select an image it shows a generic error message and reverts to the default avatar without any further explanation.",
    attachments: 0,
  },
  {
    id: 489,
    name: "Amr Samir Elsherbiny",
    title: "Language Setting Bug",
    description:
      "The language setting doesn't save when I close and reopen the app. Every session starts back in English regardless of what I selected in the previous session.",
    attachments: 0,
  },
  {
    id: 488,
    name: "Rania Osama Badawi",
    title: "Child Account Access",
    description:
      "I'm having trouble linking my child's account to my parent profile. The QR code scanner doesn't seem to work and the manual code entry always returns an invalid code error.",
    attachments: 1,
  },
  {
    id: 487,
    name: "Tamer Hazem Gouda",
    title: "Report Download",
    description:
      "When I try to download a PDF report, the file downloads but is completely blank. The preview inside the app shows the correct content so the data is there but not exporting properly.",
    attachments: 0,
  },
  {
    id: 486,
    name: "Yasmine Karim Saber",
    title: "Two-Factor Authentication",
    description:
      "I enabled two-factor authentication but stopped receiving the verification codes by SMS. I've confirmed my phone number is correct and my carrier is not blocking messages.",
    attachments: 0,
  },
];
