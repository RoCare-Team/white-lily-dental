import {
  Smile,
  Bone,
  Sparkles,
  Activity,
  Crown,
  Layers,
  Scissors,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

const img = (id, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const services = [
  {
    slug: "braces-treatment",
    accent: { bg: "#E8F0FC", fg: "#1668C7" },
    title: "Braces Treatment",
    menuTitle: "Braces Treatment",
    icon: Smile,
    excerpt:
      "Metal, ceramic and self-ligating braces planned by an MDS orthodontist to correct crowding, gaps and bite problems.",
    image: img("1595152772835-219674b2a8a6"),
    imageAlt: "Young patient smiling after orthodontic braces treatment in Gurugram",
    seoTitle: "Braces Treatment in Gurugram | Orthodontist at White Lily Dental",
    seoDescription:
      "Metal, ceramic, self-ligating and lingual braces in Gurugram. Treatment planned by MDS orthodontist Dr. Deepak Tomar at White Lily Dental, Sector 69 & Sector 77.",
    intro:
      "Straighten crowded, spaced or misaligned teeth with braces planned and monitored by an MDS orthodontist at our Sector 69 and Sector 77 clinics in Gurugram.",
    overview: [
      "Braces are the most predictable way to correct crowding, spacing, protruding front teeth and bite problems at almost any age. At White Lily Dental, every orthodontic case begins with a full diagnostic record — clinical examination, digital X-rays and photographs — before a treatment plan is finalised.",
      "Dr. Deepak Tomar, MDS Orthodontics, plans each case personally and reviews progress at every adjustment visit, so you always know how much movement has happened and how much time is left.",
    ],
    whatIsIt: {
      heading: "What is braces treatment?",
      body: [
        "Braces are fixed appliances made of small brackets bonded to each tooth and connected by an archwire. The archwire applies gentle, continuous pressure that guides teeth into their correct positions over several months.",
        "We offer metal braces, tooth-coloured ceramic braces, self-ligating braces that need fewer adjustment visits, and lingual braces fitted behind the teeth for patients who want a completely hidden option.",
      ],
    },
    whoNeeds: {
      heading: "Who needs braces?",
      items: [
        "Crowded, overlapping or rotated teeth",
        "Gaps and spacing between teeth",
        "Protruding or forwardly placed front teeth",
        "Overbite, underbite, crossbite or open bite",
        "Difficulty cleaning teeth because of alignment",
        "Jaw discomfort or uneven wear caused by an incorrect bite",
      ],
    },
    benefits: [
      { title: "Correctly aligned smile", desc: "Predictable, permanent correction of crowding, gaps and rotations." },
      { title: "Healthier bite", desc: "Even biting forces reduce enamel wear and jaw joint strain." },
      { title: "Easier cleaning", desc: "Straight teeth are far simpler to brush and floss, lowering decay and gum disease risk." },
      { title: "Options to suit you", desc: "Ceramic, self-ligating and lingual braces for patients who want discretion." },
    ],
    process: [
      { title: "Orthodontic consultation", desc: "Clinical assessment, digital X-rays, photographs and discussion of your concerns." },
      { title: "Treatment plan & options", desc: "You receive the expected duration, appliance options and a clear cost breakdown." },
      { title: "Bonding the braces", desc: "Brackets are bonded and the first archwire is placed — usually a single 60–90 minute visit." },
      { title: "Adjustment visits", desc: "Wires are changed every 4–8 weeks as your teeth move into position." },
      { title: "Debonding & retainers", desc: "Braces are removed and retainers are fitted to hold the new alignment permanently." },
    ],
    whyUs: [
      "Treatment planned and reviewed by an MDS orthodontist, not a general dentist",
      "Metal, ceramic, self-ligating and lingual options in one clinic",
      "Digital records and photographs at every stage so progress is visible",
      "No-cost EMI options available on longer orthodontic plans",
    ],
    faqs: [
      { q: "How long does braces treatment take?", a: "Most cases at White Lily Dental take 12 to 24 months. Mild crowding or spacing can finish sooner; skeletal bite corrections take longer. You will be given a realistic estimate at your first consultation." },
      { q: "Is there an age limit for braces?", a: "No. Orthodontic treatment works at any age as long as your gums and supporting bone are healthy. We routinely treat teenagers and adults in their thirties, forties and beyond." },
      { q: "Are braces painful?", a: "Bonding the braces is not painful. You can expect mild soreness for two to three days after fitting and after each wire change, which usually settles with a soft diet and ordinary pain relief." },
      { q: "Will I need to wear a retainer afterwards?", a: "Yes. Retainers are essential — teeth naturally drift back if they are not held in place. We provide fixed and removable retainers and review them at follow-up visits." },
    ],
    related: ["cosmetic-dentistry", "preventive-dental-treatments", "gums-treatment"],
  },
  {
    slug: "dental-implants",
    iconImage: "/2.webp",
    accent: { bg: "#E4F5F0", fg: "#0E9384" },
    title: "Dental Implants",
    menuTitle: "Dental Implants",
    icon: Bone,
    excerpt:
      "Titanium implants that replace missing teeth permanently, restoring natural bite strength and appearance.",
    image: img("1606811971618-4486d14f3f99"),
    imageAlt: "Dental implant model being explained to a patient at a dental clinic in Gurugram",
    seoTitle: "Dental Implants in Gurugram | Permanent Tooth Replacement",
    seoDescription:
      "Single tooth, multiple and full-arch dental implants in Gurugram by a certified implantologist. OSSTEM implant systems at White Lily Dental, Sector 69 & Sector 77.",
    intro:
      "A dental implant replaces the root of a missing tooth with a titanium post, giving you a fixed replacement tooth that looks, feels and functions like the original.",
    overview: [
      "Missing teeth do more than affect appearance. The bone beneath a gap shrinks over time, neighbouring teeth drift, and chewing efficiency drops. Implants are the only replacement option that stops this bone loss because they transmit chewing forces into the jaw the way a natural root does.",
      "White Lily Dental places single implants, multiple implants and full-arch implant-supported bridges using established implant systems including OSSTEM. Cases are planned by Dr. Deepak Tomar, a certified implantologist.",
    ],
    whatIsIt: {
      heading: "What is a dental implant?",
      body: [
        "An implant is a small, biocompatible titanium screw placed into the jawbone in the position of the missing tooth root. Over the following weeks the bone fuses to its surface — a process called osseointegration.",
        "Once the implant is stable, an abutment and a custom ceramic or zirconia crown are fitted on top. The finished tooth is fixed, cannot be removed, and is cleaned exactly like a natural tooth.",
      ],
    },
    whoNeeds: {
      heading: "Who needs dental implants?",
      items: [
        "One or more missing or extracted teeth",
        "A failing tooth that cannot be saved by root canal treatment",
        "Loose or uncomfortable dentures that need stabilising",
        "Patients who do not want healthy neighbouring teeth trimmed for a bridge",
        "Complete tooth loss in one or both jaws",
      ],
    },
    benefits: [
      { title: "Permanent replacement", desc: "A well-maintained implant can last for decades — the closest option to a natural tooth." },
      { title: "Protects your jawbone", desc: "Implants transmit chewing load into the bone and prevent the bone loss that follows extraction." },
      { title: "No damage to other teeth", desc: "Unlike a bridge, adjacent healthy teeth are left completely untouched." },
      { title: "Natural bite and speech", desc: "Full chewing strength returns, and nothing slips or clicks while you speak." },
    ],
    process: [
      { title: "Assessment & imaging", desc: "Clinical examination and X-ray or CBCT imaging to measure available bone and plan the position." },
      { title: "Implant placement", desc: "The titanium implant is placed under local anaesthesia in a short, comfortable appointment." },
      { title: "Healing & osseointegration", desc: "The bone fuses to the implant over roughly 3–6 months, with review visits in between." },
      { title: "Abutment & impressions", desc: "The healing abutment is placed and digital or conventional impressions are recorded." },
      { title: "Final crown fitted", desc: "Your custom crown is fitted, the bite is checked and maintenance is explained." },
    ],
    whyUs: [
      "Placed by a certified implantologist with in-house surgical support",
      "Established implant systems including OSSTEM, with documented components",
      "Radiographic planning before surgery — no guesswork on implant position",
      "Dedicated patient counsellor for post-treatment follow-up and aftercare",
    ],
    faqs: [
      { q: "Is dental implant surgery painful?", a: "The procedure is carried out under local anaesthesia, so you feel pressure but no pain. Most patients describe mild discomfort for a day or two afterwards, comparable to an extraction." },
      { q: "How long do dental implants last?", a: "With good oral hygiene, regular check-ups and healthy gums, implants routinely last 15–25 years or longer. The crown on top may need replacement sooner than the implant itself." },
      { q: "Am I too old for an implant?", a: "There is no upper age limit. What matters is general health, gum health and adequate bone. We assess these before recommending treatment." },
      { q: "What if I don't have enough bone?", a: "Bone grafting or a sinus lift can rebuild the site so an implant can be placed safely. This is assessed from your CBCT scan and explained before treatment begins." },
    ],
    related: ["crowns-and-bridges", "dentures", "simple-tooth-removal"],
  },
  {
    slug: "cosmetic-dentistry",
    iconImage: "/oRnservice3.webp",
    accent: { bg: "#FBEFE2", fg: "#C2761A" },
    title: "Cosmetic Dentistry",
    menuTitle: "Cosmetic Dentistry",
    icon: Sparkles,
    excerpt:
      "Veneers, teeth whitening, smile design and tooth-coloured restorations for a natural, confident smile.",
    image: img("1567516364473-233c4b6fcfbe"),
    imageAlt: "Close-up of a bright natural smile after cosmetic dentistry treatment",
    seoTitle: "Cosmetic Dentistry in Gurugram | Veneers, Whitening & Smile Design",
    seoDescription:
      "Smile design, porcelain veneers, professional teeth whitening and tooth-coloured restorations in Gurugram at White Lily Dental, Sector 69 & Sector 77.",
    intro:
      "Cosmetic dentistry at White Lily Dental focuses on natural-looking results — improving colour, shape and proportion without making your smile look artificial.",
    overview: [
      "A smile makeover is not one procedure. Depending on what bothers you, the plan may combine whitening, veneers, tooth-coloured fillings, gum contouring or alignment correction.",
      "Dr. Meenakshi Singh, MDS Prosthodontics, plans cosmetic cases using shade matching and digital smile planning so you can see the intended outcome before any irreversible work begins.",
    ],
    whatIsIt: {
      heading: "What does cosmetic dentistry include?",
      body: [
        "Cosmetic dentistry covers any treatment that improves the appearance of your teeth and gums: professional whitening for staining, porcelain or composite veneers for chipped and discoloured front teeth, tooth-coloured composite bonding for small defects, and gum contouring for a gummy smile.",
        "It often overlaps with restorative work — a discoloured, heavily filled front tooth may be better treated with a ceramic crown than a veneer, and we will always tell you which option lasts longer.",
      ],
    },
    whoNeeds: {
      heading: "Who is cosmetic dentistry for?",
      items: [
        "Stained, yellowed or discoloured teeth",
        "Chipped, worn or uneven front teeth",
        "Small gaps between the front teeth",
        "A gummy smile or uneven gum line",
        "Old, visible metal or discoloured fillings",
        "Anyone preparing for a wedding, interview or major event",
      ],
    },
    benefits: [
      { title: "Natural-looking results", desc: "Shade matching and careful proportioning so the result never looks fake." },
      { title: "Fast improvements", desc: "Whitening and composite bonding can transform a smile in one or two visits." },
      { title: "Minimally invasive options", desc: "Where possible we choose treatments that preserve maximum natural tooth structure." },
      { title: "Stronger front teeth", desc: "Veneers and ceramic restorations protect worn or chipped teeth as well as improving looks." },
    ],
    process: [
      { title: "Smile consultation", desc: "We photograph your smile and discuss exactly what you would like changed." },
      { title: "Digital smile planning", desc: "Shade, shape and proportion are planned and shown to you before treatment." },
      { title: "Preparation", desc: "Minimal tooth preparation where veneers or crowns are involved, with temporaries fitted." },
      { title: "Try-in & refinement", desc: "The final restorations are tried in and adjusted for fit, bite and colour." },
      { title: "Final bonding & review", desc: "Restorations are bonded permanently and reviewed after a short healing period." },
    ],
    whyUs: [
      "Cases planned by an MDS prosthodontist specialising in smile design",
      "Shade matching under proper clinical lighting for accurate colour",
      "In-house coordination between orthodontics and prosthodontics when alignment is a factor",
      "Honest advice on what will and will not last — no over-treatment",
    ],
    faqs: [
      { q: "Does teeth whitening damage enamel?", a: "Professional whitening performed in a clinic does not damage enamel. Sensitivity for a day or two is common and settles on its own. Over-the-counter kits used incorrectly are the more common cause of problems." },
      { q: "How long do veneers last?", a: "Well-made porcelain veneers typically last 10–15 years with good hygiene and no habits such as nail biting or grinding. Composite veneers last less time but are easier to repair." },
      { q: "Will my whitened teeth stay white?", a: "Results last one to three years depending on tea, coffee, tobacco and staining foods. Occasional top-up sessions maintain the shade." },
      { q: "Can cosmetic treatment fix crooked teeth?", a: "Mildly uneven teeth can be improved with veneers. Genuine crowding is better corrected with braces or aligners first — we will tell you honestly which route suits your case." },
    ],
    related: ["braces-treatment", "crowns-and-bridges", "preventive-dental-treatments"],
  },
  {
    slug: "root-canal-treatment",
    iconImage: "/Ntxservice4.webp",
    accent: { bg: "#E4F1F6", fg: "#0E7CA0" },
    title: "Root Canal Treatment",
    menuTitle: "Root Canal Treatment",
    icon: Activity,
    excerpt:
      "Painless single and multi-visit RCT that saves infected teeth instead of removing them.",
    image: img("1598256989800-fe5f95da9787"),
    imageAlt: "Dentist performing a root canal treatment on a patient in a modern dental clinic",
    seoTitle: "Root Canal Treatment in Gurugram | Painless RCT at White Lily Dental",
    seoDescription:
      "Painless single-visit and multi-visit root canal treatment in Gurugram using rotary endodontics. Save infected teeth at White Lily Dental, Sector 69 & Sector 77.",
    intro:
      "Root canal treatment removes infection from inside a tooth and saves it — so you keep your natural tooth instead of losing it to extraction.",
    overview: [
      "Deep decay, a crack or trauma can allow bacteria to reach the pulp — the nerve and blood supply at the centre of a tooth. The result is severe pain, sensitivity to heat, swelling or an abscess.",
      "Root canal treatment cleans the infected canals, disinfects them and seals them. Performed with rotary instruments and proper isolation, the procedure is comfortable and highly predictable.",
    ],
    whatIsIt: {
      heading: "What is root canal treatment?",
      body: [
        "The dentist numbs the tooth, makes a small access opening, and removes the infected pulp tissue from each canal. The canals are shaped and cleaned with rotary files and irrigating solutions, then filled with a biocompatible material and sealed.",
        "Because a root-treated tooth becomes more brittle, a crown is almost always recommended afterwards — particularly on back teeth that carry heavy chewing load.",
      ],
    },
    whoNeeds: {
      heading: "When do you need a root canal?",
      items: [
        "Severe, lingering toothache — especially at night",
        "Prolonged sensitivity to hot or cold",
        "Pain on biting or chewing",
        "Swelling of the gum or face near a tooth",
        "A darkened or discoloured tooth after an injury",
        "A deep cavity or a cracked, broken tooth",
      ],
    },
    benefits: [
      { title: "Saves your natural tooth", desc: "Keeping the tooth avoids the cost and bone loss that follow an extraction." },
      { title: "Immediate pain relief", desc: "Removing the infected pulp resolves the pain the infection was causing." },
      { title: "Stops the infection spreading", desc: "Prevents abscess formation and damage to surrounding bone." },
      { title: "Restores normal chewing", desc: "With a crown on top, the tooth returns to full function." },
    ],
    process: [
      { title: "Diagnosis & X-ray", desc: "Clinical tests and a periapical X-ray confirm the diagnosis and canal anatomy." },
      { title: "Anaesthesia & isolation", desc: "The tooth is fully numbed and isolated to keep the field clean and dry." },
      { title: "Cleaning & shaping", desc: "Infected pulp is removed and canals are cleaned with rotary instruments and irrigation." },
      { title: "Filling & sealing", desc: "Canals are filled and sealed, and the access cavity is closed." },
      { title: "Crown placement", desc: "A crown is fitted to protect the treated tooth from fracture." },
    ],
    whyUs: [
      "Rotary endodontics for faster, more thorough canal cleaning",
      "Single-visit RCT possible in many uncomplicated cases",
      "Digital X-rays with low radiation exposure at every stage",
      "Crowns fabricated in-house alongside the RCT, so treatment is completed in one place",
    ],
    faqs: [
      { q: "Is root canal treatment painful?", a: "No. The tooth is fully anaesthetised, so the procedure itself is painless — most patients say it feels like having a filling. The pain people associate with root canals is the infection beforehand, not the treatment." },
      { q: "How many visits does an RCT take?", a: "Many uncomplicated teeth can be completed in a single visit. Teeth with active infection, abscess or complex canal anatomy usually need two or three visits." },
      { q: "Do I really need a crown after a root canal?", a: "For back teeth, yes. A root-treated tooth is more brittle and can fracture under chewing load. A crown significantly improves long-term survival." },
      { q: "Is extraction cheaper than a root canal?", a: "Extraction costs less initially, but replacing the missing tooth with an implant or bridge later costs considerably more. Saving the natural tooth is usually the better long-term decision." },
    ],
    related: ["crowns-and-bridges", "dental-implants", "simple-tooth-removal"],
  },
  {
    slug: "crowns-and-bridges",
    iconImage: "/L1uservice5.webp",
    accent: { bg: "#F7EFDD", fg: "#A8801F" },
    title: "Crowns and Bridges",
    menuTitle: "Crowns and Bridges",
    icon: Crown,
    excerpt:
      "Zirconia, ceramic and metal-ceramic crowns and bridges that rebuild damaged or missing teeth.",
    image: img("1643660526741-094639fbe53a"),
    imageAlt: "Dental technician matching the shade of a ceramic crown for a patient",
    seoTitle: "Dental Crowns & Bridges in Gurugram | Zirconia & Ceramic Caps",
    seoDescription:
      "Zirconia, E-max and metal-ceramic crowns and bridges in Gurugram. Restore broken, root-treated or missing teeth at White Lily Dental, Sector 69 & Sector 77.",
    intro:
      "Crowns rebuild a badly damaged tooth; bridges replace a missing tooth by anchoring to the teeth on either side. Both are planned by our MDS prosthodontist.",
    overview: [
      "A crown — commonly called a cap — covers the entire visible part of a tooth to restore its shape, strength and appearance. A bridge uses two or more crowns to carry a replacement tooth across a gap.",
      "We work with zirconia, E-max lithium disilicate and metal-ceramic materials, chosen according to the position of the tooth, the bite forces it carries and how visible it is when you smile.",
    ],
    whatIsIt: {
      heading: "What are crowns and bridges?",
      body: [
        "To fit a crown, the tooth is reshaped slightly to make room for the restoration. A digital or conventional impression is recorded, a temporary crown is fitted, and the final crown is made to match your natural tooth shade before being cemented permanently.",
        "A bridge follows the same principle across a gap: the teeth on either side are prepared as supports, and the replacement tooth is fused between them as one fixed unit.",
      ],
    },
    whoNeeds: {
      heading: "Who needs a crown or bridge?",
      items: [
        "Teeth that have had root canal treatment",
        "Heavily filled, cracked or fractured teeth",
        "Severely worn-down teeth from grinding",
        "One or two missing teeth with healthy teeth on either side",
        "Discoloured or misshapen front teeth",
        "Restorations placed on top of dental implants",
      ],
    },
    benefits: [
      { title: "Restores full strength", desc: "A crown protects a weakened tooth from fracturing under chewing load." },
      { title: "Natural appearance", desc: "Zirconia and E-max crowns are shade-matched and reflect light like enamel." },
      { title: "Fixed, not removable", desc: "Bridges stay permanently in place — nothing to take out at night." },
      { title: "Long-lasting", desc: "Well-maintained crowns and bridges routinely last 10–15 years or more." },
    ],
    process: [
      { title: "Examination & planning", desc: "The tooth is assessed and the right material is selected for its position and load." },
      { title: "Tooth preparation", desc: "Minimal, controlled reshaping of the tooth under local anaesthesia." },
      { title: "Impressions & shade", desc: "Digital or conventional impressions with careful shade matching." },
      { title: "Temporary restoration", desc: "A temporary crown protects the tooth while the final unit is fabricated." },
      { title: "Fitting & cementation", desc: "Fit, contact points and bite are checked before permanent cementation." },
    ],
    whyUs: [
      "Prosthetic work planned by Dr. Meenakshi Singh, MDS Prosthodontics",
      "Zirconia, E-max and metal-ceramic options explained with honest pros and cons",
      "Precise shade matching for front teeth so restorations blend in",
      "Bite checked and refined at fitting to avoid long-term jaw discomfort",
    ],
    faqs: [
      { q: "How long does a crown take?", a: "Usually two visits about a week apart — one for preparation and impressions, one for fitting. A temporary crown protects the tooth in between." },
      { q: "Which crown material is best?", a: "Zirconia is the strongest and suits back teeth; E-max gives the best translucency for front teeth; metal-ceramic remains a reliable, economical option. We recommend based on the tooth, not a fixed preference." },
      { q: "Does getting a crown hurt?", a: "No. Preparation is done under local anaesthesia. Mild sensitivity for a few days after fitting is normal and settles quickly." },
      { q: "How do I care for a bridge?", a: "Brush normally and clean underneath the replacement tooth daily using a floss threader or interdental brush. We demonstrate the technique at the fitting appointment." },
    ],
    related: ["dental-implants", "root-canal-treatment", "dentures"],
  },
  {
    slug: "dentures",
    iconImage: "/wl0service6.webp",
    accent: { bg: "#EEEAF9", fg: "#6746C3" },
    title: "Dentures Treatment",
    menuTitle: "Dentures Treatment",
    icon: Layers,
    excerpt:
      "Complete, partial, flexible and implant-supported dentures that restore comfortable chewing and speech.",
    image: img("1667133295315-820bb6481730"),
    imageAlt: "Prosthodontist showing a complete denture to a patient during a consultation",
    seoTitle: "Dentures in Gurugram | Complete, Partial & Implant-Supported",
    seoDescription:
      "Complete, partial, flexible and implant-supported dentures in Gurugram, made by an MDS prosthodontist at White Lily Dental, Sector 69 & Sector 77.",
    intro:
      "Dentures replace multiple missing teeth and restore the ability to chew, speak clearly and smile with confidence — without surgery.",
    overview: [
      "Modern dentures are a long way from the bulky appliances people remember. Accurate impressions, careful bite registration and better materials produce prostheses that fit closely, look natural and stay comfortable.",
      "Dr. Meenakshi Singh, MDS Prosthodontics, makes complete dentures for fully edentulous jaws, partial dentures where some natural teeth remain, flexible dentures with no visible metal clasps, and implant-supported overdentures that snap securely into place.",
    ],
    whatIsIt: {
      heading: "What are dentures?",
      body: [
        "A denture is a removable prosthesis carrying artificial teeth on a gum-coloured base. Complete dentures replace all teeth in a jaw and rest on the gum and underlying bone. Partial dentures fill in gaps and clasp onto remaining natural teeth.",
        "Implant-supported overdentures use two or more implants as anchors, which dramatically improves stability for patients whose lower denture keeps loosening.",
      ],
    },
    whoNeeds: {
      heading: "Who needs dentures?",
      items: [
        "Loss of all teeth in one or both jaws",
        "Several missing teeth in different parts of the mouth",
        "Difficulty chewing or a restricted diet",
        "Unclear speech caused by missing teeth",
        "Existing dentures that have become loose or ill-fitting",
        "Patients who are not candidates for extensive implant surgery",
      ],
    },
    benefits: [
      { title: "Chew comfortably again", desc: "Restores the ability to eat a normal, varied diet." },
      { title: "Supports facial structure", desc: "Prevents the sunken appearance caused by long-term tooth loss." },
      { title: "Clearer speech", desc: "Correct tooth position restores normal pronunciation." },
      { title: "Non-surgical option", desc: "A practical solution when implants are not suitable or affordable." },
    ],
    process: [
      { title: "Assessment & impressions", desc: "Examination of the ridges and remaining teeth, followed by primary impressions." },
      { title: "Final impressions & bite", desc: "Accurate secondary impressions and jaw relation records are taken." },
      { title: "Wax try-in", desc: "A wax version is tried in so tooth position, appearance and bite can be approved by you." },
      { title: "Fitting", desc: "The finished denture is fitted, adjusted and checked for pressure points." },
      { title: "Follow-up adjustments", desc: "Review visits to relieve any sore spots as your tissues settle." },
    ],
    whyUs: [
      "Dentures designed by an MDS prosthodontist, not outsourced without supervision",
      "Wax try-in stage so you approve the look before the denture is finished",
      "Flexible and implant-supported options for patients who dislike metal clasps",
      "Included follow-up adjustment visits during the settling-in period",
    ],
    faqs: [
      { q: "How long does it take to get used to dentures?", a: "Most patients adapt within two to four weeks. Speech and chewing improve steadily during that period, and minor adjustments at review visits speed the process up." },
      { q: "How long do dentures last?", a: "Typically five to eight years. The jaw ridge changes shape over time, so relining or remaking is eventually needed to maintain a good fit." },
      { q: "Are implant-supported dentures better?", a: "They are far more stable, especially for lower dentures, and let you eat with much more confidence. They cost more because implants are involved, and we will explain both options at consultation." },
      { q: "How should I clean my dentures?", a: "Remove and clean them after meals with a denture brush and mild soap — not regular toothpaste, which is abrasive. Leave them in water overnight so they do not dry out and distort." },
    ],
    related: ["dental-implants", "crowns-and-bridges", "gums-treatment"],
  },
  {
    slug: "simple-tooth-removal",
    iconImage: "/UUoservice7.webp",
    accent: { bg: "#E9EFF9", fg: "#2B5FA8" },
    title: "Simple Tooth Removal",
    menuTitle: "Simple Tooth Removal / Extractions",
    icon: Scissors,
    excerpt:
      "Gentle, comfortable extraction of decayed, damaged or mobile teeth with clear aftercare guidance.",
    image: img("1606811856475-5e6fcdc6e509"),
    imageAlt: "Dentist explaining a tooth extraction procedure to a patient in a treatment room",
    seoTitle: "Tooth Extraction in Gurugram | Painless Tooth Removal",
    seoDescription:
      "Comfortable simple tooth extraction in Gurugram under local anaesthesia, with clear aftercare and replacement planning. White Lily Dental, Sector 69 & Sector 77.",
    intro:
      "When a tooth cannot be saved, a controlled extraction relieves pain and protects the surrounding teeth and bone from further damage.",
    overview: [
      "Extraction is always the last option at White Lily Dental. We first assess whether the tooth can be restored with a filling, root canal treatment or a crown, and we will tell you clearly when it can.",
      "When removal is genuinely the right decision, the procedure is done under local anaesthesia by our oral surgeon and takes only a few minutes for most teeth.",
    ],
    whatIsIt: {
      heading: "What is a simple extraction?",
      body: [
        "A simple extraction removes a tooth that is fully visible in the mouth and can be loosened and lifted out with instruments — no cutting of gum or bone is required.",
        "The area is fully anaesthetised first, so you feel firm pressure but no pain. Afterwards you receive written aftercare instructions and, where relevant, a plan for replacing the tooth.",
      ],
    },
    whoNeeds: {
      heading: "When is an extraction needed?",
      items: [
        "Teeth destroyed by extensive decay and not restorable",
        "Vertically fractured or split teeth",
        "Severely mobile teeth due to advanced gum disease",
        "Retained milk teeth blocking the permanent tooth",
        "Teeth removed as part of an orthodontic plan to create space",
        "Repeated infection in a tooth that has already failed treatment",
      ],
    },
    benefits: [
      { title: "Immediate pain relief", desc: "Removing the source of infection resolves persistent pain quickly." },
      { title: "Protects neighbouring teeth", desc: "Stops decay and infection spreading to adjacent healthy teeth." },
      { title: "Quick procedure", desc: "Most simple extractions are completed in a single short appointment." },
      { title: "A clear plan afterwards", desc: "We discuss implant, bridge or denture replacement at the same visit." },
    ],
    process: [
      { title: "Examination & X-ray", desc: "We confirm the tooth cannot be saved and check the root anatomy." },
      { title: "Local anaesthesia", desc: "The tooth and surrounding tissue are numbed completely." },
      { title: "Gentle removal", desc: "The tooth is loosened and lifted out with controlled, minimal force." },
      { title: "Socket care", desc: "The socket is cleaned, and pressure is applied to control bleeding." },
      { title: "Aftercare & replacement plan", desc: "Written instructions, medication if needed, and options to replace the tooth." },
    ],
    whyUs: [
      "Extractions performed by Dr. Lakshay Gupta, MDS Oral & Maxillofacial Surgery",
      "We always assess restorative options before recommending removal",
      "Strict sterilisation protocol for every surgical instrument",
      "Replacement options planned at the same appointment, not months later",
    ],
    faqs: [
      { q: "Will the extraction hurt?", a: "No. The area is fully numbed, so you will feel pressure and movement but not pain. Mild soreness for a day or two afterwards is normal and manageable with prescribed medication." },
      { q: "How long does healing take?", a: "The gum surface closes within one to two weeks. The underlying bone continues to fill in over two to three months, which matters if you plan to have an implant." },
      { q: "What should I avoid after an extraction?", a: "For the first 24 hours avoid rinsing forcefully, spitting, using a straw, smoking and hot food. These can dislodge the clot and cause a painful dry socket." },
      { q: "Should I replace an extracted tooth?", a: "Usually yes — except for wisdom teeth. Leaving a gap allows neighbouring teeth to drift and the bone to shrink. We will discuss implants, bridges or dentures with you." },
    ],
    related: ["wisdom-tooth-removal", "dental-implants", "root-canal-treatment"],
  },
  {
    slug: "wisdom-tooth-removal",
    iconImage: "/Z1Uservice8.webp",
    accent: { bg: "#F6EDE4", fg: "#B06A2C" },
    title: "Wisdom Tooth Removal",
    menuTitle: "Wisdom Tooth Removal",
    icon: Stethoscope,
    excerpt:
      "Surgical removal of impacted and painful wisdom teeth by an MDS oral and maxillofacial surgeon.",
    image: img("1677026010083-78ec7f1b84ed"),
    imageAlt: "Oral surgeon reviewing a dental X-ray showing an impacted wisdom tooth",
    seoTitle: "Wisdom Tooth Removal in Gurugram | Impacted Third Molar Surgery",
    seoDescription:
      "Impacted wisdom tooth extraction in Gurugram by an MDS oral & maxillofacial surgeon. Safe, comfortable third molar surgery at White Lily Dental.",
    intro:
      "Impacted wisdom teeth cause pain, swelling, decay in the tooth in front and repeated gum infections. Removing them early prevents bigger problems later.",
    overview: [
      "Wisdom teeth — the third molars — erupt in the late teens or twenties. There is often not enough space in the jaw, so they come through at an angle, partially erupt, or stay trapped in the bone.",
      "Dr. Lakshay Gupta, MDS Oral & Maxillofacial Surgery, assesses each case with an X-ray or OPG to map the tooth position and its relationship to the nerve before planning removal.",
    ],
    whatIsIt: {
      heading: "What is wisdom tooth surgery?",
      body: [
        "For an impacted tooth, a small incision is made in the gum to expose the crown. A minimal amount of bone may be removed, and the tooth is often sectioned into pieces so it can be lifted out through a small opening.",
        "The site is cleaned and closed with sutures. The entire procedure is done under local anaesthesia and typically takes 20 to 45 minutes depending on the impaction.",
      ],
    },
    whoNeeds: {
      heading: "When should a wisdom tooth be removed?",
      items: [
        "Pain or pressure at the back of the jaw",
        "Repeated swelling or infection of the gum flap (pericoronitis)",
        "Decay in the wisdom tooth or the molar in front of it",
        "A partially erupted tooth that traps food and cannot be cleaned",
        "Difficulty opening the mouth fully or persistent bad breath",
        "Cyst formation around an unerupted tooth seen on X-ray",
      ],
    },
    benefits: [
      { title: "Ends recurring infection", desc: "Stops the cycle of pericoronitis, swelling and antibiotics." },
      { title: "Protects the second molar", desc: "Prevents decay and bone loss on the healthy molar in front." },
      { title: "Relieves crowding pressure", desc: "Removes a source of pressure at the back of the arch." },
      { title: "Specialist surgical care", desc: "Performed by an MDS oral surgeon with proper radiographic planning." },
    ],
    process: [
      { title: "Radiographic assessment", desc: "An OPG or CBCT maps the tooth angle, roots and nerve proximity." },
      { title: "Anaesthesia", desc: "Profound local anaesthesia is achieved before any surgical step." },
      { title: "Surgical access", desc: "A small flap is raised and minimal bone is removed if required." },
      { title: "Sectioning & removal", desc: "The tooth is divided and removed piece by piece through a small opening." },
      { title: "Suturing & recovery", desc: "The site is sutured, medication is prescribed and aftercare is explained in detail." },
    ],
    whyUs: [
      "Impacted cases handled by an MDS oral & maxillofacial surgeon in-house",
      "Radiographic nerve mapping before surgery for lower third molars",
      "Sterile surgical protocol with single-use disposables",
      "Post-operative review and counsellor follow-up during healing",
    ],
    faqs: [
      { q: "Is wisdom tooth removal painful?", a: "The surgery itself is painless under local anaesthesia. Swelling and discomfort peak around 48 hours afterwards and settle over three to five days with prescribed medication and cold compresses." },
      { q: "How long is the recovery?", a: "Most patients return to work or college in two to three days. Complete soft-tissue healing takes about two weeks. We advise soft food and no strenuous exercise for the first few days." },
      { q: "Do all wisdom teeth need removing?", a: "No. A wisdom tooth that has erupted fully, is in a correct position, bites properly and can be cleaned should be kept. We only recommend removal when there is a clear clinical reason." },
      { q: "Will I be put to sleep for the surgery?", a: "The vast majority of cases are done comfortably under local anaesthesia. For extremely anxious patients or very complex impactions, sedation options are discussed beforehand." },
    ],
    related: ["simple-tooth-removal", "gums-treatment", "preventive-dental-treatments"],
  },
  {
    slug: "gums-treatment",
    iconImage: "/Tseservice9.webp",
    accent: { bg: "#F7E9EE", fg: "#B03E63" },
    title: "Gums Treatment",
    menuTitle: "Gums Treatment",
    icon: HeartPulse,
    excerpt:
      "Scaling, root planing and gum disease management to stop bleeding gums and prevent tooth loss.",
    image: img("1593022356769-11f762e25ed9"),
    imageAlt: "Dental hygienist performing a professional scaling and gum cleaning procedure",
    seoTitle: "Gum Disease Treatment in Gurugram | Scaling & Periodontal Care",
    seoDescription:
      "Treatment for bleeding gums, gingivitis and periodontitis in Gurugram — scaling, root planing and gum surgery at White Lily Dental, Sector 69 & Sector 77.",
    intro:
      "Bleeding gums are not normal. Gum disease is the leading cause of adult tooth loss, and it is almost entirely treatable when caught early.",
    overview: [
      "Plaque that is not removed hardens into calculus along and below the gum line. The gums become inflamed and bleed — gingivitis. Left untreated it progresses to periodontitis, where the bone supporting the teeth is destroyed and teeth become loose.",
      "Treatment depends on the stage. Early disease responds to professional scaling and improved home care. Advanced disease needs deep cleaning under the gum, and sometimes surgical access to clean and regenerate the affected areas.",
    ],
    whatIsIt: {
      heading: "What does gum treatment involve?",
      body: [
        "Scaling and polishing removes plaque and hardened calculus from the tooth surfaces using ultrasonic instruments. It is quick, done in one visit, and does not damage or loosen teeth — a common misconception.",
        "For deeper pockets we perform root planing, smoothing the root surface below the gum line so tissue can reattach. Advanced cases may need flap surgery, bone grafting or laser-assisted therapy.",
      ],
    },
    whoNeeds: {
      heading: "Signs you need gum treatment",
      items: [
        "Gums that bleed while brushing or flossing",
        "Red, swollen or tender gums",
        "Persistent bad breath or a bad taste",
        "Receding gums or teeth that look longer than before",
        "Loose or shifting teeth",
        "Visible tartar deposits or staining at the gum line",
      ],
    },
    benefits: [
      { title: "Stops bleeding gums", desc: "Removing the cause resolves inflammation within days for most patients." },
      { title: "Prevents tooth loss", desc: "Halts the bone destruction that eventually loosens teeth." },
      { title: "Fresher breath", desc: "Eliminates the bacterial deposits responsible for chronic halitosis." },
      { title: "Supports general health", desc: "Gum inflammation is linked with diabetes control and cardiovascular health." },
    ],
    process: [
      { title: "Periodontal examination", desc: "Pocket depths are measured and X-rays assess bone levels around each tooth." },
      { title: "Scaling & polishing", desc: "Ultrasonic removal of plaque and calculus above and at the gum line." },
      { title: "Root planing", desc: "Deep cleaning of root surfaces below the gum, done quadrant by quadrant if needed." },
      { title: "Surgical therapy if required", desc: "Flap surgery or grafting for pockets that do not respond to deep cleaning." },
      { title: "Maintenance recall", desc: "Three to six monthly maintenance visits to keep the disease under control." },
    ],
    whyUs: [
      "Full periodontal charting, not just a quick surface clean",
      "Ultrasonic scaling with modern, well-maintained equipment",
      "Written home-care technique guidance tailored to your problem areas",
      "Structured maintenance recall so gum disease does not silently return",
    ],
    faqs: [
      { q: "Does scaling loosen or damage teeth?", a: "No. Scaling removes hardened deposits, not tooth structure. Teeth may feel slightly different afterwards because the calculus that was splinting them is gone — that sensation settles within days." },
      { q: "How often should I get my teeth cleaned?", a: "Once every six to twelve months for most people. Patients with a history of gum disease, diabetes or smoking usually need three to four monthly maintenance visits." },
      { q: "Will my receded gums grow back?", a: "Receded gum tissue does not regrow on its own. Treatment stops further recession, and gum grafting can cover exposed roots in selected cases." },
      { q: "Is gum treatment painful?", a: "Routine scaling is not painful, though it can feel sensitive if your gums are inflamed. Deep root planing is done under local anaesthesia so it is comfortable." },
    ],
    related: ["preventive-dental-treatments", "simple-tooth-removal", "dentures"],
  },
  {
    slug: "preventive-dental-treatments",
    iconImage: "/m02service10.webp",
    accent: { bg: "#E4F2EA", fg: "#2E7D52" },
    title: "Preventive Dental Treatments",
    menuTitle: "Preventive Dental Treatments",
    icon: ShieldCheck,
    excerpt:
      "Check-ups, cleaning, fluoride, sealants and early screening that keep problems small and treatment simple.",
    image: img("1588776814546-daab30f310ce"),
    imageAlt: "Dentist carrying out a routine preventive dental check-up on a young patient",
    seoTitle: "Preventive Dentistry in Gurugram | Check-ups, Cleaning & Sealants",
    seoDescription:
      "Routine dental check-ups, professional cleaning, fluoride application and pit-and-fissure sealants in Gurugram at White Lily Dental, Sector 69 & Sector 77.",
    intro:
      "The cheapest dental treatment is the one you never need. Preventive dentistry catches decay and gum problems while they are still small and simple to fix.",
    overview: [
      "A routine dental visit is not just a look and a clean. We screen for decay, gum disease, bite problems, worn enamel and oral cancer, and we compare findings against your previous records to spot changes early.",
      "White Lily Dental also offers annual dental plans that make consultations, X-rays and cleaning affordable for the whole family, so cost is never the reason a check-up is skipped.",
    ],
    whatIsIt: {
      heading: "What does preventive dentistry include?",
      body: [
        "Preventive care covers routine examination and digital X-rays, professional scaling and polishing, topical fluoride application to strengthen enamel, and pit-and-fissure sealants that seal the deep grooves of children's back teeth before decay can start.",
        "It also includes practical coaching — brushing technique, interdental cleaning, diet advice and night guards for patients who grind their teeth.",
      ],
    },
    whoNeeds: {
      heading: "Who should have preventive care?",
      items: [
        "Every adult and child, at least once a year",
        "Children as their permanent molars erupt (sealants and fluoride)",
        "Patients with a history of frequent cavities",
        "Anyone with diabetes, or who smokes or uses tobacco",
        "Patients wearing braces, aligners, crowns or implants",
        "Pregnant patients, who are more prone to gum inflammation",
      ],
    },
    benefits: [
      { title: "Catch problems early", desc: "Small cavities need a filling; ignored cavities need a root canal and crown." },
      { title: "Lower lifetime cost", desc: "Routine prevention costs a fraction of restorative and surgical treatment." },
      { title: "Protects children's teeth", desc: "Sealants and fluoride dramatically reduce decay in newly erupted molars." },
      { title: "Whole-body benefit", desc: "Healthy gums support better diabetes control and cardiovascular health." },
    ],
    process: [
      { title: "Full examination", desc: "Tooth-by-tooth check, gum assessment and oral cancer screening." },
      { title: "Digital X-rays", desc: "Low-radiation imaging to find decay between teeth and check bone levels." },
      { title: "Professional cleaning", desc: "Ultrasonic scaling and polishing to remove plaque, calculus and stains." },
      { title: "Fluoride & sealants", desc: "Protective applications where enamel is weak or grooves are deep." },
      { title: "Personalised recall plan", desc: "A recall interval and home-care routine matched to your individual risk." },
    ],
    whyUs: [
      "Digital X-rays with markedly lower radiation than conventional film",
      "Affordable annual dental plans covering consultations, X-rays and cleaning for the family",
      "Strict sterilisation and infection-control protocol at both clinics",
      "Child-friendly approach that builds long-term comfort with dental visits",
    ],
    faqs: [
      { q: "How often should I visit the dentist?", a: "At least once a year for a check-up and professional cleaning. Patients with gum disease, frequent decay or orthodontic appliances usually need visits every three to six months." },
      { q: "Are dental X-rays safe?", a: "Yes. Digital dental X-rays use very low radiation doses — a full set is a small fraction of the background radiation you receive naturally each year. We only take them when clinically indicated." },
      { q: "At what age should a child first see a dentist?", a: "By their first birthday, or within six months of the first tooth appearing. Early visits are short and friendly, and they build comfort long before any treatment is needed." },
      { q: "What are pit and fissure sealants?", a: "A thin protective coating flowed into the deep grooves of newly erupted molars. It seals out plaque and food and is one of the most effective ways to prevent decay in children." },
    ],
    related: ["gums-treatment", "cosmetic-dentistry", "braces-treatment"],
  },
];

export const serviceSlugs = services.map((s) => s.slug);

export function getService(slug) {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slug) {
  const service = getService(slug);
  if (!service) return [];
  return service.related.map((s) => getService(s)).filter(Boolean);
}
