import React, { useState, useEffect, useRef } from 'react';

export default function HeroCard() {
    const cardRef = useRef(null);
    const [style, setStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
    const [reflection, setReflection] = useState({ opacity: 0, left: '0%', top: '0%' });

    // Live state calculations
    const [cpuLoad, setCpuLoad] = useState(38);
    const [memHeap, setMemHeap] = useState(144);
    const [networkPing, setNetworkPing] = useState(24);
    const [uptime, setUptime] = useState(0);
    const [systemState, setSystemState] = useState('ACTIVE'); // ACTIVE | STANDBY | EXTREME
    const [logs, setLogs] = useState([
        { time: 'T-00:00:15', msg: 'System check: OK', status: 'success' },
        { time: 'T-00:00:12', msg: 'WebGL particles running at 60 FPS', status: 'info' },
        { time: 'T-00:00:08', msg: 'Neural connections linked to cursor', status: 'info' },
        { time: 'T-00:00:03', msg: 'Port 3000 listening on address 127.0.0.1', status: 'success' },
        { time: 'T-00:00:01', msg: 'Jarvis core interface activated', status: 'success' },
    ]);
    const [visualizerHeights, setVisualizerHeights] = useState([40, 60, 20, 80, 50, 70, 30, 90, 40, 60, 30]);

    // Live clock timer
    useEffect(() => {
        const timer = setInterval(() => {
            setUptime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Fluctuating values simulations
    useEffect(() => {
        const statsInterval = setInterval(() => {
            setCpuLoad(prev => {
                const delta = Math.floor(Math.random() * 15) - 7;
                const next = prev + delta;
                return Math.max(10, Math.min(next, systemState === 'EXTREME' ? 98 : 75));
            });
            setNetworkPing(prev => {
                const delta = Math.floor(Math.random() * 8) - 4;
                const next = prev + delta;
                return Math.max(12, Math.min(next, 95));
            });
            setMemHeap(prev => {
                const delta = Math.floor(Math.random() * 6) - 3;
                const next = prev + delta;
                return Math.max(120, Math.min(next, 256));
            });
        }, 1200);

        return () => clearInterval(statsInterval);
    }, [systemState]);

    // Bouncing visualizer frequencies
    useEffect(() => {
        const visInterval = setInterval(() => {
            setVisualizerHeights(
                Array.from({ length: 11 }, () => Math.floor(Math.random() * 85) + 15)
            );
        }, 160);
        return () => clearInterval(visInterval);
    }, []);

    // Random incoming connection log generator
    useEffect(() => {
        const logTemplates = [
            { msg: 'DB query: SELECT * FROM skills; [OK 4ms]', status: 'info' },
            { msg: 'API hit: GET /api/v1/projects - 200 OK', status: 'success' },
            { msg: 'Interactive spotlight mask shifted', status: 'info' },
            { msg: 'Theme caching updated successfully', status: 'success' },
            { msg: 'Est. socket connection client ID: dev_node', status: 'success' },
            { msg: 'Canvas gravity attractors recalibrated', status: 'info' },
            { msg: 'Responsive viewframe coordinates queried', status: 'info' },
        ];

        const logInterval = setInterval(() => {
            if (systemState === 'STANDBY') return;
            
            const randomTemplate = logTemplates[Math.floor(Math.random() * logTemplates.length)];
            const stamp = new Date().toLocaleTimeString().split(' ')[0];
            
            setLogs(prev => [
                ...prev.slice(-4),
                { time: stamp, msg: randomTemplate.msg, status: randomTemplate.status }
            ]);
        }, 5000);

        return () => clearInterval(logInterval);
    }, [systemState]);

    // Uptime formatter helper
    const formatUptime = (secs) => {
        const h = Math.floor(secs / 3600).toString().padStart(2, '0');
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    // 3D Tilt math handlers
    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = x / rect.width;
        const py = y / rect.height;

        const rotateX = (0.5 - py) * 16;
        const rotateY = (px - 0.5) * 16;

        setStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`
        });

        setReflection({
            opacity: 0.2,
            left: `${px * 100}%`,
            top: `${py * 100}%`
        });
    };

    const handleMouseLeave = () => {
        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
        });
        setReflection({
            opacity: 0,
            left: '50%',
            top: '50%'
        });
    };

    // Action handlers
    const handleTriggerAlert = () => {
        setSystemState('EXTREME');
        setCpuLoad(95);
        setNetworkPing(140);
        const stamp = new Date().toLocaleTimeString().split(' ')[0];
        
        setLogs(prev => [
            ...prev,
            { time: stamp, msg: '⚠️ WARNING: CORE STRESS SIMULATOR INITIALIZED', status: 'error' },
            { time: stamp, msg: '⚠️ ALERT: SYSTEM LOAD LEVEL EXCEEDED 90%', status: 'error' }
        ]);

        setTimeout(() => {
            setSystemState('ACTIVE');
            setCpuLoad(45);
            setNetworkPing(28);
        }, 5000);
    };

    const handleClearLogs = () => {
        const stamp = new Date().toLocaleTimeString().split(' ')[0];
        setLogs([
            { time: stamp, msg: 'Console buffer log flushed.', status: 'info' }
        ]);
    };

    const toggleStandby = () => {
        setSystemState(prev => prev === 'STANDBY' ? 'ACTIVE' : 'STANDBY');
    };

    return (
        <div className="profile-visual">
            <div 
                ref={cardRef}
                className={`build-card 3d-card cyber-deck-card ${systemState === 'EXTREME' ? 'extreme-mode' : ''}`}
                style={style}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Shiny reflection overlay */}
                <div 
                    className="card-reflection"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.3) 0%, transparent 60%)',
                        opacity: reflection.opacity,
                        left: reflection.left,
                        top: reflection.top,
                        pointerEvents: 'none',
                        zIndex: 3,
                        transform: 'translate(-50%, -50%)',
                        width: '200%',
                        height: '200%',
                        transition: 'opacity 0.2s ease'
                    }}
                />

                {/* Top Title Banner */}
                <div className="deck-header">
                    <div className="build-card-top">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="deck-title-area">
                        <span className="deck-tag">AJAY-DECK v5.8</span>
                        <div className="deck-indicator">
                            <span className={`status-pulse-dot ${systemState.toLowerCase()}`} />
                            <span className="status-text">{systemState}</span>
                        </div>
                    </div>
                </div>

                {/* Live System Diagnostics Dashboard */}
                <div className="deck-diagnostics">
                    
                    <div className="diag-row">
                        <div className="diag-label">
                            <span>CPU LOAD</span>
                            <span className="diag-val">{cpuLoad}%</span>
                        </div>
                        <div className="cyber-progress-bg">
                            <div 
                                className="cyber-progress-fill primary-fill" 
                                style={{ width: `${cpuLoad}%`, transition: 'width 0.8s ease' }} 
                            />
                        </div>
                    </div>

                    <div className="diag-row">
                        <div className="diag-label">
                            <span>MEM ALLOCATION</span>
                            <span className="diag-val">{memHeap}MB / 512MB</span>
                        </div>
                        <div className="cyber-progress-bg">
                            <div 
                                className="cyber-progress-fill secondary-fill" 
                                style={{ width: `${(memHeap / 512) * 100}%`, transition: 'width 0.8s ease' }} 
                            />
                        </div>
                    </div>

                    <div className="diag-row">
                        <div className="diag-label">
                            <span>LATENCY</span>
                            <span className="diag-val">{networkPing} ms</span>
                        </div>
                        <div className="cyber-progress-bg">
                            <div 
                                className="cyber-progress-fill accent-fill" 
                                style={{ width: `${Math.min(networkPing, 100)}%`, transition: 'width 0.8s ease' }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Audio visualizer / frequency spectrum simulator */}
                <div className="frequency-visualizer-container">
                    <span className="visualizer-title">CORE HARMONIC SPECTRUM</span>
                    <div className="frequency-bars">
                        {visualizerHeights.map((h, i) => (
                            <div 
                                key={i} 
                                className="freq-bar" 
                                style={{ 
                                    height: `${h}%`,
                                    background: i % 3 === 0 
                                        ? 'var(--primary-color)' 
                                        : i % 3 === 1 
                                            ? 'var(--secondary-color)' 
                                            : 'var(--accent-color)'
                                }} 
                            />
                        ))}
                    </div>
                </div>

                {/* Terminal Feed logs */}
                <div className="terminal-feed-block">
                    <div className="feed-header">
                        <span>OPERATIONS LOG</span>
                        <span className="feed-uptime">UPTIME: {formatUptime(uptime)}</span>
                    </div>
                    <div className="feed-lines-box">
                        {logs.map((log, index) => (
                            <div key={index} className={`feed-line-row ${log.status}`}>
                                <span className="feed-time">[{log.time}]</span>
                                <span className="feed-msg">{log.msg}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Interactive controller button cluster */}
                <div className="deck-controller-row">
                    <button className="deck-btn sec-btn" onClick={toggleStandby}>
                        {systemState === 'STANDBY' ? 'ACTIVATE' : 'STANDBY'}
                    </button>
                    <button className="deck-btn" onClick={handleClearLogs}>
                        FLUSH LOGS
                    </button>
                    <button className="deck-btn alert-trigger-btn" onClick={handleTriggerAlert}>
                        STRESS TEST
                    </button>
                </div>
            </div>
        </div>
    );
}
