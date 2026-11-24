import type p5 from 'p5';


export const initFlowFieldGrid = (p5Class: typeof p5, containerID: string | HTMLElement) => {
  const container = typeof containerID === 'string' ? document.getElementById(containerID) : containerID;
  if (!container) return;

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(container.clientWidth, container.clientHeight)
      p.noLoop()
    }
    p.draw = () => {
      const sketchNum = 1/*  Math.round(Math.random(0, 1)) */
      if (sketchNum == 0) {

        p.noStroke();
        p.fill(71, 36, 38);
        const spacing = 5;
        for (let x = spacing - (spacing / 2); x < p.width; x += spacing) {
          for (let y = spacing - (spacing / 2); y < p.height; y += spacing) {
            p.circle(x, y, 2);
          }
        }
      } else {
        const spacing = 20;
        p.stroke(71, 36, 38); // Matches your dot color; change to 255 for white
        p.strokeWeight(2);

        for (let y = 0; y < p.height; y += spacing) {
          for (let x = 0; x < p.width; x += spacing) {
            if (p.random(1) < 0.5) {
              p.line(x, y, x + spacing, y + spacing);
            } else {
              p.line(x, y + spacing, x + spacing, y);
            }
          }
        }
      }
    }
  }

  return new p5Class(sketch, container)
}
