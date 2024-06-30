import type { Express } from "express";
import { QDB, getCache, myQueryDB } from "../utils";
import { MyQuery, Role } from "../DB/QueryBuilder";

export default function roleRoutes(app: Express, base: string = "/roles") {
  const role = `${base}/:role_id`;
  //get,edit a specific role's info
  app.get(role, getCache(), (req, res) => {
    //TODO
    const role_id = Number(req.params.role_id);
    const Query = new MyQuery<Role>("Role").Select().Where({ role_id });

    myQueryDB(req, res, Query);
  });

  app.post(base, (req, res) => {
    const { role_title, role_description } = req.body;
    const Query = new MyQuery<Role>("Role").Insert({
      role_title,
      role_description,
    });
    myQueryDB(req, res, Query);
  });

  app.patch(role, (req, res) => {
    const { role_id } = req.params;
    const { role_title, role_description } = req.body;
    const Query = new MyQuery<Role>("Role")
      .Update({ role_title, role_description })
      .Where({ role_id: Number(req.params.role_id) });
    myQueryDB(req, res, Query);
  });
  app.delete("/roles/:role_id", (req, res) => {
    //TODO handle delete logic. make sure to delete corresponding relations w users, projects, and permisions

    res.send("roles");
  });

  //get,edit,delete permissions allowed to a role
  //TODO fix permissions in DB and SynthDB
  const rolePermissions = `${role}/permissions`;

  //get all permissions for a given role
  const getRolePermissions =
    'select "Permission" from "Role_Permission" where role_id = $1';
  app.get(rolePermissions, (req, res) => {
    const role_id = Number(req.params.role_id);
    QDB(res, getRolePermissions, [role_id]);
  });

  app.post(rolePermissions, (req, res) => {
    //TODO
    res.send("roles");
  });

  app.patch(rolePermissions, (req, res) => {
    //TODO
    res.send("roles");
  });
}
