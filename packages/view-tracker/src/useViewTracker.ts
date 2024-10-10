import { useContext } from 'react';
import { ViewTrackerContext } from './ViewTrackerProvider';

const useViewTracker = () => {
  const context = useContext(ViewTrackerContext);
  if (!context) {
    throw new Error( 'useViewTracker must be used within a ViewTrackerProvider. ' + 
        'Make sure that your component is wrapped with <ViewTrackerProvider>.');
  }

  return context;
};



export default useViewTracker;