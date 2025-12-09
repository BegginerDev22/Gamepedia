
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { TournamentPage } from './pages/Tournament';
import { MatchPage } from './pages/Match';
import { AdminDashboard } from './pages/AdminDashboard';
import { TeamsPage } from './pages/Teams';
import { TeamDetailPage } from './pages/TeamDetail';
import { StatsPage } from './pages/Stats';
import { MatchesPage } from './pages/Matches';
import { PlayerProfile } from './pages/PlayerProfile';
import { ComparePage } from './pages/Compare';
import { FantasyPage } from './pages/Fantasy';
import { NewsPage } from './pages/News';
import { StrategyMapPage } from './pages/StrategyMap';
import { ScrimsPage } from './pages/Scrims';
import { VodsPage } from './pages/Vods';
import { PickemsPage } from './pages/Pickems';
import { HistoryPage } from './pages/History';
import { UserProfile } from './pages/UserProfile';
import { WeaponsPage } from './pages/Weapons';
import { GuidesPage } from './pages/Guides';
import { GlossaryPage } from './pages/Glossary';
import { DamageCalculatorPage } from './pages/DamageCalculator';
import { CosmeticsPage } from './pages/Cosmetics';
import { MetaTrackerPage } from './pages/MetaTracker';
import { StorePage } from './pages/Store';
import { RecruitmentPage } from './pages/Recruitment';
import { CrosshairGeneratorPage } from './pages/CrosshairGenerator';
import { DropRoulettePage } from './pages/DropRoulette';
import { EsportsCalendarPage } from './pages/EsportsCalendar';
import { ReactionTesterPage } from './pages/ReactionTester';
import { DeviceDatabasePage } from './pages/DeviceDatabase';
import { ReplayAnalysisPage } from './pages/ReplayAnalysis';
import { RankCalculatorPage } from './pages/RankCalculator';
import { TableGeneratorPage } from './pages/TableGenerator';
import { StrategyBoardPage } from './pages/StrategyBoard';
import { SensitivityConverterPage } from './pages/SensitivityConverter';
import { SprayTrainerPage } from './pages/SprayTrainer';
import { UCCalculatorPage } from './pages/UCCalculator';
import { BracketGeneratorPage } from './pages/BracketGenerator';
import { ZoneSimulatorPage } from './pages/ZoneSimulator';
import { NadeLineupsPage } from './pages/NadeLineups';
import { RulesetGeneratorPage } from './pages/RulesetGenerator';
import { VehicleWikiPage } from './pages/VehicleWiki';
import { TournamentRegistrationPage } from './pages/TournamentRegistration';
import { TeamBuilderPage } from './pages/TeamBuilder';
import { PollArchivePage } from './pages/PollArchive';
import { TriviaPage } from './pages/Trivia';
import { SensRepositoryPage } from './pages/SensRepository';
import { AttachmentWikiPage } from './pages/AttachmentWiki';
import { PrizeCalculatorPage } from './pages/PrizeCalculator';
import { MissionCenterPage } from './pages/MissionCenter';
import { ScorecardGeneratorPage } from './pages/ScorecardGenerator';
import { ClanManagerPage } from './pages/ClanManager';
import { ImpactCalculatorPage } from './pages/ImpactCalculator';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/tournament/:id" element={<TournamentPage />} />
          <Route path="/match/:id" element={<MatchPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/team/:id" element={<TeamDetailPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/fantasy" element={<FantasyPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/maps" element={<StrategyMapPage />} />
          <Route path="/scrims" element={<ScrimsPage />} />
          <Route path="/vods" element={<VodsPage />} />
          <Route path="/pickems" element={<PickemsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/weapons" element={<WeaponsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/calculator" element={<DamageCalculatorPage />} />
          <Route path="/cosmetics" element={<CosmeticsPage />} />
          <Route path="/meta" element={<MetaTrackerPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/recruitment" element={<RecruitmentPage />} />
          <Route path="/crosshair" element={<CrosshairGeneratorPage />} />
          <Route path="/roulette" element={<DropRoulettePage />} />
          <Route path="/calendar" element={<EsportsCalendarPage />} />
          <Route path="/reaction" element={<ReactionTesterPage />} />
          <Route path="/devices" element={<DeviceDatabasePage />} />
          <Route path="/replay" element={<ReplayAnalysisPage />} />
          <Route path="/rank-calculator" element={<RankCalculatorPage />} />
          <Route path="/table-generator" element={<TableGeneratorPage />} />
          <Route path="/bracket-generator" element={<BracketGeneratorPage />} />
          <Route path="/strats" element={<StrategyBoardPage />} />
          <Route path="/zone-sim" element={<ZoneSimulatorPage />} />
          <Route path="/sens-converter" element={<SensitivityConverterPage />} />
          <Route path="/spray-trainer" element={<SprayTrainerPage />} />
          <Route path="/uc-calc" element={<UCCalculatorPage />} />
          <Route path="/nades" element={<NadeLineupsPage />} />
          <Route path="/ruleset" element={<RulesetGeneratorPage />} />
          <Route path="/vehicles" element={<VehicleWikiPage />} />
          <Route path="/register" element={<TournamentRegistrationPage />} />
          <Route path="/team-builder" element={<TeamBuilderPage />} />
          <Route path="/polls" element={<PollArchivePage />} />
          <Route path="/trivia" element={<TriviaPage />} />
          <Route path="/codes" element={<SensRepositoryPage />} />
          <Route path="/attachments" element={<AttachmentWikiPage />} />
          <Route path="/prize-calc" element={<PrizeCalculatorPage />} />
          <Route path="/missions" element={<MissionCenterPage />} />
          <Route path="/scorecard-gen" element={<ScorecardGeneratorPage />} />
          <Route path="/clan" element={<ClanManagerPage />} />
          <Route path="/impact-calc" element={<ImpactCalculatorPage />} />
          {/* Placeholders for other routes */}
          <Route path="*" element={<div className="p-10 text-center text-slate-500">Page under construction</div>} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
