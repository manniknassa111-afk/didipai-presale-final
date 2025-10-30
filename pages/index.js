import dynamic from 'next/dynamic';
import React from 'react';
import { motion } from 'framer-motion';

const DidipaiPresale = dynamic(() => import('../components/DidipaiPresale'), { ssr: false });

export default function Home() {
  return (
    <>
      <DidipaiPresale />

      {/* About / Advantages Section */}
      <section className="py-20 bg-gradient-to-b from-gray-950 to-gray-900 text-center text-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            $DIDIPAI — Smarter. Faster. Stronger.
          </motion.h2>

          <motion.p
            className="text-lg text-gray-300 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            DIDIPAI is a next-generation AI-driven token on Binance Smart Chain (BSC),
            designed to reward holders, automatically burn supply, and enable smart decentralized growth.
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                icon: '🔥',
                title: 'Auto Burn System',
                desc: 'A deflationary mechanism that continuously reduces total supply, increasing scarcity and long-term value.',
                delay: 0.3,
              },
              {
                icon: '🎁',
                title: 'Holder Airdrops',
                desc: 'Active community rewards! All token holders receive automatic airdrops and participation bonuses.',
                delay: 0.4,
              },
              {
                icon: '⚡',
                title: 'Low Fees & Fast Transactions',
                desc: 'Built on BSC for efficiency — ultra-low transaction fees and instant confirmations.',
                delay: 0.5,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: item.delay }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-semibold mb-2">{item.icon} {item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-400 text-lg italic">
              Empowered by AI. Driven by community. Secured by blockchain.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
