import { Request, Response, NextFunction } from "express";
import * as courseService from "./course.service";
import { deleteOldAsset } from "./courseMedia.controller";

export {
  uploadLessonVideo,
  uploadLessonDocument,
  deleteLessonDocument,
  deleteLessonVideo,
} from "./courseMedia.controller";

function p(req: Request, key: string): string {
  return req.params[key] as string;
}

// ─── Admin course handlers ────────────────────────────────────────────────────

export async function listCoursesAdmin(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(await courseService.listCoursesAdmin());
  } catch (err) {
    next(err);
  }
}

export async function getCourseAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(await courseService.getCourseAdmin(p(req, "courseId")));
  } catch (err) {
    next(err);
  }
}

export async function createCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.status(201).json(await courseService.createCourse(req.body));
  } catch (err) {
    next(err);
  }
}

export async function updateCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(await courseService.updateCourse(p(req, "courseId"), req.body));
  } catch (err) {
    next(err);
  }
}

export async function publishCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(await courseService.publishCourse(p(req, "courseId")));
  } catch (err) {
    next(err);
  }
}

export async function unpublishCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(await courseService.unpublishCourse(p(req, "courseId")));
  } catch (err) {
    next(err);
  }
}

export async function deleteCourse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await courseService.deleteCourse(p(req, "courseId"));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

// ─── Public course handlers ───────────────────────────────────────────────────

export async function listCoursesPublic(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(await courseService.listCoursesPublic());
  } catch (err) {
    next(err);
  }
}

export async function getCoursePublic(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(await courseService.getCoursePublic(p(req, "courseId")));
  } catch (err) {
    next(err);
  }
}

// ─── Entitled Learner handler ───────────────────────────────────────────────

export async function getCourseProtected(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(await courseService.getCourseProtected(p(req, "courseId")));
  } catch (err) {
    next(err);
  }
}

// ─── Lesson handlers ─────────────────────────────────────────────────────────

export async function createLesson(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res
      .status(201)
      .json(await courseService.createLesson(p(req, "courseId"), req.body));
  } catch (err) {
    next(err);
  }
}

export async function updateLesson(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(
      await courseService.updateLesson(
        p(req, "courseId"),
        p(req, "lessonId"),
        req.body,
      ),
    );
  } catch (err) {
    next(err);
  }
}

export async function deleteLesson(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await courseService.deleteLesson(
      p(req, "courseId"),
      p(req, "lessonId"),
    );
    if (result.videoUrl) {
      await deleteOldAsset(result.videoUrl, result.videoPublicId, "video");
    }
    if (result.documents && result.documents.length > 0) {
      for (const doc of result.documents) {
        await deleteOldAsset(doc.url, doc.publicId, "raw");
      }
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function reorderLessons(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(await courseService.reorderLessons(p(req, "courseId"), req.body));
  } catch (err) {
    next(err);
  }
}

// ─── Quiz / Assignment handlers ───────────────────────────────────────────────

export async function upsertQuiz(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(
      await courseService.upsertQuiz(
        p(req, "courseId"),
        p(req, "lessonId"),
        req.body,
      ),
    );
  } catch (err) {
    next(err);
  }
}

export async function upsertAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    res.json(
      await courseService.upsertAssignment(
        p(req, "courseId"),
        p(req, "lessonId"),
        req.body,
      ),
    );
  } catch (err) {
    next(err);
  }
}
