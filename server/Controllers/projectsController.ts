import type { Request, Response } from "express";
import { MyQuery, Project } from "../DB/QueryBuilder";
import { myQueryDB } from "../utils";

function getProjectInfo(req: Request, res: Response) {
  const proj_id = req.params.projid;
  const query = new MyQuery<Project>("Project").Select("*").Where({ proj_id });
  myQueryDB(req, res, query);
}

function UpdateProjectInfo(req: Request, res: Response) {
  const { proj_name, proj_description } = req.body;
  const proj_id = req.params.projid;
  const updateProjectQuery = new MyQuery<Project>("Project")
    .Update({ proj_name, proj_description })
    .Where({ proj_id })
    .Returning("*");
  myQueryDB<Project>(req, res, updateProjectQuery);
}

function getProjectHistory(req: Request, res: Response) {
  const proj_id = req.params.projid;
  const query = new MyQuery<History>("History").Select("*").Where({ proj_id });
  myQueryDB(req, res, query);
}

export { UpdateProjectInfo, getProjectInfo };
