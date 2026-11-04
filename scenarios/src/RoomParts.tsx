import { useLayoutEffect, useRef, useState } from 'react';
import { dataUrl } from './data.ts';
import type { Step } from './Steps.tsx';
import type { Box, Monster, MonsterType, Piece, PlayerCount, Room, RoomMap } from './types.ts';

const MONSTER_TYPES: MonsterType[] = ['boss', 'named', 'elite', 'normal'];

function Token({ file }: { file: string }) {
  return <img className="token" src={dataUrl(`tokens/${file}`)} alt="" />;
}

function presentMonsters(room: Room, players: PlayerCount): Monster[] {
  return room.monsters.filter((monster) => Object.keys(monster.counts[players]).length);
}

/** The monsters to take out of the box, large enough to tell apart at a glance. */
export function MonsterGallery({ room, players }: { room: Room; players: PlayerCount }) {
  return (
    <ul className="gallery">
      {presentMonsters(room, players).map((monster) => (
        <li key={monster.name}>
          {monster.standee ? (
            <img className="gallery-standee" src={dataUrl(`standees/${monster.standee}`)} alt="" />
          ) : (
            <img className="gallery-token" src={dataUrl(`tokens/${monster.token}`)} alt="" />
          )}
          <span>{monster.name}</span>
        </li>
      ))}
    </ul>
  );
}

export function PieceGallery({ pieces }: { pieces: Piece[] }) {
  return (
    <ul className="gallery">
      {pieces.map((piece) => (
        <li key={piece.name}>
          <img className="gallery-token" src={dataUrl(`tokens/${piece.token}`)} alt="" />
          <span>{piece.name}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * The steps that find what a room needs. How many of each comes when it is
 * placed, since the map shows that anyway.
 */
export function gatherSteps(room: Room, players: PlayerCount, tilesHint?: string): Step[] {
  const steps: Step[] = [
    {
      label: 'Tiles',
      body: (
        <>
          <h1>Find these tiles</h1>
          {tilesHint && <p className="hint">{tilesHint}</p>}
          <TileList tiles={room.tiles} />
        </>
      ),
    },
    {
      label: 'Monsters',
      body: (
        <>
          <h1>Pull these monsters</h1>
          <p className="hint">Take the standees, stat sleeve and ability deck for each one.</p>
          <MonsterGallery room={room} players={players} />
        </>
      ),
    },
  ];
  if (room.pieces.length) {
    steps.push({
      label: 'Tokens',
      body: (
        <>
          <h1>Gather these tokens</h1>
          <PieceGallery pieces={room.pieces} />
        </>
      ),
    });
  }
  return steps;
}

export const PLACE_LABEL = 'Place everything';

export function placeStep(room: Room, players: PlayerCount): Step {
  return {
    label: PLACE_LABEL,
    wide: true,
    body: (
      <div className="room-layout">
        <MapView map={room.map} players={players} />
        <aside>
          <h1>Place everything</h1>
          <p className="hint">Fit the tokens and monsters to the map, then choose starting hexes.</p>
          <MonsterList room={room} players={players} />
          <PieceList pieces={room.pieces} />
        </aside>
      </div>
    ),
  };
}

export function TileList({ tiles }: { tiles: string[] }) {
  return (
    <ul className="tiles">
      {tiles.map((tile) => (
        <li key={tile}>
          <img src={dataUrl(`tiles/${tile}.webp`)} alt="" />
          <span>{tile}</span>
        </li>
      ))}
    </ul>
  );
}

function MonsterRow({ monster, players }: { monster: Monster; players: PlayerCount }) {
  const counts = monster.counts[players];
  return (
    <li className="piece">
      <Token file={monster.token} />
      <span className="piece-name">{monster.name}</span>
      <span className="monster-counts">
        {MONSTER_TYPES.filter((type) => counts[type]).map((type) => (
          <span key={type} className={`monster-count monster-count-${type}`}>
            {counts[type]} {type}
          </span>
        ))}
      </span>
    </li>
  );
}

export function MonsterList({ room, players }: { room: Room; players: PlayerCount }) {
  return (
    <ul className="pieces">
      {presentMonsters(room, players).map((monster) => (
        <MonsterRow key={monster.name} monster={monster} players={players} />
      ))}
    </ul>
  );
}

export function PieceList({ pieces }: { pieces: Piece[] }) {
  return (
    <ul className="pieces">
      {pieces.map((piece) => (
        <li key={piece.name} className="piece">
          <Token file={piece.token} />
          <span className="piece-name">{piece.name}</span>
          <span className="piece-count">{piece.count}</span>
        </li>
      ))}
    </ul>
  );
}

function useSize(ref: React.RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const element = ref.current!;
    const observer = new ResizeObserver(() => setSize({ width: element.clientWidth, height: element.clientHeight }));
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

function boxStyle(box: Box) {
  return {
    left: `${box.x * 100}%`,
    top: `${box.y * 100}%`,
    width: `${box.width * 100}%`,
    height: `${box.height * 100}%`,
  };
}

// Turning a map sideways makes it harder to compare with the book, so a small
// gain in size isn't worth it.
const WORTHWHILE_TURN = 1.15;

/**
 * Shows a room with the monsters for this many characters standing on it.
 * A long map starts turned to fill the space it has, since its printed
 * orientation means nothing on the table. Players can turn it a quarter at
 * a time to match the way the room lies in front of them.
 */
export function MapView({ map, players }: { map: RoomMap; players: PlayerCount }) {
  const box = useRef<HTMLDivElement>(null);
  const { width, height } = useSize(box);
  const [quarterTurns, setQuarterTurns] = useState<number | null>(null);

  const uprightScale = Math.min(width / map.width, height / map.height) || 0;
  const turnedScale = Math.min(width / map.height, height / map.width) || 0;
  const turns = quarterTurns ?? (turnedScale > uprightScale * WORTHWHILE_TURN ? 1 : 0);
  const scale = turns % 2 ? turnedScale : uprightScale;

  return (
    <div className="map-box" ref={box}>
      <div
        className="map"
        style={{
          width: map.width * scale,
          height: map.height * scale,
          transform: `translate(-50%, -50%) rotate(${turns * 90}deg)`,
        }}
      >
        <img src={dataUrl(`maps/${map.file}`)} alt={`Map of the room for ${players} characters`} />
        {map.monsters.map((monster, index) => {
          const type = monster.presence[players - 2];
          if (!type) return null;
          return (
            <div key={index} className="placed" style={boxStyle(monster)}>
              <img src={dataUrl(`tokens/${monster.token}`)} alt={`${type} ${monster.monster}`} />
              <span className={`strip strip-${type}`} style={boxStyle(monster.strip)} />
            </div>
          );
        })}
      </div>
      <button className="quiet map-turn" onClick={() => setQuarterTurns((turns + 1) % 4)}>
        Turn map
      </button>
    </div>
  );
}
