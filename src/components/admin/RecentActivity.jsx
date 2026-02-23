import './admin-components.css';

const TYPE_CONFIG = {
  success: { bg: 'var(--act-success-bg)', color: 'var(--act-success)', dot: '#10b981' },
  error:   { bg: 'var(--act-error-bg)',   color: 'var(--act-error)',   dot: '#ef4444' },
  warning: { bg: 'var(--act-warning-bg)', color: 'var(--act-warning)', dot: '#f59e0b' },
  info:    { bg: 'var(--act-info-bg)',     color: 'var(--act-info)',     dot: '#3b82f6' },
};

export default function RecentActivity({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="adm-activity">
        <div className="adm-activity__header">
          <h3 className="adm-activity__title">Recent Activity</h3>
        </div>
        <p className="adm-activity__empty">No activity yet. Actions you take will appear here.</p>
      </div>
    );
  }

  return (
    <div className="adm-activity">
      <div className="adm-activity__header">
        <h3 className="adm-activity__title">Recent Activity</h3>
        <span className="adm-activity__count">{activities.length} events</span>
      </div>
      <ol className="adm-activity__list" aria-label="Activity feed">
        {activities.map((act) => {
          const cfg = TYPE_CONFIG[act.type] || TYPE_CONFIG.info;
          return (
            <li key={act.id} className="adm-activity__item">
              <div className="adm-activity__line">
                <div className="adm-activity__dot" style={{ background: cfg.dot }} />
              </div>
              <div className="adm-activity__content">
                <div
                  className="adm-activity__icon-wrap"
                  style={{ background: cfg.bg, color: cfg.color }}
                  aria-hidden
                >
                  {act.icon}
                </div>
                <div className="adm-activity__body">
                  <span className="adm-activity__text">{act.text}</span>
                  <time className="adm-activity__time">{act.time}</time>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
