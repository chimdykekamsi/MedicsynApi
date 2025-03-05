import { Router } from "express";
import createMedicationHandler from "./handlers/create";
import findAllMedicationsHandler from "./handlers/find";
import {updateMedicationsHandler} from "./handlers/update";
import {findMedicationByIdHandler, deleteMedicationHandler} from "./handlers/id";
import deserialize from "../../middleware/deserialize";
import authenticateUser from "../../middleware/authenticateUser";
import validate from "../../middleware/validate";
import { hasPerm } from "../../middleware/permission";
import { createMedicationSchema, updateMedicationSchema } from "../../validationSchema/medication";

// // Multer setup for handling file uploads
// const upload = multer({ dest: "uploads/" });

const medicationRoutes = Router();

medicationRoutes.use(deserialize);

medicationRoutes
.route("/")
.post(
    authenticateUser,
    validate(createMedicationSchema),
    createMedicationHandler
)
.get(
    authenticateUser,
    findAllMedicationsHandler
)

medicationRoutes
.route("/:medId")
.patch(
    authenticateUser,
    validate(updateMedicationSchema),
    updateMedicationsHandler
)
.get(
    authenticateUser,
    validate(updateMedicationSchema),
    findMedicationByIdHandler
)
.delete(
    authenticateUser,
    validate(updateMedicationSchema),
    deleteMedicationHandler
)

export default medicationRoutes;
