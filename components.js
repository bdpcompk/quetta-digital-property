function getHeader(activePage){
  const p=activePage||getActivePage();
  const isActive=(name)=>p===name?'active':'';
  return`
  <header class="header">
    <div class="header-inner">
      <a class="logo" href="index.html">
        <div class="logo-icon"><i class="fas fa-building"></i></div>
        <div class="logo-text">Balochistan Property Portal<small>Balochistan's Trusted Property Marketplace</small></div>
      </a>
      <nav class="nav">
        <a class="${isActive('home')}" href="index.html">Home</a>
        <a class="${isActive('listings')}" href="listings.html">Buy</a>
        <a class="${isActive('rent')}" href="listings.html?purpose=rent">Rent</a>
        <a class="${isActive('sell')}" href="sell.html">Sell</a>
        <a class="${isActive('agents')}" href="agents.html">Agents</a>
        <a class="${isActive('qda')}" href="qda.html">QDA Approved Schemes<span class="badge">New</span></a>
        <a class="${isActive('projects')}" href="projects.html">New Projects</a>
        <a class="${isActive('areas')}" href="areas.html">Areas</a>
        <a class="${isActive('guides')}" href="guides.html">Guides</a>
        <a class="${isActive('contact')}" href="contact.html">Contact</a>
      </nav>
      <div class="header-right">
        <button class="btn-login">Login</button>
        <button class="btn-signup">Sign Up</button>
        <button class="hamburger" onclick="openMobile()"><i class="fas fa-bars"></i></button>
      </div>
    </div>
  </header>
  <div class="mobile-overlay" id="mOverlay" onclick="closeMobile()"></div>
  <div class="mobile-menu" id="mMenu">
    <div class="mobile-head"><span>Menu</span><button onclick="closeMobile()"><i class="fas fa-times"></i></button></div>
    <div class="mobile-links">
      <a href="index.html">Home</a>
      <a href="listings.html">Buy</a>
      <a href="listings.html?purpose=rent">Rent</a>
      <a href="sell.html">Sell</a>
      <a href="agents.html">Agents</a>
      <a href="qda.html">QDA Approved Schemes</a>
      <a href="projects.html">New Projects</a>
      <a href="areas.html">Areas</a>
      <a href="guides.html">Guides</a>
      <a href="contact.html">Contact</a>
      <a href="listings.html" style="color:var(--green)"><i class="fas fa-plus-circle"></i> Post Property</a>
    </div>
  </div>`;
}

function getFooter(){
  return`
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo" href="index.html">
            <div class="logo-icon"><i class="fas fa-building"></i></div>
            <div class="logo-text" style="color:#fff">Balochistan Property Portal<small style="color:rgba(255,255,255,.5)">Your Trusted Property Marketplace</small></div>
          </a>
          <p>Pakistan's most trusted property portal for buying, renting and selling properties across all districts of Balochistan.</p>
          <div class="footer-social">
            <a href="#"><i class="fab fa-facebook-f"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-youtube"></i></a>
            <a href="#"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="listings.html">Buy</a></li>
            <li><a href="listings.html?purpose=rent">Rent</a></li>
            <li><a href="sell.html">Sell</a></li>
            <li><a href="agents.html">Agents</a></li>
          </ul>
        </div>
        <div>
          <h4>Resources</h4>
          <ul>
            <li><a href="projects.html">New Projects</a></li>
            <li><a href="areas.html">Areas & Locations</a></li>
            <li><a href="guides.html">Property Guides</a></li>
            <li><a href="guides.html">Blog</a></li>
            <li><a href="contact.html">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4>Our Coverage</h4>
          <ul>
            <li><a href="areas.html">All Districts (36)</a></li>
            <li><a href="listings.html?district=Quetta">Quetta</a></li>
            <li><a href="listings.html?district=Gwadar">Gwadar</a></li>
            <li><a href="listings.html?district=Turbat">Turbat</a></li>
            <li><a href="listings.html?district=Khuzdar">Khuzdar</a></li>
            <li><a href="areas.html">View All Districts →</a></li>
          </ul>
        </div>
        <div>
          <h4>Download Our App</h4>
          <div class="footer-apps">
            <a href="#" class="app-btn"><i class="fab fa-google-play"></i><div><span style="font-size:9px;opacity:.6">GET IT ON</span><br><strong style="font-size:13px">Google Play</strong></div></a>
            <a href="#" class="app-btn"><i class="fab fa-apple"></i><div><span style="font-size:9px;opacity:.6">Download on the</span><br><strong style="font-size:13px">App Store</strong></div></a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div>&copy; 2025 Balochistan Property Portal. All rights reserved.</div>
        <div>
          <a href="#">Terms & Conditions</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Sitemap</a>
        </div>
        <div class="footer-tagline">Together for a Stronger Balochistan</div>
      </div>
    </div>
  </footer>`;
}

function propCard(p){
  return`
  <div class="prop-card" onclick="location.href='property.html?id=${p.id}'">
    <div class="prop-img">
      <img src="${p.img}" alt="${p.title}" loading="lazy">
      ${p.featured?'<span class="prop-badge badge-featured">Featured</span>':''}
      ${p.verified&&!p.featured?'<span class="prop-badge badge-verified">✓ Verified</span>':''}
      ${p.purpose==="For Rent"&&!p.featured&&!p.verified?'<span class="prop-badge badge-rent">For Rent</span>':''}
      <div class="prop-heart" onclick="event.stopPropagation();this.classList.toggle('liked')"><i class="far fa-heart"></i></div>
      <span class="prop-sale">${p.purpose}</span>
    </div>
    <div class="prop-body">
      <div class="prop-price">${p.priceText}</div>
      <div class="prop-title">${p.title}</div>
      <div class="prop-loc"><i class="fas fa-map-marker-alt"></i> ${p.address}</div>
      <div class="prop-specs">
        ${p.beds?`<span><i class="fas fa-bed"></i> ${p.beds} Bed</span>`:''}
        ${p.baths?`<span><i class="fas fa-bath"></i> ${p.baths} Bath</span>`:''}
        <span><i class="fas fa-ruler-combined"></i> ${p.area}</span>
      </div>
      <div class="prop-agent">
        <div class="prop-agent-avatar">${p.agentAvatar}</div>
        <span class="prop-agent-name">${p.agent}</span>
        ${p.verified?'<span class="prop-agent-badge"><i class="fas fa-check-circle"></i> Verified Agent</span>':''}
      </div>
    </div>
  </div>`;
}

function initShell(activePage){
  document.getElementById("header").innerHTML=getHeader(activePage);
  document.getElementById("footer").innerHTML=getFooter();
}
function openMobile(){document.getElementById("mMenu").classList.add("show");document.getElementById("mOverlay").classList.add("show")}
function closeMobile(){document.getElementById("mMenu").classList.remove("show");document.getElementById("mOverlay").classList.remove("show")}
