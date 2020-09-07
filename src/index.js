import { useEffect, useRef, useCallback } from "react";

const findDeepestChild = (node) => {
  const numChildren = node.childNodes.length;
  return numChildren ? findDeepestChild(node.childNodes[numChildren - 1]) : node;
};

const useInfiniteScroll = ({ onScrollBottom, rootMargin = "500px", threshold = 1.0 }) => {
  const scrollRef = useRef();
  const mutationObserver = useRef();
  const intersectionObserver = useRef();
  const targetNode = useRef();

  const setTarget = useCallback((parent) => {
    const node = findDeepestChild(parent);
    if (targetNode.current && node !== targetNode.current) {
      intersectionObserver.current.unobserve(targetNode.current);
    }
    if (node instanceof Element) {
      targetNode.current = node;
      intersectionObserver.current.observe(node);
    }
  }, []);

  useEffect(() => {
    mutationObserver.current = new MutationObserver((mutationsList) => {
      const addedNodes = mutationsList[mutationsList.length - 1].addedNodes;
      if (addedNodes.length) {
        setTarget(addedNodes[addedNodes.length - 1]);
      }
    });

    intersectionObserver.current = new IntersectionObserver(entry => {
      if (entry[0].isIntersecting) {
        onScrollBottom();
      }
    }, {
      rootMargin,
      threshold
    });

    setTarget(scrollRef.current);
    mutationObserver.current.observe(scrollRef.current, { childList: true, subtree: true });

    return () => {
      mutationObserver.current.disconnect();
      intersectionObserver.current.disconnect();
    };
  }, [onScrollBottom, setTarget]);

  return scrollRef;
};

export default useInfiniteScroll;
