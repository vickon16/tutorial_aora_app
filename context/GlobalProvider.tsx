import Loader from "@/components/Loader";
import { getCurrentUser } from "@/lib/appwrite";
import { TUserDocument } from "@/lib/types";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

type TContext = {
  user: TUserDocument | null;
  setUser: React.Dispatch<React.SetStateAction<TUserDocument | null>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
};

const defaultContext: TContext = {
  user: null,
  setUser: () => {},
  isLoggedIn: true,
  setIsLoggedIn: () => {},
  isLoading: true,
};

const GlobalContext = createContext<TContext>(defaultContext);

const GlobalProvider = ({ children }: PropsWithChildren) => {
  const [context, setContext] = useState<TContext>(defaultContext);

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await getCurrentUser();

        if (!user) {
          setContext((prev) => ({ ...prev, isLoggedIn: false, user: null }));
          return;
        }

        setContext((prev) => ({ ...prev, isLoggedIn: true, user }));
      } catch (error) {
        console.log(error);
      } finally {
        setContext((prev) => ({ ...prev, isLoading: false }));
      }
    };

    context.isLoggedIn && getUser();
  }, [context.isLoggedIn]);

  return (
    <GlobalContext.Provider value={context}>
      {context.isLoading ? <Loader size="large" /> : children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;

export const useGlobalContext = () => useContext(GlobalContext);
