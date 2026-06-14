import React, { useEffect, useRef, useState } from 'react';

export default function SkillsConstellation() {
    const canvasRef = useRef(null);
    const [hoveredNode, setHoveredNode] = useState(null);

    // Skills represented polar coordinates (r: fraction of radius, theta: angle in radians)
    const rawNodes = [
        { id: 'node', label: 'Node.js', r: 0, theta: 0, size: 26, color: '#c7ff3d', connections: ['express', 'sql', 'mongo', 'ts'], level: '100%' },
        { id: 'express', label: 'Express.js', r: 0.38, theta: -Math.PI / 4, size: 22, color: '#00f2fe', connections: ['node', 'mongo', 'aws'], level: '100%' },
        { id: 'react', label: 'React.js', r: 0.38, theta: Math.PI / 4, size: 22, color: '#00f2fe', connections: ['ts', 'express', 'node'], level: '70%' },
        { id: 'ts', label: 'TypeScript', r: 0.55, theta: Math.PI * 0.65, size: 20, color: '#7b2cff', connections: ['react', 'node', 'cpp'], level: '70%' },
        { id: 'mongo', label: 'MongoDB', r: 0.62, theta: -Math.PI * 0.75, size: 20, color: '#c7ff3d', connections: ['node', 'express', 'sql'], level: '80%' },
        { id: 'sql', label: 'SQL / Postgres', r: 0.42, theta: -Math.PI / 2, size: 22, color: '#00f2fe', connections: ['node', 'mongo', 'aws', 'docker'], level: '80%' },
        { id: 'aws', label: 'AWS Cloud', r: 0.75, theta: -Math.PI / 8, size: 20, color: '#7b2cff', connections: ['express', 'sql', 'docker'], level: '75%' },
        { id: 'docker', label: 'Docker', r: 0.72, theta: -Math.PI * 0.92, size: 18, color: '#7b2cff', connections: ['aws', 'sql'], level: '65%' },
        { id: 'cpp', label: 'C++ / Java', r: 0.68, theta: Math.PI * 0.88, size: 18, color: '#00f2fe', connections: ['ts'], level: '60%' }
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let radarSweepAngle = 0;
        let laserPackets = [];

        // Dynamic resize handler to fill the parent container
        const handleResize = () => {
            const rect = canvas.parentNode.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height || 380;
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        // Core conversion: polar parameters to absolute canvas coordinates
        const getPhysicalCoords = (node) => {
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const maxRadius = Math.min(canvas.width, canvas.height) * 0.85 / 2;

            return {
                x: cx + node.r * maxRadius * Math.cos(node.theta),
                y: cy + node.r * maxRadius * Math.sin(node.theta)
            };
        };

        // Laser signals flying on connection vectors
        class LaserPacket {
            constructor(startX, startY, endX, endY, color) {
                this.startX = startX;
                this.startY = startY;
                this.endX = endX;
                this.endY = endY;
                this.x = startX;
                this.y = startY;
                this.progress = 0;
                this.speed = Math.random() * 0.025 + 0.012;
                this.color = color;
            }

            update() {
                this.progress += this.speed;
                if (this.progress > 1) this.progress = 1;
                this.x = this.startX + (this.endX - this.startX) * this.progress;
                this.y = this.startY + (this.endY - this.startY) * this.progress;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // Mouse move listener
        let mouseX = null;
        let mouseY = null;

        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            let found = null;
            rawNodes.forEach(node => {
                const { x, y } = getPhysicalCoords(node);
                const dx = mouseX - x;
                const dy = mouseY - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < node.size + 12) {
                    found = node;
                }
            });
            setHoveredNode(found);
        };

        const handleMouseLeave = () => {
            mouseX = null;
            mouseY = null;
            setHoveredNode(null);
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        // Periodically trigger a data packet transfer
        const spawnInterval = setInterval(() => {
            const node = rawNodes[Math.floor(Math.random() * rawNodes.length)];
            if (!node.connections.length) return;
            const targetId = node.connections[Math.floor(Math.random() * node.connections.length)];
            const targetNode = rawNodes.find(n => n.id === targetId);

            if (node && targetNode) {
                const start = getPhysicalCoords(node);
                const end = getPhysicalCoords(targetNode);
                laserPackets.push(new LaserPacket(start.x, start.y, end.x, end.y, node.color));
            }
        }, 800);

        // Core rendering process
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const maxRadius = Math.min(canvas.width, canvas.height) * 0.85 / 2;

            // 1. Draw Radar Background Grids
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
            ctx.lineWidth = 1;

            // Concentric Rings
            [0.25, 0.5, 0.75, 1.0].forEach(factor => {
                ctx.beginPath();
                ctx.arc(cx, cy, maxRadius * factor, 0, Math.PI * 2);
                ctx.stroke();

                // Draw radar ring index values
                ctx.font = '7px monospace';
                ctx.fillStyle = 'rgba(0, 242, 254, 0.25)';
                ctx.fillText(`${Math.round(factor * 100)}m`, cx + 3, cy - maxRadius * factor + 8);
            });

            // Radial Crosshairs
            ctx.beginPath();
            ctx.moveTo(cx - maxRadius, cy);
            ctx.lineTo(cx + maxRadius, cy);
            ctx.moveTo(cx, cy - maxRadius);
            ctx.lineTo(cx, cy + maxRadius);
            ctx.stroke();

            // Diagonal dashed sweeps
            ctx.setLineDash([4, 6]);
            ctx.beginPath();
            ctx.moveTo(cx - maxRadius * 0.7, cy - maxRadius * 0.7);
            ctx.lineTo(cx + maxRadius * 0.7, cy + maxRadius * 0.7);
            ctx.moveTo(cx + maxRadius * 0.7, cy - maxRadius * 0.7);
            ctx.lineTo(cx - maxRadius * 0.7, cy + maxRadius * 0.7);
            ctx.stroke();
            ctx.setLineDash([]); // reset

            // 2. Draw Radar Scanning Sweep line
            radarSweepAngle += 0.006;
            if (radarSweepAngle > Math.PI * 2) radarSweepAngle -= Math.PI * 2;

            // Draw sweep wedge gradient
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(radarSweepAngle);
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
            gradient.addColorStop(0, 'rgba(0, 242, 254, 0.15)');
            gradient.addColorStop(0.3, 'rgba(0, 242, 254, 0.08)');
            gradient.addColorStop(1, 'rgba(0, 242, 254, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, maxRadius, -0.25, 0); // 15 degrees sweep width
            ctx.closePath();
            ctx.fill();

            // Leading beam line
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(maxRadius, 0);
            ctx.stroke();
            ctx.restore();

            // 3. Draw connection lines
            rawNodes.forEach(node => {
                const start = getPhysicalCoords(node);

                node.connections.forEach(connId => {
                    const connNode = rawNodes.find(n => n.id === connId);
                    if (connNode) {
                        const end = getPhysicalCoords(connNode);
                        const isHighlighted = hoveredNode && (hoveredNode.id === node.id || hoveredNode.id === connNode.id);

                        ctx.beginPath();
                        ctx.moveTo(start.x, start.y);
                        ctx.lineTo(end.x, end.y);

                        if (isHighlighted) {
                            ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
                            ctx.lineWidth = 1.5;
                        } else {
                            ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
                            ctx.lineWidth = 0.8;
                        }
                        ctx.stroke();
                    }
                });
            });

            // 4. Draw laser signals
            laserPackets.forEach(p => {
                p.update();
                p.draw();
            });
            laserPackets = laserPackets.filter(p => p.progress < 1);

            // 5. Draw tactical node targets
            rawNodes.forEach(node => {
                const { x, y } = getPhysicalCoords(node);
                const isHovered = hoveredNode && hoveredNode.id === node.id;
                const isNeighbor = hoveredNode && hoveredNode.connections.includes(node.id);

                // Outermost targeting reticle on hover
                if (isHovered) {
                    ctx.strokeStyle = node.color;
                    ctx.lineWidth = 1;
                    
                    // Pulsing targeting circle
                    ctx.beginPath();
                    const waveRadius = node.size + 10 + Math.sin(Date.now() * 0.01) * 3;
                    ctx.arc(x, y, waveRadius, 0, Math.PI * 2);
                    ctx.stroke();

                    // Corner indicators (crosshair marks)
                    ctx.beginPath();
                    ctx.moveTo(x - waveRadius - 4, y);
                    ctx.lineTo(x - waveRadius + 2, y);
                    ctx.moveTo(x + waveRadius + 4, y);
                    ctx.lineTo(x + waveRadius - 2, y);
                    ctx.moveTo(x, y - waveRadius - 4);
                    ctx.lineTo(x, y - waveRadius + 2);
                    ctx.moveTo(x, y + waveRadius + 4);
                    ctx.lineTo(x, y + waveRadius - 2);
                    ctx.stroke();
                }

                // Medium surrounding node ring
                ctx.beginPath();
                ctx.arc(x, y, node.size + (isHovered ? 4 : 0), 0, Math.PI * 2);
                ctx.strokeStyle = isHovered || isNeighbor ? node.color : 'rgba(255, 255, 255, 0.08)';
                ctx.lineWidth = isHovered ? 2 : 1;
                ctx.stroke();

                // Inner core node shape
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = isHovered || isNeighbor ? node.color : 'rgba(255, 255, 255, 0.35)';
                ctx.fill();

                // Draw label text in Space Grotesk / monospace style
                ctx.font = isHovered ? 'bold 11px monospace' : '9px monospace';
                ctx.fillStyle = isHovered || isNeighbor ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
                ctx.textAlign = 'center';
                ctx.fillText(node.label.toUpperCase(), x, y - node.size - 6);
            });

            animationId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationId);
            clearInterval(spawnInterval);
            window.removeEventListener('resize', handleResize);
        };
    }, [hoveredNode]);

    return (
        <div 
            style={{ 
                position: 'relative', 
                overflow: 'hidden', 
                width: '100%', 
                height: '100%',
                minHeight: '340px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(2, 4, 8, 0.3)'
            }}
        >
            <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
            
            {/* Tactical telemetry reporting box */}
            <div 
                style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '16px',
                    right: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.62rem',
                    color: 'rgba(0, 242, 254, 0.5)',
                    fontFamily: 'monospace',
                    pointerEvents: 'none',
                    borderTop: '1px solid rgba(0, 242, 254, 0.08)',
                    paddingTop: '6px'
                }}
            >
                {hoveredNode ? (
                    <>
                        <span>TARGET: <span style={{ color: hoveredNode.color, fontWeight: 'bold' }}>{hoveredNode.label.toUpperCase()}</span></span>
                        <span>REL_LATENCY: <span style={{ color: '#fff' }}>{(100 - parseFloat(hoveredNode.level)).toFixed(1)}ms</span></span>
                        <span>SIGNAL_STRENGTH: <span style={{ color: hoveredNode.color }}>{hoveredNode.level}</span></span>
                    </>
                ) : (
                    <span>ACTIVE RADAR SCREEN SWEEPING... (MOVE MOUSE OVER TARGETS)</span>
                )}
            </div>
        </div>
    );
}
