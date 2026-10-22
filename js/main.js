/* ==========================================================================
   German Resort, Ranchi — site behaviour
   Edit SITE below once the client confirms contact details. Every phone,
   WhatsApp, email and map link on the site is filled from here.
   ========================================================================== */
const SITE = {
	name: 'German Resort',
	phone: '+91 00000 00000',          // TODO: client to confirm (form item 48)
	whatsapp: '910000000000',          // TODO: digits only, with country code (form item 47)
	email: 'enquiry@germanresort.in',  // TODO: client to confirm
	address: '1st Floor, Holding No 470/Z52/A, Nirla Maidan, Ratu Road, Ranchi, Jharkhand 834001',
	mapQuery: 'Ratu Road, Ranchi, Jharkhand 834001', // TODO: replace with resort Google Maps pin
	instagram: '#', facebook: '#', youtube: '#',
	// Set to a Formspree / Google Apps Script / CRM URL to receive enquiries.
	// While empty, submissions are stored in this browser (localStorage) for demo.
	formEndpoint: '',
	openingDate: '' // e.g. '2027-03-01' — shows a live countdown when set
};

document.documentElement.classList.remove('no-js');
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const storage = {
	get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
	set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ } }
};

/* ---------- Contact details from SITE ---------- */
const waLink = (text) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text || `Hello ${SITE.name}, I'd like to know more.`)}`;
$$('[data-site]').forEach((el) => { el.textContent = SITE[el.dataset.site]; });
$$('[data-link="tel"]').forEach((el) => { el.href = `tel:${SITE.phone.replace(/\s/g, '')}`; });
$$('[data-link="mail"]').forEach((el) => { el.href = `mailto:${SITE.email}`; });
$$('[data-link="wa"]').forEach((el) => { el.href = waLink(el.dataset.waText); el.target = '_blank'; el.rel = 'noopener'; });
$$('[data-link="map"]').forEach((el) => { el.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapQuery)}`; el.target = '_blank'; el.rel = 'noopener'; });
$$('[data-link="directions"]').forEach((el) => { el.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(SITE.mapQuery)}`; el.target = '_blank'; el.rel = 'noopener'; });
$$('[data-link="instagram"],[data-link="facebook"],[data-link="youtube"]').forEach((el) => { el.href = SITE[el.dataset.link]; });
$$('iframe[data-map]').forEach((el) => { el.src = `https://maps.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&z=13&output=embed`; });
$$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

/* ---------- Toast ---------- */
const toast = $('.toast');
let toastTimer;
function showToast(message) {
	if (!toast) return;
	toast.textContent = message;
	toast.classList.add('show');
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ---------- Header & navigation ---------- */
const header = $('.header');
const menuToggle = $('.menu-toggle');
const nav = $('#primary-nav');
const mobileNav = window.matchMedia('(max-width: 1060px)');

function setMenu(open) {
	menuToggle.setAttribute('aria-expanded', String(open));
	menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
	nav.classList.toggle('open', open);
	document.body.classList.toggle('lock', open);
	header.classList.toggle('solid', open || window.scrollY > 40);
}
menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
$$('.nav-item > button.nav-link').forEach((btn) => {
	btn.addEventListener('click', () => {
		const item = btn.parentElement;
		const open = !item.classList.contains('open');
		$$('.nav-item.open').forEach((other) => { if (other !== item) { other.classList.remove('open'); $('button', other)?.setAttribute('aria-expanded', 'false'); } });
		item.classList.toggle('open', open);
		btn.setAttribute('aria-expanded', String(open));
	});
});
document.addEventListener('click', (e) => {
	if (!mobileNav.matches && !e.target.closest('.nav-item')) $$('.nav-item.open').forEach((i) => i.classList.remove('open'));
});
nav?.addEventListener('click', (e) => { if (e.target.closest('a') && mobileNav.matches) setMenu(false); });

const onScroll = () => {
	const y = window.scrollY;
	header?.classList.toggle('solid', y > 40 || nav?.classList.contains('open'));
	$('.back-top')?.classList.toggle('visible', y > 700);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
$('.back-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Reveal on scroll & counters ---------- */
const revealObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) return;
		entry.target.classList.add('in');
		revealObserver.unobserve(entry.target);
	});
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
$$('.reveal').forEach((el) => revealObserver.observe(el));

const countObserver = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		if (!entry.isIntersecting) return;
		const el = entry.target;
		const target = Number(el.dataset.count);
		const suffix = el.dataset.suffix || '';
		const start = performance.now();
		const tick = (now) => {
			const p = Math.min((now - start) / 1600, 1);
			el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-IN') + suffix;
			if (p < 1) requestAnimationFrame(tick);
		};
		requestAnimationFrame(tick);
		countObserver.unobserve(el);
	});
}, { threshold: 0.5 });
$$('[data-count]').forEach((el) => countObserver.observe(el));

/* ---------- Hero slideshow ---------- */
const hero = $('[data-hero]');
if (hero) {
	const slides = $$('.hero-slide', hero);
	const dots = $$('.hero-dots button', hero);
	let current = 0;
	let timer;
	const go = (i) => {
		slides[current].classList.remove('active');
		dots[current]?.classList.remove('active');
		current = (i + slides.length) % slides.length;
		slides[current].classList.add('active');
		dots[current]?.classList.add('active');
	};
	const play = () => { clearInterval(timer); timer = setInterval(() => go(current + 1), 6500); };
	dots.forEach((dot, i) => dot.addEventListener('click', () => { go(i); play(); }));
	document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(timer) : play()));
	play();
}

/* ---------- Tabs ---------- */
$$('[role="tablist"]').forEach((list) => {
	const tabs = $$('[role="tab"]', list);
	const select = (tab) => {
		tabs.forEach((t) => {
			const on = t === tab;
			t.setAttribute('aria-selected', String(on));
			t.tabIndex = on ? 0 : -1;
			document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
		});
	};
	tabs.forEach((tab, i) => {
		tab.addEventListener('click', () => select(tab));
		tab.addEventListener('keydown', (e) => {
			if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
			const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
			next.focus();
			select(next);
		});
	});
});

/* ---------- Horizontal sliders ---------- */
$$('[data-slider]').forEach((slider) => {
	const track = $('.slider-track', slider);
	const bar = $('.slider-progress span', slider);
	const step = () => track.firstElementChild.getBoundingClientRect().width + 24;
	$('[data-prev]', slider)?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
	$('[data-next]', slider)?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
	const update = () => {
		if (!bar) return;
		const max = track.scrollWidth - track.clientWidth;
		const width = (track.clientWidth / track.scrollWidth) * 100;
		bar.style.width = `${width}%`;
		bar.style.left = `${max > 0 ? (track.scrollLeft / max) * (100 - width) : 0}%`;
	};
	track.addEventListener('scroll', update, { passive: true });
	window.addEventListener('resize', update);
	update();
});

/* ---------- Room image galleries ---------- */
$$('[data-room-gallery]').forEach((gallery) => {
	const images = $$('img', gallery);
	const count = $('.g-count', gallery);
	let i = 0;
	const show = (n) => {
		images[i].classList.remove('active');
		i = (n + images.length) % images.length;
		images[i].classList.add('active');
		if (count) count.textContent = `${i + 1} / ${images.length}`;
	};
	$('[data-prev]', gallery)?.addEventListener('click', () => show(i - 1));
	$('[data-next]', gallery)?.addEventListener('click', () => show(i + 1));
	show(0);
});

/* ---------- Lightbox ---------- */
const lightbox = $('.lightbox');
let lbItems = [];
let lbIndex = 0;
let lastFocus;
function lbRender() {
	const item = lbItems[lbIndex];
	const img = item.tagName === 'IMG' ? item : $('img', item);
	const lbImg = $('img', lightbox);
	lbImg.src = item.dataset.full || img.currentSrc || img.src;
	lbImg.alt = img.alt;
	$('.lb-cap', lightbox).innerHTML = `${item.dataset.caption || img.alt}<span>${lbIndex + 1} / ${lbItems.length}</span>`;
}
function lbOpen(items, index) {
	lbItems = items;
	lbIndex = index;
	lastFocus = document.activeElement;
	lbRender();
	lightbox.classList.add('open');
	document.body.classList.add('lock');
	$('.lb-close', lightbox).focus();
}
function lbClose() {
	lightbox.classList.remove('open');
	document.body.classList.remove('lock');
	lastFocus?.focus();
}
const lbStep = (d) => { lbIndex = (lbIndex + d + lbItems.length) % lbItems.length; lbRender(); };
if (lightbox) {
	document.addEventListener('click', (e) => {
		const item = e.target.closest('[data-lightbox]');
		if (!item) return;
		e.preventDefault();
		const group = item.dataset.lightbox;
		const items = $$(`[data-lightbox="${group}"]`).filter((el) => !el.classList.contains('hide'));
		lbOpen(items, items.indexOf(item));
	});
	$('.lb-close', lightbox).addEventListener('click', lbClose);
	$('.lb-prev', lightbox).addEventListener('click', () => lbStep(-1));
	$('.lb-next', lightbox).addEventListener('click', () => lbStep(1));
	lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lbClose(); });
	let touchX = null;
	lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
	lightbox.addEventListener('touchend', (e) => {
		if (touchX === null) return;
		const dx = e.changedTouches[0].clientX - touchX;
		if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1);
		touchX = null;
	});
}

/* ---------- Gallery filters ---------- */
const filterBar = $('[data-filters]');
if (filterBar) {
	const items = $$('.masonry .g-item');
	$$('button', filterBar).forEach((btn) => {
		const cat = btn.dataset.filter;
		const n = cat === 'all' ? items.length : items.filter((i) => i.dataset.cat.split(' ').includes(cat)).length;
		btn.insertAdjacentHTML('beforeend', `<sup>${n}</sup>`);
		btn.addEventListener('click', () => {
			$$('button', filterBar).forEach((b) => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
			items.forEach((item) => item.classList.toggle('hide', cat !== 'all' && !item.dataset.cat.split(' ').includes(cat)));
			history.replaceState(null, '', cat === 'all' ? location.pathname : `#${cat}`);
		});
	});
	const fromHash = location.hash.slice(1);
	$(`[data-filter="${fromHash}"]`, filterBar)?.click();
}

/* ---------- FAQ search ---------- */
const faqSearch = $('[data-faq-search]');
if (faqSearch) {
	const groups = $$('.faq-group');
	const empty = $('.no-results');
	faqSearch.addEventListener('input', () => {
		const q = faqSearch.value.trim().toLowerCase();
		let shown = 0;
		groups.forEach((group) => {
			let groupShown = 0;
			$$('details', group).forEach((d) => {
				const match = !q || d.textContent.toLowerCase().includes(q);
				d.hidden = !match;
				if (match) groupShown++;
				if (q && match) d.open = true;
				if (!q) d.open = false;
			});
			group.hidden = groupShown === 0;
			shown += groupShown;
		});
		empty.style.display = shown ? 'none' : 'block';
	});
	$('[data-faq-toggle]')?.addEventListener('click', (e) => {
		const all = $$('.accordion details:not([hidden])');
		const open = all.some((d) => !d.open);
		all.forEach((d) => { d.open = open; });
		e.currentTarget.textContent = open ? 'Collapse all' : 'Expand all';
	});
}

/* ---------- Scroll spy for in-page sub navigation ---------- */
const subnav = $('.subnav');
if (subnav) {
	const links = $$('a[href^="#"]', subnav);
	const spy = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			links.forEach((l) => {
				const on = l.getAttribute('href') === `#${entry.target.id}`;
				l.classList.toggle('active', on);
				if (on) l.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
			});
		});
	}, { rootMargin: '-45% 0px -50% 0px' });
	links.forEach((l) => { const t = document.querySelector(l.getAttribute('href')); if (t) spy.observe(t); });
}

/* ---------- Venue map ---------- */
const venueMap = $('[data-venue-map]');
if (venueMap) {
	const panel = $('.map-panel', venueMap);
	const zones = $$('.zone', venueMap);
	const listButtons = $$('.zone-list button', venueMap);
	const select = (id) => {
		const zone = zones.find((z) => z.dataset.zone === id);
		if (!zone) return;
		zones.forEach((z) => z.classList.toggle('active', z === zone));
		listButtons.forEach((b) => b.classList.toggle('active', b.dataset.zone === id));
		$('img', panel).src = zone.dataset.img;
		$('img', panel).alt = zone.dataset.title;
		$('h3', panel).textContent = zone.dataset.title;
		$('p', panel).textContent = zone.dataset.text;
		$('.link-arrow', panel).href = zone.dataset.href;
	};
	zones.forEach((z) => {
		z.setAttribute('tabindex', '0');
		z.setAttribute('role', 'button');
		z.setAttribute('aria-label', z.dataset.title);
		z.addEventListener('click', () => select(z.dataset.zone));
		z.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(z.dataset.zone); } });
	});
	listButtons.forEach((b) => b.addEventListener('click', () => select(b.dataset.zone)));
	select(zones[0].dataset.zone);
}

/* ---------- Countdown to opening ---------- */
$$('[data-countdown]').forEach((box) => {
	const target = SITE.openingDate ? new Date(`${SITE.openingDate}T00:00:00`) : null;
	const fallback = $('[data-countdown-fallback]');
	if (!target || Number.isNaN(target.getTime()) || target < new Date()) { box.hidden = true; if (fallback) fallback.hidden = false; return; }
	if (fallback) fallback.hidden = true;
	const parts = { d: $('[data-d]', box), h: $('[data-h]', box), m: $('[data-m]', box), s: $('[data-s]', box) };
	const tick = () => {
		const diff = Math.max(0, target - new Date());
		parts.d.textContent = Math.floor(diff / 864e5);
		parts.h.textContent = String(Math.floor(diff / 36e5) % 24).padStart(2, '0');
		parts.m.textContent = String(Math.floor(diff / 6e4) % 60).padStart(2, '0');
		parts.s.textContent = String(Math.floor(diff / 1e3) % 60).padStart(2, '0');
	};
	tick();
	setInterval(tick, 1000);
});

/* ---------- Site-visit booking calendar ---------- */
$$('[data-calendar]').forEach((cal) => {
	const grid = $('.cal-grid', cal);
	const title = $('.cal-head h3', cal);
	const prev = $('[data-cal-prev]', cal);
	const next = $('[data-cal-next]', cal);
	const form = cal.closest('form');
	const dateInput = $('input[name="visit_date"]', form);
	const slotInput = $('input[name="visit_slot"]', form);
	const slotsBox = $('.slots', form);
	const summary = $('.slot-summary', form);
	const today = new Date(); today.setHours(0, 0, 0, 0);
	const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 90);
	let view = new Date(today.getFullYear(), today.getMonth(), 1);
	let selected = null;
	const fmt = (d) => d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
	const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	const updateSummary = () => {
		summary.textContent = selected
			? `${fmt(selected)}${slotInput.value ? ` at ${slotInput.value}` : ' — now pick a time'}`
			: 'Pick a date on the calendar to see available times.';
	};
	function render() {
		title.textContent = view.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
		prev.disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
		next.disabled = view >= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
		const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		let html = days.map((d) => `<span class="dow">${d}</span>`).join('');
		const offset = (view.getDay() + 6) % 7;
		html += '<span></span>'.repeat(offset);
		const total = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
		for (let n = 1; n <= total; n++) {
			const d = new Date(view.getFullYear(), view.getMonth(), n);
			const off = d < today || d > maxDate;
			const cls = [d.getTime() === today.getTime() ? 'today' : '', selected && d.getTime() === selected.getTime() ? 'selected' : ''].join(' ');
			html += `<button type="button" class="${cls}" data-date="${iso(d)}" ${off ? 'disabled' : ''} aria-label="${fmt(d)}">${n}</button>`;
		}
		grid.innerHTML = html;
	}
	grid.addEventListener('click', (e) => {
		const btn = e.target.closest('button[data-date]');
		if (!btn) return;
		const [y, m, d] = btn.dataset.date.split('-').map(Number);
		selected = new Date(y, m - 1, d);
		dateInput.value = btn.dataset.date;
		slotInput.value = '';
		$$('button', slotsBox).forEach((s) => s.classList.remove('selected'));
		slotsBox.closest('.field').hidden = false;
		dateInput.closest('.field')?.classList.remove('invalid');
		render();
		updateSummary();
	});
	slotsBox.addEventListener('click', (e) => {
		const btn = e.target.closest('button');
		if (!btn) return;
		$$('button', slotsBox).forEach((s) => s.classList.toggle('selected', s === btn));
		slotInput.value = btn.textContent;
		slotInput.closest('.field')?.classList.remove('invalid');
		updateSummary();
	});
	prev.addEventListener('click', () => { view.setMonth(view.getMonth() - 1); render(); });
	next.addEventListener('click', () => { view.setMonth(view.getMonth() + 1); render(); });
	render();
	updateSummary();
});

/* ---------- Forms ---------- */
$$('input[type="date"]').forEach((el) => { if (!el.min) el.min = new Date().toISOString().slice(0, 10); });
$$('input[name="check_in"]').forEach((checkIn) => {
	const checkOut = $('input[name="check_out"]', checkIn.form);
	checkIn.addEventListener('change', () => {
		if (!checkOut || !checkIn.value) return;
		const next = new Date(checkIn.value);
		next.setDate(next.getDate() + 1);
		checkOut.min = next.toISOString().slice(0, 10);
		if (checkOut.value && checkOut.value < checkOut.min) checkOut.value = checkOut.min;
	});
});
$$('input[type="range"]').forEach((range) => {
	const out = range.parentElement.querySelector('output');
	const update = () => { out.textContent = Number(range.value) >= Number(range.max) ? `${range.max}+` : range.value; };
	range.addEventListener('input', update);
	update();
});
$$('[data-toggle-target]').forEach((check) => {
	const target = document.getElementById(check.dataset.toggleTarget);
	const update = () => { target.disabled = check.checked; if (check.checked) { target.value = ''; target.closest('.field').classList.remove('invalid'); } };
	check.addEventListener('change', update);
});

function validateField(field) {
	const wrapper = field.closest('.field');
	if (!wrapper) return true;
	let ok;
	if ('group' in field.dataset) ok = $$(`input[name="${field.name}"]:checked`, field.form).length > 0;
	else ok = field.checkValidity();
	if (ok && field.type === 'tel' && field.value) ok = /^[+\d][\d\s-]{7,15}$/.test(field.value.trim());
	wrapper.classList.toggle('invalid', !ok);
	return ok;
}
function validateScope(scope) {
	const fields = $$('input, select, textarea', scope).filter((f) => !f.disabled && f.type !== 'hidden' || f.dataset.required);
	let firstBad = null;
	fields.forEach((f) => {
		let ok;
		if (f.type === 'hidden') {
			ok = Boolean(f.value);
			f.closest('.field')?.classList.toggle('invalid', !ok);
		} else ok = validateField(f);
		if (!ok && !firstBad) firstBad = f;
	});
	if (firstBad) {
		const target = firstBad.type === 'hidden' ? firstBad.closest('.field') : firstBad;
		target.scrollIntoView({ block: 'center', behavior: 'smooth' });
		if (firstBad.type !== 'hidden') setTimeout(() => firstBad.focus({ preventScroll: true }), 300);
	}
	return !firstBad;
}

function collect(form) {
	const data = {};
	new FormData(form).forEach((value, key) => {
		if (key in data) data[key] = [].concat(data[key], value);
		else data[key] = value;
	});
	Object.keys(data).forEach((k) => { if (Array.isArray(data[k])) data[k] = data[k].join(', '); });
	data.form = form.dataset.form;
	data.page = location.pathname.split('/').pop() || 'index.html';
	data.submitted_at = new Date().toISOString();
	return data;
}

async function submitForm(form) {
	const btn = $('button[type="submit"]', form);
	const status = $('.form-status', form);
	const label = btn.innerHTML;
	btn.disabled = true;
	btn.innerHTML = 'Sending…';
	const data = collect(form);
	try {
		if (SITE.formEndpoint) {
			const res = await fetch(SITE.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
			if (!res.ok) throw new Error(res.statusText);
		} else {
			const saved = storage.get('gr-enquiries', []);
			saved.push(data);
			storage.set('gr-enquiries', saved);
		}
		try { sessionStorage.setItem('gr-last-enquiry', JSON.stringify(data)); } catch { /* ignore */ }
		if (form.dataset.inline !== undefined) {
			form.reset();
			status.className = 'form-status show ok';
			status.textContent = form.dataset.success || 'Thank you. We will be in touch shortly.';
			btn.disabled = false;
			btn.innerHTML = label;
			return;
		}
		location.href = `thank-you.html?type=${encodeURIComponent(form.dataset.form)}`;
	} catch (err) {
		status.className = 'form-status show err';
		status.innerHTML = `Sorry, that didn't go through. Please try again, or <a href="${waLink('Hello, I tried to send an enquiry from your website.')}" target="_blank" rel="noopener"><u>message us on WhatsApp</u></a>.`;
		btn.disabled = false;
		btn.innerHTML = label;
	}
}

$$('form.js-form').forEach((form) => {
	form.noValidate = true;
	form.addEventListener('input', (e) => { if (e.target.closest('.field.invalid')) validateField(e.target); });
	form.addEventListener('change', (e) => { if ('group' in e.target.dataset) validateField(e.target); });

	const steps = $$('.step', form);
	if (steps.length) {
		const dots = $$('.step-dot', form);
		let i = 0;
		const show = (n) => {
			steps[i].classList.remove('active');
			i = n;
			steps[i].classList.add('active');
			dots.forEach((d, k) => { d.classList.toggle('active', k === i); d.classList.toggle('done', k < i); });
			form.scrollIntoView({ block: 'start', behavior: 'smooth' });
		};
		$$('[data-step-next]', form).forEach((b) => b.addEventListener('click', () => { if (validateScope(steps[i])) show(i + 1); }));
		$$('[data-step-prev]', form).forEach((b) => b.addEventListener('click', () => show(i - 1)));
	}

	form.addEventListener('submit', (e) => {
		e.preventDefault();
		if ($('input[name="website"]', form)?.value) return; // honeypot
		if (!validateScope(steps.length ? $('.step.active', form) : form)) return;
		submitForm(form);
	});
});

/* Newsletter (footer) */
$$('form.newsletter').forEach((form) => {
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const input = $('input', form);
		const msg = form.nextElementSibling;
		if (!input.checkValidity() || !input.value) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
		const list = storage.get('gr-updates', []);
		list.push({ email: input.value, at: new Date().toISOString() });
		storage.set('gr-updates', list);
		msg.textContent = "You're on the list. We'll share progress and launch news.";
		form.reset();
	});
});

/* ---------- Enquiry modal ---------- */
const modal = $('#enquiry-modal');
if (modal) {
	const open = (interest) => {
		lastFocus = document.activeElement;
		if (interest) { const sel = $('select[name="interest"]', modal); if (sel) sel.value = interest; }
		modal.classList.add('open');
		modal.setAttribute('aria-hidden', 'false');
		document.body.classList.add('lock');
		setTimeout(() => $('input', modal).focus(), 150);
	};
	const close = () => {
		modal.classList.remove('open');
		modal.setAttribute('aria-hidden', 'true');
		document.body.classList.remove('lock');
		lastFocus?.focus();
	};
	document.addEventListener('click', (e) => {
		const trigger = e.target.closest('[data-enquire]');
		if (trigger) { e.preventDefault(); if (mobileNav.matches) setMenu(false); open(trigger.dataset.enquire); }
	});
	$('.modal-close', modal).addEventListener('click', close);
	modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
	modal.addEventListener('keydown', (e) => {
		if (e.key !== 'Tab') return;
		const f = $$('button, input, select, textarea, a[href]', modal).filter((el) => !el.disabled && el.offsetParent);
		if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
		else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
	});
	window.closeEnquiry = close;
}

document.addEventListener('keydown', (e) => {
	if (lightbox?.classList.contains('open')) {
		if (e.key === 'Escape') lbClose();
		if (e.key === 'ArrowRight') lbStep(1);
		if (e.key === 'ArrowLeft') lbStep(-1);
		return;
	}
	if (e.key !== 'Escape') return;
	if (modal?.classList.contains('open')) window.closeEnquiry();
	else if (nav?.classList.contains('open')) setMenu(false);
});

/* ---------- Copy to clipboard ---------- */
$$('[data-copy]').forEach((btn) => btn.addEventListener('click', async () => {
	const text = btn.dataset.copy === 'address' ? SITE.address : btn.dataset.copy;
	try { await navigator.clipboard.writeText(text); showToast('Copied to clipboard'); } catch { showToast(text); }
}));

/* ---------- Thank-you page ---------- */
const thanks = $('[data-thanks]');
if (thanks) {
	let data = {};
	try { data = JSON.parse(sessionStorage.getItem('gr-last-enquiry')) || {}; } catch { /* ignore */ }
	const labels = { wedding: 'wedding enquiry', stay: 'stay enquiry', visit: 'site-visit request', event: 'event enquiry', interest: 'registration', 'early-bird': 'early-bird date request', contact: 'message', quick: 'enquiry', directions: 'request' };
	const type = new URLSearchParams(location.search).get('type') || data.form || 'quick';
	const first = (data.name || '').trim().split(' ')[0];
	$('[data-thanks-name]').textContent = first ? `, ${first}` : '';
	$('[data-thanks-type]').textContent = labels[type] || 'enquiry';
	const lines = Object.entries(data)
		.filter(([k, v]) => v && !['form', 'page', 'submitted_at', 'website'].includes(k))
		.map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`);
	const summary = $('[data-thanks-summary]');
	if (lines.length && summary) {
		summary.hidden = false;
		$('ul', summary).innerHTML = lines.map((l) => `<li>${l.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]))}</li>`).join('');
	}
	const wa = $('[data-thanks-wa]');
	if (wa) wa.href = waLink(`Hello ${SITE.name}, I just sent a ${labels[type] || 'enquiry'} from your website.\n\n${lines.join('\n')}`);
}
