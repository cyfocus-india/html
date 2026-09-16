(function () {
  "use strict";

  const isPage = /\/pages\//.test(window.location.pathname);
  const base = isPage ? "../" : "";
  const pageName = window.location.pathname.split("/").pop() || "index.html";

  const icon = (name, label = "") => `<i data-lucide="${name}"${label ? ` aria-label="${label}"` : ""}></i>`;

  const logo = `
    <span class="brand-mark" aria-hidden="true">${icon("gauge")}</span>
    <span><span class="brand-word">Drive<span class="accent">Way</span></span><span class="brand-sub">DRIVING SCHOOL</span></span>`;

  const pagesList = [
    "coming-soon.html",
    "404.html",
    "privacy.html",
    "terms.html"
  ];
  const isPagesActive = pagesList.includes(pageName);

  const navHtml = `
    <div class="nav-item nav-item-dropdown" data-nav-dropdown>
      <button class="nav-link dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true"${pageName === "index.html" || pageName === "index1.html" ? ' aria-current="page"' : ""}>
        Home <i data-lucide="chevron-down" class="dropdown-icon"></i>
      </button>
      <div class="nav-dropdown">
        <a class="dropdown-link" href="${base}index.html"${pageName === "index.html" ? ' aria-current="page"' : ""}>Home 1</a>
        <a class="dropdown-link" href="${base}index1.html"${pageName === "index1.html" ? ' aria-current="page"' : ""}>Home 2</a>
      </div>
    </div>
    <a class="nav-link" href="${base}pages/about.html"${pageName === "about.html" ? ' aria-current="page"' : ""}>About Us</a>
    <a class="nav-link" href="${base}pages/courses.html"${pageName === "courses.html" ? ' aria-current="page"' : ""}>Courses</a>
    <a class="nav-link" href="${base}pages/instructors.html"${pageName === "instructors.html" ? ' aria-current="page"' : ""}>Instructors</a>
    <a class="nav-link" href="${base}pages/vehicles.html"${pageName === "vehicles.html" ? ' aria-current="page"' : ""}>Vehicles</a>
    <a class="nav-link" href="${base}pages/fees.html"${pageName === "fees.html" ? ' aria-current="page"' : ""}>Fees</a>
    <a class="nav-link" href="${base}pages/contact.html"${pageName === "contact.html" ? ' aria-current="page"' : ""}>Contact</a>
    <div class="nav-item nav-item-dropdown" data-nav-dropdown>
      <button class="nav-link dropdown-toggle" type="button" aria-expanded="false" aria-haspopup="true"${isPagesActive ? ' aria-current="page"' : ""}>
        Pages <i data-lucide="chevron-down" class="dropdown-icon"></i>
      </button>
      <div class="nav-dropdown nav-dropdown-pages">
        <a class="dropdown-link" href="${base}pages/coming-soon.html"${pageName === "coming-soon.html" ? ' aria-current="page"' : ""}>Coming Soon</a>
        <a class="dropdown-link" href="${base}pages/404.html"${pageName === "404.html" ? ' aria-current="page"' : ""}>404</a>
        <a class="dropdown-link" href="${base}pages/privacy.html"${pageName === "privacy.html" ? ' aria-current="page"' : ""}>Privacy</a>
        <a class="dropdown-link" href="${base}pages/terms.html"${pageName === "terms.html" ? ' aria-current="page"' : ""}>Terms</a>
      </div>
    </div>
    <a class="nav-link" href="${base}pages/dashboard.html"${pageName === "dashboard.html" ? ' aria-current="page"' : ""}>Dashboard</a>`;

  const header = document.querySelector("[data-site-header]");
  if (header) {
    header.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to main content</a>
      <header class="site-header">
        <div class="header-inner">
          <a class="brand" href="${base}index.html" aria-label="DriveWay home">${logo}</a>
          <nav class="main-nav" id="main-nav" aria-label="Primary navigation">
            ${navHtml}
          </nav>
          <div class="header-actions">
            <button class="icon-button" id="theme-toggle" type="button" aria-label="Switch color theme" title="Switch color theme">${icon("moon")}</button>
            <button class="icon-button rtl-btn" id="rtl-toggle" type="button" aria-label="Toggle layout direction (RTL/LTR)" title="Toggle layout direction"><span class="rtl-badge">RTL</span></button>
            <a class="btn btn-primary" href="${base}pages/signin.html" aria-label="Sign In">${icon("user-round")} <span class="btn-text">Sign In</span></a>
            <button class="menu-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Open menu">${icon("menu")}</button>
          </div>
        </div>
      </header>`;
  }

  const footer = document.querySelector("[data-site-footer]");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-main">
          <div class="footer-brand">
            <a class="brand" href="${base}index.html" aria-label="DriveWay home">${logo}</a>
            <p>Professional driving training that empowers you with the skills and confidence for a lifetime.</p>
          </div>
          <div class="footer-col">
            <h3>Training &amp; Fleet</h3>
            <ul>
              <li><a href="${base}index.html">Home 1</a></li>
              <li><a href="${base}index1.html">Home 2</a></li>
              <li><a href="${base}pages/courses.html">Courses</a></li>
              <li><a href="${base}pages/instructors.html">Instructors</a></li>
              <li><a href="${base}pages/vehicles.html">Vehicles</a></li>
              <li><a href="${base}pages/fees.html">Fees</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Company &amp; Account</h3>
            <ul>
              <li><a href="${base}pages/about.html">About Us</a></li>
              <li><a href="${base}pages/contact.html">Contact</a></li>
              <li><a href="${base}pages/dashboard.html">Dashboard</a></li>
              <li><a href="${base}pages/signin.html">Sign In</a></li>
              <li><a href="${base}pages/signup.html">Sign Up</a></li>
              <li><a href="${base}pages/profile.html">Profile</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Utilities &amp; Legal</h3>
            <ul>
              <li><a href="${base}pages/coming-soon.html">Coming Soon</a></li>
              <li><a href="${base}pages/404.html">404</a></li>
              <li><a href="${base}pages/privacy.html">Privacy</a></li>
              <li><a href="${base}pages/terms.html">Terms</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Contact</h3>
            <ul>
              <li>${icon("phone")} +91 98765 43210</li>
              <li>${icon("mail")} info@drivewayschool.com</li>
              <li>${icon("map-pin")} 123 Drive Way, Your City,<br>Your State - 560001</li>
            </ul>
            <ul class="socials" style="margin-top: 14px">
              <li><a href="https://facebook.com" aria-label="Facebook">${icon("facebook")}</a></li>
              <li><a href="https://instagram.com" aria-label="Instagram">${icon("instagram")}</a></li>
              <li><a href="https://youtube.com" aria-label="YouTube">${icon("youtube")}</a></li>
              <li><a href="https://google.com" aria-label="Google">${icon("search")}</a></li>
            </ul>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© <span data-year></span> DriveWay. All Rights Reserved.</span>
          <span class="footer-legal"><a href="${base}pages/privacy.html">Privacy</a><span>|</span><a href="${base}pages/terms.html">Terms</a></span>
        </div>
      </footer>`;
  }

  const COURSE_DATA = {
    "two-wheeler": {
      id: "two-wheeler",
      name: "Two-Wheeler License Training",
      badge: "Beginner Friendly",
      tagline: "Build balance, clutch control & master the RTO 8-track test.",
      price: "₹4,999",
      duration: "10 Practical Sessions",
      vehicle: "Scooter & Geared 150cc Bike",
      passRate: "94% First-Attempt Pass Rate",
      rating: "4.8 ★ (850+ reviews)",
      image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      overview: "A specialized foundation program taking you from initial balance jitters to absolute two-wheeler confidence. Covers low-speed stability, friction zone clutch control, emergency braking, and rigorous RTO 8-track practice.",
      curriculum: [
        { title: "Stage 1: Pre-Ride Controls & Low-Speed Balance", desc: "Clutch bite, friction zone, throttle control, and straight-line feet-up stability." },
        { title: "Stage 2: Precision Slalom & 8-Track Drills", desc: "Counter-steering, tight turning circles, obstacle avoidance, and RTO track simulations." },
        { title: "Stage 3: Live City Traffic & Road Awareness", desc: "Lane discipline, mirror checks, emergency stopping, and defensive riding habits." },
        { title: "Stage 4: RTO Mock Test & License Filing", desc: "Full examiner test simulation with real-time feedback and assistance with final RTO slot booking." }
      ],
      features: [
        "10 Dedicated One-on-One Practical Lessons",
        "Full DOT Safety Helmet & Knee Guards Provided",
        "Private Obstacle & 8-Track Training Facility",
        "Learner & Permanent License Filing Assistance",
        "Flexible Morning (7-9 AM) & Evening Slots"
      ],
      defaultInstructor: "Anita Rao"
    },
    "four-wheeler": {
      id: "four-wheeler",
      name: "Four-Wheeler Comprehensive Driving",
      badge: "Most Popular",
      tagline: "Master clutch control, steering, parking & confident city rush driving.",
      price: "₹9,999",
      duration: "20 Practical Sessions",
      vehicle: "Dual-Control Manual / Auto Car",
      passRate: "96% First-Attempt Pass Rate",
      rating: "4.9 ★ (1,400+ reviews)",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80",
      overview: "Our flagship zero-to-driver course. Master dual-pedal vehicle controls, smooth gear changes, parallel & reverse parking, highway speed merging, hill-start handbrake recovery, and official RTO exam tracks.",
      curriculum: [
        { title: "Stage 1: Dual Controls & Smooth Gear Shifting", desc: "Seat ergonomics, mirror angles, clutch bite-points, and seamless 1st-to-3rd gear progression." },
        { title: "Stage 2: Reverse S-Track & Parallel Parking", desc: "Curb alignment, tight 90-degree bay parking, 3-point turns, and obstacle clearance drills." },
        { title: "Stage 3: Live Traffic, Flyovers & Hill Starts", desc: "Bumper-to-bumper peak rush navigation, hill-hold clutch balance, and night highway awareness." },
        { title: "Stage 4: 2 Realistic RTO Mock Driving Tests", desc: "Complete official exam track simulation with examiner checklist to ensure 100% test-day confidence." }
      ],
      features: [
        "20 One-on-One Practical Road Lessons",
        "Instructor-Side Dual-Brake Safety Protection",
        "Choice of Manual or Automatic Transmission",
        "2 Full Mock Driving Tests with RTO Checklist",
        "Free Student Dashboard Access & e-Logbook"
      ],
      defaultInstructor: "Rajesh Kumar"
    },
    "refresher": {
      id: "refresher",
      name: "Refresher & Confidence Course",
      badge: "Custom Flexible",
      tagline: "Overcome driving anxiety, master parking & regain total road command.",
      price: "₹3,499",
      duration: "5 to 10 Custom Sessions",
      vehicle: "School Fleet / Your Personal Car",
      passRate: "100% Student Confidence Rating",
      rating: "4.9 ★ (600+ reviews)",
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      overview: "Designed for individuals who hold a driver's license but haven't driven in a while, or feel nervous in high-density traffic, mall basement parking, or expressways. Personalized coaching tailored directly to your specific comfort zones.",
      curriculum: [
        { title: "Stage 1: Skill Diagnostic & Baseline Drive", desc: "Calm initial drive to evaluate current vehicle control, spacing judgment, and stress triggers." },
        { title: "Stage 2: Complex Parking & Tight Spaces", desc: "Mastering tight apartment basements, steep spiral ramps, multi-level mall parking, and U-turns." },
        { title: "Stage 3: Rush-Hour Traffic & Highway Merging", desc: "Lane changes at speed, navigating busy roundabouts, adaptive following distances, and night vision." },
        { title: "Stage 4: Personal Route Navigation Mastery", desc: "Guided practice along your exact daily commute routes (home to office, school pickup, market)." }
      ],
      features: [
        "Personalized Custom Curriculum Tailored to You",
        "Option to Train in Your Own Vehicle or School Car",
        "Daily Commute & Office Route Practice",
        "Stress-Free, Highly Patient Senior Instructors",
        "Flexible Weekend and Evening Lesson Slots"
      ],
      defaultInstructor: "Vikram Singh"
    },
    "intensive": {
      id: "intensive",
      name: "Intensive Fast-Track Driving",
      badge: "Fastest Route",
      tagline: "Licence-ready in 14 days with daily back-to-back driving sessions.",
      price: "₹14,999",
      duration: "24 Sessions across 14 Days",
      vehicle: "Dual-Control Manual / Auto Car",
      passRate: "95% First-Attempt Pass Rate",
      rating: "4.8 ★ (310+ reviews)",
      image: "https://images.unsplash.com/photo-1516862523118-a3724eb136d7?auto=format&fit=crop&w=800&q=80",
      overview: "Built for learners with a fixed deadline — a relocation, a new job, or a booked RTO slot. Two sessions a day compress the full four-wheeler syllabus into a fortnight without skipping a single competency, and your RTO paperwork is filed in parallel.",
      curriculum: [
        { title: "Days 1-3: Controls, Clutch & Confined Spaces", desc: "Twice-daily sessions on cockpit drill, clutch bite, gear progression, and low-speed manoeuvring in a closed yard." },
        { title: "Days 4-7: Open Road & Junction Discipline", desc: "Roundabouts, signalled junctions, lane changes, overtaking, and observation routines in live city traffic." },
        { title: "Days 8-11: Parking, Hills & Expressway", desc: "Parallel, bay and angled parking, hill starts, multi-level ramps, plus expressway merging and lane discipline." },
        { title: "Days 12-14: Mock Tests & RTO Exam Day", desc: "Three examiner-scored mock tests, targeted fault correction, and accompanied attendance at your RTO slot." }
      ],
      features: [
        "24 Lessons Delivered Over 14 Consecutive Days",
        "Two Sessions Per Day (Morning & Evening)",
        "3 Examiner-Scored Mock Driving Tests",
        "Priority RTO Slot Booking & Document Filing",
        "Dedicated Single Instructor Throughout"
      ],
      defaultInstructor: "Vikram Singh"
    }
  };

  const FEE_PLAN_DATA = {
    "ride-ready": {
      id: "ride-ready",
      courseId: "two-wheeler",
      name: "Ride Ready (Two-Wheeler Package)",
      badge: "Beginner Friendly",
      tagline: "All-inclusive two-wheeler training with zero surprise costs.",
      price: "₹4,999",
      priceNum: 4999,
      duration: "10 Practical Lessons",
      vehicle: "Gearless Scooter & Geared Bike",
      splitOption: "Pay ₹2,499 today + ₹2,500 after Lesson 5",
      splitDownPayment: 2499,
      breakdown: [
        { name: "10 One-on-One Practical Riding Lessons", value: "₹4,000", status: "Included (₹0 Extra)" },
        { name: "DOT-Approved Protective Helmet & Knee Armor", value: "₹1,200", status: "Free Usage" },
        { name: "Private 8-Track Test Facility Access", value: "₹800", status: "Included" },
        { name: "RTO Form Filing & Document Preparation", value: "₹500", status: "Free Assistance" },
        { name: "Accidental Insurance Coverage During Training", value: "₹600", status: "100% Covered" }
      ],
      govtNotes: "RTO Government test slot fee (approx ₹300) payable directly at RTO counter."
    },
    "drive-confident": {
      id: "drive-confident",
      courseId: "four-wheeler",
      name: "Drive Confident (Four-Wheeler Package)",
      badge: "Most Popular",
      tagline: "Comprehensive complete 20-lesson masterclass with dual mock tests.",
      price: "₹9,999",
      priceNum: 9999,
      duration: "20 Practical Road Lessons",
      vehicle: "Dual-Control Hatchback (Manual / Auto)",
      splitOption: "Pay ₹4,999 today + ₹5,000 after Lesson 10",
      splitDownPayment: 4999,
      breakdown: [
        { name: "20 Guided In-Car Road Driving Sessions", value: "₹9,000", status: "Included (₹0 Extra)" },
        { name: "Dual-Control Safety Vehicle Fuel & Maintenance", value: "₹2,500", status: "100% Included" },
        { name: "2 Realistic RTO Examiner Mock Driving Tests", value: "₹1,500", status: "Included" },
        { name: "Digital Progress Dashboard & e-Logbook", value: "₹1,000", status: "Free Lifetime" },
        { name: "Comprehensive Student On-Road Insurance", value: "₹800", status: "100% Covered" },
        { name: "RTO Driving License Appointment Assistance", value: "₹500", status: "Free Assistance" }
      ],
      govtNotes: "RTO Government driving test fee (approx ₹500) payable directly at RTO counter."
    },
    "back-on-road": {
      id: "back-on-road",
      courseId: "refresher",
      name: "Back on the Road (Refresher Package)",
      badge: "Custom Flexible",
      tagline: "Tailored confidence coaching for licensed drivers needing practice.",
      price: "₹3,499",
      priceNum: 3499,
      duration: "5 One-Hour Custom Sessions",
      vehicle: "School Dual-Control / Personal Car",
      splitOption: "Pay full ₹3,499 or customize 10-lesson plan at ₹5,999",
      splitDownPayment: 3499,
      breakdown: [
        { name: "5 One-on-One Practical Confidence Sessions", value: "₹3,500", status: "Included" },
        { name: "Personal Driving Skill Baseline Diagnostic", value: "₹800", status: "Free Evaluation" },
        { name: "Basement & Tight Parallel Parking Masterclass", value: "₹1,000", status: "Included" },
        { name: "Daily Commute / Office Route Guidance", value: "₹800", status: "Included" },
        { name: "Written Post-Drive Performance Feedback", value: "₹500", status: "Included" }
      ],
      govtNotes: "No RTO fees required (designed for existing DL holders)."
    },
    "fast-track": {
      id: "fast-track",
      courseId: "intensive",
      name: "Fast Track (14-Day Intensive Package)",
      badge: "Fastest Route",
      tagline: "The full four-wheeler syllabus compressed into a fortnight.",
      price: "₹14,999",
      priceNum: 14999,
      duration: "24 Lessons Over 14 Days",
      vehicle: "Dual-Control Hatchback (Manual / Auto)",
      splitOption: "Pay ₹7,499 today + ₹7,500 before Day 8",
      splitDownPayment: 7499,
      breakdown: [
        { name: "24 Guided In-Car Sessions (2 Per Day)", value: "₹13,000", status: "Included (₹0 Extra)" },
        { name: "Dedicated Single Instructor for All 14 Days", value: "₹2,000", status: "Included" },
        { name: "3 Examiner-Scored RTO Mock Driving Tests", value: "₹2,200", status: "Included" },
        { name: "Priority RTO Slot Booking & Document Filing", value: "₹1,200", status: "Free Assistance" },
        { name: "Comprehensive Student On-Road Insurance", value: "₹800", status: "100% Covered" }
      ],
      govtNotes: "RTO Government driving test fee (approx ₹500) payable directly at RTO counter."
    },
    "commercial-lmv": {
      id: "commercial-lmv",
      courseId: "four-wheeler",
      name: "Commercial LMV (Professional Licence Package)",
      badge: "Career Track",
      tagline: "Endorsement training for cab, delivery and fleet driving careers.",
      price: "₹12,499",
      priceNum: 12499,
      duration: "25 Lessons + Endorsement Support",
      vehicle: "LMV Sedan, MUV & Light Goods Van",
      splitOption: "Pay ₹6,249 today + ₹6,250 after Lesson 12",
      splitDownPayment: 6249,
      breakdown: [
        { name: "25 Practical Lessons Across LMV Vehicle Types", value: "₹11,000", status: "Included (₹0 Extra)" },
        { name: "Light Goods Van & MUV Handling Modules", value: "₹2,000", status: "Included" },
        { name: "Commercial Endorsement Paperwork & Medical Guidance", value: "₹1,500", status: "Free Assistance" },
        { name: "Defensive Driving & Passenger Safety Certification", value: "₹1,200", status: "Included" },
        { name: "Fleet Employer Introduction & Placement Support", value: "₹1,000", status: "Free" }
      ],
      govtNotes: "RTO commercial endorsement fee and Form 1A medical certificate charges are payable separately at actual cost."
    }
  };

  const INSTRUCTOR_DATA = {
    "rajesh-kumar": {
      id: "rajesh-kumar",
      name: "Rajesh Kumar",
      badge: "Lead Driving Instructor",
      tagline: "Specializes in stress-free four-wheeler coaching & dual-pedal safety drills.",
      image: "assets/images/instructor-1.png",
      experience: "12 Years",
      languages: "English, Hindi",
      rating: "4.9 ★ (520+ Reviews)",
      passRate: "97% RTO First Attempt",
      bio: "With over 12 years of certified in-car instruction, Rajesh is renowned for transforming nervous, first-time drivers into completely self-reliant motorists. His calm demeanor and structured dual-control drills ensure zero-stress training through peak-hour Bengaluru traffic.",
      specialties: [
        "Four-Wheeler Manual & Automatic",
        "Clutch Bite-Point & Hill-Hold Recovery",
        "Tight Parallel & Reverse Bay Parking",
        "Expressway Merging & Lane Discipline",
        "RTO Examiner Mock Scoring"
      ],
      quote: "Rajesh sir made parallel parking and clutch control feel so effortless. Passed my RTO exam with zero faults on day one!",
      student: "Sneha Patel (IT Professional)",
      defaultCourse: "Four-Wheeler Comprehensive Driving"
    },
    "anita-rao": {
      id: "anita-rao",
      name: "Anita Rao",
      badge: "Two-Wheeler Safety Coach",
      tagline: "Expert mentor for balance technique, low-speed friction control & RTO 8-tracks.",
      image: "assets/images/instructor-2.png",
      experience: "9 Years",
      languages: "English, Kannada, Hindi",
      rating: "4.8 ★ (380+ Reviews)",
      passRate: "96% RTO First Attempt",
      bio: "Anita specializes in beginner two-wheeler mastery, focusing on core physical balance, counter-steering, friction zone feathering, and emergency braking. She has guided hundreds of riders to confidently conquer the RTO 8-track test.",
      specialties: [
        "Geared Motorcycle & Gearless Scooters",
        "Low-Speed Stability & Feet-Up U-Turns",
        "RTO 8-Track Precision Slalom",
        "Defensive Riding & Mirror Scanning",
        "DOT Helmet & Protective Armor Guidance"
      ],
      quote: "I was terrified of losing balance on a geared bike. Anita's patient step-by-step coaching gave me total confidence in 3 days!",
      student: "Pooja Menon (College Student)",
      defaultCourse: "Two-Wheeler License Training"
    },
    "vikram-singh": {
      id: "vikram-singh",
      name: "Vikram Singh",
      badge: "Road-Test & Highway Expert",
      tagline: "Former RTO exam observer focused on complex intersections, parking & mock tests.",
      image: "assets/images/instructor-3.png",
      experience: "8 Years",
      languages: "English, Hindi, Punjabi",
      rating: "4.9 ★ (440+ Reviews)",
      passRate: "98% RTO First Attempt",
      bio: "Vikram is a road-test specialist who sharpens spatial judgment, complex roundabout navigation, and high-speed highway merging. His rigorous examiner-level mock tests ensure learners walk into test day with zero surprises.",
      specialties: [
        "RTO Examiner Track Simulation",
        "Multi-Level Basement Ramp Mastery",
        "High-Density Flyovers & Traffic Jams",
        "Refresher Drives for Existing DL Holders",
        "Emergency Braking & Hazard Avoidance"
      ],
      quote: "Vikram's mock test was more thorough than the actual RTO examiner's. I breezed through the real test with 100% confidence!",
      student: "Karan Malhotra (Banker)",
      defaultCourse: "Refresher & Confidence Course"
    },
    "priya-nair": {
      id: "priya-nair",
      name: "Priya Nair",
      badge: "Nervous-Learner Specialist",
      tagline: "Trauma-informed coaching for anxious first-timers and returning drivers.",
      image: "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?auto=format&fit=crop&w=600&q=80",
      experience: "7 Years",
      languages: "English, Malayalam, Tamil",
      rating: "4.9 ★ (290+ Reviews)",
      passRate: "94% RTO First Attempt",
      bio: "Priya works with learners who have stalled elsewhere — driving anxiety, a past near-miss, or years away from the wheel. Her sessions start in empty lots and move outward only when the student decides they are ready, which is why her retention rate is the highest on the team.",
      specialties: [
        "Driving Anxiety & Confidence Rebuilding",
        "Women-Only Lesson Slots on Request",
        "Automatic Transmission Foundations",
        "Short 30-Minute Starter Sessions",
        "Senior & Returning-Driver Coaching"
      ],
      quote: "I had failed twice with another school and nearly gave up. Priya never once raised her voice — I passed on my next attempt.",
      student: "Lakshmi Iyer (Teacher)",
      defaultCourse: "Refresher & Confidence Course"
    },
    "arjun-reddy": {
      id: "arjun-reddy",
      name: "Arjun Reddy",
      badge: "Commercial & Fleet Trainer",
      tagline: "Prepares drivers for commercial LMV endorsements and fleet careers.",
      image: "https://images.unsplash.com/photo-1651684215020-f7a5b6610f23?auto=format&fit=crop&w=600&q=80",
      experience: "11 Years",
      languages: "English, Telugu, Hindi",
      rating: "4.8 ★ (350+ Reviews)",
      passRate: "96% RTO First Attempt",
      bio: "Arjun spent six years driving for a logistics fleet before moving into instruction. He teaches load-aware handling, long-shift fatigue management, and the documentation side of commercial driving that most learners discover too late.",
      specialties: [
        "Commercial LMV Endorsement Preparation",
        "Light Goods Van & MUV Handling",
        "Defensive Driving & Hazard Perception",
        "Night-Shift & Long-Duration Driving",
        "Fleet Employer Documentation Guidance"
      ],
      quote: "Arjun taught me things about load balance and fatigue that my first three months on the job would have taught me the hard way.",
      student: "Suresh Babu (Delivery Fleet Driver)",
      defaultCourse: "Four-Wheeler Comprehensive Driving"
    }
  };

  if (!document.querySelector("#booking-modal")) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="modal" id="booking-modal" role="dialog" aria-modal="true" aria-labelledby="modal-course-title" aria-hidden="true">
        <div class="modal-card">
          <button class="modal-close-btn" type="button" data-close-booking aria-label="Close modal">${icon("x")}</button>
          
          <div class="modal-banner">
            <img class="modal-banner-img" id="modal-banner-image" src="" alt="Course Training" loading="lazy">
            <div class="modal-banner-content">
              <span class="tag" id="modal-course-badge">Course</span>
              <h2 id="modal-course-title">Driving Course</h2>
              <p id="modal-course-tagline">Comprehensive driving instruction program.</p>
            </div>
          </div>

          <div class="modal-inner-body">
            <div class="modal-specs-bar">
              <div class="modal-spec-item">
                <span>Duration</span>
                <strong id="modal-spec-duration">20 Sessions</strong>
              </div>
              <div class="modal-spec-item">
                <span>Vehicle Type</span>
                <strong id="modal-spec-vehicle">Dual-Control Car</strong>
              </div>
              <div class="modal-spec-item">
                <span>Success Rate</span>
                <strong id="modal-spec-pass">96% First Attempt</strong>
              </div>
              <div class="modal-spec-item">
                <span>Student Rating</span>
                <strong id="modal-spec-rating">4.9 ★</strong>
              </div>
            </div>

            <div class="modal-detail-grid">
              <div>
                <h3 class="modal-section-title">${icon("book-open")} Program Overview</h3>
                <p id="modal-course-overview" style="font-size: 13px; color: var(--muted); line-height: 1.5; margin: 0 0 16px;"></p>

                <h3 class="modal-section-title">${icon("route")} 4-Stage Learning Roadmap</h3>
                <div class="modal-curriculum" id="modal-curriculum-container"></div>

                <h3 class="modal-section-title" style="margin-top: 18px;">${icon("shield-check")} What's Included</h3>
                <ul class="check-list" id="modal-features-list" style="font-size: 12px; margin-bottom: 0;"></ul>
              </div>

              <div>
                <div class="modal-form-card">
                  <div class="modal-price-pill">
                    <div>
                      <small style="color: #cbdbe8; display: block; font-size: 10px; text-transform: uppercase;">Total Course Fee</small>
                      <strong id="modal-price-display">₹9,999</strong>
                    </div>
                    <span style="font-size: 11px; background: rgba(255,255,255,0.15); padding: 3px 8px; border-radius: 4px;">No Hidden Charges</span>
                  </div>

                  <h3 class="modal-section-title" style="font-size: 13px; margin-bottom: 12px;">${icon("calendar-days")} Fast-Track Registration</h3>
                  
                  <div class="form-message" role="status" id="modal-form-message"></div>

                  <form class="validate-form" id="modal-enrollment-form" novalidate data-success="Your enrollment request has been registered! An advisor will call you within 2 hours to confirm your schedule.">
                    <input type="hidden" id="modal-course-id-input" name="course_id" value="four-wheeler">

                    <div class="field">
                      <label for="modal-full-name">Full Name</label>
                      <input id="modal-full-name" name="name" placeholder="e.g. Priya Sharma" autocomplete="name" required>
                      <div class="field-error"></div>
                    </div>

                    <div class="field">
                      <label for="modal-phone-num">Phone Number</label>
                      <input id="modal-phone-num" name="phone" type="tel" placeholder="+91 98765 43210" autocomplete="tel" pattern="[0-9+ ()-]{8,}" required>
                      <div class="field-error"></div>
                    </div>

                    <div class="form-row">
                      <div class="field">
                        <label for="modal-start-date">Preferred Start Date</label>
                        <input id="modal-start-date" name="start_date" type="date" required>
                        <div class="field-error"></div>
                      </div>

                      <div class="field">
                        <label for="modal-time-slot">Preferred Slot</label>
                        <select id="modal-time-slot" name="time_slot" required>
                          <option value="Morning (7:00 AM - 9:00 AM)">Morning (7:00 - 9:00 AM)</option>
                          <option value="Midday (10:00 AM - 1:00 PM)" selected>Midday (10:00 AM - 1:00 PM)</option>
                          <option value="Evening (4:00 PM - 7:00 PM)">Evening (4:00 - 7:00 PM)</option>
                          <option value="Weekend Special (Sat & Sun)">Weekend Special (Sat &amp; Sun)</option>
                        </select>
                        <div class="field-error"></div>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="field">
                        <label for="modal-transmission-select">Transmission / Plan</label>
                        <select id="modal-transmission-select" name="transmission">
                          <option value="Manual Transmission">Manual Transmission</option>
                          <option value="Automatic Transmission">Automatic Transmission</option>
                          <option value="Two-Wheeler Geared & Scooter">Two-Wheeler Combo</option>
                        </select>
                      </div>

                      <div class="field">
                        <label for="modal-instructor-select">Preferred Instructor</label>
                        <select id="modal-instructor-select" name="instructor">
                          <option value="Rajesh Kumar">Rajesh Kumar (Lead)</option>
                          <option value="Anita Rao">Anita Rao (Two-Wheeler)</option>
                          <option value="Vikram Singh">Vikram Singh (Road-Test)</option>
                          <option value="Any Available">Any Certified Coach</option>
                        </select>
                      </div>
                    </div>

                    <button class="btn btn-primary" type="submit" style="width: 100%; justify-content: center; margin-top: 6px;">
                      Confirm Enrollment &amp; Reserve Slot ${icon("arrow-right")}
                    </button>
                    <p style="margin: 8px 0 0; font-size: 10px; color: var(--muted); text-align: center;">Free cancellation &amp; slot rescheduling up to 12 hours prior.</p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`);
  }

  // Inject Unique Fee Breakdown Modal if not already present
  if (!document.querySelector("#fee-modal")) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="modal" id="fee-modal" role="dialog" aria-modal="true" aria-labelledby="modal-fee-title" aria-hidden="true">
        <div class="modal-card">
          <button class="modal-close-btn" type="button" data-close-fee aria-label="Close modal">${icon("x")}</button>
          
          <div class="modal-banner" style="background: linear-gradient(135deg, #092c48, #054a75); min-height: 145px;">
            <div class="modal-banner-content">
              <span class="tag" id="modal-fee-badge" style="background:#10b981;">Transparent Pricing</span>
              <h2 id="modal-fee-title">Official Fee Quotation</h2>
              <p id="modal-fee-tagline">Itemized pricing breakdown with no hidden surprise costs.</p>
            </div>
          </div>

          <div class="modal-inner-body">
            <div class="modal-detail-grid">
              <div>
                <h3 class="modal-section-title">${icon("receipt")} Included in This Package</h3>
                <div class="fee-item-list" id="modal-fee-breakdown-list"></div>

                <div class="fee-split-card">
                  <h4>${icon("credit-card")} Easy 2-Part Installment Plan</h4>
                  <p id="modal-fee-split-text">Pay 50% on Day 1 and the remaining 50% halfway through training with zero interest.</p>
                </div>

                <div class="fee-guarantee-badge">
                  ${icon("shield-check")}
                  <div>
                    <strong>100% First-Lesson Satisfaction Guarantee</strong>
                    <div style="font-size:10px; color:var(--muted);">If you are not delighted with your coach after Lesson 1, receive a 100% full refund.</div>
                  </div>
                </div>
              </div>

              <div>
                <div class="modal-form-card">
                  <h3 class="modal-section-title" style="font-size: 13px; margin-bottom: 12px;">${icon("file-check")} Lock Fee &amp; Generate Invoice</h3>
                  
                  <div class="form-message" role="status" id="modal-fee-form-message"></div>

                  <form class="validate-form" id="modal-fee-quote-form" novalidate data-success="Your fee quotation has been locked in! An official invoice and payment link have been dispatched.">
                    <input type="hidden" id="modal-fee-plan-id-input" name="plan_id" value="drive-confident">

                    <div class="field">
                      <label for="modal-fee-name">Student Full Name</label>
                      <input id="modal-fee-name" name="name" placeholder="e.g. Priya Sharma" autocomplete="name" required>
                      <div class="field-error"></div>
                    </div>

                    <div class="field">
                      <label for="modal-fee-phone">Phone Number</label>
                      <input id="modal-fee-phone" name="phone" type="tel" placeholder="+91 98765 43210" autocomplete="tel" pattern="[0-9+ ()-]{8,}" required>
                      <div class="field-error"></div>
                    </div>

                    <div class="field">
                      <label for="modal-fee-payment-mode">Payment Structure</label>
                      <select id="modal-fee-payment-mode" name="payment_mode">
                        <option value="full" selected>Pay in Full (100% Upfront)</option>
                        <option value="split">2-Part Easy Split (50% Now + 50% Later)</option>
                      </select>
                    </div>

                    <div style="margin: 12px 0; padding: 12px; background: var(--surface); border-radius: 8px; border: 1px solid var(--line);">
                      <div class="fee-calc-row">
                        <span>Course Base Price:</span>
                        <strong id="modal-fee-calc-base">₹9,999</strong>
                      </div>
                      <div class="fee-calc-row">
                        <span>Safety Gear &amp; Fuel Surcharge:</span>
                        <span style="color:#10b981; font-weight:700;">FREE (₹0)</span>
                      </div>
                      <div class="fee-calc-row">
                        <span>Platform &amp; Scheduling Fee:</span>
                        <span style="color:#10b981; font-weight:700;">FREE (₹0)</span>
                      </div>
                      <div class="fee-calc-row total">
                        <span>Amount Payable Today:</span>
                        <span id="modal-fee-calc-total" style="color:var(--orange); font-size:16px;">₹9,999</span>
                      </div>
                      <small id="modal-fee-govt-notes" style="font-size:10px; color:var(--muted); display:block; line-height:1.3;"></small>
                    </div>

                    <button class="btn btn-primary" type="submit" style="width: 100%; justify-content: center;">
                      Generate Official Invoice &amp; Reserve ${icon("arrow-right")}
                    </button>
                    <p style="margin: 8px 0 0; font-size: 10px; color: var(--muted); text-align: center;">Instant receipt sent via SMS &amp; WhatsApp.</p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`);
  }

  // Inject Unique Instructor Profile & Booking Modal if not already present
  if (!document.querySelector("#instructor-modal")) {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="modal" id="instructor-modal" role="dialog" aria-modal="true" aria-labelledby="modal-instructor-title" aria-hidden="true">
        <div class="modal-card">
          <button class="modal-close-btn" type="button" data-close-instructor aria-label="Close modal">${icon("x")}</button>
          
          <div class="instructor-modal-banner">
            <div class="instructor-header-flex">
              <img class="instructor-avatar-img" id="modal-instructor-avatar" src="" alt="Instructor Portrait" loading="lazy">
              <div class="instructor-header-info">
                <span class="tag" id="modal-instructor-badge">Lead Instructor</span>
                <h2 id="modal-instructor-title">Rajesh Kumar</h2>
                <p id="modal-instructor-tagline">Specializes in calm, stress-free four-wheeler coaching.</p>
              </div>
            </div>
          </div>

          <div class="modal-inner-body">
            <div class="modal-specs-bar">
              <div class="modal-spec-item">
                <span>Experience</span>
                <strong id="modal-instructor-exp">12 Years</strong>
              </div>
              <div class="modal-spec-item">
                <span>Languages</span>
                <strong id="modal-instructor-lang">English, Hindi</strong>
              </div>
              <div class="modal-spec-item">
                <span>First-Time Pass</span>
                <strong id="modal-instructor-pass">97% RTO Record</strong>
              </div>
              <div class="modal-spec-item">
                <span>Student Rating</span>
                <strong id="modal-instructor-rating">4.9 ★</strong>
              </div>
            </div>

            <div class="modal-detail-grid">
              <div>
                <h3 class="modal-section-title">${icon("user-check")} Teaching Philosophy &amp; Bio</h3>
                <p id="modal-instructor-bio" style="font-size: 13px; color: var(--muted); line-height: 1.5; margin: 0 0 14px;"></p>

                <h3 class="modal-section-title">${icon("award")} Certified Specializations</h3>
                <div class="instructor-specialty-tags" id="modal-instructor-specialties"></div>

                <div class="instructor-quote-box">
                  "${icon("quote")}" <span id="modal-instructor-quote"></span>
                  <small id="modal-instructor-student"></small>
                </div>
              </div>

              <div>
                <div class="modal-form-card">
                  <h3 class="modal-section-title" style="font-size: 13px; margin-bottom: 12px;">${icon("calendar-check")} Reserve 1-on-1 Session with <span id="modal-instructor-form-name">Coach</span></h3>
                  
                  <div class="form-message" role="status" id="modal-instructor-form-message"></div>

                  <form class="validate-form" id="modal-instructor-booking-form" novalidate data-success="Your 1-on-1 private lesson with the instructor has been booked! Your coach will contact you prior to the drive.">
                    <input type="hidden" id="modal-instructor-id-input" name="instructor_id" value="rajesh-kumar">

                    <div class="field">
                      <label for="modal-instructor-student-name">Student Full Name</label>
                      <input id="modal-instructor-student-name" name="name" placeholder="e.g. Priya Sharma" autocomplete="name" required>
                      <div class="field-error"></div>
                    </div>

                    <div class="field">
                      <label for="modal-instructor-student-phone">Phone Number</label>
                      <input id="modal-instructor-student-phone" name="phone" type="tel" placeholder="+91 98765 43210" autocomplete="tel" pattern="[0-9+ ()-]{8,}" required>
                      <div class="field-error"></div>
                    </div>

                    <div class="field">
                      <label for="modal-instructor-goal">Primary Learning Focus</label>
                      <select id="modal-instructor-goal" name="goal" required>
                        <option value="Complete Beginner Foundation" selected>Zero Experience (Beginner Foundation)</option>
                        <option value="Tight Parallel & Reverse Parking">Tight Parallel &amp; Reverse Parking</option>
                        <option value="Peak Rush-Hour & Highway Drive">Peak Rush-Hour &amp; Highway Merging</option>
                        <option value="RTO Track Mock Test Prep">RTO Exam Track Mock Test</option>
                      </select>
                    </div>

                    <div class="form-row">
                      <div class="field">
                        <label for="modal-instructor-date">Preferred Date</label>
                        <input id="modal-instructor-date" name="date" type="date" required>
                        <div class="field-error"></div>
                      </div>

                      <div class="field">
                        <label for="modal-instructor-slot">Shift Slot</label>
                        <select id="modal-instructor-slot" name="slot" required>
                          <option value="Morning Shift (7:00 AM - 9:00 AM)">Morning (7:00 - 9:00 AM)</option>
                          <option value="Midday Shift (11:00 AM - 1:00 PM)" selected>Midday (11:00 AM - 1:00 PM)</option>
                          <option value="Evening Shift (4:30 PM - 6:30 PM)">Evening (4:30 - 6:30 PM)</option>
                          <option value="Weekend Priority (Sat / Sun)">Weekend Priority</option>
                        </select>
                        <div class="field-error"></div>
                      </div>
                    </div>

                    <button class="btn btn-primary" type="submit" style="width: 100%; justify-content: center; margin-top: 6px;">
                      Confirm 1-on-1 Lesson ${icon("arrow-right")}
                    </button>
                    <p style="margin: 8px 0 0; font-size: 10px; color: var(--muted); text-align: center;">Free rescheduling up to 12 hours before your slot.</p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`);
  }

  const savedTheme = localStorage.getItem("driveway-theme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  document.documentElement.dataset.theme = initialTheme;

  const updateThemeIcon = () => {
    const button = document.querySelector("#theme-toggle");
    if (!button) return;
    button.innerHTML = icon(document.documentElement.dataset.theme === "dark" ? "sun" : "moon");
    button.setAttribute("aria-label", document.documentElement.dataset.theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    window.lucide?.createIcons();
  };

  const updateRtlButton = () => {
    const button = document.querySelector("#rtl-toggle");
    if (!button) return;
    const isRtl = document.documentElement.dir === "rtl";
    button.innerHTML = `<span class="rtl-badge">${isRtl ? "LTR" : "RTL"}</span>`;
    button.setAttribute("aria-label", isRtl ? "Switch to Left-to-Right layout (LTR)" : "Switch to Right-to-Left layout (RTL)");
    button.setAttribute("title", isRtl ? "Switch to LTR" : "Switch to RTL");
  };

  document.querySelector("#theme-toggle")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("driveway-theme", next);
    updateThemeIcon();
  });

  document.querySelector("#rtl-toggle")?.addEventListener("click", () => {
    const isRtl = document.documentElement.dir === "rtl";
    const nextDir = isRtl ? "ltr" : "rtl";
    document.documentElement.dir = nextDir;
    localStorage.setItem("driveway-direction", nextDir);
    updateRtlButton();
  });

  document.documentElement.dir = localStorage.getItem("driveway-direction") || "ltr";
  updateRtlButton();

  const nav = document.querySelector("#main-nav");
  const menu = document.querySelector("#menu-toggle");
  const dropdownItems = document.querySelectorAll("[data-nav-dropdown]");

  dropdownItems.forEach((dropdownItem) => {
    const dropdownToggle = dropdownItem.querySelector(".dropdown-toggle");
    dropdownToggle?.addEventListener("click", (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = dropdownItem.classList.contains("open");
      dropdownItems.forEach((item) => {
        if (item !== dropdownItem) {
          item.classList.remove("open");
          item.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
        }
      });
      dropdownItem.classList.toggle("open", !isCurrentlyOpen);
      dropdownToggle.setAttribute("aria-expanded", String(!isCurrentlyOpen));
    });

    dropdownItem.querySelectorAll(".dropdown-link").forEach((link) => {
      link.addEventListener("click", () => {
        dropdownItem.classList.remove("open");
        dropdownToggle?.setAttribute("aria-expanded", "false");
      });
    });
  });

  document.addEventListener("click", (e) => {
    dropdownItems.forEach((item) => {
      if (!item.contains(e.target)) {
        item.classList.remove("open");
        item.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
      }
    });
  });

  menu?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    menu.setAttribute("aria-expanded", String(Boolean(open)));
    menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.innerHTML = icon(open ? "x" : "menu");
    window.lucide?.createIcons();
  });

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menu?.setAttribute("aria-expanded", "false");
    if (menu) {
      menu.innerHTML = icon("menu");
      window.lucide?.createIcons();
    }
    // Close all open dropdowns
    dropdownItems.forEach((item) => {
      item.classList.remove("open");
      item.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
    });
  }));

  const modal = document.querySelector("#booking-modal");
  const feeModal = document.querySelector("#fee-modal");
  const instructorModal = document.querySelector("#instructor-modal");
  let previousFocus = null;

  const populateCourseModal = (courseKey, preferredInstructor) => {
    const data = COURSE_DATA[courseKey] || COURSE_DATA["four-wheeler"];
    
    // Set Header & Banner
    const bannerImg = document.querySelector("#modal-banner-image");
    if (bannerImg) bannerImg.src = data.image;
    const badge = document.querySelector("#modal-course-badge");
    if (badge) badge.textContent = data.badge;
    const title = document.querySelector("#modal-course-title");
    if (title) title.textContent = data.name;
    const tagline = document.querySelector("#modal-course-tagline");
    if (tagline) tagline.textContent = data.tagline;

    // Set Specs
    const duration = document.querySelector("#modal-spec-duration");
    if (duration) duration.textContent = data.duration;
    const vehicle = document.querySelector("#modal-spec-vehicle");
    if (vehicle) vehicle.textContent = data.vehicle;
    const pass = document.querySelector("#modal-spec-pass");
    if (pass) pass.textContent = data.passRate;
    const rating = document.querySelector("#modal-spec-rating");
    if (rating) rating.textContent = data.rating;

    // Set Overview
    const overview = document.querySelector("#modal-course-overview");
    if (overview) overview.textContent = data.overview;

    // Set Curriculum
    const curriculumContainer = document.querySelector("#modal-curriculum-container");
    if (curriculumContainer) {
      curriculumContainer.innerHTML = data.curriculum.map((c, i) => `
        <div class="curriculum-card">
          <strong>${c.title}</strong>
          <small>${c.desc}</small>
        </div>
      `).join("");
    }

    // Set Features
    const featuresList = document.querySelector("#modal-features-list");
    if (featuresList) {
      featuresList.innerHTML = data.features.map((f) => `<li>${f}</li>`).join("");
    }

    // Set Price
    const priceDisplay = document.querySelector("#modal-price-display");
    if (priceDisplay) priceDisplay.textContent = data.price;

    // Set Hidden Input
    const courseInput = document.querySelector("#modal-course-id-input");
    if (courseInput) courseInput.value = data.id;

    // Set Instructor Select
    const instructorSelect = document.querySelector("#modal-instructor-select");
    if (instructorSelect) {
      const targetInstructor = preferredInstructor || data.defaultInstructor;
      for (let opt of instructorSelect.options) {
        if (opt.value.includes(targetInstructor) || targetInstructor.includes(opt.value)) {
          instructorSelect.value = opt.value;
          break;
        }
      }
    }

    // Set default date to tomorrow
    const dateInput = document.querySelector("#modal-start-date");
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split("T")[0];
    }

    // Reset Form Message
    const msg = document.querySelector("#modal-form-message");
    if (msg) {
      msg.textContent = "";
      msg.classList.remove("show");
    }

    window.lucide?.createIcons();
  };

  const populateFeeModal = (planKey = "drive-confident") => {
    const data = FEE_PLAN_DATA[planKey] || FEE_PLAN_DATA["drive-confident"];

    const badge = document.querySelector("#modal-fee-badge");
    if (badge) badge.textContent = data.badge;
    const title = document.querySelector("#modal-fee-title");
    if (title) title.textContent = data.name;
    const tagline = document.querySelector("#modal-fee-tagline");
    if (tagline) tagline.textContent = data.tagline;

    // Breakdown List
    const breakdownList = document.querySelector("#modal-fee-breakdown-list");
    if (breakdownList) {
      breakdownList.innerHTML = data.breakdown.map((item) => `
        <div class="fee-item">
          <div class="fee-item-name">${icon("check-circle-2")} ${item.name}</div>
          <span class="fee-item-status">${item.status}</span>
        </div>
      `).join("");
    }

    // Split text
    const splitText = document.querySelector("#modal-fee-split-text");
    if (splitText) splitText.textContent = data.splitOption;

    // Base Price Display
    const baseDisplay = document.querySelector("#modal-fee-calc-base");
    if (baseDisplay) baseDisplay.textContent = data.price;

    const totalDisplay = document.querySelector("#modal-fee-calc-total");
    const modeSelect = document.querySelector("#modal-fee-payment-mode");
    if (totalDisplay && modeSelect) {
      const isSplit = modeSelect.value === "split";
      totalDisplay.textContent = isSplit ? `₹${data.splitDownPayment.toLocaleString("en-IN")}` : data.price;
    }

    const govtNotes = document.querySelector("#modal-fee-govt-notes");
    if (govtNotes) govtNotes.textContent = data.govtNotes;

    const planInput = document.querySelector("#modal-fee-plan-id-input");
    if (planInput) planInput.value = data.id;

    // Reset Form Message
    const msg = document.querySelector("#modal-fee-form-message");
    if (msg) {
      msg.textContent = "";
      msg.classList.remove("show");
    }

    // Listen to mode change to dynamically update payable total (use replaceChildren pattern to avoid stacking)
    const newSelect = modeSelect?.cloneNode(true);
    if (modeSelect && newSelect) {
      modeSelect.parentNode.replaceChild(newSelect, modeSelect);
      newSelect.addEventListener("change", () => {
        const currentPlan = FEE_PLAN_DATA[newSelect.closest("form")?.querySelector("[name='plan_id']")?.value || "drive-confident"] || data;
        if (newSelect.value === "split") {
          totalDisplay.textContent = `₹${currentPlan.splitDownPayment.toLocaleString("en-IN")} (Installment 1)`;
        } else {
          totalDisplay.textContent = currentPlan.price;
        }
      });
    }

    window.lucide?.createIcons();
  };

  const populateInstructorModal = (instructorKey = "rajesh-kumar") => {
    // Match on the slugified name ("Anita Rao" -> "anita-rao"), then fall back to
    // a first-name match so buttons can pass either form.
    const str = String(instructorKey).toLowerCase().trim();
    const slug = str.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    let key = INSTRUCTOR_DATA[slug]
      ? slug
      : Object.keys(INSTRUCTOR_DATA).find((id) => str.includes(id.split("-")[0])) || "rajesh-kumar";

    const data = INSTRUCTOR_DATA[key] || INSTRUCTOR_DATA["rajesh-kumar"];
    const isPagesDir = window.location.pathname.includes("/pages/");
    // Remote portraits are absolute URLs and must not be rewritten.
    const isAbsolute = /^(https?:)?\/\//.test(data.image);
    const imagePath = isPagesDir && !isAbsolute ? "../" + data.image : data.image;

    const avatar = document.querySelector("#modal-instructor-avatar");
    if (avatar) avatar.src = imagePath;
    const badge = document.querySelector("#modal-instructor-badge");
    if (badge) badge.textContent = data.badge;
    const title = document.querySelector("#modal-instructor-title");
    if (title) title.textContent = data.name;
    const tagline = document.querySelector("#modal-instructor-tagline");
    if (tagline) tagline.textContent = data.tagline;

    // Specs
    const exp = document.querySelector("#modal-instructor-exp");
    if (exp) exp.textContent = data.experience;
    const lang = document.querySelector("#modal-instructor-lang");
    if (lang) lang.textContent = data.languages;
    const pass = document.querySelector("#modal-instructor-pass");
    if (pass) pass.textContent = data.passRate;
    const rating = document.querySelector("#modal-instructor-rating");
    if (rating) rating.textContent = data.rating;

    // Bio
    const bio = document.querySelector("#modal-instructor-bio");
    if (bio) bio.textContent = data.bio;

    // Specialties
    const specialtiesList = document.querySelector("#modal-instructor-specialties");
    if (specialtiesList) {
      specialtiesList.innerHTML = data.specialties.map((s) => `<span class="instructor-specialty-tag">${icon("check")} ${s}</span>`).join("");
    }

    // Quote
    const quote = document.querySelector("#modal-instructor-quote");
    if (quote) quote.textContent = data.quote;
    const student = document.querySelector("#modal-instructor-student");
    if (student) student.textContent = "— " + data.student;

    // Form Coach Name
    const formName = document.querySelector("#modal-instructor-form-name");
    if (formName) formName.textContent = data.name.split(" ")[0];

    const instInput = document.querySelector("#modal-instructor-id-input");
    if (instInput) instInput.value = data.id;

    // Default Date to Tomorrow
    const dateInput = document.querySelector("#modal-instructor-date");
    if (dateInput && !dateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split("T")[0];
    }

    // Reset message
    const msg = document.querySelector("#modal-instructor-form-message");
    if (msg) {
      msg.textContent = "";
      msg.classList.remove("show");
    }

    window.lucide?.createIcons();
  };

  const openModal = (courseKey = "four-wheeler", instructorName = null) => {
    populateCourseModal(courseKey, instructorName);
    previousFocus = document.activeElement;
    if (modal) {
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      modal.scrollTop = 0;
      const card = modal.querySelector(".modal-card");
      if (card) {
        card.scrollTop = 0;
        card.scrollLeft = 0;
      }
      document.body.classList.add("modal-open");
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }
    previousFocus?.focus?.();
  };

  const openFeeModal = (planKey = "drive-confident") => {
    populateFeeModal(planKey);
    previousFocus = document.activeElement;
    if (feeModal) {
      feeModal.classList.add("open");
      feeModal.setAttribute("aria-hidden", "false");
      feeModal.scrollTop = 0;
      const card = feeModal.querySelector(".modal-card");
      if (card) {
        card.scrollTop = 0;
        card.scrollLeft = 0;
      }
      document.body.classList.add("modal-open");
    }
  };

  const closeFeeModal = () => {
    if (feeModal) {
      feeModal.classList.remove("open");
      feeModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }
    previousFocus?.focus?.();
  };

  const openInstructorModal = (instructorKey = "rajesh-kumar") => {
    populateInstructorModal(instructorKey);
    previousFocus = document.activeElement;
    if (instructorModal) {
      instructorModal.classList.add("open");
      instructorModal.setAttribute("aria-hidden", "false");
      instructorModal.scrollTop = 0;
      const card = instructorModal.querySelector(".modal-card");
      if (card) {
        card.scrollTop = 0;
        card.scrollLeft = 0;
      }
      document.body.classList.add("modal-open");
    }
  };

  const closeInstructorModal = () => {
    if (instructorModal) {
      instructorModal.classList.remove("open");
      instructorModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }
    previousFocus?.focus?.();
  };

  // Click handlers for all open modal buttons
  document.addEventListener("click", (event) => {
    const feeBtn = event.target.closest("[data-open-fee-plan]");
    if (feeBtn) {
      event.preventDefault();
      const planKey = feeBtn.getAttribute("data-open-fee-plan") || "drive-confident";
      openFeeModal(planKey);
      return;
    }

    const instructorBtn = event.target.closest("[data-open-instructor]");
    if (instructorBtn) {
      event.preventDefault();
      const instructorName = instructorBtn.getAttribute("data-open-instructor") || "rajesh-kumar";
      openInstructorModal(instructorName);
      return;
    }

    const courseBtn = event.target.closest("[data-open-course]");
    if (courseBtn) {
      event.preventDefault();
      const courseKey = courseBtn.getAttribute("data-open-course") || "four-wheeler";
      const instructorName = courseBtn.getAttribute("data-open-instructor") || null;
      openModal(courseKey, instructorName);
      return;
    }

    const bookingBtn = event.target.closest("[data-open-booking]");
    if (bookingBtn) {
      event.preventDefault();
      // If on instructors page, open instructor modal instead
      if (window.location.pathname.includes("instructors.html")) {
        const card = bookingBtn.closest(".content-card");
        let instKey = "rajesh-kumar";
        if (card) {
          const text = card.textContent.toLowerCase();
          const match = Object.keys(INSTRUCTOR_DATA).find((id) => text.includes(id.split("-")[0]));
          if (match) instKey = match;
        }
        openInstructorModal(instKey);
        return;
      }

      // If on fees page, open fee modal instead
      if (window.location.pathname.includes("fees.html")) {
        const card = bookingBtn.closest(".content-card");
        let planKey = "drive-confident";
        if (card) {
          const text = card.textContent.toLowerCase();
          if (text.includes("ride ready") || text.includes("two-wheeler")) planKey = "ride-ready";
          else if (text.includes("back on the road") || text.includes("refresher")) planKey = "back-on-road";
          else if (text.includes("fast track") || text.includes("intensive")) planKey = "fast-track";
          else if (text.includes("commercial")) planKey = "commercial-lmv";
        }
        openFeeModal(planKey);
        return;
      }

      // Default course modal
      const card = bookingBtn.closest(".content-card");
      let courseKey = "four-wheeler";
      if (card) {
        const text = card.textContent.toLowerCase();
        if (text.includes("two-wheeler") || text.includes("scooter") || text.includes("anita")) {
          courseKey = "two-wheeler";
        } else if (text.includes("refresher") || text.includes("confidence")) {
          courseKey = "refresher";
        } else if (text.includes("intensive") || text.includes("fast-track") || text.includes("fast track")) {
          courseKey = "intensive";
        }
      }
      openModal(courseKey);
      return;
    }

    const closeCourseBtn = event.target.closest("[data-close-booking]");
    if (closeCourseBtn) {
      event.preventDefault();
      closeModal();
      return;
    }

    const closeFeeBtn = event.target.closest("[data-close-fee]");
    if (closeFeeBtn) {
      event.preventDefault();
      closeFeeModal();
      return;
    }

    const closeInstBtn = event.target.closest("[data-close-instructor]");
    if (closeInstBtn) {
      event.preventDefault();
      closeInstructorModal();
      return;
    }

    if (event.target === modal) {
      closeModal();
    }
    if (event.target === feeModal) {
      closeFeeModal();
    }
    if (event.target === instructorModal) {
      closeInstructorModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (modal?.classList.contains("open")) closeModal();
      if (feeModal?.classList.contains("open")) closeFeeModal();
      if (instructorModal?.classList.contains("open")) closeInstructorModal();
    }

    // Focus trap for open modals
    if (event.key === "Tab") {
      const openModal = document.querySelector(".modal.open");
      if (!openModal) return;
      const focusable = openModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
  });

  const messageFor = (field) => {
    if (field.validity.valueMissing) return "Please complete this field.";
    if (field.validity.typeMismatch) return "Please enter a valid value.";
    if (field.validity.patternMismatch) return "Please use a valid phone number.";
    return "Please check this value.";
  };

  document.querySelectorAll(".validate-form").forEach((form) => {
    const fields = form.querySelectorAll("input, select, textarea");
    fields.forEach((field) => field.addEventListener("input", () => {
      field.removeAttribute("aria-invalid");
      const error = field.closest(".field")?.querySelector(".field-error");
      if (error) error.textContent = "";
    }));

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let valid = true;
      fields.forEach((field) => {
        const error = field.closest(".field")?.querySelector(".field-error");
        if (!field.checkValidity()) {
          valid = false;
          field.setAttribute("aria-invalid", "true");
          if (error) error.textContent = messageFor(field);
        }
      });
      if (!valid) {
        form.querySelector("[aria-invalid='true']")?.focus();
        return;
      }
      const success = form.closest(".auth-view, .form-shell, .modal-card, .modal-form-card")?.querySelector(".form-message") || form.querySelector(".form-message");
      if (success) {
        const isBooking = form.closest(".modal-card, .modal-form-card") || form.id.includes("booking") || form.id.includes("enrollment") || form.id.includes("fee");
        if (isBooking) {
          const randomBookingId = "DW-" + Math.floor(1000 + Math.random() * 9000);
          success.innerHTML = `<strong>${form.dataset.success || "Your registration request has been confirmed!"}</strong><br><span style="font-size:11px; color:var(--muted);">Booking Reference: <strong>#${randomBookingId}</strong>. A confirmation SMS with instructor details has been sent.</span>`;
        } else {
          success.innerHTML = `<strong>${form.dataset.success || "Operation successful."}</strong>`;
        }
        success.classList.add("show");
      }
      form.reset();
      if (form.dataset.redirect) {
        window.setTimeout(() => { window.location.href = form.dataset.redirect; }, 700);
      }
    });
  });

  document.querySelectorAll("[data-year]").forEach((item) => { item.textContent = String(new Date().getFullYear()); });

  // Sticky Header Scroll Effect
  const siteHeader = document.querySelector(".site-header");
  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 24) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Scroll Reveal System & Viewport Counter Trigger
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Auto-tag elements for reveal if not already tagged
  const autoRevealSelectors = [
    ".feature-strip",
    ".feature",
    ".achievement",
    ".section-heading",
    ".testimonial-card",
    ".content-card",
    ".journey-grid",
    ".journey-step",
    ".pricing-card",
    ".instructor-card",
    ".vehicle-card",
    ".faq-item",
    ".two-column > *"
  ];

  if (!prefersReduced) {
    autoRevealSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el, index) => {
        if (!el.classList.contains("reveal") && !el.classList.contains("reveal-scale") && !el.classList.contains("reveal-left") && !el.classList.contains("reveal-right")) {
          el.classList.add("reveal");
          const stagger = (index % 4) + 1;
          el.classList.add(`delay-${stagger}`);
        }
      });
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.12
    });

    document.querySelectorAll(".reveal, .reveal-up, .reveal-scale, .reveal-left, .reveal-right").forEach((el) => {
      revealObserver.observe(el);
    });
  }

  // Viewport-Triggered Counter Animation
  const startCounter = (counter) => {
    const target = Number(counter.dataset.counter || 0);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 45));
    const timer = window.setInterval(() => {
      current = Math.min(target, current + increment);
      counter.textContent = target >= 1000 ? `${current.toLocaleString()}+` : `${current}${counter.dataset.suffix || ""}`;
      if (current >= target) window.clearInterval(timer);
    }, 28);
  };

  if ("IntersectionObserver" in window && !prefersReduced) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll("[data-counter]").forEach((counter) => counterObserver.observe(counter));
  } else {
    document.querySelectorAll("[data-counter]").forEach(startCounter);
  }

  // Testimonial Carousel Slider (supports all pages)
  const setupTestimonialSliders = () => {
    document.querySelectorAll(".testimonial-slider").forEach((slider) => {
      const track = slider.querySelector(".testimonial-track");
      const section = slider.closest(".testimonials") || slider.parentElement;
      const dots = section.querySelectorAll(".slider-dots .slider-dot");
      if (!track || dots.length === 0) return;

      let currentIndex = 0;
      const totalSlides = dots.length;
      let autoPlayTimer = null;

      const goToSlide = (index) => {
        currentIndex = (index + totalSlides) % totalSlides;
        const isRtl = document.documentElement.dir === "rtl";
        const offset = isRtl ? (currentIndex * 100) : -(currentIndex * 100);
        track.style.transform = `translateX(${offset}%)`;
        dots.forEach((dot, idx) => {
          dot.classList.toggle("active", idx === currentIndex);
          dot.setAttribute("aria-selected", String(idx === currentIndex));
        });
      };

      dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
          goToSlide(index);
          restartAutoPlay();
        });
      });

      const startAutoPlay = () => {
        if (prefersReduced) return;
        autoPlayTimer = window.setInterval(() => {
          goToSlide(currentIndex + 1);
        }, 5500);
      };

      const stopAutoPlay = () => {
        if (autoPlayTimer) {
          window.clearInterval(autoPlayTimer);
          autoPlayTimer = null;
        }
      };

      const restartAutoPlay = () => {
        stopAutoPlay();
        startAutoPlay();
      };

      slider.addEventListener("mouseenter", stopAutoPlay);
      slider.addEventListener("mouseleave", startAutoPlay);

      // Touch swipe support
      let touchStartX = 0;
      let touchEndX = 0;
      slider.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
      }, { passive: true });

      slider.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 45) {
          if (diff > 0) {
            goToSlide(currentIndex + 1);
          } else {
            goToSlide(currentIndex - 1);
          }
        }
        startAutoPlay();
      }, { passive: true });

      startAutoPlay();
    });
  };
  setupTestimonialSliders();

  // Live Interactive Contact Map (Leaflet.js)
  const setupInteractiveContactMap = () => {
    const mapContainer = document.getElementById("contact-map");
    if (!mapContainer) return;

    const BRANCH_DATA = {
      central: {
        id: "central",
        name: "Central Campus & Test Track",
        tag: "Main HQ & Automated Track",
        lat: 12.9716,
        lng: 77.5946,
        zoom: 15,
        address: "123 Drive Way, Central District, Bengaluru – 560001",
        phone: "+91 98765 43210",
        hours: "Mon–Sat: 7:00 AM – 7:30 PM",
        amenities: ["Automated 8-Track", "Dual-Control Fleet", "Simulator Lab", "RTO Test Desk"],
        directionsUrl: "https://maps.google.com/?q=12.9716,77.5946"
      },
      north: {
        id: "north",
        name: "North City Training Hub",
        tag: "2-Wheeler & City Route Training",
        lat: 12.9980,
        lng: 77.5850,
        zoom: 15,
        address: "45 Metro Boulevard, Near North Gate, Bengaluru – 560024",
        phone: "+91 98765 43211",
        hours: "Mon–Sat: 7:00 AM – 7:00 PM",
        amenities: ["2-Wheeler Track", "Compact Cars", "Theory Classrooms", "Fast-track Desk"],
        directionsUrl: "https://maps.google.com/?q=12.9980,77.5850"
      },
      south: {
        id: "south",
        name: "South Highway Training Center",
        tag: "Highway & Heavy Vehicle Practice",
        lat: 12.9352,
        lng: 77.6245,
        zoom: 15,
        address: "88 Express Avenue, South Sector, Bengaluru – 560100",
        phone: "+91 98765 43212",
        hours: "Mon–Sat: 6:30 AM – 8:00 PM",
        amenities: ["Commercial Vehicles", "Highway Ramp Practice", "Night Driving Course", "Parallel Parking"],
        directionsUrl: "https://maps.google.com/?q=12.9352,77.6245"
      }
    };

    const showToast = (message) => {
      const toast = document.getElementById("map-toast");
      if (!toast) return;
      toast.innerHTML = `<i data-lucide="check-circle-2" style="width:18px;height:18px;color:#10b981;"></i> <span>${message}</span>`;
      window.lucide?.createIcons();
      toast.classList.add("show");
      setTimeout(() => {
        toast.classList.remove("show");
      }, 3500);
    };

    const initLeaflet = () => {
      if (typeof window.L === "undefined") {
        setTimeout(initLeaflet, 100);
        return;
      }

      // Initial center covering Bengaluru branches
      const initialCenter = [12.968, 77.602];
      const initialZoom = 12;

      const map = L.map("contact-map", {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // Enable scroll wheel zoom on click/focus
      map.on("focus", () => map.scrollWheelZoom.enable());
      mapContainer.addEventListener("mouseleave", () => map.scrollWheelZoom.disable());

      // OpenStreetMap Tiles
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Custom DivIcon for branches
      const createBranchIcon = (branchId) => {
        return L.divIcon({
          className: "custom-map-marker-wrapper",
          html: `
            <div class="custom-map-marker" data-marker-id="${branchId}">
              <div class="pin-pulse-ring"></div>
              <div class="pin-bubble">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                  <path d="M12 2v8"></path>
                  <path d="m4.93 4.93 5.66 5.66"></path>
                  <path d="m19.07 4.93-5.66 5.66"></path>
                </svg>
              </div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 40],
          popupAnchor: [0, -36]
        });
      };

      const markers = {};
      const markerGroup = L.featureGroup();

      Object.values(BRANCH_DATA).forEach((branch) => {
        const popupContent = `
          <div class="map-popup-card">
            <div class="map-popup-header">
              <span class="map-popup-tag">${branch.tag}</span>
            </div>
            <h4>${branch.name}</h4>
            <p><i data-lucide="map-pin" style="width:13px;height:13px;display:inline;vertical-align:middle;margin-right:3px;"></i> ${branch.address}</p>
            <p><i data-lucide="clock" style="width:13px;height:13px;display:inline;vertical-align:middle;margin-right:3px;"></i> ${branch.hours}</p>
            <div class="map-popup-actions">
              <a class="map-popup-btn" href="${branch.directionsUrl}" target="_blank" rel="noopener noreferrer">
                <i data-lucide="navigation" style="width:13px;height:13px;"></i> Directions
              </a>
              <button class="map-popup-btn secondary btn-popup-copy" data-copy-addr="${branch.address}" type="button">
                <i data-lucide="copy" style="width:13px;height:13px;"></i> Copy
              </button>
            </div>
          </div>
        `;

        const marker = L.marker([branch.lat, branch.lng], {
          icon: createBranchIcon(branch.id),
          title: branch.name
        }).bindPopup(popupContent);

        marker.on("popupopen", () => {
          window.lucide?.createIcons();
          const copyBtn = document.querySelector(".btn-popup-copy");
          if (copyBtn) {
            copyBtn.onclick = () => {
              const text = copyBtn.getAttribute("data-copy-addr");
              if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                  showToast("Branch address copied to clipboard! 📋");
                }).catch(() => {
                  showToast("Branch address copied!");
                });
              } else {
                showToast("Branch address copied!");
              }
            };
          }
        });

        marker.addTo(map);
        markerGroup.addLayer(marker);
        markers[branch.id] = marker;
      });

      // Active state management
      const activateBranch = (branchId, shouldPan = true) => {
        // Update tabs
        document.querySelectorAll(".branch-tab").forEach((tab) => {
          const isActive = tab.getAttribute("data-branch") === branchId;
          tab.classList.toggle("active", isActive);
          tab.setAttribute("aria-selected", String(isActive));
        });

        // Update cards
        document.querySelectorAll("[data-branch-card]").forEach((card) => {
          const cardId = card.getAttribute("data-branch-card");
          const isMatching = branchId === "all" || cardId === branchId;
          card.classList.toggle("active", isMatching);
        });

        if (branchId === "all") {
          map.closePopup();
          map.fitBounds(markerGroup.getBounds(), { padding: [50, 50], maxZoom: 14 });
        } else if (BRANCH_DATA[branchId]) {
          const branch = BRANCH_DATA[branchId];
          if (shouldPan) {
            map.flyTo([branch.lat, branch.lng], branch.zoom, {
              duration: 1.2,
              easeLinearity: 0.25
            });
          }
          setTimeout(() => {
            markers[branchId]?.openPopup();
          }, 350);
        }
      };

      // Branch Tab Click Handlers
      document.querySelectorAll(".branch-tab").forEach((tab) => {
        tab.addEventListener("click", () => {
          const branchId = tab.getAttribute("data-branch");
          activateBranch(branchId, true);
        });
      });

      // Branch Card "Focus on Map" Buttons
      document.querySelectorAll(".btn-focus-branch").forEach((btn) => {
        btn.addEventListener("click", () => {
          const branchId = btn.getAttribute("data-branch");
          activateBranch(branchId, true);
          mapContainer.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      });

      // Reset Map View Button
      document.getElementById("btn-reset-map")?.addEventListener("click", () => {
        activateBranch("all", true);
        showToast("Map view reset to show all campuses.");
      });

      // Copy Address Buttons
      document.querySelectorAll(".btn-copy-address").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const address = btn.getAttribute("data-address");
          if (navigator.clipboard) {
            navigator.clipboard.writeText(address).then(() => {
              showToast("Address copied to clipboard! 📋");
            }).catch(() => {
              showToast("Address copied!");
            });
          } else {
            showToast("Address copied!");
          }
        });
      });

      // Haversine Distance Calculator
      const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10) / 10;
      };

      // Geolocation "Find Nearest Campus"
      let userLocationMarker = null;
      document.getElementById("btn-locate-me")?.addEventListener("click", () => {
        const locateBtn = document.getElementById("btn-locate-me");
        const statusBanner = document.getElementById("geo-status-banner");

        if (!navigator.geolocation) {
          showToast("Geolocation is not supported by your browser.");
          return;
        }

        locateBtn.classList.add("loading");
        locateBtn.innerHTML = `<i data-lucide="loader" class="spin"></i> <span>Detecting location...</span>`;
        window.lucide?.createIcons();

        navigator.geolocation.getCurrentPosition(
          (position) => {
            locateBtn.classList.remove("loading");
            locateBtn.innerHTML = `<i data-lucide="crosshair"></i> <span>Find Nearest Campus</span>`;
            window.lucide?.createIcons();

            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Remove existing user marker if any
            if (userLocationMarker) {
              map.removeLayer(userLocationMarker);
            }

            // Create user location marker
            const userIcon = L.divIcon({
              className: "custom-map-marker-wrapper",
              html: `
                <div class="custom-map-marker user-location">
                  <div class="pin-pulse-ring"></div>
                  <div class="pin-bubble">
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="4"></circle>
                      <path d="M12 2v2"></path>
                      <path d="M12 20v2"></path>
                      <path d="M2 12h2"></path>
                      <path d="M20 12h2"></path>
                    </svg>
                  </div>
                </div>
              `,
              iconSize: [44, 44],
              iconAnchor: [22, 40],
              popupAnchor: [0, -36]
            });

            userLocationMarker = L.marker([userLat, userLng], {
              icon: userIcon,
              title: "Your Location"
            }).bindPopup(`
              <div class="map-popup-card">
                <div class="map-popup-header">
                  <span class="map-popup-tag" style="background:rgba(13,93,184,0.15);color:var(--blue);">Current Location</span>
                </div>
                <h4>You Are Here</h4>
                <p>Distances calculated to all DriveWay branches.</p>
              </div>
            `).addTo(map);

            // Find nearest branch
            let minDistance = Infinity;
            let nearestBranch = null;

            Object.values(BRANCH_DATA).forEach((branch) => {
              const dist = calculateDistanceKm(userLat, userLng, branch.lat, branch.lng);
              const distBox = document.querySelector(`[data-branch-dist="${branch.id}"]`);
              if (distBox) {
                distBox.style.display = "block";
                distBox.innerHTML = `<i data-lucide="navigation"></i> <strong>${dist} km</strong> from your live position`;
              }
              if (dist < minDistance) {
                minDistance = dist;
                nearestBranch = branch;
              }
            });

            window.lucide?.createIcons();

            if (nearestBranch) {
              const nearestBox = document.querySelector(`[data-branch-dist="${nearestBranch.id}"]`);
              if (nearestBox) {
                nearestBox.innerHTML = `<i data-lucide="check-circle"></i> <strong>${minDistance} km</strong> away — <em>Closest Campus!</em>`;
                nearestBox.style.background = "rgba(29, 165, 91, 0.12)";
                nearestBox.style.borderColor = "var(--green)";
                nearestBox.style.color = "var(--green)";
              }

              if (statusBanner) {
                statusBanner.style.display = "flex";
                statusBanner.innerHTML = `
                  <i data-lucide="map-pin" style="color:var(--orange);"></i>
                  <div>Your closest DriveWay center is <strong>${nearestBranch.name}</strong> (${minDistance} km away). Map centered on this branch!</div>
                `;
                window.lucide?.createIcons();
              }

              // Fit bounds to show user and nearest branch
              const bounds = L.latLngBounds([
                [userLat, userLng],
                [nearestBranch.lat, nearestBranch.lng]
              ]);
              map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 15, duration: 1.4 });

              setTimeout(() => {
                activateBranch(nearestBranch.id, false);
                markers[nearestBranch.id]?.openPopup();
              }, 1400);

              showToast(`Nearest campus: ${nearestBranch.name} (${minDistance} km)`);
            }
          },
          (error) => {
            locateBtn.classList.remove("loading");
            locateBtn.innerHTML = `<i data-lucide="crosshair"></i> <span>Find Nearest Campus</span>`;
            window.lucide?.createIcons();
            let msg = "Could not access your location. Please check browser permissions.";
            if (error.code === 1) msg = "Location permission was denied.";
            if (error.code === 2) msg = "Location information unavailable.";
            if (error.code === 3) msg = "Location request timed out.";
            showToast(msg);
          },
          { timeout: 10000, enableHighAccuracy: true }
        );
      });

      // Handle map invalidation on resize / theme change
      window.addEventListener("resize", () => map.invalidateSize());
      document.querySelector("#theme-toggle")?.addEventListener("click", () => {
        setTimeout(() => map.invalidateSize(), 150);
      });
    };

    initLeaflet();
  };
  setupInteractiveContactMap();

  // Auth View Switching (Sign In <-> Forgot Password)
  const setupAuthViews = () => {
    const signinView = document.querySelector("#signin-view");
    const forgotView = document.querySelector("#forgot-view");
    const toForgotBtn = document.querySelector("#to-forgot-btn");
    const toSigninBtn = document.querySelector("#to-signin-btn");

    if (!signinView || !forgotView) return;

    const showView = (viewName) => {
      if (viewName === "forgot") {
        signinView.style.display = "none";
        signinView.classList.remove("active");
        forgotView.style.display = "block";
        forgotView.classList.add("active");
        forgotView.querySelector("#forgot-email")?.focus();
        if (window.location.hash !== "#forgot-password") {
          if (history.replaceState) {
            history.replaceState(null, "", "#forgot-password");
          }
        }
      } else {
        forgotView.style.display = "none";
        forgotView.classList.remove("active");
        signinView.style.display = "block";
        signinView.classList.add("active");
        signinView.querySelector("#signin-email")?.focus();
        if (window.location.hash) {
          if (history.replaceState) {
            history.replaceState(null, "", window.location.pathname + window.location.search);
          }
        }
      }
      window.lucide?.createIcons();
    };

    toForgotBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      showView("forgot");
    });

    toSigninBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      showView("signin");
    });

    window.addEventListener("hashchange", () => {
      if (window.location.hash === "#forgot-password" || window.location.hash === "#forgot") {
        showView("forgot");
      } else {
        showView("signin");
      }
    });

    // Handle initial hash on page load
    if (window.location.hash === "#forgot-password" || window.location.hash === "#forgot") {
      showView("forgot");
    }
  };
  setupAuthViews();

  const setupScenarioFilter = () => {
    const tabs = document.querySelectorAll(".scenario-tab-btn");
    const cards = document.querySelectorAll(".scenario-card");
    if (!tabs.length || !cards.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const cat = tab.getAttribute("data-category");
        tabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        cards.forEach((card) => {
          const cardCat = card.getAttribute("data-category");
          if (cat === "all" || cardCat === cat) {
            card.classList.remove("hidden");
          } else {
            card.classList.add("hidden");
          }
        });
      });
    });
  };
  setupScenarioFilter();

  updateThemeIcon();
  window.lucide?.createIcons();
})();

