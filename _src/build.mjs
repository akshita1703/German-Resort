import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..'); // site root
const DOMAIN = 'https://www.germanresort.in'; // TODO confirm domain

const icons = {
	'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
	'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
	'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
	'chevron-down': '<path d="M6 9l6 6 6-6"/>',
	check: '<path d="M20 6L9 17l-5-5"/>',
	close: '<path d="M18 6L6 18M6 6l12 12"/>',
	expand: '<path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6M8 8l-5-5M16 8l5-5M8 16l-5 5M16 16l5 5"/>',
	villa: '<path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6"/>',
	waves: '<path d="M2 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 13c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2M2 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>',
	slide: '<path d="M3 21c7 0 7-13 13-13h5M3 21h5M16 3v5M21 3v5M16 5h5"/>',
	music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
	temple: '<path d="M12 2l3 5H9zM7 7h10v3H7zM5 10h14M6 10v10M18 10v10M10 20v-5h4v5M3 20h18"/>',
	car: '<path d="M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5v5H3zM3 13h18"/><circle cx="7.5" cy="16" r="1.2"/><circle cx="16.5" cy="16" r="1.2"/>',
	leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-6 6-9 16-9 0 10-3 16-9 16zM4 21c4-6 8-9 12-11"/>',
	users: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6"/>',
	'eye-off': '<path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3 3.6M6.6 6.6C3.9 8.3 2 12 2 12s4 6 10 6a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
	ring: '<circle cx="12" cy="15" r="6"/><path d="M9 5l3-3 3 3-3 3z"/>',
	calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
	phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
	whatsapp: '<path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zM12 .2A11.8 11.8 0 0 0 1.9 18L.2 24l6.2-1.6A11.8 11.8 0 1 0 12 .2z"/>',
	mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/>',
	pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
	sparkle: '<path d="M12 3l1.9 5.8L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.2z"/>',
	utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>',
	plane: '<path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
	train: '<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M12 3v8M8 19l-2 3M18 22l-2-3M8 15h.01M16 15h.01"/>',
	city: '<rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
	clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
	play: '<path d="M7 4l13 8-13 8z"/>',
	instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
	facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
	youtube: '<path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49 49 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49 49 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="M10 15l5-3-5-3z"/>',
	spa: '<path d="M12 20c-4 0-8-3-8-8 3 0 6 1.5 8 4 2-2.5 5-4 8-4 0 5-4 8-8 8zM12 16c-1.5-2-2-4-2-6s1-4 2-6c1 2 2 4 2 6s-.5 4-2 6z"/>',
	dumbbell: '<path d="M6 6v12M18 6v12M3 9v6M21 9v6M6 12h12"/>',
	balloon: '<path d="M12 2a6 6 0 0 0-6 6c0 4 6 9 6 9s6-5 6-9a6 6 0 0 0-6-6zM12 17c0 2-2 3-1 5"/>',
	gamepad: '<rect x="2" y="6" width="20" height="12" rx="4"/><path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/>',
	star: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
	wifi: '<path d="M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M2 9.5a15 15 0 0 1 20 0M12 20h.01"/>',
	bolt: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',
	shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
	search: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',
	diya: '<path d="M12 2c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-3.5 3-5 4-8zM3 15h18M5 15c0 3 3 5 7 5s7-2 7-5"/>',
	bubbles: '<circle cx="8" cy="9" r="2"/><circle cx="15" cy="5" r="1.5"/><circle cx="14.5" cy="11" r="2.5"/><path d="M2 18c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 4-2"/>',
	glass: '<path d="M8 22h8M12 11v11M3 3h18l-9 8z"/>',
	bed: '<path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/>',
	mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8"/>',
	cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1M2 21h20M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01"/>',
	briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
	heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
	info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
	copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
	navigation: '<path d="M3 11l19-9-9 19-2-8z"/>',
	snow: '<path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1"/>',
	tv: '<rect x="2" y="7" width="20" height="15" rx="2"/><path d="M17 2l-5 5-5-5"/>',
	coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4zM6 2v2M10 2v2M14 2v2"/>',
	bath: '<path d="M9 6L6.5 3.5a1.5 1.5 0 0 0-1-.5C4.7 3 4 3.7 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5M2 12h20M7 19v2M17 19v2"/>',
	mountain: '<path d="M8 3l4 8 5-5 5 15H2z"/>',
	route: '<circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/>',
	crown: '<path d="M2 18h20M3 7l4 5 5-7 5 7 4-5-2 11H5z"/>',
	camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
	hammer: '<path d="M15 12l-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9M17.6 15L22 10.6M20.9 11.7l-6.6-6.6a6 6 0 0 0-4.2-1.7H7l2.7 2.4A3.6 3.6 0 0 1 11 8.5v1.1l2 2h2.4l2 1.9"/>',
	gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
	bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
	baby: '<circle cx="12" cy="7" r="4"/><path d="M5 22v-2a7 7 0 0 1 14 0v2M10 7h.01M14 7h.01"/>',
	paw: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="4" cy="8" r="2"/><path d="M8 14c0-2 2-4 4-4s4 2 4 4c0 1.5 2 2 2 4a3 3 0 0 1-3 3c-1 0-2-.5-3-.5s-2 .5-3 .5a3 3 0 0 1-3-3c0-2 2-2.5 2-4z"/>',
	wheelchair: '<circle cx="15" cy="4" r="2"/><path d="M13 7v6h5l3 6M13 10H9M9 12a6 6 0 1 0 7 7"/>',
	door: '<path d="M13 4h3a2 2 0 0 1 2 2v14M2 20h3M13 20h9M10 12v.01M13 4.6v16.2a1 1 0 0 1-1.2 1L5 20V5.6a2 2 0 0 1 1.5-1.9l4-1A2 2 0 0 1 13 4.6z"/>'
};
const sprite = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${Object.entries(icons).map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24">${v}</symbol>`).join('')}</defs></svg>`;
export const icon = (name, cls = '') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

const navTree = [
	{ key: 'about', label: 'About', href: 'about.html' },
	{ key: 'stay', label: 'Stay', children: [
		{ href: 'stay.html', label: 'Stay overview', sub: 'Rooms and villas at a glance' },
		{ href: 'stay.html#rooms', label: 'Rooms', sub: 'Spacious, city-beating rooms' },
		{ href: 'stay.html#villas', label: 'Private Pool Villas', sub: 'Phuket and Bali, closer to home' }
	] },
	{ key: 'weddings', label: 'Weddings', children: [
		{ href: 'weddings.html', label: 'Weddings overview', sub: 'One address for every function' },
		{ href: 'weddings.html#venues', label: 'Venues', sub: 'Banquets, lawn, mandap, Mehendi-Haldi' },
		{ href: 'weddings.html#packages', label: 'Wedding packages', sub: 'Stay, food and décor tiers' },
		{ href: 'weddings.html#plan', label: 'Plan your wedding', sub: 'Share your date and guest count' }
	] },
	{ key: 'experiences', label: 'Experiences', children: [
		{ href: 'experiences.html', label: 'Leisure & pool', sub: 'Slides, jacuzzi, night club' },
		{ href: 'dining.html', label: 'Dining', sub: 'Multi-cuisine, veg and Jain' },
		{ href: 'events.html', label: 'Corporate & social', sub: 'Birthdays, offsites, conferences' }
	] },
	{ key: 'gallery', label: 'Gallery', href: 'gallery.html' },
	{ key: 'visit', label: 'Visit', children: [
		{ href: 'location.html', label: 'Location & getting here', sub: 'Map, distances, parking' },
		{ href: 'offers.html', label: 'Offers & updates', sub: 'Early-bird dates, progress news' },
		{ href: 'faqs.html', label: 'FAQs', sub: 'Policies and practical answers' },
		{ href: 'contact.html', label: 'Contact & site visit', sub: 'Book a visit, call or WhatsApp' }
	] }
];

function header(page) {
	const items = navTree.map((item) => {
		const active = item.key === page.nav ? ' active' : '';
		if (!item.children) {
			return `<div class="nav-item${active}"><a class="nav-link" href="${item.href}"${item.href === page.file ? ' aria-current="page"' : ''}>${item.label}</a></div>`;
		}
		const links = item.children.map((c) => `<a href="${c.href}"${c.href === page.file ? ' aria-current="page"' : ''}>${c.label}<small>${c.sub}</small></a>`).join('');
		return `<div class="nav-item${active}"><button class="nav-link" type="button" aria-expanded="false">${item.label} ${icon('chevron-down')}</button><div class="dropdown">${links}</div></div>`;
	}).join('\n\t\t\t\t');
	return `<a class="skip-link" href="#main">Skip to content</a>
	<div class="announce"><span class="dot" aria-hidden="true"></span>Pre-launch: wedding dates for the opening season are now open for enquiry. <a href="offers.html#early-bird">Block your date early</a></div>
	<header class="header${page.solid ? ' always-solid' : ''}">
		<div class="wrap header-inner">
			<a class="brand" href="index.html" aria-label="German Resort, Ranchi: home">
				<span class="brand-mark" aria-hidden="true">G</span>
				<span class="brand-name">German Resort<small>Ranchi · Jharkhand</small></span>
			</a>
			<button class="menu-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav"><span></span></button>
			<nav class="nav" id="primary-nav" aria-label="Main">
				${items}
				<button class="btn btn-sm" type="button" data-enquire>Enquire now</button>
			</nav>
		</div>
	</header>`;
}

const footer = `<footer class="footer">
		<div class="wrap">
			<div class="footer-top">
				<div>
					<a class="brand" href="index.html" aria-label="German Resort home"><span class="brand-mark" aria-hidden="true">G</span><span class="brand-name">German Resort<small>Ranchi · Jharkhand</small></span></a>
					<p>Jharkhand's grand destination resort for weddings and vacations. Opening soon in Ranchi.</p>
					<div class="socials">
						<a data-link="instagram" href="#" aria-label="Instagram">${icon('instagram')}</a>
						<a data-link="facebook" href="#" aria-label="Facebook">${icon('facebook')}</a>
						<a data-link="youtube" href="#" aria-label="YouTube">${icon('youtube')}</a>
						<a data-link="wa" href="#" aria-label="WhatsApp">${icon('whatsapp')}</a>
					</div>
				</div>
				<div>
					<h4>Explore</h4>
					<ul>
						<li><a href="about.html">About the resort</a></li>
						<li><a href="stay.html">Rooms &amp; villas</a></li>
						<li><a href="experiences.html">Leisure &amp; pool</a></li>
						<li><a href="dining.html">Dining</a></li>
						<li><a href="gallery.html">Gallery</a></li>
					</ul>
				</div>
				<div>
					<h4>Celebrate</h4>
					<ul>
						<li><a href="weddings.html">Weddings</a></li>
						<li><a href="weddings.html#venues">Venues</a></li>
						<li><a href="weddings.html#packages">Wedding packages</a></li>
						<li><a href="events.html">Corporate &amp; social</a></li>
						<li><a href="offers.html">Offers &amp; updates</a></li>
					</ul>
				</div>
				<div>
					<h4>Visit</h4>
					<ul class="footer-contact">
						<li>${icon('phone')}<a data-link="tel" href="#" data-site="phone"></a></li>
						<li>${icon('mail')}<a data-link="mail" href="#" data-site="email"></a></li>
						<li>${icon('pin')}<a href="location.html">Location &amp; directions</a></li>
					</ul>
					<h4 style="margin-top:26px">Construction updates</h4>
					<form class="newsletter" novalidate><label class="sr-only" for="nl-email">Email address</label><input id="nl-email" type="email" placeholder="Your email" required><button class="btn" type="submit" aria-label="Subscribe">${icon('arrow-right')}</button></form>
					<p class="newsletter-msg" aria-live="polite"></p>
				</div>
			</div>
			<div class="footer-bottom">
				<span>&copy; <span data-year></span> German Resort, Ranchi. All rights reserved.</span>
				<nav aria-label="Legal"><a href="faqs.html">FAQs</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="cancellation.html">Cancellation &amp; refunds</a><a href="sitemap.html">Sitemap</a></nav>
			</div>
		</div>
	</footer>`;

const globals = `<a class="fab-whatsapp" data-link="wa" href="#" aria-label="Chat on WhatsApp">${icon('whatsapp')}<span class="bubble">Chat with us on WhatsApp</span></a>
	<button class="enquire-tab" type="button" data-enquire>${icon('sparkle')} Enquire now</button>
	<button class="back-top" type="button" aria-label="Back to top">${icon('arrow-up')}</button>
	<nav class="mobile-bar" aria-label="Quick contact">
		<a data-link="tel" href="#">${icon('phone')}Call</a>
		<a class="wa" data-link="wa" href="#">${icon('whatsapp')}WhatsApp</a>
		<button type="button" data-enquire>${icon('sparkle')}Enquire now</button>
	</nav>
	<div class="modal" id="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-hidden="true">
		<div class="modal-box">
			<div class="modal-side"><img src="assets/images/wedding-stage.jpg" alt="" loading="lazy"><h3>Celebrate, stay &amp; unwind</h3><p>Our team replies within one working day. Prefer to talk? Call or WhatsApp us.</p></div>
			<div class="modal-main">
				<button class="modal-close" type="button" aria-label="Close enquiry form">${icon('close')}</button>
				<p class="eyebrow">Quick enquiry</p>
				<h2 id="modal-title">How can we help?</h2>
				<form class="form js-form" data-form="quick">
					<div class="field"><label for="q-name">Full name <span class="req">*</span></label><input id="q-name" name="name" autocomplete="name" required><span class="error">Please tell us your name.</span></div>
					<div class="field"><label for="q-phone">Phone / WhatsApp <span class="req">*</span></label><input id="q-phone" name="phone" type="tel" autocomplete="tel" placeholder="+91" required><span class="error">Please enter a valid phone number.</span></div>
					<div class="field"><label for="q-interest">I'm interested in</label><select id="q-interest" name="interest"><option value="wedding">Wedding</option><option value="stay">Stay: room or villa</option><option value="event">Corporate or social event</option><option value="visit">Site visit</option><option value="other">Something else</option></select></div>
					<div class="field"><label for="q-date">Preferred date <span class="hint">(optional)</span></label><input id="q-date" name="date" type="date"></div>
					<div class="field"><label for="q-msg">Message <span class="hint">(optional)</span></label><textarea id="q-msg" name="message" rows="3" style="min-height:90px"></textarea></div>
					<input type="text" name="website" tabindex="-1" autocomplete="off" class="sr-only" aria-hidden="true">
					<button class="btn btn-block" type="submit">Send enquiry ${icon('arrow-right')}</button>
					<p class="form-status" role="status"></p>
				</form>
			</div>
		</div>
	</div>
	<div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer">
		<img src="" alt="">
		<p class="lb-cap"></p>
		<button class="lb-close" type="button" aria-label="Close">${icon('close')}</button>
		<button class="lb-prev" type="button" aria-label="Previous image">${icon('arrow-left')}</button>
		<button class="lb-next" type="button" aria-label="Next image">${icon('arrow-right')}</button>
	</div>
	<div class="toast" role="status" aria-live="polite"></div>`;

function pageHero(h, crumb) {
	if (!h) return '';
	const crumbs = crumb ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span>${crumb.parent ? `<a href="${crumb.parent[1]}">${crumb.parent[0]}</a><span aria-hidden="true">/</span>` : ''}<span aria-current="page">${crumb.label}</span></nav>` : '';
	return `<section class="page-hero${h.compact ? ' compact' : ''}">
			<img src="assets/images/${h.img}" alt="${h.alt || ''}" fetchpriority="high">
			<div class="wrap">
				${crumbs}
				<p class="eyebrow">${h.eyebrow}</p>
				<h1>${h.h1}</h1>
				${h.text ? `<p>${h.text}</p>` : ''}
			</div>
		</section>`;
}

function layout(page, body) {
	const url = `${DOMAIN}/${page.file === 'index.html' ? '' : page.file}`;
	const ogImg = `${DOMAIN}/assets/images/${page.ogImage || page.hero?.img || 'villa-modern.jpg'}`;
	const schema = page.schema ? `\n\t<script type="application/ld+json">${JSON.stringify(page.schema)}</script>` : '';
	return `<!doctype html>
<html lang="en" class="no-js">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${page.title}</title>
	<meta name="description" content="${page.desc}">
	<meta name="theme-color" content="#14352c">
	${page.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
	<meta property="og:type" content="website">
	<meta property="og:site_name" content="German Resort, Ranchi">
	<meta property="og:title" content="${page.title}">
	<meta property="og:description" content="${page.desc}">
	<meta property="og:image" content="${ogImg}">
	<meta property="og:url" content="${url}">
	<meta name="twitter:card" content="summary_large_image">
	<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='31' fill='%2314352c'/%3E%3Ccircle cx='32' cy='32' r='26' fill='none' stroke='%23c29b57' stroke-width='1.5'/%3E%3Ctext x='32' y='43' font-family='Georgia,serif' font-size='30' fill='%23e2c48f' text-anchor='middle'%3EG%3C/text%3E%3C/svg%3E">
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="css/styles.css">
	<!-- Analytics: paste Google Analytics 4 and Meta Pixel snippets here once the client shares access (form item 50). -->${schema}
</head>
<body${page.bodyClass ? ` class="${page.bodyClass}"` : ''}>
	${sprite}
	${page.bare ? '' : header(page)}
	<main id="main">
		${pageHero(page.hero, page.crumb)}
${body}
	</main>
	${page.bare ? '' : footer}
	${globals}
	<script src="js/main.js" defer></script>
</body>
</html>
`;
}

const pagesDir = join(here, 'pages');
for (const name of readdirSync(pagesDir).filter((f) => f.endsWith('.html'))) {
	const raw = readFileSync(join(pagesDir, name), 'utf8');
	const m = raw.match(/^<!--(\{[\s\S]*?\})-->\n?/);
	const page = { file: name, ...(m ? JSON.parse(m[1]) : {}) };
	let body = m ? raw.slice(m[0].length) : raw;
	body = body.replace(/\{\{icon:([\w-]+)\}\}/g, (_, n) => {
		if (!icons[n]) throw new Error(`Unknown icon ${n} in ${name}`);
		return icon(n);
	});
	writeFileSync(join(OUT, name), layout(page, body));
	console.log('built', name);
}
