import React, { useState, useRef, useEffect } from 'react';

export default function InteractiveTerminal() {
    const [inputVal, setInputVal] = useState('');
    const [lines, setLines] = useState([]);
    const terminalBodyRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom of console terminal on line updates
    useEffect(() => {
        if (terminalBodyRef.current) {
            terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
    }, [lines]);

    const handleContainerClick = () => {
        if (inputRef.current) inputRef.current.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const rawVal = inputVal;
            const cleanVal = rawVal.trim().toLowerCase();

            // Echo typed prompt command
            const newLines = [...lines, { text: `guest@ajay-dev:~$ ${rawVal}`, type: 'echo' }];

            if (cleanVal !== '') {
                const response = getCommandResponse(cleanVal);
                setLines([...newLines, ...response]);
            } else {
                setLines(newLines);
            }

            setInputVal('');
        }
    };

    const getCommandResponse = (cmd) => {
        switch (cmd) {
            case 'help':
                return [
                    { text: 'Available system commands:', type: 'system' },
                    { text: '  <span class="term-green">about</span>    - Direct description of my developer persona.', type: 'info' },
                    { text: '  <span class="term-green">skills</span>   - Check my technical competencies.', type: 'info' },
                    { text: '  <span class="term-green">projects</span> - List current featured software works.', type: 'info' },
                    { text: '  <span class="term-green">contact</span>  - Print direct links to emails & profiles.', type: 'info' },
                    { text: '  <span class="term-green">clear</span>    - Clear the current terminal buffer.', type: 'info' }
                ];
            case 'about':
                return [
                    { text: 'Ajay Pratap Singh - Node.js Developer & Full-Stack Engineer.', type: 'info' },
                    { text: 'Specialized in Express backend APIs, SQL/NoSQL databases, and robust micro-integrations.', type: 'info' }
                ];
            case 'skills':
                return [
                    { text: 'Primary Development Stack:', type: 'system' },
                    { text: '  Node.js        <span class="term-green">██████████</span> 100%', type: 'info' },
                    { text: '  Express.js     <span class="term-green">██████████</span> 100%', type: 'info' },
                    { text: '  SQL/Postgres   <span class="term-green">████████░░</span> 80%', type: 'info' },
                    { text: '  MongoDB        <span class="term-green">████████░░</span> 80%', type: 'info' },
                    { text: '  TypeScript     <span class="term-green">███████░░░</span> 70%', type: 'info' },
                    { text: '  React.js       <span class="term-green">███████░░░</span> 70%', type: 'info' }
                ];
            case 'projects':
                // Scroll down to projects section automatically
                setTimeout(() => {
                    const projectsSection = document.getElementById('projects');
                    if (projectsSection) {
                        projectsSection.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 400);

                return [
                    { text: 'Featured Portfolio Projects:', type: 'system' },
                    { text: '  1. <span class="term-highlight">AI Customer Support</span> [Node.js/React/OpenAI]', type: 'info' },
                    { text: '  2. <span class="term-highlight">AI Voice Chat</span> [React/WebRTC/AI Voice]', type: 'info' },
                    { text: '  3. <span class="term-highlight">AI Image Generator</span> [Python/TensorFlow/React]', type: 'info' },
                    { text: 'Opening projects section view...', type: 'green' }
                ];
            case 'contact':
                return [
                    { text: 'Direct Connection Coordinates:', type: 'system' },
                    { text: '  Email:    <a href="mailto:apsinghrana100@gmail.com" class="term-highlight">apsinghrana100@gmail.com</a>', type: 'info' },
                    { text: '  GitHub:   <a href="https://github.com/apsinghrana100" target="_blank" class="term-highlight">github.com/apsinghrana100</a>', type: 'info' },
                    { text: '  LinkedIn: <a href="https://linkedin.com/in/ajay-pratap-singh-883b44153" target="_blank" class="term-highlight">linkedin.com/ajay-pratap-singh</a>', type: 'info' }
                ];
            case 'clear':
                setLines([]);
                return [];
            default:
                return [
                    { text: `bash: command not found: ${cmd}. Type <span class="term-highlight">help</span> for assistance.`, type: 'error' }
                ];
        }
    };

    return (
        <div className="terminal-panel" onClick={handleContainerClick}>
            <div className="terminal-header">
                <span className="terminal-title">bash - guest@ajay-dev:~</span>
                <div className="terminal-controls">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className="terminal-body" ref={terminalBodyRef}>
                <div className="terminal-line">
                    <span className="term-welcome">System check... <span className="term-green">OK</span>. Type <span className="term-highlight">help</span> for commands.</span>
                </div>
                
                {lines.map((line, index) => (
                    <div 
                        key={index} 
                        className="terminal-line"
                        dangerouslySetInnerHTML={{ __html: line.text }}
                    />
                ))}

                <div className="terminal-line-input">
                    <span className="terminal-prompt">guest@ajay-dev:~$</span>
                    <input 
                        ref={inputRef}
                        type="text" 
                        id="terminal-input"
                        value={inputVal}
                        onChange={(e) => setInputVal(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoComplete="off" 
                        spellCheck="false" 
                        placeholder="..."
                    />
                </div>
            </div>
        </div>
    );
}
