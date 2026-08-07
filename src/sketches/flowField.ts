import type p5 from 'p5';

export const initFlowField = (p5Class: typeof p5, container: HTMLElement) => {
  const sketch = (p: p5) => {
    let particles: Array<{ x: number; y: number; vx: number; vy: number }> = [];

    const getDimensions = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width || container.clientWidth || window.innerWidth;
      const height = rect.height || container.clientHeight || 500;
      return { width, height };
    };

    p.setup = () => {
      const { width, height } = getDimensions();
      const canvas = p.createCanvas(width, height);
      canvas.parent(container);
      p.pixelDensity(1);

      particles = [];
      for (let i = 0; i < 125; i++) {
        particles.push({
          x: p.random(width),
          y: p.random(height),
          vx: p.random(-0.8, 0.8),
          vy: p.random(-0.8, 0.8),
        });
      }
    };

    p.draw = () => {
      p.clear();

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;

        if (pt.x < 0 || pt.x > p.width) pt.vx *= -1;
        if (pt.y < 0 || pt.y > p.height) pt.vy *= -1;

        // Draw node circles with brand primary color (#472426)
        p.noStroke();
        p.fill(71, 36, 38, 180);
        p.circle(pt.x, pt.y, 7);

        // Draw connections with brand secondary color (#9C8887)
        for (let j = i + 1; j < particles.length; j++) {
          const pt2 = particles[j];
          const dist = p.dist(pt.x, pt.y, pt2.x, pt2.y);
          if (dist < 130) {
            const alpha = p.map(dist, 0, 130, 160, 0);
            p.stroke(156, 136, 135, alpha);
            p.strokeWeight(1.2);
            p.line(pt.x, pt.y, pt2.x, pt2.y);
          }
        }
      }
    };

    p.windowResized = () => {
      if (container) {
        const { width, height } = getDimensions();
        p.resizeCanvas(width, height);
      }
    };
  };

  return new p5Class(sketch);
};


