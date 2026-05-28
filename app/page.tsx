"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Project = {
  id: string;
  name: string;
  category: string;
  href: string;
  image: string;
  width: number;
  height: number;
};

type Row =
  | { type: "1col"; project: Project }
  | { type: "2col"; projects: [Project, Project] };

const rows: Row[] = [
  {
    type: "1col",
    project: { id: "calderalab-1", name: "Caldera Lab", category: "Brand Identity", href: "/projects/calderalab", image: "/assets/images/calderalab/1.jpg", width: 750, height: 1000 },
  },
  {
    type: "2col",
    projects: [
      { id: "chanel-1", name: "Chanel", category: "Art Direction", href: "/projects/chanel", image: "/assets/images/chanel/1.jpg", width: 750, height: 1000 },
      { id: "tekinoktay-1", name: "Tekin Oktay Day", category: "Editorial", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/1.jpg", width: 750, height: 1000 },
    ],
  },
  {
    type: "1col",
    project: { id: "calderalab-2", name: "Caldera Lab", category: "Brand Identity", href: "/projects/calderalab", image: "/assets/images/calderalab/2.jpg", width: 750, height: 1000 },
  },
  {
    type: "2col",
    projects: [
      { id: "chanel-2", name: "Chanel", category: "Art Direction", href: "/projects/chanel", image: "/assets/images/chanel/2.jpg", width: 750, height: 1000 },
      { id: "tekinoktay-2", name: "Tekin Oktay Day", category: "Editorial", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/2.jpg", width: 2500, height: 3333 },
    ],
  },
  {
    type: "1col",
    project: { id: "calderalab-3", name: "Caldera Lab", category: "Brand Identity", href: "/projects/calderalab", image: "/assets/images/calderalab/3.jpg", width: 750, height: 1000 },
  },
  {
    type: "2col",
    projects: [
      { id: "chanel-3", name: "Chanel", category: "Art Direction", href: "/projects/chanel", image: "/assets/images/chanel/3.jpg", width: 750, height: 1000 },
      { id: "tekinoktay-3", name: "Tekin Oktay Day", category: "Editorial", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/3.jpg", width: 2500, height: 3333 },
    ],
  },
  {
    type: "1col",
    project: { id: "calderalab-4", name: "Caldera Lab", category: "Brand Identity", href: "/projects/calderalab", image: "/assets/images/calderalab/4.jpg", width: 500, height: 666 },
  },
  {
    type: "2col",
    projects: [
      { id: "chanel-4", name: "Chanel", category: "Art Direction", href: "/projects/chanel", image: "/assets/images/chanel/4.jpg", width: 750, height: 1000 },
      { id: "tekinoktay-4", name: "Tekin Oktay Day", category: "Editorial", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/4.jpg", width: 2500, height: 3333 },
    ],
  },
  {
    type: "1col",
    project: { id: "calderalab-5", name: "Caldera Lab", category: "Brand Identity", href: "/projects/calderalab", image: "/assets/images/calderalab/5.jpg", width: 750, height: 1000 },
  },
  {
    type: "2col",
    projects: [
      { id: "tekinoktay-5", name: "Tekin Oktay Day", category: "Editorial", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/5.jpg", width: 1500, height: 2000 },
      { id: "tekinoktay-6", name: "Tekin Oktay Day", category: "Editorial", href: "/projects/tekinoktay-day", image: "/assets/images/tekinoktay-day/6.jpg", width: 1500, height: 2000 },
    ],
  },
];

function ProjectMeta({ name, category }: { name: string; category: string }) {
  return (
    <div className="flex items-center gap-[15px] mt-3">
      <h2
        className="m-0 font-normal text-[22px] leading-[21px]"
        style={{ fontFamily: "var(--font-lora), serif" }}
      >
        {name}
      </h2>
      <p className="m-0 text-[14px] font-semibold leading-none opacity-60">
        {category}
      </p>
    </div>
  );
}

function ProjectItem({ project }: { project: Project }) {
  return (
    <div>
      <Link href={project.href} className="group/card relative block">
        <Image
          src={project.image}
          alt={project.name}
          width={project.width}
          height={project.height}
          style={{ width: "100%", height: "auto" }}
          className="block"
          sizes="(max-width: 767px) 100vw, 50vw"
        />
        <div className="hidden md:flex absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-[var(--white-smoke)]/80 flex-col items-center justify-center text-center gap-3">
          <h2
            className="m-0 font-normal text-[var(--brand-black)] text-[22px] leading-[21px] translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300"
            style={{ fontFamily: "var(--font-lora), serif" }}
          >
            {project.name}
          </h2>
          <p className="m-0 text-[var(--brand-black)]/60 text-[14px] font-semibold leading-none translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300 delay-75">
            {project.category}
          </p>
        </div>
      </Link>
      <div className="md:hidden">
        <ProjectMeta name={project.name} category={project.category} />
      </div>
    </div>
  );
}

const rowSpacing = "mt-5 md:mt-10 lg:mt-[72px] px-5 md:px-10 lg:px-[72px]";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row) => {
      const items = row.querySelectorAll<HTMLElement>("[data-item]");
      const targets = items.length ? Array.from(items) : [row];

      gsap.fromTo(
        targets,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: row,
            start: "top 88%",
            once: true,
          },
        }
      );
    });
  }, { scope: mainRef });

  return (
    <main
      ref={mainRef}
      className="pb-[72px] max-w-[1200px] mx-auto"
      style={{ backgroundColor: "var(--white-smoke)", color: "var(--brand-black)" }}
    >
      {rows.map((row, i) => {
        if (row.type === "1col") {
          return (
            <div key={i} data-row className={rowSpacing}>
              <div data-item className="group/card relative mx-auto max-w-full">
                <video
                  src="/assets/hero.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: "100%", height: "auto" }}
                  className="block"
                />
                <div className="hidden md:flex absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-[var(--white-smoke)]/80 flex-col items-center justify-center text-center gap-3">
                  <h2
                    className="m-0 font-normal text-[var(--brand-black)] text-[22px] leading-[21px] translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300"
                    style={{ fontFamily: "var(--font-lora), serif" }}
                  >
                    {row.project.name}
                  </h2>
                  <p className="m-0 text-[var(--brand-black)]/60 text-[14px] font-semibold leading-none translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300 delay-75">
                    {row.project.category}
                  </p>
                </div>
              </div>
              <div className="md:hidden">
                <ProjectMeta name={row.project.name} category={row.project.category} />
              </div>
            </div>
          );
        }
        return (
          <div
            key={i}
            data-row
            className={`${rowSpacing} grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 lg:gap-[72px]`}
          >
            {row.projects.map((project) => (
              <div key={project.id} data-item>
                <ProjectItem project={project} />
              </div>
            ))}
          </div>
        );
      })}
    </main>
  );
}
