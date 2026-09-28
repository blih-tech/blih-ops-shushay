import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotificationMenu } from "../layout/NotificationMenu";
import * as apiClient from "@blih/api-client";

vi.mock("@blih/api-client", () => ({
  getUserNotifications: vi.fn(),
  markNotificationAsRead: vi.fn(),
}));

describe("NotificationMenu Component", () => {
  const mockNotifications = [
    {
      id: "notif-1",
      type: "COURSE_ENROLLMENT_SUCCESS",
      title: "Enrolled in Next.js Masterclass",
      message: "Payment confirmed.",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "notif-2",
      type: "APPLICATION_STATUS_UPDATED",
      title: "Application Under Review",
      message: "Gebeya Tech moved your application to Reviewing.",
      read: true,
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (apiClient.getUserNotifications as any).mockResolvedValue(mockNotifications);
    (apiClient.markNotificationAsRead as any).mockResolvedValue({ success: true });
  });

  it("renders notification button and displays unread badge count", async () => {
    render(<NotificationMenu />);

    // Unread count should be 1 (since 1 notification has read: false)
    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  it("opens notification panel on click and displays notification items", async () => {
    render(<NotificationMenu />);

    const button = screen.getByRole("button", { name: /view notifications/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Enrolled in Next.js Masterclass")).toBeInTheDocument();
      expect(
        screen.getByText("Gebeya Tech moved your application to Reviewing."),
      ).toBeInTheDocument();
    });
  });

  it("allows marking unread notification as read", async () => {
    render(<NotificationMenu />);

    const button = screen.getByRole("button", { name: /view notifications/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Enrolled in Next.js Masterclass")).toBeInTheDocument();
    });

    const markReadBtn = screen.getByTitle("Mark as read");
    fireEvent.click(markReadBtn);

    expect(apiClient.markNotificationAsRead).toHaveBeenCalledWith("notif-1");
  });
});
