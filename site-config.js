/* =====================================================================
   SHIPSHAPE HANDYMAN: BUSINESS DETAILS
   ---------------------------------------------------------------------
   This is the only file you need to edit to update the website.

   - Keep the quotes around each value.
   - Anything in [square brackets] is a placeholder. Replace it before
     publishing; it shows on the page with a dashed yellow outline.
   - Save the file, then refresh the page to see your changes.
   ===================================================================== */

window.SITE = {
  businessName: "Shipshape Handyman",

  // Your registered business name, shown in the footer copyright line.
  legalName: "Shipshape Handyman LLC",

  // Your first name, used in the About section ("Hi, I'm ___.").
  ownerFirstName: "Don",

  // Leave phone empty ("") to hide every call button.
  // Add a number like "(555) 123-4567" and tap-to-call buttons appear
  // next to "Request an estimate."
  phone: "",

  // Your public contact email. Shown in the footer, and offered as a
  // backup if the form can't send. Set to "" to keep it off the site.
  // Keep your personal, billing, and admin addresses off the website.
  email: "info@shipshapehandymanfl.com",

  // Your Instagram handle. Shown in the About section and footer.
  // Set to "" to hide the Instagram links.
  instagram: "shipshapehandymanfl",

  // Show "See my recent work on Instagram" in the About section.
  // Change to true once you've posted some work.
  instagramInAbout: false,

  // Your Facebook page. Paste the full link (e.g.
  // "https://www.facebook.com/yourpage") or just the page name.
  // Shown in the footer. Set to "" to hide the Facebook link.
  facebook: "https://www.facebook.com/shipshapehandymanfl",

  // WHERE ESTIMATE REQUESTS GO. The form sends straight to your inbox
  // through Formspree (the free plan has a monthly request limit).
  //   1. Sign up at https://formspree.io with your "estimates@" address
  //      (that's where requests will be delivered; see README.md).
  //   2. Create a new form and copy its endpoint, e.g. https://formspree.io/f/xyzabcd
  //   3. Paste it below, replacing the brackets.
  formEndpoint: "[https://formspree.io/f/your-form-id]",

  // The sentence under the headline. {towns} becomes your town list.
  heroSentence: "I handle home repairs, mounting, carpentry, and the jobs that pile up for homeowners in the Orlando Area.",

  // What Google shows in search results. {towns} works here too.
  seoTitle: "Shipshape Handyman | Handyman in Orlando",
  seoDescription: "Handyman repairs, mounting, and carpentry in Orlando. Fix a sticking door, patch drywall, mount a TV, or hang shelves. Request an estimate from your phone.",

  // Towns, ZIP codes, or neighborhoods you cover. Add or remove lines freely.
  serviceArea: [
    "Orlando",
    "Winter Park",
	"Maitland",
	"Oviedo",
	"Kissimmee",
  ],

  // Shown under the town list. Set to "" to hide it.
  serviceAreaNote: "Just outside these towns? Ask anyway. If it's close, I can usually make it work.",

  // Shown under the "Request an estimate" button and in the About section.
  // Set to "" to remove it.
  noFixNoCharge: "",

  // CONFIRM THIS WORDING before you publish. It is a promise to customers.
  // Set to "" to remove the guarantee from the site.
  guarantee: "If you're not satisfied with my work, tell me and I'll come back and make it right.",

  // Short "About" paragraphs. Use {name} where your first name should go.
  about: [
    "Hi, I’m Brandon, the owner of Shipshape Handyman. Every home has a to-do list that keeps getting pushed back: the door that won’t latch, the shelf still sitting in its box, the trim pulling away from the wall. That list is what I’m here for.",
    "\"Shipshape\" means everything in good order, and that's how I leave every home I work in. I show up when I say I will, treat your place like it's my own, and clean up before I head out.",
    "Tell me what's going on and I'll give you a straight answer on whether I can help, and a fair price if I can."
  ],

  // Services, grouped. Keep each list short. Each example should read
  // like the job a homeowner has in mind.
  services: [
    {
      title: "Repairs around the house",
      examples: [
        "Fix a sticking or sagging door",
        "Patch holes and cracks in drywall",
        "Tighten a wobbly railing",
        "Re-caulk a tub or shower"
      ]
    },
    {
      title: "Minor plumbing",
      examples: [
        "Replace a dripping faucet",
        "Fix a running toilet",
        "Clear a slow drain",
        "Put in a new showerhead"
      ]
    },
    {
      title: "Assembly & mounting",
      examples: [
        "Mount a TV on the wall",
        "Put together furniture",
        "Hang shelves, mirrors, and curtain rods"
      ]
    },
    {
      title: "Carpentry & trim",
      examples: [
        "Replace baseboard or door trim",
        "Hang a new interior door",
        "Fix a loose deck board or fence picket"
      ]
    },
    {
      title: "Staying cool & comfortable",
      examples: [
        "Change your AC filters",
        "Put in a window AC unit",
        "Weatherstrip a drafty door or window"
      ]
    },
    {
      title: "Odds and ends",
      examples: [
        "Touch up paint or paint a small room",
        "Install grab bars in a bathroom",
        "Replace a torn window screen"
      ]
    }
  ],

  // NOTE (Florida): plumbing, electrical, and HVAC work need a state license,
  // even for small jobs. "Minor plumbing" above was added by the owner's
  // choice without a plumbing license. Delete that group to remove it.
  // Electrical and HVAC jobs (light fixtures, ceiling fans, thermostats)
  // are left off on purpose.

  // RECENT WORK: add photos here and the gallery appears automatically.
  // Put image files in the assets/photos folder, then add entries like:
  //   { image: "assets/photos/back-door.jpg",
  //     caption: "Rehung a back door that wouldn't latch and replaced the trim." },
  // While this list is empty, the Recent work section stays hidden.
  projects: []
};
