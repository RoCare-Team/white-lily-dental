/**
 * FALLBACK ONLY — this is not what the website reads.
 *
 * Live content lives in MongoDB and is edited at /admin. This file is served
 * only when its collection is empty or the database is unreachable, so the
 * site never renders a blank section. Editing a value here will NOT change the
 * website; change it in the admin panel instead.
 */
const img = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

export const posts = [
  {
    slug: "how-often-should-you-visit-the-dentist",
    title: "How Often Should You Really Visit the Dentist?",
    excerpt:
      "Once a year, twice a year, or only when something hurts? Here is how to work out the right recall interval for your own mouth.",
    category: "Preventive Care",
    readTime: "5 min read",
    date: "2026-01-18",
    dateLabel: "18 January 2026",
    image: img("1489278353717-f64c6ee8a4d2"),
    imageAlt: "Dentist carrying out a routine check-up on a patient in a dental clinic",
    body: [
      {
        heading: "The standard advice, and why it is only a starting point",
        paragraphs: [
          "Most people are told to see a dentist every six months. That interval is a sensible default, but it was never meant to apply identically to everyone. What actually matters is your individual risk of decay and gum disease.",
          "A patient with no fillings, healthy gums and good home care may safely be seen once a year. A patient with a history of gum disease, several restorations or poorly controlled diabetes may need to be seen every three months.",
        ],
      },
      {
        heading: "Signs you should not wait for your next appointment",
        paragraphs: [
          "Book sooner if your gums bleed when you brush, if you have persistent sensitivity to hot or cold, if a tooth hurts when you bite, or if you notice a bad taste or persistent bad breath.",
          "Pain is a late symptom in dentistry. Decay is usually well established by the time it hurts, which is precisely why routine visits are worth keeping.",
        ],
      },
      {
        heading: "What a good check-up actually includes",
        paragraphs: [
          "A proper examination is more than a quick look. It should include a tooth-by-tooth check, gum and pocket assessment, screening of the soft tissues, a review of your bite, and digital X-rays where clinically indicated.",
          "At White Lily Dental we compare each visit against your previous records, which is how small changes get spotted while they are still cheap and simple to treat.",
        ],
      },
    ],
  },
  {
    slug: "braces-vs-clear-aligners",
    title: "Braces vs Clear Aligners: Which One Is Right for You?",
    excerpt:
      "Both straighten teeth. They differ in what they can correct, how visible they are, and how much discipline they demand from you.",
    category: "Orthodontics",
    readTime: "6 min read",
    date: "2026-02-06",
    dateLabel: "6 February 2026",
    image: img("1595152772835-219674b2a8a6"),
    imageAlt: "Patient comparing clear aligners and fixed braces during an orthodontic consultation",
    body: [
      {
        heading: "What each option does well",
        paragraphs: [
          "Fixed braces work on every kind of case, including severe crowding, rotations and skeletal bite problems. Because they are bonded to the teeth, they work continuously without depending on you.",
          "Clear aligners are excellent for mild to moderate crowding, spacing and relapse after previous orthodontic treatment. They are nearly invisible and removable, which suits adults in client-facing work.",
        ],
      },
      {
        heading: "The compliance question",
        paragraphs: [
          "Aligners must be worn 20 to 22 hours a day. If they sit in a drawer, nothing moves. Patients who know they will not keep to that are usually better served by fixed braces.",
          "Braces demand less discipline but more care with cleaning, since food traps around brackets and wires.",
        ],
      },
      {
        heading: "How we decide",
        paragraphs: [
          "At your orthodontic consultation we take photographs, X-rays and a full clinical assessment, then tell you honestly which appliance will give the better result for your specific case — and what each would cost.",
          "Some cases are best treated with a combination: a short phase of fixed braces to handle difficult movements, followed by aligners to finish.",
        ],
      },
    ],
  },
  {
    slug: "what-to-expect-after-a-tooth-extraction",
    title: "What to Expect After a Tooth Extraction",
    excerpt:
      "A clear day-by-day guide to healing after an extraction — including the one mistake that causes most dry sockets.",
    category: "Oral Surgery",
    readTime: "4 min read",
    date: "2026-02-27",
    dateLabel: "27 February 2026",
    image: img("1606811856475-5e6fcdc6e509"),
    imageAlt: "Dentist giving post-extraction aftercare instructions to a patient",
    body: [
      {
        heading: "The first 24 hours",
        paragraphs: [
          "Bite firmly on the gauze pad for 30 to 45 minutes to let a clot form. Some oozing during the first few hours is normal. Apply a cold compress to the outside of your cheek in 15-minute cycles to limit swelling.",
          "Do not rinse forcefully, spit, smoke or use a straw during this period. The suction and pressure can dislodge the clot and cause a dry socket, which is considerably more painful than the extraction itself.",
        ],
      },
      {
        heading: "Days two to seven",
        paragraphs: [
          "Start gentle warm salt-water rinses after 24 hours. Keep brushing the rest of your mouth normally but stay away from the socket for a few days. Stick to soft, lukewarm food and avoid chewing on that side.",
          "Swelling usually peaks around 48 hours and then improves. Take prescribed medication as directed rather than waiting for pain to build.",
        ],
      },
      {
        heading: "When to call us",
        paragraphs: [
          "Contact the clinic if bleeding does not settle, if pain increases sharply after day three, if you develop a fever, or if you cannot open your mouth properly.",
          "We review every surgical extraction patient afterwards, and our counsellor follows up during the healing period.",
        ],
      },
    ],
  },
  {
    slug: "are-dental-implants-worth-it",
    title: "Are Dental Implants Worth the Cost?",
    excerpt:
      "Implants cost more upfront than a bridge or denture. Here is how the maths actually works out over ten and twenty years.",
    category: "Implantology",
    readTime: "6 min read",
    date: "2026-03-20",
    dateLabel: "20 March 2026",
    image: img("1739902526173-06750b78cfb7"),
    imageAlt: "Dental implant model on a clinical table used to explain treatment to patients",
    body: [
      {
        heading: "What you are actually paying for",
        paragraphs: [
          "An implant fee covers surgical planning and imaging, the implant fixture itself, the abutment, and a custom crown — plus the follow-up appointments in between. Cheaper quotes usually leave one of these out.",
          "The implant system matters. Established systems keep components available for decades, which means a crown can be replaced years later without replacing the implant.",
        ],
      },
      {
        heading: "The comparison over time",
        paragraphs: [
          "A conventional bridge requires trimming two healthy teeth and typically needs replacing every 10 to 15 years — and each replacement puts those supporting teeth at further risk.",
          "An implant leaves neighbouring teeth untouched and routinely lasts 15 to 25 years or more. It also preserves the bone in the gap, which a bridge or denture does not.",
        ],
      },
      {
        heading: "When an implant is not the right answer",
        paragraphs: [
          "Insufficient bone, uncontrolled diabetes, heavy smoking or active gum disease all need addressing first. Sometimes a bridge or a well-made partial denture genuinely is the better choice.",
          "We will tell you when that is the case. Our consultation is a diagnosis, not a sales appointment.",
        ],
      },
    ],
  },
  {
    slug: "bleeding-gums-what-they-mean",
    title: "Bleeding Gums Are Not Normal — Here's What They Mean",
    excerpt:
      "Blood in the sink when you brush is the earliest warning sign of gum disease, and it is almost entirely reversible at this stage.",
    category: "Gum Health",
    readTime: "5 min read",
    date: "2026-04-10",
    dateLabel: "10 April 2026",
    image: img("1593022356769-11f762e25ed9"),
    imageAlt: "Dental hygienist performing a professional scaling procedure on a patient",
    body: [
      {
        heading: "Why gums bleed",
        paragraphs: [
          "Plaque left along the gum line hardens into calculus, which irritates the gum tissue. The body responds with inflammation, and inflamed tissue bleeds when touched. That is gingivitis.",
          "Many people respond by brushing that area less, which makes the problem worse. The correct response is to clean the area more carefully, and to have the hardened deposits professionally removed.",
        ],
      },
      {
        heading: "What happens if you ignore it",
        paragraphs: [
          "Untreated gingivitis progresses to periodontitis, where the bone supporting the teeth is destroyed. Bone loss does not reverse. Teeth loosen, gaps open up, and eventually teeth are lost.",
          "Gum disease is the leading cause of adult tooth loss in India, and it is largely painless until it is advanced.",
        ],
      },
      {
        heading: "The good news",
        paragraphs: [
          "Caught at the gingivitis stage, treatment is straightforward: a professional scaling, a corrected brushing and interdental cleaning technique, and the bleeding stops within a week or two.",
          "Book a gum assessment if your gums bleed, look red or swollen, or if you have noticed recession.",
        ],
      },
    ],
  },
  {
    slug: "childrens-first-dental-visit",
    title: "Your Child's First Dental Visit: A Parent's Guide",
    excerpt:
      "When to bring your child in, what happens at the appointment, and how to make sure they are not scared of dentists for life.",
    category: "Paediatric Dentistry",
    readTime: "4 min read",
    date: "2026-05-08",
    dateLabel: "8 May 2026",
    image: img("1497486443155-158cceb6629a"),
    imageAlt: "Child having a friendly first dental check-up with a dentist",
    body: [
      {
        heading: "When to come in",
        paragraphs: [
          "Bring your child by their first birthday, or within six months of the first tooth appearing. The visit is short, gentle and mostly about familiarisation.",
          "Early visits are not about treatment. They are about making the clinic an ordinary, unthreatening place before anything ever needs doing.",
        ],
      },
      {
        heading: "What we do at the appointment",
        paragraphs: [
          "We count the teeth, check for early decay, look at how the jaws are developing, and demonstrate brushing on your child. Fluoride application and pit-and-fissure sealants follow as the permanent molars erupt.",
          "Sealants are one of the most effective preventive measures available — a thin coating in the deep grooves of back teeth that keeps plaque and food out.",
        ],
      },
      {
        heading: "How parents can help",
        paragraphs: [
          "Avoid using the dentist as a threat, and avoid words like 'pain', 'injection' or 'drill' beforehand — even in reassurance. Describe the visit as counting teeth.",
          "Book morning appointments when children are rested, and let them watch a sibling or parent have a check-up first if possible.",
        ],
      },
    ],
  },
];

export function getPost(slug) {
  return posts.find((p) => p.slug === slug);
}
