# use-infinite-scroll

Simple react hook for lazy loading more content when the bottom of the page is reached. Uses `IntersectionObserver` and `MutationObserver` for best performance.

## Usage

```sh
npm i @cvbuelow/use-infinite-scroll
```

## Usage

```jsx
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNextPage } from "../store/movies/movies.actions";
import MovieList from "./movie-list";
import useInfiniteScroll from "@react/use-infinite-scroll";

function MovieSearch() {
  const dispatch = useDispatch();
  const { loading, movies } = useSelector((state) => state.movies);

  const onScrollBottom = useCallback(() => {
    dispatch(getNextPage());
  }, [dispatch]);

  const scrollRef = useInfiniteScroll({ onScrollBottom });

  return (
    <div ref={scrollRef}>
      {!!movies?.length && <MovieList movies={movies} />}
      {loading && "Loading..."}
    </div>
  );
}

export default MovieSearch;
```
