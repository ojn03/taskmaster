import { Request, Response } from "express";
import { Comment, MyQuery } from "../DB/QueryBuilder";
import { myQueryDB } from "../utils";

function deleteComment(req: Request, res: Response) {
  const comment_id = req.params.commentid;

  const deleteCommentQuery = new MyQuery<Comment>("Comment")
    .Delete()
    .Where({ comment_id });
  myQueryDB(req, res, deleteCommentQuery);
}

function updateComment(req: Request, res: Response) {
  const { comment } = req.body;

  const Query = new MyQuery<Comment>("Comment")
    .Update({ comment })
    .Where({ comment_id: req.params.commentid })
    .Returning("*");
  myQueryDB(req, res, Query);
}

export { deleteComment, updateComment };
