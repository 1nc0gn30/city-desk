/**
 * Twenty trades a solo studio can finish, and fifty mid-size US cities.
 * Each page is the finished site. The owner adds their name, phone, and email.
 * These are not competitor counts, and a page is not a fake local shop.
 */

const SERVICES = [
  {
    slug: 'painters',
    name: 'Painters',
    buyer: 'a painting owner',
    price: 800,
    line: 'Interior, exterior, and a written price before the first can opens.',
    headlines: [
      'Interior and exterior painting in {city}',
      'Paint, prep, and a written price in {city}',
      'House painting for {city} homes'
    ],
    ledes: [
      'Walls, ceilings, trim, and the outside of the house. The price is written before any can is opened.',
      'Interior rooms and exterior surfaces are separate jobs. The first conversation starts on the right one.',
      'Prep, paint, and a walkthrough when it is dry. This page is the whole offer.'
    ],
    work: [
      ['Interior', 'Walls, ceilings, trim, and doors. The rooms named in the price are the rooms that get painted.'],
      ['Exterior', 'Siding, trim, doors, and decks this shop paints. Wash, scrape, and caulk happen when the price includes them.'],
      ['Cabinets', 'Cabinet work is booked apart from a whole-house repaint, so the day is not spent on the wrong job.']
    ],
    steps: [
      ['Tell them the rooms', 'How many rooms, any photos you have, and the week you want the work.'],
      ['Read the written price', 'It names the paint line, the sheen, and the prep that is included.'],
      ['Walk it when it is dry', 'You look at the work together. Touch-ups that were in the price get done.']
    ],
    points: [
      'The city is on the first screen.',
      'Interior and exterior are separate lines of work.',
      'Prep is written into the price.',
      'The job ends with a walkthrough.'
    ],
    faqs: [
      ['How do I get a price?', 'Send the rooms and any photos. Work starts only after the price is written.'],
      ['Who buys the paint?', 'The written price says who buys it, which line, and which sheen.'],
      ['What does prep include?', 'Holes, sanding, and masking are listed in the price. Anything extra is written down before it starts.']
    ]
  },
  {
    slug: 'plumbers',
    name: 'Plumbers',
    buyer: 'a plumbing owner',
    price: 900,
    line: 'Leaks, drains, fixtures, and water heaters, with emergency work kept separate.',
    headlines: [
      'Plumbing repair and water heaters in {city}',
      'Emergency and scheduled plumbing in {city}',
      'Drains, fixtures, and leaks in {city}'
    ],
    ledes: [
      'A running leak and a planned water-heater swap are different jobs. This page keeps them apart.',
      'Leaks, drains, fixtures, and water heaters. You can see which path fits before you call.',
      'The visit starts from the symptom you describe. Further work is written down before it is done.'
    ],
    work: [
      ['Emergency', 'Active leaks, no water, and a sewer backup. Say what is happening and whether the water is already off.'],
      ['Water heaters', 'A repair or a replacement. Have the fuel type, gas or electric, and the age if you know it.'],
      ['Drains and fixtures', 'Clogs, faucets, toilets, and disposals. A slow drain is not booked as a water-heater job.']
    ],
    steps: [
      ['Describe what failed', 'Leak, clog, no hot water, or a fixture. Say if water is reaching the floor.'],
      ['Take a visit window', 'The owner gives a window. This page does not promise a minute.'],
      ['Approve the repair', 'Diagnosis comes first. The repair price is written before work past that.']
    ],
    points: [
      'Emergency calls and scheduled calls are different.',
      'Water-heater jobs ask for fuel type.',
      'The city is on the first screen.',
      'Extra work is priced before it starts.'
    ],
    faqs: [
      ['Should I shut the water off?', 'If water is reaching the floor and you know the valve, shut it off, then call.'],
      ['What should I have ready?', 'The symptom, the address in {city}, and whether someone will be home.'],
      ['How is the visit priced?', 'The owner states the visit terms before rolling, and the repair price before work past the diagnosis.']
    ]
  },
  {
    slug: 'hvac',
    name: 'HVAC shops',
    buyer: 'an HVAC owner',
    price: 1100,
    line: 'A tune-up path and a no-cool or no-heat path, written as two different visits.',
    headlines: [
      'Heating and cooling service in {city}',
      'Tune-ups and no-cool calls in {city}',
      'Furnace and air-conditioning visits in {city}'
    ],
    ledes: [
      'A seasonal tune-up and a no-cool call are different visits. Pick the one that matches the house today.',
      'The tech tells you what the visit includes before the van is the plan. Filters are checked on site.',
      'Repair and replacement are not the same sentence. A replacement quote is written after the system is seen.'
    ],
    work: [
      ['Tune-up', 'A scheduled visit to check the system, the filter, and the usual wear before the hard season.'],
      ['No cool or no heat', 'The house is uncomfortable now. Say which, and whether the thermostat has power.'],
      ['Replacement quotes', 'A new system is priced only after the tech has seen the equipment and the space it sits in.']
    ],
    steps: [
      ['Say which problem it is', 'Tune-up, no cool, or no heat. Add the filter size if you know it.'],
      ['Book the visit', 'The owner gives a window. Have someone home who can walk to the equipment.'],
      ['Read the findings', 'What was checked, what failed, and the price of the next step, in writing.']
    ],
    points: [
      'Tune-ups and breakdowns are booked separately.',
      'The filter is confirmed on site.',
      'A new system is quoted only after a look.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Do I need the filter size?', 'It helps. If you do not have it, the tech reads it off the old filter.'],
      ['Is a tune-up a repair?', 'No. A tune-up is the check. A repair is priced on its own before parts are changed.'],
      ['When is replacement discussed?', 'After the equipment has been seen. This page does not price a system from a phone description.']
    ]
  },
  {
    slug: 'roofers',
    name: 'Roofers',
    buyer: 'a roofing owner',
    price: 1000,
    line: 'Inspections, repairs, and full replacements, started from a ground photo.',
    headlines: [
      'Roof inspections and repairs in {city}',
      'Repair or replacement, stated clearly, in {city}',
      'A roof looked at from the ground up in {city}'
    ],
    ledes: [
      'An inspection, a repair, and a full replacement are three different jobs. The page says which one you are asking for.',
      'Start with a photo from the ground. Do not climb. The owner looks at the photo before anyone talks about a new roof.',
      'After weather, the useful page is the one that says how a visit is booked and what a photo needs to show.'
    ],
    work: [
      ['Inspection', 'A look at the roof, the flashing, and the ceilings inside. You get what was seen, in plain words.'],
      ['Repair', 'A leak, a missing shingle, or flashing that failed. The repair is priced before work starts.'],
      ['Replacement', 'A full roof is a separate bid, with the material and the timing written down.']
    ],
    steps: [
      ['Send a ground photo', 'The slope, the trouble spot, and a ceiling stain if there is one. Stay off the roof.'],
      ['Book the inspection', 'The owner sets a visit. Findings come back as repair, replacement, or no work yet.'],
      ['Approve one path', 'You accept a written repair or a written replacement. They are not bundled by surprise.']
    ],
    points: [
      'Photos come from the ground.',
      'Repair and replacement are separate prices.',
      'Storm timing is a visit, not a promise.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Should I get on the roof?', 'No. A photo from the yard is enough to start, if you can take one safely.'],
      ['Does a storm mean a new roof?', 'No. An inspection says whether the roof needs a repair, a replacement, or nothing yet.'],
      ['What is in the price?', 'The written bid names the work, the material, and what is not included.']
    ]
  },
  {
    slug: 'electricians',
    name: 'Electricians',
    buyer: 'an electrical owner',
    price: 1000,
    line: 'Small repairs and panel work sorted into two paths before the truck rolls.',
    headlines: [
      'Electrical repair and panel work in {city}',
      'Outlets, lighting, and panels in {city}',
      'A clear electrical visit in {city}'
    ],
    ledes: [
      'A dead outlet and a panel upgrade are different calls. This page sorts them before the truck is scheduled.',
      'Say what the lights or the outlets are doing. The owner tells you whether the job needs a permit before work starts.',
      'Common jobs are listed here. Anything beyond them is described and priced before it is done.'
    ],
    work: [
      ['Repairs', 'Outlets, switches, lighting, and a circuit that tripped and will not stay on.'],
      ['Panels', 'A panel that is full, hot, or outdated. Panel work is quoted on its own, after a look.'],
      ['Before the visit', 'The owner says whether a permit is required. That is stated before the job is booked, not after the wall is open.']
    ],
    steps: [
      ['Name the symptom', 'Dark room, warm plate, tripped breaker, or a remodel that needs circuits.'],
      ['Hear whether it is a repair or a panel', 'The owner sorts the call. A panel quote waits until someone has seen it.'],
      ['Approve the written work', 'The price names the task. Extra openings in the wall are discussed first.']
    ],
    points: [
      'Repairs and panels are different visits.',
      'Permit needs are said before booking.',
      'The symptom is the start of the call.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Is a flickering light an emergency?', 'A hot smell, a sparking outlet, or a panel that is warm is a stop-and-call. A single flicker can be a scheduled visit.'],
      ['Who handles the permit?', 'The owner tells you if the job needs one, and pulls what the job requires.'],
      ['Can you price a panel by phone?', 'No. A panel price follows a look at the equipment.']
    ]
  },
  {
    slug: 'garage-doors',
    name: 'Garage door shops',
    buyer: 'a garage-door owner',
    price: 700,
    line: 'A stuck door, a spring, or an opener, with the symptom in the first line.',
    headlines: [
      'Garage door repair in {city}',
      'Springs, openers, and stuck doors in {city}',
      'A garage door that will not move in {city}'
    ],
    ledes: [
      'A door that will not open is usually a spring, an opener, or a track. Say which symptom you see.',
      'Leave the springs alone. Tell the shop what the door does, and they will book a visit.',
      'Repair, spring replacement, and opener work are listed separately so the call is short.'
    ],
    work: [
      ['Stuck door', 'It will not open, will not close, or stops halfway. Say what it did just before it failed.'],
      ['Springs', 'A loud bang and a heavy door often mean a spring. Do not wind a torsion spring yourself.'],
      ['Openers', 'The motor runs and the door does not move, or the remote stopped working. Have the opener brand if you can see it.']
    ],
    steps: [
      ['Say the symptom', 'Stuck, loud bang, or an opener that spins. Stay clear of the springs.'],
      ['Ask for the next visit', 'The owner gives an open time. This page does not promise a same-day slot.'],
      ['Approve the part', 'Spring, opener, or track. The price is written before the part goes on.']
    ],
    points: [
      'The symptom is the first line.',
      'Springs are not a homeowner job.',
      'Opener work is separate from a spring.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Can I wind the spring?', 'No. Torsion springs injure people. Wait for the visit.'],
      ['Do you promise a same-day visit?', 'No. Ask for the next open visit and take the window you are given.'],
      ['What should I tell them?', 'What the door does, whether a car is trapped, and the opener brand if it is visible.']
    ]
  },
  {
    slug: 'landscapers',
    name: 'Landscapers',
    buyer: 'a landscape owner',
    price: 800,
    line: 'Weekly maintenance and one-time cleanups as two different bookings.',
    headlines: [
      'Lawn care and cleanups in {city}',
      'Weekly routes and one-time yard work in {city}',
      'Mowing and seasonal cleanup in {city}'
    ],
    ledes: [
      'A weekly cut and a one-time cleanup are different bookings. This page lets a yard pick one.',
      'Maintenance is a route. A cleanup is a single visit with a written list of what goes and what stays.',
      'The owner says what this month includes. The page already separates the weekly work from the one-time work.'
    ],
    work: [
      ['Weekly route', 'Mowing, edging, and blowing on a set day. The visit is the same shape each week unless you change it in writing.'],
      ['Cleanup', 'Leaves, overgrowth, and beds that need a single reset. The list of tasks is agreed before the crew arrives.'],
      ['Planting', 'Plants are a separate visit from mowing, with the varieties and the count written down.']
    ],
    steps: [
      ['Pick the kind of visit', 'Weekly route, one cleanup, or planting.'],
      ['Walk the yard once', 'In person or from photos. The price matches that yard, not a generic lot.'],
      ['Keep the list stable', 'Added tasks are written into the visit before they are done.']
    ],
    points: [
      'Weekly work and one-time work are separate.',
      'The task list is written before the visit.',
      'Planting is its own booking.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Is a cleanup the same as weekly service?', 'No. A cleanup is one visit. Weekly service is a route.'],
      ['What if the yard is larger than it looked?', 'The price is adjusted in writing before the extra work starts.'],
      ['Do you bring away the debris?', 'The written visit says whether haul-away is included.']
    ]
  },
  {
    slug: 'cleaners',
    name: 'House cleaners',
    buyer: 'a cleaning owner',
    price: 700,
    line: 'A recurring clean and a first deep clean, with supplies and pets answered.',
    headlines: [
      'House cleaning in {city}',
      'Recurring cleans and first deep cleans in {city}',
      'A clear cleaning visit in {city}'
    ],
    ledes: [
      'The first clean and the recurring clean are different amounts of work. The page says what each one covers.',
      'You can see whether supplies are brought, how pets are handled, and which rooms are in a standard visit.',
      'Quotes do not live in a message thread. The visit shape is written here, and the price is confirmed before the day.'
    ],
    work: [
      ['Recurring', 'Kitchens, baths, floors, and the surfaces you live on, on a set rhythm.'],
      ['Deep clean', 'The first visit, or a reset. Inside appliances and inside cabinets only when the price names them.'],
      ['Supplies and pets', 'The owner says whether they bring supplies. Pets are secured or introduced, as agreed before the day.']
    ],
    steps: [
      ['Choose recurring or deep', 'A first visit is usually the deep clean. The route starts after that.'],
      ['List the rooms', 'Beds, baths, and any room that is out of the standard visit.'],
      ['Confirm supplies and pets', 'Both are settled before the cleaner arrives.']
    ],
    points: [
      'Recurring and deep cleans are priced apart.',
      'Rooms in the visit are listed.',
      'Supplies and pets are settled first.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Do you bring supplies?', 'The owner answers that before the visit, and the answer stays on the booking.'],
      ['What about pets?', 'Tell them what is in the house. The plan for pets is set before the day.'],
      ['Are insides of cabinets included?', 'Only when the written price says so.']
    ]
  },
  {
    slug: 'detailers',
    name: 'Mobile detailers',
    buyer: 'a detailing owner',
    price: 700,
    line: 'A mobile visit at the driveway, with packages named in words and prices said before the day.',
    headlines: [
      'Mobile detailing at your driveway in {city}',
      'Car and fleet detailing that comes to you in {city}',
      'A detailing visit in {city}, at your address'
    ],
    ledes: [
      'The work happens at your driveway or lot in {city}. There is no shop to visit.',
      'A maintenance wash, an interior, and paint work are different bookings. The price is said before the day.',
      'One car and a fleet are scheduled differently. Say which you have.'
    ],
    work: [
      ['Maintenance wash', 'The outside, the wheels, and a clean you can repeat. It is not a paint correction.'],
      ['Interior', 'Vacuum, surfaces, and glass. Heavy stains are called out before they are treated.'],
      ['Paint work', 'Correction and protection are booked on their own, after the paint is looked at in daylight.']
    ],
    steps: [
      ['Say where the car sits', 'Driveway, lot, or fleet yard in {city}, and whether there is water and power nearby.'],
      ['Pick the package in words', 'Wash, interior, or paint work. Dollar amounts are the owner’s, confirmed before the visit.'],
      ['Leave access', 'The car is unlocked or the key is arranged. The visit length is said when you book.']
    ],
    points: [
      'The detailer comes to the car.',
      'Wash, interior, and paint work are separate.',
      'Prices are confirmed before the day.',
      'Water and power needs are asked up front.'
    ],
    faqs: [
      ['Do I go to a shop?', 'No. The visit is at the car, in {city}.'],
      ['What if there is no outdoor water?', 'Say so when you book. The owner tells you whether they can still do the job.'],
      ['Is paint correction included in a wash?', 'No. Paint work is its own booking.']
    ]
  },
  {
    slug: 'junk-removal',
    name: 'Junk removal',
    buyer: 'a junk-removal owner',
    price: 700,
    line: 'A load priced from photos, plus a short list of what will not be hauled.',
    headlines: [
      'Junk removal by the load in {city}',
      'Garage, attic, and apartment cleanouts in {city}',
      'A truck and a written load price in {city}'
    ],
    ledes: [
      'Send photos of the pile. A load is priced from what is actually there, not from a guess in a form.',
      'Garages, attics, and apartments are different jobs because stairs and access change the work.',
      'Paints, fuels, and medical waste are refused. Ask before you add anything that is not ordinary household junk.'
    ],
    work: [
      ['A load', 'One full truck, confirmed from photos. More than that is a second load, priced before the day.'],
      ['Stairs and apartments', 'Tell them the floor and whether there is an elevator. Access is part of the price.'],
      ['Refused items', 'Paints, fuels, and medical waste stay behind unless the owner has agreed in writing to a specific item.']
    ],
    steps: [
      ['Photograph the pile', 'Wide shots and a close shot of anything that is not ordinary furniture or bags.'],
      ['Get a written load price', 'It names the truck space and whether stairs are included.'],
      ['Walk it once on the day', 'Items added after the photo are priced before they go on the truck.']
    ],
    points: [
      'Photos set the price.',
      'Stairs are disclosed first.',
      'Paints, fuels, and medical waste are refused.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['What is a load?', 'One full truck, judged from your photos and confirmed by the owner.'],
      ['Do you take paint and fuel?', 'No. Those stay out of the pile.'],
      ['What about a walk-up?', 'Say the floor when you send the photos. Stairs are part of the written price.']
    ]
  },
  {
    slug: 'pest-control',
    name: 'Pest control',
    buyer: 'a pest-control owner',
    price: 800,
    line: 'Ants, cockroaches, and rodents, with a one-time visit and a recurring plan.',
    headlines: [
      'Pest control for ants, roaches, and rodents in {city}',
      'One-time visits and recurring pest service in {city}',
      'A named pest and a written plan in {city}'
    ],
    ledes: [
      'This page covers ants, cockroaches, and rodents. Take a line off if this company does not treat that pest.',
      'A one-time visit and a recurring plan are different. The page says what each one is.',
      'People in the house, pets, and the pest you are seeing are the three facts that book the visit.'
    ],
    work: [
      ['Ants', 'Where you see them, and whether they are in the kitchen or coming from outside.'],
      ['Cockroaches', 'Where they show up, and at what time of day. A prep list is given before the visit.'],
      ['Rodents', 'Droppings, noise, or an entry point you have noticed. Trapping and exclusion are explained before they start.']
    ],
    steps: [
      ['Name the pest', 'Ants, cockroaches, or rodents. If it is something else, ask before you book.'],
      ['Hear the prep', 'Pets, food, and which rooms to leave. Prep is said before the day.'],
      ['Choose one visit or a plan', 'The recurring plan is a schedule and a price, in one sentence, before you start it.']
    ],
    points: [
      'Three pests are named. Others are asked about first.',
      'Pets and people are part of the prep.',
      'One-time and recurring are separate.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Do you treat every pest?', 'This page names ants, cockroaches, and rodents. Anything else is a question, not a booking.'],
      ['What about pets?', 'The owner gives a prep list that includes where pets will be during the visit.'],
      ['Is the recurring plan a long contract?', 'It is a schedule and a price you accept before it starts. Read that sentence before you agree.']
    ]
  },
  {
    slug: 'movers',
    name: 'Movers',
    buyer: 'a moving owner',
    price: 900,
    line: 'Local moves priced from rooms, stairs, and a date.',
    headlines: [
      'Local moves in {city}',
      'A move quote from rooms and stairs in {city}',
      'Household moves inside {city}'
    ],
    ledes: [
      'A local move is priced from the rooms, the stairs, and the date. Those three facts start the quote.',
      'This page is for moves in {city}. The quote says what is carried and what you packed yourselves.',
      'Packing help is a separate line. It is not assumed.'
    ],
    work: [
      ['Local move', 'Loading, the ride, and unloading at the new address. Both addresses are in the quote.'],
      ['What the quote needs', 'Room count, stairs or elevator at each end, heavy pieces, and the date.'],
      ['Packing', 'You pack, or the crew packs. The quote says which. Packing materials are listed if the crew brings them.']
    ],
    steps: [
      ['Send rooms, stairs, and a date', 'Add photos of anything very heavy or awkward.'],
      ['Read the quote', 'It names the crew size, the hours or the flat price, and what is not included.'],
      ['Confirm access', 'Parking, elevators, and a walk from the truck. Say so before the day.']
    ],
    points: [
      'Local moves are the work.',
      'Rooms and stairs set the quote.',
      'Packing is optional and written apart.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Can you quote from a room count alone?', 'A start, yes. Stairs, heavy pieces, and the date finish the quote.'],
      ['Do you pack?', 'Only if the quote says the crew packs. Otherwise the boxes are ready.'],
      ['Are long-distance moves on this page?', 'No. This page is a local move in {city}.']
    ]
  },
  {
    slug: 'groomers',
    name: 'Pet groomers',
    buyer: 'a grooming owner',
    price: 700,
    line: 'Dogs, a first visit, and what to bring. Cats only if the owner adds them.',
    headlines: [
      'Dog grooming in {city}',
      'A first groom, explained, in {city}',
      'Coat, nails, and a booking in {city}'
    ],
    ledes: [
      'This page is for dogs: coat, nails, and ears. Add cats only if this shop grooms them.',
      'A new client can see what the first visit is, what to bring, and what happens if they are late.',
      'Regulars already know the shop. This page is for the next dog.'
    ],
    work: [
      ['The groom', 'Bath, coat, nails, and ears. A specific cut is described when you book, not guessed at drop-off.'],
      ['First visit', 'Temperament, age, and any sensitivity. The first visit may be shorter than a full style.'],
      ['What to bring', 'The vaccine record the shop asks for, and a lead. The shop says which records before the day.']
    ],
    steps: [
      ['Say the breed, size, and coat', 'Add whether this dog has been groomed before.'],
      ['Book a first visit', 'Arrive at the time. Call if you are late. The owner says how long a slot is held.'],
      ['Agree the cut', 'The style is confirmed at drop-off, against what you asked for.']
    ],
    points: [
      'Dogs are the default. Cats are added only by the owner.',
      'The cut is agreed, not guessed.',
      'Vaccine records are requested before the day.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Do you take cats?', 'Only if the owner has added cats to this page. Otherwise this is a dog groom.'],
      ['What if I am late?', 'Call. The shop says how long it holds the slot.'],
      ['Which vaccines?', 'The shop names the records it requires before the appointment.']
    ]
  },
  {
    slug: 'dentists',
    name: 'Dental offices',
    buyer: 'a dental office',
    price: 1500,
    line: 'A new-patient first visit, with insurance named by the office beside the phone.',
    headlines: [
      'A first dental visit in {city}',
      'New patients, from the first call, in {city}',
      'What the first dental appointment is in {city}'
    ],
    ledes: [
      'The first visit is an exam and a written plan. It is not a menu of every procedure the office can perform.',
      'Insurance plans that are in network are written beside the phone by the office. Call and ask if you do not see yours yet.',
      'If you are anxious, say so when you book. The first visit can start with a conversation.'
    ],
    work: [
      ['The first visit', 'Exam, the dentist’s findings, and a written plan for what, if anything, comes next.'],
      ['Insurance', 'The office names the plans it is in network with, next to the phone line. This page does not guess at coverage.'],
      ['After the visit', 'You leave with the plan in words you can repeat. Treatment beyond the exam is scheduled only if you accept it.']
    ],
    steps: [
      ['Call and say you are new', 'Share the plan name if you have one, and any anxiety you want them to know.'],
      ['Arrive for the exam', 'The visit is the exam and the findings, not a surprise procedure.'],
      ['Read the plan', 'Next steps, if any, are written. You decide whether to book them.']
    ],
    points: [
      'The first visit is an exam and a plan.',
      'Coverage is not guessed on this page.',
      'Further treatment is booked only after you accept it.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Is the first visit a cleaning?', 'It is an exam and a plan. A cleaning is scheduled if the dentist says it is the right next step.'],
      ['Which insurance do you take?', 'The office writes the in-network plans beside the phone. Ask about yours before you book.'],
      ['What if I am nervous?', 'Say so when you call. The visit can start with a conversation.']
    ],
    slots: [['Plans', 'In-network plans, in the office’s words']]
  },
  {
    slug: 'med-spas',
    name: 'Med spas',
    buyer: 'a med spa owner',
    price: 1400,
    line: 'A consult page. A clinician decides what is appropriate. Results vary.',
    headlines: [
      'Book a consult in {city}',
      'A first med spa consult in {city}',
      'Start with a consult, not a promise, in {city}'
    ],
    ledes: [
      'The offer is a consult. A clinician decides what, if anything, is appropriate. Results vary, and this page promises no outcome.',
      'New clients start with a conversation and a look at their questions. Treatment, if any, comes after the clinician decides.',
      'Two paths are written: a first consult, and a follow-up the clinician schedules. This page promises no outcome.'
    ],
    work: [
      ['First consult', 'Your questions, a look by the clinician, and a recommendation you can accept or decline.'],
      ['If treatment is offered', 'The clinician explains what it is, what it is not, and that results vary from person to person.'],
      ['Follow-up', 'A second visit exists only if the clinician schedules one. It is not automatic.']
    ],
    steps: [
      ['Book the consult', 'Say what you want to talk about. Do not expect a procedure on that sentence alone.'],
      ['Meet the clinician', 'They decide what is appropriate. You can decline.'],
      ['Leave with a plain answer', 'What was recommended, or why nothing was recommended. Results are never promised on this page.']
    ],
    points: [
      'The product is the consult.',
      'A clinician decides.',
      'Results vary. No outcome is promised.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Will I see a specific result?', 'No. Results vary. The clinician decides what, if anything, to recommend.'],
      ['Is treatment included in the consult?', 'Only if you and the clinician both agree, after the consult.'],
      ['What should I ask?', 'What the recommendation is, what it costs, and what it does not do.']
    ]
  },
  {
    slug: 'gyms',
    name: 'Gyms',
    buyer: 'a gym owner',
    price: 900,
    line: 'Who the gym is for, what the first week includes, and a start price said by the owner.',
    headlines: [
      'A first week at the gym in {city}',
      'Who this gym is for in {city}',
      'Start the first week in {city} with a written plan'
    ],
    ledes: [
      'The first week is a tour, a plan for the days you will come, and one session on the floor or in a class.',
      'This page says who the gym is for. The start price is the owner’s number, given when you ask, not a slogan on a banner.',
      'Class size and coaching are answered with numbers. Ask, and expect a number.'
    ],
    work: [
      ['Who it is for', 'People who want a set first week and a plan, and who will ask how coaching works.'],
      ['The first week', 'A tour, a schedule you can keep, and one coached session or one class.'],
      ['After the week', 'You know the days, the session size, and whether you are continuing. The start price was said before you began.']
    ],
    steps: [
      ['Ask who the floor is for', 'And how many people are in a session. The answer should be a number.'],
      ['Do the first week', 'Tour, plan, and one session. That is the intro.'],
      ['Decide with the price in hand', 'The owner tells you the start price before the week begins.']
    ],
    points: [
      'The intro is one week, described here.',
      'Session size is a number, not a slogan.',
      'The start price is said before you begin.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['What is included in the first week?', 'A tour, a plan for your days, and one session or class.'],
      ['How big are the sessions?', 'Ask. The owner answers with a number.'],
      ['Where is the price?', 'The owner tells you the start price before the first week. It is their number.']
    ]
  },
  {
    slug: 'restaurants',
    name: 'Restaurants',
    buyer: 'a restaurant owner',
    price: 1200,
    line: 'Hours, one house dish, and how to get a table tonight.',
    headlines: [
      'Dinner tonight in {city}',
      'Hours, one dish, and a table in {city}',
      'What to know before you come in {city}'
    ],
    ledes: [
      'This page answers three things: whether the doors are open, what to order first, and how to get a table.',
      'Hours and the house dish are the owner’s lines in the contact block. The way a table works is already written.',
      'Walk-ins and reservations are named below. The host stand and this page should say the same thing.'
    ],
    work: [
      ['Hours', 'The open days and the last seating are written in the contact block by the owner. If that line is still blank, call before you drive.'],
      ['The house dish', 'One dish the kitchen wants a new guest to order. The name is the owner’s, on the contact block.'],
      ['A table', 'Call the phone on this page, or walk in if the contact block says walk-ins are welcome.']
    ],
    steps: [
      ['Check the hours line', 'Open days and last seating. Call if you are unsure.'],
      ['Ask for the house dish', 'Or read it once the owner has named it.'],
      ['Get a table the way the page says', 'Reservation, walk-in, or either. The contact block states which.']
    ],
    points: [
      'Hours are a single line, kept current by the owner.',
      'One house dish, not the whole menu.',
      'The table policy matches the host stand.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Do you take reservations?', 'The contact block says reservations, walk-ins, or both. Call the phone on this page if you need a table tonight.'],
      ['Where is the menu?', 'The house dish is the one this page is for. The full menu is at the table.'],
      ['Are you open right now?', 'Read the hours line. If the owner has not filled it in yet, call before you come.']
    ],
    slots: [
      ['Hours', 'Open days and last seating'],
      ['House dish', 'The one dish to order'],
      ['Tables', 'Reservations, walk-ins, or both']
    ]
  },
  {
    slug: 'food-trucks',
    name: 'Food trucks',
    buyer: 'a food-truck owner',
    price: 800,
    line: 'This week’s stops, three items, and what happens in bad weather.',
    headlines: [
      'Where the truck is in {city}',
      'This week’s stops in {city}',
      'Three items and a corner in {city}'
    ],
    ledes: [
      'The question is where the truck is this week. The stops are written in the contact block and kept current.',
      'Three items, not a long menu. Cash or card, and what happens if the weather is bad, are answered here.',
      'A stop list beats a pin from last month. The owner updates the week.'
    ],
    work: [
      ['This week', 'The corners and the hours are the owner’s lines. If the week line is blank, the truck has not posted stops yet.'],
      ['Three items', 'The plate, the side, and the drink the truck is built around. Names are the owner’s, next to the stops.'],
      ['Weather and payment', 'The owner says whether they run in rain, and whether they take cards, cash, or both.']
    ],
    steps: [
      ['Read this week’s stops', 'Corner and hours. Do not trust an old pin.'],
      ['Order from the short list', 'Three items. Specials, if any, are written on the truck.'],
      ['Check the weather line', 'If rain cancels a stop, the contact block is where that is said.']
    ],
    points: [
      'Stops are a week, not a permanent address.',
      'Three items are the menu on this page.',
      'Payment and weather are stated.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['Where are you parked?', 'On the stops line for this week. If it is blank, the week has not been posted.'],
      ['Do you take cards?', 'The contact block says cash, card, or both once the owner fills the payment line.'],
      ['What if it rains?', 'The weather line says whether the stop still happens.']
    ],
    slots: [
      ['This week', 'Corners and hours'],
      ['Three items', 'Plate, side, and drink'],
      ['Pay and weather', 'Cash or card, and whether rain cancels']
    ]
  },
  {
    slug: 'auto-repair',
    name: 'Auto repair shops',
    buyer: 'a shop owner',
    price: 1000,
    line: 'An estimate you can read before the car is repaired, and a list of work the shop does not guess at.',
    headlines: [
      'Auto repair with a written estimate in {city}',
      'Maintenance, brakes, and diagnostics in {city}',
      'The estimate before the repair in {city}'
    ],
    ledes: [
      'You get an estimate in writing before repair work begins. Diagnostics are the look. The repair is a separate approval.',
      'This page covers maintenance, brakes, and diagnostics. A job the shop does not do is said before the car is booked in.',
      'There is no assumed loaner car. Ask. If there is not one, you will hear that before the day.'
    ],
    work: [
      ['Diagnostics', 'The shop finds the cause and writes it down. Finding the cause is not the same as approving the repair.'],
      ['Maintenance and brakes', 'Services and brake work this page describes. The estimate names the parts and the labor.'],
      ['Sent out', 'Work this shop does not do is named before you leave the car. It is not discovered at pickup.']
    ],
    steps: [
      ['Describe the symptom', 'Noise, light, or the service that is due.'],
      ['Approve diagnostics if needed', 'Then read the estimate. Repair waits for your yes.'],
      ['Pickup with the invoice', 'What was done, what was not, and whether a job was sent to another shop.']
    ],
    points: [
      'The estimate comes before the repair.',
      'Diagnostics and repair are separate approvals.',
      'Work the shop does not do is said early.',
      'A loaner is never assumed.'
    ],
    faqs: [
      ['Do you start work when I drop the car off?', 'Diagnostics, if you approved them. Repairs wait for the written estimate and your yes.'],
      ['Is there a loaner?', 'Do not assume one. Ask when you book.'],
      ['What if you cannot do the job?', 'You are told before the car is booked in, or before a send-out happens.']
    ]
  },
  {
    slug: 'property-managers',
    name: 'Property managers',
    buyer: 'a property manager',
    price: 1300,
    line: 'A door for owners and a different door for tenants, with the fee in plain words.',
    headlines: [
      'Property management for owners in {city}',
      'Owners and tenants, on two different paths, in {city}',
      'What a managed month includes in {city}'
    ],
    ledes: [
      'Owners and tenants need different doors. This page tells an owner what is managed, and tells a tenant how to report a repair.',
      'A managed month is rent collected, maintenance calls handled, and a note to the owner. The fee is one plain sentence from the manager.',
      'The fee is not printed as a guess. Ask, and expect it in words, next to the phone.'
    ],
    work: [
      ['For owners', 'Leasing, rent collection, maintenance, and a monthly note. The properties covered are the ones in the agreement.'],
      ['For tenants', 'A repair call uses the phone on this page and starts with the address and what failed. It is not a sales call.'],
      ['The fee', 'The manager says it in one sentence before an owner signs. This page does not invent a percentage.']
    ],
    steps: [
      ['Say whether you are an owner or a tenant', 'The two calls go to different work.'],
      ['Owners: ask what a month includes', 'And the fee, in one sentence.'],
      ['Tenants: report the repair', 'Address, what failed, and whether anyone is home.']
    ],
    points: [
      'Owners and tenants are different doors.',
      'A month is rent, maintenance, and a note.',
      'The fee is a sentence, not a surprise.',
      'The city is on the first screen.'
    ],
    faqs: [
      ['I am a tenant. Is this the right page?', 'Yes, for a repair. Call and say it is a maintenance problem, with the address.'],
      ['What does management cost?', 'The manager states the fee in plain words before you sign. It is not invented on this page.'],
      ['Which properties?', 'The ones named in the agreement. This page does not claim a building it was not given.']
    ]
  }
];

const CITIES = [
  ['Boise', 'ID'], ['Spokane', 'WA'], ['Tacoma', 'WA'], ['Eugene', 'OR'], ['Salem', 'OR'],
  ['Bend', 'OR'], ['Reno', 'NV'], ['Tucson', 'AZ'], ['Albuquerque', 'NM'], ['El Paso', 'TX'],
  ['Lubbock', 'TX'], ['Amarillo', 'TX'], ['Corpus Christi', 'TX'], ['Shreveport', 'LA'], ['Lafayette', 'LA'],
  ['Mobile', 'AL'], ['Huntsville', 'AL'], ['Montgomery', 'AL'], ['Jackson', 'MS'], ['Little Rock', 'AR'],
  ['Fayetteville', 'AR'], ['Tulsa', 'OK'], ['Wichita', 'KS'], ['Des Moines', 'IA'], ['Cedar Rapids', 'IA'],
  ['Omaha', 'NE'], ['Sioux Falls', 'SD'], ['Fargo', 'ND'], ['Billings', 'MT'], ['Madison', 'WI'],
  ['Green Bay', 'WI'], ['Grand Rapids', 'MI'], ['Ann Arbor', 'MI'], ['Fort Wayne', 'IN'], ['Peoria', 'IL'],
  ['Rockford', 'IL'], ['Toledo', 'OH'], ['Dayton', 'OH'], ['Akron', 'OH'], ['Lexington', 'KY'],
  ['Knoxville', 'TN'], ['Chattanooga', 'TN'], ['Greenville', 'SC'], ['Savannah', 'GA'], ['Augusta', 'GA'],
  ['Charleston', 'WV'], ['Springfield', 'MO'], ['Fort Collins', 'CO'], ['Provo', 'UT'], ['Gainesville', 'FL']
].map(([name, state]) => ({
  name,
  state,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + state.toLowerCase()
}));

module.exports = { SERVICES, CITIES };
