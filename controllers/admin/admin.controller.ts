import { Router } from "express";
import { login, logout } from "../../middlewares/admin/admin.middleware";
import { authenticate, strictlyAdmin } from "../../utils/auth-utils";
import * as userAdminRouter from "./admin-user.controller";
const router = Router();

router.post(`/login`, login);
router.use(authenticate, strictlyAdmin);
router.get(`/logout`, logout);
router.use(`/users`, userAdminRouter);
export = router;
