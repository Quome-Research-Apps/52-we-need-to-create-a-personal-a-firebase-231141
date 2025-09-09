"use client";

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    // This part runs only on the client
    let value: T;
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        value = JSON.parse(item);
      } else {
        value = initialValue;
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
    } catch (error) {
      console.error(error);
      value = initialValue;
    }
    setStoredValue(value);
  }, [key, initialValue]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
