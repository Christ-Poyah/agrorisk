import React, { createContext, useContext, useState } from 'react';
import { INITIAL_PLANTATIONS, INITIAL_ALERTS } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [plantations, setPlantations] = useState(INITIAL_PLANTATIONS);
  const [alerts, setAlerts]           = useState(INITIAL_ALERTS);

  function login(name, region) {
    setUser({ name, region, joinDate: new Date().toISOString() });
  }

  function logout() {
    setUser(null);
  }

  function addPlantation(data) {
    const plantation = {
      ...data,
      id: Date.now().toString(),
      status: 'actif',
      riskLevel: 'modere',
      risks: {
        secheresse: { level: 'modere', score: 48 + Math.floor(Math.random() * 20), trend: 'up' },
        inondation: { level: 'faible', score: 15 + Math.floor(Math.random() * 20), trend: 'stable' },
        criquets:   { level: 'eleve',  score: 60 + Math.floor(Math.random() * 25), trend: 'up' },
      },
      weather: { temp: 28, humidity: 65, rainfall: 50, windSpeed: 12 },
      insurance: { active: false, coverage: 0, premium: 0, smartContract: null, triggered: false },
      lastScan: new Date().toISOString(),
      aiPrediction: {
        summary: 'Analyse satellite en cours. Premières données disponibles dans 6h.',
        recommendation: 'Surveillance IA activée. Vous serez alerté en cas de risque détecté.',
      },
    };
    setPlantations(prev => [plantation, ...prev]);
    return plantation;
  }

  function markAlertRead(id) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  }

  const unreadCount = alerts.filter(a => !a.read).length;
  const stats = {
    totalPlantations: plantations.length,
    totalArea: plantations.reduce((s, p) => s + p.area, 0),
    activeInsurance: plantations.filter(p => p.insurance.active).length,
    alertsThisWeek: alerts.filter(a => !a.read).length,
    indemnisationsPaid: 120000,
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      plantations, addPlantation,
      alerts, markAlertRead, unreadCount,
      stats,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
