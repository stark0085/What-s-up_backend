import { Router } from 'express';
const router = Router()
import { signin} from '../../controllers/Authentication/signin';
import { signup } from '../../controllers/Authentication/signup';

router.get("/signin", signin)
router.post("/signup", signup)

export default router;