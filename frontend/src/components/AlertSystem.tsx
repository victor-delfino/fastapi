import { useEffect } from 'react';
import { Alert } from '../types';
import './AlertSystem.css';

interface AlertSystemProps {
  alerts: Alert[];
  onDismiss: (id: number) => void;
}

export function AlertSystem({ alerts, onDismiss }: AlertSystemProps) {
  useEffect(() => {
    const timers = alerts.map((alert) =>
      setTimeout(() => onDismiss(alert.id), 5000)
    );

    return () => timers.forEach(clearTimeout);
  }, [alerts, onDismiss]);

  return (
    <div className="alert-container">
      {alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.type}`}>
          <span>{alert.message}</span>
          <button
            className="alert-close"
            onClick={() => onDismiss(alert.id)}
            aria-label="Fechar alerta"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
