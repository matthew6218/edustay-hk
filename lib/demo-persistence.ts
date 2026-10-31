// Only this browser's fictional demo is stored here. No credentials or server
// connections are needed, and separate browser profiles have separate stores.
export function createDemoStore(factory: IDBFactory = indexedDB, name = 'edustay-browser-demo-v1') {
  function open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = factory.open(name, 1);
      request.onupgradeneeded = () => request.result.createObjectStore('state');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error('Browser storage is unavailable. Allow site storage to use this demo.'));
    });
  }
  return {
    async load(): Promise<Uint8Array | undefined> {
      const db = await open();
      try {
        return await new Promise((resolve, reject) => {
          const request = db.transaction('state').objectStore('state').get('snapshot');
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      } finally { db.close(); }
    },
    async save(bytes: Uint8Array): Promise<void> {
      const db = await open();
      try {
        await new Promise<void>((resolve, reject) => {
          const transaction = db.transaction('state', 'readwrite');
          transaction.objectStore('state').put(bytes, 'snapshot');
          transaction.oncomplete = () => resolve();
          transaction.onabort = () => reject(new Error('Your demo could not be saved. Free some browser storage and try again.'));
          transaction.onerror = () => reject(new Error('Your demo could not be saved. Free some browser storage and try again.'));
        });
      } finally { db.close(); }
    },
  };
}
