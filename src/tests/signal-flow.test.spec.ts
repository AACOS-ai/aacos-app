/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from "@testing-library/react";
import SignalFeed from "components/SignalFeed";
import { useSignalStore } from "@/state/useSignalStore";
import React from "react";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";

jest.useFakeTimers();

describe("SignalFeed Component", () => {
  beforeEach(() => {
    useSignalStore.getState().clear();
    jest.clearAllTimers();
  });

  it("renders the first signal correctly", () => {
    render(<SignalFeed />);
    expect(
      screen.getByText("🟣 Signal: Consciousness Pulse Detected")
    ).toBeInTheDocument();
  });

  it("advances to next signal after timeout", async () => {
    render(<SignalFeed />);
    act(() => {
      jest.advanceTimersByTime(45000);
    });
    await waitFor(() => {
      expect(
        screen.getByText("🔵 Sync: Field Bridge Connected")
      ).toBeInTheDocument();
    });
  });

  it("adds signals to history in store", async () => {
    render(<SignalFeed />);
    act(() => {
      jest.advanceTimersByTime(45000);
      jest.advanceTimersByTime(50000);
    });

    await waitFor(() => {
      const history = useSignalStore.getState().history;
      expect(history.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("limits signal history to 20 entries", async () => {
    render(<SignalFeed />);
    for (let i = 0; i < 25; i++) {
      act(() => {
        jest.advanceTimersByTime(45000);
      });
    }

    await waitFor(() => {
      const history = useSignalStore.getState().history;
      expect(history.length).toBeLessThanOrEqual(20);
    });
  });

  it("shows warning popup if server returns warning", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            success: true,
            warning: "slow-down",
            message: "Please wait a moment.",
          }),
      })
    ) as jest.Mock;

    render(<SignalFeed />);
    act(() => {
      jest.advanceTimersByTime(45000);
    });

    await waitFor(() => {
      expect(
        screen.getByText("⚠️ Please wait a moment.")
      ).toBeInTheDocument();
    });
  });
});
