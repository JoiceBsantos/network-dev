import { useWindowDimensions } from "react-native";

export function useResponsive() {

  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;

  const isTablet =
    width >= 768 && width < 1100;

  const isDesktop = width >= 1100;

  const isSmallMobile = width < 380;

  const isSmallDesktop =
    width >= 1100 && width < 1400;

  return {
    width,
    height,

    isMobile,
    isTablet,
    isDesktop,

    isSmallMobile,
    isSmallDesktop,
  };
}