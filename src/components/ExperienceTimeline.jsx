import React from 'react';
import { motion } from 'framer-motion';

const timelineStages = [
    {
        role: 'AI Engineer & Freelancer',
        company: 'Remote Backend Development',
        date: 'Aug 2024 - Present',
        summary: 'Architecting scalable server pipelines, payment gateways, AWS integrations, and prompt engineering hooks. Optimizing API route logic for LLM modules.',
        stage: 'AI Engineer',
        icon: 'fa-brain',
        color: '#c7ff3d'
    },
    {
        role: 'Full Stack Trainee',
        company: 'Barone Budge & Dominick (BBD), Pune',
        date: 'Jan 2024 - July 2024',
        summary: 'Co-developed Vodacom B2B client dashboard components. Tuned PostgreSQL database indexes, implemented JWT route locks, and built React layouts.',
        stage: 'Full Stack Engineer',
        icon: 'fa-route',
        color: '#00f2fe'
    },
    {
        role: 'Web Development Trainee',
        company: 'Sharpener.tech Academy',
        date: 'Sep 2022 - Oct 2023',
        summary: 'Mastered Node.js, Express endpoints, MVC architecture, SQL nodes, and WebSocket interactions (chatrooms, multi-user apps).',
        stage: 'Developer',
        icon: 'fa-code',
        color: '#7b2cff'
    },
    {
        role: 'MCA & BCA Student',
        company: 'Veer Narmad South Gujarat University',
        date: '2016 - 2022',
        summary: 'Acquired core theoretical knowledge in operating systems, database management systems, data structures, and computer networking.',
        stage: 'Student',
        icon: 'fa-user-graduate',
        color: '#9ca3af'
    }
];

export default function ExperienceTimeline() {
    return (
        <div className="timeline">
            {timelineStages.map((item, index) => {
                const isEven = index % 2 === 0;

                // Motion animation configs
                const cardVariants = {
                    hidden: { opacity: 0, x: isEven ? 50 : -50, y: 15 },
                    visible: { 
                        opacity: 1, 
                        x: 0, 
                        y: 0,
                        transition: { type: 'spring', stiffness: 50, damping: 15 }
                    }
                };

                return (
                    <motion.div 
                        key={index} 
                        className="timeline-item"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={cardVariants}
                    >
                        {/* Connected circular nodes */}
                        <div 
                            className="timeline-dot" 
                            style={{ borderColor: item.color }}
                        />

                        {/* Story stage card */}
                        <div className="timeline-content">
                            <span 
                                className="timeline-date" 
                                style={{ background: `rgba(255,255,255,0.02)`, color: item.color, border: `1px solid ${item.color}33` }}
                            >
                                {item.date}
                            </span>
                            
                            <h3 className="timeline-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <i className={`fas ${item.icon}`} style={{ color: item.color, fontSize: '0.95rem' }} />
                                {item.role}
                            </h3>
                            
                            <div className="timeline-subtitle">{item.company}</div>
                            
                            <p>{item.summary}</p>

                            {/* Stylized Stage indicator badge */}
                            <div 
                                style={{
                                    position: 'absolute',
                                    bottom: '12px',
                                    right: '15px',
                                    fontSize: '0.55rem',
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.15em',
                                    color: `${item.color}88`
                                }}
                            >
                                STAGE: {item.stage}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
