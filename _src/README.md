# German Resort site source

The `.html` pages in the site root are generated. Edit the page bodies in `pages/`, or the shared header, footer, enquiry modal and icons in `build.mjs`, then run:

```
node _src/build.mjs
```

Each page starts with a JSON comment holding its title, meta description, nav section and hero. Write icons as `{{icon:name}}` (names are listed in `build.mjs`).

Contact details (phone, WhatsApp, email, map pin) and the form endpoint are set once, in `SITE` at the top of `js/main.js`.
