import { useState, useRef, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import './SearchableSelect.css';

/**
 * Liste déroulante avec recherche intégrée (évite de scroller dans une longue liste).
 * options: [{ value, label }]
 */
export default function SearchableSelect({ options, value, onChange, placeholder = 'Rechercher...', emptyLabel = 'Aucun', disabled = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selectedOption = options.find((o) => String(o.value) === String(value));

  const filteredOptions = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    if (disabled) return;
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setOpen(false);
    setQuery('');
  };

  return (
    <div className={`searchable-select${disabled ? ' disabled' : ''}`} ref={containerRef}>
      <button
        type="button"
        className="searchable-select-trigger"
        onClick={handleOpen}
        disabled={disabled}
      >
        <span className={selectedOption ? '' : 'placeholder'}>
          {selectedOption ? selectedOption.label : emptyLabel}
        </span>
        <FontAwesomeIcon icon={faChevronDown} className="searchable-select-caret" />
      </button>

      {open && (
        <div className="searchable-select-panel">
          <div className="searchable-select-search">
            <FontAwesomeIcon icon={faSearch} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="searchable-select-clear">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            )}
          </div>
          <ul className="searchable-select-options">
            <li
              className={!value ? 'active' : ''}
              onClick={() => handleSelect('')}
            >
              {emptyLabel}
            </li>
            {filteredOptions.map((o) => (
              <li
                key={o.value}
                className={String(o.value) === String(value) ? 'active' : ''}
                onClick={() => handleSelect(o.value)}
              >
                {o.label}
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="searchable-select-empty">Aucun résultat</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
