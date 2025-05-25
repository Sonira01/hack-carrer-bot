import { useEffect, useRef } from 'react';

const Typewriter = ({ texts, setPlaceholder, speed = 100, delay = 2000 }) => {
  const textIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const currentTextRef = useRef('');
  const timeoutRef = useRef(null);

  useEffect(() => {
    const type = () => {
      const currentText = texts[textIndexRef.current];
      if (charIndexRef.current < currentText.length) {
        currentTextRef.current += currentText[charIndexRef.current];
        setPlaceholder(currentTextRef.current + '|');
        charIndexRef.current += 1;
        timeoutRef.current = setTimeout(type, speed);
      } else {
        timeoutRef.current = setTimeout(() => {
          currentTextRef.current = '';
          charIndexRef.current = 0;
          textIndexRef.current = (textIndexRef.current + 1) % texts.length;
          type();
        }, delay);
      }
    };

    type();

    return () => clearTimeout(timeoutRef.current);
  }, [texts, setPlaceholder, speed, delay]);

  return null;
};

export default Typewriter;
