import { type Express } from "express";
import { Comment, MyQuery } from "../DB/QueryBuilder";
import { myQueryDB } from "../utils";
const commentRoutes = (app: Express, basePath: string = "/comments") => {
  const deleteComment = `${basePath}/:commentid`;
  // const deleteCommentQuery = 'DELETE FROM "Comment" WHERE comment_id = $1';
  app.delete(deleteComment, (req, res) => {
    const comment_id = req.params.commentid;

    const deleteCommentQuery = new MyQuery<Comment>("Comment")
      .Delete()
      .Where({ comment_id });
    myQueryDB(req, res, deleteCommentQuery);
  });

  const updateComment = `${basePath}/:commentid`;
  app.patch(updateComment, (req, res) => {
    const Query = new MyQuery<Comment>("Comment");
    const { comment } = req.body;

    Query.Update({ comment })
      .Where({ comment_id: req.params.commentid })
      .Returning("*");
    myQueryDB(req, res, Query);
  });
};
export default commentRoutes;
