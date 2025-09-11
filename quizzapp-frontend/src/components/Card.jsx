// src/components/Card.jsx
export default function Card({ children, title, style }) {
    return (
        <div style={{ ...styles.card, ...style }}>
            {title && <h3 style={styles.cardTitle}>{title}</h3>}
            <div style={styles.cardBody}>
                {children}
            </div>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '1.5rem',
        overflow: 'hidden',
    },
    cardTitle: {
        margin: 0,
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #eee',
        backgroundColor: '#f8f9fa',
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#2c3e50',
    },
    cardBody: {
        padding: '1.5rem',
    },
};