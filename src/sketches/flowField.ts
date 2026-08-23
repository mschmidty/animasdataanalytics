import type p5 from 'p5';

export const initFlowField = (p5Class: typeof p5, container: HTMLElement) => {
  let resizeObserver: ResizeObserver | null = null;

  const sketch = (p: p5) => {
    let particles: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    let currentWidth = 0;
    let currentHeight = 0;

    const getDimensions = () => {
      const rect = container.getBoundingClientRect();
      const width = Math.floor(rect.width || container.clientWidth || window.innerWidth);
      const height = Math.floor(rect.height || container.clientHeight || 500);
      return { width, height };
    };

    const getTargetParticleCount = (width: number, height: number) => {
      // Dynamic particle count based on canvas area to maintain consistent density (+15% points)
      // Wider screens get more dots, smaller screens get fewer dots
      const count = Math.round(((width * height) / 7500) * 1.15);
      return Math.max(29, Math.min(230, count));
    };

    const updateParticles = (width: number, height: number) => {
      const targetCount = getTargetParticleCount(width, height);

      // Reposition any existing particles that are now out of bounds
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        if (pt.x > width) pt.x = p.random(width);
        if (pt.y > height) pt.y = p.random(height);
      }

      // Add particles if screen expanded
      while (particles.length < targetCount) {
        particles.push({
          x: p.random(width),
          y: p.random(height),
          vx: p.random(-0.8, 0.8),
          vy: p.random(-0.8, 0.8),
        });
      }

      // Trim particles if screen shrank
      if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    };

    const handleResize = () => {
      if (!container) return;
      const { width, height } = getDimensions();
      if (width <= 0 || height <= 0) return;
      if (width === currentWidth && height === currentHeight) return;

      currentWidth = width;
      currentHeight = height;
      p.resizeCanvas(width, height);
      updateParticles(width, height);
    };

    p.setup = () => {
      const { width, height } = getDimensions();
      currentWidth = width;
      currentHeight = height;
      const canvas = p.createCanvas(width, height);
      canvas.parent(container);
      p.pixelDensity(1);

      particles = [];
      updateParticles(width, height);

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          handleResize();
        });
        resizeObserver.observe(container);
      }
    };

    p.draw = () => {
      p.clear();

      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;

        // Bounce off canvas boundaries and keep particles in-bounds
        if (pt.x <= 0) {
          pt.x = 0;
          pt.vx = Math.abs(pt.vx);
        } else if (pt.x >= p.width) {
          pt.x = p.width;
          pt.vx = -Math.abs(pt.vx);
        }

        if (pt.y <= 0) {
          pt.y = 0;
          pt.vy = Math.abs(pt.vy);
        } else if (pt.y >= p.height) {
          pt.y = p.height;
          pt.vy = -Math.abs(pt.vy);
        }

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
      handleResize();
    };
  };

  const instance = new p5Class(sketch);
  const originalRemove = instance.remove.bind(instance);
  instance.remove = () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    originalRemove();
  };

  return instance;
};



