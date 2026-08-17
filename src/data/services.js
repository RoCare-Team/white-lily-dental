/**
 * FALLBACK ONLY — this is not what the website reads.
 *
 * Live content lives in MongoDB and is edited at /admin. This file is served
 * only when its collection is empty or the database is unreachable, so the
 * site never renders a blank section. Editing a value here will NOT change the
 * website; change it in the admin panel instead.
 */
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

/**
 * Page copy, taglines and meta titles/descriptions are the live
 * whitelilydental.in service pages, kept word for word — this site replaces
 * that one, so the existing content and its search rankings carry over.
 * Icons, accent colours, photography, card excerpts and FAQs are ours.
 */
export const services = [
  {
    slug: "braces-treatment",
    livePath: "/service/braces",
    accent: { bg: "#E8F0FC", fg: "#1668C7" },
    iconImage: "/images/service1-braces.png",
    icon: Smile,
    title: "Braces Treatment",
    menuTitle: "Braces Treatment",
    excerpt: "Metal, ceramic and clear options to straighten teeth.",
    image: img("1595152772835-219674b2a8a6"),
    imageAlt: "Young patient smiling after orthodontic braces treatment in Gurugram",
    seoTitle: "Teeth Braces in Gurgaon @9711811272 | Dental Braces Cost",
    seoDescription: "White Lily Dental offers all types of braces for teeth like metal braces, ceramic braces, clear aligners. Hurry! Book an appointment with the best orthodontist near you for teeth braces. Make a call @9711811272 and know price of teeth braces.",
    tagline: "It’s NEVER Too Late To Get Your Smile STRAIGHT!",
    sections: [
      {
        heading: "Braces Treatment",
        level: "h2",
      },
      {
        heading: "First appointment",
        level: "h2",
        body: [
          "During your first appointment, all your problems and queries can be addressed to the orthodontist. In this appointment Orthodontist will perform a thorough check-up of your teeth in accordance with your problem and needs. He will assess your smile and your face at rest and from various angles. You can search on google as an orthodontist near me from your device and can see the result near by you.",
          "After the check-up Orthodontist will state a tentative treatment plan and explain to you regarding the various kinds of braces available, e.g., metal braces, ceramic (tooth coloured) braces, invisible braces etc. He will explain everything about all types of braces, such as advantages, disadvantages, and cost, modes of payment, etc.",
          "The orthodontist will fix another appointment for you, giving you time to choose the type of braces. In this appointment Orthodontist will take pre-treatment records.",
        ],
      },
      {
        heading: "Second appointment",
        level: "h2",
        body: [
          "In this appoint you will tell your choice of braces to the orthodontist. Pre-treatment records will be taken in this appointment. These records are taken to formulate the Final treatment plan.",
        ],
      },
      {
        heading: "Third appointment",
        level: "h2",
        body: [
          "Today, the Orthodontist will discuss with you his final treatment plan. If any changes are required, another appointment will be fixed, and the orthodontist will start fixing the braces in this appointment.",
          "At the end of the appointment, he will explain all the dos and don'ts. He will also address all your queries and explain to you about the subsequent appointments. Usually, subsequent appointments are scheduled between 3 weeks and 8 weeks,s depending on the type of braces.",
          "Dental braces are one of the most commonly used dental devices for aligning the arrangement of teeth inside one's mouth to the right arrangement. When the milk teeth fall out, and the permanent teeth emerge, the arrangement of the same gets distorted owing to several reasons. Sometimes, the teeth also get broken down partially, lending the dental arrangement a bizarre look.",
          "To earn admiration for your perfectly aligned and organized set of teeth, you need braces that will help the distorted arrangement assume a finer shape. We, at White Lily Dental, make sure that you get to go through a painless process from getting the braces on to removing them neatly without causing you any discomfort. Also, as far as the teeth braces cost in India is concerned, we keep our teeth clip price reasonable.",
        ],
      },
      {
        heading: "Advanced Equipment",
        level: "h2",
        body: [
          "We keep only the latest and best dental equipment to make sure that everyone goes through a painless process of dental bracing. You do not have to be bothered about the braces price in India as we keep braces of all varieties to suit your requirements, as well as your budget. You can even check the invisible braces cost in India before opting for one from us.",
          "With our advanced equipment, we make sure that the fitting is done neatly and without ambiguity. Although many think that bracing is a painful process, we can assure you that our advanced equipment and latest design braces will not even allow you to realize that you are wearing anything alien to your teeth after the bracing is done.",
        ],
      },
      {
        heading: "Expert Doctors",
        level: "h2",
        body: [
          "Our team of veteran and expert dentists makes sure that your teeth braces treatment gets done minus any hassle. We make sure that you get a new look by aligning your teeth appropriately through a dental brace that will neither cost you much nor pain you considerably. You can depend on our services blindfolded when it comes to dental bracing as we have hundreds of happy customers who have regained a new look and confidence by acquiring a completely new look with their rearranged and realigned teeth.",
        ],
      },
      {
        heading: "Choice of Braces",
        level: "h2",
        body: [
          "As far as the dental braces types are concerned, you will find all the available types of braces for teeth in India with us. From the traditional metal braces to the latest Lingual Braces, Ceramic Braces, and Invisalign, you would get everything you need to check before selecting one. All you have to do is check the dental braces cost in India and compare the same with the brace costs we offer, and select one.",
          "If you are looking for dental braces, clinics must be chosen carefully. For affordable yet satisfactory solutions, you can always look up to our services. We make sure that every case is handled with individual care, as no one comes with the same set of issues. From pre-setting procedures to post-setting care, you would get end-to-end assistance and treatment at White Lily Dental. Choose our easy-to-book and affordable services and say yes to a happy smile.",
        ],
      },
    ],
    subServices: [
    {
      slug: "clear-aligners",
      name: "Clear Aligners",
      blurb: "Get clear aligners for the severe crowding or spacing problems of your teeth. We provide clear aligners braces in Gurgaon. Book an appointment today and get your crowded teeth fixed call us at @9711811272 to know clear aligners cost in Gurgaon.",
      seoTitle: "Clear Aligners Braces Near Me in Gurgaon | Clear Aligners Cost @9711811272",
      seoDescription: "Get clear aligners for the severe crowding or spacing problems of your teeth. We provide clear aligners braces in Gurgaon. Book an appointment today and get your crowded teeth fixed call us at @9711811272 to know clear aligners cost in Gurgaon.",
      sections: [
        {
          heading: "Clear Aligners",
          level: "h2",
          body: [
            "Get clear aligners for the severe crowding or spacing problems of your teeth. We provide clear aligners braces in Gurgaon. Book an appointment today and get your crowded teeth fixed call us at @9711811272 to know clear aligners cost in Gurgaon.",
            "What Is It That You Require – Teeth Aligners Or Clear Braces? A person's smile is what catches the opposite end's person's attention. It can attract and bring near to one another with just a simple smile on the face. But if the teeth of the person are not in the right shape and position then it can seriously affect a person's smile and even play with that person's self-esteem.",
            "So if a person is having some problem with the teeth in that line then clear aligners are the solution that we have at White Lily Dental.",
          ],
        },
        {
          heading: "What Are Clear Aligners?",
          level: "h2",
          body: [
            "Invisible braces and clear aligners are one and the same. They are transparent tray-like structures that have to be worn both on the upper and lower teeth to make your teeth move properly. As they are prone to change from person to person, we custom make them for every individual patient.",
          ],
        },
        {
          heading: "What Are Clear Braces?",
          level: "h2",
          body: [
            "Here we will bring to light the difference between invisible braces and clear braces. They are definitely different from each other. Clear braces are simply ceramic braces that have the colour of the tooth along with a wire also coloured like the tooth put on it to make it firm. They perform the same function as the traditional metallic braces but only they are not visible from a distance.",
          ],
        },
        {
          heading: "Which Is The More Popular Option – Teeth Aligners Or Braces?",
          level: "h2",
          body: [
            "Now, this is a very tricky question that you as a layman may not know. But we are here to guide you with the years of experience that we have had at White Lily Dental. Teeth aligners are always the suggested option for reasons very obvious.",
            "The clear braces that you may opt for have some disadvantages like not being very aesthetically very beautiful. At the same time, they tend to get discoloured by the various foods that you may eat. The stain remains making it look very ugly. Even the wire gets discoloured because of the friction that is caused by the slot of the bracket making it look metallic in colour.",
            "The cleaning regimen for the braces is a bit on the difficult side. While your invisible aligners are relatively easier because they can regularly be removed and cleaned. As a result, they also do not stain. As is evident from what we have discussed so far, you can clearly see that aligners are a better option especially if it involves your child.",
          ],
        },
        {
          heading: "Other Reasons Why We Suggest Aligners",
          level: "h2",
          body: [
            "We always suggest invisible braces for teeth because they are very affordable, removable, have no food restrictions, have less number of appointments with the dentist and the treatment period is short compared to different braces.",
          ],
        },
        {
          heading: "Cost Of Teeth Aligners",
          level: "h2",
          body: [
            "The cost of transparent teeth braces is not very high. But the cost is dependent on a few factors like:",
            "Clear aligners cost is not very high despite it being a modern treatment for teeth. So if you have a problem you can contact us at White Lily Dental.",
            "Our teeth aligners' price is so reasonable that we will suggest you contact us if you have any problems regarding this. We are there with our team of experts to take care of you.",
            "This is the most advanced technology in the field of braces. With latest advances and in conjunction with other techniques almost all bite problems can be corrected using clear aligners. They are also customized according to shape of the teeth and individual treatment needs.",
          ],
          list: [
            "Varies from patient to patient",
            "Clinic location",
            "The experience and expertise of your dentist does count",
            "The brand that you choose decides on your teeth aligner's cost",
            "A few additional costs like retainers, extractions, etc",
          ],
        },
        {
          heading: "Advantages:",
          level: "h2",
          list: [
            "Invisible",
            "Can treat almost all Orthodontic problems.",
            "Removable, it can be removed by the patient while brushing and eating. Therefore, there are no food restrictions.",
            "Extremely comfortable",
            "Fewer visits to the Orthodontist.",
          ],
        },
      ],
    },
    {
      slug: "lingual-braces",
      name: "Lingual Braces",
      blurb: "Get proper and safe lingual braces treatment in Gurgaon. Visit us or call us @9711811272 to know the lingual braces cost in Gurgaon and get fixed misalignments of your teeth at an affordable rate.",
      seoTitle: "Lingual Braces Near Me @9711811272 | Lingual Braces Cost in Gurgaon",
      seoDescription: "Get proper and safe lingual braces treatment in Gurgaon. Visit us or call us @9711811272 to know the lingual braces cost in Gurgaon and get fixed misalignments of your teeth at an affordable rate.",
      sections: [
        {
          heading: "Lingual Braces",
          level: "h2",
          body: [
            "Get proper and safe lingual braces treatment in Gurgaon. Visit us or call us @9711811272 to know the lingual braces cost in Gurgaon and get fixed misalignments of your teeth at an affordable rate.",
            "Lingual Braces Are A Very Good Option When It Comes To Braces For Adults A quarter of all dental patients across the world wear braces. There are many other adults who require them but prefer putting them off for fear of getting ridiculed by peers or family or even friends. But this is not right. At White Lily Dental we have a solution for such adults with our lingual braces.",
          ],
        },
        {
          heading: "What Exactly Are Lingual Braces?",
          level: "h2",
          body: [
            "Lingual braces are a kind of lingual orthodontics namely the invisible braces. Unlike other braces , they are fixed to the lingual side or the backside of the teeth with the help of brackets and wires. In fact, they are closer to the teeth than the other normal braces that are used in the market.",
          ],
        },
        {
          heading: "How We Fit Your Lingual Braces?",
          level: "h2",
          body: [
            "We give every patient custom-made lingual braces that fit perfectly into your mouth making use of the impression of your teeth. It necessarily has to be installed onto every single tooth to correct any flaws and misalignments in the teeth. We even customize the wires so that it suits the patient perfectly.",
            "We always ensure that the braces fit you perfectly fine before we start installing them, wherein the lingual bonded retainers and the brackets are the most challenging and difficult parts. As the back end of the mouth has less space and is difficult to reach for the dentist, that part of the installation is the most difficult part.",
            "To position your lingual braces properly, we fit the brackets by cementing them onto the teeth by means of a tray that has been specially customized for you.",
          ],
        },
        {
          heading: "Our Lingual Braces And Their Advantages",
          level: "h2",
          body: [
            "While correcting your teeth our lingual braces will allow you to be more careful with your misalignments. Our braces will give you the added benefit of hiding them behind your teeth, unlike the uncomfortable metal braces that pop out whenever you smile.",
            "At White Lily Dental, our dental experts with their level of proficiency will help you cover up all the very complex misalignments in your teeth also. We will also help you to check rotations, close gaps that occur due to extractions, or level the height of your teeth properly.",
            "Sometimes there are white spots or discolorations that occur due to wearing the braces. This easily gets sorted out because the braces are on the inner side that remains hidden. As we custom fit your braces, you will find more comfort with our braces.",
          ],
        },
        {
          heading: "The Cost Of Our Lingual Braces",
          level: "h2",
          body: [
            "Lingual braces cost a little more than traditional braces. But this is not a thing that you should worry about as it is minor in comparison to the benefit that you will get from it. We have to customize the brace as per your requirement and there comes the cost of the braces. It also does take some time for the misalignments to be corrected.",
            "It could take a year or two before they are corrected. So you will have to keep visiting us at White Lily Dental and all these visits are included in your lingual braces price.",
            "But when you consider lingual braces near me, then White Lily Dental is the best option that you have at hand and we are always ready with our team of experts to take care of you.",
            "A perfect smile is everyone's right regardless of the age. First of all we would like to make it clear that Orthodontic treatment can be performed at ANY AGE, if the supporting structures of the teeth are healthy, i.e. gums and bone surrounding the teeth.",
          ],
        },
        {
          heading: "There are options for the adults where braces are completely invisible. These are:",
          level: "h2",
          list: [
            "Lingual braces",
            "Clear aligners (INVISALIGN)",
          ],
        },
        {
          heading: "LINGUAL BRACES",
          level: "h3",
          body: [
            "Lingual braces are placed on the backside of the teeth and therefore are invisible from the front. Latest lingual braces come as customized, i.e. they are fabricated for an individual as per the shape of his/her teeth and his/her treatment needs.",
          ],
        },
        {
          heading: "LINGUAL BRACES AVAILABLE AT WHITE LILY DENTAL:",
          level: "h3",
          list: [
            "3M INCOGNITO",
            "I LINGUAL 3D",
          ],
        },
        {
          heading: "Advantages",
          level: "h3",
          body: [
            "Charges and other doubts can be cleared with the Orthodontist.",
          ],
          list: [
            "Virtually invisible",
            "Can be customized according to the treatment needs.",
            "Can correct most of the bite problems.",
          ],
        },
      ],
    },
    {
      slug: "metal-braces",
      name: "Metal Braces",
      blurb: "Searching for a dental clinic in Gurgaon for best teeth metal braces. We provide all kinds of dental services at a very affordable rate. Contact us to know the metal braces cost @9711811272",
      seoTitle: "Best Metal Braces Dental Clinic in Gurgaon | Metal Braces Cost at @9711811272",
      seoDescription: "Searching for a dental clinic in Gurgaon for best teeth metal braces. We provide all kinds of dental services at a very affordable rate. Contact us to know the metal braces cost @9711811272",
      sections: [
        {
          heading: "Metal Braces",
          level: "h2",
          body: [
            "Searching for a dental clinic in Gurgaon for best teeth metal braces. We provide all kinds of dental services at a very affordable rate. Contact us to know the metal braces cost @9711811272",
            "Metal Braces Or Ceramic Braces – Take It As You Like It Braces form a very significant part of a person life whose teeth are in disorder. This disorder often causes the person to lack self-confidence and this results in him going into a shell. And when that affected person finally gets braces, it does help in restoring the smile again. So now before we waste any further time in discussing braces and what they do to a person let us get into the details of braces.",
          ],
        },
        {
          heading: "What Are Metal Braces?",
          level: "h2",
          body: [
            "The conventional braces that people in earlier times wore were the metal braces that you know of. These braces are known to be very strong and have a high ability in straightening the teeth of the concerned person with the help of archwires.",
            "But we at White Lily Dental still have not done away with metallic braces that were the only hope of people in previous years. We have braces that are manufactured from highly long-lasting stainless steel.",
            "But unlike the metal braces of the yesteryears, today we will fit you with small, sleek, and thin braces that are very comfortable and lightweight. They do not look ugly as they did previously. Even if they are metal braces, we can make them look beautiful and attractive for you by fitting rubber bands with colorful elastic on the metal braces. We even customize them for your comfort.",
            "If the rectification needed is intense then we will suggest you get yourself fitted with metal braces. We can assure you that the metal braces cost is also significantly lower than the other types of modern braces. We will always say that metal braces are the all-time best where braces are concerned.",
          ],
        },
        {
          heading: "What Are Ceramic Braces?",
          level: "h2",
          body: [
            "Ceramic braces are a relatively new appearance in the dental scenario. They are manufactured from a clear ceramic-like material. As they are not visible on your teeth from a distance it is much preferred nowadays. Here again, we have ceramic braces that are either clear or tailored to make them suit the color of your teeth. They are as effective as their metal counterparts, with the only difference being in their visibility and aesthetic beauty. There is also another difference here, that in their durability.",
            "In this context, we have to mention that ceramic braces are prone to cracking and chipping. That is why we sometimes advocate the use of metal braces on the lower teeth with ceramics on the uppers. As metal braces can tolerate a lot of pressure, the patient can well use their teeth conveniently.",
            "But again a word of caution here, ceramic braces cost a lot more than the traditional ones. But again we will tell you that if you are conscious of your looks and want something that is not noticeable to people from afar, then it is the ceramic braces for you.",
            "No matter what the condition of your teeth is, we have dentists at White Lily Dental who can fit you with any type of braces that you want. You choose and we do the honours for you. We are well equipped with all the amenities that are required of any good dental clinic in your locality.",
            "These are the most common conventional braces. Two types of metal braces are available.",
            "Conventional metal braces and Self Ligating metal braces.",
            "Advantages of Self Ligating Metal braces (SLM) over Conventional Metal braces(CMB) are:",
          ],
          list: [
            "SLM are easier to clean by a toothbrush.",
            "Treatment is 4- 6 months faster.",
            "Appointments are short as changing wire is very smooth and fast in SLM.",
            "Overall very comfortable for the patient.",
          ],
        },
      ],
    },
    {
      slug: "tooth-colored-braces",
      name: "Tooth Colored Braces",
      blurb: "Get complete tooth-coloured braces treatment in Gurgaon to remove stains from your teeth. Visit us or call us @9711811272 to know the tooth coloured braces cost in Gurgaon and get the best tooth colored braces at affordable prices.",
      seoTitle: "Best Tooth Colored Braces Near Me in Gurgaon | Tooth Colored Braces Cost at @9711811272",
      seoDescription: "Get complete tooth-coloured braces treatment in Gurgaon to remove stains from your teeth. Visit us or call us @9711811272 to know the tooth coloured braces cost in Gurgaon and get the best tooth colored braces at affordable prices.",
      sections: [
        {
          heading: "Tooth Colored Braces",
          level: "h2",
          body: [
            "Get complete tooth-coloured braces treatment in Gurgaon to remove stains from your teeth. Visit us or call us @9711811272 to know the tooth coloured braces cost in Gurgaon and get the best tooth colored braces at affordable prices.",
            "Tooth Coloured Braces Are The Best Way To Get An Adult's Teeth Fixed Have you heard of ceramic braces? They are the same as your tooth coloured braces. Sometimes they have referred to as clear braces also. They are just another orthodontic implement to rectify bite problems and teeth straightening. At White Lily Dental we have tooth coloured braces that have corresponding wires and rubber bands that give more ease and comfort.",
          ],
        },
        {
          heading: "Why Are Our Tooth Coloured Braces Needed?",
          level: "h2",
          body: [
            "Many adults require braces all over the world, but they feel embarrassed to take them. Often their tooth problems lead to a loss of self-confidence and they retract into a shell. This hampers their daily life. This is why we have such adults and even children fitted with tooth coloured braces.",
            "We suggest this for adults because they have stopped growing and they need not be fixed from time to time as they outgrow each stage. And it also makes sure that correction happens more quickly and the braces break less often because of the teeth straining to grow.",
            "Our experts at White Lily Dental have the required expertise to help you regain your lost confidence. We will fit them into the front of your teeth and rectify your problems yet they will be invisible to the entire world. Our tooth coloured braces cost almost nothing compared to the benefits that you will derive from them.",
          ],
        },
        {
          heading: "The Pros Of White Lily Dental's Tooth Coloured Braces",
          level: "h2",
          body: [
            "We always suggest tooth coloured braces because they are a better option than metallic braces that can take the confidence away from you. They are the better option because they are not noticeable as they are either tooth coloured or clear.",
            "Our tooth coloured braces help the teeth to align faster than the normal braces. They take just about 18-36 months to straighten out your teeth. We can assure you that even the severest of conditions can be rectified by our dentists at White Lily Dental.",
            "We give you the option of choosing your own suitable color. We have ceramic braces of nearly every colour. So you will have the option of choosing coloured braces for teeth that you prefer.",
            "When you go for some kind of imaging and tests where the normal braces may interfere, we can promise you that our tooth coloured braces will not cause any hindrance. This is because ceramic braces do not much interfere with signals.",
          ],
        },
        {
          heading: "The Various Colours Of The Different Components That We Offer",
          level: "h2",
          body: [
            "We offer our patients the benefit of changing the colours of tooth coloured fixed braces and their various component parts. As the brackets are stuck to your teeth we offer them in white colour usually.",
            "As the archwires spiral around your teeth and strap all the brackets together, they apply pressure to your teeth. As a result, they straighten out. We offer you the choice of silver, frosted, white or blended in with brackets that are light in colour.",
            "The elastic band's tethers hooks on the brackets keeping the archwire in place. This in turn adjusts the position of the jaw and the teeth. We have these bands in almost any colour that you fancy. Or you can even choose from colours that match your skin colour or even a multicolor.",
            "We assure you that our dentists are experts at the job and can do you a fantastic job if you step in at White Lily Dental.",
            "As the name suggests ceramic braces are less visible when compared to metal braces. They blend with the tooth color and makes it less noticeable.",
          ],
        },
        {
          heading: "There are two types of ceramic braces used at WHITE LILY DENTAL:",
          level: "h2",
          list: [
            "CONVENTIONAL CERAMIC BRACES (CCB)",
            "SELF LIGATING CERAMIC BRACES (SLCB)",
          ],
        },
        {
          heading: "ADVANTAGES OF SLCB OVER CCB:",
          level: "h2",
          body: [
            "To make these braces even less noticeable, one can choose tooth colored wires for the treatment.",
            "Please talk to your orthodontist regarding the charges for treatment with ceramic braces.",
          ],
          list: [
            "SLCB are easier to clean by toothbrush.",
            "Treatment is 4- 6 months faster.",
            "Appointments are short as changing wire is exceptionally smooth and fast in SLM.",
            "Overall, amazingly comfortable for the patient.",
            "SLCB are even LESS NOTICEABLE when compared to CCB.",
          ],
        },
      ],
    },
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
    livePath: "/service/dental-implants",
    accent: { bg: "#E4F5F0", fg: "#0E9384" },
    iconImage: "/images/2.webp",
    icon: Bone,
    title: "Dental Implants",
    menuTitle: "Dental Implants",
    excerpt: "Permanent titanium replacements for missing teeth.",
    image: img("1681939282741-9ace0a227977"),
    imageAlt: "Dentist explaining dental implant treatment to a patient at a dental clinic in Gurugram",
    seoTitle: "Dental Implants in Gurgaon @9711811272 | Tooth Implant Cost Near Me",
    seoDescription: "Get the best and reliable solutions for Dental Implants in Gurgaon. We offer perfection and expertise with best implantologist. Contact to know the cost of dental implant.",
    tagline: "Dental Implants",
    sections: [
      {
        heading: "Dental Implants",
        level: "h2",
        body: [
          "Have you lost a tooth to a cavity? Are you willing to fill that place up with a substitute that will neither cause any damage to your gum, bone, nor the jawline? In that case, dental implants in Gurgaon can be your one-stop solution at any point in time. Make sure to choose the right kind of dental implant you need after consulting a veteran and professional dentist at White Lily Dental and feel better while eating, munching, or laughing.",
          "When it comes to a teeth implant clinic can be of much help, and with us, you can get the most reasonable rates to get the dental implant surgery done.",
        ],
      },
      {
        heading: "Dental Implant Experience with Us",
        level: "h2",
        body: [
          "Losing a tooth from the frontal arrangement is surely something to mourn about. If you lose any of the molar teeth, you would surely encounter discomfort while chewing or crushing nuts or something harder that needs all your molar teeth to exert pressure on the food item. For teeth implant clinics use advanced equipment that offers a painless experience. As for us, we make sure that you do not even get to realize that you are going through surgery. We provide a wholesome solution to guarantee the best dental implants in Gurgaon, from pre-surgery procedures to post-surgery care.",
        ],
      },
      {
        heading: "Our Rates Are Considerably Low",
        level: "h2",
        body: [
          "If dental implantation is what you need right now, you do not have to think about the dental implant cost in Gurgaon as long as you choose us. We keep the surgery packages well within reach of common people so that everyone can get the benefits of the wholesome services we offer. Consult with our expert dentists and fix a date according to your convenience to go through the surgery. With the latest technology and advanced equipment, we make sure that you do not have to spend much time or go through any hassle to get the surgery done.",
        ],
      },
      {
        heading: "We Offer End-To-End Solution",
        level: "h2",
        body: [
          "If the teeth implants cost is on your mind, you should first look at the list of teeth implants cost in Gurgaon and then check the same with our services. You would surely get all the surgery-related services available with us at a reasonable rate compared to the nationwide rates. Moreover, from consulting a dentist to know your requirements properly to getting over with the dental implant procedure in a hazardless manner, you get every solution available with us under one roof. This makes us one of the most opted for dentist clinic when it comes to dental implants near me.",
          "Be it the dental implant cost or the services associated; White Lily Dental offers you nothing short of the best. Dental treatment always needs special; care, attention, and expertise to ensure flawless results. At White Lily Dental, we provide every one of an experience utterly void of any hassle and a product that would be impeccable. For easy, fast, and dependable dental implant solutions, you can book an appointment with an expert dentist from our list of experts online as well.",
        ],
      },
    ],
    subServices: [],
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
    livePath: "/service/cosmetic-dentistry",
    accent: { bg: "#FBEFE2", fg: "#C2761A" },
    iconImage: "/images/oRnservice3.webp",
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    menuTitle: "Cosmetic Dentistry",
    excerpt: "Veneers, whitening and complete smile design.",
    image: img("1594932932930-b94355371d1f"),
    imageAlt: "Woman smiling confidently after cosmetic dentistry treatment in Gurugram",
    seoTitle: "Cosmetic Dentists Near Me in Gurgaon @9711811272 | Cosmetic Dentistry",
    seoDescription: "Make your smile a signature accessory with the best cosmetic dentist in Gurgaon. Visit White Lily Dental clinic for cosmetic dentistry at affordable prices.Book appointment today for cosmetic dental surgery.",
    tagline: "Cosmetic Dentistry",
    sections: [
      {
        heading: "Cosmetic Dentistry",
        level: "h2",
        body: [
          "Cosmetic surgeries becoming more often and when it comes to cosmetic dentistry, the process has evolved drastically over the past few decades, with science and technology advancing at a never before pace, the field of dentistry is receiving enough attention and registering equally impressive progress. We, at White Lily Dental, have imbibed all the advancements into the process of our wholesome dental care services to ensure that you get only the best from our end.",
          "From the best cosmetic dentist to the most affordable dental cosmetic surgery, you will get everything under one roof with us. We offer wholesome cosmetic dental treatment to assure you that you do not have to run from one dental clinic to another in search of solutions related to one problem from pre-surgery essentials to the post-surgery checkups, you would get everything available at White Lily Dental at cheap rates. You can search cosmetic dentist near me on Google from your device to find a clinic in your area.",
        ],
      },
      {
        heading: "Varied Range Of Basic Cosmetic Dentistry",
        level: "h2",
        body: [
          "No matter what your requirement is, we keep our services varied enough to match every dental cosmetic treatment requirement of yours. Here is a comprehensive list of the most common varieties of services that we offer.",
          "No matter if your teeth have lost the sparkling white tone or smoking has caused tobacco stains on your teeth, we offer easy cosmetic dentistry to make sure that you get back the good old pristine white teeth of yours. All these are simple cosmetic dentistry procedure that will neither rob you of your time or money.",
        ],
        list: [
          "Enamel Bonding",
          "Tooth Bleaching",
          "Dental Veneers",
          "Invisalign Braces",
          "Enamel Abrasion",
        ],
      },
      {
        heading: "Cosmetic Dental Surgeries",
        level: "h2",
        body: [
          "If you have a misaligned jaw-line or a bone that need mending to lend your teeth the perfect arrangement, cosmetic dental clinic offers a comprehensive range of dental surgeries to give you a look and the comfort you want. The primary goal of performing dental cosmetic surgeries remains to lend your teeth the best look so that you can smile with confidence. However, from the simple procedures like the ones mentioned above to the comparatively complex ones that need more attention and equipment, we offer every variety of dental cosmetic surgery.",
        ],
      },
      {
        heading: "A Painless Experience",
        level: "h2",
        body: [
          "Surgery is a term that often comes associated with pain. We can hardly think of a surgical process without thinking of pain. However, at White Lily Dental, you will get dental surgeries done minus any pain. Our expert dentists make sure that with the help of the latest equipment and techniques, your surgery gets over without letting your feel any pain. Any variety of surgery related to dental cosmetics is done at White Lily Dental, and you will get all of them available for you at a reasonable rate.",
          "Cosmetic dental surgery is a very modern technique to fix dental issues related to arrangements and alignments to lend your face the perfect look. However, the process is neither complicated nor time-consuming. With us, you would get fast, easy, and affordable solutions related to dental cosmetic surgeries at pocket-friendly rates. Make sure to choose any service by giving us a call and your appointment will be booked without any delay.",
        ],
      },
    ],
    subServices: [
    {
      slug: "digital-smile-designing",
      name: "Digital Smile Designing",
      blurb: "In search of a Digital Smile Designing treatment in Gurgaon, We offer the best and cost effective Smile Correction clinic in Gurgaon, with trained and experienced smile designers, advanced technology, elite and luxury dental services. For any related query contact us @9711811272",
      seoTitle: "Smile Correction Cost in Gurgaon | Digital Smile Designing @9711811272",
      seoDescription: "In search of a Digital Smile Designing treatment in Gurgaon, We offer the best and cost effective Smile Correction clinic in Gurgaon, with trained and experienced smile designers, advanced technology, elite and luxury dental services. For any related query contact us @9711811272",
      sections: [
        {
          heading: "Digital Smile Designing",
          level: "h2",
          body: [
            "In search of a Digital Smile Designing treatment in Gurgaon, We offer the best and cost effective Smile Correction clinic in Gurgaon, with trained and experienced smile designers, advanced technology, elite and luxury dental services. For any related query contact us @9711811272",
            "Advantages Of Digital Smile Designing (DSD) for Smile Correction The first thing you notice when you meet a person is their smile. People with beautiful smiles always appear charming. However, not everyone is blessed with a bright smile. If you are conscious of your smile due to varying reasons like crooked teeth, discolored teeth, etc, smile correction is the way to go. Smile correction is no longer a luxury, with so many dental clinics available in the market space that offer quality digital smile designing (DSD) at affordable prices to their customers. Listed below are a few advantages of digital smile designing (DSD).",
          ],
        },
        {
          heading: "Customized service",
          level: "h2",
          body: [
            "DSD smile design is the perfect solution for patients having varied dental treatment requirements depending upon the condition of their teeth. It offers a customized solution for the best dental treatment for every patient. The dental procedure and treatment are tailored as per patient dental needs.",
          ],
        },
        {
          heading: "Advanced software",
          level: "h2",
          body: [
            "The digital dental design uses advanced and modern software that provides realistic simulation allowing the patient to see the outcome that can be achieved before the final treatment. It allows the patient and doctor to make any changes before the treatment thereby reducing the chances of unpleasant surprises later. Several established and coveted dental clinics around the country use advanced software to tailor their patient DSD smile design.",
          ],
        },
        {
          heading: "Higher precision",
          level: "h2",
          body: [
            "DSD dental technology allows the doctor to capture the smallest oral detail. This digital dental design helps doctors to freely communicate their treatment solutions and procedure to their patients that is most feasible for them. This way Patients can also contribute to the dental treatment.",
          ],
        },
        {
          heading: "Enhanced Chew Ability",
          level: "h2",
          body: [
            "Another benefit of DSD smile design is that they help to correct any abnormality and enhance chewability. It allows the patient to devour their favorite food items without having to worry about the dental problem.",
          ],
        },
        {
          heading: "Improved smile",
          level: "h2",
          body: [
            "Due to DSD's precise and customized dental treatment, the patient is guaranteed an improved smile at the end of the treatment. The advanced technology helps rectify any problems or abnormalities and ensures the perfect smile for the patient.",
            "DSD is the ideal solution for all types of dental problems and adds positively to any patient smile. Smile correction costs are affordable starting from 5000 to upwards depending upon the treatment and dental condition of the patient. Gummy smile correction price may begin from 7000 to upwards for laser treatment depending upon the condition of the patient's gum. You must opt for a reputable and experienced dental clinic to help you with your smile correction for value-added service.",
            "White Lily Dental offers a one-stop solution for digital smile designing (DSD) within the country. We have a team of Specialists from all fields of dentistry and guarantee quality and painless dental treatment for our patients. Our clinic is equipped with cutting-edge DSD equipment and instruments, soothing ambiance, along trained professionals to ensure the best dental treatment experience. Our digital smile design cost is also reasonable. We offer specialized dental healthcare for children, pregnant ladies, patients with heart conditions and disabilities for value-added service for our existing clientele.",
          ],
        },
      ],
    },
    {
      slug: "teeth-whitening",
      name: "Teeth Whitening (Instant)",
      blurb: "Get advanced teeth whitening treatment at best dental clinic in Gurgaon. Our experts will ensure the best and lasting treatment and make your smile more beautiful. Call us today to schedule an appointment and know teeth whitening cost and procedure @9711811272.",
      seoTitle: "Teeth Whitening Near Me in Gurgaon, Teeth Whitening Cost | Teeth Polishing and Scaling @9711811272",
      seoDescription: "Get advanced teeth whitening treatment at best dental clinic in Gurgaon. Our experts will ensure the best and lasting treatment and make your smile more beautiful. Call us today to schedule an appointment and know teeth whitening cost and procedure @9711811272.",
      sections: [
        {
          heading: "Teeth Whitening (Instant)",
          level: "h2",
          body: [
            "Get advanced teeth whitening treatment at best dental clinic in Gurgaon. Our experts will ensure the best and lasting treatment and make your smile more beautiful. Call us today to schedule an appointment and know teeth whitening cost and procedure @9711811272.",
          ],
        },
      ],
    },
    {
      slug: "veneer",
      name: "Veneer",
      blurb: "The White Lily Dental offers safe and cost affordable dental veneers treatment using Porcelain (Indirect), Composite (Direct) in Gurgaon by experienced and professional dentists. Contact us to know Veneers Treatment cost and procedure @9711811272.",
      seoTitle: "Veneer Teeth Treatment in Gurgaon | Veneers For Teeth Near Me @9711811272",
      seoDescription: "The White Lily Dental offers safe and cost affordable dental veneers treatment using Porcelain (Indirect), Composite (Direct) in Gurgaon by experienced and professional dentists. Contact us to know Veneers Treatment cost and procedure @9711811272.",
      sections: [
        {
          heading: "Veneer",
          level: "h2",
          body: [
            "The White Lily Dental offers safe and cost affordable dental veneers treatment using Porcelain (Indirect), Composite (Direct) in Gurgaon by experienced and professional dentists. Contact us to know Veneers Treatment cost and procedure @9711811272.",
            "Types and Top Benefits of applying Dental Veneer Our teeth play a vital role in human life. These teeth help us to digest food easily and efficiently. The Teeth help us to talk and speak distinctly. These teeth provide a healthy mouth to us that can help to achieve anything in communication. A good smile can give confidence, influence social lives, relationships and careers. A distinct and healthy smile can truly change our visual appearance, the positivity of our mindset and also improve the health of our body and mouth. But with time teeth starts wearing out and can cause harm to our body. Therefore, it is advised by doctors to avoid chips, cracks, and other oily food that causes dental problems. Therefore, veneer teeth are fitted to cover all types of cracks.",
            "However, covering teeth with dental veneers can help to restore the shine of a smile. The dental veneer is shell full of teeth, and it uses tooth-coloured materials that are fitted over natural teeth to cover cracks and also defects, including stains and yellow colour of teeth. These dental veneers are used to cover front teeth and to change the shape, colour and size and appearance of natural teeth. There are three types of dental veneers available in the market are porcelain veneers, ceramic veneers and composite veneers. Make research about the best veneer teeth treatment in your locality for the best treatment.",
          ],
        },
        {
          heading: "Types of Veneers",
          level: "h2",
        },
        {
          heading: "Porcelain Veneers",
          level: "h3",
          body: [
            "Porcelain is the most attractive and less harmful material available for dental restorations. Porcelain veneers are the strongest and durable of all veneer materials. Porcelain veneers are less harmful to the gum tissues in the mouth. These veneers can improve the appearance of a smile as it is natural-looking. Porcelain veneers are permanent and also requires some tooth shaving before placing them in the mouth. Here are some of the features of porcelain veneers:",
            "These porcelain veneers cost is more than other veneers. Due to its durability, the cost of veneer is more and it can last up to 15 years. This porcelain laminate veneer is beneficial and also gives protection to other teeth.",
          ],
          list: [
            "These veneers are thin in comparison with other types of veneers.",
            "They give a natural tooth appearance experience.",
            "These veneers can last up to 15 years and are durable.",
            "These porcelain veneers are expensive and also require polishing paste.",
            "These veneers are smooth and have a tooth-like texture.",
            "These veneers are delicate and cannot be repaired easily. They have a low chance of fracture and breakage.",
            "These veneers are protective against gums and surrounding teeth.",
          ],
        },
        {
          heading: "Composite Veneers",
          level: "h3",
          body: [
            "The Composite veneers are available at affordable prices. The veneers are popular due to their cost-effectiveness. Composite veneers can be replaced in one treatment and thus reduce numerous dental visits. These are composed of composite resin, and it is a mixture of inorganic and organic materials. The veneer price is determined by the quality, size and colour. These veneers are affordable and can be blended with natural tooth colour. Listed below are some of the features of composite veneer",
            "1. Composite veneers require less tooth preparation",
            "2. The cost of composite veneer is affordable",
            "3. Composite veneers have high-quality materials to look natural",
            "4. They are likely to get a break and stain.",
            "5. They have less life span and gets broken early",
          ],
        },
        {
          heading: "Ceramic Veneers",
          level: "h3",
          body: [
            "Ceramic veneers are an excellent choice for many patients and it is highly popular for their natural appearance, durability and can replace natural teeth. Ceramic veneers are excellent and can provide natural teeth experience. These veneer teeth prices are affordable and also likely to get a break. These types of veneers can be repaired easily and efficiently.",
            "Listed are some of the advantages of Dental veneers.",
            "Dental veneers are used to fix the cracks, chips and other cosmetic issues while smiling or talking. The Veneers are advised only on the consultation of the dentist.",
            "These dental veneers are used to replace natural teeth. However, replacing dental does not require anesthesia. These save dental veneer costs as compared to normal anesthesia. This veneer treatment is affordable and does not require many problems for the patient.",
            "These dental veneers require less time to fit your mouth and within less time dentist prepares such veneer. This veneer helps to smile easily and also looks good on your face. This veneer gives confidence. The veneer cost is affordable and it gives them the confidence to speak in public easily.",
            "The Dental Veneers are polished, stain-resistant. Therefore, this veneer requires maintenance like dental checkups with the dentist. These dental veneers are non-porous and help in resistance to stains and cavities than the natural tooth. The veneer teeth cost can be maintained easily and efficiently.",
            "Veneers are laminates and are composed of ceramic, porcelain, composite bonding materials. You can find veneer near me if you search on Google. The veneer laminate cost is affordable and also available at expensive rates. These veneers are placed on front teeth to look great. The dental veneer cost is affordable and can be replaced for any age group for better health of the mouth.",
          ],
          list: [
            "Cover Cracks, and other cosmetic issues",
            "Keep More Natural Tooth Structure",
            "Smile with the Confidence",
            "Enjoy Simple Maintenances",
          ],
        },
      ],
    },
    {
      slug: "white-dental-fillings",
      name: "White Dental Fillings",
      blurb: "Repair decayed or damaged tooth white dental fillings. Call us @9711811272 to know about procedure, treatment, cost of white fillings for teeth in Gurgaon. Give your teeth the best care and treatment.",
      seoTitle: "White Dental Fillings Cost in Gurgaon @9711811272 | White Fillings For Teeth Near Me",
      seoDescription: "Repair decayed or damaged tooth white dental fillings. Call us @9711811272 to know about procedure, treatment, cost of white fillings for teeth in Gurgaon. Give your teeth the best care and treatment.",
      sections: [
        {
          heading: "White Dental Fillings",
          level: "h2",
          body: [
            "Repair decayed or damaged tooth white dental fillings. Call us @9711811272 to know about procedure, treatment, cost of white fillings for teeth in Gurgaon. Give your teeth the best care and treatment.",
            "Top Reasons White Fillings Is A Go-To Filling For Patient After Root Canal Tooth decay has become a common problem, and many of us have to take the help of dental filling to help restore our teeth' natural strength and structure. Dental Filling is a common and frequently requested treatment among many dental clinics. It is a non-invasive dental restorative treatment and is available in multiple filling options for the patient to choose from. White Filling is a natural-looking filling that blends seamlessly with the natural tooth, and hence it is a popular choice for dental filling amongst patients. Given are some of the top reasons white fillings are a go-to filling for the patient.",
          ],
        },
        {
          heading: "Reduced sensitivity",
          level: "h2",
          body: [
            "White filling utilizes composite resin that does not transfer heat therefore helping avoid sensitivity while consuming cold or hot food items. These white tooth fillings help insulate the tooth from different temperature fluctuations resulting in reduced sensitivity for the patient. It allows the patient to enjoy their food and drink without having to worry about any tooth problems.",
          ],
        },
        {
          heading: "Safe",
          level: "h2",
          body: [
            "Unlike metal resin that is known to strain your mouth over time with daily use, white cavity filling are a much safer option. These composite filling are considered to be free of dangerous chemical and biocompatible therefore white fillings for teeth is a go-to choice for many patients after the root canal.",
          ],
        },
        {
          heading: "Seamless Results",
          level: "h2",
          body: [
            "White dental fillings are identical to the natural tooth colour and are cosmetically pleasing to the eye. White composite fillings front teeth is an ideal solution for patients that want to perfect and natural-looking teeth after their root canal. These filings are very pliable before they hardened and can be polished later to give the most natural-looking tooth for the patient.",
          ],
        },
        {
          heading: "Better Seal",
          level: "h2",
          body: [
            "White fillings for teeth offer better seals than any other filling options available in the market space. These are connected to the surface of the patient tooth and hence help strengthen the tooth structure.",
          ],
        },
        {
          heading: "Less Drilling",
          level: "h2",
          body: [
            "White fillings for the cavity are popular as these are less invasive and help preserve the structure of the tooth. These do not need mechanical retention and hence do not contribute to the weakening of the tooth.",
            "A white filling can last for a long time depending on how well they are done by the doctor. The white filling cost may vary depending on various factors as the size of the filling, the condition of the tooth, etc. White filling maintenance is relatively easy with proper care and avoiding food items that are hard as they can wear of the filling in the tooth. Replacing filling after wear and tear can help prevent tooth decay. However, you must ensure that you are doing this dental treatment under the supervision of trained and qualified professionals to ensure high-quality service.",
            "White Lily Dental is notable in dentistry and provides world-class white filling for cavity solutions to their clients. Our dental solutions are effective and can help restore tooth structure and strength. We offer white filling treatments that are durable, customized, and safe for maximum client satisfaction. Our charges are fair and much demand the best customer service.",
          ],
        },
      ],
    },
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
    livePath: "/service/root-canal-treatment",
    accent: { bg: "#E4F1F6", fg: "#0E7CA0" },
    iconImage: "/images/Ntxservice4.webp",
    icon: Activity,
    title: "Root Canal Treatment",
    menuTitle: "Root Canal Treatment",
    excerpt: "Painless RCT that saves an infected tooth.",
    image: img("1684607633251-8a4a8d94ddd2"),
    imageAlt: "Dentist performing a root canal treatment on a patient in a modern dental clinic",
    seoTitle: "Painless Root Canal Treatment In Gurgaon @9711811272 | Root Canal Treatment Cost | Painless Root Canal Treatment Near Me",
    seoDescription: "Root canal treatment can save your tooth. Get cost efficient root canal treatment done by the best RCT dentist in Gurgaon at White Lily Dental Clinic. Book now and know more information about Root Canal Treatment Cost. Call us @ 9711811272",
    tagline: "Root Canal Treatment",
    sections: [
      {
        heading: "Root Canal Treatment",
        level: "h2",
        body: [
          "Root canalling is probably one of the most critical surgeries done to ensure the removal of contaminated dental roots and prevent contamination to the neighboring teeth. Hence, dental root canal treatment is essential when required and must be done precisely to ensure that the same does not cause any retaliation amongst the roots and the gum surrounding the affected tooth. The dental root canal often needs the patients to come for more than one sitting. Hence, the process is undoubtedly critical and time-consulting and needs expert intervention.",
          "At White Lily dental, we make sure that every root canal surgery gets over in as much painless way as possible. Also, we have the best dentists by our side, ensuring careful handling of each case and flawless surgeries leading to complete removal of the affected root and a stop to spreading the bacterial infection across the rest of the teeth. You just need to type best root canal treatment near me on google search to get the location of the clinic.",
        ],
      },
      {
        heading: "Affordable Prices",
        level: "h2",
        body: [
          "The cost associated with the root canalling procedure can concern you if you need one immediately. However, if your dentist has advised you to go for a root canalling, you can depend on our dental root canal treatment cost. We make sure that the costs are kept as low as possible so that everyone gets to enjoy our services' benefits without burning a significant hole in their pockets. Or you just simply type root canal treatment cost near me on search to know the price details.",
          "In general, you will find the dental root canal cost to be a little higher than most of the other varieties of dental surgeries. However, you should also keep in mind that it is one of the most sophisticated dentistry surgical processes and involves time, effort, and advanced equipment.",
        ],
      },
      {
        heading: "Our Offers",
        level: "h2",
        body: [
          "When choosing the best roots dental clinic near you, you can always depend on our services. Here is what makes us one of the market leaders and one of the most trusted names as well.",
          "Suppose you are looking for a competent dental clinic for surgeries related to dental roots Gurgaon. In that case, you can always rely on our range of services that encompass almost every possible service associated with dental root canal surgeries.",
          "From consultancy to surgery, you would get adequate assistance at affordable rates with us. Make sure to call us and get an appointment if you need any solution to your dental problems. Never ignore even a minor toothache as it could ultimately become big-time trouble if not taken care of in time.",
        ],
        list: [
          "We offer every service related to dental problems root canal, etc., under one roof",
          "We keep the prices reasonable",
          "We have the best dentists to check you and treat you",
          "We offer painless surgeries",
          "Booking an appointment is easy with uOnline consultancies are available from time to time",
          "We keep the clinic hygienically perfect",
          "We do not compromise on the quality of treatment no matter what",
          "Our patients remain our focus, and we offer individual attention to each",
        ],
      },
    ],
    subServices: [],
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
    livePath: "/service/crowns-and-bridges",
    accent: { bg: "#F7EFDD", fg: "#A8801F" },
    iconImage: "/images/L1uservice5.webp",
    icon: Crown,
    title: "Crowns and Bridges",
    menuTitle: "Crowns and Bridges",
    excerpt: "Zirconia and ceramic crowns that rebuild teeth.",
    image: img("1643660526741-094639fbe53a"),
    imageAlt: "Dental technician matching the shade of a ceramic crown for a patient",
    seoTitle: "Dental Crown and Dental Bridges Cost In Gurgaon @9711811272 | Dental Bridge | Tooth Bridge",
    seoDescription: "Visit White Lily Dental clinic in Gurgaon for dental crown and dental bridges. Get world class and affordable treatment for modern tooth crown and tooth bridge by our professional dentist. Call us @9711811272 to know tooth cap cost in India.",
    tagline: "Crowns and Bridges",
    sections: [
      {
        heading: "Crowns and Bridges",
        level: "h2",
      },
      {
        heading: "Retain the Natural Shape of your Face with Dental Bridges",
        level: "h2",
        body: [
          "A dental bridge is a prosthesis fixed in place of missing tooth/teeth. Well, a misplaced tooth is a dangerous oral health issue. In human beings, teeth work in a collaborative manner. When you lose teeth/tooth, the surrounding teeth tilt into the empty space.",
          "Also, with missing teeth, there are high chances of shrinking bones. Over the time, you look older due to gaps in between teeth. At White Lily Dental, dental bridges are provided to replace missing teeth at a pocket-friendly price.",
        ],
      },
      {
        heading: "Types of Dental Bridges Available with White Lily Dental",
        level: "h2",
        body: [
          "At White Lily Dental, our dentists mainly provide two types of dental bridge treatment procedures. They are the traditional dental bridge and the implant-supported dental bridge. Let's take a glance at each type to understand them better.",
        ],
      },
      {
        heading: "Traditional Dental Bridge",
        level: "h3",
        body: [
          "An aspect of dental bridge cost in India is a common inquiry of patients. But we always provide our patients with transparent pricing. At White Lily Dental, we provide quality traditional dental bridge system. In the traditional dental bridge framework, the artificial teeth are held in place by dental crowns. Note that it is the most preferred form of treatment when you have natural teeth on both sides of the gap.",
        ],
      },
      {
        heading: "Implant-supported Dental Bridge",
        level: "h3",
        body: [
          "We always strive to provide you with a dental bridge cost estimate while treating missing teeth with implants. We use dental implants extensively to support a bridge. Implants are posts that are surgically placed in the jaw.",
          "A key benefit of opting for implants is that they don't need support from surrounding teeth. You should be in good general health and have enough bone in case you want implants. Our professional dentists would formulate a special dental treatment plan which you have to follow for implants.",
        ],
      },
      {
        heading: "Ways to Care for your Dental Bridge",
        level: "h3",
        body: [
          "To avoid dental bridge problems, here are some of the best ways to care for them. Don't hesitate to visit us if you are facing prolonged issues with your implants and bridges.",
          "Say goodbye to missing teeth with our effective and proven bridge dental services. Schedule an appointment today to know more about the treatment process.",
        ],
        list: [
          "A cantilever bridge dental can fail if you don't take proper care of it. Brushing and cleaning your teeth helps eradicate plaque. Contact our expert dentists today to get tips to maintain oral hygiene.",
          "You are recommended to opt for the post-surgical follow-up at White Lily Dental without fail.",
          "Eat a balanced and healthy diet",
        ],
      },
      {
        heading: "Restore the Look and Function of Damaged Tooth with Dental Crowns",
        level: "h2",
        body: [
          "In dentistry terms, a dental crown is a cap or cover put over the tooth. The crown plays a crucial role in restoring the tooth to its normal shape, size, and function. Crowns are also referred to as tooth-shaped caps that restore your smile. At White Lily Dental, we deal with a wide variety of dental crowns. Let's take a glance at the various aspects of opting for crown dental at White Lily Dental.",
        ],
      },
      {
        heading: "Common Causes of Getting a Dental Crown",
        level: "h2",
        body: [
          "Here are some of the common reasons to opt for dental crowns.",
        ],
        list: [
          "Covering the area of implants",
          "Decay and damage to natural tooth",
          "Replacing a large filling",
          "Aligning your jaw",
          "To achieve a more beautiful smile",
        ],
      },
      {
        heading: "Types of Dental Crowns you should choose",
        level: "h2",
        body: [
          "Here are some dental crown types available with us. Note that you have to schedule an appointment with us before opting for dental crowns. We would assess your jawline and general health conditions before installing crowns.",
        ],
      },
      {
        heading: "Gold Crowns",
        level: "h3",
        body: [
          "As the name suggests, they are made primarily of gold. However, they also contain other metals like copper and nickel. One of the main benefits of gold crowns is their durability and strength. However, they don't look like a natural tooth, which is a bit of a disappointment.",
        ],
      },
      {
        heading: "Zirconia Crowns",
        level: "h3",
        body: [
          "Zirconia crowns are relatively new and combine the strength of metal with porcelain. Layered and translucent zirconia has emerged as a popular choice nowadays. They provide great aesthetics that are durable.",
        ],
      },
      {
        heading: "Porcelain Crowns",
        level: "h3",
        body: [
          "Porcelain dental crowns and bridges are the most widely used bridges nowadays. They render the user with the most natural look. Quite interestingly, they are often referred to as the best option for front teeth restorations. Moreover, they are non-toxic as there is no usage of any metal.",
          "You can contact us at the earliest if you want to know about dental crown costs and other related aspects.",
          "At White Lily Dental, you would avail holistic dental care for your problems. Note that dental crowns and bridges are long-lasting. They are a restorative form of treatment which protects the cavities for a long period of time.",
          "Also, there are various types of dental crown problems that can be best avoided if you contact us. Our expert dentists would first assess your overall health condition to install crowns.",
          "Contact us today and get detailed information about dental crown cost India.",
        ],
      },
    ],
    subServices: [
    {
      slug: "emax",
      name: "Emax",
      blurb: "We offer the best and low-cost Emax Crowns in Gurgaon. Get your query answered 24*7 only on White Lily Dental just make a call @9711811272. Learn more about Emax crown treatments and how they can strengthen your teeth and give you a more natural-looking smile.",
      seoTitle: "Emax Dental Crown Treatment in Gurgaon @9711811272 | Emax Crown Cost",
      seoDescription: "We offer the best and low-cost Emax Crowns in Gurgaon. Get your query answered 24*7 only on White Lily Dental just make a call @9711811272. Learn more about Emax crown treatments and how they can strengthen your teeth and give you a more natural-looking smile.",
      sections: [
        {
          heading: "Emax",
          level: "h2",
          body: [
            "We offer the best and low-cost Emax Crowns in Gurgaon. Get your query answered 24*7 only on White Lily Dental just make a call @9711811272. Learn more about Emax crown treatments and how they can strengthen your teeth and give you a more natural-looking smile.",
          ],
        },
      ],
    },
    {
      slug: "metal",
      name: "Metal",
      blurb: "Get your cracked, chipped, or broken tooth fixed with metal crowns by our expert and best dentists in Gurgaon. Call us today to schedule an appointment or for any related query @9711811272.",
      seoTitle: "Metal Dental Crown at Best Price in Gurgaon @9711811272 | Metal Crown For Teeth",
      seoDescription: "Get your cracked, chipped, or broken tooth fixed with metal crowns by our expert and best dentists in Gurgaon. Call us today to schedule an appointment or for any related query @9711811272.",
      sections: [
        {
          heading: "Metal",
          level: "h2",
          body: [
            "Get your cracked, chipped, or broken tooth fixed with metal crowns by our expert and best dentists in Gurgaon. Call us today to schedule an appointment or for any related query @9711811272.",
          ],
        },
      ],
    },
    {
      slug: "porcelain-layer-over-metal",
      name: "Porcelain Layer Over Metal",
      blurb: "We provide cost affordable Porcelain Teeth treatment in Gurgaon, Call us @9711811272 to get relief from your dental-related problems. Find out the pros and cons of Porcelain veneers from the experts.",
      seoTitle: "Best Porcelain Teeth Treatment in Gurgaon @9711811272 | Porcelain Veneers Cost",
      seoDescription: "We provide cost affordable Porcelain Teeth treatment in Gurgaon, Call us @9711811272 to get relief from your dental-related problems. Find out the pros and cons of Porcelain veneers from the experts.",
      sections: [
        {
          heading: "Porcelain Layer Over Metal",
          level: "h2",
          body: [
            "We provide cost affordable Porcelain Teeth treatment in Gurgaon, Call us @9711811272 to get relief from your dental-related problems. Find out the pros and cons of Porcelain veneers from the experts.",
          ],
        },
      ],
    },
    {
      slug: "zirconia",
      name: "Zirconia",
      blurb: "Zirconia crowns offer several advantages, including durability for your teeth. Zirconia will be best for your damaged tooth. Call us today @9711811272 to book an appointment or for any dental-related query such as Zirconia Crowns Cost in Gurgaon.",
      seoTitle: "Zirconia Crown in Gurgaon @9711811272 | Zirconia Crowns Cost Near Me",
      seoDescription: "Zirconia crowns offer several advantages, including durability for your teeth. Zirconia will be best for your damaged tooth. Call us today @9711811272 to book an appointment or for any dental-related query such as Zirconia Crowns Cost in Gurgaon.",
      sections: [
        {
          heading: "Zirconia",
          level: "h2",
          body: [
            "Zirconia crowns offer several advantages, including durability for your teeth. Zirconia will be best for your damaged tooth. Call us today @9711811272 to book an appointment or for any dental-related query such as Zirconia Crowns Cost in Gurgaon.",
          ],
        },
      ],
    },
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
    livePath: "/service/dentures",
    accent: { bg: "#EEEAF9", fg: "#6746C3" },
    iconImage: "/images/wl0service6.webp",
    icon: Layers,
    title: "Dentures Treatment",
    menuTitle: "Dentures Treatment",
    excerpt: "Complete, partial and implant-supported dentures.",
    image: img("1681939282781-341ac4f61996"),
    imageAlt: "Prosthodontist discussing denture options with a patient during a consultation in Gurugram",
    seoTitle: "Teeth Denture Near Me @9711811272 | Denture Cost in Gurgaon",
    seoDescription: "Get denture teeth clinic in Gurgaon to replace missing teeth and tissues. Visit us or call us @9711811272 to know denture cost, and procedure of denture set.",
    tagline: "Dentures",
    sections: [
      {
        heading: "Dentures Treatment",
        level: "h2",
        body: [
          "What Are Dentures? Dentures or prosthetic teeth are a type of removable device that is used to repair lost teeth and tissues. They are prosthetic teeth that allow the human mouth to operate normally. Prosthetic teeth come in two varieties: whole dentures and fractional dentures. When all the teeth are lost, complete dentures are recommended, whereas partial dentures are used when only a few natural teeth are lost. They're created to fit a certain set of teeth and gum area.",
          "White Lily Dental provides the greatest quality dental treatment while employing cutting-edge dental technology. We use cutting-edge technology to enable more accurate diagnosis and more pleasant artificial teeth set operations.",
        ],
      },
      {
        heading: "Complete Dentures Teeth",
        level: "h2",
        body: [
          "Complete dentures are designed to fit over the top teeth and roof, as well as the bottom teeth in a horseshoe shape. They are traditional dentures that are taken out at night to be cleaned. Partial dental dentures are made up of missing teeth that are joined to artificial gums by a supporting structure that keeps the denture in place. Because missing teeth might cause other teeth to shift, partial dentures can assist to resolve this issue and maintaining the teeth in place.",
        ],
      },
      {
        heading: "The Advantages of Dentures",
        level: "h2",
        body: [
          "Denture teeth are popular among patients because they are so easy to use. Dentures can substitute teeth in a non-invasive manner if you require a complete or partial set. There is no need for surgery, and temporary dentures can be fitted right away. This is a simple and quick approach. If you want something which feels more natural, you may seek cosmetic dental surgery.",
        ],
      },
      {
        heading: "The Many Types of Artificial Teeth",
        level: "h2",
        list: [
          "Porcelain and acrylic resin are used to make dentures",
          "Dentures made of porcelain appear more natural and blend in better with the remaining teeth. Porcelain, on the other hand, is readily broken and can wear down the existing teeth, therefore it is best utilized as a denture instead of a partial",
          "Dentures made of acrylic resin, on the contrary, are compact and easy to modify. They are well-fitting and enable jaw movement more natural",
        ],
      },
      {
        heading: "How Should Take Care of Your Dentures Teeth?",
        level: "h2",
        body: [
          "Because they are artificial and detachable, it is critical to managing them with attention. The following suggestions should be considered if you wish your dentures to last longer:",
          "Always brush your dentures with a non-abrasive brush at least once a day to keep them clean. Even though they are fake, plaque and germs can accumulate on the teeth, inflicting harm to the surrounding teeth and gums. If at all feasible, withdraw your dentures after each meal and wash them in warm water; however, when you wear complete dentures, brushing will suffice.",
          "Immerse your dentures in water or denture liquid at night, as directed by your denture's dentist. Avoid using chlorine with your dentures to keep them from deteriorating. When placing on dentures in the morning, ensure sure to rinse them with fresh water to eliminate any chemicals that may have accumulated throughout the soaking procedure.",
          "Check your dentures regularly and see your dentures dentist if they get loose, slip, or if you notice a change in your bite. Diseases and discomforts can result from ill-fitting dentures.",
        ],
        list: [
          "Maintain the cleanliness of your Artificial Teeth Set",
          "Overnight Security",
          "Keep An Eye on Your Dentures",
        ],
      },
      {
        heading: "Artificial Teeth Price",
        level: "h2",
        body: [
          "The teeth set price varies based on several criteria, notably the materials utilized, the number of teeth restored, and the manufacturing method. Before getting partial dentures, you may need to get some dental work done. In such circumstances, the cost may rise somewhat.",
          "If you want a customized natural-looking tooth restoration alternative, contact us now to discover more about veneers and partial dentures.",
        ],
      },
    ],
    subServices: [
    {
      slug: "complete-dentures",
      name: "Complete Dentures",
      blurb: "Get complete denture treatment in Gurgaon to replace missing teeth and tissues. Visit us or call us @9289288848 to know treatment cost, and procedure of complete denture set.",
      seoTitle: "Complete Denture Teeth in Gurgaon | Find Denture Teeth Cost @9711811272 | Teeth Denture Dentist",
      seoDescription: "Get complete denture treatment in Gurgaon to replace missing teeth and tissues. Visit us or call us @9289288848 to know treatment cost, and procedure of complete denture set.",
      sections: [
        {
          heading: "Complete Dentures",
          level: "h2",
          body: [
            "Get complete denture treatment in Gurgaon to replace missing teeth and tissues. Visit us or call us @9289288848 to know treatment cost, and procedure of complete denture set.",
          ],
        },
      ],
    },
    {
      slug: "immediate-dentures",
      name: "Immediate Dentures",
      blurb: "Get immediate denture teeth treatment in Gurgaon to replace missing teeth and tissues. Visit or call us @9711811272 to know the treatment cost and location of a clinic for immediate dentures near Gurgaon",
      seoTitle: "Immediate Dentures Near Me in Gurgaon | Immediate Dentures Cost @9711811272",
      seoDescription: "Get immediate denture teeth treatment in Gurgaon to replace missing teeth and tissues. Visit or call us @9711811272 to know the treatment cost and location of a clinic for immediate dentures near Gurgaon",
      sections: [
        {
          heading: "Immediate Dentures",
          level: "h2",
          body: [
            "Get immediate denture teeth treatment in Gurgaon to replace missing teeth and tissues. Visit or call us @9711811272 to know the treatment cost and location of a clinic for immediate dentures near Gurgaon",
          ],
        },
      ],
    },
    {
      slug: "removable-partial-dentures",
      name: "Removable Partial Dentures",
      blurb: "Doctors For removal partial denture (rpd) in Gurgaon, Call us @9711811272 to get removable partial denture near you and book appointment online . Feel free to contact us to clear your related queries or doubts.",
      seoTitle: "Removable Partial Denture Doctors in Gurgaon @9711811272 | Removable Partial Denture Cost",
      seoDescription: "Doctors For removal partial denture (rpd) in Gurgaon, Call us @9711811272 to get removable partial denture near you and book appointment online . Feel free to contact us to clear your related queries or doubts.",
      sections: [
        {
          heading: "Removable Partial Dentures",
          level: "h2",
          body: [
            "Doctors For removal partial denture (rpd) in Gurgaon, Call us @9711811272 to get removable partial denture near you and book appointment online . Feel free to contact us to clear your related queries or doubts.",
          ],
        },
      ],
    },
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
    livePath: "/service/simple-tooth-removal",
    accent: { bg: "#E9EFF9", fg: "#2B5FA8" },
    iconImage: "/images/UUoservice7.webp",
    icon: Scissors,
    title: "Simple Tooth Removal",
    menuTitle: "Simple Tooth Removal / Extractions",
    excerpt: "Gentle removal of damaged or decayed teeth.",
    image: img("1606811856475-5e6fcdc6e509"),
    imageAlt: "Dentist explaining a tooth extraction procedure to a patient in a treatment room",
    seoTitle: "Simple Tooth Extraction In Gurgaon | Painless Tooth Surgery | Find Tooth Extraction Cost @9289288848",
    seoDescription: "Worried about simple tooth extraction pain? Visit White Lily Dental in Gurgaon for painless tooth extraction or tooth surgery . Call us @9711811272 to book an appointment now.",
    tagline: "Simple Tooth Removal (Extractions))",
    sections: [
      {
        heading: "Simple Tooth Removal",
        level: "h2",
        body: [
          "What comes to your mind at first when you think of tooth extraction? Surely pain and suffering are the things that dominate the thought process. But, we at White Lily Dental offer a painless tooth extraction that will leave you with minimum restrictions post extractions. Earlier, after a tooth extraction, diet restriction, talking restrictions were imposed.",
          "But, technology has progressed far beyond our imagination, and today, tooth removal is not a process as hazardous as it used to be. We make sure that you do not have to go through any amount of hassle if any tooth of yours is troubling you for long. Our expert dentists make sure that you experience a painless tooth extraction process involving no pain, pain killers, and restrictions.",
        ],
      },
      {
        heading: "Tooth Extraction Cost",
        level: "h2",
        body: [
          "With us, you would get the most reasonable rates for tooth extraction. We keep all our charges low, and no hidden charges are there for availing of any of our services. What you see is what you pay. You can go through our portal to check the prices.",
          "Booking an appointment with us is also easy. All you have to do is just give us a call, and our executive will check the available dates for you. You can also request a particular time or day of the week. If schedules are free, our executives will help you get the booking done accordingly.",
        ],
      },
      {
        heading: "End-To-End Support",
        level: "h2",
        body: [
          "We keep our clinic equipped with all the latest and advanced machines, tools, and devices to make sure that you get the best experience when you come to get your tooth extracted. From imaging facilities to post-extraction support, you will get everything under one roof with us. After the extraction is done, our dentist would offer you advice on the post-extraction care tips. Also, you will be provided with a prescription to follow for an early recovery.",
          "Typically, a tooth extraction will not keep you under a prescription for more than 3 days. In most of the cases, patients recover with 24-48 hours of the extraction. Therefore, we offer an end-to-end solution starting from taking the X-ray of your tooth to be extracted to offering you post-extraction care essentials.",
        ],
      },
      {
        heading: "Expert's Suggestions",
        level: "h2",
        body: [
          "After tooth extraction, one must follow the basic care tips to ensure that no damage is done of the gum area that remains tender and vulnerable immediately after uprooting eth tooth. Here are some of the instructions that everyone must follow after tooth removal.",
          "Do not spit, rinse, or use a straw at least for another 24 hours after the extraction",
          "Use the luke-warm salt solution to rinse your mouth",
          "Do not smoke",
          "Avoid taking drinks that are too hot",
          "Take pillows while sleeping to keep the head a little up",
          "Tooth extraction is a hassle-free dental treatment these days. You do not have to bother about blood loss, pain, or any other hazards if you are about to go through a tooth removal procedure. With us, your oral care remains guaranteed. We make sure that you get the best treatment at the most reasonable rate possible.",
        ],
      },
    ],
    subServices: [],
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
    livePath: "/service/wisdom-tooth-removal",
    accent: { bg: "#F6EDE4", fg: "#B06A2C" },
    iconImage: "/images/Z1Uservice8.webp",
    icon: Stethoscope,
    title: "Wisdom Tooth Removal",
    menuTitle: "Wisdom Tooth Removal",
    excerpt: "Surgical removal of impacted wisdom teeth.",
    image: img("1644353740797-b85ffb378b3a"),
    imageAlt: "Oral surgeon removing an impacted wisdom tooth at a dental clinic in Gurugram",
    seoTitle: "Wisdom Teeth Removal In Gurgaon @9711811272 | Painless Wisdom Tooth Extraction | Find Wisdom Tooth Extraction Cost",
    seoDescription: "Tensed about wisdom teeth removal pain? Visit White Lily Dental in Gurgaon for painless wisdom tooth extraction . Call us @9711811272 to book an appointment now and get information about wisdom tooth extraction cost.",
    tagline: "Wisdom Tooth Removal",
    sections: [
      {
        heading: "Wisdom Tooth Removal",
        level: "h2",
        body: [
          "Wisdom Tooth Removal Wisdom teeth also referred to as third molars, are the final to emerge. They are more frequent in the late teenage years or puberty. The issue with third molars is that if they do not erupt correctly or are misplaced, they must be removed with a wisdom tooth removal procedure. They can cause harm to neighbor teeth if they are not properly positioned.",
          "White Lily Dental strives to provide the greatest dental care experience you've ever had. However, this is not the only reason to select White Lily Dental, the top dental facility in Gurgaon. We mix the most advanced computerized, digital, and laser technologies with a constructive approach to provide our patients with the greatest wisdom tooth extraction experience available.",
        ],
      },
      {
        heading: "What Is the Possibility of a Wisdom Tooth Causing Problems If Wisdom Tooth Extraction Is Not Done?",
        level: "h2",
        body: [
          "It's also conceivable that your wisdom teeth are affected by the wisdom tooth cavity. This indicates that the wisdom teeth stay in the sensitive tissue and only slightly break beyond the gums.",
          "If they stay slightly open, germs have a greater possibility of invading the tooth and causing infection, inflammation in the jaw, discomfort, and overall disease.",
        ],
      },
      {
        heading: "When Should You Go for Wisdom Tooth Extraction?",
        level: "h2",
        body: [
          "When it comes to wisdom teeth removal, most of our patients are afraid. Either because they've seen nasty YouTube videos or because one of their best friends has had a poor experience.",
          "Whenever wisdom teeth or third molars are not removed, they can create a lot of discomfort and infections. Patients frequently require a lengthy course of antibiotics and will be unable to chew or eat properly.",
          "Some people may miss work due to illnesses, and in rare cases, they must be hospitalized as a result. Difficulty cleaning wisdom teeth every day can produce a foul odour and bad breath, necessitating a lengthy course of antibiotics and medications.",
        ],
      },
      {
        heading: "How Wisdom Teeth Extraction Is Done?",
        level: "h2",
        list: [
          "We will guarantee that you are completely numb and will not feel anything before beginning the wisdom teeth removal operation",
          "Most wisdom teeth are extracted in a matter of minutes while under topical anesthetic",
          "More tough ones might take up to twenty to thirty minutes to complete",
          "If your wisdom teeth are causing problems with your jawbone, your dentist may have to raise the gum, split the tooth into pieces, and suture the gum back together. You'll not react to it",
          "Upper wisdom teeth removal is often simpler than lower wisdom teeth extraction",
        ],
      },
      {
        heading: "How Long Does Wisdom Tooth Removal Hurt?",
        level: "h2",
        body: [
          "The wisdom teeth ache may last only a couple of days. You would need to take all the required safeguards as suggested by our dentist.",
        ],
      },
      {
        heading: "Wisdom Tooth Extraction Price",
        level: "h3",
        list: [
          "Wisdom teeth are typically impacted or trapped in the jawbone. The wisdom tooth extraction cost in Gurgaon is heavily influenced by its position. The deep-seated impacted wisdom teeth will cost more than the surface fully erupted one. The term \"quality dental removal\" relates to sterilization measures, painless anesthesia and tooth disposal, the surgeon's skill, and post-operative pain control",
          "Wisdom Tooth Extraction Cost-The wisdom teeth removal price is determined by the location of the tooth, the degree of obstruction, the need for anesthetic, the need for sutures, and other factors. Always discuss these considerations with your dentist since they may affect the cost of the surgery",
        ],
      },
      {
        heading: "We Care for Your Painless Wisdom Teeth Extraction",
        level: "h2",
        body: [
          "We employ cutting-edge treatment techniques, methods, and dental materials, allowing us to provide a wide choice of alternatives to meet your specific needs. We employ a wide range of wisdom teeth removal procedures and treatments to convert your ordinary smile into a million-dollar one. We provide all your therapies in Gurgaon, and any specialist you require may be found here. Call us if you are seeking for wisdom tooth extraction to ease your pain and misery.",
        ],
      },
    ],
    subServices: [],
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
    livePath: "/service/gums-treatment",
    accent: { bg: "#F7E9EE", fg: "#B03E63" },
    iconImage: "/images/Tseservice9.webp",
    icon: HeartPulse,
    title: "Gums Treatment",
    menuTitle: "Gums Treatment",
    excerpt: "Scaling, root planing and gum disease care.",
    image: img("1593022356769-11f762e25ed9"),
    imageAlt: "Dental hygienist performing a professional scaling and gum cleaning procedure",
    seoTitle: "Best Gum Surgery Clinic In Gurgaon @9711811272 | Periodontal Flap Surgery Cost",
    seoDescription: "The best gum surgery dental clinic in Gurgaon. we provide complete periodontal flap surgery for gum treatment , with affordable dental flap surgery cost . Call us @9711811272 fro any gum treatment query.",
    tagline: "Gums Treatment",
    sections: [
      {
        heading: "Gums Treatment",
        level: "h2",
      },
      {
        heading: "Unhealthy Gums are Dangerous for Arteries and Hearts",
        level: "h2",
        body: [
          "It is a little known fact that gum diseases can affect the heart and arteries. Harmful bacteria that make your gums sensitive can cross into your bloodstream and hurt your arteries. Also, these bacteria can cause inflammation in your heart.",
          "At White Lily Dental, we take gum treatment seriously. To be frank, gum disease is the leading cause of tooth loss among adults. This is the reason that we strive to protect patients with holistic periodontal screenings. Our professional periodontists facilitate revitalizing gum disease treatment for fast recovery.",
        ],
      },
      {
        heading: "Symptoms of Dental Gum Problems",
        level: "h2",
        body: [
          "Here is the list of common indications of gum problems.",
          "If you experience any of these symptoms, schedule an appointment immediately with us.",
        ],
        list: [
          "Frequent bleeding from gums",
          "Recurring bad breath that keeps on coming back",
          "Gums that are puffy and tender in their appearance frequent pain in the gums",
        ],
      },
      {
        heading: "How can we help you with Gum Infection Treatment?",
        level: "h2",
        body: [
          "Here are some of the ways by which we can help you with gum swelling treatment.",
        ],
      },
      {
        heading: "Deep Cleaning",
        level: "h3",
        body: [
          "At White Lily Dental, we use a process of scaling and root planning to remove accumulated plaque and tartar. This cleaning process gives you immediate relief from a variety of gum-related issues.",
        ],
      },
      {
        heading: "Periodic Check-Ups and Cleaning Sessions",
        level: "h3",
        body: [
          "We facilitate quality gum bleeding treatment with regular cleaning sessions. You have to strictly follow the treatment solution designed by our dentists for fast recovery. Regular visits can help you fend off the advances of plaque formation and tartar build-up.",
        ],
      },
      {
        heading: "Home Gum Treatment Solutions",
        level: "h3",
        body: [
          "Once you develop gum disease, it is quite tough to recover fully from it. However, with our home-based periodontic treatment procedures, you can address these nagging gum issues. Please schedule an appointment with us today to know more about home gum treatment solutions.",
        ],
      },
      {
        heading: "Scaling and Root Planing",
        level: "h3",
        body: [
          "We may also recommend you to undergo scaling and root planning treatment procedure. This is usually a non-surgical procedure, but our dentists would administer local anesthesia. Both tartar and plaque are removed from above and below the gums. Also, the rough spots are made smooth with which the infestation of bacteria can be controlled.",
        ],
      },
      {
        heading: "Surgical Procedures for Gum Pain Treatment",
        level: "h2",
        body: [
          "Various types of surgical procedures can be deployed for gum treatment. Here are some of them.",
        ],
      },
      {
        heading: "Flap Surgery",
        level: "h3",
        body: [
          "This surgical method is used primarily to remove tartar deposits from the gums. Our dental surgeons would polish the irregular surface of the bone to stop the regeneration of bacteria. This surgical method is also a great alternative to remove the gap between gums and teeth.",
        ],
      },
      {
        heading: "Tissue Regeneration",
        level: "h3",
        body: [
          "Tissue regeneration surgery is your best bet for gum illnesses. It is usually deployed when the bones that support your teeth are destroyed. Our expert dentists would insert a small mesh-like fabric between the gum and bone tissue.",
          "So as you can see, there are a variety of dental gum problems that can throw your life out of gear. Don't overlook gum problems as harmful bacteria can easily enter your main bloodstream. Contact White Lily Dental today to get the best periodontal treatment.",
        ],
      },
    ],
    subServices: [
    {
      slug: "scaling-and-root-planning",
      name: "Scaling And Root Planning(Cleaning)",
      blurb: "Visit the most convenient and Best Dentist in Gurgaon for scaling and root planning for cost-effective treatment of gingivitis and gum disease through removal of plaque and tartar. Contact us at @9711811272 to get more information about scaling and root planning cost and procedures.",
      seoTitle: "Scaling and Root Planning In Gurgaon @9711811272 | Scaling And Root Planning Cost",
      seoDescription: "Visit the most convenient and Best Dentist in Gurgaon for scaling and root planning for cost-effective treatment of gingivitis and gum disease through removal of plaque and tartar. Contact us at @9711811272 to get more information about scaling and root planning cost and procedures.",
      sections: [
        {
          heading: "Scaling And Root Planning(Cleaning)",
          level: "h2",
          body: [
            "Visit the most convenient and Best Dentist in Gurgaon for scaling and root planning for cost-effective treatment of gingivitis and gum disease through removal of plaque and tartar. Contact us at @9711811272 to get more information about scaling and root planning cost and procedures.",
          ],
        },
      ],
    },
    {
      slug: "surgical-gum-treatment",
      name: "Surgical Gum Treatment",
      blurb: "We provide surgical gum treatment in Gurgaon, call us @9711811272 to treat gum diseases. Get relief from your dental related problems. Contact us to get more information about periodontal surgery, gum surgery cost,surgical gum treatment, etc.",
      seoTitle: "Surgical Gum Treatment Near Me in Gurgaon | Gum Surgery Cost @9711811272",
      seoDescription: "We provide surgical gum treatment in Gurgaon, call us @9711811272 to treat gum diseases. Get relief from your dental related problems. Contact us to get more information about periodontal surgery, gum surgery cost,surgical gum treatment, etc.",
      sections: [
        {
          heading: "Surgical Gum Treatment",
          level: "h2",
          body: [
            "We provide surgical gum treatment in Gurgaon, call us @9711811272 to treat gum diseases. Get relief from your dental related problems. Contact us to get more information about periodontal surgery, gum surgery cost,surgical gum treatment, etc.",
          ],
        },
      ],
    },
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
    livePath: "/service/preventive-dental-treatments",
    accent: { bg: "#E4F2EA", fg: "#2E7D52" },
    iconImage: "/images/m02service10.webp",
    icon: ShieldCheck,
    title: "Preventive Dental Treatments",
    menuTitle: "Preventive Dental Treatments",
    excerpt: "Check-ups, cleaning, fluoride and sealants.",
    image: img("1681939278218-a755fb2bf2d3"),
    imageAlt: "Dentist preparing for a routine preventive dental check-up in Gurugram",
    seoTitle: "Preventive Dental Checkups Near Me in Gurgaon @9711811272 | Preventive Dentistry",
    seoDescription: "Preventive dentistry is a milestone of dental health and dental treatment . White Lily Dental clinic provides specialty and professional dentistry services. Book an appointment with our experts today, just pick up your phone and make a call @9711811272.",
    tagline: "Preventive dentistry is a milestone of dental health and dental treatment . White Lily Dental clinic provides specialty and professional dentistry services. Book an appointment with our experts today, just pick up your phone and make a call @9289288848.",
    sections: [
      {
        heading: "Preventive Treatments",
        level: "h2",
        body: [
          "Preventive Dentistry Preventive dentistry is beneficial to everyone. From infancy when the teeth are just beginning to emerge, until the point where one may be on the verge of losing all their teeth or has already lost some. Dental treatment aids in the prevention of tooth decay in children, as well as the strength and fit of newly formed permanent teeth. This helps to maintain permanent teeth strong in young adults, which can ultimately lead to a healthier lifestyle.",
        ],
      },
      {
        heading: "Why Should Choose White Lily Dental?",
        level: "h2",
        body: [
          "White Lily Dental provides a full range of dental procedures, employs proper technology, and employs cutting-edge pain-management technologies to deliver inexpensive, high-quality care. White Lily Dental maintains the best practices in clinic safety and cleanliness, customer support, and hiring to position itself as the market leader, with a continuing focus on morals and openness. White Lily Dental also devotes efforts to meeting the dental health requirements of underserved populations.",
        ],
      },
      {
        heading: "Why Then Should You Pay for Prevention Dental Procedures?",
        level: "h2",
        body: [
          "Preventive dental check-ups aid in the early treatment of developing dental disorders, which is significantly less expensive than addressing similar issues once they have progressed to the point where they require more active care and, as a result, greater costs. The cost is determined by several factors, including the treatments chosen and your dental health. By visiting one of our dental clinics in India, you may discover more about them in-depth.",
        ],
      },
      {
        heading: "Why Preventive Dentistry is Important?",
        level: "h2",
        body: [
          "Preventive dentistry is the process of caring about your gums and teeth and keeping dental hygiene to keep them clean. Cavities, gum diseases, enamel erosion, tooth loss, and other issues are all avoided. We have grown more prone to oral ailments because of years of refined food, thus preserving them has become incredibly vital. Oral disease management has gotten easier because of developments in dentistry.",
          "Oral hygiene should be done starting at a young age. Brushing and flossing twice a day is the most basic kind of preventative dentistry. Another method of preventing dental illnesses is to visit a dentist every six months. The preventative dentistry program benefits children the most since it permits their freshly created adult teeth to grow strong and healthy.",
        ],
      },
      {
        heading: "Best Practices for Oral Health and Preventive Dentistry",
        level: "h2",
        list: [
          "Brushing your teeth at least twice daily is perhaps the most important step in maintaining your oral health; develop a habit. Also, wash your teeth before going to sleep to help battle bacteria that can hurt your tissues if they stay overnight",
          "Floss daily. This aids in the removal of debris lodged between your teeth, which can cause cavities. Flossing helps to remove these particles, keeping your teeth clean and healthy",
          "After each meal, give it a good rinse. This is done to make sure there are no food particles caught between your teeth and gums. This maintains your mouth clean, which contributes to healthy teeth in the long run",
          "Consume a well-balanced diet. This will aid in the absorption of nutrients by your teeth. Drink lots of water and stay away from fizzy beverages. Consume a diet that has all the essential nutrients that your body need",
        ],
      },
      {
        heading: "Preventive Dentistry Benefits",
        level: "h2",
        list: [
          "Aids in the preservation of gum and tooth health",
          "Forbids cavities from forming",
          "Gum disease prevention",
          "Prevents or lowers the likelihood of future tooth misalignment",
        ],
      },
      {
        heading: "How Often Should You Visit White Lily Dental for A Dental Exam?",
        level: "h2",
        body: [
          "People with good oral hygiene can see the dentist once a year, whereas those with a record of bad oral health should see a dentist every 6 months to maintain oral health and preventive dentistry. White Lily Dental will help you choose a professional dentist for your oral health.",
        ],
      },
    ],
    subServices: [],
    faqs: [
      { q: "How often should I visit the dentist?", a: "At least once a year for a check-up and professional cleaning. Patients with gum disease, frequent decay or orthodontic appliances usually need visits every three to six months." },
      { q: "Are dental X-rays safe?", a: "Yes. Digital dental X-rays use very low radiation doses — a full set is a small fraction of the background radiation you receive naturally each year. We only take them when clinically indicated." },
      { q: "At what age should a child first see a dentist?", a: "By their first birthday, or within six months of the first tooth appearing. Early visits are short and friendly, and they build comfort long before any treatment is needed." },
      { q: "What are pit and fissure sealants?", a: "A thin protective coating flowed into the deep grooves of newly erupted molars. It seals out plaque and food and is one of the most effective ways to prevent decay in children." },
    ],
    related: ["gums-treatment", "cosmetic-dentistry", "braces-treatment"],
  },
];
