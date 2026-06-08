const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let db

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  })

  win.loadURL('http://localhost:5173')
}

ipcMain.handle('products:getAll', () => {
  return db.prepare('SELECT * FROM products ORDER BY name ASC').all()
})

ipcMain.handle('products:getByBarcode', (_, barcode) => {
  return db.prepare('SELECT * FROM products WHERE barcode = ?').get(barcode)
})

ipcMain.handle('products:search', (_, query) => {
  return db.prepare('SELECT * FROM products WHERE name LIKE ? OR barcode LIKE ? LIMIT 20')
    .all(`%${query}%`, `%${query}%`)
})

ipcMain.handle('products:upsert', (_, product) => {
  if (product.id) {
    db.prepare(`
      UPDATE products SET
        name = ?, barcode = ?, retail_price = ?,
        wholesale_price = ?, category = ?, stock = ?, unit = ?
      WHERE id = ?
    `).run(
      product.name, product.barcode, product.retail_price,
      product.wholesale_price, product.category, product.stock,
      product.unit, product.id
    )
  } else {
    db.prepare(`
      INSERT INTO products (name, barcode, retail_price, wholesale_price, category, stock, unit)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      product.name, product.barcode, product.retail_price,
      product.wholesale_price, product.category, product.stock, product.unit
    )
  }
  return { success: true }
})

ipcMain.handle('products:delete', (_, id) => {
  db.prepare('DELETE FROM products WHERE id = ?').run(id)
  return { success: true }
})

app.whenReady().then(() => {
  db = require('./database.cjs')
  createWindow()
})