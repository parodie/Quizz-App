// src/components/QuestionInput.jsx
import { useState } from 'react';

export default function QuestionInput({ question, onChange, onRemove, index }) {
    const [q, setQ] = useState(question);

    const update = (field, value) => {
        const updated = { ...q, [field]: value };
        setQ(updated);
        onChange(index, updated);
    };

    const addOption = () => {
        update('options', [...q.options, '']);
    };

    const updateOption = (i, value) => {
        const opts = [...q.options];
        opts[i] = value;
        update('options', opts);
    };

    const removeOption = (i) => {
        if (q.options.length > 2) {
            const opts = [...q.options];
            opts.splice(i, 1);
            update('options', opts);
        }
    };

    return (
        <div style={styles.question}>
            <div style={styles.questionHeader}>
                <h4>Question {index + 1}</h4>
                {index > 0 && (
                    <button type="button" onClick={onRemove} style={styles.removeBtn}>
                        ✕
                    </button>
                )}
            </div>

            <input
                type="text"
                placeholder="Enter question text"
                value={q.text}
                onChange={(e) => update('text', e.target.value)}
                style={styles.input}
            />

            <div style={styles.options}>
                <label>Options:</label>
                {q.options.map((opt, i) => (
                    <div key={i} style={styles.optionRow}>
                        <span style={styles.optionLabel}>{String.fromCharCode(65 + i)})</span>
                        <input
                            type="text"
                            value={opt}
                            onChange={(e) => updateOption(i, e.target.value)}
                            style={styles.optionInput}
                        />
                        {q.options.length > 2 && (
                            <button
                                type="button"
                                onClick={() => removeOption(i)}
                                style={styles.smallBtn}
                            >
                                ✕
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addOption} style={styles.addOptionBtn}>
                    + Add Option
                </button>
            </div>

            <div style={styles.row}>
                <div style={styles.half}>
                    <label>Correct Answer:</label>
                    <select
                        value={q.correctAnswer}
                        onChange={(e) => update('correctAnswer', e.target.value)}
                        style={styles.select}
                    >
                        <option value="">Select correct answer</option>
                        {q.options.map((opt, i) => (
                            <option key={i} value={opt}>
                                {String.fromCharCode(65 + i)}) {opt}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.half}>
                    <label>Type:</label>
                    <select
                        value={q.questionType}
                        onChange={(e) => update('questionType', e.target.value)}
                        style={styles.select}
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="true-false">True/False</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

const styles = {
    question: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#f9f9f9',
    },
    questionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem',
    },
    removeBtn: {
        background: '#e74c3c',
        color: 'white',
        border: 'none',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        fontSize: '14px',
        cursor: 'pointer',
    },
    input: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '1rem',
        marginBottom: '1rem',
    },
    options: {
        marginBottom: '1rem',
    },
    optionRow: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '0.5rem',
    },
    optionLabel: {
        width: '30px',
        fontWeight: 'bold',
        color: '#555',
    },
    optionInput: {
        flex: 1,
        padding: '0.5rem',
        border: '1px solid #ddd',
        borderRadius: '4px',
        marginRight: '0.5rem',
    },
    smallBtn: {
        background: '#95a5a6',
        color: 'white',
        border: 'none',
        width: '24px',
        height: '24px',
        borderRadius: '4px',
        fontSize: '14px',
        cursor: 'pointer',
    },
    addOptionBtn: {
        background: '#27ae60',
        color: 'white',
        border: 'none',
        padding: '0.5rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        marginTop: '0.5rem',
    },
    row: {
        display: 'flex',
        gap: '1rem',
    },
    half: {
        flex: 1,
    },
    select: {
        width: '100%',
        padding: '0.75rem',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '1rem',
    },
};