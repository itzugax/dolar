export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const response = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        asset: 'USDT', fiat: 'VES', tradeType: 'SELL',
        page: 1, rows: 5, payTypes: []
      })
    });

    if (!response.ok) throw new Error('Binance error');
    const data = await response.json();

    const prices = data.data.map(d => parseFloat(d.adv.price));
    if (!prices.length) throw new Error('No prices');

    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    res.status(200).json({ price: avg });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
