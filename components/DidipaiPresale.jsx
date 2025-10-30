
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaTwitter } from "react-icons/fa";
import { FiExternalLink, FiCheckCircle } from "react-icons/fi";

const PRESALE_ABI = [
  "function token() view returns (address)",
  "function presaleOwner() view returns (address)",
  "function price() view returns (uint256)",
  "function tokensSold() view returns (uint256)",
  "function presaleCap() view returns (uint256)",
  "function presaleEnded() view returns (bool)",
  "function buy() payable",
  "function endPresale()",
];
const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
];

const PRESALE_ADDRESS = "0x22253069F569aAa07f285fb7629F2c615380Fe76";
const TOKEN_ADDRESS = "0xeE992C5e008CEd3357953d020d422C5FC826C494";
const BSC_MAINNET_PARAMS = {
  chainId: "0x38",
  chainName: "Binance Smart Chain Mainnet",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: ["https://bsc-dataseed.binance.org/"],
  blockExplorerUrls: ["https://bscscan.com"],
};

const TRANSLATIONS = {
  en: {
    title: "Join DIDIPAI Presale",
    subtitle: "Buy $DIDIPAI on Binance Smart Chain. Secure, fast and low fees.",
    buyNow: "Buy Now",
    viewOnBsc: "View on BscScan",
    price: "Price",
    sold: "Sold",
    yourBalance: "Your balance",
    amountLabel: "Amount",
    buyButton: "Buy",
    reset: "Reset",
    note: "Make sure your wallet is connected and on BSC Mainnet. You will receive tokens automatically after confirmation.",
    advantagesTitle: "Why investors choose DIDIPAI",
    advantages: [
      { title: "AI-driven ecosystem", text: "A powerful blend of AI and blockchain delivering utility and innovation." },
      { title: "Automatic burn", text: "Deflationary mechanism: a portion of tokens is auto-burned on transactions to increase scarcity." },
      { title: "Airdrop rewards", text: "Periodic airdrops reward long-term holders proportionally to balances." },
      { title: "Low fees & speed", text: "Powered by BSC — near-instant transactions with minimal fees." },
      { title: "Limited supply", text: "Fixed max supply creates scarcity and long-term value potential." },
      { title: "Transparency & security", text: "Open codebase and verified contracts for investor confidence." },
    ],
    connectWallet: "Connect Wallet",
    connected: "Connected",
    switchToBSC: "Please switch your wallet to Binance Smart Chain (BSC).",
    walletNotFound: "MetaMask not found",
    buySuccess: "Purchase successful — tokens will appear in your wallet.",
    buyFailed: "Buy failed: ",
    endPresale: "End Presale",
    presaleEndedMsg: "Presale ended — unsold tokens will be handled.",
    headerPresale: "Presale (BscScan)",
    headerToken: "Token (BscScan)",
    follow: "Follow @DIDIPAIcoin",
    footerText: "Built for the community. Smart contracts:",
  },
  ru: {
    title: "Присоединяйся к предпродаже DIDIPAI",
    subtitle: "Купите $DIDIPAI на Binance Smart Chain. Безопасно, быстро и с низкими комиссиями.",
    buyNow: "Купить",
    viewOnBsc: "Посмотреть на BscScan",
    price: "Цена",
    sold: "Продано",
    yourBalance: "Ваш баланс",
    amountLabel: "Количество",
    buyButton: "Купить",
    reset: "Сброс",
    note: "Убедитесь, что кошелёк подключён и вы в сети BSC. Токены придут автоматически после подтверждения.",
    advantagesTitle: "Почему инвесторы выбирают DIDIPAI",
    advantages: [
      { title: "AI-экосистема", text: "Сильное сочетание ИИ и блокчейна, приносящее реальную пользу." },
      { title: "Автоматическое сжигание", text: "Дефляционный механизм: часть токенов автоматически сжигается при транзакциях, уменьшая предложение." },
      { title: "Вознаграждения (Airdrop)", text: "Периодические airdrop-награды для держателей пропорционально балансу." },
      { title: "Низкие комиссии и скорость", text: "На базе BSC — мгновенные транзакции и минимальные комиссии." },
      { title: "Ограниченная эмиссия", text: "Фиксированное максимальное предложение создаёт дефицит и потенциал роста." },
      { title: "Прозрачность и безопасность", text: "Открытый код и проверенные контракты для доверия инвесторов." },
    ],
    connectWallet: "Подключить кошелёк",
    connected: "Подключено",
    switchToBSC: "Пожалуйста, переключите кошелёк на Binance Smart Chain (BSC).",
    walletNotFound: "MetaMask не найден",
    buySuccess: "Покупка успешна — токены появятся в вашем кошельке.",
    buyFailed: "Ошибка покупки: ",
    endPresale: "Завершить предпродажу",
    presaleEndedMsg: "Предпродажа завершена — непроданные токены будут обработаны.",
    headerPresale: "Предпродажа (BscScan)",
    headerToken: "Токен (BscScan)",
    follow: "Подписаться @DIDIPAIcoin",
    footerText: "Создано для сообщества. Смарт-контракты:",
  },
  cn: {
    title: "加入 DIDIPAI 预售",
    subtitle: "在 Binance Smart Chain 购买 $DIDIPAI。安全、快速、低手续费。",
    buyNow: "立即购买",
    viewOnBsc: "在 BscScan 查看",
    price: "价格",
    sold: "已售出",
    yourBalance: "您的余额",
    amountLabel: "数量",
    buyButton: "购买",
    reset: "重置",
    note: "请确保钱包已连接并处于 BSC 主网。交易确认后，代币会自动发放到您的钱包。",
    advantagesTitle: "为什么选择 DIDIPAI",
    advantages: [
      { title: "AI 驱动生态", text: "AI 与区块链的强力结合，提供实用性与创新。" },
      { title: "自动销毁机制", text: "通缩模型：每笔交易会自动销毁部分代币，降低流通量。" },
      { title: "空投奖励", text: "定期空投奖励长期持有者，按余额分配。" },
      { title: "低手续费与高速度", text: "基于 BSC — 快速确认，手续费极低。" },
      { title: "有限发行", text: "固定最大供应量创造稀缺性与长期增值潜力。" },
      { title: "透明与安全", text: "开源合约与审计保证投资者信心。" },
    ],
    connectWallet: "连接钱包",
    connected: "已连接",
    switchToBSC: "请将钱包切换到 Binance Smart Chain (BSC)。",
    walletNotFound: "未检测到 MetaMask",
    buySuccess: "购买成功 — 代币将发送到您的钱包。",
    buyFailed: "购买失败：",
    endPresale: "结束预售",
    presaleEndedMsg: "预售已结束 — 未售出的代币将被处理。",
    headerPresale: "预售 (BscScan)",
    headerToken: "代币 (BscScan)",
    follow: "关注 @DIDIPAIcoin",
    footerText: "为社区打造。智能合约：",
  }
};

export default function DidipaiPresale() {
  const [lang, setLang] = useState(localStorage.getItem("didipai_lang") || "en");
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [presale, setPresale] = useState(null);
  const [token, setToken] = useState(null);
  const [decimals, setDecimals] = useState(18);
  const [price, setPrice] = useState(null);
  const [tokensSold, setTokensSold] = useState("0");
  const [presaleCap, setPresaleCap] = useState(null);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [buyAmount, setBuyAmount] = useState(0);
  const [isBuying, setIsBuying] = useState(false);
  const [userBalance, setUserBalance] = useState("0");

  useEffect(() => {
    localStorage.setItem("didipai_lang", lang);
  }, [lang]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
      window.ethereum.on("chainChanged", () => window.location.reload());
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, []);

  async function ensureBSC() {
    if (!window.ethereum) return false;
    try {
      const current = await window.ethereum.request({ method: "eth_chainId" });
      if (current !== BSC_MAINNET_PARAMS.chainId) {
        try {
          await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: BSC_MAINNET_PARAMS.chainId }] });
        } catch (err) {
          if (err.code === 4902) {
            await window.ethereum.request({ method: "wallet_addEthereumChain", params: [BSC_MAINNET_PARAMS] });
          } else {
            throw err;
          }
        }
      }
      return true;
    } catch (err) {
      toast.error(t.switchToBSC);
      return false;
    }
  }

  async function connectWallet() {
    try {
      if (!window.ethereum) throw new Error(t.walletNotFound);
      const ok = await ensureBSC(); if (!ok) return;
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const p = new ethers.BrowserProvider(window.ethereum);
      const s = await p.getSigner();
      const a = await s.getAddress();
      setProvider(p); setSigner(s); setAccount(a);
      toast.success(t.connected + ": " + a);
    } catch (err) {
      toast.error(err.message || t.walletNotFound);
    }
  }

  useEffect(() => {
    if (!provider) return;
    (async () => {
      try {
        const presaleContract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, provider);
        const tokenAddr = (await presaleContract.token()).toString() || TOKEN_ADDRESS;
        const tokenContract = new ethers.Contract(tokenAddr, TOKEN_ABI, provider);

        setPresale(presaleContract);
        setToken(tokenContract);

        const [decs, pPrice, sold, cap, ended] = await Promise.all([
          tokenContract.decimals().catch(() => 18),
          presaleContract.price().catch(() => ethers.parseEther("0.0001")),
          presaleContract.tokensSold().catch(() => ethers.parseUnits("0", 18)),
          presaleContract.presaleCap().catch(() => ethers.parseUnits("2500000", 18)),
          presaleContract.presaleEnded().catch(() => false),
        ]);

        setDecimals(Number(decs || 18)); setPrice(pPrice); setTokensSold(sold.toString()); setPresaleCap(cap); setPresaleEnded(ended);

        if (account) {
          const bal = await tokenContract.balanceOf(account);
          setUserBalance(ethers.formatUnits(bal, Number(decs || 18)));
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [provider, account]);

  function formatUnits(value) { try { return ethers.formatUnits(value, decimals); } catch (e) { return value.toString(); } }

  async function handleBuy(e) {
    e.preventDefault();
    if (!presale || !signer) return toast.error(t.connectWallet);
    try {
      const ok = await ensureBSC(); if (!ok) return;
      setIsBuying(true);
      const notifyId = toast.loading(t.buyNow + "...");
      const tokens = ethers.parseUnits(String(buyAmount || 0), decimals);
      const cost = (BigInt(tokens.toString()) * BigInt(price.toString())) / BigInt(10 ** decimals);
      const contractWithSigner = presale.connect(signer);
      const tx = await contractWithSigner.buy({ value: cost.toString() });
      toast.loading(t.buyNow + " — waiting for confirmation...", { id: notifyId });
      await tx.wait();
      toast.dismiss(notifyId);
      toast.success(t.buySuccess, { icon: <FiCheckCircle /> });
      const sold = await presale.tokensSold(); setTokensSold(sold.toString());
      if (token && account) { const bal = await token.balanceOf(account); setUserBalance(ethers.formatUnits(bal, decimals)); }
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error((t.buyFailed || "Error: ") + (err.message || String(err)));
    } finally { setIsBuying(false); }
  }

  async function handleEnd() {
    if (!presale || !signer) return toast.error(t.connectWallet);
    try { const c = presale.connect(signer); const tx = await c.endPresale(); toast.loading(t.endPresale + "..."); await tx.wait(); toast.success(t.presaleEndedMsg); const ended = await presale.presaleEnded(); setPresaleEnded(ended); } catch (err) { console.error(err); toast.error(err.message || "endPresale failed"); }
  }

  const progress = presaleCap ? Math.min((Number(formatUnits(tokensSold)) / Number(formatUnits(presaleCap || 1))) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] via-[#0b1020] to-[#061426] text-white font-sans">
      <Toaster position="top-center" />
      <header className="max-w-6xl mx-auto flex items-center justify-between py-6 px-6">
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-400 flex items-center justify-center shadow-xl">
            <img src="/logo-DIDIPAI.png" alt="$DIDIPAI" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <div className="text-2xl font-extrabold tracking-tight">DIDIPAI</div>
            <div className="text-xs text-slate-300">Presale • BSC</div>
          </div>
        </motion.div>

        <div className="flex items-center gap-4">
          <a href={`https://bscscan.com/address/${PRESALE_ADDRESS}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-white text-xs">
            <FiExternalLink /> {t.headerPresale}
          </a>
          <a href={`https://bscscan.com/address/${TOKEN_ADDRESS}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-white text-xs">
            <FiExternalLink /> {t.headerToken}
          </a>
          <a href="https://x.com/DIDIPAIcoin" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sky-400 hover:text-white text-xs">
            <FaTwitter /> {t.follow}
          </a>

          <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-[#051423] px-2 py-1 rounded-md text-sm">
            <option value="en">EN</option>
            <option value="ru">RU</option>
            <option value="cn">中文</option>
          </select>

          {account ? (
            <div className="px-3 py-2 bg-[#041229] rounded-lg border border-[#14324b] text-sm font-mono">
              <div className="text-[10px] text-slate-400">{t.connected}</div>
              <div className="text-xs">{account}</div>
            </div>
          ) : (
            <button onClick={connectWallet} className="px-4 py-2 bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] text-black font-semibold rounded-lg shadow">{t.connectWallet}</button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <section className="grid md:grid-cols-2 gap-8 items-center mt-6">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">{t.title}</h1>
            <p className="text-slate-300 max-w-xl">{t.subtitle}</p>

            <div className="flex gap-3">
              <button onClick={() => document.getElementById('buy-form').scrollIntoView({behavior: 'smooth'})} className="px-6 py-3 bg-gradient-to-br from-[#ff7bd0] to-[#7c3aed] rounded-lg font-semibold shadow-lg">{t.buyNow}</button>
              <a href={`https://bscscan.com/address/${TOKEN_ADDRESS}`} target="_blank" rel="noreferrer" className="px-6 py-3 border border-slate-700 rounded-lg text-sm flex items-center gap-2">{t.viewOnBsc}</a>
            </div>

            <div className="mt-4 flex gap-4 items-center">
              <div className="bg-[#081426] p-4 rounded-xl shadow-inner">
                <div className="text-xs text-slate-400">{t.price}</div>
                <div className="font-bold mt-1">{price ? ethers.formatEther(price) + ' BNB' : '—'}</div>
              </div>
              <div className="bg-[#081426] p-4 rounded-xl shadow-inner">
                <div className="text-xs text-slate-400">{t.sold}</div>
                <div className="font-bold mt-1">{formatUnits(tokensSold)}</div>
              </div>
              <div className="bg-[#081426] p-4 rounded-xl">
                <div className="text-xs text-slate-400">{t.yourBalance}</div>
                <div className="font-bold mt-1">{userBalance}</div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-gradient-to-br from-[#071229] to-[#051018] p-6 rounded-2xl shadow-xl border border-[#122033]">
            <h3 className="text-lg font-semibold mb-3">Presale</h3>

            <div className="mb-4">
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] rounded-full" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2"><div>{formatUnits(tokensSold)} {t.sold.toLowerCase()}</div><div>{formatUnits(presaleCap || 0)} cap</div></div>
            </div>

            <form id="buy-form" onSubmit={handleBuy} className="space-y-3">
              <label className="text-xs text-slate-400">{t.amountLabel} ({token ? token.symbol?.() : 'DIDI'})</label>
              <input type="number" min="0" step="any" value={buyAmount} onChange={(e) => setBuyAmount(e.target.value)} className="w-full p-3 rounded-lg bg-[#021122] border border-[#123048] outline-none" />

              <div className="flex gap-2">
                <button disabled={isBuying} type="submit" className={`flex-1 px-4 py-3 rounded-lg font-semibold ${isBuying ? 'bg-gray-600' : 'bg-gradient-to-br from-[#00d4ff] to-[#7c3aed]'}`}>{isBuying ? (lang==='en'? 'Processing...' : lang==='ru'? 'Обработка...' : '处理中...') : t.buyButton}</button>
                {account && <button type="button" onClick={() => { setBuyAmount(0); toast(t.reset); }} className="px-4 py-3 bg-[#081426] rounded-lg">{t.reset}</button>}
              </div>

              <div className="text-xs text-slate-400">{t.note}</div>
            </form>

            {account && (<div className="mt-4 text-xs text-slate-400">{t.connected}: <span className="font-mono">{account}</span></div>)}

            {presale && signer && presale.presaleOwner && (
              <div className="mt-4 hidden">{/* owner actions could go here */}</div>
            )}

          </motion.div>
        </section>

        <section className="mt-12">
          <h4 className="text-2xl font-semibold text-center text-white mb-6">{t.advantagesTitle}</h4>
          <div className="grid md:grid-cols-3 gap-6">
            {t.advantages.map((a, idx) => (
              <motion.div key={idx} initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="p-6 rounded-xl bg-gradient-to-br from-[#041426] to-[#02101a] border border-[#123049] shadow-md">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#00d4ff] flex items-center justify-center text-black font-bold mb-4">{a.title.split(' ').slice(0,2).map(s=>s[0]).join('').toUpperCase()}</div>
                <h5 className="font-semibold mb-2">{a.title}</h5>
                <p className="text-sm text-slate-300">{a.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-12 text-center text-slate-300">
          <div className="mt-4 flex items-center justify-center gap-6">
            <a href={`https://bscscan.com/address/${TOKEN_ADDRESS}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-white">
              <FiExternalLink /> Token on BscScan
            </a>
            <a href={`https://bscscan.com/address/${PRESALE_ADDRESS}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-white">
              <FiExternalLink /> Presale on BscScan
            </a>
            <a href="https://x.com/DIDIPAIcoin" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sky-400 hover:text-white">
              <FaTwitter /> {t.follow}
            </a>
          </div>
        </section>

        <footer className="mt-14 py-10 text-center text-slate-400">
          <div className="max-w-3xl mx-auto">© {new Date().getFullYear()} DIDIPAI — {t.footerText} <a href={`https://bscscan.com/address/${PRESALE_ADDRESS}`} className="underline">Presale</a> • <a href={`https://bscscan.com/address/${TOKEN_ADDRESS}`} className="underline">Token</a></div>
        </footer>
      </main>
    </div>
  );
}
