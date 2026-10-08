
		const menuToggle = document.querySelector('.menu-toggle');
		const navigation = document.querySelector('.nav');

		function closeMenu() {
			menuToggle.setAttribute('aria-expanded', 'false');
			menuToggle.setAttribute('aria-label', 'Open navigation');
			navigation.classList.remove('open');
			document.body.classList.remove('menu-open');
		}

		menuToggle.addEventListener('click', () => {
			const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
			menuToggle.setAttribute('aria-expanded', String(!isOpen));
			menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
			navigation.classList.toggle('open', !isOpen);
			document.body.classList.toggle('menu-open', !isOpen);
		});
		navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

		const revealObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('in-view');
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.12 });
		document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

		document.querySelector('#enquiry-form').addEventListener('submit', (event) => {
			event.preventDefault();
			document.querySelector('#form-feedback').textContent = 'Thank you. This demo form is ready to connect to the resort enquiry inbox.';
			event.currentTarget.reset();
		});

		const lightbox = document.querySelector('#lightbox');
		const lightboxImage = lightbox.querySelector('img');
		function closeLightbox() {
			lightbox.classList.remove('open');
			document.body.classList.remove('menu-open');
		}
		document.querySelectorAll('.gallery-item').forEach((item) => item.addEventListener('click', () => {
			const image = item.querySelector('img');
			lightboxImage.src = image.currentSrc || image.src;
			lightboxImage.alt = image.alt;
			lightbox.classList.add('open');
			document.body.classList.add('menu-open');
			lightbox.querySelector('button').focus();
		}));
		lightbox.querySelector('button').addEventListener('click', closeLightbox);
		lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
		document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeLightbox(); closeMenu(); } });

		const backTop = document.querySelector('#back-top');
		window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 600), { passive: true });
		backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
		document.querySelector('#year').textContent = new Date().getFullYear();
	
