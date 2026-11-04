import { useRef, useState, type FormEvent } from 'react';
import { loadJson } from '../../shared/load.ts';
import type { Treasures } from './types.ts';

type Result = { html: string } | { message: string };

/** Shows one treasure at a time, since the book forbids reading the rest. */
export function TreasureLookup() {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState<Result | null>(null);
  const treasures = useRef<Treasures | null>(null);

  const lookUp = async (event: FormEvent) => {
    event.preventDefault();
    const wanted = String(Number(number));
    try {
      treasures.current ??= await loadJson<Treasures>('content/spoilers/treasures.json');
    } catch {
      setResult({ message: "The treasure list didn't load. Check your connection and try again." });
      return;
    }
    const html = treasures.current[wanted];
    setResult(html ? { html } : { message: `There's no treasure ${number}.` });
  };

  return (
    <form className="treasure" onSubmit={lookUp}>
      <label>
        Treasure number
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          required
          value={number}
          onChange={(event) => {
            setNumber(event.target.value);
            setResult(null);
          }}
        />
      </label>
      <button type="submit">Read treasure</button>
      {result && 'html' in result && (
        <p className="treasure-result" dangerouslySetInnerHTML={{ __html: result.html }} />
      )}
      {result && 'message' in result && <p className="treasure-result">{result.message}</p>}
    </form>
  );
}
