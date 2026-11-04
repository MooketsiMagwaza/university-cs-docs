import { useEffect, useRef, useState } from 'react';

/** One request per address: every quiz on a page that reads the same data file shares it. */
const requests = new Map<string, Promise<unknown>>();

export function fetchJson<T>(url: string): Promise<T> {
  let request = requests.get(url);
  if (!request) {
    request = fetch(url).then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    });
    // A failed request is forgotten, so "Try again" asks the server again.
    request.catch(() => requests.delete(url));
    requests.set(url, request);
  }
  return request as Promise<T>;
}

type LazyState<T> = { status: 'idle' | 'loading' | 'error' } | { status: 'ready'; data: T };

/**
 * Fetches a data file once the element that carries `ref` is within `margin` of the screen (at once when the browser
 * has no IntersectionObserver). The page asks the browser to download the file early with a preload hint, so by the time
 * the reader gets there the file is usually in the cache. `retry` tries again after an error.
 */
export function useLazyJson<T>(url: string, margin = '800px') {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<LazyState<T>>({ status: 'idle' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let cancelled = false;
    const load = () => {
      setState({ status: 'loading' });
      fetchJson<T>(url).then(
        (data) => { if (!cancelled) setState({ status: 'ready', data }); },
        () => { if (!cancelled) setState({ status: 'error' }); },
      );
    };
    if (typeof IntersectionObserver === 'undefined') {
      load();
      return () => { cancelled = true; };
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        load();
      },
      { rootMargin: margin },
    );
    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [url, margin, attempt]);

  return { ref, state, retry: () => setAttempt((value) => value + 1) };
}
