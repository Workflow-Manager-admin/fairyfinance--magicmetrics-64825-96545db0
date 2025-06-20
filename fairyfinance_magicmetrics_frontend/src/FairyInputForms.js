import React, { useState } from "react";
import "./FairyInputForms.css";

/**
 * PUBLIC_INTERFACE
 * Sparkling, whimsical user input forms for Tooth Fairy Ledger.
 */
function FairyInputForms({ onSubmit }) {
  const [age, setAge] = useState("");
  const [teethLost, setTeethLost] = useState("");
  const [toothDates, setToothDates] = useState([""]);
  const [showMagic, setShowMagic] = useState(false);

  const handleDatesChange = (index, value) => {
    const updated = [...toothDates];
    updated[index] = value;
    setToothDates(updated);
  };
  const addDateField = () => setToothDates([...toothDates, ""]);
  const removeDateField = (idx) =>
    setToothDates(toothDates.filter((v, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowMagic(true);
    setTimeout(() => setShowMagic(false), 1650);
    if (onSubmit)
      onSubmit({
        age: Number(age),
        teethLost: Number(teethLost),
        toothDates: toothDates.filter(Boolean),
      });
  };

  return (
    <section className="fairy-form-section">
      <form
        className={`fairy-form ${showMagic ? "fairy-form-magic-animate" : ""}`}
        onSubmit={handleSubmit}
        autoComplete="off"
        spellCheck="false"
      >
        <h2 className="fairy-form-title">
          <span role="img" aria-label="sparkle">
            ✨
          </span>{" "}
          Enter Your Magical Tooth Stats
        </h2>
        <div className="fairy-field-group">
          <label htmlFor="age" className="fairy-label">
            Age:
            <span className="fairy-label-sparkle">🦷</span>
          </label>
          <input
            id="age"
            className="fairy-input"
            type="number"
            min={0}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            placeholder="How many fairy-years old?"
          />
        </div>
        <div className="fairy-field-group">
          <label htmlFor="teeth-lost" className="fairy-label">
            Teeth Lost:
            <span className="fairy-label-sparkle">💫</span>
          </label>
          <input
            id="teeth-lost"
            className="fairy-input"
            type="number"
            min={0}
            value={teethLost}
            onChange={(e) => setTeethLost(e.target.value)}
            required
            placeholder="Number whisked away by the Tooth Fairy"
          />
        </div>
        <div className="fairy-field-group fairy-dates-group">
          <label className="fairy-label">
            Tooth Loss Dates:
            <span className="fairy-label-sparkle">🌙</span>
          </label>
          <div className="fairy-dates-fields">
            {toothDates.map((date, idx) => (
              <div className="fairy-date-field-row" key={idx}>
                <input
                  className="fairy-input fairy-date-input"
                  type="date"
                  value={date}
                  onChange={(e) => handleDatesChange(idx, e.target.value)}
                />
                {toothDates.length > 1 && (
                  <button
                    type="button"
                    className="fairy-remove-btn"
                    aria-label="Remove Date"
                    tabIndex={0}
                    onClick={() => removeDateField(idx)}
                  >
                    ❌
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="fairy-btn fairy-add-btn"
            onClick={addDateField}
            tabIndex={0}
          >
            ＋ More Magical Dates
          </button>
        </div>
        <button className="btn btn-large fairy-form-btn" type="submit">
          <span role="img" aria-label="wand">
            🪄
          </span>{" "}
          Submit to the Fairy Ledger
        </button>
        {showMagic && (
          <div className="fairy-form-sparkle-blast" aria-live="polite">
            <span role="img" aria-label="spark smile" className="fairy-blast">
              ✨🦷✨
            </span>
          </div>
        )}
      </form>
    </section>
  );
}
export default FairyInputForms;
