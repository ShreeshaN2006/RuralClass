import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Toast } from './components/Toast';
import { AboutModal } from './components/AboutModal';
import { RecordAssessmentModal } from './components/RecordAssessmentModal';
import { ParentSummaryModal } from './components/ParentSummaryModal';
import { ClassroomBalanceModal } from './components/ClassroomBalanceModal';
import { QuickAssessmentModal } from './components/QuickAssessmentModal';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { TimetablePage } from './pages/TimetablePage';
import { LessonPlannerPage } from './pages/LessonPlannerPage';
import { TodaysClassroomPage } from './pages/TodaysClassroomPage';
import { ActivityBankPage } from './pages/ActivityBankPage';
import { AttendancePage } from './pages/AttendancePage';
import { TeacherSupportPage } from './pages/TeacherSupportPage';
import { WeeklySummaryPage } from './pages/WeeklySummaryPage';
import { StudentsPage } from './pages/StudentsPage';
import { ProgressPage } from './pages/ProgressPage';
import { InterventionsPage } from './pages/InterventionsPage';
import { SchoolPage } from './pages/SchoolPage';
import { SettingsPage } from './pages/SettingsPage';

const AppShell: React.FC = () => {
  const { isAuthenticated, currentView } = useApp();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'todaysClassroom':
        return <TodaysClassroomPage />;
      case 'timetable':
        return <TimetablePage />;
      case 'lessonPlanner':
        return <LessonPlannerPage />;
      case 'activityBank':
        return <ActivityBankPage />;
      case 'attendance':
        return <AttendancePage />;
      case 'students':
      case 'studentProfile':
        return <StudentsPage />;
      case 'progress':
        return <ProgressPage />;
      case 'interventions':
        return <InterventionsPage />;
      case 'teacherSupport':
        return <TeacherSupportPage />;
      case 'weeklySummary':
        return <WeeklySummaryPage />;
      case 'school':
        return <SchoolPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-row font-sans text-stone-900 selection:bg-amber-200">
      {/* Sidebar Navigation */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Sticky Topbar */}
        <Topbar onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
          {renderCurrentView()}
        </main>
      </div>

      {/* Global Modals & Toast */}
      <AboutModal />
      <RecordAssessmentModal />
      <ParentSummaryModal />
      <ClassroomBalanceModal />
      <QuickAssessmentModal />
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
