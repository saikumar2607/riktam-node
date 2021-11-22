import { Router } from "express";
import { addMember, create, deleteGroup, deleteMember, edit, getMembers, list } from "../../middlewares/groups/group.middleware";
import { authenticate, strictlyUser } from "../../utils/auth-utils";
import { validateId } from "../../utils/validation-utils";
import * as messageRouter from "./messages.controller";
const router = Router();
router.use(authenticate, strictlyUser);
router.param("id", validateId);
router.post(`/create`, create);
router.get([`/list`, `/`], list);
router.put(`/:id`, edit);
router.delete(`/:id`, deleteGroup);
router.post(`/:id/add-member`, addMember);
router.post(`/:id/delete-member`, deleteMember);
router.get(`/:id/members`, getMembers);
router.use(`/:id/messages`, messageRouter);
export = router;