import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const scroller = document.querySelector(".app-content");
    if (scroller) {
      scroller.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}
