import { Router } from "express";
import { login, logout, searchUser } from "../../middlewares/users/user.middleware";
import { authenticate, strictlyUser } from "../../utils/auth-utils";
import * as groupRouter from "../groups/group.controller";
const router = Router();

router.post(`/login`, login);
router.use(authenticate, strictlyUser);
router.get(`/search`, searchUser);
router.get(`/logout`, logout);
export = router;
