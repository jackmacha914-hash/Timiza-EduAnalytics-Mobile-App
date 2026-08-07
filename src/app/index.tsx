import { useEffect } from "react";
import { router } from "expo-router";

import LoadingScreen from "./components/LoadingScreen";

export default function Splash() {

  useEffect(() => {

    const timer = setTimeout(() => {

      router.replace("/login");

    }, 2000);


    return () =>
      clearTimeout(timer);

  }, []);


  return <LoadingScreen />;

}