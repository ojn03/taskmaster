import type { Express } from "express";
import { getCache } from "../utils";

export function roleRoutes(app: Express, base: string = "/roles") {
  const role = `${base}/:role_id`;
  //get,edit a specific role's info
  app.get("/roles/:role_id", (req, res) => {
    //TODO
    res.send("roles");
  });

  app.post("/roles/:role_id", (req, res) => {
    //TODO
    res.send("roles");
  });

  app.patch("/roles/:role_id", (req, res) => {
    //TODO
    res.send("roles");
  });
  app.delete("/roles/:role_id", (req, res) => {
    //TODO handle delete logic. make sure to delete corresponding relations w users, projects, and permisions

    res.send("roles");
  });

  //get,edit,delete permissions allowed to a role
  const rolePermissions = `${role}/permissions`;

  app.get(rolePermissions, (req, res) => {
    //TODO
    res.send("roles");
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
