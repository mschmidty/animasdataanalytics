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
      p.noStroke();
      p.fill(71, 36, 38);
      const spacing = 5;
      for (let x = spacing - (spacing / 2); x < p.width; x += spacing) {
        for (let y = spacing - (spacing / 2); y < p.height; y += spacing) {
          p.circle(x, y, 2);
        }
      }
    }
  }

  return new p5Class(sketch, container)
}
