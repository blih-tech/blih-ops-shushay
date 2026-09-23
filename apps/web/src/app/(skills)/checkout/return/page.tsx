"use client";
import { getErrorMessage } from "@blih/api-client";

import React, { useEffect, useState, Suspense } from "react";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { Button, Card, Alert } from "@blih/ui";
import { verifyPayment } from "@blih/api-client";

function ReturnContent() {
  const searchParams = useSearchParams();
  const txRef = searchParams.get("tx_ref") || searchParams.get("txRef");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [courseName, setCourseName] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!txRef) {
      setLoading(false);
      setErrorMessage(
        "No transaction reference provided in payment return URL.",
      );
      return;
    }

    verifyPayment(txRef)
      .then((res) => {
        if (res.verified) {
          setSuccess(true);
          const name = res.enrollment?.course?.title || null;
          const id = res.enrollment?.courseId || res.enrollment?.course?.id || null;
          setCourseName(name);
          setCourseId(id);
        } else {
          setErrorMessage(res.message || "Payment verification failed.");
        }
      })
      .catch((err) => {
        setErrorMessage(getErrorMessage(err) || "Payment verification failed.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [txRef]);

  const statusParam = searchParams.get("status");
  const isCanceled = statusParam === "canceled" || statusParam === "cancelled";
  const isPending = errorMessage?.toLowerCase().includes("pending");

  const handleReverify = async () => {
    if (!txRef) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await verifyPayment(txRef);
      if (res.verified) {
        setSuccess(true);
        const name = res.enrollment?.course?.title || null;
        const id = res.enrollment?.courseId || res.enrollment?.course?.id || null;
        setCourseName(name);
        setCourseId(id);
      } else {
        setErrorMessage(res.message || "Payment verification failed.");
      }
    } catch (err: unknown) {
      setErrorMessage(getErrorMessage(err) || "Payment verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBFD] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      {/* Dynamic Background Mesh Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#1E5BFF]/10 via-[#FF8A5B]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-lg relative z-10">
        {loading ? (
          <Card className="p-10 text-center bg-white/90 backdrop-blur-xl border border-[#D9CEDF] shadow-[0_16px_48px_rgba(23,19,31,0.06)] rounded-3xl space-y-4">
            <div className="w-16 h-16 bg-[#EEF3FF] rounded-2xl flex items-center justify-center mx-auto border border-[#C5D7FF]">
              <Loader2 className="w-8 h-8 text-[#1E5BFF] animate-spin" />
            </div>
            <h2 className="font-display text-2xl font-bold text-[#17131F]">
              Verifying Your Payment
            </h2>
            <p className="text-[#6E6678] text-sm leading-relaxed max-w-sm mx-auto">
              Establishing secure server-side verification with Chapa payment
              gateway...
            </p>
          </Card>
        ) : success ? (
          <Card className="p-8 sm:p-10 text-center bg-white/95 backdrop-blur-2xl border border-[#D9CEDF] shadow-[0_20px_50px_rgba(30,91,255,0.08)] rounded-3xl space-y-6">
            {/* Animated Success Badge */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-[#E8F8F0] rounded-full animate-ping opacity-30" />
              <div className="w-20 h-20 bg-gradient-to-b from-[#E8F8F0] to-[#C8F2DD] rounded-full flex items-center justify-center border border-[#9EE2BF] shadow-sm relative z-10">
                <CheckCircle2 className="w-11 h-11 text-[#00A859]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EEF3FF] border border-[#C5D7FF] rounded-full text-xs font-semibold text-[#1E5BFF]">
                <ShieldCheck className="w-4 h-4 shrink-0 text-[#1E5BFF]" />
                <span>Course Enrollment Confirmed</span>
              </div>

              <h1 className="font-display text-3xl font-bold tracking-tight text-[#17131F]">
                You&apos;re Enrolled!
              </h1>
              <p className="text-[#6E6678] text-sm leading-relaxed max-w-md mx-auto">
                {courseName
                  ? <>Your payment has been verified. You now have full access to <strong className="text-[#17131F]">{courseName}</strong>.</>  
                  : "Your payment has been verified. You now have full access to this course."}
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-[#F8F6FA] border border-[#E8E1EE] rounded-2xl p-5 text-left space-y-3.5">
              {courseName && (
                <div className="flex justify-between items-center text-xs text-[#6E6678]">
                  <span>Course</span>
                  <span className="font-semibold text-[#17131F] text-right max-w-[200px] truncate">{courseName}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs text-[#6E6678]">
                <span>Amount Paid</span>
                <span className="font-bold text-[#17131F]">1,000 ETB</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#6E6678]">
                <span>Payment Gateway</span>
                <span className="font-mono text-[#1E5BFF] font-semibold">
                  Chapa Gateway
                </span>
              </div>
              {txRef && (
                <div className="flex justify-between items-center text-xs text-[#6E6678] pt-2 border-t border-[#E8E1EE]">
                  <span>Transaction Ref</span>
                  <span className="font-mono text-[11px] text-[#4E4656] truncate max-w-[200px]">
                    {txRef}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-[#E8E1EE] space-y-2">
                <span className="font-mono text-[11px] font-bold text-[#17131F] uppercase tracking-wider block">
                  Unlocked Capabilities:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#4E4656]">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A859] shrink-0" />
                    <span>This Course Access</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A859] shrink-0" />
                    <span>Project Workspace</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A859] shrink-0" />
                    <span>Assessment Path</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00A859] shrink-0" />
                    <span>Certificate Eligibility</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              {courseId ? (
                <Link href={`/courses/${courseId}/learn`} className="w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={<BookOpen className="w-5 h-5 shrink-0" />}
                    rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
                  >
                    Start Learning Now
                  </Button>
                </Link>
              ) : (
                <Link href="/courses" className="w-full">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={<BookOpen className="w-5 h-5 shrink-0" />}
                    rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
                  >
                    Go to Courses
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ) : isPending ? (
          <Card className="p-8 sm:p-10 text-center bg-white/95 backdrop-blur-2xl border border-[#FFE8A3] shadow-[0_20px_50px_rgba(245,158,11,0.08)] rounded-3xl space-y-6">
            <div className="w-20 h-20 bg-[#FFFBEB] rounded-full flex items-center justify-center mx-auto border border-[#FCD34D]">
              <Loader2 className="w-10 h-10 text-[#D97706] animate-spin" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#17131F]">
                Payment Processing in Progress
              </h1>
              <p className="text-[#6E6678] text-sm leading-relaxed">
                Your payment is currently being confirmed by Chapa or your
                mobile bank operator. Please complete any pending steps on your
                device.
              </p>
            </div>

            <Alert
              variant="info"
              className="text-left text-xs bg-[#FFFBEB] border-[#FCD34D] text-[#B45309]"
            >
              {errorMessage}
            </Alert>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleReverify}
                rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
              >
                Check Verification Status Again
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-8 sm:p-10 text-center bg-white/95 backdrop-blur-2xl border border-[#D9CEDF] shadow-[0_20px_50px_rgba(239,68,68,0.08)] rounded-3xl space-y-6">
            <div className="w-20 h-20 bg-[#FDF2F2] rounded-full flex items-center justify-center mx-auto border border-[#F8C8C8]">
              <XCircle className="w-11 h-11 text-[#EF4444]" />
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#17131F]">
                {isCanceled
                  ? "Payment Canceled"
                  : "Payment Could Not Be Completed"}
              </h1>
              <p className="text-[#6E6678] text-sm leading-relaxed">
                {isCanceled
                  ? "You canceled the transaction session on Chapa. No charge was made and your course access remains reserved."
                  : "The payment was not confirmed. No charge was made and your course access remains reserved."}
              </p>
            </div>

            {errorMessage && (
              <Alert variant="error" className="text-left text-xs">
                {errorMessage}
              </Alert>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/courses" className="w-full">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  rightIcon={<ArrowRight className="w-4 h-4 shrink-0" />}
                >
                  Retry Payment → Choose Payment Method
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function CheckoutReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1E5BFF]" />
        </div>
      }
    >
      <ReturnContent />
    </Suspense>
  );
}
