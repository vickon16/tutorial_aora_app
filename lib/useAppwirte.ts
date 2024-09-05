import { useEffect, useState } from "react";
import { Alert } from "react-native";

const useAppwrite = <T>(func: () => Promise<T>, defaultValue: any) => {
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const resp = await func();
      setData(resp);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = async () => await fetchData();

  return { data, isLoading, refetch };
};

export default useAppwrite;
