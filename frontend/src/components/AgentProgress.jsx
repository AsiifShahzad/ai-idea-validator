import { useEffect, useState, useRef } from 'react';

const API_BASE = 'https://ideavalidator-8h1j.onrender.com';

const AGENT_STEPS = [
  { 
    id: 'classifier',
    label: 'Classifier',
    desc: 'Analyzing your idea and determining its category',
    details: 'Understanding if this is a business idea, dev project, research topic, content, product, or social impact initiative'
  },
  { 
    id: 'research',
    label: 'Research',
    desc: 'Gathering intelligence from multiple sources',
    details: 'Searching Reddit discussions, GitHub repositories, Google Trends, arXiv papers, news sites, and Product Hunt for related ideas'
  },
  { 
    id: 'demand_analyst',
    label: 'Demand Analysis',
    desc: 'Evaluating market demand and interest',
    details: 'Analyzing search trends and social mentions to assess how many people are interested in this idea'
  },
  { 
    id: 'competition_analyst',
    label: 'Competition Analysis',
    desc: 'Mapping existing solutions and competitors',
    details: 'Identifying similar existing projects and understanding the current competitive landscape'
  },
  { 
    id: 'risk_analyst',
    label: 'Risk Analysis',
    desc: 'Identifying potential failures and challenges',
    details: 'Evaluating technical, market, financial, and execution risks specific to your idea'
  },
  { 
    id: 'decision',
    label: 'Decision Engine',
    desc: 'Synthesizing all insights into a verdict',
    details: 'Combining all data points to generate a GO/MAYBE/NO-GO recommendation with confidence'
  },
  { 
    id: 'reflection',
    label: 'Quality Audit',
    desc: 'Verifying analysis completeness',
    details: 'Conducting a final review to ensure all factors were considered and results are reliable'
  },
];

export default function AgentProgress({ idea, onComplete }) {
  const [stepStatus, setStepStatus] = useState({});
  const [durations, setDurations]   = useState({});
  const [error, setError]           = useState('');
  const [done, setDone]             = useState(false);
  const startTimes                  = useRef({});
  const esRef                       = useRef(null);

  useEffect(() => {
    if (!idea) return;

    const initial = {};
    AGENT_STEPS.forEach(s => { initial[s.id] = 'pending'; });
    setStepStatus(initial);

    const encoded = encodeURIComponent(idea);
    const es      = new EventSource(`${API_BASE}/validate-idea/stream?idea=${encoded}`);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        const { agent, status, duration_ms } = data;

        if (status === 'pending') return;

        if (status === 'complete') {
          if (agent === 'pipeline') {
            setDone(true);
            fetch(`${API_BASE}/validate-idea`, {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({ idea }),
            })
              .then(r => r.json())
              .then(result => onComplete(result))
              .catch(err => setError('Failed to fetch result: ' + err.message));
            es.close();
            return;
          }

          setStepStatus(prev => ({ ...prev, [agent]: 'complete' }));
          setDurations(prev => ({ ...prev, [agent]: duration_ms || 0 }));

          const idx = AGENT_STEPS.findIndex(s => s.id === agent);
          if (idx >= 0 && idx + 1 < AGENT_STEPS.length) {
            setStepStatus(prev => ({ ...prev, [AGENT_STEPS[idx + 1].id]: 'running' }));
          }
        }

        if (status === 'error') {
          setError(data.error || 'Pipeline error');
          es.close();
        }
      } catch {}
    };

    es.onerror = () => {
      setError('Connection lost. Please try again.');
      es.close();
    };

    setStepStatus(prev => ({ ...prev, classifier: 'running' }));

    return () => es.close();
  }, [idea]);

  if (error) {
    return (
      <div style={{
        padding: '16px 20px', borderRadius: '10px',
        background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.3)',
        color: '#fb7185', fontSize: '14px',
      }}>
        ⚠ {error}
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em',
        textTransform: 'uppercase', color: '#06b6d4',
        marginBottom: '24px', fontFamily: "'DM Mono', monospace",
      }}>
        ⚡ Pipeline Running
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {AGENT_STEPS.map((step, i) => {
          const status = stepStatus[step.id] || 'pending';
          const isRunning  = status === 'running';
          const isComplete = status === 'complete';
          const isPending  = status === 'pending';

          return (
            <div key={step.id} style={{
              padding:      '16px',
              borderRadius: '10px',
              background:   isRunning ? 'rgba(6,182,212,0.08)' : isComplete ? 'rgba(52,211,153,0.04)' : 'rgba(15,23,42,0.5)',
              border:       `1px solid ${isRunning ? 'rgba(6,182,212,0.3)' : isComplete ? 'rgba(52,211,153,0.2)' : 'rgba(30,41,59,0.5)'}`,
              transition:   'all 0.3s ease',
              animation:    isRunning ? 'slideIn 0.4s ease-out' : 'none',
              transform:    isRunning ? 'translateX(0)' : 'translateX(0)',
            }}>
              {/* Top row with status and label */}
              <div style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '12px',
                marginBottom: '8px',
              }}>
                {/* Status indicator */}
                <div style={{
                  flexShrink: 0,
                  width:  '32px', height: '32px',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: '700',
                  background: isComplete ? 'rgba(52,211,153,0.2)'
                             : isRunning  ? 'rgba(6,182,212,0.2)'
                             : 'rgba(79,100,130,0.15)',
                  border: `2px solid ${isComplete ? '#34d399' : isRunning ? '#06b6d4' : '#4f6482'}`,
                  color: isComplete ? '#34d399' : isRunning ? '#06b6d4' : '#4f6482',
                  animation: isRunning ? 'pulse 1.5s ease-in-out infinite' : 'none',
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {isComplete ? '✓' : isRunning ? '⚙' : String(i + 1).padStart(2, '0')}
                </div>

                {/* Main label */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize:   '14px',
                    fontWeight: '700',
                    color:      isComplete ? '#94a3b8' : isRunning ? '#f8fafc' : '#4f6482',
                    fontFamily: "'DM Mono', monospace",
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    transition: 'color 0.3s',
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    fontSize:   '12px',
                    color:      isComplete ? '#4f6482' : isRunning ? '#06b6d4' : '#4f6482',
                    marginTop:  '2px',
                    transition: 'all 0.3s',
                  }}>
                    {step.desc}
                  </div>
                </div>

                {/* Duration badge */}
                {isComplete && durations[step.id] > 0 && (
                  <div style={{
                    flexShrink: 0,
                    fontSize: '10px', 
                    color: '#4f6482',
                    fontFamily: "'DM Mono', monospace",
                    background: 'rgba(79,100,130,0.1)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                  }}>
                    {durations[step.id]}ms
                  </div>
                )}
              </div>

              {/* Expanded details when running or complete */}
              {(isRunning || isComplete) && (
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid rgba(79,100,130,0.2)',
                  animation: 'expandIn 0.4s ease-out',
                }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#a5b4fc',
                    lineHeight: '1.6',
                  }}>
                    {step.details}
                  </div>
                  
                  {/* Show tools for research step */}
                  {step.id === 'research' && isRunning && (
                    <div style={{
                      marginTop: '10px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                    }}>
                      {['🔍 Web Search', '📰 News', '💬 Reddit', '📈 Trends', '📄 Papers', '💼 GitHub'].map((tool, j) => (
                        <div key={j} style={{
                          fontSize: '11px',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          background: 'rgba(6,182,212,0.15)',
                          border: '1px solid rgba(6,182,212,0.2)',
                          color: '#06b6d4',
                          animation: `bounce ${0.6 + j * 0.1}s ease-in-out infinite`,
                        }}>
                          {tool}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Progress bar for running step */}
              {isRunning && (
                <div style={{
                  marginTop: '12px',
                  height: '3px',
                  borderRadius: '2px',
                  background: 'rgba(6,182,212,0.1)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #06b6d4, #00d9ff, #06b6d4)',
                    borderRadius: '2px',
                    animation: 'slide 1.5s ease-in-out infinite',
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {done && (
        <div style={{
          marginTop: '24px', 
          padding: '16px',
          borderRadius: '10px', 
          background: 'rgba(52,211,153,0.1)',
          border: '1px solid rgba(52,211,153,0.3)',
          color: '#34d399', 
          fontSize: '13px', 
          textAlign: 'center',
          fontFamily: "'DM Mono', monospace",
          fontWeight: '600',
          animation: 'slideIn 0.5s ease-out',
        }}>
          ✓ Analysis Complete • Loading Results...
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        @keyframes slide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes expandIn {
          from { opacity: 0; max-height: 0; }
          to { opacity: 1; max-height: 200px; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(-4px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}