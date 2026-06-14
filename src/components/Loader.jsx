import React, { useEffect, useRef, useState } from 'react';

export default function Loader({ onComplete }) {
    const canvasRef = useRef(null);
    const [percentage, setPercentage] = useState(0);
    const [subtitle, setSubtitle] = useState('INITIATING CORE');

    const subtitles = [
        'INITIALIZING OS SYSTEM PROTOCOLS',
        'ESTABLISHING COGNITIVE NEURAL CONNECTIONS',
        'LOADING SKILLS CONSTELLATION MAPS',
        'COMPILING PERSONAL CREDENTIALS',
        'BOOTING JARVIS INTEGRATIONS',
        'SYNAPSE MATRIX CALIBRATION COMPLETE'
    ];

    // Percentage counter ticking up
    useEffect(() => {
        let currentPct = 0;
        const interval = setInterval(() => {
            currentPct += Math.floor(Math.random() * 4) + 1;
            if (currentPct >= 100) {
                currentPct = 100;
                clearInterval(interval);
            }
            setPercentage(currentPct);
            
            // Cycle subtitles based on progress percentage
            const subIdx = Math.floor((currentPct / 100) * subtitles.length);
            if (subtitles[subIdx]) {
                setSubtitle(subtitles[subIdx]);
            }
        }, 30);

        return () => clearInterval(interval);
    }, []);

    // 2D Text Particle Morphing Canvas Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let particles = [];
        let stage = 'morphing'; // morphing -> shattering -> done

        // Set canvas sizing
        canvas.width = 600;
        canvas.height = 150;

        // Particle Class definition
        class Particle {
            constructor(tx, ty) {
                // Spawn randomly on the screen
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.tx = tx; // target target-x
                this.ty = ty; // target target-y
                
                // Speed parameters
                this.vx = 0;
                this.vy = 0;
                
                // Visual traits
                this.radius = Math.random() * 1.5 + 0.5;
                this.color = `rgba(0, 242, 254, ${Math.random() * 0.7 + 0.3})`;
                
                // Bouncy factor for morph acceleration
                this.friction = 0.88;
                this.ease = 0.08;
            }

            update() {
                if (stage === 'morphing') {
                    // Gravitate to target text pixel positions
                    const dx = this.tx - this.x;
                    const dy = this.ty - this.y;
                    this.vx += dx * this.ease;
                    this.vy += dy * this.ease;
                    this.vx *= this.friction;
                    this.vy *= this.friction;
                    this.x += this.vx;
                    this.y += this.vy;
                } else if (stage === 'shattering') {
                    // Explode away from center
                    this.x += this.vx;
                    this.y += this.vy;
                    // Apply mock gravitational drift/fade
                    this.vy += 0.05; // gravity
                    this.radius *= 0.98; // shrink
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Draw offscreen text and read pixel positions
        function generateTextParticles(text) {
            const offscreen = document.createElement('canvas');
            const oCtx = offscreen.getContext('2d');
            offscreen.width = canvas.width;
            offscreen.height = canvas.height;

            oCtx.fillStyle = '#ffffff';
            oCtx.font = 'bold 36px "Space Grotesk"';
            oCtx.textAlign = 'center';
            oCtx.textBaseline = 'middle';
            oCtx.fillText(text, offscreen.width / 2, offscreen.height / 2);

            // Read image pixels
            const imgData = oCtx.getImageData(0, 0, offscreen.width, offscreen.height).data;
            const step = 4; // grid density
            const tempParticles = [];

            for (let y = 0; y < offscreen.height; y += step) {
                for (let x = 0; x < offscreen.width; x += step) {
                    const idx = (y * offscreen.width + x) * 4;
                    const alpha = imgData[idx + 3];
                    if (alpha > 128) {
                        tempParticles.push(new Particle(x, y));
                    }
                }
            }
            return tempParticles;
        }

        // Spawn initially
        particles = generateTextParticles('AJAY PRATAP SINGH');

        // Loop animation frame
        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Trigger shattering when percentage hits 100
            if (percentage === 100 && stage === 'morphing') {
                stage = 'shattering';
                
                // Push particles outwards like shattered shards
                particles.forEach(p => {
                    const cx = canvas.width / 2;
                    const cy = canvas.height / 2;
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    
                    // Shatter force vector
                    const force = (Math.random() * 8 + 3);
                    p.vx = (dx / dist) * force + (Math.random() - 0.5) * 2;
                    p.vy = (dy / dist) * force + (Math.random() - 0.5) * 2;
                    // Change colors to neon lime/violet shatter shards
                    p.color = Math.random() > 0.5 ? '#c7ff3d' : '#7b2cff';
                });

                // Complete load process after 1.2s of shatter explosion
                setTimeout(() => {
                    cancelAnimationFrame(animationId);
                    onComplete();
                }, 1200);
            }

            animationId = requestAnimationFrame(loop);
        }

        loop();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [percentage]);

    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <canvas ref={canvasRef} className="loader-canvas" />
                <div className="loader-content">
                    <div className="loader-subtitle">{subtitle}</div>
                    <div className="loader-bar-bg">
                        <div className="loader-bar" style={{ width: `${percentage}%` }} />
                    </div>
                    <div className="loader-percentage">{percentage}%</div>
                </div>
            </div>
        </div>
    );
}
