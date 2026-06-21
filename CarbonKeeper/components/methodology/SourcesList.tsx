"use client";

export function SourcesList() {
  return (
    <section>
      <h2 className="text-[28px] font-medium text-ink tracking-[-1px] mb-8">
        Sources
      </h2>
      <ul className="space-y-3">
        <li className="bg-surface-soft border border-hairline rounded-[12px] p-5 shadow-sm">
          <p className="font-semibold text-ink">
            UK Government DEFRA 2024
          </p>
          <p className="text-muted text-[14px] font-medium mt-1">
            Greenhouse gas reporting: conversion factors 2024. UK Department
            for Energy Security and Net Zero.
          </p>
        </li>
        <li className="bg-surface-soft border border-hairline rounded-[12px] p-5 shadow-sm">
          <p className="font-semibold text-ink">
            Poore &amp; Nemecek 2018
          </p>
          <p className="text-muted text-[14px] font-medium mt-1">
            &ldquo;Reducing food&rsquo;s environmental impacts through
            producers and consumers.&rdquo; Science 360(6392): 987-992.
          </p>
        </li>
        <li className="bg-surface-soft border border-hairline rounded-[12px] p-5 shadow-sm">
          <p className="font-semibold text-ink">
            IPCC AR6 (2021)
          </p>
          <p className="text-muted text-[14px] font-medium mt-1">
            Regional grid carbon intensity benchmarks derived from the Sixth
            Assessment Report, Working Group III.
          </p>
        </li>
      </ul>
    </section>
  );
}