class ParticleEffectSystem {

    constructor() {
        this.particleEffects = [];

    }

    update() {
        for (let i = 0; i < this.particleEffects.length; i++) {
            const particleEffect = this.particleEffects[i];

            // Update position of each particle in particle effect
            for (let j = 0; j < particleEffect.particles.length; j++) {
                const particle = particleEffect.particles[j];

                // Update position
                particle.x += particle.xSpeed;
                particle.y += particle.ySpeed;

                // Reduce particle size
                particle.size -= particle.sizeDecrement;

                // Remove particles that are too small
                if (particle.size < 0.1) {
                    particleEffect.particles.splice(j, 1);
                    j--;
                }
            }

            // Remove particle effects with no particles
            if (particleEffect.particles.length == 0) {
                this.particleEffects.splice(i, 1);
                i--;
            }
        }
    }

    draw(ctx) {
        for (let i = 0; i < this.particleEffects.length; i++) {
            const particleEffect = this.particleEffects[i];

            // Draw each particle in particle effect
            for (let j = 0; j < particleEffect.particles.length; j++) {
                const particle = particleEffect.particles[j];

                ctx.fillStyle = particle.color;
                ctx.fillRect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
            }
        }
    }

    createParticleEffect(x, y, particleCount, particleSize, particleColor, xSpeed, ySpeed, sizeDecrement) {
        const particles = [];

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x: x,
                y: y,
                xSpeed: (Math.random() - 0.5) * xSpeed,
                ySpeed: (Math.random() - 0.5) * ySpeed,
                size: particleSize,
                sizeDecrement: sizeDecrement,
                color: particleColor
            };
            particles.push(particle);
        }

        // Add particle effect to particle effect system
        this.particleEffects.push({
            particles: particles
        });
    }

    //create particle effect but have a parameter for x direction and y direction

    createParticleEffectX(x, y, particleCount, particleSize, particleColor, xSpeed, ySpeed, sizeDecrement, xDirection, yDirection) {
        const particles = [];
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x: x,
                y: y,
                xSpeed: (Math.random()) * xSpeed * xDirection,
                ySpeed: (Math.random()) * ySpeed * yDirection,
                size: particleSize,
                sizeDecrement: sizeDecrement,
                color: particleColor
            };
            particles.push(particle);
        }

        // Add particle effect to particle effect system
        this.particleEffects.push({
            particles: particles
        });
    }
}



    // Example usage:
   //  params.PARTICLE_SYSTEM.createParticleEffect(x, y, particleCount, particleSize, color, xSpeed, ySpeed, timeAlive);
    // The above code would create a particle effect at (100, 100) with 50 particles of size 5, red color,
    // x speed between -10 and 10, y speed between -10 and 10, and a size decrement of 0.1 per frame.
