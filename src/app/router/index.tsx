import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { AuthLayout } from '@/components/layout/AuthLayout'
import { AppLayout } from '@/components/layout/AppLayout'
import { VoterLayout } from '@/components/layout/VoterLayout'
import { RouteErrorPage } from '@/components/feedback/RouteErrorPage'
import { ProtectedRoute, RoleGuard } from '@/app/router/guards'
import { ORGANIZER_ROLES, ADMIN_ROLES } from '@/core/constants/roles'
import { ROUTES } from '@/core/constants/routes'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
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
import type { Role } from '@/core/constants/roles'
import type { PropsWithChildren } from 'react'

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
  const router = createBrowserRouter([
    {
      path: ROUTES.root,
      lazy: async () => ({
        Component: (await import('@/pages/public/HomePage')).HomePage,
      }),
      errorElement: <RouteErrorPage />,
    },
    {
      element: <AuthLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        { path: ROUTES.login, element: <LoginPage /> },
        { path: ROUTES.register, element: <RegisterPage /> },
      ],
    },
    {
      element: <VoterLayout />,
      errorElement: <RouteErrorPage />,
      children: [
        {
          path: ROUTES.voteHome,
          lazy: async () => ({
            Component: (await import('@/pages/voter/VoterHomePage')).VoterHomePage,
          }),
        },
        {
          path: ROUTES.voteTournaments,
          lazy: async () => ({
            Component: (await import('@/features/votes/components/VoterTournamentListPage'))
              .VoterTournamentListPage,
          }),
        },
        {
          path: ROUTES.voteTournament,
          lazy: async () => ({
            Component: (await import('@/features/votes/components/VoterTournamentDetailPage'))
              .VoterTournamentDetailPage,
          }),
        },
        {
          path: ROUTES.voteRound,
          lazy: async () => ({
            Component: (await import('@/features/votes/components/VoterRoundPage'))
              .VoterRoundPage,
          }),
        },
        {
          path: ROUTES.voteMatch,
          lazy: async () => ({
            Component: (await import('@/features/votes/components/VoteMatchPage'))
              .VoteMatchPage,
          }),
        },
      ],
    },
    {
      path: ROUTES.dashboard,
      element: (
        <AppShellPage allowedRoles={ORGANIZER_ROLES}>
          <DashboardPage />
        </AppShellPage>
      ),
      errorElement: <RouteErrorPage />,
    },
    {
      path: ROUTES.tournaments,
      element: (
        <AppShellPage allowedRoles={ORGANIZER_ROLES}>
          <TournamentListPage />
        </AppShellPage>
      ),
      errorElement: <RouteErrorPage />,
    },
    {
      path: ROUTES.tournamentsNew,
      element: (
        <AppShellPage allowedRoles={ORGANIZER_ROLES}>
          <TournamentCreatePage />
        </AppShellPage>
      ),
      errorElement: <RouteErrorPage />,
    },
    {
      path: ROUTES.tournamentDetail,
      element: (
        <AppShellPage allowedRoles={ORGANIZER_ROLES}>
          <TournamentDetailPage />
        </AppShellPage>
      ),
      errorElement: <RouteErrorPage />,
    },
    {
      path: ROUTES.tournamentEdit,
      element: (
        <AppShellPage allowedRoles={ORGANIZER_ROLES}>
          <TournamentEditPage />
        </AppShellPage>
      ),
      errorElement: <RouteErrorPage />,
    },
    {
      path: ROUTES.tournamentParticipants,
      element: (
        <AppShellPage allowedRoles={ORGANIZER_ROLES}>
          <ParticipantsPage />
        </AppShellPage>
      ),
      errorElement: <RouteErrorPage />,
    },
    {
      path: ROUTES.tournamentRounds,
      element: (
        <AppShellPage allowedRoles={ORGANIZER_ROLES}>
          <RoundsPage />
        </AppShellPage>
      ),
      errorElement: <RouteErrorPage />,
    },
    {
      path: ROUTES.roundDetail,
      element: (
        <AppShellPage allowedRoles={ORGANIZER_ROLES}>
          <RoundDetailPage />
        </AppShellPage>
      ),
      errorElement: <RouteErrorPage />,
    },
    {
      path: ROUTES.roundMatches,
      element: (
        <AppShellPage allowedRoles={ORGANIZER_ROLES}>
          <MatchesPage />
        </AppShellPage>
      ),
      errorElement: <RouteErrorPage />,
    },
    {
      path: ROUTES.users,
      element: (
        <AppShellPage allowedRoles={ADMIN_ROLES}>
          <UsersPage />
        </AppShellPage>
      ),
      errorElement: <RouteErrorPage />,
    },
    {
      path: ROUTES.audit,
      element: (
        <AppShellPage allowedRoles={ORGANIZER_ROLES}>
          <AuditPage />
        </AppShellPage>
      ),
      errorElement: <RouteErrorPage />,
    },
  ])

  return <RouterProvider router={router} />
}
