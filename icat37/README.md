# ICAT 37 — rebuilt static website

A lightweight, dependency-free static rebuild of the seven saved ICAT pages. It uses local HTML, CSS, JavaScript and optimized WebP images; it does not load Elementor, Revolution Slider, remote fonts, analytics or third-party runtime scripts.

## Pages

- Home — index.html
- About — about.html
- Courses — courses.html
- Certificate verification — certificate-verification.html
- Blogs — blogs.html
- Testimonials — testimonials.html
- Contact — contact.html
- Custom not-found page — 404.html

Compatibility aliases are included for the saved WordPress paths: /about-us/, /our-courses-3/, /certificate-verification/, /blogs/, /testimonials/ and /contact/.

## Launch

Upload the contents of this folder to a static host or web server with HTTPS enabled and index.html as its default document. Configure the domain and DNS with the hosting provider. Internal page links use local HTML paths.

If replacing the existing WordPress site, keep a backup and preserve its URL paths with permanent redirects if required by the host. The included aliases use a short meta refresh; configure server-side 301 redirects for the final production setup.

## Integrations and content to confirm

- Course fees are copied from saved website captures and may have changed. Confirm prices, dates, delivery format, accreditation details, phone, email, address and social links with ICAT before publishing.
- The testimonials were retained from the captured public page. Confirm their accuracy and continued use before publishing.
- Contact and certificate forms prepare an email in the visitor’s email app. They do not send or store form data.
- Certificate IDs are not checked against a database. Automatic verification requires ICAT’s records and a connected service.
- The original WordPress course enrolment, learner accounts, checkout and payment processing are not included in this static rebuild. Connect the approved LMS/payment system before accepting paid enrolments.

This package has no build step or third-party runtime dependencies. It is a local launch package; the live domain has not been changed.
