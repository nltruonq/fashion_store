import { useEffect } from "react";
function useOutsideAlerter(listActionRef, refTwo = undefined) {
    useEffect(() => {
      function handleClickOutside(event) {
          if (listActionRef.current && !listActionRef.current.contains(event.target) && listActionRef.current.classList.contains('show')) {
            listActionRef.current.classList.remove('show')
            if(refTwo) {
              refTwo.current.classList.remove('show')
            }
          }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [listActionRef]);
  }

  export default useOutsideAlerter