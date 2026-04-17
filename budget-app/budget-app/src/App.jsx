import React, { useState } from 'react';
import './index.css';
import PersonPage from './components/PersonPage';
import CommunPage from './components/CommunPage';
import { useAppState } from './hooks/useAppState';

const TABS = [
  { id: 'alex', label: 'Alex', icon: '👤' },
  { id: 'aurelie', label: 'Aurélie', icon: '👤' },
  { id: 'commun', label: 'Commun', icon: '♡' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('alex');
  const { state, save } = useAppState();

  function updatePerson(person, newData) {
    save(prev => ({ ...prev, [person]: newData }));
  }

  function updateCommun(newData) {
    save(prev => ({ ...prev, commun: newData }));
  }

  return (
    <>
      {activeTab === 'alex' && (
        <PersonPage
          person="alex"
          data={state.alex}
          onChange={d => updatePerson('alex', d)}
        />
      )}
      {activeTab === 'aurelie' && (
        <PersonPage
          person="aurelie"
          data={state.aurelie}
          onChange={d => updatePerson('aurelie', d)}
        />
      )}
      {activeTab === 'commun' && (
        <CommunPage
          commun={state.commun}
          alex={state.alex}
          aurelie={state.aurelie}
          onChange={updateCommun}
        />
      )}

      <nav className="tab-bar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
