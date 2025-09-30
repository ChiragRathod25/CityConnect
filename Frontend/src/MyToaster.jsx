import { Toaster } from 'react-hot-toast';

const MyToaster = () => {
 
 


  return (
    <Toaster
      position="top-right"
      duration={3000}
      reverseOrder={false}
      
      containerStyle={{
        //  position: 'relative',
        top: window.innerWidth >= 640 ? '90px':'65px',
        // bottom: '70px',
        right:  window.innerWidth >= 640 ? '100px':'10px',
        // zIndex: 9999,
      }}
       
      toastOptions={
        {
          success:{
            duration: 500
          }
        }
      }
    />
  );
};

export default MyToaster;
