import React from 'react'
import Card from './ui/Card'
export default function Section({ title, right, children, tone }) {
  return (
    <section className="section mb-4 md:mb-6">
      <div className="section-head flex items-center justify-between mb-2 md:mb-3">
        <h2 className={`text-lg md:text-xl font-semibold ${tone || 'text-gray-900 dark:text-gray-100'}`}>{title}</h2>
        {right}
      </div>
      <div className="card-hover rounded-2xl p-3 md:p-4 border border-zinc-200/60 dark:border-white/10
                      bg-white/60 dark:bg-white/[0.04] shadow-sm">
        {children}
      </div>
    </section>
  );
}
