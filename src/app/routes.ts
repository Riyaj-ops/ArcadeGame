import React from "react";
import { createBrowserRouter } from "react-router";
import { LoginScreen } from "./screens/LoginScreen";
import { BootScreen } from "./screens/BootScreen";
import { SnakeScreen } from "./screens/SnakeScreen";
import { TransitionScreen } from "./screens/TransitionScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { CharacterScreen } from "./screens/CharacterScreen";
import { RepairScreen } from "./screens/RepairScreen";
import { StatusScreen } from "./screens/StatusScreen";
import { LeaderboardScreen } from "./screens/LeaderboardScreen";
import { AchievementsScreen } from "./screens/AchievementsScreen";
import { DailyChallengesScreen } from "./screens/DailyChallengesScreen";
import { MainLayout, AppWithProviders } from "./MainLayout";

export const router = createBrowserRouter([
  {
    element: React.createElement(AppWithProviders),
    children: [
      {
        path: "/",
        Component: LoginScreen,
      },
      {
        path: "/boot",
        Component: BootScreen,
      },
      {
        path: "/snake",
        Component: SnakeScreen,
      },
      {
        path: "/transition",
        Component: TransitionScreen,
      },
      {
        path: "/dashboard",
        Component: DashboardScreen,
      },
      {
        path: "/characters",
        Component: CharacterScreen,
      },
      {
        path: "/repair",
        Component: RepairScreen,
      },
      {
        path: "/status",
        Component: StatusScreen,
      },
      {
        path: "/leaderboard",
        Component: LeaderboardScreen,
      },
      {
        path: "/achievements",
        Component: AchievementsScreen,
      },
      {
        path: "/challenges",
        Component: DailyChallengesScreen,
      },
    ]
  }
]);
