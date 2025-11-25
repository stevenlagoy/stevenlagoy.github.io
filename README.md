# Steven LaGoy - Portfolio
<b>Created November 2025 by Steven LaGoy</b>

This website was made with React, built with Vite. All components and pages are custom-made, styled, and arranged by me.

## Tools Used

<b>IDE:</b> Visual Studio Code \
<b>Prototyping:</b> Figma \
<b>Package Management:</b> NPM \
<b>Linting + Static Analysis:</b> ESLint \
<b>Frontend Library:</b> React \
<b>Build Tool:</b> Vite \
<b>Language:</b> TypeScript \
<b>Version Control:</b> GitHub \
<b>Hosting:</b> GitHub Pages

## Design process

### Concept & Prototyping

Based on elements from my V1 portfolio website, I sketched some details and inspirations on paper. I refined the sketches and created a box model based on the drawings. I created a [Figma prototype](https://www.figma.com/design/LHtUJEFs3zjd4GPXokcu66/Portfolio-Page?node-id=0-1&p=f&t=l3nnCsl3lkiQnY0b-0) of the site.

### Implementation

I created a React app in TypeScript with Vite. I chose typescript for its strong typing, which I wanted when working with certain data files. The first thing I made was the Mandelbrot simulation, which uses a canvas and webworkers to simulate the Mandelbrot set fractal. Next, I created my header, followed by the About Me section, the Projects section, the Skills & Technologies section, and finally the Contact Me section. In the middle of implementing those four sections, I also added the Navigator component. Finally, I added semi-random animations to the fractal simulation to zoom in and out on selected "interesting" locations.

### Deployment

This site is deployed with GitHub Pages. For this reason, the site consists of only a static frontend, which is all that GH Pages supports.

## Cool Features
- <b>Styling</b> \
  Used Sass partials in src/styles/ to define colors, fonts, typography constants, and theme-determined palates. These variables are used throughout the app. This also involves a light and dark theme which use different colorsets are easily togglable with the switch on the header component.
- <b>Data</b> \
  The projects and tools/technologies components are fetched from data files in src/data/ and rendered based on the retrieved info. This makes the data very extensible, as new entries are very easy to add and new pieces of data can relatively easily be added to the TSX.
- <b>Mandelbrot Simulation</b> \
  The crown component of the page is the Mandelbrot set fractal simulation at the top of the page. This is fully simulated in TypeScript by dispatching webworkers to render horizontal bands of the canvas. Then, interesting points are chosen semi-randomly to zoom in and out of, showcasing the simulation. At the same time, the iteration count increases and decreases intelligently to preserve resources while giving images with high fidelity.
- <b>Navigator</b> \
  The navigator component on the right side of the content body is created as part of the layout component, which allows it to accept ID values for the various sections on the page. Using this data, the navigator generates its appearance and allows users to click on an anchor node to quickly navigate to one section.
- <b>Background</b> \
  The background image is one of two tiled .png files determined by a Sass styling variable set by the theme. To give a paralax effect, the layout component listens for scroll actions and applies a scaled offset to the background image. As a user scrolls up and down the page, the backgroun will move at a slower rate than the main content, creating a 3D effect.
- <b>Vite path aliasing</b> \
  Vite and TypeScript allow their configurations to define paths and aliases. This made import and include statements much easier, as I could define paths like `@components`, `@assets`, etc, and use those in import statements.

---

Thank you for reading ✨ - Steven LaGoy

- See the [GitHub repository](https://github.com/stevenlagoy/stevenlagoy.github.io)

- See my [GitHub profile](https://github.com/stevenlagoy)