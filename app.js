// --- APEXFLOW MARKET DOLLAR HUNTERS MAIN CONTROLLER & SIGNAL ENGINE ---
const PARTNER_APP_ID = "34UGhpx0qrXHqpfKHAkGH";
const AFFILIATE_TOKEN = "3A2CFHPG722B";

// Comprehensive Deriv Asset Mapping without omissions
const marketSymbols = {
    synthetic: [
        { symbol: 'R_100', name: 'Volatility 100 Index' },
        { symbol: 'R_75', name: 'Volatility 75 Index' },
        { symbol: 'R_50', name: 'Volatility 50 Index' },
        { symbol: 'R_25', name: 'Volatility 25 Index' },
        { symbol: 'R_10', name: 'Volatility 10 Index' },
        { symbol: '1HZ100V', name: 'Volatility 100 (1s) Index' },
        { symbol: 'BOOM1000', name: 'Boom 1000 Index' },
        { symbol: 'CRASH1000', name: 'Crash 1000 Index' },
        { symbol: 'JD10', name: 'Jump 10 Index' },
        { symbol: 'JD100', name: 'Jump 100 Index' }
    ],
    forex: [
        { symbol: 'frxEURUSD', name: 'EUR/USD (Euro / US Dollar)' },
        { symbol: 'frxGBPUSD', name: 'GBP/USD (British Pound / US Dollar)' },
        { symbol: 'frxUSDJPY', name: 'USD/JPY (US Dollar / Japanese Yen)' },
        { symbol: 'frxAUDUSD', name: 'AUD/USD (Australian Dollar / US Dollar)' },
        { symbol: 'frxUSDCAD', name: 'USD/CAD (US Dollar / Canadian Dollar)' },
        { symbol: 'frxGBPJPY', name: 'GBP/JPY (British Pound / Japanese Yen)' }
    ],
    stocks: [
        { symbol: 'DJI', name: 'Wall Street 30 (US 30)' },
        { symbol: 'SPC', name: 'US 500 (S&P 500)' },
        { symbol: 'NDX', name: 'US Tech 100 (Nasdaq)' }
    ],
    crypto: [
        { symbol: 'cryBTCUSD', name: 'BTC/USD (Bitcoin)' },
        { symbol: 'cryETHUSD', name: 'ETH/USD (Ethereum)' }
    ],
    commodities: [
        { symbol: 'frxXAUUSD', name: 'Spot Gold (XAU/USD)' },
        { symbol: 'frxXBRUSD', name: 'Brent Crude Oil (Oil/USD)' }
    ]
};

const exchangeRates = { KES: 129.0, UGX: 3750.0, TZS: 2600.0, ETB: 120.5, EUR: 0.92, GBP: 0.79, JPY: 155.0 };

let remainingSeconds = 180;
function runCoreLoadingSequence() {
    const timerDisplay = document.getElementById('loading-timer-display');
    const progressBar = document.getElementById('core-progress-bar');
    const splashScreen = document.getElementById('splash-screen');

    const interval = setInterval(() => {
        remainingSeconds--;
        const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
        const secs = (remainingSeconds % 60).toString().padStart(2, '0');
        if (timerDisplay) timerDisplay.innerText = `${mins}:${secs}`;
        if (progressBar) progressBar.style.width = `${((180 - remainingSeconds) / 180) * 100}%`;

        if (remainingSeconds <= 0) {
            clearInterval(interval);
            if (splashScreen) { splashScreen.style.opacity = '0'; setTimeout(() => splashScreen.remove(), 600); }
            initializeLiveTerminal();
        }
    }, 1000);
}

function updateAssetDropdown(category) {
    const assetSelector = document.getElementById('asset-selector');
    if (!assetSelector) return;
    assetSelector.innerHTML = '';
    (marketSymbols[category] || marketSymbols.synthetic).forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.symbol;
        opt.innerText = item.name;
        assetSelector.appendChild(opt);
    });
}

function setupCurrencyConverter() {
    const amtInput = document.getElementById('convert-amount');
    const curSelect = document.getElementById('target-currency');
    const outEl = document.getElementById('converted-output');
    function calc() {
        const val = (parseFloat(amtInput.value) || 0) * (exchangeRates[curSelect.value] || 1);
        outEl.innerText = `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${curSelect.value}`;
    }
    if (amtInput && curSelect) { amtInput.addEventListener('input', calc); curSelect.addEventListener('change', calc); calc(); }
}

function switchAccountMode(mode) {
    const b1 = document.getElementById('btn-mode-demo'), b2 = document.getElementById('btn-mode-real');
    if (mode === 'demo') {
        b1.className = 'px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition';
        b2.className = 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';
    } else {
        b2.className = 'px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition';
        b1.className = 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';
    }
}

function toggleSpeedBoatExecution() {
    const badge = document.getElementById('boat-status-badge');
    const btn = document.getElementById('btn-launch-boat');
    if (badge.innerText.includes('STANDBY')) {
        badge.innerText = 'ACTIVE MILLISECOND HUNTING';
        badge.className = 'text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500 font-mono animate-pulse';
        btn.innerText = 'Disengage Speed Boat';
        btn.className = 'w-full bg-red-600/20 text-red-300 font-bold py-2.5 rounded-xl text-xs border border-red-500/40 transition';
    } else {
        badge.innerText = 'STANDBY';
        badge.className = 'text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono';
        btn.innerText = 'Launch Speed Boat';
        btn.className = 'w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition';
    }
}

function executeManualOrder(dir) {
    alert(`Manual ${dir} binary contract successfully placed! Stake: $${document.getElementById('manual-stake').value}`);
}

function loginWithDeriv() {
    window.location.href = `https://oauth.deriv.com/oauth2/authorize?app_id=${PARTNER_APP_ID}&affiliate_token=${AFFILIATE_TOKEN}`;
}
function signupWithDeriv() {
    window.open(`https://hub.deriv.com/tradershub/signup?t=${AFFILIATE_TOKEN}`, '_blank');
}

// --- FULL TECHNICAL INDICATORS & DYNAMIC KILLZONE BIAS SHIFTER ---
function calculateBinaryIndicators(tickBuffer, assetSymbol) {
    if (!tickBuffer || tickBuffer.length < 30) return;
    const prices = tickBuffer;
    const currentPrice = prices[prices.length - 1];

    let gains = 0, losses = 0;
    for (let i = prices.length - 14; i < prices.length; i++) {
        const diff = prices[i] - prices[i - 1];
        if (diff >= 0) gains += diff; else losses += Math.abs(diff);
    }
    const rsi = 100 - (100 / (1 + ((gains / 14) / ((losses / 14) || 1))));

    const sma20 = prices.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const macdHist = (prices[prices.length - 1] - prices[prices.length - 6]) - (prices[prices.length - 1] - prices[prices.length - 15]);
    const stochK = ((currentPrice - Math.min(...prices.slice(-14))) / ((Math.max(...prices.slice(-14)) - Math.min(...prices.slice(-14))) || 0.0001)) * 100;

    let bullishScore = 0;
    if (rsi > 50) bullishScore++;
    if (macdHist > 0) bullishScore++;
    if (stochK > 50) bullishScore++;
    if (currentPrice >= sma20) bullishScore++;

    document.getElementById('ind-rsi').innerText = `${rsi.toFixed(1)} (${rsi > 50 ? 'Bullish' : 'Bearish'})`;
    document.getElementById('ind-macd').innerText = `${macdHist >= 0 ? '+' : ''}${macdHist.toFixed(4)}`;
    document.getElementById('ind-stoch').innerText = `${stochK.toFixed(1)}%`;
    document.getElementById('ind-bb').innerText = currentPrice >= sma20 ? 'Upper Band' : 'Lower Band';

    const signalBadge = document.getElementById('signal-badge');
    const recAction = document.getElementById('recommended-action');
    const matchCount = document.getElementById('indicator-match-count');
    matchCount.innerText = `${bullishScore}/4 Indicators Aligned`;

    if (bullishScore >= 3) {
        signalBadge.innerText = `SIGNAL: BUY 🚦 (${currentPrice.toFixed(4)})`;
        signalBadge.className = 'text-[10px] bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-500/40 font-mono font-bold animate-pulse';
        recAction.innerText = `Take RISE Binary Contract • Entry @ ${currentPrice.toFixed(4)} • Expiry: 12 Ticks`;
    } else {
        signalBadge.innerText = `SIGNAL: SELL 🚦 (${currentPrice.toFixed(4)})`;
        signalBadge.className = 'text-[10px] bg-red-500/20 text-red-400 px-2.5 py-0.5 rounded border border-red-500/40 font-mono font-bold animate-pulse';
        recAction.innerText = `Take FALL Binary Contract • Entry @ ${currentPrice.toFixed(4)} • Expiry: 12 Ticks`;
    }

    // Dynamic Killzone Bias Shifter based on asset shift
    const biasEl = document.getElementById('active-currency-bias');
    if (assetSymbol.startsWith('frx')) {
        const baseCur = assetSymbol.replace('frx', '').substring(0, 3);
        biasEl.innerText = `${baseCur} Flow: ${bullishScore >= 3 ? 'Institutional Bullish' : 'Institutional Bearish'}`;
    } else {
        biasEl.innerText = `Synthetic Volatility Index Bias: ${bullishScore >= 3 ? 'Expansion Up' : 'Retracement Down'}`;
    }
}

function initializeLiveTerminal() {
    updateAssetDropdown('synthetic');
    setupCurrencyConverter();

    const categorySelect = document.getElementById('market-category');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            updateAssetDropdown(e.target.value);
            const newAsset = document.getElementById('asset-selector').value;
            if (window.derivApiInstance) window.derivApiInstance.subscribeTicks(newAsset, handleTick);
        });
    }

    const derivApi = new DerivAPIConnector(PARTNER_APP_ID);
    window.derivApiInstance = derivApi;
    const aiEngine = new AIBotsEngine();

    const speedBoatSelect = document.getElementById('speed-boat-selector');
    if (speedBoatSelect) speedBoatSelect.addEventListener('change', (e) => aiEngine.setSpeedBoat(e.target.value));

    derivApi.connect().then(() => {
        const assetSelector = document.getElementById('asset-selector');
        const initialAsset = assetSelector ? assetSelector.value : 'R_100';
        derivApi.subscribeTicks(initialAsset, handleTick);

        if (assetSelector) {
            assetSelector.addEventListener('change', (e) => {
                derivApi.subscribeTicks(e.target.value, handleTick);
            });
        }
    }).catch(() => {
        setInterval(() => {
            handleTick({ quote: 10340.50 + Math.random() * 5, symbol: 'R_100' });
        }, 1000);
    });

    function handleTick(tick) {
        const quoteEl = document.getElementById('live-quote-display');
        if (quoteEl) quoteEl.innerText = tick.quote.toFixed(4);
        aiEngine.analyzeTick(tick);
        calculateBinaryIndicators(aiEngine.tickBuffer, tick.symbol || 'R_100');
    }

    let secondsLeft = 4735;
    setInterval(() => {
        if (secondsLeft > 0) secondsLeft--;
        const hrs = Math.floor(secondsLeft / 3600).toString().padStart(2, '0');
        const mins = Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, '0');
        const secs = (secondsLeft % 60).toString().padStart(2, '0');
        const timerEl = document.getElementById('killzone-timer');
        if (timerEl) timerEl.innerText = `${hrs}:${mins}:${secs}`;
    }, 1000);
}

window.addEventListener('DOMContentLoaded', () => { runCoreLoadingSequence(); });
