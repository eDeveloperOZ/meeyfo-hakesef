export const glossaryTerms = {
  donation: {
    term: "תרומה",
    short: "כסף או שווה־כסף שניתן למפלגה בהתאם למגבלות הדין.",
    nature: "כסף שהתקבל",
  },
  guarantee: {
    term: "ערבות",
    short: "התחייבות של ערב כלפי מלווה; היא אינה כסף שהמפלגה קיבלה.",
    nature: "התחייבות מותנית",
  },
  exercisedGuarantee: {
    term: "ערבות שמומשה",
    short: "ערבות שהמלווה דרש לממש לאחר שהחוב לא נפרע בהתאם לתנאים.",
    nature: "תשלום מכוח התחייבות",
  },
  bankLoan: {
    term: "הלוואה בנקאית",
    short: "אשראי מבנק שיש להחזיר לפי תנאי ההלוואה.",
    nature: "אשראי",
  },
  publicFunding: {
    term: "מימון ציבורי",
    short: "כספים מאוצר המדינה המחושבים לפי חוק מימון מפלגות.",
    nature: "מימון ציבורי",
  },
  knessetAdvance: {
    term: "הלוואה או מקדמה מהכנסת",
    short: "אשראי או מקדמה על חשבון מימון המגיע לפי החוק.",
    nature: "אשראי או מקדמה",
  },
  membershipFees: {
    term: "דמי חבר",
    short: "תשלומים תקופתיים של חברות וחברי מפלגה בהתאם לכלליה.",
    nature: "כסף שהתקבל",
  },
  debt: {
    term: "חוב",
    short: "סכום שהמפלגה נדרשת לשלם לצד אחר.",
    nature: "חוב",
  },
  liability: {
    term: "התחייבות",
    short: "חיוב כספי קיים או עתידי שנרשם בדיווח הרשמי.",
    nature: "התחייבות",
  },
  repayment: {
    term: "החזר או פירעון",
    short: "תשלום שמקטין הלוואה, חוב או התחייבות קיימת.",
    nature: "יציאת כסף",
  },
} as const;

export type GlossaryTermKey = keyof typeof glossaryTerms;
