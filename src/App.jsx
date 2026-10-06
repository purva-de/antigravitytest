import React, { useState, useEffect, Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import HeroExperience from "./components/HeroExperience";
import Introduction from "./components/Introduction";
import SelectedWork from "./components/SelectedWork";
import Studio from "./components/Studio";
import Services from "./components/Services";
import Process from "./components/Process";
import Contact from "./components/Contact";
import SpatialPillars from "./components/SpatialPillars";
import CustomCursor from "./components/CustomCursor";
import LogoIntroScreen from "./components/LogoIntroScreen";
import { PROJECTS_DATA } from "./data/projectsData";

// Performance Optimization: Lazy-load ProjectDetail modal
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [introActive, setIntroActive] = useState(true);

  // Default architectural gallery theme
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "light");
    root.classList.remove("dark");
    localStorage.removeItem("consilio_theme");
  }, []);

  // Section Observer for active navbar state
  useEffect(() => {
    const sections = ["hero", "studio-intro", "work", "studio", "services", "process", "contact"];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parse current URL route (supports /project/:id, /work, /services, ?project=:id, #work)
  const parseCurrentRoute = () => {
    if (typeof window === "undefined") return { type: "home" };
    const pathname = window.location.pathname.replace(/^\/+|\/+$/g, "");
    const hash = window.location.hash.replace(/^#\/?/, "");
    const searchParams = new URLSearchParams(window.location.search);
    const projectQuery = searchParams.get("project");

    // 1. Direct project route check
    let targetProjectId = null;
    if (pathname.startsWith("project/")) {
      targetProjectId = pathname.replace("project/", "");
    } else if (projectQuery) {
      targetProjectId = projectQuery;
    } else if (hash.startsWith("project-")) {
      targetProjectId = hash.replace("project-", "");
    }

    if (targetProjectId) {
      const aliasMap = {
        "tv-unit": "tv-showcase",
        "classic-interior": "wooden-interior"
      };
      const resolvedId = aliasMap[targetProjectId] || targetProjectId;
      const found = PROJECTS_DATA.find((p) => p.id === resolvedId);
      if (found) return { type: "project", project: found };
    }

    // 2. Direct section route check
    const validSections = ["hero", "studio-intro", "work", "studio", "services", "process", "contact", "intentions"];
    const candidateSection = pathname || hash;
    if (validSections.includes(candidateSection)) {
      return { type: "section", section: candidateSection };
    }

    return { type: "home" };
  };

  // Direct URL routing on initial page load and browser history changes (Back / Forward)
  useEffect(() => {
    const initialRoute = parseCurrentRoute();
    if (initialRoute.type === "project") {
      setSelectedProject(initialRoute.project);
    } else if (initialRoute.type === "section" && initialRoute.section !== "hero") {
      setTimeout(() => {
        handleNavigate(initialRoute.section, false);
      }, 350);
    }

    const handlePopState = () => {
      const currentRoute = parseCurrentRoute();
      if (currentRoute.type === "project") {
        setSelectedProject(currentRoute.project);
      } else {
        setSelectedProject(null);
        if (currentRoute.type === "section") {
          handleNavigate(currentRoute.section, false);
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigate = (sectionId, updateHistory = true) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      if (updateHistory && typeof window !== "undefined") {
        const targetPath = sectionId === "hero" ? "/" : `/${sectionId}`;
        if (window.location.pathname !== targetPath) {
          window.history.pushState(null, "", targetPath);
        }
      }
    }
  };

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    if (typeof window !== "undefined") {
      window.history.pushState({ projectId: project.id }, "", `/project/${project.id}`);
    }
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    if (typeof window !== "undefined") {
      const returnPath = activeSection && activeSection !== "hero" ? `/${activeSection}` : "/";
      window.history.pushState(null, "", returnPath);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-500 font-sans selection:bg-[var(--color-accent)] selection:text-white relative overflow-x-clip">
      {/* 0. Architectural Black Logo Intro Screen (Loads First; Reveals Website on Scroll) */}
      <LogoIntroScreen onIntroComplete={() => setIntroActive(false)} />

      {/* Desktop Editorial Cursor */}
      <CustomCursor />

      {/* Luxury Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={(id) => handleNavigate(id, true)}
      />

      {/* Main Architectural Content */}
      <main id="main-content" className="relative">
        {/* 1. Cinematic Scrollytelling Hero (START FRAME -> LAST FRAME) */}
        <HeroExperience onExploreProjects={() => handleNavigate("work", true)} />

        {/* 2. Editorial Introduction */}
        <Introduction />

        {/* 3. Interactive 3D Architectural Intentions Showcase */}
        <SpatialPillars onSelectProject={handleOpenProject} />

        {/* 4. Selected Portfolio & Authentic Projects */}
        <SelectedWork onSelectProject={handleOpenProject} />

        {/* 4. Studio Philosophy & Credentials */}
        <Studio />

        {/* 5. Services & Disciplines with Interactive Previews */}
        <Services />

        {/* 6. Five-Phase Architectural Process */}
        <Process />

        {/* 7. Meaningful Collaboration, Studio Directory & Architectural Closing */}
        <Contact onNavigate={(id) => handleNavigate(id, true)} />
      </main>

      {/* Immersive Project Case Study Lightbox / Detail Modal */}
      {selectedProject && (
        <Suspense fallback={null}>
          <ProjectDetail
            project={selectedProject}
            onClose={handleCloseProject}
            onSelectProject={handleOpenProject}
          />
        </Suspense>
      )}
    </div>
  );
}
