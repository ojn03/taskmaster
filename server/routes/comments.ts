import { type Express } from "express";
import * as commentsController from "../Controllers/commentsController";
const commentRoutes = (app: Express, basePath: string = "/comments") => {
  const comment = `${basePath}/:commentid`;

  app
    .route(comment)
    .delete(commentsController.deleteComment)
    .patch(commentsController.updateComment);
};
export default commentRoutes;
