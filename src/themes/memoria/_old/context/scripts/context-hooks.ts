/* Packages */
import { useContext } from 'react';

/* Components */
import { Context } from '../Context';

/* Custom hook for consuming context */
export const useAppContext = () => useContext(Context);
