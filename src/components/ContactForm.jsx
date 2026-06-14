import React, { useState } from 'react';

export default function ContactForm() {
    const [status, setStatus] = useState('idle'); // idle | sending | sent

    const handleSubmit = (e) => {
        // We allow the browser to post to FormSubmit action URL,
        // but we show a loading indicator on click.
        setStatus('sending');
    };

    return (
        <div className="contact-container">
            {/* Animated neon energy ring inside contact frame */}
            <div 
                className="energy-ring"
                style={{
                    position: 'absolute',
                    inset: '-2px',
                    borderRadius: 'inherit',
                    background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color), var(--accent-color), var(--primary-color))',
                    zIndex: -1,
                    opacity: 0.15,
                    filter: 'blur(3px)',
                    animation: 'spin 6s linear infinite',
                    pointerEvents: 'none'
                }}
            />

            <form 
                id="contact-form" 
                action="https://formsubmit.co/apsinghrana100@gmail.com" 
                method="POST"
                onSubmit={handleSubmit}
            >
                {/* FormSubmit configurations */}
                <input type="hidden" name="_subject" value="New portfolio message from Ajay.dev" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input type="text" name="_honey" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
                
                <div className="form-group">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        className="form-input" 
                        placeholder="Your Name" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        className="form-input" 
                        placeholder="your.email@example.com" 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea 
                        id="message" 
                        name="message" 
                        className="form-textarea" 
                        placeholder="How can I help you?" 
                        required 
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="submit-btn" 
                    id="submit-btn"
                    disabled={status === 'sending'}
                >
                    {status === 'sending' ? 'Dispatching Message...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
}
