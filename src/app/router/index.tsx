import type { PropsWithChildren } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthLayout } from '@/components/layout/AuthLayout'
import { AppLayout } from '@/components/layout/AppLayout'
import { VoterLayout } from '@/components/layout/VoterLayout'
import { ProtectedRoute, RoleGuard } from '@/app/router/guards'
import { ORGANIZER_ROLES, ADMIN_ROLES } from '@/core/constants/roles'
import { ROUTES } from '@/core/constants/routes'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { HomePage } from '@/pages/public/HomePage'
import { TournamentListPage } from '@/features/tournaments/pages/TournamentListPage'
import { TournamentCreatePage } from '@/features/tournaments/pages/TournamentCreatePage'
import { TournamentDetailPage } from '@/features/tournaments/pages/TournamentDetailPage'
import { TournamentEditPage } from '@/features/tournaments/pages/TournamentEditPage'
import { ParticipantsPage } from '@/features/participants/components/ParticipantsPage'
import { RoundsPage } from '@/features/rounds/components/RoundsPage'
import { RoundDetailPage } from '@/features/rounds/components/RoundDetailPage'
import { MatchesPage } from '@/features/matches/components/MatchesPage'
import { UsersPage } from '@/features/users/pages/UsersPage'
import { AuditPage } from '@/features/audit/pages/AuditPage'
import { VoterHomePage } from '@/pages/voter/VoterHomePage'
import { VoterTournamentListPage } from '@/features/votes/components/VoterTournamentListPage'
import { VoterTournamentDetailPage } from '@/features/votes/components/VoterTournamentDetailPage'
import { VoterRoundPage } from '@/features/votes/components/VoterRoundPage'
import { VoteMatchPage } from '@/features/votes/components/VoteMatchPage'
import type { Role } from '@/core/constants/roles'

function AppShellPage({
  allowedRoles,
  children,
}: PropsWithChildren<{ allowedRoles: Role[] }>) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={allowedRoles}>
        <AppLayout>{children}</AppLayout>
      </RoleGuard>
    </ProtectedRoute>
  )
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.root} element={<HomePage />} />
        <Route
          path={ROUTES.login}
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path={ROUTES.register}
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route
          path={ROUTES.voteHome}
          element={
            <VoterLayout>
              <VoterHomePage />
            </VoterLayout>
          }
        />
        <Route
          path={ROUTES.voteTournaments}
          element={
            <VoterLayout>
              <VoterTournamentListPage />
            </VoterLayout>
          }
        />
        <Route
          path={ROUTES.voteTournament}
          element={
            <VoterLayout>
              <VoterTournamentDetailPage />
            </VoterLayout>
          }
        />
        <Route
          path={ROUTES.voteRound}
          element={
            <VoterLayout>
              <VoterRoundPage />
            </VoterLayout>
          }
        />
        <Route
          path={ROUTES.voteMatch}
          element={
            <VoterLayout>
              <VoteMatchPage />
            </VoterLayout>
          }
        />
        <Route
          path={ROUTES.dashboard}
          element={
            <AppShellPage allowedRoles={ORGANIZER_ROLES}>
              <DashboardPage />
            </AppShellPage>
          }
        />
        <Route
          path={ROUTES.tournaments}
          element={
            <AppShellPage allowedRoles={ORGANIZER_ROLES}>
              <TournamentListPage />
            </AppShellPage>
          }
        />
        <Route
          path={ROUTES.tournamentsNew}
          element={
            <AppShellPage allowedRoles={ORGANIZER_ROLES}>
              <TournamentCreatePage />
            </AppShellPage>
          }
        />
        <Route
          path={ROUTES.tournamentDetail}
          element={
            <AppShellPage allowedRoles={ORGANIZER_ROLES}>
              <TournamentDetailPage />
            </AppShellPage>
          }
        />
        <Route
          path={ROUTES.tournamentEdit}
          element={
            <AppShellPage allowedRoles={ORGANIZER_ROLES}>
              <TournamentEditPage />
            </AppShellPage>
          }
        />
        <Route
          path={ROUTES.tournamentParticipants}
          element={
            <AppShellPage allowedRoles={ORGANIZER_ROLES}>
              <ParticipantsPage />
            </AppShellPage>
          }
        />
        <Route
          path={ROUTES.tournamentRounds}
          element={
            <AppShellPage allowedRoles={ORGANIZER_ROLES}>
              <RoundsPage />
            </AppShellPage>
          }
        />
        <Route
          path={ROUTES.roundDetail}
          element={
            <AppShellPage allowedRoles={ORGANIZER_ROLES}>
              <RoundDetailPage />
            </AppShellPage>
          }
        />
        <Route
          path={ROUTES.roundMatches}
          element={
            <AppShellPage allowedRoles={ORGANIZER_ROLES}>
              <MatchesPage />
            </AppShellPage>
          }
        />
        <Route
          path={ROUTES.users}
          element={
            <AppShellPage allowedRoles={ADMIN_ROLES}>
              <UsersPage />
            </AppShellPage>
          }
        />
        <Route
          path={ROUTES.audit}
          element={
            <AppShellPage allowedRoles={ORGANIZER_ROLES}>
              <AuditPage />
            </AppShellPage>
          }
        />
        <Route path="*" element={<Navigate to={ROUTES.root} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
