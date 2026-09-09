import {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  sendJobApplicationEmail,
  sendSubscriptionConfirmationEmail,
} from "../modules/notifications/notification.service";
import prisma from "../config/prisma";

jest.mock("../config/prisma", () => ({
  notification: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

describe("Notification Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createNotification", () => {
    it("creates an in-app notification record", async () => {
      (prisma.notification.create as jest.Mock).mockResolvedValue({
        id: "notif-1",
        userId: "user-1",
        type: "NEW_JOB_APPLICATION",
        title: "New Job Application",
        message: "A candidate has applied.",
        read: false,
      });

      const res = await createNotification({
        userId: "user-1",
        type: "NEW_JOB_APPLICATION",
        title: "New Job Application",
        message: "A candidate has applied.",
      });

      expect(res.id).toBe("notif-1");
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          type: "NEW_JOB_APPLICATION",
          title: "New Job Application",
          message: "A candidate has applied.",
        },
      });
    });
  });

  describe("getUserNotifications", () => {
    it("returns list of notifications for user sorted by date", async () => {
      (prisma.notification.findMany as jest.Mock).mockResolvedValue([
        { id: "notif-1", read: false },
        { id: "notif-2", read: true },
      ]);

      const res = await getUserNotifications("user-1");
      expect(res).toHaveLength(2);
      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("markNotificationAsRead", () => {
    it("throws 404 when notification does not exist", async () => {
      (prisma.notification.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(
        markNotificationAsRead("user-1", "non-existent"),
      ).rejects.toThrow("Notification not found");
    });

    it("throws 403 when user tries to mark another user's notification as read", async () => {
      (prisma.notification.findUnique as jest.Mock).mockResolvedValue({
        id: "notif-1",
        userId: "user-other",
      });

      await expect(markNotificationAsRead("user-1", "notif-1")).rejects.toThrow(
        "Access denied",
      );
    });

    it("marks notification read for owner user", async () => {
      (prisma.notification.findUnique as jest.Mock).mockResolvedValue({
        id: "notif-1",
        userId: "user-1",
        read: false,
      });

      (prisma.notification.update as jest.Mock).mockResolvedValue({
        id: "notif-1",
        userId: "user-1",
        read: true,
      });

      const res = await markNotificationAsRead("user-1", "notif-1");
      expect(res.read).toBe(true);
      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: "notif-1" },
        data: { read: true },
      });
    });
  });

  describe("Email notifications service helpers", () => {
    it("executes sendJobApplicationEmail cleanly", async () => {
      const res = await sendJobApplicationEmail(
        "company@example.com",
        "Frontend Dev",
        "Bikila",
      );
      expect(res.success).toBe(true);
    });

    it("executes sendSubscriptionConfirmationEmail cleanly", async () => {
      const res = await sendSubscriptionConfirmationEmail(
        "company@example.com",
        "Acme Corp",
        5000,
        "MONTHLY",
      );
      expect(res.success).toBe(true);
    });
  });
});
