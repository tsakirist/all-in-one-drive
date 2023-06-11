import { useEffect, RefObject } from "react";

export const useModalOutsideCloser = <T extends HTMLElement>(
	ref: RefObject<T>,
	cb: () => void
): void => {
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				cb();
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [ref, cb]);
};