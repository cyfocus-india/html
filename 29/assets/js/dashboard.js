/* ==========================================================================
   Copper Pot Cooking Studio — dashboard.js
   Student dashboard: booking seats, sessions, recipes, payments, profile.
   All data lives in localStorage ("cp-dash-v1") so changes survive refresh.
   1.  Helpers (DOM, dates, money, escaping)
   2.  Catalog + recipe templates
   3.  Seed data + load/save
   4.  Navigation (views, sidebar, popovers)
   5.  Modal + toast
   6.  Overview (stats, chart, donut, lists)
   7.  Book a Seat
   8.  My Sessions
   9.  Recipes
   10. Payments
   11. Notifications
   12. Profile & settings
   13. Init
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. Helpers
     ------------------------------------------------------------------ */
  var KEY = 'cp-dash-v1';
  var IMG = '../assets/images/';
  var CP = window.CP || {
    getItem: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    setItem: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    validateForm: function () { return true; },
    setError: function () { return true; },
    setTheme: function () {},
    setDir: function () {}
  };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function uid(prefix) { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function money(n) { return '$' + Number(n || 0).toLocaleString('en-US'); }

  /* Dates are stored as local "YYYY-MM-DD" strings */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function isoFromDate(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function today() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function offsetDate(days) { var d = today(); d.setDate(d.getDate() + days); return isoFromDate(d); }
  function parseIso(iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmtDate(iso, withYear) {
    var opts = { weekday: 'short', month: 'short', day: 'numeric' };
    if (withYear) opts.year = 'numeric';
    return parseIso(iso).toLocaleDateString('en-US', opts);
  }
  function fmtShort(iso) { return parseIso(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function isPastDate(iso) { return parseIso(iso) < today(); }
  function timeToMinutes(t) {
    var m = /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i.exec(t || '');
    if (!m) return 0;
    var h = (+m[1]) % 12 + (m[3].toUpperCase() === 'PM' ? 12 : 0);
    return h * 60 + (+m[2] || 0);
  }
  function sortKey(item) { return parseIso(item.date).getTime() + timeToMinutes(item.time) * 60000; }
  function firstName(name) { return (name || '').trim().split(/\s+/)[0] || 'there'; }
  function initials(name) {
    var parts = (name || '').trim().split(/\s+/);
    return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }

  /* ------------------------------------------------------------------
     2. Catalog (mirrors the public Classes + Weekend Workshops pages)
     offset = days from today; seats = seats left
     ------------------------------------------------------------------ */
  var CATALOG = [
    { id: 'roman-pasta', title: 'Roman Pasta Classics', type: 'class', cuisine: 'Italian', level: 'Beginner', chef: 'Elena Russo', offset: 1, time: '6:30 PM', length: '3 hrs', price: 89, seats: 3, cap: 12, img: 'class-roman-pasta.jpg' },
    { id: 'neapolitan-pizza', title: 'Neapolitan Pizza Night', type: 'class', cuisine: 'Italian', level: 'Beginner', chef: 'Luis Ortega', offset: 2, time: '6:30 PM', length: '3 hrs', price: 85, seats: 6, cap: 12, img: 'class-neapolitan-pizza.jpg' },
    { id: 'sushi-rolling', title: 'Sushi Rolling Basics', type: 'class', cuisine: 'Japanese', level: 'Beginner', chef: 'Kenji Mori', offset: 3, time: '11:00 AM', length: '3 hrs', price: 95, seats: 5, cap: 12, img: 'class-sushi-rolling.jpg' },
    { id: 'handmade-ravioli', title: 'Handmade Ravioli & Butter Sauces', type: 'class', cuisine: 'Italian', level: 'Intermediate', chef: 'Elena Russo', offset: 6, time: '6:00 PM', length: '3.5 hrs', price: 115, seats: 4, cap: 12, img: 'class-handmade-ravioli.jpg' },
    { id: 'thai-street-wok', title: 'Thai Street Wok', type: 'class', cuisine: 'Thai', level: 'Intermediate', chef: 'Somchai Rattanakorn', offset: 7, time: '6:30 PM', length: '3 hrs', price: 109, seats: 7, cap: 12, img: 'class-thai-street-wok.jpg' },
    { id: 'street-tacos', title: 'Street Tacos & Fresh Salsas', type: 'class', cuisine: 'Mexican', level: 'Beginner', chef: 'Luis Ortega', offset: 9, time: '6:30 PM', length: '3 hrs', price: 85, seats: 8, cap: 12, img: 'class-street-tacos.jpg' },
    { id: 'ramen', title: 'Ramen from the Broth Up', type: 'class', cuisine: 'Japanese', level: 'Advanced', chef: 'Kenji Mori', offset: 10, time: '10:00 AM', length: '4 hrs', price: 155, seats: 2, cap: 12, img: 'class-ramen.jpg' },
    { id: 'knife-skills', title: 'Knife Skills Bootcamp', type: 'class', cuisine: 'Fundamentals', level: 'Beginner', chef: 'Kenji Mori', offset: 13, time: '6:30 PM', length: '2.5 hrs', price: 75, seats: 9, cap: 12, img: 'class-knife-skills.jpg' },
    { id: 'north-indian-curry', title: 'North Indian Curry House', type: 'class', cuisine: 'Indian', level: 'Beginner', chef: 'Priya Nair (guest)', offset: 14, time: '6:30 PM', length: '3 hrs', price: 89, seats: 10, cap: 12, img: 'class-north-indian-curry.jpg' },
    { id: 'seafood-paella', title: 'Seafood Paella', type: 'class', cuisine: 'Spanish', level: 'Intermediate', chef: 'Luis Ortega', offset: 15, time: '6:30 PM', length: '3 hrs', price: 119, seats: 6, cap: 12, img: 'class-seafood-paella.jpg' },
    { id: 'croissants', title: 'Laminated Dough: Croissants', type: 'class', cuisine: 'French', level: 'Advanced', chef: 'Elena Russo', offset: 17, time: '9:30 AM', length: '4.5 hrs', price: 165, seats: 3, cap: 12, img: 'class-croissants.jpg' },
    { id: 'khao-soi', title: 'Khao Soi & Curry Pastes', type: 'class', cuisine: 'Thai', level: 'Advanced', chef: 'Somchai Rattanakorn', offset: 18, time: '11:00 AM', length: '4 hrs', price: 145, seats: 5, cap: 12, img: 'class-khao-soi.jpg' },
    { id: 'samosas-chutneys', title: 'Samosas, Pakoras & Chutneys', type: 'class', cuisine: 'Indian', level: 'Intermediate', chef: 'Priya Nair (guest)', offset: 22, time: '6:30 PM', length: '3 hrs', price: 105, seats: 11, cap: 12, img: 'class-samosas-chutneys.jpg' },
    { id: 'macarons', title: 'Parisian Macarons', type: 'class', cuisine: 'French', level: 'Advanced', chef: 'Elena Russo', offset: 25, time: '11:00 AM', length: '3.5 hrs', price: 139, seats: 4, cap: 12, img: 'class-macarons.jpg' },
    { id: 'ws-pasta-fresca', title: 'Pasta Fresca Intensive', type: 'workshop', cuisine: 'Italian', level: 'Intermediate', chef: 'Elena Russo', offset: 10, time: '10:00 AM', length: '2 days', price: 345, seats: 2, cap: 10, img: 'workshop-pasta-fresca.jpg' },
    { id: 'ws-sourdough', title: 'Sourdough & Wild Fermentation', type: 'workshop', cuisine: 'Baking', level: 'Intermediate', chef: 'Luis Ortega', offset: 24, time: '10:00 AM', length: '2 days', price: 325, seats: 6, cap: 10, img: 'workshop-sourdough.jpg' },
    { id: 'ws-izakaya', title: 'Japanese Izakaya Weekend', type: 'workshop', cuisine: 'Japanese', level: 'Intermediate', chef: 'Kenji Mori', offset: 31, time: '10:00 AM', length: '2 days', price: 365, seats: 4, cap: 10, img: 'workshop-izakaya.jpg' },
    { id: 'ws-holiday-desserts', title: 'Holiday Desserts & Layer Cakes', type: 'workshop', cuisine: 'Baking', level: 'Intermediate', chef: 'Elena Russo', offset: 38, time: '10:00 AM', length: '2 days', price: 335, seats: 7, cap: 10, img: 'workshop-holiday-desserts.jpg' },
    { id: 'ws-viennoiserie', title: 'Croissant & Viennoiserie Weekend', type: 'workshop', cuisine: 'French', level: 'Advanced', chef: 'Elena Russo', offset: 52, time: '10:00 AM', length: '2 days', price: 395, seats: 1, cap: 10, img: 'workshop-viennoiserie.jpg' },
    { id: 'ws-thai-curry', title: 'Thai Curry Paste Masterclass', type: 'workshop', cuisine: 'Thai', level: 'Intermediate', chef: 'Somchai Rattanakorn', offset: 59, time: '10:00 AM', length: '2 days', price: 335, seats: 8, cap: 10, img: 'workshop-thai-curry-paste.jpg' },
    { id: 'ws-fire-steak', title: 'Fire & Steak Weekend', type: 'workshop', cuisine: 'Live fire', level: 'Intermediate', chef: 'Luis Ortega', offset: 87, time: '10:00 AM', length: '2 days', price: 365, seats: 9, cap: 10, img: 'workshop-fire-steak.jpg' }
  ];

  /* Recipes that unlock after attending a class (keyed by class id) */
  var RECIPES = {
    'knife-skills': [{
      title: 'Knife-Skills Minestrone', cuisine: 'Fundamentals', time: '40 min', serves: '4',
      ingredients: ['1 onion, small dice', '2 carrots, small dice', '2 celery ribs, small dice', '3 garlic cloves, minced', '1 zucchini, small dice', '400 g can crushed tomatoes', '1 litre vegetable stock', '1 parmesan rind', '1 cup ditalini pasta', '400 g can cannellini beans, drained', 'Handful of basil, chiffonade', 'Olive oil, salt and pepper'],
      steps: ['Sweat the onion, carrot and celery in olive oil with a pinch of salt for 8 minutes.', 'Add the garlic and zucchini and cook for 3 minutes more.', 'Add the tomatoes, stock and parmesan rind, then simmer for 15 minutes.', 'Add the pasta and beans and cook until the pasta is al dente.', 'Season, then finish with basil ribbons and a drizzle of olive oil.'],
      note: 'Keep every dice the same size so it all cooks evenly. That is the whole lesson in one pot. — Chef Kenji'
    }],
    'sushi-rolling': [{
      title: 'Salmon-Avocado Uramaki', cuisine: 'Japanese', time: '60 min', serves: '4 rolls',
      ingredients: ['2 cups sushi rice', '60 ml rice vinegar', '1 tbsp sugar', '1 tsp salt', '4 sheets nori', '200 g sushi-grade salmon, in strips', '1 ripe avocado, sliced', 'Toasted sesame seeds', 'Soy sauce, wasabi and pickled ginger'],
      steps: ['Rinse the rice until the water runs clear, then cook with 2¼ cups water.', 'Dissolve the sugar and salt in the vinegar and fold into the hot rice with slicing strokes.', 'Fan the rice until it is body temperature.', 'Spread rice over nori on a wrapped mat, sprinkle with sesame and flip.', 'Lay salmon and avocado along the bottom third and roll firmly.', 'Cut into 8 pieces with a wet knife.'],
      note: 'Roll while the rice is body temperature. Too warm and the nori turns chewy. — Chef Kenji'
    }, {
      title: 'Ten-Minute Miso Soup', cuisine: 'Japanese', img: 'workshop-izakaya.jpg', time: '10 min', serves: '2',
      ingredients: ['500 ml dashi', '2 tbsp white miso', '100 g silken tofu, cubed', '1 tbsp dried wakame', '1 spring onion, thinly sliced'],
      steps: ['Soak the wakame in cold water for 5 minutes.', 'Heat the dashi until just below a simmer.', 'Whisk the miso with a ladle of dashi, then stir it back into the pot.', 'Add the tofu and wakame and warm through without boiling.', 'Serve topped with spring onion.'],
      note: 'Never boil miso. It dulls the flavour and kills the aroma. — Chef Kenji'
    }],
    'street-tacos': [{
      title: 'Slow-Cooked Carnitas', cuisine: 'Mexican', time: '2 hr 45 min', serves: '6',
      ingredients: ['1.5 kg pork shoulder, in 5 cm cubes', '1 orange, juiced (keep the halves)', '1 white onion, quartered', '4 garlic cloves', '2 bay leaves', '1 tsp ground cumin', '1 tsp Mexican oregano', '2 tsp salt', '250 ml water'],
      steps: ['Put everything, including the orange halves, in a heavy pot.', 'Simmer covered for 2 hours until the pork is tender.', 'Uncover, turn up the heat and let the liquid evaporate.', 'Let the pork fry in its own fat, turning until crisp at the edges.', 'Shred roughly and serve in warm corn tortillas.'],
      note: 'Do not rush the crisping stage. That is where the flavour lives. — Chef Luis'
    }, {
      title: 'Charred Salsa Roja', cuisine: 'Mexican', img: 'recipe-salsa-tacos.jpg', time: '20 min', serves: '2 cups',
      ingredients: ['4 plum tomatoes', '2 dried guajillo chillies', '1 chile de árbol', '½ white onion', '2 garlic cloves, unpeeled', 'Juice of 1 lime', 'Salt'],
      steps: ['Char the tomatoes, onion and garlic in a dry cast-iron pan until blackened in spots.', 'Toast the chillies for 30 seconds a side, then soak in hot water for 10 minutes.', 'Peel the garlic and blend everything with the lime and salt.', 'Taste and adjust heat with more árbol if you like.'],
      note: 'Toast chillies until fragrant, not smoking, or the salsa turns bitter. — Chef Luis'
    }],
    'north-indian-curry': [{
      title: 'Butter Chicken', cuisine: 'Indian', img: 'recipe-butter-chicken.jpg', time: '50 min', serves: '4',
      ingredients: ['700 g boneless chicken thighs', '150 g plain yogurt', '2 tsp garam masala', '1 tbsp ginger-garlic paste', '40 g butter', '1 onion, finely chopped', '1 tsp Kashmiri chilli powder', '400 g tomato purée', '120 ml cream', '1 tsp kasuri methi', 'Salt'],
      steps: ['Marinate the chicken in yogurt, half the garam masala and the ginger-garlic paste for 30 minutes.', 'Sear the chicken in a very hot pan until charred, then set aside.', 'Melt the butter and soften the onion for 8 minutes; add the chilli and tomato.', 'Simmer for 10 minutes, blend smooth and return to the pan with the chicken.', 'Simmer 10 minutes, then stir in the cream, methi and remaining garam masala.'],
      note: 'Crush the methi between your palms before adding it. — Chef Priya'
    }, {
      title: 'Chana Masala', cuisine: 'Indian', time: '35 min', serves: '4',
      ingredients: ['2 × 400 g cans chickpeas, drained', '2 tbsp ghee', '1 tsp cumin seeds', '1 onion, finely chopped', '1 tbsp ginger-garlic paste', '1 green chilli, slit', '1 tsp ground coriander', '½ tsp turmeric', '2 tomatoes, chopped', '1 tsp amchur', '1 tsp garam masala', 'Fresh coriander'],
      steps: ['Bloom the cumin seeds in ghee until they crackle.', 'Add the onion and cook until deep golden.', 'Add the paste, chilli, coriander and turmeric and cook for 1 minute.', 'Add the tomatoes and cook down to a jammy masala.', 'Add the chickpeas and a splash of water, simmer 15 minutes and mash a few.', 'Finish with amchur, garam masala and fresh coriander.'],
      note: 'The onions should be properly golden. Pale onions make a flat curry. — Chef Priya'
    }],
    'roman-pasta': [{
      title: 'Proper Carbonara', cuisine: 'Italian', time: '25 min', serves: '2',
      ingredients: ['200 g spaghetti', '100 g guanciale, in batons', '3 egg yolks + 1 whole egg', '50 g pecorino romano, finely grated', 'Plenty of black pepper'],
      steps: ['Render the guanciale slowly in a cold pan until crisp; take off the heat.', 'Whisk the eggs, pecorino and pepper into a paste.', 'Cook the pasta in lightly salted water until just al dente.', 'Toss the pasta with the guanciale, then off the heat add the egg paste.', 'Loosen with pasta water, tossing until silky and glossy.'],
      note: 'Off the heat, always. The pan should be warm, not hot. — Chef Elena'
    }],
    'thai-street-wok': [{
      title: 'Tamarind Pad Thai', cuisine: 'Thai', time: '30 min', serves: '2',
      ingredients: ['150 g dried rice noodles, soaked', '3 tbsp tamarind concentrate', '2 tbsp fish sauce', '2 tbsp palm sugar', '8 prawns', '2 eggs', '1 cup bean sprouts', '2 spring onions', 'Crushed peanuts and lime'],
      steps: ['Melt the tamarind, fish sauce and palm sugar into a sauce.', 'Sear the prawns in a smoking wok and push them aside.', 'Scramble the eggs, then add the noodles and sauce.', 'Toss until the noodles absorb the sauce.', 'Add sprouts and spring onion, then finish with peanuts and lime.'],
      note: 'Taste the sauce first: sour, salty, sweet, in that order. — Chef Somchai'
    }],
    'ws-pasta-fresca': [{
      title: 'Golden Egg Pasta Dough', cuisine: 'Italian', time: '1 hr', serves: '4',
      ingredients: ['300 g tipo 00 flour', '3 whole eggs', '2 egg yolks', 'Semolina for dusting'],
      steps: ['Make a well in the flour and add the eggs and yolks.', 'Beat with a fork, drawing in flour until a shaggy dough forms.', 'Knead for 10 minutes until smooth and springy.', 'Wrap and rest for 30 minutes before rolling.'],
      note: 'If it feels sticky after kneading, it was too wet. Add flour a spoon at a time. — Chef Elena'
    }]
  };

  /* ------------------------------------------------------------------
     3. Seed data + persistence
     ------------------------------------------------------------------ */
  function findCatalog(id) { return CATALOG.filter(function (c) { return c.id === id; })[0]; }

  function makeBooking(id, classId, dateOffset, seats, status, extra) {
    var c = findCatalog(classId);
    var b = {
      id: id, classId: classId, title: c.title, cuisine: c.cuisine, type: c.type, chef: c.chef,
      date: offsetDate(dateOffset), time: c.time, length: c.length, price: c.price, img: c.img,
      seats: seats, status: status, note: '', method: 'card', recipesUnlocked: false
    };
    Object.keys(extra || {}).forEach(function (k) { b[k] = extra[k]; });
    return b;
  }

  function seed() {
    var sessions = CATALOG.map(function (c) {
      return { id: c.id, title: c.title, type: c.type, cuisine: c.cuisine, level: c.level, chef: c.chef, date: offsetDate(c.offset), time: c.time, length: c.length, price: c.price, seatsLeft: c.seats, cap: c.cap, img: c.img };
    });
    var bookings = [
      makeBooking('b1', 'roman-pasta', 1, 1, 'upcoming', { method: 'card' }),
      makeBooking('b2', 'thai-street-wok', 7, 2, 'upcoming', { method: 'pass', note: 'Cooking with my partner, Sam.' }),
      makeBooking('b3', 'ws-pasta-fresca', 10, 1, 'upcoming', { method: 'later' }),
      makeBooking('b4', 'knife-skills', -62, 1, 'attended'),
      makeBooking('b5', 'sushi-rolling', -41, 1, 'attended', { method: 'pass' }),
      makeBooking('b6', 'street-tacos', -27, 1, 'attended', { method: 'pass' }),
      makeBooking('b7', 'north-indian-curry', -12, 1, 'attended'),
      makeBooking('b8', 'neapolitan-pizza', -20, 1, 'cancelled')
    ];
    var payments = [
      { id: 'P-1042', date: offsetDate(-70), desc: 'Knife Skills Bootcamp · 1 seat', method: 'Visa •• 4242', amount: 75, credits: 0, status: 'Paid', bookingId: 'b4' },
      { id: 'P-1051', date: offsetDate(-50), desc: '5-Class Pass', method: 'Visa •• 4242', amount: 425, credits: 0, status: 'Paid' },
      { id: 'P-1053', date: offsetDate(-48), desc: 'Sushi Rolling Basics · 1 seat', method: 'Pass credit', amount: 0, credits: 1, status: 'Paid', bookingId: 'b5' },
      { id: 'P-1060', date: offsetDate(-34), desc: 'Street Tacos & Fresh Salsas · 1 seat', method: 'Pass credit', amount: 0, credits: 1, status: 'Paid', bookingId: 'b6' },
      { id: 'P-1066', date: offsetDate(-25), desc: 'Neapolitan Pizza Night · 1 seat', method: 'Visa •• 4242', amount: 85, credits: 0, status: 'Refunded', bookingId: 'b8' },
      { id: 'P-1071', date: offsetDate(-20), desc: 'North Indian Curry House · 1 seat', method: 'Mastercard •• 8810', amount: 89, credits: 0, status: 'Paid', bookingId: 'b7' },
      { id: 'P-1080', date: offsetDate(-6), desc: 'Roman Pasta Classics · 1 seat', method: 'Visa •• 4242', amount: 89, credits: 0, status: 'Paid', bookingId: 'b1' },
      { id: 'P-1081', date: offsetDate(-5), desc: 'Thai Street Wok · 2 seats', method: 'Pass credit', amount: 0, credits: 2, status: 'Paid', bookingId: 'b2' },
      { id: 'P-1085', date: offsetDate(-2), desc: 'Pasta Fresca Intensive · 1 seat', method: 'Not paid yet', amount: 345, credits: 0, status: 'Pending', bookingId: 'b3' }
    ];
    var state = {
      version: 1,
      profile: { name: 'Maya Thompson', email: 'maya.thompson@example.com', phone: '(503) 555-0192', level: 'Intermediate', diet: ['Nut allergy'] },
      settings: { reminders: true, sms: false, newClasses: true, recipeAlerts: true },
      credits: 1,
      nextPay: 1086,
      sessions: sessions,
      bookings: bookings,
      payments: payments,
      recipes: [],
      cards: [
        { id: 'c1', brand: 'Visa', last4: '4242', exp: '08/28', name: 'Maya Thompson', isDefault: true },
        { id: 'c2', brand: 'Mastercard', last4: '8810', exp: '03/27', name: 'Maya Thompson', isDefault: false }
      ],
      notifications: [
        { id: 'n1', text: 'Seat confirmed: Roman Pasta Classics, ' + fmtDate(offsetDate(1)) + ' at 6:30 PM.', date: offsetDate(-6), read: false, view: 'sessions' },
        { id: 'n2', text: 'Payment due: Pasta Fresca Intensive ($345) before your workshop.', date: offsetDate(-2), read: false, view: 'payments' },
        { id: 'n3', text: 'Chef Kenji added a new Saturday date for Sushi Rolling Basics.', date: offsetDate(-9), read: true, view: 'book' },
        { id: 'n4', text: 'Your Neapolitan Pizza Night seat was refunded as class credit.', date: offsetDate(-20), read: true, view: 'payments' }
      ]
    };
    /* Unlock recipes for seeded past classes without adding notifications */
    state.bookings.forEach(function (b) { if (b.status === 'attended') unlockRecipes(state, b, true); });
    return state;
  }

  function load() {
    var raw = CP.getItem(KEY);
    if (raw) {
      try { var parsed = JSON.parse(raw); if (parsed && parsed.version === 1) return parsed; } catch (e) { /* fall through */ }
    }
    return seed();
  }
  function save() { CP.setItem(KEY, JSON.stringify(state)); }

  var state = load();

  /* Bring stored data up to date: past bookings become "attended" and unlock recipes */
  function syncTime() {
    state.bookings.forEach(function (b) {
      if (b.status === 'upcoming' && isPastDate(b.date)) {
        b.status = 'attended';
        unlockRecipes(state, b, false);
      }
    });
  }

  function unlockRecipes(st, booking, silent) {
    if (booking.recipesUnlocked) return;
    booking.recipesUnlocked = true;
    var list = RECIPES[booking.classId] || [];
    var unlocked = parseIso(booking.date);
    unlocked.setDate(unlocked.getDate() + 1);
    list.forEach(function (r, i) {
      st.recipes.push({
        id: booking.id + '-r' + i, classId: booking.classId, fromClass: booking.title, img: r.img || booking.img,
        title: r.title, cuisine: r.cuisine, time: r.time, serves: r.serves,
        ingredients: r.ingredients.slice(), steps: r.steps.slice(), chefNote: r.note,
        notes: '', fav: false, own: false, unlocked: isoFromDate(unlocked)
      });
    });
    if (!silent && list.length) {
      st.notifications.unshift({ id: uid('n'), text: list.length + ' new recipe' + (list.length > 1 ? 's' : '') + ' unlocked from ' + booking.title + '.', date: isoFromDate(today()), read: false, view: 'recipes' });
    }
  }

  /* Apply the signed-in student's name + email to the profile */
  (function applySession() {
    try {
      var s = JSON.parse(CP.getItem('cp-session') || 'null');
      if (s && s.email && s.email !== state.profile.email) {
        state.profile.name = s.name || state.profile.name;
        state.profile.email = s.email;
        state.cards.forEach(function (c) { c.name = state.profile.name; });
      }
    } catch (e) { /* ignore */ }
  })();

  syncTime();
  save();

  /* ------------------------------------------------------------------
     4. Navigation
     ------------------------------------------------------------------ */
  var VIEWS = {
    overview: ['Overview', 'Your week at the studio'],
    book: ['Book a Seat', 'Live seats for the next three months'],
    sessions: ['My Sessions', 'Upcoming, attended and cancelled bookings'],
    recipes: ['Recipes', 'Every recipe from the classes you’ve cooked'],
    payments: ['Payments', 'Receipts, balances and saved cards'],
    profile: ['Profile & Settings', 'Your details, dietary needs and preferences']
  };
  var currentView = 'overview';

  function showView(name, opts) {
    if (!VIEWS[name]) name = 'overview';
    currentView = name;
    $$('.dash-view').forEach(function (v) { v.hidden = v.getAttribute('data-view') !== name; });
    $$('.side-link').forEach(function (l) {
      var on = l.getAttribute('data-nav') === name;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
    });
    $('[data-view-title]').textContent = VIEWS[name][0];
    $('[data-view-sub]').textContent = VIEWS[name][1];
    document.title = VIEWS[name][0] + ' | Dashboard | Copper Pot Cooking Studio';
    if (history.replaceState) history.replaceState(null, '', '#' + name);
    closeSidebar();
    closePopovers();
    window.scrollTo(0, 0);
    if (!(opts && opts.silent)) $('#main').focus({ preventScroll: true });
    if (name === 'overview') drawChart();
  }

  document.addEventListener('click', function (e) {
    var nav = e.target.closest('[data-nav]');
    if (nav) { e.preventDefault(); showView(nav.getAttribute('data-nav')); }
  });

  /* Sidebar (off-canvas below 1024px) */
  var sidebar = $('#dash-sidebar');
  var burger = $('.dash-burger');
  var overlay = $('[data-side-overlay]');
  function openSidebar() {
    sidebar.classList.add('is-open');
    overlay.hidden = false;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close dashboard menu');
    document.body.classList.add('nav-open');
    var first = $('.side-link', sidebar);
    if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function closeSidebar() {
    if (!sidebar.classList.contains('is-open')) return;
    sidebar.classList.remove('is-open');
    overlay.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open dashboard menu');
    document.body.classList.remove('nav-open');
  }
  burger.addEventListener('click', function () {
    if (sidebar.classList.contains('is-open')) closeSidebar(); else openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);

  /* Popovers (notifications + account menu) */
  function closePopovers(except) {
    $$('[data-pop]').forEach(function (btn) {
      var pop = document.getElementById(btn.getAttribute('aria-controls'));
      if (pop !== except) { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    });
  }
  $$('[data-pop]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var pop = document.getElementById(btn.getAttribute('aria-controls'));
      var open = pop.hidden;
      closePopovers(pop);
      pop.hidden = !open;
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.pop-wrap')) closePopovers();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!modal.hidden) { closeModal(); return; }
    closePopovers();
    if (sidebar.classList.contains('is-open')) { closeSidebar(); burger.focus(); }
  });

  /* ------------------------------------------------------------------
     5. Modal + toast
     ------------------------------------------------------------------ */
  var modal = $('[data-modal]');
  var modalBody = $('[data-modal-body]');
  var lastFocus = null;

  function openModal(title, html, onMount) {
    lastFocus = document.activeElement;
    $('[data-modal-title]').textContent = title;
    modalBody.innerHTML = html;
    modal.hidden = false;
    document.body.classList.add('nav-open');
    if (onMount) onMount(modalBody);
    var focusable = modalBody.querySelector('input, select, textarea, button');
    (focusable || $('[data-modal-close]')).focus();
  }
  function closeModal() {
    modal.hidden = true;
    modalBody.innerHTML = '';
    document.body.classList.remove('nav-open');
    if (lastFocus && lastFocus.focus && document.body.contains(lastFocus)) lastFocus.focus();
  }
  $('[data-modal-close]').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  modal.addEventListener('click', function (e) { if (e.target.closest('[data-cancel]')) closeModal(); });
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = $$('button:not([disabled]), input:not([disabled]), select, textarea, a[href]', modal).filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });

  function confirmModal(title, message, confirmLabel, onConfirm) {
    openModal(title, '<p>' + message + '</p><div class="modal-actions"><button class="btn btn--ghost" type="button" data-cancel>Keep it</button><button class="btn" type="button" data-confirm>' + esc(confirmLabel) + '</button></div>', function (body) {
      $('[data-confirm]', body).addEventListener('click', function () { closeModal(); onConfirm(); });
    });
  }

  var toastTimer;
  function toast(msg) {
    var t = $('[data-toast]');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 3200);
  }

  /* ------------------------------------------------------------------
     Shared selectors over state
     ------------------------------------------------------------------ */
  function upcomingBookings() {
    return state.bookings.filter(function (b) { return b.status === 'upcoming'; }).sort(function (a, b) { return sortKey(a) - sortKey(b); });
  }
  function findSession(id) { return state.sessions.filter(function (s) { return s.id === id; })[0]; }
  function activeBookingFor(sessionId) {
    return state.bookings.filter(function (b) { return b.classId === sessionId && b.status === 'upcoming'; })[0];
  }
  function defaultCard() { return state.cards.filter(function (c) { return c.isDefault; })[0] || state.cards[0]; }
  function cardLabel(c) { return c.brand + ' •• ' + c.last4; }
  function within12Months(iso) { var d = parseIso(iso); var limit = today(); limit.setFullYear(limit.getFullYear() - 1); return d >= limit; }
  function addNotif(text, view) {
    state.notifications.unshift({ id: uid('n'), text: text, date: isoFromDate(today()), read: false, view: view || null });
  }
  function nextPayId() { state.nextPay += 1; return 'P-' + state.nextPay; }

  /* ------------------------------------------------------------------
     6. Overview
     ------------------------------------------------------------------ */
  var DONUT_COLORS = ['#C2602F', '#5E8C66', '#D9A441', '#8E5572', '#3C7A89', '#9A8F86', '#B9734F', '#6E7F45'];

  function renderOverview() {
    var p = state.profile;
    var hour = new Date().getHours();
    var greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    $('[data-greeting]').textContent = greet + ', ' + firstName(p.name);
    var up = upcomingBookings();
    var next = up[0];
    $('[data-next-class]').innerHTML = next
      ? 'Your next class is <strong>' + esc(next.title) + '</strong> on ' + esc(fmtDate(next.date)) + ' at ' + esc(next.time) + ' with ' + esc(next.chef) + '.'
      : 'You have no classes booked right now. There are seats waiting for you this week.';

    var recipes = state.recipes.length;
    var spent = state.payments.filter(function (x) { return x.status === 'Paid' && within12Months(x.date); });
    var spentTotal = spent.reduce(function (s, x) { return s + x.amount; }, 0);
    $('[data-stat="upcoming"]').textContent = up.length;
    $('[data-stat-foot="upcoming"]').textContent = next ? 'Next: ' + fmtDate(next.date) : 'Nothing booked yet';
    $('[data-stat="recipes"]').textContent = recipes;
    var classesWithRecipes = {};
    state.recipes.forEach(function (r) { if (!r.own) classesWithRecipes[r.classId] = 1; });
    $('[data-stat-foot="recipes"]').textContent = 'From ' + Object.keys(classesWithRecipes).length + ' classes';
    $('[data-stat="credits"]').textContent = state.credits;
    $('[data-stat="spent"]').textContent = money(spentTotal);
    $('[data-stat-foot="spent"]').textContent = 'Across ' + spent.length + (spent.length === 1 ? ' payment' : ' payments');

    /* Coming up list */
    var upList = $('[data-upcoming-list]');
    upList.innerHTML = up.length ? up.slice(0, 3).map(function (b) {
      return '<li class="mini-item"><img src="' + IMG + esc(b.img) + '" alt="" width="52" height="52"><div class="mi-text"><strong>' + esc(b.title) + '</strong><span>' + esc(fmtDate(b.date)) + ' · ' + esc(b.time) + ' · ' + b.seats + (b.seats > 1 ? ' seats' : ' seat') + '</span></div></li>';
    }).join('') : '<li class="mini-empty">No upcoming sessions. <button class="link-btn" type="button" data-nav="book">Book a seat</button></li>';

    /* Latest recipes */
    var recent = state.recipes.slice().sort(function (a, b) { return a.unlocked < b.unlocked ? 1 : -1; }).slice(0, 3);
    $('[data-recipe-mini]').innerHTML = recent.length ? recent.map(function (r) {
      var thumb = r.img ? '<img src="' + IMG + esc(r.img) + '" alt="" width="52" height="52">' : '<span class="avatar" aria-hidden="true">' + esc(initials(r.title)) + '</span>';
      return '<li class="mini-item">' + thumb + '<div class="mi-text"><strong>' + esc(r.title) + '</strong><span>' + esc(r.own ? 'My recipe' : r.fromClass) + '</span></div><button class="act-btn" type="button" data-open-recipe="' + esc(r.id) + '">Open</button></li>';
    }).join('') : '<li class="mini-empty">Recipes appear here after your first class.</li>';

    renderDonut();
    drawChart();
  }

  function renderDonut() {
    var counts = {};
    state.bookings.forEach(function (b) { if (b.status !== 'cancelled') counts[b.cuisine] = (counts[b.cuisine] || 0) + 1; });
    var keys = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; });
    var total = keys.reduce(function (s, k) { return s + counts[k]; }, 0);
    var donut = $('[data-donut]');
    var acc = 0;
    var stops = keys.map(function (k, i) {
      var start = acc / total * 100;
      acc += counts[k];
      return DONUT_COLORS[i % DONUT_COLORS.length] + ' ' + start.toFixed(2) + '% ' + (acc / total * 100).toFixed(2) + '%';
    });
    donut.style.setProperty('--donut', total ? 'conic-gradient(' + stops.join(', ') + ')' : 'conic-gradient(var(--border) 0 100%)');
    $('[data-donut-total]').textContent = total;
    donut.setAttribute('aria-label', 'Cuisine mix: ' + keys.map(function (k) { return k + ' ' + counts[k]; }).join(', '));
    $('[data-donut-legend]').innerHTML = keys.map(function (k, i) {
      return '<li><i style="background:' + DONUT_COLORS[i % DONUT_COLORS.length] + '"></i>' + esc(k) + '<b>' + counts[k] + '</b></li>';
    }).join('') || '<li class="muted">No classes yet</li>';
  }

  /* Canvas bar chart: attended (sage) + booked (copper), stacked by month */
  function chartData() {
    var now = today();
    var months = [];
    for (var i = -5; i <= 2; i++) {
      var d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({ y: d.getFullYear(), m: d.getMonth(), label: d.toLocaleDateString('en-US', { month: 'short' }), attended: 0, upcoming: 0, current: i === 0 });
    }
    state.bookings.forEach(function (b) {
      if (b.status === 'cancelled') return;
      var d = parseIso(b.date);
      months.forEach(function (mo) {
        if (mo.y === d.getFullYear() && mo.m === d.getMonth()) mo[b.status === 'attended' ? 'attended' : 'upcoming'] += 1;
      });
    });
    return months;
  }

  function drawChart() {
    var canvas = $('[data-chart]');
    if (!canvas || currentView !== 'overview') return;
    var box = canvas.parentNode;
    var w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    var dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var cs = getComputedStyle(document.documentElement);
    var cMuted = cs.getPropertyValue('--muted').trim();
    var cBorder = cs.getPropertyValue('--border').trim();
    var cText = cs.getPropertyValue('--text').trim();
    var cSage = cs.getPropertyValue('--sage').trim();
    var cBrand = cs.getPropertyValue('--brand').trim();
    var font = getComputedStyle(document.body).fontFamily;

    var data = chartData();
    if (document.documentElement.getAttribute('dir') === 'rtl') data.reverse();
    var maxVal = Math.max(3, Math.max.apply(null, data.map(function (d) { return d.attended + d.upcoming; })));
    var step = maxVal <= 5 ? 1 : 2;
    maxVal = Math.ceil(maxVal / step) * step;

    var padL = 30, padR = 10, padT = 14, padB = 30;
    var plotW = w - padL - padR, plotH = h - padT - padB;

    /* Grid + y labels */
    ctx.font = '12px ' + font;
    ctx.textBaseline = 'middle';
    for (var v = 0; v <= maxVal; v += step) {
      var y = padT + plotH - (v / maxVal) * plotH;
      ctx.strokeStyle = cBorder;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(padL, Math.round(y) + .5); ctx.lineTo(w - padR, Math.round(y) + .5); ctx.stroke();
      ctx.fillStyle = cMuted;
      ctx.textAlign = 'right';
      ctx.fillText(String(v), padL - 8, y);
    }

    /* Bars */
    var slot = plotW / data.length;
    var bw = Math.min(30, slot * .5);
    data.forEach(function (d, i) {
      var x = padL + slot * i + (slot - bw) / 2;
      var base = padT + plotH;
      var hA = (d.attended / maxVal) * plotH;
      var hU = (d.upcoming / maxVal) * plotH;
      if (hA) { ctx.fillStyle = cSage; roundRect(ctx, x, base - hA, bw, hA, hU ? 0 : 6); }
      if (hU) { ctx.fillStyle = cBrand; roundRect(ctx, x, base - hA - hU, bw, hU, 6); }
      var total = d.attended + d.upcoming;
      if (total) {
        ctx.fillStyle = cText;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(String(total), x + bw / 2, base - hA - hU - 4);
      }
      ctx.fillStyle = d.current ? cText : cMuted;
      ctx.font = (d.current ? '600 ' : '') + '12px ' + font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(d.label, x + bw / 2, base + 8);
      ctx.font = '12px ' + font;
      ctx.textBaseline = 'middle';
    });

    canvas.setAttribute('aria-label', 'Classes by month: ' + chartData().map(function (d) {
      return d.label + ' ' + d.attended + ' attended, ' + d.upcoming + ' booked';
    }).join('; '));
  }

  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, h, w / 2);
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
  }

  var resizeTimer;
  window.addEventListener('resize', function () { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawChart, 120); });
  document.addEventListener('cp:themechange', function () { drawChart(); syncPrefButtons(); });
  document.addEventListener('cp:dirchange', function () { drawChart(); syncPrefButtons(); });

  /* ------------------------------------------------------------------
     7. Book a Seat
     ------------------------------------------------------------------ */
  var bookFilters = { q: '', type: 'all', cuisine: 'all', level: 'all' };

  function fillSelect(sel, values) {
    var current = sel.value;
    var first = sel.options[0].outerHTML;
    sel.innerHTML = first + values.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + '</option>'; }).join('');
    if (values.indexOf(current) !== -1) sel.value = current;
  }

  function renderBook() {
    var cuisines = [];
    state.sessions.forEach(function (s) { if (cuisines.indexOf(s.cuisine) === -1) cuisines.push(s.cuisine); });
    fillSelect($('[data-book-cuisine]'), cuisines.sort());

    var list = state.sessions.filter(function (s) {
      if (isPastDate(s.date)) return false;
      if (bookFilters.type !== 'all' && s.type !== bookFilters.type) return false;
      if (bookFilters.cuisine !== 'all' && s.cuisine !== bookFilters.cuisine) return false;
      if (bookFilters.level !== 'all' && s.level !== bookFilters.level) return false;
      if (bookFilters.q) {
        var hay = (s.title + ' ' + s.chef + ' ' + s.cuisine).toLowerCase();
        if (hay.indexOf(bookFilters.q) === -1) return false;
      }
      return true;
    }).sort(function (a, b) { return sortKey(a) - sortKey(b); });

    $('[data-book-count]').textContent = list.length + (list.length === 1 ? ' session' : ' sessions') + ' available';
    $('[data-book-empty]').hidden = list.length !== 0;
    $('[data-book-grid]').innerHTML = list.map(function (s) {
      var booked = activeBookingFor(s.id);
      var pct = Math.round((1 - s.seatsLeft / s.cap) * 100);
      var low = s.seatsLeft <= 3;
      var action = booked
        ? '<span class="chip chip--booked">✓ Booked</span><button class="act-btn" type="button" data-nav="sessions">Manage</button>'
        : s.seatsLeft === 0
          ? '<button class="btn btn--sm" type="button" disabled>Full</button>'
          : '<button class="btn btn--sm" type="button" data-book="' + esc(s.id) + '">Book seat</button>';
      return '<article class="book-card">' +
        '<img src="' + IMG + esc(s.img) + '" alt="' + esc(s.title) + '" width="800" height="560" loading="lazy">' +
        '<div class="book-body">' +
          '<div class="chip-row"><span class="chip">' + esc(s.cuisine) + '</span><span class="chip chip--outline">' + (s.type === 'workshop' ? 'Workshop' : esc(s.level)) + '</span></div>' +
          '<h3>' + esc(s.title) + '</h3>' +
          '<p class="book-meta"><b>' + esc(fmtDate(s.date)) + '</b> · ' + esc(s.type === 'workshop' ? 'Sat & Sun, 10 AM–4 PM' : s.time) + ' · ' + esc(s.length) + '<br>Chef ' + esc(s.chef) + '</p>' +
          '<div class="seat-line"><span class="seat-bar' + (low ? ' low' : '') + '"><i style="width:' + pct + '%"></i></span><span>' + s.seatsLeft + ' of ' + s.cap + ' left</span></div>' +
          '<div class="book-foot"><span class="price">' + money(s.price) + ' <small>/ seat</small></span>' + action + '</div>' +
        '</div></article>';
    }).join('');
  }

  $('[data-book-search]').addEventListener('input', function (e) { bookFilters.q = e.target.value.trim().toLowerCase(); renderBook(); });
  $('[data-book-type]').addEventListener('change', function (e) { bookFilters.type = e.target.value; renderBook(); });
  $('[data-book-cuisine]').addEventListener('change', function (e) { bookFilters.cuisine = e.target.value; renderBook(); });
  $('[data-book-level]').addEventListener('change', function (e) { bookFilters.level = e.target.value; renderBook(); });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-book]');
    if (b) openBookingModal(b.getAttribute('data-book'));
  });

  function paymentOptions(s, seats) {
    var passOk = s.type === 'class' && s.price <= 125;
    var opts = '';
    opts += '<label class="radio-opt' + (passOk && state.credits >= seats ? '' : ' is-disabled') + '"><input type="radio" name="pay" value="pass"' + (passOk && state.credits >= seats ? '' : ' disabled') + '><span>Pass credits<small>' + state.credits + ' left · ' + (passOk ? 'uses 1 credit per seat' : 'not valid for this session') + '</small></span></label>';
    state.cards.forEach(function (c, i) {
      opts += '<label class="radio-opt"><input type="radio" name="pay" value="card:' + esc(c.id) + '"' + (c.isDefault || (!defaultCard() && i === 0) ? ' checked' : '') + '><span>' + esc(cardLabel(c)) + '<small>Expires ' + esc(c.exp) + (c.isDefault ? ' · default' : '') + '</small></span></label>';
    });
    opts += '<label class="radio-opt"><input type="radio" name="pay" value="later"' + (state.cards.length ? '' : ' checked') + '><span>Pay later<small>Added to your balance, due before the class</small></span></label>';
    return opts;
  }

  function openBookingModal(sessionId) {
    var s = findSession(sessionId);
    if (!s) return;
    var maxSeats = Math.min(4, s.seatsLeft);
    var seatOpts = '';
    for (var i = 1; i <= maxSeats; i++) seatOpts += '<option value="' + i + '">' + i + (i > 1 ? ' seats' : ' seat') + '</option>';
    var diet = state.profile.diet.length ? state.profile.diet.join(', ') : '';
    var html =
      '<div class="modal-summary"><img src="' + IMG + esc(s.img) + '" alt=""><div><strong>' + esc(s.title) + '</strong><span>' + esc(fmtDate(s.date, true)) + ' · ' + esc(s.type === 'workshop' ? 'Sat & Sun, 10 AM–4 PM' : s.time) + ' · Chef ' + esc(s.chef) + '</span></div></div>' +
      '<form data-booking-form novalidate>' +
        '<div class="field"><label for="bk-seats">Seats</label><select class="select" id="bk-seats">' + seatOpts + '</select></div>' +
        '<div class="field"><span class="label">Payment</span><div class="radio-list" data-pay-opts>' + paymentOptions(s, 1) + '</div></div>' +
        '<div class="field"><label for="bk-note">Dietary needs or notes <span class="optional">(optional)</span></label><textarea class="textarea" id="bk-note" rows="2" style="min-height:80px">' + esc(diet) + '</textarea></div>' +
        '<div class="total-line"><span>Total</span><strong data-total></strong></div>' +
        '<div class="modal-actions"><button class="btn btn--ghost" type="button" data-cancel>Cancel</button><button class="btn" type="submit">Confirm booking</button></div>' +
      '</form>';
    openModal('Book a seat', html, function (body) {
      var form = $('[data-booking-form]', body);
      var seatsSel = $('#bk-seats', body);
      function updateTotal() {
        var seats = +seatsSel.value;
        var choice = (form.querySelector('input[name="pay"]:checked') || {}).value;
        $('[data-total]', body).textContent = choice === 'pass' ? seats + (seats > 1 ? ' credits' : ' credit') : money(s.price * seats);
      }
      seatsSel.addEventListener('change', function () {
        $('[data-pay-opts]', body).innerHTML = paymentOptions(s, +seatsSel.value);
        updateTotal();
      });
      form.addEventListener('change', updateTotal);
      updateTotal();
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var choice = (form.querySelector('input[name="pay"]:checked') || {}).value;
        if (!choice) { toast('Choose how you’d like to pay.'); return; }
        createBooking(s, +seatsSel.value, choice, $('#bk-note', body).value.trim());
        closeModal();
      });
    });
  }

  function createBooking(s, seats, choice, note) {
    var b = {
      id: uid('b'), classId: s.id, title: s.title, cuisine: s.cuisine, type: s.type, chef: s.chef,
      date: s.date, time: s.time, length: s.length, price: s.price, img: s.img,
      seats: seats, status: 'upcoming', note: note, method: 'card', recipesUnlocked: false
    };
    var pay = { id: nextPayId(), date: isoFromDate(today()), desc: s.title + ' · ' + seats + (seats > 1 ? ' seats' : ' seat'), amount: s.price * seats, credits: 0, status: 'Paid', bookingId: b.id };
    if (choice === 'pass') {
      b.method = 'pass';
      state.credits -= seats;
      pay.method = 'Pass credit'; pay.amount = 0; pay.credits = seats;
    } else if (choice === 'later') {
      b.method = 'later';
      pay.method = 'Not paid yet'; pay.status = 'Pending';
    } else {
      var card = state.cards.filter(function (c) { return 'card:' + c.id === choice; })[0];
      b.method = 'card';
      pay.method = card ? cardLabel(card) : 'Card';
    }
    state.bookings.push(b);
    state.payments.push(pay);
    s.seatsLeft -= seats;
    addNotif('Seat confirmed: ' + s.title + ', ' + fmtDate(s.date) + '.', 'sessions');
    save();
    renderAll();
    toast('Booked! ' + s.title + ' is in your sessions.');
  }

  /* ------------------------------------------------------------------
     8. My Sessions
     ------------------------------------------------------------------ */
  var sesFilter = { status: 'upcoming', q: '' };

  function statusChip(status) {
    var label = status.charAt(0).toUpperCase() + status.slice(1);
    return '<span class="status status--' + status + '">' + label + '</span>';
  }

  function renderSessions() {
    var rows = state.bookings.filter(function (b) {
      if (sesFilter.status !== 'all' && b.status !== sesFilter.status) return false;
      if (sesFilter.q && (b.title + ' ' + b.chef + ' ' + b.cuisine).toLowerCase().indexOf(sesFilter.q) === -1) return false;
      return true;
    }).sort(function (a, b) {
      return a.status === 'upcoming' && b.status === 'upcoming' ? sortKey(a) - sortKey(b) : sortKey(b) - sortKey(a);
    });
    $('[data-ses-empty]').hidden = rows.length !== 0;
    $('[data-ses-body]').innerHTML = rows.map(function (b) {
      var actions = '';
      if (b.status === 'upcoming') actions = '<button class="act-btn" type="button" data-edit-booking="' + b.id + '">Edit</button><button class="act-btn act-btn--danger" type="button" data-cancel-booking="' + b.id + '">Cancel</button>';
      if (b.status === 'attended') actions = '<button class="act-btn" type="button" data-booking-recipes="' + b.id + '">Recipes</button><button class="act-btn" type="button" data-rebook="' + esc(b.title) + '">Book again</button>';
      if (b.status === 'cancelled') actions = '<button class="act-btn act-btn--danger" type="button" data-delete-booking="' + b.id + '">Delete</button>';
      return '<tr>' +
        '<td class="cell-title"><strong>' + esc(b.title) + '</strong><span>' + esc(b.cuisine) + ' · ' + (b.type === 'workshop' ? 'Weekend workshop' : 'Class') + (b.note ? ' · Note: ' + esc(b.note) : '') + '</span></td>' +
        '<td data-label="Date" class="nowrap">' + esc(fmtDate(b.date)) + '<br><span class="muted small">' + esc(b.type === 'workshop' ? 'Sat & Sun, 10 AM–4 PM' : b.time) + '</span></td>' +
        '<td data-label="Chef">' + esc(b.chef) + '</td>' +
        '<td data-label="Seats">' + b.seats + '</td>' +
        '<td data-label="Status">' + statusChip(b.status) + '</td>' +
        '<td data-label=""><div class="row-actions">' + actions + '</div></td>' +
      '</tr>';
    }).join('');
    $$('[data-ses-filter] .seg-btn').forEach(function (btn) { btn.setAttribute('aria-pressed', btn.getAttribute('data-value') === sesFilter.status ? 'true' : 'false'); });
  }

  $('[data-ses-search]').addEventListener('input', function (e) { sesFilter.q = e.target.value.trim().toLowerCase(); renderSessions(); });
  $$('[data-ses-filter] .seg-btn').forEach(function (btn) {
    btn.addEventListener('click', function () { sesFilter.status = btn.getAttribute('data-value'); renderSessions(); });
  });

  function findBooking(id) { return state.bookings.filter(function (b) { return b.id === id; })[0]; }

  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-edit-booking]'))) openEditBooking(findBooking(t.getAttribute('data-edit-booking')));
    if ((t = e.target.closest('[data-cancel-booking]'))) cancelBooking(findBooking(t.getAttribute('data-cancel-booking')));
    if ((t = e.target.closest('[data-delete-booking]'))) deleteBooking(findBooking(t.getAttribute('data-delete-booking')));
    if ((t = e.target.closest('[data-booking-recipes]'))) {
      var bk = findBooking(t.getAttribute('data-booking-recipes'));
      recFilter.q = bk.title.toLowerCase();
      $('[data-rec-search]').value = bk.title;
      renderRecipes();
      showView('recipes');
    }
    if ((t = e.target.closest('[data-rebook]'))) {
      bookFilters.q = t.getAttribute('data-rebook').toLowerCase();
      $('[data-book-search]').value = t.getAttribute('data-rebook');
      renderBook();
      showView('book');
    }
  });

  function openEditBooking(b) {
    if (!b) return;
    var s = findSession(b.classId);
    var max = Math.min(4, b.seats + (s ? s.seatsLeft : 0));
    var opts = '';
    for (var i = 1; i <= max; i++) opts += '<option value="' + i + '"' + (i === b.seats ? ' selected' : '') + '>' + i + (i > 1 ? ' seats' : ' seat') + '</option>';
    var html =
      '<div class="modal-summary"><img src="' + IMG + esc(b.img) + '" alt=""><div><strong>' + esc(b.title) + '</strong><span>' + esc(fmtDate(b.date, true)) + ' · ' + esc(b.time) + '</span></div></div>' +
      '<form data-edit-form novalidate>' +
        '<div class="field"><label for="ed-seats">Seats</label><select class="select" id="ed-seats">' + opts + '</select><span class="pw-hint">Extra seats are charged at ' + money(b.price) + ' each (or a pass credit if you paid with one). Removed seats are refunded as credit.</span></div>' +
        '<div class="field"><label for="ed-note">Dietary needs or notes</label><textarea class="textarea" id="ed-note" style="min-height:90px">' + esc(b.note) + '</textarea></div>' +
        '<div class="modal-actions"><button class="btn btn--ghost" type="button" data-cancel>Cancel</button><button class="btn" type="submit">Save changes</button></div>' +
      '</form>';
    openModal('Edit booking', html, function (body) {
      $('[data-edit-form]', body).addEventListener('submit', function (e) {
        e.preventDefault();
        var newSeats = +$('#ed-seats', body).value;
        var delta = newSeats - b.seats;
        if (delta !== 0) adjustSeats(b, s, delta);
        b.seats = newSeats;
        b.note = $('#ed-note', body).value.trim();
        save();
        renderAll();
        closeModal();
        toast('Booking updated.');
      });
    });
  }

  function adjustSeats(b, s, delta) {
    var n = Math.abs(delta);
    var pay = { id: nextPayId(), date: isoFromDate(today()), bookingId: b.id, credits: 0 };
    if (delta > 0) {
      pay.desc = b.title + ' · ' + n + ' extra seat' + (n > 1 ? 's' : '');
      if (b.method === 'pass' && state.credits >= n) {
        state.credits -= n; pay.method = 'Pass credit'; pay.amount = 0; pay.credits = n; pay.status = 'Paid';
      } else {
        pay.method = 'Not paid yet'; pay.amount = b.price * n; pay.status = 'Pending';
      }
    } else {
      pay.desc = b.title + ' · ' + n + ' seat' + (n > 1 ? 's' : '') + ' removed';
      if (b.method === 'pass') { state.credits += n; pay.method = 'Pass credit'; pay.amount = 0; pay.credits = n; }
      else { pay.method = 'Class credit'; pay.amount = b.price * n; }
      pay.status = 'Refunded';
    }
    state.payments.push(pay);
    if (s) s.seatsLeft -= delta;
  }

  function cancelBooking(b) {
    if (!b) return;
    var refund = b.method === 'pass' ? b.seats + ' pass credit' + (b.seats > 1 ? 's' : '') + ' back' : b.method === 'later' ? 'nothing to refund (not paid yet)' : money(b.price * b.seats) + ' as class credit';
    confirmModal('Cancel this booking?', 'Cancel <strong>' + esc(b.title) + '</strong> on ' + esc(fmtDate(b.date)) + '? Your ' + b.seats + (b.seats > 1 ? ' seats go' : ' seat goes') + ' back to the class and you get ' + esc(refund) + '.', 'Cancel booking', function () {
      b.status = 'cancelled';
      var s = findSession(b.classId);
      if (s) s.seatsLeft += b.seats;
      if (b.method === 'pass') state.credits += b.seats;
      state.payments = state.payments.filter(function (p) { return !(p.bookingId === b.id && p.status === 'Pending'); });
      state.payments.forEach(function (p) { if (p.bookingId === b.id && p.status === 'Paid') p.status = 'Refunded'; });
      addNotif('Booking cancelled: ' + b.title + '. Refund: ' + refund + '.', 'payments');
      save();
      renderAll();
      toast('Booking cancelled.');
    });
  }

  function deleteBooking(b) {
    if (!b) return;
    confirmModal('Delete this record?', 'Remove the cancelled <strong>' + esc(b.title) + '</strong> booking from your list? Its payment history stays in Payments.', 'Delete', function () {
      state.bookings = state.bookings.filter(function (x) { return x.id !== b.id; });
      save();
      renderAll();
      toast('Record deleted.');
    });
  }

  /* ------------------------------------------------------------------
     9. Recipes
     ------------------------------------------------------------------ */
  var recFilter = { q: '', cuisine: 'all', fav: false };
  var RECIPE_CUISINES = ['Italian', 'Japanese', 'Indian', 'Thai', 'Mexican', 'French', 'Spanish', 'Fundamentals', 'Baking', 'Other'];

  function renderRecipes() {
    var cuisines = [];
    state.recipes.forEach(function (r) { if (cuisines.indexOf(r.cuisine) === -1) cuisines.push(r.cuisine); });
    fillSelect($('[data-rec-cuisine]'), cuisines.sort());
    if (recFilter.cuisine !== 'all' && cuisines.indexOf(recFilter.cuisine) === -1) recFilter.cuisine = 'all';

    var list = state.recipes.filter(function (r) {
      if (recFilter.fav && !r.fav) return false;
      if (recFilter.cuisine !== 'all' && r.cuisine !== recFilter.cuisine) return false;
      if (recFilter.q) {
        var hay = (r.title + ' ' + r.fromClass + ' ' + r.ingredients.join(' ')).toLowerCase();
        if (hay.indexOf(recFilter.q) === -1) return false;
      }
      return true;
    }).sort(function (a, b) { return a.unlocked < b.unlocked ? 1 : -1; });

    $('[data-rec-empty]').hidden = list.length !== 0;
    $('[data-rec-fav]').setAttribute('aria-pressed', recFilter.fav ? 'true' : 'false');
    $('[data-rec-grid]').innerHTML = list.map(function (r) {
      var media = r.img ? '<img src="' + IMG + esc(r.img) + '" alt="' + esc(r.title) + '" width="800" height="560" loading="lazy">' : '<div class="recipe-thumb" aria-hidden="true">' + esc(initials(r.title)) + '</div>';
      var own = r.own ? '<button class="act-btn" type="button" data-edit-recipe="' + r.id + '">Edit</button><button class="act-btn act-btn--danger" type="button" data-delete-recipe="' + r.id + '">Delete</button>' : '';
      return '<article class="recipe-card">' + media +
        '<button class="fav-btn" type="button" data-fav="' + r.id + '" aria-pressed="' + (r.fav ? 'true' : 'false') + '" aria-label="' + (r.fav ? 'Remove from favourites' : 'Add to favourites') + ': ' + esc(r.title) + '">' + (r.fav ? '★' : '☆') + '</button>' +
        '<div class="recipe-body">' +
          '<div class="chip-row"><span class="chip">' + esc(r.cuisine) + '</span>' + (r.own ? '<span class="chip chip--sage">My recipe</span>' : '') + '</div>' +
          '<h3>' + esc(r.title) + '</h3>' +
          '<span class="muted">' + (r.own ? 'Added ' + esc(fmtShort(r.unlocked)) : 'From ' + esc(r.fromClass) + ' · ' + esc(fmtShort(r.unlocked))) + '</span>' +
          '<span class="muted">' + esc(r.time || '—') + ' · Serves ' + esc(r.serves || '—') + '</span>' +
          '<div class="recipe-actions"><button class="act-btn act-btn--primary" type="button" data-open-recipe="' + r.id + '">Open recipe</button>' + own + '</div>' +
        '</div></article>';
    }).join('');
  }

  $('[data-rec-search]').addEventListener('input', function (e) { recFilter.q = e.target.value.trim().toLowerCase(); renderRecipes(); });
  $('[data-rec-cuisine]').addEventListener('change', function (e) { recFilter.cuisine = e.target.value; renderRecipes(); });
  $('[data-rec-fav]').addEventListener('click', function () { recFilter.fav = !recFilter.fav; renderRecipes(); });

  function findRecipe(id) { return state.recipes.filter(function (r) { return r.id === id; })[0]; }

  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-fav]'))) {
      var r = findRecipe(t.getAttribute('data-fav'));
      r.fav = !r.fav;
      save(); renderRecipes();
      toast(r.fav ? 'Added to favourites.' : 'Removed from favourites.');
    }
    if ((t = e.target.closest('[data-open-recipe]'))) openRecipe(findRecipe(t.getAttribute('data-open-recipe')));
    if ((t = e.target.closest('[data-edit-recipe]'))) openRecipeForm(findRecipe(t.getAttribute('data-edit-recipe')));
    if ((t = e.target.closest('[data-delete-recipe]'))) {
      var rec = findRecipe(t.getAttribute('data-delete-recipe'));
      confirmModal('Delete recipe?', 'Delete <strong>' + esc(rec.title) + '</strong> from your library? This can’t be undone.', 'Delete recipe', function () {
        state.recipes = state.recipes.filter(function (x) { return x.id !== rec.id; });
        save(); renderAll(); toast('Recipe deleted.');
      });
    }
  });
  $('[data-action="add-recipe"]').addEventListener('click', function () { openRecipeForm(null); });

  function openRecipe(r) {
    if (!r) return;
    var html = '<div class="recipe-detail">' +
      '<div class="recipe-meta"><span class="chip">' + esc(r.cuisine) + '</span><span class="chip chip--outline">' + esc(r.time || '—') + '</span><span class="chip chip--outline">Serves ' + esc(r.serves || '—') + '</span></div>' +
      '<p class="muted small" style="margin-top:12px">' + (r.own ? 'Your own recipe' : 'From ' + esc(r.fromClass)) + '</p>' +
      '<h3>Ingredients</h3><ul>' + r.ingredients.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul>' +
      '<h3>Method</h3><ol>' + r.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
      (r.chefNote ? '<p class="chef-note">' + esc(r.chefNote) + '</p>' : '') +
      '<div class="field" style="margin-top:20px"><label for="rc-notes">My notes</label><textarea class="textarea" id="rc-notes" style="min-height:90px" placeholder="E.g. used less chilli, doubled the garlic">' + esc(r.notes) + '</textarea></div>' +
      '<div class="modal-actions"><button class="btn btn--ghost" type="button" data-cancel>Close</button><button class="btn" type="button" data-save-note>Save note</button></div>' +
    '</div>';
    openModal(r.title, html, function (body) {
      $('[data-save-note]', body).addEventListener('click', function () {
        r.notes = $('#rc-notes', body).value.trim();
        save(); closeModal(); toast('Note saved.');
      });
    });
  }

  function openRecipeForm(r) {
    var editing = !!r;
    var opts = RECIPE_CUISINES.map(function (c) { return '<option' + (r && r.cuisine === c ? ' selected' : '') + '>' + c + '</option>'; }).join('');
    var html = '<form data-recipe-form novalidate>' +
      '<div class="field"><label for="rf-title">Recipe name</label><input class="input" id="rf-title" required data-validate data-label="Recipe name" minlength="3" value="' + esc(r ? r.title : '') + '"><span class="field-error" aria-live="polite"></span></div>' +
      '<div class="form-row">' +
        '<div class="field"><label for="rf-cuisine">Cuisine</label><select class="select" id="rf-cuisine">' + opts + '</select></div>' +
        '<div class="field"><label for="rf-time">Time</label><input class="input" id="rf-time" placeholder="e.g. 30 min" value="' + esc(r ? r.time : '') + '"></div>' +
      '</div>' +
      '<div class="field"><label for="rf-serves">Serves</label><input class="input" id="rf-serves" placeholder="e.g. 4" value="' + esc(r ? r.serves : '') + '"></div>' +
      '<div class="field"><label for="rf-ing">Ingredients <span class="optional">(one per line)</span></label><textarea class="textarea" id="rf-ing" required data-validate data-label="Ingredients">' + esc(r ? r.ingredients.join('\n') : '') + '</textarea><span class="field-error" aria-live="polite"></span></div>' +
      '<div class="field"><label for="rf-steps">Method <span class="optional">(one step per line)</span></label><textarea class="textarea" id="rf-steps" required data-validate data-label="Method">' + esc(r ? r.steps.join('\n') : '') + '</textarea><span class="field-error" aria-live="polite"></span></div>' +
      '<div class="modal-actions"><button class="btn btn--ghost" type="button" data-cancel>Cancel</button><button class="btn" type="submit">' + (editing ? 'Save recipe' : 'Add recipe') + '</button></div>' +
    '</form>';
    openModal(editing ? 'Edit recipe' : 'Add my recipe', html, function (body) {
      var form = $('[data-recipe-form]', body);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!CP.validateForm(form)) return;
        var lines = function (id) { return $(id, body).value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean); };
        var data = {
          title: $('#rf-title', body).value.trim(),
          cuisine: $('#rf-cuisine', body).value,
          time: $('#rf-time', body).value.trim(),
          serves: $('#rf-serves', body).value.trim(),
          ingredients: lines('#rf-ing'),
          steps: lines('#rf-steps')
        };
        if (editing) {
          Object.keys(data).forEach(function (k) { r[k] = data[k]; });
        } else {
          data.id = uid('r'); data.own = true; data.fav = false; data.notes = ''; data.img = null; data.classId = null; data.fromClass = 'My recipe'; data.chefNote = ''; data.unlocked = isoFromDate(today());
          state.recipes.push(data);
        }
        save(); renderAll(); closeModal();
        toast(editing ? 'Recipe updated.' : 'Recipe added to your library.');
      });
    });
  }

  /* ------------------------------------------------------------------
     10. Payments
     ------------------------------------------------------------------ */
  var payFilter = { q: '', status: 'all' };

  function renderPayments() {
    var paid = state.payments.filter(function (p) { return p.status === 'Paid' && within12Months(p.date); }).reduce(function (s, p) { return s + p.amount; }, 0);
    var pendingList = state.payments.filter(function (p) { return p.status === 'Pending'; });
    var pending = pendingList.reduce(function (s, p) { return s + p.amount; }, 0);
    var refunded = state.payments.filter(function (p) { return p.status === 'Refunded'; }).reduce(function (s, p) { return s + p.amount; }, 0);
    $('[data-pay="paid"]').textContent = money(paid);
    $('[data-pay="pending"]').textContent = money(pending);
    $('[data-pay="refunded"]').textContent = money(refunded);
    $('[data-pay="credits"]').textContent = state.credits;

    var alertBox = $('[data-pay-alert]');
    if (pendingList.length) {
      alertBox.hidden = false;
      alertBox.innerHTML = '<p><strong>' + money(pending) + ' due.</strong> ' + esc(pendingList[0].desc) + (pendingList.length > 1 ? ' and ' + (pendingList.length - 1) + ' more still need paying.' : ' still needs paying.') + '</p><button class="btn btn--sm" type="button" data-pay-now="' + pendingList[0].id + '">Pay now</button>';
    } else {
      alertBox.hidden = true;
    }

    var rows = state.payments.filter(function (p) {
      if (payFilter.status !== 'all' && p.status !== payFilter.status) return false;
      if (payFilter.q && (p.desc + ' ' + p.method + ' ' + p.id).toLowerCase().indexOf(payFilter.q) === -1) return false;
      return true;
    }).sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : (a.id < b.id ? 1 : -1); });
    $('[data-pay-empty]').hidden = rows.length !== 0;
    $('[data-pay-body]').innerHTML = rows.map(function (p) {
      var amount = p.credits ? p.credits + (p.credits > 1 ? ' credits' : ' credit') : money(p.amount);
      var actions = p.status === 'Pending'
        ? '<button class="act-btn act-btn--primary" type="button" data-pay-now="' + p.id + '">Pay</button>'
        : '<button class="act-btn" type="button" data-receipt="' + p.id + '">Receipt</button>';
      return '<tr>' +
        '<td data-label="Date" class="nowrap">' + esc(fmtShort(p.date)) + '</td>' +
        '<td class="cell-title"><strong>' + esc(p.desc) + '</strong><span>' + esc(p.id) + '</span></td>' +
        '<td data-label="Method">' + esc(p.method) + '</td>' +
        '<td data-label="Amount">' + amount + '</td>' +
        '<td data-label="Status">' + statusChip(p.status.toLowerCase()) + '</td>' +
        '<td data-label=""><div class="row-actions">' + actions + '</div></td>' +
      '</tr>';
    }).join('');

    $('[data-card-list]').innerHTML = state.cards.length ? state.cards.map(function (c) {
      return '<li class="pay-card"><span class="card-chip" aria-hidden="true">' + esc(c.brand.slice(0, 4).toUpperCase()) + '</span>' +
        '<div class="pc-text"><strong>' + esc(cardLabel(c)) + '</strong><span>' + esc(c.name) + ' · Expires ' + esc(c.exp) + '</span></div>' +
        (c.isDefault ? '<span class="chip chip--sage">Default</span>' : '') +
        '<div class="row-actions">' + (c.isDefault ? '' : '<button class="act-btn" type="button" data-default-card="' + c.id + '">Make default</button>') +
        '<button class="act-btn act-btn--danger" type="button" data-remove-card="' + c.id + '">Remove</button></div></li>';
    }).join('') : '<li class="mini-empty">No saved cards. Add one to pay faster.</li>';
  }

  $('[data-pay-search]').addEventListener('input', function (e) { payFilter.q = e.target.value.trim().toLowerCase(); renderPayments(); });
  $('[data-pay-status]').addEventListener('change', function (e) { payFilter.status = e.target.value; renderPayments(); });

  function findPayment(id) { return state.payments.filter(function (p) { return p.id === id; })[0]; }

  function cardRadios() {
    return state.cards.map(function (c) {
      return '<label class="radio-opt"><input type="radio" name="card" value="' + esc(c.id) + '"' + (c.isDefault ? ' checked' : '') + '><span>' + esc(cardLabel(c)) + '<small>Expires ' + esc(c.exp) + '</small></span></label>';
    }).join('');
  }

  function payWithCard(title, summary, amount, onPaid) {
    if (!state.cards.length) {
      toast('Add a card first, then try again.');
      openCardForm();
      return;
    }
    var html = '<p>' + summary + '</p><div class="field"><span class="label">Pay with</span><div class="radio-list">' + cardRadios() + '</div></div>' +
      '<div class="total-line"><span>Total</span><strong>' + money(amount) + '</strong></div>' +
      '<div class="modal-actions"><button class="btn btn--ghost" type="button" data-cancel>Cancel</button><button class="btn" type="button" data-do-pay>Pay ' + money(amount) + '</button></div>';
    openModal(title, html, function (body) {
      if (!body.querySelector('input[name="card"]:checked')) body.querySelector('input[name="card"]').checked = true;
      $('[data-do-pay]', body).addEventListener('click', function () {
        var id = body.querySelector('input[name="card"]:checked').value;
        var card = state.cards.filter(function (c) { return c.id === id; })[0];
        onPaid(card);
        closeModal();
      });
    });
  }

  document.addEventListener('click', function (e) {
    var t;
    if ((t = e.target.closest('[data-pay-now]'))) {
      var p = findPayment(t.getAttribute('data-pay-now'));
      payWithCard('Pay balance', 'Pay for <strong>' + esc(p.desc) + '</strong>.', p.amount, function (card) {
        p.status = 'Paid';
        p.method = cardLabel(card);
        p.date = isoFromDate(today());
        var b = findBooking(p.bookingId);
        if (b && b.method === 'later') b.method = 'card';
        addNotif('Payment received: ' + money(p.amount) + ' for ' + p.desc + '.', 'payments');
        save(); renderAll(); toast('Payment complete. Thank you!');
      });
    }
    if ((t = e.target.closest('[data-receipt]'))) openReceipt(findPayment(t.getAttribute('data-receipt')));
    if ((t = e.target.closest('[data-default-card]'))) {
      var id = t.getAttribute('data-default-card');
      state.cards.forEach(function (c) { c.isDefault = c.id === id; });
      save(); renderPayments(); toast('Default card updated.');
    }
    if ((t = e.target.closest('[data-remove-card]'))) {
      var card = state.cards.filter(function (c) { return c.id === t.getAttribute('data-remove-card'); })[0];
      confirmModal('Remove card?', 'Remove <strong>' + esc(cardLabel(card)) + '</strong> from your account?', 'Remove card', function () {
        state.cards = state.cards.filter(function (c) { return c.id !== card.id; });
        if (card.isDefault && state.cards[0]) state.cards[0].isDefault = true;
        save(); renderPayments(); toast('Card removed.');
      });
    }
  });

  $('[data-action="add-card"]').addEventListener('click', function () { openCardForm(); });
  $$('[data-action="buy-pass"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      payWithCard('Buy a 5-Class Pass', 'Five seats for any class priced up to $125, valid for 12 months from today.', 425, function (card) {
        state.credits += 5;
        state.payments.push({ id: nextPayId(), date: isoFromDate(today()), desc: '5-Class Pass', method: cardLabel(card), amount: 425, credits: 0, status: 'Paid' });
        addNotif('5-Class Pass added: you now have ' + state.credits + ' credits.', 'book');
        save(); renderAll(); toast('Pass added: 5 new credits.');
      });
    });
  });

  function openCardForm() {
    var html = '<form data-card-form novalidate>' +
      '<p class="muted small">For this demo we only save the card brand, last four digits and expiry date.</p>' +
      '<div class="field"><label for="cf-name">Name on card</label><input class="input" id="cf-name" autocomplete="cc-name" required data-validate data-label="Name on card" minlength="2" value="' + esc(state.profile.name) + '"><span class="field-error" aria-live="polite"></span></div>' +
      '<div class="form-row">' +
        '<div class="field"><label for="cf-brand">Card type</label><select class="select" id="cf-brand"><option>Visa</option><option>Mastercard</option><option>Amex</option></select></div>' +
        '<div class="field"><label for="cf-last4">Last 4 digits</label><input class="input" id="cf-last4" inputmode="numeric" maxlength="4" required data-validate data-label="Last 4 digits" placeholder="1234"><span class="field-error" aria-live="polite"></span></div>' +
      '</div>' +
      '<div class="field"><label for="cf-exp">Expiry (MM/YY)</label><input class="input" id="cf-exp" inputmode="numeric" maxlength="5" required data-validate data-label="Expiry date" placeholder="09/29"><span class="field-error" aria-live="polite"></span></div>' +
      '<label class="check"><input type="checkbox" id="cf-default"' + (state.cards.length ? '' : ' checked') + '> Make this my default card</label>' +
      '<div class="modal-actions"><button class="btn btn--ghost" type="button" data-cancel>Cancel</button><button class="btn" type="submit">Save card</button></div>' +
    '</form>';
    openModal('Add a card', html, function (body) {
      var form = $('[data-card-form]', body);
      var exp = $('#cf-exp', body);
      exp.addEventListener('input', function () {
        var v = exp.value.replace(/[^\d]/g, '').slice(0, 4);
        exp.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!CP.validateForm(form)) return;
        var last4 = $('#cf-last4', body);
        if (!/^\d{4}$/.test(last4.value.trim())) { CP.setError(last4, 'Enter exactly 4 digits.'); last4.focus(); return; }
        var m = /^(\d{2})\/(\d{2})$/.exec(exp.value.trim());
        var valid = m && +m[1] >= 1 && +m[1] <= 12;
        if (valid) {
          var end = new Date(2000 + +m[2], +m[1], 0);
          valid = end >= today();
        }
        if (!valid) { CP.setError(exp, 'Enter a future date as MM/YY.'); exp.focus(); return; }
        var makeDefault = $('#cf-default', body).checked || !state.cards.length;
        if (makeDefault) state.cards.forEach(function (c) { c.isDefault = false; });
        state.cards.push({ id: uid('c'), brand: $('#cf-brand', body).value, last4: last4.value.trim(), exp: exp.value.trim(), name: $('#cf-name', body).value.trim(), isDefault: makeDefault });
        save(); renderPayments(); closeModal(); toast('Card saved.');
      });
    });
  }

  function openReceipt(p) {
    if (!p) return;
    var html = '<div class="receipt">' +
      '<div class="receipt-head"><div class="brand"><img class="brand-mark" src="../assets/images/logo-mark.png" alt="" width="36" height="36"><span class="brand-text"><span class="brand-name">Copper Pot</span><span class="brand-sub">Cooking Studio</span></span></div><span class="muted small">' + esc(p.id) + '</span></div>' +
      '<dl>' +
        '<dt>Billed to</dt><dd>' + esc(state.profile.name) + '</dd>' +
        '<dt>Date</dt><dd>' + esc(fmtShort(p.date)) + '</dd>' +
        '<dt>Item</dt><dd>' + esc(p.desc) + '</dd>' +
        '<dt>Paid with</dt><dd>' + esc(p.method) + '</dd>' +
        '<dt>Status</dt><dd>' + esc(p.status) + '</dd>' +
      '</dl>' +
      '<div class="receipt-total"><span>Total</span><span>' + (p.credits ? p.credits + (p.credits > 1 ? ' credits' : ' credit') : money(p.amount)) + '</span></div>' +
      '<p class="muted small" style="margin-top:16px">Copper Pot Cooking Studio · 1127 NW Glisan Street, Portland, OR 97209 · (503) 555-0148</p>' +
      '<div class="modal-actions"><button class="btn btn--ghost" type="button" data-cancel>Close</button><button class="btn" type="button" data-print>Print receipt</button></div>' +
    '</div>';
    openModal('Receipt', html, function (body) {
      $('[data-print]', body).addEventListener('click', function () { window.print(); });
    });
  }

  /* ------------------------------------------------------------------
     11. Notifications
     ------------------------------------------------------------------ */
  function renderNotifs() {
    var unread = state.notifications.filter(function (n) { return !n.read; }).length;
    var badge = $('[data-notif-count]');
    badge.textContent = unread;
    badge.hidden = unread === 0;
    $('[data-pop="notif"]').setAttribute('aria-label', 'Notifications, ' + unread + ' unread');
    $('[data-notif-list]').innerHTML = state.notifications.length ? state.notifications.slice(0, 12).map(function (n) {
      return '<li><button class="notif-item' + (n.read ? '' : ' is-unread') + '" type="button" data-notif="' + n.id + '"><span class="notif-dot" aria-hidden="true"></span><span>' + esc(n.text) + '<time>' + esc(fmtShort(n.date)) + (n.read ? '' : ' · New') + '</time></span></button></li>';
    }).join('') : '<li class="notif-empty">You’re all caught up.</li>';
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-notif]');
    if (!t) return;
    var n = state.notifications.filter(function (x) { return x.id === t.getAttribute('data-notif'); })[0];
    n.read = true;
    save(); renderNotifs();
    if (n.view) showView(n.view);
  });
  $('[data-action="read-all"]').addEventListener('click', function () {
    state.notifications.forEach(function (n) { n.read = true; });
    save(); renderNotifs(); toast('All notifications marked as read.');
  });
  $('[data-action="clear-notifs"]').addEventListener('click', function () {
    state.notifications = [];
    save(); renderNotifs(); toast('Notifications cleared.');
  });

  /* ------------------------------------------------------------------
     12. Profile & settings
     ------------------------------------------------------------------ */
  function renderProfile() {
    var p = state.profile;
    $$('[data-profile-name]').forEach(function (el) { el.textContent = p.name; });
    $$('[data-profile-email]').forEach(function (el) { el.textContent = p.email; });
    $('[data-avatar]').textContent = initials(p.name);
    $('#pf-name').value = p.name;
    $('#pf-email').value = p.email;
    $('#pf-phone').value = p.phone || '';
    $('#pf-level').value = p.level;
    $$('[data-diet] input').forEach(function (cb) { cb.checked = p.diet.indexOf(cb.value) !== -1; });
    $$('[data-setting]').forEach(function (cb) { cb.checked = !!state.settings[cb.getAttribute('data-setting')]; });
    syncPrefButtons();
  }

  function syncPrefButtons() {
    var theme = document.documentElement.getAttribute('data-theme') || 'light';
    var dir = document.documentElement.getAttribute('dir') || 'ltr';
    $$('[data-pref="theme"] .seg-btn').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-value') === theme ? 'true' : 'false'); });
    $$('[data-pref="dir"] .seg-btn').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-value') === dir ? 'true' : 'false'); });
  }
  $$('[data-pref="theme"] .seg-btn').forEach(function (b) { b.addEventListener('click', function () { CP.setTheme(b.getAttribute('data-value')); }); });
  $$('[data-pref="dir"] .seg-btn').forEach(function (b) { b.addEventListener('click', function () { CP.setDir(b.getAttribute('data-value')); }); });

  $('[data-profile-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!CP.validateForm(e.target)) return;
    var p = state.profile;
    p.name = $('#pf-name').value.trim();
    p.email = $('#pf-email').value.trim();
    p.phone = $('#pf-phone').value.trim();
    p.level = $('#pf-level').value;
    p.diet = $$('[data-diet] input').filter(function (cb) { return cb.checked; }).map(function (cb) { return cb.value; });
    try {
      var s = JSON.parse(CP.getItem('cp-session') || 'null');
      if (s) { s.name = p.name; s.email = p.email; CP.setItem('cp-session', JSON.stringify(s)); }
    } catch (err) { /* ignore */ }
    save(); renderAll(); toast('Profile saved.');
  });

  $$('[data-setting]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      state.settings[cb.getAttribute('data-setting')] = cb.checked;
      save(); toast('Notification settings saved.');
    });
  });

  $('[data-password-form]').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target;
    if (!CP.validateForm(form)) return;
    var users;
    try { users = JSON.parse(CP.getItem('cp-users') || '[]'); } catch (err) { users = []; }
    var user = users.filter(function (u) { return u.email === state.profile.email.toLowerCase(); })[0];
    var current = $('#pw-current');
    if (user && user.password !== current.value) { CP.setError(current, 'That doesn’t match your current password.'); current.focus(); return; }
    if (user) { user.password = $('#pw-new').value; CP.setItem('cp-users', JSON.stringify(users)); }
    form.reset();
    toast('Password updated.');
  });

  $('[data-action="reset-data"]').addEventListener('click', function () {
    confirmModal('Reset sample data?', 'This restores the original bookings, recipes, payments and notifications.', 'Reset data', function () {
      var profile = state.profile;
      state = seed();
      state.profile.name = profile.name;
      state.profile.email = profile.email;
      save(); renderAll(); showView('overview');
      toast('Sample data restored.');
    });
  });

  /* Log out → back to Sign In */
  $$('[data-action="logout"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      try { localStorage.removeItem('cp-session'); } catch (err) { /* ignore */ }
      toast('Signed out. See you at the stove!');
      setTimeout(function () { window.location.href = 'signin.html'; }, 600);
    });
  });

  /* ------------------------------------------------------------------
     13. Init
     ------------------------------------------------------------------ */
  function renderCounts() {
    $('[data-count="sessions"]').textContent = upcomingBookings().length;
    $('[data-count="recipes"]').textContent = state.recipes.length;
    $$('[data-credits-label]').forEach(function (el) { el.textContent = state.credits + (state.credits === 1 ? ' credit left' : ' credits left'); });
    $('[data-credit-bar]').style.width = Math.min(100, state.credits / 5 * 100) + '%';
  }

  function renderAll() {
    renderCounts();
    renderProfile();
    renderOverview();
    renderBook();
    renderSessions();
    renderRecipes();
    renderPayments();
    renderNotifs();
  }

  renderAll();
  /* Back/forward buttons and edited hashes switch views too */
  window.addEventListener('hashchange', function () {
    var v = (window.location.hash || '').replace('#', '');
    if (VIEWS[v] && v !== currentView) showView(v, { silent: true });
  });
  var start = (window.location.hash || '').replace('#', '');
  showView(VIEWS[start] ? start : 'overview', { silent: true });

  /* Arriving from a "Book seat" button on the public site (?class=id) */
  var wanted = new URLSearchParams(window.location.search).get('class');
  if (wanted) {
    if (history.replaceState) history.replaceState(null, '', window.location.pathname + '#' + currentView);
    var already = activeBookingFor(wanted);
    var session = findSession(wanted);
    if (already) {
      showView('sessions', { silent: true });
      toast('You’re already booked into ' + already.title + '.');
    } else if (session && !isPastDate(session.date) && session.seatsLeft > 0) {
      showView('book', { silent: true });
      openBookingModal(wanted);
    } else if (session) {
      showView('book', { silent: true });
      toast('That session is full. Here are other dates.');
    }
  }
})();
