const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  products: {
    getAll: () => ipcRenderer.invoke('products:getAll'),
    getByBarcode: (barcode) => ipcRenderer.invoke('products:getByBarcode', barcode),
    search: (query) => ipcRenderer.invoke('products:search', query),
    upsert: (product) => ipcRenderer.invoke('products:upsert', product),
    delete: (id) => ipcRenderer.invoke('products:delete', id),
  }
})