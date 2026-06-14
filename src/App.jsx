import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';
import HeroCanvas from './components/HeroCanvas';
import CursorSpotlight from './components/CursorSpotlight';
import InteractiveTerminal from './components/InteractiveTerminal';
import HeroCard from './components/HeroCard';
import SkillsConstellation from './components/SkillsConstellation';
import ExperienceTimeline from './components/ExperienceTimeline';
import ProjectsShowcase from './components/ProjectsShowcase';
import ContactForm from './components/ContactForm';
import { Maximize2, Minimize2, Database, Cpu, Route, Mail, User, Sun, Moon, Info } from 'lucide-react';

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState('dark');
    const [focusedPanel, setFocusedPanel] = useState(null); // null | 'diagnostics' | 'skills' | 'archives' | 'comms'
    const [archiveTab, setArchiveTab] = useState('projects'); // 'projects' | 'experience'

    // Theme toggler function
    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
    };

    // Load initial theme cache
    useEffect(() => {
        const cached = localStorage.getItem('theme') || 'dark';
        setTheme(cached);
        document.documentElement.setAttribute('data-theme', cached);
    }, []);

    if (isLoading) {
        return <Loader onComplete={() => setIsLoading(false)} />;
    }

    const toggleFocus = (panelName) => {
        if (focusedPanel === panelName) {
            setFocusedPanel(null);
        } else {
            setFocusedPanel(panelName);
        }
    };

    return (
        <>
            {/* 3D WebGL holographic central wireframe backdrop */}
            <HeroCanvas isFocused={focusedPanel !== null} />

            {/* Mouse spotlight reveal halo filter */}
            <CursorSpotlight />

            <div className="site-frame" aria-hidden="true" />

            {/* Futuristic Sci-Fi Operations Workspace */}
            <div className={`main-layout ${focusedPanel ? 'has-focus' : ''}`}>
                
                {/* Fixed left panel: Biometrics, Stats & Terminal */}
                <aside className="left-panel-deck">
                    <header className="panel-header-deck">
                        <div className="logo-deck">Ajay<span>/</span>dev<span>_</span>os</div>
                        <div className="status-badge-inline">
                            <div className="status-dot" />
                            <span>CORES ONLINE</span>
                        </div>
                    </header>

                    {/* Bio Block */}
                    <div className="hud-panel bio-panel">
                        <div className="hud-header">
                            <span className="hud-marker">//</span>
                            <span className="hud-title">SYS_BIOMETRIC_DATA</span>
                        </div>
                        <div className="hud-body">
                            <div className="bio-summary">
                                <span className="hero-tagline-deck">Full-Stack Developer</span>
                                <h1 className="name-title">Ajay Singh</h1>
                                <p className="bio-desc">
                                    I engineer high-performance backend systems, REST APIs, and database structures. 
                                    Specialized in Node.js, Express, and cloud architecture.
                                </p>
                            </div>
                            <div className="quick-spec-grid">
                                <div className="spec-item">
                                    <span className="spec-lbl">XP LEVEL</span>
                                    <span className="spec-val">2+ YRS</span>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-lbl">API SPEED</span>
                                    <span className="spec-val">&lt; 15MS</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Command terminal simulator */}
                    <div className="hud-panel terminal-panel-wrapper">
                        <div className="hud-header">
                            <span className="hud-marker">//</span>
                            <span className="hud-title">INTERACTIVE_BASH_SHELL</span>
                        </div>
                        <div className="hud-body-terminal">
                            <InteractiveTerminal />
                        </div>
                    </div>
                </aside>

                {/* Right Workspace Grid: 4 Quadrants */}
                <main className="right-grid-deck">
                    
                    {/* Quadrant 1: System Diagnostics */}
                    <section 
                        className={`hud-panel grid-panel diagnostics-sec ${focusedPanel === 'diagnostics' ? 'focused-zoom' : ''} ${focusedPanel && focusedPanel !== 'diagnostics' ? 'panel-shrouded' : ''}`}
                    >
                        <div className="hud-header">
                            <div className="hud-header-left">
                                <span className="hud-marker">//</span>
                                <span className="hud-title">SYSTEM_DIAGNOSTICS</span>
                            </div>
                            <button className="hud-action-btn" onClick={() => toggleFocus('diagnostics')} aria-label="Toggle Panel Zoom">
                                {focusedPanel === 'diagnostics' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                            </button>
                        </div>
                        <div className="hud-body scroll-y">
                            <HeroCard />
                        </div>
                    </section>

                    {/* Quadrant 2: Skills Radar Map */}
                    <section 
                        className={`hud-panel grid-panel skills-sec ${focusedPanel === 'skills' ? 'focused-zoom' : ''} ${focusedPanel && focusedPanel !== 'skills' ? 'panel-shrouded' : ''}`}
                    >
                        <div className="hud-header">
                            <div className="hud-header-left">
                                <span className="hud-marker">//</span>
                                <span className="hud-title">RADAR_STACK_EXPLORER</span>
                            </div>
                            <button className="hud-action-btn" onClick={() => toggleFocus('skills')} aria-label="Toggle Panel Zoom">
                                {focusedPanel === 'skills' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                            </button>
                        </div>
                        <div className="hud-body radar-canvas-body">
                            <SkillsConstellation />
                        </div>
                    </section>

                    {/* Quadrant 3: Data Archives (Projects + Experience Journey Tabs) */}
                    <section 
                        className={`hud-panel grid-panel archives-sec ${focusedPanel === 'archives' ? 'focused-zoom' : ''} ${focusedPanel && focusedPanel !== 'archives' ? 'panel-shrouded' : ''}`}
                    >
                        <div className="hud-header">
                            <div className="hud-header-left">
                                <span className="hud-marker">//</span>
                                <div className="hud-tabs">
                                    <button 
                                        className={`hud-tab-btn ${archiveTab === 'projects' ? 'active' : ''}`} 
                                        onClick={() => setArchiveTab('projects')}
                                    >
                                        PROJECTS_DB
                                    </button>
                                    <button 
                                        className={`hud-tab-btn ${archiveTab === 'experience' ? 'active' : ''}`} 
                                        onClick={() => setArchiveTab('experience')}
                                    >
                                        JOURNEY_LOG
                                    </button>
                                </div>
                            </div>
                            <button className="hud-action-btn" onClick={() => toggleFocus('archives')} aria-label="Toggle Panel Zoom">
                                {focusedPanel === 'archives' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                            </button>
                        </div>
                        <div className="hud-body scroll-y">
                            {archiveTab === 'projects' ? (
                                <ProjectsShowcase />
                            ) : (
                                <ExperienceTimeline />
                            )}
                        </div>
                    </section>

                    {/* Quadrant 4: Secure Uplink Comms Form */}
                    <section 
                        className={`hud-panel grid-panel comms-sec ${focusedPanel === 'comms' ? 'focused-zoom' : ''} ${focusedPanel && focusedPanel !== 'comms' ? 'panel-shrouded' : ''}`}
                    >
                        <div className="hud-header">
                            <div className="hud-header-left">
                                <span className="hud-marker">//</span>
                                <span className="hud-title">SECURE_COMMS_UPLINK</span>
                            </div>
                            <button className="hud-action-btn" onClick={() => toggleFocus('comms')} aria-label="Toggle Panel Zoom">
                                {focusedPanel === 'comms' ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                            </button>
                        </div>
                        <div className="hud-body scroll-y">
                            <ContactForm />
                        </div>
                    </section>
                </main>
            </div>

            {/* Bottom floating dock menu for global operations */}
            <nav className="navbar-dock" id="navbar-dock">
                <button 
                    className={`dock-item ${focusedPanel === 'diagnostics' ? 'active' : ''}`} 
                    onClick={() => toggleFocus('diagnostics')}
                    data-tooltip="Diagnostics"
                >
                    <Cpu size={18} />
                </button>
                <button 
                    className={`dock-item ${focusedPanel === 'skills' ? 'active' : ''}`} 
                    onClick={() => toggleFocus('skills')}
                    data-tooltip="Radar Map"
                >
                    <Database size={18} />
                </button>
                <button 
                    className={`dock-item ${focusedPanel === 'archives' ? 'active' : ''}`} 
                    onClick={() => {
                        setArchiveTab('projects');
                        toggleFocus('archives');
                    }}
                    data-tooltip="Projects"
                >
                    <Info size={18} />
                </button>
                <button 
                    className={`dock-item ${focusedPanel === 'comms' ? 'active' : ''}`} 
                    onClick={() => toggleFocus('comms')}
                    data-tooltip="Uplink Form"
                >
                    <Mail size={18} />
                </button>
                <button 
                    className="dock-item" 
                    id="theme-toggle" 
                    onClick={toggleTheme}
                    aria-label="Toggle Theme"
                    data-tooltip="Toggle Mode"
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                </button>
            </nav>
        </>
    );
}
