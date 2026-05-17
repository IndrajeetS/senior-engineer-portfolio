import Layout from "@/components/layout/Layout";
import About from "../components/About";
import Blogs from "../components/Blogs";
import Contact from "../components/Contact";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import Skills from "../components/Skills";
import StatsBar from "../components/StatsBar";

export default function Home() {
  return (
    <Layout mainClassName="pt-20 pb-0">
      {/* 1. Above the Fold (Hook) */}
      <Hero />
      <StatsBar />

      {/* 2. Core Identity & Toolkit */}
      <About />
      <Skills />

      {/* 3. Professional Validation (Proof of Work) */}
      <Experience />
      <Projects />
      {/* <Testimonials /> */}

      {/* 4. Secondary Background & Thought Leadership */}
      <Education />
      <Blogs />

      {/* 5. Goal Conversion */}
      <Contact />
    </Layout>
  );
}
