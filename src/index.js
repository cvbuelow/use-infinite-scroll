import { useEffect, useRef } from "react";

const findLastChild = (node) => {
  const numChildren = node.childNodes.length;
  return numChildren && node.childNodes[numChildren - 1];
}

const findDeepestChild = (node) => {
  const lastChild = findLastChild(node);
  return lastChild ? findDeepestChild(lastChild) : node;
};

const useInfiniteScroll = ({
  onScrollBottom,
  root,
  rootMargin = "500px",
  threshold = 0.0,
  useDeepTarget,
}) => {
  const scrollRef = useRef();

  useEffect(() => {
    if (!scrollRef.current) return;

    let intersectionObserver;
    let mutationObserver;
    let targetNode;

    const setTarget = (parent) => {
      const node = useDeepTarget ? findDeepestChild(parent) : parent;
      if (targetNode && node !== targetNode) {
        intersectionObserver.unobserve(targetNode);
      }
      if (node instanceof Element) {
        targetNode = node;
        intersectionObserver.observe(node);
      }
    };

    mutationObserver = new MutationObserver((mutationsList) => {
      const addedNodes = mutationsList[mutationsList.length - 1].addedNodes;
      if (addedNodes.length) {
        setTarget(addedNodes[addedNodes.length - 1]);
      }
    });

    intersectionObserver = new IntersectionObserver(entry => {
      if (entry[0].isIntersecting) {
        onScrollBottom();
      }
    }, {
      root: root || null,
      rootMargin,
      threshold
    });

    setTarget(useDeepTarget ? scrollRef.current : findLastChild(scrollRef.current));

    mutationObserver.observe(scrollRef.current, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [onScrollBottom, scrollRef.current, root, rootMargin, threshold]);

  return scrollRef;
};

export default useInfiniteScroll;
