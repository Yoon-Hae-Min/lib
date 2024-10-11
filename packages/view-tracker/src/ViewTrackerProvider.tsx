import type { PropsWithChildren} from 'react';
import React, { createContext, useState } from 'react';

export interface ViewTrackerContextType {
  viewSection: string;
  setViewSection: (id: string) => void;
}

export const ViewTrackerContext = createContext<ViewTrackerContextType | undefined>(undefined);

const ViewTrackerProvider = ({ children }: PropsWithChildren) => {
  const [viewSection, setViewSection] = useState('');
  return <ViewTrackerContext.Provider value={{ viewSection, setViewSection }}>{children}</ViewTrackerContext.Provider>;
};

export default ViewTrackerProvider;
