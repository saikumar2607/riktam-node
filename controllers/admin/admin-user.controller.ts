import { Router } from "express";
import { createUser, editUser, list } from "../../middlewares/admin/admin.middleware";
import { validateId } from "../../utils/validation-utils";
const router = Router();
router.param("id", validateId);
router.post(`/create`, createUser);
router.get(`/list`, list);
router.put(`/:id`, editUser);
export = router;
