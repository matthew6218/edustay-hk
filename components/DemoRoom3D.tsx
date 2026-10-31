'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import styles from './DemoRoom3D.module.css';

type Point = [number, number, number];

const palettes = [
  { wall: '#e7ded2', side: '#d5c8b8', floor: '#bc9470', bed: '#789b91', desk: '#936d54', rug: '#e8cfa9' },
  { wall: '#e4e7e0', side: '#cbd5cf', floor: '#ad8b70', bed: '#d49b7b', desk: '#765b4c', rug: '#e8d8c5' },
  { wall: '#e9e1d9', side: '#d5c5bc', floor: '#b79678', bed: '#7993ae', desk: '#88634f', rug: '#d7d5bc' },
];

export default function DemoRoom3D({ homeId }: { homeId: string }) {
  const [angle, setAngle] = useState(18);
  const palette = palettes[Number(homeId.match(/\d+/)?.[0] ?? 0) % palettes.length];
  const radians = angle * Math.PI / 180;
  const project = ([x, y, z]: Point): [number, number] => {
    const rotatedX = x * Math.cos(radians) - y * Math.sin(radians);
    const rotatedY = x * Math.sin(radians) + y * Math.cos(radians);
    return [360 + rotatedX * 66, 290 + rotatedY * 32 - z * 68];
  };
  const points = (corners: Point[]) => corners.map(point => project(point).map(value => value.toFixed(1)).join(',')).join(' ');
  const face = (key: string, corners: Point[], fill: string, stroke = '#756d64') =>
    <polygon key={key} points={points(corners)} fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinejoin="round" />;
  const box = (key: string, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, front: string, top: string) => {
    const sideX = angle >= 0 ? x1 : x0;
    return <g key={key}>
      {face(key + '-side', [[sideX,y0,z0],[sideX,y1,z0],[sideX,y1,z1],[sideX,y0,z1]], front, '#635c54')}
      {face(key + '-front', [[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]], front, '#635c54')}
      {face(key + '-top', [[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]], top, '#635c54')}
    </g>;
  };

  return <div className={styles.room}>
    <div className={styles.stage}>
      <svg viewBox="0 0 720 430" role="img" aria-label="Rotatable illustrated three-dimensional room with a bed, desk, window and rug">
        <defs>
          <linearGradient id="demo-room-background" x2="0" y2="1"><stop stopColor="#f1f6f2"/><stop offset="1" stopColor="#dce9e4"/></linearGradient>
          <linearGradient id="demo-room-window" x2="0" y2="1"><stop stopColor="#b8d6db"/><stop offset="1" stopColor="#e7efda"/></linearGradient>
        </defs>
        <rect width="720" height="430" fill="url(#demo-room-background)" />
        <ellipse cx="360" cy="367" rx="245" ry="28" fill="#254e49" opacity=".13" />
        {face('back-wall', [[-2.7,1.8,0],[2.7,1.8,0],[2.7,1.8,2.55],[-2.7,1.8,2.55]], palette.wall)}
        {face('side-wall', [[-2.7,-1.8,0],[-2.7,1.8,0],[-2.7,1.8,2.55],[-2.7,-1.8,2.55]], palette.side)}
        {face('floor', [[-2.7,-1.8,0],[2.7,-1.8,0],[2.7,1.8,0],[-2.7,1.8,0]], palette.floor)}
        {face('window', [[1.05,1.81,1.45],[2.35,1.81,1.45],[2.35,1.81,2.35],[1.05,1.81,2.35]], 'url(#demo-room-window)', '#f8f8ed')}
        <line x1={project([1.7,1.82,1.45])[0]} y1={project([1.7,1.82,1.45])[1]} x2={project([1.7,1.82,2.35])[0]} y2={project([1.7,1.82,2.35])[1]} stroke="#f8f8ed" strokeWidth="5" />
        {face('rug', [[-.3,-1.35,.02],[1.9,-1.35,.02],[1.9,.35,.02],[-.3,.35,.02]], palette.rug, '#ddd0ba')}
        {box('desk-leg-left', 1.1,.72,0,1.23,.86,.74, palette.desk, palette.desk)}
        {box('desk-leg-right', 2.1,.72,0,2.23,.86,.74, palette.desk, palette.desk)}
        {box('desk', .95,.58,.74,2.3,1.52,.83, palette.desk, '#b48768')}
        {box('book', 1.72,.87,.83,2.05,1.33,.9, '#e5ddd0', '#f5eee1')}
        {box('bed-frame', -2.25,-1.18,0,.12,.72,.42, '#8a6a50', '#a48469')}
        {box('mattress', -2.17,-1.1,.42,.04,.64,.57, palette.bed, '#f0eee7')}
        {box('blanket', -2.17,-1.1,.57,-.98,.64,.61, palette.bed, palette.bed)}
        {box('pillow', -.7,.08,.57,-.15,.52,.69, '#e7e4da', '#fffdf8')}
        {box('stool', 1.38,-.58,0,1.9,-.13,.39, '#927c67', '#c4a98a')}
      </svg>
      <span className={styles.label}>Illustrative 3D room · shared demo template</span>
    </div>
    <div className={styles.controls}>
      <button type="button" className="btn outline" onClick={() => setAngle(value => Math.max(-38, value - 15))} aria-label="Rotate room left">↶</button>
      <label>Rotate view <input type="range" min="-38" max="38" value={angle} onChange={event => setAngle(Number(event.target.value))} aria-label="Rotate illustrative room" /></label>
      <button type="button" className="btn outline" onClick={() => setAngle(value => Math.min(38, value + 15))} aria-label="Rotate room right">↷</button>
      <button type="button" className={styles.reset} onClick={() => setAngle(18)}><RotateCcw size={14}/> Reset view</button>
    </div>
    <p className="muted small">This interactive model is a generic room illustration used for every sample home. It does not show the property’s layout, size or condition.</p>
  </div>;
}
