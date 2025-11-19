// import { useRef } from 'react';
// import './SpotlightCard.css';

// const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
//   const divRef = useRef(null);

//   const handleMouseMove = e => {
//     const rect = divRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     divRef.current.style.setProperty('--mouse-x', `${x}px`);
//     divRef.current.style.setProperty('--mouse-y', `${y}px`);
//     divRef.current.style.setProperty('--spotlight-color', spotlightColor);
//   };

//   return (
//     <div ref={divRef} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`}>
//       {children}
//     </div>
//   );
// };

// export default SpotlightCard;


import { useRef } from 'react';
import './SpotlightCard.css';

const SpotlightCard = ({ children, className = '', spotlightColor = 'rgba(255, 255, 255, 0.25)' }) => {
  const divRef = useRef(null);

  const handleMouseMove = e => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty('--mouse-x', `${x}px`);
    divRef.current.style.setProperty('--mouse-y', `${y}px`);
    divRef.current.style.setProperty('--spotlight-color', spotlightColor);
  };

  const handleMouseLeave = () => {
    // fallback: move spotlight to center and reduce opacity (keeps it smooth)
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    divRef.current.style.setProperty('--mouse-x', `${rect.width / 2}px`);
    divRef.current.style.setProperty('--mouse-y', `${rect.height / 2}px`);
  };

  return (
    // tabindex allows :focus-within to work when focusing children by keyboard
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      className={`card-spotlight ${className}`}
      aria-hidden="false"
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
