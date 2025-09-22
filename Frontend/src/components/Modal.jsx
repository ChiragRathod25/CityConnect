import  {useEffect } from 'react';
import { Button } from './index.js';

function Modal({ isOpen, onClose, children, title }) {
  // disable scrolling
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else document.body.style.overflow = 'auto';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  

  return isOpen ? (
    <div
      className="modal-overlay 
    fixed w-full h-full
    top-0 left-0 flex justify-center items-center
    bg-[rgba(0,0,0,0.5)]
    z-50"
    >
      <div
        className="modal-content
      
         bg-white w-11/12 md:w-1/2 lg:w-1/3
        shadow-lg rounded-lg  p-4
        max-h-[80vh] overflow-y-auto
        scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-hide   
        z-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="z-51 w-full flex justify-between items-center
        
      
        ">
          <h2 className="text-xl font-bold text-left w-full 
         
          ">{title || ''}</h2>
          <Button
            className="close-modal
        ml-auto
        bg-gray-300 text-white hover:bg-gray-400 rounded-lg p-2 w-8 h-8 flex justify-center items-center  "
            onClick={onClose}
          >
            X
          </Button>
        </div>
        <hr
          className="
        my-4 border-t border-gray-300 w-full 
       "
        />
        <div
          className="w-full
   
        "
        >
          {children}
        </div>
      </div>
    </div>
  ) : null;
}

export default Modal;
