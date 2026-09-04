function getHeader(){
  const page=getActivePage();
  const isHome=page==="home"||page==="";
  return`
  <div class="topbar">
    <div class="container">
      <div class="topbar-left">
        <a href="tel:+92-81-1234567"><i class="fas fa-phone-alt"></i> +92-81-1234567</a>
        <a href="mailto:info@qdp.pk"><i class="fas fa-envelope"></i> info@qdp.pk</a>
        <span><i class="fas fa-map-marker-alt"></i> Satellite Town, Quetta</span>
      </div>
      <div class="topbar-right">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-youtube"></i></a>
        <a href="#" style="margin-left:8px;border-left:1px solid #444;padding-left:12px"><i class="fas fa-globe"></i> English</a>
      </div>
    </div>
  </div>
  <div class="header">
    <div class="container">
      <a class="logo" href="index.html">
        <div class="logo-icon"><i class="fas fa-building"></i></div>
        QDP<span>.pk</span>
      </a>
      <div class="nav">
        <a class="${page==='listings'?'active':''}" href="listings.html">Buy</a>
        <a class="${page==='rent'?'active':''}" href="listings.html?purpose=rent">Rent</a>
        <a class="${page==='projects'?'active':''}" href="projects.html">New Projects</a>
        <a class="${page==='listings'&&new URLSearchParams(location.search).get('type')==='plot'?'active':''}" href="listings.html?type=plot">Plot Files</a>
        <a class="${page==='listings'&&new URLSearchParams(location.search).get('type')==='commercial'?'active':''}" href="listings.html?type=commercial">Commercial</a>
        <a class="${page==='agents'?'active':''}" href="agents.html">Agents</a>
        <a class="${page==='news'?'active':''}" href="news.html">News</a>
      </div>
      <div class="header-actions">
        <button class="btn-post" onclick="location.href='post-property.html'"><i class="fas fa-plus"></i> Post Ad</button>
        <button class="btn-login"><i class="fas fa-user"></i> Login</button>
        <button class="hamburger" onclick="openMobile()"><i class="fas fa-bars"></i></button>
      </div>
    </div>
  </div>`;
}

function getFooter(){
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
          <li><a href="index.html">Home</a></li>
          <li><a href="listings.html">Properties</a></li>
          <li><a href="agents.html">Agents</a></li>
          <li><a href="projects.html">Projects</a></li>
          <li><a href="post-property.html">Post Property</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="contact.html">Contact Us</a></li>
        </ul></div>
        <div><h4>Property Types</h4><ul>
          <li><a href="listings.html?type=house">Houses for Sale</a></li>
          <li><a href="listings.html?type=plot">Plots for Sale</a></li>
          <li><a href="listings.html?purpose=rent">Houses for Rent</a></li>
          <li><a href="listings.html?type=commercial">Commercial Properties</a></li>
          <li><a href="listings.html?type=farmhouse">Farmhouses</a></li>
        </ul></div>
        <div><h4>Districts</h4><ul>
          <li><a href="listings.html?district=Quetta">Quetta</a></li>
          <li><a href="listings.html?district=Gwadar">Gwadar</a></li>
          <li><a href="listings.html?district=Kech">Kech</a></li>
          <li><a href="listings.html?district=Khuzdar">Khuzdar</a></li>
          <li><a href="listings.html?district=Chaman">Chaman</a></li>
          <li><a href="listings.html?district=Zhob">Zhob</a></li>
        </ul></div>
      </div>
      <div class="footer-bottom">
        <div>&copy; 2025 Quetta Digital Property. All rights reserved.</div>
        <div><a href="#">Privacy Policy</a> &nbsp;|&nbsp; <a href="#">Terms of Service</a> &nbsp;|&nbsp; <a href="contact.html">Contact Us</a></div>
      </div>
    </div>
  </div>`;
}

function getMobileMenu(){
  return`<div class="mobile-menu-overlay" id="mobileOverlay" onclick="closeMobile()"></div>
  <div class="mobile-menu" id="mobileMenu">
    <div class="mobile-header"><div class="logo" style="color:#fff;font-size:17px"><div class="logo-icon" style="width:32px;height:32px;font-size:13px;border-radius:8px"><i class="fas fa-building"></i></div>QDP<span style="color:#34e89e">.pk</span></div><button onclick="closeMobile()" style="background:none;color:#fff;font-size:22px;padding:4px"><i class="fas fa-times"></i></button></div>
    <div class="mobile-nav">
      <a href="index.html"><i class="fas fa-home"></i> Home</a>
      <a href="listings.html"><i class="fas fa-search-dollar"></i> Buy Property</a>
      <a href="listings.html?purpose=rent"><i class="fas fa-key"></i> Rent Property</a>
      <a href="listings.html?type=plot"><i class="fas fa-map"></i> Plot Files</a>
      <a href="listings.html?type=commercial"><i class="fas fa-store"></i> Commercial</a>
      <a href="projects.html"><i class="fas fa-building"></i> New Projects</a>
      <a href="agents.html"><i class="fas fa-users"></i> Agents</a>
      <a href="news.html"><i class="fas fa-newspaper"></i> News</a>
      <a href="about.html"><i class="fas fa-info-circle"></i> About</a>
      <a href="contact.html"><i class="fas fa-headset"></i> Contact</a>
      <div style="border-top:1px solid rgba(255,255,255,.08);margin:8px 0"></div>
      <a href="post-property.html" style="color:#34e89e"><i class="fas fa-plus-circle"></i> Post Property</a>
    </div>
  </div>`;
}

function propertyCard(p){
  const badge=p.featured?"badge-featured":p.purpose==="rent"?"badge-rent":p.type==="plot"?"badge-new":"";
  const badgeText=p.featured?"Featured":p.purpose==="rent"?"For Rent":p.type==="plot"?"Plot":"";
  return`
  <a href="property.html?id=${p.id}" class="prop-card" style="text-decoration:none;color:inherit">
    <div class="prop-img">
      <img src="${p.images[0]}" alt="${p.title}" loading="lazy">
      ${badge?`<span class="prop-badge ${badge}">${badgeText}</span>`:''}
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
  </a>`;
}

function agentCard(a){
  return`
  <a href="agents.html?id=${a.id}" class="agent-card" style="text-decoration:none;color:inherit">
    <div class="agent-avatar">${a.avatar}</div>
    <div class="agent-name">${a.name}</div>
    <div class="agent-co">${a.company}</div>
    <div class="agent-rating"><i class="fas fa-star"></i> ${a.rating} (${a.listings} listings)</div>
    <div class="agent-props">${a.deals} deals closed</div>
    <div class="agent-btn-wrap"><button class="agent-btn" onclick="event.preventDefault();event.stopPropagation();"><i class="fas fa-phone"></i> Contact</button></div>
  </a>`;
}

function projectCard(p){
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

function newsCard(n){
  return`
  <a href="news.html?id=${n.id}" class="news-card" style="text-decoration:none;color:inherit">
    <div class="news-img"><img src="${n.img}" alt="${n.title}" loading="lazy"></div>
    <div class="news-body">
      <div class="news-date"><i class="far fa-calendar"></i> ${n.date}</div>
      <div class="news-title">${n.title}</div>
      <p class="news-excerpt">${n.excerpt}</p>
    </div>
  </a>`;
}

function districtCard(d){
  return`
  <a href="listings.html?district=${d.name}" class="dist-card" style="text-decoration:none;color:inherit">
    <img src="${d.cover}" alt="${d.name}" loading="lazy">
    <div class="dist-overlay">
      <h3>${d.name}</h3>
      <p>${d.properties} Properties</p>
    </div>
  </a>`;
}

function initHeader(){
  const h=document.getElementById("header-placeholder");
  if(h)h.innerHTML=getHeader()+getMobileMenu();
  const f=document.getElementById("footer-placeholder");
  if(f)f.innerHTML=getFooter();
}
function openMobile(){document.getElementById("mobileMenu").classList.add("show");document.getElementById("mobileOverlay").classList.add("show")}
function closeMobile(){document.getElementById("mobileMenu").classList.remove("show");document.getElementById("mobileOverlay").classList.remove("show")}
