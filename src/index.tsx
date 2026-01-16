import React from 'react';
import ReactDOM from 'react-dom/client';

const Test = () => (
  <div style={{ padding: '50px', textAlign: 'center', background: 'yellow' }}>
    <h1>¡EL INDEX.TSX ESTÁ CARGANDO!</h1>
    <p>Si ves esto, el problema está dentro de tu archivo App.tsx</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<Test />);
