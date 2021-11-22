import { Router } from "express";
import { create, deleteMessage, dislikeMessage, likeMessage, list, undoDislike, undoLike } from "../../middlewares/groups/messages.middleware";
import { validateId } from "../../utils/validation-utils";
const router = Router();

router.param("message_id", validateId);
router.post(`/send`, create);
router.get([`/list`, `/`], list);
router.get(`/:message_id/unsend`, deleteMessage);
router.get(`/:message_id/like`, likeMessage);
router.get(`/:message_id/undo-like`, undoLike);
router.get(`/:message_id/dislike`, dislikeMessage);
router.get(`/:message_id/undo-dislike`, undoDislike);

export = router;