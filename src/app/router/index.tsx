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
      element: <ProtectedRoute />,
      errorElement: <RouteErrorPage />,
      children: [
        {
          element: <AppLayout />,
          errorElement: <RouteErrorPage />,
          children: [
            {
              element: <RoleGuard allowedRoles={ORGANIZER_ROLES} />,
              children: [
                {
                  path: ROUTES.dashboard,
                  lazy: async () => ({
                    Component: (await import('@/pages/dashboard/DashboardPage'))
                      .DashboardPage,
                  }),
                },
                {
                  path: ROUTES.tournaments,
                  lazy: async () => ({
                    Component: (await import('@/features/tournaments/pages/TournamentListPage'))
                      .TournamentListPage,
                  }),
                },
                {
                  path: ROUTES.tournamentsNew,
                  lazy: async () => ({
                    Component: (await import('@/features/tournaments/pages/TournamentCreatePage'))
                      .TournamentCreatePage,
                  }),
                },
                {
                  path: ROUTES.tournamentDetail,
                  lazy: async () => ({
                    Component: (await import('@/features/tournaments/pages/TournamentDetailPage'))
                      .TournamentDetailPage,
                  }),
                },
                {
                  path: ROUTES.tournamentEdit,
                  lazy: async () => ({
                    Component: (await import('@/features/tournaments/pages/TournamentEditPage'))
                      .TournamentEditPage,
                  }),
                },
                {
                  path: ROUTES.tournamentParticipants,
                  lazy: async () => ({
                    Component: (await import('@/features/participants/components/ParticipantsPage'))
                      .ParticipantsPage,
                  }),
                },
                {
                  path: ROUTES.tournamentRounds,
                  lazy: async () => ({
                    Component: (await import('@/features/rounds/components/RoundsPage'))
                      .RoundsPage,
                  }),
                },
                {
                  path: ROUTES.roundDetail,
                  lazy: async () => ({
                    Component: (await import('@/features/rounds/components/RoundDetailPage'))
                      .RoundDetailPage,
                  }),
                },
                {
                  path: ROUTES.roundMatches,
                  lazy: async () => ({
                    Component: (await import('@/features/matches/components/MatchesPage'))
                      .MatchesPage,
                  }),
                },
              ],
            },
            {
              element: <RoleGuard allowedRoles={ADMIN_ROLES} />,
              children: [
                {
                  path: ROUTES.users,
                  lazy: async () => ({
                    Component: (await import('@/features/users/pages/UsersPage'))
                      .UsersPage,
                  }),
                },
              ],
            },
            {
              element: <RoleGuard allowedRoles={ORGANIZER_ROLES} />,
              children: [
                {
                  path: ROUTES.audit,
                  lazy: async () => ({
                    Component: (await import('@/features/audit/pages/AuditPage'))
                      .AuditPage,
                  }),
                },
              ],
            },
          ],
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
