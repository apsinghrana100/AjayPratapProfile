import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Shield, Cpu, Link2, GitBranch } from 'lucide-react';

const projects = [
    {
        title: 'AI Customer Support',
        sector: 'SEC_01_AI_SUPPORT',
        status: 'DEPLOYED',
        linesOfCode: '2,140 LOC',
        description: 'Intelligent customer support agent utilizing natural language processing to resolve queries, manage tickets, and streamline communication.',
        tech: ['Node.js', 'React', 'OpenAI', 'Express'],
        demo: '#',
        github: 'https://github.com/apsinghrana100/ai-customer-support.git'
    },
    {
        title: 'AI Voice Chat',
        sector: 'SEC_02_VOICE_AI',
        status: 'ACTIVE',
        linesOfCode: '3,850 LOC',
        description: 'Real-time live communication platform featuring AI-powered voice chat, natural language understanding, and dynamic response generation.',
        tech: ['React', 'WebRTC', 'AI Voice', 'Socket.io'],
        demo: '#',
        github: 'https://github.com/apsinghrana100/Ai-live-communication.git'
    },
    {
        title: 'AI Image Generator',
        sector: 'SEC_03_CV_GEN',
        status: 'COMPILED',
        linesOfCode: '4,200 LOC',
        description: 'Advanced computer vision application for synthesizing and fusing HDR images using generative AI and deep learning models.',
        tech: ['Python', 'TensorFlow', 'React', 'Node.js'],
        demo: '#',
        github: 'https://github.com/apsinghrana100/fusion_hdr_image.git'
    }
];

export default function ProjectsShowcase() {
    return (
        <div className="projects-hud-grid">
            {projects.map((project, index) => {
                const cardVariants = {
                    hidden: { opacity: 0, scale: 0.95 },
                    visible: { 
                        opacity: 1, 
                        scale: 1,
                        transition: { type: 'spring', stiffness: 80, damping: 15, delay: index * 0.12 }
                    }
                };

                return (
                    <motion.div 
                        key={index} 
                        className="project-cyber-card"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-20px' }}
                        variants={cardVariants}
                    >
                        {/* Scanning scanner line overlay */}
                        <div className="project-grid-scanline" />

                        {/* Top panel row info */}
                        <div className="project-cyber-header">
                            <span className="sec-tag-mon"><Terminal size={10} style={{ marginRight: '4px' }} />{project.sector}</span>
                            <span className={`status-badge-mon ${project.status.toLowerCase()}`}>{project.status}</span>
                        </div>

                        {/* Middle info */}
                        <div className="project-cyber-body">
                            <h3 className="project-cyber-title">{project.title.toUpperCase()}</h3>
                            <p className="project-cyber-desc">{project.description}</p>
                            
                            {/* Visual metrics bar */}
                            <div className="project-metrics-row">
                                <div className="metric-cell">
                                    <span className="metric-lbl">METRIC:</span>
                                    <span className="metric-val">{project.linesOfCode}</span>
                                </div>
                                <div className="metric-cell">
                                    <span className="metric-lbl">UPLINK:</span>
                                    <span className="metric-val">STABLE</span>
                                </div>
                            </div>

                            <div className="project-cyber-tech">
                                {project.tech.map((t, idx) => (
                                    <span key={idx} className="tech-chip-mon">{t}</span>
                                ))}
                            </div>
                        </div>

                        {/* Bottom links row */}
                        <div className="project-cyber-footer">
                            {project.demo !== '#' ? (
                                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="cyber-link-btn primary-btn">
                                    <Link2 size={12} />
                                    <span>RUN_DEMO</span>
                                </a>
                            ) : (
                                <span className="cyber-link-btn disabled-btn">
                                    <Shield size={12} />
                                    <span>RESTRICTED</span>
                                </span>
                            )}
                            {project.github !== '#' && (
                                <a href={project.github} target="_blank" rel="noopener noreferrer" className="cyber-link-btn">
                                    <GitBranch size={12} />
                                    <span>CLONE_SRC</span>
                                </a>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
