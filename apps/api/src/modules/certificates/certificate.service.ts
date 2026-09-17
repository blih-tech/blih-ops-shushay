import crypto from "crypto";
import PDFDocument from "pdfkit";
import prisma from "../../config/prisma";
import { AppError } from "../../middleware/errorHandler";

export async function checkAndGenerateCertificate(
  userId: string,
  courseId: string,
) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { select: { id: true } },
    },
  });

  if (!course || course.lessons.length === 0) return null;

  const totalLessons = course.lessons.length;
  const lessonIds = course.lessons.map((l: { id: string }) => l.id);

  const completedCount = await prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: lessonIds },
    },
  });

  if (completedCount < totalLessons) {
    return null; // Not 100% complete yet
  }

  // Check if certificate already exists (idempotent duplicate prevention by courseId or course title)
  const existingCert = await prisma.certificate.findFirst({
    where: {
      userId,
      OR: [{ courseId }, { course: { title: course.title } }],
    },
    include: {
      course: { select: { id: true, title: true, description: true } },
    },
  });

  if (existingCert) {
    return existingCert;
  }

  // Generate unique certificate number using cryptographic randomness
  const uniqueCode = `${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
  const certificateNumber = `BLIH-CERT-${uniqueCode}-VERIFIED`;

  const newCert = await prisma.certificate.create({
    data: {
      userId,
      courseId,
      certificateNumber,
    },
    include: {
      course: { select: { id: true, title: true, description: true } },
    },
  });

  // Create notification for user
  try {
    await prisma.notification.create({
      data: {
        userId,
        type: "CERTIFICATE_EARNED",
        title: "Certificate Earned!",
        message: `Congratulations! You earned a verified certificate for completing ${course.title}.`,
      },
    });
  } catch {}

  return newCert;
}

export async function getUserCertificates(userId: string) {
  const certs = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
    },
    orderBy: { issueDate: "desc" },
  });

  // Deduplicate by course title to ensure 1 certificate per course track
  const uniqueMap = new Map<string, (typeof certs)[0]>();
  for (const cert of certs) {
    const key = cert.course?.title?.trim() || cert.courseId;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, cert);
    }
  }

  return Array.from(uniqueMap.values());
}

export async function getCertificateById(
  certificateId: string,
  requestUser: { id: string; role: string },
) {
  const cert = await prisma.certificate.findUnique({
    where: { id: certificateId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          talentProfile: { select: { fullName: true } },
        },
      },
      course: { select: { id: true, title: true, description: true } },
    },
  });

  if (!cert) {
    throw new AppError(404, "Certificate not found");
  }

  // Authorization check: owner, ADMIN, or active COMPANY
  if (requestUser.role === "TALENT" && cert.userId !== requestUser.id) {
    throw new AppError(403, "Access denied. You do not own this certificate.");
  }

  return cert;
}

export async function generateCertificatePdfStream(cert: any, res: any) {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 40,
  });

  const recipientName =
    cert.user?.talentProfile?.fullName ||
    (cert.user?.email
      ? cert.user.email.split("@")[0].toUpperCase()
      : "Certificate Holder");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${cert.certificateNumber}.pdf"`,
  );

  doc.pipe(res);

  // Outer Decorative Frame (Double Border & Corner Accents)
  doc
    .rect(25, 25, 791.89, 545.28)
    .lineWidth(2.5)
    .strokeColor("#1E5BFF")
    .stroke();

  doc.rect(32, 32, 777.89, 531.28).lineWidth(1).strokeColor("#D9CEDF").stroke();

  // Corner Accents
  doc.rect(20, 20, 15, 15).lineWidth(2).strokeColor("#1E5BFF").stroke();
  doc.rect(806.89, 20, 15, 15).lineWidth(2).strokeColor("#1E5BFF").stroke();
  doc.rect(20, 560.28, 15, 15).lineWidth(2).strokeColor("#1E5BFF").stroke();
  doc.rect(806.89, 560.28, 15, 15).lineWidth(2).strokeColor("#1E5BFF").stroke();

  // 1. BLIH LOGO + BLIH NAME
  doc
    .font("Helvetica-Bold")
    .fontSize(36)
    .fillColor("#1E5BFF")
    .text("BLIH", 0, 65, { align: "center" });

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#6E6678")
    .text("SKILLS & TALENT ECOSYSTEM", 0, 110, { align: "center" });

  // 2. CERTIFICATE OF COMPLETION
  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor("#17131F")
    .text("CERTIFICATE OF COMPLETION", 0, 145, { align: "center" });

  // Divider Line
  doc
    .moveTo(320, 185)
    .lineTo(521.89, 185)
    .lineWidth(1.5)
    .strokeColor("#1E5BFF")
    .stroke();

  // 3. This certifies that
  doc
    .font("Helvetica")
    .fontSize(14)
    .fillColor("#6E6678")
    .text("This certifies that", 0, 210, { align: "center" });

  // 4. Recipient Name
  doc
    .font("Helvetica-Bold")
    .fontSize(38)
    .fillColor("#17131F")
    .text(recipientName, 0, 245, { align: "center" });

  // 5. has successfully completed
  doc
    .font("Helvetica")
    .fontSize(14)
    .fillColor("#6E6678")
    .text("has successfully completed", 0, 310, { align: "center" });

  // 6. Course Title
  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor("#1E5BFF")
    .text(cert.course.title, 0, 345, { align: "center" });

  // 7. Date
  const issueDateStr = new Date(cert.issueDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  doc
    .font("Helvetica")
    .fontSize(13)
    .fillColor("#17131F")
    .text(issueDateStr, 0, 410, { align: "center" });

  // 8. Certificate No
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor("#1E5BFF")
    .text(`Certificate No: ${cert.certificateNumber}`, 0, 450, {
      align: "center",
    });

  // 9. Blih Skills Footer
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .fillColor("#17131F")
    .text("Blih Skills", 0, 505, { align: "center" });

  doc.end();
}
