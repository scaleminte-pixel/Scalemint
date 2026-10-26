# Scalemint content audit — 26 October 2026

Scope: local website source and current CMS database. This is a content and implementation review; live production content, rendered layouts, inbox delivery and calendar operation were not verified. No website content or business terms were changed.

## Package baseline

| Monthly scope | Business Boost — $990 | Growth Plus — $1,990 | Scale Pro — $2,990 |
|---|---|---|---|
| Website pages | Up to 5 | Up to 10 | Up to 15 |
| Setup | 2–3 weeks | 3–4 weeks | 4 weeks |
| Reels, up to 30 seconds | 4 | 8 | 12 |
| Managed platforms | 1 | 2 | 3 |
| Posts / included carousels | 8 / none stated in card | 12 / 2 | 16 / 4 |
| Stories | 4 | 8 | 12 |
| Community replies | Not included in listed scope | Once per business day | Twice per business day |
| Strategy meetings | None listed | 1 monthly | 2 monthly |

## Findings and recommended changes

1. **Home / positioning — high priority.** CMS hero, orbit labels, Why Choose Us and “Six Specialized Pillars” still promote branding, AI UGC and Google Ads, although only Business Growth Packages is published. Rewrite around website + client management + Reels + social media; identify paid ads/branding separately if available as extras. Suggested hero: “Your Website, Clients & Social Media—Managed Together.” Supporting line: “Choose a monthly package with a business website, client tracking, short-form videos and social media management. From $990/month.”
2. **Package agreement — mostly consistent.** Current names/prices match homepage cards, services cards and booking options. Comparison table agrees on core quantities. Exceptions: generic service copy promises full CMS/admin control, custom CRM stages, invoicing and daily engagement too broadly; these differ by tier. Add “depending on your package.” Cards promise free hosting; matrix says only free setup. Clarify hosting/domain duration and renewal costs, initial setup charges, minimum term, cancellation, revisions, maintenance, platform choices, filming versus editing, and whether posts/Reels overlap or are totals across platforms. Do not invent these terms.
3. **Timelines / process.** Home hero metadata contains “<14 Days”, process runs through week 5, About says 6 weeks, packages say 2–4 weeks. Use tier-specific setup timelines followed by monthly delivery. Remove expired Q2/Q3 availability text.
4. **About / credibility.** Replace heavy enterprise jargon with who the team serves, what it delivers and how monthly work happens. Verify retention, “Top 1%”, revenue/ROAS and speed claims before publishing. Client records use `.example` websites; all eight share one logo asset, and six testimonials share one portrait. Replace demo content with approved real evidence or clearly label examples. Do not treat existing numbers as verified results.
5. **FAQ.** Old service questions dominate. “Every website” has editable CMS conflicts with Boost's managed fixed content. Explain tier differences, setup, monthly deliverables, footage inputs, revisions, hosting, upgrades and cancellation. Scope revision promises to each package.
6. **Contact / lead form.** Replace “fixed-price sprint roadmap within 24 hours” with a realistic response commitment, preferably one business day if supported operationally. Budget state defaults to `$2,000 - $5,000`, absent from displayed options; package selection does not update it. Use a valid neutral default and align it with selected package. Clarify inquiry submission versus purchase. Check published contact details and location with the owner.
7. **Book Now / Book a Call.** Header booking and hero booking open a request form. Use “Request a 30-minute call” consistently. Success says a slot is reserved and invite will follow, but API only saves a PENDING request; no calendar/email integration is shown. Say “Request received; we will confirm availability.” Add timezone, future-date validation and package selection; default service currently is not an available dropdown option. Hero CMS says “Start Your Project” but opens the booking modal, so align the label with the action.
8. **CMS display bugs.** Home hero bento data uses badge/metric/subtitle while renderer expects eyebrow/value/desc; stored details are replaced by fallbacks or blank descriptions. Home metrics use label while component expects desc. Why Choose Us stores items while page reads features. Home About content is not passed as its main body. Contact reads content as an object, whereas existing records store title/subtitle/metadata separately, and CMS editor saves JSON strings; align storage, parsing and rendering. About editor also writes content while About page reads title/subtitle/metadata.
9. **Other pages / navigation / SEO.** About's portfolio CTA goes to `/portfolio`, which redirects to packages; link it to actual work or rename it. Direct published growth-service detail still uses legacy calculator tiers ($1,550/$3,100/$4,990), separate from the three monthly plans; remove or relabel it clearly. Blog includes published smoke/E2E test posts and unsupported numerical claims; remove test entries and substantiate claims. Global SEO still describes the old six-service offering. No sitemap/robots source files found.
10. **Policies — commercial consistency.** Current payment copy describes 50/50 sprint payments while plans are monthly. State actual monthly billing, setup and cancellation terms. Ownership timing varies between kickoff, launch and final settlement; use one agreed rule. Privacy describes encrypted database connections, while this local app uses file-based SQLite; document the actual deployed setup. This is an internal consistency finding, not a legal compliance assessment.

Recommended order: align positioning and package scope; correct booking/form messaging; fix CMS rendering; replace demo proof; update FAQ, policies, blog and SEO. Generate package cards, comparison rows and form options from a single shared data source so later edits remain consistent.
