/**
 * OceanScope - 3D Ocean Data Visualization Platform
 * Real-time, scientifically accurate georeferenced oceanographic research tool.
 */

import React, { useEffect } from 'react';
import { useOceanStore } from './store/useOceanStore';
import { OceanGlobe } from './components/OceanGlobe';
import { LayerControls } from './components/LayerControls';
import { DepthSlider } from './components/DepthSlider';
import { ScientificLegend } from './components/ScientificLegend';
import { DepthProfileChart } from './components/DepthProfileChart';
import { ClimateTrendsPanel } from './components/ClimateTrendsPanel';
import { ExportPanel } from './components/ExportPanel';
import { ProvenanceModal } from './components/ProvenanceModal';
import { MethodologyModal } from './components/MethodologyModal';
import { MarineLifeModal } from './components/MarineLifeModal';
import { PollutionModal } from './components/PollutionModal';
import { CompareModal } from './components/CompareModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { TopNav } from './components/TopNav';
import { OceanSearch } from './components/OceanSearch';
import { OceanBreadcrumb } from './components/OceanBreadcrumb';
import { OceanProfilePanel } from './components/OceanProfilePanel';
import { OceanRegionDetailModal } from './components/OceanRegionDetailModal';
import { CurrentLegend } from './components/CurrentLegend';
import { CurrentProfilePanel } from './components/CurrentProfilePanel';
import { SpeciesProfilePanel } from './components/SpeciesProfilePanel';
import { DiscoveryModal } from './components/DiscoveryModal';
import { StoryModeOverlay } from './components/StoryModeOverlay';
import { CycloneTimeline } from './components/CycloneTimeline';
import { CycloneInfoPanel } from './components/CycloneInfoPanel';
import { DisasterManagementModal } from './components/DisasterManagementModal';
import { CycloneArchiveModal } from './components/CycloneArchiveModal';
import { CycloneCompareModal } from './components/CycloneCompareModal';
import { CycloneStoryOverlay } from './components/CycloneStoryOverlay';
import { ScientificDataExplorer } from './components/ScientificDataExplorer';
import { OceanVariable, StandardDepth, ProjectionMode } from './types/ocean';
import { AlertTriangle } from 'lucide-react';

export default function App() {
  const {
    fetchCurrentLayerData,
    fetchFloatsData,
    selectedFloatProfile,
    selectFloat,
    selectedRegionId,
    activeVariable,
    selectedCurrentId,
    activeModal,
    setActiveModal,
    setActiveVariable,
    setActiveDepth,
    setProjection,
    setSelectedDate,
    showCycloneTrack,
    selectedCycloneId,
    cycloneStoryModeOpen,
    scientificDataOpen,
    closeScientificData,
    error
  } = useOceanStore();

  // Load URL query parameters on initial boot for bookmarkable sessions
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('var') as OceanVariable | null;
    const d = Number(params.get('depth')) as StandardDepth;
    const p = params.get('proj') as ProjectionMode | null;
    const dt = params.get('date');

    if (v) setActiveVariable(v);
    if (!isNaN(d)) setActiveDepth(d);
    if (p) setProjection(p);
    if (dt) setSelectedDate(dt);

    // Initial data load from backend API
    fetchCurrentLayerData();
    fetchFloatsData();
  }, []);

  return (
    <div id="oceanscope-root" className="flex flex-col min-h-screen w-full bg-slate-950 font-sans text-slate-100 overflow-x-hidden">
      {/* Top Navigation */}
      <TopNav />

      {/* Main 3D Globe Workspace (Screen Height Viewport) */}
      <div id="globe-explorer-workspace" className="h-[calc(100vh-3.5rem)] min-h-[580px] w-full flex relative overflow-hidden border-b border-slate-800/80">
        {/* Left Sidebar: Scientific Layer Controls */}
        <LayerControls />

        {/* Central Visualization Workspace */}
        <main className="flex-1 relative h-full w-full overflow-hidden bg-slate-950">
          {/* Three.js 3D Globe & 2D Projection */}
          <OceanGlobe />

          {/* Floating Search & Location Breadcrumb (Top Left) */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 max-w-[calc(100%-2rem)] sm:max-w-2xl pointer-events-none">
            <div className="pointer-events-auto">
              <OceanSearch />
            </div>
            <div className="pointer-events-auto">
              <OceanBreadcrumb />
            </div>
          </div>

          {/* Floating Ocean Region Profile Panel (Top Right / Bottom Sheet on Mobile) */}
          <OceanProfilePanel />

          {/* Floating Depth Level Slider (Bottom Center) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4 pointer-events-auto">
            <DepthSlider />
          </div>

          {/* Floating Scientific Colormap Legend or Ocean Current Legend (Bottom Left) */}
          <div className="absolute bottom-6 left-6 z-20 pointer-events-auto flex flex-col gap-2">
            {activeVariable === 'currents' || selectedCurrentId ? (
              <CurrentLegend />
            ) : (
              <ScientificLegend />
            )}
          </div>

          {/* Floating Major Ocean Current Profile Panel (Top Right) */}
          <CurrentProfilePanel />

          {/* Floating Marine Species Profile Panel (Top Right) */}
          <SpeciesProfilePanel />

          {/* Curated Ocean Discovery Mode Modal */}
          <DiscoveryModal />

          {/* Cinematic Global Ocean Story Mode Overlay */}
          <StoryModeOverlay />

          {/* Guided Cyclone Experience the Event Story Overlay (Part 7) */}
          {cycloneStoryModeOpen && <CycloneStoryOverlay />}

          {/* Cyclone Synoptic Timeline Scrubber (Bottom center - visible when cyclone tracking active) */}
          {showCycloneTrack && selectedCycloneId && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-25 pointer-events-auto max-w-4xl w-[92%] animate-in fade-in slide-in-from-bottom-3 duration-200">
              <CycloneTimeline />
            </div>
          )}

          {/* Cyclone Scientific Telemetry & Ocean-Atmosphere Coupling Panel (Right side - visible when cyclone tracking active and no ocean region modal is open) */}
          {showCycloneTrack && selectedCycloneId && !selectedRegionId && (
            <div className="absolute top-4 right-4 z-20 pointer-events-auto max-w-sm w-full animate-in fade-in slide-in-from-right-3 duration-200">
              <CycloneInfoPanel />
            </div>
          )}

          {/* Floating Argo Float CTD Profile Chart (Top Right - visible when no ocean region panel is open) */}
          {selectedFloatProfile && !selectedRegionId && (
            <div className="absolute top-4 right-4 z-20 pointer-events-auto max-w-md w-full animate-in fade-in slide-in-from-top-2 duration-200">
              <DepthProfileChart
                profile={selectedFloatProfile}
                onClose={() => selectFloat(null)}
              />
            </div>
          )}

          {/* Upstream error banner if government API is temporarily unreachable */}
          {error && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-lg bg-amber-950/90 border border-amber-800 text-amber-200 text-xs font-mono flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>{error} — Serving local high-resolution WOA23 fallback</span>
            </div>
          )}
        </main>
      </div>

      {/* Ocean Story Journey Section: "Earth → Oceans → Discover → Investigate → Understand → Protect" */}
      <div id="ocean-journey-hero">
        <HeroSection
          onExploreClick={() => {
            const workspace = document.getElementById('globe-explorer-workspace');
            workspace?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* Methodology & How it Works Section: 01 Explore, 02 Investigate, 03 Understand, 04 Protect */}
      <HowItWorksSection />

      {/* Final Call to Action Section: "THE OCEAN IS STILL FULL OF QUESTIONS." / "Start exploring." */}
      <FinalCtaSection
        onEnterClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals & Diagnostic Overlays */}
      {activeModal === 'export' && (
        <ExportPanel onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'provenance' && (
        <ProvenanceModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'methodology' && (
        <MethodologyModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'api-docs' && (
        <ClimateTrendsPanel onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'marine-life' && (
        <MarineLifeModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'pollution' && (
        <PollutionModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'compare' && (
        <CompareModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'ai-assistant' && (
        <AiAssistantModal onClose={() => setActiveModal(null)} />
      )}

      {/* Part 7 Disaster Center Modals */}
      {activeModal === 'disaster-management' && (
        <DisasterManagementModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'cyclone-archive' && (
        <CycloneArchiveModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'cyclone-compare' && (
        <CycloneCompareModal onClose={() => setActiveModal(null)} />
      )}

      {/* Scientific Data Foundation: Ocean Data Explorer, Time Series, Depth Explorer, Data Sources */}
      {scientificDataOpen && (
        <ScientificDataExplorer onClose={closeScientificData} />
      )}

      {/* Deep Regional Exploration Feature Modal */}
      <OceanRegionDetailModal />
    </div>
  );
}
