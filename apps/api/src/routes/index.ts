import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import talentRoutes from "../modules/talents/talent.routes";
import companyRoutes from "../modules/companies/company.routes";
import courseRoutes from "../modules/courses/course.routes";
import adminRoutes from "../modules/admin/admin.routes";
import paymentRoutes from "../modules/payments/payment.routes";
import notificationRoutes from "../modules/notifications/notification.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/talents", talentRoutes);
router.use("/companies", companyRoutes);
router.use("/courses", courseRoutes);
router.use("/admin", adminRoutes);
router.use("/payments", paymentRoutes);
router.use("/notifications", notificationRoutes);

export default router;

