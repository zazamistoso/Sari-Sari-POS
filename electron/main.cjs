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

ipcMain.handle('transactions:create', (_, { type, items, total, amountTendered }) => {
  const change = amountTendered != null ? amountTendered - total : null

  const insertTx = db.prepare(`
    INSERT INTO transactions (type, total, amount_tendered, change)
    VALUES (?, ?, ?, ?)
  `)
  const insertItem = db.prepare(`
    INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price, subtotal)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const run = db.transaction(() => {
    const result = insertTx.run(type, total, amountTendered ?? null, change)
    const txId = result.lastInsertRowid

    for (const item of items) {
      insertItem.run(txId, item.product_id, item.name, item.quantity, item.unit_price, item.subtotal)
    }

    return { id: txId }
  })

  return run()
})

ipcMain.handle('transactions:getSummary', (_, period) => {
  let dateFilter = ''
  if (period === 'today') dateFilter = "AND date(created_at) = date('now')"
  else if (period === 'week') dateFilter = "AND created_at >= datetime('now', '-7 days')"
  else if (period === 'month') dateFilter = "AND created_at >= datetime('now', '-30 days')"

  return db.prepare(`
    SELECT
      COUNT(*) as transaction_count,
      COALESCE(SUM(total), 0) as total_sales,
      COALESCE(SUM(CASE WHEN type='retail' THEN total ELSE 0 END), 0) as retail_sales,
      COALESCE(SUM(CASE WHEN type='wholesale' THEN total ELSE 0 END), 0) as wholesale_sales
    FROM transactions WHERE 1=1 ${dateFilter}
  `).get()
})

app.whenReady().then(() => {
  db = require('./database.cjs')
  createWindow()
})