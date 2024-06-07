import {type Express } from "express";
import { QDB, patchDB } from "../utils";
import { Comment, MyQuery } from "../DB/QueryBuilder";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
const commentRoutes = (app: Express, basePath: string = "/comments") => {

    const deleteComment = `${basePath}/:commentid`;
    const deleteCommentQuery = 'DELETE FROM "Comment" WHERE comment_id = $1';
    app.delete(deleteComment, (req, res) => {
        const comment_id = req.params.commentid;
        const values = [comment_id];
        QDB(res, deleteCommentQuery, "", values as string[]);
    });

    const updateComment = `${basePath}/:commentid`;
    app.patch(updateComment, (req, res) => {
        const Query = new MyQuery<Comment>("Comment")
        const update = plainToClass(Comment, req.body);

        validate(update).then((errors) => {
            //TODO handle validation
        });

        Query.Update(update).Where({ comment_id: Number(req.params.commentid )});
        patchDB(res, Query);
    });
}
export default commentRoutes;