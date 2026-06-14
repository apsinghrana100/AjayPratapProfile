import React, { useEffect, useRef } from 'react';

export default function CursorSpotlight() {
    const cursorRef = useRef(null);
    const blurRef = useRef(null);
    const trailRef = useRef(null);

    // Mouse coordinates tracker
    const mouse = useRef({ x: -100, y: -100 });
    const lerpMouse = useRef({ x: -100, y: -100 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            // Instantly move the inner dot cursor
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Custom animation loop for lag (lerp) on outer circle and particle trails
    useEffect(() => {
        let animationId;
        const trailCanvas = trailRef.current;
        if (!trailCanvas) return;

        const ctx = trailCanvas.getContext('2d');
        let trailParticles = [];

        const setCanvasSize = () => {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        };
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);

        // Trail particle class
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = (Math.random() - 0.5) * 1.5;
                this.alpha = 1.0;
                this.radius = Math.random() * 3 + 1;
                this.color = Math.random() > 0.5 ? '#c7ff3d' : '#00f2fe';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= 0.035; // fade rate
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        const loop = () => {
            // Smoothly move outer blur circle with lerp
            const ease = 0.16;
            lerpMouse.current.x += (mouse.current.x - lerpMouse.current.x) * ease;
            lerpMouse.current.y += (mouse.current.y - lerpMouse.current.y) * ease;

            if (blurRef.current) {
                blurRef.current.style.left = `${lerpMouse.current.x}px`;
                blurRef.current.style.top = `${lerpMouse.current.y}px`;
            }

            // Draw particle trail on canvas
            ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

            // Spawn trail particles if mouse is moving
            if (mouse.current.x !== -100 && Math.random() > 0.4) {
                trailParticles.push(new Particle(mouse.current.x, mouse.current.y));
            }

            // Update & filter active trail particles
            trailParticles.forEach(p => p.update());
            trailParticles = trailParticles.filter(p => p.alpha > 0);
            trailParticles.forEach(p => p.draw());

            animationId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', setCanvasSize);
        };
    }, []);

    // Bind link hover triggers to expand cursor circles
    useEffect(() => {
        const handleMouseEnter = () => document.body.classList.add('cursor-hovering');
        const handleMouseLeave = () => document.body.classList.remove('cursor-hovering');

        const bindHovers = () => {
            const targets = document.querySelectorAll('a, button, .skill-card, .project-card, .fact-card, .social-icon, .dock-item');
            targets.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
                el.addEventListener('mouseenter', handleMouseEnter);
                el.addEventListener('mouseleave', handleMouseLeave);
            });
        };

        bindHovers();
        const interval = setInterval(bindHovers, 2000); // periodically re-bind dynamically generated elements

        return () => {
            clearInterval(interval);
            const targets = document.querySelectorAll('a, button, .skill-card, .project-card, .fact-card, .social-icon, .dock-item');
            targets.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    return (
        <>
            {/* Custom inner pointer dot */}
            <div id="custom-cursor" ref={cursorRef} />

            {/* Custom outer glowing halo */}
            <div id="cursor-blur-dot" ref={blurRef} />

            {/* Canvas trail for particles */}
            <canvas 
                ref={trailRef}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9997,
                    pointerEvents: 'none'
                }}
            />
        </>
    );
}
