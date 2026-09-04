const PROPERTIES=[
  {id:1,title:"3 Marla Plot in Satellite Town",type:"plot",purpose:"sale",price:8500000,area:2700,areaUnit:"sqft",bedrooms:0,bathrooms:0,floors:0,parking:0,yearBuilt:0,features:["Corner Plot","Cemented Road","Electricity","Sewerage","Water Connection","Gas","Boundary Wall","Main Road Access"],description:"Prime 3 marla residential plot located in the heart of Satellite Town, Quetta. This is a corner plot with excellent road access and all utility connections available. The area is well-developed with schools, hospitals, and markets nearby. Ideal for building a family home or commercial building. Clear title documents available for immediate transfer.",address:"Satellite Town, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800","https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],featured:true,agentId:1,lat:30.1841,lng:67.0011},
  {id:2,title:"5 Marla House in Samungli Road",type:"house",purpose:"sale",price:14500000,area:3500,areaUnit:"sqft",bedrooms:3,bathrooms:2,floors:2,parking:1,yearBuilt:2021,features:["CCTV Cameras","Car Parking","Water Tank","Marble Flooring","Modular Kitchen","Central Heating","Backyard","Staff Room"],description:"Beautifully constructed 5 marla double-story house on Samungli Road. Features modern architecture with imported fixtures, modular kitchen, marble flooring throughout, and central heating system. The house includes 3 bedrooms with attached baths, a drawing room, lounge, and kitchen on the ground floor with 2 bedrooms and a terrace on the first floor. Located on a 30-foot wide road with easy access to Quetta Airport and Saryab Road.",address:"Samungli Road, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],featured:true,agentId:2,lat:30.2035,lng:66.9912},
  {id:3,title:"10 Marla Plot in Gracious Hotel Avenue",type:"plot",purpose:"sale",price:22000000,area:4500,areaUnit:"sqft",bedrooms:0,bathrooms:0,floors:0,parking:0,yearBuilt:0,features:["Main Boulevard","Commercial Potential","Gas","Electricity","Water","Sewerage","Paved Roads","Security"],description:"Prime 10 marla commercial/residential plot on Gracious Hotel Avenue, one of Quetta's most sought-after locations. This plot sits on a 60-foot wide main boulevard with heavy foot traffic and excellent visibility. Surrounded by hotels, restaurants, and commercial establishments. Perfect for building a commercial plaza or residential building. All documents verified and ready for transfer.",address:"Gracious Hotel Avenue, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800","https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],featured:true,agentId:3,lat:30.1890,lng:67.0080},
  {id:4,title:"2 Kanal House in Satellite Town",type:"house",purpose:"sale",price:45000000,area:9600,areaUnit:"sqft",bedrooms:5,bathrooms:4,floors:2,parking:3,yearBuilt:2019,features:["Swimming Pool","Lawn","Study Room","Servant Quarter","Double Garage","Generator","Solar Panels","Security System","Guest House"],description:"Luxurious 2 kanal house in the most prestigious area of Satellite Town. This grand residence features 5 spacious bedrooms with attached luxury bathrooms, a separate drawing and dining room, modern kitchen with island counter, family lounge, and a beautiful lawn with swimming pool. The property includes a separate servant quarter, double garage with electric gates, and a backup generator with solar panels. Premium construction quality with imported Italian tiles and fittings throughout.",address:"Satellite Town, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],featured:false,agentId:1,lat:30.1855,lng:67.0025},
  {id:5,title:"4 Marla House in Hazara Town",type:"house",purpose:"sale",price:11000000,area:2400,areaUnit:"sqft",bedrooms:2,bathrooms:2,floors:1,parking:1,yearBuilt:2022,features:["New Construction","Modern Design","Marble Floor","Fitted Kitchen","Water Tank","Boundary Wall","Street Lights","Sewerage"],description:"Brand new single-story house in Hazara Town, Quetta. Modern construction with a clean, minimalist design. Features 2 bedrooms with attached baths, a bright living room, fitted kitchen, and a small front yard. The house is built on a 4-marla plot with high-quality materials and craftsmanship. Perfect for a small family looking for a comfortable and affordable home in a peaceful neighborhood.",address:"Hazara Town, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],featured:false,agentId:2,lat:30.2100,lng:66.9850},
  {id:6,title:"7 Marla Plot in Brewery Road",type:"plot",purpose:"sale",price:18000000,area:3150,areaUnit:"sqft",bedrooms:0,bathrooms:0,floors:0,parking:0,yearBuilt:0,features:["Prime Location","Commercial Zone","Wide Road","All Utilities","Near Market","Security Guard","Paved Area","Famous Area"],description:"Strategically located 7 marla plot on Brewery Road, one of Quetta's busiest commercial areas. This plot is surrounded by popular restaurants, shops, and offices. The area enjoys round-the-clock security and all essential utilities. Perfect for commercial development or a mixed-use building. High rental yield potential given the prime location.",address:"Brewery Road, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800","https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],featured:false,agentId:3,lat:30.1920,lng:67.0050},
  {id:7,title:"3 Marla House in Jinnah Town",type:"house",purpose:"sale",price:7800000,area:1800,areaUnit:"sqft",bedrooms:2,bathrooms:1,floors:1,parking:0,yearBuilt:2020,features:["Compact Design","Furnished","Air Conditioning","Water Filter","Tiled Floor","Modern Bath","Near School","Public Transport"],description:"Cozy 3 marla house in Jinnah Town, ideal for a small family or bachelor's accommodation. The house is fully furnished with modern furniture, air conditioning units, and a water filtration system. Features 2 bedrooms, 1 bathroom, a small lounge, and a compact kitchen. Located near schools and public transport routes for easy commuting.",address:"Jinnah Town, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],featured:false,agentId:1,lat:30.2050,lng:66.9980},
  {id:8,title:"12 Marla Plot in Zarghoon Road",type:"plot",purpose:"sale",price:32000000,area:5400,areaUnit:"sqft",bedrooms:0,bathrooms:0,floors:0,parking:0,yearBuilt:0,features:["Government Area","High Security","Wide Roads","Park Nearby","Schools Nearby","Hospital Access","Developed Area","Electricity","Water","Gas"],description:"Premium 12 marla plot on Zarghoon Road, adjacent to government buildings and high-security zones. The area is well-maintained with wide roads, street lights, and regular patrolling. Multiple schools and a major hospital are within walking distance. Excellent for building a family home in one of Quetta's safest neighborhoods. Clear documentation and hassle-free transfer.",address:"Zarghoon Road, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800","https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],featured:true,agentId:2,lat:30.1780,lng:67.0100},
  {id:9,title:"2 Kanal Farmhouse in Chiltan Housing Scheme",type:"house",purpose:"sale",price:38000000,area:9600,areaUnit:"sqft",bedrooms:4,bathrooms:3,floors:1,parking:4,yearBuilt:2018,features:["Farmhouse","Orchard","Swimming Pool","Guest Rooms","Staff Quarters","Bore Water","Solar System","Electric Gate","CCTV"],description:"Stunning farmhouse in Chiltan Housing Scheme, surrounded by lush green orchards and mountain views. This sprawling 2-kanal property features 4 bedrooms, 3 bathrooms, a large lawn with swimming pool, and staff quarters. The farmhouse includes a modern kitchen, multiple guest rooms, and a dedicated BBQ area. Equipped with a solar power system, bore water, and complete security setup. Perfect for weekend getaways or permanent residence away from city noise.",address:"Chiltan Housing Scheme, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],featured:false,agentId:1,lat:30.1650,lng:66.9750},
  {id:10,title:"5 Marla House in Saryab Road",type:"house",purpose:"rent",price:45000,area:3000,areaUnit:"sqft",bedrooms:3,bathrooms:2,floors:2,parking:1,yearBuilt:2020,features:["Furnished","Air Conditioning","Washing Machine","Refrigerator","Microwave","Water Heater","Generator Backup","Internet Ready"],description:"Fully furnished 5 marla house available for rent on Saryab Road. The house is equipped with all essential appliances including AC, washing machine, refrigerator, microwave, and water heater. Features 3 bedrooms with attached baths, a drawing room, and a spacious lounge. Generator backup ensures uninterrupted power supply. Monthly rent is PKR 45,000 with 2 months advance security deposit.",address:"Saryab Road, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],featured:false,agentId:3,lat:30.2000,lng:66.9900},
  {id:11,title:"4 Marla Plot in Ramdas",type:"plot",purpose:"sale",price:6000000,area:2400,areaUnit:"sqft",bedrooms:0,bathrooms:0,floors:0,parking:0,yearBuilt:0,features:["Residential Area","Near School","Near Hospital","Developing Area","Low Price","Road Access","Electricity","Water"],description:"Affordable 4 marla residential plot in Ramdas, a rapidly developing area on the outskirts of Quetta. Great investment opportunity with prices trending upward due to new infrastructure projects. The plot is located near a school and hospital, with road access and utility connections available. Ideal for first-time buyers or investors looking for long-term capital appreciation.",address:"Ramdas, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800","https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],featured:false,agentId:2,lat:30.1500,lng:67.0200},
  {id:12,title:"6 Marla House in Jinnah Avenue",type:"house",purpose:"sale",price:19500000,area:4200,areaUnit:"sqft",bedrooms:4,bathrooms:3,floors:2,parking:2,yearBuilt:2021,features:["Double Glazed Windows","Central Heating","Walk-in Closet","En-suite Bath","Kitchen Island","Balcony","Roof Terrace","Storage Room"],description:"Elegant 6 marla double-story house on Jinnah Avenue, featuring premium construction with double-glazed windows, central heating, and high-end finishes. The ground floor includes a spacious lounge, kitchen with island counter, drawing room, and guest bedroom. First floor has 3 bedrooms with en-suite bathrooms and walk-in closets. Additional features include a roof terrace with mountain views and a dedicated storage room.",address:"Jinnah Avenue, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],featured:true,agentId:1,lat:30.1870,lng:67.0030},
  {id:13,title:"3 Marla Plot in Mariabad",type:"plot",purpose:"sale",price:5200000,area:1800,areaUnit:"sqft",bedrooms:0,bathrooms:0,floors:0,parking:0,yearBuilt:0,features:["Mountain View","Peaceful Area","Near Mosque","Road Access","Electricity","Water","Developing Area"],description:"Charming 3 marla plot in Mariabad, offering beautiful mountain views and a peaceful environment. The area is developing rapidly with new construction projects underway. Located near a mosque and basic amenities. Perfect for building a small home in a serene setting away from the hustle and bustle of the city center.",address:"Mariabad, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800","https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],featured:false,agentId:3,lat:30.1700,lng:67.0150},
  {id:14,title:"8 Marla House in Cantt Area",type:"house",purpose:"sale",price:28000000,area:5600,areaUnit:"sqft",bedrooms:4,bathrooms:3,floors:2,parking:2,yearBuilt:2017,features:["Army Area","High Security","Beautiful Garden","Servant Quarter","Modern Kitchen","Drawing Room","Dining Room","Lawn","Garage"],description:"Prestigious 8 marla house in the Cantonment area, known for its security, cleanliness, and green surroundings. This beautifully maintained property features 4 bedrooms, 3 bathrooms, a formal drawing room, dining room, and a large kitchen. The property includes a beautiful garden, servant quarter, and a double garage. Living in the Cantt area offers unparalleled security and a premium lifestyle.",address:"Cantt Area, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],featured:true,agentId:1,lat:30.1800,lng:67.0000},
  {id:15,title:"1 Kanal Plot in Serena View",type:"plot",purpose:"sale",price:55000000,area:4800,areaUnit:"sqft",bedrooms:0,bathrooms:0,floors:0,parking:0,yearBuilt:0,features:["Premium Location","Mountain View","Gated Community","24/7 Security","Paved Roads","Street Lights","Parks","Club House"],description:"Exclusive 1 kanal plot in Serena View, Quetta's most premium gated community. This plot offers breathtaking mountain views and is surrounded by luxury homes. The community features 24/7 security, paved roads, street lights, parks, and a club house. Perfect for building a dream home in an exclusive neighborhood. Limited plots available in this highly sought-after development.",address:"Serena View, Quetta",district:"Quetta",images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800","https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],featured:true,agentId:2,lat:30.1950,lng:67.0120},
  {id:16,title:"4 Marla House in Kech (Turbat)",type:"house",purpose:"sale",price:9500000,area:2400,areaUnit:"sqft",bedrooms:2,bathrooms:2,floors:1,parking:1,yearBuilt:2021,features:["New Build","Spacious Rooms","Front Yard","Water Tank","Boundary Wall","Near Market","Near Hospital","School Bus Route"],description:"Well-built 4 marla house in Turbat, Kech district. A modern single-story home with spacious rooms, a front yard, and all essential amenities. Located near the main market and hospital, with easy access to schools. The house features a water tank, boundary wall, and covered parking. An excellent property for families in the growing city of Turbat.",address:"Turbat, Kech",district:"Kech",images:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],featured:false,agentId:3,lat:25.9890,lng:63.0800},
  {id:17,title:"5 Marla House in Gwadar",type:"house",purpose:"sale",price:25000000,area:3200,areaUnit:"sqft",bedrooms:3,bathrooms:2,floors:2,parking:1,yearBuilt:2022,features:["Sea View","New Construction","CPEC Area","Modern Design","Marble Floor","Fitted Kitchen","Waterfront","Investment"],description:"Prime 5 marla house in Gwadar with stunning sea views. Located in the heart of the CPEC development zone, this property offers incredible investment potential. The modern double-story house features 3 bedrooms, 2 bathrooms, marble flooring, and a fitted kitchen. Gwadar is rapidly developing with new infrastructure, making this an ideal investment opportunity for those looking to capitalize on the region's growth.",address:"Gwadar, Balochistan",district:"Gwadar",images:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],featured:true,agentId:1,lat:25.1260,lng:62.3260},
  {id:18,title:"3 Marla Plot in Chaman",type:"plot",purpose:"sale",price:4000000,area:1800,areaUnit:"sqft",bedrooms:0,bathrooms:0,floors:0,parking:0,yearBuilt:0,features:["Border City","Commercial Potential","Near Border","Developing Area","Road Access","Electricity","Water"],description:"3 marla plot in Chaman, a key border city with growing commercial activity due to trade with Afghanistan. The plot is located near the main commercial area, offering excellent potential for both residential and commercial development. With increasing trade volume and infrastructure improvements, property values in Chaman are on a steady rise.",address:"Chaman, Balochistan",district:"Chaman",images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800","https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],featured:false,agentId:2,lat:30.3300,lng:66.4400},
  {id:19,title:"6 Marla House in Khuzdar",type:"house",purpose:"sale",price:12000000,area:3600,areaUnit:"sqft",bedrooms:3,bathrooms:2,floors:1,parking:1,yearBuilt:2019,features:["Spacious Plot","Garden","Water Tank","Boundary Wall","Near College","Hospital Access","Peaceful Area"],description:"Spacious 6 marla house in Khuzdar, the second-largest city in Balochistan. The house is built on a generous plot with a beautiful garden and ample parking space. Features 3 bedrooms, 2 bathrooms, a large lounge, and a modern kitchen. Located near Khuzdar's main college and hospital, the property offers a comfortable lifestyle in a peaceful environment.",address:"Khuzdar, Balochistan",district:"Khuzdar",images:["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800"],featured:false,agentId:3,lat:27.8000,lng:66.6100},
  {id:20,title:"5 Marla Plot in Zhob",type:"plot",purpose:"sale",price:3500000,area:2250,areaUnit:"sqft",bedrooms:0,bathrooms:0,floors:0,parking:0,yearBuilt:0,features:["Mountain Region","Peaceful","Developing","Near River","School Access","Road Network","Electricity"],description:"5 marla plot in Zhob, a scenic district in northeastern Balochistan. The plot is located in a developing residential area with access to schools and the main road network. Zhob is known for its beautiful mountains and the Zhob River, making it an attractive location for nature lovers. An affordable entry point into real estate in a growing city.",address:"Zhob, Balochistan",district:"Zhob",images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800","https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=800","https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800","https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"],featured:false,agentId:1,lat:31.3500,lng:69.4500}
];

const AGENTS=[
  {id:1,name:"Ahmed Khan",company:"Khan Real Estate",phone:"+92-321-1234567",email:"ahmed@khanre.com",rating:4.9,listings:45,avatar:"AK",specialties:["Residential","Commercial","Investment"],deals:120},
  {id:2,name:"Sara Baloch",company:"Baloch Properties",phone:"+92-333-9876543",email:"sara@balochprop.com",rating:4.8,listings:32,avatar:"SB",specialties:["Plots","Houses","Farmhouses"],deals:95},
  {id:3,name:"Bilal Ahmed",company:"QDP Realtors",phone:"+92-345-5551234",email:"bilal@qdprealtors.com",rating:4.7,listings:28,avatar:"BA",specialties:["Rental","Residential","New Construction"],deals:78}
];

const DISTRICTS=[
  {name:"Quetta",properties:15,cover:"https://images.unsplash.com/photo-1621252179027-94459d37a889?w=600",desc:"Balochistan's capital and largest city"},
  {name:"Gwadar",properties:3,cover:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",desc:"Strategic port city on the Arabian Sea"},
  {name:"Kech",properties:4,cover:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600",desc:"Home to Turbat, a growing commercial hub"},
  {name:"Khuzdar",properties:2,cover:"https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600",desc:"Second-largest city in Balochistan"},
  {name:"Chaman",properties:2,cover:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600",desc:"Key border trading city with Afghanistan"},
  {name:"Zhob",properties:1,cover:"https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600",desc:"Scenic mountainous district in the northeast"},
  {name:"Sibi",properties:1,cover:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600",desc:"Historic city with ancient fort ruins"}
];

const PROJECTS=[
  {name:"Serena View Residences",developer:"Quetta Development Authority",status:"active",price:"From PKR 35 Lac",type:"Plots",img:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",desc:"Premium gated community with modern amenities and mountain views."},
  {name:"Gwadar Bay City",developer:"CPEC Developments Ltd",status:"active",price:"From PKR 25 Lac",type:"Residential",img:"https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",desc:"Waterfront residential project near Gwadar Port."},
  {name:"Chiltan Heights",developer:"Balochistan Builders",status:"soon",price:"From PKR 18 Lac",type:"Apartments",img:"https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",desc:"Modern apartment complex in Chiltan Housing Scheme, Quetta."}
];

const NEWS=[
  {title:"CPEC Phase II to Boost Gwadar Property Prices",date:"Aug 28, 2025",img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",excerpt:"The second phase of CPEC is expected to bring significant investment to Gwadar, driving up property prices in the region by an estimated 30-40% over the next two years."},
  {title:"Quetta Metro Project Approved by Provincial Government",date:"Aug 15, 2025",img:"https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800",excerpt:"The Balochistan government has officially approved the Quetta Metro Bus project, which will connect major residential areas to the city center and boost property values along the route."},
  {title:"New Housing Scheme Launched in Satellite Town",date:"Jul 30, 2025",img:"https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",excerpt:"A new premium housing scheme has been launched in Satellite Town, offering 5-10 marla plots with modern infrastructure and 24/7 security at competitive prices."}
];

function formatPrice(p){return"PKR "+p.toLocaleString()}
function formatPriceK(p){return p>=1000000?"PKR "+(p/1000000).toFixed(1)+"M":"PKR "+(p/1000).toFixed(0)+"K"}

let currentRoute="home";
let currentGalleryIndex=0;

function navigate(route,params={}){
  currentRoute=route;
  window.history.pushState({route,params},"",route==="home"?"/":`/${route}`);
  render();
}

window.addEventListener("popstate",(e)=>{
  if(e.state){currentRoute=e.state.route;render()}
  else{currentRoute="home";render()}
});

function render(){
  const app=document.getElementById("app");
  app.innerHTML=renderHeader()+renderPage()+renderFooter();
  window.scrollTo(0,0);
  attachEvents();
}

function renderPage(){
  switch(currentRoute){
    case"listings":return renderListings();
    case"detail":return renderDetail();
    case"post":return renderPost();
    case"agents":return renderAgents();
    case"projects":return renderProjects();
    case"news":return renderNewsPage();
    default:return renderHome();
  }
}

function renderHeader(){
  const active=currentRoute;
  return`
  <div class="topbar">
    <div class="container">
      <div><i class="fas fa-map-marker-alt"></i> Quetta Digital Property &mdash; Balochistan's Trusted Real Estate Portal</div>
      <div>
        <a href="#"><i class="fas fa-phone"></i> +92-81-1234567</a>
        <a href="#"><i class="fas fa-envelope"></i> info@qdp.pk</a>
        <a href="#"><i class="fab fa-facebook"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
      </div>
    </div>
  </div>
  <div class="header">
    <div class="container">
      <a class="logo" href="#" onclick="navigate('home');return false;">
        <div class="logo-icon"><i class="fas fa-building"></i></div>
        QDP<span>.pk</span>
      </a>
      <div class="nav">
        <a class="${active==='home'?'active':''}" href="#" onclick="navigate('home');return false;">Home</a>
        <a class="${active==='listings'?'active':''}" href="#" onclick="navigate('listings');return false;">Buy</a>
        <a class="${active==='listings'?'active':''}" href="#" onclick="navigate('listings',{purpose:'rent'});return false;">Rent</a>
        <a class="${active==='projects'?'active':''}" href="#" onclick="navigate('projects');return false;">Projects</a>
        <a class="${active==='agents'?'active':''}" href="#" onclick="navigate('agents');return false;">Agents</a>
        <a class="${active==='news'?'active':''}" href="#" onclick="navigate('news');return false;">News</a>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline" onclick="navigate('post')"><i class="fas fa-plus"></i> Post Ad</button>
        <button class="btn btn-primary"><i class="fas fa-user"></i> Login</button>
      </div>
    </div>
  </div>`;
}

function renderHome(){
  return`
  <div class="hero">
    <div class="container hero-content">
      <h1>Find Your Dream Property<br>in <span>Balochistan</span></h1>
      <p>Discover plots, houses, and commercial properties across Quetta, Gwadar, and all major cities in Balochistan.</p>
      <div class="search-box">
        <div class="search-row">
          <div class="search-field"><i class="fas fa-search"></i><input type="text" placeholder="Search by area, landmark, or property name..."></div>
          <div class="search-field"><i class="fas fa-map-marker-alt"></i>
            <select><option>All Districts</option>${DISTRICTS.map(d=>`<option>${d.name}</option>`).join("")}</select>
          </div>
          <div class="search-field"><i class="fas fa-home"></i>
            <select><option>All Types</option><option>House</option><option>Plot</option><option>Apartment</option><option>Commercial</option></select>
          </div>
          <button class="search-btn" onclick="navigate('listings')"><i class="fas fa-search"></i> Search</button>
        </div>
        <div class="search-tags">
          <span>Popular:</span>
          <button onclick="navigate('listings',{q:'Satellite Town'})">Satellite Town</button>
          <button onclick="navigate('listings',{q:'Gwadar'})">Gwadar</button>
          <button onclick="navigate('listings',{type:'plot'})">Plots</button>
          <button onclick="navigate('listings',{purpose:'rent'})">For Rent</button>
        </div>
      </div>
    </div>
  </div>

  <div class="stats">
    <div class="container">
      <div class="stat"><div class="stat-num">2,500+</div><div class="stat-label">Properties Listed</div></div>
      <div class="stat"><div class="stat-num">850+</div><div class="stat-label">Happy Clients</div></div>
      <div class="stat"><div class="stat-num">120+</div><div class="stat-label">Verified Agents</div></div>
      <div class="stat"><div class="stat-num">7</div><div class="stat-label">Districts Covered</div></div>
    </div>
  </div>

  <div class="section">
    <div class="container">
      <div class="section-header">
        <div><h2>Featured Properties</h2><p>Handpicked premium listings across Balochistan</p></div>
        <a class="section-link" href="#" onclick="navigate('listings');return false;">View All <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="prop-grid">${PROPERTIES.filter(p=>p.featured).map(renderPropertyCard).join("")}</div>
    </div>
  </div>

  <div class="section" style="background:#fff">
    <div class="container">
      <div class="section-header">
        <div><h2>Explore by District</h2><p>Browse properties across Balochistan's major cities</p></div>
      </div>
      <div class="dist-grid">${DISTRICTS.map(d=>`
        <div class="dist-card" onclick="navigate('listings',{district:'${d.name}'})">
          <img src="${d.cover}" alt="${d.name}" loading="lazy">
          <div class="dist-overlay">
            <h3>${d.name}</h3>
            <p>${d.properties} Properties</p>
          </div>
        </div>`).join("")}</div>
    </div>
  </div>

  <div class="section">
    <div class="container">
      <div class="section-header">
        <div><h2>Latest Properties for Sale</h2><p>Recently added listings in Quetta and surrounding areas</p></div>
        <a class="section-link" href="#" onclick="navigate('listings');return false;">View All <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="prop-grid">${PROPERTIES.slice(0,8).map(renderPropertyCard).join("")}</div>
    </div>
  </div>

  <div class="section" style="background:#fff">
    <div class="container">
      <div class="section-header">
        <div><h2>Top Agents</h2><p>Work with Balochistan's most trusted real estate professionals</p></div>
        <a class="section-link" href="#" onclick="navigate('agents');return false;">View All <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="agent-grid">${AGENTS.map(renderAgentCard).join("")}</div>
    </div>
  </div>

  <div class="section">
    <div class="container">
      <div class="section-header">
        <div><h2>Ongoing Projects</h2><p>Invest in Balochistan's most promising developments</p></div>
        <a class="section-link" href="#" onclick="navigate('projects');return false;">View All <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="project-grid">${PROJECTS.map(renderProjectCard).join("")}</div>
    </div>
  </div>

  <div class="section" style="background:#fff">
    <div class="container">
      <div class="section-header">
        <div><h2>Latest News</h2><p>Stay updated on Balochistan's real estate market</p></div>
        <a class="section-link" href="#" onclick="navigate('news');return false;">View All <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="news-grid">${NEWS.map(renderNewsCard).join("")}</div>
    </div>
  </div>

  <div class="cta">
    <div class="container">
      <h2>Have a Property to Sell or Rent?</h2>
      <p>List your property on Quetta Digital Property and reach thousands of potential buyers and tenants across Balochistan.</p>
      <a class="btn-white" href="#" onclick="navigate('post');return false;">Post Your Ad Free <i class="fas fa-arrow-right"></i></a>
    </div>
  </div>`;
}

function renderPropertyCard(p){
  const badge=p.featured?"badge-featured":p.purpose==="rent"?"badge-rent":p.type==="plot"?"badge-new":"";
  const badgeText=p.featured?"Featured":p.purpose==="rent"?"For Rent":p.type==="plot"?"Plot":"New";
  return`
  <div class="prop-card" onclick="navigate('detail',{id:${p.id}})">
    <div class="prop-img">
      <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
      <span class="prop-badge ${badge}">${badgeText}</span>
      ${p.featured?'<span class="badge-verified"><i class="fas fa-check-circle"></i> Verified</span>':''}
      <span class="prop-price">${formatPriceK(p.price)}</span>
    </div>
    <div class="prop-body">
      <div class="prop-title">${p.title}</div>
      <div class="prop-loc"><i class="fas fa-map-marker-alt"></i> ${p.address}</div>
      <div class="prop-features">
        ${p.type!=="plot"?`<span><i class="fas fa-bed"></i> ${p.bedrooms} Bed</span><span><i class="fas fa-bath"></i> ${p.bathrooms} Bath</span>`:''}
        <span><i class="fas fa-ruler-combined"></i> ${p.area.toLocaleString()} ${p.areaUnit}</span>
        ${p.type!=="plot"?`<span><i class="fas fa-car"></i> ${p.parking} Parking</span>`:''}
      </div>
    </div>
  </div>`;
}

function renderAgentCard(a){
  return`
  <div class="agent-card">
    <div class="agent-avatar">${a.avatar}</div>
    <div class="agent-name">${a.name}</div>
    <div class="agent-co">${a.company}</div>
    <div class="agent-rating"><i class="fas fa-star"></i> ${a.rating} (${a.listings} listings)</div>
    <div class="agent-props">${a.deals} deals closed</div>
    <button class="agent-btn" onclick="event.stopPropagation();"><i class="fas fa-phone"></i> ${a.phone}</button>
  </div>`;
}

function renderProjectCard(p){
  return`
  <div class="project-card">
    <div class="project-img">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <span class="project-status ${p.status==='active'?'status-active':'status-soon'}">${p.status==='active'?'Now Selling':'Coming Soon'}</span>
    </div>
    <div class="project-body">
      <div class="project-name">${p.name}</div>
      <div class="project-dev">${p.developer}</div>
      <p style="font-size:13px;color:var(--muted);margin-top:8px">${p.desc}</p>
      <div class="project-footer">
        <span class="project-price">${p.price}</span>
        <span class="project-type">${p.type}</span>
      </div>
    </div>
  </div>`;
}

function renderNewsCard(n){
  return`
  <div class="news-card">
    <div class="news-img"><img src="${n.img}" alt="${n.title}" loading="lazy"></div>
    <div class="news-body">
      <div class="news-date"><i class="far fa-calendar"></i> ${n.date}</div>
      <div class="news-title">${n.title}</div>
      <p class="news-excerpt">${n.excerpt}</p>
    </div>
  </div>`;
}

function renderListings(){
  const featured=PROPERTIES.filter(p=>p.featured);
  return`
  <div class="page-banner"><div class="container"><h1>Browse Properties</h1><div class="breadcrumb"><a href="#" onclick="navigate('home');return false;">Home</a> / Properties for Sale</div></div></div>
  <div class="container listings-layout">
    <div class="filter-panel">
      <div class="filter-title">Filters <span class="filter-clear" onclick="navigate('listings')">Clear All</span></div>
      <div class="filter-group"><label>District</label><select><option>All Districts</option>${DISTRICTS.map(d=>`<option>${d.name}</option>`).join("")}</select></div>
      <div class="filter-group"><label>Property Type</label><select><option>All Types</option><option>House</option><option>Plot</option><option>Apartment</option><option>Commercial</option></select></div>
      <div class="filter-group"><label>Purpose</label><div class="filter-checks">
        <label><input type="checkbox" checked> For Sale</label>
        <label><input type="checkbox"> For Rent</label>
      </div></div>
      <div class="filter-group"><label>Price Range (PKR)</label>
        <div style="display:flex;gap:8px"><input type="text" placeholder="Min" style="width:50%"><input type="text" placeholder="Max" style="width:50%"></div>
      </div>
      <div class="filter-group"><label>Bedrooms</label>
        <div class="bed-btns">
          <button class="bed-btn active">Any</button>
          <button class="bed-btn">1</button>
          <button class="bed-btn">2</button>
          <button class="bed-btn">3</button>
          <button class="bed-btn">4</button>
          <button class="bed-btn">5+</button>
        </div>
      </div>
      <div class="filter-group"><label>Area (sqft)</label>
        <div style="display:flex;gap:8px"><input type="text" placeholder="Min" style="width:50%"><input type="text" placeholder="Max" style="width:50%"></div>
      </div>
      <div class="filter-group"><label>Amenities</label><div class="filter-checks">
        <label><input type="checkbox"> Parking</label>
        <label><input type="checkbox"> Garden</label>
        <label><input type="checkbox"> Security</label>
        <label><input type="checkbox"> Water Tank</label>
        <label><input type="checkbox"> Boundary Wall</label>
      </div></div>
      <button class="filter-apply"><i class="fas fa-search"></i> Apply Filters</button>
    </div>
    <div>
      <div class="results-bar">
        <div class="results-count">Showing <strong>${PROPERTIES.length} properties</strong> in Balochistan</div>
        <select style="padding:8px 12px;border:1px solid var(--border);border-radius:8px;font-size:13px;font-family:inherit"><option>Sort: Newest First</option><option>Price: Low to High</option><option>Price: High to Low</option><option>Area: Large to Small</option></select>
      </div>
      <div class="prop-grid">${PROPERTIES.map(renderPropertyCard).join("")}</div>
    </div>
  </div>`;
}

function renderDetail(){
  const p=PROPERTIES.find(x=>x.id===1);
  const agent=AGENTS.find(a=>a.id===p.agentId);
  const similar=PROPERTIES.filter(x=>x.id!==p.id&&x.district===p.district).slice(0,3);
  return`
  <div class="page-banner"><div class="container"><h1>Property Details</h1><div class="breadcrumb"><a href="#" onclick="navigate('home');return false;">Home</a> / <a href="#" onclick="navigate('listings');return false;">Properties</a> / ${p.title}</div></div></div>
  <div class="container detail-grid">
    <div class="detail-main">
      <section>
        <div class="detail-gallery">
          <img src="${p.images[currentGalleryIndex]}" alt="${p.title}" id="gallery-main">
          <div class="gallery-nav prev" onclick="changeGallery(-1)"><i class="fas fa-chevron-left"></i></div>
          <div class="gallery-nav next" onclick="changeGallery(1)"><i class="fas fa-chevron-right"></i></div>
          <span class="gallery-count"><i class="fas fa-camera"></i> ${currentGalleryIndex+1}/${p.images.length}</span>
        </div>
        <div class="gallery-thumbs">${p.images.map((img,i)=>`<img src="${img}" class="${i===currentGalleryIndex?'active':''}" onclick="currentGalleryIndex=${i};render();">`).join("")}</div>
      </section>

      <section>
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
          <div>
            <h1 class="detail-title">${p.title}</h1>
            <div class="detail-loc"><i class="fas fa-map-marker-alt"></i> ${p.address}, ${p.district}</div>
          </div>
          <div class="detail-price">${formatPrice(p.price)}</div>
        </div>
        <div class="key-features">
          ${p.type!=="plot"?`
          <div class="key-feature"><i class="fas fa-bed"></i><div class="val">${p.bedrooms}</div><div class="lbl">Bedrooms</div></div>
          <div class="key-feature"><i class="fas fa-bath"></i><div class="val">${p.bathrooms}</div><div class="lbl">Bathrooms</div></div>
          <div class="key-feature"><i class="fas fa-layer-group"></i><div class="val">${p.floors}</div><div class="lbl">Floors</div></div>
          <div class="key-feature"><i class="fas fa-car"></i><div class="val">${p.parking}</div><div class="lbl">Parking</div></div>`:''}
          <div class="key-feature"><i class="fas fa-ruler-combined"></i><div class="val">${p.area.toLocaleString()}</div><div class="lbl">${p.areaUnit}</div></div>
        </div>
      </section>

      <section>
        <h3 style="font-weight:700;margin-bottom:16px">Description</h3>
        <p class="detail-desc">${p.description}</p>
      </section>

      <section>
        <h3 style="font-weight:700;margin-bottom:16px">Features & Amenities</h3>
        <div class="detail-features">${p.features.map(f=>`<div class="detail-feature"><i class="fas fa-check-circle"></i> ${f}</div>`).join("")}</div>
      </section>

      <section>
        <h3 style="font-weight:700;margin-bottom:16px">Property Details</h3>
        <div class="detail-table">
          <div class="detail-row"><span class="lbl">Property Type</span><span class="val">${p.type.charAt(0).toUpperCase()+p.type.slice(1)}</span></div>
          <div class="detail-row"><span class="lbl">Purpose</span><span class="val">${p.purpose==="sale"?"For Sale":"For Rent"}</span></div>
          <div class="detail-row"><span class="lbl">Area</span><span class="val">${p.area.toLocaleString()} ${p.areaUnit}</span></div>
          <div class="detail-row"><span class="lbl">District</span><span class="val">${p.district}</span></div>
          ${p.yearBuilt?`<div class="detail-row"><span class="lbl">Year Built</span><span class="val">${p.yearBuilt}</span></div>`:''}
          <div class="detail-row"><span class="lbl">Listed</span><span class="val">2 Weeks Ago</span></div>
        </div>
      </section>
    </div>

    <div class="detail-sidebar">
      <div class="agent-box">
        <div class="agent-top">
          <div class="agent-avatar" style="width:56px;height:56px;font-size:20px;flex-shrink:0">${agent.avatar}</div>
          <div><h3>${agent.name}</h3><p>${agent.company}</p><div class="agent-rating" style="margin:4px 0 0;font-size:12px"><i class="fas fa-star"></i> ${agent.rating}</div></div>
        </div>
        <div class="agent-contact-num"><i class="fas fa-phone"></i> ${agent.phone}</div>
        <div class="agent-actions">
          <a class="wa-btn" href="https://wa.me/${agent.phone.replace(/[^0-9]/g,"")}" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a>
          <button class="call-btn"><i class="fas fa-phone"></i> Call Now</button>
          <button class="msg-btn"><i class="fas fa-envelope"></i> Send Message</button>
        </div>
      </div>
      ${similar.length?`
      <div class="similar-box">
        <h3>Similar Properties</h3>
        ${similar.map(s=>`
        <div class="similar-item" onclick="navigate('detail',{id:${s.id}})">
          <img src="${s.images[0]}" alt="${s.title}">
          <div><h4>${s.title}</h4><p>${formatPriceK(s.price)}</p></div>
        </div>`).join("")}
      </div>`:''}
    </div>
  </div>`;
}

function changeGallery(dir){
  const p=PROPERTIES[0];
  currentGalleryIndex=(currentGalleryIndex+dir+p.images.length)%p.images.length;
  render();
}

function renderPost(){
  return`
  <div class="page-banner"><div class="container"><h1>Post Your Property</h1><div class="breadcrumb"><a href="#" onclick="navigate('home');return false;">Home</a> / Post Property</div></div></div>
  <div class="container" style="padding:32px 0">
    <div class="form-card">
      <h2 style="font-weight:800;margin-bottom:4px">List Your Property</h2>
      <p style="color:var(--muted);font-size:14px;margin-bottom:28px">Fill in the details below to list your property on QDP.pk</p>
      <div class="form-grid">
        <div class="form-group"><label>Property Title *</label><input type="text" placeholder="e.g. 5 Marla House in Satellite Town"></div>
        <div class="form-group"><label>Property Type *</label><select><option value="">Select Type</option><option>House</option><option>Plot</option><option>Apartment</option><option>Commercial</option><option>Farmhouse</option></select></div>
        <div class="form-group"><label>Purpose *</label><select><option>For Sale</option><option>For Rent</option></select></div>
        <div class="form-group"><label>Price (PKR) *</label><input type="text" placeholder="e.g. 15000000"></div>
        <div class="form-group"><label>Area *</label><input type="text" placeholder="e.g. 3500"></div>
        <div class="form-group"><label>Area Unit</label><select><option>sqft</option><option>marla</option><option>kanal</option></select></div>
        <div class="form-group"><label>Bedrooms</label><select><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6+</option></select></div>
        <div class="form-group"><label>Bathrooms</label><select><option>0</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5+</option></select></div>
        <div class="form-group"><label>District *</label><select><option value="">Select District</option>${DISTRICTS.map(d=>`<option>${d.name}</option>`).join("")}</select></div>
        <div class="form-group"><label>Full Address *</label><input type="text" placeholder="e.g. Street 5, Satellite Town, Quetta"></div>
        <div class="form-group form-full"><label>Description *</label><textarea rows="5" placeholder="Describe your property in detail..."></textarea></div>
        <div class="form-group form-full"><label>Features (comma separated)</label><input type="text" placeholder="e.g. Car Parking, Water Tank, Boundary Wall"></div>
        <div class="form-group"><label>Your Name *</label><input type="text" placeholder="Full name"></div>
        <div class="form-group"><label>Phone Number *</label><input type="text" placeholder="+92-3XX-XXXXXXX"></div>
        <div class="form-group form-full"><label>Email</label><input type="email" placeholder="your@email.com"></div>
      </div>
      <button class="submit-btn" onclick="alert('Property submitted successfully! We will review and publish it shortly.');navigate('home');"><i class="fas fa-paper-plane"></i> Submit Property</button>
    </div>
  </div>`;
}

function renderAgents(){
  return`
  <div class="page-banner"><div class="container"><h1>Our Agents</h1><div class="breadcrumb"><a href="#" onclick="navigate('home');return false;">Home</a> / Agents</div></div></div>
  <div class="container" style="padding:32px 0">
    <div class="agent-grid">${AGENTS.map(a=>`
      <div class="agent-card">
        <div class="agent-avatar">${a.avatar}</div>
        <div class="agent-name">${a.name}</div>
        <div class="agent-co">${a.company}</div>
        <div class="agent-rating"><i class="fas fa-star"></i> ${a.rating} (${a.listings} listings)</div>
        <div class="agent-props">${a.deals} deals closed</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;justify-content:center;margin:12px 0">
          ${a.specialties.map(s=>`<span style="font-size:11px;padding:3px 8px;background:var(--bg);border-radius:4px">${s}</span>`).join("")}
        </div>
        <button class="agent-btn"><i class="fas fa-phone"></i> ${a.phone}</button>
      </div>`).join("")}</div>
  </div>`;
}

function renderProjects(){
  return`
  <div class="page-banner"><div class="container"><h1>Ongoing Projects</h1><div class="breadcrumb"><a href="#" onclick="navigate('home');return false;">Home</a> / Projects</div></div></div>
  <div class="container" style="padding:32px 0">
    <div class="project-grid">${PROJECTS.map(renderProjectCard).join("")}</div>
  </div>`;
}

function renderNewsPage(){
  return`
  <div class="page-banner"><div class="container"><h1>Real Estate News</h1><div class="breadcrumb"><a href="#" onclick="navigate('home');return false;">Home</a> / News</div></div></div>
  <div class="container" style="padding:32px 0">
    <div class="news-grid">${NEWS.map(renderNewsCard).join("")}</div>
  </div>`;
}

function renderFooter(){
  return`
  <div class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="logo" style="color:#fff"><div class="logo-icon"><i class="fas fa-building"></i></div>QDP<span style="color:#34e89e">.pk</span></div>
          <p>Quetta Digital Property is Balochistan's leading real estate portal, connecting buyers, sellers, and agents across the province. Find your dream property in Quetta, Gwadar, and beyond.</p>
          <div class="footer-social" style="margin-top:16px">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-youtube"></i></a>
          </div>
        </div>
        <div><h4>Quick Links</h4><ul>
          <li><a href="#" onclick="navigate('home');return false;">Home</a></li>
          <li><a href="#" onclick="navigate('listings');return false;">Properties</a></li>
          <li><a href="#" onclick="navigate('agents');return false;">Agents</a></li>
          <li><a href="#" onclick="navigate('projects');return false;">Projects</a></li>
          <li><a href="#" onclick="navigate('post');return false;">Post Property</a></li>
        </ul></div>
        <div><h4>Property Types</h4><ul>
          <li><a href="#">Houses for Sale</a></li>
          <li><a href="#">Plots for Sale</a></li>
          <li><a href="#">Houses for Rent</a></li>
          <li><a href="#">Commercial Properties</a></li>
          <li><a href="#">Farmhouses</a></li>
        </ul></div>
        <div><h4>Districts</h4><ul>
          ${DISTRICTS.map(d=>`<li><a href="#" onclick="navigate('listings',{district:'${d.name}'});return false;">${d.name}</a></li>`).join("")}
        </ul></div>
      </div>
      <div class="footer-bottom">
        <div>&copy; 2025 Quetta Digital Property. All rights reserved.</div>
        <div><a href="#">Privacy Policy</a> &nbsp;|&nbsp; <a href="#">Terms of Service</a> &nbsp;|&nbsp; <a href="#">Contact Us</a></div>
      </div>
    </div>
  </div>`;
}

function attachEvents(){
  document.querySelectorAll(".bed-btn").forEach(btn=>{
    btn.addEventListener("click",function(){
      this.parentElement.querySelectorAll(".bed-btn").forEach(b=>b.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  currentRoute="home";
  window.history.replaceState({route:"home"},"","/");
  render();
});
