# Image sources

The six original workshop WebP images and unchanged SVG logos were supplied with this project.

## Added workshop illustrations

`car-service.webp`, `motorcycle-brake.webp`, and `service-handover.webp` were generated for this website with OpenAI ImageGen on 11 September 2026. They are illustrative scenes, not photographs of actual Ironlane premises, work or customers. The About page labels its work examples and history as illustrative. Images are optimized as local WebP assets.

## Manufacturer logos

Logos identify service compatibility only. They do not imply manufacturer authorization or endorsement. Source artwork and original colors are preserved; the CSS no longer converts logos to grayscale or inverts them in dark mode.

- Honda `brands/honda.png`: [Honda Motorcycle and Scooter India](https://www.honda2wheelersindia.com/), red wing logo served from its official Sitecore CDN.
- Kawasaki `brands/kawasaki.png`: [Kawasaki India](https://www.kawasaki-india.com/en/about-kawasaki/company.html), original red wordmark from the official site header.
- Yamaha Motor `brands/yamaha-motor.svg`: [Wikimedia Commons file](https://commons.wikimedia.org/wiki/File:Yamaha_Motor_Logo_(full).svg), authored by Yamaha Motor and sourced there to its official website; public-domain text-logo notice, trademark restrictions remain. Replaces the supplied violet Yamaha Corporation mark with the red motorcycle brand logo. [Yamaha explains the color distinction](https://www.yamaha.com/en/about/history/logo/?from=global_search).
- BMW `brands/bmw-color.svg`: [Wikimedia Commons file](https://commons.wikimedia.org/wiki/File:BMW.svg), BMW roundel with original blue and white, public-domain text-logo notice, trademark restrictions remain.

## Unique imagery update — 12 September 2026

41 additional images were generated with built-in OpenAI ImageGen for a specific hero or content section. Each of the website's 50 photo placements now uses a distinct scene, including a unique hero on all 14 pages. The original nine suitable workshop photographs are each retained in one placement only. Manufacturer logos are intentionally reusable identifiers.

New assets are in `unique/`. `unique/generation-manifest.json` records each exact generation prompt, the source PNG, the optimized website path, alt text, page assignment and image dimensions. The `-640.webp` files are responsive versions of the same assigned photograph, not additional photo placements. Heroes are optimized to 1600 pixels wide and content photos to 1200 pixels wide, with 640-pixel alternatives for smaller displays.

All generated scenes are illustrative, including workshop interiors, staff, riders and the historical workshop scene. They do not document real Ironlane premises, personnel, customers or previous work.
