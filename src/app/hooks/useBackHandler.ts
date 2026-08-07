import { useEffect, useState } from "react";
import { Alert, BackHandler } from "react-native";

export default function useBackHandler(
  canGoBack: boolean,
  goBack: () => void
) {
  const [exitApp, setExitApp] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (canGoBack) {
          goBack();
          return true;
        }

        if (exitApp) {
          BackHandler.exitApp();
          return true;
        }

        setExitApp(true);

        Alert.alert(
          "Timiza EduAnalytics",
          "Press back again to exit."
        );

        timer = setTimeout(() => {
          setExitApp(false);
        }, 2000);

        return true;
      }
    );

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
      backHandler.remove();
    };
  }, [canGoBack, exitApp, goBack]);
}