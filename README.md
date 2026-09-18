# Steven LaGoy - Portfolio

Created November 2025, last updated May 2026

This website was made with React, built with Vite. All components and pages are custom-made, styled, and arranged by me. As a personal challenge, no generative artificial intelligence was used to create this page.

## Tools Used

- **IDE:** Visual Studio Code
- **Prototyping:** Figma
- **Package Management:** NPM
- **Linting + Static Analysis:** ESLint
- **Frontend Library:** React
- **Build Tool:** Vite
- **Language:** TypeScript
- **Version Control:** GitHub
- **Hosting:** GitHub Pages

## Design process

### Concept & Prototyping

Based on elements from my V1 portfolio website, I sketched some details and inspirations on paper. I refined the sketches and created a box model based on the drawings. I created a [Figma prototype](https://www.figma.com/design/LHtUJEFs3zjd4GPXokcu66/Portfolio-Page?node-id=0-1&p=f&t=l3nnCsl3lkiQnY0b-0) of the site.

### Implementation

I created a React app in TypeScript with Vite. I chose typescript for its strong typing, which helped me make schemas for my data files. The first thing I made was the Mandelbrot simulation, which uses a canvas and webworkers to simulate the Mandelbrot set fractal. Next, I created my header, followed by the *About Me* section, the *Projects* section, the *Skills & Technologies* section, and finally the *Contact Me* section. While implementing those four sections, I also added the Navigator component. Finally, I added semi-random animations to the fractal simulation to zoom in and out on selected "interesting" locations.

### Deployment

This site is deployed with GitHub Pages. For this reason, the site consists of only a static frontend, which is all that GH Pages supports.

## Cool Features
- **Styling:** I used Sass partials in `src/styles/` to define colors, fonts, typography constants, and theme-determined palates. These variables are used throughout the app. This also involves a light and dark theme which use different colorsets are easily togglable with the switch on the header component.
- **Data:** The projects and tools/technologies components are fetched from data files in `src/data/` and rendered based on the retrieved info. This makes the data very extensible, as new entries are very easy to add and new pieces of data can relatively easily be added to the TSX.
- **Mandelbrot Simulation:** The crowning component of the page is the Mandelbrot set fractal simulation at the top, which greets visitors when they first see the site. This is fully simulated in TypeScript by dispatching webworkers to render horizontal bands of the canvas. Interesting points are chosen semi-randomly based on shape density to zoom in and out of, showcasing the simulation. At the same time, the iteration count used to render the fractal increases and decreases dynamically to preserve resources while preserving the integrity of the image for the current zoom level.
- **Navigator:** The navigator component on the right side of the content body is created as part of the layout component, which allows it to accept ID values for the various sections on the page. Using this data, the navigator generates its appearance and allows users to click on an anchor node to quickly navigate to one section.
- **Background:** The background image is composed of one of two tiled `.png` files determined by a Sass styling variable set by the theme. To give a parallax effect, the layout component listens for scroll actions and applies a scaled offset to the background image. As a user scrolls up and down the page, the background will move at a slower rate than the main content, creating a 3D effect.
- **Vite path aliasing:** Vite and TypeScript allow their configurations to define paths and aliases. This made import and include statements much easier, as I could define paths like `@components`, `@assets`, etc, and use those in import statements.

---

- See the [GitHub repository](https://github.com/stevenlagoy/stevenlagoy.github.io)

- See my [GitHub profile](https://github.com/stevenlagoy)

---
