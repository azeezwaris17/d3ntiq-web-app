# Images Directory

This directory contains all image assets for the DENTIQ frontend application.

## Directory Structure

```
images/
├── about/              # About page images
├── blog/              # Blog post images
├── news/              # News article images (homepage)
├── services/           # Service card images
├── team/              # Team member photos
└── testimonials/      # Testimonial avatars
```

## Root Level Images

Hero background images should be placed directly in this directory:

- `hero-dental-office.jpg` - Homepage hero
- `dental-tools.jpg` - About page hero
- `contact-hero.jpg` - Contact page hero
- `provider-hero.jpg` - Providers page hero
- `dental-guide-hero.jpg` - Dental Guide page hero
- `dental-shade-guide.jpg` - Services page hero
- `services-hero.jpg` - Services Learn More page hero
- `blog-hero.jpg` - Blog listing page hero
- `dental-services.jpg` - Service detail page hero

## Adding Images

1. Place images in the appropriate subdirectory based on their purpose
2. Use descriptive, lowercase filenames with hyphens (e.g., `patient-portal.jpg`)
3. Ensure images are optimized for web use
4. Refer to `ASSETS_REQUIRED.md` in the project root for complete specifications

## Image Optimization

Before adding images, consider:

- Compressing images to reduce file size
- Using WebP format when possible for better compression
- Maintaining aspect ratios as specified in `ASSETS_REQUIRED.md`
- Ensuring images are properly sized (not too large or too small)
